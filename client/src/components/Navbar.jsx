import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { clearAuth } from "../utils/auth";
import Logo from "../assets/logo1.jpg"; // 👈 replace with your institute logo path
import { useState } from "react";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div
        className="flex items-center justify-between 
                   max-w-8xl mx-auto px-6 md:px-12 py-3
                   bg-background dark:bg-backgroundDark
                   text-foreground dark:text-foregroundDark
                   transition-colors duration-300"
      >
        {/* Logo */}
        <img src={Logo} alt="Institute Logo" className="w-40 h-auto" />

        {/* Right Section (Title + User) */}
        <div className="flex items-center gap-2">
          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold">{title}</h1>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="rounded-full bg-gray-200 dark:bg-cardDark 
                         p-2 shadow-sm hover:shadow-md transition-all"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User
                size={20}
                className="text-foreground dark:text-foregroundDark"
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-cardDark 
                           border border-gray-200 dark:border-gray-700 
                           rounded-xl shadow-card overflow-hidden"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-foreground dark:text-foregroundDark 
                             hover:bg-error hover:text-error-foreground transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
