import type { Request, Response } from "express";
import HttpStatusCode from "@packages/shared/util/http-status-code.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import {
  CreateCommentValidator,
  UpdateCommentValidator,
} from "@packages/shared/dto/comment-dto.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as commentService from "@service/comment-service.js";
import { ApiResponse } from "@common/api-response.js";

export async function createComment(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await CreateCommentValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
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

  const comment = await commentService.createComment(profileUid, postId, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Comment created successfully", comment));
}

export async function updateComment(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await UpdateCommentValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
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

  const commentId = req.params.commentId;

  if (!commentId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Comment ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof commentId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Comment ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const commentFromDb = await commentService.updateComment(
    profileUid,
    commentId,
    data,
  );

  return res
    .status(HttpStatusCode.CREATED)
    .json(ApiResponse.created("Comment updated successfully", commentFromDb));
}

export async function deleteComment(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const commentId = req.params.commentId;

  if (!commentId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Comment ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof commentId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Comment ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const commentFromDb = await commentService.deleteComment(
    profileUid,
    commentId,
  );

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Comment deleted successfully", commentFromDb));
}
