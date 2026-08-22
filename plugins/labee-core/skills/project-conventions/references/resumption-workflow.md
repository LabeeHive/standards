# Resumption Workflow

## The problem this solves

Sessions get interrupted: API disconnects, agent stalls, context resets, or simply a new session picking up where a previous one left off. Without a deliberate entry point, resuming means re-scanning the codebase and re-deriving state from scratch — expensive, and error-prone (easy to redo already-finished work, or miss an intentionally-deferred item and "fix" something that was correctly left alone).

## The entry point: the last completed commit

Before doing anything else, find the last completed commit and read its **Known gaps**:

```
git log -1
git show <hash>   # read the full message, especially Known gaps
```

The Known gaps section is the intended resumption point — it was written for exactly this purpose. Treat it as the starting instruction, not as background context to skim. If it names a deferred item with a reason ("X is a separate multi-hour follow-up, explicitly scoped out"), that is a decision already made — carry it forward, or make a new decision to un-defer it that is just as explicit as the one it replaces. Redoing the analysis silently produces a third answer nobody recorded.

## Cross-check against the tracker

If a milestone comment exists in the task tracker (see references/task-tracker-integration.md) more recent than the last commit's context, read that too — it may describe cross-commit state the single commit's Known gaps does not capture (e.g., "commit N is done, but the human reviewer flagged Y, still pending").

## Why this is cheap

This works because commit messages and tracker comments are written *as* resumption points from the start (see references/commit-messages.md) — the cost of this workflow is proportional to how disciplined those artifacts were kept, not to the size of the codebase. A project that consistently writes Known gaps turns "where was I?" into a two-command lookup instead of a re-investigation.

## Where resumptions go wrong

Each line states the move that works, and what it replaces:

- The last commit's Known gaps is read first, and it usually answers the question on its own. A full re-scan or re-audit ahead of that spends the session's opening minutes re-deriving something already written down
- A commit whose Known gaps section is missing is treated as an unknown, and the next message it writes says "Known gaps: none" explicitly. Reading silence as "nothing left" turns a forgotten section into a finished one
- A deferred item's reasoning stands until something material changes. Re-opening it on a hunch spends the deferral decision twice and often lands on the same answer

## Checklist

Run before starting any post-interruption work:

- [ ] `git log -1` / `git show` run and the last completed commit's Known gaps read *before* any codebase scanning or auditing
- [ ] The tracker's latest milestone comment cross-checked when it may be newer than the commit's context
- [ ] Each deferred item either continued as deferred, or un-deferred with a new explicit reason — no silently redoing the defer/un-defer analysis
- [ ] No work restarted that the Known gaps or tracker comment marks as already done or deliberately scoped out
- [ ] A missing Known gaps section treated as unknown state to verify, not as "nothing left"
