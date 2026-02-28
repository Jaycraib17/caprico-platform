"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminJobs() {
  const { data: user, loading } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user?.is_admin) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs?limit=100");
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

      if (res.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchJobs();
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-1">{jobs.length} total jobs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingJobs ? (
          <div className="text-center py-12">Loading jobs...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Job
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Posted
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.employment_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.company_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${
                          job.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
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
