import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const clubEvents = Array.from({ length: 30 }).map(() => ({
  id: uuidv4(),
  eventTitle: faker.lorem.sentence({ min: 3, max: 8 }),
  eventDescription: faker.lorem.paragraphs(2),
  eventDate: faker.date.soon({ days: 90 }),
}));

async function seedClubEvents() {
  const clubs = await prisma.club.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (clubs.length === 0) {
    throw new Error(
      "Seed club events requires at least one club to be created first.",
    );
  }

  for (const [index, clubEvent] of clubEvents.entries()) {
    const club = clubs[index % clubs.length];

    if (!club) {
      throw new Error(
        "Seed club events requires at least one club to be created first.",
      );
    }

    await prisma.clubEvent.upsert({
      where: { id: clubEvent.id },
      update: {
        eventTitle: clubEvent.eventTitle,
        eventDescription: clubEvent.eventDescription,
        eventDate: clubEvent.eventDate,
        clubId: club.id,
      },
      create: {
        ...clubEvent,
        clubId: club.id,
      },
    });
  }

  console.log(`${clubEvents.length} club event seeded.`);
}

try {
  await seedClubEvents();
} finally {
  await prisma.$disconnect();
}
