import { Link } from "react-router-dom";

import { useState } from "react";

import { Moon, Sun, Heart, Menu, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { token, role, logout } = useAuth();

  const isAdmin = role === "admin";

  const { darkMode, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black dark:bg-gray-900 text-white px-6 py-4 transition">
      <div className="flex items-center justify-between">
        <Link to="/">
          <h1 className="text-3xl font-bold">CarRental</h1>
        </Link>

        {/* DESKTOP MENU */}

        <div className="hidden md:flex gap-6 text-lg items-center">
          <Link to="/">Home</Link>

          <Link to="/cars">Cars</Link>
          {isAdmin && <Link to="/add-car">Add Car</Link>}

          {token && (
            <>
              <Link to="/favorites" className="flex items-center gap-2">
                <Heart size={20} />
                Favorites
              </Link>

              <Link to="/my-bookings">My Bookings</Link>

              <Link to="/dashboard">Dashboard</Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="bg-white text-black p-2 rounded-xl"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>

          {!token ? (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-white text-black px-5 py-2 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="flex flex-col gap-6 mt-8 md:hidden text-lg">
          <Link to="/">Home</Link>

          <Link to="/cars">Cars</Link>
          {isAdmin && (
            <>
              <Link to="/add-car">Add Car</Link>

              <Link to="/admin-bookings">Bookings</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/favorites">Favorites</Link>

              <Link to="/my-bookings">My Bookings</Link>

              <Link to="/dashboard">Dashboard</Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="bg-white text-black p-3 rounded-xl w-fit"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>

          {!token ? (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-white text-black px-5 py-3 rounded-xl w-fit"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
