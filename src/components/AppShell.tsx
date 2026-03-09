"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";

interface AppShellProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

const PUBLIC_PATHS = ["/", "/login", "/signup", "/register"];

export default function AppShell({ children, title, subtitle }: AppShellProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (PUBLIC_PATHS.includes(pathname)) { setChecked(true); return; }

        // 1. Cookie ベース JWT セッション確認（サーバーサイド）
        fetch("/api/auth/me", { credentials: "include" })
            .then(async (res) => {
                if (res.ok) {
                    setChecked(true); // Cookie セッション有効
                } else {
                    // 2. フォールバック: localStorage セッション確認
                    const session = getSession();
                    if (session) {
                        setChecked(true);
                    } else {
                        router.replace("/login");
                    }
                }
            })
            .catch(() => {
                // ネットワークエラー時は localStorage にフォールバック
                const session = getSession();
                if (session) { setChecked(true); } else { router.replace("/login"); }
            });
    }, [pathname, router]);

    if (!checked) {
        return (
            <div style={{ minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "#8b5cf6", fontSize: 28, animation: "spin 1s linear infinite" }}>✦</div>
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
                style={{ background: "#8b5cf6", filter: "blur(150px)", opacity: 0.06, top: "-150px", left: "-150px", animation: "orb1 20s ease-in-out infinite alternate" }} />
            <div className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                style={{ background: "#06b6d4", filter: "blur(150px)", opacity: 0.05, bottom: "-120px", right: "-120px", animation: "orb2 25s ease-in-out infinite alternate" }} />

            <Sidebar />

            <main className="flex-1 ml-[260px] relative z-10 transition-all duration-300">
                <TopBar title={title} subtitle={subtitle} />
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
