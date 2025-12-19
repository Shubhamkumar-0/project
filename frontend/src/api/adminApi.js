// src/api/adminApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/admin",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Admin Dashboard
export const fetchAdminStats = async () => {
  const response = await API.get("/stats");
  return response.data;
};

// Teacher Management
export const fetchTeachers = async () => {
  const response = await API.get("/teachers");
  return response.data;
};

export const createTeacher = async (teacherData) => {
  const response = await API.post("/teachers", teacherData);
  return response.data;
};

export const updateTeacher = async (id, teacherData) => {
  const response = await API.put(`/teachers/${id}`, teacherData);
  return response.data;
};

export const deleteTeacher = async (id) => {
  const response = await API.delete(`/teachers/${id}`);
  return response.data;
};

// Student Management
export const fetchAllStudents = async () => {
  const response = await API.get("/students");
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await API.put(`/students/${id}`, studentData);
  return response.data;
};

// Class Management
export const fetchAllClasses = async () => {
  const response = await API.get("/classes");
  return response.data;
};

export const createClass = async (classData) => {
  const response = await API.post("/classes", classData);
  return response.data;
};

export default API;