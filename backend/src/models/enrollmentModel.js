// models/enrollmentModel.js
import User from "./User.js";
import Class from "./Class.js";
import Subject from "./Subject.js";
import LessonProgress from "./LessonProgress.js";
import QuizAttempt from "./QuizAttempt.js";
import Attendance from "./Attendance.js";

/**
 * Enroll a student into ONE class
 */
export const enrollStudent = async (studentId, classId) => {
  try {
    // Validate student exists and is a student
    const student = await User.findOne({
      _id: studentId,
      role: "student"
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Validate class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new Error("Class not found");
    }

    // Update student's class
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { class_id: classId },
      { new: true }
    )
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    // Initialize attendance for the student in the new class
    await Attendance.create({
      student_id: studentId,
      class_id: classId,
      date: new Date(),
      status: "present"
    });

    return updatedStudent;
  } catch (error) {
    console.error("Enroll student error:", error);
    throw error;
  }
};

/**
 * Get enrolled class of a student
 */
export const getStudentEnrollment = async (studentId) => {
  try {
    const student = await User.findById(studentId)
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    if (!student) {
      throw new Error("Student not found");
    }

    if (!student.class_id) {
      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role
        },
        isEnrolled: false,
        message: "Student is not enrolled in any class"
      };
    }

    // Get subjects for the enrolled class
    const subjects = await Subject.find({
      class_id: student.class_id._id,
      is_active: true
    }).select("name description order");

    // Get progress statistics
    const totalSubjects = subjects.length;

    // Get completed lessons count
    const completedLessons = await LessonProgress.countDocuments({
      student_id: studentId,
      status: "completed"
    });

    // Get quiz performance
    const quizAttempts = await QuizAttempt.find({ student_id: studentId });
    const averageQuizScore = quizAttempts.length > 0 ?
      Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizAttempts.length) : 0;

    // Get attendance percentage
    const attendanceRecords = await Attendance.find({ student_id: studentId });
    const presentDays = attendanceRecords.filter(a => a.status === "present").length;
    const attendancePercentage = attendanceRecords.length > 0 ?
      Math.round((presentDays / attendanceRecords.length) * 100) : 0;

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      },
      class: {
        id: student.class_id._id,
        class_name: student.class_id.class_name,
        grade_level: student.class_id.grade_level
      },
      enrollmentDetails: {
        totalSubjects,
        completedLessons,
        averageQuizScore,
        attendancePercentage,
        enrolledAt: student.updatedAt || student.createdAt
      },
      isEnrolled: true
    };
  } catch (error) {
    console.error("Get student enrollment error:", error);
    throw error;
  }
};

/**
 * Promote student to next class
 */
export const promoteStudent = async (studentId) => {
  try {
    // Get student with current class
    const student = await User.findById(studentId)
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    if (!student || student.role !== "student") {
      throw new Error("Student not found");
    }

    if (!student.class_id) {
      throw new Error("Student is not enrolled in any class");
    }

    // Find the next class based on grade level
    const currentGradeLevel = student.class_id.grade_level;
    const nextClass = await Class.findOne({
      grade_level: currentGradeLevel + 1,
      is_active: true
    }).sort("class_name");

    if (!nextClass) {
      throw new Error("No higher class available");
    }

    // Check if student meets promotion criteria (optional)
    const hasOutstandingRequirements = await checkPromotionRequirements(studentId);
    if (hasOutstandingRequirements) {
      throw new Error("Student does not meet promotion requirements");
    }

    // Archive current enrollment data (optional)
    await archiveEnrollmentData(studentId, student.class_id._id);

    // Update student's class
    const promotedStudent = await User.findByIdAndUpdate(
      studentId,
      { class_id: nextClass._id },
      { new: true }
    )
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    // Initialize progress in new class
    await initializeStudentInNewClass(studentId, nextClass._id);

    return {
      student: promotedStudent,
      previousClass: student.class_id,
      newClass: nextClass,
      promotedAt: new Date()
    };
  } catch (error) {
    console.error("Promote student error:", error);
    throw error;
  }
};

/**
 * Check if student meets promotion requirements
 */
const checkPromotionRequirements = async (studentId) => {
  try {
    // Get student's current subjects
    const student = await User.findById(studentId).populate("class_id");
    const subjects = await Subject.find({
      class_id: student.class_id._id,
      is_active: true
    });

    // For each subject, check if minimum requirements are met
    for (const subject of subjects) {
      const lessons = await Lesson.find({ subject_id: subject._id });
      const lessonIds = lessons.map(l => l._id);

      const completedLessons = await LessonProgress.countDocuments({
        student_id: studentId,
        lesson_id: { $in: lessonIds },
        status: "completed"
      });

      // If less than 80% of lessons completed, return false
      if (lessons.length > 0 && (completedLessons / lessons.length) < 0.8) {
        return true; // Has outstanding requirements
      }
    }

    return false; // All requirements met
  } catch (error) {
    console.error("Check promotion requirements error:", error);
    return true; // If error, don't promote
  }
};

/**
 * Archive old enrollment data
 */
const archiveEnrollmentData = async (studentId, oldClassId) => {
  try {
    // Create an archive record (you might want to create an Archive model)
    const archiveRecord = {
      student_id: studentId,
      old_class_id: oldClassId,
      archived_at: new Date(),
      progress_snapshot: {}
    };

    // You can store this in an Archive collection
    // For now, we'll just update lesson progress status
    await LessonProgress.updateMany(
      { student_id: studentId },
      { $set: { is_archived: true, archived_at: new Date() } }
    );

    return true;
  } catch (error) {
    console.error("Archive enrollment data error:", error);
    // Don't throw, as this shouldn't block promotion
    return false;
  }
};

/**
 * Initialize student in new class
 */
const initializeStudentInNewClass = async (studentId, newClassId) => {
  try {
    // Create initial attendance record
    await Attendance.create({
      student_id: studentId,
      class_id: newClassId,
      date: new Date(),
      status: "present",
      is_initial: true
    });

    // You can add more initialization logic here
    // For example: setting up initial lesson progress records

    return true;
  } catch (error) {
    console.error("Initialize student in new class error:", error);
    return false;
  }
};

/**
 * Get all enrolled students in a class
 */
export const getClassEnrollments = async (classId) => {
  try {
    const students = await User.find({
      class_id: classId,
      role: "student"
    })
      .select("name email createdAt")
      .populate({
        path: "class_id",
        select: "class_name"
      })
      .sort("name");

    // Get additional statistics for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const completedLessons = await LessonProgress.countDocuments({
          student_id: student._id,
          status: "completed"
        });

        const quizAttempts = await QuizAttempt.find({ student_id: student._id });
        const averageScore = quizAttempts.length > 0 ?
          Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizAttempts.length) : 0;

        const attendanceRecords = await Attendance.find({ student_id: student._id });
        const presentDays = attendanceRecords.filter(a => a.status === "present").length;
        const attendancePercentage = attendanceRecords.length > 0 ?
          Math.round((presentDays / attendanceRecords.length) * 100) : 0;

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          enrolled_since: student.createdAt,
          stats: {
            completedLessons,
            averageQuizScore: averageScore,
            attendancePercentage
          }
        };
      })
    );

    return {
      classId,
      totalStudents: students.length,
      students: studentsWithStats
    };
  } catch (error) {
    console.error("Get class enrollments error:", error);
    throw error;
  }
};

/**
 * Transfer student to different class
 */
export const transferStudent = async (studentId, fromClassId, toClassId) => {
  try {
    // Validate student is in the fromClass
    const student = await User.findOne({
      _id: studentId,
      class_id: fromClassId,
      role: "student"
    });

    if (!student) {
      throw new Error("Student not found in the specified class");
    }

    // Validate target class exists
    const toClass = await Class.findById(toClassId);
    if (!toClass) {
      throw new Error("Target class not found");
    }

    // Archive old data
    await archiveEnrollmentData(studentId, fromClassId);

    // Update student's class
    const transferredStudent = await User.findByIdAndUpdate(
      studentId,
      { class_id: toClassId },
      { new: true }
    )
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    // Initialize in new class
    await initializeStudentInNewClass(studentId, toClassId);

    return {
      student: transferredStudent,
      fromClassId,
      toClassId,
      transferredAt: new Date()
    };
  } catch (error) {
    console.error("Transfer student error:", error);
    throw error;
  }
};

/**
 * Bulk enroll students
 */
export const bulkEnrollStudents = async (studentIds, classId) => {
  try {
    const results = await Promise.allSettled(
      studentIds.map(studentId => enrollStudent(studentId, classId))
    );

    const successful = results.filter(r => r.status === "fulfilled").map(r => r.value);
    const failed = results.filter(r => r.status === "rejected").map((r, index) => ({
      studentId: studentIds[index],
      error: r.reason.message
    }));

    return {
      total: studentIds.length,
      successful: successful.length,
      failed: failed.length,
      details: {
        successful,
        failed
      }
    };
  } catch (error) {
    console.error("Bulk enroll students error:", error);
    throw error;
  }
};