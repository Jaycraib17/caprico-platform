"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ExternalLink,
  Bookmark,
  Star,
  ArrowLeft,
  Briefcase,
  Globe,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const JOB_STATUS_COLORS = {
  w2: { bg: "#DCFCE7", text: "#166534", label: "W2 Employee" },
  contractor: { bg: "#FEF3C7", text: "#92400E", label: "Contractor/1099" },
  "w2-contractor": { bg: "#EDE9FE", text: "#5B21B6", label: "W2 & Contractor" },
};

export default function CompanyDetailPage({ params }) {
  const { data: user } = useUser();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [similarCompanies, setSimilarCompanies] = useState([]);

  useEffect(() => {
    fetchCompany();
  }, [params.slug]);

  useEffect(() => {
    if (company && user) {
      checkIfSaved();
      if (company.tags && company.tags.length > 0) fetchSimilarCompanies();
    }
  }, [company, user]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${params.slug}`);
      if (!response.ok) throw new Error("Company not found");
      const data = await response.json();
      setCompany(data.company);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await fetch("/api/saved-companies");
      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved_companies.some((sc) => sc.id === company.id));
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const fetchSimilarCompanies = async () => {
    try {
      const tag = company.tags[0];
      const response = await fetch(`/api/companies?tag=${tag}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        setSimilarCompanies(
          data.companies.filter((c) => c.id !== company.id).slice(0, 3),
        );
      }
    } catch (error) {
      console.error("Error fetching similar companies:", error);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      if (typeof window !== "undefined")
        window.location.href = "/account/signin";
      return;
    }
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-companies/${company.id}`, {
          method: "DELETE",
        });
        if (res.ok) setIsSaved(false);
      } else {
        const res = await fetch("/api/saved-companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: company.id }),
        });
        if (res.ok) setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <div className="text-center">
          <div
            className="inline-block h-9 w-9 rounded-full border-4 border-solid border-r-transparent"
            style={{ borderColor: "#FF2D75", borderRightColor: "transparent" }}
          />
          <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>
            Loading company…
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FFF5F8" }}
      >
        <div
          className="text-center bg-white rounded-2xl border p-10 shadow-sm"
          style={{ borderColor: "#FAD6E5" }}
        >
          <Building2
            className="w-14 h-14 mx-auto mb-4"
            style={{ color: "#FAD6E5" }}
          />
          <h3 className="text-xl font-bold mb-3" style={{ color: "#1A1028" }}>
            Company not found
          </h3>
          <a
            href="/companies"
            className="text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "#FF2D75" }}
          >
            Back to Companies
          </a>
        </div>
      </div>
    );
  }

  const statusStyle = JOB_STATUS_COLORS[company.job_status];

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Navigation />

        {/* Company hero header */}
        <div className="bg-white border-b" style={{ borderColor: "#FAD6E5" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
            <a
              href="/companies"
              className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-80 transition-opacity"
              style={{ color: "#FF2D75" }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Companies
            </a>

            <div className="flex items-start gap-5 md:gap-6">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#FFF5F8" }}
              >
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <Building2
                    className="w-10 h-10 md:w-12 md:h-12"
                    style={{ color: "#6A0DAD" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: "#1A1028" }}
                  >
                    {company.name}
                  </h1>
                  {company.is_featured && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                {company.description && (
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "#6B7280" }}
                  >
                    {company.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={toggleSave}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                    style={
                      isSaved
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
                      className={`w-4 h-4 ${isSaved ? "fill-[#FF2D75]" : ""}`}
                    />
                    {isSaved ? "Saved" : "Save Company"}
                  </button>
                  {(company.career_website || company.website) && (
                    <a
                      href={company.career_website || company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white rounded-full hover:opacity-90 transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                      }}
                    >
                      <ExternalLink className="w-4 h-4" /> Visit Career Website
                    </a>
                  )}
                  {company.website &&
                    company.website !== company.career_website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border hover:bg-[#FFF5F8] transition-colors"
                        style={{ color: "#6A0DAD", borderColor: "#EDE9FE" }}
                      >
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main */}
            <div className="md:col-span-2 space-y-5">
              {company.job_types && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h2
                    className="font-bold text-lg mb-3"
                    style={{ color: "#1A1028" }}
                  >
                    Job Types
                  </h2>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "#374151" }}
                  >
                    {company.job_types}
                  </p>
                </div>
              )}
              {company.job_count > 0 && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className="font-bold text-lg"
                      style={{ color: "#1A1028" }}
                    >
                      Current Openings
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: "#FFE6F0", color: "#FF2D75" }}
                    >
                      {company.job_count} active{" "}
                      {company.job_count === 1 ? "job" : "jobs"}
                    </span>
                  </div>
                  <a
                    href={`/?search=${encodeURIComponent(company.name)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-full hover:opacity-90 transition-opacity"
                    style={{
                      background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                    }}
                  >
                    <Briefcase className="w-4 h-4" /> View Open Positions
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {statusStyle && (
                <div
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#9CA3AF" }}
                  >
                    Employment Type
                  </h3>
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
              )}
              {company.tags && company.tags.length > 0 && (
                <div
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#9CA3AF" }}
                  >
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag) => (
                      <a
                        key={tag}
                        href={`/companies?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: "#FFF5F8", color: "#6A0DAD" }}
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {company.remote_policy && (
                <div
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#9CA3AF" }}
                  >
                    Remote Policy
                  </h3>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1A1028" }}
                  >
                    {company.remote_policy}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Similar Companies */}
          {similarCompanies.length > 0 && (
            <div className="mt-10">
              <h2
                className="text-xl font-bold mb-5"
                style={{ color: "#1A1028" }}
              >
                Similar Companies
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {similarCompanies.map((similar) => {
                  const simStatus = JOB_STATUS_COLORS[similar.job_status];
                  return (
                    <a
                      key={similar.id}
                      href={`/companies/${similar.slug}`}
                      className="bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow block"
                      style={{ borderColor: "#FAD6E5" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#FFF5F8" }}
                        >
                          {similar.logo_url ? (
                            <img
                              src={similar.logo_url}
                              alt={similar.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <Building2
                              className="w-5 h-5"
                              style={{ color: "#6A0DAD" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-sm truncate"
                            style={{ color: "#1A1028" }}
                          >
                            {similar.name}
                          </h3>
                          {similar.tags && similar.tags.length > 0 && (
                            <p
                              className="text-xs truncate"
                              style={{ color: "#9CA3AF" }}
                            >
                              {similar.tags.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      {simStatus && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: simStatus.bg,
                            color: simStatus.text,
                          }}
                        >
                          {simStatus.label}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
