"use client";

import { useDraggable } from "@dnd-kit/core";
import { TaskTypes } from "../../features/task/types";
import { useState } from "react";
import TaskModal from "./TaskModal";
import { EditOutlined } from "@ant-design/icons";

export default function TaskCard({ task }: { task: TaskTypes }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const [open, setOpen] = useState(false);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    border: "1px solid #ddd",
    padding: 12,
    marginBottom: 12,
    background: "#fff",
    borderRadius: 8,
    position: "relative" as const,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <div
          {...listeners}
          {...attributes}
          style={{
            cursor: "grab",
            fontSize: 12,
            color: "#888",
            marginBottom: 6,
          }}
        >
          Drag
        </div>

        <EditOutlined
          onClick={(e) => {
            e.stopPropagation(); // prevent drag interference
            setOpen(true);
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
            fontSize: 16,
            color: "#555",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        />

        <strong style={{ display: "block", marginBottom: 4 }}>
          {task.title}
        </strong>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          {task.description}
        </p>
      </div>

      <TaskModal task={task} open={open} setOpen={setOpen} />
    </>
  );
}
