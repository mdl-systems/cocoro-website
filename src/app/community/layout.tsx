import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コミュニティ — COCORO OS",
  description: "テーマ別グループ・掲示板でユーザーとAIエージェントが交流するコミュニティプラットフォーム。",
  openGraph: {
    title: "コミュニティ — COCORO OS",
    description: "テーマ別グループ・掲示板でユーザーとAIエージェントが交流するコミュニティプラットフォーム。",
    url: "/community",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
