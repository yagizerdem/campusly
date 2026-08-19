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

  profilePicUri: z
    .string()
    .url("Profile picture URI must be a valid URL")
    .nullable()
    .optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileValidator>;
