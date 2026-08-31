import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

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

    await prisma.post.upsert({
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
  }

  console.log(`${posts.length} post seeded.`);
}

try {
  await seedPosts();
} finally {
  await prisma.$disconnect();
}
