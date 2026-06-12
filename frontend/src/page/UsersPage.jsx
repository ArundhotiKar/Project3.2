import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Trash2, Users, ShieldCheck, Mail } from "lucide-react";

const tabs = ["all", "student", "teacher", "chairman"];

export default function UsersPage() {
  const { userInfo, role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let url = "http://localhost:5000/users";

    if (role === "chairman") {
      url += `?department=${userInfo?.department}`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, [role, userInfo]);

  function del(id) {
    if (!window.confirm("Delete this user?")) return;

    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    }).then(() => {
      setUsers((prev) => prev.filter((x) => x._id !== id));
    });
  }

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.role === filter);

  const grouped = {
    student: users.filter((u) => u.role === "student"),
    teacher: users.filter((u) => u.role === "teacher"),
    chairman: users.filter((u) => u.role === "chairman"),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-500">Role wise user overview</p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2">
          <Users />
          Total: {users.length}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === t
                ? "bg-black text-white"
                : "bg-white text-gray-600"
              }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ROLE SECTIONS (optional view style) */}
      {filter === "all" ? (
        <div className="space-y-8">

          <RoleSection title="Chairman" users={grouped.chairman} onDelete={del} />
          <RoleSection title="Teachers" users={grouped.teacher} onDelete={del} />
          <RoleSection title="Students" users={grouped.student} onDelete={del} />

        </div>
      ) : (
        <RoleSection
          title={filter.toUpperCase()}
          users={filteredUsers}
          onDelete={del}
        />
      )}

    </div>
  );
}

/* ---------------- ROLE SECTION ---------------- */
function RoleSection({ title, users, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShieldCheck /> {title} ({users.length})
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-400">No {title} found</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">

                  {/* USER */}
                  <td className="p-3 font-medium">
                    {u.name}
                  </td>

                  {/* EMAIL */}
                  <td className="p-3 flex items-center gap-2">
                    <Mail size={14} />
                    {u.email}
                  </td>

                  {/* DEPARTMENT (NEW COLUMN) */}
                  <td className="p-3">
                    {u.department ? (
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                        {u.department}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>

                  {/* ROLE */}
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      {u.role}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDelete(u._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

            

          </table>

        </div>
      )}

    </div>
  );
}