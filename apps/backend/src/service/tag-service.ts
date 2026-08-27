import {
  type AssignTagDto,
  type RemoveAssignedTagDto,
} from "@campusly/shared/dto/tag-dto.js";
import * as profileService from "@service/profile-service.js";
import * as clubService from "@service/club-service.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";

export async function assignTag(profileId: string, tagDto: AssignTagDto) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const club = await clubService.ensureClubExistById(tagDto.clubId);
  const tagFromDb = await ensureTagExistById(tagDto.tagId);

  await clubService.ensureUserIsClubAdmin(profileId, tagDto.clubId);

  await ensureTagIsNotAssignedToClub(tagDto.tagId, tagDto.clubId);

  await prisma.tagsOnClub.create({
    data: {
      profileId: profile.id,
      clubId: club.id,
      tagId: tagDto.tagId,
    },
  });

  return tagFromDb;
}

export async function removeAssignedTag(
  profileId: string,
  dto: RemoveAssignedTagDto,
) {
  await clubService.ensureUserIsClubAdmin(profileId, dto.clubId);

  const tagFromDb = await ensureTagExistById(dto.tagId);

  await ensureTagIsAssignedToClub(dto.tagId, dto.clubId);

  await prisma.tagsOnClub.delete({
    where: {
      tagId_clubId: {
        tagId: dto.tagId,
        clubId: dto.clubId,
      },
    },
  });

  return tagFromDb;
}

export async function ensureTagExistById(tagId: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
    },
  });

  if (!tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_NOT_FOUND,
      message: "Tag not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return tag;
}

export async function ensureTagNotExistById(tagId: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
    },
  });
  if (tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_ALREADY_EXISTS,
      message: "Tag already exists.",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}

export async function ensureTagNotExistByName(tagName: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      tagName: tagName,
    },
  });
  if (tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_ALREADY_EXISTS,
      message: "Tag already exists.",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}

export async function ensureTagExistByName(tagName: string) {
  const tag = await prisma.tag.findFirst({
    where: {
      tagName: tagName,
    },
  });
  if (!tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_NOT_FOUND,
      message: "Tag not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return tag;
}

export async function ensureTagIsNotAssignedToClub(
  tagId: string,
  clubId: string,
) {
  const tag = await prisma.tagsOnClub.findFirst({
    where: {
      tagId: tagId,
      clubId: clubId,
    },
  });

  if (tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_ALREADY_EXISTS,
      message: "Tag is already assigned to the club.",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}

export async function ensureTagIsAssignedToClub(tagId: string, clubId: string) {
  const tag = await prisma.tagsOnClub.findFirst({
    where: {
      tagId: tagId,
      clubId: clubId,
    },
  });

  if (!tag) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_NOT_FOUND,
      message: "Tag is not assigned to the club.",

      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
  return tag;
}

export async function ensureTagOnClubExistById(tagId: string, clubId: string) {
  const tagOnClub = await prisma.tagsOnClub.findFirst({
    where: {
      tagId: tagId,
      clubId: clubId,
    },
  });

  if (!tagOnClub) {
    throw AppError.from({
      machineCode: ErrorMachineCode.TAG_NOT_FOUND,
      message: "Tag on club not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return tagOnClub;
}
