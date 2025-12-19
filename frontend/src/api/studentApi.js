// src/api/studentApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/student",
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Dashboard functions
export const fetchStudentDashboard = () => API.get("/dashboard");

// Profile functions
export const fetchStudentProfile = () => API.get("/profile");
export const updateStudentProfile = (profileData) => API.put("/profile", profileData);

// Subject functions
export const fetchStudentSubjects = () => API.get("/subjects");
export const getSubjectDetails = (subjectId) => API.get(`/subjects/${subjectId}`);
export const getSubjectLessons = (subjectId) => API.get(`/subjects/${subjectId}/lessons`);

// Class functions
// export const fetchStudentClass = () => API.get("/class");
// export const selectClass = (class_number) => API.post("/class/select", { class_number });
// export const getClassDetails = () => API.get("/class/details");

export const selectClass = (class_number) =>
  axios.post(
    "http://localhost:8000/api/class/select",
    { class_number },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );


export default API;