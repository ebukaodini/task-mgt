import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Task } from "../entities/task.entity";
import { Priority, TaskStatus } from "@prisma/client";
import { Exists } from "../validators/exists";

export class TaskDto {
  @Exists(
    { entity: "task", field: "id" },
    { message: "Task doesn't exist", groups: ["ID"] }
  )
  @IsMongoId({ message: "Invalid ID", groups: ["ID"] })
  id?: string;

  @Length(1, 50, {
    message: "Title must be 1 to 50 character length",
    groups: ["create", "update"],
  })
  @IsString({ message: "Title is invalid", groups: ["create", "update"] })
  @IsNotEmpty({ message: "Title is required", groups: ["create", "update"] })
  title: string;

  @IsString({ message: "Description is invalid", groups: ["create", "update"] })
  @IsNotEmpty({
    message: "Description is required",
    groups: ["create", "update"],
  })
  @IsOptional({ groups: ["create", "update"] })
  description: string;

  @Exists(
    { entity: "project", field: "id" },
    { message: "Project doesn't exist", groups: ["create", "fetch"] }
  )
  @IsMongoId({
    message: "Project ID is invalid",
    groups: ["create", "fetch"],
  })
  @IsNotEmpty({
    message: "Project ID is required",
    groups: ["create", "fetch"],
  })
  projectId: string;

  @Exists(
    { entity: "user", field: "id" },
    { message: "Assignee doesn't exist", groups: ["create", "update"] }
  )
  @IsMongoId({
    message: "Assignee ID is invalid",
    groups: ["create", "update"],
  })
  assigneeId: string;

  @IsEnum(Priority, {
    message: `Priority must be ${Object.values(Priority).join(", ")}`,
    groups: ["create"],
  })
  priority?: Priority;

  @IsEnum(TaskStatus, {
    message: `Status must be ${Object.values(TaskStatus).join(", ")}`,
    groups: ["status"],
  })
  status: TaskStatus;

  public static fromJson(data: { [key: string]: any }): TaskDto {
    const task: TaskDto = new TaskDto();

    if (data?.id) task.id = data.id;
    if (data?.title) task.title = data.title;
    if (data?.description) task.description = data.description;
    if (data?.projectId) task.projectId = data.projectId;
    if (data?.assigneeId) task.assigneeId = data.assigneeId;
    if (data?.status) task.status = data.status;
    if (data?.priority) task.priority = data.priority;
    if (data?.status) task.status = data.status;

    return task;
  }

  public static toJson(task: Task): object {
    if (!task) {
      return;
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      project: task.project,
      assigneeId: task.assigneeId,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,

      timelines: task.timelines,
    };
  }

  public static toArray(tasks: Task[]): object[] {
    return tasks.map((task) => this.toJson(task));
  }
}
