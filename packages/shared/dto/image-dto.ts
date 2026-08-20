import { mime, z } from "zod";

const mimeTypeRegex = /^[\w-]+\/[\w-]+(?:;\s*[\w-]+=[\w-]+)*$/;

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

  mimeType: z.string().refine((value) => mimeTypeRegex.test(value), {
    message: "Invalid MIME type",
  }),
});

export type ImageDto = z.infer<typeof createImageEntityValidator>;
