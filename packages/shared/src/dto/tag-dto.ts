import { z } from "zod";

const clubIdValidator = z.uuid("Invalid club ID.");
const tagIdValidator = z.uuid("Invalid tag ID.");

export const AssignTagValidator = z.object({
  clubId: clubIdValidator,
  tagId: tagIdValidator,
});

export const RemoveAssignedTagValidator = z.object({
  clubId: clubIdValidator,
  tagId: tagIdValidator,
});

export type AssignTagDto = z.infer<typeof AssignTagValidator>;

export type RemoveAssignedTagDto = z.infer<typeof RemoveAssignedTagValidator>;
