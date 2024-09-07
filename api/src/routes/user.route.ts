import express from "express";
import { UserController } from "../controllers/user.controller";
import { AuthService } from "../services/auth";

const userRoutes = express.Router();

userRoutes.get("/users", AuthService.authenticate, UserController.findAllUsers);

export default userRoutes;
