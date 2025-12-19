// models/LessonProgress.js
import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started"
  },
  completed_at: {
    type: Date
  },
  progress_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  last_accessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique student-lesson combination
lessonProgressSchema.index({ student_id: 1, lesson_id: 1 }, { unique: true });

export default mongoose.model("LessonProgress", lessonProgressSchema);