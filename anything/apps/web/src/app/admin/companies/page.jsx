"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminCompanies() {
  const { data: user, loading } = useUser();
  const [allCompanies, setAllCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    remote_policy: "Fully Remote",
    region: "",
    tags: "",
  });

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) window.location.href = "/";
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const res = await fetch("/api/companies?show_inactive=true&limit=1000");
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setAllCompanies(data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const toggleActive = async (id, current) => {
    try {
      await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current }),
      });
      fetchCompanies();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCompany = async (id) => {
    if (!confirm("Delete this company? All associated jobs will be removed."))
      return;
    try {
      await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
      fetchCompanies();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          website: "",
          remote_policy: "Fully Remote",
          region: "",
          tags: "",
        });
        fetchCompanies();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create company");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const active = allCompanies.filter((c) => c.is_active === true);
  const inactive = allCompanies.filter((c) => c.is_active !== true);
  const displayed = showInactive ? allCompanies : active;

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
          <a
            href="/admin"
            className="text-sm text-[#D4A5A5] hover:underline mb-2 block"
          >
            ← Back to Dashboard
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Companies
              </h1>
              <p className="text-gray-600 mt-1">
                {allCompanies.length} total · {active.length} active ·{" "}
                {inactive.length} inactive
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/admin/companies-import"
                className="px-4 py-2 border border-[#D4A5A5] text-[#D4A5A5] rounded-xl text-sm font-semibold hover:bg-[#D4A5A5] hover:text-white transition-colors"
              >
                📤 CSV Import
              </a>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-5 py-2 bg-[#D4A5A5] text-white rounded-xl font-semibold hover:bg-[#C4958F] transition-colors"
              >
                + Add Company
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary + toggle bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
            📊 {allCompanies.length} Total
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
            ✅ {active.length} Active
          </span>
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-semibold">
            ❌ {inactive.length} Inactive
          </span>
          <label className="flex items-center gap-2 ml-auto cursor-pointer text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 accent-[#D4A5A5]"
            />
            Show inactive
          </label>
          <a
            href="/api/admin/companies/debug"
            target="_blank"
            className="text-xs text-gray-400 hover:underline"
          >
            Debug DB →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingCompanies ? (
          <div className="text-center py-16 text-gray-500">
            Loading companies…
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-2xl mb-2">🏢</p>
            <p className="text-gray-600 text-lg font-semibold mb-1">
              No companies found
            </p>
            <p className="text-gray-400 text-sm">
              {allCompanies.length === 0
                ? "Import via CSV or add one manually."
                : "Try enabling 'Show inactive' above."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Company",
                    "Website",
                    "Region",
                    "Tags",
                    "Jobs",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayed.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50"
                    style={{ opacity: c.is_active ? 1 : 0.5 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                          {c.logo_url ? (
                            <img
                              src={c.logo_url}
                              alt={c.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            "🏢"
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 truncate max-w-[150px]">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[160px] truncate">
                      {c.website ? (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {c.region || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {t}
                          </span>
                        ))}
                        {c.tags?.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{c.tags.length - 2}
                          </span>
                        )}
                        {(!c.tags || c.tags.length === 0) && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-center">
                      {c.job_count ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleActive(c.id, c.is_active)}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          {c.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteCompany(c.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Add Company</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  label: "Company Name *",
                  key: "name",
                  type: "text",
                  required: true,
                  placeholder: "e.g. Notion",
                },
                {
                  label: "Website",
                  key: "website",
                  type: "url",
                  placeholder: "https://...",
                },
                {
                  label: "Region",
                  key: "region",
                  type: "text",
                  placeholder: "e.g. Worldwide",
                },
                {
                  label: "Tags (comma separated)",
                  key: "tags",
                  type: "text",
                  placeholder: "e.g. Tech, SaaS",
                },
              ].map(({ label, key, type, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={required}
                    value={formData[key]}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Remote Policy
                </label>
                <select
                  value={formData.remote_policy}
                  onChange={(e) =>
                    setFormData({ ...formData, remote_policy: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
                >
                  {[
                    "Fully Remote",
                    "Remote First",
                    "Hybrid",
                    "Remote Allowed",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D4A5A5] text-white rounded-xl font-semibold hover:bg-[#C4958F]"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
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
