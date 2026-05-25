import { useState, useEffect } from "react";

import CreateLeadModal
  from "../components/leads/CreateLeadModal";

import useLeads
  from "../hooks/useLeads";

import MainLayout from "../layouts/MainLayout";
import LeadFilters from "../components/leads/LeadFilters";
import LeadsTable from "../components/leads/LeadsTable";
import { useAuth } from "../context/AuthContext";

export default function Leads() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    stage: "",
    counselorId: user?.role === "COUNSELOR" ? user.id : "",
    course: "",
  });
  const {leads, loading, error, fetchLeads} = useLeads();

  useEffect(() => {
    if (user && user.role === "COUNSELOR") {
      setFilters((prev) => ({
        ...prev,
        counselorId: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchLeads(filters);
  }, [filters]);

  return (
    <MainLayout>

      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Leads Workspace
        </h1>

      </div>

      <LeadFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        onAddClick={() => setIsModalOpen(true)} 
      />

      <div className="mt-6">
        <LeadsTable leads={leads} loading={loading} error={error} />
        <CreateLeadModal isOpen={isModalOpen} onClose={() =>setIsModalOpen(false)}onLeadCreated={() => fetchLeads(filters)}/>
      </div>

    </MainLayout>
  );
}