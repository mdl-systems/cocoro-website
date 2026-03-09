import { NextRequest, NextResponse } from "next/server";
import { prisma, DB_ENABLED } from "@/lib/prisma";

// ─── モックデータ（DB未接続時のフォールバック）──────────────
const MOCK_COMMUNITIES = [
    {
        id: "mock-comm-001",
        name: "AI Code Lab",
        description: "AIを活用したプログラミング。コードレビューやペアプログラミングをAIと一緒に。",
        memberCount: 2847,
        postCount: 12340,
        tags: ["プログラミング", "AI", "コードレビュー"],
        hasAiModerator: true,
        isPublic: true,
        createdAt: "2024-01-15T00:00:00.000Z",
    },
    {
        id: "mock-comm-002",
        name: "クリエイティブ AI",
        description: "AIと人間のクリエイティブなコラボレーション。アート、音楽、文章の共同制作。",
        memberCount: 1923,
        postCount: 8750,
        tags: ["アート", "デザイン", "クリエイティブ"],
        hasAiModerator: true,
        isPublic: true,
        createdAt: "2024-02-01T00:00:00.000Z",
    },
    {
        id: "mock-comm-003",
        name: "AI × 教育",
        description: "AIを活用した教育の未来を議論。個別最適化学習、AI講師。",
        memberCount: 3156,
        postCount: 15680,
        tags: ["教育", "学習", "EdTech"],
        hasAiModerator: true,
        isPublic: true,
        createdAt: "2024-01-20T00:00:00.000Z",
    },
];

// ─── GET /api/communities ─────────────────────────────────
export async function GET() {
    if (!DB_ENABLED || !prisma) {
        return NextResponse.json({
            communities: MOCK_COMMUNITIES,
            total: MOCK_COMMUNITIES.length,
            source: "mock",
        });
    }

    try {
        const communities = await prisma.community.findMany({
            where: { isPublic: true },
            orderBy: { memberCount: "desc" },
            take: 20,
        });

        return NextResponse.json({
            communities: communities.map((c) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                memberCount: c.memberCount,
                postCount: c.postCount,
                tags: c.tags,
                hasAiModerator: c.hasAiModerator,
                isPublic: c.isPublic,
                createdAt: c.createdAt.toISOString(),
            })),
            total: communities.length,
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
        const { name, description, tags, ownerId } = await request.json();

        if (!name?.trim() || !description?.trim()) {
            return NextResponse.json(
                { error: "コミュニティ名と説明を入力してください" },
                { status: 400 }
            );
        }

        if (!DB_ENABLED || !prisma) {
            const newCommunity = {
                id: `mock-comm-${Date.now()}`,
                name,
                description,
                memberCount: 1,
                postCount: 0,
                tags: tags ?? [],
                hasAiModerator: false,
                isPublic: true,
                createdAt: new Date().toISOString(),
            };
            MOCK_COMMUNITIES.push(newCommunity);
            return NextResponse.json(
                { success: true, community: newCommunity, source: "mock" },
                { status: 201 }
            );
        }

        // DB接続: オーナーユーザーを解決
        let resolvedOwnerId = ownerId;
        if (!resolvedOwnerId) {
            const firstUser = await prisma.user.findFirst({ select: { id: true } });
            if (!firstUser) {
                return NextResponse.json(
                    { error: "ユーザーが存在しません。先にユーザー登録してください。" },
                    { status: 422 }
                );
            }
            resolvedOwnerId = firstUser.id;
        }

        const community = await prisma.community.create({
            data: {
                name,
                description,
                tags: tags ?? [],
                ownerId: resolvedOwnerId,
                memberCount: 1,
            },
        });

        return NextResponse.json({
            success: true,
            community: {
                id: community.id,
                name: community.name,
                description: community.description,
                memberCount: community.memberCount,
                postCount: community.postCount,
                tags: community.tags,
                hasAiModerator: community.hasAiModerator,
                isPublic: community.isPublic,
                createdAt: community.createdAt.toISOString(),
            },
            source: "db",
        }, { status: 201 });

    } catch (err: unknown) {
        // ユニーク制約違反
        if ((err as { code?: string }).code === "P2002") {
            return NextResponse.json(
                { error: "そのコミュニティ名はすでに使用されています" },
                { status: 409 }
            );
        }
        console.error("[api/communities] POST error:", err);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
