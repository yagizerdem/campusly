import { z } from "zod";

export const CreateProfileValidator = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),

  telephoneNumber: z
    .string()
    .regex(
      /^(?:\+|00)?[0-9][0-9\s().-]{5,24}$/,
      "Telephone number format is invalid",
    )
    .nullable()
    .optional(),
});

export const UpdateProfileMetaDataValidator = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),

  telephoneNumber: z
    .string()
    .regex(
      /^(?:\+|00)?[0-9][0-9\s().-]{5,24}$/,
      "Telephone number format is invalid",
    )
    .nullable()
    .optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileValidator>;

export type UpdateProfileMetaDataDto = z.infer<
  typeof UpdateProfileMetaDataValidator
>;
