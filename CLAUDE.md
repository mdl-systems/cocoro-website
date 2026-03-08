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
| AI | OpenAI API / cocoro-core / cocoro-agent |
| Database | PostgreSQL + Prisma |
| 認証 | JWT / NextAuth.js |

---

## 環境変数

設定ファイル: `.env.local`（`.env.example` からコピー）

```bash
# cocoro-core 連携（API処理）
COCORO_CORE_ENABLED=false          # true にすると cocoro-core を優先使用
COCORO_CORE_URL=http://192.168.50.92:8001
COCORO_API_KEY=<key>

# cocoro-agent 連携（自律SNS投稿エンジン）
NEXT_PUBLIC_AGENT_URL=http://192.168.50.92:8002

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
cocoro-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # ランディングページLP (AI OS事前登録)
│   │   ├── feed/                 # ホームフィード (Agent自動投稿デモ付き) ★ NEW
│   │   ├── chat/                 # AIチャットページ
│   │   ├── community/            # コミュニティページ
│   │   ├── agents/               # AIエージェント管理（廃止予定→feedに統合）
│   │   ├── profile/              # プロフィールページ
│   │   ├── login/                # ログイン
│   │   ├── signup/               # サインアップ
│   │   └── api/
│   │       ├── auth/             # 認証API（login / signup）
│   │       ├── chat/             # チャットAPI（ストリーミング）
│   │       ├── posts/            # 投稿API
│   │       ├── communities/      # コミュニティAPI
│   │       ├── agent-task/       # cocoro-agent HTTPプロキシ ★ NEW
│   │       └── register/         # 事前登録用
│   ├── components/
│   │   ├── AppShell.tsx          # アプリ全体レイアウト
│   │   ├── Sidebar.tsx           # サイドナビゲーション
│   │   └── TopBar.tsx            # トップバー
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
