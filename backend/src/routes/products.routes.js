import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const rowToProduct = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  type: row.type,
  price: Number(row.price),
  oldPrice: row.old_price === null ? null : Number(row.old_price),
  image: row.image,
  description: row.description,
  descriptionLong: row.description_long,
  rating: Number(row.rating),
  reviewsCount: row.reviews_count,
  stock: row.stock,
  colors:
    typeof row.colors === "string" ? JSON.parse(row.colors) : row.colors || [],
  sizes: typeof row.sizes === "string" ? JSON.parse(row.sizes) : row.sizes || [],
});

function escapeLike(value) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

// GET /api/products?type=&category=&q=&sort=&discountOnly=&limit=&offset=
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      type,
      category,
      q,
      sort = "default",
      discountOnly,
      limit: limitParam,
      offset: offsetParam,
    } = req.query;

    const where = [];
    const params = [];

    if (type && type !== "الكل") {
      where.push("type = ?");
      params.push(String(type).slice(0, 20));
    }

    if (category && category !== "الكل") {
      where.push("category = ?");
      params.push(String(category).slice(0, 50));
    }

    if (discountOnly === "true" || discountOnly === "1") {
      where.push("old_price IS NOT NULL AND old_price > price");
    }

    if (q && String(q).trim()) {
      const keyword = escapeLike(String(q).trim().slice(0, 100));
      where.push("name LIKE ? ESCAPE '\\\\'");
      params.push(`%${keyword}%`);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const orderBy = {
      asc: "price ASC",
      desc: "price DESC",
      discount:
        "CAST(COALESCE((old_price - price) / NULLIF(old_price, 0) * 100, 0) AS SIGNED) DESC",
      default: "id ASC",
    }[sort] || "id ASC";

    let limit = Math.min(Math.max(Number(limitParam) || 50, 1), 100);
    let offset = Math.max(Number(offsetParam) || 0, 0);

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM products
       ${whereSql}`,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT *
       FROM products
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      total,
      limit,
      offset,
      products: rows.map(rowToProduct),
    });
  }),
);

// GET /api/products/:id
router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [productId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    const [reviewRows] = await pool.query(
      `SELECT id, name, rating, text, created_at AS date
       FROM reviews
       WHERE product_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [productId],
    );

    const [relatedRows] = await pool.query(
      `SELECT *
       FROM products
       WHERE id <> ?
         AND (category = ? OR type = ?)
       ORDER BY rating DESC
       LIMIT 4`,
      [productId, rows[0].category, rows[0].type],
    );

    res.json({
      product: rowToProduct(rows[0]),
      reviews: reviewRows,
      related: relatedRows.map(rowToProduct),
    });
  }),
);

export default router;