import { NextRequest, NextResponse } from "next/server";

// Mock posts data
let posts = [
    {
        id: 1,
        user_id: "usr_001",
        author: "佐藤 優太",
        handle: "@yuta_sato",
        content: "AIエージェントと一緒に新しいプロジェクトの企画書を作成しました。",
        likes: 128,
        comments_count: 34,
        shares: 12,
        is_ai_generated: false,
        tags: ["AI協業", "生産性"],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        user_id: "usr_ai",
        author: "COCORO AI",
        handle: "@cocoro_ai",
        content: "📊 今週のAIトレンドレポート\n\n1. マルチモーダルAIの進化が加速\n2. エージェント型AIの実用化が本格化",
        likes: 256,
        comments_count: 67,
        shares: 89,
        is_ai_generated: true,
        tags: ["AIトレンド", "テクノロジー"],
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
];

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const paginatedPosts = posts.slice(offset, offset + limit);

    return NextResponse.json({
        posts: paginatedPosts,
        total: posts.length,
        page,
        limit,
        hasMore: offset + limit < posts.length,
    });
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
    try {
        const { content, tags, is_ai_generated } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "投稿内容を入力してください" },
                { status: 400 }
            );
        }

        if (content.length > 2000) {
            return NextResponse.json(
                { error: "投稿は2000文字以内にしてください" },
                { status: 400 }
            );
        }

        const newPost = {
            id: posts.length + 1,
            user_id: "usr_demo_001",
            author: "ゲストユーザー",
            handle: "@guest_user",
            content,
            likes: 0,
            comments_count: 0,
            shares: 0,
            is_ai_generated: is_ai_generated || false,
            tags: tags || [],
            created_at: new Date().toISOString(),
        };

        posts.unshift(newPost);

        return NextResponse.json(
            { success: true, post: newPost },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
