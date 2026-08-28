import { z } from "zod";

export const CreateStoryValidator = z.object({
  storyTitle: z
    .string()
    .trim()
    .min(1, "Story title is required.")
    .max(150, "Story title must be at most 150 characters."),

  storyContent: z
    .string()
    .trim()
    .min(1, "Story content is required.")
    .max(5000, "Story content must be at most 5000 characters."),

  clubId: z.uuid("Invalid club ID."),
});

export type CreateStoryDto = z.infer<typeof CreateStoryValidator>;

export const UpdateStoryValidator = z.object({
  storyTitle: z
    .string()
    .trim()
    .min(1, "Story title is required.")
    .max(150, "Story title must be at most 150 characters."),

  storyContent: z
    .string()
    .trim()
    .min(1, "Story content is required.")
    .max(5000, "Story content must be at most 5000 characters."),
});

export type UpdateStoryDto = z.infer<typeof UpdateStoryValidator>;
