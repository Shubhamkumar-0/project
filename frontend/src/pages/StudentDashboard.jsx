import React, { useEffect, useState } from "react";
import { fetchStudentDashboard } from "../api/studentApi";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudentDashboard()
      .then((res) => {
        // 👈 Backend sends { student: {...} }
        setStudent(res.data.student);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Student Dashboard</h1>

      <p><b>Name:</b> {student?.name}</p>
      <p><b>Email:</b> {student?.email}</p>
      <p><b>Role:</b> Student</p>
    </div>
  );
};

export default StudentDashboard;
