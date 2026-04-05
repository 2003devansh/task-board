import { apiFetch } from "../../lib/api";
import { TaskTypes } from "./types";

export async function getTasks() {
  return apiFetch<{ tasks: TaskTypes[] }>("/tasks");
}

export async function createTask(data: { title: string; description: string }) {
  return apiFetch<{ task: TaskTypes }>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
