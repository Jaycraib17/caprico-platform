"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import useAuth from "@/utils/useAuth";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      await signUpWithCredentials({
        email,
        password,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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

        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white rounded-3xl p-8 shadow-xl border"
          style={{ borderColor: "#FAD6E5" }}
        >
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
              }}
            >
              <span className="text-3xl">🌴</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A1028" }}>
              Join Capri Remote
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
              Find your dream remote job — it's free
            </p>
          </div>

          {/* Social proof bullets */}
          <div
            className="mb-6 rounded-2xl p-4 space-y-2"
            style={{ backgroundColor: "#FFF5F8" }}
          >
            {[
              "Curated remote jobs from verified companies",
              "Save jobs & get email alerts",
              "AI resume tools + application tracker",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#FF2D75" }}
                />
                <span style={{ color: "#1A1028" }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "#1A1028" }}
              >
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border px-4 py-3 text-base outline-none transition-all"
                style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF2D75";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,45,117,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#FAD6E5";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: "#1A1028" }}
              >
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border px-4 py-3 text-base outline-none transition-all"
                style={{ borderColor: "#FAD6E5", color: "#1A1028" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF2D75";
                  e.target.style.boxShadow = "0 0 0 3px rgba(255,45,117,0.1)";
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
              {loading ? "Creating account…" : "Create Free Account"}
            </button>

            <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
              By signing up you agree to our{" "}
              <a
                href="/terms"
                className="underline hover:opacity-80"
                style={{ color: "#6A0DAD" }}
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline hover:opacity-80"
                style={{ color: "#6A0DAD" }}
              >
                Privacy Policy
              </a>
            </p>

            <p className="text-center text-sm" style={{ color: "#6B7280" }}>
              Already have an account?{" "}
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
      </div>
    </div>
  );
}
