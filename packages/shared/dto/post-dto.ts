import { z } from "zod";

export const CreatePostValidator = z.object({
  postTitle: z
    .string()
    .trim()
    .min(1, "Post title is required.")
    .max(150, "Post title must be at most 150 characters."),

  postContent: z
    .string()
    .trim()
    .min(1, "Post content is required.")
    .max(5000, "Post content must be at most 5000 characters."),

  clubId: z.uuid("Invalid club ID."),
});

export type CreatePostDto = z.infer<typeof CreatePostValidator>;
