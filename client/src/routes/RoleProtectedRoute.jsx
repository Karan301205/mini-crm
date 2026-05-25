import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-3xl shadow-lg text-center">

          <h1 className="text-4xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="text-gray-500 mt-3">
            You do not have permission to access this page.
          </p>

        </div>

      </div>
    );
  }

  return children;
}