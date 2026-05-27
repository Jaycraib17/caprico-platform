"use client";

import { Mail, MessageSquare, HelpCircle, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const contacts = [
    {
      icon: Mail,
      title: "General Inquiries",
      desc: "Questions about our platform or services",
      email: "hello@capriremote.com",
      color: "#FF2D75",
    },
    {
      icon: HelpCircle,
      title: "Support",
      desc: "Technical issues or account help",
      email: "support@capriremote.com",
      color: "#6A0DAD",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      desc: "Ideas, suggestions, or feature requests",
      email: "feedback@capriremote.com",
      color: "#FF4F9A",
    },
    {
      icon: Shield,
      title: "Privacy & Legal",
      desc: "Privacy concerns or legal inquiries",
      email: "privacy@capriremote.com",
      color: "#6A0DAD",
    },
  ];

  const faqs = [
    {
      q: "How do I create an account?",
      a: "Click Sign Up Free in the top right corner and follow the prompts. You can sign up with your email address.",
    },
    {
      q: "Are all jobs on Capri Remote remote?",
      a: "Yes! Every job on our platform is verified to be fully remote. We filter out hybrid or on-site positions.",
    },
    {
      q: "How do job alerts work?",
      a: "Save a search with your preferred filters, then enable email alerts. You will be notified when new jobs match your criteria.",
    },
    {
      q: "Can I report a suspicious job listing?",
      a: "Absolutely. Open the job details and use the Report button. We review all reports and remove fraudulent postings.",
    },
    {
      q: "How often are new jobs posted?",
      a: "We update our job board daily with fresh listings from trusted sources around the world.",
    },
    {
      q: "Is Capri Remote free to use?",
      a: "Yes! Browse jobs, save listings, and set up alerts for free. Premium features are available for $9.99/month.",
    },
  ];

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8" }}>
        <Navigation />

        <div
          style={{
            background: "linear-gradient(135deg, #FF2D75 0%, #6A0DAD 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-lg" style={{ color: "#FECDE0" }}>
              We are here to help. Reach out with any questions or feedback.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {contacts.map(({ icon: Icon, title, desc, email, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow"
                style={{ borderColor: "#FAD6E5" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: "#1A1028" }}
                >
                  {title}
                </h3>
                <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
                  {desc}
                </p>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: "#FF2D75" }}
                >
                  {email}
                </a>
              </div>
            ))}
          </div>

          <div
            className="bg-white rounded-2xl border p-8 md:p-10 mb-8 shadow-sm"
            style={{ borderColor: "#FAD6E5" }}
          >
            <h2
              className="text-2xl font-bold mb-7 tracking-tight"
              style={{ color: "#1A1028" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map(({ q, a }) => (
                <div key={q}>
                  <h4
                    className="font-bold text-sm mb-1.5"
                    style={{ color: "#1A1028" }}
                  >
                    {q}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6B7280" }}
                  >
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 text-center border"
            style={{ backgroundColor: "#FFF5F8", borderColor: "#FAD6E5" }}
          >
            <p className="text-sm" style={{ color: "#374151" }}>
              <span className="font-bold" style={{ color: "#1A1028" }}>
                Response Time:{" "}
              </span>
              We typically respond within 24-48 hours during business days. For
              urgent issues, email{" "}
              <a
                href="mailto:support@capriremote.com"
                className="font-semibold underline"
                style={{ color: "#FF2D75" }}
              >
                support@capriremote.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
