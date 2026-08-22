# Task Tracker Integration

## Naming the tracker in CLAUDE.md

The project's `CLAUDE.md` states the tracker and the exact list/board it uses, so any agent picking up the project knows where to look without asking. Example phrasing:

> Task/progress tracking lives in Vigilare (list: `Labee - <Project>`) — implementation-status tables belong there, and docs stay free of them

This single line does two jobs: it points to the tracker, and it restates where progress goes at the point where an agent is most likely to reach for the wrong place (right before writing a status update somewhere).

## What goes in the tracker vs. what goes in a commit

| Content | Location |
|---------|----------|
| What changed in this commit, verified how, what is deferred from *this* commit's scope | Commit message (Known gaps) |
| Cross-commit progress: where a multi-commit feature stands, what is next across sessions | Task tracker |
| Percentage complete, feature status board | Task tracker |

**The link between a tracker item and an ADR points one way: the item names the ADR.** An ADR is permanent and an item id is not — ids get closed, re-filed and migrated between tools, and an ADR that names one is left asserting something untrue in a file nobody may correct (see references/adr-conventions.md). An item that implements or is changed by a decision cites `ADR-NNNN` in its notes; the ADR cites nothing back.

A commit's Known gaps is scoped to that commit. The tracker is scoped to the feature/milestone across however many commits it takes.

## Milestone comments

When a significant chunk of work lands (a milestone, not every commit), add a comment to the relevant tracker item with:

1. What was done (brief, human-readable — not a diff dump)
2. The commit hash it corresponds to
3. The next resumption point — what to pick up next, and any decision that still needs making

This mirrors the commit-message Known-gaps pattern one level up: the comment is itself a resumption point, just at milestone granularity instead of commit granularity. A future session (or a different agent) should be able to read the latest tracker comment and know where to restart without re-reading the whole task history.

A recurring task (a weekly scan, an audit that repeats) gets its run summaries appended as comments on the same item, so the trend is readable in one place and a finding can be seen to persist across runs.

## Practical mechanics

Use the tracker the project names in its `CLAUDE.md`, through that tracker's own interface, and that one alone. Every other tracker, side tool, and ad-hoc list kept "just for this session" is one more place to look, which is how progress state goes stale and starts contradicting itself. When `CLAUDE.md` names no tracker, ask which one to use — the answer is the user's to give, and a session that guesses leaves the next one guessing differently.

For Vigilare, `/vigilare-task` is the interface: it knows the title shape, the notes structure, the list selection, and the comment prefixes. Whatever the tracker is, the mechanics are the same: search it for the existing item before writing, then comment on that item. A new item is for work that outlives this commit; a commit-scoped detail is already covered by the commit's own Known gaps section.

## Checklist

Run against every tracker setup or milestone comment before presenting:

- [ ] `CLAUDE.md` names the tracker *and* the exact list/board, in a line that also restates "no progress in docs"
- [ ] Only that named tracker was used — no other tool, no side list, and no tracker picked without being told which one
- [ ] Content is routed by the table: commit-scoped deferrals → the commit's Known gaps; cross-commit progress and status → the tracker
- [ ] Each milestone comment carries all three parts: what was done, the commit hash, and the next resumption point (including any open decision)
- [ ] The comment was attached to the existing task found by search — no new task created for a commit-scoped detail
- [ ] An item that carries a decision names its `ADR-NNNN`, and no ADR names an item id
- [ ] Nothing that belongs in the tracker was written into docs/ or a commit body instead
