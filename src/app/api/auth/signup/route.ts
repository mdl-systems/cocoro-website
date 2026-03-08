import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/signup
export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "すべての項目を入力してください" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "パスワードは8文字以上にしてください" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "有効なメールアドレスを入力してください" },
                { status: 400 }
            );
        }

        // TODO: Replace with actual DB insert
        // TODO: Hash password with bcrypt
        const user = {
            id: `usr_${Date.now()}`,
            username,
            email,
            avatar: null,
            created_at: new Date().toISOString(),
        };

        const token = `cocoro_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        return NextResponse.json(
            {
                success: true,
                user,
                token,
                message: "アカウントが作成されました",
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
