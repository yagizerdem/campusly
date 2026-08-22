import type { Request, Response } from "express";
import * as joinClubReqService from "@service/join-club-req-service.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import HttpStatusCode from "@packages/shared/util/http-status-code.js";
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
