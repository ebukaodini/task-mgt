import { beforeEach, describe, expect, test } from "@jest/globals";
import { Context, createMockContext, MockContext } from "../__test__/config";
import { TaskRepo } from "../repos/task.repo";
import { Priority, Role, TaskStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

const projectId = faker.string.hexadecimal({ length: 16 });
const randomTask = () => {
  return {
    id: faker.string.hexadecimal({ length: 16 }),
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
    priority: Priority.LOW,
    projectId: faker.string.hexadecimal({ length: 16 }),
    assigneeId: faker.string.hexadecimal({ length: 16 }),
    status: TaskStatus.TODO,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
};

describe("Task Repo", () => {
  test("should create new task ", async () => {
    const task = randomTask();
    mockCtx.prisma.task.create.mockResolvedValue(task);

    await expect(TaskRepo.create(task, ctx.prisma.task)).resolves.toEqual(task);
  });

  test("should find all project tasks ", async () => {
    const tasks = faker.helpers.multiple(randomTask, {
      count: 5,
    });
    mockCtx.prisma.task.findMany.mockResolvedValue(tasks);

    await expect(
      TaskRepo.findProjectTasks(projectId, ctx.prisma.task)
    ).resolves.toEqual(tasks);
  });

  test("should update a task ", async () => {
    const task = randomTask();
    mockCtx.prisma.task.update.mockResolvedValue(task);

    await expect(
      TaskRepo.update(task.id, task, ctx.prisma.task)
    ).resolves.toEqual(task);
  });

  test("should update a task status ", async () => {
    const task = randomTask();
    mockCtx.prisma.task.update.mockResolvedValue(task);

    await expect(
      TaskRepo.updateStatus(task.id, task.status, ctx.prisma.task)
    ).resolves.toEqual(task);
  });
});
