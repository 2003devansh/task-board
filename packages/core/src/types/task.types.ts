export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
