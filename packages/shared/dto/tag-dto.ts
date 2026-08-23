import { z } from "zod";

export const AssignTagValidator = z.object({
  clubId: z.uuid("Invalid club ID."),
  tagId: z.uuid("Invalid tag ID."),
});

export const RemoveAssignedTagValidator = z.object({
  clubId: z.uuid("Invalid club ID."),
  tagId: z.uuid("Invalid tag ID."),
});

export type AssignTagDto = z.infer<typeof AssignTagValidator>;

export type RemoveAssignedTagDto = z.infer<typeof RemoveAssignedTagValidator>;
