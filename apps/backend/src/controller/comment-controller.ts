import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import {
  CreateCommentValidator,
  UpdateCommentValidator,
} from "@campusly/shared/src/dto/comment-dto.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as commentService from "@service/comment-service.js";
import { ApiResponse } from "@common/api-response.js";
import {
  throwValidationError,
  getRequiredRouteParam,
} from "@common/route-validation.js";

export async function createComment(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await CreateCommentValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
    throwValidationError(req, error.issues);
  }

  const postId = getRequiredRouteParam(req.params.postId, "postId");

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
    throwValidationError(req, error.issues);
  }

  const commentId = getRequiredRouteParam(req.params.commentId, "commentId");

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

  const commentId = getRequiredRouteParam(req.params.commentId, "commentId");

  const commentFromDb = await commentService.deleteComment(
    profileUid,
    commentId,
  );

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Comment deleted successfully", commentFromDb));
}
