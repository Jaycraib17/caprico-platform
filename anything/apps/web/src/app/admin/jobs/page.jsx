"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminJobs() {
  const { data: user, loading } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/account/signin";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/jobs?limit=200&show_inactive=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const toggleJobActive = async (jobId, isActive) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (res.ok) fetchJobs();
      else console.error("Toggle failed:", await res.text());
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      !searchTerm ||
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Redirecting…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <a
            href="/admin"
            className="text-sm text-[#D4A5A5] hover:underline mb-2 block"
          >
            ← Back to Dashboard
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-1">
                {jobs.length} total · {jobs.filter((j) => j.is_active).length}{" "}
                active
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <input
          type="text"
          placeholder="Search by title or company…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#FF2D75] mb-6"
        />

        {loadingJobs ? (
          <div className="text-center py-12 text-gray-500">Loading jobs…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
            No jobs found
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Job",
                    "Company",
                    "Category",
                    "Posted",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50"
                    style={{ opacity: job.is_active ? 1 : 0.55 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.employment_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[140px] truncate">
                      {job.company_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${job.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => toggleJobActive(job.id, job.is_active)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {job.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
