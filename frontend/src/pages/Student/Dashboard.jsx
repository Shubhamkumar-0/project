// src/pages/Student/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchStudentDashboard,selectClass  } from "../../api/studentApi";
import {
  BookOpen,
  CheckCircle,
  BarChart3,
  Calendar,
  AlertCircle,
  Book,
} from "lucide-react";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClassNumber, setSelectedClassNumber] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await fetchStudentDashboard();
      const dashboardData = res.data;

      if (dashboardData.needsClassSelection) {
        setShowClassModal(true);
      }

      setData(dashboardData);
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = async () => {
    try {
      await selectClass(selectedClassNumber);
      setShowClassModal(false);
      setSelectedClassNumber(null);
      loadDashboard();
    } catch (err) {
      alert("Failed to select class");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const {
    student,
    subjects = [],
    continueLearning,
    quizSummary = {},
    attendance = {},
    needsClassSelection,
  } = data;

  /* ---------------- CLASS SELECTION MODAL ---------------- */
  if (needsClassSelection && showClassModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-8">
            <Book className="w-14 h-14 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              Choose Your Class
            </h2>
            <p className="text-gray-500 mt-2">
              Select your academic grade to continue
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((grade) => (
              <div
                key={grade}
                onClick={() => setSelectedClassNumber(grade)}
                className={`rounded-xl border p-4 cursor-pointer transition-all
                  ${
                    selectedClassNumber === grade
                      ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
                      : "bg-white hover:bg-blue-50 hover:border-blue-300"
                  }`}
              >
                <h3 className="text-lg font-semibold">Grade {grade}</h3>
                <p
                  className={`text-sm ${
                    selectedClassNumber === grade
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  Standard Curriculum
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleClassSelect}
            disabled={!selectedClassNumber}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
              text-white font-semibold text-lg shadow-md hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Class
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */

  const stats = [
    {
      title: "Subjects",
      value: subjects.length,
      icon: <BookOpen />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Completed Lessons",
      value: subjects.reduce(
        (sum, s) => sum + (s.completedLessons || 0),
        0
      ),
      icon: <CheckCircle />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Average Score",
      value: `${quizSummary.averageScore || 0}%`,
      icon: <BarChart3 />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Attendance",
      value: `${attendance.percentage || 0}%`,
      icon: <Calendar />,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">
          Welcome, {student.name}
        </h1>
        <p className="mt-2 text-blue-100 text-lg">
          Class: <span className="font-semibold">{student.class_name}</span>
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white shadow-md hover:shadow-xl transition p-6"
          >
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4`}
            >
              {stat.icon}
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* CONTINUE LEARNING */}
      {continueLearning && (
        <div className="rounded-2xl bg-white shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-3">
            Continue Learning
          </h2>
          <p className="text-lg font-medium text-gray-800">
            {continueLearning.lesson}
          </p>
          <p className="text-gray-500">
            {continueLearning.subject}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;


