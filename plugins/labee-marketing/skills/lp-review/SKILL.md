---
name: lp-review
description: Review English LP copy for messaging, naturalness, and SEO using three parallel reviewers. Use when reviewing landing page content.
when_to_use: Triggers on "LP review", "LPレビュー", "landing page review", "LP copy", "コピーレビュー".
---

# LP Review

Review English-only landing page copy from messaging, naturalness, and SEO perspectives using three parallel reviewers.

> **English-authored copy only.** This skill reviews LP text written in English. It is NOT for reviewing translations from Japanese.

## Review Checklist (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_checklist-lp.md" 2>/dev/null || echo "(reference missing: _checklist-lp.md)"
```

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 0: Route"
TaskCreate: "Phase 1: Discover Target Files"
TaskCreate: "Phase 2: Build Shared Context"
TaskCreate: "Phase 3: Run Reviews"
TaskCreate: "Phase 4: Reconcile Findings"
TaskCreate: "Phase 5: Synthesize Results"
TaskCreate: "Phase 6: Apply Fixes"
```

Update status as you progress: `in_progress` when starting, `completed` when done. The task tools are opt-in on current models — when they are not available, keep the same phases as a checklist in your response instead. The phases are the contract; the tool is one way to hold it.

## Workflow

### Phase 0: Route

Verify the target is LP files:

1. Check for `.tsx` files (LP/Docusaurus pages) and `docusaurus.config.*`
2. **If ASO metadata detected** (App Store description, keywords, subtitle): Tell user "This looks like ASO metadata. Please use `/aso-review` instead." and STOP.

### Phase 1: Discover Target Files

1. `Glob("**/*.tsx")` -- LP and Docusaurus page components
2. `Glob("docusaurus.config.*")` -- SEO headTags and site metadata
3. Read every discovered file in full — copy is judged in context, and a partial read produces findings that contradict the surrounding page.

### Phase 2: Build Shared Context

Assemble a context package to hand to each reviewer:

1. **Full target text** -- All copy from discovered files
2. **Role descriptions** -- Each reviewer's focus area (see Phase 3 table)
3. **Brand voice** -- Reference `/labee-llc-guide` for tone and values

This context package is passed to each agent in Phase 3.

### Phase 3: Run Reviews

**Spawn all 3 reviewers in ONE message using the Agent tool -- do NOT launch sequentially.**

| Reviewer | subagent_type | Role |
|----------|---------------|------|
| Messaging | labee-pr-sns-ruka | Persuasion flow, audience resonance, CTA clarity, English-native copy quality |
| Naturalness | general-purpose | English AI pattern detection, "translated from Japanese" detection |
| SEO | labee-marketing-seo | Web SEO keyword alignment, meta tags, heading structure |

Each reviewer works independently and returns findings to you. Reviewers do not talk to each other -- you reconcile their output in Phase 4.

**Name each reviewer when you spawn it** (the Agent tool's `name` parameter, e.g. `messaging-review`, `naturalness-review`, `seo-review`) so Phase 4 can go back to the one that raised a finding.

**Brief contents (every reviewer):** where to put the result (a file path once it runs past a few lines), the output format, what a complete review covers, and what is out of scope (another reviewer's angle -- you reconcile in Phase 4); the reporting lines (plan to main, one line per milestone, message-and-wait before going outside the brief, results to a file) are delivered to every subagent at start by this plugin's `hooks/hooks.json` (a `SubagentStart` hook).

**Each agent receives:**

- The full LP copy
- The checklist from `references/_checklist-lp.md` relevant to their role
- Instructions to output findings as actionable items with suggested fixes

**Agent instructions:**

**Messaging reviewer:**

- Review persuasion flow: Hero -> Features -> CTA
- Check CTA hierarchy (primary vs secondary, above-the-fold)
- Evaluate audience resonance for each segment (developers, managers, remote workers)
- Verify brand voice matches Labee values
- Flag copy that sounds like a corporate brochure

**Naturalness reviewer:**

- Detect AI vocabulary and inflated phrasing
- Detect "translated from Japanese" patterns (subject omission, feature-first, keigo leaks)
- Check for comma-splice run-ons, forced rule-of-three, excessive hedging
- Suggest specific rewrites for every flagged item

**SEO reviewer:**

- Check page title, meta description, H1 for primary keyword
- Verify heading hierarchy (no skipped H levels)
- Check Open Graph and Twitter Card meta tags
- Review internal linking and alt text
- Evaluate keyword density (natural, not stuffed)

### Phase 4: Reconcile Findings

The three reviewers optimize for different things, so their recommendations will collide. Work through the collisions yourself before writing the report:

1. **SEO keyword vs natural phrasing** -- a keyword the SEO reviewer wants placed may be phrasing the naturalness reviewer rejects. Prefer copy a native speaker would actually write; say which you chose and why.
2. **Persuasion vs accuracy** -- if the messaging reviewer's rewrite claims more than the product does, the claim loses.
3. **Overlap** -- the same line will often be flagged by two reviewers for different reasons. Merge those into one finding with one fix, not two competing ones.

If a finding is thin or needs re-checking against another reviewer's angle, go back to the reviewer that raised it with `SendMessage(to: <name>)` -- say what you need re-checked and why -- rather than guessing. Do not spawn a fresh reviewer for a re-check: a new one has not seen the findings it would be verifying and re-reads everything from zero. A fresh spawn is only for a reviewer that has died or lost its context.

### Phase 5: Synthesize Results

Compile a **unified report** from the reconciled findings:

```markdown
## LP Review Report

### Findings
- [item]: [issue] -> [suggested fix]

### Conflicts Resolved
- [conflict]: [how you resolved it and why]
```

Then present it to the user and wait for approval before applying fixes.

### Phase 6: Apply Fixes

**Only after user approval:**

1. Apply approved fixes using Edit/Write
2. Run `pnpm run build` to verify no build errors
3. If build fails, fix and re-run
4. Present summary of changes made

## Good/Bad Examples

### Hero Section

**Bad:**
> A Comprehensive Task Management Solution Designed to Revolutionize Your Workflow

**Good:**
> Get more done. Stress less.

**Why:** The bad version uses AI vocabulary ("comprehensive", "revolutionize"), inflated phrasing, and says nothing specific. The good version is direct and benefit-focused.

### Feature Benefit

**Bad:**
> Our task management functionality enables users to efficiently organize and prioritize their daily activities.

**Good:**
> Drag tasks around. Done ones disappear. That's it.

**Why:** The bad version is abstract and formal ("functionality enables users to efficiently"). The good version shows the actual experience.

### CTA

**Bad:**
> Please feel free to try our service

**Good:**
> Start free -- no credit card needed

**Why:** The bad version has Japanese politeness norms ("please feel free") that sound unnatural in English LP copy. The good version is direct with a trust signal.

### Translated-from-Japanese Pattern

**Bad:**
> Can manage tasks easily and check progress at a glance

**Good:**
> You manage tasks and track progress -- all in one view

**Why:** The bad version omits the subject (natural in Japanese, incomplete in English). The good version adds "You" and flows naturally.

### AI Pattern

**Bad:**
> Our cutting-edge platform serves as a comprehensive solution that seamlessly integrates with your existing workflow, enabling teams to leverage powerful collaboration tools.

**Good:**
> It connects to Slack, GitHub, and Jira. Your team sees everything in one place.

**Why:** The bad version stacks AI vocabulary ("cutting-edge", "serves as", "comprehensive", "seamlessly", "leverage"). The good version states concrete facts.

### Feature-First vs Benefit-First

**Bad:**
> Multi-language support function with automatic translation capability

**Good:**
> Write once, read in any language. Auto-translated in 12 languages.

**Why:** The bad version leads with the feature (Japanese product copy pattern). The good version leads with the benefit and adds a specific number.

## Anti-Patterns

1. Reviewer output is reconciled in Phase 4, not concatenated — raw concatenation leaves contradictions in the report.
2. Reviewers do not talk to each other; you hold the reconciliation.
3. ASO metadata belongs to `/aso-review`. Redirect rather than reviewing it here.

## Reference Files

| File | Load When |
|------|-----------|
| references/_checklist-lp.md | Injected on every invocation (above) |
