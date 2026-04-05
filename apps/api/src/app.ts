import "dotenv/config"; // src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import taskRoutes from "./task/task.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

export default app;
