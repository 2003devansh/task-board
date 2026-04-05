// src/modules/task/task.routes.ts
import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./task.controller";
import { authMiddleware } from "../middleware/auth.middlware";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
