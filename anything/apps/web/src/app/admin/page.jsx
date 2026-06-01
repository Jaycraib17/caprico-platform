"use client";

import { useEffect, useState } from "react";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.isAdmin) {
          window.location.href = "/account/signin";
          return;
        }
        setIsAdmin(true);
        setLoading(false);
        fetchStats();
      })
      .catch((err) => {
        console.error("Admin check failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
      {/* Header with Capri Remote branding */}
      <div className="bg-white border-b" style={{ borderColor: "#FAD6E5" }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="Capri Remote"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="text-xl font-bold tracking-tight">
                <span style={{ color: "#6A0DAD" }}>Capri</span>
                <span style={{ color: "#FF2D75" }}> Remote</span>
              </span>
            </a>
            <span className="text-gray-300">|</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1A1028" }}>
                Admin Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Manage your remote job platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingStats ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading stats...</div>
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Jobs"
                value={stats.total_jobs}
                subtitle={`${stats.active_jobs} active`}
                icon="💼"
                color="blue"
              />
              <StatCard
                title="Companies"
                value={stats.total_companies}
                subtitle={`${stats.hiring_companies} hiring`}
                icon="🏢"
                color="purple"
              />
              <StatCard
                title="Total Users"
                value={stats.total_users}
                subtitle={`${stats.premium_users} premium`}
                icon="👥"
                color="green"
              />
              <StatCard
                title="Reports"
                value={stats.pending_reports}
                subtitle="Pending review"
                icon="⚠️"
                color="red"
              />
            </div>
          )
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Manage Jobs"
            description="Create, edit, and manage job listings"
            href="/admin/jobs"
            icon="💼"
          />
          <ActionCard
            title="Manage Companies"
            description="Add and edit company profiles"
            href="/admin/companies"
            icon="🏢"
          />
          <ActionCard
            title="Review Reports"
            description="Handle flagged job listings"
            href="/admin/reports"
            icon="🚩"
          />
          <ActionCard
            title="User Management"
            description="View and manage user accounts"
            href="/admin/users"
            icon="👥"
          />
          <ActionCard
            title="Purchases"
            description="View and manage service purchases"
            href="/admin/purchases"
            icon="💰"
          />
          <ActionCard
            title="Analytics"
            description="View platform analytics"
            href="/admin/analytics"
            icon="📊"
          />
          <ActionCard
            title="App Analytics"
            description="Track app downloads and engagement"
            href="/admin/analytics-app"
            icon="📱"
          />
          <ActionCard
            title="Bulk Import"
            description="Import jobs from CSV files"
            href="/admin/import"
            icon="📤"
          />
          <ActionCard
            title="CSV Company Import"
            description="Upload a CSV to bulk-import companies"
            href="/admin/companies-import"
            icon="🏢"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, href, icon }) {
  return (
    <a
      href={href}
      className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#FF2D75] transition-all group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF2D75] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
