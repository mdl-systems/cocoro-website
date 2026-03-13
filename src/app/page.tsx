"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PricePlan {
  name: string;
  price: string;
  priceNote: string;
  color: string;
  glow: string;
  badge?: string;
  features: string[];
  cta: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🧠",
    title: "人格OS",
    desc: "Boot Wizardで40問に答えるだけ。あなたの価値観・思考パターン・感情モデルをAIが学習し、会話するたびに成長します。",
    color: "#8b5cf6",
  },
  {
    icon: "🔒",
    title: "完全プライベート",
    desc: "クラウド不要。データは手元のminiPCにのみ保存。インターネット接続なしで動作し、あなたの思考が外部に渡ることはありません。",
    color: "#06b6d4",
  },
  {
    icon: "🤖",
    title: "専門家チーム",
    desc: "弁護士・税理士・エンジニア・クリエイター。あなただけのAI専門家チームがminiPCで24時間稼働します。",
    color: "#f472b6",
  },
  {
    icon: "🔗",
    title: "シンクロ率",
    desc: "AIとの共鳴度をリアルタイムで可視化。会話を重ねるほどシンクロ率が上昇し、AIがあなた以上にあなたを知っていきます。",
    color: "#34d399",
  },
];

const PLANS: PricePlan[] = [
  {
    name: "Starter",
    price: "¥49,800",
    priceNote: "買い切り（ハードウェア込み）",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    features: [
      "miniPC（Ryzen 5 / 16GB RAM / 512GB SSD）",
      "cocoro-OS インストール済み",
      "基本AIアシスタント",
      "記憶・感情エンジン",
      "Boot Wizard（40問人格診断）",
      "メールサポート",
    ],
    cta: "Starterを購入",
  },
  {
    name: "Pro",
    price: "¥89,800",
    priceNote: "買い切り（ハードウェア込み）",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
    badge: "人気",
    features: [
      "miniPC（Ryzen 7 / 32GB RAM / 1TB NVMe）",
      "cocoro-OS インストール済み",
      "全専門AIエージェント（弁護士・税理士・エンジニア等）",
      "多人格チーム管理",
      "シンクロ率ダッシュボード",
      "優先サポート＋オンボーディング",
    ],
    cta: "Proを購入",
  },
  {
    name: "Enterprise",
    price: "要相談",
    priceNote: "カスタム見積もり",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.3)",
    features: [
      "複数ノード構成（チーム・組織向け）",
      "カスタムエージェント開発",
      "専用サポートエンジニア",
      "SLA保証",
      "オンプレミス導入支援",
      "API連携・カスタム統合",
    ],
    cta: "お問い合わせ",
  },
];

const CONSOLE_LINES = [
  { delay: 0, text: "$ cocoro boot", color: "#8b5cf6" },
  { delay: 0.4, text: "✦ cocoro-OS v1.0.0 starting...", color: "#e8e8f0" },
  { delay: 0.9, text: "✓ PersonalityEngine initialized", color: "#34d399" },
  { delay: 1.3, text: "✓ MemoryEngine online (42 memories)", color: "#34d399" },
  { delay: 1.7, text: "✓ EmotionAdapter calibrated", color: "#34d399" },
  { delay: 2.1, text: "✓ 6 agents ready [law, tax, code, ...]", color: "#34d399" },
  { delay: 2.6, text: "── Sync Rate: 73.4% ──────────────", color: "#06b6d4" },
  { delay: 3.1, text: "> You: 「明日の打ち合わせの準備して」", color: "#e8e8f0" },
  { delay: 3.7, text: "COCORO: 承知しました。アジェンダを作成します...", color: "#8b5cf6" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Components ──────────────────────────────────────────────────────────────
function Orb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none fixed rounded-full"
      style={{ filter: "blur(140px)", opacity: 0.12, zIndex: 0, ...style }}
    />
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
      style={{
        background: scrolled ? "rgba(6,6,8,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
        >
          ✦
        </div>
        <span className="font-bold text-white tracking-tight">COCORO OS</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <a href="#features" className="hover:text-white transition-colors">特徴</a>
        <a href="#demo" className="hover:text-white transition-colors">デモ</a>
        <a href="#pricing" className="hover:text-white transition-colors">料金</a>
        <a href="#agents" className="hover:text-white transition-colors">エージェント登録</a>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">ログイン</Link>
        <Link
          href="/register"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 16px rgba(139,92,246,0.3)" }}
        >
          始める
        </Link>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
      <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border text-xs tracking-widest uppercase"
          style={{ borderColor: "rgba(139,92,246,0.35)", background: "rgba(139,92,246,0.08)", color: "#8b5cf6" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Personality AI Operating System
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
        >
          あなただけの<br />
          <span style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI人格OS
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          miniPCで動く、完全プライベートなAIアシスタント。<br />
          あなたの価値観・思考・感情を学習し、会話するたびに成長します。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/register"
            className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 4px 28px rgba(139,92,246,0.4)" }}
          >
            今すぐ始める ✦
          </Link>
          <a
            href="#demo"
            className="px-8 py-4 rounded-xl font-semibold text-gray-300 text-base border border-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            デモを見る →
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex justify-center gap-12 mt-16 text-center"
        >
          {[
            { num: "40問", label: "人格診断" },
            { num: "32次元", label: "価値観ベクター" },
            { num: "100%", label: "オンプレミス" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.num}</div>
              <div className="text-xs text-gray-500 tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-4 h-6 rounded-full border border-white/20 flex items-start justify-center pt-1"
        >
          <div className="w-0.5 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="features" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase text-purple-400 mb-4">Features</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            あなたのAIが、あなたを超える
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 max-w-xl mx-auto">
            クラウドに頼らず、miniPCの中に「もう一人の自分」が生きています
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl p-8 border transition-all"
              style={{
                background: "rgba(13,13,18,0.8)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DemoSection() {
  const { ref, inView } = useReveal();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    CONSOLE_LINES.forEach((l, i) => {
      setTimeout(() => setVisibleLines(i + 1), l.delay * 1000 + 300);
    });
  }, [inView]);

  return (
    <section id="demo" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase text-cyan-400 mb-4">Demo</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            AIが生きている
          </h2>
          <p className="text-gray-400">起動からチャットまで、全てあなたのminiPCで完結</p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0f" }}
        >
          {/* Window bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0d0d12" }}>
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-gray-600 font-mono">cocoro-console — bash</span>
          </div>

          {/* Terminal */}
          <div className="p-6 font-mono text-sm min-h-[320px]">
            {CONSOLE_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 leading-relaxed"
                style={{ color: line.color }}
              >
                {line.text}
              </motion.div>
            ))}
            {inView && visibleLines > 0 && visibleLines < CONSOLE_LINES.length && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-purple-400"
              />
            )}
          </div>
        </motion.div>

        {/* Sub features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: "💬", label: "ストリーミングチャット" },
            { icon: "📊", label: "シンクロ率グラフ" },
            { icon: "🧩", label: "エージェント管理" },
            { icon: "📝", label: "記憶・感情ログ" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4 text-center border"
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,13,18,0.6)" }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#f472b6" }}>Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
            シンプルな買い切りモデル
          </h2>
          <p className="text-gray-400">月額不要。miniPCを購入すれば、あとは永久に使い続けられます</p>
        </div>

        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl p-8 border flex flex-col"
              style={{
                background: "rgba(13,13,18,0.8)",
                borderColor: plan.badge ? plan.color + "50" : "rgba(255,255,255,0.07)",
                boxShadow: plan.badge ? `0 0 40px ${plan.glow}` : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `linear-gradient(135deg,${plan.color},#8b5cf6)`, color: "#fff" }}
                >
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: plan.color }}>{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{plan.price}</div>
                <div className="text-xs text-gray-500">{plan.priceNote}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span style={{ color: plan.color }} className="mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: plan.badge
                    ? `linear-gradient(135deg,${plan.color},#8b5cf6)`
                    : "rgba(255,255,255,0.06)",
                  color: plan.badge ? "#fff" : "#ccc",
                  border: plan.badge ? "none" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: plan.badge ? `0 4px 20px ${plan.glow}` : "none",
                }}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center text-xs text-gray-600 mt-8">
          ※ 送料・設置費別途。Enterprise は別途見積もり。すべてのプランに初期設定サポートが含まれます。
        </p>
      </div>
    </section>
  );
}

function AgentRegisterSection() {
  const { ref, inView } = useReveal();
  return (
    <section id="agents" className="py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase text-purple-400 mb-4">Agent Registration</motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}
          >
            専門家として<br />
            <span style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              エージェントを登録
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 mb-10 leading-relaxed">
            弁護士・税理士・エンジニア・クリエイターとして、あなたの専門知識をAIエージェントに。
            登録すると、他のCOCOROユーザーのminiPCで「あなたの知識」が働きます。
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 text-sm"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 4px 24px rgba(139,92,246,0.35)" }}
            >
              エージェント登録フォームへ ✦
            </Link>
          </motion.div>
          {/* Mini feature list */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mt-12 text-center">
            {[
              { num: "4フェーズ", label: "登録ステップ" },
              { num: "10問", label: "価値観診断" },
              { num: "無料", label: "エージェント登録" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 border" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,13,18,0.6)" }}>
                <div className="text-xl font-bold text-purple-400 mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.num}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-16 px-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
              >
                ✦
              </div>
              <span className="font-bold text-white tracking-tight">COCORO OS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              あなたの価値観・思考・感情を学習する、世界初のパーソナルAI人格OS。
              手元のminiPCで完全プライベートに動作します。
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { label: "X", href: "https://x.com/mdl_systems" },
                { label: "GitHub", href: "https://github.com/mdl-systems" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">プロダクト</h4>
            <ul className="space-y-2">
              {["特徴", "料金", "デモ", "エージェント登録"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">会社情報</h4>
            <ul className="space-y-2">
              {["MDL Systems", "お問い合わせ", "プライバシーポリシー", "利用規約"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
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
    <div className="min-h-screen text-white" style={{ background: "#060608", fontFamily: "'Inter', sans-serif" }}>
      {/* Background orbs */}
      <Orb style={{ width: 700, height: 700, background: "#8b5cf6", top: -200, left: -200 }} />
      <Orb style={{ width: 500, height: 500, background: "#06b6d4", bottom: -150, right: -150 }} />
      <Orb style={{ width: 300, height: 300, background: "#f472b6", top: "60%", left: "50%", transform: "translate(-50%,-50%)" }} />

      {/* Grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.014) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <NavBar />

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <PricingSection />
        <AgentRegisterSection />
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
