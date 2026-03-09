/**
 * src/lib/db.ts
 * PostgreSQL 接続クライアント（node-postgres）
 * DATABASE_URL が有効な場合のみ接続する。未設定・プレースホルダー時は null を返す。
 */

import { Pool } from 'pg'

// ローカル開発用プレースホルダー URL パターン
const PLACEHOLDER_PATTERNS = [
    'user:password@',
    'localhost:5432/cocoro_web',
]

function isRealDbUrl(url: string): boolean {
    return !!url && !PLACEHOLDER_PATTERNS.some((p) => url.includes(p))
}

let _pool: Pool | null = null

export function getPool(): Pool | null {
    const url = process.env.DATABASE_URL ?? ''
    if (!isRealDbUrl(url)) return null

    if (!_pool) {
        _pool = new Pool({
            connectionString: url,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        })
        _pool.on('error', (err) => {
            console.error('[db] pool error:', err.message)
        })
    }
    return _pool
}

export const DB_ENABLED: boolean = isRealDbUrl(process.env.DATABASE_URL ?? '')
