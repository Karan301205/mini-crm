import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Leads from "../pages/Leads";
import Login from "../pages/Login";
import Users from "../pages/Users";
import RoleProtectedRoute from "./RoleProtectedRoute";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<ProtectedRoute> <RoleProtectedRoute allowedRoles={["ADMIN"]}><Users /></RoleProtectedRoute></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}