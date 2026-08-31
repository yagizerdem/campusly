import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/club-event-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-club-event-images/", import.meta.url),
);
const MIN_IMAGES_TO_SEED = 5;
const MAX_IMAGES_TO_SEED = 19;
const MAX_IMAGES_PER_CLUB_EVENT = 20;

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function seedClubEventImages() {
  const clubEvents = await prisma.clubEvent.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (clubEvents.length === 0) {
    throw new Error(
      "Seed club event images requires at least one club event to be created first.",
    );
  }

  const assetFileNames = (await readdir(SEED_IMAGE_DIR))
    .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
    .sort();

  if (assetFileNames.length === 0) {
    throw new Error(`No seed images found in ${SEED_IMAGE_DIR}.`);
  }

  const bucket = getStorage(firebaseApp).bucket();
  let seededImageCount = 0;
  let skippedClubEventCount = 0;

  for (const clubEvent of clubEvents) {
    const existingImages = await prisma.clubEventImage.findMany({
      where: { clubEventId: clubEvent.id },
      select: { order: true },
      orderBy: { order: "desc" },
    });

    if (existingImages.length > MAX_IMAGES_PER_CLUB_EVENT) {
      throw new Error(
        `Club event ${clubEvent.id} has more than ${MAX_IMAGES_PER_CLUB_EVENT} images.`,
      );
    }

    const hasCoverImage = existingImages.some(({ order }) => order === 0);
    const reservedCoverSlot = hasCoverImage ? 0 : 1;
    const availableImageSlots =
      MAX_IMAGES_PER_CLUB_EVENT -
      existingImages.length -
      reservedCoverSlot;

    if (availableImageSlots <= 0) {
      skippedClubEventCount += 1;
      continue;
    }

    const requestedImageCount = faker.number.int({
      min: MIN_IMAGES_TO_SEED,
      max: MAX_IMAGES_TO_SEED,
    });
    const imageCount = Math.min(requestedImageCount, availableImageSlots);
    let nextOrder = Math.max(existingImages[0]?.order ?? 0, 0) + 1;

    for (let index = 0; index < imageCount; index += 1) {
      const assetFileName = faker.helpers.arrayElement(assetFileNames);
      const extension = extname(assetFileName).toLowerCase();
      const mimeType = MIME_TYPES[extension]!;
      const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
      const imageId = uuidv4();
      const fileName = `${imageId}${extension}`;
      const objectKey = `${BUCKET_UPLOAD_DIR}/${clubEvent.id}/${fileName}`;
      const { size } = await stat(sourcePath);

      const [uploadedFile] = await bucket.upload(sourcePath, {
        destination: objectKey,
        metadata: { contentType: mimeType },
      });
      const imageUri = await getDownloadURL(uploadedFile);

      await prisma.$transaction(async (tx) => {
        await tx.image.create({
          data: {
            id: imageId,
            bucketName: bucket.name,
            fileName,
            imageUri,
            mimeType,
            sizeInBytes: size,
            objectKey,
          },
        });

        await tx.clubEventImage.create({
          data: {
            clubEventId: clubEvent.id,
            imageId,
            order: nextOrder,
          },
        });
      });

      nextOrder += 1;
      seededImageCount += 1;
    }
  }

  console.log(
    `${seededImageCount} images seeded for ${clubEvents.length} club events. ` +
      `${skippedClubEventCount} club events skipped because no image slots were available.`,
  );
}

try {
  await seedClubEventImages();
} finally {
  await prisma.$disconnect();
}
