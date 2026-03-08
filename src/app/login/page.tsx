"use client";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 400)); // UX delay
        const result = login(email, password);
        setLoading(false);
        if (!result.ok) { setError(result.error || "ログインに失敗しました"); return; }
        router.push("/feed");
    };

    return (
        <div style={bg}>
            <div style={orb1} /><div style={orb2} /><div style={grid} />
            <div style={wrap}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={logo}>✦</div>
                    <h1 style={h1}>お帰りなさい</h1>
                    <p style={sub}>COCOROにログインして、AIとの対話を続けましょう</p>
                </div>

                {/* Card */}
                <div style={card}>
                    {error && <div style={errBox}>{error}</div>}

                    {/* Email */}
                    <div style={field}>
                        <label style={label}>メールアドレス</label>
                        <div style={{ position: "relative" }}>
                            <Mail style={ico} />
                            <input style={inp} type="email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleLogin()}
                                placeholder="your@email.com" />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={field}>
                        <label style={label}>パスワード</label>
                        <div style={{ position: "relative" }}>
                            <Lock style={ico} />
                            <input style={{ ...inp, paddingRight: 44 }}
                                type={showPw ? "text" : "password"} value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleLogin()}
                                placeholder="パスワードを入力" />
                            <button onClick={() => setShowPw(!showPw)} style={eyeBtn}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: "right", marginBottom: 22 }}>
                        <a href="#" style={{ fontSize: 12, color: "#8b5cf6" }}>パスワードを忘れた方</a>
                    </div>

                    <button onClick={handleLogin} disabled={loading} style={primaryBtn}>
                        {loading ? "ログイン中…" : "ログイン"}
                        {!loading && <ArrowRight size={16} />}
                    </button>

                    <div style={divider}><div style={line} /><span style={or}>または</span><div style={line} /></div>

                    <button style={socialBtn}><span>G</span> Googleでログイン</button>
                </div>

                <div style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#6b6b80" }}>
                    アカウントをお持ちでないですか？{" "}
                    <Link href="/signup" style={{ color: "#8b5cf6", fontWeight: 500 }}>新規登録 →</Link>
                </div>
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#4a4a5e" }}>
                    <Link href="/" style={{ color: "#4a4a5e" }}>← トップに戻る</Link>
                </div>
            </div>
            <style>{`
              input::placeholder{color:#4a4a5e;}
              input:focus{outline:none;border-color:rgba(139,92,246,0.6)!important;box-shadow:0 0 0 3px rgba(139,92,246,0.1);}
              button:hover:not(:disabled){transform:translateY(-1px);}
              button:disabled{opacity:0.6;cursor:not-allowed;}
            `}</style>
        </div>
    );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const bg: React.CSSProperties = { minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" };
const orb1: React.CSSProperties = { position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "#8b5cf6", filter: "blur(150px)", opacity: 0.08, top: -100, right: -100, pointerEvents: "none" };
const orb2: React.CSSProperties = { position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "#06b6d4", filter: "blur(150px)", opacity: 0.06, bottom: -100, left: -100, pointerEvents: "none" };
const grid: React.CSSProperties = { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" };
const wrap: React.CSSProperties = { position: "relative", zIndex: 10, width: "100%", maxWidth: 420, padding: "0 24px" };
const logo: React.CSSProperties = { width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 26, boxShadow: "0 0 30px rgba(139,92,246,0.3)" };
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: "#e8e8f0", marginBottom: 8, fontFamily: "Space Grotesk,sans-serif" };
const sub: React.CSSProperties = { fontSize: 13, color: "#6b6b80" };
const card: React.CSSProperties = { background: "rgba(13,13,18,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, backdropFilter: "blur(20px)" };
const errBox: React.CSSProperties = { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 };
const field: React.CSSProperties = { marginBottom: 20 };
const label: React.CSSProperties = { display: "block", fontSize: 11, color: "#6b6b80", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 };
const inp: React.CSSProperties = { width: "100%", background: "#13131c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px 12px 42px", color: "#e8e8f0", fontSize: 14, boxSizing: "border-box", transition: "border-color .2s,box-shadow .2s" };
const ico: React.CSSProperties = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#6b6b80", pointerEvents: "none" };
const eyeBtn: React.CSSProperties = { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b6b80", cursor: "pointer", padding: 0 };
const primaryBtn: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 18px rgba(139,92,246,0.35)", transition: "all .2s" };
const divider: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16, margin: "22px 0" };
const line: React.CSSProperties = { flex: 1, height: 1, background: "rgba(255,255,255,0.06)" };
const or: React.CSSProperties = { fontSize: 11, color: "#6b6b80" };
const socialBtn: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 0", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#a1a1b5", fontSize: 13, cursor: "pointer", transition: "all .2s" };
