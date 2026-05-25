import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function useDashboardStats() {

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {

    async function fetchStats() {

      try {

        setLoading(true);

        const params = {};
        if (user && user.role === "COUNSELOR") {
          params.counselorId = user.id;
        }

        const response =
          await api.get("/dashboard/stats", { params });

        setStats(response.data);

      } catch (err) {

        setError("Failed to fetch dashboard stats");

      } finally {

        setLoading(false);

      }

    }

    fetchStats();

  }, [user]);

  return {
    stats,
    loading,
    error,
  };
}