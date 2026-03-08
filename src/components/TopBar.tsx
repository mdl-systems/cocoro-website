"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
    title: string;
    subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header
            className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
            style={{
                background: "rgba(6, 6, 8, 0.85)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div>
                <h1
                    className="text-[20px] font-semibold text-[#e8e8f0] tracking-tight"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[12px] text-[#6b6b80] mt-0.5">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div
                    className={`flex items-center transition-all duration-300 ${searchOpen ? "w-64" : "w-9"
                        }`}
                >
                    {searchOpen && (
                        <input
                            type="text"
                            placeholder="検索..."
                            className="input-field text-[13px] py-2 pr-9"
                            autoFocus
                            onBlur={() => setSearchOpen(false)}
                        />
                    )}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${searchOpen ? "absolute right-20" : ""
                            }`}
                        style={{
                            background: searchOpen ? "transparent" : "rgba(19,19,28,0.8)",
                            border: searchOpen
                                ? "none"
                                : "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <Search className="w-4 h-4 text-[#6b6b80]" />
                    </button>
                </div>

                {/* Notifications */}
                <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer relative hover:bg-white/[0.04]"
                    style={{
                        background: "rgba(19,19,28,0.8)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <Bell className="w-4 h-4 text-[#6b6b80]" />
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{
                            background: "#f472b6",
                            boxShadow: "0 0 6px rgba(244,114,182,0.5)",
                        }}
                    />
                </button>
            </div>
        </header>
    );
}
