import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LeadFilters({ filters, onFilterChange, onAddClick }) {
  const [counselors, setCounselors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCounselors() {
      try {
        const response = await api.get("/users");
        const counselorUsers = response.data.filter(
          (user) => user.role === "COUNSELOR"
        );
        setCounselors(counselorUsers);
      } catch (error) {
        console.error("Failed to fetch counselors for filter dropdown", error);
      }
    }
    fetchCounselors();
  }, []);

  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const courses = [
    "Data Science",
    "Data Analytics",
    "Full Stack Development",
    "Digital Marketing",
  ];

  const leadStages = [
    "New Lead",
    "Interested",
    "Call Back",
    "Follow-Up",
    "Walk-In Scheduled",
    "Walk-In Missed",
    "Visited",
    "Converted",
    "Not Interested",
    "Lost Lead",
    "Re-Engagement",
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4">

      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 flex-1">
        <Search className="text-gray-500" size={20} />

        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="bg-transparent outline-none ml-3 w-full text-sm text-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={filters.stage}
          onChange={(e) => handleChange("stage", e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
        >
          <option value="">All Stages</option>
          {leadStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        {user?.role === "ADMIN" && (
          <select
            value={filters.counselorId}
            onChange={(e) => handleChange("counselorId", e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
          >
            <option value="">All Counselors</option>
            {counselors.map((counselor) => (
              <option key={counselor.id} value={counselor.id}>
                {counselor.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={filters.course}
          onChange={(e) => handleChange("course", e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white cursor-pointer focus:outline-none focus:border-blue-500"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onAddClick}
        className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap cursor-pointer"
      >
        + Add Lead
      </button>

    </div>
  );
}