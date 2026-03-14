import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン — COCORO OS",
  description: "COCORO OSにログインして、あなたのAI人格とつながりましょう。",
  openGraph: {
    title: "ログイン — COCORO OS",
    description: "COCORO OSにログインして、あなたのAI人格とつながりましょう。",
    url: "/login",
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
