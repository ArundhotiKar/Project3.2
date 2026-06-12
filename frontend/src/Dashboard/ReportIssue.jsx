import React, { useContext, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [issues, setIssues] = useState([]);
  const [labs, setLabs] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);

  const [formData, setFormData] = useState({
    labName: "",
    equipmentId: "",
    equipmentSearch: "",
    title: "",
    description: "",
  });

  // ================= USER INFO =================
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data))
      .catch(console.error);
  }, [user]);

  // ================= ISSUES =================
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/issues/${user.email}`)
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch(console.error);
  }, [user]);

  // ================= LABS (department wise) =================
  useEffect(() => {
    if (!userInfo?.department) return;

    fetch(`http://localhost:5000/labs?department=${userInfo.department}`)
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch(console.error);
  }, [userInfo?.department]);

  // ================= EQUIPMENT =================
  useEffect(() => {
    fetch("http://localhost:5000/equipment")
      .then((res) => res.json())
      .then((data) => {
        setEquipmentList(data);
      })
      .catch(console.error);
  }, []);

  // ================= LAB CHANGE =================
  const handleLabChange = (e) => {
    const labName = e.target.value;

    setFormData({
      ...formData,
      labName,
      equipmentId: "",
      equipmentSearch: "",
    });

    const filtered = equipmentList.filter(
      (item) => item.lab === labName || item.labId === labName
    );

    setFilteredEquipment(filtered);
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (
      !formData.labName ||
      !formData.equipmentId ||
      !formData.title ||
      !formData.description
    ) {
      alert("Please fill all fields");
      return;
    }

    const selectedEquipment = equipmentList.find(
      (item) => item._id === formData.equipmentId
    );

    const issueData = {
      equipmentId: selectedEquipment._id,
      equipmentName: selectedEquipment.name,
      labId: selectedEquipment.labId,
      labName: selectedEquipment.lab,

      title: formData.title,
      description: formData.description,

      reportedBy: userInfo?.name,
      email: user?.email,
      department: userInfo?.department,

      status: "pending",
      createdAt: new Date(),
    };

    const res = await fetch("http://localhost:5000/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });

    const data = await res.json();

    if (data.insertedId) {
      setIssues((prev) => [{ _id: data.insertedId, ...issueData }, ...prev]);

      setFormData({
        labName: "",
        equipmentId: "",
        equipmentSearch: "",
        title: "",
        description: "",
      });

      setFilteredEquipment([]);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Reported Issues</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex gap-2"
        >
          <Plus size={18} />
          Report Problem
        </button>
      </div>

      {/* ISSUES */}
      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue._id} className="bg-white p-4 rounded-xl border">
              <h2 className="font-bold">{issue.equipmentName}</h2>
              <p>{issue.title}</p>

              <span className="text-sm px-2 py-1 bg-yellow-100 rounded">
                {issue.status}
              </span>

              <p className="text-xs text-gray-500 mt-2">
                {issue.labName} • {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No issues found</p>
        )}
      </div>

      {/* MODAL */}
      {/* MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

    {/* MODAL BOX */}
    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">
          Report Issue
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="p-2 hover:bg-gray-200 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* BODY (SCROLLABLE) */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1">

        {/* LAB */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Select Lab
          </label>

          <select
            className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.labName}
            onChange={handleLabChange}
          >
            <option value="">Choose a lab</option>
            {labs.map((lab) => (
              <option key={lab._id} value={lab.name}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>

        {/* EQUIPMENT */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Equipment
          </label>

          <input
            className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search equipment..."
            value={formData.equipmentSearch}
            onChange={(e) => {
              const value = e.target.value;

              setFormData((prev) => ({
                ...prev,
                equipmentSearch: value,
                equipmentId: "",
              }));

              const filtered = equipmentList.filter(
                (item) =>
                  (item.lab === formData.labName ||
                    item.labId === formData.labName) &&
                  item.name.toLowerCase().includes(value.toLowerCase())
              );

              setFilteredEquipment(filtered);
            }}
          />

          {/* DROPDOWN */}
          {filteredEquipment.length > 0 && (
            <div className="border rounded-xl mt-2 max-h-40 overflow-y-auto shadow-sm bg-white">
              {filteredEquipment.map((item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      equipmentId: item._id,
                      equipmentSearch: item.name,
                    }))
                  }
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Issue Title
          </label>

          <input
            name="title"
            className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter issue title"
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>

          <textarea
            name="description"
            rows={4}
            className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Describe the problem..."
            onChange={handleChange}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-5 py-4 border-t bg-gray-50 flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-xl border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default ReportIssue;