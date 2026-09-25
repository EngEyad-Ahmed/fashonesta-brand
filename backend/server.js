import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { pool } from "./src/config/db.js";
import routes from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middleware/error.js";
import { ensureGuest } from "./src/middleware/guest.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalhostOrigin(origin) {
  try {
    const hostname = new URL(origin).hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
        callback(null, true);
      } else {
        const err = new Error("أصل الطلب غير مسموح به");
        err.status = 403;
        callback(err);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(ensureGuest);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "محاولات كثيرة، حاولي بعد 15 دقيقة" },
  }),
);

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    });
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    name: "فاشونيستا للموضة | Fashionista API",
    version: "1.0.0",
    endpoints: [
      "GET  /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET  /api/auth/me",
      "GET  /api/products",
      "GET  /api/products/:id",
      "POST /api/products/:id/reviews",
      "GET  /api/cart",
      "PUT  /api/cart",
      "GET  /api/wishlist",
      "POST /api/wishlist/:id",
      "DELETE /api/wishlist/:id",
      "GET  /api/orders",
      "POST /api/orders",
      "POST /api/account/addresses",
      "PUT  /api/account/addresses/:id",
      "DELETE /api/account/addresses/:id",
      "POST /api/newsletter",
    ],
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, () => {
  console.log(`[fashionista] API running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[fashionista] Port ${PORT} is already in use. Change PORT in backend/.env`,
    );
    process.exit(1);
  }
  throw err;
});

async function shutdown() {
  console.log("[fashionista] shutting down...");
  try {
    await pool.end();
  } catch {
    // ignore pool close errors on exit
  }
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { app };