import {
  Task as DBTask,
  Priority,
  Project,
  TaskStatus,
  Timeline,
  User,
} from "prisma/prisma-client";

export class Task implements DBTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  projectId: string;
  project?: Project;
  assigneeId: string;
  assignee?: User;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  timelines?: Timeline[];
}
