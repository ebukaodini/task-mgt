import { Request, Response } from "express";
import { UserRepo } from "../repos/user.repo";
import { UserDto } from "../dtos/user.dto";
import IResponse from "../interfaces/IResponse";

export class UserController {
  static async findAllUsers(req: Request, res: Response): Promise<IResponse> {
    try {
      const users = await UserRepo.findAll();
      return res.success("All users.", UserDto.toArray(users));
    } catch (error: any) {
      return res.error("Users not found!", error.message);
    }
  }

  static async fetchUsers(req: Request, res: Response): Promise<IResponse> {
    try {
      const users = await UserRepo.findAll();
      console.log({ users });
      return res.success("All users.", UserDto.toArray(users));
    } catch (error: any) {
      return res.error("Users not found!");
    }
  }
}
