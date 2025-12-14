import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      // navigate("/");
      navigate("/register-success");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6">

        {/* LEFT SECTION — PLATFORM MESSAGE */}
        {/* <div className="flex flex-col justify-center animate-fadeInLeft">
          <h1 className="text-4xl font-bold text-slate-800 leading-tight">
            Join the Digital Learning Platform
          </h1>

          <p className="mt-4 text-slate-600 text-lg">
            Create your account and become part of a modern education ecosystem
            designed for collaboration, growth, and performance tracking.
          </p>

          <ul className="mt-6 space-y-3 text-slate-600">
            <li>✔ Learn at your own pace</li>
            <li>✔ Teachers manage courses efficiently</li>
            <li>✔ Track attendance and assessments</li>
            <li>✔ Secure and role-based access</li>
          </ul>

          <p className="mt-6 text-sm text-slate-500">
            Start your journey with a platform built for the future of learning.
          </p>
        </div> */}


        <div className="flex flex-col justify-center animate-fadeInLeft">
  <h1 className="text-4xl font-bold text-slate-800">
    Join the Digital Learning Platform
  </h1>

  <p className="mt-4 text-slate-600 text-lg">
    A secure and modern platform designed for smart education.
  </p>

  <div className="mt-8 space-y-5">
    <div className="flex items-center gap-4">
      <GraduationCap className="text-indigo-600" />
      <span className="text-slate-600">Learn anytime, anywhere</span>
    </div>

    <div className="flex items-center gap-4">
      <Users className="text-indigo-600" />
      <span className="text-slate-600">Teachers & students collaboration</span>
    </div>

    <div className="flex items-center gap-4">
      <ShieldCheck className="text-indigo-600" />
      <span className="text-slate-600">Secure role-based access</span>
    </div>
  </div>

  <p className="mt-6 text-sm text-slate-500">
    Start your journey with a platform built for the future.
  </p>
</div>


        {/* RIGHT SECTION — REGISTER CARD */}
        <div className="flex items-center justify-center animate-fadeInRight">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-semibold text-slate-800 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Register as
                </label>
                <select
                  name="role"
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
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
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
