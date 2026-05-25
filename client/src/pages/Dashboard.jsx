import MainLayout from "../layouts/MainLayout";
import KpiCard from "../components/dashboard/KpiCard";
import useDashboardStats from "../hooks/useDashboardStats";
import api from "../services/api";
import { useState } from "react";
import {
  Users,
  UserPlus,
  Flame,
  CheckCircle
} from "lucide-react";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import RecentLeadsList from "../components/dashboard/RecentLeadsList";
import FollowupReminders from "../components/dashboard/FollowupReminders";

export default function Dashboard() {
    const { stats, loading, error } =useDashboardStats();
    const [importing, setImporting] =useState(false);

    async function handleImportLeads() {

  try {

    setImporting(true);

    const response =
      await api.post(
        "/import-google-sheet"
      );

    alert(response.data.message);

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert("Import failed");

  } finally {

    setImporting(false);

  }

}

    if (error) {
    return (
        <MainLayout>

        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">

            <h2 className="text-2xl font-bold text-red-600">
            {error}
            </h2>

        </div>

        </MainLayout>
    );
    }

    if (loading) {
    return (
    <MainLayout>

        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">

        <h2 className="text-2xl font-bold">
            Loading Dashboard...
        </h2>

        </div>

    </MainLayout>
    );
    }

  return (
    <MainLayout>

        <div className="flex justify-end mb-6">

  <button
    onClick={handleImportLeads}
    disabled={importing}
    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
  >

    {importing
      ? "Importing..."
      : "Import Leads"}

  </button>

</div>

      <div className="grid grid-cols-4 gap-6">

        <KpiCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={<Users className="text-blue-600" />}
          color="bg-blue-100"
        />

        <KpiCard
          title="New Leads"
          value={stats.newLeads}
          icon={<UserPlus className="text-green-600" />}
          color="bg-green-100"
        />

        <KpiCard
          title="Converted"
          value={stats.convertedLeads}
          icon={<CheckCircle className="text-green-600" />}
          color="bg-green-100"
        />

        <KpiCard
          title="Hot Leads"
          value={stats.hotLeads}
          icon={<Flame className="text-red-600" />}
          color="bg-red-100"
        />

      </div>

      {/* Analytics charts section */}
      <AnalyticsCharts stats={stats} />

      {/* Reminders & Recent Leads list layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <FollowupReminders />
        <RecentLeadsList leads={stats.recentLeads} />
      </div>

    </MainLayout>
  );
}