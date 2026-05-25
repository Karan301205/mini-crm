import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export default function useLeads() {

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  async function fetchLeads(filters = {}) {

    try {

      setLoading(true);

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.stage && filters.stage !== "All Stages") params.stage = filters.stage;
      if (filters.counselorId && filters.counselorId !== "All Counselors") params.counselorId = filters.counselorId;
      if (filters.course && filters.course !== "All Courses") params.course = filters.course;

      const response =
        await api.get("/leads", { params });

      setLeads(response.data);

    } catch (err) {

      setError(
        "Failed to fetch leads"
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    fetchLeads();

  }, []);

  return {
    leads,
    loading,
    error,
    fetchLeads,
  };
}