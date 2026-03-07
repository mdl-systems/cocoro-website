# COCORO Web — 申し込みフォーム

> COCORO OS MINI PC の購入申し込みフォームです。  
> AIエージェントの初期人格形成に必要な情報を収集します。

## プレビュー

```bash
python -m http.server 8080
# → http://localhost:8080
```

## フォーム構成

| Phase | 内容 | 項目数 |
|-------|------|--------|
| 1 | 基本情報（氏名・メール・生年月日・職業・居住地） | 6項目 |
| 2 | 10問診断（価値観・リスク・倫理・思考・感情・目標・対話） | 10問 |
| 3 | エージェント設定（トーン・密度・ミッション） | 3項目 |
| 4 | 宿命属性（血液型・占い受容度・SNS連携） | 2必須+2任意 |

## 設計思想

- 購入時の入力は **10問** に厳選（離脱率最小化）
- 生年月日から星座・干支・日干・星宿を **自動推計**
- 占術バイアスと10問回答を **受容度でブレンド** してAIの初期Valuesを生成

## ファイル

```
cocoro-web/
├── index.html      # フォーム本体（HTML + CSS + JS 単一ファイル）
├── README.md       # このファイル
└── docs/
    └── spec.md     # 詳細仕様書
```

## 関連リポジトリ

- [mdl-systems/cocoro-core](https://github.com/mdl-systems/cocoro-core) — AI OS 本体

## License

MIT
