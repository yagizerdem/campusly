import "@src/load-env.js";
import { prisma } from "@src/lib/prisma.js";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const auditLogs = Array.from({ length: 50 }).map(() => ({
  id: uuidv4(),
  title: faker.lorem.sentence(),
  message: faker.lorem.paragraphs(2),
}));

async function seedAuditLogs() {
  const clubCount = await prisma.club.count();
  if (clubCount === 0) {
    throw new Error(
      "Seed audit logs requires at least one club to be created first.",
    );
  }

  for (const auditLog of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: auditLog.id },
      update: {
        title: auditLog.title,
        message: auditLog.message,
      },
      create: {
        ...auditLog,
      },
    });
  }

  console.log(`${auditLogs.length} audit logs seeded.`);
}

try {
  await seedAuditLogs();
} finally {
  await prisma.$disconnect();
}
