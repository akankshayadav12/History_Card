// src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import api from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ------------------------
  // Logout
  // ------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  // ------------------------
  // Fetch Student Dashboard
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/student/dashboard");

        setDetails(res.data.dashboard.student);
        setHistory(res.data.dashboard.hcrs || []);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------------
  // Add History
  // ------------------------
  const addHistory = async () => {
    const desc = prompt("Enter today's history:");

    if (!desc) return;

    try {
      await api.post(
        "/hcr",
        {
          student: details._id,
          topic: "Daily HCR",
          description: desc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reload dashboard
      const res = await api.get("/student/dashboard");

      const dashboard = res.data.dashboard || {};

      setHistory(dashboard.hcrs || []);
    } catch (err) {
      console.error("Failed to add history:", err);
    }
  };

  // ------------------------
  // Loading
  // ------------------------
  if (loading) {
    return (
      <div className="p-6 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // ------------------------
  // No Student Found
  // ------------------------
  if (!details) {
    return (
      <div className="p-6 text-lg font-semibold">
        No student profile found.
      </div>
    );
  }

  // ------------------------
  // Main UI
  // ------------------------
  return (
    <div className="min-h-screen bg-background dark:bg-backgroundDark">

      {/* Navbar */}
      <Navbar title="Welcome Student">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </Navbar>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Dashboard Heading */}
        <h2 className="text-2xl font-bold">
          Student Dashboard
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card
            title="My History Records"
            value={history.length}
          />

          <Card
            title="My Course"
            value={details.course?.name || "Not assigned"}
          />

          <Card
            title="Status"
            value={details.status || "ongoing"}
          />
        </div>

        {/* History Section */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              My History
            </h3>

            <button
              onClick={addHistory}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              + Add History
            </button>
          </div>

          {history.length === 0 ? (
            <p>No history records found.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-3"
                >
                  <p className="font-semibold">
                    {item.topic}
                  </p>

                  <p className="text-sm opacity-80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Details */}
        <div className="card p-4">
          <h3 className="text-xl font-semibold mb-4">
            My Details
          </h3>

          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {details.name}
            </p>

            <p>
              <strong>Email:</strong> {details.email || "—"}
            </p>

            <p>
              <strong>Course:</strong>{" "}
              {details.course?.name || "Not assigned"}
            </p>

            <p>
              <strong>Teacher:</strong>{" "}
              {details.teacher?.name || "Not assigned"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {details.status || "ongoing"}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
