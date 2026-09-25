import { pool } from "../config/db.js";
import { verifyToken } from "../utils/token.js";

const TOKEN_COOKIE = "fashionista_token";

function extractToken(req) {
  if (req.cookies && req.cookies[TOKEN_COOKIE]) {
    return req.cookies[TOKEN_COOKIE];
  }

  const header = req.headers.authorization || "";

  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }

  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "مطلوب تسجيل الدخول" });
    }

    const payload = verifyToken(token);
    const [rows] = await pool.query(
      `SELECT
         id,
         name,
         phone,
         created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [String(payload.sub)],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "الحساب غير موجود" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "انتهت الجلسة، سجلي الدخول مرة أخرى" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "رمز الدخول غير صالح" });
    }

    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = verifyToken(token);
      const [rows] = await pool.query(
        "SELECT id, name, phone FROM users WHERE id = ? LIMIT 1",
        [String(payload.sub)],
      );

      if (rows.length > 0) {
        req.user = rows[0];
      }
    }

    next();
  } catch {
    next();
  }
}