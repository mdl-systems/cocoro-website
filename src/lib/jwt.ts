// src/lib/jwt.ts
// Node.js 組み込み crypto のみで HS256 JWT を生成・検証（外部依存なし）
import crypto from "crypto";

export interface JWTPayload {
    sub: string;       // user id (email)
    name: string;
    email: string;
    iat: number;
    exp: number;
}

const secret = process.env.JWT_SECRET ?? "cocoro-demo-secret-change-in-production";
const EXPIRE_SEC = 60 * 60 * 24 * 7; // 7日

function b64url(buf: Buffer | string): string {
    const b = typeof buf === "string" ? Buffer.from(buf) : buf;
    return b.toString("base64url");
}

function b64urlDecode(s: string): string {
    return Buffer.from(s, "base64url").toString("utf8");
}

/** JWT を発行 */
export function signJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
    const now = Math.floor(Date.now() / 1000);
    const body: JWTPayload = { ...payload, iat: now, exp: now + EXPIRE_SEC };
    const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const claims = b64url(JSON.stringify(body));
    const sig = crypto
        .createHmac("sha256", secret)
        .update(`${header}.${claims}`)
        .digest("base64url");
    return `${header}.${claims}.${sig}`;
}

/** JWT を検証 → ペイロードを返す（無効なら null）*/
export function verifyJWT(token: string): JWTPayload | null {
    try {
        const [header, claims, sig] = token.split(".");
        if (!header || !claims || !sig) return null;
        const expected = crypto
            .createHmac("sha256", secret)
            .update(`${header}.${claims}`)
            .digest("base64url");
        if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
        const payload = JSON.parse(b64urlDecode(claims)) as JWTPayload;
        if (payload.exp < Math.floor(Date.now() / 1000)) return null; // 期限切れ
        return payload;
    } catch {
        return null;
    }
}

export const COOKIE_NAME = "cocoro_token";
export const COOKIE_OPTS = `HttpOnly; Path=/; SameSite=Lax; Max-Age=${EXPIRE_SEC}`;
