---
name: github-pr-status
description: Show GitHub PR dashboard with open PRs, review requests, and assignments for the current user. Use to check pending work. Triggers on "PR一覧", "PR status", "my PRs", "レビュー待ち", "open PRs".
model: haiku
effort: low
context: fork
agent: general-purpose
allowed-tools: Bash(gh:*)
argument-hint: "[repo]"
---

# GitHub PR Status

Show a dashboard of your GitHub PR activity.

## When Invoked

Run all three queries in parallel:

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Gather PR status                                  │
├─────────────────────────────────────────────────────────────┤
│ gh pr list --author @me --state open                        │
│ gh pr list --review-requested @me --state open              │
│ gh pr list --assignee @me --state open                      │
└─────────────────────────────────────────────────────────────┘
```

## Output Format

Present results as:

```
## Your Open PRs (Created by you)
| Repo | # | Title | Status |
|------|---|-------|--------|
| ... | ... | ... | ... |

## Review Requested
| Repo | # | Title | Author |
|------|---|-------|--------|
| ... | ... | ... | ... |

## Assigned to You
| Repo | # | Title | Author |
|------|---|-------|--------|
| ... | ... | ... | ... |

## Summary
- X PRs you created awaiting review/merge
- Y PRs awaiting your review
- Z PRs assigned to you
```

## Options

If user specifies a repo:
```bash
gh pr list --author @me --state open --repo owner/repo
```

If user wants all states (including merged/closed):
```bash
gh pr list --author @me --state all --limit 20
```
