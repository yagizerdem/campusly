import { z } from "zod";

export const CreateClubValidator = z.object({
  clubName: z
    .string()
    .min(1, "Club name is required")
    .max(100, "Club name is too long"),

  clubDescription: z
    .string()
    .min(1, "Club description is required")
    .max(1000, "Club description is too long"),

  clubLogoUri: z
    .string()
    .url("Club logo URI must be a valid URL")
    .nullable()
    .optional(),

  clubAdminUid: z
    .string()
    .min(1, "Club admin UID is required")
    .max(128, "Club admin UID is invalid"),
});

export const UpdateClubValidator = z.object({
  clubName: z
    .string()
    .min(1, "Club name is required")
    .max(100, "Club name is too long"),

  clubDescription: z
    .string()
    .min(1, "Club description is required")
    .max(1000, "Club description is too long"),

  clubLogoUri: z
    .string()
    .url("Club logo URI must be a valid URL")
    .nullable()
    .optional(),
});

export type CreateClubDto = z.infer<typeof CreateClubValidator>;

export type UpdateClubDto = z.infer<typeof UpdateClubValidator>;
