import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler, AppError } from "../middleware/error.js";
import { optionalAuth } from "../middleware/auth.js";
import { resolveOwner } from "../middleware/guest.js";
import { validateOrderBody } from "../middleware/validate.js";

const router = Router();

const ITEM_FIELDS = [
  "id",
  "order_id",
  "product_id",
  "name",
  "image",
  "category",
  "type",
  "price",
  "quantity",
  "selected_color",
  "selected_size",
].join(", ");

function orderRowsToJson(rows) {
  const orders = [];
  const index = new Map();

  for (const row of rows) {
    if (!index.has(row.id)) {
      const order = {
        id: row.id,
        date: row.created_at,
        status: row.status,
        note: row.note,
        subtotal: Number(row.subtotal),
        discount: Number(row.discount),
        shippingCost: Number(row.shipping_cost),
        total: Number(row.total),
        payment: row.payment,
        shipping: {
          name: row.shipping_name,
          phone: row.shipping_phone,
          governorate: row.shipping_governorate,
          address: row.shipping_address,
        },
        items: [],
      };

      index.set(row.id, order);
      orders.push(order);
    }

    if (row.product_id !== null || row.item_name !== null) {
      index.get(row.id).items.push({
        id: row.product_id,
        name: row.item_name,
        image: row.item_image,
        category: row.item_category,
        type: row.item_type,
        price: Number(row.item_price),
        quantity: row.item_quantity,
        selectedColor: row.item_color,
        selectedSize: row.item_size,
      });
    }
  }

  return orders;
}

// GET /api/orders -> orders of the logged-in user (or guest cookie)
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const ownerKey = resolveOwner(req);

    const [rows] = await pool.query(
      `SELECT
         o.id,
         o.created_at,
         o.status,
         o.note,
         o.subtotal,
         o.discount,
         o.shipping_cost,
         o.total,
         o.payment,
         o.shipping_name,
         o.shipping_phone,
         o.shipping_governorate,
         o.shipping_address,
         oi.product_id,
         oi.name      AS item_name,
         oi.image     AS item_image,
         oi.category  AS item_category,
         oi.type      AS item_type,
         oi.price     AS item_price,
         oi.quantity  AS item_quantity,
         oi.selected_color AS item_color,
         oi.selected_size  AS item_size
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE ${req.user ? "o.user_id" : "o.guest_id"} = ?
       ORDER BY o.created_at DESC, oi.id ASC`,
      [ownerKey],
    );

    res.json({ orders: orderRowsToJson(rows) });
  }),
);

// POST /api/orders
router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const orderData = validateOrderBody(req.body);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const orderId = `FAS-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`;

      const ownerKey = resolveOwner(req);

      await conn.query(
        `INSERT INTO orders
           (id, user_id, guest_id, status, note, subtotal, discount,
            shipping_cost, total, payment, shipping_name, shipping_phone,
            shipping_governorate, shipping_address)
         VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          req.user ? ownerKey : null,
          req.user ? null : ownerKey,
          orderData.note,
          orderData.subtotal,
          orderData.discount,
          orderData.shippingCost,
          orderData.total,
          orderData.payment,
          orderData.shipping.name,
          orderData.shipping.phone,
          orderData.shipping.governorate,
          orderData.shipping.address,
        ],
      );

      for (const item of orderData.items) {
        const [productRows] = await conn.query(
          `SELECT id, name, image, category, type, price, stock
           FROM products
           WHERE id = ?
           LIMIT 1`,
          [item.productId],
        );

        if (productRows.length === 0) {
          throw new AppError(
            400,
            `أحد المنتجات غير موجود (المنتج رقم ${item.productId})`,
          );
        }

        const product = productRows[0];

        if (product.stock < item.quantity) {
          throw new AppError(
            409,
            `الكمية المطلوبة أكبر من المتاح من "${product.name}"`,
          );
        }

        await conn.query(
          `INSERT INTO order_items
             (order_id, product_id, name, image, category, type, price,
              quantity, selected_color, selected_size)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            product.id,
            product.name,
            product.image,
            product.category,
            product.type,
            product.price,
            item.quantity,
            item.selectedColor,
            item.selectedSize,
          ],
        );

        await conn.query(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.quantity, product.id],
        );
      }

      await conn.commit();

      res.status(201).json({
        order: {
          id: orderId,
          date: new Date().toISOString(),
          status: "pending",
          note: orderData.note,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shippingCost: orderData.shippingCost,
          total: orderData.total,
          payment: orderData.payment,
          shipping: orderData.shipping,
          items: [],
        },
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }),
);

export default router;