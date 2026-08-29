import type { Request, Response } from "express";
import fs from "fs/promises";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as postService from "@service/post-service.js";
import {
  CreatePostValidator,
  UpdatePostValidator,
  type FetchPostFeedResponse,
} from "@campusly/shared/src/dto/post-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import type { QueryString } from "@common/prisma-api-features.js";

export async function createPost(req: Request, res: Response) {
  try {
    const adminUid = req.uid!;
    throwIfUidNotExist(req);

    const { success, data, error } = await CreatePostValidator.safeParseAsync(
      req.body,
    );

    if (!success) {
      console.error("Validation error:", error.issues);
      throw AppError.from({
        machineCode: ErrorMachineCode.VALIDATION_ERROR,
        message: "Validation error",
        statusCode: HttpStatusCode.BAD_REQUEST,
        isOperational: true,
        diagnostic: {
          path: req.path,
          details: error.issues.map((issue) => ({
            machineCode: ErrorMachineCode.VALIDATION_ERROR,
            message: `${issue.path.join(".")}: ${issue.message}`,
          })),
        },
      });
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

  const postId = req.params.postId;
  if (!postId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Post ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof postId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Post ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

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
    console.error("Validation error:", error.issues);
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Validation error",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
      diagnostic: {
        path: req.path,
        details: error.issues.map((issue) => ({
          machineCode: ErrorMachineCode.VALIDATION_ERROR,
          message: `${issue.path.join(".")}: ${issue.message}`,
        })),
      },
    });
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

  const [posts, coverImageSignedUrls] =
    await postService.fetchPostsForFeed(queryObject);

  // map to dto

  if (!Array.isArray(posts)) {
    return res
      .status(HttpStatusCode.OK)
      .json(ApiResponse.ok("Posts retrieved successfully", []));
  }

  const fetchedPosts: FetchPostFeedResponse = posts.map((post) => {
    return {
      authorId: post.authorId,
      clubId: post.clubId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      postContent: post.postContent,
      postId: post.id,
      postTitle: post.postTitle,
      commentCount: post._count.comments,
      likesCount: post._count.likes,
      coverImageSignedUrl: !Array.isArray(coverImageSignedUrls)
        ? ((coverImageSignedUrls as Record<string, string | null>)[post.id] ??
          null)
        : null,
      images: post.images.map((img) => {
        return {
          order: img.order,
          imageId: img.imageId,
        } as {
          order: number;
          imageId: string;
        };
      }),
    };
  });

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Posts retrieved successfully", fetchedPosts));
}
