---
description: Claude Code公式ドキュメント（日本語）のインデックス。特定のドキュメントを@で参照する際のガイド。
disable-model-invocation: true
---

# Claude Code 公式ドキュメント インデックス

ドキュメントは `.claude/docs/` に格納されています。
必要なファイルを `@.claude/docs/<ファイル名>` で参照してください。

## ファイル一覧

| ファイル | 内容 |
|---|---|
| `overview.md` | Claude Codeの概要・はじめかた |
| `quickstart.md` | クイックスタートガイド |
| `how-claude-code-works.md` | Claude Codeの仕組み（agenticループ等） |
| `features-overview.md` | 機能一覧 |
| `best-practices.md` | ベストプラクティス（最重要） |
| `context-window.md` | コンテキストウィンドウ管理 |
| `prompt-caching.md` | プロンプトキャッシング |
| `memory.md` | メモリ・CLAUDE.md管理 |
| `sessions.md` | セッション管理 |
| `claude-directory.md` | .claudeディレクトリの使い方 |
| `common-workflows.md` | よく使うワークフロー |
| `permission-modes.md` | 権限モード |
| `platforms.md` | 対応プラットフォーム |
| `prompt-library.md` | プロンプトライブラリ |

## 外部ソース（非公式）

| ファイル | 内容 |
|---|---|
| `cc-features-9.md` | 便利機能カタログ9選（Superpowers／スキル自作／オートモード／MCP／ルーティン／エージェントチームズ／ウルトラレビュー／リモートコントロール／Claude Design・Pencil）。各項目に「この環境での状態」と裏取り区分付き |

> 出典はYouTube解説動画（自動字幕経由）。**判断の根拠にはせず、公式ドキュメントと実環境を優先する。**

## よく使う参照パターン

- ベストプラクティスを確認する → `@.claude/docs/best-practices.md`
- コンテキスト節約の方法 → `@.claude/docs/context-window.md`
- スキルの書き方 → `@.claude/docs/claude-directory.md`
- キャッシュ設定 → `@.claude/docs/prompt-caching.md`
- 使っていない便利機能を探す → `@.claude/docs/cc-features-9.md`
