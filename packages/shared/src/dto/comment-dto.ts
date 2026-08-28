import { z } from "zod";

export const CreateCommentValidator = z.object({
  commentContent: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment content is too long"),
});

export const UpdateCommentValidator = z.object({
  commentContent: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment content is too long"),
});

export type CreateCommentDto = z.infer<typeof CreateCommentValidator>;

export type UpdateCommentDto = z.infer<typeof UpdateCommentValidator>;
