import React, { FormEvent, useEffect, useState } from "react";
import { useStore } from "../models/useStore";
import { Priority, Task } from "../models/types";
import { useForm } from "../hooks/useForm";
import moment from "moment";

interface TaskDetailModalProps {
  task: Task;
  close: (showingTask: boolean) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, close }) => {
  const {
    isSubmitting,
    submitting,
    credentials,
    setCredentials,
    setCredential,
    errors,
  } = useForm();
  const [errorMsg, setErrorMsg] = useState<string>();
  const { users, updateTask, deleteTask } = useStore();

  const handleTaskUpdate = (e: FormEvent) => {
    e.preventDefault();
    submitting(true);

    updateTask(credentials)
      .then(() => {
        submitting(false);
        close(false);
      })
      .catch((error) => {
        submitting(false);
        setErrorMsg(error.message);
        console.log({ error });
      });
  };

  const handleDeleteTask = (e: FormEvent) => {
    e.preventDefault();
    submitting(true);

    deleteTask(task)
      .then(() => {
        submitting(false);
        close(false);
      })
      .catch((error) => {
        submitting(false);
        setErrorMsg(error.message);
        console.log({ error });
      });
  };

  useEffect(() => {
    setCredentials({
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assigneeId: task.assignee!.id,
    });
  }, [
    setCredentials,
    task.assignee,
    task.assigneeId,
    task.description,
    task.id,
    task.priority,
    task.projectId,
    task.status,
    task.title,
  ]);

  return (
    <div
      className="absolute top-0 left-0 min-h-screen min-w-full flex flex-col items-center justify-center bg-black/20"
      style={{ zIndex: 1 }}
    >
      <form
        onSubmit={handleTaskUpdate}
        className="flex flex-col items-start justify-start w-2/5 min-h-[45vh] bg-white shadow-xl rounded-md gap-y-5 p-5"
      >
        {errorMsg?.length! > 0 && (
          <div className="bg-red-100 p-2 text-xs text-red-500 font-semibold">
            {errorMsg} <br />
            {errors ? (
              Object.values(errors).map((error: any) => <li>{error}</li>)
            ) : (
              <></>
            )}
          </div>
        )}

        <input
          id="title"
          placeholder="Title"
          className="border-2 border-gray-200 rounded text-4xl text-gray-500 py-2 px-4 w-full"
          disabled={isSubmitting}
          onChange={(e) => setCredential("title", e.target.value)}
          defaultValue={task.title}
        />

        <div className="w-full flex gap-5 justify-between">
          <div className="w-full flex flex-col gap-y-5">
            <textarea
              id="description"
              placeholder="Task description"
              className="border-2 border-gray-200 rounded text-gray-500 text-sm py-2 px-4 w-full"
              disabled={isSubmitting}
              onChange={(e) => setCredential("description", e.target.value)}
              defaultValue={task.description}
            />

            <div className="w-full flex justify-start gap-3">
              <select
                id="priority"
                className="border-2 border-gray-200 rounded text-gray-500 text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("priority", e.target.value)}
                defaultValue={task.priority}
              >
                {Object.values(Priority).map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>

              <select
                id="assignee"
                className="border-2 border-gray-200 rounded text-gray-500 text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("assigneeId", e.target.value)}
                defaultValue={task.assignee!.id}
              >
                {users.map((user) => (
                  <option value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-gray-600 font-normal text-xs">
              last updated {moment(task.updatedAt).fromNow()}
            </span>

            <div className="flex justify-between gap-3">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white rounded font-semibold text-md py-1 px-5 w-fit"
                >
                  Save
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => close(false)}
                  className="bg-gray-500 text-white rounded font-semibold text-md py-1 px-3 w-fit"
                >
                  Cancel
                </button>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDeleteTask}
                className="bg-red-500 text-white rounded font-semibold text-md py-1 px-3 w-fit"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="w-1/3 max-h-80 overflow-auto flex flex-col gap-1">
            <span className="text-gray-600 font-semibold text-xs">History</span>
            <div className="w-full max-h-80 overflow-auto flex flex-col gap-1">
              {task.timelines!.map((timeline) => (
                <div
                  key={timeline.id}
                  className="bg-gray-100 px-2 py-1 rounded flex flex-col"
                >
                  <span className="text-gray-600 font-semibold text-xs">
                    {timeline.action.replaceAll("_", " ")} by{" "}
                    {timeline.actor?.firstName} {timeline.actor?.lastName}
                  </span>
                  <span className="text-gray-600 font-normal text-xs">
                    {moment(timeline.timestamp).fromNow()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskDetailModal;
