// import socket from "../services/socket";

import { Socket } from "socket.io";
import { AuthService } from "../services/auth";
import { TaskController } from "../controllers/task.controller";
import { TaskRepo } from "../repos/task.repo";

function listen(socket: Socket) {
  socket.on("task_status_update", async (_arg1, data, callback) => {
    console.log("socket:task_status_update");

    try {
      const { id, role } = AuthService.verifySocket(data.token);
      console.log("Task status update authorized!", { id, role });

      await TaskController.updateTaskStatus(id, data.task).then(
        async (task) => {
          console.log("Task status updated", { task });
          callback({
            status: "ok",
            tasks: await TaskRepo.findProjectTasks(task.projectId),
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      callback({
        status: "ok",
        error: error.message,
      });
    }
  });

  socket.on("tasks", async (_arg1, data, callback) => {
    try {
      console.log("socket:tasks");
      AuthService.verifySocket(data.token);

      callback({
        status: "ok",
        tasks: await TaskRepo.findProjectTasks(data.projectId),
      });
    } catch (error) {
      console.log(error.message);
      callback({
        status: "ok",
        error: error.message,
      });
    }
  });
}

export default { listen };
