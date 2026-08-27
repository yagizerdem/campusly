import type {
  CreateClubDto,
  UpdateClubDto,
} from "@campusly/shared/dto/club-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ErrorMachineCode } from "@util/error-machine-code.js";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { firebaseApp } from "@src/firebase.js";
import * as imageService from "@service/image-service.js";
import * as profileService from "@service/profile-service.js";
import { uploadDir } from "@lib/multer/upload.js";
import path from "path";
import type { ClubMemberRole } from "../generated/prisma/enums.js";

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
  return club;
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
  return club;
}

export async function uploadClubLogoImage(
  clubAdminUid: string,
  clubId: string,
  multerFile: Express.Multer.File,
): Promise<string> {
  const mimeType = multerFile.mimetype;
  const clubLogoImageName = multerFile.filename;
  imageService.throwIfNotAllowedImageMimeType(mimeType);

  const club = await ensureClubExistById(clubId);
  await profileService.ensureProfileExistbyUid(clubAdminUid);
  await ensureUserIsClubAdmin(clubAdminUid, clubId);

  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  const imageEntityFromDb = await prisma.image.findFirst({
    where: {
      club: club,
    },
  });

  if (imageEntityFromDb) {
    // delete img from firebase storage
    const file = bucket.file(`club-logo-images/${imageEntityFromDb.fileName}`);
    await file.delete();

    // delete img from db
    await imageService.removeImageById(imageEntityFromDb.id);
  }

  // upload new img to firebase storage
  const [uploadedFile] = await bucket.upload(
    path.resolve(uploadDir, clubLogoImageName),
    {
      destination: `club-logo-images/${clubLogoImageName}`,
      metadata: {
        contentType: mimeType,
      },
    },
  );

  const downloadURL = await getDownloadURL(uploadedFile);

  // create new img entity in db and update club with new img id
  const imageEntity = await imageService.createImageEntity({
    bucketName: bucket.name,
    fileName: clubLogoImageName,
    imageUri: downloadURL,
    mimeType,
  });

  await prisma.club.update({
    where: {
      id: clubId,
    },
    data: {
      clubLogoId: imageEntity.id,
    },
  });

  return downloadURL;
}

export async function deleteClubLogoImage(
  clubAdminUid: string,
  clubId: string,
) {
  const club = await ensureClubExistById(clubId);
  await profileService.ensureProfileExistbyUid(clubAdminUid);
  await ensureUserIsClubAdmin(clubAdminUid, clubId);

  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  const imageEntityFromDb = await prisma.image.findFirst({
    where: {
      club: club,
    },
  });

  if (!imageEntityFromDb) {
    return;
  }
  // delete img from firebase storage
  const file = bucket.file(`club-logo-images/${imageEntityFromDb.fileName}`);
  await file.delete();

  // delete img from db
  await imageService.removeImageById(imageEntityFromDb.id);
}

export async function ensureUserIsClubMember(userUid: string, clubId: string) {
  const club = await ensureClubExistById(clubId);
  const profile = await profileService.ensureProfileExistbyUid(userUid);

  const membershipFromDb = await prisma.clubMember.findFirst({
    where: {
      clubId: club.id,
      profileId: profile.id,
    },
  });

  if (!membershipFromDb) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "User is not a club member",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }

  return membershipFromDb;
}

export async function ensureUserIsClubAdmin(userUid: string, clubId: string) {
  const membershipFromDb = await ensureUserIsClubMember(userUid, clubId);

  if (membershipFromDb.role !== "ADMIN") {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "User is not a club admin",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }

  return membershipFromDb;
}

export async function ensureUserIsInRole(
  userUid: string,
  clubId: string,
  roles: ClubMemberRole[],
) {
  const membershipFromDb = await ensureUserIsClubMember(userUid, clubId);

  if (roles.length > 0 && !roles.includes(membershipFromDb.role)) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "User does not have the required role",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }

  return membershipFromDb;
}

export async function ensureUserNotIsInRole(
  userUid: string,
  clubId: string,
  roles: ClubMemberRole[],
) {
  const membershipFromDb = await ensureUserIsClubMember(userUid, clubId);

  if (roles.length > 0 && roles.includes(membershipFromDb.role)) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "User has a forbidden role",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }

  return membershipFromDb;
}
