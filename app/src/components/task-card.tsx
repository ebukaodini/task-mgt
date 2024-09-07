// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Priority, Task } from "../models/types";
import { useStore } from "../models/useStore";
import TaskDetailModal from "./task-detail-modal";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showingTask, showTask] = useState(false);

  return (
    <>
      {showingTask && <TaskDetailModal task={task} close={showTask} />}
      <div
        key={task.id}
        onClick={() => showTask(true)}
        draggable
        onDragStart={(event) => {
          useStore.getState().draggedTask = task;
        }}
        className="rounded p-3 hover:shadow-lg ease-linear border shadow-md bg-white border-white w-full flex flex-col gap-y-2 hover:cursor-pointer"
      >
        <div className="w-full flex align-middle justify-between">
          <h3 className="text-gray-500 font-bold text-md">{task.title}</h3>
          <span
            className={`${task.priority === Priority.LOW && "text-gray-500"}
            ${task.priority === Priority.HIGH && "text-yellow-500"}
            ${
              task.priority === Priority.URGENT && "text-red-500"
            } font-extrabold align-baseline text-[10px]`}
          >
            {task.priority}
          </span>
        </div>

        <p className="text-gray-500 text-sm">{task.description}</p>

        <p className="text-gray-500 text-xs">
          {task.assignee?.firstName} {task.assignee?.lastName}
        </p>
      </div>
    </>
  );
};

export default TaskCard;
