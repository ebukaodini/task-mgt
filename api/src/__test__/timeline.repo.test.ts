import { beforeEach, describe, expect, test } from "@jest/globals";
import { Context, createMockContext, MockContext } from "../__test__/config";
import { TimelineRepo } from "../repos/timeline.repo";
import { faker } from "@faker-js/faker";
import { TaskAction } from "@prisma/client";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

export const randomTimeline = () => {
  return {
    id: faker.string.hexadecimal({ length: 16 }),
    action: TaskAction.CREATED,
    actorId: faker.string.hexadecimal({ length: 16 }),
    taskId: faker.string.hexadecimal({ length: 16 }),
    timestamp: faker.date.recent(),
  };
};

describe("Timeline Repo", () => {
  test("should create new timeline ", async () => {
    const timeline = randomTimeline();
    mockCtx.prisma.timeline.create.mockResolvedValue(timeline);

    await expect(
      TimelineRepo.create(timeline, ctx.prisma.timeline)
    ).resolves.toEqual(timeline);
  });

  test("should create many timelines ", async () => {
    const timelines = faker.helpers.multiple(randomTimeline, {
      count: 5,
    });
    mockCtx.prisma.timeline.createMany.mockResolvedValue(timelines as any);

    await expect(
      TimelineRepo.createMany(timelines, ctx.prisma.timeline)
    ).resolves.toEqual(timelines);
  });
});
