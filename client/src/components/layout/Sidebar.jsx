import {
  LayoutDashboard,
  Users,
  UserSquare2,
  ClipboardList,
  Settings
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { user,logout } = useAuth();
  const location = useLocation();
  const menuItems = [

  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />
  },

  {
    name: "Leads",
    path: "/leads",
    icon: <ClipboardList size={20} />
  },

  ...(user?.role === "ADMIN"
    ? [
        {
          name: "Users",
          path: "/users",
          icon: <Users size={20} />
        }
      ]
    : []),

  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={20} />
  }

 

];

  return (
    <div className="w-72 bg-[#071B3B] text-white flex flex-col">

      <div className="h-20 flex items-center px-6 border-b border-blue-900">
        <h1 className="text-2xl font-bold">
          Mini CRM
        </h1>
      </div>

      <div className="flex flex-col gap-2 p-4">

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-blue-800"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

      </div>

      <div className="mt-auto p-4">
        <button onClick={logout} className="w-full bg-red-500 hover:bg-red-600 rounded-xl py-3 font-semibold">
          Logout
        </button>
      </div>

    </div>
  );
}