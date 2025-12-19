// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { fetchAdminStats } from "../../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    activeUsers: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      change: "+12 this week",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: <UserPlus className="h-6 w-6" />,
      color: "bg-green-500",
      change: "+2 this month",
    },
    {
      title: "Active Classes",
      value: stats.totalClasses,
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-purple-500",
      change: "All active",
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-orange-500",
      change: "45 subjects",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-indigo-500",
      change: "42 online now",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: <AlertCircle className="h-6 w-6" />,
      color: "bg-red-500",
      change: "3 high priority",
    },
  ];

  const recentActivities = [
    { user: "John Doe", action: "registered as student", time: "5 min ago" },
    { user: "Jane Smith", action: "completed Mathematics quiz", time: "15 min ago" },
    { user: "Robert Brown", action: "created new class", time: "1 hour ago" },
    { user: "Alice Johnson", action: "submitted assignment", time: "2 hours ago" },
    { user: "Mike Wilson", action: "requested password reset", time: "3 hours ago" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">
              Welcome back! Here's what's happening with your platform.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-200">System Status</div>
            <div className="text-2xl font-bold">All Systems Operational</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.color} rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-600"> {activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="font-medium">Add New Teacher</div>
              <div className="text-sm text-blue-600">Register teacher account</div>
            </button>
            <button className="w-full bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="font-medium">Create Class</div>
              <div className="text-sm text-green-600">Setup new class</div>
            </button>
            <button className="w-full bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="font-medium">System Report</div>
              <div className="text-sm text-purple-600">Generate platform report</div>
            </button>
            <button className="w-full bg-red-50 text-red-700 p-4 rounded-lg hover:bg-red-100 transition-colors text-left">
              <div className="font-medium">Pending Approvals</div>
              <div className="text-sm text-red-600">{stats.pendingRequests} pending</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;