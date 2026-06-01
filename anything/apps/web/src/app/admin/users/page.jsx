"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminUsers() {
  const { data: user, loading } = useUser();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const togglePremium = async (userId, isPremium) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_premium: !isPremium,
          premium_expires_at: !isPremium
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAdmin = async (userId, isAdmin) => {
    if (!confirm(`${isAdmin ? "Remove" : "Grant"} admin access for this user?`))
      return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_admin: !isAdmin }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">{users.length} total users</p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4A5A5]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingUsers ? (
          <div className="text-center py-12">Loading users...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Activity
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
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5E6E8] flex items-center justify-center text-[#D4A5A5] font-bold">
                          {(u.first_name || u.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {u.first_name || u.last_name
                              ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                              : "No Name"}
                          </div>
                          {u.is_admin && (
                            <span className="text-xs text-purple-600 font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div>{u.saved_jobs_count || 0} saved</div>
                      <div>{u.active_alerts_count || 0} alerts</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${
                          u.is_premium
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.is_premium ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => togglePremium(u.id, u.is_premium)}
                        className="text-sm text-purple-600 hover:underline"
                      >
                        {u.is_premium ? "Revoke Premium" : "Grant Premium"}
                      </button>
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {u.is_admin ? "Remove Admin" : "Make Admin"}
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
