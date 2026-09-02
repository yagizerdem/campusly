import type { CreateImageDto } from "@campusly/shared/src/dto/image-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import { getStorage } from "firebase-admin/storage";
import { firebaseApp } from "../firebase.js";
import { add } from "date-fns";
import type { Image } from "../generated/prisma/client.js";

export function createImageEntity(dto: CreateImageDto) {
  const response = prisma.image.create({
    data: {
      imageUri: dto.imageUri,
      fileName: dto.fileName,
      bucketName: dto.bucketName,
      mimeType: dto.mimeType,
      objectKey: dto.objectKey,
      sizeInBytes: dto.sizeInBytes ?? null,
    },
  });

  return response;
}

export function removeImageById(id: string) {
  const response = prisma.image.delete({
    where: {
      id,
    },
  });

  return response;
}

export async function ensureImageExistById(id: string) {
  const imageEntity = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  if (!imageEntity) {
    throw AppError.from({
      machineCode: ErrorMachineCode.IMAGE_NOT_FOUND,
      message: "Image not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
  return imageEntity;
}

export function isAllowedImageMimeType(mimeType: string): boolean {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  return allowedMimeTypes.includes(mimeType);
}

export function throwIfNotAllowedImageMimeType(mimeType: string): void {
  if (!isAllowedImageMimeType(mimeType)) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INVALID_IMAGE_MIME_TYPE,
      message: "Invalid image MIME type",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }
}

export async function generateSignedUrlByImageId(
  imgId: string,
  expiresInSeconds: number,
  returnNullOnError = false,
): Promise<string | null> {
  try {
    const imageEntityFromDb = await ensureImageExistById(imgId);
    const signedUrl = await generateSignedUrl(
      imageEntityFromDb,
      expiresInSeconds,
    );
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL by image ID:", error);
    if (returnNullOnError) {
      return null;
    }
    throw error;
  }
}

export async function generateSignedUrl(
  image: Image,
  expiresInSeconds: number,
): Promise<string> {
  try {
    const bucket = getStorage(firebaseApp).bucket();

    const file = bucket.file(image.objectKey);
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: add(Date.now(), {
        seconds: expiresInSeconds,
      }),
    });

    return signedUrl;
  } catch (err) {
    console.error("Error generating signed URL:", err);
    throw AppError.from({
      machineCode: ErrorMachineCode.FAILED_TO_GENERATE_SIGNED_URL,
      message: "Failed to generate signed URL",
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      isOperational: true,
    });
  }
}
