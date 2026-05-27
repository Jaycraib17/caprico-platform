"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  ArrowRight,
  BookmarkX,
  Bookmark,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SavedPage() {
  const { data: user, loading: userLoading } = useUser();
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    if (user) {
      fetchAll();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        fetch("/api/saved-jobs"),
        fetch("/api/saved-companies"),
      ]);
      if (jobsRes.ok) {
        const d = await jobsRes.json();
        setSavedJobs(d.saved_jobs || []);
      }
      if (companiesRes.ok) {
        const d = await companiesRes.json();
        setSavedCompanies(d.saved_companies || []);
      }
    } catch (e) {
      console.error("Error fetching saved items:", e);
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const res = await fetch(`/api/saved-jobs/${jobId}`, { method: "DELETE" });
      if (res.ok)
        setSavedJobs((prev) =>
          prev.filter((j) => j.job_id !== jobId && j.id !== jobId),
        );
    } catch (e) {
      console.error(e);
    }
  };

  const unsaveCompany = async (companyId) => {
    try {
      const res = await fetch(`/api/saved-companies/${companyId}`, {
        method: "DELETE",
      });
      if (res.ok)
        setSavedCompanies((prev) =>
          prev.filter((c) => c.company_id !== companyId && c.id !== companyId),
        );
    } catch (e) {
      console.error(e);
    }
  };

  if (!user && !userLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <div
          className="text-center bg-white rounded-3xl p-10 shadow-xl border max-w-sm w-full"
          style={{ borderColor: "#FAD6E5" }}
        >
          <Heart
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#FF2D75" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1028" }}>
            Sign In to See Saved Items
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            Save jobs and companies you love to revisit them here
          </p>
          <a
            href="/account/signin"
            className="inline-block px-8 py-3.5 font-bold text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg, #FF2D75, #6A0DAD)" }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Navigation />
        <div
          style={{
            background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-7 h-7 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Saved Items
              </h1>
            </div>
            <p style={{ color: "#FECDE0" }}>
              Your bookmarked jobs and companies
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 mb-6">
            {[
              { id: "jobs", label: `Jobs (${savedJobs.length})` },
              {
                id: "companies",
                label: `Companies (${savedCompanies.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
                style={
                  activeTab === tab.id
                    ? {
                        background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                        color: "#fff",
                      }
                    : {
                        backgroundColor: "#fff",
                        color: "#6B7280",
                        border: "1px solid #FAD6E5",
                      }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4"
                style={{
                  borderColor: "#FF2D75",
                  borderRightColor: "transparent",
                }}
              />
            </div>
          ) : activeTab === "jobs" ? (
            savedJobs.length === 0 ? (
              <div
                className="text-center py-16 bg-white rounded-2xl border"
                style={{ borderColor: "#FAD6E5" }}
              >
                <Briefcase
                  className="w-14 h-14 mx-auto mb-4"
                  style={{ color: "#FAD6E5" }}
                />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#1A1028" }}
                >
                  No saved jobs yet
                </h3>
                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                  Browse jobs and tap the heart to save them here
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((item) => {
                  const job = item.job || item;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow"
                      style={{ borderColor: "#FAD6E5" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-bold mb-0.5 truncate"
                            style={{ color: "#1A1028" }}
                          >
                            {job.title}
                          </h3>
                          <p
                            className="text-sm mb-2"
                            style={{ color: "#6B7280" }}
                          >
                            {job.company_name}
                          </p>
                          <div
                            className="flex flex-wrap gap-2 text-xs"
                            style={{ color: "#6B7280" }}
                          >
                            {job.category && (
                              <span className="flex items-center gap-1">
                                <Briefcase
                                  className="w-3 h-3"
                                  style={{ color: "#6A0DAD" }}
                                />
                                {job.category}
                              </span>
                            )}
                            {job.employment_type && (
                              <span
                                className="px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                  backgroundColor: "#FFF5F8",
                                  color: "#6A0DAD",
                                }}
                              >
                                {job.employment_type}
                              </span>
                            )}
                            {job.salary_min && job.salary_max && (
                              <span
                                className="flex items-center gap-1 font-semibold"
                                style={{ color: "#FF2D75" }}
                              >
                                <DollarSign className="w-3 h-3" />$
                                {job.salary_min?.toLocaleString()} – $
                                {job.salary_max?.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => unsaveJob(item.job_id || item.id)}
                            className="p-2 rounded-xl transition-colors hover:bg-red-50"
                            style={{ color: "#FF2D75" }}
                            title="Remove"
                          >
                            <BookmarkX className="w-5 h-5" />
                          </button>
                          {job.apply_url && (
                            <a
                              href={job.apply_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-xs font-bold text-white rounded-xl text-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                              }}
                            >
                              Apply
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : savedCompanies.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-2xl border"
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
                No saved companies yet
              </h3>
              <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                Browse companies and bookmark ones you're interested in
              </p>
              <a
                href="/companies"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                Browse Companies <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {savedCompanies.map((item) => {
                const company = item.company || item;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow"
                    style={{ borderColor: "#FAD6E5" }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#FFF5F8" }}
                        >
                          {company.logo_url ? (
                            <img
                              src={company.logo_url}
                              alt={company.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <Building2
                              className="w-6 h-6"
                              style={{ color: "#6A0DAD" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold truncate"
                            style={{ color: "#1A1028" }}
                          >
                            {company.name}
                          </h3>
                          {company.region && (
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "#6B7280" }}
                            >
                              {company.region}
                            </p>
                          )}
                          {company.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {company.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-full text-xs"
                                  style={{
                                    backgroundColor: "#F3F4F6",
                                    color: "#374151",
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() =>
                            unsaveCompany(item.company_id || item.id)
                          }
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                          style={{ color: "#FF2D75" }}
                          title="Remove"
                        >
                          <BookmarkX className="w-5 h-5" />
                        </button>
                        {company.slug && (
                          <a
                            href={`/companies/${company.slug}`}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl border text-center"
                            style={{ color: "#6A0DAD", borderColor: "#EDE9FE" }}
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
