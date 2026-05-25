import React, { useState } from "react";
import PriorityBadge from "../leads/PriorityBadge";
import StageBadge from "../leads/StageBadge";
import LeadDetailDrawer from "../leads/LeadDetailDrawer";

export default function RecentLeadsList({ leads }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  const formatTimeAgo = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) {
        return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
      } else if (diffHrs < 24) {
        return `${diffHrs}h ago`;
      } else if (diffDays === 1) {
        return "Yesterday";
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Recent Leads</h3>
          <p className="text-sm text-gray-400">Newly registered profiles</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {leads && leads.length > 0 ? (
          leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleOpenDrawer(lead)}
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Initials circle */}
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{lead.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{lead.course}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[10px] text-gray-400 font-medium">
                  {formatTimeAgo(lead.createdAt)}
                </span>
                <PriorityBadge priority={lead.priority} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p>No recent leads found</p>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          lead={selectedLead}
        />
      )}
    </div>
  );
}
