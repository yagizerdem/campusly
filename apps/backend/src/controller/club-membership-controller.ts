import type { Request, Response } from "express";
import * as joinClubReqService from "@/src/service/club-membership-service.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";

export async function sendJoinClubRequest(req: Request, res: Response) {
  const profileUid = req.uid!;
  throwIfUidNotExist(req);

  const clubId = req.params.clubId;

  if (!clubId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Club ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof clubId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Club ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

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

  const joinRequestId = req.params.joinRequestId;

  if (!joinRequestId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Join request ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof joinRequestId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Join request ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const joinRequest = await joinClubReqService.approveClubJoinRequest(
    clubAdminUid,
    joinRequestId,
  );

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(joinRequest));
}

export async function rejectJoinClubRequest(req: Request, res: Response) {
  const clubAdminUid = req.uid!;
  throwIfUidNotExist(req);

  const joinRequestId = req.params.joinRequestId;

  if (!joinRequestId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Join request ID is required",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  if (typeof joinRequestId !== "string") {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: "Join request ID must be a string",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  const joinRequest = await joinClubReqService.rejectClubJoinRequest(
    clubAdminUid,
    joinRequestId,
  );

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(joinRequest));
}
