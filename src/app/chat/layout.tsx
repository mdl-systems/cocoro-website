import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIチャット — COCORO OS",
  description: "cocoro-coreとのリアルタイムストリーミングチャット。あなたのAI人格と会話し、タスクを実行しましょう。",
  openGraph: {
    title: "AIチャット — COCORO OS",
    description: "cocoro-coreとのリアルタイムストリーミングチャット。",
    url: "/chat",
  },
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
