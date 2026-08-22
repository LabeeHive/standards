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

## Subject line

The subject line follows Conventional Commits, `<type>: <subject>`: imperative mood ("add", not "added"), English, lowercase start, no trailing period, 50 characters or fewer.

Give it exactly one verb and one object naming the thing changed, then stop. Enumerations ("X and Y") and purpose or method tails ("for X", "to improve Y", "with Z") belong in the body, and they are also what breaks the character limit. The subject names the change, not the file it landed in.

Read `git diff --cached` and `git log --oneline -15` before drafting. The diff decides the type; the recent log shows the conventions this repository already follows, and those win wherever they do not conflict with the rules here.

### Type

Classify by effect, not by file extension, and take the first rule that matches.

| # | Condition | Type |
|---|-----------|------|
| 1 | Only human-facing explanation changed (README, guides, code comments) | `docs` |
| 2 | Only test files changed | `test` |
| 3 | Only CI config changed | `ci` |
| 4 | Behavior changes: new capability added | `feat` |
| 5 | Behavior changes: defect corrected | `fix` |
| 6 | Behavior-defining content changed, behavior equivalent | `refactor` |
| 7 | None of the above (dependencies, tooling, build config, repo maintenance) | `chore` |

Markdown is not automatically `docs`. Files that define behavior — `SKILL.md`, agent definitions, prompt templates — are source code, so they take rules 4 through 6. `docs` is only for content whose sole job is informing humans. Reach `chore` only after every rule above has been checked and none matched, and classify a mixed changeset by its dominant intent.

## Who writes what

The subject can be drafted from the staged diff and the recent log alone. The body cannot: why a change was made, what was run, and what was left out live in the session that did the work, so the session that wrote the code writes the change paragraphs, Verification, and Known gaps.

## Body

One paragraph per logical change, not per file. Each paragraph should be understandable without opening the diff. Note the *why* whenever a choice is not the obvious one — a paragraph that only restates the diff ("edited X.swift") is not useful; one that says what the edit accomplishes and why it was necessary is.

Prose is the house form: the repository's own history is written that way, and a paragraph can carry a constraint or a rejected alternative that a bullet flattens. Bullets are fine when the changes are genuinely a list.

Example paragraph that carries a decision, not just a mechanical description:

> The standard required snake_case and forbade hyphens outright. Every one of the 30 .md files under skills/ is hyphenated and none is snake_case, and that includes the two files stating the rule. The standard now says kebab-case, so following it produces files that match the 30 already here instead of contradicting them. Renaming the repo to match the old rule was the alternative and would have been churn for nothing.

This states the change *and* the alternative that was rejected, so a reader who was not there still knows why the rule went this way.

## Verification

Name what was run and its verdict, so the next reader knows which claims rest on a run and which rest on reading. The verdict is the part that keeps: it stays true, while a count like "84 passed" is a fact about one moment that the next commit invalidates.

- `swift test: passed. xcodebuild -scheme App build: succeeded` — the commands and their verdicts
- `The repo passes its own linter: no findings, fences balanced in every file` — what was checked and the verdict
- `Tests: a new case pins the give-up branch` — what was added, by what it pins rather than by how many
- `Not run: no code changed` — when that is the truth, which is a useful thing to say plainly

If a run did not complete, say so. A run that did not finish is void, not a pass.

## Known gaps

This is a decision record, not an apology. State explicitly what was left undone and why leaving it was the right call for this commit's scope.

- `Known gaps: the sensor has no tests; three states were checked by hand`
- `Known gaps: the full asset copy and animation rebuild is a separate multi-hour follow-up, explicitly scoped out here rather than attempted half-done`

The second example is the pattern to imitate generally: name the deferred work, and say *why* it is deferred (scope, time cost, separate concern) rather than leaving a silent gap. A commit with "Known gaps: none" is fine and often correct — write it explicitly rather than omitting the section, so a resuming reader does not have to guess whether the omission means "nothing left" or "forgot to check".

## Where messages go wrong

Each line below states what the message should say instead, and what the failure costs when it says something else:

- The subject names the change, not the file it landed in. A subject that only names a file leaves the log unreadable at a glance, which is the one thing the log is for
- "What changed" and "what is still broken" get separate sections. Bundled into one paragraph, the resuming reader has to re-read the whole body to find the part addressed to them
- Progress and TODO tracking beyond this commit's own scope goes to the task tracker (see references/task-tracker-integration.md). Git history is immutable, so a status written into it is wrong from the next commit onward
- A Verification line describes a run the session actually performed. `/commit-message` writes none, so every one that exists was written by the caller from a real run — that is what makes the section worth reading

## Checklist

SKILL.md's Pre-Commit Check gates section *presence*; this checklist gates the phrasing quality only this file defines. Run it on the drafted message:

- [ ] Subject line follows the Subject line section (type by first matching rule, one verb + one object, ≤ 50 characters)
- [ ] Every paragraph whose choice is not obvious carries its *why* (the constraint or the rejected alternative), not a diff narration
- [ ] Verification names the runs and their verdicts in the tool's words, and says plainly when a run did not complete or was not run
- [ ] Known gaps names each deferred item *and* the reason deferring was right for this scope; "Known gaps: none" written explicitly when true
- [ ] If the body was skipped (merge/one-liner), confirmed there is genuinely nothing to record — not just a short diff
- [ ] Nothing in the body tracks work beyond this commit's own scope
