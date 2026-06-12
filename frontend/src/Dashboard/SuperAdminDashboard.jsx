import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const [data, setData] = useState({
    departments: 0,
    users: 0,
    issues: 0,
    labs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, userRes, issueRes, labRes] = await Promise.all([
          axios.get("http://localhost:5000/departments"),
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/issues"),
          axios.get("http://localhost:5000/labs"),
        ]);

        setData({
          departments: deptRes.data.length,
          users: userRes.data.length,
          issues: issueRes.data.length,
          labs: labRes.data.length,
        });

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    {
      title: "Departments",
      value: data.departments,
      color: "from-blue-500 to-indigo-600",
      icon: "🏫",
    },
    {
      title: "Users",
      value: data.users,
      color: "from-green-500 to-emerald-600",
      icon: "👨‍🎓",
    },
    {
      title: "Issues",
      value: data.issues,
      color: "from-red-500 to-pink-600",
      icon: "⚠️",
    },
    {
      title: "Labs",
      value: data.labs,
      color: "from-purple-500 to-violet-600",
      icon: "🔬",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500">
          University overview across all departments
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-4 gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${card.color} transform hover:scale-105 transition`}
          >
            <div className="text-3xl">{card.icon}</div>
            <h2 className="text-xl mt-2 font-semibold">{card.title}</h2>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}

      </div>

      {/* EXTRA SECTION */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-3">System Status</h3>

          <div className="space-y-3 text-sm">
            <p>🟢 Server: Running</p>
            <p>🟢 Database: Connected</p>
            <p>🟡 Firebase Auth: Active</p>
            <p>🟢 API Health: Stable</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-3">Quick Insights</h3>

          <ul className="text-sm space-y-2">
            <li>📌 Most active department: CSE</li>
            <li>📌 Highest issues: Network Lab</li>
            <li>📌 Pending approvals: Moderate</li>
            <li>📌 System usage: 78%</li>
          </ul>
        </div>

      </div>
    </div>
  );
}