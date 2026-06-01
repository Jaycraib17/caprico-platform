"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminReports() {
  const { data: user, loading } = useUser();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, reviewed, resolved, dismissed

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchReports();
    }
  }, [user, filter]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/admin/reports?status=${filter}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReports(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus, adminNotes = "") => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      });

      if (res.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <a
                href="/admin"
                className="text-sm text-[#D4A5A5] hover:underline mb-2 block"
              >
                ← Back to Dashboard
              </a>
              <h1 className="text-3xl font-bold text-gray-900">Job Reports</h1>
              <p className="text-gray-600 mt-1">Review flagged job listings</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6">
            {["pending", "reviewed", "resolved", "dismissed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  filter === status
                    ? "bg-[#D4A5A5] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingReports ? (
          <div className="text-center py-12">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No {filter} reports</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {report.job_title || "Job Not Found"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Company: {report.company_name || "Unknown"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : report.status === "reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Reason:</strong> {report.reason}
                  </p>
                  {report.details && (
                    <p className="text-sm text-gray-600">
                      <strong>Details:</strong> {report.details}
                    </p>
                  )}
                  {report.admin_notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Admin Notes:</strong> {report.admin_notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Reported {new Date(report.created_at).toLocaleDateString()}
                  </div>

                  {report.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateReportStatus(report.id, "reviewed")
                        }
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() =>
                          updateReportStatus(
                            report.id,
                            "resolved",
                            "Job removed or fixed",
                          )
                        }
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() =>
                          updateReportStatus(
                            report.id,
                            "dismissed",
                            "Not a valid concern",
                          )
                        }
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
