"use client";

import { Briefcase, Globe, LogOut } from "lucide-react";
import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ backgroundColor: "#FFF5F8" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative w-9 h-9">
            <Briefcase
              className="w-5 h-5 absolute left-0 bottom-0"
              style={{ color: "#FF2D75" }}
            />
            <Globe
              className="w-5 h-5 absolute right-0 top-0"
              style={{ color: "#6A0DAD" }}
            />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span style={{ color: "#6A0DAD" }}>Capri</span>
            <span style={{ color: "#FF2D75" }}> Remote</span>
          </span>
        </a>

        <div
          className="bg-white rounded-3xl p-8 shadow-xl border text-center"
          style={{ borderColor: "#FAD6E5" }}
        >
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, #FFE6F0, #F3E8FF)" }}
          >
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="mb-3 text-2xl font-bold" style={{ color: "#1A1028" }}>
            Sign Out
          </h1>
          <p className="mb-8 text-sm" style={{ color: "#6B7280" }}>
            Are you sure you want to sign out of Capri Remote?
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-full px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              style={{
                background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
              }}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
            <a
              href="/"
              className="block w-full py-3 text-sm font-medium rounded-full border transition-colors hover:bg-[#FFF5F8]"
              style={{ color: "#6B7280", borderColor: "#FAD6E5" }}
            >
              Cancel — Go Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
