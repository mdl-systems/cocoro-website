import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/jwt";

// POST /api/auth/logout — Cookie を削除する
export async function POST() {
    const res = NextResponse.json({ success: true });
    // Max-Age=0 で即座に期限切れ
    res.headers.set("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
    return res;
}
