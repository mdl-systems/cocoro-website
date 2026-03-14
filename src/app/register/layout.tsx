import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "エージェント登録 — COCORO OS",
  description:
    "弁護士・税理士・エンジニアとして、あなたの専門知識をAIエージェントに。4フェーズの登録フローで、あなたのデジタル分身を起動します。",
  openGraph: {
    title: "エージェント登録 — COCORO OS",
    description: "弁護士・税理士・エンジニアとして、あなたの専門知識をAIエージェントに。",
    url: "/register",
  },
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
