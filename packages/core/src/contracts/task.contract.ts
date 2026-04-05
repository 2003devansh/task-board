import { Task } from "../types/task.types";

export interface CreateTaskResponse {
  task: Task;
}

export interface GetTasksResponse {
  tasks: Task[];
}
