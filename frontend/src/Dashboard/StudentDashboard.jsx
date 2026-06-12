import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const StudentDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  const [myIssues, setMyIssues] = useState([]);
  const [pendingIssues, setPendingIssues] = useState([]);
  const [labsCount, setLabsCount] = useState(0);

  useEffect(() => {
    if (userInfo) {
      loadDashboard();
    }
  }, [userInfo]);

  const loadDashboard = async () => {
    try {
      // ALL ISSUES
      const issuesRes = await fetch("http://localhost:5000/issues");
      const issues = await issuesRes.json();

      // ONLY SAME DEPARTMENT ISSUES
      const deptIssues = issues.filter(
        (issue) =>
          issue.department?.toLowerCase() ===
          userInfo?.department?.toLowerCase()
      );

      // PENDING ISSUES OF SAME DEPARTMENT
      const pending = deptIssues.filter(
        (issue) => issue.status?.toLowerCase() === "pending"
      );

      // MY ISSUES
      const mine = deptIssues.filter(
        (issue) =>
          issue.email === userInfo?.email ||
          issue.reportedBy === userInfo?.name
      );

      setPendingIssues(pending);
      setMyIssues(mine);

      // LABS
      const labsRes = await fetch("http://localhost:5000/labs");
      const labs = await labsRes.json();

      // ONLY SAME DEPARTMENT LABS
      const deptLabs = labs.filter(
        (lab) =>
          lab.department?.toLowerCase() ===
          userInfo?.department?.toLowerCase()
      );

      setLabsCount(deptLabs.length);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-lg mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome, {userInfo?.name}
        </h1>

        <p className="mt-2 text-lg opacity-90">
          {userInfo?.department} Department • {userInfo?.id}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-gray-500 text-sm">Available Labs</p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {labsCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <p className="text-gray-500 text-sm">Pending Issues</p>

          <h2 className="text-4xl font-bold text-orange-500 mt-2">
            {pendingIssues.length}
          </h2>
        </div>
      </div>

      {/* My Reported Issues */}
      <div className="bg-white rounded-3xl shadow border p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-semibold">
            My Reported Issues
          </h2>

          <Link
            to="/report-issue"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            + Report Problem
          </Link>
        </div>

        {myIssues.length > 0 ? (
          <div className="space-y-4">
            {myIssues.map((issue) => (
              <div
                key={issue._id}
                className="border rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <h3 className="font-bold text-xl text-slate-800">
                    {issue.equipmentName ||
                      issue.equipmentId ||
                      "Unknown Equipment"}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {issue.labName ||
                      issue.labId ||
                      "Unknown Lab"}
                  </p>

                  <p className="font-medium mt-2">
                    {issue.title}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {issue.description}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`mt-4 md:mt-0 px-4 py-1 rounded-full text-sm capitalize ${
                    issue.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : issue.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No issues reported yet
          </div>
        )}
      </div>

      {/* Department Pending Issues */}
      <div className="bg-white rounded-3xl shadow border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-semibold">
              {userInfo?.department} Department Issues
            </h2>

            <p className="text-gray-500">
              Pending issues from your department
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            {pendingIssues.length}
          </div>
        </div>

        {pendingIssues.length > 0 ? (
          <div className="space-y-4">
            {pendingIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <h3 className="font-bold text-xl">
                    {issue.equipmentName}
                  </h3>

                  <p className="text-gray-600">
                    {issue.labName}
                  </p>

                  <p className="font-medium mt-2">
                    {issue.title}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {issue.description}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    Reported by {issue.reportedBy} •{" "}
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="mt-4 md:mt-0 bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full capitalize text-sm">
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No pending issues found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;