import axios from "axios";

export const fetchStudentDashboard = () => {
  return axios.get("http://localhost:8000/api/student/dashboard", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
