// models/dashboardModel.js
import User from "./User.js";
import Class from "./Class.js";
import Subject from "./Subject.js";
import Lesson from "./Lesson.js";
import LessonProgress from "./LessonProgress.js";
import QuizAttempt from "./QuizAttempt.js";
import Attendance from "./Attendance.js";
import Announcement from "./Announcement.js";
import SupportRequest from "./SupportRequest.js";

/**
 * Get complete student dashboard data
 */
export const getStudentDashboardData = async (studentId) => {
  try {
    // Get student with class info
    const student = await User.findById(studentId)
      .select("name email role class_id")
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      });

    if (!student) {
      throw new Error("Student not found");
    }

    // If student has no class, return basic info
    if (!student.class_id) {
      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role
        },
        needsClassSelection: true
      };
    }

    // Get subjects for the student's class
    const subjects = await Subject.find({ 
      class_id: student.class_id._id,
      is_active: true 
    }).select("name description order");

    // Get lessons for each subject with progress
    const subjectsWithDetails = await Promise.all(
      subjects.map(async (subject) => {
        const lessons = await Lesson.find({ 
          subject_id: subject._id 
        }).select("title description order duration");

        // Get progress for each lesson
        const lessonsWithProgress = await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await LessonProgress.findOne({
              student_id: studentId,
              lesson_id: lesson._id
            });

            return {
              id: lesson._id,
              title: lesson.title,
              description: lesson.description,
              order: lesson.order,
              duration: lesson.duration,
              progress: progress ? {
                status: progress.status,
                completed_at: progress.completed_at,
                progress_percentage: progress.progress_percentage
              } : null
            };
          })
        );

        // Calculate subject progress
        const completedLessons = lessonsWithProgress.filter(
          lesson => lesson.progress?.status === "completed"
        ).length;

        const totalLessons = lessons.length;
        const progressPercent = totalLessons === 0 ? 0 :
          Math.round((completedLessons / totalLessons) * 100);

        return {
          id: subject._id,
          name: subject.name,
          description: subject.description,
          order: subject.order,
          totalLessons,
          completedLessons,
          progressPercent,
          lessons: lessonsWithProgress
        };
      })
    );

    // Get next lesson to continue
    const allLessons = await Lesson.find({
      subject_id: { $in: subjects.map(s => s._id) }
    }).select("_id title order subject_id");

    const completedLessonIds = await LessonProgress.find({
      student_id: studentId,
      status: "completed"
    }).distinct("lesson_id");

    const nextLesson = allLessons
      .filter(lesson => !completedLessonIds.includes(lesson._id.toString()))
      .sort((a, b) => a.order - b.order)[0];

    let continueLearning = null;
    if (nextLesson) {
      const subject = subjects.find(s => s._id.equals(nextLesson.subject_id));
      if (subject) {
        continueLearning = {
          subject: subject.name,
          lesson: nextLesson.title,
          lessonId: nextLesson._id
        };
      }
    }

    // Get quiz summary
    const quizAttempts = await QuizAttempt.find({ student_id: studentId });
    const attemptedQuizzes = quizAttempts.length;
    const averageScore = attemptedQuizzes > 0 ?
      Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attemptedQuizzes) : 0;

    // Get attendance summary
    const attendanceRecords = await Attendance.find({ student_id: studentId });
    const presentDays = attendanceRecords.filter(a => a.status === "present").length;
    const totalDays = attendanceRecords.length;
    const attendancePercent = totalDays === 0 ? 0 :
      Math.round((presentDays / totalDays) * 100);

    // Get recent announcements
    const announcements = await Announcement.find({
      $or: [
        { target_roles: "all" },
        { target_roles: "student" },
        { class_id: student.class_id._id }
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

    // Get support requests status
    const openRequests = await SupportRequest.countDocuments({
      user_id: studentId,
      status: "open"
    });

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        class_name: student.class_id.class_name,
        grade_level: student.class_id.grade_level
      },
      subjects: subjectsWithDetails,
      continueLearning,
      quizSummary: {
        attempted: attemptedQuizzes,
        averageScore
      },
      attendance: {
        presentDays,
        totalDays,
        percentage: attendancePercent
      },
      announcements: announcements.map(ann => ({
        id: ann._id,
        title: ann.title,
        message: ann.message,
        author: ann.author?.name,
        created_at: ann.createdAt
      })),
      support: {
        openRequests
      }
    };
  } catch (error) {
    console.error("Dashboard model error:", error);
    throw error;
  }
};

/**
 * Get teacher dashboard data
 */
export const getTeacherDashboardData = async (teacherId) => {
  try {
    const teacher = await User.findById(teacherId).select("name email role");
    
    // Get classes taught by teacher
    const classes = await Class.find({
      teacher_id: teacherId,
      is_active: true
    }).select("class_name grade_level");

    // Get total students in these classes
    const totalStudents = await User.countDocuments({
      class_id: { $in: classes.map(c => c._id) },
      role: "student"
    });

    // Get recent announcements by teacher
    const recentAnnouncements = await Announcement.find({
      author: teacherId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title message createdAt");

    return {
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      },
      classes,
      stats: {
        totalClasses: classes.length,
        totalStudents
      },
      recentAnnouncements: recentAnnouncements.map(ann => ({
        id: ann._id,
        title: ann.title,
        message: ann.message,
        created_at: ann.createdAt
      }))
    };
  } catch (error) {
    console.error("Teacher dashboard model error:", error);
    throw error;
  }
};

/**
 * Get admin dashboard data
 */
export const getAdminDashboardData = async () => {
  try {
    // Get counts for all entities
    const [
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalClasses,
      totalSubjects,
      totalLessons,
      activeQuizzes,
      openSupportRequests
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "admin" }),
      Class.countDocuments({ is_active: true }),
      Subject.countDocuments({ is_active: true }),
      Lesson.countDocuments({ is_active: true }),
      Quiz.countDocuments({ is_active: true }),
      SupportRequest.countDocuments({ status: "open" })
    ]);

    // Get recent user registrations
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email role createdAt");

    // Get system statistics
    const recentLogins = await User.find({ last_login: { $exists: true } })
      .sort({ last_login: -1 })
      .limit(10)
      .select("name email role last_login");

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalClasses,
        totalSubjects,
        totalLessons,
        activeQuizzes,
        openSupportRequests
      },
      recentRegistrations: recentRegistrations.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registered_at: user.createdAt
      })),
      recentLogins: recentLogins.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        last_login: user.last_login
      }))
    };
  } catch (error) {
    console.error("Admin dashboard model error:", error);
    throw error;
  }
};