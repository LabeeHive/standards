# docs/ Structure

This file owns the `docs/` layout: which namespaces exist, what each one holds, the placement rules that decide what lives where, and which content belongs in the tracker instead. How to write the document itself — picking its type and template, structuring its sections, wording, markdown conventions — lives in `/documentation`.

## Numbered namespaces

```
docs/
  00_overview/       project overview, terminology, product identity
  01_architecture/   system architecture — the current shape
  02_business/       business documentation
  03_development/    process docs — development guides, testing strategy
  04_designs/        UI/UX designs and mockups
  06_decisions/      ADRs — the decision records
  07_research/       what was investigated, and what was found
  99_ideas/          unimplemented, speculative design — quarantined
```

`05_` is left empty on purpose: it is the insertion slot, so a namespace can be added later without renumbering `06_` and `07_`.

### Numbering convention

Two-digit prefix, underscore separator. `00`–`09` is the core range, `99` holds the ideas quarantine, and everything between is left free so a namespace can be inserted later without renumbering everything that follows.

| Range | Purpose |
|-------|---------|
| 00-09 | Core documentation — overview, architecture, development |
| 10-89 | Reserved for expansion |
| 90-98 | Reserved |
| 99 | Ideas quarantine |

An existing project keeps the numbers it already has. Renumbering breaks every link into the namespace, and the slot number is not what the rules are about.

### What each namespace holds

| Namespace | Required | Contents |
|-----------|----------|----------|
| `00_overview/` | Yes | `README.md` (project overview and navigation), `terminology.md`, `product-identity.md` |
| `01_architecture/` | Yes | `architecture.md` and the component docs — the current shape only |
| `02_business/` | No | Monetization, competitive analysis, business requirements |
| `03_development/` | Yes | `testing/` guidelines, development guides, build and deployment docs |
| `04_designs/` | No | `ui-mockup.md`, `mockups/`, design system documentation |
| `06_decisions/` | Yes | `README.md`, `TEMPLATE.md`, and `ADR-NNNN-*.md` — see `references/adr-conventions.md` |
| `07_research/` | No | `research/` (this project's own investigations) and `references/` (what others do) |
| `99_ideas/` | No | Feature ideas and proposals, technology exploration — nothing settled |

`06_decisions/` is where a decision's *history* lives; the numbered namespaces above it describe only the **current shape** and link there for the "why". A project that filed its decisions under a different slot before this convention existed keeps them there — renumbering breaks every link into the namespace, and the slot number is not what the rules are about. The rules themselves are in `references/adr-conventions.md`, and that namespace's `README.md` points at them rather than restating them.

Placement heuristic: ask "does this doc describe something that exists, something that was found, or something someone is still deciding?" Exists → a numbered namespace below `06_`; found → `07_research/`; still being decided → `99_ideas/`.

## 07_research/ holds findings, not proposals

A finding is a result, which is why it does not go in `99_ideas/` — nothing in `07_research/` is waiting to be decided, and nothing in it decides anything either. `research/` holds this project's own investigations; `references/` holds what other products do and what outside material offers. Both exist so a choice can be argued against something rather than against nothing.

```
docs/07_research/
  README.md
  research/     00-what-was-measured.md, 01-....md
  references/   00-competitor-onboarding.md, 01-....md
```

**Number both directories from the first file.** The prefix is chronological, it never restarts, and a number is never reused — a file here is cited by number from ADRs and from the tracker, and renaming it later breaks those citations. Retrofitting numbers onto a directory that grew without them is the churn this rule exists to avoid, so the first file is `00-`.

**A file here is not maintained.** It records what was open on the day it was written and is read that way, exactly like an ADR. When a question it carried is settled and built, the answer **graduates** — the decision to `06_decisions/` as an ADR, the shape of the built thing to `01_architecture/`. The file that carried the question stays, as the record of how it was answered.

An ADR cites a research file rather than absorbing it: the ADR is the output, the research file is the workings.

## 99_ideas/ as a quarantine bucket

`99_ideas/` holds anything not yet decided or not yet built: alternate designs under consideration, features sketched but not committed to, redesign proposals for an already-shipped system. Keeping this separate from the numbered namespaces protects the property that "everything outside `99_ideas/` describes the current, real state of the project" — a reader (or agent) never has to guess whether a doc in `01_architecture/` is aspirational or accurate.

When an idea from `99_ideas/` gets built, its content graduates into the matching numbered namespace, and the speculative doc is retired or trimmed to just the decision record — not left duplicated.

## Progress content belongs in the tracker

Three kinds of content go to the task tracker (see references/task-tracker-integration.md) rather than into `docs/`:

- Implementation-status tables ("Feature X: 80% done")
- Percentage-complete counters
- TODO / done checklists tracking work-in-progress

The reason is not aesthetic: a status table goes stale the moment work continues, and a stale doc is worse than no doc because it actively misleads. `docs/` holds what stays true regardless of how much is implemented — architecture, concept, standards — which is what lets a reader trust it without a "last updated" caveat.

A plan or roadmap is the same case: the sequence and its state live in the tracker (see references/backlog-granularity.md) and the decisions behind it live in an ADR under `06_decisions/`, so it gets no namespace of its own.

When reviewing an existing docs/ tree, flag any status/progress content found and recommend moving it to the tracker rather than deleting the surrounding doc — the doc's non-progress content is usually still valid reference material.

## Pointing agents at the layout

A project's `CLAUDE.md` or `AGENTS.md` states the structure and the reading order, so an agent picking up the project does not have to discover it:

````markdown
## Documentation structure

```
docs/
├── 00_overview/        # Project overview
├── 01_architecture/    # System architecture
├── 03_development/     # Development guides
├── 04_designs/         # UI/UX designs
├── 06_decisions/       # ADRs — why it is the way it is
└── 07_research/        # What was investigated, and what was found
```

## Before starting work

1. `docs/00_overview/README.md`
2. `docs/01_architecture/architecture.md`
````

List only the namespaces the project actually has. The same file names the task tracker (see references/task-tracker-integration.md) — one line covering both keeps the "where does this go?" question answerable without asking.

## Checklist

Run against every docs/ placement or review before presenting:

- [ ] Each new/moved doc placed by the heuristic: describes something that *exists* → a numbered namespace below `06_`; records what was *found* → `07_research/`; still being decided → `99_ideas/`
- [ ] Every file under `07_research/research/` and `07_research/references/` carries its chronological number prefix, starting at `00-`, with no number reused and none renamed after it has been cited
- [ ] No status tables, percentage-complete counters, or TODO/done checklists anywhere in docs/ — any found are flagged for the tracker, with the surrounding doc preserved
- [ ] Any plan or roadmap content found in docs/ is routed to the tracker (sequence and state) or to an ADR (the decisions behind it)
- [ ] Speculative or unimplemented design found outside `99_ideas/` is flagged for quarantine
- [ ] Ideas that have since been built are graduated into the matching numbered namespace, with the `99_ideas/` doc retired or trimmed to the decision record (no duplication)
- [ ] A doc describing *why* a decision was made links to its ADR rather than restating the history; the numbered namespace carries only the current shape
- [ ] Numbering follows the convention, and no existing namespace was renumbered to match this list
- [ ] The document itself was written against `/documentation` — this file governs only where it lives
