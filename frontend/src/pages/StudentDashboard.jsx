// export default function StudentDashboard() {
//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>🎓 Student Dashboard</h1>
//       <p>Welcome to Digital Learning Platform</p>

//       <ul>
//         <li>📚 My Courses</li>
//         <li>📝 Attendance</li>
//         <li>🧠 Quizzes</li>
//         <li>📂 Assignments</li>
//       </ul>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }


import { BookOpen, ClipboardList, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 animate-fadeInLeft">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">
          Student Panel
        </h2>

        <nav className="space-y-4 text-slate-700">
          <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
            <User size={18} /> Profile
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
            <BookOpen size={18} /> My Courses
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
            <ClipboardList size={18} /> Attendance
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 mt-10"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 animate-fadeInRight">

        {/* WELCOME */}
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, Student 👋
        </h1>
        <p className="text-slate-600 mt-1">
          Here’s your learning overview
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard title="Courses Enrolled" value="4" />
          <StatCard title="Attendance %" value="92%" />
          <StatCard title="Quizzes Completed" value="6" />
        </div>

        {/* COURSES */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            My Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseCard title="Web Development" />
            <CourseCard title="Data Structures" />
            <CourseCard title="Operating Systems" />
            <CourseCard title="Database Systems" />
          </div>
        </div>
      </main>
    </div>
  );
}

/* SMALL COMPONENTS */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 animate-scaleIn">
      <p className="text-slate-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-indigo-600 mt-2">
        {value}
      </h3>
    </div>
  );
}

function CourseCard({ title }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        View lessons and assignments
      </p>
    </div>
  );
}
