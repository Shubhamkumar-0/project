// src/pages/Teacher/Students.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  BarChart3,
  Download,
  ChevronDown,
  UserCheck,
  UserX,
} from "lucide-react";
import { fetchTeacherStudents } from "../../api/teacherApi";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetchTeacherStudents();
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const classes = ["all", ...new Set(students.map(s => s.class_name))].filter(Boolean);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesClass = selectedClass === "all" || student.class_name === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const attendanceStats = {
    present: filteredStudents.filter(s => s.today_attendance === 'present').length,
    absent: filteredStudents.filter(s => s.today_attendance === 'absent').length,
    late: filteredStudents.filter(s => s.today_attendance === 'late').length,
    total: filteredStudents.length,
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-600">View and manage your students' progress</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{filteredStudents.length}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-sm text-gray-600">Present Today</div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-sm text-gray-600">Absent Today</div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(
                  filteredStudents.reduce((sum, s) => sum + (s.average_score || 0), 0) / filteredStudents.length
                ) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg. Score</div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className === "all" ? "All Classes" : className}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today's Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Roll No: {student.roll_number || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">{student.class_name || "Not Assigned"}</div>
                      <div className="text-sm text-gray-600">{student.email}</div>
                      {student.phone && (
                        <div className="text-sm text-gray-600">{student.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          student.today_attendance === 'present' ? 'bg-green-500' :
                          student.today_attendance === 'late' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="capitalize">{student.today_attendance || "Not marked"}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Overall: </span>
                        <span className={`font-medium ${getAttendanceColor(student.attendance_percentage || 0)}`}>
                          {student.attendance_percentage || 0}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Avg. Score</span>
                          <span className={`font-medium ${getScoreColor(student.average_score || 0)}`}>
                            {student.average_score || 0}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full ${
                              (student.average_score || 0) >= 80 ? 'bg-green-500' :
                              (student.average_score || 0) >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            } rounded-full`}
                            style={{ width: `${student.average_score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Completed: </span>
                        <span className="font-medium">{student.completed_assignments || 0}/{student.total_assignments || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        title="View Profile"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Edit Grade"
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Send Message"
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>Mark as...</option>
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No students found</div>
            <p className="text-gray-600">Try changing your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredStudents.length}</span> of{" "}
            <span className="font-medium">{students.length}</span> students
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Attendance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="text-2xl">
                {attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              <div className="text-2xl">
                {attendanceStats.total > 0 ? Math.round((attendanceStats.absent / attendanceStats.total) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                <div className="text-sm text-yellow-700">Late</div>
              </div>
              <div className="text-2xl">
                {attendanceStats.total > 0 ? Math.round((attendanceStats.late / attendanceStats.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            Submit Today's Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;