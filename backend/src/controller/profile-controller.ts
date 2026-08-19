import type { Request, Response, NextFunction } from "express";
import { prisma } from "@lib/prisma.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import HttpStatusCode from "@util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import {
  CreateProfileValidator,
  UpdateProfileMetaDataValidator,
} from "@packages/shared/dto/profile-dto.js";
import { AppError } from "@common/app-error.js";
import * as profileService from "@service/profile-service.js";

export async function isProfileExist(req: Request, res: Response) {
  const uid = req.uid!;
  throwIfUidNotExist(req);

  const profile = await prisma.profile.findFirst({
    where: {
      id: uid,
    },
  });

  if (!profile) {
    return res
      .status(HttpStatusCode.NOT_FOUND)
      .json(
        ApiResponse.error(
          HttpStatusCode.NOT_FOUND,
          ErrorMachineCode.PROFILE_NOT_FOUND,
          "Profile not found",
        ),
      );
  }

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(profile, "Profile found"));
}

export async function createProfile(req: Request, res: Response) {
  const uid = req.uid!;
  throwIfUidNotExist(req);
  const body = req.body;

  const { success, data, error } =
    await CreateProfileValidator.safeParseAsync(body);

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

  const profile = await profileService.createProfile(uid, data);

  return res
    .status(HttpStatusCode.CREATED)
    .json(ApiResponse.success(profile, "Profile created successfully."));
}

export async function updateProfileMetaData(req: Request, res: Response) {
  const uid = req.uid!;
  throwIfUidNotExist(req);
  const body = req.body;

  const { success, data, error } =
    await UpdateProfileMetaDataValidator.safeParseAsync(body);

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
  const profile = await profileService.updateProfileMetaData(uid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(profile, "Profile updated successfully."));
}
