import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "メールアドレスとパスワードを入力してください" },
                { status: 400 }
            );
        }

        // TODO: Replace with actual DB lookup and password verification
        // For demo, accept any valid-looking credentials
        if (email && password.length >= 6) {
            const user = {
                id: "usr_demo_001",
                username: "ゲストユーザー",
                email: email,
                avatar: null,
                created_at: new Date().toISOString(),
            };

            // TODO: Generate real JWT token
            const token = `cocoro_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;

            return NextResponse.json({
                success: true,
                user,
                token,
                message: "ログインに成功しました",
            });
        }

        return NextResponse.json(
            { error: "メールアドレスまたはパスワードが正しくありません" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
