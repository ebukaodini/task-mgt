import { Task } from "./types";

type SignInCredentials = { email: string };
type SignUpCredentials = { firstName: string; lastName: string; email: string };

export interface StoreMethods {
  signOut: () => void;
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signUp: (credentials: SignUpCredentials) => Promise<any>;
  getProjects: () => Promise<any>;
  getProjectTasks: (projectId: string) => Promise<any>;
  getUsers: () => Promise<any>;
  createTask: (task: Task) => Promise<any>;
  updateTask: (task: Task) => Promise<any>;
  updateTaskStatus: (task: Task) => Promise<any>;
  deleteTask: (task: Task) => Promise<any>;
}
