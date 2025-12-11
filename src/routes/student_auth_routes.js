import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user_pg.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ----------------------------
// Student Signup
// ----------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const student = await createUser({
      name,
      email,
      password: hashed,
      role: "student"
    });

    res.json({ message: "Student registered successfully", student });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ----------------------------
// Student Login
// ----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await findUserByEmail(email);
    if (!student)
      return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, student.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: student.id, role: student.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      message: "Login successful", 
      token,
      student: {
        id: student.id,
        name: student.name,
        role: student.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
