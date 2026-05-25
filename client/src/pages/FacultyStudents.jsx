import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import Logo from "../assets/disha_logo.png"; // 👈 replace with your institute logo path

export default function FacultyStudents() {
  const { facultyId } = useParams();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (!facultyId) return;
      try {
        const res = await api.get(`/teachers/${facultyId}/students`);
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching faculty students:", err);
      }
    };
    fetchStudents();
  }, [facultyId]);

  // Filter students based on search term
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-background dark:bg-backgroundDark flex flex-col items-center">
      
      {/* Institute Logo */}
      <div className="mb-8 flex flex-col items-center">
        {/* <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-cardDark flex items-center justify-center shadow-lg animate-pulse"> */}
<img
                      src={Logo}// 👈 replace with your institute logo path
                      alt="Institute Logo"
                      className="w-40 h-40"
                    />
          {/* <span className="text-sm font-bold text-gray-600 dark:text-muted">LOGO</span> */}
        {/* </div> */}
        <h1 className="mt-4 text-3xl font-bold text-foreground dark:text-foregroundDark">Students of Faculty</h1>
      </div>

      {/* Main Card */}
      <motion.div
        className="w-full max-w-4xl p-6 bg-card dark:bg-cardDark rounded-3xl shadow-xl flex flex-col"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-light text-center">Student List</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-cardDark dark:text-foreground"
          />
        </div>

        {/* Two-column scrollable student buttons */}
        {/* Two-column scrollable student buttons */}
{/* <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]"> */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">

  {filteredStudents.length > 0 ? (
    filteredStudents.map((s) => (
      <motion.button
        key={s._id}
        onClick={() => navigate(`/students/${s._id}/detail`)}
        className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-xl shadow hover:bg-primary-dark text-center transition-all"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {s.name}
      </motion.button>
    ))
  ) : (
    <p className="text-muted dark:text-mutedDark text-center col-span-2 mt-4">
      No students found.
    </p>
  )}
</div>

      </motion.div>
    </div>
  );
}
