import type {
  CreateClubEventDto,
  UpdateClubEventDto,
} from "@campusly/shared/src/dto/club-event-dto.js";
import { AppError } from "@common/app-error.js";
import { prisma } from "@lib/prisma.js";
import { withRetry } from "@lib/retry.js";
import * as clubService from "@service/club-service.js";
import * as imageService from "@service/image-service.js";
import { firebaseApp } from "@src/firebase.js";
import { ErrorMachineCode } from "@campusly/shared/src/util/error-machine-code.js";
import HttpStatusCode from "@campusly/shared/src/util/http-status-code.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import type { ClubMemberRole } from "@src/generated/prisma/enums.js";

const BUCKET_UPLOAD_DIR = "club-event-images";
const CLUB_EVENT_EDITOR_ROLES = ["ADMIN", "MANAGER"] as ClubMemberRole[];

const clubEventInclude = {
  club: true,
  images: {
    orderBy: { order: "asc" as const },
    include: { image: true },
  },
  clubEventForm: {
    include: { surveySchema: true },
  },
};

export async function createClubEvent(
  profileUid: string,
  dto: CreateClubEventDto,
  files: Express.Multer.File[],
) {
  const club = await clubService.ensureClubExistById(dto.clubId);
  await ensureUserCanManageClubEvents(profileUid, club.id);

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
      };
    }),
  );

  try {
    return await prisma.$transaction(async (tx) => {
      const clubEvent = await tx.clubEvent.create({
        data: {
          eventTitle: dto.eventTitle,
          eventDescription: dto.eventDescription,
          eventDate: dto.eventDate,
          clubId: club.id,
        },
      });

      for (const [order, uploaded] of uploadedFiles.entries()) {
        const image = await tx.image.create({
          data: {
            imageUri: uploaded.imageUri,
            fileName: uploaded.source.filename,
            bucketName: bucket.name,
            objectKey: `${BUCKET_UPLOAD_DIR}/${uploaded.source.filename}`,
            mimeType: uploaded.source.mimetype,
            sizeInBytes: uploaded.source.size,
          },
        });

        await tx.clubEventImage.create({
          data: {
            clubEventId: clubEvent.id,
            imageId: image.id,
            order,
          },
        });
      }

      return tx.clubEvent.findUniqueOrThrow({
        where: {
          id: clubEvent.id,
        },
        include: {
          images: {
            include: {
              image: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
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

export async function ensureClubEventExistsById(clubEventId: string) {
  const clubEvent = await prisma.clubEvent.findUnique({
    where: { id: clubEventId },
    include: clubEventInclude,
  });

  if (!clubEvent) {
    throw AppError.from({
      machineCode: ErrorMachineCode.RESOURCE_NOT_FOUND,
      message: "Club event not found.",
      statusCode: HttpStatusCode.NOT_FOUND,
      isOperational: true,
    });
  }

  return clubEvent;
}

export function getClubEventById(clubEventId: string) {
  return ensureClubEventExistsById(clubEventId);
}

export async function getClubEventsByClubId(clubId: string) {
  const club = await clubService.ensureClubExistById(clubId);

  return prisma.clubEvent.findMany({
    where: { clubId: club.id },
    include: clubEventInclude,
    orderBy: { eventDate: "asc" },
  });
}

export async function updateClubEvent(
  profileUid: string,
  clubEventId: string,
  dto: UpdateClubEventDto,
) {
  const clubEvent = await ensureClubEventExistsById(clubEventId);
  await ensureUserCanManageClubEvents(profileUid, clubEvent.clubId);

  return prisma.clubEvent.update({
    where: { id: clubEvent.id },
    data: {
      eventTitle: dto.eventTitle,
      eventDescription: dto.eventDescription,
      eventDate: dto.eventDate,
    },
    include: clubEventInclude,
  });
}

export async function deleteClubEvent(profileUid: string, clubEventId: string) {
  const clubEvent = await ensureClubEventExistsById(clubEventId);
  await ensureUserCanManageClubEvents(profileUid, clubEvent.clubId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.clubEventForm.deleteMany({
        where: { clubEventId: clubEvent.id },
      });
      await tx.clubEvent.delete({ where: { id: clubEvent.id } });
      await tx.image.deleteMany({
        where: {
          id: { in: clubEvent.images.map(({ image }) => image.id) },
        },
      });
    });

    const bucket = getStorage(firebaseApp).bucket();
    try {
      await withRetry(
        async () => {
          const results = await Promise.allSettled(
            clubEvent.images.map(({ image }) =>
              bucket.file(image.objectKey).delete({ ignoreNotFound: true }),
            ),
          );

          const failedResult = results.find(
            (result) => result.status === "rejected",
          );
          if (failedResult?.status === "rejected") {
            throw failedResult.reason;
          }
        },
        {
          baseMs: 100,
          capMs: 30_000,
          maxAttempts: 3,
        },
      );
    } catch (error) {
      console.error("Failed to delete club event images from storage:", error);
      // Add a background job to clean up Firebase Storage.
    }
  } catch (error) {
    throw AppError.from({
      machineCode: ErrorMachineCode.INTERNAL_ERROR,
      message: "Failed to delete club event.",
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      isOperational: false,
      cause: error,
      diagnostic: {
        path: "service/club-event-service.ts",
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

function ensureUserCanManageClubEvents(profileUid: string, clubId: string) {
  return clubService.ensureUserIsInRole(profileUid, clubId, [
    ...CLUB_EVENT_EDITOR_ROLES,
  ]);
}
