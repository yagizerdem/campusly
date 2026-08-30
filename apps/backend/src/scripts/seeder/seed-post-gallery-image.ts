import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/post-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-post-images/", import.meta.url),
);
const MIN_IMAGES_PER_POST = 2;
const MAX_IMAGES_PER_POST = 5;
const MAX_TOTAL_IMAGES_PER_POST = 20;

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function seedPostGalleryImages() {
  const posts = await prisma.post.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (posts.length === 0) {
    throw new Error(
      "Seed post gallery images requires at least one post to be created first.",
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
  let skippedPostCount = 0;

  for (const post of posts) {
    const existingImages = await prisma.postImage.findMany({
      where: { postId: post.id },
      select: { order: true },
      orderBy: { order: "desc" },
    });

    const availableImageSlots =
      MAX_TOTAL_IMAGES_PER_POST - existingImages.length;

    if (availableImageSlots <= 0) {
      skippedPostCount += 1;
      continue;
    }

    const requestedImageCount = faker.number.int({
      min: MIN_IMAGES_PER_POST,
      max: MAX_IMAGES_PER_POST,
    });
    const imageCount = Math.min(requestedImageCount, availableImageSlots);
    let nextOrder = (existingImages[0]?.order ?? -1) + 1;

    for (let index = 0; index < imageCount; index += 1) {
      const assetFileName = faker.helpers.arrayElement(assetFileNames);
      const extension = extname(assetFileName).toLowerCase();
      const mimeType = MIME_TYPES[extension]!;
      const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
      const imageId = uuidv4();
      const fileName = `${imageId}${extension}`;
      const objectKey = `${BUCKET_UPLOAD_DIR}/${post.id}/${fileName}`;
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

        await tx.postImage.create({
          data: {
            postId: post.id,
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
    `${seededImageCount} gallery images seeded for ${posts.length} posts. ` +
      `${skippedPostCount} posts skipped because they already have 20 images.`,
  );
}

try {
  await seedPostGalleryImages();
} finally {
  await prisma.$disconnect();
}
