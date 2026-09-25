import { Router } from "express";
import { pool } from "../config/db.js";
import { asyncHandler } from "../middleware/error.js";
import { validateNewsletterBody } from "../middleware/validate.js";

const router = Router();

// POST /api/newsletter
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email } = validateNewsletterBody(req.body);

    await pool.query(
      "INSERT INTO newsletter_subscribers (email) VALUES (?)",
      [email],
    );

    res.status(201).json({ message: "تم الاشتراك في النشرة البريدية بنجاح" });
  }),
);

export default router;