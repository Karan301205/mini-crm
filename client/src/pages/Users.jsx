import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import CreateUserModal from "../components/users/CreateUserModal";
import { User, Shield, UserCheck, Calendar } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user directory.");
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Directory</h1>
          <p className="text-sm text-gray-400 mt-1">Manage system administrators and counselors</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-xl font-bold text-gray-500">Loading directory...</h2>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-xl font-bold text-red-600">{error}</h2>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-700">No Users Found</h2>
          <p className="text-gray-500 mt-2">Create counselor and admin accounts using "+ Add User".</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm uppercase tracking-wide">
                <tr className="text-left text-gray-600">
                  <th className="p-5">User</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5">System Role</th>
                  <th className="p-5">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition duration-150"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-base">
                          {getInitials(user.name)}
                        </div>
                        <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-600 font-semibold">{user.email}</td>
                    <td className="p-5">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <Shield size={12} />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <UserCheck size={12} />
                          Counselor
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={fetchUsers}
      />
    </MainLayout>
  );
}