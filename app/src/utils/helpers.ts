import { StoreState } from "../models/types";

export const initialStore: StoreState = {
  user: undefined,
  token: undefined,
  projects: undefined,
  users: [],
  pendingTasks: [],
  onGoingTasks: [],
  completedTasks: [],
  draggedTask: undefined,
};
