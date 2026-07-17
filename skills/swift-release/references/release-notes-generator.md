# Release Notes Generator

Guidelines for the Task that generates App Store "What's New" text. The caller (swift-release
skill) injects these guidelines, the app's product context from `.claude/release-config.md`,
the version pair, the commit list, and the locale list into the Task prompt.

## Role

Generate professional, user-focused release notes for App Store distribution. You receive
two version numbers, a pre-filtered commit list, and an app product context. You do not
write any files and you do not run `git log` — you return the generated text for each locale
directly in your final response so the caller can pass it to Portus.

## Process

1. **Analyze Changes**: From the provided commit list, identify user-facing changes only
2. **Generate Release Notes**: Write the English (`en-US`) version first, then localize to
   every other configured locale
3. **Return Results**: Output the full content for each configured locale in your final
   response, clearly labeled per locale (e.g., `### en-US`). Do not create or write any files.

## Output Format (per locale)

The first line is the locale's configured title line (provided by the caller from the repo's
release config), then a blank line, then the bullets:

```
<title line for this locale, with the current version substituted>

• [Feature Name] - Clear description of what it does and why it helps users
• [Another Feature] - Explanation of the improvement
• Bug Fixes - Fixed specific issues that users might have encountered
• Performance Improvements - Enhanced app responsiveness and stability
```

## Guidelines

1. **Focus on User Benefits**: Explain what users gain, not technical implementation
2. **Be Concise**: Each bullet point should be clear and to the point
3. **Group Similar Items**: Combine related changes into meaningful categories
4. **Use Native Tone**: Each localization should feel natural in that language, not like a
   direct translation
5. **Prioritize Visibility**: Lead with the most impactful user-facing changes
6. **Avoid Technical Jargon**: Write for general users, not developers
7. **Ignore Technical Commits**: Skip commits prefixed with `refactor:`, `chore:`, `ci:`,
   `docs:`, `test:`, `build:`, `i18n:` — and anything else with no user-visible effect
   (dev tooling, internal config, code comments)

## Example Output

```
### en-US
What's New in Version 2026.07.2

• Shape Tools - Draw perfect lines, rectangles, and circles with a single drag
• Layer Actions - Duplicate layers or merge them down right from the layer list
• Bug Fixes - Layer opacity and blend modes now render correctly everywhere
```

```
### ja
バージョン 2026.07.2 の新機能

• 図形ツール - ドラッグひとつで直線・四角形・円をきれいに描画
• レイヤー操作 - レイヤー一覧から複製や下のレイヤーとの結合が可能に
• 不具合修正 - レイヤーの不透明度とブレンドモードが正しく反映されるように
```

## Important Notes

- Generate exactly the locales the caller lists — no more, no fewer
- Return the content directly in your final response — never write files
- Ensure consistency in version numbers across all locales
- Maintain professional tone appropriate for App Store listings
- Ground every bullet in the provided commit list — never invent features
