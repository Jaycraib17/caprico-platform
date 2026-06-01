"use client";

import { useState } from "react";
import useAuth from "@/utils/useAuth";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

// Google "G" SVG logo
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithCredentials, signInWithGoogle } = useAuth();

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
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle({ callbackUrl: "/" });
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const inputStyle = { borderColor: "#FAD6E5", color: "#1A1028" };
  const focusIn = (e) => {
    e.target.style.borderColor = "#FF2D75";
    e.target.style.boxShadow = "0 0 0 3px rgba(255,45,117,0.1)";
  };
  const focusOut = (e) => {
    e.target.style.borderColor = "#FAD6E5";
    e.target.style.boxShadow = "none";
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
          {/* Header */}
          <div className="mb-7 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)",
              }}
            >
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A1028" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#6B7280" }}>
              Sign in to continue your job search
            </p>
          </div>

          {/* ── Google Sign-In ── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-md hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed mb-6"
            style={{
              borderColor: "#E5E7EB",
              color: "#1A1028",
              backgroundColor: "#fff",
            }}
          >
            {googleLoading ? (
              <span
                className="inline-block w-4 h-4 rounded-full border-2 border-r-transparent animate-spin"
                style={{
                  borderColor: "#6A0DAD",
                  borderRightColor: "transparent",
                }}
              />
            ) : (
              <GoogleLogo />
            )}
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </button>

          {/* ── Divider ── */}
          <div className="relative flex items-center gap-3 mb-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "#FAD6E5" }}
            />
            <span
              className="text-xs font-medium px-1"
              style={{ color: "#9CA3AF" }}
            >
              or sign in with email
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "#FAD6E5" }}
            />
          </div>

          {/* ── Email / Password form ── */}
          <form noValidate onSubmit={onSubmit}>
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
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: "#1A1028" }}
                  >
                    Password
                  </label>
                  <a
                    href="/account/forgot-password"
                    className="text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "#FF2D75" }}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  required
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-4 py-3 text-base outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full rounded-full px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <p className="text-center text-sm" style={{ color: "#6B7280" }}>
                Don't have an account?{" "}
                <a
                  href="/account/signup"
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "#FF2D75" }}
                >
                  Sign up free
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
