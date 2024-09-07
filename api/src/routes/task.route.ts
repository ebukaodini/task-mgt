import express from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskDto } from "../dtos/task.dto";
import { validator } from "../middlewares";
import { AuthService } from "../services/auth";
import { Role } from "@prisma/client";

const taskRoutes = express.Router();

taskRoutes.post(
  "/tasks",
  AuthService.authenticate,
  validator(TaskDto, "create"),
  TaskController.createTask
);
taskRoutes.get(
  "/tasks",
  AuthService.authenticate,
  validator(TaskDto, "fetch", "query"),
  TaskController.findProjectTasks
);
taskRoutes.patch(
  "/tasks/:id",
  AuthService.authenticate,
  validator(TaskDto, "ID", "params"),
  validator(TaskDto, "update"),
  TaskController.updateTask
);
taskRoutes.delete(
  "/tasks/:id",
  AuthService.authenticate,
  AuthService.authorize([Role.ADMIN]),
  validator(TaskDto, "ID", "params"),
  TaskController.deleteTask
);

export default taskRoutes;
