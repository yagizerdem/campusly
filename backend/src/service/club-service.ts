import type {
  CreateClubDto,
  UpdateClubDto,
} from "@packages/shared/dto/club-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@util/http-status-code.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import { v4 as uuidv4 } from "uuid";

export function normalizeClubName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function createClub(adminUid: string, dto: CreateClubDto) {
  await ensureClubNotExistByNormalizedName(dto.clubName);

  const club = await prisma.club.create({
    data: {
      id: uuidv4(),
      clubDescription: dto.clubDescription,
      clubLogoUri: dto.clubLogoUri ?? null,
      clubName: dto.clubName,
      clubAdminId: adminUid,
      clubNormalizedName: normalizeClubName(dto.clubName),
    },
  });

  return club;
}

export async function updateClub(clubId: string, dto: UpdateClubDto) {
  const club = await prisma.club.update({
    where: {
      id: clubId,
    },
    data: {
      clubDescription: dto.clubDescription,
      clubLogoUri: dto.clubLogoUri ?? null,
      clubName: dto.clubName,
      clubNormalizedName: normalizeClubName(dto.clubName),
    },
  });

  return club;
}

export async function deleteClub(clubId: string) {
  await prisma.club.delete({
    where: {
      id: clubId,
    },
  });
}

export async function getClubById(clubId: string) {
  const club = await prisma.club.findUnique({
    where: {
      id: clubId,
    },
  });
  return club;
}

export async function ensureClubExistById(clubId: string) {
  const club = await getClubById(clubId);
  if (!club) {
    throw AppError.from({
      machineCode: ErrorMachineCode.CLUB_NOT_FOUND,
      message: "Club not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
}

export async function ensureClubNotExistById(clubId: string) {
  const club = await getClubById(clubId);
  if (club) {
    throw AppError.from({
      machineCode: ErrorMachineCode.CLUB_ALREADY_EXISTS,
      message: "Club already exists",
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}

export async function ensureClubNotExistByNormalizedName(clubName: string) {
  const normalizedName = normalizeClubName(clubName);
  const club = await prisma.club.findFirst({
    where: {
      clubNormalizedName: normalizedName,
    },
  });
  if (club) {
    throw AppError.from({
      machineCode: ErrorMachineCode.CLUB_ALREADY_EXISTS,
      message: `Club already exists: ${clubName}`,
      statusCode: HttpStatusCode.CONFLICT,
      isOperational: true,
    });
  }
}

export async function ensureClubExistByNormalizedName(clubName: string) {
  const normalizedName = normalizeClubName(clubName);
  const club = await prisma.club.findFirst({
    where: {
      clubNormalizedName: normalizedName,
    },
  });
  if (!club) {
    throw AppError.from({
      machineCode: ErrorMachineCode.CLUB_NOT_FOUND,
      message: "Club not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
}
