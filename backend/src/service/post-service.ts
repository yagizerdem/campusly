import type { CreatePostDto } from "@packages/shared/dto/post-dto.js";
import * as profileService from "@service/profile-service.js";
import * as clubService from "@service/club-service.js";
import { prisma } from "@lib/prisma.js";

export async function createPost(userId: string, dto: CreatePostDto) {
  await profileService.ensureProfileExistbyUid(userId);
  const club = await clubService.ensureClubExistById(dto.clubId);
  await clubService.ensureUserIsClubAdmin(userId, dto.clubId);

  const post = await prisma.post.create({
    data: {
      postContent: dto.postContent,
      postTitle: dto.postTitle,
      clubId: club.id,
    },
  });

  return post;
}
