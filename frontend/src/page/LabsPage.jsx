import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { Loader2 } from "lucide-react";

export default function LabsPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5000/labs")
      .then((r) => r.json())
      .then((data) => {
        // user er department er sathe match korle sudhu dekhabe
        const filteredLabs = data.filter(
          (lab) =>
            lab.department?.toLowerCase() ===
            userInfo?.department?.toLowerCase()
        );

        setLabs(filteredLabs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userInfo]);

  // LOADING SPINNER
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>

            <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
            <Loader2 className="animate-spin w-5 h-5" />
            Loading Labs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {userInfo?.department} Labs
        </h2>

        <p className="text-gray-500 mt-1">
          Explore all labs from your department
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {labs.map((l) => (
          <div
            key={l._id}
            className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-2xl text-gray-800">
                  {l.name}
                </h3>

                <p className="text-sm text-indigo-600 mt-1 font-medium">
                  {l.department} Department
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
                🧪
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed min-h-[48px]">
              {l.description}
            </p>

            <div className="mt-6 text-sm space-y-3">
              <div className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-xl">
                <span className="font-medium">🖥 PCs</span>

                <span className="font-bold text-gray-800">
                  {l.pcs || 0}
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-xl">
                <span className="font-medium">
                  📦 Equipment
                </span>

                <span className="font-bold text-gray-800">
                  {l.equipmentCount ??
                    (Array.isArray(l.equipment)
                      ? l.equipment.length
                      : l.equipment || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-red-50 text-red-500 px-4 py-3 rounded-xl">
                <span className="font-medium">
                  ⚠ Open Issues
                </span>

                <span className="font-bold">
                  {l.openIssues || 0}
                </span>
              </div>
            </div>

            <Link
              to={`/labs/${l._id}`}
              className="mt-6 block text-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-2xl font-semibold transition duration-300"
            >
              View Lab
            </Link>
          </div>
        ))}
      </div>

      {labs.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="text-7xl mb-4">📭</div>

          <h3 className="text-2xl font-bold text-gray-700">
            No Labs Found
          </h3>

          <p className="text-gray-500 mt-2">
            No labs found for your department.
          </p>
        </div>
      )}
    </div>
  );
}