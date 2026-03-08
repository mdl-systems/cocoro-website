"use client";

import {
    Sparkles,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabels = ["", "弱い", "普通", "強い"];
    const strengthColors = ["", "#f87171", "#f59e0b", "#34d399"];

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
                    background: "#f472b6",
                    filter: "blur(150px)",
                    opacity: 0.07,
                    top: "-100px",
                    left: "-100px",
                    animation: "orb1 20s ease-in-out infinite alternate",
                }}
            />
            <div
                className="fixed w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: "#8b5cf6",
                    filter: "blur(150px)",
                    opacity: 0.06,
                    bottom: "-100px",
                    right: "-100px",
                    animation: "orb2 25s ease-in-out infinite alternate",
                }}
            />

            <div className="relative z-10 w-full max-w-[420px] px-6 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{
                            background: "linear-gradient(135deg, #f472b6, #8b5cf6)",
                            boxShadow: "0 0 30px rgba(244,114,182,0.3)",
                        }}
                    >
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h1
                        className="text-[28px] font-bold text-[#e8e8f0] mb-2"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                        COCOROに参加する
                    </h1>
                    <p className="text-[13px] text-[#6b6b80]">
                        AIと共に知識の新しい地平を開拓しましょう
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
                    {/* Name */}
                    <div className="mb-5">
                        <label className="block text-[11px] text-[#6b6b80] tracking-wider uppercase mb-2">
                            ユーザー名
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ユーザー名を入力"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

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
                    <div className="mb-3">
                        <label className="block text-[11px] text-[#6b6b80] tracking-wider uppercase mb-2">
                            パスワード
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="8文字以上のパスワード"
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

                    {/* Password Strength */}
                    {password.length > 0 && (
                        <div className="mb-6 animate-in">
                            <div className="flex gap-1 mb-1.5">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className="flex-1 h-1 rounded-full transition-all duration-300"
                                        style={{
                                            background:
                                                passwordStrength >= level
                                                    ? strengthColors[passwordStrength]
                                                    : "rgba(255,255,255,0.06)",
                                        }}
                                    />
                                ))}
                            </div>
                            <div
                                className="text-[10px] text-right"
                                style={{ color: strengthColors[passwordStrength] }}
                            >
                                {strengthLabels[passwordStrength]}
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <div className="flex items-start gap-2 mb-6">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 accent-[#8b5cf6]"
                        />
                        <label htmlFor="terms" className="text-[11px] text-[#6b6b80] leading-relaxed">
                            <a href="#" className="text-[#8b5cf6]">利用規約</a>
                            と
                            <a href="#" className="text-[#8b5cf6]">プライバシーポリシー</a>
                            に同意します
                        </label>
                    </div>

                    {/* Signup Button */}
                    <Link href="/">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all hover:translate-y-[-1px]"
                            style={{
                                background: "linear-gradient(135deg, #f472b6, #8b5cf6)",
                                color: "white",
                                boxShadow: "0 4px 18px rgba(244,114,182,0.35)",
                                border: "none",
                            }}
                        >
                            アカウント作成
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

                    {/* Social */}
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
                            Googleで登録
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <span className="text-[13px] text-[#6b6b80]">
                        既にアカウントをお持ちですか？{" "}
                    </span>
                    <Link
                        href="/login"
                        className="text-[13px] text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
                    >
                        ログイン →
                    </Link>
                </div>
            </div>
        </div>
    );
}
