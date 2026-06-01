"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, KeyRound, CheckCircle, AlertCircle } from "lucide-react";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("token");
      if (t) setToken(t);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Reset password error:", err);
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
          {success ? (
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
                Password updated!
              </h1>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "#6B7280" }}
              >
                Your password has been changed successfully. You can now sign in
                with your new password.
              </p>
              <a
                href="/account/signin"
                className="w-full inline-flex items-center justify-center rounded-full px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                Sign In Now
              </a>
            </div>
          ) : (
            /* ── Reset form ─────────────────────────────── */
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
                  }}
                >
                  <KeyRound className="w-8 h-8" style={{ color: "#FF2D75" }} />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: "#1A1028" }}>
                  Set new password
                </h1>
                <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
                  Choose a strong password — at least 8 characters.
                </p>
              </div>

              {!token && (
                <div
                  className="mb-5 rounded-xl p-4 flex items-start gap-3 border"
                  style={{ backgroundColor: "#FFF5F8", borderColor: "#FAD6E5" }}
                >
                  <AlertCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "#FF2D75" }}
                  />
                  <div className="text-sm" style={{ color: "#1A1028" }}>
                    <strong>Invalid link.</strong> This reset link is missing a
                    token. Please{" "}
                    <a
                      href="/account/forgot-password"
                      style={{ color: "#FF2D75" }}
                      className="font-semibold underline"
                    >
                      request a new one
                    </a>
                    .
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* New password */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: "#1A1028" }}
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-xl border px-4 py-3 pr-11 text-base outline-none transition-all"
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                      style={{ color: "#9CA3AF" }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (password.length / 12) * 100)}%`,
                            background:
                              password.length < 8
                                ? "#EF4444"
                                : password.length < 12
                                  ? "#F59E0B"
                                  : "#10B981",
                          }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        {password.length < 8
                          ? "Too short"
                          : password.length < 12
                            ? "Decent — try making it longer"
                            : "Strong password ✓"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: "#1A1028" }}
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your new password"
                      className="w-full rounded-xl border px-4 py-3 pr-11 text-base outline-none transition-all"
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
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                      style={{ color: "#9CA3AF" }}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-full px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>

                <p className="text-center text-sm" style={{ color: "#6B7280" }}>
                  Remember it now?{" "}
                  <a
                    href="/account/signin"
                    className="font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "#FF2D75" }}
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
