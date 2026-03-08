"use client";

import AppShell from "@/components/AppShell";
import {
    Edit3,
    MapPin,
    Calendar,
    Link as LinkIcon,
    Bot,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Award,
    Zap,
    Target,
    TrendingUp,
    Star,
    Users,
    MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

function buildProfile(user: AuthUser | null) {
    const name = user?.name || "ゲストユーザー";
    const initial = name.charAt(0).toUpperCase();
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })
        : "2026年3月";
    return {
        name,
        handle: `@${name.toLowerCase().replace(/\s+/g, "_")}`,
        avatar: initial,
        avatarBg: "linear-gradient(135deg, #f472b6, #8b5cf6)",
        email: user?.email || "",
        bio: "AIと共に次世代のコミュニケーションを探索中。テクノロジー × クリエイティビティの可能性を信じています。COCORO AIプラットフォームで知識の共同創造を。",
        location: "東京, Japan",
        joined: joinedDate,
        website: "cocoro.ai",
        stats: { posts: 0, followers: 0, following: 0, aiChats: 0 },
    };
}

const achievements = [
    {
        icon: "🏆",
        title: "アーリーアダプター",
        desc: "プラットフォーム初期参加者",
        color: "#f59e0b",
    },
    {
        icon: "🤖",
        title: "AI マスター",
        desc: "AIと100回以上対話",
        color: "#8b5cf6",
    },
    {
        icon: "💬",
        title: "コミュニケーター",
        desc: "50件以上のコメント",
        color: "#06b6d4",
    },
    {
        icon: "⭐",
        title: "インフルエンサー",
        desc: "1000+フォロワー獲得",
        color: "#f472b6",
    },
];

const userPosts = [
    {
        id: 1,
        content:
            "AIエージェントと一緒にコードレビューをする新しいワークフローを確立。生産性が2倍になりました。",
        likes: 89,
        comments: 12,
        time: "2時間前",
        tags: ["プログラミング", "AI"],
    },
    {
        id: 2,
        content:
            "COCOROのAIアシスタントに英語の技術記事を翻訳してもらったら、専門用語のニュアンスまで完璧に捉えてくれた。翻訳AIの進化が凄い。",
        likes: 156,
        comments: 23,
        time: "1日前",
        tags: ["翻訳", "テクノロジー"],
    },
    {
        id: 3,
        content:
            "AIと人間の知識を融合して新しいアイデアを生み出すプロセスが確立されてきた感覚。個人の知的生産性の限界を超えられる時代が来ている。",
        likes: 234,
        comments: 45,
        time: "3日前",
        tags: ["AI", "知的生産"],
    },
];

const tabs = ["投稿", "いいね", "メディア", "ブックマーク"];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState(0);
    const [session, setSession] = useState<AuthUser | null>(null);

    useEffect(() => { setSession(getSession()); }, []);

    const userProfile = buildProfile(session);

    return (
        <AppShell title="プロフィール" subtitle="あなたのデジタルアイデンティティ">
            <div className="max-w-[800px]">
                {/* Profile Header */}
                <div
                    className="rounded-2xl overflow-hidden mb-6"
                    style={{
                        background: "rgba(13, 13, 18, 0.6)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {/* Banner */}
                    <div
                        className="h-[140px] relative"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2), rgba(244,114,182,0.2))",
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-10 mb-4">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-[28px] font-bold border-4"
                                style={{
                                    background: userProfile.avatarBg,
                                    borderColor: "#060608",
                                }}
                            >
                                {userProfile.avatar}
                            </div>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all mt-12"
                                style={{
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "#a1a1b5",
                                }}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                プロフィール編集
                            </button>
                        </div>

                        <div className="mb-4">
                            <h2
                                className="text-[22px] font-bold text-[#e8e8f0] mb-0.5"
                                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                            >
                                {userProfile.name}
                            </h2>
                            <div className="text-[13px] text-[#6b6b80]">
                                {userProfile.handle}
                            </div>
                        </div>

                        <p className="text-[13px] text-[#a1a1b5] leading-relaxed mb-4 max-w-[520px]">
                            {userProfile.bio}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#6b6b80] mb-5">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {userProfile.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {userProfile.joined} 参加
                            </span>
                            <span className="flex items-center gap-1 text-[#06b6d4]">
                                <LinkIcon className="w-3.5 h-3.5" />
                                {userProfile.website}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6">
                            {[
                                { value: userProfile.stats.posts, label: "投稿" },
                                { value: userProfile.stats.followers, label: "フォロワー" },
                                { value: userProfile.stats.following, label: "フォロー" },
                                {
                                    value: userProfile.stats.aiChats,
                                    label: "AIチャット",
                                    color: "#06b6d4",
                                },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div
                                        className="text-[18px] font-bold"
                                        style={{
                                            color: stat.color || "#e8e8f0",
                                            fontFamily: "Space Grotesk, sans-serif",
                                        }}
                                    >
                                        {stat.value.toLocaleString()}
                                    </div>
                                    <div className="text-[11px] text-[#6b6b80]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tabs */}
                        <div
                            className="flex gap-1 mb-6 p-1 rounded-xl"
                            style={{
                                background: "rgba(13, 13, 18, 0.6)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            {tabs.map((tab, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className="flex-1 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all"
                                    style={{
                                        background:
                                            activeTab === i
                                                ? "rgba(139, 92, 246, 0.12)"
                                                : "transparent",
                                        color:
                                            activeTab === i ? "#a78bfa" : "#6b6b80",
                                        border:
                                            activeTab === i
                                                ? "1px solid rgba(139, 92, 246, 0.2)"
                                                : "1px solid transparent",
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Posts */}
                        <div className="space-y-4">
                            {userPosts.map((post, i) => (
                                <article
                                    key={post.id}
                                    className="rounded-2xl p-5 transition-all duration-300 hover:border-[rgba(255,255,255,0.1)] animate-in"
                                    style={{
                                        background: "rgba(13, 13, 18, 0.6)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
                                            style={{ background: userProfile.avatarBg }}
                                        >
                                            {userProfile.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[13px] font-semibold text-[#e8e8f0]">
                                                {userProfile.name}
                                            </span>
                                            <span className="text-[12px] text-[#6b6b80] ml-2">
                                                {post.time}
                                            </span>
                                        </div>
                                        <MoreHorizontal className="w-4 h-4 text-[#6b6b80] cursor-pointer" />
                                    </div>

                                    <p className="text-[14px] text-[#d0d0e0] leading-relaxed mb-3">
                                        {post.content}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] px-2 py-0.5 rounded-md"
                                                style={{
                                                    background: "rgba(139, 92, 246, 0.06)",
                                                    border: "1px solid rgba(139, 92, 246, 0.12)",
                                                    color: "#a78bfa",
                                                }}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div
                                        className="flex items-center gap-5 pt-3 text-[12px] text-[#6b6b80]"
                                        style={{
                                            borderTop: "1px solid rgba(255,255,255,0.04)",
                                        }}
                                    >
                                        <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#f472b6] transition-colors">
                                            <Heart className="w-3.5 h-3.5" />
                                            {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#8b5cf6] transition-colors">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            {post.comments}
                                        </span>
                                        <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#06b6d4] transition-colors">
                                            <Share2 className="w-3.5 h-3.5" />
                                            シェア
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Achievements */}
                    <div className="w-[240px] flex-shrink-0 hidden lg:block">
                        <div
                            className="rounded-2xl p-5"
                            style={{
                                background: "rgba(13, 13, 18, 0.6)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="w-4 h-4 text-[#f59e0b]" />
                                <span className="text-[13px] font-semibold text-[#e8e8f0]">
                                    実績
                                </span>
                            </div>
                            <div className="space-y-3">
                                {achievements.map((ach, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-white/[0.03]"
                                    >
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px]"
                                            style={{
                                                background: `${ach.color}14`,
                                                border: `1px solid ${ach.color}25`,
                                            }}
                                        >
                                            {ach.icon}
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-medium text-[#e8e8f0]">
                                                {ach.title}
                                            </div>
                                            <div className="text-[10px] text-[#6b6b80]">
                                                {ach.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Activity */}
                        <div
                            className="rounded-2xl p-5 mt-5"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))",
                                border: "1px solid rgba(6,182,212,0.12)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Bot className="w-4 h-4 text-[#06b6d4]" />
                                <span className="text-[13px] font-semibold text-[#e8e8f0]">
                                    AI活動状況
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-[#a1a1b5]">今週のチャット</span>
                                    <span className="text-[#06b6d4] font-semibold">24回</span>
                                </div>
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-[#a1a1b5]">AI生成コンテンツ</span>
                                    <span className="text-[#8b5cf6] font-semibold">8件</span>
                                </div>
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-[#a1a1b5]">アシスト利用</span>
                                    <span className="text-[#34d399] font-semibold">15回</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
