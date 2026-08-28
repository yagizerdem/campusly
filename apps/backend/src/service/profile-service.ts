import type {
  CreateProfileDto,
  UpdateProfileMetaDataDto,
} from "@campusly/shared/src/dto/profile-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import path from "path";
import { uploadDir } from "@lib/multer/upload.js";
import { firebaseApp } from "@src/firebase.js";
import * as imageService from "@service/image-service.js";
import fs from "fs/promises";

export async function createProfile(uid: string, dto: CreateProfileDto) {
  await ensureProfileNotExistbyUid(uid);

  const profile = await prisma.profile.create({
    data: {
      id: uid,
      firstName: dto.firstName,
      lastName: dto.lastName,
      telephoneNumber: dto.telephoneNumber ?? null,
    },
  });

  return profile;
}

export async function updateProfileMetaData(
  uid: string,
  dto: UpdateProfileMetaDataDto,
) {
  await ensureProfileExistbyUid(uid);
  const profile = await prisma.profile.update({
    where: {
      id: uid,
    },
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      telephoneNumber: dto.telephoneNumber ?? null,
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

export async function ensureProfileExistbyUid(uid: string) {
  const profile = await prisma.profile.findFirst({
    where: {
      id: uid,
    },
  });

  if (!profile) {
    throw AppError.from({
      machineCode: ErrorMachineCode.PROFILE_NOT_FOUND,
      message: "Profile not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return profile;
}

export async function throwIfProfileImgNotExistInUploadsFolder(
  fileName: string,
) {
  const filePath = path.resolve(uploadDir, fileName);

  try {
    await fs.access(filePath);
  } catch (err) {
    throw AppError.from({
      machineCode: ErrorMachineCode.FILE_NOT_FOUND,
      message: "Profile image not found in uploads folder",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
}

export async function uploadProfileImage(
  profileUid: string,
  multerFile: Express.Multer.File,
): Promise<string> {
  const mimeType = multerFile.mimetype;
  const profileImageName = multerFile.filename;
  imageService.throwIfNotAllowedImageMimeType(mimeType);
  const profile = await ensureProfileExistbyUid(profileUid);
  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  // check if profile already has an image, if yes, delete it from firebase storage and db
  const imageEntityFromDb = await prisma.image.findFirst({
    where: {
      profile: profile,
    },
  });

  if (imageEntityFromDb) {
    // delete img from firebase storage
    const file = bucket.file(`profile-images/${imageEntityFromDb.fileName}`);
    await file.delete();

    // delete img from db
    await imageService.removeImageById(imageEntityFromDb.id);
  }

  // upload new img to firebase storage
  const [uploadedFile] = await bucket.upload(
    path.resolve(uploadDir, profileImageName),
    {
      destination: `profile-images/${profileImageName}`,
      metadata: {
        contentType: mimeType,
      },
    },
  );

  const downloadURL = await getDownloadURL(uploadedFile);

  // create new img entity in db and update profile with new img id
  const imageEntity = await imageService.createImageEntity({
    bucketName: bucket.name,
    fileName: profileImageName,
    imageUri: downloadURL,
    mimeType,
  });

  await prisma.profile.update({
    where: {
      id: profileUid,
    },
    data: {
      profileImageId: imageEntity.id,
    },
  });

  return downloadURL;
}

export async function deleteProfileImage(profileUid: string): Promise<void> {
  const profile = await ensureProfileExistbyUid(profileUid);
  const storage = getStorage(firebaseApp);
  const bucket = storage.bucket();

  const imageEntityFromDb = await prisma.image.findFirst({
    where: {
      profile: profile,
    },
  });

  if (!imageEntityFromDb) {
    return;
  }
  // delete img from firebase storage
  const file = bucket.file(`profile-images/${imageEntityFromDb.fileName}`);
  await file.delete();

  // delete img from db
  await imageService.removeImageById(imageEntityFromDb.id);
}
