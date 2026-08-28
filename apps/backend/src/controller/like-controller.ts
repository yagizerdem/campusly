import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as likeService from "@service/like-service.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";

export async function likePost(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const profileId = req.uid!;
  const postId = req.params.postId as string;

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

  const like = await likeService.createLike(profileId, postId);

  res.status(HttpStatusCode.OK).json(ApiResponse.success(like));
}

export async function unlikePost(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const profileId = req.uid!;
  const likeId = req.params.likeId as string;

  if (!likeId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Like ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof likeId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Like ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const like = await likeService.deleteLike(profileId, likeId);

  res.status(HttpStatusCode.OK).json(ApiResponse.success(like));
}
