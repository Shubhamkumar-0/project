import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate("/login-success");

    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6">

        {/* LEFT SECTION — PLATFORM INFO */}
        <div className="flex flex-col justify-center animate-fadeInLeft">
          <h1 className="text-4xl font-bold text-slate-800 leading-tight">
            Digital Learning Platform
          </h1>

          <p className="mt-4 text-slate-600 text-lg">
            A modern learning management system designed for students,
            teachers, and institutions to collaborate, learn, and grow
            together.
          </p>

          <ul className="mt-6 space-y-3 text-slate-600">
            <li>✔ Access courses anytime, anywhere</li>
            <li>✔ Interactive quizzes and assignments</li>
            <li>✔ Track attendance and performance</li>
            <li>✔ Secure role-based access</li>
          </ul>

          <p className="mt-6 text-sm text-slate-500">
            Built to simplify digital education with clarity and security.
          </p>
        </div>

        {/* RIGHT SECTION — LOGIN CARD */}
        <div className="flex items-center justify-center animate-fadeInRight">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-semibold text-slate-800 mb-1">
              Sign in
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
