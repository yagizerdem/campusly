import { z } from "zod";

const telephoneNumberRegxp = /^(?:\+|00)?[0-9][0-9\s().-]{5,24}$/;

const firstNameValidator = z
  .string()
  .min(1, "First name is required")
  .max(100, "First name is too long");

const lastNameValidator = z
  .string()
  .min(1, "Last name is required")
  .max(100, "Last name is too long");

const telephoneNumberValidator = z
  .string()
  .regex(telephoneNumberRegxp, "Telephone number format is invalid");

export const CreateProfileValidator = z.object({
  firstName: firstNameValidator,
  lastName: lastNameValidator,
  telephoneNumber: telephoneNumberValidator.nullable().optional(),
});

export const UpdateProfileMetaDataValidator = z.object({
  firstName: firstNameValidator,
  lastName: lastNameValidator,
  telephoneNumber: telephoneNumberValidator.nullable().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileValidator>;

export type UpdateProfileMetaDataDto = z.infer<
  typeof UpdateProfileMetaDataValidator
>;
