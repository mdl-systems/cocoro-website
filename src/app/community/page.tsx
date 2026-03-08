"use client";

import AppShell from "@/components/AppShell";
import {
    Users,
    Bot,
    MessageCircle,
    TrendingUp,
    Star,
    Plus,
    Search,
    Shield,
    Code,
    Palette,
    BookOpen,
    Briefcase,
    Heart,
    Globe,
    Sparkles,
} from "lucide-react";
import { useState } from "react";

interface Community {
    id: number;
    name: string;
    description: string;
    members: number;
    posts: number;
    icon: string;
    iconBg: string;
    tags: string[];
    hasAiMod: boolean;
    trending: boolean;
    joined: boolean;
}

const communities: Community[] = [
    {
        id: 1,
        name: "AI Code Lab",
        description: "AIを活用したプログラミング。コードレビューやペアプログラミングをAIと一緒に。",
        members: 2847,
        posts: 12340,
        icon: "⌨️",
        iconBg: "linear-gradient(135deg, #34d399, #06b6d4)",
        tags: ["プログラミング", "AI", "コードレビュー"],
        hasAiMod: true,
        trending: true,
        joined: true,
    },
    {
        id: 2,
        name: "クリエイティブ AI",
        description: "AIと人間のクリエイティブなコラボレーション。アート、音楽、文章の共同制作。",
        members: 1923,
        posts: 8750,
        icon: "🎨",
        iconBg: "linear-gradient(135deg, #f472b6, #8b5cf6)",
        tags: ["アート", "デザイン", "クリエイティブ"],
        hasAiMod: true,
        trending: true,
        joined: false,
    },
    {
        id: 3,
        name: "AI × 教育",
        description: "AIを活用した教育の未来を議論。個別最適化学習、AI講師、教材自動生成。",
        members: 3156,
        posts: 15680,
        icon: "📚",
        iconBg: "linear-gradient(135deg, #f59e0b, #f472b6)",
        tags: ["教育", "学習", "EdTech"],
        hasAiMod: true,
        trending: false,
        joined: true,
    },
    {
        id: 4,
        name: "ビジネス × AI",
        description: "AIを活用したビジネス戦略、マーケティング、経営判断の知見を共有。",
        members: 4521,
        posts: 21300,
        icon: "💼",
        iconBg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        tags: ["ビジネス", "戦略", "マーケティング"],
        hasAiMod: false,
        trending: false,
        joined: false,
    },
    {
        id: 5,
        name: "AI倫理と社会",
        description: "AIの倫理的課題、社会的影響、規制について深く議論するコミュニティ。",
        members: 1678,
        posts: 6890,
        icon: "⚖️",
        iconBg: "linear-gradient(135deg, #8b5cf6, #f472b6)",
        tags: ["倫理", "社会", "規制"],
        hasAiMod: true,
        trending: false,
        joined: false,
    },
    {
        id: 6,
        name: "AI研究最前線",
        description: "最新のAI論文、研究動向、技術ブレイクスルーを共有・議論するアカデミックコミュニティ。",
        members: 2234,
        posts: 9870,
        icon: "🔬",
        iconBg: "linear-gradient(135deg, #34d399, #f59e0b)",
        tags: ["研究", "論文", "ML/DL"],
        hasAiMod: true,
        trending: true,
        joined: false,
    },
];

const categories = [
    { icon: Globe, label: "すべて", count: communities.length },
    { icon: Code, label: "テクノロジー", count: 2 },
    { icon: Palette, label: "クリエイティブ", count: 1 },
    { icon: BookOpen, label: "教育", count: 1 },
    { icon: Briefcase, label: "ビジネス", count: 1 },
    { icon: Heart, label: "社会", count: 1 },
];

function CommunityCard({ community }: { community: Community }) {
    const [joined, setJoined] = useState(community.joined);

    return (
        <div
            className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] group cursor-pointer relative overflow-hidden"
            style={{
                background: "rgba(13, 13, 18, 0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
            }}
        >
            {/* Trending Badge */}
            {community.trending && (
                <div
                    className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
                    style={{
                        background: "rgba(244, 114, 182, 0.1)",
                        border: "1px solid rgba(244, 114, 182, 0.2)",
                        color: "#f472b6",
                    }}
                >
                    <TrendingUp className="w-3 h-3" />
                    トレンド
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                        background: community.iconBg,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    {community.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="text-[16px] font-semibold text-[#e8e8f0] truncate"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                            {community.name}
                        </h3>
                        {community.hasAiMod && (
                            <div
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]"
                                style={{
                                    background: "rgba(6, 182, 212, 0.1)",
                                    border: "1px solid rgba(6, 182, 212, 0.2)",
                                    color: "#06b6d4",
                                }}
                                title="AIモデレーター搭載"
                            >
                                <Bot className="w-3 h-3" />
                                AI
                            </div>
                        )}
                    </div>
                    <p className="text-[12px] text-[#a1a1b5] leading-relaxed line-clamp-2">
                        {community.description}
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {community.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md"
                        style={{
                            background: "rgba(139, 92, 246, 0.06)",
                            border: "1px solid rgba(139, 92, 246, 0.12)",
                            color: "#a78bfa",
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Stats & Join */}
            <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b80]">
                        <Users className="w-3.5 h-3.5" />
                        {community.members.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b80]">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {community.posts.toLocaleString()}
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setJoined(!joined);
                    }}
                    className="px-4 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all"
                    style={{
                        background: joined
                            ? "rgba(52, 211, 153, 0.1)"
                            : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                        border: joined
                            ? "1px solid rgba(52, 211, 153, 0.2)"
                            : "none",
                        color: joined ? "#34d399" : "white",
                        boxShadow: joined
                            ? "none"
                            : "0 4px 12px rgba(139,92,246,0.3)",
                    }}
                >
                    {joined ? "✓ 参加中" : "参加する"}
                </button>
            </div>
        </div>
    );
}

export default function CommunityPage() {
    const [activeCategory, setActiveCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <AppShell
            title="コミュニティ"
            subtitle="知識と創造のハブを探索する"
        >
            <div className="max-w-[1100px]">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl w-[280px]"
                            style={{
                                background: "rgba(19, 19, 28, 0.8)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <Search className="w-4 h-4 text-[#6b6b80]" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="コミュニティを検索..."
                                className="bg-transparent border-none outline-none text-[13px] text-[#e8e8f0] placeholder-[#6b6b80] w-full"
                            />
                        </div>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
                        style={{
                            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                            color: "white",
                            boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
                            border: "none",
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        コミュニティ作成
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(i)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] cursor-pointer whitespace-nowrap transition-all"
                                style={{
                                    background:
                                        activeCategory === i
                                            ? "rgba(139, 92, 246, 0.12)"
                                            : "rgba(19, 19, 28, 0.5)",
                                    border:
                                        activeCategory === i
                                            ? "1px solid rgba(139, 92, 246, 0.25)"
                                            : "1px solid rgba(255,255,255,0.06)",
                                    color:
                                        activeCategory === i ? "#a78bfa" : "#a1a1b5",
                                }}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                                <span
                                    className="text-[10px] px-1.5 py-0 rounded-md"
                                    style={{
                                        background:
                                            activeCategory === i
                                                ? "rgba(139,92,246,0.15)"
                                                : "rgba(255,255,255,0.04)",
                                    }}
                                >
                                    {cat.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* AI Recommendation Banner */}
                <div
                    className="rounded-2xl p-5 mb-8 flex items-center gap-4"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.06))",
                        border: "1px solid rgba(139,92,246,0.15)",
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                            background: "rgba(139,92,246,0.15)",
                            border: "1px solid rgba(139,92,246,0.25)",
                        }}
                    >
                        <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[14px] font-semibold text-[#e8e8f0] mb-1">
                            AIがあなたにおすすめのコミュニティを見つけました
                        </div>
                        <p className="text-[12px] text-[#a1a1b5]">
                            あなたの興味・関心に基づいて、最適なコミュニティをレコメンドしています。
                        </p>
                    </div>
                    <button
                        className="px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all whitespace-nowrap"
                        style={{
                            background: "rgba(139,92,246,0.15)",
                            border: "1px solid rgba(139,92,246,0.25)",
                            color: "#a78bfa",
                        }}
                    >
                        おすすめを見る
                    </button>
                </div>

                {/* Community Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {communities.map((community, i) => (
                        <div
                            key={community.id}
                            style={{ animationDelay: `${i * 0.08}s` }}
                            className="animate-in"
                        >
                            <CommunityCard community={community} />
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
