import pool from "../config/db.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // get student class
    const classResult = await pool.query(
      "SELECT c.class_name FROM classes c JOIN student_class sc ON sc.class_id=c.id WHERE sc.user_id=$1",
      [userId]
    );

    // get subjects
    const subjectsResult = await pool.query(
      `SELECT s.id, s.name 
       FROM subjects s 
       JOIN student_class sc ON sc.class_id = s.class_id 
       WHERE sc.user_id=$1`,
      [userId]
    );

    res.json({
      studentClass: classResult.rows[0],
      subjects: subjectsResult.rows
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
