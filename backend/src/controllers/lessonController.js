import LessonProgress from "../models/LessonProgress.js";
import Lesson from "../models/Lesson.js";

export const markLessonComplete = async (req, res) => {
  const studentId = req.user.id;
  const { lessonId } = req.params;

  try {
    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Update or create lesson progress
    await LessonProgress.findOneAndUpdate(
      { student_id: studentId, lesson_id: lessonId },
      { 
        status: "completed", 
        completed_at: new Date(),
        progress_percentage: 100
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Lesson marked completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lesson progress failed", error: err.message });
  }
};

export const getLesson = async (req, res) => {
  const { lessonId } = req.params;
  const studentId = req.user.id;

  try {
    const lesson = await Lesson.findById(lessonId)
      .populate({
        path: "subject_id",
        select: "name class_id"
      });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Get progress for this student
    const progress = await LessonProgress.findOne({
      student_id: studentId,
      lesson_id: lessonId
    });

    res.json({
      lesson: {
        id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        duration: lesson.duration,
        subject: lesson.subject_id.name
      },
      progress: progress || {
        status: "not_started",
        progress_percentage: 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch lesson" });
  }
};