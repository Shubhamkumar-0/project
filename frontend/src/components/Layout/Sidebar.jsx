// src/components/Layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  Shield,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case "student":
        return [
          { to: "/student/dashboard", icon: <Home size={20} />, label: "Dashboard" },
          { to: "/student/subjects", icon: <BookOpen size={20} />, label: "Subjects" },
          { to: "/student/profile", icon: <Settings size={20} />, label: "Profile" },
        ];
      case "teacher":
        return [
          { to: "/teacher/dashboard", icon: <Home size={20} />, label: "Dashboard" },
          { to: "/teacher/students", icon: <Users size={20} />, label: "Students" },
          { to: "/teacher/profile", icon: <Settings size={20} />, label: "Profile" },
        ];
      case "admin":
        return [
          { to: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
          { to: "/admin/teachers", icon: <UserPlus size={20} />, label: "Teachers" },
          { to: "/admin/students", icon: <Users size={20} />, label: "Students" },
          { to: "/admin/settings", icon: <Shield size={20} />, label: "Settings" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-80px)] sticky top-0">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
          <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full inline-block">
            {user?.role?.toUpperCase()}
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Quick Stats</div>
            {user?.role === "admin" && (
              <>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Active Users</span>
                  <span className="text-xs font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Online Now</span>
                  <span className="text-xs font-semibold">42</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;