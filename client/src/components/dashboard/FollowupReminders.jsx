import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Check, Clock, Calendar, CheckCircle2 } from "lucide-react";
import FollowupStatusBadge from "../leads/FollowupStatusBadge";

export default function FollowupReminders() {
  const { user } = useAuth();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active"); // "active" (Pending/Upcoming) or "completed"

  useEffect(() => {
    fetchFollowups();
  }, [user, filter]);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      let url = "/followups";
      const params = [];
      
      if (user && user.role === "COUNSELOR") {
        params.push(`counselorId=${user.id}`);
      }
      
      if (filter === "active") {
        // We'll filter in JS or fetch all and filter in JS to keep it simple since endpoint returns 50
      } else if (filter === "completed") {
        params.push("status=Completed");
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await api.get(url);
      
      // Filter active (Pending / Upcoming) vs completed in frontend to handle multi-status "active"
      if (filter === "active") {
        setFollowups(response.data.filter(f => f.status !== "Completed"));
      } else {
        setFollowups(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch follow-ups", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering details card if integrated
    try {
      await api.patch(`/followups/${id}`, { status: "Completed" });
      // Instantly update local state for fast feedback
      setFollowups(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error("Failed to complete follow-up", error);
      alert("Failed to mark follow-up as completed");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date set";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Follow-Up Reminders</h3>
          <p className="text-sm text-gray-400">Scheduled counselor checklist</p>
        </div>
        
        {/* Active vs Completed Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "active" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "completed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[360px] space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400 text-sm font-semibold">Loading reminders...</p>
          </div>
        ) : followups.length > 0 ? (
          followups.map((followup) => (
            <div
              key={followup.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                followup.status === "Completed"
                  ? "bg-gray-50/50 border-gray-100"
                  : "bg-white border-gray-100 hover:shadow-md hover:border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-800 text-sm leading-snug">{followup.title}</h4>
                    <span className="text-xs text-gray-400 font-medium">for</span>
                    <span className="text-xs font-bold text-blue-600">{followup.lead?.name || "Unknown Lead"}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{followup.comment}</p>
                </div>

                {/* Status and Action */}
                <div className="flex items-center gap-2">
                  {filter === "active" && (
                    <button
                      onClick={(e) => handleComplete(followup.id, e)}
                      title="Mark as Completed"
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </button>
                  )}
                  {filter === "completed" && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(followup.scheduledAt || followup.createdAt)}</span>
                </div>
                {user?.role === "ADMIN" && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-500">
                    Agent: {followup.counselor?.name || "System"}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Clock className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm font-semibold">No {filter} follow-ups</p>
          </div>
        )}
      </div>
    </div>
  );
}
