import { useContext } from "react";
import Aside from "../Aside/Aside";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const RootChild = () => {
  const {
    user,
    role,
    loading,
  } = useContext(AuthContext);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ================= SIDEBAR ================= */}
      {user && role && (
        <div className="w-[80px] md:w-[160px] lg:w-[220px] border-r bg-white shadow-sm">
          <Aside role={role} />
        </div>
      )}

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-3 md:p-5 overflow-x-hidden">
        <Outlet />
      </div>

    </div>
  );
};

export default RootChild;