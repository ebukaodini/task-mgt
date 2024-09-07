import express from "express";
import { ProjectController } from "../controllers/project.controller";
import { ProjectDto } from "../dtos/project.dto";
import { validator } from "../middlewares";
import { AuthService } from "../services/auth";
import { Role } from "@prisma/client";

const projectRoutes = express.Router();

projectRoutes.post(
  "/projects",
  AuthService.authenticate,
  AuthService.authorize([Role.ADMIN]),
  validator(ProjectDto, "create"),
  ProjectController.createProject
);
projectRoutes.get(
  "/projects",
  AuthService.authenticate,
  ProjectController.findAllProjects
);
// projectRoutes.delete("/projects/:projectId", ProjectController.deleteProject);

export default projectRoutes;
