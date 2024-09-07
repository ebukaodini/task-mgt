import { Project as DBProject, Task } from "prisma/prisma-client";

export class Project implements DBProject {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks?: Task[];
  taskCount?: number;
}
