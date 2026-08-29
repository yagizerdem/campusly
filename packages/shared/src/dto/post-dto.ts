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

export const UpdatePostValidator = z.object({
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

  postId: z.uuid("Invalid post ID."),

  clubId: z.uuid("Invalid club ID."),
});

export type UpdatePostDto = z.infer<typeof UpdatePostValidator>;

export type FetchPostFeedResponse = {
  postId: string;
  postTitle: string;
  postContent: string;
  clubId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  coverImageSignedUrl: string | null;
  likesCount: number;
  commentCount: number;
  images: {
    order: number;
    imageId: string;
  }[];
}[];
