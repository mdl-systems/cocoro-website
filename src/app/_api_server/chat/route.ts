import { NextRequest, NextResponse } from "next/server";
import { getCocoroClient } from "@/lib/cocoro";
import { CocoroError, CocoroAuthError } from "@mdl-systems/cocoro-sdk";

// POST /api/chat — AIチャットエンドポイント
// 優先度: cocoro-core (COCORO_CORE_ENABLED=true) → OpenAI API → モックレスポンス
export async function POST(request: NextRequest) {
    try {
        const { message, persona, thread_id, session_id } =
            await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: "メッセージを入力してください" },
                { status: 400 }
            );
        }

        // ── 1. cocoro-core 経由（SSEなし・通常レスポンス）
        const cocoro = getCocoroClient();
        if (cocoro) {
            try {
                const res = await cocoro.chat.send({
                    message,
                    sessionId: session_id || thread_id,
                });

                return NextResponse.json({
                    success: true,
                    response: (res as any).response || res.text,
                    model: "cocoro-core",
                    persona: persona || "COCORO",
                    thread_id: (res as any).session_id || res.sessionId,
                    emotion: res.emotion,
                    action: res.action,
                    timestamp: (res as any).timestamp,
                });
            } catch (err) {
                if (err instanceof CocoroAuthError) {
                    console.error("[cocoro-core] 認証エラー:", err.message);
                    return NextResponse.json(
                        { error: "cocoro-core 認証エラー。APIキーを確認してください。" },
                        { status: 503 }
                    );
                }
                if (err instanceof CocoroError) {
                    console.error(
                        `[cocoro-core] APIエラー (${err.status}):`,
                        err.message
                    );
                    // cocoro-coreが落ちているときはOpenAIにフォールバック
                    console.warn("[cocoro-core] OpenAI にフォールバックします");
                }
            }
        }

        // ── 2. OpenAI API フォールバック
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey) {
            const systemPrompt = getSystemPrompt(persona || "COCORO");

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openaiKey}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: message },
                        ],
                        max_tokens: 1000,
                        temperature: 0.7,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            return NextResponse.json({
                success: true,
                response: aiResponse,
                model: "gpt-4o-mini",
                persona: persona || "COCORO",
                thread_id: thread_id || `thread_${Date.now()}`,
                timestamp: new Date().toISOString(),
            });
        }

        // ── 3. モックレスポンス（APIキーなし開発環境）
        const mockResponse = generateMockResponse(message, persona);
        return NextResponse.json({
            success: true,
            response: mockResponse,
            model: "mock",
            persona: persona || "COCORO",
            thread_id: thread_id || `thread_${Date.now()}`,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "AIの応答中にエラーが発生しました" },
            { status: 500 }
        );
    }
}

// ── SSEストリーミングエンドポイント（真のword-by-wordストリーミング）
// GET /api/chat/stream?message=...&session_id=...
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message") ?? "";
    const sessionId = searchParams.get("session_id") ?? undefined;

    if (!message.trim()) {
        return NextResponse.json({ error: "messageが必要です" }, { status: 400 });
    }

    const cocoro = getCocoroClient();
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            const send = (data: unknown) =>
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

            if (!cocoro) {
                // モックモード: 文字ごとに50ms間隔で送信
                const mockText = `ご質問ありがとうございます ✦\n\n「${message}」についてお答えします。\n\n具体的にどの方向で掘り下げたいか教えてください：\n1. 基本概念の理解\n2. 実践的な応用方法\n3. 最新のトレンド情報`;
                for (const char of mockText) {
                    send({ text: char });
                    await new Promise((r) => setTimeout(r, 18));
                }
                send({ type: "final", sessionId: null, emotion: null, action: "mock" });
                send("[DONE]");
                controller.close();
                return;
            }

            try {
                // 真のSSEストリーミング: cocoro-sdk の stream() を使用
                const chatStream = await cocoro.chat.stream({ message, sessionId });

                for await (const chunk of chatStream) {
                    send({ text: chunk.text });
                }

                const finalMeta = await chatStream.final();
                send({
                    type: "final",
                    sessionId: finalMeta?.sessionId ?? null,
                    emotion: finalMeta?.emotion ?? null,
                    action: finalMeta?.action ?? "talk",
                });
                send("[DONE]");
                controller.close();
            } catch (err) {
                const msg = err instanceof CocoroError ? err.message : "ストリームエラー";
                send({ error: msg });
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}

function getSystemPrompt(persona: string): string {
    const prompts: Record<string, string> = {
        COCORO: "あなたはCOCORO AIです。知的で親しみやすいAIアシスタントとして、ユーザーの質問に日本語で丁寧に答えてください。",
        Scholar: "あなたは学術リサーチャーです。論文分析、研究手法、データ解釈について専門的なアドバイスを日本語で提供してください。",
        Coder: "あなたはプログラミング専門のAIです。コード生成、デバッグ、ベストプラクティスについて日本語でアドバイスしてください。コードは必ずフォーマットして提供してください。",
        Creator: "あなたはクリエイティブAIです。アート、デザイン、文章制作、アイデア生成のサポートを日本語で行ってください。創造的な提案をしてください。",
    };
    return prompts[persona] || prompts.COCORO;
}

function generateMockResponse(message: string, persona?: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("コード") || lower.includes("プログラ")) {
        return `コード生成のリクエストを受け付けました ✦\n\n以下はサンプルです：\n\n\`\`\`typescript\nfunction greet(name: string): string {\n  return \`こんにちは、\${name}さん！\`;\n}\n\`\`\`\n\nさらに具体的な要件を教えてくれれば、より実用的なコードを生成できます。\n\n（※ COCORO_CORE_ENABLED=true を.env.localに設定すると、cocoro-coreによる高度な応答が利用できます）`;
    }

    if (lower.includes("翻訳")) {
        return `翻訳のお手伝いをします 🌐\n\n翻訳したいテキストと、対象言語を教えてください。`;
    }

    return `ご質問ありがとうございます ✦\n\n「${message}」についてお答えします。\n\nこのトピックは多角的にアプローチできます。具体的にどの方向で掘り下げたいか教えてください：\n\n1. 基本概念の理解\n2. 実践的な応用方法\n3. 最新のトレンド情報\n\n（※ COCORO_CORE_ENABLED=true を.env.localに設定すると、cocoro-coreによる応答が利用できます）`;
}
