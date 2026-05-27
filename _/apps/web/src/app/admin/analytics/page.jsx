"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminAnalytics() {
  const { data: user, loading } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?days=${timeRange}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (loading || !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const COLORS = ["#D4A5A5", "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

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
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Platform performance metrics</p>
            </div>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingAnalytics ? (
          <div className="text-center py-12">Loading analytics...</div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Job Views Over Time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Job Views Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.viewsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B6B6B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6B6B6B" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#D4A5A5"
                    strokeWidth={2}
                    dot={{ fill: "#D4A5A5", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Jobs by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Jobs by Category
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.jobsByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(analytics.jobsByCategory || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Jobs by Experience Level */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Experience Levels
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.jobsByExperience || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="level"
                      stroke="#6B6B6B"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis stroke="#6B6B6B" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#D4A5A5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Companies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Top Companies by Job Count
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topCompanies || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    stroke="#6B6B6B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#6B6B6B"
                    style={{ fontSize: "12px" }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="job_count"
                    fill="#8884d8"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Growth */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                User Signups
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B6B6B"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6B6B6B" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="New Users"
                    dot={{ fill: "#82ca9d", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="premium"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Premium Users"
                    dot={{ fill: "#ffc658", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
