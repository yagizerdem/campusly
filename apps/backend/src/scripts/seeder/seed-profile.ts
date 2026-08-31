import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/profile-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-profile-images/", import.meta.url),
);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const profiles = Array.from({ length: 50 }).map(() => ({
  id: uuidv4(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  telephoneNumber: faker.phone.number(),
  profileImageId: uuidv4(),
}));

async function seedProfile() {
  let assetFileNames: string[];

  try {
    assetFileNames = (await readdir(SEED_IMAGE_DIR))
      .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
      .sort();
  } catch (error) {
    throw new Error(
      `Profile seed image directory not found: ${SEED_IMAGE_DIR}. ` +
        "Create it and add JPG, PNG, or WebP profile images.",
      { cause: error },
    );
  }

  if (assetFileNames.length === 0) {
    throw new Error(
      `No profile images found in ${SEED_IMAGE_DIR}. ` +
        "Add at least one JPG, PNG, or WebP image.",
    );
  }

  const bucket = getStorage(firebaseApp).bucket();

  for (const [index, profile] of profiles.entries()) {
    const assetFileName = assetFileNames[index % assetFileNames.length];

    if (!assetFileName) {
      throw new Error("Unable to resolve a seed profile image.");
    }

    const extension = extname(assetFileName).toLowerCase();
    const mimeType = MIME_TYPES[extension]!;
    const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
    const fileName = `${profile.profileImageId}${extension}`;
    const objectKey = `${BUCKET_UPLOAD_DIR}/${profile.id}/${fileName}`;
    const { size } = await stat(sourcePath);

    const [uploadedFile] = await bucket.upload(sourcePath, {
      destination: objectKey,
      metadata: { contentType: mimeType },
    });
    const imageUri = await getDownloadURL(uploadedFile);

    try {
      await prisma.$transaction(async (tx) => {
        await tx.image.upsert({
          where: { id: profile.profileImageId },
          update: {
            bucketName: bucket.name,
            fileName,
            imageUri,
            mimeType,
            sizeInBytes: size,
            objectKey,
          },
          create: {
            id: profile.profileImageId,
            bucketName: bucket.name,
            fileName,
            imageUri,
            mimeType,
            sizeInBytes: size,
            objectKey,
          },
        });

        await tx.profile.upsert({
          where: { id: profile.id },
          update: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            telephoneNumber: profile.telephoneNumber,
            profileImageId: profile.profileImageId,
          },
          create: {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            telephoneNumber: profile.telephoneNumber,
            profileImageId: profile.profileImageId,
          },
        });
      });
    } catch (error) {
      await uploadedFile.delete({ ignoreNotFound: true });
      throw error;
    }
  }

  console.log(
    `${profiles.length} profiles seeded with images from ${assetFileNames.length} assets.`,
  );
}

try {
  await seedProfile();
} finally {
  await prisma.$disconnect();
}
