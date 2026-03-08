"use client";

import AppShell from "@/components/AppShell";
import {
    Bot,
    Plus,
    Settings,
    MessageCircle,
    Star,
    Zap,
    Sparkles,
    Code,
    BookOpen,
    Lightbulb,
    Heart,
    MoreVertical,
    Play,
    Edit3,
    Trash2,
} from "lucide-react";
import { useState } from "react";

interface Agent {
    id: number;
    name: string;
    icon: string;
    iconBg: string;
    personality: string;
    specialty: string;
    description: string;
    conversations: number;
    rating: number;
    isOwn: boolean;
    status: "active" | "inactive" | "learning";
}

const agents: Agent[] = [
    {
        id: 1,
        name: "Tech Mentor",
        icon: "🧠",
        iconBg: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
        personality: "論理的・教育的",
        specialty: "プログラミング・テクノロジー",
        description:
            "プログラミングの質問やコードレビュー、技術的なアドバイスを提供するメンター型AI。初心者にも分かりやすく説明します。",
        conversations: 234,
        rating: 4.8,
        isOwn: true,
        status: "active",
    },
    {
        id: 2,
        name: "Creative Partner",
        icon: "🎨",
        iconBg: "linear-gradient(135deg, #f472b6, #f59e0b)",
        personality: "直感的・自由奔放",
        specialty: "クリエイティブ・アイデア生成",
        description:
            "ブレインストーミングやアイデア生成のパートナー。型にはまらない発想で新しいアイデアを引き出します。",
        conversations: 156,
        rating: 4.6,
        isOwn: true,
        status: "active",
    },
    {
        id: 3,
        name: "Research Scholar",
        icon: "📚",
        iconBg: "linear-gradient(135deg, #06b6d4, #34d399)",
        personality: "分析的・正確",
        specialty: "学術研究・論文分析",
        description:
            "学術論文の分析、研究手法のアドバイス、データ解釈のサポートを行う研究特化型AI。",
        conversations: 89,
        rating: 4.9,
        isOwn: true,
        status: "learning",
    },
    {
        id: 4,
        name: "Business Advisor",
        icon: "💼",
        iconBg: "linear-gradient(135deg, #f59e0b, #8b5cf6)",
        personality: "戦略的・実践的",
        specialty: "ビジネス戦略・経営",
        description:
            "ビジネス戦略の立案、市場分析、意思決定のサポートを行うアドバイザー型AI。",
        conversations: 0,
        rating: 0,
        isOwn: false,
        status: "inactive",
    },
];

const templates = [
    {
        icon: Code,
        name: "プログラマー",
        desc: "コード生成・レビュー特化",
        color: "#34d399",
    },
    {
        icon: BookOpen,
        name: "教師",
        desc: "教育・学習サポート",
        color: "#06b6d4",
    },
    {
        icon: Lightbulb,
        name: "アイデアマン",
        desc: "ブレインストーミング",
        color: "#f59e0b",
    },
    {
        icon: Heart,
        name: "カウンセラー",
        desc: "メンタルケアサポート",
        color: "#f472b6",
    },
];

function AgentCard({ agent }: { agent: Agent }) {
    const [showMenu, setShowMenu] = useState(false);

    const statusColors = {
        active: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", color: "#34d399", text: "稼働中" },
        inactive: { bg: "rgba(107,107,128,0.1)", border: "rgba(107,107,128,0.2)", color: "#6b6b80", text: "停止中" },
        learning: { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)", color: "#8b5cf6", text: "学習中" },
    };

    const st = statusColors[agent.status];

    return (
        <div
            className="rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] group relative"
            style={{
                background: "rgba(13, 13, 18, 0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
            }}
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px]"
                    style={{
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                        color: st.color,
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: st.color,
                            boxShadow: agent.status === "active" ? `0 0 6px ${st.color}` : "none",
                        }}
                    />
                    {st.text}
                </span>
                {agent.isOwn && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-lg cursor-pointer hover:bg-white/[0.04] transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-[#6b6b80]" />
                        </button>
                        {showMenu && (
                            <div
                                className="absolute right-0 top-8 w-[150px] rounded-xl py-2 z-20 animate-in"
                                style={{
                                    background: "rgba(19, 19, 28, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                                }}
                            >
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#a1a1b5] hover:bg-white/[0.04] cursor-pointer">
                                    <Edit3 className="w-3.5 h-3.5" /> 編集
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#a1a1b5] hover:bg-white/[0.04] cursor-pointer">
                                    <Settings className="w-3.5 h-3.5" /> 設定
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-[12px] text-[#f87171] hover:bg-white/[0.04] cursor-pointer">
                                    <Trash2 className="w-3.5 h-3.5" /> 削除
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Agent Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-[28px] flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                        background: agent.iconBg,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    }}
                >
                    {agent.icon}
                </div>
                <div className="pt-1">
                    <h3
                        className="text-[17px] font-semibold text-[#e8e8f0] mb-1"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                        {agent.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-[10px] px-2 py-0.5 rounded-md"
                            style={{
                                background: "rgba(139, 92, 246, 0.08)",
                                border: "1px solid rgba(139, 92, 246, 0.15)",
                                color: "#a78bfa",
                            }}
                        >
                            {agent.personality}
                        </span>
                    </div>
                </div>
            </div>

            {/* Specialty */}
            <div className="text-[11px] text-[#6b6b80] mb-2 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#f59e0b]" />
                {agent.specialty}
            </div>

            {/* Description */}
            <p className="text-[13px] text-[#a1a1b5] leading-relaxed mb-5">
                {agent.description}
            </p>

            {/* Stats & Action */}
            <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#6b6b80]">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {agent.conversations} 会話
                    </span>
                    {agent.rating > 0 && (
                        <span className="flex items-center gap-1 text-[12px] text-[#f59e0b]">
                            <Star className="w-3.5 h-3.5 fill-[#f59e0b]" />
                            {agent.rating}
                        </span>
                    )}
                </div>
                <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
                    style={{
                        background:
                            agent.status === "active"
                                ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                                : "rgba(139,92,246,0.15)",
                        color: agent.status === "active" ? "white" : "#a78bfa",
                        boxShadow:
                            agent.status === "active"
                                ? "0 4px 12px rgba(139,92,246,0.3)"
                                : "none",
                        border: agent.status === "active" ? "none" : "1px solid rgba(139,92,246,0.2)",
                    }}
                >
                    <Play className="w-3 h-3" />
                    {agent.status === "active" ? "チャット開始" : "有効化"}
                </button>
            </div>
        </div>
    );
}

export default function AgentsPage() {
    return (
        <AppShell
            title="AIエージェント"
            subtitle="あなた専用のAIパートナーを管理する"
        >
            <div className="max-w-[1100px]">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-[13px] text-[#a1a1b5]">
                        <span className="text-[#e8e8f0] font-semibold">{agents.filter(a => a.isOwn).length}</span>{" "}
                        件のエージェントを管理中
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
                        新規エージェント
                    </button>
                </div>

                {/* Template Quick Start */}
                <div
                    className="rounded-2xl p-5 mb-8"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(6,182,212,0.04))",
                        border: "1px solid rgba(139,92,246,0.12)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                        <span className="text-[14px] font-semibold text-[#e8e8f0]">
                            テンプレートからクイック作成
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {templates.map((t, i) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={i}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg"
                                    style={{
                                        background: `${t.color}08`,
                                        border: `1px solid ${t.color}18`,
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: `${t.color}15`,
                                            border: `1px solid ${t.color}25`,
                                        }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: t.color }} />
                                    </div>
                                    <div className="text-[13px] font-medium text-[#e8e8f0]">
                                        {t.name}
                                    </div>
                                    <div className="text-[10px] text-[#6b6b80]">{t.desc}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {agents.map((agent, i) => (
                        <div
                            key={agent.id}
                            className="animate-in"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <AgentCard agent={agent} />
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
