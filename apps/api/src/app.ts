// src/app.ts
import express from "express";
import authRoutes from "./auth/auth.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

export default app;
