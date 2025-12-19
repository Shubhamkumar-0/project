
import mongoose from "mongoose";
import User from "../models/User.js";
import Class from "../models/Class.js";

export const assignClassToStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    let { class_id, class_number } = req.body;

    if (typeof class_id === "number") {
      class_number = class_id;
      class_id = null;
    }

    if (!class_id && class_number === undefined) {
      return res.status(400).json({
        message: "class_id (ObjectId) or class_number (1-12) required"
      });
    }

    let classExists = null;

    // ✅ Use ObjectId ONLY if valid string
    if (
      class_id &&
      typeof class_id === "string" &&
      mongoose.Types.ObjectId.isValid(class_id)
    ) {
      classExists = await Class.findById(class_id);
    }
    else {
      classExists = await Class.findOne({
        grade_level: Number(class_number),
        is_active: true
      });
    }

    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    await User.findByIdAndUpdate(studentId, {
      class_id: classExists._id
    });

    return res.json({
      success: true,
      message: "Class assigned successfully",
      class: {
        id: classExists._id,
        name: classExists.class_name,
        grade: classExists.grade_level
      }
    });

  } catch (error) {
    console.error("Assign class error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
