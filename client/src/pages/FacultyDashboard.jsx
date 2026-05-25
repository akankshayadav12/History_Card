
// src/pages/FacultyDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api"; // ✅ same api wrapper you used in Students.jsx
import Card from "../components/Card";
import Navbar from "../components/Navbar";const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Students" },
  { key: "courses", label: "Courses" },
  { key: "settings", label: "Settings" },
];
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import SearchBar from "../components/SearchBar";
import DateRange from "../components/DateRange";
import { fmtDate } from "../services/helpers";


export default function FacultyDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [form, setForm] = useState({
    _id: null,
    name: "",
    course: "",
    teacher: teachers[0]?._id || "",
    status: "ongoing",
  });

  // 🔹 Fetch all data
const fetchAll = async () => {
  try {
   const [s, c, t] = await Promise.all([
  api.get("/students"),
  api.get("/courses"),
  api.get("/teachers"),
]);

setStudents(s.data?.students || []);

const fetchedCourses = c.data?.courses ?? [];
setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);

const fetchedTeachers = t.data?.teachers ?? [];
setTeachers(Array.isArray(fetchedTeachers) ? fetchedTeachers : []);
  } catch (err) {
    console.error("Error fetching data", err.message);
    setStudents([]);
    setCourses([]);
  }
};


  useEffect(() => {
    fetchAll();
  }, []);

  // 🔹 Filters
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchQ = q
        ? s.name?.toLowerCase().includes(q.toLowerCase()) ||
          s.status?.toLowerCase().includes(q.toLowerCase())
        : true;

      const created = s.createdAt ? new Date(s.createdAt) : null;
      const matchFrom = from ? created && created >= new Date(from) : true;
      const matchTo = to ? created && created <= new Date(to) : true;

      return matchQ && matchFrom && matchTo;
    });
  }, [students, q, from, to]);

  // 🔹 Table columns
  const columns = [
    { key: "name", label: "Name" },
    {
      key: "course",
      label: "Course",
      render: (v) =>
        typeof v === "object" && v?.name
          ? v.name
          : courses.find((c) => c._id === v)?.name || "-",
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (v) =>
        typeof v === "object" && v?.name
          ? v.name
          : teachers.find((t) => t._id === v)?.name || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (v) => <span className="chip">{v}</span>,
    },
    { key: "createdAt", label: "Created", render: (v) => fmtDate(v) },
  ];

  // 🔹 Modal open for new student
  const openNew = () => {
    setForm({
      _id: null,
      name: "",
      course: courses[0]?._id || "",
      teacher: teachers[0]?._id || "",
      status: "ongoing",
    });
    setOpen(true);
  };

  // 🔹 Save student
  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      course: form.course,
      teacher: form.teacher,
      status: form.status,
    };

    if (form._id) {
      await api.put(`/students/${form._id}`, payload);
    } else {
      await api.post("/students", payload);
    }
    setOpen(false);
    await fetchAll();
  };

  // 🔹 Edit/Delete handlers
  const onEdit = (row) => {
    setForm({
      ...row,
      course: row.course?._id || row.course,
      teacher: row.teacher?._id || row.teacher,
    });
    setOpen(true);
  };

  const onDelete = (row) => {
    setForm(row);
    setConfirm(true);
  };

  const doDelete = async () => {
    await api.delete(`/students/${form._id}`);
    setConfirm(false);
    await fetchAll();
  };

  return (
  <div className="min-h-full">
    
    {/* Navbar */}
    <Navbar title="Welcome Faculty" />

    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Tabs */}
      <nav className="card p-2 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl transition ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Dashboard Section */}
      {tab === "dashboard" && (
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">Faculty Dashboard</h2>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card title="My Students" value={students.length} />
            <Card title="My Courses" value={courses.length} />
          </div>

          {/* Search */}
          <Card>
            <div className="flex items-center justify-between gap-3">
              <SearchBar
                value={q}
                onChange={setQ}
                placeholder="Search students by name or status"
              >
                <DateRange
                  from={from}
                  to={to}
                  setFrom={setFrom}
                  setTo={setTo}
                />

                <button className="btn" onClick={openNew}>
                  Add Student
                </button>
              </SearchBar>
            </div>
          </Card>

          {/* Table */}
          <Card>
            <DataTable
              columns={columns}
              rows={filtered}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Card>
        </div>
      )}

      {/* Students Tab */}
      {tab === "students" && (
        <Card>
          <DataTable
            columns={columns}
            rows={filtered}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Card>
      )}

      {/* Courses Tab */}
      {tab === "courses" && (
        <Card>
          <div className="space-y-2">
            {courses.map((c) => (
              <div
                key={c._id}
                className="p-3 rounded-xl bg-white/5"
              >
                {c.name}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <Card>
          Faculty settings coming soon...
        </Card>
      )}

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={form._id ? "Edit Student" : "Add Student"}
      >
        <form onSubmit={save} className="space-y-3">

          <div>
            <label className="text-sm opacity-80">Name</label>
            <input
              className="input mt-1"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Course</label>
            <select
              className="input mt-1"
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm opacity-80">Teacher</label>
            <select
              className="input mt-1"
              value={form.teacher}
              onChange={(e) =>
                setForm({ ...form, teacher: e.target.value })
              }
            >
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm opacity-80">Status</label>
            <select
              className="input mt-1"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-2 rounded-xl bg-white/10"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button className="btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={doDelete}
        title="Delete student?"
        description={`This will remove ${form.name}.`}
      />

    </main>
  </div>
);
}
