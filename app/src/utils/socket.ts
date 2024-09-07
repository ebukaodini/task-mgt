import { io } from "socket.io-client";
import { Task, TaskStatus } from "../models/types";
import { useStore } from "../models/useStore";

export const useSocket = () => {
  const connect = () => {
    const socket = io(process.env.REACT_APP_SOCKET_URL!, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Successfully connected to the server.", socket.id);
    });

    return socket;
  };

  const updateTaskStatus = (task: Partial<Task>) => {
    const socket = connect();
    socket.emit(
      "task_status_update",
      1,
      { token: useStore.getState().token, task },
      (response: any) => {
        if (response.error) {
          alert("Failed to update task status.");

          console.error("Failed to update task status:", response.error);
        } else {
          const tasks = response.tasks;
          useStore.setState({
            pendingTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.TODO
            ),
            onGoingTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.IN_PROGRESS
            ),
            completedTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.DONE
            ),
          });
        }
      }
    );
  };

  const getTasks = (projectId: Task["projectId"]) => {
    const socket = connect();
    socket.emit(
      "tasks",
      1,
      { token: useStore.getState().token, projectId },
      (response: any) => {
        if (response.error) {
          console.error("Failed to fetch tasks", response.error);
        } else {
          const tasks = response.tasks;
          useStore.setState({
            pendingTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.TODO
            ),
            onGoingTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.IN_PROGRESS
            ),
            completedTasks: (tasks as Task[]).filter(
              (task) => task.status === TaskStatus.DONE
            ),
          });
        }
      }
    );
  };

  return { updateTaskStatus, getTasks };
};
