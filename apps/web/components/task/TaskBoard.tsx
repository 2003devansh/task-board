"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";
import { TaskTypes } from "../../features/task/types";
import { apiFetch } from "../../lib/api";
import { Dispatch, SetStateAction } from "react";

type Props = {
  tasks: TaskTypes[];
  setTasks: Dispatch<SetStateAction<TaskTypes[]>>;
};

export default function TaskBoard({ tasks, setTasks }: Props) {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskTypes["status"];

    if (!["todo", "in_progress", "done"].includes(newStatus)) {
      console.error("Invalid drop target:", newStatus);
      return;
    }

    const previousTasks = tasks.map((t) => ({ ...t }));

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task,
    );

    setTasks(updatedTasks);

    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("API FAILED", err);
      setTasks(previousTasks);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: 20 }}>
        <TaskColumn status="todo" title="Todo" tasks={tasks} />
        <TaskColumn status="in_progress" title="In Progress" tasks={tasks} />
        <TaskColumn status="done" title="Done" tasks={tasks} />
      </div>
    </DndContext>
  );
}
