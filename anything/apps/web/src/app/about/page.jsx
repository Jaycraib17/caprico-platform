"use client";

import {
  Globe,
  Heart,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AboutPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              About Capri Remote
            </h1>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "#FECDE0" }}
            >
              Your trusted platform for discovering curated remote job
              opportunities from companies hiring globally
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* What is it */}
          <div
            className="bg-white rounded-2xl border p-8 md:p-10 mb-8 shadow-sm"
            style={{ borderColor: "#FAD6E5" }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-5 tracking-tight"
              style={{ color: "#1A1028" }}
            >
              What is Capri Remote?
            </h2>
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: "#374151" }}
            >
              Capri Remote is a modern job platform dedicated to helping
              professionals find legitimate, high-quality remote work
              opportunities. We curate and aggregate remote positions from
              trusted companies around the world, making it easier for you to
              find your next career move without sifting through spam or scams.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#374151" }}
            >
              Whether you're an engineer, designer, marketer, or in any other
              field, Capri Remote provides a streamlined experience to discover
              jobs that match your skills, experience level, and location
              preferences.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {[
              {
                icon: Globe,
                title: "Global Opportunities",
                desc: "Access remote jobs from companies hiring in multiple countries. Filter by location eligibility to find opportunities in your region.",
              },
              {
                icon: Shield,
                title: "Verified & Curated",
                desc: "We verify and curate job listings to ensure quality. No spam, no scams — just real opportunities from legitimate companies.",
              },
              {
                icon: Heart,
                title: "Save & Track",
                desc: "Bookmark your favourite jobs and create custom alerts to be notified when new positions matching your criteria are posted.",
              },
              {
                icon: Zap,
                title: "Updated Daily",
                desc: "Fresh job postings added every single day. Be first to apply and maximise your chances of landing an interview.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: "#FAD6E5" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#FF2D75" }} />
                </div>
                <h3
                  className="font-bold text-base mb-2"
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

          {/* Who it's for */}
          <div
            className="bg-white rounded-2xl border p-8 md:p-10 mb-8 shadow-sm"
            style={{ borderColor: "#FAD6E5" }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-6 tracking-tight"
              style={{ color: "#1A1028" }}
            >
              Who is Capri Remote For?
            </h2>
            <div className="space-y-5">
              {[
                {
                  icon: Users,
                  title: "Remote Job Seekers",
                  desc: "Professionals looking for flexible, location-independent work in engineering, design, marketing, customer support, and more.",
                },
                {
                  icon: TrendingUp,
                  title: "Career Changers",
                  desc: "Those transitioning to remote work or exploring new industries with remote-first opportunities.",
                },
                {
                  icon: Globe,
                  title: "International Professionals",
                  desc: "Talent from around the world seeking companies that hire globally and support remote collaboration.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#6A0DAD" }} />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-sm mb-1"
                      style={{ color: "#1A1028" }}
                    >
                      {title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#6B7280" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How we curate */}
          <div
            className="bg-white rounded-2xl border p-8 md:p-10 mb-8 shadow-sm"
            style={{ borderColor: "#FAD6E5" }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-5 tracking-tight"
              style={{ color: "#1A1028" }}
            >
              How We Curate Jobs
            </h2>
            <p
              className="text-base leading-relaxed mb-5"
              style={{ color: "#374151" }}
            >
              Quality matters. We source remote job listings from reputable job
              boards, company career pages, and partner platforms. Each listing
              goes through a review to ensure:
            </p>
            <ul className="space-y-3">
              {[
                "The job is genuinely remote (not hybrid or on-site)",
                "The company is legitimate with a verifiable online presence",
                "Job descriptions are clear, complete, and free of red flags",
                "No MLM schemes, low-quality gigs, or misleading postings",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "#FF2D75" }}
                  />
                  <span className="text-sm" style={{ color: "#374151" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div
            className="rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
              Ready to Get Started?
            </h2>
            <p
              className="text-base mb-8 max-w-md mx-auto"
              style={{ color: "#FECDE0" }}
            >
              Join thousands of professionals finding their dream remote jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/account/signup"
                className="px-8 py-4 bg-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                style={{ color: "#FF2D75" }}
              >
                Create Free Account
              </a>
              <a
                href="/"
                className="px-8 py-4 font-bold text-lg rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                Browse Jobs
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
