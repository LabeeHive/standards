# Commit Messages

A commit message is not a changelog entry — it is a resumption point. Anyone (including a future agent, possibly you after a stall) must be able to read one commit message and know what changed, how it was verified, and what is still open.

## Shape

```
<type>: <subject>

<what changed and why — one paragraph per logical change>

<verification: what was run, and what it reported>

<known gaps: what is deliberately left undone, and why>

Co-Authored-By: ...
```

Merge commits and one-line fixes (typo, trivial config change) can skip the body — the subject line alone is enough when there is genuinely nothing to record.

## Subject line and who writes what

The subject line follows Conventional Commits, `<type>: <subject>`, and `/commit-message` is the authority on it: imperative mood, one verb + one object, 50 characters or fewer, type chosen by the first matching rule in its decision table. Do not restate those rules here or override them.

`/commit-message` is given the staged diff and the recent log for style, and returns the subject line only. It cannot know why a change was made, what was run, or what was left out — that lives in the session that did the work. The caller writes the body: the change paragraphs, Verification, and Known gaps. If a message is being written without `/commit-message`, apply its subject rules by hand.

## Body

One paragraph per logical change, not per file. Each paragraph should be understandable without opening the diff. Note the *why* whenever a choice is not the obvious one — a paragraph that only restates the diff ("edited X.swift") is not useful; one that says what the edit accomplishes and why it was necessary is.

Prose is the house form: the repository's own history is written that way, and a paragraph can carry a constraint or a rejected alternative that a bullet flattens. Bullets are fine when the changes are genuinely a list.

Example paragraph that carries a decision, not just a mechanical description:

> The standard required snake_case and forbade hyphens outright. Every one of the 30 .md files under skills/ is hyphenated and none is snake_case, and that includes the two files stating the rule. The standard now says kebab-case, so following it produces files that match the 30 already here instead of contradicting them. Renaming the repo to match the old rule was the alternative and would have been churn for nothing.

This states the change *and* the alternative that was rejected, so a reader who was not there still knows why the rule went this way.

## Verification

Name what was run and what it reported, in the words the tool printed, so the next reader knows which claims rest on a run and which rest on reading:

- `swift test: 84 passed, 0 failed. xcodebuild -scheme App build: succeeded` — the commands and what they printed
- `The repo passes its own linter: 0 findings, fences balanced in all 76 files` — what was checked and the verdict
- `Tests: a new case pins the give-up branch` — what was added, by what it pins rather than by how many
- `Not run: no code changed` — when that is the truth, which is a useful thing to say plainly

If a run did not complete, say so. A run that did not finish is void, not a pass.

## Known gaps

This is a decision record, not an apology. State explicitly what was left undone and why leaving it was the right call for this commit's scope.

- `Known gaps: the sensor has no tests; three states were checked by hand`
- `Known gaps: the full asset copy and animation rebuild is a separate multi-hour follow-up, explicitly scoped out here rather than attempted half-done`

The second example is the pattern to imitate generally: name the deferred work, and say *why* it is deferred (scope, time cost, separate concern) rather than leaving a silent gap. A commit with "Known gaps: none" is fine and often correct — write it explicitly rather than omitting the section, so a resuming reader does not have to guess whether the omission means "nothing left" or "forgot to check".

## What NOT to do

- Do not write a subject line that only names the file touched
- Do not bundle "what changed" and "what is still broken" into the same paragraph — known gaps gets its own place so a resuming reader can find it without re-reading the whole body
- Do not put progress/TODO tracking in the commit body for anything beyond this commit's own scope — that belongs in the task tracker, not git history (see references/task-tracker-integration.md)
- Do not claim a verification the session did not perform. `/commit-message` never writes one; if a Verification line exists, the caller wrote it from a run

## Checklist

SKILL.md's Pre-Commit Check gates section *presence*; this checklist gates the phrasing quality only this file defines. Run it on the drafted message:

- [ ] Subject line passes `/commit-message`'s rules (type by first matching rule, one verb + one object, ≤ 50 characters)
- [ ] Every paragraph whose choice is not obvious carries its *why* (the constraint or the rejected alternative), not a diff narration
- [ ] Verification names the runs and their verdicts in the tool's words, and says plainly when a run did not complete or was not run
- [ ] Known gaps names each deferred item *and* the reason deferring was right for this scope; "Known gaps: none" written explicitly when true
- [ ] If the body was skipped (merge/one-liner), confirmed there is genuinely nothing to record — not just a short diff
- [ ] Nothing in the body tracks work beyond this commit's own scope
