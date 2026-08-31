import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const USER_POST_COUNT = 50;
const MIN_IMAGES_PER_POST = 0;
const MAX_IMAGES_PER_POST = 5;
const MAX_TOTAL_IMAGES_PER_POST = 20;
const BUCKET_UPLOAD_DIR = "seed/user-post-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-post-images/", import.meta.url),
);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const userPosts = Array.from({ length: USER_POST_COUNT }).map(() => ({
  id: uuidv4(),
  postTitle: faker.lorem.sentence({ min: 3, max: 10 }),
  postContent: faker.lorem.paragraphs({ min: 1, max: 3 }),
}));

async function seedUserPosts() {
  const profiles = await prisma.profile.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (profiles.length === 0) {
    throw new Error(
      "Seed user posts requires at least one profile to be created first.",
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
  let postsWithoutImagesCount = 0;

  for (const [index, userPost] of userPosts.entries()) {
    const profile = profiles[index % profiles.length];

    if (!profile) {
      throw new Error("Unable to resolve a profile.");
    }

    const requestedImageCount = faker.number.int({
      min: MIN_IMAGES_PER_POST,
      max: MAX_IMAGES_PER_POST,
    });
    const imageCount = Math.min(
      requestedImageCount,
      MAX_TOTAL_IMAGES_PER_POST,
    );

    const uploadedImages = await Promise.all(
      Array.from({ length: imageCount }).map(async () => {
        const assetFileName = faker.helpers.arrayElement(assetFileNames);
        const extension = extname(assetFileName).toLowerCase();
        const mimeType = MIME_TYPES[extension]!;
        const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
        const imageId = uuidv4();
        const fileName = `${imageId}${extension}`;
        const objectKey = `${BUCKET_UPLOAD_DIR}/${userPost.id}/${fileName}`;
        const { size } = await stat(sourcePath);

        const [uploadedFile] = await bucket.upload(sourcePath, {
          destination: objectKey,
          metadata: { contentType: mimeType },
        });

        return {
          id: imageId,
          bucketName: bucket.name,
          fileName,
          imageUri: await getDownloadURL(uploadedFile),
          mimeType,
          sizeInBytes: size,
          objectKey,
          uploadedFile,
        };
      }),
    );

    try {
      await prisma.$transaction(async (tx) => {
        await tx.post.create({
          data: {
            ...userPost,
            authorId: profile.id,
            clubId: null,
          },
        });

        for (const [order, image] of uploadedImages.entries()) {
          await tx.image.create({
            data: {
              id: image.id,
              bucketName: image.bucketName,
              fileName: image.fileName,
              imageUri: image.imageUri,
              mimeType: image.mimeType,
              sizeInBytes: image.sizeInBytes,
              objectKey: image.objectKey,
            },
          });

          await tx.postImage.create({
            data: {
              postId: userPost.id,
              imageId: image.id,
              order,
            },
          });
        }
      });

      seededImageCount += uploadedImages.length;
      if (uploadedImages.length === 0) {
        postsWithoutImagesCount += 1;
      }
    } catch (error) {
      await Promise.all(
        uploadedImages.map(({ uploadedFile }) =>
          uploadedFile.delete({ ignoreNotFound: true }),
        ),
      );
      throw error;
    }
  }

  console.log(
    `${userPosts.length} user posts and ${seededImageCount} images seeded with null club IDs. ` +
      `${postsWithoutImagesCount} posts were seeded without images.`,
  );
}

try {
  await seedUserPosts();
} finally {
  await prisma.$disconnect();
}
