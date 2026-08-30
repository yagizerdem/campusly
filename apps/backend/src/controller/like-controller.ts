import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as likeService from "@service/like-service.js";
import { getRequiredRouteParam } from "@common/route-validation.js";

export async function likePost(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const profileId = req.uid!;
  const postId = getRequiredRouteParam(req.params.postId, "postId");

  const like = await likeService.createLike(profileId, postId);

  res.status(HttpStatusCode.OK).json(ApiResponse.success(like));
}

export async function unlikePost(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const profileId = req.uid!;
  const likeId = getRequiredRouteParam(req.params.likeId, "likeId");

  const like = await likeService.deleteLike(profileId, likeId);

  res.status(HttpStatusCode.OK).json(ApiResponse.success(like));
}
