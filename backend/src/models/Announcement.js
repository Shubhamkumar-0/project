// models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  target_roles: [{
    type: String,
    enum: ["student", "teacher", "admin", "all"]
  }],
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class"
  },
  is_active: {
    type: Boolean,
    default: true
  },
  expires_at: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model("Announcement", announcementSchema);