import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/disha_logo.png"; // 👈 replace with your institute logo path

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await api.get("/roles");
        console.log("Roles fetched:", data);
        setRoles(data);
        if (data.length > 0) {
          setForm((f) => ({ ...f, role: data[0].roleName }));
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/signup", form);
      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-backgroundDark p-4">
      <div className="w-full max-w-md bg-card dark:bg-cardDark shadow-elevated rounded-2xl p-8 flex flex-col items-center">
        
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={Logo}// 👈 replace with your institute logo path
            alt="Institute Logo"
            className="w-40 h-40 mb-3"
          />
          <h2 className="text-xl font-bold text-foreground dark:text-foregroundDark text-center">
            HCR Institute Signup
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-error text-sm font-medium mb-3 text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              placeholder-muted dark:placeholder-mutedDark outline-none transition"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              placeholder-muted dark:placeholder-mutedDark outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              placeholder-muted dark:placeholder-mutedDark outline-none transition"
            required
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              outline-none transition"
          >
            {roles.map((r) => (
              <option key={r._id} value={r.roleName}>
                {r.roleName}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary hover:bg-primary-light 
              text-primary-foreground font-semibold rounded-xl 
              shadow-soft transition duration-200 ease-in-out"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
