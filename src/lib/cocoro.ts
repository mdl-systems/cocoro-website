// src/lib/cocoro.ts
// cocoro-core への統一クライアント（シングルトン）
// COCORO_CORE_ENABLED=true のときのみ実際に接続
//
// NOTE: 静的エクスポートビルドではこのファイルはビルドに含まれない
//       (_api_server/ からのみ参照、さくらサーバー静的ホスティング時は不使用)
//       VPS / Next.js サーバーモードに戻す場合は cocoro-sdk を再追加すること:
//       npm install @mdl-systems/cocoro-sdk

/** CocoroClientの軽量型定義（SDK非依存） */
export interface CocoroClientLike {
    baseUrl: string;
    apiKey: string;
    agentUrl?: string;
}

const ENABLED = process.env.COCORO_CORE_ENABLED === "true";

/**
 * cocoro-core 接続設定を返す。
 * COCORO_CORE_ENABLED=false のとき null を返す。
 */
export function getCocoroConfig(): CocoroClientLike | null {
    if (!ENABLED) return null;

    const baseUrl = process.env.COCORO_CORE_URL;
    const apiKey = process.env.COCORO_CORE_API_KEY;
    const agentUrl = process.env.COCORO_AGENT_URL;

    if (!baseUrl || !apiKey) {
        console.warn(
            "[cocoro] COCORO_CORE_URL または COCORO_CORE_API_KEY が未設定です。" +
            "cocoro-coreとの連携が無効になります。"
        );
        return null;
    }

    return { baseUrl, apiKey, ...(agentUrl ? { agentUrl } : {}) };
}

/** COCORO_CORE_ENABLED フラグ（クライアントコンポーネントでの分岐用） */
export const isCocoroEnabled = ENABLED;

/**
 * 後方互換エイリアス（_api_server/ での参照用）
 * 静的エクスポート時は null を返す
 */
export const getCocoroClient = (): null => null;

