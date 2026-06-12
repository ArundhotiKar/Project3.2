import React, { useContext, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../provider/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❗ extra safety (stop double submit / weird reload)
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      let statusData = null;

      try {
        const statusRes = await fetch(
          `http://localhost:5000/users/role/${formData.email}`
        );

        if (statusRes.ok) {
          statusData = await statusRes.json();
        }
      } catch (err) {
        console.warn("Status API failed:", err);
      }

      if (statusData?.status === "pending") {
        alert("Account pending approval from chairman.");
        return;
      }

      await logIn(formData.email, formData.password);

      alert("Login Successful");

      // ❗ small delay prevents UI glitch reload feel
      setTimeout(() => {
        navigate("/");
      }, 100);

    } catch (error) {
      console.error(error);

      const code = error?.code;

      if (code === "auth/invalid-credential") {
        setError("Wrong email or password!");
        alert("Wrong email or password!");
      } else if (code === "auth/user-not-found") {
        setError("User not found!");
        alert("User not found!");
      } else if (code === "auth/invalid-email") {
        setError("Invalid email address!");
        alert("Invalid email address!");
      } else {
        setError("Login failed!");
        alert("Login failed!");
      }
      
      

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-300/30 blur-3xl rounded-full"></div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 transition"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden">

        {/* Top Gradient */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

        <div className="p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Logo" className="w-14 h-14" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Welcome Back
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              Lab Management System
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full bg-slate-50 border rounded-2xl px-4 py-3"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-slate-50 border rounded-2xl px-4 py-3 pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Secure */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck size={16} />
              Secure Login
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-2xl flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;