import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCocoroClient } from "@/lib/cocoro";

export interface RegisterPayload {
  // Phase 1
  fullname: string;
  nickname: string;
  email: string;
  birthdate: string;
  job: string;
  location: string;
  // Phase 2 — 10問診断
  quiz: Record<string, string>; // { q1: "0", q2: "1", ... }
  // Phase 3 — エージェント設定
  tone: string;
  density: string;
  mission: string;
  // Phase 4 — 宿命属性
  blood: string;
  receptivity: string;
  sns_x?: string;
  sns_instagram?: string;
  // Meta
  submittedAt: string;
}

/**
 * POST /api/register
 * エージェント登録フォームのデータを受け取り、保存する
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterPayload;

    // ─── バリデーション ──────────────────────────────
    const required = ["fullname", "nickname", "email", "birthdate", "job", "location", "tone", "density", "mission", "blood", "receptivity"];
    for (const key of required) {
      const val = (body as unknown as Record<string, unknown>)[key];
      if (!val || String(val).trim() === "") {
        return NextResponse.json(
          { success: false, error: `必須項目が未入力です: ${key}` },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // 生年月日の年を 1900〜2026 に制限
    const bdYear = new Date(body.birthdate).getFullYear();
    if (isNaN(bdYear) || bdYear < 1900 || bdYear > 2026) {
      return NextResponse.json(
        { success: false, error: "生年月日の年は1900〜2026の範囲で入力してください" },
        { status: 400 }
      );
    }

    // 10問すべて回答されているか
    const quiz = body.quiz || {};
    for (let i = 1; i <= 10; i++) {
      if (quiz[`q${i}`] === undefined || quiz[`q${i}`] === "") {
        return NextResponse.json(
          { success: false, error: `診断問題 Q${i} が未回答です` },
          { status: 400 }
        );
      }
    }

    // ─── 保存先: data/registrations.jsonl ──────────────
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const record = {
      id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...body,
      submittedAt: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
    };

    const filePath = path.join(dataDir, "registrations.jsonl");
    fs.appendFileSync(filePath, JSON.stringify(record) + "\n", "utf-8");

    // ─── cocoro-core 人格プロファイル送信（サイレントフォールバック）──
    syncToCocoroCore(body).catch(err =>
      console.warn("[/api/register] cocoro-core sync failed (non-critical):", err)
    );

    // ─── レスポンス ──────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        id: record.id,
        message: "エージェント登録が完了しました。24時間以内に確認メールをお送りします。",
        nickname: body.nickname,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[/api/register] error:", err);
    return NextResponse.json(
      { success: false, error: "サーバーエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}

// ─── クイズ回答 → valuesウェイト変換 ──────────────────────────────────────────
function quizToValues(quiz: Record<string, string>) {
  const map: Record<string, { name: string; description: string; weight: number; category: string }> = {
    q1: { name: "quality_focus", description: "品質 vs スピードの優先度", weight: quiz.q1 === "0" ? 0.8 : quiz.q1 === "1" ? 0.3 : 0.5, category: "work" },
    q2: { name: "risk_tolerance", description: "挑戦・リスク許容度", weight: quiz.q2 === "0" ? 0.8 : quiz.q2 === "1" ? 0.2 : 0.5, category: "personality" },
    q3: { name: "decisiveness", description: "意思決定の確信度", weight: quiz.q3 === "0" ? 0.7 : quiz.q3 === "1" ? 0.3 : 0.5, category: "personality" },
    q4: { name: "rule_vs_outcome", description: "ルール重視 vs 結果重視", weight: quiz.q4 === "0" ? 0.8 : quiz.q4 === "1" ? 0.3 : 0.5, category: "ethics" },
    q5: { name: "logic_style", description: "思考スタイル（データ/直感/協調）", weight: quiz.q5 === "0" ? 0.8 : quiz.q5 === "1" ? 0.6 : 0.4, category: "cognition" },
    q6: { name: "empathy", description: "感情的共感・受容性", weight: quiz.q6 === "2" ? 0.8 : quiz.q6 === "0" ? 0.5 : 0.3, category: "emotion" },
    q7: { name: "creativity", description: "創造・革新への志向", weight: quiz.q7 === "0" ? 0.8 : quiz.q7 === "1" ? 0.3 : 0.5, category: "cognition" },
    q8: { name: "social_drive", description: "社会参加・貢献意欲", weight: quiz.q8 === "0" ? 0.8 : quiz.q8 === "1" ? 0.4 : 0.6, category: "social" },
    q9: { name: "authenticity", description: "自己開示・誠実さ", weight: quiz.q9 === "0" ? 0.8 : quiz.q9 === "1" ? 0.3 : 0.5, category: "ethics" },
    q10: { name: "growth_mindset", description: "成長・学習意欲", weight: quiz.q10 === "0" ? 0.9 : quiz.q10 === "1" ? 0.4 : 0.6, category: "personality" },
  };
  return Object.values(map);
}

// ─── cocoro-core 同期処理 ─────────────────────────────────────────────────────
async function syncToCocoroCore(body: RegisterPayload) {
  const cocoro = getCocoroClient();
  if (!cocoro) return; // COCORO_CORE_ENABLED=false のときはスキップ

  // 1. Identity を設定
  const profile = [
    `職業: ${body.job}`,
    `居住地: ${body.location}`,
    `生年月日: ${body.birthdate}`,
    `血液型: ${body.blood}`,
    `コミュニケーション: ${body.tone} / 情報密度: ${body.density}`,
    body.sns_x ? `X: ${body.sns_x}` : null,
    body.sns_instagram ? `Instagram: ${body.sns_instagram}` : null,
  ].filter(Boolean).join(" / ");

  await (cocoro as any).http.request("/identity", {
    method: "PUT",
    body: {
      owner_name: body.nickname,
      profile,
      philosophy: body.mission,
    },
  });

  // 2. Values を設定（クイズ回答から変換）
  const values = quizToValues(body.quiz);
  for (const v of values) {
    await (cocoro as any).http.request("/values", {
      method: "POST",
      body: v,
    });
  }

  console.log(`[/api/register] cocoro-core sync done for: ${body.nickname}`);
}

/**
 * GET /api/register — count only (admin check)
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "registrations.jsonl");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ count: 0 });
    }
    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
    return NextResponse.json({ count: lines.length });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
