import express from "express";
import { UserDto } from "../dtos/user.dto";
import { validator } from "../middlewares";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post(
  "/auth/sign-up",
  validator(UserDto, "create"),
  AuthController.signUp
);
authRoutes.post(
  "/auth/sign-in",
  validator(UserDto, "authenticate"),
  AuthController.signIn
);

export default authRoutes;
