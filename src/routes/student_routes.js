import express from "express";
import { verifyToken, requireRole } from "../middlewares/auth_middleware.js";
import { findUserById } from "../models/user_pg.js";

const router = express.Router();

// ---------------------------
// GET: Student Profile
// ---------------------------
router.get("/profile", verifyToken, requireRole(["student"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
