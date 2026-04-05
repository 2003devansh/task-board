"use client";

import TaskBoard from "../../../components/task/TaskBoard";
import CreateTaskForm from "../../../components/task/CreateTaskForm";
import { useTasks } from "../../../hooks/useTasks";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { tasks, loading, error, setTasks } = useTasks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Board</h1>

      <CreateTaskForm tasks={tasks} setTasks={setTasks} />
      <TaskBoard tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
