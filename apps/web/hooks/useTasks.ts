import { useEffect, useState } from "react";
import { TaskTypes } from "../features/task/types";
import { getTasks } from "../features/task/api";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();

      setTasks(res.tasks);
    } catch (err: any) {
      console.error("ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, setTasks, loading, error };
}
