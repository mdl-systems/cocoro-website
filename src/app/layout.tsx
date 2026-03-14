import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cocoro.ai";
const SITE_NAME = "COCORO OS";
const DESCRIPTION =
  "あなただけのAI人格OS。miniPCで動く完全プライベートなAIアシスタント。Boot Wizard 40問であなたの価値観・思考・感情を学習し、会話するたびに成長します。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ─── Basic ───────────────────────────────────────────────────────────────
  title: {
    default: `${SITE_NAME} — あなただけのAI人格OS`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "AI人格OS",
    "Cocoro OS",
    "miniPC",
    "プライベートAI",
    "AIアシスタント",
    "オンプレミスAI",
    "パーソナルAI",
    "Boot Wizard",
    "AIエージェント",
    "MDL Systems",
  ],
  authors: [{ name: "MDL Systems / ANTIGRAVITY", url: SITE_URL }],
  creator: "MDL Systems",
  publisher: "MDL Systems",

  // ─── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — あなただけのAI人格OS`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "COCORO OS — あなただけのAI人格OS",
      },
    ],
  },

  // ─── Twitter Card ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@mdl_systems",
    creator: "@mdl_systems",
    title: `${SITE_NAME} — あなただけのAI人格OS`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },

  // ─── Canonical / Alternate ───────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ─── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  // ─── Verification (set via env if needed) ────────────────────────────────
  // verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />

        {/* Viewport (explicit for safety) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "COCORO OS",
              description: DESCRIPTION,
              url: SITE_URL,
              applicationCategory: "ArtificialIntelligenceApplication",
              operatingSystem: "Linux",
              author: {
                "@type": "Organization",
                name: "MDL Systems",
                url: SITE_URL,
              },
              offers: [
                {
                  "@type": "Offer",
                  name: "Starter",
                  price: "49800",
                  priceCurrency: "JPY",
                  description: "miniPC（Ryzen 5 / 16GB / 512GB）込み",
                },
                {
                  "@type": "Offer",
                  name: "Pro",
                  price: "89800",
                  priceCurrency: "JPY",
                  description: "miniPC（Ryzen 7 / 32GB / 1TB NVMe）込み",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
