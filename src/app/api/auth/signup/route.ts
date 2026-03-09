import { NextRequest, NextResponse } from "next/server";
import { signJWT, COOKIE_NAME, COOKIE_OPTS } from "@/lib/jwt";

// POST /api/auth/signup
export async function POST(request: NextRequest) {
    try {
        const { name, username, email, password } = await request.json();
        const displayName = name || username;

        if (!displayName || !email || !password) {
            return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "パスワードは6文字以上にしてください" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
        }

        // デモ: 実際には DB insert + パスワードハッシュ（bcrypt）
        const user = {
            id: `usr_${Date.now()}`,
            name: displayName,
            email,
            createdAt: new Date().toISOString(),
        };

        const token = signJWT({ sub: user.id, name: user.name, email: user.email });

        const res = NextResponse.json(
            { success: true, user, message: "アカウントが作成されました" },
            { status: 201 }
        );
        res.headers.set("Set-Cookie", `${COOKIE_NAME}=${token}; ${COOKIE_OPTS}`);
        return res;
    } catch {
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
