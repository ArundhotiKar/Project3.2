import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Users, Beaker, FileText, Plus } from "lucide-react";

const ChairmanDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const dept = userInfo?.department;

  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [labAssistants, setLabAssistants] = useState(0);
  const [labs, setLabs] = useState(0);
  const [issues, setIssues] = useState(0);
  const [pending, setPending] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const norm = (v) =>
    String(v || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  useEffect(() => {
    if (!dept) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const [usersRes, labsRes, issuesRes] = await Promise.all([
          fetch(`http://localhost:5000/users?department=${dept}`, {
            signal: controller.signal,
          }),
          fetch(`http://localhost:5000/labs`, {
            signal: controller.signal,
          }),
          fetch(`http://localhost:5000/issues`, {
            signal: controller.signal,
          }),
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const labsData = labsRes.ok ? await labsRes.json() : [];
        const issuesData = issuesRes.ok ? await issuesRes.json() : [];

        const deptUsers = Array.isArray(users)
          ? users.filter((u) => norm(u.department) === norm(dept))
          : [];

        const studentCount = deptUsers.filter(
          (u) =>
            norm(u.role) === "student" &&
            norm(u.status) === "approved"
        ).length;

        const teacherCount = deptUsers.filter(
          (u) =>
            norm(u.role) === "teacher" &&
            norm(u.status) === "approved"
        ).length;

        const labAssistantCount = deptUsers.filter(
          (u) =>
            norm(u.role) === "labassistant" &&
            norm(u.status) === "approved"
        ).length;

        const pendingCount = deptUsers.filter(
          (u) => norm(u.status) === "pending"
        ).length;

        const labsCount = Array.isArray(labsData)
          ? labsData.filter((l) => norm(l.department) === norm(dept)).length
          : 0;

        const issuesCount = Array.isArray(issuesData)
          ? issuesData.filter((i) => norm(i.department) === norm(dept)).length
          : 0;

        const activities = deptUsers
          .filter(
            (u) =>
              ["student", "teacher", "labassistant"].includes(
                norm(u.role)
              ) &&
              norm(u.status) === "approved"
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 5);

        setRecentActivities(activities);

        setStudents(studentCount);
        setTeachers(teacherCount);
        setLabAssistants(labAssistantCount);
        setPending(pendingCount);
        setLabs(labsCount);
        setIssues(issuesCount);
      } catch (err) {
        if (err.name === "AbortError") return;

        setStudents(0);
        setTeachers(0);
        setLabAssistants(0);
        setLabs(0);
        setIssues(0);
        setPending(0);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [dept]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-pink-50 p-6">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg mb-6">
      <h1 className="text-2xl font-bold">
        {dept} Department 
      </h1>
      <h2>
        Welcome, {userInfo?.name}
      </h2>
    </div>

    {/* LOADING */}
    {loading && (
      <div className="text-gray-600 mb-4">
        Loading dashboard data...
      </div>
    )}

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-5 shadow-md hover:scale-[1.02] transition">
        <p className="opacity-90">Students</p>
        <h3 className="text-3xl font-bold">{students}</h3>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-5 shadow-md hover:scale-[1.02] transition">
        <p className="opacity-90">Teachers</p>
        <h3 className="text-3xl font-bold">{teachers}</h3>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-5 shadow-md hover:scale-[1.02] transition">
        <p className="opacity-90">Lab Assistants</p>
        <h3 className="text-3xl font-bold">{labAssistants}</h3>
      </div>

      <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl p-5 shadow-md hover:scale-[1.02] transition">
        <p className="opacity-90">Pending</p>
        <h3 className="text-3xl font-bold">{pending}</h3>
      </div>
    </div>

    {/* MAIN SECTION */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ACTIVITY */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {recentActivities.length > 0 ? (
            recentActivities.map((user) => (
              <div
                key={user._id}
                className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 border hover:shadow transition"
              >
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full mt-2"></div>

                <div>
                  <p className="font-semibold text-gray-800">
                    New {user.role} registered
                  </p>
                  <p className="text-gray-600 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No recent activity found
            </p>
          )}

        </div>
      </div>

      {/* OVERVIEW */}
      <div className="bg-white rounded-2xl p-6 shadow border">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Department Overview
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500">
            <span>Students</span>
            <span className="font-bold text-blue-600">{students}</span>
          </div>

          <div className="flex justify-between p-4 rounded-xl bg-purple-50 border-l-4 border-purple-500">
            <span>Teachers</span>
            <span className="font-bold text-purple-600">{teachers}</span>
          </div>

          <div className="flex justify-between p-4 rounded-xl bg-green-50 border-l-4 border-green-500">
            <span>Lab Assistants</span>
            <span className="font-bold text-green-600">{labAssistants}</span>
          </div>

        </div>
      </div>

    </div>
  </div>
);
};

export default ChairmanDashboard;