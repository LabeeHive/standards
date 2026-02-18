---
name: lp-review
description: Review English LP copy for messaging, naturalness, and SEO using a 3-agent review team. Use when reviewing landing page content. Triggers on "LP review", "LPレビュー", "landing page review", "LP copy", "コピーレビュー".
model: sonnet
context: fork
allowed-tools: Read, Glob, Grep, Edit, Write, Task, TeamCreate, TeamDelete, SendMessage, TaskCreate, TaskUpdate, TaskList, Bash(pnpm:*)
---

# LP Review

Review English-only landing page copy from messaging, naturalness, and SEO perspectives using a coordinated review team.

> **English-authored copy only.** This skill reviews LP text written in English. It is NOT for reviewing translations from Japanese.

## Phase Tracking

**At workflow start, MUST create tasks for each phase:**

```
TaskCreate: "Phase 0: Route"
TaskCreate: "Phase 1: Discover Target Files"
TaskCreate: "Phase 2: Build Shared Context"
TaskCreate: "Phase 3: Form Review Team & Run Reviews"
TaskCreate: "Phase 4: Cross-Review Discussion"
TaskCreate: "Phase 5: Synthesize Results"
TaskCreate: "Phase 6: Apply Fixes"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

## Workflow

### Phase 0: Route

Verify the target is LP files:

1. Check for `.tsx` files (LP/Docusaurus pages) and `docusaurus.config.*`
2. **If ASO metadata detected** (App Store description, keywords, subtitle): Tell user "This looks like ASO metadata. Please use `/aso-review` instead." and STOP.

### Phase 1: Discover Target Files

1. `Glob("**/*.tsx")` -- LP and Docusaurus page components
2. `Glob("docusaurus.config.*")` -- SEO headTags and site metadata
3. **MUST Read ALL discovered files** -- Do not skip any. Full text is needed for context.

### Phase 2: Build Shared Context

Assemble a context package for the review team:

1. **Full target text** -- All copy from discovered files
2. **Role descriptions** -- Each reviewer's focus area (see Phase 3 table)
3. **Brand voice** -- Reference `/labee-llc-guide` for tone and values

This context package is passed to each agent in Phase 3.

### Phase 3: Form Review Team & Run Reviews

**MUST call TeamCreate to create the review team.**
**MUST spawn ALL 3 agents in ONE SendMessage block -- do NOT launch sequentially.**

```
TeamCreate("lp-review-team")
```

Then send the shared context to all 3 agents in parallel:

| Agent Name | subagent_type | Role |
|------------|---------------|------|
| messaging-reviewer | labee-pr-sns-ruka | **LEAD** -- Persuasion flow, audience resonance, CTA clarity, English-native copy quality |
| naturalness-reviewer | general-purpose | English AI pattern detection, "translated from Japanese" detection |
| seo-reviewer | labee-marketing-seo | Web SEO keyword alignment, meta tags, heading structure |

**Each agent receives:**
- The full LP copy
- The checklist from `references/_checklist-lp.md` relevant to their role
- Instructions to output findings as P1/P2/P3 prioritized items

**Agent instructions:**

**messaging-reviewer (LEAD):**
- Review persuasion flow: Hero -> Features -> CTA
- Check CTA hierarchy (primary vs secondary, above-the-fold)
- Evaluate audience resonance for each segment (developers, managers, remote workers)
- Verify brand voice matches Labee values
- Flag copy that sounds like a corporate brochure

**naturalness-reviewer:**
- Detect AI vocabulary and inflated phrasing
- Detect "translated from Japanese" patterns (subject omission, feature-first, keigo leaks)
- Check for comma-splice run-ons, forced rule-of-three, excessive hedging
- Suggest specific rewrites for every flagged item

**seo-reviewer:**
- Check page title, meta description, H1 for primary keyword
- Verify heading hierarchy (no skipped H levels)
- Check Open Graph and Twitter Card meta tags
- Review internal linking and alt text
- Evaluate keyword density (natural, not stuffed)

### Phase 4: Cross-Review Discussion

**MUST use SendMessage to relay findings between agents.** Do NOT skip this phase.

1. Collect all 3 agents' findings
2. **Send messaging-reviewer's findings to naturalness-reviewer and seo-reviewer**
3. **Send naturalness-reviewer's findings to messaging-reviewer**
4. **Send seo-reviewer's findings to messaging-reviewer**
5. Each agent responds with:
   - Agreements or disagreements with other reviewers
   - Conflicts (e.g., SEO keyword vs natural phrasing) and proposed resolutions
   - Any items they missed that another reviewer caught

**The messaging-reviewer (LEAD) makes final call on conflicts.**

### Phase 5: Synthesize Results

1. Collect final feedback from all agents after cross-review
2. Compile a **unified report** organized by priority:

```markdown
## LP Review Report

### P1 -- Must Fix
- [item]: [issue] -> [suggested fix]

### P2 -- Should Fix
- [item]: [issue] -> [suggested fix]

### P3 -- Nice to Have
- [item]: [issue] -> [suggested fix]

### Conflicts Resolved
- [conflict]: [resolution by lead reviewer]
```

3. **MUST call TeamDelete("lp-review-team")** after synthesizing results.
4. Present report to user and **wait for approval** before applying fixes.

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

1. **Do NOT launch agents sequentially** -- All 3 agents MUST be spawned in one message
2. **Do NOT skip cross-review discussion** -- Phase 4 is where conflicts get resolved
3. **Do NOT merge results without discussion** -- Raw concatenation misses contradictions
4. **Do NOT forget TeamDelete** -- Always clean up the review team after Phase 5
5. **Do NOT review ASO metadata** -- Redirect to `/aso-review` instead

## Reference Files

| File | Load When |
|------|-----------|
| references/_checklist-lp.md | Always (auto-loaded) |
