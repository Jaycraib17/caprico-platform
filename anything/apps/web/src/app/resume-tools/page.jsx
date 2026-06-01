"use client";

import {
  FileText,
  CheckCircle,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const RESUME_TIPS = [
  {
    title: "Optimise for Remote Work",
    tips: [
      "Highlight remote work experience and self-management skills",
      "Emphasise async communication abilities (Slack, email, project management tools)",
      "Show timezone flexibility and cross-cultural collaboration",
      "Include home office setup and reliable internet connectivity",
    ],
  },
  {
    title: "Tailor for Remote Roles",
    tips: [
      "Use keywords from the job description (many companies use ATS systems)",
      "Quantify achievements with metrics and numbers",
      "Lead with impact: 'Increased sales by 40%' not 'Responsible for sales'",
      "Keep it concise: 1–2 pages maximum",
    ],
  },
  {
    title: "Stand Out Remotely",
    tips: [
      "Include a portfolio link or personal website showcasing your work",
      "Add LinkedIn, GitHub, or relevant professional profiles",
      "Mention remote-specific tools you're proficient in (Zoom, Notion, Asana, etc.)",
      "Highlight outcomes over responsibilities",
    ],
  },
];

const TEMPLATES = [
  {
    name: "Modern Remote Professional",
    description:
      "Clean, ATS-friendly template perfect for tech and creative roles",
    premium: false,
  },
  {
    name: "Executive Remote Leader",
    description: "Bold design for senior positions and leadership roles",
    premium: true,
  },
  {
    name: "Minimalist Remote",
    description: "Simple, elegant template that works for any industry",
    premium: true,
  },
];

export default function ResumeToolsPage() {
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-5"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Tools
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Resume Tools for Remote Jobs
            </h1>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: "#FECDE0" }}
            >
              Expert tips, ATS-ready templates, and AI feedback to help you land
              more remote interviews
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/resume-helper"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                style={{ color: "#FF2D75" }}
              >
                <Sparkles className="w-5 h-5" /> Try AI Resume Helper Free
              </a>
              <a
                href="#tips"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                View Expert Tips <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ── AI HELPER CARD ───────────────────────────────── */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-6 shadow-md"
            style={{
              background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                AI Resume Helper
              </h2>
              <p className="text-sm mb-0" style={{ color: "#FECDE0" }}>
                Paste your resume + job description. Get a match score, missing
                keywords, improved bullet points, and recommendations —
                instantly and free.
              </p>
            </div>
            <a
              href="/resume-helper"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex-shrink-0"
              style={{ color: "#FF2D75" }}
            >
              Analyse Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── RESUME TIPS ──────────────────────────────────── */}
          <section id="tips" className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                }}
              >
                <Zap className="w-5 h-5" style={{ color: "#FF2D75" }} />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: "#1A1028" }}
              >
                Expert Tips for Remote Applications
              </h2>
            </div>
            <div className="space-y-6">
              {RESUME_TIPS.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: "#1A1028" }}
                  >
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-3">
                        <CheckCircle
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: "#FF2D75" }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#374151" }}
                        >
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── TEMPLATES ──────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                  }}
                >
                  <FileText className="w-5 h-5" style={{ color: "#6A0DAD" }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-bold tracking-tight"
                  style={{ color: "#1A1028" }}
                >
                  Resume Templates
                </h2>
              </div>
            </div>

            {/* Free resource note */}
            <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
              Free templates are available to everyone.{" "}
              <a
                href="/account/signup"
                className="font-semibold underline"
                style={{ color: "#FF2D75" }}
              >
                Create a free account
              </a>{" "}
              to save your results or download templates. Premium templates
              unlock with an upgrade.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {TEMPLATES.map((template, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
                  style={{ borderColor: "#FAD6E5" }}
                >
                  <div
                    className="aspect-[3/4] flex items-center justify-center relative"
                    style={{ backgroundColor: "#FFF5F8" }}
                  >
                    {template.premium && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: "rgba(106,13,173,0.08)",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        <div
                          className="bg-white rounded-2xl p-5 shadow-xl text-center border"
                          style={{ borderColor: "#FAD6E5" }}
                        >
                          <Crown
                            className="w-8 h-8 mx-auto mb-2"
                            style={{ color: "#FF2D75" }}
                          />
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#1A1028" }}
                          >
                            Premium Template
                          </p>
                        </div>
                      </div>
                    )}
                    <FileText
                      className="w-20 h-20"
                      style={{ color: "#FAD6E5" }}
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-base font-bold mb-1 flex items-center gap-2"
                      style={{ color: "#1A1028" }}
                    >
                      {template.name}
                      {template.premium && (
                        <Crown
                          className="w-4 h-4"
                          style={{ color: "#6A0DAD" }}
                        />
                      )}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                      {template.description}
                    </p>
                    {template.premium ? (
                      <a
                        href="/account/signup?plan=premium"
                        className="block w-full py-3 rounded-full font-bold text-sm text-center text-white transition-all hover:shadow-md hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                        }}
                      >
                        Upgrade to Download
                      </a>
                    ) : (
                      <a
                        href="/account/signup"
                        className="block w-full py-3 rounded-full font-bold text-sm text-center transition-all hover:shadow-md hover:scale-[1.02]"
                        style={{ backgroundColor: "#F3F4F6", color: "#374151" }}
                      >
                        Download Free — Sign Up
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── BOTTOM CTA ───────────────────────────────────── */}
          <div
            className="rounded-3xl p-10 text-center text-white shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
            }}
          >
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              Want More Resume Help?
            </h3>
            <p
              className="text-base mb-8 max-w-md mx-auto"
              style={{ color: "#FECDE0" }}
            >
              Premium members get exclusive templates, AI-powered resume
              reviews, and 1-on-1 career coaching. Or try our free AI helper —
              no account needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/resume-helper"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white font-bold text-base rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                style={{ color: "#FF2D75" }}
              >
                <Sparkles className="w-5 h-5" /> Try AI Helper Free
              </a>
              <a
                href="/account/signup?plan=premium"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-base rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                Upgrade to Premium
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
