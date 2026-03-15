import { NextRequest, NextResponse } from "next/server";
import { getPool, DB_ENABLED } from "@/lib/db";

// ─── モックデータ（DB未接続時のフォールバック）──────────────
const MOCK_COMMUNITIES = [
    {
        id: "mock-comm-001",
        name: "AI Code Lab",
        description: "AIを活用したプログラミング。コードレビューやペアプログラミングをAIと一緒に。",
        member_count: 2847,
        post_count: 12340,
        tags: ["プログラミング", "AI", "コードレビュー"],
        has_ai_moderator: true,
        is_public: true,
        created_at: "2024-01-15T00:00:00.000Z",
    },
    {
        id: "mock-comm-002",
        name: "クリエイティブ AI",
        description: "AIと人間のクリエイティブなコラボレーション。アート、音楽、文章の共同制作。",
        member_count: 1923,
        post_count: 8750,
        tags: ["アート", "デザイン", "クリエイティブ"],
        has_ai_moderator: true,
        is_public: true,
        created_at: "2024-02-01T00:00:00.000Z",
    },
    {
        id: "mock-comm-003",
        name: "AI × 教育",
        description: "AIを活用した教育の未来を議論。個別最適化学習、AI講師。",
        member_count: 3156,
        post_count: 15680,
        tags: ["教育", "学習", "EdTech"],
        has_ai_moderator: true,
        is_public: true,
        created_at: "2024-01-20T00:00:00.000Z",
    },
];

// ─── GET /api/communities ─────────────────────────────────
export async function GET() {
    const pool = getPool();

    if (!DB_ENABLED || !pool) {
        return NextResponse.json({
            communities: MOCK_COMMUNITIES,
            total: MOCK_COMMUNITIES.length,
            source: "mock",
        });
    }

    try {
        const { rows } = await pool.query<{
            id: string; name: string; description: string | null;
            member_count: number; post_count: number; tags: string[];
            has_ai_moderator: boolean; is_public: boolean; created_at: Date;
        }>(
            `SELECT id, name, description, member_count, post_count, tags,
                    has_ai_moderator, is_public, created_at
             FROM communities
             WHERE is_public = true
             ORDER BY member_count DESC
             LIMIT 20`
        );

        return NextResponse.json({
            communities: rows.map((c) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                member_count: c.member_count,
                post_count: c.post_count,
                tags: c.tags,
                has_ai_moderator: c.has_ai_moderator,
                is_public: c.is_public,
                created_at: c.created_at.toISOString(),
            })),
            total: rows.length,
            source: "db",
        });
    } catch (err) {
        console.error("[api/communities] DB error:", err);
        return NextResponse.json({
            communities: MOCK_COMMUNITIES,
            total: MOCK_COMMUNITIES.length,
            source: "mock_fallback",
        });
    }
}

// ─── POST /api/communities ────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const { name, description, tags, owner_id } = await request.json();

        if (!name?.trim() || !description?.trim()) {
            return NextResponse.json(
                { error: "コミュニティ名と説明を入力してください" },
                { status: 400 }
            );
        }

        const pool = getPool();
        if (!DB_ENABLED || !pool) {
            const newCommunity = {
                id: `mock-comm-${Date.now()}`,
                name,
                description,
                member_count: 1,
                post_count: 0,
                tags: tags ?? [],
                has_ai_moderator: false,
                is_public: true,
                created_at: new Date().toISOString(),
            };
            MOCK_COMMUNITIES.push(newCommunity);
            return NextResponse.json(
                { success: true, community: newCommunity, source: "mock" },
                { status: 201 }
            );
        }

        // オーナーユーザーを解決
        let resolvedOwnerId = owner_id;
        if (!resolvedOwnerId) {
            const { rows } = await pool.query<{ id: string }>(
                `SELECT id FROM users ORDER BY created_at ASC LIMIT 1`
            );
            if (!rows[0]) {
                return NextResponse.json(
                    { error: "ユーザーが存在しません" },
                    { status: 422 }
                );
            }
            resolvedOwnerId = rows[0].id;
        }

        const { rows } = await pool.query<{ id: string; created_at: Date }>(
            `INSERT INTO communities (name, description, tags, owner_id, member_count)
             VALUES ($1, $2, $3, $4, 1)
             RETURNING id, created_at`,
            [name, description, tags ?? [], resolvedOwnerId]
        );
        const community = rows[0];

        return NextResponse.json({
            success: true,
            community: {
                id: community.id,
                name,
                description,
                member_count: 1,
                post_count: 0,
                tags: tags ?? [],
                has_ai_moderator: false,
                is_public: true,
                created_at: community.created_at.toISOString(),
            },
            source: "db",
        }, { status: 201 });

    } catch (err: unknown) {
        const pgErr = err as { code?: string };
        if (pgErr.code === "23505") { // unique violation
            return NextResponse.json(
                { error: "そのコミュニティ名はすでに使用されています" },
                { status: 409 }
            );
        }
        console.error("[api/communities] POST error:", err);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
