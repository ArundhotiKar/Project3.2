import React, { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const initial = {
    name: "",
    role: "student",
    id: "",
    batch: "",
    email: "",
    department: "CSE",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      role,
      id,
      batch,
      email,
      department,
      password,
      confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await createUser(email, password);

      const userInfo = {
        name,
        role: role.toLowerCase(),
        batch: batch || "",
        email,
        department,
        createdAt: new Date(),
      };

      if (role !== "teacher" && role !== "labincharge" && id) {
        userInfo.id = id;
      }

      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }


      setFormData(initial);

      // ✅ direct redirect to signin
      navigate("/signin", { replace: true });
      alert("Account created successfully!");

    } catch (err) {
      console.error(err);
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { key: "student", label: "Student" },
    { key: "teacher", label: "Teacher" },
    { key: "labincharge", label: "Lab Assistant" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4 py-10 relative">

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 transition"
      >
        <span className="text-2xl">←</span>
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 border border-slate-200">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 mb-4" />

          <h1 className="text-3xl font-bold text-slate-800">
            Create Account
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Join Lab Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />

          {/* Role */}
          <div className="flex gap-2 flex-wrap">
            {roleOptions.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() =>
                  setFormData((s) => ({ ...s, role: r.key }))
                }
                className={`px-3 py-2 rounded-xl border text-sm transition ${
                  formData.role === r.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* ID */}
          {formData.role !== "teacher" &&
            formData.role !== "labincharge" && (
              <input
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="ID Number"
                className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            )}

          {/* Batch */}
          {formData.role === "student" && (
            <input
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="Batch (e.g. 2019-23)"
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />

          {/* Department */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option>CSE</option>
            <option>EEE</option>
            <option>CE</option>
            <option>ME</option>
            <option>TE</option>
          </select>

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition shadow-md"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;