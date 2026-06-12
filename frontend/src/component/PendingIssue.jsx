import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";

const PendingIssue = () => {
    const { role } = useContext(AuthContext);
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/issues?status=pending"
            );
            setIssues(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFixed = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/issues/${id}`, {
                status: "resolved",
            });

            fetchIssues();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-4 relative">
            <h2 className="text-xl font-bold mb-4">
                Pending Issues to Solve
            </h2>

            <div className="space-y-4">
                {issues.map((item) => (
                    <div
                        key={item._id}
                        className="border p-4 rounded-xl flex justify-between items-center"
                    >
                        {/* LEFT */}
                        <div>
                            <h3 className="font-bold">
                                {item.equipment} - {item.lab}
                            </h3>

                            <p className="text-gray-700">{item.description}</p>

                            <p className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="flex gap-2">
                            {role === "labincharge" && (
                                <button
                                    onClick={() => handleFixed(item._id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Mark Fixed
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedIssue(item)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {selectedIssue && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white/95 shadow-2xl rounded-2xl p-6 w-[420px] relative animate-fadeIn">

                        {/* close */}
                        <button
                            onClick={() => setSelectedIssue(null)}
                            className="absolute top-2 right-3 text-xl"
                        >
                            ✖
                        </button>

                        <h2 className="text-xl font-bold mb-3">
                            Issue Details
                        </h2>

                        <p><b>Lab:</b> {selectedIssue.lab}</p>
                        <p><b>Equipment:</b> {selectedIssue.equipment}</p>
                        <p><b>Description:</b> {selectedIssue.description}</p>
                        <p><b>Status:</b> {selectedIssue.status}</p>

                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(selectedIssue.createdAt).toLocaleString()}
                        </p>

                        {selectedIssue.email && (
                            <p className="mt-2">
                                <b>Email:</b> {selectedIssue.email}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingIssue;