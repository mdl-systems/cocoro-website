import { NextRequest, NextResponse } from "next/server";
import { getPool, DB_ENABLED } from "@/lib/db";

// ─── モックデータ（DB未接続時のフォールバック）──────────────
const MOCK_POSTS = [
    {
        id: "mock-001",
        user_id: "usr-ai",
        author: "佐藤 優太",
        handle: "@yuta_sato",
        content: "AIエージェントと一緒に新しいプロジェクトの企画書を作成しました。",
        likes_count: 128,
        comments_count: 34,
        shares_count: 12,
        is_ai_generated: false,
        ai_model: null,
        tags: ["AI協業", "生産性"],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "mock-002",
        user_id: "usr-ai",
        author: "COCORO AI",
        handle: "@cocoro_ai",
        content: "📊 今週のAIトレンドレポート\n\n1. マルチモーダルAIの進化が加速\n2. エージェント型AIの実用化が本格化",
        likes_count: 256,
        comments_count: 67,
        shares_count: 89,
        is_ai_generated: true,
        ai_model: "cocoro-core",
        tags: ["AIトレンド", "テクノロジー"],
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
];

// ─── GET /api/posts ────────────────────────────────────────
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const pool = getPool();
    if (!DB_ENABLED || !pool) {
        const paginated = MOCK_POSTS.slice(offset, offset + limit);
        return NextResponse.json({
            posts: paginated,
            total: MOCK_POSTS.length,
            page,
            limit,
            hasMore: offset + limit < MOCK_POSTS.length,
            source: "mock",
        });
    }

    try {
        const { rows: posts } = await pool.query<{
            id: string; user_id: string; content: string;
            likes_count: number; comments_count: number; shares_count: number;
            is_ai_generated: boolean; ai_model: string | null; tags: string[];
            created_at: Date; username: string; display_name: string | null;
        }>(
            `SELECT p.id, p.user_id, p.content, p.likes_count, p.comments_count,
                    p.shares_count, p.is_ai_generated, p.ai_model, p.tags, p.created_at,
                    u.username, u.display_name
             FROM posts p JOIN users u ON p.user_id = u.id
             WHERE p.is_deleted = false
             ORDER BY p.created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const { rows: countRows } = await pool.query<{ count: string }>(
            `SELECT COUNT(*) as count FROM posts WHERE is_deleted = false`
        );
        const total = parseInt(countRows[0]?.count ?? "0");

        return NextResponse.json({
            posts: posts.map((p) => ({
                id: p.id,
                user_id: p.user_id,
                author: p.display_name ?? p.username,
                handle: `@${p.username}`,
                content: p.content,
                likes_count: p.likes_count,
                comments_count: p.comments_count,
                shares_count: p.shares_count,
                is_ai_generated: p.is_ai_generated,
                ai_model: p.ai_model,
                tags: p.tags,
                created_at: p.created_at.toISOString(),
            })),
            total,
            page,
            limit,
            hasMore: offset + limit < total,
            source: "db",
        });
    } catch (err) {
        console.error("[api/posts] DB error:", err);
        return NextResponse.json({
            posts: MOCK_POSTS,
            total: MOCK_POSTS.length,
            page: 1,
            limit,
            hasMore: false,
            source: "mock_fallback",
        });
    }
}

// ─── POST /api/posts ───────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, tags, is_ai_generated, ai_model, user_id } = body;

        if (!content?.trim()) {
            return NextResponse.json({ error: "投稿内容を入力してください" }, { status: 400 });
        }
        if (content.length > 2000) {
            return NextResponse.json({ error: "投稿は2000文字以内にしてください" }, { status: 400 });
        }

        const pool = getPool();
        if (!DB_ENABLED || !pool) {
            const newPost = {
                id: `mock-${Date.now()}`,
                user_id: user_id || "usr-guest",
                author: is_ai_generated ? "COCORO AI" : "ゲストユーザー",
                handle: is_ai_generated ? "@cocoro_ai" : "@guest_user",
                content,
                likes_count: 0,
                comments_count: 0,
                shares_count: 0,
                is_ai_generated: is_ai_generated ?? false,
                ai_model: ai_model ?? null,
                tags: tags ?? [],
                created_at: new Date().toISOString(),
            };
            MOCK_POSTS.unshift(newPost);
            return NextResponse.json({ success: true, post: newPost, source: "mock" }, { status: 201 });
        }

        // DB接続: システムユーザーを探す
        let resolvedUserId = user_id;
        if (!resolvedUserId) {
            const { rows } = await pool.query<{ id: string }>(
                `SELECT id FROM users ORDER BY created_at ASC LIMIT 1`
            );
            if (!rows[0]) {
                return NextResponse.json({ error: "ユーザーが存在しません" }, { status: 422 });
            }
            resolvedUserId = rows[0].id;
        }

        const { rows } = await pool.query<{ id: string; created_at: Date }>(
            `INSERT INTO posts (user_id, content, tags, is_ai_generated, ai_model)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at`,
            [resolvedUserId, content, tags ?? [], is_ai_generated ?? false, ai_model ?? null]
        );
        const post = rows[0];

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                user_id: resolvedUserId,
                content,
                is_ai_generated: is_ai_generated ?? false,
                ai_model: ai_model ?? null,
                tags: tags ?? [],
                created_at: post.created_at.toISOString(),
            },
            source: "db",
        }, { status: 201 });

    } catch (err) {
        console.error("[api/posts] POST error:", err);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
