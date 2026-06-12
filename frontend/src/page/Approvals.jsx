import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { ArrowLeft, CheckCircle, XCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Approvals() {
  const { userInfo } = useContext(AuthContext);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!userInfo?.department) return;

    const fetchData = async () => {
      try {
        const raw = localStorage.getItem("pendingUsers");

        if (raw) {
          const arr = JSON.parse(raw || "[]");
          const dept = arr.filter(
            (u) =>
              u.department === userInfo.department &&
              u.status === "pending"
          );
          setPending(dept);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/users?department=${userInfo.department}&status=pending`
        );
        const data = await res.json();
        setPending(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userInfo]);

  function approve(id) {
    const raw = localStorage.getItem("pendingUsers");

    if (raw) {
      const arr = JSON.parse(raw);
      const updated = arr.filter((u) => u.id !== id && u._id !== id);
      setPending(updated);
      localStorage.setItem("pendingUsers", JSON.stringify(updated));
      return;
    }

    fetch(`http://localhost:5000/users/approve/${id}`, {
      method: "PATCH",
    }).then(() =>
      setPending((p) => p.filter((x) => x._id !== id))
    );
  }

  function reject(id) {
    const raw = localStorage.getItem("pendingUsers");

    if (raw) {
      const arr = JSON.parse(raw);
      const updated = arr.filter((u) => u.id !== id && u._id !== id);
      setPending(updated);
      localStorage.setItem("pendingUsers", JSON.stringify(updated));
      return;
    }

    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    }).then(() =>
      setPending((p) => p.filter((x) => x._id !== id))
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">
          Pending Approvals
        </h1>

        <div className="text-sm text-gray-500">
          Department: {userInfo?.department}
        </div>
      </div>

      {/* EMPTY STATE */}
      {pending.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow">
          <CheckCircle size={60} className="text-green-500 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">
            All Caught Up!
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            No pending signup requests at the moment.
          </p>
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-5">
        {pending.map((p) => (
          <div
            key={p._id || p.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100"
          >
            {/* TOP */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <User size={20} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {p.name}
                </h2>
                <p className="text-sm text-gray-500">{p.role}</p>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Email:</span> {p.email}
              </p>
              <p>
                <span className="font-medium">ID:</span> {p.id || p._id}
              </p>
              <p>
                <span className="font-medium">Batch:</span>{" "}
                {p.batch || "-"}
              </p>
              <p>
                <span className="font-medium">Department:</span>{" "}
                {p.department}
              </p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                {p.status}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => approve(p._id || p.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
              >
                <CheckCircle size={18} />
                Approve
              </button>

              <button
                onClick={() => reject(p._id || p.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}