import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth";
import Logo from "../assets/disha_logo.png"; // 👈 replace with your institute logo path


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/login", form);
      console.log("Login response data:", data);

      if (data.success) {
        setAuth({ token: data.token, role: data.user.role });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        if (data.user.role === "admin") navigate("/dashboard/admin");
        else if (data.user.role === "teacher") navigate("/dashboard/faculty");
        else navigate("/student/" + data.user.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-backgroundDark p-4">
      <div className="w-full max-w-md bg-card dark:bg-cardDark shadow-elevated rounded-2xl p-8 flex flex-col items-center">
        
        {/* Logo + Institute Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={Logo}// 👈 replace with your institute logo path
            alt="Institute Logo"
            className="w-40 h-40 mb-3"
          />
          <h1 className="text-xl font-bold text-foreground dark:text-foregroundDark text-center">
            HCR Institute Login
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              placeholder-muted dark:placeholder-mutedDark outline-none transition"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-muted dark:border-mutedDark 
              focus:ring-2 focus:ring-primary focus:border-primary
              bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark
              placeholder-muted dark:placeholder-mutedDark outline-none transition"
          />

          {/* Error Message */}
          {error && (
            <p className="text-error text-sm font-medium text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary hover:bg-primary-light 
              text-primary-foreground font-semibold rounded-xl 
              shadow-soft transition duration-200 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
