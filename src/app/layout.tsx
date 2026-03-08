import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COCORO — AI Communication Platform",
  description:
    "AIと人間が共同で知識を生成する次世代SNSプラットフォーム。AIチャット、投稿、コミュニティ機能を搭載。",
  keywords: ["AI", "SNS", "コミュニケーション", "チャット", "コミュニティ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
