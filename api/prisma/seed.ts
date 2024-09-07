import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
const db = new PrismaClient();

const projects = [
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
  },
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
  },
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
  },
  {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
  },
];

const users = [
  {
    firstName: "Jack",
    lastName: "Doe",
    email: "admin@example.com",
    role: Role.ADMIN,
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    role: Role.USER,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: Role.USER,
  },
];

async function main() {
  try {
    // seed users
    for await (const user of users) {
      const existingUser = await db.user.findFirst({
        where: { email: user.email },
      });

      if (existingUser) {
        await db.user.update({
          where: { email: user.email },
          data: user,
        });
      } else {
        await db.user.create({
          data: user,
        });
      }
    }

    // seed projects
    for await (const project of projects) {
      const existingProject = await db.project.findFirst({
        where: { title: project.title },
      });

      if (!existingProject) {
        await db.project.create({
          data: project,
        });
      }
    }
  } catch (error) {
    console.error(error);
    await db.$disconnect();
  } finally {
    await db.$disconnect();
    console.log("Database seeded successfully!");
  }
}

main();
