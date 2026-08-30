import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";

const MAX_LIKES_PER_POST = 15;

async function seedLikes() {
  const [posts, profiles] = await Promise.all([
    prisma.post.findMany({ select: { id: true } }),
    prisma.profile.findMany({ select: { id: true } }),
  ]);

  if (posts.length === 0) {
    throw new Error("Seed likes requires at least one post to be created first.");
  }

  if (profiles.length === 0) {
    throw new Error(
      "Seed likes requires at least one profile to be created first.",
    );
  }

  const likes = posts.flatMap((post) => {
    const likeCount = faker.number.int({
      min: 1,
      max: Math.min(MAX_LIKES_PER_POST, profiles.length),
    });

    return faker.helpers
      .shuffle(profiles)
      .slice(0, likeCount)
      .map((profile) => ({
        postId: post.id,
        profileId: profile.id,
      }));
  });

  const result = await prisma.like.createMany({
    data: likes,
    skipDuplicates: true,
  });

  console.log(`${result.count} like seeded.`);
}

try {
  await seedLikes();
} finally {
  await prisma.$disconnect();
}
