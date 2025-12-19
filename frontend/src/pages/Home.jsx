import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Rural Learning Management System
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            A digital education platform designed to empower rural students
            with structured learning, guided by teachers and supported by technology.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How the Platform Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">1️⃣ Student Login</h3>
              <p className="text-gray-600">
                Students create an account and log in securely to the platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">2️⃣ Class Selection</h3>
              <p className="text-gray-600">
                Students select their class (1–12) and get subjects automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">3️⃣ Learn & Track</h3>
              <p className="text-gray-600">
                Learn lessons, attempt quizzes, and track attendance and progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Roles & Responsibilities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Student */}
            <div className="border rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">🎓 Students</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Access class-wise subjects & lessons</li>
                <li>Track lesson progress</li>
                <li>Attempt quizzes & view scores</li>
                <li>View attendance & announcements</li>
                <li>Raise support requests</li>
              </ul>
            </div>

            {/* Teacher */}
            <div className="border rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">👨‍🏫 Teachers</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Create lessons & quizzes</li>
                <li>Mark student attendance</li>
                <li>Monitor student performance</li>
                <li>Post announcements</li>
                <li>Support student learning</li>
              </ul>
            </div>

            {/* Admin */}
            <div className="border rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-3">🛠 Admin</h3>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Approve & manage teachers</li>
                <li>System analytics & monitoring</li>
                <li>Platform configuration</li>
                <li>Ensure smooth operation</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg">
            Education should be accessible to everyone, regardless of location.
            This platform aims to bridge the educational gap in rural areas
            using structured digital learning and guided teaching.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">📍 Address</h3>
              <p className="text-gray-600">
                Rural Education Center<br />
                Bihar, India
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">📧 Email</h3>
              <p className="text-gray-600">
                support@rurallms.com
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">📞 Phone</h3>
              <p className="text-gray-600">
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Rural LMS. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
