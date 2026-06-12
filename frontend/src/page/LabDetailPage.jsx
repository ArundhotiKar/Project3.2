import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

export default function LabDetailPage() {
  const { id } = useParams();
  const { role } = useContext(AuthContext);

  const [lab, setLab] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [loadingLab, setLoadingLab] = useState(true);
  const [loadingEq, setLoadingEq] = useState(true);

  const [form, setForm] = useState({
    name: "",
    type: "pc",
    status: "Working",
    specs: "",
  });

  // ================= FETCH LAB =================
  useEffect(() => {
    setLoadingLab(true);

    fetch(`http://localhost:5000/labs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLab(data);
        setLoadingLab(false);
      })
      .catch(() => setLoadingLab(false));
  }, [id]);

  // ================= FETCH EQUIPMENT =================
  useEffect(() => {
    if (!lab?._id) return;

    setLoadingEq(true);

    fetch(`http://localhost:5000/equipment/lab/${lab._id}`)
      .then((r) => r.json())
      .then((data) => {
        setEquipment(data);
        setLoadingEq(false);
      })
      .catch(() => setLoadingEq(false));
  }, [lab]);

  // ================= SPINNER =================
  const Spinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#074F66] rounded-full animate-spin"></div>
    </div>
  );

  // ================= ADD EQUIPMENT =================
  const handleAddEquipment = async (e) => {
    e.preventDefault();

    const payload = {
      labId: lab._id,
      name: form.name,
      type: form.type,
      status: form.status,
      specs: form.specs,
      department: lab.department,
    };

    const res = await fetch("http://localhost:5000/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      setEquipment((prev) => [...prev, data.data]);
      setShowModal(false);

      setForm({
        name: "",
        type: "pc",
        status: "Working",
        specs: "",
      });
    }
  };

  // ================= DELETE EQUIPMENT =================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/equipment/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setEquipment((prev) => prev.filter((e) => e._id !== id));
    }
  };

  // ================= LOADING =================
  if (loadingLab) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  const pcs = equipment.filter(
    (e) => e.type === "pc" || e.name?.toLowerCase().includes("pc")
  );

  const others = equipment.filter(
    (e) => !(e.type === "pc" || e.name?.toLowerCase().includes("pc"))
  );

  const getStatusColor = (status) => {
    if (status === "Working") return "text-green-600 bg-green-100";
    if (status === "Under maintenance") return "text-yellow-600 bg-yellow-100";
    if (status === "Not working") return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK */}
      <Link className="text-blue-600" to="/labs">
        ← Back to Labs
      </Link>

      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl shadow mt-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#074F66]">
              {lab.name}
            </h2>

            <p className="text-gray-600 mt-1">{lab.description}</p>

            <div className="flex gap-4 mt-3 text-sm">
              <span>🖥 PCs: {lab.pcs}</span>
              <span>⚙ Equipment: {lab.equipmentCount}</span>
              <span>🚨 Open Issues: {lab.openIssues}</span>
            </div>
          </div>

          {(role === "chairman" || role === "teacher"|| role === "lab assistant") && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#074F66] text-white px-4 py-2 rounded-lg"
            >
              + Add Equipment
            </button>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] p-5 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Add Equipment</h2>

            <form onSubmit={handleAddEquipment} className="space-y-3">

              <input
                className="border p-2 w-full"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <select
                className="border p-2 w-full"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="pc">PC</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="monitor">Monitor</option>
                <option value="ups">UPS</option>
                <option value="printer">Printer</option>
                <option value="other">Other</option>
              </select>

              <select
                className="border p-2 w-full"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option>Working</option>
                <option>Under maintenance</option>
                <option>Not working</option>
              </select>

              <input
                className="border p-2 w-full"
                placeholder="Specs"
                value={form.specs}
                onChange={(e) =>
                  setForm({ ...form, specs: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-3 py-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#074F66] text-white px-4 py-2"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* PCS */}
      <h3 className="mt-6 font-bold">PCs</h3>

      {loadingEq ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {pcs.map((pc) => (
            <div key={pc._id} className="bg-white p-4 shadow rounded">

              <div className="flex justify-between">
                <h4 className="font-bold">{pc.name}</h4>

                <span className={`px-2 text-xs rounded ${getStatusColor(pc.status)}`}>
                  {pc.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">{pc.specs}</p>

              {pc.issue && (
                <p className="text-sm text-red-500 mt-2">⚠ {pc.issue}</p>
              )}

              {(role === "chairman" || role === "teacher"|| role === "lab assistant") && (
                <button
                  onClick={() => handleDelete(pc._id)}
                  className="text-red-600 text-xs mt-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* OTHER */}
      <h3 className="mt-8 font-bold">Other Equipment</h3>

      {loadingEq ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {others.map((eq) => (
            <div key={eq._id} className="bg-white p-4 shadow rounded flex justify-between">

              <div>
                <h4 className="font-semibold">{eq.name}</h4>
                <p className="text-sm text-gray-500">{eq.type}</p>
              </div>

              <div className="text-right">
                <span className="text-sm block">{eq.status}</span>

                {(role === "chairman" || role === "teacher"|| role === "lab assistant") && (
                  <button
                    onClick={() => handleDelete(eq._id)}
                    className="text-red-600 text-xs mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}