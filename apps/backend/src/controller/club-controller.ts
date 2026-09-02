import type { Request, Response } from "express";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ApiResponse } from "@common/api-response.js";
import { throwIfUidNotExist } from "@common/uid-validator.js";
import {
  CreateClubValidator,
  UpdateClubValidator,
  type GetClubsWithMembershipStatusDto,
} from "@campusly/shared/src/dto/club-dto.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import * as clubService from "@service/club-service.js";
import { uploadDir } from "@lib/multer/upload.js";
import path from "path";
import fs from "fs/promises";
import {
  throwValidationError,
  getRequiredRouteParam,
} from "@common/route-validation.js";
import type { QueryString } from "@common/prisma-api-features.js";
import * as imageService from "@service/image-service.js";
import { minutesToSeconds } from "date-fns";

export async function updateClub(req: Request, res: Response) {
  const adminUid = req.uid!;
  throwIfUidNotExist(req);

  const { success, data, error } = await UpdateClubValidator.safeParseAsync(
    req.body,
  );

  if (!success) {
    throwValidationError(req, error.issues);
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
    throwValidationError(req, error.issues);
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

    const clubId = getRequiredRouteParam(req.params.clubId, "clubId");

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

  const clubId = getRequiredRouteParam(req.params.clubId, "clubId");

  await clubService.deleteClubLogoImage(uid, clubId);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(null, "Club logo deleted successfully."));
}

export async function getClubsWithMembershipStatus(
  req: Request,
  res: Response,
) {
  const uid = req.uid;

  const queryObject = req.query as QueryString;
  const clubs = await clubService.getClubsWithRelations(queryObject);

  const response: GetClubsWithMembershipStatusDto[] = (
    await Promise.allSettled(
      clubs.map(async (club) => {
        const currentMembership = club.clubMembers.find(
          (member) => member.profileId === uid,
        );
        const clubAdmin = club.clubMembers.find(
          (member) => member.role === "ADMIN",
        );

        const clubLogoSignedUrl = club.clubLogoId
          ? await imageService.generateSignedUrlByImageId(
              club.clubLogoId,
              minutesToSeconds(15),
              true,
            )
          : null;

        const adminProfileImageSignedUrl = clubAdmin?.profile?.profileImageId
          ? await imageService.generateSignedUrlByImageId(
              clubAdmin.profile.profileImageId,
              minutesToSeconds(15),
              true,
            )
          : null;

        const clubResponse: GetClubsWithMembershipStatusDto = {
          clubAdminEmail: clubAdmin?.profile?.email ?? null,
          clubAdminProfileImageId: clubAdmin?.profile?.profileImageId ?? null,
          clubAdminFullName: clubAdmin?.profile
            ? `${clubAdmin.profile.firstName} ${clubAdmin.profile.lastName}`
            : null,
          clubAdminUid: clubAdmin?.profile?.id ?? null,
          clubId: club.id,
          clubName: club.clubName,
          clubNormalizedName: club.clubNormalizedName,
          clubDescription: club.clubDescription,
          createdAt: club.createdAt,
          membershipStatus: currentMembership?.role ?? "NOT_MEMBER",
          membersCount: club.clubMembers.length,
          eventsCount: club.clubEvents.length,
          clubLogoUri: clubLogoSignedUrl,
          clubAdminProfileImageUri: adminProfileImageSignedUrl,
          tags: club.tagsOnClubs.map((tagOnClub) => ({
            tagId: tagOnClub.tag.id,
            tagName: tagOnClub.tag.tagName,
          })),
        };

        return clubResponse;
      }),
    )
  )
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return res
    .status(HttpStatusCode.OK)
    .json(ApiResponse.success(response, "Clubs retrieved successfully."));
}
