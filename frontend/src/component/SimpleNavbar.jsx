import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const SimpleNavbar = () => {
  const { user, loading } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-8 h-10 rounded-full" />
          <h1 className="font-bold">Lab Management</h1>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">

          <Link to="home" className="text-slate-300 hover:text-white">
            Home
          </Link>

          {/* ✅ IMPORTANT: wait for auth load */}
          {loading ? (
            <span className="text-slate-400 text-sm">...</span>
          ) : !user ? (
            <Link to="/signin" className="text-slate-300 hover:text-white">
              Sign In
            </Link>
          ) : (
            <Link to="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;