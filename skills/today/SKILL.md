---
name: today
description: Show today's calendar events and tasks at a glance. Use for daily overview. Triggers on "今日", "today", "daily summary", "今日の予定", "今日のタスク".
model: sonnet
allowed-tools: mcp__chimr__chimr_get_today_events mcp__vigilare__vigilare_get_reminders
---

# Today Skill

Display today's calendar events and tasks in a combined summary.

## When Invoked

### Step 1: Fetch Data (Parallel)

Call both in parallel:
- `chimr_get_today_events` → Calendar events
- `vigilare_get_reminders` with `filter: "today"` → Today's tasks + overdue

### Step 2: Format Output

```markdown
## 📅 Today's Schedule

| Time | Event | Location |
|------|-------|----------|
| 10:00-11:00 | Weekly Standup | Zoom |
| 14:00-15:00 | 1on1 with Alice | Google Meet |

## ✅ Today's Tasks

**Overdue:**
- [ ] [P1] Fix critical bug (Due: 2/4)

**Due Today:**
- [ ] [P5] Review PR #123
- [ ] Submit expense report

**No due date (top 5):**
- [ ] Explore new library
```

### Output Rules

- Show time in 24h format (HH:MM)
- Include video meeting links if available
- Group tasks: Overdue → Due Today → No due date
- Show priority as `[P1]`, `[P5]`, `[P9]` (skip P0)
- Limit no-due-date tasks to 5 items
- If no events: "No meetings scheduled"
- If no tasks: "No tasks for today"
