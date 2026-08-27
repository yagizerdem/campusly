import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const clubs = Array.from({ length: 8 }).map(() => {
  const id = uuidv4();
  const clubName = `${faker.company.name()} Club`;

  return {
    id,
    clubName,
    clubNormalizedName: `${faker.helpers.slugify(clubName).toLowerCase()}-${id}`,
    clubDescription: faker.lorem.paragraph(),
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

  for (const [index, club] of clubs.entries()) {
    const clubAdmin = profiles[index % profiles.length];

    if (!clubAdmin) {
      throw new Error(
        "Seed clubs requires at least one profile to be created first.",
      );
    }

    await prisma.club.upsert({
      where: { id: club.id },
      update: {
        clubName: club.clubName,
        clubNormalizedName: club.clubNormalizedName,
        clubDescription: club.clubDescription,
        clubAdminId: clubAdmin.id,
      },
      create: {
        ...club,
        clubAdminId: clubAdmin.id,
      },
    });
  }

  console.log(`${clubs.length} club seeded.`);
}

try {
  await seedClubs();
} finally {
  await prisma.$disconnect();
}
