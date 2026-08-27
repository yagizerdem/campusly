import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import {
  AssignTagValidator,
  RemoveAssignedTagValidator,
} from "@campusly/shared/dto/tag-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";
import * as tagService from "@service/tag-service.js";

export async function assignTag(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await AssignTagValidator.safeParseAsync(
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

  const response = await tagService.assignTag(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(response, "Tag assigned successfully."));
}

export async function removeAssignedTag(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } =
    await RemoveAssignedTagValidator.safeParseAsync(req.body);

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

  const response = await tagService.removeAssignedTag(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(response, "Tag removed successfully."));
}
