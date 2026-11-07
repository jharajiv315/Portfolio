import { validateUploads } from "./middlewares/uploadValidation.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import os from "os";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import timelineRouter from "./routes/timelineRouter.js";
import messageRouter from "./routes/messageRouter.js";
import skillRouter from "./routes/skillRouter.js";
import softwareApplicationRouter from "./routes/softwareApplicationRouter.js";
import projectRouter from "./routes/projectRouter.js";

import contentRouter, { publishedReadGuard } from "./routes/contentRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// Security: Hide server technology header & trust proxy for accurate client IP behind reverse proxies
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.PORTFOLIO_URL,
  process.env.DASHBOARD_URL,
  "https://portfolio-beta-ochre-90.vercel.app",
  "https://portfolio-dashboard-seven-delta.vercel.app",
  ...(process.env.NODE_ENV !== "production"
    ? [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ]
    : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or non-browser tools (no origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "token",
      "Token",
      "x-token",
      "Accept",
      "Origin",
    ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: 'This origin is not allowed.' });
  }
  next();
});
app.use(cookieParser());
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "Files must be smaller than 5 MB.",
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

app.use(validateUploads);

// Production health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

app.use("/api/v1/content", contentRouter);
if (process.env.STORAGE_DRIVER === "blob") app.use("/api/v1", publishedReadGuard);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

if (process.env.STORAGE_DRIVER !== "blob") dbConnection();
app.use(errorMiddleware);

export default app;