import { User } from "@prisma/client";
import { UserDto } from "../dtos/user.dto";
import { connectDb } from "../services/db";

export class UserRepo {
  private static db = connectDb();
  private static users = this.db.user;

  static async createUser(
    user: UserDto,
    dbUsers?: typeof this.users
  ): Promise<User> {
    try {
      return (dbUsers ?? this.users).create({
        data: { ...user, role: user.role! },
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findUserByEmail(
    email: User["email"],
    dbUsers?: typeof this.users
  ): Promise<User> {
    try {
      return (dbUsers ?? this.users).findUnique({ where: { email } });
    } catch (error: any) {
      throw error;
    }
  }

  static async findAll(dbUsers?: typeof this.users): Promise<User[]> {
    try {
      return (dbUsers ?? this.users).findMany({
        select: { firstName: true, lastName: true, id: true },
      }) as any as User[];
    } catch (error: any) {
      throw error;
    }
  }
}
