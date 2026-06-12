import React, { useEffect, useState } from "react";
import axios from "axios";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);

    const [editDept, setEditDept] = useState(null);

    const [form, setForm] = useState({
        name: "",
        chairmanName: "",
        chairmanEmail: "",
        chairmanPassword: "",
    });

    const [editForm, setEditForm] = useState({
        chairmanName: "",
        chairmanEmail: "",
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/departments");
            setDepartments(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // CREATE DEPARTMENT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/departments", form);

            setForm({
                name: "",
                chairmanName: "",
                chairmanEmail: "",
                chairmanPassword: "",
            });

            setOpen(false);
            fetchDepartments();
        } catch (err) {
            console.log(err);
        }
    };

    // OPEN EDIT MODAL
    const openEditModal = (dept) => {
        setEditDept(dept);
        setEditForm({
            chairmanName: dept.chairmanName,
            chairmanEmail: dept.chairmanEmail,
        });
    };

    // UPDATE CHAIRMAN
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(
                `http://localhost:5000/departments/${editDept._id}/chairman`,
                editForm
            );

            setEditDept(null);
            fetchDepartments();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Departments</h2>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Department
                </button>
            </div>

            {/* LIST */}
            <div className="grid md:grid-cols-3 gap-4">
                {departments.map((d) => (
                    <div
                        key={d._id}
                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <h3 className="font-bold text-lg text-center">
                            {d.name}
                        </h3>

                        <p>👨‍🏫 Chairman: {d.chairmanName}</p>
                        <p>📧 Email: {d.chairmanEmail}</p>

                        <p className="font-semibold text-blue-600">
                            🏫 Labs: {d.labCount || 0}
                        </p>

                        {/* EDIT BUTTON */}
                        <button
                            onClick={() => openEditModal(d)}
                            className="mt-3 text-sm text-blue-600 underline"
                        >
                            Edit Chairman
                        </button>
                    </div>
                ))}
            </div>

            {/* ADD MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl">

                        <h2 className="text-xl font-bold mb-4">
                            Add Department
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3">

                            <input
                                placeholder="Department Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <input
                                placeholder="Chairman Name"
                                value={form.chairmanName}
                                onChange={(e) =>
                                    setForm({ ...form, chairmanName: e.target.value })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <input
                                placeholder="Chairman Email"
                                value={form.chairmanEmail}
                                onChange={(e) =>
                                    setForm({ ...form, chairmanEmail: e.target.value })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={form.chairmanPassword}
                                onChange={(e) =>
                                    setForm({ ...form, chairmanPassword: e.target.value })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editDept && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl">

                        <h2 className="text-xl font-bold mb-4">
                            Update Chairman
                        </h2>

                        <form onSubmit={handleUpdate} className="space-y-3">

                            <input
                                placeholder="Chairman Name"
                                value={editForm.chairmanName}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        chairmanName: e.target.value,
                                    })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <input
                                placeholder="Chairman Email"
                                value={editForm.chairmanEmail}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        chairmanEmail: e.target.value,
                                    })
                                }
                                className="border p-2 w-full rounded"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditDept(null)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Update
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;