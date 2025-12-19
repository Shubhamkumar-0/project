// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import StudentDashboard from "./pages/StudentDashboard";
// import PrivateRoute from "./components/PrivateRoute";
// import LoginSuccess from "./pages/LoginSucess";
// import RegisterSuccess from "./pages/RegisterSuccess";
// import "./index.css";
// // import { ThemeProvider } from "./context/ThemeContext";
// import MainLayout from "./Layout/MainLayout";
// import Home from "./pages/Home";


// export default function App() {
//   return (

//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login-success" element={<LoginSuccess />} />
//         <Route path="/register-success" element={<RegisterSuccess />} />

//         <Route
//   path="/student/dashboard"
//   element={
//     <PrivateRoute role="student">
//       <MainLayout>
//         <StudentDashboard />
//       </MainLayout>
//     </PrivateRoute>
//   }
// />

// {/* <Route
//   path="/teacher/dashboard"
//   element={
//     <PrivateRoute role="teacher">
//       <MainLayout>
//         <TeacherDashboard />
//       </MainLayout>
//     </PrivateRoute>
//   }
// /> */}

// {/* <Route
//   path="/admin/dashboard"
//   element={
//     <PrivateRoute role="admin">
//       <MainLayout>
//         <AdminDashboard />
//       </MainLayout>
//     </PrivateRoute>
//   }
// /> */}


//         <Route
//           path="/student/dashboard"
//           element={
//             <MainLayout>
//                 <StudentDashboard />
//               </MainLayout>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }






// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginSuccess from "./pages/LoginSuccess";
import RegisterSuccess from "./pages/RegisterSuccess";

// Student Pages
import StudentDashboard from "./pages/Student/Dashboard";
import StudentSubjects from "./pages/Student/Subjects";
import StudentProfile from "./pages/Student/Profile";


// Teacher Pages
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherStudents from "./pages/Teacher/Students";
import TeacherProfile from "./pages/Teacher/Profile";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminTeachers from "./pages/Admin/Teachers";
import AdminStudents from "./pages/Admin/Students";
import AdminSettings from "./pages/Admin/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
          


          {/* Protected Routes with Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/subjects" element={<StudentSubjects />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            

              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/teachers" element={<AdminTeachers />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;