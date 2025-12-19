import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Lesson from "../models/Lesson.js";
import LessonProgress from "../models/LessonProgress.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Attendance from "../models/Attendance.js";
import Announcement from "../models/Announcement.js";
import SupportRequest from "../models/SupportRequest.js";

/* ======================= GET STUDENT DASHBOARD ======================= */
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1️⃣ Student basic info
    const student = await User.findById(studentId)
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🚨 CLASS NOT SELECTED CASE
    if (!student.class_id) {
      return res.json({
        needsClassSelection: true,
        student: {
          id: student._id,
          name: student.name,
          email: student.email
        }
      });
    }

    // 2️⃣ Subject progress
    const subjects = await Subject.find({ 
      class_id: student.class_id._id,
      is_active: true 
    }).select("name description");

    const subjectsWithProgress = await Promise.all(
      subjects.map(async (subject) => {
        const lessons = await Lesson.find({ 
          subject_id: subject._id 
        }).select("_id");
        
        const lessonIds = lessons.map(lesson => lesson._id);
        
        const completedLessons = await LessonProgress.countDocuments({
          student_id: studentId,
          lesson_id: { $in: lessonIds },
          status: "completed"
        });

        const totalLessons = lessons.length;
        const progressPercent = totalLessons === 0 ? 0 : 
          Math.round((completedLessons / totalLessons) * 100);

        return {
          id: subject._id,
          name: subject.name,
          description: subject.description,
          totalLessons,
          completedLessons,
          progressPercent
        };
      })
    );

    // 3️⃣ Continue learning
    const studentClassId = student.class_id._id;
    const studentSubjects = await Subject.find({ 
      class_id: studentClassId 
    }).select("_id");

    const subjectIds = studentSubjects.map(sub => sub._id);
    
    const nextLesson = await Lesson.findOne({
      subject_id: { $in: subjectIds },
      _id: { 
        $nin: await LessonProgress.find({ 
          student_id: studentId, 
          status: "completed" 
        }).distinct("lesson_id")
      }
    })
    .populate({
      path: "subject_id",
      select: "name"
    })
    .sort("order")
    .limit(1);

    const continueLearning = nextLesson ? {
      subject: nextLesson.subject_id.name,
      lesson: nextLesson.title,
      lessonId: nextLesson._id
    } : null;

    // 4️⃣ Quiz summary
    const quizAttempts = await QuizAttempt.find({ student_id: studentId });
    const attempted = quizAttempts.length;
    const averageScore = attempted > 0 
      ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempted)
      : 0;

    // 5️⃣ Attendance summary
    const attendanceRecords = await Attendance.find({ student_id: studentId });
    const presentDays = attendanceRecords.filter(a => a.status === "present").length;
    const totalDays = attendanceRecords.length;
    const attendancePercent = totalDays === 0 ? 0 : 
      Math.round((presentDays / totalDays) * 100);

    // 6️⃣ Announcements
    const announcements = await Announcement.find({
      $or: [
        { target_roles: "all" },
        { target_roles: "student" },
        { class_id: studentClassId }
      ],
      is_active: true,
      $or: [
        { expires_at: { $exists: false } },
        { expires_at: { $gt: new Date() } }
      ]
    })
    .populate({
      path: "author",
      select: "name"
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title message author createdAt");

    // 7️⃣ Support status
    const openRequests = await SupportRequest.countDocuments({
      user_id: studentId,
      status: "open"
    });

    /* FINAL RESPONSE */
    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        class_name: student.class_id?.class_name
      },
      subjects: subjectsWithProgress,
      continueLearning,
      quizSummary: {
        attempted,
        averageScore
      },
      attendance: {
        presentDays,
        totalDays,
        percentage: attendancePercent
      },
      announcements: announcements.map(ann => ({
        title: ann.title,
        message: ann.message,
        author: ann.author?.name,
        created_at: ann.createdAt
      })),
      support: {
        openRequests
      }
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard failed", error: err.message });
  }
};

/* ======================= SET STUDENT CLASS ======================= */
export const setStudentClass = async (req, res) => {
  const studentId = req.user.id;
  const { class_id } = req.body;

  try {
    // Validate class exists
    const classExists = await Class.findById(class_id);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update student's class
    await User.findByIdAndUpdate(studentId, {
      class_id: class_id
    });

    res.json({ success: true, message: "Class assigned successfully" });
  } catch (err) {
    console.error("Set class error:", err);
    res.status(500).json({ message: "Failed to set class", error: err.message });
  }
};