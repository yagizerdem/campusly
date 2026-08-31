import type { Request, Response } from "express";
import fs from "fs/promises";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as postService from "@service/post-service.js";
import * as imageService from "@service/image-service.js";
import {
  CreatePostValidator,
  UpdatePostValidator,
  type FetchPostFeedItem,
  type FetchPostFeedResponse,
  type OrderedPostImage,
} from "@campusly/shared/src/dto/post-dto.js";
import type { QueryString } from "@common/prisma-api-features.js";
import {
  throwValidationError,
  getRequiredRouteParam,
} from "@common/route-validation.js";
import { minutesToSeconds } from "date-fns";

export async function createPost(req: Request, res: Response) {
  try {
    const adminUid = req.uid!;

    throwIfUidNotExist(req);

    const { success, data, error } = await CreatePostValidator.safeParseAsync(
      req.body,
    );

    if (!success) {
      throwValidationError(req, error.issues);
    }

    const files = req.files as Express.Multer.File[];
    const post = await postService.createPost(adminUid, data, files);

    return res
      .status(HttpStatusCode.OK)
      .json(ApiResponse.ok("Post created successfully", post));
  } finally {
    // Clean up uploaded files from the server after processing
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Error deleting file ${file.path}:`, err);
        }
      }
    }
  }
}

export async function deletePost(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);
  const postId = getRequiredRouteParam(req.params.postId, "postId");

  await postService.deletePostById(adminUid, postId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Post deleted successfully"));
}

export async function updatePost(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await UpdatePostValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
    throwValidationError(req, error.issues);
  }

  const postFromDb = await postService.updatePost(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Post updated successfully", postFromDb));
}

export async function fetchFeedPosts(req: Request, res: Response) {
  const userUid = req.uid;
  const isLoggedIn = !!userUid;

  const queryObject: QueryString = req.query as QueryString;

  const [posts, postImageSignedUrls] =
    await postService.fetchPostsForFeed(queryObject);

  // map to dto

  if (!Array.isArray(posts)) {
    return res
      .status(HttpStatusCode.OK)
      .json(ApiResponse.ok("Posts retrieved successfully", []));
  }

  const fetchedPosts: FetchPostFeedResponse = (
    await Promise.allSettled(
      posts.map(async (post) => {
        // if club has logo fetch signed url
        let signedUrl = null;
        if (post.clubId && post.club?.clubLogoId) {
          signedUrl = await imageService.generateSignedUrlByImageId(
            post.club.clubLogoId,
            minutesToSeconds(15),
          );
        } else if (post.authorId && post.author?.profileImageId) {
          signedUrl = await imageService.generateSignedUrlByImageId(
            post.author.profileImageId,
            minutesToSeconds(15),
          );
        }

        const response = {
          authorId: post.authorId,
          clubId: post.clubId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          postContent: post.postContent,
          postId: post.id,
          postTitle: post.postTitle,
          commentCount: post._count.comments,
          likesCount: post._count.likes,
          images: post.images.map((img) => {
            return {
              imageId: img.imageId,
              order: img.order,
              signedUrl: postImageSignedUrls[post.id]?.find(
                (urlObj) => urlObj.imageId === img.imageId,
              )?.signedUrl,
            } as OrderedPostImage;
          }),
        } as FetchPostFeedItem;

        if (post.clubId && post.club?.clubLogoId) {
          response.clubLogoSignedUrl = signedUrl;
        } else if (post.authorId && post.author?.profileImageId) {
          response.profileImageSignedUrl = signedUrl;
        }
        return response;
      }),
    )
  )
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((item) => item != null);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Posts retrieved successfully", fetchedPosts));
}

export async function fetchPostGalleryImages(req: Request, res: Response) {
  const postId = getRequiredRouteParam(req.params.postId, "postId");
  const images = await postService.fetchPostGalleryImages(postId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Post gallery images retrieved successfully", images));
}
