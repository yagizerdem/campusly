import type { Request, Response } from "express";
import fs from "fs/promises";
import {
  CreateClubEventValidator,
  UpdateClubEventValidator,
  type ClubEventFeedResponse,
  type ImageIdSignedUrlMap,
} from "@campusly/shared/src/dto/club-event-dto.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import * as clubEventService from "@service/club-event-service.js";
import {
  throwValidationError,
  getRequiredRouteParam,
} from "@common/route-validation.js";
import type { QueryString } from "@common/prisma-api-features.js";

export async function createClubEvent(req: Request, res: Response) {
  try {
    throwIfUidNotExist(req);

    const result = await CreateClubEventValidator.safeParseAsync(req.body);
    if (!result.success) {
      throwValidationError(req, result.error.issues);
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const clubEvent = await clubEventService.createClubEvent(
      req.uid!,
      result.data,
      files,
    );

    return res
      .status(HttpStatusCode.CREATED)
      .json(ApiResponse.created("Club event created successfully", clubEvent));
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

export async function getClubEventById(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubEventId = getRequiredRouteParam(
    req.params.clubEventId,
    "clubEventId",
  );
  const clubEvent = await clubEventService.getClubEventById(clubEventId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(clubEvent));
}

export async function getClubEventsByClubId(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubId = getRequiredRouteParam(req.params.clubId, "clubId");
  const clubEvents = await clubEventService.getClubEventsByClubId(clubId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(clubEvents));
}

export async function updateClubEvent(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubEventId = getRequiredRouteParam(
    req.params.clubEventId,
    "clubEventId",
  );

  const result = await UpdateClubEventValidator.safeParseAsync(req.body);
  if (!result.success) {
    throwValidationError(req, result.error.issues);
  }

  const clubEvent = await clubEventService.updateClubEvent(
    req.uid!,
    clubEventId,
    result.data,
  );

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Club event updated successfully", clubEvent));
}

export async function deleteClubEvent(req: Request, res: Response) {
  throwIfUidNotExist(req);
  const clubEventId = getRequiredRouteParam(
    req.params.clubEventId,
    "clubEventId",
  );
  await clubEventService.deleteClubEvent(req.uid!, clubEventId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.ok("Club event deleted successfully"));
}

export async function fetchClubEventsForFeed(req: Request, res: Response) {
  // throwIfUidNotExist(req);

  const [clubEvents, coverImageSignedUrls] =
    await clubEventService.fetchClubEventsForFeed(req.query as QueryString);

  const responseData: ClubEventFeedResponse = clubEvents?.map((event) => {
    return {
      id: event.id,
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      eventDate: event.eventDate,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      clubId: event.clubId,
      club: {
        clubDescription: event.club.clubDescription,
        clubName: event.club.clubName,
        id: event.club.id,
        clubLogoId: event.club.clubLogoId,
      },
      coverImageSignedUrl: coverImageSignedUrls
        ? coverImageSignedUrls[event.id] || null
        : null,
    };
  });

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(responseData));
}

export async function fetchClubEventImages(req: Request, res: Response) {
  // throwIfUidNotExist(req);
  const clubEventId = getRequiredRouteParam(
    req.params.clubEventId,
    "clubEventId",
  );

  const images: ImageIdSignedUrlMap =
    await clubEventService.fetchClubEventImages(clubEventId);

  return res.status(HttpStatusCode.OK).json(ApiResponse.success(images));
}
