




import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Card from './components/Card';
import { motion } from 'framer-motion';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import HCR from './pages/HCR';
import api from './services/api';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import TeacherStudents from './pages/FacultyStudents'   // ✅ new page
import StudentDetail from './pages/StudentDetails';       // ✅ new page
import Cookies from 'js-cookie';
import FacultyStudents from './pages/FacultyStudents';
import StudentDetails from './pages/StudentDetails';
import FacultyList from './pages/FacultyList';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Faculties' },
  { key: 'courses', label: 'Courses' },
  { key: 'hcr', label: 'History Card' },
  { key: 'settings', label: 'Settings' },
];

// ✅ ProtectedRoute component
function ProtectedRoute({ children, allowedRoles }) {
  const token = Cookies.get('token');
  const role = Cookies.get('role'); // store user role in cookies after login

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, tRes, cRes] = await Promise.all([
          api.get('/students'),
          api.get('/teachers'),
          api.get('/courses'),
        ]);
        setStats({
          students: sRes.data.students?.length || 0,
          teachers: tRes.data.teachers?.length || 0,
          courses: cRes.data.courses?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Dashboard layout
  const DashboardLayout = () => (
    <div className="min-h-full">
      <Navbar title="Institute Admin Panel" />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <nav className="card p-2 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl transition ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab contents */}
        {tab === 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Total Students', value: stats.students },
              { title: 'Active Faculties', value: stats.teachers },
              { title: 'Courses', value: stats.courses },
            ].map((k, i) => (
              <motion.div
                key={i}
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-sm opacity-70">{k.title}</div>
                <div className="text-3xl font-semibold mt-2">{k.value}</div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'students' && <Students />}
        {tab === 'teachers' && <Teachers />}
        {tab === 'courses' && <Courses />}
        {tab === 'hcr' && <HCR />}
        {tab === 'settings' && <Card>Settings content here</Card>}
      </main>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Admin protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* ✅ Faculty protected routes */}
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Student protected dashboard */}
        <Route
          path="/student/:studentId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public routes for Teacher → Students → Student Detail → HCR */}
        <Route path="/teachers" element={<FacultyList />} />
        <Route path="/teachers/:facultyId" element={<FacultyStudents />} />
        <Route path="/students/:studentId/detail" element={<StudentDetails />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
