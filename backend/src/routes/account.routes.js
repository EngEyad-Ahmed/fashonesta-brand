import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { validateAddressBody } from "../middleware/validate.js";

const router = Router();

router.use(requireAuth);

async function loadAddresses(userId) {
  const [rows] = await pool.query(
    `SELECT id, label, governorate, address, created_at
     FROM addresses
     WHERE user_id = ?
     ORDER BY created_at ASC`,
    [userId],
  );

  return rows.map((a) => ({
    id: a.id,
    label: a.label,
    governorate: a.governorate,
    address: a.address,
  }));
}

// POST /api/account/addresses
router.post(
  "/addresses",
  asyncHandler(async (req, res) => {
    const { label, governorate, address } = validateAddressBody(req.body);
    const id = randomUUID();

    await pool.query(
      `INSERT INTO addresses (id, user_id, label, governorate, address)
       VALUES (?, ?, ?, ?, ?)`,
      [id, req.user.id, label, governorate, address],
    );

    const addresses = await loadAddresses(req.user.id);

    res.status(201).json({ addresses });
  }),
);

// PUT /api/account/addresses/:id
router.put(
  "/addresses/:id",
  asyncHandler(async (req, res) => {
    const addressId = String(req.params.id).slice(0, 36);
    const { label, governorate, address } = validateAddressBody(req.body);

    const [result] = await pool.query(
      `UPDATE addresses
       SET label = ?, governorate = ?, address = ?
       WHERE id = ? AND user_id = ?`,
      [label, governorate, address, addressId, req.user.id],
    );

    if (result.affectedRows === 0) {
      throw new AppError(404, "العنوان غير موجود");
    }

    const addresses = await loadAddresses(req.user.id);

    res.json({ addresses });
  }),
);

// DELETE /api/account/addresses/:id
router.delete(
  "/addresses/:id",
  asyncHandler(async (req, res) => {
    const addressId = String(req.params.id).slice(0, 36);

    const [result] = await pool.query(
      "DELETE FROM addresses WHERE id = ? AND user_id = ?",
      [addressId, req.user.id],
    );

    if (result.affectedRows === 0) {
      throw new AppError(404, "العنوان غير موجود");
    }

    const addresses = await loadAddresses(req.user.id);

    res.json({ addresses });
  }),
);

export default router;