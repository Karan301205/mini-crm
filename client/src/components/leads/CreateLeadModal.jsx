import { useEffect, useState } from "react";

import api from "../../services/api";

export default function CreateLeadModal({
  isOpen,
  onClose,
  onLeadCreated,
}) {

  const [counselors, setCounselors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      email: "",
      course: "",
      stage: "New Lead",
      priority: "Medium",
      counselorId: "",
    });

  useEffect(() => {

    fetchCounselors();

  }, []);

  async function fetchCounselors() {

    try {

      const response =
        await api.get("/users");

      const counselorUsers =
        response.data.filter(
          (user) =>
            user.role === "COUNSELOR"
        );

      setCounselors(counselorUsers);

    } catch (error) {

      console.error(error);

    }
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/leads",
        formData
      );

      onLeadCreated();

      onClose();

      setFormData({
        name: "",
        phone: "",
        email: "",
        course: "",
        stage: "New Lead",
        priority: "Medium",
        counselorId: "",
      });

    } catch (error) {

      console.error(error);

      alert("Failed to create lead");

    } finally {

      setLoading(false);

    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold">
              Create Lead
            </h2>

            <p className="text-gray-500 mt-1">
              Add new student lead
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >

          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Phone"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={formData.course}
            onChange={(e) =>
              setFormData({
                ...formData,
                course: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >

            <option value="">
              Select Course
            </option>

            <option>
              Data Science
            </option>

            <option>
              Full Stack Development
            </option>

            <option>
              Data Analytics
            </option>

            <option>
              Digital Marketing
            </option>

          </select>

          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >

            <option>
              High
            </option>

            <option>
              Medium
            </option>

            <option>
              Low
            </option>

          </select>

          <select
            value={formData.counselorId}
            onChange={(e) =>
              setFormData({
                ...formData,
                counselorId: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >

            <option value="">
              Assign Counselor
            </option>

            {counselors.map((counselor) => (

              <option
                key={counselor.id}
                value={counselor.id}
              >
                {counselor.name}
              </option>

            ))}

          </select>

          <div className="col-span-2 flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >

              {loading
                ? "Creating..."
                : "Create Lead"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}