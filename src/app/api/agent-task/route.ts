import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.COCORO_AGENT_URL ?? "http://localhost:8002";
const AGENT_KEY = process.env.COCORO_CORE_API_KEY ?? "cocoro-dev-2026";

function headers() {
    return {
        "Authorization": `Bearer ${AGENT_KEY}`,
        "Content-Type": "application/json",
    };
}

// POST /api/agent-task  →  cocoro-agent POST /tasks
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const res = await fetch(`${AGENT_URL}/tasks`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: text }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        // cocoro-agent 未起動 → デモ用タスクIDを返す
        return NextResponse.json({
            task_id: `demo-${Date.now()}`,
            status: "queued",
            message: "cocoro-agent offline, running demo mode",
        });
    }
}

// PUT /api/agent-task  → タスク完了時にPost永続化
export async function PUT(req: NextRequest) {
    try {
        const { content, is_ai_generated, ai_model, tags } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ error: "content required" }, { status: 400 });
        }
        // /api/posts に内部フォワード（モック・DBどちらでも動く）
        const origin = req.nextUrl.origin;
        const postRes = await fetch(`${origin}/api/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content,
                is_ai_generated: is_ai_generated ?? true,
                ai_model: ai_model ?? "cocoro-agent",
                tags: tags ?? ["AI生成", "エージェント"],
            }),
        });
        const data = await postRes.json();
        return NextResponse.json(data, { status: postRes.status });
    } catch (err) {
        console.error("[agent-task] PUT error:", err);
        return NextResponse.json({ error: "failed to save post" }, { status: 500 });
    }
}

// GET /api/agent-task?task_id=xxx  →  cocoro-agent GET /tasks/{id}
export async function GET(req: NextRequest) {
    const taskId = new URL(req.url).searchParams.get("task_id");
    if (!taskId) return NextResponse.json({ error: "task_id required" }, { status: 400 });

    try {
        const res = await fetch(`${AGENT_URL}/tasks/${taskId}`, {
            headers: headers(),
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) {
            return NextResponse.json({ status: "running", progress: 50 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        // オフライン → ステータス返却
        return NextResponse.json({ status: "running", progress: 50 });
    }
}
