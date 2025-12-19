// models/Quiz.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  description: {
    type: String
  },
  total_marks: {
    type: Number,
    required: true
  },
  time_limit: {
    type: Number, // in minutes
    default: 30
  },
  is_active: {
    type: Boolean,
    default: true
  },
  questions: [{
    question_text: String,
    options: [String],
    correct_answer: Number, // index of correct option
    marks: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Quiz", quizSchema);