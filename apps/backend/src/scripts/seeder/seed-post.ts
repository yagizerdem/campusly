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
        clubAdminId: true,
      },
    });

    if (!club) {
      throw new Error(
        "Seed posts requires at least one club to be created first.",
      );
    }

    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        postTitle: post.postTitle,
        postContent: post.postContent,
        clubId: club.id,
        authorId: club.clubAdminId,
      },
      create: {
        ...post,
        clubId: club.id,
        authorId: club.clubAdminId,
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
