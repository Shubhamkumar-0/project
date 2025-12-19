import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const getSubjectQuizzes = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const quizzes = await Quiz.find({ 
      subject_id: subjectId,
      is_active: true 
    }).select("title description total_marks time_limit");

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz fetch failed", error: err.message });
  }
};

export const startQuiz = async (req, res) => {
  const studentId = req.user.id;
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      student_id: studentId,
      quiz_id: quizId,
      total_marks: quiz.total_marks
    });

    // Return questions without answers
    const questions = quiz.questions.map(q => ({
      question_text: q.question_text,
      options: q.options,
      marks: q.marks
    }));

    res.json({
      attemptId: attempt._id,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        time_limit: quiz.time_limit,
        total_marks: quiz.total_marks
      },
      questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start quiz", error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  const studentId = req.user.id;
  const { attemptId } = req.params;
  const { answers, time_taken } = req.body;

  try {
    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.student_id.toString() !== studentId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const quiz = await Quiz.findById(attempt.quiz_id);
    let score = 0;
    
    const detailedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const is_correct = question.correct_answer === answer.selected_answer;
      
      if (is_correct) {
        score += question.marks;
      }

      return {
        question_index: index,
        selected_answer: answer.selected_answer,
        is_correct,
        correct_answer: question.correct_answer,
        marks: question.marks
      };
    });

    const percentage = Math.round((score / quiz.total_marks) * 100);

    // Update attempt
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.time_taken = time_taken;
    attempt.answers = detailedAnswers;
    attempt.completed_at = new Date();
    
    await attempt.save();

    res.json({
      score,
      total_marks: quiz.total_marks,
      percentage,
      detailedAnswers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit quiz", error: err.message });
  }
};