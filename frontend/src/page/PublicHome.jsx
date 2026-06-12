import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Wrench,
  Users,
} from "lucide-react";

const PublicHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 overflow-hidden">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck size={18} />
              Smart Laboratory Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight text-slate-800">
              Modern
              <span className="text-blue-600"> Lab Management </span>
              System
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Manage laboratory equipment, monitor issues, track maintenance,
              and streamline approvals with a modern university lab management
              platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signin"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-lg flex items-center gap-2 transition"
              >
                Sign In
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/signup"
                className="bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 px-7 py-3.5 rounded-2xl font-semibold shadow-sm transition"
              >
                Create Account
              </Link>
            </div>

          </div>

          {/* Right */}
          <div className="relative">

            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl"></div>

            <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl"></div>

            <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-8 shadow-2xl">

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-blue-50 rounded-3xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <FlaskConical size={28} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    Laboratory
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Smart lab and equipment monitoring
                  </p>
                </div>

                <div className="bg-cyan-50 rounded-3xl p-6 mt-10">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                    <Wrench size={28} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    Maintenance
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Track and resolve issues efficiently
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-3xl p-6 -mt-2">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <Users size={28} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    Multi User
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Students, teachers & admins
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-3xl p-6 mt-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <ShieldCheck size={28} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">
                    Secure
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Role-based secure access system
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-800">
            Platform Features
          </h2>

          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Everything needed to manage university laboratories
            in one modern platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
              🧪
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Lab Management
            </h3>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Organize laboratories, monitor equipment,
              and manage department resources easily.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-5">
              ⚠
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Issue Tracking
            </h3>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Report issues instantly and monitor repair
              progress in real time.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
              🔐
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              Role Based Access
            </h3>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Different dashboards and permissions for
              students, teachers, and administrators.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PublicHome;