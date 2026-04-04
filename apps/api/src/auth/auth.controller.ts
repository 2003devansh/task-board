import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";

export async function register(req: Request, res: Response) {
  const { email, password, workspaceName } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        name: workspaceName || "Workspace",
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        tenantId: tenant.id,
      },
    });

    const token = jwt.sign(
      { userId: user.id, tenantId: tenant.id },
      JWT_SECRET,
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error in register" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId },
      JWT_SECRET,
    );

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Error in login" });
  }
}
