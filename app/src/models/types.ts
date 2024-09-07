export type Role = "ADMIN" | "USER";
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  tasks?: Task[];
  taskCount?: number;
};

export enum Priority {
  LOW = "LOW",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export type Task = {
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
};

export enum TaskAction {
  "CREATED" = "CREATED",
  "UPDATED" = "UPDATED",
  "DELETED" = "DELETED",
  "ASSIGNED" = "ASSIGNED",
  "MOVED_TO_TODO" = "MOVED_TO_TODO",
  "MOVED_TO_IN_PROGRESS" = "MOVED_TO_IN_PROGRESS",
  "MOVED_TO_DONE" = "MOVED_TO_DONE",
}

type Timeline = {
  id: string;
  action: TaskAction;
  actorId: string;
  actor?: User;
  taskId: string;
  timestamp: Date;
};

export type StoreState = {
  user?: User;
  token?: string;
  projects?: Project[];
  pendingTasks: Task[];
  onGoingTasks: Task[];
  completedTasks: Task[];
  draggedTask?: Task;
  users: User[];
};
