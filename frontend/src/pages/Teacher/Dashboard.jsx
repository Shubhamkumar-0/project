// src/pages/Teacher/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Bell,
  TrendingUp,
  Clock,
  Award,
  FileText
} from "lucide-react";
import { fetchTeacherDashboard } from "../../api/teacherApi";

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetchTeacherDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboardData?.stats?.totalStudents || 0,
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      change: "+5 this month",
    },
    {
      title: "Active Classes",
      value: dashboardData?.stats?.totalClasses || 0,
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      change: "All active",
    },
    {
      title: "Avg. Performance",
      value: "85%",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      change: "+3% from last week",
    },
    {
      title: "Attendance Rate",
      value: "92%",
      icon: <Calendar className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
      change: "+2% this month",
    },
  ];

  const recentAnnouncements = [
    { title: "Math Test Next Week", date: "2 hours ago", class: "Grade 10A" },
    { title: "Science Project Deadline", date: "1 day ago", class: "Grade 11B" },
    { title: "Parent-Teacher Meeting", date: "2 days ago", class: "All Classes" },
    { title: "Holiday Announcement", date: "3 days ago", class: "All Classes" },
  ];

  const upcomingClasses = [
    { subject: "Mathematics", time: "9:00 AM", class: "Grade 10A", duration: "45 mins" },
    { subject: "Physics", time: "11:00 AM", class: "Grade 11B", duration: "1 hour" },
    { subject: "Chemistry", time: "2:00 PM", class: "Grade 10B", duration: "45 mins" },
    { subject: "Biology", time: "4:00 PM", class: "Grade 12A", duration: "1 hour" },
  ];

  const pendingTasks = [
    { task: "Grade Math Test Papers", count: 24, priority: "high" },
    { task: "Review Science Projects", count: 12, priority: "medium" },
    { task: "Update Attendance", count: 45, priority: "low" },
    { task: "Prepare Lesson Plan", count: 1, priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Teacher!</h1>
            <p className="text-purple-100">
              Here's what's happening with your classes today
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="inline-flex items-center space-x-2 bg-purple-500 bg-opacity-50 px-3 py-1 rounded-full">
                <Bell className="w-4 h-4" />
                <span>2 pending assignments to grade</span>
              </span>
              <span className="inline-flex items-center space-x-2 bg-purple-500 bg-opacity-50 px-3 py-1 rounded-full">
                <MessageSquare className="w-4 h-4" />
                <span>5 student messages</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-200">Teacher Score</div>
            <div className="text-2xl font-bold">9.2/10</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.color} rounded-lg`}>
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
        {/* Left Column - Classes & Pending Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Classes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Classes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.classes?.map((classItem, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.class_name}</h3>
                      <p className="text-sm text-gray-600">
                        Grade {classItem.grade_level} • {classItem.student_count || 32} students
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">85%</div>
                      <div className="text-xs text-gray-500">Avg. Score</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-600">24 present</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-gray-600">3 assignments due</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-600">2 new submissions</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Tasks</h2>
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{task.task}</h4>
                      <p className="text-sm text-gray-600">{task.count} items</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Classes</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                      <p className="text-sm text-gray-600">{classItem.class}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{classItem.time}</div>
                      <div className="text-xs text-gray-500">{classItem.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Starts in 2 hours</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Prepare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Announcements</h2>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <div key={index} className="border-l-4 border-purple-500 bg-gray-50 rounded-r-lg p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{announcement.class}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
              Create New Announcement
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-medium mb-1">Create Assignment</div>
                  <div className="text-xs text-blue-600">New task</div>
                </div>
              </button>
              <button className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-medium mb-1">Take Attendance</div>
                  <div className="text-xs text-green-600">Today's class</div>
                </div>
              </button>
              <button className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-medium mb-1">Grade Papers</div>
                  <div className="text-xs text-purple-600">12 pending</div>
                </div>
              </button>
              <button className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="text-center">
                  <div className="text-lg font-medium mb-1">Send Message</div>
                  <div className="text-xs text-orange-600">To students</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Top Performing Students</h2>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Class</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subjects</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Avg. Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Attendance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">S{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">Student {index + 1}</div>
                        <div className="text-sm text-gray-500">student{index + 1}@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      Grade 10A
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">Math</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">Science</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">English</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="font-medium">{92 - index * 2}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${95 - index}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{95 - index}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;