// src/routes/student_dashboard_routes.js
import express from "express";
import { verifyToken, requireRole } from "../middlewares/auth_middleware.js";
import pool from "../config/db_postgres.js";

const router = express.Router();

// helper: find which of candidate column names exists on a table
async function findColumn(tableName, candidates = []) {
  if (!tableName || candidates.length === 0) return null;
  const q = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
  `;
  const { rows } = await pool.query(q, [tableName]);
  const existing = rows.map(r => r.column_name.toLowerCase());
  for (const c of candidates) {
    if (existing.includes(c.toLowerCase())) return c;
  }
  // fallback: return first column that looks like an id if available
  const idLike = existing.find(col => /course|student|assign|id|ref/i.test(col));
  return idLike || null;
}

router.get("/", verifyToken, requireRole(["student"]), async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1) basic student info from users table (we assume standard names here)
    const profileQ = `SELECT id, name, email, role, created_at FROM users WHERE id = $1`;
    const profileRes = await pool.query(profileQ, [studentId]);
    const profile = profileRes.rows[0] || null;

    // 2) discover column names we need
    // enrollments: student -> course link
    const enrollColCandidates = ["student_id", "studentid", "user_id", "userId"];
    const enrollCourseCandidates = ["course_id", "courseid", "course", "cid"];
    const assignCourseCandidates = ["course_id", "courseid", "course", "cid"];
    const assignIdCandidates = ["id", "assignment_id", "assignmentid"];
    const notifStudentCandidates = ["student_id", "studentid", "user_id"];

    const enrollStudentCol = await findColumn("enrollments", enrollColCandidates);
    const enrollCourseCol = await findColumn("enrollments", enrollCourseCandidates);

    const assignCourseCol = await findColumn("assignments", assignCourseCandidates);
    const assignIdCol = await findColumn("assignments", assignIdCandidates);

    const courseIdColOnCourses = await findColumn("courses", ["id", "course_id", "courseid"]);
    const courseTitleCol = await findColumn("courses", ["title", "name"]);

    const notifStudentCol = await findColumn("notifications", notifStudentCandidates);
    const notifMsgCol = await findColumn("notifications", ["message", "note", "text"]);

    // If critical mappings missing, give clear error back
    if (!enrollStudentCol || !enrollCourseCol) {
      console.warn("Dashboard: enrollments table column mapping missing", { enrollStudentCol, enrollCourseCol });
    }
    if (!assignCourseCol) {
      console.warn("Dashboard: assignments.course mapping missing", { assignCourseCol });
    }

    // 3) Build enrolled courses query (use dynamic column names)
    let courses = [];
    if (enrollStudentCol && enrollCourseCol) {
      // join enrollments -> courses using discovered column names
      const enrollCourseColExpr = `"${enrollCourseCol}"`;
      const coursesJoinQ = `
        SELECT c.* FROM enrollments e
        JOIN courses c ON c.${courseIdColOnCourses || "id"}::text = e.${enrollCourseColExpr}::text
        WHERE e.${enrollStudentCol} = $1
      `;
      try {
        const cRes = await pool.query(coursesJoinQ, [studentId]);
        courses = cRes.rows;
      } catch (err) {
        // fallback: if enrollments.course is actually a course title, try matching by title
        try {
          const altQ = `
            SELECT c.* FROM enrollments e
            JOIN courses c ON c.${courseTitleCol || "title"}::text = e.${enrollCourseCol}::text
            WHERE e.${enrollStudentCol} = $1
          `;
          const altRes = await pool.query(altQ, [studentId]);
          courses = altRes.rows;
        } catch (err2) {
          console.error("Dashboard: failed to fetch courses (tried joins)", err, err2);
        }
      }
    }

    // 4) Assignments: get assignments related to student's enrolled courses
    let assignments = [];
    try {
      if (assignCourseCol && enrollCourseCol && enrollStudentCol) {
        // collect course ids from enrollments for this student
        const courseIdsQ = `SELECT e.${enrollCourseCol} as course_ref FROM enrollments e WHERE e.${enrollStudentCol} = $1`;
        const courseIdsRes = await pool.query(courseIdsQ, [studentId]);
        const courseRefs = courseIdsRes.rows.map(r => r.course_ref).filter(Boolean);
        if (courseRefs.length > 0) {
          // paramize dynamically
          const params = courseRefs.map((_, i) => `$${i + 1}`).join(",");
          const assignQ = `SELECT * FROM assignments a WHERE a.${assignCourseCol}::text IN (${params}) ORDER BY a.due_date NULLS LAST LIMIT 10`;
          const assignRes = await pool.query(assignQ, courseRefs);
          assignments = assignRes.rows;
        } else {
          assignments = [];
        }
      }
    } catch (err) {
      console.error("Dashboard: assignments query failed", err);
    }

    // 5) Notifications (student-specific + global)
    let notifications = [];
    try {
      const globalNoticesQ = `SELECT id, message, created_at, is_read FROM notifications WHERE (student_id IS NULL) ORDER BY created_at DESC LIMIT 5`;
      const studentNoticesQ = notifStudentCol
        ? `SELECT id, ${notifMsgCol || "message"} as message, created_at, is_read FROM notifications WHERE ${notifStudentCol} = $1 ORDER BY created_at DESC LIMIT 5`
        : null;

      const globalRes = await pool.query(globalNoticesQ);
      notifications = globalRes.rows || [];
      if (studentNoticesQ) {
        const studentNotRes = await pool.query(studentNoticesQ, [studentId]);
        notifications = notifications.concat(studentNotRes.rows || []);
      }
      // sort by created_at desc
      notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      notifications = notifications.slice(0, 7);
    } catch (err) {
      console.error("Dashboard: notifications query failed", err);
    }

    // 6) Attendance summary (last 30 days) - try to find student_id column
    let attendanceSummary = { present: 0, total: 0 };
    try {
      const attStudent = await findColumn("attendance", ["student_id", "studentid", "user_id"]);
      if (attStudent) {
        const attQ = `
          SELECT status, count(*) as cnt
          FROM attendance
          WHERE ${attStudent} = $1 AND date >= (CURRENT_DATE - INTERVAL '30 days')
          GROUP BY status
        `;
        const attRes = await pool.query(attQ, [studentId]);
        let present = 0, total = 0;
        for (const r of attRes.rows) {
          total += Number(r.cnt || 0);
          if (r.status && String(r.status).toLowerCase().startsWith("p")) present += Number(r.cnt || 0);
        }
        attendanceSummary = { present, total };
      }
    } catch (err) {
      console.error("Dashboard: attendance query failed", err);
    }

    // 7) Grades: fetch latest grades for student
    let grades = [];
    try {
      const gradeStudentCol = await findColumn("grades", ["student_id", "studentid", "user_id"]);
      if (gradeStudentCol) {
        const gradeQ = `SELECT * FROM grades WHERE ${gradeStudentCol} = $1 ORDER BY id DESC LIMIT 10`;
        const gRes = await pool.query(gradeQ, [studentId]);
        grades = gRes.rows;
      }
    } catch (err) {
      console.error("Dashboard: grades query failed", err);
    }

    // final payload
    return res.json({
      success: true,
      dashboard: {
        profile,
        courses,
        assignments,
        notifications,
        attendanceSummary,
        grades
      },
      meta: {
        discovered: {
          enrollStudentCol,
          enrollCourseCol,
          assignCourseCol,
          courseIdColOnCourses,
          courseTitleCol,
          notifStudentCol,
          notifMsgCol
        }
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;
