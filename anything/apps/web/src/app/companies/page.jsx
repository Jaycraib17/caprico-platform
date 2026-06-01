"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  ExternalLink,
  Bookmark,
  Star,
  X,
  Filter,
  Briefcase,
  Globe,
  MapPin,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const FILTER_TAGS = [
  "CSR",
  "Tech Support",
  "Transcription",
  "Tutoring",
  "Marketing",
  "Data",
  "Medical",
  "VA",
  "Software",
  "HR",
];
const JOB_STATUS_COLORS = {
  w2: { bg: "#DCFCE7", text: "#166534", label: "W2" },
  contractor: { bg: "#FEF3C7", text: "#92400E", label: "Contractor" },
  "w2-contractor": { bg: "#EDE9FE", text: "#5B21B6", label: "W2 & Contractor" },
};

export default function CompaniesPage() {
  const { data: user } = useUser();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedJobStatus, setSelectedJobStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedCompanyIds, setSavedCompanyIds] = useState(new Set());

  const LIMIT = 50;

  useEffect(() => {
    setCompanies([]);
    setOffset(0);
    setHasMore(false);
    fetchCompanies(0, true);
    if (user) fetchSavedCompanies();
  }, [searchTerm, selectedTag, selectedJobStatus, user]);

  const fetchCompanies = async (currentOffset = 0, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTag) params.append("tag", selectedTag);
      if (selectedJobStatus) params.append("job_status", selectedJobStatus);
      params.append("limit", String(LIMIT));
      params.append("offset", String(currentOffset));
      const response = await fetch(`/api/companies?${params}`);
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      const newCompanies = data.companies || [];
      setCompanies((prev) =>
        reset ? newCompanies : [...prev, ...newCompanies],
      );
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
      setOffset(currentOffset + newCompanies.length);
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (reset) setCompanies([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    fetchCompanies(offset, false);
  };

  const fetchSavedCompanies = async () => {
    try {
      const response = await fetch("/api/saved-companies");
      if (response.ok) {
        const data = await response.json();
        setSavedCompanyIds(new Set(data.saved_companies.map((sc) => sc.id)));
      }
    } catch (error) {
      console.error("Error fetching saved companies:", error);
    }
  };

  const toggleSaveCompany = async (companyId) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }
    const isSaved = savedCompanyIds.has(companyId);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-companies/${companyId}`, {
          method: "DELETE",
        });
        if (res.ok)
          setSavedCompanyIds((prev) => {
            const s = new Set(prev);
            s.delete(companyId);
            return s;
          });
      } else {
        const res = await fetch("/api/saved-companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: companyId }),
        });
        if (res.ok) setSavedCompanyIds((prev) => new Set([...prev, companyId]));
      }
    } catch (error) {
      console.error("Error toggling saved company:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setSelectedJobStatus("");
  };
  const hasActiveFilters = searchTerm || selectedTag || selectedJobStatus;

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Navigation />

        {/* ── HERO ─────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Remote Companies
            </h2>
            <p className="text-lg mb-8" style={{ color: "#FECDE0" }}>
              Browse companies that regularly hire remote workers worldwide
            </p>

            {/* Search bar */}
            <div
              className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-lg border max-w-3xl"
              style={{ borderColor: "#FAD6E5" }}
            >
              <div className="flex items-center flex-1 gap-2 px-2">
                <Search
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "#FF2D75" }}
                />
                <input
                  type="text"
                  placeholder="Search companies by name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 py-3 text-base outline-none bg-transparent"
                  style={{ color: "#1A1028" }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTERS ──────────────────────────────────────── */}
        {showFilters && (
          <div className="bg-white border-b" style={{ borderColor: "#FAD6E5" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-semibold text-lg"
                  style={{ color: "#1A1028" }}
                >
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium flex items-center gap-1 hover:opacity-80"
                    style={{ color: "#FF2D75" }}
                  >
                    <X className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>

              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#1A1028" }}
                >
                  Job Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {FILTER_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTag(selectedTag === tag ? "" : tag)
                      }
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={
                        selectedTag === tag
                          ? {
                              background:
                                "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                              color: "#FFFFFF",
                            }
                          : { backgroundColor: "#F3F4F6", color: "#374151" }
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#1A1028" }}
                >
                  Employment Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "w2", label: "W2" },
                    { value: "contractor", label: "Contractor" },
                    { value: "w2-contractor", label: "W2 & Contractor" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSelectedJobStatus(
                          selectedJobStatus === value ? "" : value,
                        )
                      }
                      className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
                      style={
                        selectedJobStatus === value
                          ? {
                              background:
                                "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                              color: "#FFFFFF",
                              borderColor: "transparent",
                            }
                          : {
                              backgroundColor: "transparent",
                              color: "#374151",
                              borderColor: "#E5E7EB",
                            }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPANIES LIST ────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border p-6 animate-pulse"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
                      <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-2xl border p-8"
              style={{ borderColor: "#FAD6E5" }}
            >
              <Building2
                className="w-14 h-14 mx-auto mb-4"
                style={{ color: "#FAD6E5" }}
              />
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "#1A1028" }}
              >
                No companies found
              </h3>
              <p className="mb-6 text-sm" style={{ color: "#6B7280" }}>
                Try adjusting your filters or search terms
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 font-bold text-white rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                Showing{" "}
                <span className="font-semibold" style={{ color: "#1A1028" }}>
                  {companies.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold" style={{ color: "#1A1028" }}>
                  {total}
                </span>{" "}
                compan{total !== 1 ? "ies" : "y"}
              </p>
              {companies.map((company) => {
                const statusStyle = JOB_STATUS_COLORS[company.job_status];
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl border p-5 md:p-6 hover:shadow-md transition-shadow"
                    style={{ borderColor: "#FAD6E5" }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Logo */}
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#FFF5F8" }}
                        >
                          {company.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <Building2
                              className="w-7 h-7"
                              style={{ color: "#6A0DAD" }}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3
                              className="text-lg font-bold truncate"
                              style={{ color: "#1A1028" }}
                            >
                              {company.name}
                            </h3>
                            {company.is_featured && (
                              <Star className="w-4 h-4 flex-shrink-0 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          {company.job_types && (
                            <p
                              className="text-sm mb-3 line-clamp-1"
                              style={{ color: "#6B7280" }}
                            >
                              {company.job_types}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            {statusStyle && (
                              <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.text,
                                }}
                              >
                                {statusStyle.label}
                              </span>
                            )}
                            {/* Region badge — shown for CSV-imported companies */}
                            {company.region && (
                              <span
                                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: "#EDE9FE",
                                  color: "#5B21B6",
                                }}
                              >
                                <MapPin className="w-3 h-3" />
                                {company.region}
                              </span>
                            )}
                            {company.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: "#F3F4F6",
                                  color: "#374151",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {company.job_count > 0 && (
                              <span
                                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: "#FFE6F0",
                                  color: "#FF2D75",
                                }}
                              >
                                <Briefcase className="w-3.5 h-3.5" />
                                {company.job_count} open{" "}
                                {company.job_count === 1 ? "job" : "jobs"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleSaveCompany(company.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                          style={
                            savedCompanyIds.has(company.id)
                              ? {
                                  backgroundColor: "#FFE6F0",
                                  color: "#FF2D75",
                                  borderColor: "#FF2D75",
                                }
                              : {
                                  backgroundColor: "#F9FAFB",
                                  color: "#6B7280",
                                  borderColor: "#E5E7EB",
                                }
                          }
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${savedCompanyIds.has(company.id) ? "fill-[#FF2D75]" : ""}`}
                          />
                          {savedCompanyIds.has(company.id) ? "Saved" : "Save"}
                        </button>
                        <a
                          href={`/companies/${company.slug}`}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all hover:bg-[#FFF5F8]"
                          style={{ color: "#6A0DAD", borderColor: "#EDE9FE" }}
                        >
                          View Company
                        </a>
                        {(company.career_website || company.website) && (
                          <a
                            href={company.career_website || company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
                            style={{
                              background:
                                "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                            }}
                          >
                            Careers <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load More */}
              {hasMore && (
                <div className="text-center pt-4 pb-2">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 font-bold text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                    }}
                  >
                    {loadingMore
                      ? "Loading…"
                      : `Load More (${total - companies.length} remaining)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
