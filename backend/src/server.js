import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chatRouter from "./routes/chat.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const app = express();
const port = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin || allowedOrigins.includes(origin)) {
    return true;
  }

  if (!isProduction) {
    try {
      const { hostname } = new URL(origin);
      return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
      return false;
    }
  }

  return false;
}

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-campus-chatbot-frontend.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(isProduction ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "campus-chatbot-api" });
});

app.use("/chat", chatRouter);


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    reply: "Something went wrong. Please try again in a moment.",
  });
});

const server = createServer(app);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the existing backend process or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  throw error;
});

server.listen(port, () => {
  console.log(`Campus chatbot API listening on http://localhost:${port}`);
});

export default app;
