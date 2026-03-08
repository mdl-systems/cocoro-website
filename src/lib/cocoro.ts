// src/lib/cocoro.ts
// cocoro-core への統一クライアント（シングルトン）
// COCORO_CORE_ENABLED=true のときのみ実際に接続

import { CocoroClient } from "@mdl-systems/cocoro-sdk";

const ENABLED = process.env.COCORO_CORE_ENABLED === "true";

let _client: CocoroClient | null = null;

/**
 * CocoroClient のシングルトンを返す。
 * COCORO_CORE_ENABLED=false のとき null を返す。
 */
export function getCocoroClient(): CocoroClient | null {
    if (!ENABLED) return null;

    if (!_client) {
        const baseUrl = process.env.COCORO_CORE_URL;
        const apiKey = process.env.COCORO_CORE_API_KEY;

        if (!baseUrl || !apiKey) {
            console.warn(
                "[cocoro-sdk] COCORO_CORE_URL または COCORO_CORE_API_KEY が未設定です。" +
                "cocoro-coreとの連携が無効になります。"
            );
            return null;
        }

        _client = new CocoroClient({ baseUrl, apiKey });
    }

    return _client;
}

/** COCORO_CORE_ENABLED フラグ（クライアントコンポーネントでの分岐用） */
export const isCocoroEnabled = ENABLED;
