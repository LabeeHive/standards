---
name: aso-review
description: Review App Store metadata (fastlane) across 14+ languages for ASO, naturalness, and messaging. Use when reviewing localized metadata before release.
when_to_use: Triggers on "ASO review", "ASOレビュー", "ストアレビュー", "metadata review", "メタデータレビュー", "store review".
allowed-tools: Read Glob Grep Edit Write Task TaskCreate TaskUpdate TaskList Bash(pnpm:*) Bash(fastlane:*)
argument-hint: "[path/to/fastlane/metadata]"
---

# ASO Review

Review App Store metadata across all locales from three perspectives: ASO optimization, naturalness, and messaging consistency.

Core principle: **Localize, don't translate.** Metadata must read as if a native speaker wrote it from scratch.

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
TaskCreate: "Phase 3: Form review team & run reviews"
TaskCreate: "Phase 4: Cross-review discussion"
TaskCreate: "Phase 5: Synthesize results"
TaskCreate: "Phase 6: Apply fixes (after user approval)"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

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
3. Brand voice reference (see `references/_localization-principles.md`)
4. App category and target audience

### Phase 3: Run Reviews

**Spawn all 3 reviewers in ONE message using the Task tool. Do NOT launch sequentially.**

| Reviewer | subagent_type | Role |
|----------|---------------|------|
| ASO | labee-marketing-aso | ASO optimization |
| Naturalness | general-purpose | Naturalness checking |
| Messaging | labee-pmm-fujimoto-ren | Value proposition & tone |

Each reviewer works independently and returns its findings to you. Reviewers do not talk to each other — you reconcile their output in Phase 4.

**Each agent receives:**
- Complete metadata text for all locales
- The checklist from `references/_checklist-aso.md`
- The localization principles from `references/_localization-principles.md`
- Instruction to produce per-locale findings grouped by locale

**CRITICAL:** Each agent MUST review EVERY detected locale independently. Not just JP and EN.

**Per-agent instructions:**

**aso-reviewer (LEAD):**
- Per-locale keyword research (keywords are NOT translated — research local search terms independently)
- Subtitle optimization within character limits (CJK ~15, Latin ~30)
- Competitive differentiation per market (competitors differ by region)
- Search volume analysis for primary keywords
- Makes final call on conflicts between ASO and naturalness

**naturalness-reviewer:**
- Detect "translated feel" per locale (source-language structure leaking through)
- Check formality alignment (consumer app = casual register in most locales)
- Flag literally translated idioms and keyword stuffing disguised as natural text
- Suggest specific rewrites for every flagged item

**messaging-reviewer:**
- Cross-locale value proposition consistency (core benefit must align)
- Tone alignment with brand voice across all locales
- Feature naming consistency (translated vs kept original)
- Flag contradicting claims between locales

### Phase 4: Reconcile Findings

The three reviewers optimize for different things, so their recommendations will collide. Work through the collisions yourself before writing the report:

1. **Keyword vs naturalness** — a keyword the ASO reviewer wants may be phrasing the naturalness reviewer rejects. Prefer the natural phrasing unless the keyword carries real search volume; say which you chose and why.
2. **Per-locale vs cross-locale** — the messaging reviewer works across locales and may object to a rewrite that reads well in isolation. Cross-locale consistency of the value proposition wins over a locally nicer sentence.
3. **Unsupported claims** — if a subtitle or keyword promises a capability no description mentions, flag it as an accuracy risk rather than silently keeping it.

If a reviewer's finding is thin or you need it re-checked against another's, spawn a follow-up Task rather than guessing.

### Phase 5: Synthesize Results

1. Collect final feedback from all agents after cross-review
2. Produce a consolidated report per locale

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
- [Conflict]: [Resolution by lead reviewer]
```

3. Present the report to the user and wait for approval before applying fixes.

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

1. **Do NOT launch agents sequentially** — all 3 in ONE Task call
2. **Do NOT concatenate reviewer output** — Phase 4 is where their conflicts get resolved
3. **Do NOT translate keywords** — research local search terms independently per locale
4. **Do NOT review only JP and EN** — MUST review ALL detected locales
5. **Do NOT merge results without discussion** — agents must cross-check findings
6. **Do NOT review LP pages** — redirect user to `/lp-review`
7. **Do NOT block waiting for locales** — review what is on disk and report the count

## Reference Files

| File | Load When |
|------|-----------|
| `references/_checklist-aso.md` | Auto-loaded: ASO review checklist |
| `references/_localization-principles.md` | Auto-loaded: Localization guidance and per-language red flags |
