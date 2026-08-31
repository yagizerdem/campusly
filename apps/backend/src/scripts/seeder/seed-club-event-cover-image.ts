import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v5 as uuidv5 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/club-event-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-club-event-images/", import.meta.url),
);
const MAX_IMAGES_PER_CLUB_EVENT = 20;

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function seedClubEventCoverImages() {
  const clubEvents = await prisma.clubEvent.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (clubEvents.length === 0) {
    throw new Error(
      "Seed club event cover images requires at least one club event to be created first.",
    );
  }

  const assetFileNames = (await readdir(SEED_IMAGE_DIR))
    .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
    .sort();

  if (assetFileNames.length === 0) {
    throw new Error(`No seed images found in ${SEED_IMAGE_DIR}.`);
  }

  const bucket = getStorage(firebaseApp).bucket();

  for (const [eventIndex, clubEvent] of clubEvents.entries()) {
    const coverImageId = uuidv5(
      `club-event-cover:${clubEvent.id}`,
      uuidv5.URL,
    );
    const existingImages = await prisma.clubEventImage.findMany({
      where: { clubEventId: clubEvent.id },
      select: { imageId: true, order: true },
      orderBy: [{ order: "asc" }, { imageId: "asc" }],
    });
    const coverAlreadyExists = existingImages.some(
      ({ imageId }) => imageId === coverImageId,
    );

    if (existingImages.length > MAX_IMAGES_PER_CLUB_EVENT) {
      throw new Error(
        `Club event ${clubEvent.id} has more than ${MAX_IMAGES_PER_CLUB_EVENT} images.`,
      );
    }

    if (
      !coverAlreadyExists &&
      existingImages.length >= MAX_IMAGES_PER_CLUB_EVENT
    ) {
      throw new Error(
        `Club event ${clubEvent.id} already has ${MAX_IMAGES_PER_CLUB_EVENT} images. ` +
          "Remove one image before seeding its cover image.",
      );
    }

    const assetFileName = assetFileNames[eventIndex % assetFileNames.length]!;
    const extension = extname(assetFileName).toLowerCase();
    const mimeType = MIME_TYPES[extension]!;
    const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
    const fileName = `${clubEvent.id}-cover${extension}`;
    const objectKey = `${BUCKET_UPLOAD_DIR}/${clubEvent.id}/${fileName}`;
    const { size } = await stat(sourcePath);

    const [uploadedFile] = await bucket.upload(sourcePath, {
      destination: objectKey,
      metadata: { contentType: mimeType },
    });
    const imageUri = await getDownloadURL(uploadedFile);

    await prisma.$transaction(async (tx) => {
      await tx.image.upsert({
        where: { id: coverImageId },
        update: {
          bucketName: bucket.name,
          fileName,
          imageUri,
          mimeType,
          sizeInBytes: size,
          objectKey,
        },
        create: {
          id: coverImageId,
          bucketName: bucket.name,
          fileName,
          imageUri,
          mimeType,
          sizeInBytes: size,
          objectKey,
        },
      });

      await tx.clubEventImage.upsert({
        where: {
          clubEventId_imageId: {
            clubEventId: clubEvent.id,
            imageId: coverImageId,
          },
        },
        update: { order: 0 },
        create: {
          clubEventId: clubEvent.id,
          imageId: coverImageId,
          order: 0,
        },
      });

      const galleryImages = existingImages.filter(
        ({ imageId }) => imageId !== coverImageId,
      );
      for (const [index, galleryImage] of galleryImages.entries()) {
        await tx.clubEventImage.update({
          where: {
            clubEventId_imageId: {
              clubEventId: clubEvent.id,
              imageId: galleryImage.imageId,
            },
          },
          data: { order: index + 1 },
        });
      }
    });
  }

  console.log(
    `${clubEvents.length} club event cover images seeded from ${assetFileNames.length} assets.`,
  );
}

try {
  await seedClubEventCoverImages();
} finally {
  await prisma.$disconnect();
}
