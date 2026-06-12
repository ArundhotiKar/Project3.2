import { useContext } from "react";
import Navbar from "../component/Navbar";
import SimpleNavbar from "../component/SimpleNavbar";
import { AuthContext } from "../provider/AuthProvider";
import RootChild from "./RootChild";

const Root = () => {
  const { user, loading } = useContext(AuthContext);

  // ✅ wait until auth finishes loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {user ? <Navbar /> : <SimpleNavbar />}

      <RootChild />
    </div>
  );
};

export default Root;