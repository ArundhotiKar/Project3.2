import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";

const tabs = ["all", "pending", "in-progress", "resolved"];

const Issue = () => {
  const { userInfo, role } = useContext(AuthContext);

  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const isLabAssistant = role === "lab assistant";


  useEffect(() => {
    if (!userInfo?.department) return;

    const fetchIssues = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/issues?department=${userInfo.department}`
        );

        setIssues(res.data);
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userInfo?.department]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/issues/${id}`,
        { status }
      );

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id
            ? { ...issue, status }
            : issue
        )
      );
    } catch (err) {
      console.error("Failed to update issue:", err);
    }
  };

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter(
        (issue) => issue.status === filter
      );

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading issues...
      </div>
    );
  }

  return (
    <div className="p-6">
      
      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full border font-medium capitalize transition-all ${filter === tab
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600 text-sm">
                <th className="px-6 py-4">EQUIPMENT</th>
                <th className="px-6 py-4">LAB</th>
                <th className="px-6 py-4">ISSUE</th>
                <th className="px-6 py-4">REPORTED BY</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">STATUS</th>

                {isLabAssistant && (
                  <th className="px-6 py-4">UPDATE</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td
                    colSpan={isLabAssistant ? 7 : 6}
                    className="text-center py-10 text-gray-500"
                  >
                    No issues found
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {issue.equipmentName}
                    </td>

                    <td className="px-6 py-5">
                      {issue.labName}
                    </td>

                    <td className="px-6 py-5">
                      {issue.title}
                    </td>

                    <td className="px-6 py-5">
                      {issue.reportedBy}
                    </td>

                    <td className="px-6 py-5">
                      {issue.createdAt
                        ? new Date(
                          issue.createdAt
                        ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    {isLabAssistant && (
                      <td className="px-6 py-5">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              issue._id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg px-3 py-2"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="in-progress">
                            In Progress
                          </option>

                          <option value="resolved">
                            Resolved
                          </option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Issue;