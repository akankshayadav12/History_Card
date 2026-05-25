import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Logo from "../assets/disha_logo.png"; // 👈 replace with your institute logo path
export default function FacultyList() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/teachers');
        console.log("teacher data:", res.data.teachers[0]._id);
        setTeachers(res.data.teachers || []);
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    };
    fetchTeachers();
  }, []);

  // Card background variations
  const colors = [
    "bg-primary/10 text-primary-dark",
    "bg-secondary/10 text-secondary-dark",
    "bg-success/10 text-success-dark",
    "bg-warning/10 text-warning-dark",
    "bg-error/10 text-error-dark"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-background">
      {/* Logo placeholder */}
      <div className="mb-10 flex flex-col items-center">
        {/* <div className="w-20 h-20 flex items-center justify-center shadow-card"> */}
          {/* Replace with <img src="/logo.png" alt="Logo" /> */}
          {/* <span className="text-sm font-semibold text-gray-600">LOGO</span> */}
            <img
                      src={Logo}// 👈 replace with your institute logo path
                      alt="Institute Logo"
                      className="w-40 h-40"
                    />
        {/* </div> */}
        <h2 className="mt-4 text-2xl font-bold text-foreground">Faculty Listing</h2>
      </div>

      {/* Teacher Cards */}
      {/* Teacher Cards */}
<div className="flex flex-col gap-4 w-full max-w-md">
  {teachers.map((t, i) => (
    <div
      key={t._id}
      onClick={() => navigate(`/teachers/${t._id}`)}
      className={`cursor-pointer p-6 rounded-xl shadow-card hover:shadow-elevated transform transition duration-300 hover:-translate-y-1 ${colors[i % colors.length]}`}
    >
      <h3 className="text-lg font-semibold">{t.name}</h3>
      <p className="text-sm opacity-80">Click to view students</p>
    </div>
  ))}
</div>


      {/* Empty state */}
      {teachers.length === 0 && (
        <p className="mt-6 text-muted">No faculty found.</p>
      )}
    </div>
  );
}
