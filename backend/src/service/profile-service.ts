import type { CreateProfileDto } from "@packages/shared/dto/profile-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@util/http-status-code.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";

export async function createProfile(uid: string, dto: CreateProfileDto) {
  await ensureProfileNotExistbyUid(uid);

  const profile = await prisma.profile.create({
    data: {
      id: uid,
      firstName: dto.firstName,
      lastName: dto.lastName,
      profilePicUri: dto.profilePicUri ?? null,
    },
  });

  return profile;
}

export async function ensureProfileNotExistbyUid(uid: string) {
  const profile = await prisma.profile.findFirst({
    where: {
      id: uid,
    },
  });
  if (profile) {
    throw AppError.from({
      machineCode: ErrorMachineCode.PROFILE_ALREADY_EXISTS,
      message: "Profile already exists",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}
