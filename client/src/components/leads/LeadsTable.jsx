import { useState } from "react";
import PriorityBadge from "./PriorityBadge";
import StageBadge from "./StageBadge";
import LeadDetailDrawer from "./LeadDetailDrawer";

export default function LeadsTable({ leads,loading, error,}) {
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (!leads.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

        <h2 className="text-2xl font-bold text-gray-700">
          No Leads Found
        </h2>

        <p className="text-gray-500 mt-2">
          Leads will appear here once added.
        </p>

      </div>
    );
  }
if (loading) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

      <h2 className="text-2xl font-bold text-gray-700">
        Loading Leads...
      </h2>

    </div>
  );
}

if (error) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

      <h2 className="text-2xl font-bold text-red-600">
        {error}
      </h2>

    </div>
  );
}

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
     <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">

        <thead className="bg-gray-50 border-b border-gray-100 text-sm uppercase tracking-wide">

          <tr className="text-left text-gray-600">

            <th className="p-5">Name</th>
            <th className="p-5">Phone</th>
            <th className="p-5">Email</th>
            <th className="p-5">Course</th>
            <th className="p-5">Stage</th>
            <th className="p-5">Priority</th>
            <th className="p-5">Counselor</th>
            <th className="p-5">Created At</th>

          </tr>

        </thead>

        <tbody>

          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              onClick={() => {
                setSelectedLead(lead);
                setIsDrawerOpen(true);
              }}
            >

              <td className="p-5 font-semibold">
                {lead.name}
              </td>

              <td className="p-5">
                {lead.phone}
              </td>

              <td className="p-5">
                {lead.email}
              </td>

              <td className="p-5">
                {lead.course}
              </td>

              <td className="p-5">
                <StageBadge stage={lead.stage} />
              </td>

              <td className="p-5">
                <PriorityBadge priority={lead.priority} />
              </td>

              <td className="p-5">
                {lead.counselor?.name || "Unassigned"}
              </td>

              <td className="p-5">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>

            </tr>
          ))}

        </tbody>

      </table>
      </div>

      <div className="flex items-center justify-between p-5">

        <p className="text-gray-500">
            Showing 1 to 10 of 1256 results
        </p>

        <div className="flex gap-2">

            <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-semibold">
                1
            </button>

            <button className="w-10 h-10 rounded-lg border">
                2
            </button>

            <button className="w-10 h-10 rounded-lg border">
                3
            </button>

        </div>

        <LeadDetailDrawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      lead={selectedLead}
    />
    </div>
    </div>
  );
}