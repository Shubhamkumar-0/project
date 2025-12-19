import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import classRoutes from "./src/routes/classRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.options("*", cors());   // 👈 REQUIRED
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/class", classRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});