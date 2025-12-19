import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getStudentDashboard } from "../controllers/studentController.js";
import { 
  getLesson, 
  markLessonComplete 
} from "../controllers/lessonController.js";
import { 
  getSubjectQuizzes, 
  startQuiz, 
  submitQuiz 
} from "../controllers/quizzController.js";

const router = express.Router();

// Student dashboard
router.get("/dashboard", protect, getStudentDashboard);

// Lessons
router.get("/lessons/:lessonId", protect, getLesson);
router.post("/lessons/:lessonId/complete", protect, markLessonComplete);

// Quizzes
router.get("/subjects/:subjectId/quizzes", protect, getSubjectQuizzes);
router.post("/quizzes/:quizId/start", protect, startQuiz);
router.post("/quizzes/attempt/:attemptId/submit", protect, submitQuiz);

export default router;