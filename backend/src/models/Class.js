// models/Class.js
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
    unique: true
  },
  grade_level: {
    type: Number,
    required: true
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

export default mongoose.model("Class", classSchema);