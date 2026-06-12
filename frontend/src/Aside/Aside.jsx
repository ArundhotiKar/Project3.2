import React, { useState, useContext, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  AlertCircle,
  Menu,
  X,
  LogOut,
  Users,
  Building,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Aside = () => {
  const [open, setOpen] = useState(false);
  const { userInfo, logOut } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);

  const navigate = useNavigate();

  // ✅ FIX: normalize role
  const role = userInfo?.role?.toLowerCase()?.trim();

  useEffect(() => {
    if (!userInfo?.department) return;

    let es;
    let mounted = true;

    const fallbackFetch = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/users?department=${userInfo.department}&status=pending`
        );

        const data = await res.json();

        if (!mounted) return;

        setPendingCount(Array.isArray(data) ? data.length : 0);
      } catch (e) {
        setPendingCount(0);
      }
    };

    if (typeof window !== "undefined" && window.EventSource) {
      try {
        es = new EventSource(
          `http://localhost:5000/sse/pending?department=${encodeURIComponent(
            userInfo.department
          )}`
        );

        es.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            if (!mounted) return;

            setPendingCount(payload.pending || 0);
          } catch {}
        };

        es.onerror = () => {
          try {
            es.close();
          } catch {}
          fallbackFetch();
        };

        fallbackFetch();
      } catch {
        fallbackFetch();
      }
    } else {
      fallbackFetch();
    }

    return () => {
      mounted = false;
      if (es) es.close();
    };
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      await logOut();
      setOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 py-3">
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-[72px] lg:top-0 left-0 z-50 bg-white border-r min-h-screen p-3 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close mobile */}
        <div className="flex justify-end lg:hidden mb-4">
          <button onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* MENU */}
        <ul className="space-y-2 flex-1">

          {/* STUDENT */}
          {role === "student" && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/report-issue" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>Report Issue</span>
              </NavLink>

              <NavLink to="/issues" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>Issues</span>
              </NavLink>
            </>
          )}

          {/* CHAIRMAN */}
          {role === "chairman" && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/approvals" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>
                  Approvals{" "}
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </span>
              </NavLink>

              <NavLink to="/labs" onClick={() => setOpen(false)} className={linkClass}>
                <CalendarDays size={22} />
                <span>Labs</span>
              </NavLink>

              <NavLink to="/problems" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>Problems</span>
              </NavLink>

              <NavLink to="/users" onClick={() => setOpen(false)} className={linkClass}>
                <Users size={22} />
                <span>Users</span>
              </NavLink>
            </>
          )}

          {/* SUPER ADMIN */}
          {role === "super admin" && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/departments" onClick={() => setOpen(false)} className={linkClass}>
                <Building size={22} />
                <span>Departments</span>
              </NavLink>

              <NavLink to="/users" onClick={() => setOpen(false)} className={linkClass}>
                <Users size={22} />
                <span>Users</span>
              </NavLink>
            </>
          )}

          {role === "teacher" && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/labs" onClick={() => setOpen(false)} className={linkClass}>
                <CalendarDays size={22} />
                <span>Labs</span>
              </NavLink>

              <NavLink to="/problems" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>Problems</span>
              </NavLink>
              
              </>
          ) }

          {
            role === "lab assistant" && (
              <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/labs" onClick={() => setOpen(false)} className={linkClass}>
                <CalendarDays size={22} />
                <span>Labs</span>
              </NavLink>
              <NavLink to="/problems" onClick={() => setOpen(false)} className={linkClass}>
                <AlertCircle size={22} />
                <span>Problems</span>
              </NavLink>
              
              </>
            )
          }

          {/* SIGN OUT */}
        <div className="pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        </ul>

    
      </aside>
    </>
  );
};

export default Aside;