"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { ReactNode } from "react";

interface AppShellProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
    return (
        <div className="flex min-h-screen">
            {/* Background Effects */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div
                className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
                style={{
                    background: "#8b5cf6",
                    filter: "blur(150px)",
                    opacity: 0.06,
                    top: "-150px",
                    left: "-150px",
                    animation: "orb1 20s ease-in-out infinite alternate",
                }}
            />
            <div
                className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0"
                style={{
                    background: "#06b6d4",
                    filter: "blur(150px)",
                    opacity: 0.05,
                    bottom: "-120px",
                    right: "-120px",
                    animation: "orb2 25s ease-in-out infinite alternate",
                }}
            />

            <Sidebar />

            <main className="flex-1 ml-[260px] relative z-10 transition-all duration-300">
                <TopBar title={title} subtitle={subtitle} />
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
