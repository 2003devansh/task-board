import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
} from "../../../../packages/core/src/schemas/task.schema";

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const parsed = CreateTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...parsed,
        tenantId: req.user!.tenantId,
      },
    });

    return res.status(201).json({ task });
  } catch (error) {
    return res.status(400).json({ message: "Invalid input" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        tenantId: req.user!.tenantId,
      },
    });

    return res.json({ tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = UpdateTaskSchema.parse(req.body);

    const result = await prisma.task.updateMany({
      where: {
        id,
        tenantId: req.user!.tenantId,
      },
      data: parsed,
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task updated" });
  } catch {
    return res.status(400).json({ message: "Invalid input" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.task.deleteMany({
      where: {
        id,
        tenantId: req.user!.tenantId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
