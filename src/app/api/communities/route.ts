import { NextRequest, NextResponse } from "next/server";

// Mock communities data
const communities = [
    {
        id: 1,
        name: "AI Code Lab",
        description: "AIを活用したプログラミング。コードレビューやペアプログラミングをAIと一緒に。",
        members: 2847,
        posts: 12340,
        tags: ["プログラミング", "AI", "コードレビュー"],
        has_ai_moderator: true,
        created_at: "2024-01-15T00:00:00.000Z",
    },
    {
        id: 2,
        name: "クリエイティブ AI",
        description: "AIと人間のクリエイティブなコラボレーション。アート、音楽、文章の共同制作。",
        members: 1923,
        posts: 8750,
        tags: ["アート", "デザイン", "クリエイティブ"],
        has_ai_moderator: true,
        created_at: "2024-02-01T00:00:00.000Z",
    },
    {
        id: 3,
        name: "AI × 教育",
        description: "AIを活用した教育の未来を議論。個別最適化学習、AI講師。",
        members: 3156,
        posts: 15680,
        tags: ["教育", "学習", "EdTech"],
        has_ai_moderator: true,
        created_at: "2024-01-20T00:00:00.000Z",
    },
];

// GET /api/communities
export async function GET() {
    return NextResponse.json({
        communities,
        total: communities.length,
    });
}

// POST /api/communities — Create community
export async function POST(request: NextRequest) {
    try {
        const { name, description, tags } = await request.json();

        if (!name || !description) {
            return NextResponse.json(
                { error: "コミュニティ名と説明を入力してください" },
                { status: 400 }
            );
        }

        const newCommunity = {
            id: communities.length + 1,
            name,
            description,
            members: 1,
            posts: 0,
            tags: tags || [],
            has_ai_moderator: false,
            created_at: new Date().toISOString(),
        };

        communities.push(newCommunity);

        return NextResponse.json(
            { success: true, community: newCommunity },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}
