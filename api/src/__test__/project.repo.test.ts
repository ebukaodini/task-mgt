import { beforeEach, describe, expect, test } from "@jest/globals";
import { Context, createMockContext, MockContext } from "./config";
import { ProjectRepo } from "../repos/project.repo";
import { faker } from "@faker-js/faker";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

const randomProject = () => {
  return {
    id: faker.string.hexadecimal({ length: 16 }),
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
    createdAt: faker.date.recent(),
  };
};

describe("Project Repo", () => {
  test("should create new project ", async () => {
    const project = randomProject();
    mockCtx.prisma.project.create.mockResolvedValue(project);

    await expect(
      ProjectRepo.create(project, ctx.prisma.project)
    ).resolves.toEqual(project);
  });

  test("should find all projects ", async () => {
    const projects = faker.helpers.multiple(randomProject, {
      count: 5,
    });
    mockCtx.prisma.project.findMany.mockResolvedValue(projects);

    await expect(ProjectRepo.findAll(ctx.prisma.project)).resolves.toEqual(
      projects
    );
  });
});
