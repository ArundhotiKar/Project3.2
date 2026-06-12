import React, { useContext, useEffect, useState } from "react";
import {
  Bell,
  Beaker,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Boxes,
} from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";

const TeacherDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  const [equipment, setEquipment] = useState([]);
  const [issues, setIssues] = useState([]);
  const [labs, setLabs] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    if (!userInfo?.department) return;

    // labs
    fetch(
      `http://localhost:5000/labs?department=${userInfo.department}`
    )
      .then((res) => res.json())
      .then((data) => setLabs(data));

    // equipment
    fetch("http://localhost:5000/equipment")
      .then((res) => res.json())
      .then((data) => {
        
        const filtered = data.filter((item) => {
          // department field থাকলে match করবে
          if (item.department) {
            return item.department === userInfo.department;
          }

          // department না থাকলে labName দিয়ে CSE detect করবে
          return (
            userInfo.department === "CSE" &&
            [
              "Software Lab",
              "Network Lab",
              "ACL Lab",
            ].includes(item.lab)
          );
        });

        setEquipment(filtered);

        setEquipment(filtered);
      });

    // issues
    fetch(
      `http://localhost:5000/issues?department=${userInfo.department}`
    )
      .then((res) => res.json())
      .then((data) => setIssues(data));
  }, [userInfo]);

  const pendingIssues = issues.filter(
    (issue) => issue.status === "pending"
  );

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "resolved"
  );

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-700 rounded-3xl p-10 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-3">
          Welcome, {userInfo?.name || "Teacher"}
        </h1>

        <p className="text-lg text-purple-100">
          {userInfo?.department || "CSE"} Department • Teacher
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Labs</p>
              <h2 className="text-4xl font-bold mt-2">
                {labs.length}
              </h2>
            </div>

            <div className="bg-purple-100 p-4 rounded-2xl">
              <Beaker className="text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Equipment</p>
              <h2 className="text-4xl font-bold mt-2">
                {equipment.length}
              </h2>
            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">
              <Boxes className="text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Issues</p>
              <h2 className="text-4xl font-bold mt-2">
                {pendingIssues.length}
              </h2>
            </div>

            <div className="bg-red-100 p-4 rounded-2xl">
              <Wrench className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Equipment Card */}
        {/* Equipment Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-md">
                <Beaker className="text-white" size={30} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Lab Equipment
                </h2>

                <p className="text-gray-500 mt-1 text-[15px]">
                  Monitor all laboratory devices & status
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="text-right">
              <h3 className="text-3xl font-bold text-purple-700">
                {equipment.length}
              </h3>

              <p className="text-sm text-gray-500">
                Total Items
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">
                {
                  equipment.filter(
                    (e) =>
                      e.status?.toLowerCase() === "working"
                  ).length
                }
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Working
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <h3 className="text-2xl font-bold text-red-600">
                {
                  equipment.filter(
                    (e) =>
                      e.status?.toLowerCase() !== "working"
                  ).length
                }
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Damaged
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">
                {labs.length}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Labs
              </p>
            </div>
          </div>

          
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h2>

            <Bell className="text-gray-400" size={24} />
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start hover:bg-gray-100 transition"
                >
                  <div className="mt-1">
                    {issue.status === "resolved" ? (
                      <CheckCircle2
                        className="text-green-500"
                        size={22}
                      />
                    ) : (
                      <AlertCircle
                        className="text-orange-500"
                        size={22}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-800 text-lg font-medium">
                      {issue.title}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {issue.equipmentName} • {issue.labName}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${issue.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                          }`}
                      >
                        {issue.status}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          issue.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No notifications available
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-orange-50 rounded-2xl p-5">
              <h3 className="text-3xl font-bold text-orange-600">
                {pendingIssues.length}
              </h3>

              <p className="text-gray-600 mt-1">
                Pending Issues
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="text-3xl font-bold text-green-600">
                {resolvedIssues.length}
              </h3>

              <p className="text-gray-600 mt-1">
                Resolved Issues
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;