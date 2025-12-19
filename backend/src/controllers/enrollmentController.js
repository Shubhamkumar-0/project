import User from "../models/User.js";
import Class from "../models/Class.js";

export const enrollStudent = async (req, res) => {
  const studentId = req.user.id;
  const { class_id } = req.body;

  if (!class_id) {
    return res.status(400).json({ message: "class_id required" });
  }

  try {
    // Check if class exists
    const classExists = await Class.findById(class_id);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update student's class
    const student = await User.findByIdAndUpdate(
      studentId,
      { class_id: class_id },
      { new: true }
    ).select("name email class_id");

    res.json({ 
      success: true, 
      message: "Student enrolled successfully",
      student 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Enrollment failed", error: err.message });
  }
};

export const getStudentEnrollment = async (req, res) => {
  const studentId = req.user.id;

  try {
    const student = await User.findById(studentId)
      .select("name email class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      class: student.class_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch enrollment" });
  }
};

export const promoteStudent = async (req, res) => {
  const { studentId } = req.body;

  try {
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

    // Update student's class
    await User.findByIdAndUpdate(studentId, {
      class_id: nextClass._id
    });

    res.json({ 
      success: true, 
      message: "Student promoted successfully",
      from_class: currentClass.class_name,
      to_class: nextClass.class_name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Promotion failed", error: err.message });
  }
};