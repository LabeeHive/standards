---
name: aso-review
description: Review App Store metadata (fastlane) across 14+ languages for ASO, naturalness, and messaging. Use when reviewing localized metadata before release. Triggers on "ASO review", "ASOレビュー", "ストアレビュー", "metadata review", "メタデータレビュー", "store review".
model: opus
context: fork
allowed-tools: Read, Glob, Grep, Edit, Write, Task, TeamCreate, TeamDelete, SendMessage, TaskCreate, TaskUpdate, TaskList, Bash(pnpm:*), Bash(fastlane:*)
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
- `**/i18n/**/*.json` — translation files

**Redirect:** If `.tsx` LP files detected, tell user: "LP pages should use `/lp-review` instead."

### Phase 1: Discover Target Files

```
Glob("**/metadata/**")     → fastlane metadata
Glob("**/i18n/**/*.json")  → translation files
```

- Read ALL discovered files
- Build locale inventory (expect 14+ languages)
- Log discovered locales: `ja, en, ko, zh-Hans, de, es, fr, ...`

### Phase 2: Build Shared Context

Gather before dispatching to reviewers:

1. Full metadata text per locale (subtitle, keywords, description)
2. Locale inventory with file paths
3. Brand voice reference (see `references/_localization-principles.md`)
4. App category and target audience

### Phase 3: Form Review Team & Run Reviews

**Launch ALL 3 agents in ONE message using Task tool. Do NOT launch sequentially.**

| Agent | Role | Focus |
|-------|------|-------|
| aso-reviewer | LEAD — ASO specialist | Per-locale keyword research, subtitle optimization, competitive differentiation, search volume analysis |
| naturalness-reviewer | Naturalness checker | Per-locale naturalness, "translated feel" detection, formality alignment |
| messaging-reviewer | Value proposition & tone | Cross-locale value proposition consistency, tone alignment, brand voice |

**CRITICAL:** Each agent MUST review EVERY detected locale independently. Not just JP and EN.

**Agent instructions must include:**
- Complete metadata text for all locales
- The checklist from `references/_checklist-aso.md`
- The localization principles from `references/_localization-principles.md`
- Instruction to produce per-locale findings with P1/P2/P3 priority

### Phase 4: Cross-Review Discussion

**MUST use SendMessage between agents. Do NOT skip this phase.**

Cross-pollinate findings:

1. Relay ASO keyword suggestions to naturalness-reviewer — "Are these keyword changes still natural?"
2. Relay naturalness findings to aso-reviewer — "Can we preserve keywords while fixing naturalness?"
3. Relay messaging consistency issues across all agents — "Locale X contradicts locale Y on value prop"

This ensures keyword optimization does not break naturalness, and naturalness fixes do not lose keywords.

### Phase 5: Synthesize Results

Produce a prioritized report per locale, then clean up the review team.

**Report format:**

```markdown
# ASO Review Report

## Summary
[Overall assessment across all locales]

## Per-Locale Findings

### ja (Japanese)
#### P1 (Must Fix)
- [Finding with specific before/after suggestion]

#### P2 (Should Fix)
- [Finding]

#### P3 (Nice to Have)
- [Finding]

### ko (Korean)
#### P1 (Must Fix)
...

[Repeat for every detected locale]

## Cross-Locale Issues
- [Issues spanning multiple locales]
```

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

### Korean: Translated vs Localized

**Bad (translated from JP, sounds like a manual):**
> 작업을 관리할 수 있습니다

**Good (localized, casual and scannable):**
> 할 일, 한눈에 정리

### German: Translated vs Localized

**Bad (subject omission from JP source):**
> Verwaltet Aufgaben und Zeit

**Good (addresses user directly):**
> Deine Aufgaben und Zeit im Griff

### Chinese: Translated vs Localized

**Bad (reads like a spec sheet):**
> 任务管理和时间跟踪

**Good (conversational, benefit-oriented):**
> 轻松搞定每日待办

### English: AI Vocabulary in Metadata

**Bad:**
> Delve into comprehensive task management

**Good:**
> See your tasks. Check them off.

## Anti-Patterns

1. **Do NOT launch agents sequentially** — all 3 in ONE Task call
2. **Do NOT skip cross-review discussion** — Phase 4 is mandatory
3. **Do NOT translate keywords** — research local search terms independently per locale
4. **Do NOT review only JP and EN** — MUST review ALL detected locales
5. **Do NOT merge results without discussion** — agents must cross-check findings
6. **Do NOT review LP pages** — redirect user to `/lp-review`

## Reference Files

| File | Load When |
|------|-----------|
| `references/_checklist-aso.md` | Auto-loaded: ASO review checklist |
| `references/_localization-principles.md` | Auto-loaded: Localization guidance and per-language red flags |
