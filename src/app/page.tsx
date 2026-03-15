"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; }

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🧠", title: "人格OS", desc: "Boot Wizard 40問に答えるだけ。あなたの価値観・思考パターン・感情モデルをAIが学習し、会話するたびに成長します。", color: "#ff69b4" },
  { icon: "🔒", title: "完全プライベート", desc: "クラウド不要。データは手元のminiPCにのみ保存。インターネット接続なしで動作し、あなたの思考が外部に渡ることはありません。", color: "#c084fc" },
  { icon: "🤖", title: "専門家チーム", desc: "弁護士・税理士・エンジニア・クリエイター。あなただけのAI専門家チームがminiPCで24時間稼働します。", color: "#f9a8d4" },
  { icon: "🔗", title: "シンクロ率", desc: "AIとの共鳴度をリアルタイムで可視化。会話を重ねるほどシンクロ率が上昇し、AIがあなた以上にあなたを知っていきます。", color: "#e879f9" },
];

const STEPS = [
  { num: "01", icon: "📦", title: "miniPCにインストール", desc: "COCORO OSをminiPCに焼くだけ。自動セットアップで5分で起動します。", color: "#ff69b4" },
  { num: "02", icon: "🧠", title: "Boot Wizardで人格設定", desc: "40問の対話を通じてAIがあなたの価値観・思考・感情を深く学習します。", color: "#c084fc" },
  { num: "03", icon: "💬", title: "AIと会話・タスク実行", desc: "チャット、タスク自動化、専門家エージェントとの協働が即日スタート。", color: "#f9a8d4" },
];

const AGENTS = [
  { icon: "⚖️", name: "弁護士", role: "Legal Agent", desc: "契約書レビュー・法的リスク分析・権利保護をサポート", color: "#ff69b4", glow: "rgba(255,105,180,0.25)", question: "この契約書のリスクを分析して", answer: "第3条の損害賠償条項に注意が必要です。上限額の設定がなく、無制限の賠償責任を負う可能性があります。修正を推奨します。" },
  { icon: "📊", name: "税理士", role: "Tax Agent", desc: "確定申告・節税対策・経費管理を自動化", color: "#c084fc", glow: "rgba(192,132,252,0.25)", question: "今年の節税対策を教えて", answer: "iDeCoへの拠出額を年間27.6万円に増額すると、所得税・住民税の合計で約8.3万円の節税効果が見込めます。" },
  { icon: "💻", name: "エンジニア", role: "Code Agent", desc: "コードレビュー・バグ修正・技術選定をAIと協働", color: "#f9a8d4", glow: "rgba(249,168,212,0.25)", question: "このAPIのパフォーマンス改善策は？", answer: "N+1クエリが発生しています。JOINを使ったバッチ取得に変更すると、レスポンスタイムを87%削減できます。" },
  { icon: "🔍", name: "リサーチ", role: "Research Agent", desc: "市場調査・競合分析・トレンドレポートを自動生成", color: "#e879f9", glow: "rgba(232,121,249,0.25)", question: "AI市場の最新トレンドをまとめて", answer: "エッジAIとオンプレミス需要が急増中。企業の63%がプライバシー懸念からローカルLLM導入を検討しています。" },
  { icon: "💰", name: "FP", role: "Finance Agent", desc: "資産運用・ポートフォリオ分析・将来シミュレーション", color: "#ff69b4", glow: "rgba(255,105,180,0.25)", question: "老後2000万円問題、どう対策する？", answer: "月3万円をインデックス投資に回すと、30年後に約2,340万円（年利5%想定）。NISA枠を優先活用してください。" },
  { icon: "🏥", name: "医療", role: "Health Agent", desc: "健康管理・症状分析・医療情報のキュレーション", color: "#c084fc", glow: "rgba(192,132,252,0.25)", question: "最近よく眠れないんだけど", answer: "就寝2時間前のブルーライト遮断と、室温18℃設定が効果的です。週3回の有酸素運動も睡眠質を31%向上させます。" },
];

const STATS = [
  { num: "2,847", label: "登録ユーザー数", suffix: "人", color: "#ff69b4" },
  { num: "194,320", label: "処理済みタスク", suffix: "件", color: "#c084fc" },
  { num: "98.7", label: "ユーザー満足度", suffix: "%", color: "#e879f9" },
  { num: "73.4", label: "平均シンクロ率", suffix: "%", color: "#f9a8d4" },
];

const PLANS = [
  { name: "Starter", price: "¥49,800", note: "買い切り（ハードウェア込み）", color: "#ff69b4", glow: "rgba(255,105,180,0.3)", features: ["miniPC（Ryzen 5 / 16GB / 512GB）", "COCORO OS インストール済み", "基本AIアシスタント", "記憶・感情エンジン", "Boot Wizard（40問）", "メールサポート"], cta: "Starterを購入" },
  { name: "Pro", price: "¥89,800", note: "買い切り（ハードウェア込み）", color: "#c084fc", glow: "rgba(192,132,252,0.3)", badge: "人気", features: ["miniPC（Ryzen 7 / 32GB / 1TB NVMe）", "COCORO OS インストール済み", "全専門AIエージェント 6種", "多人格チーム管理", "シンクロ率ダッシュボード", "優先サポート＋オンボーディング"], cta: "Proを購入" },
  { name: "Enterprise", price: "要相談", note: "カスタム見積もり", color: "#e879f9", glow: "rgba(232,121,249,0.3)", features: ["複数ノード構成（チーム・組織向け）", "カスタムエージェント開発", "専用サポートエンジニア", "SLA保証", "オンプレミス導入支援", "API連携・カスタム統合"], cta: "お問い合わせ" },
];

// Quiz data for inline registration form
const QUIZ = [
  { id: "q1", q: "品質とスピードが対立した場合、どちらを優先しますか？", opts: ["品質（確実性重視）", "スピード（効率性重視）", "状況による"] },
  { id: "q2", q: "成功確率30%の大きな挑戦。取り組みますか？", opts: ["取り組む（挑戦重視）", "見送る（安全重視）", "条件次第"] },
  { id: "q3", q: "80%の確信があれば意思決定しますか？", opts: ["する", "しない（95%必要）", "領域による"] },
  { id: "q4", q: "ルールと結果が矛盾する場合、どちらを優先しますか？", opts: ["ルール（原則重視）", "結果（実利重視）", "ケースバイケース"] },
  { id: "q5", q: "問題に直面した時、最初にすることは？", opts: ["データを集める", "直感で仮説を立てる", "関係者に相談する"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}
function useCountUp(target: number, active: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start * 10) / 10);
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ─── SyncMeter ───────────────────────────────────────────────────────────────
function SyncMeter() {
  const [syncVal, setSyncVal] = useState(0);
  const [label, setLabel] = useState("起動中...");
  const labels = ["起動中...", "学習中...", "シンクロ中...", "同期完了 ✓"];
  useEffect(() => {
    const target = 73.4;
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + 0.8, target);
      setSyncVal(Math.floor(cur * 10) / 10);
      const pct = cur / target;
      if (pct < 0.3) setLabel(labels[0]);
      else if (pct < 0.6) setLabel(labels[1]);
      else if (pct < 0.95) setLabel(labels[2]);
      else setLabel(labels[3]);
      if (cur >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bars = 10;
  const filled = Math.round((syncVal / 100) * bars);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
      className="inline-block mt-8 rounded-2xl px-6 py-5 text-left font-mono text-sm"
      style={{ background: "rgba(255,105,180,0.06)", border: "1px solid rgba(255,105,180,0.2)", minWidth: 220 }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔗</span>
        <span className="text-2xl font-bold" style={{ color: "#ff69b4", fontFamily: "'Space Grotesk',sans-serif" }}>{syncVal.toFixed(1)}%</span>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="h-2 flex-1 rounded-sm transition-all duration-100"
            style={{ background: i < filled ? "linear-gradient(90deg,#ff69b4,#c084fc)" : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <div className="text-xs" style={{ color: "#ff69b4" }}>{label}</div>
    </motion.div>
  );
}

// ─── MiniPC 3D Canvas ────────────────────────────────────────────────────────
function MiniPC3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let angle = 0;
    let raf: number;
    const W = 320; const H = 320;
    canvas.width = W; canvas.height = H;
    function project(x: number, y: number, z: number, rot: number) {
      const cosA = Math.cos(rot); const sinA = Math.sin(rot);
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA;
      const cosB = Math.cos(rot * 0.4); const sinB = Math.sin(rot * 0.4);
      const ry2 = y * cosB - rz * sinB;
      const rz2 = y * sinB + rz * cosB;
      const fov = 5; const scale = W / (fov + rz2);
      return { sx: rx * scale + W / 2, sy: ry2 * scale + H / 2 };
    }
    function drawFace(verts: [number,number,number][], col: string, rot: number) {
      const pts = verts.map(([x,y,z]) => project(x,y,z,rot));
      ctx!.beginPath();
      ctx!.moveTo(pts[0].sx, pts[0].sy);
      for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i].sx, pts[i].sy);
      ctx!.closePath();
      ctx!.fillStyle = col;
      ctx!.fill();
      ctx!.strokeStyle = "rgba(255,105,180,0.3)";
      ctx!.lineWidth = 0.8;
      ctx!.stroke();
    }
    // miniPC box: 2.4 wide, 0.5 tall (thin), 1.6 deep
    const W2=1.2, H2=0.25, D2=0.8;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const r = angle;
      // top
      drawFace([[-W2,H2,-D2],[W2,H2,-D2],[W2,H2,D2],[-W2,H2,D2]], "rgba(255,105,180,0.18)", r);
      // front
      drawFace([[-W2,-H2,D2],[W2,-H2,D2],[W2,H2,D2],[-W2,H2,D2]], "rgba(255,105,180,0.28)", r);
      // right
      drawFace([[W2,-H2,-D2],[W2,-H2,D2],[W2,H2,D2],[W2,H2,-D2]], "rgba(192,132,252,0.22)", r);
      // left
      drawFace([[-W2,-H2,D2],[-W2,-H2,-D2],[-W2,H2,-D2],[-W2,H2,D2]], "rgba(192,132,252,0.12)", r);
      // bottom
      drawFace([[-W2,-H2,-D2],[W2,-H2,-D2],[W2,-H2,D2],[-W2,-H2,D2]], "rgba(0,0,0,0.5)", r);
      // back
      drawFace([[W2,-H2,-D2],[-W2,-H2,-D2],[-W2,H2,-D2],[W2,H2,-D2]], "rgba(255,105,180,0.1)", r);
      // LED on front face
      const led = project(W2-0.18, H2-0.08, D2+0.001, r);
      ctx!.beginPath(); ctx!.arc(led.sx, led.sy, 3, 0, Math.PI*2);
      ctx!.fillStyle = `rgba(255,105,180,${0.6+0.4*Math.sin(Date.now()/400)})`;
      ctx!.fill();
      // glow under
      const c = ctx!.createRadialGradient(W/2, H/2+80, 10, W/2, H/2+80, 80);
      c.addColorStop(0, "rgba(255,105,180,0.12)"); c.addColorStop(1, "transparent");
      ctx!.fillStyle = c; ctx!.fillRect(0, 0, W, H);
      angle += 0.008;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} style={{ width: 320, height: 320 }} />
      <div className="absolute bottom-6 text-xs text-center" style={{ color: "rgba(255,105,180,0.6)", fontFamily: "'Space Grotesk',sans-serif" }}>
        COCORO Node v1.0<br />
        <span className="text-gray-600">Ryzen 7 · 32GB · NPU</span>
      </div>
    </div>
  );
}

// ─── Stats Section ────────────────────────────────────────────────────────────
function StatsSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="stats" className="py-20" style={{ padding: "5rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="rounded-3xl p-10 border grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ background: "rgba(13,13,18,0.85)", borderColor: "rgba(255,105,180,0.15)", boxShadow: "0 0 60px rgba(255,105,180,0.05)" }}>
          <motion.div variants={fadeUp} className="text-center md:col-span-4 mb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "#ff69b4" }}>Live Stats</p>
            <h2 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>すでに多くの人が使用中</h2>
          </motion.div>
          {STATS.map((s) => {
            const n = useCountUp(parseFloat(s.num.replace(/,/g,"")), inView);
            const disp = s.num.includes(",") ? Math.floor(n).toLocaleString() : n.toFixed(s.num.includes(".") ? 1 : 0);
            return (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: s.color }}>
                  {disp}{s.suffix}
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Waitlist Section ─────────────────────────────────────────────────────────
function WaitlistSection() {
  const { ref, inView } = useReveal();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const handleSubmit = async () => {
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok && data.success) setState("done");
      else { setErrMsg(data.error ?? "エラーが発生しました"); setState("error"); }
    } catch { setErrMsg("ネットワークエラーが発生しました"); setState("error"); }
  };
  return (
    <section id="waitlist" className="py-28" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border text-xs tracking-widest uppercase"
            style={{ borderColor: "rgba(255,105,180,0.35)", background: "rgba(255,105,180,0.08)", color: "#ff69b4" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            Early Access
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            早期アクセスに<br />
            <span style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              登録する
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-10 leading-relaxed">
            リリース通知・先行割引・ベータ版アクセスを受け取る。<br />
            登録者限定で <span style={{ color: "#ff69b4" }}>¥10,000オフ</span> のクーポンを配布予定。
          </motion.p>
          <motion.div variants={fadeUp}>
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 border text-center"
                  style={{ background: "rgba(255,105,180,0.06)", borderColor: "rgba(255,105,180,0.3)" }}>
                  <div className="text-4xl mb-3">✦</div>
                  <div className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>登録完了！</div>
                  <div className="text-gray-400 text-sm">リリース時にご連絡します。¥10,000 オフクーポンをお送りします。</div>
                </motion.div>
              ) : (
                <motion.div key="form" className="flex flex-col sm:flex-row gap-3 w-full">
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setState("idle"); }}
                    className="rounded-xl px-5 py-4 text-sm outline-none"
                    style={{ flex: "1 1 auto", minWidth: 0, width: "100%", background: "rgba(13,13,18,0.9)", border: "1px solid rgba(255,105,180,0.25)", color: "#e8e8f0" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(255,105,180,0.6)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,105,180,0.25)"}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                  <button onClick={handleSubmit} disabled={state === "loading" || !email}
                    className="px-8 py-4 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 20px rgba(255,105,180,0.35)" }}>
                    {state === "loading" ? "登録中..." : "✦ 登録する"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {state === "error" && (
              <div className="mt-3 text-sm text-red-400" style={{ color: "#f87171" }}>{errMsg}</div>
            )}
            <p className="text-xs text-gray-600 mt-4">スパムはしません。いつでも解約できます。</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COUNT = 80;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1,
    }));
    const colors = ["#ff69b4", "#c084fc", "#f9a8d4", "#e879f9"];
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Draw connections
        particles.slice(i + 1, i + 5).forEach(p2 => {
          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#ff69b4";
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.6 }} />;
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
      style={{ background: scrolled ? "rgba(6,6,8,0.92)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,105,180,0.1)" : "none", transition: "all 0.3s ease" }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
          style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 0 16px rgba(255,105,180,0.4)" }}>✦</div>
        <span className="font-bold text-white tracking-tight">COCORO OS</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        {[["#features","特徴"],["#how","仕組み"],["#agents-showcase","エージェント"],["#pricing","料金"],["#register","登録"]].map(([href,label])=>(
          <a key={href} href={href} className="hover:text-white transition-colors hover:text-pink-400">{label}</a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">ログイン</Link>
        <a href="#register" className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
          style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 0 16px rgba(255,105,180,0.35)" }}>
          始める
        </a>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden" style={{ paddingTop: "clamp(5rem, 12vw, 8rem)", paddingBottom: "5rem", paddingLeft: "clamp(1rem, 5vw, 3rem)", paddingRight: "clamp(1rem, 5vw, 3rem)" }}>
      <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border text-xs tracking-widest uppercase"
          style={{ borderColor: "rgba(255,105,180,0.35)", background: "rgba(255,105,180,0.08)", color: "#ff69b4" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
          Personality AI Operating System
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}>
          あなただけの<br />
          <span style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI人格OS
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          miniPCで動く、完全プライベートなAIアシスタント。<br />
          あなたの価値観・思考・感情を学習し、会話するたびに成長します。
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#register" className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 28px rgba(255,105,180,0.4)" }}>
            今すぐ始める ✦
          </a>
          <a href="#how" className="px-8 py-4 rounded-xl font-semibold text-gray-300 text-base border border-white/10 hover:border-pink-500/30 hover:text-white transition-all">
            デモを見る →
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="flex justify-center gap-12 mt-16 text-center">
          {[{ num: "40問", label: "人格診断" }, { num: "32次元", label: "価値観ベクター" }, { num: "100%", label: "オンプレミス" }].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#ff69b4" }}>{s.num}</div>
              <div className="text-xs text-gray-500 tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
        {/* Sync Meter */}
        <div className="flex justify-center">
          <SyncMeter />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-4 h-6 rounded-full border border-pink-500/30 flex items-start justify-center pt-1">
          <div className="w-0.5 h-2 bg-pink-400/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="features" className="py-28 relative" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ff69b4" }}>Features</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            あなたのAIが、あなたを超える
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">
            クラウドに頼らず、miniPCの中に「もう一人の自分」が生きています
          </motion.p>
        </motion.div>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl p-8 border transition-all"
              style={{ background: "rgba(13,13,18,0.8)", borderColor: `${f.color}20` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              <div className="mt-4 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg,${f.color}40,transparent)` }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="how" className="py-28" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#c084fc" }}>How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            3ステップで始まる
          </h2>
          <p className="text-gray-400">難しい設定は不要。箱から出してすぐ使えます</p>
        </div>
        {/* 3D miniPC visual */}
        <div className="flex justify-center mb-16">
          <div className="rounded-3xl border p-4" style={{ background: "rgba(13,13,18,0.8)", borderColor: "rgba(255,105,180,0.15)" }}>
            <MiniPC3D />
          </div>
        </div>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp}
              className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              {/* Step number circle */}
              <div className="hidden md:flex w-16 h-16 rounded-full items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ background: `${step.color}15`, border: `2px solid ${step.color}40`, color: step.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                {step.num}
              </div>
              {/* Card */}
              <div className="flex-1 min-w-0">
                <motion.div whileHover={{ scale: 1.02 }}
                  className="rounded-2xl p-8 border w-full"
                  style={{ background: "rgba(13,13,18,0.9)", borderColor: `${step.color}25`, boxShadow: `0 0 40px ${step.color}10` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: `${step.color}15`, border: `2px solid ${step.color}40`, color: step.color }}>
                      {step.num}
                    </div>
                    <div className="text-3xl">{step.icon}</div>
                  </div>
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: step.color }}>Step {step.num}</div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              </div>
              {/* Spacer for alternating layout */}
              <div className="hidden md:block w-16 flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Agent Showcase ───────────────────────────────────────────────────────────
function AgentShowcaseSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="agents-showcase" className="py-28" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#e879f9" }}>Agent Showcase</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            あなただけの専門家チーム
          </h2>
          <p className="text-gray-400">6種の専門AIエージェントがminiPCで24時間稼働</p>
        </div>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent) => {
            const [hovered, setHovered] = useState(false);
            return (
              <motion.div key={agent.name} variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className="rounded-2xl p-6 border cursor-default transition-all relative overflow-hidden"
                style={{ background: "rgba(13,13,18,0.85)", borderColor: hovered ? `${agent.color}50` : `${agent.color}20`, boxShadow: hovered ? `0 0 30px ${agent.glow}` : "none", transition: "border-color 0.3s, box-shadow 0.3s" }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${agent.color}12`, border: `1px solid ${agent.color}30`, boxShadow: `0 0 20px ${agent.glow}` }}>
                    {agent.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{agent.name}</div>
                    <div className="text-xs tracking-widest uppercase" style={{ color: agent.color }}>{agent.role}</div>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {hovered ? (
                    <motion.div key="demo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                      className="rounded-xl p-3 text-xs font-mono" style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${agent.color}25` }}>
                      <div className="mb-2">
                        <span style={{ color: "#9ca3af" }}>あなた: </span>
                        <span className="text-gray-200">{agent.question}</span>
                      </div>
                      <div>
                        <span style={{ color: agent.color }}>{agent.name}: </span>
                        <span className="text-gray-300 leading-relaxed">{agent.answer}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <p className="text-gray-400 text-sm leading-relaxed">{agent.desc}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: agent.color }} />
                        <span className="text-xs" style={{ color: agent.color }}>稼働中 — ホバーでデモを表示</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function PricingSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="pricing" className="py-28" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#f9a8d4" }}>Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            シンプルな買い切りモデル
          </h2>
          <p className="text-gray-400">月額不要。miniPCを購入すれば、あとは永久に使い続けられます</p>
        </div>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp} whileHover={{ y: -6 }}
              className="relative rounded-2xl p-8 border flex flex-col"
              style={{ background: "rgba(13,13,18,0.85)", borderColor: plan.badge ? `${plan.color}50` : "rgba(255,255,255,0.07)", boxShadow: plan.badge ? `0 0 40px ${plan.glow}` : "none" }}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `linear-gradient(135deg,${plan.color},#c084fc)`, color: "#fff" }}>{plan.badge}</div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: plan.color }}>{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{plan.price}</div>
                <div className="text-xs text-gray-500">{plan.note}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span style={{ color: plan.color }} className="mt-0.5 flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: plan.badge ? `linear-gradient(135deg,${plan.color},#c084fc)` : "rgba(255,255,255,0.06)", color: plan.badge ? "#fff" : "#ccc", border: plan.badge ? "none" : "1px solid rgba(255,255,255,0.1)", boxShadow: plan.badge ? `0 4px 20px ${plan.glow}` : "none" }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-xs text-gray-600 mt-8">※ 送料・設置費別途。Enterprise は別途見積もり。すべてのプランに初期設定サポートが含まれます。</p>
      </div>
    </section>
  );
}

// ─── Agent Register Section (inline form) ────────────────────────────────────
function AgentRegisterSection() {
  const { ref, inView } = useReveal();
  const [step, setStep] = useState<"intro" | "form" | "done">("intro");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [job, setJob] = useState(""); const [mission, setMission] = useState("");
  const [quiz, setQuiz] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const answered = Object.keys(quiz).filter(k => quiz[k] !== "").length;
  const handleQuiz = useCallback((id: string, val: string) => setQuiz(q => ({ ...q, [id]: val })), []);

  const handleSubmit = async () => {
    if (!name || !email || !job || !mission || answered < 5) { setErr("すべての項目を入力してください"); return; }
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullname: name, nickname: name, email, job, location: "-", quiz, tone: "丁寧", density: "2", mission, blood: "A", receptivity: "50", sns_x: "", sns_instagram: "" }) });
      if (res.ok) setStep("done");
      else setErr("送信に失敗しました。再度お試しください。");
    } catch { setErr("ネットワークエラーが発生しました。"); }
    setLoading(false);
  };

  return (
    <section id="register" className="py-28" style={{ padding: "7rem clamp(1rem, 5vw, 3rem)" }}>
      <div className="max-w-3xl mx-auto">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase text-center mb-4" style={{ color: "#ff69b4" }}>Agent Registration</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white text-center mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            専門家として<br />
            <span style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              エージェントを登録
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 text-center mb-10 leading-relaxed">
            弁護士・税理士・エンジニアとして、あなたの専門知識をAIエージェントに。<br />
            登録すると、他のCOCOROユーザーのminiPCで「あなたの知識」が働きます。
          </motion.p>

          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl p-8 border text-center"
                style={{ background: "rgba(13,13,18,0.9)", borderColor: "rgba(255,105,180,0.2)" }}>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[{ num: "4フェーズ", label: "登録ステップ" }, { num: "10問", label: "価値観診断" }, { num: "無料", label: "エージェント登録" }].map((s) => (
                    <div key={s.label} className="rounded-xl p-4 border" style={{ border: "1px solid rgba(255,105,180,0.15)", background: "rgba(255,105,180,0.05)" }}>
                      <div className="text-xl font-bold mb-1" style={{ color: "#ff69b4", fontFamily: "'Space Grotesk',sans-serif" }}>{s.num}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setStep("form")}
                    className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 text-sm"
                    style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 24px rgba(255,105,180,0.35)" }}>
                    簡易登録フォームへ ✦
                  </button>
                  <Link href="/register"
                    className="px-8 py-4 rounded-xl font-semibold text-gray-300 text-sm border border-white/10 hover:border-pink-500/30 hover:text-white transition-all">
                    フル登録フォームへ →
                  </Link>
                </div>
              </motion.div>
            )}

            {step === "form" && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Basic info */}
                <div className="rounded-2xl p-6 border mb-4" style={{ background: "rgba(13,13,18,0.9)", borderColor: "rgba(255,105,180,0.15)" }}>
                  <div className="text-xs tracking-widest uppercase mb-4" style={{ color: "#ff69b4" }}>基本情報</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[{ placeholder: "氏名 / ニックネーム", val: name, set: setName }, { placeholder: "メールアドレス", val: email, set: setEmail }].map((f, i) => (
                      <input key={i} type={i === 1 ? "email" : "text"} placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{ background: "#13131c", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(255,105,180,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                    ))}
                  </div>
                  <input type="text" placeholder="専門職 / 職業（例：弁護士、エンジニア）" value={job} onChange={e => setJob(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all mb-4"
                    style={{ background: "#13131c", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(255,105,180,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                  <textarea placeholder="エージェントのミッション（例：法的リスクを最小化し、クライアントを守る）" value={mission} onChange={e => setMission(e.target.value)} rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{ background: "#13131c", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(255,105,180,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                </div>

                {/* Mini quiz */}
                <div className="rounded-2xl p-6 border mb-4" style={{ background: "rgba(13,13,18,0.9)", borderColor: "rgba(192,132,252,0.15)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs tracking-widest uppercase" style={{ color: "#c084fc" }}>価値観診断（5問）</div>
                    <div className="text-xs text-gray-500">{answered} / 5</div>
                  </div>
                  <div className="w-full h-1 rounded-full mb-5" style={{ background: "#13131c" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${answered * 20}%`, background: "linear-gradient(90deg,#ff69b4,#c084fc)" }} />
                  </div>
                  <div className="space-y-4">
                    {QUIZ.map(q => (
                      <div key={q.id} className="p-4 rounded-xl" style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-sm text-gray-300 mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{q.q}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {q.opts.map((opt, vi) => (
                            <label key={vi} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs transition-all"
                              style={{ background: quiz[q.id] === String(vi) ? "rgba(255,105,180,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${quiz[q.id] === String(vi) ? "rgba(255,105,180,0.4)" : "rgba(255,255,255,0.07)"}`, color: quiz[q.id] === String(vi) ? "#ff69b4" : "#9ca3af" }}>
                              <input type="radio" name={q.id} className="hidden" onChange={() => handleQuiz(q.id, String(vi))} />
                              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: quiz[q.id] === String(vi) ? "#ff69b4" : "rgba(255,255,255,0.1)" }} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {err && <div className="mb-4 p-3 rounded-xl text-sm text-red-400" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>{err}</div>}

                <div className="flex gap-3">
                  <button onClick={() => setStep("intro")} className="px-6 py-3 rounded-xl text-sm text-gray-400 border border-white/10 hover:border-white/20 transition-all">← 戻る</button>
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 20px rgba(255,105,180,0.3)" }}>
                    {loading ? "送信中…" : "✦ 分身を起動する"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-12 border text-center"
                style={{ background: "rgba(13,13,18,0.9)", borderColor: "rgba(255,105,180,0.3)", boxShadow: "0 0 60px rgba(255,105,180,0.1)" }}>
                <div className="text-6xl mb-6">✦</div>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>起動完了</h3>
                <p className="text-gray-400 mb-2">あなたのデジタル分身の学習が始まります。</p>
                <p className="text-gray-400">24時間以内に確認メールをお送りします。</p>
                <div className="mt-8 text-xs text-gray-600 tracking-widest">COCORO OS — by ANTIGRAVITY</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-16 px-6" style={{ borderColor: "rgba(255,105,180,0.08)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 0 16px rgba(255,105,180,0.4)" }}>✦</div>
              <span className="font-bold text-white tracking-tight">COCORO OS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              あなたの価値観・思考・感情を学習する、世界初のパーソナルAI人格OS。手元のminiPCで完全プライベートに動作します。
            </p>
            <div className="flex gap-4 mt-5">
              {[{ label: "X", href: "https://x.com/mdl_systems" }, { label: "GitHub", href: "https://github.com/mdl-systems" }].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10 hover:border-pink-500/30 hover:text-white transition-colors">{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">プロダクト</h4>
            <ul className="space-y-2">
              {[["#features","特徴"],["#how","仕組み"],["#agents-showcase","エージェント"],["#pricing","料金"],["#register","事前登録"]].map(([href,label])=>(
                <li key={label}><a href={href} className="text-sm text-gray-500 hover:text-pink-400 transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">会社情報</h4>
            <ul className="space-y-2">
              {["MDL Systems","お問い合わせ","プライバシーポリシー","利用規約"].map((l)=>(
                <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-pink-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(255,105,180,0.08)" }}>
          <p className="text-xs text-gray-600">© 2026 MDL Systems / ANTIGRAVITY. All rights reserved.</p>
          <p className="text-xs text-gray-600 tracking-widest">COCORO OS — Personality AI Operating System</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen text-white" style={{ background: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
      {/* Particles */}
      <ParticleCanvas />

      {/* Background orbs */}
      <div className="pointer-events-none fixed rounded-full" style={{ width: 700, height: 700, background: "#ff69b4", top: -200, left: -200, filter: "blur(160px)", opacity: 0.06, zIndex: 0 }} />
      <div className="pointer-events-none fixed rounded-full" style={{ width: 500, height: 500, background: "#c084fc", bottom: -150, right: -150, filter: "blur(140px)", opacity: 0.06, zIndex: 0 }} />
      <div className="pointer-events-none fixed rounded-full" style={{ width: 300, height: 300, background: "#e879f9", top: "60%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(120px)", opacity: 0.05, zIndex: 0 }} />

      {/* Grid */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "linear-gradient(rgba(255,105,180,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,105,180,0.018) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <NavBar />
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowSection />
        <AgentShowcaseSection />
        <PricingSection />
        <WaitlistSection />
        <AgentRegisterSection />
      </main>
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; margin: 0; padding: 0; }
        main { display: block !important; width: 100%; }

        /* Tailwind v4のmargin-inline:autoをmargin:0 autoで上書き（確実な中央揃え） */
        .mx-auto {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .max-w-xl  { max-width: 36rem;  width: 100%; }
        .max-w-2xl { max-width: 42rem;  width: 100%; }
        .max-w-3xl { max-width: 48rem;  width: 100%; }
        .max-w-4xl { max-width: 56rem;  width: 100%; }
        .max-w-5xl { max-width: 64rem;  width: 100%; }
        .max-w-6xl { max-width: 72rem;  width: 100%; }
        .max-w-xs  { max-width: 20rem;  width: 100%; }

        input, textarea { font-family: 'Inter', sans-serif; }
        input::placeholder, textarea::placeholder { color: #4b5563; }
      `}</style>
    </div>
  );
}
