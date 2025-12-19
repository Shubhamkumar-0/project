import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { enrollStudent, promoteStudent } from "../controllers/enrollmentController.js";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";

const router = express.Router();

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// Enroll student (admin only)
router.post("/enroll", protect, isAdmin, async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({
        message: "studentId and classId are required"
      });
    }

    // Check if student exists and is a student
    const student = await User.findOne({
      _id: studentId,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Enroll student
    await User.findByIdAndUpdate(studentId, {
      class_id: classId
    });

    res.status(200).json({
      message: "Student enrolled successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      class: {
        id: classExists._id,
        name: classExists.class_name
      }
    });
  } catch (error) {
    console.error("Admin enroll error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Promote student (admin only)
router.post("/promote", protect, isAdmin, async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "studentId is required"
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.class_id) {
      return res.status(400).json({ message: "Student is not enrolled in any class" });
    }

    // Get current class and find next class
    const currentClass = await Class.findById(student.class_id);
    const nextClass = await Class.findOne({
      grade_level: currentClass.grade_level + 1,
      is_active: true
    });

    if (!nextClass) {
      return res.status(400).json({ message: "No higher class available" });
    }

    // Promote student
    await User.findByIdAndUpdate(studentId, {
      class_id: nextClass._id
    });

    res.status(200).json({
      message: "Student promoted successfully",
      student: {
        id: student._id,
        name: student.name
      },
      from_class: currentClass.class_name,
      to_class: nextClass.class_name
    });
  } catch (error) {
    console.error("Admin promote error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin dashboard statistics
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments({ is_active: true });
    const totalSubjects = await Subject.countDocuments({ is_active: true });

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;