import { Task, TaskStatus } from "../models/types";
import { useStore } from "../models/useStore";
import { useSocket } from "../utils/socket";
import TaskCard from "./task-card";

interface TaskListProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ title, status, tasks }) => {
  const { updateTaskStatus } = useSocket();

  const handleTaskStatusUpdate = async () => {
    const task = useStore.getState().draggedTask!;
    if (task?.status === status) return;

    updateTaskStatus({ id: task.id, status });
  };

  return (
    <div
      key={status}
      onDragOver={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
      onDrop={handleTaskStatusUpdate}
      className="h-full w-[30%]"
    >
      <div className="h-full w-full p-0 rounded bg-gray-200 flex flex-col gap-y-3 pb-10 overflow-auto -scroll-m-10">
        <div className="w-full p-3 bg-gray-200 sticky top-0">
          <h2 className="font-extrabold text-md text-gray-500">{title}</h2>
        </div>

        <div className="p-3 flex flex-col gap-y-3">
          {tasks?.length! > 0 ? (
            tasks?.map((task) => <TaskCard task={task} key={task.id} />)
          ) : (
            <p className="text-gray-500 inline-flex justify-center text-sm py-10">
              No tasks found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
