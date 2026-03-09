import { NextRequest, NextResponse } from "next/server";
import { prisma, DB_ENABLED } from "@/lib/prisma";

// ─── モックデータ（DB未接続時のフォールバック）──────────────
const MOCK_POSTS = [
    {
        id: "mock-001",
        userId: "usr-ai",
        author: "佐藤 優太",
        handle: "@yuta_sato",
        content: "AIエージェントと一緒に新しいプロジェクトの企画書を作成しました。",
        likesCount: 128,
        commentsCount: 34,
        sharesCount: 12,
        isAiGenerated: false,
        tags: ["AI協業", "生産性"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "mock-002",
        userId: "usr-ai",
        author: "COCORO AI",
        handle: "@cocoro_ai",
        content: "📊 今週のAIトレンドレポート\n\n1. マルチモーダルAIの進化が加速\n2. エージェント型AIの実用化が本格化",
        likesCount: 256,
        commentsCount: 67,
        sharesCount: 89,
        isAiGenerated: true,
        tags: ["AIトレンド", "テクノロジー"],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
];

// ─── GET /api/posts ────────────────────────────────────────
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    if (!DB_ENABLED || !prisma) {
        // DBなし：モックデータを返す
        const paginated = MOCK_POSTS.slice(skip, skip + limit);
        return NextResponse.json({
            posts: paginated,
            total: MOCK_POSTS.length,
            page,
            limit,
            hasMore: skip + limit < MOCK_POSTS.length,
            source: "mock",
        });
    }

    try {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { isDeleted: false },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where: { isDeleted: false } }),
        ]);

        const formatted = posts.map((p: { id: string; userId: string; user: { displayName: string | null; username: string }; content: string; likesCount: number; commentsCount: number; sharesCount: number; isAiGenerated: boolean; aiModel: string | null; tags: string[]; createdAt: Date }) => ({
            id: p.id,
            userId: p.userId,
            author: p.user.displayName ?? p.user.username,
            handle: `@${p.user.username}`,
            content: p.content,
            likesCount: p.likesCount,
            commentsCount: p.commentsCount,
            sharesCount: p.sharesCount,
            isAiGenerated: p.isAiGenerated,
            aiModel: p.aiModel,
            tags: p.tags,
            createdAt: p.createdAt.toISOString(),
        }));

        return NextResponse.json({
            posts: formatted,
            total,
            page,
            limit,
            hasMore: skip + limit < total,
            source: "db",
        });
    } catch (err) {
        console.error("[api/posts] DB error:", err);
        // DB接続失敗時はモックにフォールバック
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
        const { content, tags, isAiGenerated, aiModel, userId } = body;

        if (!content?.trim()) {
            return NextResponse.json({ error: "投稿内容を入力してください" }, { status: 400 });
        }
        if (content.length > 2000) {
            return NextResponse.json({ error: "投稿は2000文字以内にしてください" }, { status: 400 });
        }

        if (!DB_ENABLED || !prisma) {
            // モック投稿（DB未接続時）
            const newPost = {
                id: `mock-${Date.now()}`,
                userId: userId || "usr-guest",
                author: isAiGenerated ? "COCORO AI" : "ゲストユーザー",
                handle: isAiGenerated ? "@cocoro_ai" : "@guest_user",
                content,
                likesCount: 0,
                commentsCount: 0,
                sharesCount: 0,
                isAiGenerated: isAiGenerated ?? false,
                aiModel: aiModel ?? null,
                tags: tags ?? [],
                createdAt: new Date().toISOString(),
            };
            MOCK_POSTS.unshift(newPost);
            return NextResponse.json({ success: true, post: newPost, source: "mock" }, { status: 201 });
        }

        // DB接続: システムユーザーを探すか最初のユーザーを使用
        let resolvedUserId = userId;
        if (!resolvedUserId) {
            const systemUser = await prisma.user.findFirst({
                where: { username: { in: ["cocoro_ai", "system", "admin"] } },
                select: { id: true },
            });
            if (!systemUser) {
                // DBに誰もいない場合はモックにフォールバック
                const newPost = {
                    id: `mock-${Date.now()}`,
                    userId: "usr-guest",
                    author: isAiGenerated ? "COCORO AI" : "ゲストユーザー",
                    handle: isAiGenerated ? "@cocoro_ai" : "@guest_user",
                    content,
                    likesCount: 0,
                    commentsCount: 0,
                    sharesCount: 0,
                    isAiGenerated: isAiGenerated ?? false,
                    aiModel: aiModel ?? null,
                    tags: tags ?? [],
                    createdAt: new Date().toISOString(),
                };
                MOCK_POSTS.unshift(newPost);
                return NextResponse.json({ success: true, post: newPost, source: "mock" }, { status: 201 });
            }
            resolvedUserId = systemUser.id;
        }

        const post = await prisma.post.create({
            data: {
                userId: resolvedUserId,
                content,
                tags: tags ?? [],
                isAiGenerated: isAiGenerated ?? false,
                aiModel: aiModel ?? null,
            },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
            },
        });

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                userId: post.userId,
                author: post.user.displayName ?? post.user.username,
                handle: `@${post.user.username}`,
                content: post.content,
                likesCount: post.likesCount,
                commentsCount: post.commentsCount,
                sharesCount: post.sharesCount,
                isAiGenerated: post.isAiGenerated,
                aiModel: post.aiModel,
                tags: post.tags,
                createdAt: post.createdAt.toISOString(),
            },
            source: "db",
        }, { status: 201 });

    } catch (err) {
        console.error("[api/posts] POST error:", err);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
