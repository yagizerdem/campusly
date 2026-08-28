import { prisma } from "@lib/prisma.js";
import * as profileService from "@service/profile-service.js";
import * as postService from "@service/post-service.js";
import { AppError } from "@common/app-error.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";

export async function createLike(profileId: string, postId: string) {
  const profile = await profileService.ensureProfileExistbyUid(profileId);
  const post = await postService.ensurePostExistById(postId);

  await ensureNotLikeExistByPostId(profileId, postId);

  const like = await prisma.like.create({
    data: {
      profileId: profile.id,
      postId: post.id,
    },
  });

  return like;
}

export async function deleteLike(profileId: string, likeId: string) {
  const likeFromDb = await ensureLikeExistById(likeId);

  if (likeFromDb?.profileId !== profileId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.UNAUTHORIZED,
      message: "You are not authorized to delete this like",
      statusCode: HttpStatusCode.UNAUTHORIZED,
      isOperational: true,
    });
  }

  await prisma.like.delete({
    where: {
      id: likeFromDb.id,
    },
  });

  return likeFromDb;
}

export async function ensureNotLikeExistByPostId(
  profileId: string,
  postId: string,
) {
  const like = await prisma.like.findFirst({
    where: {
      profileId: profileId,
      postId: postId,
    },
  });
  if (like) {
    throw AppError.from({
      machineCode: ErrorMachineCode.LIKE_ALREADY_EXIST,
      message: "Like already exist",
      statusCode: HttpStatusCode.BAD_REQUEST,
      isOperational: true,
    });
  }
  return like;
}

export async function ensureLikeExistByPostId(
  profileId: string,
  postId: string,
) {
  const like = await prisma.like.findFirst({
    where: {
      profileId: profileId,
      postId: postId,
    },
  });
  if (!like) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_NOT_FOUND,
      message: "Like not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
  return like;
}

export async function ensureLikeExistById(likeId: string) {
  const like = await prisma.like.findFirst({
    where: {
      id: likeId,
    },
  });
  if (!like) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_NOT_FOUND,
      message: "Like not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }
  return like;
}
