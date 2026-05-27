"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminDashboard() {
  const { data: user, loading } = useUser();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user?.is_admin) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this page.
          </p>
          <a href="/" className="text-[#D4A5A5] hover:underline font-semibold">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your remote job platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
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

        {/* Quick Actions */}
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
            title="Analytics"
            description="View platform analytics"
            href="/admin/analytics"
            icon="📊"
          />
          <ActionCard
            title="Bulk Import"
            description="Import jobs from CSV files"
            href="/admin/import"
            icon="📤"
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
      className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4A5A5] transition-all group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#D4A5A5] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
