import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const profiles = Array.from({ length: 50 }).map(() => ({
  id: uuidv4(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  telephoneNumber: faker.phone.number(),
}));

async function seedProfile() {
  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { id: profile.id },
      update: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        telephoneNumber: profile.telephoneNumber,
      },
      create: profile,
    });
  }

  console.log(`${profiles.length} profile seeded.`);
}

try {
  await seedProfile();
} finally {
  await prisma.$disconnect();
}
