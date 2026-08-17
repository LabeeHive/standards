# ADR Conventions

The decision record directory: what an ADR is for, what makes one valid, and the two rules that get broken most.

## Why the directory exists

The recurring accident this prevents is **a decision that is made, narrowed or retracted in code while the old version survives somewhere else** — a system doc, a code comment, `CLAUDE.md`, a tracker ticket — so a later session implements from a stale spec.

That makes the **Propagation table the body of an ADR**. The prose around it is context for reading it. An ADR whose propagation table is thin has failed at the one job the directory was created for, however good its rationale reads.

## Location

```
docs/01_architecture/adr/
  README.md      what this directory is for, and where its rules live
  TEMPLATE.md    copied to file a new one; takes no number
  ADR-0001-....md
```

A contributor reading `docs/` must be able to find the rules without knowing the skill exists, so the directory's `README.md` **points at this file**. A project that already keeps its records elsewhere keeps them there — the location is not what the rules are about, and moving them breaks every link in.

## Naming and numbering

```
ADR-NNNN-<lowercase-hyphenated-summary>.md
```

- `NNNN` is a zero-padded serial. **Numbers are never reassigned** — links rot otherwise
- A superseded or withdrawn ADR is **not deleted**. Its status is updated and the file stays

## Immutability (append-only)

**An ADR is immutable once filed.** The decision, the rationale, the propagation table and the state-at-decision section are not rewritten afterwards. An ADR is a snapshot of "when, what, why"; rewriting it destroys the thing that made it worth keeping.

- **Changes, withdrawals and additions are appended as a new ADR.** Do not amend an existing one. The unit of work is "file ADR-NNNN", not "add decision N to an old ADR"
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

An ADR that resolves a point a previous one explicitly listed under **Open questions** leaves that previous ADR **Accepted and untouched** — its status line is not flipped, and its propagation rows are not edited. The earlier decision was never contradicted; a gap it declared was filled. Reach for `Superseded` only when a later decision actually replaces an earlier one.

## No implementation status

**Do not record progress in an ADR.** Whether something is built, in progress, or assigned lives in the task tracker. Never flip a status to "implemented", never rewrite a propagation row from "to do" to "done" — that is both an immutability violation and a second place to keep the same fact in sync.

The **State at the time of the decision** section is a record of what the code looked like *on the decision date*, written in type and API names so it can be grepped. It is not updated afterwards, and it is read as "this is how it was that day". To know how it is now, read the code.

## An ADR is a record, not a spec

It captures what was decided at one point in time; the current spec is the code. Never treat ADR text as the authority for how the system behaves now.

This is what makes dated numbers acceptable **inside an ADR** and unacceptable in the numbered namespaces that describe the present:

| Location | Numbers |
|---|---|
| An ADR | Fine, if the date is attached: "at the time of the decision (2026-08-01), the debounce was 300 ms". What is not fine is an undated assertion |
| `01_architecture/` and the other current-shape namespaces | No numbers. Point at the code by type and API name — the code is the single source, and a number copied here is a second one |

## Required sections

File a new one by copying `TEMPLATE.md`.

| Section | Contents |
|---|---|
| Header | Decided (date + whose decision) / Status / Related commits / Supersedes (only when it does) |
| Decision | What was decided. One or two paragraphs. Split with `### Decision 1: ...` when there is more than one |
| Context and rationale | Why, grounded in dated facts. Includes **Alternatives rejected** — the section that ages best and stops a later implementer re-proposing the same thing |
| **Propagation** | **Required.** Every place the decision reaches, as a table. See below |
| State at the time of the decision | What the code looked like **on the decision date**, in type/API names. Not updated later |
| Open questions | Points this decision leaves undecided. Write "none" rather than deleting the section — "we looked and there were none" is itself a record |

### Template

````markdown
# ADR-NNNN: <decision title>

**Decided:** YYYY-MM-DD (user decision | proposed, user-confirmed | implementer decision, recorded)
**Status:** Accepted
**Related commits:** <hash>, <hash>
**Supersedes:** ADR-NNNN (only when it does)

## Decision

<what was decided>

## Context and rationale

<why, grounded in dated facts>

### Alternatives rejected

- <alternative> — <why it was not taken>

## Propagation

| Kind | Location | Content |
|---|---|---|
| Code | `path/to/File.swift` | <what changes, in type and member names> |
| Tests | `path/to/FileTests.swift` | <which behaviour is pinned> |
| Docs | `01_architecture/xxx.md` | <which section> |
| Tracker | <list/board name + item id> | <every hit from the search, `(**unchanged**)` where nothing changes> |

## State at the time of the decision

<what the code looked like on the decision date, in type/API names>

## Open questions

none
````

### Writing the Propagation table

**Full-text search the tracker before writing it.** Do not write the table from memory or from whatever came up in the conversation — recall is biased toward the one or two items discussed just before filing.

The failure this rule exists for is concrete: a decision's ADR named one backlog item and was corrected there, while a second item touching the same decision went unnamed and kept describing the removed feature. Being named was the only difference between them.

Search on **every name the subject goes by** — feature name, type name, the string shown in the UI, the settings key, the localization key. List every hit in the table, **including the ones that need no change**: marking a location `(**unchanged**)` records that the question was asked and answered.

No "done / to do" marks — this is not a progress column.

## Consent, not authorship

**It does not matter who thought of the decision.** A design judgement made by an agent or by the implementer belongs in an ADR **once the user has agreed to it** — that is the normal path: propose, ask, record. Record comes *after* agreement.

Two things are forbidden, and they are not the same size:

1. Filing an ADR for a decision the user has not agreed to
2. **Recording it as the user's decision when they were never asked** — worse, because it corrupts the ledger's ability to say who is accountable for anything in it

Having *shown* the user a decision is not agreement. A question asked and left unanswered leaves the decision unagreed; it does not promote it.

The header states whose decision it was, in one of exactly these forms:

```
**Decided:** 2026-08-01 (user decision)                  <- the user decided it
**Decided:** 2026-08-01 (proposed, user-confirmed)       <- implementer proposed, user agreed
**Decided:** 2026-08-01 (implementer decision, recorded) <- decided in the course of the work
```

Do not invent a fourth form. When one document would carry decisions of different provenance, either split it into one ADR per provenance, or use `### Decision N:` sections and state the provenance on each — but the header must still be one of the three.

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
- [ ] Propagation table exists, and was written **after** a full-text tracker search on every name the subject goes by — unchanged locations included and marked `(**unchanged**)`
- [ ] No implementation-status content anywhere: not in Status, not as done/to-do marks in Propagation
- [ ] `State at the time of the decision` is written in greppable type/API names and carries its date
- [ ] Numbers in the body carry the date they were true; no undated assertions
- [ ] `Open questions` is present — "none" if there are none, not deleted
- [ ] `Alternatives rejected` names what was considered and why it was not taken
- [ ] No existing ADR body was edited; if one was superseded or withdrawn, only its Status line and one link line beneath it changed
- [ ] An ADR that merely answers an earlier one's Open question left that earlier ADR `Accepted` and untouched
