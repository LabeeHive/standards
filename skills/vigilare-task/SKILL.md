---
name: vigilare-task
description: Create Vigilare tasks with proper structure. Use this when adding tasks or reminders to Vigilare. Triggers on "タスク作成", "起票して", "Vigilare", "create task", "add reminder", "TODO追加".
model: sonnet
allowed-tools: Read Glob Grep mcp__vigilare__vigilare_get_lists mcp__vigilare__vigilare_create_reminder mcp__vigilare__vigilare_update_reminder mcp__vigilare__vigilare_add_comment
---

# Vigilare Task Skill

Create well-structured Vigilare tasks following established patterns.

## Task Title Format

### Development Tasks
```
[カテゴリ] 具体的なタスク名
```

**カテゴリ例:**
- `[MCP]` - MCP server関連
- `[UI]` - ユーザーインターフェース
- `[API]` - API関連
- `[Bug]` - バグ修正
- `[Refactor]` - リファクタリング
- `[Test]` - テスト関連
- `[Docs]` - ドキュメント

### Operations Tasks
シンプルなタスク名（カテゴリ不要）

## Notes Structure (Development Tasks)

```markdown
## 概要
何をするか、なぜ必要かを1-2文で説明

## ゴール
- 達成すべき具体的な項目
- 箇条書きで列挙
- 完了条件が明確であること

## 関連ファイル
- path/to/file.swift
- path/to/another.swift

## 技術メモ
- 実装上の注意点
- 現状の問題点
- 参考情報
```

## List Selection

| List Pattern | Use For |
|--------------|---------|
| `Labee - {Project}` | プロジェクト固有のタスク |
| `{Company} - Operations` | 事業運営タスク |
| `Ideas` | アイデア・将来検討事項 |
| `技術検証` | 技術調査・PoC |

## Comment Conventions

- **進捗報告**: 作業内容を簡潔に記録
- **バグ報告**: `【バグ報告 YYYY-MM-DD】` プレフィックス
- **修正完了**: `【修正完了 YYYY-MM-DD】` プレフィックス
- **決定事項**: 判断理由を含めて記録

## Priority

- `1` (!!!): 緊急・今日中
- `5` (!!): 重要・今週中
- `9` (!): 通常
- `0`: 優先度なし

## When Invoked

### Step 1: リスト選択

`vigilare_get_lists` でリスト一覧を取得し、適切なリストを選択。

```
Labee - Vigilare  → Vigilare 開発タスク
Labee - Chimr     → Chimr 開発タスク
Labee - Operations → 事業運営タスク
Ideas             → アイデア・将来検討
技術検証           → 技術調査・PoC
```

### Step 2: タイトル生成

開発タスクの場合は `[カテゴリ]` を付与：
```
[MCP] リスト作成機能を追加
[Bug] ログイン時にクラッシュする問題を修正
```

Operations タスクはシンプルに：
```
年金事業の確認書類の返送
```

### Step 3: Notes 作成

開発タスクの場合、以下の構造で作成：
```markdown
## 概要
何をするか、なぜ必要かを1-2文で説明

## ゴール
- 達成すべき具体的な項目
- 完了条件が明確であること

## 関連ファイル
- path/to/file.swift

## 技術メモ
- 実装上の注意点
- 現状の問題点
```

### Step 4: タスク作成

`vigilare_create_reminder` を呼び出し：
- `title`: 生成したタイトル
- `list_id`: 選択したリストのID
- `notes`: 構造化した Notes
- `priority`: 1(緊急) / 5(重要) / 9(通常) / 0(なし)
- `due_date`: 期限があれば YYYY-MM-DD 形式

### Step 5: 補足追加（任意）

追加情報があれば `vigilare_add_comment` で記録：
- 背景情報
- 参考リンク
- 懸念事項

### Step 6: 完了報告

作成したタスクの内容をユーザーに報告：
- タスク名
- 登録先リスト
- 設定した優先度・期限
