// models/SupportRequest.js
import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["technical", "academic", "billing", "other"],
    default: "other"
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed"],
    default: "open"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolution_notes: {
    type: String
  },
  resolved_at: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model("SupportRequest", supportRequestSchema);