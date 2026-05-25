// src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Card from "../components/Card";
import api from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // -------------------------
  // Logout
  // -------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  // -------------------------
  // Fetch Dashboard Data
  // -------------------------
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

  // -------------------------
  // Add History
  // -------------------------
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

      setHistory(res.data.dashboard.hcrs || []);
    } catch (err) {
      console.error("Failed to add history:", err);
    }
  };

  // -------------------------
  // Loading
  // -------------------------
  if (loading) {
    return (
      <div className="p-6 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // -------------------------
  // No Profile
  // -------------------------
  if (!details) {
    return (
      <div className="p-6 text-lg font-semibold">
        No student profile found.
      </div>
    );
  }

  return (
    <div className="min-h-full">

      {/* Navbar */}
      <Navbar title="Welcome Student">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </Navbar>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-4">

          {[
            {
              title: "My History Records",
              value: history.length,
            },
            {
              title: "My Course",
              value: details.course?.name || "Not Assigned",
            },
            {
              title: "Status",
              value: details.status || "ongoing",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-sm opacity-70">
                {item.title}
              </div>

              <div className="text-3xl font-semibold mt-2">
                {item.value}
              </div>
            </motion.div>
          ))}

        </div>

        {/* Student Details */}
        <Card>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
              My Details
            </h2>

            <div className="space-y-3">

              <div>
                <span className="font-semibold">
                  Name:
                </span>{" "}
                {details.name}
              </div>

              <div>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {details.email || "—"}
              </div>

              <div>
                <span className="font-semibold">
                  Course:
                </span>{" "}
                {details.course?.name || "Not Assigned"}
              </div>

              <div>
                <span className="font-semibold">
                  Teacher:
                </span>{" "}
                {details.teacher?.name || "Not Assigned"}
              </div>

              <div>
                <span className="font-semibold">
                  Status:
                </span>{" "}
                {details.status}
              </div>

            </div>
          </div>
        </Card>

        {/* History Section */}
        <Card>
          <div className="p-4">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                My History
              </h2>

              <button
                onClick={addHistory}
                className="btn"
              >
                + Add History
              </button>
            </div>

            {history.length === 0 ? (
              <p className="opacity-70">
                No history records found.
              </p>
            ) : (
              <div className="space-y-3">

                {history.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-xl p-4"
                  >
                    <div className="font-semibold">
                      {item.topic}
                    </div>

                    <div className="opacity-80 text-sm mt-1">
                      {item.description}
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </Card>

      </main>
    </div>
  );
}