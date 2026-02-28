import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithCredentials } = useAuth();

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

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAFAFA] p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5E6E8]">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Sign in to continue your job search
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2D2D2D]">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base outline-none transition-all focus:border-[#D4A5A5] focus:ring-2 focus:ring-[#D4A5A5]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#2D2D2D]">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base outline-none transition-all focus:border-[#D4A5A5] focus:ring-2 focus:ring-[#D4A5A5]/20"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#D4A5A5] px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] focus:outline-none focus:ring-2 focus:ring-[#D4A5A5] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#6B6B6B]">
            Don't have an account?{" "}
            <a
              href="/account/signup"
              className="font-semibold text-[#D4A5A5] hover:text-[#C4958F]"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
