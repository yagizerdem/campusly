import type { CreatePostDto } from "@packages/shared/dto/post-dto.js";
import * as profileService from "@service/profile-service.js";
import * as clubService from "@service/club-service.js";
import * as imageService from "@service/image-service.js";
import { prisma } from "@lib/prisma.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { firebaseApp } from "@src/firebase.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import HttpStatusCode from "@packages/shared/util/http-status-code.js";

export async function createPost(
  profileUid: string,
  dto: CreatePostDto,
  files: Express.Multer.File[],
) {
  const profile = await profileService.ensureProfileExistbyUid(profileUid);
  const club = await clubService.ensureClubExistById(dto.clubId);
  await clubService.ensureUserIsClubAdmin(profileUid, dto.clubId);

  // check mime types of files
  for (const file of files) {
    imageService.throwIfNotAllowedImageMimeType(file.mimetype);
  }

  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  // upload files to firebase storage
  const uploadedResponses = await Promise.all(
    files.map(async (file) => {
      return await bucket.upload(file.path, {
        destination: `post-images/${file.filename}`,
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

  // create post
  const post = await prisma.post.create({
    data: {
      postContent: dto.postContent,
      postTitle: dto.postTitle,
      clubId: club.id,
    },
  });

  // create post images in db
  const imageData = await Promise.all(
    uploadedResponses.map(async (response, i) => ({
      imageUri: await getDownloadURL(response[0]),
      fileName: files[i]!.filename,
      bucketName: bucket.name,
      mimeType: files[i]!.mimetype,
    })),
  );

  const downloadUrls = await Promise.all(
    uploadedResponses.map(async (response) => {
      const file = response[0];
      return await getDownloadURL(file);
    }),
  );

  const imageEntities = await Promise.all(
    files.map((file, i) =>
      prisma.image.create({
        data: {
          bucketName: bucket.name,
          fileName: file.filename,
          imageUri: downloadUrls[i]!,
          mimeType: file.mimetype,
        },
      }),
    ),
  );

  // associate images with the post
  for (const imageEntity of imageEntities) {
    await prisma.postImage.create({
      data: {
        imageId: imageEntity.id,
        postId: post.id,
      },
    });
  }

  return post;
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
