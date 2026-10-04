import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const role = localStorage.getItem("userRole");

  // Only admin can access admin pages
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
