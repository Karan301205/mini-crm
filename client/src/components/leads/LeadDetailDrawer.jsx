import { X } from "lucide-react";
// import { useState } from "react";
import dummyFollowups from "../../utils/dummyFollowups";
import FollowupCard from "./FollowupCard";
import { useEffect, useState } from "react"; 
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";


export default function LeadDetailDrawer({
  isOpen,
  onClose,
  lead
}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  
  // Followups states
  const [followups, setFollowups] = useState([]);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFollowupData, setNewFollowupData] = useState({
    title: "",
    comment: "",
    status: "Upcoming",
    scheduledAt: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    stage: "",
    priority: "",
    counselorId: "",
  });

  useEffect(() => {

  if (lead) {

    setFormData({

      name: lead.name || "",

      phone: lead.phone || "",

      email: lead.email || "",

      course: lead.course || "",

      stage: lead.stage || "",

      priority: lead.priority || "",

      counselorId:
        lead.counselorId || "",

    });

    // Fetch actual followups
    fetchFollowups();

  }

}, [lead]);


useEffect(() => {

  fetchCounselors();

}, []);

async function fetchFollowups() {
  if (!lead) return;
  try {
    setLoadingFollowups(true);
    const response = await api.get(`/followups?leadId=${lead.id}`);
    setFollowups(response.data);
  } catch (error) {
    console.error("Failed to fetch lead follow-ups", error);
  } finally {
    setLoadingFollowups(false);
  }
}

async function handleAddFollowup(e) {
  e.preventDefault();
  if (!newFollowupData.title.trim()) {
    alert("Please enter a title");
    return;
  }
  
  const counselorId = lead.counselorId || user?.id;
  if (!counselorId) {
    alert("Cannot add follow-up: No counselor is assigned to this lead, and you are not logged in.");
    return;
  }

  try {
    await api.post("/followups", {
      title: newFollowupData.title,
      comment: newFollowupData.comment,
      status: newFollowupData.status,
      scheduledAt: newFollowupData.scheduledAt || null,
      leadId: lead.id,
      counselorId: counselorId
    });
    setNewFollowupData({
      title: "",
      comment: "",
      status: "Upcoming",
      scheduledAt: ""
    });
    setShowAddForm(false);
    fetchFollowups();
  } catch (error) {
    console.error(error);
    alert("Failed to add follow-up");
  }
}

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

async function handleSave() {

  try {

    await api.patch(

      `/leads/${lead.id}`,

      formData

    );

    alert("Lead updated");

    setIsEditing(false);

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert("Update failed");

  }

}


  if (!isOpen || !lead) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">

      <div className="w-[700px] h-full bg-white shadow-2xl overflow-y-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h2 className="text-3xl font-bold">
              Lead Details
            </h2>

            <p className="text-gray-500 mt-1">
              Detailed lead information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X />
          </button>

        </div>

        {/* PROFILE SECTION */}

        <div className="p-6 border-b">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-3xl font-bold">
              {formData.name ? formData.name.charAt(0) : lead.name.charAt(0)}
            </div>

            <div>

              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Lead Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-xl font-bold border border-gray-200 rounded-xl px-3 py-1.5 w-72 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold">
                      {lead.name}
                    </h2>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                      {lead.priority} Priority
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Save Details
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button className="border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium transition cursor-pointer">
                      More
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* TABS */}

        <div className="flex border-b px-6">

            {["Overview", "Follow-Ups", "Notes", "History"].map((tab) => (

                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-5 font-medium transition ${
                    activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                >
                {tab}
                </button>

            ))}

            </div>

        {/* CONTENT */}

        {/* CONTENT */}

<div className="p-6">

  {activeTab === "Overview" && (

    <div className="grid grid-cols-2 gap-6">

      {/* LEFT */}

      <div className="bg-gray-50 rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-5">
          Basic Information
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Course</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Data Science">Data Science</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Full Stack Development">Full Stack Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Lead Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {["New Lead", "Interested", "Call Back", "Follow-Up", "Walk-In Scheduled", "Walk-In Missed", "Visited", "Converted", "Not Interested", "Lost Lead", "Re-Engagement"].map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Counselor</label>
              {user?.role === "ADMIN" ? (
                <select
                  value={formData.counselorId}
                  onChange={(e) => setFormData({ ...formData, counselorId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {counselors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-semibold bg-gray-100 px-3 py-2.5 rounded-xl text-gray-600 select-none">
                  {lead.counselor?.name || "Unassigned"}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-gray-500 text-xs font-semibold">Created At</p>
              <p className="text-sm font-medium mt-1">
                {new Date(lead.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email} />
            <Info label="Course" value={lead.course} />
            <Info label="Lead Stage" value={lead.stage} />
            <Info label="Counselor" value={lead.counselor?.name || "Unassigned"} />
            <Info label="Created At" value={new Date(lead.createdAt).toLocaleString()} />

          </div>
        )}

      </div>

      {/* RIGHT */}

      <div className="bg-gray-50 rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-5">
          Timeline / Activity
        </h3>

        <div className="space-y-6">

          <TimelineItem
            title="Lead Created"
            time={new Date(lead.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          />

          <TimelineItem
            title="Assigned to Counselor"
            time={lead.counselor ? "Assigned" : "Not Assigned"}
          />

          <TimelineItem
            title="Follow-ups Logged"
            time={`${followups.length} follow-up(s) total`}
          />

        </div>

      </div>

    </div>

  )}

  {activeTab === "Follow-Ups" && (

    <div>

      <div className="flex items-center justify-between mb-6">

        <h3 className="text-2xl font-bold">
          Follow-Ups
        </h3>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {showAddForm ? "Cancel" : "+ Add Follow-Up"}
        </button>

      </div>

      {showAddForm && (
        <form onSubmit={handleAddFollowup} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl mb-6 space-y-4 shadow-inner">
          <h4 className="font-bold text-gray-800 text-lg">New Follow-Up Action</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Call Back, Course Discuss"
                value={newFollowupData.title}
                onChange={(e) => setNewFollowupData({ ...newFollowupData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={newFollowupData.scheduledAt}
                onChange={(e) => setNewFollowupData({ ...newFollowupData, scheduledAt: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Comments / Discussion Notes</label>
              <textarea
                rows="3"
                placeholder="Type here details of the discussion..."
                value={newFollowupData.comment}
                onChange={(e) => setNewFollowupData({ ...newFollowupData, comment: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xs font-semibold text-gray-500">Initial Status:</span>
                <select
                  value={newFollowupData.status}
                  onChange={(e) => setNewFollowupData({ ...newFollowupData, status: e.target.value })}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold rounded-xl transition"
              >
                Save Follow-Up
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-5">
        {loadingFollowups ? (
          <p className="text-center text-gray-400 py-8">Loading follow-ups...</p>
        ) : followups.length > 0 ? (
          followups.map((followup) => (
            <FollowupCard
              key={followup.id}
              followup={followup}
            />
          ))
        ) : (
          <div className="text-center bg-gray-50 border border-dashed rounded-2xl p-8 text-gray-400">
            No follow-ups recorded yet. Click "+ Add Follow-Up" to log one.
          </div>
        )}
      </div>

    </div>

  )}

  {activeTab === "Notes" && (

    <div className="bg-gray-50 rounded-2xl p-10 text-center">

      <h3 className="text-2xl font-bold">
        Notes Section
      </h3>

      <p className="text-gray-500 mt-2">
        Notes and counselor comments will appear here.
      </p>

    </div>

  )}

  {activeTab === "History" && (

    <div className="bg-gray-50 rounded-2xl p-10 text-center">

      <h3 className="text-2xl font-bold">
        Activity History
      </h3>

      <p className="text-gray-500 mt-2">
        Lead activity history will appear here.
      </p>

    </div>

  )}

</div>

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

function TimelineItem({ title, time }) {
  return (
    <div className="flex gap-4">

      <div className="w-4 h-4 rounded-full bg-green-500 mt-2"></div>

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {time}
        </p>
      </div>

    </div>
  );
}