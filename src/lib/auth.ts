// ─── COCORO Demo Auth (localStorage-based) ───────────────────────────────────
// 本番ではJWT + ServerSessionに置き換える

export interface AuthUser {
    name: string;
    email: string;
    createdAt: string;
}

const STORAGE_KEY = "cocoro_session";
const USERS_KEY = "cocoro_users";

// ─── ユーザー一覧の取得 ────────────────────────────────────────────────────────
function getUsers(): Record<string, { name: string; password: string; createdAt: string }> {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveUsers(users: Record<string, { name: string; password: string; createdAt: string }>) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ─── サインアップ ─────────────────────────────────────────────────────────────
export function signup(name: string, email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();
    if (users[email]) return { ok: false, error: "このメールアドレスは既に使用されています" };
    if (password.length < 6) return { ok: false, error: "パスワードは6文字以上で入力してください" };
    users[email] = { name, password, createdAt: new Date().toISOString() };
    saveUsers(users);
    setSession({ name, email, createdAt: users[email].createdAt });
    return { ok: true };
}

// ─── ログイン ─────────────────────────────────────────────────────────────────
export function login(email: string, password: string): { ok: boolean; error?: string } {
    const users = getUsers();
    const user = users[email];
    if (!user) return { ok: false, error: "メールアドレスまたはパスワードが正しくありません" };
    if (user.password !== password) return { ok: false, error: "メールアドレスまたはパスワードが正しくありません" };
    setSession({ name: user.name, email, createdAt: user.createdAt });
    return { ok: true };
}

// ─── セッション ───────────────────────────────────────────────────────────────
export function setSession(user: AuthUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
    return getSession() !== null;
}
