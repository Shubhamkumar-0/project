import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectMongo } from "./src/config/db_mongo.js";
import { connectPostgres } from "./src/config/db_postgres.js";

// 🟢 Import Routes
import studentRoutes from "./src/routes/student_routes.js";
import teacherRoutes from "./src/routes/teacher_routes.js";
import authRoutes from "./src/routes/auth_routes.js";
import studentAuthRoutes from "./src/routes/student_auth_routes.js";
import studentDashboardRoutes from "./src/routes/student_dashboard_routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// 🟢 Connect Databases
connectMongo();
connectPostgres();

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("Digital Learning Backend Running...");
});

// 🟢 Register API Routes
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student/auth", studentAuthRoutes);
app.use("/api/student/dashboard", studentDashboardRoutes);


// 🟢 Start Server
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
