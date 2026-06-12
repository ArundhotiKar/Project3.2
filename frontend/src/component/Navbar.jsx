import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => setUserInfo(data));
    }
  }, [user]);

  return (
    <>
      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

          {/* TOP BAR */}
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="logo"
                className="w-11 h-11 rounded-full border border-white/20"
              />

              <div className="leading-tight">
                <h1 className="text-base sm:text-lg font-bold">
                  Lab Management
                </h1>
                <p className="text-xs text-slate-300">
                  {userInfo?.department || "Department"}
                </p>
              </div>
            </div>

            {/* RIGHT (DESKTOP) */}
            <div className="hidden md:flex items-center gap-5">

              {user ? (
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">

                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                    {userInfo?.name?.charAt(0) || "U"}
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-semibold">
                      {userInfo?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-300">
                      {userInfo?.role || "Role"}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/signin" className="text-slate-300 hover:text-white text-sm">
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-full text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="md:hidden mt-4 bg-slate-800 rounded-2xl p-5 space-y-4 border border-slate-700">

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                    {userInfo?.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {userInfo?.name || "User"}
                    </p>

                    <span className="text-xs text-cyan-300">
                      {userInfo?.role || "Role"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/signin"
                    className="text-center border border-slate-600 py-2 rounded-xl"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="text-center bg-cyan-500 py-2 rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

            </div>
          )}

        </div>
      </nav>

      {/* IMPORTANT: PAGE OFFSET */}
      <div className="pt-20"></div>
    </>
  );
};

export default Navbar;