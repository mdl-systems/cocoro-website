import { NextRequest, NextResponse } from "next/server";
import { signJWT, COOKIE_NAME, COOKIE_OPTS } from "@/lib/jwt";

// POST /api/auth/login
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "メールアドレスとパスワードを入力してください" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "メールアドレスまたはパスワードが正しくありません" },
                { status: 401 }
            );
        }

        // デモ: 6文字以上パスワードで任意メール受け付け（本番ではDB照合に置換）
        const name = email.split("@")[0];
        const user = {
            id: `usr_${Buffer.from(email).toString("base64url").slice(0, 8)}`,
            name,
            email,
            createdAt: new Date().toISOString(),
        };

        const token = signJWT({ sub: user.id, name: user.name, email: user.email });

        const res = NextResponse.json({
            success: true,
            user,
            message: "ログインに成功しました",
        });

        res.headers.set("Set-Cookie", `${COOKIE_NAME}=${token}; ${COOKIE_OPTS}`);
        return res;
    } catch {
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
