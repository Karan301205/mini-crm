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

      </div>

    </div>
  );
}