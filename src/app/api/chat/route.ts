import { NextRequest, NextResponse } from "next/server";

// POST /api/chat — AI Chat endpoint
export async function POST(request: NextRequest) {
    try {
        const { message, persona, thread_id } = await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: "メッセージを入力してください" },
                { status: 400 }
            );
        }

        // OpenAI API integration
        const apiKey = process.env.OPENAI_API_KEY;

        if (apiKey) {
            // Real OpenAI API call
            const systemPrompt = getSystemPrompt(persona || "COCORO");

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
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
                throw new Error("OpenAI API error");
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

        // Fallback: Mock response when no API key
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

function getSystemPrompt(persona: string): string {
    const prompts: Record<string, string> = {
        COCORO:
            "あなたはCOCORO AIです。知的で親しみやすいAIアシスタントとして、ユーザーの質問にJapaneseで丁寧に答えてください。",
        Scholar:
            "あなたは学術リサーチャーです。論文分析、研究手法、データ解釈について専門的なアドバイスを日本語で提供してください。",
        Coder:
            "あなたはプログラミング専門のAIです。コード生成、デバッグ、ベストプラクティスについて日本語でアドバイスしてください。コードは必ずフォーマットして提供してください。",
        Creator:
            "あなたはクリエイティブAIです。アート、デザイン、文章制作、アイデア生成のサポートを日本語で行ってください。創造的な提案をしてください。",
    };
    return prompts[persona] || prompts.COCORO;
}

function generateMockResponse(message: string, persona?: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("コード") || lower.includes("プログラ")) {
        return `コード生成のリクエストを受け付けました ✦\n\n以下はサンプルです：\n\n\`\`\`typescript\nfunction greet(name: string): string {\n  return \`こんにちは、\${name}さん！\`;\n}\n\`\`\`\n\nさらに具体的な要件を教えてくれれば、より実用的なコードを生成できます。\n\n（※ OpenAI APIキーを設定すると、より高度な応答が可能になります）`;
    }

    if (lower.includes("翻訳")) {
        return `翻訳のお手伝いをします 🌐\n\n翻訳したいテキストと、対象言語を教えてください。\n\n対応言語:\n• 日本語 ↔ 英語\n• 日本語 ↔ 中国語\n• 日本語 ↔ 韓国語\n• その他多数\n\n（※ OpenAI APIキーを設定すると、より精度の高い翻訳が可能です）`;
    }

    return `ご質問ありがとうございます ✦\n\n「${message}」についてお答えします。\n\nこのトピックは多角的にアプローチできます。具体的にどの方向で掘り下げたいか教えてください：\n\n1. 基本概念の理解\n2. 実践的な応用方法\n3. 最新のトレンド情報\n\n（※ OPENAI_API_KEYを.envに設定すると、GPT-4oによる高精度な応答が利用できます）`;
}
