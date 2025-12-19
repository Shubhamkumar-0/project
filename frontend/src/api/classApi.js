// // src/api/classApi.js
// import axios from "axios";
// import apiClient from "./apiClient";

// const API = axios.create({
//   baseURL: "http://localhost:8000/api/class",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const selectClass = (class_number) => {
//   return API.post("/select", { class_number });
//   // Use the full path from the base /api URL
//   return apiClient.post("/class/select", { class_number });
// };
