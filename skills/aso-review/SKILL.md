---
name: aso-review
description: Review App Store metadata (fastlane) across 14+ languages for ASO, naturalness, and messaging. Use when reviewing localized metadata before release.
when_to_use: Triggers on "ASO review", "ASOレビュー", "ストアレビュー", "metadata review", "メタデータレビュー", "store review".
allowed-tools: Read Glob Grep Edit Write Agent SendMessage TaskCreate TaskUpdate TaskList Bash(cat:*) Bash(pnpm:*) Bash(fastlane:*)
argument-hint: "[path/to/fastlane/metadata]"
---

# ASO Review

Review App Store metadata across all locales from three perspectives: ASO optimization, naturalness, and messaging consistency.

Core principle: **Localize, don't translate.** Metadata must read as if a native speaker wrote it from scratch.

## Review Checklist (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_checklist-aso.md" 2>/dev/null || echo "(reference missing: _checklist-aso.md)"
```

## Localization Principles (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_localization-principles.md" 2>/dev/null || echo "(reference missing: _localization-principles.md)"
```

## How to Invoke

```
/aso-review
/aso-review path/to/fastlane/metadata
```

The skill auto-discovers metadata files. No arguments needed if fastlane metadata is in the standard location.

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 0: Route — verify target is ASO metadata"
TaskCreate: "Phase 1: Discover target files"
TaskCreate: "Phase 2: Build shared context"
TaskCreate: "Phase 3: Run reviews"
TaskCreate: "Phase 4: Reconcile findings"
TaskCreate: "Phase 5: Synthesize results"
TaskCreate: "Phase 6: Apply fixes (after user approval)"
```

Update status as you progress: `in_progress` when starting, `completed` when done. The task tools are opt-in on current models — when they are not available, keep the same phases as a checklist in your response instead. The phases are the contract; the tool is one way to hold it.

## Workflow

### Phase 0: Route

Verify the review target is ASO metadata.

**Valid targets:**

- `**/metadata/**` — fastlane metadata (subtitle, keywords, description per locale)

**Redirect:** If `.tsx` LP files or `docusaurus.config.*` detected, tell user: "LP pages should use `/lp-review` instead."

**No metadata found:** If no fastlane metadata directory exists, ask the user for the path before proceeding.

### Phase 1: Discover Target Files

```
Glob("**/metadata/**")     → fastlane metadata
```

- Read ALL discovered files
- Build the locale inventory from what is actually on disk — the tree is the source of truth, not a fixed expected count
- Log discovered locales: `ja, en, ko, zh-Hans, de, es, fr, ...`

Report the locale count in your findings and review every locale you found. Do not block waiting for locales that may or may not be coming.

### Phase 2: Build Shared Context

Gather before dispatching to reviewers:

1. Full metadata text per locale (subtitle, keywords, description)
2. Locale inventory with file paths
3. Brand voice reference (the injected localization principles above)
4. App category and target audience

### Phase 3: Run Reviews

**Spawn all 3 reviewers in ONE message using the Agent tool. Do NOT launch sequentially.**

| Reviewer | subagent_type | Role |
|----------|---------------|------|
| ASO | labee-marketing-aso | ASO optimization |
| Naturalness | general-purpose | Naturalness checking |
| Messaging | labee-pmm-fujimoto-ren | Value proposition & tone |

Each reviewer works independently and returns its findings to you. Reviewers do not talk to each other — you reconcile their output in Phase 4.

**Name each reviewer when you spawn it** (the Agent tool's `name` parameter, e.g. `aso-review-agent`, `naturalness-review`, `messaging-review`) so Phase 4 can go back to the one that raised a finding.

**Brief contents (every reviewer):** where to put the result (a file path once it runs past a few lines — per-locale findings usually do), the output format, what a complete review covers (every detected locale), and what is out of scope (another reviewer's angle — you reconcile in Phase 4); the reporting lines (plan to main, one line per milestone, message-and-wait before going outside the brief, results to a file) are appended to every brief by this plugin's `hooks/hooks.json`.

**Each agent receives:**

- Complete metadata text for all locales
- The checklist from `references/_checklist-aso.md`
- The localization principles from `references/_localization-principles.md`
- Instruction to produce per-locale findings grouped by locale

Each reviewer covers every detected locale independently — a locale reviewed by inference from its neighbour is not reviewed.

**Per-agent instructions:**

**ASO reviewer:**

- Per-locale keyword research (keywords are NOT translated — research local search terms independently)
- Subtitle optimization within character limits (CJK ~15, Latin ~30)
- Competitive differentiation per market (competitors differ by region)
- Search volume analysis for primary keywords

**Naturalness reviewer:**

- Detect "translated feel" per locale (source-language structure leaking through)
- Check formality alignment (consumer app = casual register in most locales)
- Flag literally translated idioms and keyword stuffing disguised as natural text
- Suggest specific rewrites for every flagged item

**Messaging reviewer:**

- Cross-locale value proposition consistency (core benefit must align)
- Tone alignment with brand voice across all locales
- Feature naming consistency (translated vs kept original)
- Flag contradicting claims between locales

### Phase 4: Reconcile Findings

The three reviewers optimize for different things, so their recommendations will collide. Work through the collisions yourself before writing the report:

1. **Keyword vs naturalness** — a keyword the ASO reviewer wants may be phrasing the naturalness reviewer rejects. Prefer the natural phrasing unless the keyword carries real search volume; say which you chose and why.
2. **Per-locale vs cross-locale** — the messaging reviewer works across locales and may object to a rewrite that reads well in isolation. Cross-locale consistency of the value proposition wins over a locally nicer sentence.
3. **Unsupported claims** — if a subtitle or keyword promises a capability no description mentions, flag it as an accuracy risk rather than silently keeping it.

If a reviewer's finding is thin or you need it re-checked against another's, go back to the reviewer that raised it with `SendMessage(to: <name>)` — say what you need re-checked and why — rather than guessing. Do not spawn a fresh reviewer for a re-check: a new one has not seen the findings it would be verifying and re-reads everything from zero. A fresh spawn is only for a reviewer that has died or lost its context.

### Phase 5: Synthesize Results

Produce a consolidated report per locale from the reconciled findings

**Report format:**

```markdown
# ASO Review Report

## Summary
[Overall assessment across all locales]

## Per-Locale Findings

### ja (Japanese)
- [Finding with specific before/after suggestion]

### ko (Korean)
- [Finding with specific before/after suggestion]

[Repeat for every detected locale]

## Cross-Locale Issues
- [Issues spanning multiple locales]

## Conflicts Resolved
- [Conflict]: [how you resolved it and why]
```

Then present it to the user and wait for approval before applying fixes.

### Phase 6: Apply Fixes

**Only after user approval.**

1. Apply approved changes to metadata files
2. Run `pnpm run build` if applicable
3. Present diff summary

## Examples

### ASO Subtitle

**Bad (keyword stuffing):**
> タスク管理・時間管理・プロジェクト管理・チーム管理アプリ

**Good (natural with keyword):**
> チームのタスクと時間をまとめて管理

**Why:** The bad version crams every keyword into the subtitle, sacrificing readability. The good version includes the primary keyword naturally while communicating a clear benefit.

### Korean: Translated vs Localized

**Bad (translated from JP, sounds like a manual):**
> 작업을 관리할 수 있습니다

**Good (localized, casual and scannable):**
> 할 일, 한눈에 정리

**Why:** The bad version uses formal -습니다 endings and technical 작업 (work/task), reading like a translated manual. The good version uses casual 할 일 (to-do) with a noun-ending phrase natural to Korean App Store copy.

### German: Translated vs Localized

**Bad (subject omission from JP source):**
> Verwaltet Aufgaben und Zeit

**Good (addresses user directly):**
> Deine Aufgaben und Zeit im Griff

**Why:** The bad version omits the subject (natural in Japanese, awkward in German) and uses a bare verb. The good version addresses the user directly with "Deine" (du-form), standard for German consumer apps.

### Chinese: Translated vs Localized

**Bad (reads like a spec sheet):**
> 任务管理和时间跟踪

**Good (conversational, benefit-oriented):**
> 轻松搞定每日待办

**Why:** The bad version lists features in formal written register. The good version uses colloquial phrasing native to the Chinese App Store, leading with the benefit.

### English: AI Vocabulary in Metadata

**Bad:**
> Delve into comprehensive task management

**Good:**
> See your tasks. Check them off.

**Why:** The bad version uses AI vocabulary ("delve", "comprehensive") that signals machine-generated text. The good version is concrete, action-oriented, and sounds human-written.

## Anti-Patterns

1. Keywords are researched per market, never translated from the source locale — a translated keyword is a keyword nobody searches for.
2. Reviewer output is reconciled in Phase 4, not concatenated — raw concatenation leaves their conflicts in the report for the reader to resolve.
3. LP pages belong to `/lp-review`. Redirect rather than reviewing them here.

## Reference Files

| File | Load When |
|------|-----------|
| `references/_checklist-aso.md` | Injected on every invocation (above) — the ASO review checklist |
| `references/_localization-principles.md` | Injected on every invocation (above) — localization guidance and per-language red flags |
