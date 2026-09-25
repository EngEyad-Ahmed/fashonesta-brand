import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { resolveOwner } from "../middleware/guest.js";

const router = Router();

function rowToProduct(row) {
  return {
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
  };
}

async function loadWishlistProducts(ownerKey) {
  const [rows] = await pool.query(
    `SELECT p.*
     FROM wishlists w
     JOIN products p ON p.id = w.product_id
     WHERE w.owner_key = ?
     ORDER BY w.created_at DESC`,
    [ownerKey],
  );

  return rows.map(rowToProduct);
}

// GET /api/wishlist
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const ownerKey = resolveOwner(req);
    const products = await loadWishlistProducts(ownerKey);
    res.json({ products });
  }),
);

// POST /api/wishlist/:id
router.post(
  "/:id(\\d+)",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);
    const ownerKey = resolveOwner(req);

    const [productRows] = await pool.query(
      "SELECT id FROM products WHERE id = ? LIMIT 1",
      [productId],
    );

    if (productRows.length === 0) {
      throw new AppError(404, "المنتج غير موجود");
    }

    await pool.query(
      "INSERT IGNORE INTO wishlists (owner_key, product_id) VALUES (?, ?)",
      [ownerKey, productId],
    );

    res.json({ products: await loadWishlistProducts(ownerKey) });
  }),
);

// DELETE /api/wishlist/:id
router.delete(
  "/:id(\\d+)",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);
    const ownerKey = resolveOwner(req);

    await pool.query(
      "DELETE FROM wishlists WHERE owner_key = ? AND product_id = ?",
      [ownerKey, productId],
    );

    res.json({ products: await loadWishlistProducts(ownerKey) });
  }),
);

// DELETE /api/wishlist
router.delete(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const ownerKey = resolveOwner(req);

    await pool.query("DELETE FROM wishlists WHERE owner_key = ?", [ownerKey]);

    res.json({ products: [] });
  }),
);

export default router;