"use client";

import AppShell from "@/components/AppShell";
import {
    Send,
    Sparkles,
    Bot,
    User,
    Copy,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    ChevronDown,
    Zap,
    MessageCircle,
    Code,
    Languages,
    Lightbulb,
    FileText,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

interface ChatThread {
    id: number;
    title: string;
    lastMessage: string;
    time: string;
    unread: boolean;
}

const mockThreads: ChatThread[] = [
    {
        id: 1,
        title: "プロジェクト企画書の作成",
        lastMessage: "構成案を3パターン提案します...",
        time: "2分前",
        unread: true,
    },
    {
        id: 2,
        title: "React TypeScript の質問",
        lastMessage: "useCallbackの最適な使い方...",
        time: "1時間前",
        unread: false,
    },
    {
        id: 3,
        title: "英語論文の翻訳",
        lastMessage: "翻訳が完了しました。以下...",
        time: "3時間前",
        unread: false,
    },
    {
        id: 4,
        title: "ビジネスアイデアの壁打ち",
        lastMessage: "そのアイデアには3つの...",
        time: "昨日",
        unread: false,
    },
    {
        id: 5,
        title: "Python データ分析",
        lastMessage: "pandasを使って効率的に...",
        time: "2日前",
        unread: false,
    },
];

const personas = [
    {
        name: "COCORO",
        icon: "✦",
        color: "#8b5cf6",
        desc: "汎用アシスタント",
    },
    {
        name: "Scholar",
        icon: "🎓",
        color: "#06b6d4",
        desc: "学術リサーチャー",
    },
    {
        name: "Coder",
        icon: "⌨️",
        color: "#34d399",
        desc: "プログラミング専門",
    },
    {
        name: "Creator",
        icon: "🎨",
        color: "#f472b6",
        desc: "クリエイティブAI",
    },
];

const quickActions = [
    { icon: Code, label: "コード生成", color: "#34d399" },
    { icon: Languages, label: "翻訳", color: "#06b6d4" },
    { icon: Lightbulb, label: "アイデア", color: "#f59e0b" },
    { icon: FileText, label: "要約", color: "#f472b6" },
];

const initialMessages: Message[] = [
    {
        id: 1,
        role: "assistant",
        content:
            "こんにちは！COCORO AIです。✦\n\n私はあなたの知的パートナーとして、以下のようなことをお手伝いできます：\n\n• 💡 アイデアの壁打ち・ブレインストーミング\n• 📝 文章の作成・推敲\n• 💻 コードの生成・レビュー\n• 🌐 翻訳・多言語対応\n• 📊 データの分析・要約\n\n何でもお気軽に聞いてください！",
        timestamp: "10:00",
    },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [activeThread, setActiveThread] = useState(1);
    const [activePersona, setActivePersona] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: messages.length + 1,
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages([...messages, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: generateResponse(input),
                timestamp: new Date().toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <AppShell
            title="AIチャット"
            subtitle="あなたの知的パートナーと対話する"
        >
            <div
                className="flex gap-0 -m-8 h-[calc(100vh-73px)]"
                style={{ margin: "-32px" }}
            >
                {/* Thread List */}
                <div
                    className="w-[280px] flex-shrink-0 flex flex-col h-full"
                    style={{
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(10,10,16,0.5)",
                    }}
                >
                    <div className="p-4">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
                            style={{
                                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                                color: "white",
                                boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
                                border: "none",
                            }}
                        >
                            <MessageCircle className="w-4 h-4" />
                            新しいチャット
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {mockThreads.map((thread) => (
                            <button
                                key={thread.id}
                                onClick={() => setActiveThread(thread.id)}
                                className="w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer"
                                style={{
                                    background:
                                        activeThread === thread.id
                                            ? "rgba(139,92,246,0.1)"
                                            : "transparent",
                                    border:
                                        activeThread === thread.id
                                            ? "1px solid rgba(139,92,246,0.2)"
                                            : "1px solid transparent",
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[13px] font-medium text-[#e8e8f0] truncate">
                                        {thread.title}
                                    </span>
                                    {thread.unread && (
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{
                                                background: "#8b5cf6",
                                                boxShadow: "0 0 6px rgba(139,92,246,0.5)",
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="text-[11px] text-[#6b6b80] truncate">
                                    {thread.lastMessage}
                                </div>
                                <div className="text-[10px] text-[#4a4a5e] mt-1">
                                    {thread.time}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col h-full">
                    {/* Persona Selector */}
                    <div
                        className="flex items-center gap-3 px-6 py-3"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                        <span className="text-[11px] text-[#6b6b80] tracking-wider uppercase">
                            AI人格:
                        </span>
                        <div className="flex gap-2">
                            {personas.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePersona(i)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-all"
                                    style={{
                                        background:
                                            activePersona === i
                                                ? `${p.color}18`
                                                : "transparent",
                                        border:
                                            activePersona === i
                                                ? `1px solid ${p.color}40`
                                                : "1px solid transparent",
                                        color:
                                            activePersona === i ? p.color : "#6b6b80",
                                    }}
                                >
                                    <span>{p.icon}</span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 animate-in ${msg.role === "user" ? "justify-end" : ""
                                    }`}
                            >
                                {msg.role === "assistant" && (
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[14px]"
                                        style={{
                                            background: `linear-gradient(135deg, ${personas[activePersona].color}, ${personas[activePersona].color}88)`,
                                            boxShadow: `0 0 12px ${personas[activePersona].color}30`,
                                        }}
                                    >
                                        {personas[activePersona].icon}
                                    </div>
                                )}
                                <div
                                    className={`max-w-[70%] ${msg.role === "user" ? "order-first" : ""
                                        }`}
                                >
                                    <div
                                        className="rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line"
                                        style={{
                                            background:
                                                msg.role === "user"
                                                    ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.15))"
                                                    : "rgba(19, 19, 28, 0.8)",
                                            border:
                                                msg.role === "user"
                                                    ? "1px solid rgba(139,92,246,0.25)"
                                                    : "1px solid rgba(255,255,255,0.06)",
                                            color: "#e8e8f0",
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5 px-1">
                                        <span className="text-[10px] text-[#4a4a5e]">
                                            {msg.timestamp}
                                        </span>
                                        {msg.role === "assistant" && (
                                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 rounded cursor-pointer hover:bg-white/[0.04]">
                                                    <Copy className="w-3 h-3 text-[#6b6b80]" />
                                                </button>
                                                <button className="p-1 rounded cursor-pointer hover:bg-white/[0.04]">
                                                    <ThumbsUp className="w-3 h-3 text-[#6b6b80]" />
                                                </button>
                                                <button className="p-1 rounded cursor-pointer hover:bg-white/[0.04]">
                                                    <ThumbsDown className="w-3 h-3 text-[#6b6b80]" />
                                                </button>
                                                <button className="p-1 rounded cursor-pointer hover:bg-white/[0.04]">
                                                    <RefreshCw className="w-3 h-3 text-[#6b6b80]" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {msg.role === "user" && (
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-semibold"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #f472b6, #8b5cf6)",
                                        }}
                                    >
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 animate-in">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[14px]"
                                    style={{
                                        background: `linear-gradient(135deg, ${personas[activePersona].color}, ${personas[activePersona].color}88)`,
                                    }}
                                >
                                    {personas[activePersona].icon}
                                </div>
                                <div
                                    className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                                    style={{
                                        background: "rgba(19, 19, 28, 0.8)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full bg-[#8b5cf6]"
                                        style={{
                                            animation: "typing-dot 1.4s infinite",
                                            animationDelay: "0s",
                                        }}
                                    />
                                    <span
                                        className="w-2 h-2 rounded-full bg-[#8b5cf6]"
                                        style={{
                                            animation: "typing-dot 1.4s infinite",
                                            animationDelay: "0.2s",
                                        }}
                                    />
                                    <span
                                        className="w-2 h-2 rounded-full bg-[#8b5cf6]"
                                        style={{
                                            animation: "typing-dot 1.4s infinite",
                                            animationDelay: "0.4s",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 pb-2 flex gap-2">
                        {quickActions.map((action, i) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={i}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:scale-105"
                                    style={{
                                        background: `${action.color}10`,
                                        border: `1px solid ${action.color}25`,
                                        color: action.color,
                                    }}
                                >
                                    <Icon className="w-3 h-3" />
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="px-6 pb-6 pt-2">
                        <div
                            className="flex items-end gap-3 p-3 rounded-2xl"
                            style={{
                                background: "rgba(19, 19, 28, 0.8)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="メッセージを入力... (Shift+Enter で改行)"
                                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#e8e8f0] placeholder-[#6b6b80] resize-none max-h-[120px] min-h-[40px]"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
                                style={{
                                    background: input.trim()
                                        ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                                        : "rgba(139,92,246,0.15)",
                                    boxShadow: input.trim()
                                        ? "0 4px 14px rgba(139,92,246,0.3)"
                                        : "none",
                                }}
                            >
                                <Send
                                    className="w-4 h-4"
                                    style={{
                                        color: input.trim() ? "white" : "rgba(139,92,246,0.4)",
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function generateResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("コード") || lower.includes("プログラ")) {
        return `コード生成のご依頼ですね！✨\n\n以下はサンプルコードです：\n\n\`\`\`typescript\nconst greeting = (name: string): string => {\n  return \`Hello, \${name}! Welcome to COCORO.\`;\n};\n\nconsole.log(greeting("User"));\n\`\`\`\n\nこのコードは TypeScript で書かれた簡単な挨拶関数です。何か具体的なコードを生成しましょうか？`;
    }
    if (lower.includes("翻訳") || lower.includes("英語")) {
        return `翻訳のお手伝いをします！🌐\n\n翻訳したいテキストを入力してください。以下の言語に対応しています：\n\n• 🇯🇵 日本語 ↔ 🇺🇸 英語\n• 🇯🇵 日本語 ↔ 🇨🇳 中国語\n• 🇯🇵 日本語 ↔ 🇰🇷 韓国語\n• その他多数の言語\n\nどの言語への翻訳をご希望ですか？`;
    }
    if (lower.includes("アイデア") || lower.includes("提案")) {
        return `アイデアの壁打ちですね！💡\n\n面白い提案をいくつか考えてみましょう：\n\n1. **AIメンタリングプラットフォーム**\n   個人の学習スタイルに合わせたAIメンターを提供\n\n2. **共同創造スペース**\n   AIと人間がリアルタイムでアートを共同制作\n\n3. **知識グラフSNS**\n   ユーザーの知識を可視化し、関連する専門家同士をマッチング\n\nどのアイデアをもっと深掘りしましょうか？`;
    }
    return `ご質問ありがとうございます！✦\n\n「${input}」について考えてみますね。\n\nこのトピックには複数の視点からアプローチできます。まず、基本的な概念を整理してから、具体的な解決策や提案をお伝えしましょう。\n\nもう少し具体的な情報を教えていただけますか？\n\n• どのような目的で知りたいですか？\n• 特に重要視しているポイントはありますか？\n• 期限や制約条件はありますか？\n\n詳しく教えていただければ、より的確なお答えができます！`;
}
