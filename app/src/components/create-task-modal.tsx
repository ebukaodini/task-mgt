import React, { FormEvent, useEffect, useState } from "react";
import { useStore } from "../models/useStore";
import { Priority, Task } from "../models/types";
import { useForm } from "../hooks/useForm";

interface CreateTaskModalProps {
  projectId: Task["projectId"];
  close: (showingTask: boolean) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  projectId,
  close,
}) => {
  const {
    isSubmitting,
    submitting,
    credentials,
    setCredentials,
    setCredential,
    errors,
  } = useForm();
  const [errorMsg, setErrorMsg] = useState<string>();
  const { users, createTask } = useStore();

  const handleTaskUpdate = (e: FormEvent) => {
    e.preventDefault();
    submitting(true);

    createTask(credentials)
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
      projectId: projectId,
      priority: Priority.LOW,
      assigneeId: users[0].id,
    });
  }, [projectId, setCredentials, users]);

  return (
    <div
      className="absolute top-0 left-0 min-h-screen min-w-full flex flex-col items-center justify-center bg-black/20"
      style={{ zIndex: 1 }}
    >
      <form
        onSubmit={handleTaskUpdate}
        className="flex flex-col items-start justify-start w-1/4 min-h-[45vh] bg-white shadow-xl rounded-md gap-y-5 p-5"
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
        />

        <div className="w-full flex flex-col gap-y-5">
          <textarea
            id="description"
            placeholder="Task description"
            className="border-2 border-gray-200 rounded text-gray-500 text-sm py-2 px-4 w-full"
            disabled={isSubmitting}
            onChange={(e) => setCredential("description", e.target.value)}
          />

          <div className="w-full flex justify-start gap-3">
            <select
              id="priority"
              className="border-2 border-gray-200 rounded text-gray-500 text-sm py-2 px-4 w-full"
              disabled={isSubmitting}
              onChange={(e) => setCredential("priority", e.target.value)}
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
            >
              {users.map((user) => (
                <option value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

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
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
