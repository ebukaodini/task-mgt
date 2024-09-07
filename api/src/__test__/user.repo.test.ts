import { beforeEach, describe, expect, test } from "@jest/globals";
import { Context, createMockContext, MockContext } from "../__test__/config";
import { UserRepo } from "../repos/user.repo";
import { Role } from "@prisma/client";
import { faker } from "@faker-js/faker";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

const randomUser = () => {
  return {
    id: faker.string.hexadecimal({ length: 16 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: Role.USER,
    createdAt: faker.date.recent(),
  };
};

describe("User Repo", () => {
  test("should create new user ", async () => {
    const user = randomUser();
    mockCtx.prisma.user.create.mockResolvedValue(user);

    await expect(UserRepo.createUser(user, ctx.prisma.user)).resolves.toEqual(
      user
    );
  });

  test("should find a user by email ", async () => {
    const user = randomUser();
    mockCtx.prisma.user.findUnique.mockResolvedValue(user);

    await expect(
      UserRepo.findUserByEmail(user.email, ctx.prisma.user)
    ).resolves.toEqual(user);
  });

  test("should find all users ", async () => {
    const users = faker.helpers.multiple(randomUser, {
      count: 5,
    });
    mockCtx.prisma.user.findMany.mockResolvedValue(users);

    await expect(UserRepo.findAll(ctx.prisma.user)).resolves.toEqual(users);
  });
});
