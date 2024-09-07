import { ProjectDto } from "../dtos/project.dto";
import { Project } from "../entities/project.entity";
import { connectDb } from "../services/db";

export class ProjectRepo {
  private static db = connectDb();
  private static projects = this.db.project;

  static async create(
    project: ProjectDto,
    dbProjects?: typeof this.projects
  ): Promise<Project> {
    try {
      return (dbProjects ?? this.projects).create({ data: project });
    } catch (error: any) {
      throw error;
    }
  }

  static async findAll(dbProjects?: typeof this.projects): Promise<Project[]> {
    try {
      return await (dbProjects ?? this.projects).findMany({
        include: { tasks: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error: any) {
      throw error;
    }
  }
}
