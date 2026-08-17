# docs/ Structure

This file owns the `docs/` layout: which namespaces exist, what each one holds, the placement rules that decide what may live where, and what must never be written into `docs/` at all. How to write the document itself — picking its type and template, structuring its sections, wording, markdown conventions — lives in `/documentation`.

## Numbered namespaces

```
docs/
  00_overview/       project overview, terminology, product identity
  01_architecture/   system architecture; adr/ holds the decision records
  02_business/       business documentation
  03_development/    process docs — development guides, testing strategy
  04_designs/        UI/UX designs and mockups
  05_standards/      project-local standards deltas
  98_plans/          implementation and migration plans
  99_ideas/          unimplemented, speculative design — quarantined
```

### Numbering convention

Two-digit prefix, underscore separator. `00`–`09` is the core range, `98`–`99` is auxiliary content, and everything between is left free so a namespace can be inserted later without renumbering everything that follows.

| Range | Purpose |
|-------|---------|
| 00-09 | Core documentation — overview, architecture, development |
| 10-89 | Reserved for expansion |
| 90-97 | Reserved |
| 98-99 | Auxiliary content — plans, ideas |

Do not renumber an existing project to match this list. Renumbering breaks every link into the namespace, and the slot number is not what the rules are about.

### What each namespace holds

| Namespace | Required | Contents |
|-----------|----------|----------|
| `00_overview/` | Yes | `README.md` (project overview and navigation), `terminology.md`, `product-identity.md` |
| `01_architecture/` | Yes | `architecture.md`, component docs, and `adr/` — the decision records |
| `02_business/` | No | Monetization, competitive analysis, business requirements |
| `03_development/` | Yes | `testing/` guidelines, development guides, build and deployment docs |
| `04_designs/` | No | `ui-mockup.md`, `mockups/`, design system documentation |
| `05_standards/` | No | Project-local standards deltas — where this project departs from the shared standards |
| `98_plans/` | No | Implementation plans, migration plans |
| `99_ideas/` | No | Feature ideas and proposals, research notes, technology exploration |

`01_architecture/adr/` is where a decision's *history* lives; the numbered namespaces describe only the **current shape** and link there for the "why". A project that keeps its decision records in a different slot keeps them there. The rules themselves are in `references/adr-conventions.md`, and the ADR directory's `README.md` points at them rather than restating them.

Placement heuristic: ask "does this doc describe something that exists, or something someone is still deciding?" The former goes in a numbered namespace; the latter goes in `99_ideas/`.

## 99_ideas/ as a quarantine bucket

`99_ideas/` holds anything not yet decided or not yet built: alternate designs under consideration, features sketched but not committed to, redesign proposals for an already-shipped system. Keeping this separate from the numbered namespaces protects the property that "everything outside `99_ideas/` describes the current, real state of the project" — a reader (or agent) never has to guess whether a doc in `01_architecture/` is aspirational or accurate.

When an idea from `99_ideas/` gets built, its content graduates into the matching numbered namespace, and the speculative doc is retired or trimmed to just the decision record — not left duplicated.

## No progress content in docs/

Never place any of the following in a numbered namespace, or anywhere in `docs/`:

- Implementation-status tables ("Feature X: 80% done")
- Percentage-complete counters
- TODO / done checklists tracking work-in-progress

This content belongs in the task tracker (see references/task-tracker-integration.md). The reason is not aesthetic: a status table goes stale the moment work continues, and a stale doc is worse than no doc because it actively misleads. `docs/` should describe things that stay true regardless of how much is implemented — architecture, concept, standards — so it never needs a "last updated" caveat to be trusted.

`98_plans/` is subject to the same test, and it is the namespace where the rule breaks most often. The moment a plan carries a status column, a percentage, or a checklist of what is finished, it is tracker content and belongs in the tracker; a plan that records only the intended sequence and the decisions behind it may stay. A release roadmap in particular is almost always tracker content wearing a doc's clothes — the milestone and its state live in the tracker (see references/backlog-granularity.md), not here.

When reviewing an existing docs/ tree, flag any status/progress content found and recommend moving it to the tracker rather than deleting the surrounding doc — the doc's non-progress content is usually still valid reference material.

## Pointing agents at the layout

A project's `CLAUDE.md` or `AGENTS.md` states the structure and the reading order, so an agent picking up the project does not have to discover it:

````markdown
## Documentation structure

```
docs/
├── 00_overview/        # Project overview
├── 01_architecture/    # System architecture (adr/ holds decision records)
├── 03_development/     # Development guides
└── 04_designs/         # UI/UX designs
```

## Before starting work

1. `docs/00_overview/README.md`
2. `docs/01_architecture/architecture.md`
````

List only the namespaces the project actually has. The same file names the task tracker (see references/task-tracker-integration.md) — one line covering both keeps the "where does this go?" question answerable without asking.

## Checklist

Run against every docs/ placement or review before presenting:

- [ ] Each new/moved doc placed by the heuristic: describes something that *exists* → numbered namespace; still being decided → `99_ideas/`
- [ ] No status tables, percentage-complete counters, or TODO/done checklists anywhere in docs/ — any found are flagged for the tracker, with the surrounding doc preserved
- [ ] Any `98_plans/` document records sequence and decisions only, with its status moved to the tracker
- [ ] Speculative or unimplemented design found outside `99_ideas/` is flagged for quarantine
- [ ] Ideas that have since been built are graduated into the matching numbered namespace, with the `99_ideas/` doc retired or trimmed to the decision record (no duplication)
- [ ] A doc describing *why* a decision was made links to its ADR rather than restating the history; the numbered namespace carries only the current shape
- [ ] Numbering follows the convention, and no existing namespace was renumbered to match this list
- [ ] The document itself was written against `/documentation` — this file governs only where it lives
