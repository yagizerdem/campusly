import "@src/load-env.js";
import { firebaseApp } from "@src/firebase.js";
import { prisma } from "@src/lib/prisma.js";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { readdir, stat } from "node:fs/promises";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";
import { v5 as uuidv5 } from "uuid";

const BUCKET_UPLOAD_DIR = "seed/post-images";
const SEED_IMAGE_DIR = fileURLToPath(
  new URL("../../../assets/seed-post-images/", import.meta.url),
);

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function seedPostImages() {
  const posts = await prisma.post.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (posts.length === 0) {
    throw new Error(
      "Seed post images requires at least one post to be created first.",
    );
  }

  const assetFileNames = (await readdir(SEED_IMAGE_DIR))
    .filter((fileName) => MIME_TYPES[extname(fileName).toLowerCase()])
    .sort();

  if (assetFileNames.length === 0) {
    throw new Error(`No seed images found in ${SEED_IMAGE_DIR}.`);
  }

  const bucket = getStorage(firebaseApp).bucket();

  for (const [index, post] of posts.entries()) {
    const assetFileName = assetFileNames[index % assetFileNames.length]!;
    const extension = extname(assetFileName).toLowerCase();
    const mimeType = MIME_TYPES[extension]!;
    const sourcePath = fileURLToPath(
      new URL(
        `../../../assets/seed-post-images/${assetFileName}`,
        import.meta.url,
      ),
    );
    const fileName = `${post.id}${extension}`;
    const objectKey = `${BUCKET_UPLOAD_DIR}/${fileName}`;
    const imageId = uuidv5(objectKey, uuidv5.URL);
    const { size } = await stat(sourcePath);

    const [uploadedFile] = await bucket.upload(sourcePath, {
      destination: objectKey,
      metadata: { contentType: mimeType },
    });
    const imageUri = await getDownloadURL(uploadedFile);

    await prisma.$transaction(async (tx) => {
      await tx.image.upsert({
        where: { id: imageId },
        update: {
          bucketName: bucket.name,
          fileName,
          imageUri,
          mimeType,
          sizeInBytes: size,
          objectKey,
        },
        create: {
          id: imageId,
          bucketName: bucket.name,
          fileName,
          imageUri,
          mimeType,
          sizeInBytes: size,
          objectKey,
        },
      });

      await tx.postImage.upsert({
        where: {
          postId_imageId: {
            postId: post.id,
            imageId,
          },
        },
        update: { order: 0 },
        create: {
          postId: post.id,
          imageId,
          order: 0,
        },
      });
    });
  }

  console.log(
    `${posts.length} post image seeded from ${assetFileNames.length} assets.`,
  );
}

try {
  await seedPostImages();
} finally {
  await prisma.$disconnect();
}
