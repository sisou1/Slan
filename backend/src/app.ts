import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();

const corsOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/activities", activityRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
