import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { StoreMethods } from "./interface";
import { StoreState, TaskStatus, Task } from "./types";
import { APP_ID, BASE_URL } from "../utils/constants";
import { http } from "../utils/https";
import { initialStore } from "../utils/helpers";
import { AxiosResponse } from "axios";
import { useForm } from "../hooks/useForm";

export const useStore = create<StoreState & StoreMethods>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialStore,

        signOut: () => {
          set({
            ...initialStore,
          });
        },

        signIn: async (credentials) => {
          try {
            const req = new http(BASE_URL);
            return await req
              .post("/auth/sign-in", credentials)
              .then((resp: AxiosResponse) => {
                const respData = http.responseBody(resp).data;
                set({
                  user: respData.user,
                  token: respData.token,
                });
                return resp;
              });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },

        signUp: async (credentials) => {
          try {
            const req = new http(BASE_URL);
            return await req
              .post("/auth/sign-up", credentials)
              .then((resp: AxiosResponse) => {
                const respData = http.responseBody(resp).data;
                set({
                  user: respData.user,
                  token: respData.token,
                });
                return resp;
              });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },

        getProjects: async () => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req
              .get("/projects")
              .then((res) => {
                res = http.responseBody(res);

                set({
                  projects: res.data,
                });
              })
              .then(async () => {
                await get().getUsers();
              });
          } catch (error) {
            console.log(error);
          }
        },

        getProjectTasks: async (projectId) => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req.get("/tasks", { projectId }).then((res) => {
              res = http.responseBody(res);

              console.log({ tasks: res.data });

              set({
                pendingTasks: (res.data as Task[]).filter(
                  (task) => task.status === TaskStatus.TODO
                ),
                onGoingTasks: (res.data as Task[]).filter(
                  (task) => task.status === TaskStatus.IN_PROGRESS
                ),
                completedTasks: (res.data as Task[]).filter(
                  (task) => task.status === TaskStatus.DONE
                ),
              });
            });
          } catch (error) {
            console.log(error);
          }
        },

        getUsers: async () => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req.get("/users").then((res) => {
              res = http.responseBody(res);

              set({
                users: res.data,
              });
            });
          } catch (error) {
            console.log(error);
          }
        },

        createTask: async (task) => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req.post(`/tasks`, task).then(() => {
              get().getProjectTasks(task.projectId);
            });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },

        updateTask: async (task) => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req.patch(`/tasks/${task.id!}`, task).then(() => {
              get().getProjectTasks(task.projectId);
            });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },

        updateTaskStatus: async (task) => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req
              .patch(`/tasks/${task.id!}/status`, { status: task.status })
              .then(() => {
                get().getProjectTasks(task.projectId);
              });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },

        deleteTask: async (task) => {
          try {
            const req = new http(BASE_URL, {
              authorization: `Bearer ${get().token}`,
            });
            return await req.delete(`/tasks/${task.id}`).then(() => {
              get().getProjectTasks(task.projectId);
            });
          } catch (error: any) {
            useForm.getState().setErrors(error.response.data.errors);
            throw new Error(error.response.data.message);
          }
        },
      }),
      {
        name: `${APP_ID}:store`,
      }
    )
  )
);
