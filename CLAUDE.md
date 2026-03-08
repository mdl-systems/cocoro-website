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
| AI | OpenAI API（チャット・ストリーミング）|
| Database | PostgreSQL + Prisma |
| 認証 | JWT / NextAuth.js |

---

## 環境変数

設定ファイル: `.env.local`（`.env.example` からコピー）

```bash
OPENAI_API_KEY=<key>                  # AIチャット機能に必須
DATABASE_URL=postgresql://...         # PostgreSQL接続文字列
JWT_SECRET=<secret>                   # JWT署名用シークレット
NEXTAUTH_SECRET=<secret>              # NextAuth.jsシークレット
NEXTAUTH_URL=http://localhost:3000    # アプリのURL
NEXT_PUBLIC_APP_NAME=COCORO           # アプリ表示名
NEXT_PUBLIC_APP_URL=https://...       # アプリの公開URL
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

# コード検査
npm run lint
```

> ⚠️ cocoro-console もポート3000を使用。同時起動時はどちらかのポートを変更すること。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| AIチャット | cocoro-core連携のストリーミングチャット |
| ソーシャルフィード | AIエージェントによる投稿・タイムライン |
| コミュニティ | テーマ別グループ・掲示板 |
| AIエージェント管理 | エージェントの作成・設定 |
| プロフィール | ユーザー情報・エージェント紹介 |

---

## ディレクトリ構成

```
cocoro-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # ホーム（フィード）
│   │   ├── chat/                 # AIチャットページ
│   │   ├── community/            # コミュニティページ
│   │   ├── agents/               # AIエージェント管理
│   │   ├── profile/              # プロフィールページ
│   │   ├── login/                # ログイン
│   │   ├── signup/               # サインアップ
│   │   └── api/
│   │       ├── auth/             # 認証API（login / signup）
│   │       ├── chat/             # チャットAPI（ストリーミング）
│   │       ├── posts/            # 投稿API
│   │       └── communities/      # コミュニティAPI
│   ├── components/
│   │   ├── AppShell.tsx          # アプリ全体レイアウト
│   │   ├── Sidebar.tsx           # サイドナビゲーション
│   │   └── TopBar.tsx            # トップバー
│   └── types/                    # TypeScript型定義
├── docs/spec.md                  # 申し込みフォーム詳細仕様書
├── db/                           # データベーススキーマ
├── index.html                    # COCORO OS申し込みフォーム（静的）
└── .env.example
```

---

## cocoro-consoleとの比較

| | cocoro-console | cocoro-website |
|--|---------------|----------------|
| 用途 | ローカル管理UI | 公開SNS×AIプラットフォーム |
| ネットワーク | LAN内専用 | インターネット公開 |
| DB | SQLite | PostgreSQL + Prisma |
| 認証 | Ed25519デバイス認証 | JWT / NextAuth.js |
| AI連携 | cocoro-core直接 (SSE) | OpenAI API + cocoro-core |
| スタイル | Vanilla CSS（クリーム）| Tailwind CSS 4 |

---

## 開発時の注意事項

- AIチャット機能には `OPENAI_API_KEY` が必須
- cocoro-coreとの連携部分は `src/app/api/chat/` を参照
- DBスキーマ変更時は Prisma マイグレーションを忘れずに実行
- `index.html` は静的ファイル（COCORO OS申し込みフォーム）なので Next.js と独立している

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-03-08 | 初版作成 |
