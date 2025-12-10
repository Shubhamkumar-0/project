import express from "express";
import { verifyToken, requireRole } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/create-course",
  verifyToken,
  requireRole(["teacher", "admin"]),
  (req, res) => {
    res.json({ message: "Course created" });
  }
);

export default router;
