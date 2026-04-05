"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskTypes } from "../../features/task/types";
import TaskCard from "./TaskCard";

type Props = {
  status: TaskTypes["status"];
  title: string;
  tasks: TaskTypes[];
};

export default function TaskColumn({ status, title, tasks }: Props) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const filteredTasks = tasks.filter((t) => t.status === status);

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 300,
        border: "1px solid black",
        padding: 10,
      }}
    >
      <h3>{title}</h3>

      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
