"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function AdminPurchasesPage() {
  const { data: user, loading: userLoading } = useUser();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userLoading && !user?.is_admin) {
      window.location.href = "/";
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/purchases");
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesFilter = filter === "all" || purchase.status === filter;
    const matchesSearch =
      !searchTerm ||
      purchase.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: purchases.length,
    completed: purchases.filter((p) => p.status === "completed").length,
    refunded: purchases.filter((p) => p.status === "refunded").length,
    revenue: purchases
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.price || 0), 0),
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Purchase Management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all service purchases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">
              Total Purchases
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Completed</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {stats.completed}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Refunded</div>
            <div className="mt-2 text-3xl font-bold text-red-600">
              {stats.refunded}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">
              Total Revenue
            </div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              ${stats.revenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              {["all", "completed", "refunded", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-[#D4A5A5] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search by service or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A5A5]"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {purchase.service_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {purchase.service_id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {purchase.customer_email || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${purchase.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : purchase.status === "refunded"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {purchase.receipt_verified ? (
                        <span className="text-green-600 text-sm">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(purchase.purchased_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No purchases found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
