"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home, MessageCircle, Users, User, Bot, Search,
    Settings, ChevronLeft, ChevronRight, LogOut, Plus,
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

const navItems = [
    { href: "/feed", icon: Home, label: "ホーム", badge: null },
    { href: "/chat", icon: MessageCircle, label: "AIチャット", badge: "AI" },
    { href: "/community", icon: Users, label: "コミュニティ", badge: null },
    { href: "/agents", icon: Bot, label: "エージェント", badge: "3" },
    { href: "/profile", icon: User, label: "プロフィール", badge: null },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        setUser(getSession());
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <aside
            className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-[260px]"}`}
            style={{ background: "rgba(10,10,16,0.95)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[18px]"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}>
                    ✦
                </div>
                {!collapsed && (
                    <div className="animate-in">
                        <div className="text-[15px] font-semibold tracking-tight" style={{ fontFamily: "Space Grotesk,sans-serif" }}>COCORO</div>
                        <div className="text-[10px] text-[#6b6b80] tracking-widest uppercase">AI Platform</div>
                    </div>
                )}
                <button onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-10"
                    style={{ background: "#13131c", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {collapsed ? <ChevronRight className="w-3 h-3 text-[#6b6b80]" /> : <ChevronLeft className="w-3 h-3 text-[#6b6b80]" />}
                </button>
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-4 mb-4 animate-in">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer"
                        style={{ background: "rgba(19,19,28,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Search className="w-4 h-4 text-[#6b6b80]" />
                        <span className="text-[13px] text-[#6b6b80]">検索...</span>
                        <span className="ml-auto text-[10px] text-[#6b6b80] px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>⌘K</span>
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
                {!collapsed && <div className="px-3 mb-2 text-[9px] text-[#6b6b80] tracking-[0.15em] uppercase">メニュー</div>}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href === "/feed" && pathname === "/");
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${collapsed ? "justify-center" : ""}`}
                            style={{
                                background: isActive ? "rgba(139,92,246,0.12)" : "transparent",
                                color: isActive ? "#8b5cf6" : "#a1a1b5",
                                border: isActive ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                            }}>
                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: "#8b5cf6", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />}
                            <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? "" : "group-hover:text-[#e8e8f0]"}`} />
                            {!collapsed && (
                                <>
                                    <span className={`text-[13px] font-medium transition-colors ${isActive ? "" : "group-hover:text-[#e8e8f0]"}`}>{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md"
                                            style={{
                                                background: item.badge === "AI" ? "rgba(6,182,212,0.12)" : "rgba(139,92,246,0.12)",
                                                color: item.badge === "AI" ? "#06b6d4" : "#8b5cf6",
                                                border: `1px solid ${item.badge === "AI" ? "rgba(6,182,212,0.2)" : "rgba(139,92,246,0.2)"}`,
                                            }}>{item.badge}</span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* New Post */}
            <div className="px-4 mb-3">
                <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:translate-y-[-1px] ${collapsed ? "px-0" : "px-4"}`}
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow: "0 4px 18px rgba(139,92,246,0.35)", color: "white", fontWeight: 500, fontSize: 13, border: "none" }}>
                    <Plus className="w-4 h-4" />
                    {!collapsed && <span>新規投稿</span>}
                </button>
            </div>

            {/* Bottom Profile */}
            <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/[0.03] ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-semibold"
                        style={{ background: "linear-gradient(135deg,#f472b6,#8b5cf6)" }}>
                        {initials}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#e8e8f0] truncate">{user?.name || "ゲスト"}</div>
                            <div className="text-[11px] text-[#6b6b80] truncate">{user?.email || ""}</div>
                        </div>
                    )}
                    {!collapsed && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Link href="/profile">
                                <Settings className="w-4 h-4 text-[#6b6b80] hover:text-[#a1a1b5] transition-colors" />
                            </Link>
                            <button onClick={handleLogout} title="ログアウト" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                                <LogOut className="w-4 h-4 text-[#6b6b80] hover:text-[#f87171] transition-colors" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
