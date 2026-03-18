"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CocoroLogo from "@/components/CocoroLogo";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "Starter" | "Pro";
type FormStep = "plan" | "info" | "confirm" | "done";

interface OrderFormData {
  plan: Plan;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  address: string;
  buildingName: string;
}

// ─── Plan Data ────────────────────────────────────────────────────────────────
const PLANS: Record<
  Plan,
  {
    name: Plan;
    price: string;
    priceNum: number;
    note: string;
    color: string;
    glow: string;
    badge?: string;
    features: string[];
    spec: string;
  }
> = {
  Starter: {
    name: "Starter",
    price: "¥49,800",
    priceNum: 49800,
    note: "買い切り（ハードウェア込み）",
    color: "#ff69b4",
    glow: "rgba(255,105,180,0.3)",
    features: [
      "miniPC（Ryzen 5 / 16GB / 512GB）",
      "COCORO OS インストール済み",
      "基本AIアシスタント",
      "記憶・感情エンジン",
      "Boot Wizard（40問）",
      "メールサポート",
    ],
    spec: "Ryzen 5 · 16GB · 512GB SSD",
  },
  Pro: {
    name: "Pro",
    price: "¥89,800",
    priceNum: 89800,
    note: "買い切り（ハードウェア込み）",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.3)",
    badge: "人気No.1",
    features: [
      "miniPC（Ryzen 7 / 32GB / 1TB NVMe）",
      "COCORO OS インストール済み",
      "全専門AIエージェント 6種",
      "多人格チーム管理",
      "シンクロ率ダッシュボード",
      "優先サポート＋オンボーディング",
    ],
    spec: "Ryzen 7 · 32GB · 1TB NVMe",
  },
};

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

// ─── Animation ────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// ─── Input Component ──────────────────────────────────────────────────────────
function FormInput({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: "#a1a1b5" }}>
        {label}
        {required && <span style={{ color: "#ff69b4" }} className="ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: "#13131c",
          border: `1px solid ${focused ? "rgba(255,105,180,0.5)" : "rgba(255,255,255,0.08)"}`,
          color: "#e8e8f0",
          boxShadow: focused ? "0 0 0 3px rgba(255,105,180,0.08)" : "none",
        }}
      />
      {hint && <p className="mt-1 text-xs" style={{ color: "#4b5563" }}>{hint}</p>}
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: FormStep }) {
  const steps: { key: FormStep; label: string }[] = [
    { key: "plan", label: "プラン選択" },
    { key: "info", label: "お客様情報" },
    { key: "confirm", label: "確認" },
    { key: "done", label: "完了" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => {
        const isPast = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg,#ff69b4,#c084fc)"
                    : isPast
                    ? "rgba(255,105,180,0.2)"
                    : "rgba(255,255,255,0.05)",
                  color: isActive ? "#fff" : isPast ? "#ff69b4" : "#4b5563",
                  boxShadow: isActive ? "0 0 16px rgba(255,105,180,0.4)" : "none",
                }}
              >
                {isPast ? "✓" : i + 1}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{ color: isActive ? "#ff69b4" : isPast ? "#a1a1b5" : "#4b5563" }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 sm:w-16 h-0.5 mx-1 mb-4 sm:mb-0 transition-all duration-500"
                style={{ background: i < currentIdx ? "rgba(255,105,180,0.4)" : "rgba(255,255,255,0.06)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Plan Select Step ─────────────────────────────────────────────────────────
function PlanStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: Plan;
  onSelect: (p: Plan) => void;
  onNext: () => void;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <h2 className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
        プランを選択
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "#6b6b80" }}>
        ご希望のプランをお選びください。どちらも買い切りでサブスクなし。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {(["Starter", "Pro"] as Plan[]).map((planKey) => {
          const plan = PLANS[planKey];
          const isSelected = selected === planKey;
          return (
            <button
              key={planKey}
              onClick={() => onSelect(planKey)}
              className="relative rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, rgba(255,105,180,0.06), rgba(192,132,252,0.06))`
                  : "rgba(13,13,18,0.9)",
                border: `2px solid ${isSelected ? plan.color : "rgba(255,255,255,0.06)"}`,
                boxShadow: isSelected ? `0 0 32px ${plan.glow}` : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `linear-gradient(135deg,${plan.color},#c084fc)`, color: "#fff" }}
                >
                  {plan.badge}
                </div>
              )}
              {/* Radio */}
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center mb-4 transition-all"
                style={{
                  borderColor: isSelected ? plan.color : "rgba(255,255,255,0.2)",
                  background: isSelected ? plan.color : "transparent",
                }}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="font-bold text-lg mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: plan.color }}>
                {plan.name}
              </div>
              <div className="text-3xl font-bold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                {plan.price}
              </div>
              <div className="text-xs mb-4" style={{ color: "#4b5563" }}>{plan.note}</div>
              <div className="text-xs mb-4 px-2 py-1.5 rounded-lg inline-block" style={{ background: `${plan.color}12`, color: plan.color }}>
                💻 {plan.spec}
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#a1a1b5" }}>
                    <span style={{ color: plan.color }} className="mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 24px rgba(255,105,180,0.35)" }}
      >
        {PLANS[selected].name} プランで進む ✦
      </button>
      <p className="text-center text-xs mt-4" style={{ color: "#374151" }}>
        ※ 送料・設置費別途。Enterprise は
        <a href="mailto:support@cocoro-os.com" style={{ color: "#ff69b4" }}>お問い合わせ</a>ください。
      </p>
    </motion.div>
  );
}

// ─── Info Step ────────────────────────────────────────────────────────────────
function InfoStep({
  form,
  setForm,
  plan,
  onBack,
  onNext,
}: {
  form: OrderFormData;
  setForm: (f: OrderFormData) => void;
  plan: Plan;
  onBack: () => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  const set = (key: keyof OrderFormData) => (v: string) =>
    setForm({ ...form, [key]: v });

  const validate = () => {
    const errs: Partial<Record<keyof OrderFormData, string>> = {};
    if (!form.name.trim()) errs.name = "氏名を入力してください";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "有効なメールアドレスを入力してください";
    if (!form.phone.trim() || !/^[0-9\-+() ]{10,15}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "有効な電話番号を入力してください";
    if (!form.postalCode.trim() || !/^\d{3}-?\d{4}$/.test(form.postalCode))
      errs.postalCode = "郵便番号を正しく入力してください（例: 123-4567）";
    if (!form.prefecture) errs.prefecture = "都道府県を選択してください";
    if (!form.address.trim()) errs.address = "住所を入力してください";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const selectedPlan = PLANS[plan];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      {/* Selected plan reminder */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3 mb-6"
        style={{ background: `${selectedPlan.color}10`, border: `1px solid ${selectedPlan.color}25` }}
      >
        <div className="text-sm font-semibold" style={{ color: selectedPlan.color }}>
          {selectedPlan.name} プラン
        </div>
        <div className="text-sm font-bold text-white">{selectedPlan.price}</div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
        お客様情報
      </h2>
      <p className="text-sm mb-8" style={{ color: "#6b6b80" }}>
        配送先情報を入力してください。すべて必須項目です。
      </p>

      <div className="space-y-4 mb-6">
        {/* 氏名 */}
        <FormInput
          id="name"
          label="氏名"
          placeholder="山田 太郎"
          value={form.name}
          onChange={set("name")}
          required
        />
        {errors.name && <p className="text-xs" style={{ color: "#f87171" }}>{errors.name}</p>}

        {/* Email */}
        <FormInput
          id="email"
          label="メールアドレス"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set("email")}
          required
          hint="注文確認メールをお送りします"
        />
        {errors.email && <p className="text-xs" style={{ color: "#f87171" }}>{errors.email}</p>}

        {/* 電話番号 */}
        <FormInput
          id="phone"
          label="電話番号"
          type="tel"
          placeholder="090-1234-5678"
          value={form.phone}
          onChange={set("phone")}
          required
        />
        {errors.phone && <p className="text-xs" style={{ color: "#f87171" }}>{errors.phone}</p>}

        {/* 郵便番号 */}
        <FormInput
          id="postalCode"
          label="郵便番号"
          placeholder="123-4567"
          value={form.postalCode}
          onChange={set("postalCode")}
          required
        />
        {errors.postalCode && <p className="text-xs" style={{ color: "#f87171" }}>{errors.postalCode}</p>}

        {/* 都道府県 */}
        <div>
          <label htmlFor="prefecture" className="block text-xs font-medium mb-1.5" style={{ color: "#a1a1b5" }}>
            都道府県 <span style={{ color: "#ff69b4" }}>*</span>
          </label>
          <select
            id="prefecture"
            value={form.prefecture}
            onChange={(e) => set("prefecture")(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all appearance-none"
            style={{
              background: "#13131c",
              border: "1px solid rgba(255,255,255,0.08)",
              color: form.prefecture ? "#e8e8f0" : "#4b5563",
            }}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.prefecture && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.prefecture}</p>}
        </div>

        {/* 住所 */}
        <FormInput
          id="address"
          label="市区町村・番地"
          placeholder="渋谷区渋谷1-2-3"
          value={form.address}
          onChange={set("address")}
          required
        />
        {errors.address && <p className="text-xs" style={{ color: "#f87171" }}>{errors.address}</p>}

        {/* マンション名（任意） */}
        <FormInput
          id="buildingName"
          label="マンション名・部屋番号"
          placeholder="COCOROマンション 101号室（任意）"
          value={form.buildingName}
          onChange={set("buildingName")}
          hint="任意"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl text-sm border transition-all hover:border-white/20"
          style={{ color: "#6b6b80", borderColor: "rgba(255,255,255,0.08)" }}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 20px rgba(255,105,180,0.3)" }}
        >
          内容を確認する →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Confirm Step ─────────────────────────────────────────────────────────────
function ConfirmStep({
  form,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  form: OrderFormData;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}) {
  const plan = PLANS[form.plan];
  const rows: { label: string; value: string }[] = [
    { label: "プラン", value: `${plan.name} プラン — ${plan.price}` },
    { label: "氏名", value: form.name },
    { label: "メール", value: form.email },
    { label: "電話番号", value: form.phone },
    { label: "配送先", value: `〒${form.postalCode} ${form.prefecture}${form.address}${form.buildingName ? ` ${form.buildingName}` : ""}` },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <h2 className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
        ご注文内容の確認
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "#6b6b80" }}>
        以下の内容でよろしければ「注文を確定する」ボタンを押してください。
      </p>

      <div
        className="rounded-2xl mb-6 overflow-hidden"
        style={{ border: "1px solid rgba(255,105,180,0.15)" }}
      >
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex gap-4 px-5 py-4"
            style={{
              background: i % 2 === 0 ? "rgba(13,13,18,0.9)" : "rgba(13,13,18,0.6)",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <span className="text-xs w-24 flex-shrink-0 pt-0.5" style={{ color: "#6b6b80" }}>{row.label}</span>
            <span className="text-sm" style={{ color: row.label === "プラン" ? plan.color : "#e8e8f0" }}>
              {row.label === "プラン" ? (
                <span className="font-bold">{row.value}</span>
              ) : row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div
        className="rounded-xl px-5 py-4 mb-6"
        style={{ background: `${plan.color}08`, border: `1px solid ${plan.color}20` }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "#a1a1b5" }}>商品代金（税込・HW込み）</span>
          <span className="text-xl font-bold" style={{ color: plan.color, fontFamily: "'Space Grotesk',sans-serif" }}>
            {plan.price}
          </span>
        </div>
        <p className="text-xs mt-2" style={{ color: "#4b5563" }}>
          ※ 送料・設置費は別途請求となります。担当者よりご案内します。
        </p>
      </div>

      <div
        className="rounded-xl px-4 py-3 mb-6 flex gap-3 items-start"
        style={{ background: "rgba(255,105,180,0.04)", border: "1px solid rgba(255,105,180,0.1)" }}
      >
        <span className="text-lg flex-shrink-0">📬</span>
        <p className="text-xs leading-relaxed" style={{ color: "#a1a1b5" }}>
          ご注文後、担当者より <strong style={{ color: "#ff69b4" }}>3営業日以内</strong> にご連絡いたします。
          お支払い方法・配送日程については担当者よりご案内いたします。
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 rounded-xl text-sm border transition-all hover:border-white/20 disabled:opacity-50"
          style={{ color: "#6b6b80", borderColor: "rgba(255,255,255,0.08)" }}
        >
          ← 戻る
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 24px rgba(255,105,180,0.35)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              送信中...
            </span>
          ) : (
            "✦ 注文を確定する"
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Done Step ────────────────────────────────────────────────────────────────
function DoneStep({ form }: { form: OrderFormData }) {
  const plan = PLANS[form.plan];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
        style={{
          background: "linear-gradient(135deg,rgba(255,105,180,0.15),rgba(192,132,252,0.15))",
          border: "2px solid rgba(255,105,180,0.4)",
          boxShadow: "0 0 48px rgba(255,105,180,0.2)",
        }}
      >
        ✦
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
        ご注文ありがとうございます
      </h2>
      <p className="text-base mb-2" style={{ color: "#a1a1b5" }}>
        <strong style={{ color: "#e8e8f0" }}>{form.name}</strong> 様のご注文を受け付けました。
      </p>
      <p className="text-sm mb-8" style={{ color: "#6b6b80" }}>
        担当者より <strong style={{ color: "#ff69b4" }}>3営業日以内</strong> にご連絡いたします。
      </p>

      {/* Order summary card */}
      <div
        className="rounded-2xl p-6 mb-8 text-left"
        style={{
          background: `${plan.color}08`,
          border: `1px solid ${plan.color}25`,
        }}
      >
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: plan.color }}>ご注文概要</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "プラン", value: `${plan.name} プラン` },
            { label: "金額", value: plan.price },
            { label: "メール", value: form.email },
            { label: "次のステップ", value: "3営業日以内に担当者より連絡" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs mb-0.5" style={{ color: "#4b5563" }}>{label}</div>
              <div className="text-sm font-medium" style={{ color: "#e8e8f0" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div
        className="rounded-2xl p-6 mb-8 text-left"
        style={{ background: "rgba(13,13,18,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#c084fc" }}>次のステップ</p>
        <ol className="space-y-3">
          {[
            "担当者からのメールをお待ちください（3営業日以内）",
            "お支払い方法の確認・ご選択",
            "miniPCの発送手配（約10〜14営業日）",
            "COCORO OS セットアップサポート",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc" }}
              >
                {i + 1}
              </span>
              <span className="text-sm" style={{ color: "#a1a1b5" }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 text-center"
          style={{ background: "linear-gradient(135deg,#ff69b4,#c084fc)", boxShadow: "0 4px 20px rgba(255,105,180,0.3)" }}
        >
          トップページへ
        </Link>
        <a
          href="mailto:support@cocoro-os.com"
          className="px-8 py-3 rounded-xl text-sm border transition-all hover:border-white/20 text-center"
          style={{ color: "#a1a1b5", borderColor: "rgba(255,255,255,0.08)" }}
        >
          お問い合わせ
        </a>
      </div>

      <p className="text-xs mt-6" style={{ color: "#374151" }}>
        ご不明な点は <a href="mailto:support@cocoro-os.com" style={{ color: "#ff69b4" }}>support@cocoro-os.com</a> までお気軽にどうぞ
      </p>
    </motion.div>
  );
}

// ─── Main Order Page ──────────────────────────────────────────────────────────
export default function OrderPage() {
  const [step, setStep] = useState<FormStep>("plan");
  const [form, setForm] = useState<OrderFormData>({
    plan: "Pro",
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    address: "",
    buildingName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // URLパラメータ ?plan=starter|pro から初期プランを読み込み
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get("plan");
    if (planParam === "starter") setForm((prev) => ({ ...prev, plan: "Starter" }));
    else if (planParam === "pro") setForm((prev) => ({ ...prev, plan: "Pro" }));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // POST to cocoro-core /public/register
      const coreUrl = process.env.NEXT_PUBLIC_COCORO_CORE_URL ?? "";
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        price: PLANS[form.plan].priceNum,
        shipping_address: {
          postal_code: form.postalCode,
          prefecture: form.prefecture,
          address: form.address,
          building: form.buildingName || undefined,
        },
        source: "cocoro-website",
        ordered_at: new Date().toISOString(),
      };

      // cocoro-core が利用可能な場合は送信
      if (coreUrl) {
        const res = await fetch(`${coreUrl}/public/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // 失敗してもフォールバックで完了扱い（担当者対応）
        if (!res.ok) {
          console.warn("[order] cocoro-core /public/register failed:", res.status);
        }
      } else {
        // 静的サイト環境：ログのみ（実運用では webhook / email 等に差し替え）
        console.info("[order] order submitted (no core URL):", payload);
      }

      setStep("done");
    } catch (err) {
      console.error("[order] submit error:", err);
      setError("送信中にエラーが発生しました。しばらくしてから再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
      {/* Background orbs */}
      <div className="pointer-events-none fixed rounded-full" style={{ width: 600, height: 600, background: "#ff69b4", top: -200, left: -200, filter: "blur(160px)", opacity: 0.05, zIndex: 0 }} />
      <div className="pointer-events-none fixed rounded-full" style={{ width: 400, height: 400, background: "#c084fc", bottom: -100, right: -100, filter: "blur(140px)", opacity: 0.05, zIndex: 0 }} />
      {/* Grid */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: "linear-gradient(rgba(255,105,180,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,105,180,0.018) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        style={{
          background: scrolled ? "rgba(6,6,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,105,180,0.1)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <CocoroLogo size={32} variant="square" glow />
          <span className="font-bold text-white tracking-tight">COCORO OS</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/#pricing"
            className="text-sm border px-4 py-2 rounded-lg transition-all hover:border-pink-500/30 hover:text-white"
            style={{ color: "#6b6b80", borderColor: "rgba(255,255,255,0.08)" }}
          >
            プランを比較する
          </Link>
        </div>
      </motion.nav>

      {/* Main */}
      <main className="relative z-10 min-h-screen flex items-start justify-center pt-28 pb-20 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border text-xs tracking-widest uppercase"
              style={{ borderColor: "rgba(255,105,180,0.35)", background: "rgba(255,105,180,0.08)", color: "#ff69b4" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              Purchase · 購入申込
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
              COCORO OS を注文する
            </h1>
            <p className="text-sm" style={{ color: "#6b6b80" }}>
              完全プライベートなAI人格OSをあなたのもとへ
            </p>
          </motion.div>

          {/* Step indicator */}
          {step !== "done" && <StepIndicator current={step} />}

          {/* Card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(13,13,18,0.85)",
              border: "1px solid rgba(255,105,180,0.12)",
              boxShadow: "0 0 80px rgba(255,105,180,0.06)",
              backdropFilter: "blur(20px)",
            }}
          >
            <AnimatePresence mode="wait">
              {step === "plan" && (
                <PlanStep
                  key="plan"
                  selected={form.plan}
                  onSelect={(p) => setForm({ ...form, plan: p })}
                  onNext={() => setStep("info")}
                />
              )}
              {step === "info" && (
                <InfoStep
                  key="info"
                  form={form}
                  setForm={setForm}
                  plan={form.plan}
                  onBack={() => setStep("plan")}
                  onNext={() => setStep("confirm")}
                />
              )}
              {step === "confirm" && (
                <ConfirmStep
                  key="confirm"
                  form={form}
                  onBack={() => setStep("info")}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              )}
              {step === "done" && (
                <DoneStep key="done" form={form} />
              )}
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          {step !== "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              {[
                { icon: "🔒", text: "SSL暗号化通信" },
                { icon: "📦", text: "全国配送対応" },
                { icon: "🛡️", text: "30日間サポート保証" },
                { icon: "💬", text: "日本語サポート" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs" style={{ color: "#4b5563" }}>
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; margin: 0; padding: 0; }
        select option { background: #1a1a28; color: #e8e8f0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .mx-auto { margin-left: auto !important; margin-right: auto !important; }
        .max-w-2xl { max-width: 42rem; width: 100%; }
      `}</style>
    </div>
  );
}
