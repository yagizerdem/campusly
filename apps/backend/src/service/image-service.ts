import type { CreateImageDto } from "@campusly/shared/src/dto/image-dto.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";

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
