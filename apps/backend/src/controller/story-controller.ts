import type { Request, Response } from "express";
import fs from "fs/promises";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as storyService from "@service/story-service.js";
import {
  CreateStoryValidator,
  UpdateStoryValidator,
} from "@campusly/shared/src/dto/story-dto.js";
import {
  throwValidationError,
  getRequiredRouteParam,
} from "@common/route-validation.js";

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
  const storyId = getRequiredRouteParam(req.params.storyId, "storyId");
  const story = await storyService.getStoryById(storyId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(story));
}

export async function getStoriesByClubId(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubId = getRequiredRouteParam(req.params.clubId, "clubId");
  const stories = await storyService.getStoriesByClubId(clubId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(stories));
}

export async function updateStory(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const storyId = getRequiredRouteParam(req.params.storyId, "storyId");

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
  const storyId = getRequiredRouteParam(req.params.storyId, "storyId");
  await storyService.deleteStory(req.uid!, storyId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Story deleted successfully"));
}
