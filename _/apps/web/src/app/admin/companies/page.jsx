"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminCompanies() {
  const { data: user, loading } = useUser();
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo_url: "",
    description: "",
    website: "",
    remote_policy: "Fully Remote",
    hiring_countries: "",
  });

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchCompanies();
    }
  }, [user]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        hiring_countries: formData.hiring_countries
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          slug: "",
          logo_url: "",
          description: "",
          website: "",
          remote_policy: "Fully Remote",
          hiring_countries: "",
        });
        fetchCompanies();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCompany = async (id) => {
    if (!confirm("Delete this company? All associated jobs will be removed."))
      return;

    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCompanies();
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
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Companies
              </h1>
              <p className="text-gray-600 mt-1">
                {companies.length} total companies
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-[#D4A5A5] text-white rounded-xl font-semibold hover:bg-[#C4958F] transition-colors"
            >
              + Add Company
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingCompanies ? (
          <div className="text-center py-12">Loading companies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {company.logo_url || "🏢"}
                  </div>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {company.description || "No description"}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Policy:</span>
                    <span className="font-medium text-gray-900">
                      {company.remote_policy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Jobs:</span>
                    <span className="font-bold text-[#D4A5A5]">
                      {company.job_count}
                    </span>
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4A5A5] hover:underline block"
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Company</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  placeholder="e.g., Notion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (URL-friendly) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  placeholder="e.g., notion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo (emoji or URL)
                </label>
                <input
                  type="text"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  placeholder="e.g., 📝 or https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  rows="3"
                  placeholder="Brief company description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  placeholder="https://notion.so"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remote Policy
                </label>
                <select
                  value={formData.remote_policy}
                  onChange={(e) =>
                    setFormData({ ...formData, remote_policy: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                >
                  <option value="Fully Remote">Fully Remote</option>
                  <option value="Remote First">Remote First</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote Allowed">Remote Allowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hiring Countries (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.hiring_countries}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hiring_countries: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  placeholder="e.g., United States, Canada, United Kingdom"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#D4A5A5] text-white rounded-xl font-semibold hover:bg-[#C4958F]"
                >
                  Create Company
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
