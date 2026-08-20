import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as postService from "@service/post-service.js";
import { CreatePostValidator } from "@packages/shared/dto/post-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";

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
