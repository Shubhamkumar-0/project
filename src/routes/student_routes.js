import express from "express";
import { verifyToken, requireRole } from "../middlewares/auth_middleware.js";
import pool from "../config/db_postgres.js";
import { updateUserById } from "../models/user_pg.js";

const router = express.Router();

// =============================
// GET PROFILE
// =============================
router.get("/profile", verifyToken, requireRole(["student"]), async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, class FROM students WHERE id = $1",
      [studentId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// UPDATE PROFILE
// =============================
router.put("/profile", verifyToken, requireRole(["student"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const updatedUser = await updateUserById(userId, { name, email, password });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;
