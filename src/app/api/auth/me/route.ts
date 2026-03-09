import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, COOKIE_NAME } from "@/lib/jwt";

// GET /api/auth/me — Cookie の JWT を検証してユーザー情報を返す
export async function GET(request: NextRequest) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: "未認証" }, { status: 401 });
    }
    const payload = verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ error: "トークンが無効または期限切れです" }, { status: 401 });
    }
    return NextResponse.json({
        user: {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
        },
    });
}
