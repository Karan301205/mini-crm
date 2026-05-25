import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">

        <Topbar />

        <div className="mt-6">
          {children}
        </div>

      </div>

    </div>
  );
}