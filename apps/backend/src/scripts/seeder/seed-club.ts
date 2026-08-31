import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/club-logo-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-club-logo-images/", import.meta.url),
);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const clubs = Array.from({ length: 8 }).map(() => {
  const id = uuidv4();
  const clubName = `${faker.company.name()} Club`;

  return {
    id,
    clubName,
    clubNormalizedName: `${faker.helpers.slugify(clubName).toLowerCase()}`,
    clubDescription: faker.lorem.paragraph(),
    logoImageId: uuidv4(),
  };
});

async function seedClubs() {
  const profiles = await prisma.profile.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (profiles.length === 0) {
    throw new Error(
      "Seed clubs requires at least one profile to be created first.",
    );
  }

  const assetFileNames = (await readdir(SEED_IMAGE_DIR))
    .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
    .sort();

  if (assetFileNames.length === 0) {
    throw new Error(`No seed club logo images found in ${SEED_IMAGE_DIR}.`);
  }

  const bucket = getStorage(firebaseApp).bucket();

  for (const [index, club] of clubs.entries()) {
    const clubAdmin = profiles[index % profiles.length];
    const assetFileName = assetFileNames[index % assetFileNames.length];

    if (!clubAdmin || !assetFileName) {
      throw new Error("Seed clubs requires a profile and a club logo image.");
    }

    const extension = extname(assetFileName).toLowerCase();
    const mimeType = MIME_TYPES[extension]!;
    const sourcePath = resolve(SEED_IMAGE_DIR, assetFileName);
    const fileName = `${club.logoImageId}${extension}`;
    const objectKey = `${BUCKET_UPLOAD_DIR}/${club.id}/${fileName}`;
    const { size } = await stat(sourcePath);

    const [uploadedFile] = await bucket.upload(sourcePath, {
      destination: objectKey,
      metadata: { contentType: mimeType },
    });
    const imageUri = await getDownloadURL(uploadedFile);

    try {
      await prisma.$transaction(async (tx) => {
        // creat club logo image
        await tx.image.upsert({
          where: { id: club.logoImageId },
          update: {
            bucketName: bucket.name,
            fileName,
            imageUri,
            mimeType,
            sizeInBytes: size,
            objectKey,
          },
          create: {
            id: club.logoImageId,
            bucketName: bucket.name,
            fileName,
            imageUri,
            mimeType,
            sizeInBytes: size,
            objectKey,
          },
        });

        // creat club
        await tx.club.upsert({
          where: { id: club.id },
          update: {
            clubName: club.clubName,
            clubNormalizedName: club.clubNormalizedName,
            clubDescription: club.clubDescription,
            clubLogoId: club.logoImageId,
            clubLogoUri: imageUri,
          },
          create: {
            id: club.id,
            clubName: club.clubName,
            clubNormalizedName: club.clubNormalizedName,
            clubDescription: club.clubDescription,
            clubLogoId: club.logoImageId,
            clubLogoUri: imageUri,
          },
        });

        // add club admin role
        await tx.clubMember.upsert({
          where: {
            profileId_clubId: {
              profileId: clubAdmin.id,
              clubId: club.id,
            },
          },
          update: {
            role: "ADMIN",
          },
          create: {
            clubId: club.id,
            profileId: clubAdmin.id,
            role: "ADMIN",
          },
        });
      });
    } catch (error) {
      await uploadedFile.delete({ ignoreNotFound: true });
      throw error;
    }
  }

  console.log(
    `${clubs.length} clubs seeded with logos from ${assetFileNames.length} assets.`,
  );
}

try {
  await seedClubs();
} finally {
  await prisma.$disconnect();
}
