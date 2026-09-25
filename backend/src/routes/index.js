import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productsRoutes from "./products.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import ordersRoutes from "./orders.routes.js";
import accountRoutes from "./account.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import cartRoutes from "./cart.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import { testConnection } from "../config/db.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    let db = "down";

    try {
      await testConnection();
      db = "up";
    } catch {
      db = "down";
    }

    const status = db === "up" ? "ok" : "degraded";

    res.status(db === "up" ? 200 : 503).json({
      status,
      db,
      uptime: Math.round(process.uptime()),
    });
  }),
);

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/products", reviewsRoutes);
router.use("/orders", ordersRoutes);
router.use("/account", accountRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;