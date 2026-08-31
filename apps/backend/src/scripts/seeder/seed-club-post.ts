import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const MIN_IMAGES_PER_POST = 0;
const MAX_IMAGES_PER_POST = 5;
const MAX_TOTAL_IMAGES_PER_POST = 20;
const BUCKET_UPLOAD_DIR = "seed/club-post-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-post-images/", import.meta.url),
);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const posts = Array.from({ length: 50 }).map(() => ({
  id: uuidv4(),
  postTitle: faker.lorem.sentence(),
  postContent: faker.lorem.paragraphs(2),
}));

async function seedPosts() {
  const clubCount = await prisma.club.count();
  if (clubCount === 0) {
    throw new Error(
      "Seed posts requires at least one club to be created first.",
    );
  }

  const assetFileNames = (await readdir(SEED_IMAGE_DIR))
    .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
    .sort();

  if (assetFileNames.length === 0) {
    throw new Error(`No seed post images found in ${SEED_IMAGE_DIR}.`);
  }

  const bucket = getStorage(firebaseApp).bucket();
  let seededImageCount = 0;
  let postsWithoutImagesCount = 0;

  for (const post of posts) {
    const randomIndex = Math.floor(Math.random() * clubCount);

    const club = await prisma.club.findFirst({
      skip: randomIndex,
      select: {
        id: true,
      },
    });

    if (!club) {
      throw new Error(
        "Seed posts requires at least one club to be created first.",
      );
    }

    // get club admin

    const clubAdmin = await prisma.clubMember.findFirst({
      where: {
        role: "ADMIN",
        clubId: club.id,
      },
    });

    if (!clubAdmin) {
      throw new Error(
        `Seed posts requires at least one club admin for club ${club.id}.`,
      );
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
        const objectKey = `${BUCKET_UPLOAD_DIR}/${post.id}/${fileName}`;
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
        await tx.post.upsert({
          where: { id: post.id },
          update: {
            postTitle: post.postTitle,
            postContent: post.postContent,
            clubId: club.id,
            authorId: clubAdmin.profileId,
          },
          create: {
            ...post,
            clubId: club.id,
            authorId: clubAdmin.profileId,
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
              postId: post.id,
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
    `${posts.length} club posts and ${seededImageCount} images seeded. ` +
      `${postsWithoutImagesCount} posts were seeded without images.`,
  );
}

try {
  await seedPosts();
} finally {
  await prisma.$disconnect();
}
