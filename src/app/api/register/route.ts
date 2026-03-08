import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
