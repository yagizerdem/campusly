import { z } from "zod";

export const createImageEntityValidator = z.object({
  imageUri: z.string().url("Image URI must be a valid URL"),

  fileName: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255, "File name is too long"),

  bucketName: z
    .string()
    .trim()
    .min(1, "Bucket name is required")
    .max(255, "Bucket name is too long"),
});

export type ImageDto = z.infer<typeof createImageEntityValidator>;
