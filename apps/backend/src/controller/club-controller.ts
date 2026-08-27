import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import {
  CreateClubValidator,
  UpdateClubValidator,
} from "@campusly/shared/dto/club-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import * as clubService from "@service/club-service.js";
import { uploadDir } from "../lib/multer/upload.js";
import path from "path";
import fs from "fs/promises";

export async function updateClub(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await UpdateClubValidator.safeParseAsync(
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

  const club = await clubService.updateClub(adminUid, data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Club updated successfully", club));
}

export async function createClub(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await CreateClubValidator.safeParseAsync(
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

  const club = await clubService.createClub(adminUid, data);

  return res
    .status(HttpStatusCode.CREATED)
    .json(ApiResponse.created("Club created successfully", club));
}

export async function uploadLogo(req: Request, res: Response) {
  try {
    const uid = req.uid!;
    throwIfUidNotExist(req);

    const clubId = req.params.clubId as string;
    if (!clubId) {
      throw AppError.from({
        machineCode: ErrorMachineCode.CLUB_ID_NOT_PROVIDED,
        message: "Club ID not provided",
        statusCode: HttpStatusCode.BAD_REQUEST,
        isOperational: true,
      });
    }

    const diskFile = req.file;
    if (!diskFile) {
      throw AppError.from({
        machineCode: ErrorMachineCode.FILE_NOT_FOUND,
        message: "No file uploaded",
        statusCode: HttpStatusCode.BAD_REQUEST,
        isOperational: true,
      });
    }

    const clubLogoImageUri = await clubService.uploadClubLogoImage(
      uid,
      clubId,
      diskFile,
    );

    return res
      .status(HttpStatusCode.OK)
      .json(
        ApiResponse.success(
          clubLogoImageUri,
          "Club image uploaded successfully.",
        ),
      );
  } finally {
    // Clean up the uploaded file from the server's disk storage
    const diskFile = req.file;
    if (diskFile) {
      const filePath = path.resolve(uploadDir, diskFile.filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete uploaded file: ${filePath}`, err);
      }
    }
  }
}

export async function deleteLogo(req: Request, res: Response) {
  const uid = req.uid!;
  throwIfUidNotExist(req);

  const clubId = req.params.clubId as string;
  if (!clubId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.CLUB_ID_NOT_PROVIDED,
      message: "Club ID not provided",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  await clubService.deleteClubLogoImage(uid, clubId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(null, "Club logo deleted successfully."));
}
