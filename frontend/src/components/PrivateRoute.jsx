// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/" />;
// }

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function PrivateRoute({ children, role }) {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/" />;

//   if (role && user.role !== role) {
//     return <Navigate to="/" />;
//   }

//   return children;
// }



// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}