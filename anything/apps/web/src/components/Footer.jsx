"use client";

import { Smartphone, QrCode } from "lucide-react";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

const QR_APP_STORE =
  "https://raw.createusercontent.com/d6025e5e-8ec4-42fd-a211-ac3a31df0836/";
const QR_GOOGLE_PLAY =
  "https://raw.createusercontent.com/2f8a4bab-e34a-4cff-8e3f-47a41351002f/";
const SCREENSHOT_1 =
  "https://raw.createusercontent.com/08c68200-5327-450c-b78b-441eb8795537/";
const SCREENSHOT_2 =
  "https://raw.createusercontent.com/69a8b9d6-a0f7-4c09-a1c1-10545317d281/";
const SCREENSHOT_3 =
  "https://raw.createusercontent.com/0e5c1075-6152-4a1f-9926-b3671ab670fc/";

export default function Footer() {
  const trackDownload = async (platform, method) => {
    try {
      await fetch("/api/analytics/download-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, source: "footer", method }),
      });
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  const handleDownloadClick = (platform) => trackDownload(platform, "button");
  const handleQRHover = (platform) => trackDownload(platform, "qr_code");

  return (
    <footer className="mt-16" style={{ backgroundColor: "#1A1028" }}>
      {/* App Download Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-5">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Get the Capri Remote App
            </h2>
            <p className="text-lg text-pink-100 max-w-xl mx-auto">
              Search jobs, save favourites, and get alerts — right from your
              pocket
            </p>
          </div>

          {/* App Screenshots */}
          <div className="mb-12 flex justify-center gap-4 overflow-x-auto pb-4">
            {[SCREENSHOT_1, SCREENSHOT_2, SCREENSHOT_3].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-44 md:w-52">
                <img
                  src={src}
                  alt={`App screenshot ${i + 1}`}
                  className="w-full h-auto rounded-2xl shadow-2xl border-2 border-white/20"
                />
              </div>
            ))}
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://apps.apple.com/app/capri-remote"
              onClick={() => handleDownloadClick("ios")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-base font-bold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.capriremote"
              onClick={() => handleDownloadClick("android")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm12.81-.85L4.84 23.4c.41.18.85.13 1.22-.12l11.81-6.87-2.06-2.06zM20.16 10.8L16.7 8.9l-2.04 2.04 2.04 2.04 3.46-1.9c.59-.33.59-1.1 0-1.43zm-4.97-1.9L3.52.49c-.37-.25-.81-.3-1.22-.12L13.69 12l1.5-1.5z" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-400">GET IT ON</div>
                <div className="text-base font-bold">Google Play</div>
              </div>
            </a>
          </div>

          {/* QR Codes */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-8 border-t border-white/20">
            <div className="text-center">
              <div
                className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-3"
                onMouseEnter={() => handleQRHover("ios")}
              >
                <img
                  src={QR_APP_STORE}
                  alt="App Store QR Code"
                  className="w-28 h-28"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-pink-200">
                <QrCode className="w-4 h-4" />
                <span>Scan for iOS</span>
              </div>
            </div>
            <div className="text-center">
              <div
                className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-3"
                onMouseEnter={() => handleQRHover("android")}
              >
                <img
                  src={QR_GOOGLE_PLAY}
                  alt="Google Play QR Code"
                  className="w-28 h-28"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-pink-200">
                <QrCode className="w-4 h-4" />
                <span>Scan for Android</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div>
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <img
                src={LOGO_URL}
                alt="Capri Remote"
                className="w-8 h-8 rounded-lg object-cover"
                style={{ flexShrink: 0 }}
              />
              <span className="text-lg font-bold">
                <span className="text-[#6A0DAD]">Capri</span>
                <span className="text-[#FF2D75]"> Remote</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted platform for curated remote job opportunities from
              companies hiring globally.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-[#FF2D75] transition-colors">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="/companies"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Companies
                </a>
              </li>
              <li>
                <a
                  href="/tracker"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Application Tracker
                </a>
              </li>
              <li>
                <a
                  href="/resume-tools"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Resume Tools
                </a>
              </li>
              <li>
                <a
                  href="/account/signup"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="/about"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-[#FF2D75] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            © 2026 Capri Remote. All rights reserved.
          </p>
          <div className="flex gap-5 mt-4 md:mt-0 text-gray-500">
            <a
              href="mailto:support@capriremote.com"
              className="hover:text-[#FF2D75] transition-colors"
            >
              Support
            </a>
            <a
              href="/privacy"
              className="hover:text-[#FF2D75] transition-colors"
            >
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#FF2D75] transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
