"use client";

import { useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface QuizAnswers {
    [key: string]: string;
}

interface FormData {
    fullname: string;
    nickname: string;
    email: string;
    birthdate: string;
    job: string;
    location: string;
    quiz: QuizAnswers;
    tone: string;
    density: string;
    mission: string;
    blood: string;
    receptivity: string;
    sns_x: string;
    sns_instagram: string;
}

// ─── Astro helpers ───────────────────────────────────────────────────────────
const ZODIAC: [number, number, string][] = [
    [1, 20, "水瓶座"], [2, 19, "魚座"], [3, 21, "牡羊座"], [4, 20, "牡牛座"],
    [5, 21, "双子座"], [6, 21, "蟹座"], [7, 23, "獅子座"], [8, 23, "乙女座"],
    [9, 23, "天秤座"], [10, 23, "蠍座"], [11, 22, "射手座"], [12, 22, "山羊座"],
    [12, 31, "水瓶座"],
];
const ETO = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const KANSHI = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const SHUKU = ["角", "亢", "氐", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫"];

function calcAstro(dateStr: string) {
    const parts = dateStr.split("-").map(Number);
    if (parts.length < 3) return null;
    const [y, m, d] = parts;
    let zodiac = "水瓶座";
    for (const [mm, dd, s] of ZODIAC) {
        if (m < mm || (m === mm && d <= dd)) { zodiac = s; break; }
    }
    const eto = ETO[((y - 4) % 12 + 12) % 12];
    const kanshi = KANSHI[((y - 4) % 10 + 10) % 10];
    const day = Math.floor(new Date(y, m - 1, d).getTime() / 86400000);
    const shuku = SHUKU[((day % 27) + 27) % 27];
    return { zodiac, eto, kanshi, shuku };
}

// ─── Quiz data ───────────────────────────────────────────────────────────────
const QUIZ = [
    { id: "q1", cat: "価値観 — Values", q: "品質とスピードが対立した場合、どちらを優先しますか？", opts: ["品質（確実性重視）", "スピード（効率性重視）", "状況による"] },
    { id: "q2", cat: "価値観 — Courage", q: "成功確率30%の大きな挑戦。取り組みますか？", opts: ["取り組む（挑戦重視）", "見送る（安全重視）", "条件次第"] },
    { id: "q3", cat: "リスク — Risk Tolerance", q: "80%の確信があれば意思決定しますか？", ops: undefined, opts: ["する", "しない（95%必要）", "領域による"] },
    { id: "q4", cat: "倫理 — Honesty", q: "ルールと結果が矛盾する場合、どちらを優先しますか？", opts: ["ルール（原則重視）", "結果（実利重視）", "ケースバイケース"] },
    { id: "q5", cat: "思考 — Logic Style", q: "問題に直面した時、最初にすることは？", opts: ["データを集める", "直感で仮説を立てる", "関係者に相談する"] },
    { id: "q6", cat: "感情 — Empathy", q: "批判を受けた時の反応は？", opts: ["客観的に受け止め改善", "感情的に反応する", "相手の意図を考える"] },
    { id: "q7", cat: "目標 — Growth", q: "目標達成のモチベーション源は？", opts: ["自己成長", "経済的報酬", "社会的貢献"] },
    { id: "q8", cat: "対話 — Communication", q: "重要なフィードバックの伝え方は？", opts: ["直接的に伝える", "婉曲的に伝える", "質問形式で気づかせる"] },
    { id: "q9", cat: "対話 — Honesty × Communication", q: "悪いニュースの伝え方は？", opts: ["即座に正直に", "タイミングを選んで", "解決策と共に"] },
    { id: "q10", cat: "思考 — Logic × Curiosity", q: "データと直感が矛盾する場合は？", opts: ["データに従う", "直感に従う", "追加データを集める"] },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const PHASE_TOTAL = 4;

export default function RegisterPage() {
    const [phase, setPhase] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [registerId, setRegisterId] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState<FormData>({
        fullname: "", nickname: "", email: "", birthdate: "",
        job: "", location: "", quiz: {}, tone: "", density: "",
        mission: "", blood: "", receptivity: "", sns_x: "", sns_instagram: "",
    });

    const astro = form.birthdate ? calcAstro(form.birthdate) : null;
    const answeredCount = Object.keys(form.quiz).filter(k => form.quiz[k] !== "").length;

    // ─── helpers ─────────────────────────────────────────────────────────────
    const set = useCallback((key: keyof FormData, val: string) => {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => { const n = { ...e }; delete n[key]; return n; });
    }, []);

    const setQuiz = useCallback((q: string, v: string) => {
        setForm(f => ({ ...f, quiz: { ...f.quiz, [q]: v } }));
        setErrors(e => { const n = { ...e }; delete n.quiz; return n; });
    }, []);

    // ─── validation ──────────────────────────────────────────────────────────
    const validate = useCallback((p: number): boolean => {
        const errs: Record<string, string> = {};
        if (p === 1) {
            if (!form.fullname.trim()) errs.fullname = "氏名を入力してください";
            if (!form.nickname.trim()) errs.nickname = "ニックネームを入力してください";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "有効なメールアドレスを入力してください";
            if (!form.birthdate) errs.birthdate = "生年月日を入力してください";
            if (!form.job.trim()) errs.job = "職業を入力してください";
            if (!form.location.trim()) errs.location = "居住地を入力してください";
        }
        if (p === 2) {
            if (answeredCount < 10) errs.quiz = "全10問に回答してください";
        }
        if (p === 3) {
            if (!form.tone) errs.tone = "対話トーンを選択してください";
            if (!form.density) errs.density = "情報密度を選択してください";
            if (!form.mission.trim()) errs.mission = "ミッションを入力してください";
        }
        if (p === 4) {
            if (!form.blood) errs.blood = "血液型を選択してください";
            if (!form.receptivity) errs.receptivity = "受容度を選択してください";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [form, answeredCount]);

    const next = useCallback(() => {
        if (validate(phase)) setPhase(p => p + 1);
    }, [phase, validate]);

    const prev = useCallback(() => setPhase(p => p - 1), []);

    // ─── submit ──────────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async () => {
        if (!validate(4)) return;
        setSubmitting(true);
        setSubmitError("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setSubmitError(data.error ?? "送信に失敗しました");
                setSubmitting(false);
                return;
            }
            setRegisterId(data.id);
            setSubmitted(true);
        } catch {
            setSubmitError("ネットワークエラーが発生しました。再度お試しください。");
            setSubmitting(false);
        }
    }, [form, validate]);

    // ─── progress ────────────────────────────────────────────────────────────
    const progPct = ((phase - 1) / (PHASE_TOTAL - 1)) * 100;

    if (submitted) {
        return (
            <div className="reg-page">
                <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" /><div className="bg-grid" />
                <div className="reg-wrap">
                    <div className="succ-screen">
                        <div className="succ-icon">✦</div>
                        <h2 className="succ-title">起動完了</h2>
                        <p className="succ-sub">
                            あなたのデジタル分身の学習が始まります。<br />
                            24時間以内に確認メールをお送りします。
                        </p>
                        {registerId && (
                            <p className="succ-id">登録ID: <code>{registerId}</code></p>
                        )}
                        <div className="succ-footer">COCORO OS — by ANTIGRAVITY</div>
                    </div>
                </div>
                <style>{styles}</style>
            </div>
        );
    }

    return (
        <div className="reg-page">
            <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" /><div className="bg-grid" />

            <div className="reg-wrap">
                {/* Header */}
                <div className="reg-header">
                    <div className="badge"><span className="dot" />COCORO OS — MINI PC</div>
                    <h1 className="reg-h1">あなたの<span className="grad">分身</span>を、<br />ここから起動する。</h1>
                    <p className="reg-sub">AIエージェントがあなたの思考・価値観・感情パターンを学習し、デジタルの自分として機能します。</p>
                </div>

                {/* Progress */}
                <div className="prog-wrap">
                    <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${progPct}%` }} />
                    </div>
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className={`prog-dot ${phase > n ? "done" : phase === n ? "active" : ""}`}>
                            <div className="prog-circle">{phase > n ? "✓" : n}</div>
                            <div className="prog-label">{["基本情報", "10問診断", "エージェント", "宿命属性"][n - 1]}</div>
                        </div>
                    ))}
                </div>

                {/* ===== Phase 1 ===== */}
                {phase === 1 && (
                    <div className="phase">
                        <div className="ph-num">Phase 01 / 04</div>
                        <div className="ph-title">基本情報 — デジタル・スケルトン</div>
                        <div className="ph-desc">AIの「外殻」を構築します。<span className="req-star">★</span> は必須項目です。</div>

                        <div className="card">
                            <Field label="氏名" required error={errors.fullname}>
                                <input className={`inp ${errors.fullname ? "invalid" : ""}`} type="text" placeholder="山田 太郎"
                                    value={form.fullname} onChange={e => set("fullname", e.target.value)} />
                            </Field>
                            <Field label="AIに呼ばれたい名前" required error={errors.nickname}>
                                <input className={`inp ${errors.nickname ? "invalid" : ""}`} type="text" placeholder="タロウ、Taro …"
                                    value={form.nickname} onChange={e => set("nickname", e.target.value)} />
                            </Field>
                            <Field label="メールアドレス" required error={errors.email}>
                                <input className={`inp ${errors.email ? "invalid" : ""}`} type="email" placeholder="your@email.com"
                                    value={form.email} onChange={e => set("email", e.target.value)} />
                            </Field>
                        </div>

                        <div className="card">
                            <Field label="生年月日" required error={errors.birthdate}>
                                <input className={`inp ${errors.birthdate ? "invalid" : ""}`} type="date"
                                    min="1900-01-01" max="2026-12-31"
                                    value={form.birthdate} onChange={e => set("birthdate", e.target.value)} />
                                {astro && (
                                    <div className="auto-tags">
                                        {[`♈ 星座: ${astro.zodiac}`, `🐉 干支: ${astro.eto}`, `☯ 日干: ${astro.kanshi}`, `✦ 星宿: ${astro.shuku}宿`].map(t => (
                                            <span key={t} className="auto-tag">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div className="card">
                            <div className="row2">
                                <Field label="職業 / 役割" required error={errors.job}>
                                    <input className={`inp ${errors.job ? "invalid" : ""}`} type="text" placeholder="エンジニア、経営者 …"
                                        value={form.job} onChange={e => set("job", e.target.value)} />
                                </Field>
                                <Field label="居住地" required error={errors.location}>
                                    <input className={`inp ${errors.location ? "invalid" : ""}`} type="text" placeholder="東京都"
                                        value={form.location} onChange={e => set("location", e.target.value)} />
                                </Field>
                            </div>
                        </div>

                        <div className="nav"><div /><button className="btn primary" onClick={next}>次へ →</button></div>
                    </div>
                )}

                {/* ===== Phase 2 ===== */}
                {phase === 2 && (
                    <div className="phase">
                        <div className="ph-num">Phase 02 / 04</div>
                        <div className="ph-title">10問診断 — 思考アルゴリズム</div>
                        <div className="ph-desc">あなたの判断軸・価値観をAIに学習させます。直感で選んでください。</div>

                        <div className="q-progress-bar">
                            <div className="q-bar-track"><div className="q-bar-fill" style={{ width: `${answeredCount * 10}%` }} /></div>
                            <span className="q-count">{answeredCount} / 10</span>
                        </div>

                        {errors.quiz && <div className="global-err">{errors.quiz}</div>}

                        {QUIZ.map((q) => (
                            <div key={q.id} className="card">
                                <div className="q-cat">{q.cat}</div>
                                <div className="q-text">{q.q}</div>
                                <div className="choice-group">
                                    {q.opts.map((opt, vi) => (
                                        <label key={vi} className={`choice-label ${form.quiz[q.id] === String(vi) ? "selected" : ""}`}>
                                            <input type="radio" name={q.id} value={String(vi)}
                                                checked={form.quiz[q.id] === String(vi)}
                                                onChange={() => setQuiz(q.id, String(vi))} />
                                            <span className="choice-dot" />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="nav">
                            <button className="btn ghost" onClick={prev}>← 戻る</button>
                            <button className="btn primary" onClick={next}>次へ →</button>
                        </div>
                    </div>
                )}

                {/* ===== Phase 3 ===== */}
                {phase === 3 && (
                    <div className="phase">
                        <div className="ph-num">Phase 03 / 04</div>
                        <div className="ph-title">エージェント設定 — 振る舞いの定義</div>
                        <div className="ph-desc">作成されたAIがどう振る舞うかを決めます。</div>

                        <div className="card">
                            <Field label="対話トーン" required error={errors.tone}>
                                <div className="choice-group">
                                    {[["丁寧", "🎩", "敬語"], ["フランク", "😎", "親友"], ["メンター", "🦅", "厳格"]].map(([v, ic, sub]) => (
                                        <label key={v} className={`choice-label col ${form.tone === v ? "selected" : ""}`}>
                                            <input type="radio" name="tone" value={v} checked={form.tone === v} onChange={() => set("tone", v)} />
                                            <span className="choice-dot" />
                                            <span className="choice-emoji">{ic}</span>
                                            <span>{v}</span>
                                            <span className="choice-sub">{sub}</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        <div className="card">
                            <Field label="情報の密度" required error={errors.density}>
                                <div className="choice-group">
                                    {[["1", "結論のみ", "端的に"], ["2", "バランス", "要点＋補足"], ["3", "詳細に", "プロセスも"]].map(([v, label, sub]) => (
                                        <label key={v} className={`choice-label col ${form.density === v ? "selected" : ""}`}>
                                            <input type="radio" name="density" value={v} checked={form.density === v} onChange={() => set("density", v)} />
                                            <span className="choice-dot" />
                                            <span>{label}</span>
                                            <span className="choice-sub">{sub}</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        <div className="card">
                            <Field label="主要ミッション" required error={errors.mission}>
                                <textarea className={`inp ta ${errors.mission ? "invalid" : ""}`} rows={4}
                                    placeholder="例：良き壁打ち相手として思考を整理する / タスク管理の鬼として締め切りを守らせる"
                                    value={form.mission} onChange={e => set("mission", e.target.value)} />
                            </Field>
                        </div>

                        <div className="nav">
                            <button className="btn ghost" onClick={prev}>← 戻る</button>
                            <button className="btn primary" onClick={next}>次へ →</button>
                        </div>
                    </div>
                )}

                {/* ===== Phase 4 ===== */}
                {phase === 4 && (
                    <div className="phase">
                        <div className="ph-num">Phase 04 / 04</div>
                        <div className="ph-title">宿命属性 — 運命論的バイアス</div>
                        <div className="ph-desc">統計学・占術データをAIの人格形成に組み込みます。最後の仕上げです。</div>

                        <div className="card">
                            <Field label="血液型" required error={errors.blood}>
                                <div className="bt-group">
                                    {["A", "B", "O", "AB"].map(v => (
                                        <label key={v} className={`bt-label ${form.blood === v ? "selected" : ""}`}>
                                            <input type="radio" name="blood" value={v} checked={form.blood === v} onChange={() => set("blood", v)} />
                                            {v}
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        <div className="card">
                            <Field label="占いへの受容度" required error={errors.receptivity}>
                                <p className="recep-hint">あなたの性格が占いの結果にどの程度当てはまると感じますか？AIの重み付けに使用されます。</p>
                                <div className="recep-group">
                                    {[["25", "🤔", "あまり\n当てはまらない"], ["50", "🙂", "少し\n当てはまる"], ["75", "😲", "かなり\n当てはまる"], ["100", "🔥", "ドンピシャ\nだと思う"]].map(([v, em, label]) => (
                                        <label key={v} className={`recep-label ${form.receptivity === v ? "selected" : ""}`}>
                                            <input type="radio" name="receptivity" value={v} checked={form.receptivity === v} onChange={() => set("receptivity", v)} />
                                            <span className="recep-em">{em}</span>
                                            <span className="recep-text">{label}</span>
                                            <span className="recep-pct">{v}%</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>

                        {/* SNS */}
                        <div className="card">
                            <div className="field-label" style={{ marginBottom: 12 }}>SNS連携 <span className="opt-badge">後日設定可</span></div>
                            <div className="sns-block">
                                <div className="sns-ico" style={{ background: "rgba(0,0,0,0.4)" }}>𝕏</div>
                                <div className="sns-info">
                                    <div className="sns-name">X (Twitter)</div>
                                    <input className="inp" type="url" placeholder="https://x.com/yourhandle"
                                        value={form.sns_x} onChange={e => set("sns_x", e.target.value)} />
                                </div>
                                <span className="sns-badge">後日可</span>
                            </div>
                            <div className="sns-block">
                                <div className="sns-ico" style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}>📸</div>
                                <div className="sns-info">
                                    <div className="sns-name">Instagram</div>
                                    <input className="inp" type="url" placeholder="https://instagram.com/yourhandle"
                                        value={form.sns_instagram} onChange={e => set("sns_instagram", e.target.value)} />
                                </div>
                                <span className="sns-badge">後日可</span>
                            </div>
                        </div>

                        {/* Privacy */}
                        <div className="card notice-card">
                            <div className="notice-icon">🔒</div>
                            <div className="notice-text">
                                <strong>プライバシーポリシー</strong><br />
                                入力情報はCOCORO OSのAI学習のみに使用します。第三者への提供・販売は行いません。SNSデータは明示的な連携操作がない限りアクセスされません。
                            </div>
                        </div>

                        {submitError && <div className="submit-err">{submitError}</div>}

                        <div className="nav">
                            <button className="btn ghost" onClick={prev} disabled={submitting}>← 戻る</button>
                            <button className="btn submit" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "送信中…" : "✦ 分身を起動する"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{styles}</style>
        </div>
    );
}

// ─── Field helper component ──────────────────────────────────────────────────
function Field({ label, required, error, children }: {
    label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="field">
            <div className="field-label">
                {label}{required && <span className="req-star"> ★</span>}
            </div>
            {children}
            {error && <div className="field-err">{error}</div>}
        </div>
    );
}

// ─── Scoped CSS ──────────────────────────────────────────────────────────────
const styles = `
:root {
  --bg: #060608; --surface: #0d0d12; --surface2: #13131c;
  --border: rgba(255,255,255,0.07); --border-active: rgba(139,92,246,0.6);
  --text: #e8e8f0; --muted: #6b6b80;
  --accent: #8b5cf6; --accent2: #06b6d4; --accent3: #f472b6;
  --error: #f87171; --success: #34d399; --req: #f472b6;
}
.reg-page { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; font-size:14px; line-height:1.6; overflow-x:hidden; }
.reg-wrap { position:relative; z-index:1; max-width:720px; margin:0 auto; padding:56px 20px 100px; }

/* BG orbs */
.orb { position:fixed; border-radius:50%; filter:blur(120px); opacity:0.13; pointer-events:none; z-index:0; }
.orb1 { width:600px;height:600px;background:var(--accent);top:-200px;left:-200px;animation:o1 20s ease-in-out infinite alternate; }
.orb2 { width:500px;height:500px;background:var(--accent2);bottom:-150px;right:-150px;animation:o2 25s ease-in-out infinite alternate; }
.orb3 { width:280px;height:280px;background:var(--accent3);top:50%;left:50%;transform:translate(-50%,-50%);animation:o3 15s ease-in-out infinite alternate; }
.bg-grid { position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px);background-size:60px 60px;pointer-events:none; }
@keyframes o1{to{transform:translate(80px,60px)}}
@keyframes o2{to{transform:translate(-60px,-80px)}}
@keyframes o3{from{transform:translate(-50%,-50%) scale(1)}to{transform:translate(-50%,-50%) scale(1.5)}}

/* Header */
.reg-header { text-align:center; margin-bottom:52px; }
.badge { display:inline-flex;align-items:center;gap:8px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.28);border-radius:100px;padding:6px 18px;margin-bottom:26px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent); }
.dot { width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse 2s ease-in-out infinite; }
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
.reg-h1 { font-family:'Space Grotesk',sans-serif;font-size:clamp(26px,5vw,42px);font-weight:700;letter-spacing:-0.02em;line-height:1.1; }
.grad { background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.reg-sub { margin-top:12px;color:var(--muted);font-size:13px;max-width:420px;margin-left:auto;margin-right:auto; }

/* Progress */
.prog-wrap { display:flex;align-items:flex-start;margin-bottom:48px;position:relative; }
.prog-track { position:absolute;top:15px;left:15px;right:15px;height:1px;background:var(--border); }
.prog-fill { position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s cubic-bezier(.4,0,.2,1); }
.prog-dot { flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;position:relative; }
.prog-circle { width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--muted);transition:all .3s;z-index:1; }
.prog-dot.active .prog-circle { border-color:var(--accent);background:rgba(139,92,246,0.15);color:var(--accent);box-shadow:0 0 18px rgba(139,92,246,0.35); }
.prog-dot.done .prog-circle { border-color:var(--success);background:rgba(52,211,153,0.1);color:var(--success); }
.prog-label { font-size:9.5px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap; }
.prog-dot.active .prog-label { color:var(--accent); }
.prog-dot.done .prog-label { color:var(--success); }

/* Phase */
.phase { animation:fadeUp .35s ease; }
@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.ph-num { font-size:10px;letter-spacing:.15em;color:var(--muted);text-transform:uppercase;margin-bottom:4px; }
.ph-title { font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:600;margin-bottom:6px; }
.ph-desc { color:var(--muted);font-size:12.5px;margin-bottom:28px; }

/* Card */
.card { background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:14px;transition:border-color .2s; }
.card:hover { border-color:rgba(255,255,255,0.11); }

/* Field */
.field { margin-bottom:20px; }
.field:last-child { margin-bottom:0; }
.field-label { font-size:11px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:9px; }
.req-star { color:var(--req); }
.field-err { font-size:11px;color:var(--error);margin-top:4px; }

/* Inputs */
.inp { width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 16px;color:var(--text);font-family:'Inter',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none; }
.inp:focus { border-color:var(--border-active);box-shadow:0 0 0 3px rgba(139,92,246,0.1); }
.inp::placeholder { color:var(--muted); }
.inp.invalid { border-color:var(--error) !important; }
.ta { resize:vertical; min-height:100px; }
.row2 { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
@media(max-width:520px){.row2{grid-template-columns:1fr;}}

/* Astro tags */
.auto-tags { display:flex;flex-wrap:wrap;gap:6px;margin-top:10px; }
.auto-tag { background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);color:var(--accent2);border-radius:6px;padding:4px 10px;font-size:11.5px; }

/* Choice */
.choice-group { display:grid;grid-template-columns:repeat(3,1fr);gap:10px; }
@media(max-width:520px){.choice-group{grid-template-columns:1fr;}}
.choice-label { display:flex;flex-direction:row;align-items:center;gap:8px;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:13px;transition:all .2s;min-height:52px; }
.choice-label input { display:none; }
.choice-label.col { flex-direction:column;align-items:center;text-align:center;gap:6px;min-height:72px; }
.choice-dot { width:14px;height:14px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;transition:all .2s; }
.choice-label.selected { border-color:var(--accent);background:rgba(139,92,246,0.12);color:var(--accent); }
.choice-label.selected .choice-dot { border-color:var(--accent);background:var(--accent); }
.choice-label:hover { border-color:rgba(255,255,255,0.15);background:rgba(255,255,255,0.03); }
.choice-emoji { font-size:18px; }
.choice-sub { font-size:11px;color:var(--muted);margin-top:2px; }
.choice-label.selected .choice-sub { color:rgba(139,92,246,0.7); }

/* Blood type */
.bt-group { display:grid;grid-template-columns:repeat(4,1fr);gap:10px; }
.bt-label { display:block;padding:16px 8px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:18px;font-weight:700;font-family:'Space Grotesk',sans-serif;text-align:center;transition:all .2s; }
.bt-label input { display:none; }
.bt-label.selected { border-color:var(--accent);background:rgba(139,92,246,0.14);color:var(--accent);box-shadow:0 0 14px rgba(139,92,246,0.2); }
.bt-label:hover { border-color:rgba(255,255,255,0.18); }

/* Receptivity */
.recep-hint { font-size:12px;color:var(--muted);margin-bottom:14px; }
.recep-group { display:grid;grid-template-columns:repeat(4,1fr);gap:8px; }
@media(max-width:520px){.recep-group{grid-template-columns:repeat(2,1fr);}}
.recep-label { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px 8px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;text-align:center;transition:all .2s;white-space:pre-line; }
.recep-label input { display:none; }
.recep-em { font-size:20px; }
.recep-text { font-size:11.5px;line-height:1.35; }
.recep-pct { font-size:10px;color:var(--muted); }
.recep-label.selected { border-color:var(--accent2);background:rgba(6,182,212,0.1); }
.recep-label.selected .recep-text,.recep-label.selected .recep-pct { color:var(--accent2); }

/* SNS */
.sns-block { display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;margin-bottom:10px; }
.sns-block:last-child { margin-bottom:0; }
.sns-ico { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0; }
.sns-info { flex:1;min-width:0; }
.sns-name { font-weight:500;font-size:13px;margin-bottom:4px; }
.sns-badge { font-size:10px;color:var(--accent2);background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);border-radius:4px;padding:2px 8px;white-space:nowrap;flex-shrink:0; }
.opt-badge { display:inline;font-size:11px;color:var(--accent2);font-weight:400;text-transform:none;letter-spacing:0; }

/* Notice */
.notice-card { display:flex;gap:12px;align-items:flex-start;border-color:rgba(139,92,246,0.2) !important; }
.notice-icon { font-size:18px;flex-shrink:0; }
.notice-text { font-size:12.5px;color:var(--muted);line-height:1.6; }
.notice-text strong { color:var(--text); }

/* Q progress */
.q-progress-bar { display:flex;align-items:center;gap:10px;margin-bottom:20px; }
.q-bar-track { flex:1;height:3px;background:var(--surface2);border-radius:2px;overflow:hidden; }
.q-bar-fill { height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .4s ease;border-radius:2px; }
.q-count { font-size:11px;color:var(--muted);white-space:nowrap; }
.q-cat { font-size:9px;text-transform:uppercase;letter-spacing:.15em;color:var(--accent);margin-bottom:8px; }
.q-text { font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:500;line-height:1.4;margin-bottom:16px; }

/* Nav */
.nav { display:flex;gap:10px;justify-content:space-between;margin-top:28px; }
.btn { padding:13px 28px;border-radius:10px;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;transition:all .2s; }
.btn:disabled { opacity:0.5;cursor:not-allowed; }
.ghost { background:transparent;border:1px solid var(--border);color:var(--muted); }
.ghost:hover:not(:disabled) { border-color:rgba(255,255,255,0.2);color:var(--text); }
.primary { background:linear-gradient(135deg,var(--accent),#6d28d9);color:#fff;box-shadow:0 4px 18px rgba(139,92,246,0.32); }
.primary:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 8px 28px rgba(139,92,246,0.48); }
.submit { background:linear-gradient(135deg,var(--accent2),var(--accent));color:#fff;box-shadow:0 4px 18px rgba(6,182,212,0.3);padding:15px 44px;font-size:14.5px; }
.submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 10px 36px rgba(6,182,212,0.5); }

/* Submit error */
.submit-err { background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);color:var(--error);border-radius:10px;padding:12px 16px;font-size:13px;margin-bottom:16px; }
.global-err { background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);color:var(--error);border-radius:10px;padding:10px 14px;font-size:12px;margin-bottom:16px; }

/* Success */
.succ-screen { text-align:center;padding:80px 20px;animation:fadeUp .5s ease; }
.succ-icon { font-size:60px;margin-bottom:22px; }
.succ-title { font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;margin-bottom:14px; }
.succ-sub { color:var(--muted);font-size:14px;max-width:380px;margin:0 auto 20px; }
.succ-id { font-size:11px;color:var(--muted);margin-bottom:30px; }
.succ-id code { color:var(--accent2);background:rgba(6,182,212,0.08);padding:2px 8px;border-radius:6px; }
.succ-footer { margin-top:36px;color:var(--muted);font-size:11px;letter-spacing:.1em; }
`;
