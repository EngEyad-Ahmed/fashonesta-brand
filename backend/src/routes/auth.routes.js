import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";
import { signToken } from "../utils/token.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import {
  validateRegisterBody,
  validateLoginBody,
} from "../middleware/validate.js";

const router = Router();

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

const TOKEN_COOKIE = "fashionista_token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function setSessionCookie(res, token) {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

function clearSessionCookie(res) {
  res.clearCookie(TOKEN_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

async function loadUserWithAddresses(userId) {
  const [userRows] = await pool.query(
    `SELECT id, name, phone, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  if (userRows.length === 0) {
    throw new AppError(404, "المستخدم غير موجود");
  }

  const [addressRows] = await pool.query(
    `SELECT id, label, governorate, address, created_at
     FROM addresses
     WHERE user_id = ?
     ORDER BY created_at ASC`,
    [userId],
  );

  return {
    ...publicUser(userRows[0]),
    addresses: addressRows.map((a) => ({
      id: a.id,
      label: a.label,
      governorate: a.governorate,
      address: a.address,
    })),
  };
}

// POST /api/auth/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, phone, password } = validateRegisterBody(req.body);

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE phone = ? LIMIT 1",
      [phone],
    );

    if (existing.length > 0) {
      throw new AppError(409, "هذا الرقم مسجل بالفعل، سجلي الدخول");
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await pool.query(
      "INSERT INTO users (id, name, phone, password_hash) VALUES (?, ?, ?, ?)",
      [id, name, phone, passwordHash],
    );

    const token = signToken(id);

    setSessionCookie(res, token);

    res.status(201).json({
      user: {
        id,
        name,
        phone,
        createdAt: new Date().toISOString(),
        addresses: [],
      },
    });
  }),
);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { phone, password } = validateLoginBody(req.body);

    const [rows] = await pool.query(
      "SELECT id, name, phone, password_hash, created_at FROM users WHERE phone = ? LIMIT 1",
      [phone],
    );

    if (rows.length === 0) {
      throw new AppError(401, "لا يوجد حساب بهذا الرقم");
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      throw new AppError(401, "كلمة المرور غير صحيحة");
    }

    const token = signToken(user.id);

    setSessionCookie(res, token);

    res.json({
      user: publicUser(user),
    });
  }),
);

// GET /api/auth/me
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await loadUserWithAddresses(req.user.id);
    res.json({ user });
  }),
);

// POST /api/auth/logout
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    clearSessionCookie(res);
    res.json({ message: "تم تسجيل الخروج" });
  }),
);

export default router;