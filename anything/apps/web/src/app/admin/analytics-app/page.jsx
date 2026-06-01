"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Activity,
  Users,
  Smartphone,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Navigation from "@/components/Navigation";

export default function AppAnalyticsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dayRange, setDayRange] = useState(30);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading, dayRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?days=${dayRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Access Required
          </h2>
          <a href="/account/signin" className="text-[#D4A5A5] hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#D4A5A5] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Access Required
          </h2>
          <a href="/" className="text-[#D4A5A5] hover:underline">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalDownloads =
    stats?.platformStats?.reduce((acc, p) => acc + parseInt(p.total || 0), 0) ||
    0;
  const totalQRScans =
    stats?.platformStats?.reduce(
      (acc, p) => acc + parseInt(p.qr_scans || 0),
      0,
    ) || 0;
  const totalButtonClicks =
    stats?.platformStats?.reduce(
      (acc, p) => acc + parseInt(p.button_clicks || 0),
      0,
    ) || 0;

  const iosDownloads =
    stats?.platformStats?.find((p) => p.platform === "ios")?.total || 0;
  const androidDownloads =
    stats?.platformStats?.find((p) => p.platform === "android")?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              App Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Track app downloads and user engagement metrics
            </p>
          </div>
          <select
            value={dayRange}
            onChange={(e) => setDayRange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Total Downloads
              </h3>
              <Download className="w-5 h-5 text-[#D4A5A5]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalDownloads}</p>
            <p className="text-sm text-gray-500 mt-1">Last {dayRange} days</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                iOS Downloads
              </h3>
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{iosDownloads}</p>
            <p className="text-sm text-gray-500 mt-1">
              {totalDownloads > 0
                ? Math.round((iosDownloads / totalDownloads) * 100)
                : 0}
              % of total
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Android Downloads
              </h3>
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {androidDownloads}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {totalDownloads > 0
                ? Math.round((androidDownloads / totalDownloads) * 100)
                : 0}
              % of total
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                QR Code Scans
              </h3>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalQRScans}</p>
            <p className="text-sm text-gray-500 mt-1">
              {totalButtonClicks} button clicks
            </p>
          </div>
        </div>

        {/* Download Sources */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#D4A5A5]" />
              Download Sources
            </h3>
            {stats?.sourceStats && stats.sourceStats.length > 0 ? (
              <div className="space-y-3">
                {stats.sourceStats.slice(0, 10).map((source) => (
                  <div key={`${source.source}-${source.platform}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {source.source} ({source.platform})
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {source.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#D4A5A5] h-2 rounded-full"
                        style={{
                          width: `${(source.total / totalDownloads) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No data available
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D4A5A5]" />
              Top Engagement Events
            </h3>
            {stats?.engagementStats && stats.engagementStats.length > 0 ? (
              <div className="space-y-3">
                {stats.engagementStats.slice(0, 10).map((event) => (
                  <div key={`${event.event_type}-${event.platform || "web"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {event.event_type.replace(/_/g, " ")} (
                        {event.platform || "web"})
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {event.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* User Retention */}
        {stats?.retentionStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4A5A5]" />
              User Retention
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.retentionStats.total_users || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Returning Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.retentionStats.returning_users || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                <p className="text-2xl font-bold text-[#D4A5A5]">
                  {stats.retentionStats.retention_rate || 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Daily Stats Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4A5A5]" />
            Daily Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    iOS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Android
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Scans
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buttons
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DAU
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.dailyStats && stats.dailyStats.length > 0 ? (
                  stats.dailyStats.map((day) => (
                    <tr key={day.date}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {day.total_downloads || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {day.ios_downloads || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {day.android_downloads || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {day.qr_code_scans || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {day.button_clicks || 0}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {day.daily_active_users || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No daily data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
