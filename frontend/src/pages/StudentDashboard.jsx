import React, { useEffect, useState } from "react";
import { fetchStudentDashboard } from "../api/studentApi.js";
import { selectClass } from "../api/classApi";


const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudentDashboard()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

    const {
  student,
  subjects = [],
  continueLearning,
  quizSummary = {},
  attendance = {},
  announcements = [],
  support = {},
} = data || {};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
            <p className="text-gray-600">Welcome, {student.name}</p>
          </div>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">
            {student.class_name}
          </span>
        </div>

        {/* PROFILE */}
        <div className="grid md:grid-cols-3 gap-4">
          <ProfileCard label="Name" value={student.name} />
          <ProfileCard label="Email" value={student.email} />
          <ProfileCard label="Role" value="Student" />
        </div>

        {/* SUBJECT PROGRESS */}
        <Section title="📚 Subjects Progress">
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500">
                  {s.completedLessons} / {s.totalLessons} lessons completed
                </p>

                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${s.progressPercent}%` }}
                  />
                </div>

                <p className="text-sm mt-1">{s.progressPercent}% completed</p>
              </div>
            ))}
          </div>
        </Section>

        {/* CONTINUE LEARNING */}
        {continueLearning && (
          <Section title="▶ Continue Learning">
            <div className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{continueLearning.subject}</p>
              <p className="text-gray-600">{continueLearning.lesson}</p>
            </div>
          </Section>
        )}

        {/* QUIZ SUMMARY */}
        <Section title="📝 Quiz Summary">
          <div className="grid md:grid-cols-2 gap-4">
            <StatCard label="Quizzes Attempted" value={quizSummary.attempted} />
            <StatCard
  label="Average Score"
  value={`${quizSummary.averageScore ?? 0}%`}
/>
          </div>
        </Section>

        {/* ATTENDANCE */}
        <Section title="🏫 Attendance (This Month)">
          <div className="bg-white p-4 rounded shadow">
            <p>
  {attendance.presentDays ?? 0} / {attendance.totalDays ?? 0} days present
</p>
<p className="font-semibold">
  {attendance.percentage ?? 0}% Attendance
</p>

          </div>
        </Section>

        {/* ANNOUNCEMENTS */}
        <Section title="🔔 Announcements">
          <div className="bg-white p-4 rounded shadow space-y-2">
            {announcements.length === 0 && (
              <p className="text-gray-500">No announcements</p>
            )}
            {announcements.map((a, i) => (
              <p key={i} className="text-gray-700">
                • {a.message}
              </p>
            ))}
          </div>
        </Section>

        {/* SUPPORT */}
        <Section title="🆘 Support">
          <div className="bg-white p-4 rounded shadow">
            Open Requests: <b>{support.openRequests}</b>
          </div>
        </Section>

      </div>
    </div>
  );
};

/* REUSABLE COMPONENTS */

const ProfileCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-gray-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h2 className="text-xl font-bold">{title}</h2>
    {children}
  </div>
);

export default StudentDashboard;
