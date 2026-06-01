"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  TrendingUp,
  Globe,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Paywall from "@/components/Paywall";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied", bg: "#EFF6FF", text: "#1D4ED8" },
  {
    value: "interviewing",
    label: "Interviewing",
    bg: "#FFFBEB",
    text: "#B45309",
  },
  { value: "offer", label: "Offer", bg: "#F0FDF4", text: "#166534" },
  { value: "rejected", label: "Rejected", bg: "#FEF2F2", text: "#991B1B" },
  { value: "accepted", label: "Accepted", bg: "#F5F3FF", text: "#5B21B6" },
  { value: "withdrawn", label: "Withdrawn", bg: "#F9FAFB", text: "#6B7280" },
];

const getStatusStyle = (status) =>
  STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[5];

export default function ApplicationTracker() {
  const { data: user, loading: userLoading } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user) fetchApplications();
    else if (!userLoading) setLoading(false);
  }, [user, userLoading]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (response.status === 403) {
        setShowPaywall(true);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id, updates) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        setApplications(
          applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app,
          ),
        );
        setEditingId(null);
        setEditData({});
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const deleteApplication = async (id) => {
    if (!confirm("Delete this application?")) return;
    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      setApplications(applications.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  if (!user && !userLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <div
          className="text-center bg-white rounded-3xl p-10 shadow-xl border max-w-sm w-full"
          style={{ borderColor: "#FAD6E5" }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)" }}
          >
            <TrendingUp className="w-10 h-10" style={{ color: "#FF2D75" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1028" }}>
            Sign In Required
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            Please sign in to access the application tracker
          </p>
          <a
            href="/account/signin"
            className="inline-block px-8 py-3.5 font-bold text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg, #FF2D75, #6A0DAD)" }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Paywall
          isOpen={showPaywall}
          onClose={() => (window.location.href = "/")}
          trigger="application_tracker"
        />

        <Navigation />

        {/* ── HERO ─────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Application Tracker
              </h1>
            </div>
            <p className="text-base" style={{ color: "#FECDE0" }}>
              Stay organised and never lose track of your job applications
            </p>
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="text-center py-16">
              <div
                className="inline-block h-9 w-9 rounded-full border-4 border-solid border-r-transparent"
                style={{
                  borderColor: "#FF2D75",
                  borderRightColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>
                Loading applications…
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-2xl border p-10"
              style={{ borderColor: "#FAD6E5" }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                }}
              >
                <Briefcase className="w-10 h-10" style={{ color: "#6A0DAD" }} />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "#1A1028" }}
              >
                No Applications Yet
              </h3>
              <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
                Start tracking your job applications to stay organised
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3.5 font-bold text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                Tracking{" "}
                <span className="font-semibold" style={{ color: "#1A1028" }}>
                  {applications.length}
                </span>{" "}
                application{applications.length !== 1 ? "s" : ""}
              </p>
              {applications.map((app) => {
                const statusStyle = getStatusStyle(app.status);
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border p-5 md:p-6 hover:shadow-md transition-shadow"
                    style={{ borderColor: "#FAD6E5" }}
                  >
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg font-bold truncate mb-0.5"
                          style={{ color: "#1A1028" }}
                        >
                          {app.job_title}
                        </h3>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          {app.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {editingId === app.id ? (
                          <select
                            value={editData.status || app.status}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 border rounded-xl text-sm outline-none"
                            style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.text,
                            }}
                          >
                            {statusStyle.label}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (editingId === app.id)
                              updateApplication(app.id, editData);
                            else {
                              setEditingId(app.id);
                              setEditData({
                                status: app.status,
                                notes: app.notes,
                              });
                            }
                          }}
                          className="p-2 rounded-lg transition-colors hover:bg-[#FFF5F8]"
                          style={{
                            color: editingId === app.id ? "#FF2D75" : "#9CA3AF",
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-50"
                          style={{ color: "#9CA3AF" }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-4 text-xs mb-3"
                      style={{ color: "#9CA3AF" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                      {app.follow_up_date && (
                        <span>
                          Follow-up:{" "}
                          {new Date(app.follow_up_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {editingId === app.id ? (
                      <textarea
                        value={editData.notes || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        placeholder="Add notes…"
                        className="w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none"
                        style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                        rows="3"
                      />
                    ) : app.notes ? (
                      <p
                        className="text-sm p-3 rounded-xl"
                        style={{ backgroundColor: "#FFF5F8", color: "#374151" }}
                      >
                        {app.notes}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
