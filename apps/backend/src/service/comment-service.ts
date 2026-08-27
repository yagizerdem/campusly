import type {
  CreateCommentDto,
  UpdateCommentDto,
} from "@campusly/shared/dto/comment-dto.js";
import * as profileService from "@service/profile-service.js";
import * as postService from "@service/post-service.js";
import { prisma } from "@lib/prisma.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/util/error-machine-code.js";

export async function createComment(
  profileId: string,
  postId: string,
  commentData: CreateCommentDto,
) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const post = await postService.ensurePostExistById(postId);

  const comment = await prisma.comment.create({
    data: {
      commentContent: commentData.commentContent,
      postId: post.id,
      profileId: profile.id,
    },
  });

  return comment;
}

export async function updateComment(
  profileId: string,
  commentId: string,
  commentData: UpdateCommentDto,
) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const comment = await ensureCommentExistById(commentId);

  if (comment.profileId !== profile.id) {
    throw AppError.from({
      message: "You are not authorized to update this comment",
      machineCode: ErrorMachineCode.UNAUTHORIZED,
      statusCode: HttpStatusCode.UNAUTHORIZED,
      isOperational: true,
    });
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      commentContent: commentData.commentContent,
    },
  });

  return updatedComment;
}

export async function deleteComment(profileId: string, commentId: string) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const comment = await ensureCommentExistById(commentId);

  if (comment.profileId !== profile.id) {
    throw AppError.from({
      message: "You are not authorized to delete this comment",
      machineCode: ErrorMachineCode.UNAUTHORIZED,
      statusCode: HttpStatusCode.UNAUTHORIZED,
      isOperational: true,
    });
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return comment;
}

export async function ensureCommentExistById(commentId: string) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw AppError.from({
      message: "Comment not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      machineCode: ErrorMachineCode.COMMENT_NOT_FOUND,
      isOperational: true,
    });
  }

  return comment;
}

export async function ensureCommentNotExistById(commentId: string) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  if (comment) {
    throw AppError.from({
      message: "Comment already exists",
      statusCode: HttpStatusCode.CONFLICT,
      machineCode: ErrorMachineCode.COMMENT_ALREADY_EXISTS,
      isOperational: true,
    });
  }
}
