"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  X,
  Building2,
  Shield,
  Zap,
  Heart,
  Menu,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import useUser from "@/utils/useUser";
import Footer from "@/components/Footer";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

const categories = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer Support",
  "Data Science",
  "Operations",
  "HR",
  "Finance",
];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Executive",
];
const employmentTypes = ["Full-Time", "Part-Time", "Contract", "Freelance"];

const GradientBtn = ({ href, children, className = "" }) => (
  <a
    href={href}
    className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all ${className}`}
    style={{ background: "linear-gradient(135deg, #FF2D75, #6A0DAD)" }}
  >
    {children}
  </a>
);

export default function HomePage() {
  const { data: user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedEmployment, setSelectedEmployment] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [brokenLogos, setBrokenLogos] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    if (user) fetchSavedJobs();
  }, [
    searchTerm,
    selectedCategory,
    selectedExperience,
    selectedEmployment,
    user,
  ]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedExperience)
        params.append("experience_level", selectedExperience);
      if (selectedEmployment)
        params.append("employment_type", selectedEmployment);
      params.append("limit", "50");
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch("/api/saved-jobs");
      if (response.ok) {
        const data = await response.json();
        setSavedJobIds(new Set(data.saved_jobs.map((sj) => sj.job_id)));
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-jobs/${jobId}`, {
          method: "DELETE",
        });
        if (res.ok)
          setSavedJobIds((prev) => {
            const s = new Set(prev);
            s.delete(jobId);
            return s;
          });
      } else {
        const res = await fetch("/api/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: jobId }),
        });
        if (res.ok) setSavedJobIds((prev) => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error("Error toggling saved job:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedExperience("");
    setSelectedEmployment("");
  };

  const hasActiveFilters =
    searchTerm || selectedCategory || selectedExperience || selectedEmployment;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
        style={{ borderColor: "#FAD6E5" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo — use real brand image */}
            <a href="/" className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="Capri Remote"
                className="w-9 h-9 rounded-xl object-cover"
                style={{ flexShrink: 0 }}
              />
              <span className="text-xl font-bold tracking-tight">
                <span style={{ color: "#6A0DAD" }}>Capri</span>
                <span style={{ color: "#FF2D75" }}> Remote</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {[
                { href: "/companies", label: "Companies" },
                { href: "/tracker", label: "Tracker" },
                { href: "/resume-tools", label: "Resume Tools" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-[#FF2D75]"
                  style={{ color: "#1A1028" }}
                >
                  {link.label}
                </a>
              ))}
              {user && (
                <a
                  href="/saved"
                  className="text-sm font-medium transition-colors hover:text-[#FF2D75]"
                  style={{ color: "#1A1028" }}
                >
                  Saved Jobs
                </a>
              )}
              {user?.is_admin && (
                <a
                  href="/admin"
                  className="text-sm font-medium"
                  style={{ color: "#6A0DAD" }}
                >
                  Admin
                </a>
              )}
            </nav>

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <a
                  href="/account/logout"
                  className="px-4 py-2 text-sm font-medium rounded-full border transition-colors hover:bg-[#FFF5F8]"
                  style={{ color: "#1A1028", borderColor: "#FAD6E5" }}
                >
                  Sign Out
                </a>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="text-sm font-medium hover:text-[#FF2D75] transition-colors"
                    style={{ color: "#1A1028" }}
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="px-5 py-2 text-sm font-bold text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                    }}
                  >
                    Sign Up Free
                  </a>
                </>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:text-[#FF2D75] transition-colors"
              style={{ color: "#1A1028" }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {showMobileMenu && (
            <div
              className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-2"
              style={{ borderColor: "#FAD6E5" }}
            >
              {["/companies", "/tracker", "/resume-tools"].map((href) => (
                <a
                  key={href}
                  href={href}
                  className="block py-2 text-sm font-medium hover:text-[#FF2D75] transition-colors capitalize"
                  style={{ color: "#1A1028" }}
                >
                  {href.replace("/", "").replace("-", " ")}
                </a>
              ))}
              {user && (
                <a
                  href="/saved"
                  className="block py-2 text-sm font-medium"
                  style={{ color: "#1A1028" }}
                >
                  Saved Jobs
                </a>
              )}
              <div
                className="pt-3 border-t space-y-2"
                style={{ borderColor: "#FAD6E5" }}
              >
                {user ? (
                  <a
                    href="/account/logout"
                    className="block text-center px-4 py-2.5 text-sm font-medium rounded-xl border"
                    style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                  >
                    Sign Out
                  </a>
                ) : (
                  <>
                    <a
                      href="/account/signin"
                      className="block text-center py-2 text-sm font-medium"
                      style={{ color: "#1A1028" }}
                    >
                      Sign In
                    </a>
                    <a
                      href="/account/signup"
                      className="block text-center px-4 py-2.5 text-sm font-bold text-white rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                      }}
                    >
                      Sign Up Free
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── AI RESUME BANNER ───────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Tools
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
            Fix your resume for remote jobs
            <br className="hidden md:block" /> in seconds
          </h2>
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: "#FECDE0" }}
          >
            Our AI analyses your resume and gives you instant, actionable
            feedback to land more interviews
          </p>
          <a
            href="/resume-helper"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            style={{ color: "#FF2D75" }}
          >
            Try AI Resume Helper Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <p
            className="mt-4 text-sm"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            No account required ·{" "}
            <a
              href="/resume-tools"
              className="underline font-medium"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Browse all resume tools
            </a>
          </p>
        </div>
      </div>

      {/* ── HERO / SEARCH ──────────────────────────────────── */}
      <div className="bg-white border-b" style={{ borderColor: "#FAD6E5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight"
              style={{ color: "#1A1028" }}
            >
              Find Your Dream{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                Remote Job
              </span>
            </h2>
            <p className="text-lg mb-8" style={{ color: "#6B7280" }}>
              Verified remote opportunities from real companies hiring globally.
              No scams — just quality jobs updated daily.
            </p>

            {/* Search bar */}
            <div
              className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-lg border mb-5"
              style={{ borderColor: "#FAD6E5" }}
            >
              <div className="flex items-center flex-1 gap-2 px-2">
                <Search
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "#FF2D75" }}
                />
                <input
                  type="text"
                  placeholder="Search by title, company, or keywords…"
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
                Filters{" "}
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white inline-block" />
                )}
              </button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/companies"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm border-2 transition-all hover:bg-[#FFF5F8]"
                style={{ color: "#6A0DAD", borderColor: "#6A0DAD" }}
              >
                <Building2 className="w-4 h-4" /> Browse Companies
              </a>
              <a
                href="/tracker"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm border-2 transition-all hover:bg-[#FFF5F8]"
                style={{ color: "#FF2D75", borderColor: "#FF2D75" }}
              >
                <TrendingUp className="w-4 h-4" /> Track Applications
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY CAPRI ──────────────────────────────────────── */}
      <div className="bg-white border-b" style={{ borderColor: "#FAD6E5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h3
              className="text-2xl md:text-3xl font-bold mb-3 tracking-tight"
              style={{ color: "#1A1028" }}
            >
              Why Capri Remote?
            </h3>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "#6B7280" }}
            >
              We're not just another job board — we're your partner in finding
              legitimate remote work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                icon: Shield,
                title: "Verified & Vetted",
                desc: "Every job is manually reviewed. No scams, no fake postings, no MLM. Only real remote positions from legitimate companies.",
              },
              {
                icon: Zap,
                title: "Fresh Daily Updates",
                desc: "New opportunities added every single day. Be the first to apply and increase your chances of landing an interview.",
              },
              {
                icon: Heart,
                title: "Smart Job Alerts",
                desc: "Save jobs and get instant email alerts when new positions match your preferences. Never miss an opportunity.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#FFF5F8" }}
                >
                  <Icon className="w-8 h-8" style={{ color: "#FF2D75" }} />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#1A1028" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6B7280" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div
            className="rounded-2xl p-8 md:p-10 grid md:grid-cols-3 gap-6"
            style={{ background: "linear-gradient(135deg, #FFF5F8, #F3E8FF)" }}
          >
            {[
              {
                title: "100% Remote",
                desc: "All jobs are fully remote or remote-first positions",
              },
              {
                title: "Global Opportunities",
                desc: "Find jobs hiring from anywhere in the world",
              },
              {
                title: "Career Tools Included",
                desc: "Resume builder, application tracker, and more",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#FF2D75" }}
                />
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1A1028" }}
                  >
                    {title}
                  </h4>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTERS PANEL ──────────────────────────────────── */}
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
                  className="text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: "#FF2D75" }}
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Category",
                  value: selectedCategory,
                  setter: setSelectedCategory,
                  options: categories,
                },
                {
                  label: "Experience Level",
                  value: selectedExperience,
                  setter: setSelectedExperience,
                  options: experienceLevels,
                },
                {
                  label: "Employment Type",
                  value: selectedEmployment,
                  setter: setSelectedEmployment,
                  options: employmentTypes,
                },
              ].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1A1028" }}
                  >
                    {label}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none transition-all"
                    style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FF2D75";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(255,45,117,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#FAD6E5";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">All {label}s</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── JOBS LIST ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {loading ? (
          <div className="text-center py-16">
            <div
              className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-solid border-r-transparent"
              style={{
                borderColor: "#FF2D75",
                borderRightColor: "transparent",
              }}
            />
            <p className="mt-4 text-sm" style={{ color: "#6B7280" }}>
              Loading jobs…
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div
            className="text-center py-16 bg-white rounded-2xl shadow-sm p-8 border"
            style={{ borderColor: "#FAD6E5" }}
          >
            <Briefcase
              className="w-14 h-14 mx-auto mb-4"
              style={{ color: "#FAD6E5" }}
            />
            <h3 className="text-xl font-bold mb-2" style={{ color: "#1A1028" }}>
              No jobs found
            </h3>
            <p className="mb-6 text-sm" style={{ color: "#6B7280" }}>
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 font-bold text-white rounded-full"
              style={{
                background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Showing{" "}
                <span className="font-semibold" style={{ color: "#1A1028" }}>
                  {jobs.length}
                </span>{" "}
                job{jobs.length !== 1 ? "s" : ""}
              </p>
              {!user && (
                <a
                  href="/account/signup"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  Sign Up to Save Jobs <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>

            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border p-5 md:p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: "#FAD6E5" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Company logo with proper error fallback */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#FFF5F8" }}
                      >
                        {job.company_logo && !brokenLogos.has(job.id) ? (
                          <img
                            src={job.company_logo}
                            alt={job.company_name}
                            className="w-12 h-12 rounded-xl object-cover"
                            onError={() =>
                              setBrokenLogos(
                                (prev) => new Set([...prev, job.id]),
                              )
                            }
                          />
                        ) : (
                          <Building2
                            className="w-6 h-6"
                            style={{ color: "#6A0DAD" }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Remote badge */}
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2"
                          style={{
                            backgroundColor: "#FFE6F0",
                            color: "#FF2D75",
                          }}
                        >
                          🌍 Remote
                        </span>
                        <h3
                          className="text-lg md:text-xl font-bold mb-0.5"
                          style={{ color: "#1A1028" }}
                        >
                          {job.title}
                        </h3>
                        <p
                          className="text-sm mb-3"
                          style={{ color: "#6B7280" }}
                        >
                          {job.company_name}
                        </p>
                        <div
                          className="flex flex-wrap items-center gap-2 text-sm"
                          style={{ color: "#6B7280" }}
                        >
                          <span className="flex items-center gap-1">
                            <Briefcase
                              className="w-3.5 h-3.5"
                              style={{ color: "#6A0DAD" }}
                            />
                            {job.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin
                              className="w-3.5 h-3.5"
                              style={{ color: "#6A0DAD" }}
                            />
                            {job.remote_policy || "Remote"}
                          </span>
                          {job.salary_min && job.salary_max && (
                            <span
                              className="flex items-center gap-1 font-semibold"
                              style={{ color: "#FF2D75" }}
                            >
                              <DollarSign className="w-3.5 h-3.5" />$
                              {job.salary_min.toLocaleString()} – $
                              {job.salary_max.toLocaleString()}
                            </span>
                          )}
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: "#FFF5F8",
                              color: "#6A0DAD",
                            }}
                          >
                            {job.employment_type}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: "#F3F4F6",
                              color: "#6B7280",
                            }}
                          >
                            {job.experience_level}
                          </span>
                        </div>
                        {job.description && (
                          <p
                            className="mt-3 text-sm leading-relaxed line-clamp-2"
                            style={{ color: "#6B7280" }}
                          >
                            {job.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                      style={
                        savedJobIds.has(job.id)
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
                      <Heart
                        className={`w-4 h-4 ${savedJobIds.has(job.id) ? "fill-[#FF2D75]" : ""}`}
                      />
                      {savedJobIds.has(job.id) ? "Saved" : "Save"}
                    </button>
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-initial px-5 py-2.5 text-sm font-bold text-white rounded-xl text-center hover:opacity-90 transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                      }}
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Start Your Remote Career?
          </h2>
          <p
            className="text-lg mb-8 max-w-xl mx-auto"
            style={{ color: "#FECDE0" }}
          >
            Join thousands of professionals who've found their dream remote jobs
            through Capri Remote
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/account/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              style={{ color: "#FF2D75" }}
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/companies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
            >
              <Building2 className="w-5 h-5" /> Explore Companies
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
