import { Request, Response } from "express";
import { ProjectRepo } from "../repos/project.repo";
import { ProjectDto } from "../dtos/project.dto";
import IResponse from "../interfaces/IResponse";

export class ProjectController {
  static async createProject(req: Request, res: Response): Promise<IResponse> {
    try {
      const data = ProjectDto.fromJson(req.body);
      const project = await ProjectRepo.create(data);
      return res.success("Project created.", ProjectDto.toJson(project));
    } catch (error: any) {
      return res.error("Project not created!", error.message);
    }
  }

  static async findAllProjects(
    req: Request,
    res: Response
  ): Promise<IResponse> {
    try {
      const projects = await ProjectRepo.findAll();
      return res.success("All projects.", ProjectDto.toArray(projects));
    } catch (error: any) {
      return res.error("Projects not found!", error.message);
    }
  }
}
