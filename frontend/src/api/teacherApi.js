// src/api/teacherApi.js - Update with more functions
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/teacher",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Teacher Dashboard
export const fetchTeacherDashboard = () => API.get("/dashboard");

// Student Management
export const fetchTeacherStudents = () => API.get("/students");

export const getStudentDetails = (studentId) => API.get(`/students/${studentId}`);

export const updateStudentGrade = (studentId, gradeData) =>
  API.put(`/students/${studentId}/grade`, gradeData);

export const markStudentAttendance = (attendanceData) =>
  API.post("/students/attendance", attendanceData);

// Profile
export const fetchTeacherProfile = () => API.get("/profile");

export const updateTeacherProfile = (profileData) => API.put("/profile", profileData);

// Announcements
export const createAnnouncement = (announcementData) =>
  API.post("/announcements", announcementData);

export const getAnnouncements = () => API.get("/announcements");

export const deleteAnnouncement = (announcementId) =>
  API.delete(`/announcements/${announcementId}`);

// Assignments
export const createAssignment = (assignmentData) =>
  API.post("/assignments", assignmentData);

export const getAssignments = () => API.get("/assignments");

export const gradeAssignment = (assignmentId, gradeData) =>
  API.put(`/assignments/${assignmentId}/grade`, gradeData);

// Classes
export const getTeacherClasses = () => API.get("/classes");

export const getClassDetails = (classId) => API.get(`/classes/${classId}`);

// Messages
export const sendMessage = (messageData) => API.post("/messages", messageData);

export const getMessages = () => API.get("/messages");

export default API;