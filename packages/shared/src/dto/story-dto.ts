import { z } from "zod";

const storyTitleValidator = z
  .string()
  .trim()
  .min(1, "Story title is required.")
  .max(150, "Story title must be at most 150 characters.");

const storyContentValidator = z
  .string()
  .trim()
  .min(1, "Story content is required.")
  .max(5000, "Story content must be at most 5000 characters.");

const clubIdValidator = z.uuid("Invalid club ID.");

export const CreateStoryValidator = z.object({
  storyTitle: storyTitleValidator,
  storyContent: storyContentValidator,
  clubId: clubIdValidator,
});

export type CreateStoryDto = z.infer<typeof CreateStoryValidator>;

export const UpdateStoryValidator = z.object({
  storyTitle: storyTitleValidator,
  storyContent: storyContentValidator,
});

export type UpdateStoryDto = z.infer<typeof UpdateStoryValidator>;
