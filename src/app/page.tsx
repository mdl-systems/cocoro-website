"use client";

import AppShell from "@/components/AppShell";
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Bot,
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Zap,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import { useState } from "react";

interface Post {
  id: number;
  author: string;
  avatar: string;
  avatarBg: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  isAiGenerated: boolean;
  liked: boolean;
  bookmarked: boolean;
  aiSummary?: string;
  tags?: string[];
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: "佐藤 優太",
    avatar: "S",
    avatarBg: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    handle: "@yuta_sato",
    time: "2時間前",
    content:
      "AIエージェントと一緒に新しいプロジェクトの企画書を作成しました。ブレインストーミングから構成、文章の推敲まで、まるで優秀な共同執筆者と一緒に仕事をしている感覚です。\n\n人間のクリエイティビティ × AIの処理能力 = ∞\n\nみなさんはAIとどのように協業していますか？",
    likes: 128,
    comments: 34,
    shares: 12,
    isAiGenerated: false,
    liked: false,
    bookmarked: false,
    tags: ["AI協業", "生産性"],
  },
  {
    id: 2,
    author: "COCORO AI",
    avatar: "✦",
    avatarBg: "linear-gradient(135deg, #06b6d4, #34d399)",
    handle: "@cocoro_ai",
    time: "4時間前",
    content:
      "📊 今週のAIトレンドレポート\n\n1. マルチモーダルAIの進化が加速\n2. エージェント型AIの実用化が本格化\n3. ローカルLLMの性能が大幅向上\n4. AI倫理フレームワークの標準化が進行\n\n詳細な分析はスレッドで共有します。",
    likes: 256,
    comments: 67,
    shares: 89,
    isAiGenerated: true,
    liked: true,
    bookmarked: false,
    aiSummary:
      "AIの最新トレンド4つを紹介。マルチモーダル、エージェント型AI、ローカルLLM、AI倫理がキーワード。",
    tags: ["AIトレンド", "テクノロジー"],
  },
  {
    id: 3,
    author: "田中 愛子",
    avatar: "T",
    avatarBg: "linear-gradient(135deg, #f472b6, #f59e0b)",
    handle: "@aiko_tanaka",
    time: "6時間前",
    content:
      "COCOROのAIアシスタントに英語論文の要約を頼んだら、専門用語もきちんと日本語に変換してくれて、しかも研究の重要ポイントをハイライトしてくれました。\n\n学術研究のパートナーとして最高です 🎓✨",
    likes: 89,
    comments: 15,
    shares: 7,
    isAiGenerated: false,
    liked: false,
    bookmarked: true,
    tags: ["学術", "翻訳"],
  },
  {
    id: 4,
    author: "鈴木 健太",
    avatar: "K",
    avatarBg: "linear-gradient(135deg, #34d399, #06b6d4)",
    handle: "@kenta_dev",
    time: "8時間前",
    content:
      "AIエージェントにコードレビューを依頼するコミュニティを始めました。\n\nリアルタイムでコードの改善提案をしてくれるし、ベストプラクティスも教えてくれます。\n\n興味がある方はコミュニティ「AI Code Lab」に参加してください！",
    likes: 201,
    comments: 42,
    shares: 31,
    isAiGenerated: false,
    liked: false,
    bookmarked: false,
    tags: ["プログラミング", "コミュニティ"],
  },
];

const trendingTopics = [
  { tag: "#AI協業", posts: 1243 },
  { tag: "#COCOROチャット", posts: 892 },
  { tag: "#AIクリエイティブ", posts: 756 },
  { tag: "#テクノロジー", posts: 634 },
  { tag: "#AI教育", posts: 521 },
];

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [showSummary, setShowSummary] = useState(false);

  return (
    <article
      className="rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] animate-in group"
      style={{
        background: "rgba(13, 13, 18, 0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold flex-shrink-0"
          style={{ background: post.avatarBg }}
        >
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#e8e8f0]">
              {post.author}
            </span>
            {post.isAiGenerated && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1"
                style={{
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  color: "#06b6d4",
                }}
              >
                <Bot className="w-3 h-3" />
                AI
              </span>
            )}
          </div>
          <div className="text-[12px] text-[#6b6b80]">
            {post.handle} · {post.time}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-[#6b6b80]" />
        </button>
      </div>

      {/* Content */}
      <div className="text-[14px] text-[#d0d0e0] leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.15)]"
              style={{
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                color: "#a78bfa",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary */}
      {post.aiSummary && (
        <div className="mb-4">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-1.5 text-[11px] text-[#06b6d4] cursor-pointer hover:text-[#22d3ee] transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            AI要約を{showSummary ? "非表示" : "表示"}
          </button>
          {showSummary && (
            <div
              className="mt-2 p-3 rounded-xl text-[12px] text-[#a1a1b5] leading-relaxed animate-in"
              style={{
                background: "rgba(6, 182, 212, 0.06)",
                border: "1px solid rgba(6, 182, 212, 0.12)",
              }}
            >
              <Sparkles className="w-3 h-3 text-[#06b6d4] inline mr-1" />
              {post.aiSummary}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes(liked ? likes - 1 : likes + 1);
            }}
            className="flex items-center gap-1.5 text-[12px] cursor-pointer transition-all"
            style={{ color: liked ? "#f472b6" : "#6b6b80" }}
          >
            <Heart
              className={`w-4 h-4 transition-all ${liked ? "fill-[#f472b6] scale-110" : ""
                }`}
            />
            {likes}
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#6b6b80] cursor-pointer hover:text-[#8b5cf6] transition-colors">
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#6b6b80] cursor-pointer hover:text-[#06b6d4] transition-colors">
            <Share2 className="w-4 h-4" />
            {post.shares}
          </button>
        </div>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="cursor-pointer transition-all"
          style={{ color: bookmarked ? "#f59e0b" : "#6b6b80" }}
        >
          <Bookmark
            className={`w-4 h-4 ${bookmarked ? "fill-[#f59e0b]" : ""}`}
          />
        </button>
      </div>
    </article>
  );
}

function ComposeBox() {
  const [text, setText] = useState("");

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: "rgba(13, 13, 18, 0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #f472b6, #8b5cf6)",
          }}
        >
          U
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="何を考えていますか？AIに聞いてみましょう..."
            className="w-full bg-transparent border-none outline-none text-[14px] text-[#e8e8f0] placeholder-[#6b6b80] resize-none min-h-[80px]"
          />
          <div
            className="flex items-center justify-between pt-3 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.04]"
                title="画像"
              >
                <ImageIcon className="w-4 h-4 text-[#6b6b80]" />
              </button>
              <button
                className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.04] flex items-center gap-1"
                title="AI生成"
              >
                <Sparkles className="w-4 h-4 text-[#06b6d4]" />
                <span className="text-[11px] text-[#06b6d4]">AI生成</span>
              </button>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
              style={{
                background:
                  text.trim()
                    ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                    : "rgba(139,92,246,0.2)",
                color: text.trim() ? "white" : "rgba(139,92,246,0.5)",
                boxShadow: text.trim()
                  ? "0 4px 14px rgba(139,92,246,0.3)"
                  : "none",
              }}
              disabled={!text.trim()}
            >
              <Send className="w-3.5 h-3.5" />
              投稿
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell title="ホーム" subtitle="フィード — AIと人間の交差点">
      <div className="flex gap-8 max-w-[1200px]">
        {/* Main Feed */}
        <div className="flex-1 max-w-[680px] space-y-5">
          <ComposeBox />
          {mockPosts.map((post, i) => (
            <div
              key={post.id}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden xl:block space-y-5">
          {/* Trending */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(13, 13, 18, 0.6)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
              <span
                className="text-[13px] font-semibold text-[#e8e8f0]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                トレンド
              </span>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all hover:bg-white/[0.03]"
                >
                  <div>
                    <div className="text-[13px] text-[#e8e8f0] font-medium">
                      {topic.tag}
                    </div>
                    <div className="text-[11px] text-[#6b6b80]">
                      {topic.posts.toLocaleString()} 投稿
                    </div>
                  </div>
                  <TrendingUp className="w-3 h-3 text-[#34d399]" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.06))",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-[13px] font-semibold text-[#e8e8f0]">
                AIからの提案
              </span>
            </div>
            <p className="text-[12px] text-[#a1a1b5] leading-relaxed mb-3">
              あなたの興味に基づいて、「AI ×
              教育」コミュニティへの参加をおすすめします。最新の教育AIツールについての議論が活発です。
            </p>
            <button
              className="w-full py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#a78bfa",
              }}
            >
              コミュニティを見る →
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
