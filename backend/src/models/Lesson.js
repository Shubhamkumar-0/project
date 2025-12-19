// models/Lesson.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  is_active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Lesson", lessonSchema);