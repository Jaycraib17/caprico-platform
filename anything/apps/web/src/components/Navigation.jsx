"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import useUser from "@/utils/useUser";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function Navigation() {
  const { data: user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#FAD6E5] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src={LOGO_URL}
              alt="Capri Remote"
              className="w-9 h-9 rounded-xl object-cover"
              style={{ flexShrink: 0 }}
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#6A0DAD]">Capri</span>
              <span className="text-[#FF2D75]"> Remote</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <a
              href="/"
              className="text-[#1A1028] hover:text-[#FF2D75] font-medium text-sm transition-colors"
            >
              Jobs
            </a>
            <a
              href="/companies"
              className="text-[#1A1028] hover:text-[#FF2D75] font-medium text-sm transition-colors"
            >
              Companies
            </a>
            <a
              href="/tracker"
              className="text-[#1A1028] hover:text-[#FF2D75] font-medium text-sm transition-colors"
            >
              Tracker
            </a>
            <a
              href="/resume-tools"
              className="text-[#1A1028] hover:text-[#FF2D75] font-medium text-sm transition-colors"
            >
              Resume Tools
            </a>
            {user && (
              <a
                href="/saved"
                className="text-[#1A1028] hover:text-[#FF2D75] font-medium text-sm transition-colors"
              >
                Saved Jobs
              </a>
            )}
            {user?.is_admin && (
              <a
                href="/admin"
                className="text-[#6A0DAD] hover:text-[#FF2D75] font-medium text-sm transition-colors"
              >
                Admin
              </a>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <a
                href="/account/logout"
                className="px-4 py-2 text-sm text-[#1A1028] hover:text-[#FF2D75] font-medium transition-colors"
              >
                Sign Out
              </a>
            ) : (
              <>
                <a
                  href="/account/signin"
                  className="px-4 py-2 text-sm text-[#1A1028] hover:text-[#FF2D75] font-medium transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="px-5 py-2 text-sm font-bold text-white rounded-full shadow-md transition-all hover:shadow-lg hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                  }}
                >
                  Sign Up Free
                </a>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1028] hover:text-[#FF2D75] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#FAD6E5] pt-4 space-y-3">
            <a
              href="/"
              className="block text-[#1A1028] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
            >
              Jobs
            </a>
            <a
              href="/companies"
              className="block text-[#1A1028] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
            >
              Companies
            </a>
            <a
              href="/tracker"
              className="block text-[#1A1028] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
            >
              Tracker
            </a>
            <a
              href="/resume-tools"
              className="block text-[#1A1028] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
            >
              Resume Tools
            </a>
            {user && (
              <a
                href="/saved"
                className="block text-[#1A1028] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
              >
                Saved Jobs
              </a>
            )}
            {user?.is_admin && (
              <a
                href="/admin"
                className="block text-[#6A0DAD] hover:text-[#FF2D75] font-medium py-2 text-sm transition-colors"
              >
                Admin
              </a>
            )}
            <div className="border-t border-[#FAD6E5] pt-3 mt-2 space-y-2">
              {user ? (
                <a
                  href="/account/logout"
                  className="block text-center px-4 py-2.5 text-sm text-[#1A1028] font-medium bg-[#FFF5F8] rounded-xl border border-[#FAD6E5]"
                >
                  Sign Out
                </a>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="block text-center px-4 py-2.5 text-sm text-[#1A1028] font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="block text-center px-4 py-2.5 text-sm font-bold text-white rounded-full shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #FF2D75, #6A0DAD)",
                    }}
                  >
                    Sign Up Free
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
