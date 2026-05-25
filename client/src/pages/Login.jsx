import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import { useEffect } from "react";

export default function Login() {

  const navigate = useNavigate();

  const { login ,isAuthenticated,} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  useEffect(() => { if (isAuthenticated) { navigate("/");}

}, [isAuthenticated]);

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      const response = await api.post(
        "/auth/login",
        formData
      );

      login(response.data);

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-gray-800">
            Mini CRM
          </h1>

          <p className="text-gray-500 mt-3">
            Login to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter email"
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter password"
              required
            />

          </div>

          {error && (

            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl">

              {error}

            </div>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Demo Credentials (Click to Auto-fill)</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ email: "admin@crm.com", password: "password123" })}
              className="p-3.5 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 border border-gray-100 rounded-2xl text-left transition-all duration-200 cursor-pointer group"
            >
              <p className="text-xs font-extrabold text-blue-600 group-hover:text-blue-700">Administrator</p>
              <p className="text-[10px] text-gray-500 mt-1.5 font-semibold font-mono truncate">admin@crm.com</p>
              <p className="text-[9px] text-gray-400 mt-0.5 font-mono">Pass: password123</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ email: "counselor@crm.com", password: "password123" })}
              className="p-3.5 bg-gray-50 hover:bg-green-50/50 hover:border-green-200 border border-gray-100 rounded-2xl text-left transition-all duration-200 cursor-pointer group"
            >
              <p className="text-xs font-extrabold text-green-600 group-hover:text-green-700">Counselor</p>
              <p className="text-[10px] text-gray-500 mt-1.5 font-semibold font-mono truncate">counselor@crm.com</p>
              <p className="text-[9px] text-gray-400 mt-0.5 font-mono">Pass: password123</p>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}