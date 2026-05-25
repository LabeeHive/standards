---
name: swift-workflow
description: Orchestrate Swift development from Vigilare task to implementation. Use when starting a task or implementing end-to-end. Triggers on "タスクやって", "実装して", "開発開始", "start workflow", "implement task", "swift workflow".
model: sonnet
allowed-tools: Read Glob Grep Skill Task EnterPlanMode AskUserQuestion WebFetch WebSearch Bash(xcrun:*) Bash(swift:*) TaskCreate TaskUpdate TaskList mcp__vigilare__vigilare_get_reminders mcp__vigilare__vigilare_get_reminder mcp__vigilare__vigilare_add_comment mcp__vigilare__vigilare_search_reminders mcp__vigilare__vigilare_get_lists
paths: "**/*.swift"
---

# Swift Workflow

Orchestrate Swift development from Vigilare task to completion.

## Core Principles

1. **Task-driven** - Every implementation starts from a task, ends with recorded progress
2. **Parallel execution** - Run independent operations concurrently
3. **Evidence-based** - Check project config and official docs before implementing
4. **Phase tracking** - Use TaskCreate at start to create phase checklist, TaskUpdate to mark progress
5. **Skill invocation is mandatory** - Each phase lists required skills. You MUST call `Skill("name")` for every listed skill. Text references do NOT count as invocation.
6. **Review gate is mandatory** - Phase 6 MUST pass before proceeding to Build & Test. Do NOT skip.
7. **Related-work aware** - Before planning, search Vigilare for related/duplicate tasks and READ the design docs they reference (do not skim or assume). Assess overlap, dependencies, and correct sequencing — a task may need to be merged, deferred, or done after another decision.

## Phase Tracking

**At workflow start, create tasks for each phase. Each task MUST include the required skill invocations:**

```
TaskCreate: "Phase 1: Task Identification       | Skills: /vigilare-task (if no task exists)"
TaskCreate: "Phase 1.5: Related Work Discovery   | Vigilare search + read related tasks & design docs"
TaskCreate: "Phase 2: Project Context            | Skills: none"
TaskCreate: "Phase 3: Research & Analysis        | Skills: /research"
TaskCreate: "Phase 4: Planning                   | Skills: none (assess sequencing/dependencies)"
TaskCreate: "Phase 5: Implementation             | Skills: /swift-core /swift-architecture (+/swift-ui if Views, /swift-testing for tests)"
TaskCreate: "Phase 6: Review Gate                | Agents: labee-dev-tech-lead, labee-dev-apm"
TaskCreate: "Phase 7: Build & Test               | Skills: none"
TaskCreate: "Phase 8: Localization               | Skills: /swift-localization (if UI strings changed)"
TaskCreate: "Phase 9: Wrap-up                    | Skills: /commit-message"
```

**Update status as you progress:**
- `in_progress` when starting a phase
- `completed` when done

**Skill invocation checklist (verify at end):**

| Phase | Skill/Agent | Invocation | Condition |
|-------|-------------|------------|-----------|
| 1 | `/vigilare-task` | `Skill("vigilare-task")` | No task exists |
| 1.5 | (no skill) | `vigilare_search_reminders` + read related tasks/comments + read referenced design docs | Always |
| 3 | `/research` | `Skill("research")` | Always |
| 5 | `/swift-core` | `Skill("swift-core")` | Always |
| 5 | `/swift-architecture` | `Skill("swift-architecture")` | Always |
| 5 | `/swift-ui` | `Skill("swift-ui")` | SwiftUI views added/changed |
| 5 | `/swift-testing` | `Skill("swift-testing")` | Always (tests required by review gate) |
| 6 | `labee-dev-tech-lead` | `Task(labee-dev-tech-lead)` | Always |
| 6 | `labee-dev-apm` | `Task(labee-dev-apm)` | Always |
| 8 | `/swift-localization` | `Skill("swift-localization")` | UI strings added/changed |
| 9 | `/commit-message` | `Skill("commit-message")` | Always |

## Constraints

| Item | Rule |
|------|------|
| Related work | Phase 1.5 is **mandatory**. MUST search related/duplicate tasks and READ referenced design docs (not skim) before Phase 4. |
| vigilare_get_reminders | `filter: 'all'` is **FORBIDDEN**. Use `today` or `list_id` |
| Commit | Generate message only. User commits (GPG required) |
| Task completion | Do NOT call `vigilare_complete_reminder`. User decides |
| Xcode build | Required for xcstrings update. Ask user to build in Xcode before Phase 8 |
| Review gate | Do NOT skip Phase 6. Both reviewers must approve before Phase 7 |

## Workflow

### Phase 1: Task Identification

**Required skill:** `Skill("vigilare-task")` if no task exists.

**Priority order:**
1. **Check conversation context** - Task already mentioned? Use it
2. **Query Vigilare** - `vigilare_get_reminders(filter: 'today')` or by list
3. **No task exists** - Ask user: "タスクを起票しますか？" → MUST call `Skill("vigilare-task")`

### Phase 1.5: Related Work Discovery (MANDATORY)

**Required skills:** None. **This phase is mandatory and must not be skipped.**

A task rarely exists in isolation. Before researching or planning, find out what else in the backlog and docs touches the same area — otherwise you risk duplicating work, fixing the wrong layer, or building on a design that is about to change.

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Discover related work                             │
├─────────────────────────────────────────────────────────────┤
│ 1. vigilare_search_reminders(query: <keywords>) for each    │
│    key noun in the task (model names, file names, feature). │
│    Run several searches — synonyms and Japanese/English.    │
│ 2. For each related/duplicate hit: vigilare_get_reminder to │
│    read its notes AND comments fully (tasks get re-defined   │
│    in comments — do not trust the title alone).             │
│ 3. READ every design doc / file referenced by those tasks   │
│    (e.g. docs/**). Read the actual content — never assume    │
│    relevance from the filename or skim the first section.   │
│ 4. Glob/Grep the codebase for existing implementations of   │
│    the same concern (a helper/adapter may already exist).   │
└─────────────────────────────────────────────────────────────┘
```

**Produce a short findings note covering:**
- **Duplicates / overlap** — is another task the same or a superset of this one?
- **Dependencies / sequencing** — must a decision or another task land first? Would implementing now be invalidated or redone by pending work (e.g. a schema redesign)?
- **Existing assets** — code/docs already solving part of this.

**Record findings** with `vigilare_add_comment`. If overlap/sequencing is significant, surface it to the user before planning — the right outcome may be to **merge, defer, or re-sequence** the task rather than implement it now.

### Phase 2: Project Context (PARALLEL)

**Required skills:** None.

**Run these in parallel:**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Gather project context                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Glob("**/Package.swift") → Read deployment target        │
│ 2. Glob("**/*.xcodeproj/project.pbxproj") → Read targets    │
│ 3. Glob("**/*.xcconfig") → Read build settings              │
│ 4. Read task notes and comments thoroughly                  │
└─────────────────────────────────────────────────────────────┘
```

**Extract:**
- Deployment target (iOS 17, macOS 14, etc.)
- Target platforms (iOS, macOS, watchOS, etc.)
- Swift version
- Dependencies (SPM packages)

### Phase 3: Research & Analysis (PARALLEL)

**Required skill:** MUST call `Skill("research")` for technical investigation.

**ALWAYS gather official documentation based on Phase 2 findings.**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Research from multiple sources                    │
├─────────────────────────────────────────────────────────────┤
│ 1. Skill("research") ← MUST invoke for technical analysis  │
│ 2. WebSearch: Apple docs for relevant APIs + deployment ver │
│    Example: "SwiftUI NavigationStack iOS 17 site:apple.com" │
│ 3. WebFetch: Specific Apple documentation pages             │
│ 4. Analyze existing codebase (related files, patterns)      │
└─────────────────────────────────────────────────────────────┘
```

**Key searches:**
- API availability for deployment target
- Breaking changes between OS versions
- Best practices for target platform

**Record notable findings** with `vigilare_add_comment`.

### Phase 4: Planning

**Required skills:** None.

1. **Assess sequencing & dependencies FIRST (from Phase 1.5 findings)** - Before designing how, decide *whether to implement now*. If a related task or a pending design decision (e.g. schema/persistence redesign, identity scheme, CloudKit enablement) should land first, or if implementing now would be duplicated/redone by that work, **recommend deferring or re-sequencing** and record the dependency in Vigilare. Do not default to "implement now."
2. Present implementation plan to user
3. Include: files to modify, approach, potential risks
4. **Include deployment target considerations**
5. For complex tasks, use `EnterPlanMode`
6. **Wait for user approval before proceeding**

### Phase 5: Implementation

**Required skills:** MUST call the relevant `swift-*` skills before writing any code. There is **no** `swift-development` skill — it is split into:

- `Skill("swift-core")` — naming, formatting, file organization (**always**)
- `Skill("swift-architecture")` — MVVM, layering, ViewModel/UseCase/Repository, DI (**always**)
- `Skill("swift-ui")` — SwiftUI views, layout, components (**if Views are added/changed**)
- `Skill("swift-testing")` — unit tests, mock/stub, AAA pattern (**always** — tests are required by the Phase 6 review gate)

**After every code change, run swift-format:**

```bash
xcrun swift-format --recursive . --in-place
```

### Phase 6: Review Gate (PARALLEL)

**Required agents:** MUST spawn both `labee-dev-tech-lead` and `labee-dev-apm` via Task tool.

**This phase is BLOCKING. Both reviewers must approve before proceeding to Phase 7.**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Spawn 2 reviewers via Task                        │
├─────────────────────────────────────────────────────────────┤
│ 1. Task(labee-dev-tech-lead) → Process compliance review    │
│    - Tests exist and cover the changes                      │
│    - swift-development references were read and followed    │
│    - Implementation follows existing codebase patterns      │
│    - No TODO placeholders or incomplete sections            │
│                                                             │
│ 2. Task(labee-dev-apm) → Technical quality review           │
│    - Performance concerns (unnecessary allocations, N+1)    │
│    - Crash-prone patterns (force unwraps, unhandled errors) │
│    - Memory management (retain cycles, large allocations)   │
│    - Thread safety (MainActor, Sendable compliance)         │
└─────────────────────────────────────────────────────────────┘
```

**Provide each reviewer with:**
- List of all files changed in Phase 5
- The task description from Phase 1
- Phase 3 research findings (so reviewers can verify references were used)

**On approval:** Both return LGTM → proceed to Phase 7.
**On rejection:** Fix issues cited by reviewers → re-run Phase 6.

### Phase 7: Build & Test

**Required skills:** None.

**REQUIRED before proceeding to localization.**

```bash
# Build
swift build

# Run tests
swift test
```

**If build fails:** Fix errors, re-run swift-format, try again.
**If tests fail:** Fix tests or implementation, re-run swift-format, try again.

### Phase 8: Localization

**Required skill:** `Skill("swift-localization")` if UI strings were added/changed.

**If UI strings were added/changed:**

1. **Ask user to build in Xcode** - Required to update xcstrings
2. Wait for confirmation
3. MUST call `Skill("swift-localization")` to add translations

**If no UI strings changed:** Skip this phase.

### Phase 9: Wrap-up

**Required skill:** MUST call `Skill("commit-message")`.

1. **Generate commit message** - MUST call `Skill("commit-message")`
2. **Record work** - `vigilare_add_comment` with summary of changes
3. **Inform user** - "コミットとタスク完了はお願いします"

## Parallelization Rules

**CRITICAL: Always parallelize independent operations.**

| Phase | Parallel Operations |
|-------|---------------------|
| 1.5 | vigilare_search_reminders (multiple queries) + design-doc reads + codebase Glob/Grep |
| 2 | Project file reads (Package.swift, pbxproj, xcconfig) |
| 3 | Skill("research") + WebSearch + WebFetch + codebase analysis |
| 5 | Multiple file reads before editing |
| 6 | Task(labee-dev-tech-lead) + Task(labee-dev-apm) |

**How to parallelize:**
- Use multiple tool calls in a single message
- Use Task tool with multiple subagents for heavy operations

## Example Session

```
User: "このタスクやって" (with Vigilare task in context)

[TaskCreate for all phases with skill/agent annotations]

Phase 1: Task identified from context → No Skill needed
Phase 1.5: [PARALLEL] vigilare_search_reminders("thumbnail", "サムネ", "loadBooks"...)
         → Found related task #196C11EE (re-defined in its comments) + design doc
         → Read the doc fully; flagged sequencing dependency → recorded to Vigilare
Phase 2: [PARALLEL] Read Package.swift, project.pbxproj, task notes
         → Found: iOS 17+, macOS 14+, Swift 5.9
Phase 3: [PARALLEL]
         - Skill("research") ← INVOKED
         - WebSearch "SwiftUI Observable iOS 17 site:apple.com"
         - WebFetch Apple docs
         - Read existing code
         → Record findings to Vigilare comment
Phase 4: Present plan with deployment target considerations
Phase 5: Skill("swift-core") + Skill("swift-architecture") + Skill("swift-testing") ← INVOKED
         (Skill("swift-ui") too if Views changed)
         Implement with standards + swift-format
Phase 6: [PARALLEL] ← REVIEW GATE
         - Task(labee-dev-tech-lead): "テスト書いた？リファレンス読んだ？"
         - Task(labee-dev-apm): "パフォーマンス問題ないか？クラッシュしないか？"
         → Both LGTM → proceed
Phase 7: swift build → swift test → All green
Phase 8: Ask user to build in Xcode
         Skill("swift-localization") ← INVOKED
Phase 9: Skill("commit-message") ← INVOKED
         Record progress to Vigilare
         → "コミットとタスク完了はお願いします"
```
