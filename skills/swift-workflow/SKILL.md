---
name: swift-workflow
description: Orchestrates Swift development from Vigilare task to implementation, covering related-work discovery, multi-skill implementation, review gate, build/test, localization, and wrap-up. Use when starting a task or implementing end-to-end.
when_to_use: Triggers on "タスクやって", "実装して", "開発開始", "start workflow", "implement task", "swift workflow".
---

# Swift Workflow

Orchestrate Swift development from Vigilare task to completion.

## Core Principles

1. **Task-driven** - Every implementation starts from a task, ends with recorded progress
2. **Parallel execution** - Run independent operations concurrently
3. **Evidence-based** - Check project config and official docs before implementing
4. **Phase tracking** - Use TaskCreate at start to create phase checklist, TaskUpdate to mark progress
5. **Skill invocation is mandatory** - Each phase lists required skills. You MUST call `Skill("name")` for every listed skill. Text references do NOT count as invocation.
6. **Review gate** - Phase 6 blocks Build & Test. It exists to catch local optimization and reliance on rejected references, which the author cannot see from inside the change; it is not a process audit.
7. **Related-work aware** - Before planning, search Vigilare for related/duplicate tasks and READ the design docs they reference, in full. Assess overlap, dependencies, and correct sequencing — a task may need to be merged, deferred, or done after another decision.

## Phase Tracking

**At workflow start, create tasks for each phase. Each task MUST include the required skill invocations:**

```
TaskCreate: "Phase 1: Task Identification       | Skills: /vigilare-task (if no task exists)"
TaskCreate: "Phase 1.5: Related Work Discovery   | Vigilare search + read related tasks & design docs"
TaskCreate: "Phase 2: Project Context            | Skills: none"
TaskCreate: "Phase 3: Check what you know        | Verify recalled APIs against Apple docs"
TaskCreate: "Phase 4: Planning                   | Skills: none (assess sequencing/dependencies)"
TaskCreate: "Phase 5: Implementation             | Skills: /swift-core /swift-architecture (+/swift-ui if Views, /swift-testing for tests)"
TaskCreate: "Phase 6: Review Gate                | Agents: labee-dev-tech-lead, labee-dev-apm"
TaskCreate: "Phase 7: Build & Test               | Skills: none"
TaskCreate: "Phase 8: Localization               | Skills: /swift-localization (if UI strings changed)"
TaskCreate: "Phase 9: Wrap-up                    | Skills: /commit-message"
```

The task tools are opt-in on current models — when `TaskCreate`/`TaskUpdate`/`TaskList` are not available, keep the same phases as a checklist in your response instead. The phases are the contract; the tool is one way to hold it.

**Update status as you progress:**

- `in_progress` when starting a phase
- `completed` when done

**Skill invocation checklist (verify at end):**

| Phase | Skill/Agent | Invocation | Condition |
|-------|-------------|------------|-----------|
| 1 | `/vigilare-task` | `Skill("vigilare-task")` | No task exists |
| 1.5 | (no skill) | `vigilare_search_reminders` + read related tasks/comments + read referenced design docs | Always |
| 3 | `/research` | `Skill("research")` | Only for genuinely deep questions |
| 5 | `/swift-core` | `Skill("swift-core")` | Always |
| 5 | `/swift-architecture` | `Skill("swift-architecture")` | Always |
| 5 | `/swift-ui` | `Skill("swift-ui")` | SwiftUI views added/changed |
| 5 | `/swift-testing` | `Skill("swift-testing")` | Always |
| 6 | `labee-dev-tech-lead` | `Agent(labee-dev-tech-lead)` | Always |
| 6 | `labee-dev-apm` | `Agent(labee-dev-apm)` | Always |
| 8 | `/swift-localization` | `Skill("swift-localization")` | UI strings added/changed |
| 9 | `/commit-message` | `Skill("commit-message")` | Always |

## Constraints

| Item | Rule |
|------|------|
| Related work | Phase 1.5 is **mandatory**. MUST search related/duplicate tasks and READ referenced design docs (not skim) before Phase 4. |
| vigilare_get_reminders | `filter: 'all'` returns every reminder and floods the context, and the work after it gets sloppy — list with `today` or `list_id`, then narrow |
| Commit | Commit in the workflow: subject from `/commit-message`, body written by this session (see `/project-conventions` for the commit shape). The permission prompt on `git commit` is the gate |
| Task completion | Do NOT call `vigilare_complete_reminder`. User decides |
| Xcode build | Required for xcstrings update. Ask user to build in Xcode before Phase 8 |
| Review gate | Both reviewers must approve before Phase 7. Send them the standards — a reviewer running in a fresh context cannot enforce what it has not read |

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
│    read its notes AND comments fully (tasks get re-defined  │
│    in comments — read the body, not just the title).        │
│ 3. READ every design doc / file referenced by those tasks   │
│    (e.g. docs/**). Read the actual content: relevance is    │
│    settled by what a file says, not by its name.            │
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

**Config files discovered from the project root are injected below** — use these paths instead of re-globbing, then Read the relevant ones:

!`find . \( -name 'Package.swift' -o -name '*.xcconfig' -o -name 'project.pbxproj' \) -not -path '*/.*' -not -path '*/.build/*'`

**Run these in parallel:**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Gather project context                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Read Package.swift (injected path) → deployment target   │
│ 2. Read *.xcodeproj/project.pbxproj (injected) → targets    │
│ 3. Read *.xcconfig (injected path) → build settings         │
│ 4. Read task notes and comments thoroughly                  │
└─────────────────────────────────────────────────────────────┘
```

**Extract:**

- Deployment target (iOS 17, macOS 14, etc.)
- Target platforms (iOS, macOS, watchOS, etc.)
- Swift version
- Dependencies (SPM packages)

### Phase 3: Check what you actually know

There is no fixed research step. What there is, is a standing problem: **your Swift, SwiftUI and Xcode knowledge is frequently out of date.** Apple moves APIs, deprecates them, and changes platform behaviour faster than any training cutoff, so recalling an API confidently is not evidence that it exists, is still available, or behaves the way you remember on the deployment target found in Phase 2.

Before relying on a recalled fact, check it. Read the existing codebase first — it is the most reliable source for how this project already does things — then go to Apple's documentation for anything about API availability, deprecation, or platform behaviour. Search when the answer is uncertain, not on a schedule.

Reach for `Skill("research")` when the question is genuinely deep: conflicting sources, a bug with no obvious cause, or a comparison that has to hold up. A single API check does not need it.

**Record anything a future reader would need** with `vigilare_add_comment` — a deprecation you worked around, a version constraint you discovered, a behaviour that contradicted the docs.

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
- `Skill("swift-testing")` — unit tests, mock/stub, AAA pattern (**always**)

**After every code change, run swift-format:**

```bash
xcrun swift-format --recursive . --in-place
```

### Phase 6: Review Gate (PARALLEL)

**Spawn both `labee-dev-tech-lead` and `labee-dev-apm` in one message via the Agent tool. This phase blocks Phase 7 until both approve.**

Why a separate reviewer, when you have already checked your own work: the two failure modes this catches are ones the author structurally cannot see. **Local optimization** — a change that is right for the file in front of you and wrong for the codebase — looks correct from inside the change. And **building on the wrong reference** — a pattern lifted from a source this project has deliberately moved away from — looks well-researched from inside the change. A reader who did not write the code and holds the standards catches both. In practice this gate has measurably reduced defects here, which is why it stays.

Ask the reviewer about the code, which is what a second reader can judge. Whether tests exist, references were opened or TODOs remain is yours to verify as you go, and a second pass over the same checklist buys nothing.

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Spawn 2 reviewers via Agent                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Agent(labee-dev-tech-lead) → Standards compliance        │
│    - Violations of the swift-* standards, cited by rule     │
│    - Local optimization: right here, wrong for the codebase │
│    - Patterns copied from a source this project rejects     │
│    - Layer boundaries: View→ViewModel→UseCase→Repository    │
│                                                             │
│ 2. Agent(labee-dev-apm) → Technical quality                 │
│    - Performance (unnecessary allocations, N+1)             │
│    - Crash-prone patterns (force unwraps, unhandled errors) │
│    - Memory management (retain cycles, large allocations)   │
│    - Thread safety (MainActor, Sendable compliance)         │
└─────────────────────────────────────────────────────────────┘
```

**Give each reviewer:** the files changed in Phase 5, the task from Phase 1, and the paths to the relevant `swift-*` references. A reviewer that has not read the standards cannot enforce them, and it runs in a fresh context — a named agent type like `labee-dev-tech-lead` starts from zero and sees nothing of this conversation unless you send it (only `subagent_type: "fork"` inherits the conversation, and these reviewers are not forks).

**Brief contents (both reviewers):** where to put the result (a file path once it runs past a few lines), the format you want it in, what counts as approval, and what is out of scope (process auditing — see above); the reporting lines (plan to main, one line per milestone, message-and-wait before going outside the brief, results to a file) are delivered to every subagent at start by this plugin's `hooks/hooks.json` (a `SubagentStart` hook).

**Name the reviewers when you spawn them** (the Agent tool's `name` parameter, e.g. `tech-lead-review` and `apm-review`) so a rejection can go back to the same reviewer.

**On approval:** both return LGTM → Phase 7.
**On rejection:** fix what they cite, then send the fix to the *same* reviewer with `SendMessage(to: <name>)` — what changed and where — and ask it to re-check its own findings. Do not spawn a fresh reviewer for the re-review: a new one has not seen the findings it would be verifying, and re-reads everything from zero. Repeat until it returns LGTM; a fresh spawn is only for a reviewer that has died or lost its context.

### Phase 7: Build & Test

**Required skills:** None.

**REQUIRED before proceeding to localization.**

**For an app target built with `xcodebuild`**, list available simulators yourself and pick a destination (SPM-only projects use `swift build`/`swift test` directly and can skip this):

```bash
xcrun simctl list devices available
```

> Run this when you reach Phase 7, not earlier — `simctl` talks to CoreSimulatorService over XPC, which the command sandbox blocks. If it fails with a CoreSimulatorService/`Operation not permitted` error, re-run it with the sandbox disabled.

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

1. **Generate commit message** - MUST call `Skill("commit-message")` for the subject line, then write the body from what this session changed, verified, and left undone (see `/project-conventions` for the shape)
2. **Commit** - stage the change and `git commit` with that message. The permission prompt is the gate; if it is declined, hand the message to the user instead
3. **Record work** - `vigilare_add_comment` with summary of changes
4. **Inform user** - タスク完了は user が行う。Do NOT call `vigilare_complete_reminder`

## Parallelization Rules

Run independent operations in parallel:

| Phase | Parallel Operations |
|-------|---------------------|
| 1.5 | vigilare_search_reminders (multiple queries) + design-doc reads + codebase Glob/Grep |
| 2 | Project file reads (Package.swift, pbxproj, xcconfig) |
| 3 | Codebase reads + Apple doc lookups for anything version-dependent |
| 5 | Multiple file reads before editing |
| 6 | Agent(labee-dev-tech-lead) + Agent(labee-dev-apm) |

**How to parallelize:**

- Use multiple tool calls in a single message
- Use Agent tool with multiple subagents for heavy operations

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
Phase 3: Read the existing code first, then checked the two APIs the plan
         depends on against Apple docs (availability on iOS 17). No /research
         needed — nothing was in dispute.
         → Recorded one deprecation note to Vigilare
Phase 4: Present plan with deployment target considerations
Phase 5: Skill("swift-core") + Skill("swift-architecture") + Skill("swift-testing") ← INVOKED
         (Skill("swift-ui") too if Views changed)
         Implement with standards + swift-format
Phase 6: [PARALLEL] ← REVIEW GATE
         - Agent(labee-dev-tech-lead): "標準に沿ってる？レイヤー境界は？局所最適では？"
         - Agent(labee-dev-apm): "パフォーマンス問題ないか？クラッシュしないか？"
         → Both LGTM → proceed
Phase 7: swift build → swift test → All green
Phase 8: Ask user to build in Xcode
         Skill("swift-localization") ← INVOKED
Phase 9: Skill("commit-message") ← INVOKED
         Write the body, then git commit (permission prompt = the gate)
         Record progress to Vigilare
         → "タスク完了はお願いします"
```
