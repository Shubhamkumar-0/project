import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${role}/dashboard`);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-scaleIn">
        
        <CheckCircle size={70} className="text-green-500 mx-auto animate-pop" />

        <h2 className="text-2xl font-bold text-slate-800 mt-4">
          Login Successful
        </h2>

        <p className="text-slate-600 mt-2">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
