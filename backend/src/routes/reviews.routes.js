import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { validateReviewBody } from "../middleware/validate.js";

const router = Router();

// POST /api/products/:id/reviews
router.post(
  "/:id(\\d+)/reviews",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);
    const { text, rating } = validateReviewBody(req.body);

    const [productRows] = await pool.query(
      "SELECT id FROM products WHERE id = ? LIMIT 1",
      [productId],
    );

    if (productRows.length === 0) {
      throw new AppError(404, "المنتج غير موجود");
    }

    const reviewerName = (req.user && req.user.name) || "عميلة زائرة";

    const [result] = await pool.query(
      `INSERT INTO reviews (product_id, user_id, name, rating, text)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, req.user ? req.user.id : null, reviewerName, rating, text],
    );

    await pool.query(
      `UPDATE products
       SET reviews_count = reviews_count + 1,
           rating = ROUND(
             ((rating * reviews_count) + ?) / (reviews_count + 1),
             1
           )
       WHERE id = ?`,
      [rating, productId],
    );

    res.status(201).json({
      review: {
        id: result.insertId,
        name: reviewerName,
        rating,
        text,
        date: new Date().toISOString(),
      },
    });
  }),
);

export default router;