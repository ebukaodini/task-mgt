import { TaskDto } from "../dtos/task.dto";
import { Task } from "../entities/task.entity";
import { connectDb } from "../services/db";

export class TaskRepo {
  private static db = connectDb();
  private static tasks = this.db.task;
  private static timelines = this.db.timeline;

  static async create(
    task: TaskDto,
    dbTasks?: typeof this.tasks
  ): Promise<Task> {
    try {
      return (dbTasks ?? this.tasks).create({
        data: task,
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async findProjectTasks(
    projectId: Task["projectId"],
    dbTasks?: typeof this.tasks
  ): Promise<Task[]> {
    try {
      return (dbTasks ?? this.tasks).findMany({
        where: { projectId },
        select: {
          id: true,
          title: true,
          description: true,
          assignee: { select: { id: true, firstName: true, lastName: true } },
          priority: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          projectId: true,
          timelines: {
            select: {
              actor: { select: { firstName: true, lastName: true } },
              action: true,
              timestamp: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }) as any as Task[];
    } catch (error: any) {
      throw error;
    }
  }

  static async update(
    taskId: Task["id"],
    task: TaskDto,
    dbTasks?: typeof this.tasks
  ): Promise<Task> {
    try {
      return (dbTasks ?? this.tasks).update({
        where: { id: taskId },
        data: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assigneeId: task.assigneeId,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async updateStatus(
    taskId: Task["id"],
    status: TaskDto["status"],
    dbTasks?: typeof this.tasks
  ): Promise<Task> {
    try {
      return (dbTasks ?? this.tasks).update({
        where: { id: taskId },
        data: {
          status: status,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async delete(
    taskId: Task["id"],
    dbTasks?: typeof this.tasks,
    dbTimelines?: typeof this.timelines
  ): Promise<any> {
    try {
      const deleteTask = (dbTasks ?? this.tasks).delete({
        where: { id: taskId },
        include: { timelines: true },
      });
      const deleteTaskTimelines = (dbTimelines ?? this.timelines).deleteMany({
        where: { taskId },
      });

      return await this.db.$transaction([deleteTaskTimelines, deleteTask]);
    } catch (error: any) {
      console.log({ error });
      throw error;
    }
  }
}
