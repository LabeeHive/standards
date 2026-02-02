---
name: swift-workflow
description: Swift development workflow from Vigilare task to implementation. Orchestrates research, coding, localization, and wrap-up. Triggers on "タスクやって", "実装して", "開発開始", "このタスクを", "ワークフロー開始".
model: opus
context: fork
agent: general-purpose
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Skill, Task, EnterPlanMode, AskUserQuestion
---

# Swift Workflow

Orchestrate Swift development from Vigilare task to completion.

## Core Principle

**Task-driven development** - Every implementation starts from a task, ends with recorded progress.

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

```
vigilare_get_lists → vigilare_get_reminders(filter: 'today') → vigilare_get_reminder(id)
```

### Phase 2: Deep Understanding

- Read task notes and comments thoroughly
- If references to Issues/PRs exist, investigate them
- Clarify ambiguous requirements with user via AskUserQuestion

### Phase 3: Research & Analysis

**When needed:**
- Technical decisions required
- Unfamiliar APIs or patterns
- Impact assessment needed

**Actions:**
1. Invoke `/research` for technical investigation
2. Analyze existing codebase (related files, patterns)
3. **Record notable findings** with `vigilare_add_comment`

### Phase 4: Planning

1. Present implementation plan to user
2. Include: files to modify, approach, potential risks
3. For complex tasks, use `EnterPlanMode`
4. **Wait for user approval before proceeding**

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

1. [Task identified from context]
2. [Read task details, clarify if needed]
3. [Research if technical questions exist, record findings]
4. [Present plan, wait for approval]
5. [Implement with /swift-development]
6. [Ask user to build → /swift-localization]
7. [Generate commit message, record progress]
   → "コミットとタスク完了はお願いします"
```
