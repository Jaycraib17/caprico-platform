import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Capri Remote brand assets ────────────────────────────────────────────────
const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";
const FAVICON_16 =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/57ed41cb-ac54-4f10-aeab-6daeb6193c87.png";
const FAVICON_32 =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/cf3e0844-2a7a-497a-8e75-cd1a9aa8a329.png";
const APPLE_TOUCH =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/8cd9aed9-3c69-405c-8e13-b34aa3fc3898.png";

export const metadata = {
  title: {
    default: "Capri Remote — Find Remote Jobs Worldwide",
    template: "%s | Capri Remote",
  },
  description:
    "Discover hand-curated remote jobs across tech, design, marketing, and more. AI-powered resume tools to land your dream remote role.",
  metadataBase: new URL("https://capriremote.com"),
  icons: {
    icon: [
      { url: FAVICON_16, sizes: "16x16", type: "image/png" },
      { url: FAVICON_32, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: APPLE_TOUCH, sizes: "180x180", type: "image/png" }],
    shortcut: FAVICON_32,
  },
  openGraph: {
    title: "Capri Remote — Find Remote Jobs Worldwide",
    description:
      "Discover hand-curated remote jobs across tech, design, marketing, and more. AI-powered resume tools included.",
    url: "https://capriremote.com",
    siteName: "Capri Remote",
    images: [{ url: LOGO_URL, width: 1024, height: 1024, alt: "Capri Remote" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Capri Remote — Find Remote Jobs Worldwide",
    description:
      "Hand-curated remote jobs + AI resume tools. Work from anywhere.",
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
