import { z } from "zod";

const mimeTypeRegex = /^[\w-]+\/[\w-]+(?:;\s*[\w-]+=[\w-]+)*$/;

const imageUriValidator = z.string().url("Image URI must be a valid URL");
const fileNameValidator = z
  .string()
  .trim()
  .min(1, "File name is required")
  .max(255, "File name is too long");

const bucketNameValidator = z
  .string()
  .trim()
  .min(1, "Bucket name is required")
  .max(255, "Bucket name is too long");

const objectKeyValidator = z
  .string()
  .trim()
  .min(1, "Object key is required")
  .max(1000, "Object key is too long");

const sizeInBytes = z
  .number()
  .int()
  .positive("Size in bytes must be a positive integer")
  .optional();

const mimeType = z.string().refine((value) => mimeTypeRegex.test(value), {
  message: "Invalid MIME type",
});

export const createImageEntityValidator = z.object({
  imageUri: imageUriValidator,
  fileName: fileNameValidator,
  bucketName: bucketNameValidator,
  objectKey: objectKeyValidator,
  sizeInBytes: sizeInBytes,
  mimeType: mimeType,
});

export type CreateImageDto = z.infer<typeof createImageEntityValidator>;
