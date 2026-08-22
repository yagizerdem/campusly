import { AppError } from "@common/app-error.js";
import { prisma } from "@lib/prisma.js";
import * as clubService from "@service/club-service.js";
import * as profileService from "@service/profile-service.js";
import type { JoinRequestStatus } from "@src/generated/prisma/enums.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import HttpStatusCode from "@packages/shared/util/http-status-code.js";

export async function createClubJoinRequest(
  profileId: string,
  clubId: string,
) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const club = await clubService.ensureClubExistById(clubId);

  await ensureClubJoinRequestNotExist(profile.id, club.id);

  return prisma.clubJoinRequest.create({
    data: {
      profileId: profile.id,
      clubId: club.id,
    },
  });
}

export async function updateClubJoinRequestStatus(
  clubAdminId: string,
  requestId: string,
  status: JoinRequestStatus,
) {
  const request = await ensureClubJoinRequestExistById(requestId);
  await clubService.ensureUserIsClubAdmin(clubAdminId, request.clubId);

  return prisma.clubJoinRequest.update({
    where: {
      id: request.id,
    },
    data: {
      status,
    },
  });
}

export async function deleteClubJoinRequest(
  profileId: string,
  requestId: string,
) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const request = await ensureClubJoinRequestExistById(requestId);

  if (request.profileId !== profile.id) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "You are not authorized to delete this club join request.",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }

  await prisma.clubJoinRequest.delete({
    where: {
      id: request.id,
    },
  });

  return request;
}

export async function getClubJoinRequestsByClubId(
  clubAdminId: string,
  clubId: string,
) {
  await clubService.ensureUserIsClubAdmin(clubAdminId, clubId);

  return prisma.clubJoinRequest.findMany({
    where: {
      clubId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getClubJoinRequestsByProfileId(profileId: string) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);

  return prisma.clubJoinRequest.findMany({
    where: {
      profileId: profile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function ensureClubJoinRequestExistById(requestId: string) {
  const request = await prisma.clubJoinRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_NOT_FOUND,
      message: "Club join request not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return request;
}

export async function ensureClubJoinRequestNotExist(
  profileId: string,
  clubId: string,
) {
  const request = await prisma.clubJoinRequest.findFirst({
    where: {
      profileId,
      clubId,
    },
  });

  if (request) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_ALREADY_EXISTS,
      message: "Club join request already exists.",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}
