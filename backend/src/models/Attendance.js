// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    default: "absent"
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for unique attendance per student per day
attendanceSchema.index({ student_id: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);