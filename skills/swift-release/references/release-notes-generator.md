# Release Notes Generator

Generate professional, user-focused App Store release notes in 14 languages.

## Supported Languages

Generate release notes for ALL of these languages:

| Code | Language |
|------|----------|
| en | English (source) |
| de | German |
| es | Spanish |
| fr | French |
| hi | Hindi |
| id | Indonesian |
| it | Italian |
| ja | Japanese |
| ko | Korean |
| pt-BR | Brazilian Portuguese |
| ru | Russian |
| vi | Vietnamese |
| zh-Hans | Simplified Chinese |
| zh-Hant | Traditional Chinese |

## Output Format

File path: `fastlane/metadata/{lang}/release_notes.txt`

```
What's New in Version [VERSION]

• [Feature Name] - Clear description of what it does and why it helps users
• [Another Feature] - Explanation of the improvement
• Bug Fixes - Fixed specific issues that users might have encountered
• Performance Improvements - Enhanced app responsiveness and stability
```

## Guidelines

1. **Focus on User Benefits**: Emphasize how changes improve the user experience
2. **Be Concise**: Each bullet point should be clear and actionable
3. **Group Similar Items**: Combine related changes into meaningful categories
4. **Use Native Tone**: Each translation should feel natural, not literal
5. **Prioritize Visibility**: Lead with the most impactful user-facing changes
6. **Avoid Technical Jargon**: Write for general users, not developers
7. **Filter Commits**: Focus ONLY on user-facing features (ignore refactor, chore, ci, docs, test)

## Example Output

### English (fastlane/metadata/en/release_notes.txt)

```
What's New in Version 2025.08.5

• Recurring Tasks - Easily identify repeating reminders with new visual indicators
• Smart List for Recurring Tasks - New dedicated view to manage all recurring reminders
• Improved Task Management - Enhanced performance when handling large numbers of reminders
• Bug Fixes - Fixed an issue where completed recurring tasks weren't properly updating
```

### Japanese (fastlane/metadata/ja/release_notes.txt)

```
バージョン 2025.08.5 の新機能

• 繰り返しタスク - タスクリストで繰り返しリマインダーを視覚的に識別できるようになりました
• 繰り返しタスク専用スマートリスト - すべての繰り返しリマインダーを一箇所で管理できる新しい専用ビュー
• タスク管理の改善 - 大量のリマインダーを扱う際のパフォーマンスを向上
• バグ修正 - 完了した繰り返しタスクが正しく更新されない問題を修正
```

## Process

1. Analyze git commits between versions
2. Filter for user-facing changes only
3. Generate English release notes first
4. Translate to all 14 languages with native tone
5. Save each to `fastlane/metadata/{lang}/release_notes.txt`
