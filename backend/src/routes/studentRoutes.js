import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {
    // 🔐 Allow ONLY students
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access only" });
    }

    const studentId = req.user.id;

    // 👤 Fetch logged-in student details
    const student = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [studentId]
    );

    res.json({
      student: student.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
