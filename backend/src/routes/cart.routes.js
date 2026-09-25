import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { resolveOwner } from "../middleware/guest.js";
import { ValidationError } from "../middleware/validate.js";

const router = Router();

function cleanString(value, maxLength) {
  return String(value == null ? "" : value).trim().slice(0, maxLength);
}

async function enrichItems(slimItems, conn) {
  if (!Array.isArray(slimItems) || slimItems.length === 0) {
    return [];
  }

  const productIds = [...new Set(slimItems.map((item) => Number(item.productId)))].filter(
    (id) => Number.isInteger(id) && id > 0,
  );

  const productsMap = new Map();

  if (productIds.length > 0) {
    const [rows] = await conn.query(
      `SELECT *
       FROM products
       WHERE id IN (?)`,
      [productIds],
    );

    for (const row of rows) {
      productsMap.set(row.id, row);
    }
  }

  return slimItems
    .map((item) => {
      const product = productsMap.get(Number(item.productId));

      if (!product) return null;

      return {
        cartId: item.cartId || `${product.id}-t-${Date.now()}`,
        id: product.id,
        name: product.name,
        category: product.category,
        type: product.type,
        price: Number(product.price),
        oldPrice: product.old_price === null ? null : Number(product.old_price),
        image: product.image,
        stock: product.stock,
        colors:
          typeof product.colors === "string"
            ? JSON.parse(product.colors)
            : product.colors || [],
        sizes:
          typeof product.sizes === "string"
            ? JSON.parse(product.sizes)
            : product.sizes || [],
        quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 99),
        selectedColor: cleanString(item.selectedColor, 50),
        selectedSize: cleanString(item.selectedSize, 20),
      };
    })
    .filter(Boolean);
}

async function loadSlimItems(ownerKey, conn) {
  const [rows] = await conn.query(
    "SELECT items FROM carts WHERE owner_key = ? LIMIT 1",
    [ownerKey],
  );

  return rows.length > 0 && rows[0].items ? rows[0].items : [];
}

// GET /api/cart
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const ownerKey = resolveOwner(req);
    const slimItems = await loadSlimItems(ownerKey, pool);

    if (typeof slimItems === "string") {
      try {
        res.json({ items: await enrichItems(JSON.parse(slimItems), pool) });
        return;
      } catch {
        res.json({ items: [] });
        return;
      }
    }

    res.json({ items: await enrichItems(slimItems, pool) });
  }),
);

// PUT /api/cart
router.put(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (items.length > 50) {
      throw new ValidationError("عدد كبير جداً من الأصناف");
    }

    const slimItems = items.map((item) => ({
      productId: Number(item.productId ?? item.id),
      cartId: cleanString(item.cartId, 40),
      quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 99),
      selectedColor: cleanString(item.selectedColor, 50),
      selectedSize: cleanString(item.selectedSize, 20),
    }));

    const validProducts = slimItems.filter(
      (item) => Number.isInteger(item.productId) && item.productId > 0,
    );

    const ownerKey = resolveOwner(req);

    await pool.query(
      `INSERT INTO carts (owner_key, items, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE items = VALUES(items), updated_at = NOW()`,
      [ownerKey, JSON.stringify(validProducts)],
    );

    res.json({ items: await enrichItems(validProducts, pool) });
  }),
);

export default router;