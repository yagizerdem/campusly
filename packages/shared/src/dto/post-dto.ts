import { z } from "zod";

const postTitleValidator = z
  .string()
  .trim()
  .min(1, "Post title is required.")
  .max(150, "Post title must be at most 150 characters.");

const postContentValidator = z
  .string()
  .trim()
  .min(1, "Post content is required.")
  .max(5000, "Post content must be at most 5000 characters.");

const clubIdValidator = z.uuid("Invalid club ID.");

const postIdValidator = z.uuid("Invalid post ID.");

export const CreatePostValidator = z.object({
  postTitle: postTitleValidator,
  postContent: postContentValidator,
  clubId: clubIdValidator.optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostValidator>;

export const UpdatePostValidator = z.object({
  postTitle: postTitleValidator,
  postContent: postContentValidator,
  postId: postIdValidator,
  clubId: clubIdValidator.optional(),
});

export type UpdatePostDto = z.infer<typeof UpdatePostValidator>;

export type FetchPostFeedItem = {
  postId: string;
  postTitle: string;
  postContent: string;
  clubId: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentCount: number;
  clubLogoSignedUrl?: string | null;
  profileImageSignedUrl?: string | null;
  images: OrderedPostImage[];
};

export type OrderedPostImage = {
  order: number;
  imageId: string;
  signedUrl: string | null;
};

export type FetchPostFeedResponse = FetchPostFeedItem[];

export type PostIdWithImageSignedUrl = Record<string, OrderedPostImage[]>;
