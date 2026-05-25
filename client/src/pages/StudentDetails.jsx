import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function StudentDetails() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [hcrList, setHcrList] = useState([]);
  const [form, setForm] = useState({ topic: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // 👉 track edit mode

  // Fetch student & HCRs
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${studentId}`);
        setStudent(res.data.student);
      } catch (err) {
        console.error('Error fetching student:', err);
      }
    };

    const fetchHCR = async () => {
      try {
        const res = await api.get(`/hcr/student/${studentId}`);
        setHcrList(res.data.records || []);
      } catch (err) {
        console.error('Error fetching HCR:', err);
      }
    };

    fetchStudent();
    fetchHCR();
  }, [studentId]);

  // Save new or updated record
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 👉 Update existing record
        const res = await api.put(`/hcr/${editingId}`, {
          topic: form.topic,
          description: form.description,
        });
        setHcrList((prev) =>
          prev.map((h) => (h._id === editingId ? res.data.record : h))
        );
      } else {
        // 👉 Create new record
        const payload = {
          student: studentId,
          topic: form.topic,
          description: form.description,
        };
        const res = await api.post('/hcr', payload);
        setHcrList((prev) => [...prev, res.data.record]);
      }
      setForm({ topic: '', description: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving HCR:', err);
    }
  };

  // Start editing a record
  const handleEdit = (record) => {
    setForm({ topic: record.topic, description: record.description });
    setEditingId(record._id);
    setShowForm(true);
  };

  if (!student) return <div className="p-6 text-center">Loading student...</div>;

  return (
    <div className="p-6 space-y-6 bg-background dark:bg-backgroundDark min-h-screen">
      {/* Student Info */}
      <motion.div
        className="card p-6 rounded-2xl shadow-xl bg-card dark:bg-cardDark text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-primary dark:text-primary-light">{student.name}</h2>
        <p className="mt-2 text-muted dark:text-mutedDark">Course: {student.course?.name || 'N/A'}</p>
        <p className="text-muted dark:text-mutedDark">Faculty: {student.teacher?.name || 'N/A'}</p>
      </motion.div>

      {/* Add Record Button */}
      <div className="flex justify-center">
        <motion.button
          onClick={() => {
            setForm({ topic: '', description: '' });
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-5 py-2 bg-primary text-white rounded-xl shadow hover:bg-primary-dark transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Record
        </motion.button>
      </div>

      {/* Add/Edit Record Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSave}
          className="card p-6 rounded-2xl shadow-xl bg-card dark:bg-cardDark space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-primary dark:text-primary-light mb-2">
            {editingId ? 'Edit Record' : 'Add Record'}
          </h3>
          <div>
            <label className="block text-sm font-semibold text-foreground dark:text-foregroundDark">Topic</label>
            <input
              className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-cardDark dark:text-foreground"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground dark:text-foregroundDark">Description</label>
            <textarea
              className="w-full px-3 py-2 mt-1 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-cardDark dark:text-foreground"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white shadow hover:bg-primary-dark transition"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </motion.form>
      )}

      {/* HCR Table */}
      <motion.div
        className="card p-4 rounded-2xl shadow-xl bg-card dark:bg-cardDark overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-light text-center">History Card Records</h3>
        {hcrList.length === 0 ? (
          <p className="text-center text-muted dark:text-mutedDark">No records yet.</p>
        ) : (
          <table className="w-full border-collapse border rounded-lg overflow-hidden">
            <thead className="bg-primary/10 dark:bg-primary-dark/30">
              <tr>
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Topic</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hcrList.map((h) => (
                <motion.tr
                  key={h._id}
                  className="border hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="p-2 border">{new Date(h.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{h.topic}</td>
                  <td className="p-2 border">{h.description}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleEdit(h)}
                                         className="
                      px-3 py-1 rounded-xl
                      bg-warning-light text-secondary.foreground
                      hover:bg-secondary.light
                      transition-all duration-300
                    "
                    >
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
