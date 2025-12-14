import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
