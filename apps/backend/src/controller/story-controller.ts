import type { Request, Response } from "express";
import fs from "fs/promises";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { AppError } from "@common/app-error.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";
import * as storyService from "@service/story-service.js";
import {
  CreateStoryValidator,
  UpdateStoryValidator,
} from "@campusly/shared/dto/story-dto.js";

function getRequiredRouteParam(
  value: string | string[] | undefined,
  name: string,
) {
  if (typeof value !== "string" || value.length === 0) {
    throw AppError.from({
      machineCode: ErrorMachineCode.VALIDATION_ERROR,
      message: `${name} is required and must be a string.`,
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }

  return value;
}

function throwValidationError(
  req: Request,
  issues: { path: PropertyKey[]; message: string }[],
): never {
  throw AppError.from({
    machineCode: ErrorMachineCode.VALIDATION_ERROR,
    message: "Validation error",
    statusCode: HttpStatusCode.BAD_REQUEST,
    isOperational: true,
    diagnostic: {
      path: req.path,
      details: issues.map((issue) => ({
        machineCode: ErrorMachineCode.VALIDATION_ERROR,
        message: `${issue.path.join(".")}: ${issue.message}`,
      })),
    },
  });
}

export async function createStory(req: Request, res: Response) {
  try {
    throwIfUidNotExist(req);

    const result = await CreateStoryValidator.safeParseAsync(req.body);
    if (!result.success) {
      throwValidationError(req, result.error.issues);
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const story = await storyService.createStory(req.uid!, result.data, files);

    return res
      .status(HttpStatusCode.CREATED)
      .json(ApiResponse.created("Story created successfully", story));
  } finally {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (error) {
          console.error(`Error deleting file ${file.path}:`, error);
        }
      }),
    );
  }
}

export async function getStoryById(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const storyId = getRequiredRouteParam(req.params.storyId, "Story ID");
  const story = await storyService.getStoryById(storyId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(story));
}

export async function getStoriesByClubId(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubId = getRequiredRouteParam(req.params.clubId, "Club ID");
  const stories = await storyService.getStoriesByClubId(clubId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(stories));
}

export async function updateStory(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const storyId = getRequiredRouteParam(req.params.storyId, "Story ID");

  const result = await UpdateStoryValidator.safeParseAsync(req.body);
  if (!result.success) {
    throwValidationError(req, result.error.issues);
  }

  const story = await storyService.updateStory(req.uid!, storyId, result.data);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Story updated successfully", story));
}

export async function deleteStory(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const storyId = getRequiredRouteParam(req.params.storyId, "Story ID");
  await storyService.deleteStory(req.uid!, storyId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Story deleted successfully"));
}
