import { Request, Response } from "express";
import { TaskRepo } from "../repos/task.repo";
import { TaskDto } from "../dtos/task.dto";
import IResponse from "../interfaces/IResponse";
import { Priority, TaskAction, TaskStatus, User } from "@prisma/client";
import { TimelineRepo } from "../repos/timeline.repo";
import { Task } from "../entities/task.entity";

export class TaskController {
  static async createTask(req: Request, res: Response): Promise<IResponse> {
    try {
      const userId = req.context.id;
      const data = TaskDto.fromJson(req.body);

      const task = await TaskRepo.create({
        ...data,
        status: TaskStatus.TODO,
        priority: data.priority ?? Priority.LOW,
      }).then(async (task) => {
        // add the initial task timelines
        await TimelineRepo.createMany(
          [
            {
              action: TaskAction.CREATED,
              actorId: userId,
              taskId: task.id,
            },
            {
              action: TaskAction.MOVED_TO_TODO,
              actorId: userId,
              taskId: task.id,
            },
          ].filter(Boolean)
        );

        return { ...task };
      });

      return res.success("Task created.", TaskDto.toJson(task));
    } catch (error: any) {
      return res.error("Task not created!", error.message);
    }
  }

  static async findProjectTasks(
    req: Request,
    res: Response
  ): Promise<IResponse> {
    try {
      const data = TaskDto.fromJson(req.query);

      const tasks = await TaskRepo.findProjectTasks(data.projectId);
      return res.success("All tasks.", TaskDto.toArray(tasks));
    } catch (error: any) {
      return res.error("Tasks not found!", error.message);
    }
  }

  static async updateTask(req: Request, res: Response): Promise<IResponse> {
    try {
      const userId = req.context.id;
      const taskId = TaskDto.fromJson(req.params).id;
      const data = TaskDto.fromJson(req.body);

      const task = await TaskRepo.update(taskId, data).then(async (task) => {
        await TimelineRepo.create({
          action: TaskAction.UPDATED,
          actorId: userId,
          taskId: task.id,
        });
        return task;
      });

      return res.success("Task updated.", TaskDto.toJson(task));
    } catch (error: any) {
      return res.error("Task not updated!", error.message);
    }
  }

  static async updateTaskStatus(userId: User["id"], task: Task): Promise<any> {
    try {
      return await TaskRepo.updateStatus(task.id, task.status).then(
        async (task) => {
          let statusAction: TaskAction;
          switch (task.status) {
            case TaskStatus.TODO:
              statusAction = TaskAction.MOVED_TO_TODO;
              break;
            case TaskStatus.IN_PROGRESS:
              statusAction = TaskAction.MOVED_TO_IN_PROGRESS;
              break;
            case TaskStatus.DONE:
              statusAction = TaskAction.MOVED_TO_DONE;
              break;
          }
          await TimelineRepo.create({
            action: statusAction,
            actorId: userId,
            taskId: task.id,
          });
          return task;
        }
      );
    } catch (error: any) {
      throw error;
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<IResponse> {
    try {
      const taskId = TaskDto.fromJson(req.params).id;
      await TaskRepo.delete(taskId);
      return res.success("Task deleted.");
    } catch (error: any) {
      return res.error("Task not deleted!", error.message);
    }
  }
}
