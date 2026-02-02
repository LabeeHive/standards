---
name: swift-workflow
description: Swift development workflow from Vigilare task to implementation. Orchestrates research, coding, localization, and wrap-up. Triggers on "タスクやって", "実装して", "開発開始", "このタスクを", "ワークフロー開始".
model: opus
context: fork
agent: general-purpose
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Skill, Task, EnterPlanMode, AskUserQuestion, WebFetch, WebSearch
---

# Swift Workflow

Orchestrate Swift development from Vigilare task to completion.

## Core Principles

1. **Task-driven** - Every implementation starts from a task, ends with recorded progress
2. **Parallel execution** - Run independent operations concurrently
3. **Evidence-based** - Check project config and official docs before implementing

## Constraints

| Item | Rule |
|------|------|
| vigilare_get_reminders | `filter: 'all'` is **FORBIDDEN**. Use `today` or `list_id` |
| Commit | Generate message only. User commits (GPG required) |
| Task completion | Do NOT call `vigilare_complete_reminder`. User decides |
| Xcode build | Required before localization. Ask user to build |

## Workflow

### Phase 1: Task Identification

**Priority order:**
1. **Check conversation context** - Task already mentioned? Use it
2. **Query Vigilare** - `vigilare_get_reminders(filter: 'today')` or by list
3. **No task exists** - Ask user: "タスクを起票しますか？" → invoke `/vigilare-task`

### Phase 2: Project Context (PARALLEL)

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

**ALWAYS gather official documentation based on Phase 2 findings.**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Research from multiple sources                    │
├─────────────────────────────────────────────────────────────┤
│ 1. WebSearch: Apple docs for relevant APIs + deployment ver │
│    Example: "SwiftUI NavigationStack iOS 17 site:apple.com" │
│ 2. WebFetch: Specific Apple documentation pages             │
│ 3. Invoke /research for technical investigation             │
│ 4. Analyze existing codebase (related files, patterns)      │
└─────────────────────────────────────────────────────────────┘
```

**Key searches:**
- API availability for deployment target
- Breaking changes between OS versions
- Best practices for target platform

**Record notable findings** with `vigilare_add_comment`.

### Phase 4: Planning

1. Present implementation plan to user
2. Include: files to modify, approach, potential risks
3. **Include deployment target considerations**
4. For complex tasks, use `EnterPlanMode`
5. **Wait for user approval before proceeding**

### Phase 5: Implementation + Testing

Invoke `/swift-development` which includes:
- MVVM architecture
- Naming conventions
- Swift Testing (AAA pattern)
- Code review aspects

### Phase 6: Localization

**If UI strings were added/changed:**

1. **Ask user to build in Xcode** - Required to update xcstrings
2. Wait for confirmation
3. Invoke `/swift-localization` to add translations

### Phase 7: Wrap-up

1. **Generate commit message** - Invoke `/commit-message`
2. **Record work** - `vigilare_add_comment` with summary of changes
3. **Inform user** - "コミットとタスク完了はお願いします"

## Parallelization Rules

**CRITICAL: Always parallelize independent operations.**

| Phase | Parallel Operations |
|-------|---------------------|
| 2 | Project file reads (Package.swift, pbxproj, xcconfig) |
| 3 | WebSearch + WebFetch + /research + codebase analysis |
| 5 | Multiple file reads before editing |

**How to parallelize:**
- Use multiple tool calls in a single message
- Use Task tool with multiple subagents for heavy operations

## Skill Invocations

| Phase | Skill | Purpose |
|-------|-------|---------|
| 1 | /vigilare-task | Create task if none exists |
| 3 | /research | Technical investigation |
| 5 | /swift-development | Coding with standards |
| 6 | /swift-localization | Translation management |
| 7 | /commit-message | Generate commit message |

## Example Session

```
User: "このタスクやって" (with Vigilare task in context)

Phase 1: Task identified from context
Phase 2: [PARALLEL] Read Package.swift, project.pbxproj, task notes
         → Found: iOS 17+, macOS 14+, Swift 5.9
Phase 3: [PARALLEL]
         - WebSearch "SwiftUI Observable iOS 17 site:apple.com"
         - WebFetch Apple docs
         - /research for patterns
         - Read existing code
         → Record findings to Vigilare comment
Phase 4: Present plan with deployment target considerations
Phase 5: Implement with /swift-development
Phase 6: Ask user to build → /swift-localization
Phase 7: Generate commit message, record progress
         → "コミットとタスク完了はお願いします"
```
