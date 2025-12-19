// models/QuizAttempt.js
import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  total_marks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  time_taken: {
    type: Number // in seconds
  },
  answers: [{
    question_index: Number,
    selected_answer: Number,
    is_correct: Boolean
  }],
  completed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);