// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import DataTable from "../components/DataTable";

export default function StudentDashboard() {
  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

 useEffect(() => {
 const fetchData = async () => {
  try {
    const res = await axios.get("https://hcr-1.onrender.com/student/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(res.data);
  } catch (err) {
    console.error("Failed to load student dashboard:", err);
  }
};


  fetchData();
}, []);


  const addHistory = async () => {
    const desc = prompt("Enter today's history:");
    if (!desc) return;

    try {
      // create HCR linked to this student
      await axios.post(
        "https://hcr-1.onrender.com/hcr",
        { student: details._id, topic: "Daily HCR", description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // reload the dashboard
      const res = await axios.get("https://hcr-1.onrender.com/student/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dashboard = res.data.dashboard || {};
      setHistory(dashboard.hcrs || []);
    } catch (err) {
      console.error("Failed to add history:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!details) return <p>No student profile found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <Card title="My History Records" value={history.length} />
        <Card title="My Course" value={details.course?.name || "Not assigned"} />
        <Card title="Status" value={details.status || "ongoing"} />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">My History</h3>
      <button onClick={addHistory} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        + Add History
      </button>

      {/* optionally render a table (DataTable) */}
      {/* <DataTable rows={history} /> */}

      <h3 className="text-xl font-semibold mt-6 mb-2">My Details</h3>
      <div className="bg-white shadow rounded p-4">
        <p><strong>Name:</strong> {details.name}</p>
        <p><strong>Email:</strong> {details.email || "—"}</p>
        <p><strong>Course:</strong> {details.course?.name || "Not assigned"}</p>
        <p><strong>Teacher:</strong> {details.teacher?.name || "Not assigned"}</p>
      </div>
    </div>
  );
}
