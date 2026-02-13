---
name: docusaurus-i18n
description: Localize Docusaurus pages with Translate wrapping, skeleton generation, and translation. Use when internationalizing Docusaurus sites. Triggers on "i18n", "多言語化", "翻訳追加", "localize page", "internationalize", "ページの多言語化".
model: sonnet
context: fork
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(npx:*), Bash(pnpm:*), TaskCreate, TaskUpdate, TaskList
---

# Docusaurus i18n

Localize Docusaurus pages end-to-end: `<Translate>` / `translate()` wrapping, skeleton generation, translation, fastlane metadata consistency check, and build verification.

Core principle: **Localize, don't translate.** Each translation must read as if a native speaker wrote the web copy from scratch.

## How to Invoke

```
/docusaurus-i18n
/docusaurus-i18n src/pages/index.tsx
```

Specify a file to localize, or let the skill auto-discover pages.

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 0: Route — verify target is Docusaurus i18n"
TaskCreate: "Phase 1: Identify target strings"
TaskCreate: "Phase 2: Wrap with Translate"
TaskCreate: "Phase 3: Generate translation skeletons"
TaskCreate: "Phase 4: Translate"
TaskCreate: "Phase 5: Fastlane consistency check"
TaskCreate: "Phase 6: Build verification"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

## Workflow

### Phase 0: Route

Verify the target is Docusaurus page localization.

**Valid targets:**
- `.tsx` page/component files in a Docusaurus project (with `docusaurus.config.*` present)
- `i18n/{locale}/code.json` files for translation updates

**Redirect:**
- If fastlane metadata detected (`**/metadata/**/subtitle.txt`, `keywords.txt`, `description.txt`): Tell user "This looks like ASO metadata. Please use `/aso-review` instead." and STOP.
- If user asks for LP copy review (not translation): Tell user "For LP copy review, please use `/lp-review` instead." and STOP.
- If Swift `.xcstrings` files detected: Tell user "For Swift localization, please use `/swift-localization` instead." and STOP.

### Phase 1: Identify Target Strings

1. Read the user-specified page/component file
2. Identify all hardcoded English strings in JSX:
   - Text content in JSX elements
   - String props (`title`, `placeholder`, `alt`, `aria-label`, etc.)
3. Skip strings already wrapped with `<Translate>` or `translate()`
4. Present the target string list to the user for confirmation

### Phase 2: Wrap with Translate

1. Add import if not present:
   ```tsx
   import Translate, { translate } from "@docusaurus/Translate";
   ```

2. Wrap JSX text with `<Translate>`:
   ```tsx
   <Translate id="page.section.element">English text</Translate>
   ```

3. Wrap string props with `translate()`:
   ```tsx
   translate({ message: "English text", id: "page.section.element" })
   ```

4. Split complex JSX (with `<strong>`, `<br/>`, `<a>`, etc.) into segments

5. ID naming: `{page}.{section}.{element}` — lowercase, dot-separated

**Reference:** See `references/_translate-patterns.md` for detailed code patterns and pitfalls.

### Phase 3: Generate Translation Skeletons

1. Check target locales in `docusaurus.config.ts` (`i18n.locales`)
2. Generate skeletons per locale:
   ```bash
   npx docusaurus write-translations --locale {locale}
   ```
3. Verify new keys appeared in `i18n/{locale}/code.json`
4. Verify existing translations were NOT overwritten

### Phase 4: Translate

**Localize, don't translate.** See `references/_localization-quality.md` for per-language guidelines.

**Before writing any translation, consider:**

1. **Content type** — Is this a hero headline, feature description, CTA, or FAQ? Each has different rules.
2. **Register** — Match the site's consumer tone per locale (casual for consumer products).
3. **Length** — Web headings should be punchy. Don't expand short English into verbose translations.
4. **Cultural fit** — Use locally natural phrasing, not source-language word order.
5. **SEO** — Translated meta descriptions and headings should use locally researched terms.

**Good/Bad examples:**

Hero headline "Get more done. Stress less.":
- **Bad** (ja): "より多くのことを達成し、ストレスを軽減しましょう" (verbose, translated feel)
- **Good** (ja): "もっとできる。もっとラクに。" (punchy, native rhythm)
- **Bad** (ko): "더 많은 일을 달성하고 스트레스를 줄이세요" (formal, translated)
- **Good** (ko): "할 일은 줄이고, 여유는 늘리고" (casual, rhythmic)
- **Bad** (de): "Erreichen Sie mehr und reduzieren Sie Stress" (Sie form, corporate)
- **Good** (de): "Mehr schaffen. Weniger stressen." (du-implied, punchy)

Feature description "Drag tasks around. Done ones disappear.":
- **Bad** (zh-Hans): "拖动任务进行排列。已完成的任务将自动消失。" (verbose, manual-like)
- **Good** (zh-Hans): "拖一拖就排好，完成即消失" (concise, native)

6. **Present draft translations to user for review** before writing to code.json
7. After approval, edit translations in `i18n/{locale}/code.json`

### Phase 5: Fastlane Consistency Check

If `fastlane/metadata/` exists, check consistency:

1. Compare terminology between web copy and App Store metadata per locale:
   - `subtitle.txt` — subtitle
   - `keywords.txt` — keywords
   - `description.txt` — description

2. Check for:
   - Term inconsistency (e.g., "内蔵" vs "搭載" across web and store)
   - Keyword gaps — store keywords not reflected on web, or vice versa
   - Value proposition alignment — web and store should tell the same story

3. Report inconsistencies with specific before/after suggestions
4. If significant metadata issues are found, suggest the user run `/aso-review` for a full metadata review

**Skip this phase** if no fastlane metadata directory exists.

### Phase 6: Build Verification

1. Run build:
   ```bash
   pnpm run build
   ```

2. Verify:
   - All locales build successfully (en + all target locales)
   - No broken links
   - No broken anchors
   - No `trailingSlash`-related link issues

3. **If build fails:** Fix the issue and re-build (max 3 attempts)

**On success:**
> All locales built successfully.
> - {file}: {N} strings wrapped, {M} locales translated
> - Locales: ja, ko, zh-Hans, de, es, fr

**On failure after max attempts:**
> Build failed after {N} attempts.
> - {locale}: {error} — {suggested fix}

## Examples

### Hero Section

**Bad (ja):**
> 包括的なタスク管理ソリューションでワークフローを革新

**Good (ja):**
> やることを、まとめて管理

**Why:** "包括的" and "ソリューション" are AI vocabulary. "革新" is inflated. The good version is natural and benefit-focused.

### CTA Button

**Bad (ko):**
> 저희 서비스를 무료로 이용해 보시기 바랍니다

**Good (ko):**
> 무료로 시작하기

**Why:** The bad version has Japanese-style politeness norms (keigo leak). The good version is direct.

### Feature Description

**Bad (de):**
> Diese Funktion ermöglicht es Ihnen, Ihre Aufgaben effizient zu organisieren

**Good (de):**
> Aufgaben sortieren — fertig ist fertig

**Why:** Sie form, "ermöglicht es Ihnen" is corporate. The good version uses du-implied casual tone.

### FAQ Answer

**Bad (zh-Hans):**
> 您可以通过访问设置页面来自定义您的通知偏好设置

**Good (zh-Hans):**
> 打开设置，按你的习惯调整通知就好

**Why:** 您 is overly formal for consumer web. The good version is conversational.

## Anti-Patterns

1. **Do NOT skip Phase 0 routing** — wrong target wastes effort; redirect to the correct skill
2. **Do NOT translate brand/tech terms** — "Chimr", "MCP", "API" stay as-is in all locales
3. **Do NOT use literal translation** — localize per-language; each must feel native
4. **Do NOT skip build verification** — broken links and missing translations cause build failures
5. **Do NOT overwrite existing translations** — `write-translations` should only ADD new keys
6. **Do NOT ignore fastlane consistency** — web and store copy must tell the same story

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `Untranslated string` build warning | Missing translation in code.json | Add translation for the locale |
| `Broken link` | trailingSlash or wrong relative path | Use absolute path or adjust `../` prefix |
| `Broken anchor` | Non-ASCII heading without explicit anchor | Add `{#english-anchor}` to heading |
| `Module not found: @docusaurus/Translate` | Missing import | Add `import Translate, { translate }` |
| `Duplicate id` | Same Translate id used twice | Use unique IDs per `{page}.{section}.{element}` |

## Reference Files

| File | Load When |
|------|-----------|
| `references/_translate-patterns.md` | Auto-loaded: Translate/translate() code patterns and Docusaurus pitfalls |
| `references/_localization-quality.md` | Auto-loaded: Per-language web copy translation quality guidelines |
