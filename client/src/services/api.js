import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mini-crm-5hfw.onrender.com",
});

export default api;