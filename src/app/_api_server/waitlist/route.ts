import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
    }

    const pool = getPool();
    if (pool) {
      try {
        await pool.query(
          `CREATE TABLE IF NOT EXISTS waitlist (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          )`,
        );
        await pool.query(
          `INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
          [email],
        );
      } catch (dbErr) {
        console.warn("[waitlist] DB error:", dbErr);
      }
    } else {
      console.info("[waitlist] DB not configured, skipping persistence for:", email);
    }

    return NextResponse.json({ success: true, message: "ウェイトリストに登録しました" });
  } catch (e) {
    console.error("[waitlist] error:", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
