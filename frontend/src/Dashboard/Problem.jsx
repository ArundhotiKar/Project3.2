import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Monitor,
  CalendarDays,
  Mail,
  Building2,
} from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";
import Issue from "../component/issue";

const Problem = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role, userInfo } = useContext(AuthContext);

  useEffect(() => {
  if (!userInfo?.department) return;

  const fetchIssues = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/issues?department=${userInfo.department}`
      );
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchIssues();
}, [userInfo?.department]);

  const stats = {
    pending: issues.filter((i) => i.status === "pending").length,
    progress: issues.filter((i) => i.status === "in-progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  const handleStatusChange = async (id, status) => {
    await axios.patch(`http://localhost:5000/issues/${id}`, { status });

    setIssues((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status } : i))
    );
  };

  const badgeStyle = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "in-progress") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  if (loading || !userInfo) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white p-8 rounded-3xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Problems & Issues</h1>
        <p className="text-blue-100 mt-1">View all reported problems</p>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatCard title="Pending" value={stats.pending} color="yellow" icon={<AlertTriangle />} />
        <StatCard title="In Progress" value={stats.progress} color="blue" icon={<Clock3 />} />
        <StatCard title="Resolved" value={stats.resolved} color="green" icon={<CheckCircle2 />} />

      </div>

      <Issue />
    </div>
  );
};

/* STAT CARD */
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    yellow: "text-yellow-500 bg-yellow-100",
    blue: "text-blue-500 bg-blue-100",
    green: "text-green-500 bg-green-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default Problem;