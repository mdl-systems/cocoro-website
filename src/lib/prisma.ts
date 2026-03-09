/**
 * src/lib/prisma.ts
 * Prisma Client シングルトン（Next.js hot-reload 対応）
 * DATABASE_URL が未設定またはDB未起動時は null を返す。
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

type PrismaClientType = InstanceType<typeof PrismaClient>

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClientType | undefined
}

function createPrismaClient(): PrismaClientType | null {
    const url = process.env.DATABASE_URL ?? ''
    if (!url || url.includes('user:password@localhost') || url.includes('localhost:5432/cocoro_web')) {
        // プレースホルダーURL or 未設定 → DB無効モード
        return null
    }
    try {
        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['error'] : [],
        })
    } catch {
        return null
    }
}

export const prisma: PrismaClientType | null =
    process.env.NODE_ENV === 'production'
        ? createPrismaClient()
        : (global.__prisma ?? (global.__prisma = createPrismaClient()))

export const DB_ENABLED: boolean = prisma !== null
