"use client";

import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Crown,
  Upload,
  X,
  FileText,
} from "lucide-react";

const SERVICES = [
  {
    name: "Resume Review",
    price: "$5.99",
    desc: "Expert human review with detailed feedback on your remote-ready resume.",
    href: "/contact?service=resume-review",
    highlight: false,
  },
  {
    name: "Tailored Resume Rewrite",
    price: "$9.99",
    desc: "Full rewrite of your resume tailored to a specific remote role.",
    href: "/contact?service=tailored-resume",
    highlight: false,
  },
  {
    name: "Resume + Cover Letter Bundle",
    price: "$19.99",
    desc: "Complete application package: resume rewrite plus a custom cover letter.",
    href: "/contact?service=resume-bundle",
    highlight: true,
  },
];

function ScoreBadge({ score }) {
  const color = score >= 70 ? "#22c55e" : score >= 45 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 70
      ? "Strong match"
      : score >= 45
        ? "Decent match — room to improve"
        : "Low match — significant tailoring needed";
  return (
    <div className="text-center">
      <div
        className="w-32 h-32 rounded-full border-[6px] flex flex-col items-center justify-center mx-auto mb-3"
        style={{ borderColor: color }}
      >
        <span className="text-4xl font-bold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-gray-400 mt-1">/ 100</span>
      </div>
      <p className="text-sm font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

// Determine border + bg for a field based on touched/valid state
function fieldStyle(touched, isValid) {
  if (!touched) return { borderColor: "#FAD6E5", backgroundColor: "#fff" };
  if (isValid) return { borderColor: "#22c55e", backgroundColor: "#f0fdf4" };
  return { borderColor: "#ef4444", backgroundColor: "#fef2f2" };
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p
      className="text-xs mt-1.5 flex items-center gap-1"
      style={{ color: "#ef4444" }}
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

function FieldOk({ show, msg }) {
  if (!show) return null;
  return (
    <p
      className="text-xs mt-1.5 flex items-center gap-1"
      style={{ color: "#16a34a" }}
    >
      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

const inputBase =
  "w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all";
const focusBorderColor = "#FF2D75";
const focusShadow = "0 0 0 3px rgba(255,45,117,0.1)";

export default function ResumeHelperPage() {
  const [form, setForm] = useState({
    jobTitle: "",
    jobDescription: "",
    resume: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [results, setResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // File object
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setTouched((t) => ({ ...t, [k]: true }));
  };

  const markTouched = (k) => setTouched((t) => ({ ...t, [k]: true }));

  // Field validity
  const valid = {
    jobTitle: form.jobTitle.trim().length >= 3,
    jobDescription: form.jobDescription.trim().length >= 50,
    resume: form.resume.trim().length >= 100 || !!uploadedFile,
  };

  const validate = () => {
    const e = {};
    if (!valid.jobTitle)
      e.jobTitle = "Job title must be at least 3 characters.";
    if (!valid.jobDescription)
      e.jobDescription = "Please enter at least 50 characters.";
    if (!valid.resume)
      e.resume = "Please enter at least 100 characters or upload a file.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const allowedExt = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowed.includes(file.type) && !allowedExt) {
      setUploadError("Only PDF, DOC, and DOCX files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setUploadedFile(file);
    setErrors((e) => ({ ...e, resume: "" }));
    setTouched((t) => ({ ...t, resume: true }));
    // Clear any pasted resume since we have a file now
    setForm((f) => ({ ...f, resume: "" }));
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setTouched({ jobTitle: true, jobDescription: true, resume: true });
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    setResults(null); // Always clear before new analysis

    try {
      let res;
      if (uploadedFile) {
        const fd = new FormData();
        fd.append("jobTitle", form.jobTitle);
        fd.append("jobDescription", form.jobDescription);
        fd.append("resumeFile", uploadedFile);
        res = await fetch("/api/ai/resume-helper", {
          method: "POST",
          headers: { "Cache-Control": "no-store", Pragma: "no-cache" },
          body: fd,
        });
      } else {
        res = await fetch("/api/ai/resume-helper", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            Pragma: "no-cache",
          },
          // _ts busts any edge-level cache on identical payloads
          body: JSON.stringify({ ...form, _ts: Date.now() }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResults(data);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          document
            .getElementById("results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Navigation />

        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-5"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              <Sparkles className="w-4 h-4" /> AI Resume Helper
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Get Your Resume Ready
              <br className="hidden md:block" /> for Remote Jobs
            </h1>
            <p
              className="text-lg mb-2 max-w-xl mx-auto"
              style={{ color: "#FECDE0" }}
            >
              Paste your resume and target job. Our AI gives you instant,
              actionable feedback in seconds.
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Free to use · No account required to analyse
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Form */}
          <div
            className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm mb-6"
            style={{ borderColor: "#FAD6E5" }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1A1028" }}>
              Analyse Your Resume
            </h2>

            {/* Job Title */}
            <div className="mb-5">
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1028" }}
              >
                Job Title <span style={{ color: "#FF2D75" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Product Designer"
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                onBlur={() => markTouched("jobTitle")}
                className={inputBase}
                style={fieldStyle(touched.jobTitle, valid.jobTitle)}
                onFocus={(e) => {
                  e.target.style.borderColor = focusBorderColor;
                  e.target.style.boxShadow = focusShadow;
                }}
                onBlurCapture={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              {touched.jobTitle && valid.jobTitle ? (
                <FieldOk show msg="Looks good ✔" />
              ) : (
                <FieldError
                  msg={
                    touched.jobTitle && !valid.jobTitle
                      ? errors.jobTitle ||
                        "Job title must be at least 3 characters."
                      : ""
                  }
                />
              )}
            </div>

            {/* Job Description */}
            <div className="mb-5">
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1028" }}
              >
                Job Description <span style={{ color: "#FF2D75" }}>*</span>
              </label>
              <p className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
                Paste the full job description (min. 50 characters)
              </p>
              <textarea
                rows={6}
                placeholder="Paste the job description here…"
                value={form.jobDescription}
                onChange={(e) => set("jobDescription", e.target.value)}
                onBlur={() => markTouched("jobDescription")}
                className={inputBase + " resize-none"}
                style={fieldStyle(touched.jobDescription, valid.jobDescription)}
                onFocus={(e) => {
                  e.target.style.borderColor = focusBorderColor;
                  e.target.style.boxShadow = focusShadow;
                }}
                onBlurCapture={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              <div className="flex items-start justify-between mt-1">
                {touched.jobDescription && valid.jobDescription ? (
                  <FieldOk show msg="Looks good ✔" />
                ) : (
                  <FieldError
                    msg={
                      touched.jobDescription && !valid.jobDescription
                        ? errors.jobDescription ||
                          "Please enter at least 50 characters."
                        : ""
                    }
                  />
                )}
                <span
                  className="text-xs ml-auto pl-2 flex-shrink-0"
                  style={{
                    color:
                      form.jobDescription.length < 50 ? "#f59e0b" : "#9CA3AF",
                  }}
                >
                  {form.jobDescription.length} / 50+
                </span>
              </div>
            </div>

            {/* Resume — Upload OR Paste */}
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1028" }}
              >
                Your Current Resume <span style={{ color: "#FF2D75" }}>*</span>
              </label>

              {/* File Upload Zone */}
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed rounded-xl p-5 mb-3 text-center cursor-pointer hover:bg-pink-50 transition-colors"
                  style={{ borderColor: "#FAD6E5" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) {
                      fileInputRef.current.files = e.dataTransfer.files;
                      handleFileChange({
                        target: { files: e.dataTransfer.files },
                      });
                    }
                  }}
                >
                  <Upload
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: "#FF2D75" }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#1A1028" }}
                  >
                    Upload PDF, DOC, or DOCX
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    Drag & drop or click to browse · Max 5 MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-3"
                  style={{ borderColor: "#22c55e", backgroundColor: "#f0fdf4" }}
                >
                  <FileText
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#16a34a" }}
                  />
                  <span
                    className="text-sm font-medium flex-1 truncate"
                    style={{ color: "#16a34a" }}
                  >
                    {uploadedFile.name}
                  </span>
                  <button
                    onClick={removeFile}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" style={{ color: "#6B7280" }} />
                  </button>
                </div>
              )}

              {uploadError && (
                <p
                  className="text-xs mb-2 flex items-center gap-1"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                </p>
              )}

              {/* Divider */}
              {!uploadedFile && (
                <div className="flex items-center gap-3 my-3">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#FAD6E5" }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#9CA3AF" }}
                  >
                    or paste your resume below
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "#FAD6E5" }}
                  />
                </div>
              )}

              {!uploadedFile && (
                <>
                  <p className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
                    Min. 100 characters
                  </p>
                  <textarea
                    rows={10}
                    placeholder="Paste your resume text here…"
                    value={form.resume}
                    onChange={(e) => set("resume", e.target.value)}
                    onBlur={() => markTouched("resume")}
                    className={inputBase + " resize-none"}
                    style={fieldStyle(touched.resume, valid.resume)}
                    onFocus={(e) => {
                      e.target.style.borderColor = focusBorderColor;
                      e.target.style.boxShadow = focusShadow;
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div className="flex items-start justify-between mt-1">
                    {touched.resume && valid.resume ? (
                      <FieldOk show msg="Looks good ✔" />
                    ) : (
                      <FieldError
                        msg={
                          touched.resume && !valid.resume
                            ? errors.resume ||
                              "Please enter at least 100 characters."
                            : ""
                        }
                      />
                    )}
                    <span
                      className="text-xs ml-auto pl-2 flex-shrink-0"
                      style={{
                        color: form.resume.length < 100 ? "#f59e0b" : "#9CA3AF",
                      }}
                    >
                      {form.resume.length} / 100+
                    </span>
                  </div>
                </>
              )}

              {/* Show "Looks good" for file upload */}
              {uploadedFile && touched.resume && (
                <FieldOk show msg="File ready to analyse ✔" />
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div
                className="mb-5 px-4 py-3 rounded-xl border flex items-start gap-2 text-sm"
                style={{
                  backgroundColor: "#FFF5F8",
                  borderColor: "#FAD6E5",
                  color: "#ef4444",
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {apiError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 font-bold text-white rounded-full text-base hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-r-transparent rounded-full rh-spin" />
                  Analysing your resume…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Analyse Resume
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div id="results" className="space-y-5 mb-6">
              {/* Match Score */}
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm text-center"
                style={{ borderColor: "#FAD6E5" }}
              >
                <h3
                  className="text-base font-bold mb-5"
                  style={{ color: "#1A1028" }}
                >
                  Match Score
                </h3>
                <ScoreBadge score={results.matchScore} />
              </div>

              {/* Missing Keywords */}
              {results.missingKeywords?.length > 0 && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ color: "#1A1028" }}
                  >
                    Missing Keywords
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                    Add these to your resume to improve ATS ranking:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#FFE6F0", color: "#FF2D75" }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved Summary */}
              {results.improvedSummary && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-base font-bold mb-3"
                    style={{ color: "#1A1028" }}
                  >
                    Improved Professional Summary
                  </h3>
                  <p
                    className="text-sm leading-relaxed px-4 py-4 rounded-xl"
                    style={{ color: "#374151", backgroundColor: "#FFF5F8" }}
                  >
                    {results.improvedSummary}
                  </p>
                </div>
              )}

              {/* Improved Bullet Points */}
              {results.improvedBulletPoints?.length > 0 && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-base font-bold mb-4"
                    style={{ color: "#1A1028" }}
                  >
                    Improved Resume Bullet Points
                  </h3>
                  <ul className="space-y-3">
                    {results.improvedBulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: "#FF2D75" }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#374151" }}
                        >
                          {bp}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations?.length > 0 && (
                <div
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-base font-bold mb-4"
                    style={{ color: "#1A1028" }}
                  >
                    Quick Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#374151" }}
                        >
                          {rec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sign-up nudge */}
              <div
                className="rounded-xl px-5 py-4 border flex items-start gap-3"
                style={{ backgroundColor: "#FFF5F8", borderColor: "#FAD6E5" }}
              >
                <Sparkles
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#FF2D75" }}
                />
                <p className="text-sm" style={{ color: "#374151" }}>
                  <a
                    href="/account/signup"
                    className="font-bold underline"
                    style={{ color: "#FF2D75" }}
                  >
                    Create a free account
                  </a>{" "}
                  to save your results and download resume templates.
                </p>
              </div>

              {/* Upsell — each card is individually clickable */}
              <div
                className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm"
                style={{ borderColor: "#FAD6E5" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5" style={{ color: "#FF2D75" }} />
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#1A1028" }}
                  >
                    Need More Help?
                  </h3>
                </div>
                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                  Our professional team can take your application to the next
                  level.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {SERVICES.map((svc) => (
                    <a
                      key={svc.name}
                      href={svc.href}
                      className="rounded-2xl border p-5 flex flex-col cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all no-underline"
                      style={{
                        borderColor: svc.highlight ? "#FF2D75" : "#FAD6E5",
                        background: svc.highlight
                          ? "linear-gradient(135deg, #FFF5F8, #F3E8FF)"
                          : "#FAFAFA",
                      }}
                    >
                      {svc.highlight && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 self-start"
                          style={{
                            backgroundColor: "#FFE6F0",
                            color: "#FF2D75",
                          }}
                        >
                          Most Popular
                        </span>
                      )}
                      <h4
                        className="text-sm font-bold mb-1"
                        style={{ color: "#1A1028" }}
                      >
                        {svc.name}
                      </h4>
                      <p
                        className="text-xs mb-3 flex-1 leading-relaxed"
                        style={{ color: "#6B7280" }}
                      >
                        {svc.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: "#FF2D75" }}
                        >
                          {svc.price}
                        </span>
                        <ArrowRight
                          className="w-4 h-4"
                          style={{ color: "#FF2D75" }}
                        />
                      </div>
                    </a>
                  ))}
                </div>

                <a
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 font-bold text-white rounded-full hover:shadow-xl hover:scale-[1.01] transition-all"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  Start Resume Help Request <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        @keyframes rh-spin { to { transform: rotate(360deg); } }
        .rh-spin { animation: rh-spin 0.75s linear infinite; }
      `}</style>
    </>
  );
}
