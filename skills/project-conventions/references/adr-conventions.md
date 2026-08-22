# ADR Conventions

The decision record namespace: what an ADR is for, what makes one valid, and the two rules that get broken most.

## Why the namespace exists

The recurring accident this prevents is **a decision that is re-litigated because nobody recorded why the other option was not taken** — the alternative gets re-proposed, argued again, and sometimes implemented, with no way to tell that it was already considered and rejected.

An ADR answers four questions, and nothing else belongs in one:

1. What was decided
2. Which alternatives were considered, and why they were not taken
3. What the chosen option costs
4. What this decision leaves unresolved

An ADR is the **output**. The investigation behind it — measurements, competitor surveys, engine behaviour — is the **workings**, and lives in `07_research/` where the ADR cites it by file. An ADR that absorbs its own research is unreadable as a decision and unmaintainable as a report.

## Namespace slot

```
docs/06_decisions/
  README.md      what this namespace is for, and where its rules live
  TEMPLATE.md    copied to file a new one; takes no number
  ADR-0001-....md
```

`06_` leaves `05_` free as the insertion slot. **A project that filed its decisions under a different slot before this convention existed keeps them there** — the slot number is not what the rules are about, and moving them breaks every link in.

A contributor reading `docs/` must be able to find the rules without knowing the skill exists, so the namespace's `README.md` **points at this file**.

## Naming and numbering

```
ADR-NNNN-<lowercase-hyphenated-summary>.md
```

- `NNNN` is a zero-padded serial. **Numbers are never reassigned** — links rot otherwise
- A superseded or withdrawn ADR is **not deleted**. Its status is updated and the file stays

## Immutability (append-only)

**An ADR is immutable once filed.** The decision, the rationale, the consequences and the open questions are not rewritten afterwards. An ADR is a snapshot of "when, what, why"; rewriting it destroys the thing that made it worth keeping. A decision log whose losing arguments have been quietly overwritten is worse than no log at all, because it still looks authoritative.

- **Changes, withdrawals and additions are appended as a new ADR.** The unit of work is "file ADR-NNNN", so a change to an existing decision is a new file with its own number
- **Exactly two things may be updated on an old ADR**: (a) the **Status** line, and (b) a **single link line directly under it** pointing at the replacement. Nothing else, not one character
- The new ADR states which decision of the old one it replaces or withdraws, and why. **The history goes in the newer document**
- Fixing a typo or a broken link is outside this rule; a fix that changes the meaning is not a fix, it is a new ADR

A project that violated this before the rule existed **does not retroactively fix it** — rewriting an already-rewritten body is itself a rewrite. Treat the file as immutable from that point, and record the deviation in the next ADR that touches the same decision.

### Status vocabulary

| Status | Meaning |
|---|---|
| Accepted | A live decision, not replaced by a later ADR |
| Superseded (by ADR-NNNN) | Replaced by a later ADR. Name the replacement in the Status line |
| Withdrawn (by ADR-NNNN) | The decision itself was taken back. Name the ADR that withdrew it |

"Accepted" does **not** mean "matches the implementation" — implementation status is out of scope here.

### Answering an ADR's own open question is not superseding it

An ADR that resolves a point a previous one explicitly listed under **Open questions** leaves that previous ADR **Accepted and untouched** — its status line is not flipped and its body is not edited. The earlier decision was never contradicted; a gap it declared was filled. Reach for `Superseded` only when a later decision actually replaces an earlier one.

## No implementation status, and no tracker item ids

**Progress lives in the task tracker.** Whether something is built, in progress, or assigned changes as the work moves, so it belongs where it can be updated. An ADR's Status stays in its own vocabulary (`Accepted` / `Superseded` / `Withdrawn`); a status flipped to "implemented" both breaks immutability and creates a second place to keep the same fact in sync.

**Tracker item ids live in the tracker too.** An ADR is permanent and an item id is not: ids get closed, re-filed, migrated between tools and renumbered, and each of those leaves the ADR asserting something untrue in a file nobody may correct. The link runs one way — the tracker item names the ADR, which stays put.

## An ADR is a record, not a spec

It captures what was decided at one point in time. For how the system behaves now, the code is the authority — an ADR tells you why it got that way, and the two answer different questions.

This is what makes dated numbers acceptable **inside an ADR** and unacceptable in the numbered namespaces that describe the present:

| Location | Numbers |
|---|---|
| An ADR | Fine, if the date is attached: "at the time of the decision (2026-08-01), the debounce was 300 ms". What is not fine is an undated assertion |
| `01_architecture/` and the other current-shape namespaces | No numbers. Point at the code by type and API name — the code is the single source, and a number copied here is a second one |

## Required sections

File a new one by copying `TEMPLATE.md`.

| Section | Contents |
|---|---|
| Header | Decided (date + whose decision) / Status / Supersedes (only when it does) |
| Decision | What was decided. One or two paragraphs. Split with `### Decision 1: ...` when there is more than one |
| Context and rationale | Why, grounded in dated facts. Includes **Alternatives rejected** — the section that ages best and stops a later implementer re-proposing the same thing |
| Consequences | What the chosen option costs. Bullets, both directions |
| Open questions | Points this decision leaves undecided. Write "none" rather than deleting the section — "we looked and there were none" is itself a record |
| References | The research files and commits this rests on. Links only |

**Consequences is separate from Alternatives rejected on purpose.** Alternatives rejected argues against the options not taken; Consequences states what the taken one costs. Folded into the rationale, the cost gets written as something the rationale overcomes and then quietly disappears — hiding the trade-off is the failure the section exists to prevent. An empty heading is conspicuous in a way a missing sentence is not, which is the same reason `Open questions` says "none" rather than being deleted.

Keep it minimal: bullets naming the cost, not a pros-and-cons table per option. The per-option analysis, if it was done, is a research file.

### Template

````markdown
# ADR-NNNN: <decision title>

**Decided:** YYYY-MM-DD (user decision | proposed, user-confirmed | implementer decision, recorded)
**Status:** Accepted
**Supersedes:** ADR-NNNN (only when it does)

## Decision

<what was decided>

## Context and rationale

<why, grounded in dated facts>

### Alternatives rejected

- <alternative> — <why it was not taken>

## Consequences

- <what the chosen option costs, and what it gives up>

## Open questions

none

## References

- [`../07_research/research/NN-....md`](../07_research/research/NN-....md) — <what it established>
- <commit hash> — <the change this decision was filed with>
````

### Reaching the places the decision touches

The decision has to land in the code, the tests and the current-shape docs, and a decision that lands in one and not the others is the accident this namespace exists next to. **That work is done, and tracked, in the tracker — not listed inside the ADR.** A checklist written into an immutable file cannot be corrected when a location is missed or moved, and it decays into a stale map of a tree that has changed underneath it.

Before filing, search the code, the docs and the tracker on **every name the subject goes by** — feature name, type name, the string shown in the UI, the settings key, the localization key. Recall is biased toward the one or two things discussed just before filing. What the search turns up becomes tracker items that cite the ADR; the ADR itself stays a record of the decision.

## Consent, not authorship

**It does not matter who thought of the decision.** A design judgement made by an agent or by the implementer belongs in an ADR **once the user has agreed to it** — that is the normal path: propose, ask, record. Record comes *after* agreement.

Two failures cost more than the rest, and they are not the same size:

1. An ADR filed for a decision the user has yet to agree to — the record then claims a settlement that has not happened
2. **A decision recorded as the user's when they were never asked** — worse, because it corrupts the ledger's ability to say who is accountable for anything in it

Having *shown* the user a decision is not agreement. A question asked and left unanswered leaves the decision unagreed; it does not promote it.

The header states whose decision it was, in one of exactly these forms:

```
**Decided:** 2026-08-01 (user decision)                  <- the user decided it
**Decided:** 2026-08-01 (proposed, user-confirmed)       <- implementer proposed, user agreed
**Decided:** 2026-08-01 (implementer decision, recorded) <- decided in the course of the work
```

Those three are the whole vocabulary. When one document would carry decisions of different provenance, either split it into one ADR per provenance, or use `### Decision N:` sections and state the provenance on each — the header still reads as one of the three.

`(implementer decision, recorded)` is the slot for calls taken while building something, where stopping to ask would have blocked the work. It is an honest label, not a way to skip consent on a decision the user is actively being asked about.

## When to file one

- A design decision is **made, narrowed, reversed or withdrawn**
- An earlier ADR's **Open question** is answered
- A choice was made **against** a plan recorded elsewhere (a ticket note, a doc, a memo) — the ADR is where the divergence is explained, so the stale plan does not get re-implemented

Not every commit needs one. The test is whether a later reader could re-derive the choice from the code alone; if the code shows *what* but not *why it is not the other thing*, file one. A correction that moves no decision — a line number, a typo in a path — is not an ADR; it dilutes the records that are.

## Checklist

Run against every ADR before presenting:

- [ ] Header uses exactly one of the three `Decided:` forms, and it matches what actually happened — nothing the user has not agreed to is recorded as their decision
- [ ] Every decision in the body has the user's agreement, or is honestly marked as taken in the course of the work
- [ ] A full-text search on every name the subject goes by was run before filing, and what it turned up is in the tracker — not listed inside the ADR
- [ ] No implementation-status content anywhere, and no tracker item id
- [ ] Numbers in the body carry the date they were true; no undated assertions
- [ ] `Open questions` is present — "none" if there are none, not deleted
- [ ] `Alternatives rejected` names what was considered and why it was not taken
- [ ] `Consequences` names what the chosen option costs, not only what it gains
- [ ] The investigation behind the decision is a file under `07_research/`, cited from `References` rather than pasted into the ADR
- [ ] No existing ADR body was edited; if one was superseded or withdrawn, only its Status line and one link line beneath it changed
- [ ] An ADR that merely answers an earlier one's Open question left that earlier ADR `Accepted` and untouched
