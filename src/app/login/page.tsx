"use client";

import {
    Sparkles,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div
                className="fixed w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: "#8b5cf6",
                    filter: "blur(150px)",
                    opacity: 0.08,
                    top: "-100px",
                    right: "-100px",
                    animation: "orb1 20s ease-in-out infinite alternate",
                }}
            />
            <div
                className="fixed w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: "#06b6d4",
                    filter: "blur(150px)",
                    opacity: 0.06,
                    bottom: "-100px",
                    left: "-100px",
                    animation: "orb2 25s ease-in-out infinite alternate",
                }}
            />

            <div className="relative z-10 w-full max-w-[420px] px-6 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{
                            background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                            boxShadow: "0 0 30px rgba(139,92,246,0.3)",
                        }}
                    >
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h1
                        className="text-[28px] font-bold text-[#e8e8f0] mb-2"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                        お帰りなさい
                    </h1>
                    <p className="text-[13px] text-[#6b6b80]">
                        COCOROにログインして、AIとの対話を続けましょう
                    </p>
                </div>

                {/* Form */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: "rgba(13, 13, 18, 0.8)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-[11px] text-[#6b6b80] tracking-wider uppercase mb-2">
                            メールアドレス
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-[11px] text-[#6b6b80] tracking-wider uppercase mb-2">
                            パスワード
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワードを入力"
                                className="input-field pl-10 pr-10"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-[#6b6b80]" />
                                ) : (
                                    <Eye className="w-4 h-4 text-[#6b6b80]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right mb-6">
                        <a
                            href="#"
                            className="text-[12px] text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                        >
                            パスワードを忘れた方
                        </a>
                    </div>

                    {/* Login Button */}
                    <Link href="/">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
                            style={{
                                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                                color: "white",
                                boxShadow: "0 4px 18px rgba(139,92,246,0.35)",
                                border: "none",
                            }}
                        >
                            ログイン
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                        <span className="text-[11px] text-[#6b6b80]">または</span>
                        <div
                            className="flex-1 h-px"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[13px] cursor-pointer transition-all hover:border-[rgba(255,255,255,0.15)]"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#a1a1b5",
                            }}
                        >
                            <span className="text-[16px]">G</span>
                            Googleでログイン
                        </button>
                        <button
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[13px] cursor-pointer transition-all hover:border-[rgba(255,255,255,0.15)]"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#a1a1b5",
                            }}
                        >
                            <span className="text-[16px]">🍎</span>
                            Appleでログイン
                        </button>
                    </div>
                </div>

                {/* Signup Link */}
                <div className="text-center mt-6">
                    <span className="text-[13px] text-[#6b6b80]">
                        アカウントをお持ちでないですか？{" "}
                    </span>
                    <Link
                        href="/signup"
                        className="text-[13px] text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
                    >
                        新規登録 →
                    </Link>
                </div>
            </div>
        </div>
    );
}
