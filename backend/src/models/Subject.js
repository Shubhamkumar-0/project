// models/subjectModel.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  color_code: {
    type: String,
    default: "#3B82F6"
  },
  icon: {
    type: String,
    default: "book"
  },
  syllabus: [{
    topic: String,
    duration: Number, // in hours
    objectives: [String]
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
subjectSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Get subjects by class ID
 */
export const getSubjectsByClassId = async (classId) => {
  try {
    const subjects = await mongoose.model("Subject").find({
      class_id: classId,
      is_active: true
    })
      .populate({
        path: "teacher_id",
        select: "name email"
      })
      .populate({
        path: "prerequisites",
        select: "name code"
      })
      .sort("order");

    return subjects;
  } catch (error) {
    console.error("Get subjects by class ID error:", error);
    throw error;
  }
};

/**
 * Get subject with detailed information
 */
export const getSubjectById = async (subjectId) => {
  try {
    const subject = await mongoose.model("Subject").findById(subjectId)
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      })
      .populate({
        path: "teacher_id",
        select: "name email"
      })
      .populate({
        path: "prerequisites",
        select: "name code description"
      });

    if (!subject) {
      throw new Error("Subject not found");
    }

    // Get lesson count for this subject
    const lessonCount = await mongoose.model("Lesson").countDocuments({
      subject_id: subjectId,
      is_active: true
    });

    // Get quiz count for this subject
    const quizCount = await mongoose.model("Quiz").countDocuments({
      subject_id: subjectId,
      is_active: true
    });

    return {
      ...subject.toObject(),
      stats: {
        lessonCount,
        quizCount
      }
    };
  } catch (error) {
    console.error("Get subject by ID error:", error);
    throw error;
  }
};

/**
 * Create new subject
 */
export const createSubject = async (subjectData) => {
  try {
    // Generate unique code if not provided
    if (!subjectData.code) {
      const classData = await mongoose.model("Class").findById(subjectData.class_id);
      const subjectCount = await mongoose.model("Subject").countDocuments({
        class_id: subjectData.class_id
      });
      
      subjectData.code = `${classData.class_name.substring(0, 3).toUpperCase()}-${subjectCount + 101}`;
    }

    const subject = new mongoose.model("Subject")(subjectData);
    await subject.save();

    return subject;
  } catch (error) {
    console.error("Create subject error:", error);
    throw error;
  }
};

/**
 * Update subject
 */
export const updateSubject = async (subjectId, updateData) => {
  try {
    const subject = await mongoose.model("Subject").findByIdAndUpdate(
      subjectId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!subject) {
      throw new Error("Subject not found");
    }

    return subject;
  } catch (error) {
    console.error("Update subject error:", error);
    throw error;
  }
};

/**
 * Soft delete subject (set inactive)
 */
export const deleteSubject = async (subjectId) => {
  try {
    const subject = await mongoose.model("Subject").findByIdAndUpdate(
      subjectId,
      { is_active: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!subject) {
      throw new Error("Subject not found");
    }

    return subject;
  } catch (error) {
    console.error("Delete subject error:", error);
    throw error;
  }
};

/**
 * Get subjects taught by a teacher
 */
export const getSubjectsByTeacherId = async (teacherId) => {
  try {
    const subjects = await mongoose.model("Subject").find({
      teacher_id: teacherId,
      is_active: true
    })
      .populate({
        path: "class_id",
        select: "class_name grade_level"
      })
      .sort("order");

    return subjects;
  } catch (error) {
    console.error("Get subjects by teacher ID error:", error);
    throw error;
  }
};

/**
 * Get subjects with student progress
 */
export const getSubjectsWithProgress = async (classId, studentId) => {
  try {
    const subjects = await getSubjectsByClassId(classId);

    const subjectsWithProgress = await Promise.all(
      subjects.map(async (subject) => {
        // Get all lessons for this subject
        const lessons = await mongoose.model("Lesson").find({
          subject_id: subject._id,
          is_active: true
        }).select("_id");

        const lessonIds = lessons.map(lesson => lesson._id);

        // Get completed lessons count
        const completedLessons = await mongoose.model("LessonProgress").countDocuments({
          student_id: studentId,
          lesson_id: { $in: lessonIds },
          status: "completed"
        });

        // Calculate progress percentage
        const progressPercent = lessons.length === 0 ? 0 :
          Math.round((completedLessons / lessons.length) * 100);

        // Get next lesson to complete
        const nextLesson = await mongoose.model("Lesson").findOne({
          subject_id: subject._id,
          _id: { 
            $nin: await mongoose.model("LessonProgress")
              .find({ 
                student_id: studentId, 
                status: "completed" 
              })
              .distinct("lesson_id")
          },
          is_active: true
        })
          .select("title order")
          .sort("order");

        return {
          ...subject.toObject(),
          progress: {
            totalLessons: lessons.length,
            completedLessons,
            progressPercent,
            nextLesson: nextLesson ? {
              title: nextLesson.title,
              order: nextLesson.order
            } : null
          }
        };
      })
    );

    return subjectsWithProgress;
  } catch (error) {
    console.error("Get subjects with progress error:", error);
    throw error;
  }
};

export default mongoose.model("Subject", subjectSchema);