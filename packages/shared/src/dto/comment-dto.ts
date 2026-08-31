import { z } from "zod";

const commentContentValidator = z
  .string()
  .min(1, "Comment content is required")
  .max(1000, "Comment content is too long");

export const CreateCommentValidator = z.object({
  commentContent: commentContentValidator,
});

export const UpdateCommentValidator = z.object({
  commentContent: commentContentValidator,
});

export type CreateCommentDto = z.infer<typeof CreateCommentValidator>;

export type UpdateCommentDto = z.infer<typeof UpdateCommentValidator>;
