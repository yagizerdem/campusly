import { z } from "zod";

const clubNameValidator = z
  .string()
  .trim()
  .min(1, "Club name is required.")
  .max(100, "Club name must be at most 100 characters.");

const clubDescriptionValidator = z
  .string()
  .trim()
  .min(1, "Club description is required.")
  .max(1000, "Club description must be at most 1000 characters.");

const clubLogoUriValidator = z
  .string()
  .url("Club logo URI must be a valid URL");

const clubAdminUidValidator = z
  .string()
  .min(1, "Club admin UID is required")
  .max(128, "Club admin UID is invalid");

const clubMemberRoleValidator = z.enum(["MEMBER", "ADMIN", "MANAGER"] as const);

const roleDescriptionValidator = z
  .string()
  .max(255, "Role description is too long");

export const CreateClubValidator = z.object({
  clubName: clubNameValidator,
  clubDescription: clubDescriptionValidator,
  clubLogoUri: clubLogoUriValidator.nullable().optional(),
  clubAdminUid: clubAdminUidValidator,
});

export const UpdateClubValidator = z.object({
  clubName: clubNameValidator,
  clubDescription: clubDescriptionValidator,
  clubLogoUri: clubLogoUriValidator.nullable().optional(),
});

// role ClubMemberRole @default(MEMBER)
// roleDescription String?

export const UpdateClubMemberValidator = z.object({
  role: clubMemberRoleValidator,
  roleDescription: roleDescriptionValidator.nullable().optional(),
});

export type CreateClubDto = z.infer<typeof CreateClubValidator>;

export type UpdateClubDto = z.infer<typeof UpdateClubValidator>;
