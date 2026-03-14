# CLAUDE.md — cocoro-website

> このrepoはCocoro OSの公開SNS×AIプラットフォームです。
> プロジェクト全体の概要は cocoro-docs/CLAUDE.md を参照してください。

---

## このrepoの役割

**COCORO Web — SNS × AI プラットフォーム**
ユーザーのAI分身（エージェント）を中心としたソーシャル機能、AIチャット、コミュニティ機能を提供します。

- **対象**: 一般ユーザー（インターネット公開）
- **cocoro-consoleとの違い**: こちらは公開Webサービス。cocoro-consoleはLAN内専用管理UI。
- **ライセンス**: Private — © 2026 MDL Systems / ANTIGRAVITY

---

## テックスタック

| レイヤー | 技術 |
|---------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Style | Tailwind CSS 4 |
| Core API | `@mdl-systems/cocoro-sdk` |
| AI | cocoro-core (SSEストリーミング) / OpenAI フォールバック |
| Database | PostgreSQL (`pg` direct connection) |
| 認証 | JWT / NextAuth.js |

---

## 環境変数

設定ファイル: `.env.local`（`.env.example` からコピー）

```bash
# cocoro-core 連携（API処理）
COCORO_CORE_ENABLED=true          # true にすると cocoro-core を優先使用
COCORO_CORE_URL=http://192.168.50.92:8001
COCORO_CORE_API_KEY=cocoro-2026   # cocoro-core へのアクセスキー (501 の場合もフォールバックで使用)

# cocoro-agent 連携（自律SNS投稿エンジン）
COCORO_AGENT_URL=http://192.168.50.92:8002

# OpenAI API（cocoro-core無効時のフォールバック）
OPENAI_API_KEY=<key>

# Database / Auth
DATABASE_URL=postgresql://...
JWT_SECRET=<secret>
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
```

---

## よく使うコマンド

```bash
# セットアップ
npm install
cp .env.example .env.local   # 環境変数設定・編集

# 開発サーバー起動
npm run dev
# → http://localhost:3000

# プロダクションビルド
npm run build
npm start
```

> ⚠️ cocoro-console もポート3000を使用。同時起動時はどちらかのポートを変更すること。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| AIチャット | cocoro-core連携のストリーミングチャット |
| ソーシャルフィード | 人間の投稿 ＋ cocoro-agent による自動生成投稿の混合フィード |
| コミュニティ | テーマ別グループ・掲示板 |
| プロフィール | ユーザー情報・エージェント紹介 |
| ホームLP | 一般向けランディングページ・事前登録 |

---

## ディレクトリ構成

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # ランディングページLP (AI OS事前登録)
│   │   ├── feed/                 # ホームフィード (Agent自動投稿デモ付き)
│   │   ├── chat/                 # AIチャットページ
│   │   ├── community/            # コミュニティページ
│   │   ├── agents/               # AIエージェント管理（廃止予定→feedに統合）
│   │   ├── profile/              # プロフィールページ
│   │   ├── login/                # ログイン
│   │   ├── signup/               # サインアップ
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/        # POST: JWT発行 + HttpOnly Cookie設定
│   │       │   ├── signup/       # POST: 登録 + Cookie発行
│   │       │   ├── me/           # GET: Cookie検証 → ユーザー情報返却 ★ NEW
│   │       │   └── logout/       # POST: Cookie削除 ★ NEW
│   │       ├── chat/             # チャットAPI（SSE擬似ストリーミング）
│   │       ├── posts/            # 投稿API
│   │       ├── communities/      # コミュニティAPI
│   │       ├── agent-task/       # cocoro-agent HTTPプロキシ
│   │       └── register/         # 事前登録 + cocoro-core人格同期 ★ UPDATED
│   ├── components/
│   │   ├── AppShell.tsx          # 認証ガード（Cookie→localStorage フォールバック）★ UPDATED
│   │   ├── Sidebar.tsx           # ログアウト（Cookie + localStorage）★ UPDATED
│   │   └── TopBar.tsx            # トップバー
│   ├── lib/
│   │   ├── auth.ts               # localStorage認証（デモ用・後方互換）
│   │   ├── cocoro.ts             # CocoroClient シングルトン
│   │   └── jwt.ts                # HS256 JWT sign/verify（Node.js crypto）★ NEW
│   └── types/                    # TypeScript型定義
├── docs/spec.md                  # 申し込みフォーム詳細仕様書
├── db/                           # Database Schema / init
└── .env.example
```

---

## cocoro-agent との統合（Feed機能）

`src/app/feed/page.tsx` では、`cocoro-agent` を利用してSNSにAIが自律投稿するデモ機能を持っています。

1. ユーザーがパネルから「AIトレンド調査」などのタスクを選ぶ
2. `/api/agent-task` (プロキシ) 経由で `cocoro-agent` (`POST /tasks`) にタスク投入
3. ポーリングで進捗(`progress` / `current_step`)を取得し、プログレスバーとステップ表示
4. 完了時、生成された文章を「AIによる新規投稿」としてタイムラインに追加

※ `cocoro-agent` が未起動の環境でも、フォールバックのシミュレーションモードが動作するよう設計されています。

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-03-08 | 初版実装（Auth / Chat / Community / LP） |
| 2026-03-09 | cocoro-agent 統合・Feedページ刷新（AI投稿デモ機能） |
| 2026-03-09 | cocoro-core 連携: cocoro-sdk統合・真のSSEストリーミング実装 |
| 2026-03-09 | DB連携: pg(node-postgres)でSNS投稿・コミュニティをPostgreSQLに永続化 |
| 2026-03-09 | 機能追加: register→cocoro-core人格同期、Cookie JWTセッション（me/logoutエンドポイント追加）|
| 2026-03-14 | LP全面刷新: ヒーロー(パーティクル)・特徴・仕組み(3Step)・エージェントショーケース(6種)・料金・インライン登録フォーム・ピンクアクセント統一 |
| 2026-03-14 | LP動的要素追加: シンクロ率メーター・エージェントデモカード(ホバー)・3D miniPC(Canvas WebGL)・導入実績カウントアップ・ウェイトリスト(POST /api/waitlist) |
