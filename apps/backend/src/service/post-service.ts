import type {
  CreatePostDto,
  UpdatePostDto,
  PostIdWithCoverImageSignedUrl,
} from "@campusly/shared/src/dto/post-dto.js";
import * as profileService from "@service/profile-service.js";
import * as clubService from "@service/club-service.js";
import * as imageService from "@service/image-service.js";
import { prisma } from "@lib/prisma.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { firebaseApp } from "@src/firebase.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import type { Image, Post } from "@src/generated/prisma/client.js";
import { withRetry } from "@lib/retry.js";
import {
  PrismaAPIFeatures,
  type QueryString,
} from "@common/prisma-api-features.js";
import { minutesToSeconds } from "date-fns";

const BUCKET_UPLOAD_DIR = "post-images";

export async function createPost(
  profileUid: string,
  dto: CreatePostDto,
  files: Express.Multer.File[],
) {
  const profile = await profileService.ensureProfileExistbyUid(profileUid);
  if (dto.clubId) {
    await clubService.ensureClubExistById(dto.clubId);
    await clubService.ensureUserIsClubAdmin(profileUid, dto.clubId);
  }

  // check mime types of files
  for (const file of files) {
    imageService.throwIfNotAllowedImageMimeType(file.mimetype);
  }

  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  try {
    // upload files to firebase storage
    const uploadedResponses = await Promise.allSettled(
      files.map(async (file) => {
        return await bucket.upload(file.path, {
          destination: `${BUCKET_UPLOAD_DIR}/${file.filename}`,
          metadata: {
            contentType: file.mimetype,
          },
        });
      }),
    );

    if (files.length !== uploadedResponses.length) {
      throw AppError.from({
        machineCode: ErrorMachineCode.INTERNAL_ERROR,
        message: "Uploaded file count does not match upload response count.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        isOperational: false,
        diagnostic: {
          path: "/service/post-service.ts",
          details: [
            {
              machineCode: ErrorMachineCode.INTERNAL_ERROR,
              message: `files=${files.length}, uploadedResponses=${uploadedResponses.length}`,
            },
          ],
        },
      });
    }

    uploadedResponses.forEach((response, index) => {
      if (response.status === "rejected") {
        throw AppError.from({
          machineCode: ErrorMachineCode.INTERNAL_ERROR,
          message: `File upload failed for file ${files.at(index)?.filename}`,
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
          isOperational: false,
          diagnostic: {
            path: "/service/post-service.ts",
            details: [
              {
                machineCode: ErrorMachineCode.INTERNAL_ERROR,
                message: response.reason,
              },
            ],
          },
        });
      }
    });

    return await prisma.$transaction<Post>(async (tx) => {
      // create post
      const post = await tx.post.create({
        data: {
          postContent: dto.postContent,
          postTitle: dto.postTitle,
          clubId: dto.clubId ?? null,
          authorId: profile.id,
        },
      });

      // create post images in db

      const downloadUrls = await Promise.all(
        uploadedResponses.map(async (response) => {
          if (response.status === "fulfilled") {
            const file = response.value[0];
            return await getDownloadURL(file);
          } else {
            throw AppError.from({
              machineCode: ErrorMachineCode.INTERNAL_ERROR,
              message: "File upload failed",
              statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
              isOperational: false,
              diagnostic: {
                path: "/service/post-service.ts",
                details: [
                  {
                    machineCode: ErrorMachineCode.INTERNAL_ERROR,
                    message: response.reason,
                  },
                ],
              },
            });
          }
        }),
      );

      const imageEntities = await Promise.all(
        files.map((file, i) =>
          tx.image.create({
            data: {
              bucketName: bucket.name,
              fileName: file.filename,
              imageUri: downloadUrls[i]!,
              mimeType: file.mimetype,
              sizeInBytes: file.size,
              objectKey: `${BUCKET_UPLOAD_DIR}/${file.filename}`,
            },
          }),
        ),
      );

      // associate images with the post
      for (const imageEntity of imageEntities) {
        await tx.postImage.create({
          data: {
            imageId: imageEntity.id,
            postId: post.id,
          },
        });
      }

      return post;
    });
  } catch (error) {
    await Promise.allSettled(
      files.map((file) => {
        return bucket.file(`${BUCKET_UPLOAD_DIR}/${file.filename}`).delete();
      }),
    );

    throw error;
  }
}

export async function ensurePostExistById(postId: string) {
  const postEntity = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!postEntity) {
    throw AppError.from({
      machineCode: ErrorMachineCode.POST_NOT_FOUND,
      message: "Post not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
  return postEntity;
}

export function getPostById(postId: string, throwErrorIfNotFound = false) {
  if (throwErrorIfNotFound) {
    return ensurePostExistById(postId);
  }

  return prisma.post.findFirst({
    where: {
      id: postId,
    },
  });
}

export async function deletePostById(userUid: string, postId: string) {
  const post = await ensurePostExistById(postId);
  if (post.clubId) {
    await clubService.ensureUserIsClubAdmin(userUid, post.clubId);
  } else {
    // if post is not associated with a club, check if the user is the author of the post
    if (post.authorId !== userUid) {
      throw AppError.from({
        machineCode: ErrorMachineCode.UNAUTHORIZED,
        message: "User is not authorized to delete this post",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        isOperational: true,
      });
    }
  }

  let images: Image[] = [];
  try {
    images = await prisma.$transaction(async (tx) => {
      const postImages = await tx.postImage.findMany({
        where: { postId: post.id },
        include: {
          image: true,
        },
      });

      const images = postImages.map((postImage) => postImage.image);

      await tx.postImage.deleteMany({
        where: { postId: post.id },
      });

      await tx.image.deleteMany({
        where: {
          id: {
            in: images.map((image) => image.id),
          },
        },
      });

      await tx.post.delete({
        where: { id: post.id },
      });

      return images;
    });

    const bucket = getStorage(firebaseApp).bucket();

    const deleteResults = await Promise.allSettled(
      images.map((image) =>
        bucket.file(image.objectKey).delete({
          ignoreNotFound: true,
        }),
      ),
    );

    const failedImages = deleteResults.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return [];
      }

      return [images[index]!];
    });

    if (failedImages.length > 0) {
      try {
        await withRetry(
          () =>
            Promise.allSettled(
              failedImages.map((image) =>
                bucket.file(image.objectKey).delete({
                  ignoreNotFound: true,
                }),
              ),
            ),
          {
            maxAttempts: 3,
            baseMs: 100,
            capMs: 30_000,
          },
        );
      } catch (error) {
        // POST is already deleted from DB, but some images failed to delete from Firebase Storage
        return images;
      }
    }

    return images;
  } catch (error) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INTERNAL_ERROR,
      message: "Failed to delete post and associated images",
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      isOperational: false,
      diagnostic: {
        path: "/service/post-service.ts",
        details: [
          {
            machineCode: ErrorMachineCode.INTERNAL_ERROR,
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      },
    });
  }
}

export async function updatePost(userUid: string, dto: UpdatePostDto) {
  const post = await ensurePostExistById(dto.postId);
  //  check user is club admin
  if (dto.clubId) {
    await clubService.ensureUserIsClubAdmin(userUid, dto.clubId);
  } else {
    // if post is not associated with a club, check if the user is the author of the post
    if (post.authorId !== userUid) {
      throw AppError.from({
        machineCode: ErrorMachineCode.UNAUTHORIZED,
        message: "User is not authorized to update this post",
        statusCode: HttpStatusCode.UNAUTHORIZED,
        isOperational: true,
      });
    }
  }

  // check post belongs to the club
  if (post.clubId != dto.clubId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Post does not belong to the specified club",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const postFromDb = await prisma.post.update({
    where: {
      id: dto.postId,
    },
    data: {
      postTitle: dto.postTitle,
      postContent: dto.postContent,
    },
  });

  return postFromDb;
}

export async function fetchPostsForFeed(queryObject: QueryString) {
  const apiFeatures = new PrismaAPIFeatures(queryObject);

  const builtQuery = apiFeatures.paginate().sort().filter().build();

  const { select: _unusedSelect, ...prismaQuery } = builtQuery;

  const posts = await prisma.post.findMany({
    ...prismaQuery,

    select: {
      id: true,
      authorId: true,
      postTitle: true,
      postContent: true,
      clubId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      author: {
        select: {
          profileImageId: true,
        },
      },
      club: {
        select: {
          clubLogoId: true,
        },
      },
      images: {
        orderBy: {
          order: "asc",
        },
        select: {
          imageId: true,
          order: true,
        },
      },
    },
  });

  const coverImageSignedUrls: PostIdWithCoverImageSignedUrl = {}; // post-id - cover-img uri

  await Promise.allSettled(
    posts.map(async (post) => {
      if (post?.images && post.images.length > 0) {
        const coverImageId = post.images[0]!.imageId;
        const signedUrl = await imageService.generateSignedUrlByImageId(
          coverImageId,
          minutesToSeconds(15), // 15 minutes
        );
        coverImageSignedUrls[post.id] = signedUrl;
      }
    }),
  );

  return [posts, coverImageSignedUrls];
}

export async function fetchPostGalleryImages(postId: string) {
  const post = await ensurePostExistById(postId);

  const postImages = await prisma.postImage.findMany({
    where: {
      postId: post.id,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      postId: true,
      order: true,
      image: true,
    },
  });

  const result: Record<string, string[]> = {}; // image-id - signed-urls

  await Promise.allSettled(
    postImages.map(async (postImage) => {
      const signedUrl = await imageService.generateSignedUrl(
        postImage.image,
        minutesToSeconds(15), // 15 minutes
      );

      if (!result[postId]) {
        result[postId] = [];
      }

      result[postId].push(signedUrl);
    }),
  );
  return result;
}
