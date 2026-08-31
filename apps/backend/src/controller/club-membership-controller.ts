import type { Request, Response } from "express";
import * as joinClubReqService from "@/src/service/club-membership-service.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { getRequiredRouteParam } from "@common/route-validation.js";

export async function sendJoinClubRequest(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const clubId = getRequiredRouteParam(req.params.clubId, "clubId");

  const joinRequest = await joinClubReqService.sendClubJoinRequest(
    profileUid,
    clubId,
  );

  return res
    .status(HttpStatusCode.CREATED)
    .json(ApiResponse.success(joinRequest));
}

export async function approveJoinClubRequest(req: Request, res: Response) {
  const clubAdminUid = req.uid!;
  throwIfUidNotExist(req);

  const joinRequestId = getRequiredRouteParam(
    req.params.joinRequestId,
    "joinRequestId",
  );

  const joinRequest = await joinClubReqService.approveClubJoinRequest(
    clubAdminUid,
    joinRequestId,
  );

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(joinRequest));
}

export async function rejectJoinClubRequest(req: Request, res: Response) {
  const clubAdminUid = req.uid!;
  throwIfUidNotExist(req);

  const joinRequestId = getRequiredRouteParam(
    req.params.joinRequestId,
    "joinRequestId",
  );

  const joinRequest = await joinClubReqService.rejectClubJoinRequest(
    clubAdminUid,
    joinRequestId,
  );

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(joinRequest));
}
