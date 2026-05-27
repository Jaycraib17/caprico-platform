"use client";

import { X, Check, Zap, Crown, Star, Briefcase, Globe } from "lucide-react";
import { useState } from "react";

export default function Paywall({ isOpen, onClose, trigger = "generic" }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (trial = false) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trial }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.url) {
        if (typeof window !== "undefined") window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case "premium_job":
        return {
          title: "Unlock Premium Jobs",
          description:
            "Get early access to high-paying remote jobs from top companies hiring globally.",
        };
      case "saved_jobs_limit":
        return {
          title: "Save More Jobs",
          description:
            "Free tier limited to 5 saved jobs. Upgrade for unlimited saves and premium features.",
        };
      case "alerts_limit":
        return {
          title: "Unlimited Job Alerts",
          description:
            "Free tier limited to 3 alerts. Get instant notifications with Premium.",
        };
      case "application_tracker":
        return {
          title: "Track Your Applications",
          description:
            "Stay organised and never miss a follow-up with our premium application tracker.",
        };
      default:
        return {
          title: "Upgrade to Premium",
          description:
            "Get early access to high-paying remote jobs, faster alerts, and tools to get hired quicker.",
        };
    }
  };

  const content = getTriggerContent();

  const features = [
    {
      icon: Crown,
      title: "Exclusive Premium Jobs",
      desc: "Early access to high-paying positions from top remote companies",
    },
    {
      icon: Zap,
      title: "Instant Job Alerts",
      desc: "Be the first to know when new jobs match your criteria",
    },
    {
      icon: Star,
      title: "Application Tracker",
      desc: "Organise applications and never miss a follow-up",
    },
    {
      icon: Check,
      title: "Unlimited Saves & Alerts",
      desc: "No limits on saves or custom job alerts",
    },
    {
      icon: Check,
      title: "Resume Tools & Tips",
      desc: "Templates and expert guidance to stand out",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Gradient header strip */}
        <div
          className="h-2 w-full"
          style={{ background: "linear-gradient(135deg, #FF2D75, #6A0DAD)" }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-5 rounded-full p-2 transition-colors hover:bg-gray-100"
          style={{ color: "#9CA3AF" }}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 text-center border-b"
          style={{ borderColor: "#FAD6E5" }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, #FF2D75, #6A0DAD)" }}
          >
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-bold" style={{ color: "#1A1028" }}>
            {content.title}
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {content.description}
          </p>
        </div>

        {/* Features */}
        <div className="px-8 py-6">
          <div className="mb-6 space-y-3.5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                  }}
                >
                  <Icon className="h-3 w-3" style={{ color: "#FF2D75" }} />
                </div>
                <div>
                  <h4
                    className="text-sm font-bold"
                    style={{ color: "#1A1028" }}
                  >
                    {title}
                  </h4>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing pill */}
          <div
            className="mb-6 rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg, #FFF5F8, #F3E8FF)" }}
          >
            <div
              className="mb-1 text-xs font-bold uppercase tracking-wider"
              style={{ color: "#6A0DAD" }}
            >
              Premium Subscription
            </div>
            <div className="text-4xl font-bold" style={{ color: "#1A1028" }}>
              $9.99
              <span
                className="text-base font-normal"
                style={{ color: "#6B7280" }}
              >
                /month
              </span>
            </div>
            <div className="mt-1 text-xs" style={{ color: "#6B7280" }}>
              Cancel anytime • 7-day free trial
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => handleUpgrade(true)}
              disabled={loading}
              className="w-full rounded-full px-6 py-4 font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
              }}
            >
              {loading ? "Processing…" : "Start 7-Day Free Trial"}
            </button>
            <button
              onClick={() => handleUpgrade(false)}
              disabled={loading}
              className="w-full rounded-full border-2 px-6 py-4 font-bold transition-all hover:bg-[#FFF5F8] disabled:opacity-50"
              style={{ borderColor: "#FF2D75", color: "#FF2D75" }}
            >
              Upgrade Now — $9.99/mo
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs hover:opacity-80 transition-opacity"
              style={{ color: "#9CA3AF" }}
            >
              Maybe Later
            </button>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: "#9CA3AF" }}>
            🔥 Join 1,000+ premium members who landed their dream remote job
          </p>
        </div>
      </div>
    </div>
  );
}
