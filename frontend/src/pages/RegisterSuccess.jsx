import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-fadeInRight">
        
        <CheckCircle size={60} className="text-green-500 mx-auto" />

        <h2 className="text-2xl font-bold text-slate-800 mt-4">
          Registration Successful!
        </h2>

        <p className="text-slate-600 mt-2">
          Your account has been created successfully.
          You can now log in and start learning.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
