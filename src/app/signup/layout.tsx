import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規登録 — COCORO OS",
  description: "COCORO OSアカウントを作成して、あなただけのAI人格OSを起動しましょう。",
  openGraph: {
    title: "新規登録 — COCORO OS",
    description: "COCORO OSアカウントを作成して、あなただけのAI人格OSを起動しましょう。",
    url: "/signup",
  },
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
