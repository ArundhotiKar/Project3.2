import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import {
  FlaskConical,
  Package,
  CircleCheckBig,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";

const LabAssistantDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  const [labs, setLabs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [issues, setIssues] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [newIssueCount, setNewIssueCount] = useState(0);

  const firstLoad = useRef(true);
  const prevIssueCount = useRef(0);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (!userInfo?.department) return;

    const fetchData = async () => {
      try {
        const dept = userInfo.department;

        const [labsRes, eqRes, issueRes] = await Promise.all([
          fetch(`http://localhost:5000/labs?department=${dept}`),
          fetch(`http://localhost:5000/equipment`),
          fetch(`http://localhost:5000/issues?department=${dept}`),
        ]);

        const labsData = await labsRes.json();
        const eqData = await eqRes.json();
        const issueData = await issueRes.json();

        // ---------------- FILTER EQUIPMENT ----------------
        const filteredEquipment = eqData.filter((item) =>
          item.department
            ? item.department === dept
            : dept === "CSE" &&
              ["Software Lab", "Network Lab", "ACL Lab"].includes(item.lab)
        );

        // ---------------- NOTIFICATION LOGIC ----------------
        if (!firstLoad.current) {
          const diff = issueData.length - prevIssueCount.current;

          if (diff > 0) {
            setNewIssueCount((prev) => prev + diff);
          }
        }

        prevIssueCount.current = issueData.length;

        setLabs(labsData);
        setEquipment(filteredEquipment);
        setIssues(issueData);

        firstLoad.current = false;
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [userInfo?.department]);

  // ---------------- OUTSIDE CLICK SAFE ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-box")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const totalLabs = labs.length;

    const totalEquipment = equipment.length;

    const workingEquipment = equipment.filter(
      (i) => i.status?.toLowerCase() === "working"
    ).length;

    const pendingIssues = issues.filter(
      (i) => i.status === "pending"
    ).length;

    return {
      totalLabs,
      totalEquipment,
      workingEquipment,
      pendingIssues,
    };
  }, [labs, equipment, issues]);

  // ---------------- HANDLER (SAFE CLICK) ----------------
  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowDropdown((prev) => !prev);
    setNewIssueCount(0);
    prevIssueCount.current = issues.length;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔔 NOTIFICATION WRAPPER (ISOLATED) */}
      <div className="fixed top-5 right-6 z-50 notification-box pointer-events-auto">

        {/* BELL BUTTON */}
        <button
          onClick={handleNotificationClick}
          className="relative bg-white shadow-lg p-3 rounded-full hover:bg-gray-100"
        >
          🔔

          {newIssueCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {newIssueCount}
            </span>
          )}
        </button>

        {/* DROPDOWN */}
        {showDropdown && (
          <div
            className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}  // IMPORTANT FIX
          >
            <h3 className="font-bold text-lg mb-3">
              New Issues
            </h3>

            {issues.filter((i) => i.status === "pending").length === 0 ? (
              <p className="text-gray-400 text-sm">
                No new issues
              </p>
            ) : (
              issues
                .filter((i) => i.status === "pending")
                .slice(0, 10)
                .map((issue, index) => (
                  <div
                    key={index}
                    className="border-b py-2 text-sm"
                  >
                    <p className="font-semibold">
                      {issue.title || "Issue Reported"}
                    </p>
                    <p className="text-gray-500">
                      {issue.labName} • {issue.status}
                    </p>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* HEADER */}
      <div className="bg-green-600 text-white rounded-3xl p-10 mb-8">
        <h1 className="text-5xl font-bold mb-3">
          Welcome, {userInfo?.name || "Lab Assistant"}
        </h1>
        <p className="text-xl">
          {userInfo?.department} Department • Lab Maintenance
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatCard title="Total Labs" value={stats.totalLabs} Icon={FlaskConical} color="green" />
        <StatCard title="Total Equipment" value={stats.totalEquipment} Icon={Package} color="blue" />
        <StatCard title="Working" value={stats.workingEquipment} Icon={CircleCheckBig} color="green" />
        <StatCard title="Pending Issues" value={stats.pendingIssues} Icon={AlertCircle} color="red" />

      </div>

    </div>
  );
};

export default LabAssistantDashboard;

// ---------------- STAT CARD ----------------
const StatCard = ({ title, value, Icon, color }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
    <div>
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-4xl font-bold text-${color}-600`}>
        {value}
      </h2>
    </div>
    <Icon size={50} className={`text-${color}-600`} />
  </div>
);