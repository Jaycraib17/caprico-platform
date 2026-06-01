"use client";

import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ backgroundColor: "#FFF5F8" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <img
            src={LOGO_URL}
            alt="Capri Remote"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <span className="text-2xl font-bold tracking-tight">
            <span style={{ color: "#6A0DAD" }}>Capri</span>
            <span style={{ color: "#FF2D75" }}> Remote</span>
          </span>
        </a>

        <div
          className="bg-white rounded-3xl p-8 shadow-xl border"
          style={{ borderColor: "#FAD6E5" }}
        >
          {sent ? (
            /* ── Success state ─────────────────────────── */
            <div className="text-center">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: "#FF2D75" }} />
              </div>
              <h1
                className="text-2xl font-bold mb-3"
                style={{ color: "#1A1028" }}
              >
                Check your inbox
              </h1>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#6B7280" }}
              >
                If <strong style={{ color: "#1A1028" }}>{email}</strong> is
                registered with us, you'll get a password reset link within a
                few minutes.
              </p>
              <p className="text-xs mb-6" style={{ color: "#9CA3AF" }}>
                Didn't get it? Check your spam folder, or{" "}
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "#FF2D75" }}
                >
                  try again
                </button>
                .
              </p>
              <a
                href="/account/signin"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ color: "#6A0DAD" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </a>
            </div>
          ) : (
            /* ── Request form ──────────────────────────── */
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                  }}
                >
                  <Mail className="w-8 h-8" style={{ color: "#FF2D75" }} />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: "#1A1028" }}>
                  Forgot password?
                </h1>
                <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
                  No worries — enter your email and we'll send you a reset link.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: "#1A1028" }}
                  >
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border px-4 py-3 text-base outline-none transition-all"
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
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>

                <a
                  href="/account/signin"
                  className="flex items-center justify-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "#6A0DAD" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
