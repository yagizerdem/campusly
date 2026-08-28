import type {
  CreateStoryDto,
  UpdateStoryDto,
} from "@campusly/shared/src/dto/story-dto.js";
import { prisma } from "@lib/prisma.js";
import { firebaseApp } from "@src/firebase.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import * as clubService from "@service/club-service.js";
import * as clubMembershipService from "@service/club-membership-service.js";
import * as imageService from "@service/image-service.js";
import * as profileService from "@service/profile-service.js";
import { AppError } from "@common/app-error.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { withRetry } from "../lib/retry.js";

const BUCKET_UPLOAD_DIR = "story-images";

const storyInclude = {
  author: true,
  club: true,
  images: {
    orderBy: { order: "asc" as const },
    include: { image: true },
  },
};

export async function createStory(
  profileUid: string,
  dto: CreateStoryDto,
  files: Express.Multer.File[],
) {
  const profile = await profileService.ensureProfileExistbyUid(profileUid);
  const club = await clubService.ensureClubExistById(dto.clubId);
  await clubMembershipService.ensureUserIsClubMember(profileUid, club.id);

  for (const file of files) {
    imageService.throwIfNotAllowedImageMimeType(file.mimetype);
  }

  const bucket = getStorage(firebaseApp).bucket();
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const [uploadedFile] = await bucket.upload(file.path, {
        destination: `${BUCKET_UPLOAD_DIR}/${file.filename}`,
        metadata: { contentType: file.mimetype },
      });

      return {
        uploadedFile,
        source: file,
        imageUri: await getDownloadURL(uploadedFile),
        sizeInBytes: file.size,
      };
    }),
  );

  try {
    return await prisma.$transaction(async (tx) => {
      const story = await tx.stories.create({
        data: {
          storyTitle: dto.storyTitle,
          storyContent: dto.storyContent,
          authorId: profile.id,
          clubId: club.id,
        },
      });

      for (const [order, uploaded] of uploadedFiles.entries()) {
        const image = await tx.image.create({
          data: {
            imageUri: uploaded.imageUri,
            fileName: uploaded.source.filename,
            bucketName: bucket.name,
            mimeType: uploaded.source.mimetype,
            objectKey: `${BUCKET_UPLOAD_DIR}/${uploaded.source.filename}`,
            sizeInBytes: uploaded.sizeInBytes,
          },
        });

        await tx.storyImage.create({
          data: {
            storyId: story.id,
            imageId: image.id,
            order,
          },
        });
      }

      return tx.stories.findUniqueOrThrow({
        where: { id: story.id },
        include: storyInclude,
      });
    });
  } catch (error) {
    await Promise.all(
      uploadedFiles.map(({ uploadedFile }) =>
        uploadedFile.delete({ ignoreNotFound: true }),
      ),
    );
    throw error;
  }
}

export async function ensureStoryExistsById(storyId: string) {
  const story = await prisma.stories.findUnique({
    where: { id: storyId },
    include: storyInclude,
  });

  if (!story) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_NOT_FOUND,
      message: "Story not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return story;
}

export function getStoryById(storyId: string) {
  return ensureStoryExistsById(storyId);
}

export async function getStoriesByClubId(clubId: string) {
  const club = await clubService.ensureClubExistById(clubId);

  return prisma.stories.findMany({
    where: { clubId: club.id },
    include: storyInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateStory(
  profileUid: string,
  storyId: string,
  dto: UpdateStoryDto,
) {
  const profile = await profileService.ensureProfileExistbyUid(profileUid);
  const story = await ensureStoryExistsById(storyId);
  ensureProfileAndAuthorMatch(profile.id, story.authorId);

  return prisma.stories.update({
    where: { id: story.id },
    data: {
      storyTitle: dto.storyTitle,
      storyContent: dto.storyContent,
    },
    include: storyInclude,
  });
}

export async function deleteStory(profileUid: string, storyId: string) {
  const profile = await profileService.ensureProfileExistbyUid(profileUid);
  const story = await ensureStoryExistsById(storyId);
  ensureProfileAndAuthorMatch(profile.id, story.authorId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.stories.delete({ where: { id: story.id } });
      await tx.image.deleteMany({
        where: { id: { in: story.images.map(({ image }) => image.id) } },
      });
    });

    const bucket = getStorage(firebaseApp).bucket();

    try {
      withRetry(
        async () => {
          await Promise.allSettled(
            story.images.map(({ image }) =>
              bucket
                .file(`${BUCKET_UPLOAD_DIR}/${image.fileName}`)
                .delete({ ignoreNotFound: true }),
            ),
          );
        },
        {
          baseMs: 100,
          capMs: 30_000,
          maxAttempts: 3,
        },
      );
    } catch (error) {
      console.log(error);
      // add backgorund job to clean from firebase storage
    }
  } catch (error) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INTERNAL_ERROR,
      message: "Failed to delete story.",
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      isOperational: false,
      cause: error,
      diagnostic: {
        path: "service/story-service.ts",
        details: [
          {
            machineCode: ErrorMachineCode.INTERNAL_ERROR,
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      },
    });
  }
}

function ensureProfileAndAuthorMatch(profileId: string, authorId: string) {
  if (profileId !== authorId) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INSUFFICIENT_PERMISSIONS,
      message: "Only the story author can perform this operation.",
      statusCode: HttpStatusCode.FORBIDDEN,
      isOperational: true,
    });
  }
}
