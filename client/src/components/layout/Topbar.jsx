import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/leads":
        return "Leads Workspace";
      case "/users":
        return "User Directory";
      case "/settings":
        return "Settings";
      default:
        return "Mini CRM";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white h-20 rounded-2xl shadow-sm px-6 flex items-center justify-between">

      <h1 className="text-3xl font-bold text-gray-800">
        {getTitle()}
      </h1>

      <div className="flex items-center gap-6">

        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            2
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {getInitials(user?.name)}
          </div>

          <div>
            <p className="font-semibold text-sm text-gray-800 leading-tight">{user?.name || user?.role}</p>
            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}