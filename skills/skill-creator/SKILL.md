---
name: skill-creator
description: Create and update Claude skills following best practices. Use this when building new skills or improving existing ones.
when_to_use: Triggers on "スキル作成", "skill作成", "create skill", "new skill", "スキル改善".
---

# Skill Creator

Create effective skills that extend Claude's capabilities.

> **Claude is already very smart.** Only add context Claude doesn't already have. Prefer concise examples over verbose explanations.

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 1: Understand"
TaskCreate: "Phase 2: Research              | WebFetch spec + guide, Agent(Explore)"
TaskCreate: "Phase 3: Plan Resources"
TaskCreate: "Phase 4: Initialize            | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/init_skill.ts"
TaskCreate: "Phase 5: Create Resources      | Test scripts against real project"
TaskCreate: "Phase 6: Write SKILL.md"
TaskCreate: "Phase 7: Review Gate           | Agents: labee-dev-tech-lead, labee-dev-apm"
TaskCreate: "Phase 8: Validate & Package    | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/quick_validate.ts"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

The task tools are opt-in on current models — Claude Code 2.1.233 removed `TaskCreate`/`TaskGet`/`TaskUpdate`/`TaskList` from Opus 4.8, Sonnet 5, Fable 5, Mythos 5 and newer unless `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` is set. When they are unavailable, keep the same phases as a checklist in your responses and report which phase you are on; do not skip phases because the tool is missing.

**Execution checklist (verify at end):**

| Phase | Must Execute | Condition |
|-------|-------------|-----------|
| 2 | WebFetch spec + guide, Agent(Explore) | Unless skip criteria met |
| 4 | `bun ${CLAUDE_SKILL_DIR}/scripts/init_skill.ts` | New skill only |
| 5 | Test scripts against real project | Scripts exist |
| 7 | `Agent(labee-dev-tech-lead)` + `Agent(labee-dev-apm)` | Always |
| 8 | `bun ${CLAUDE_SKILL_DIR}/scripts/quick_validate.ts` | Always |

## Progressive Disclosure (3-Level Loading)

| Level | What | Token Budget | When Loaded |
|-------|------|--------------|-------------|
| 1. Metadata | name + description | ~100 tokens | Always (all skills) |
| 2. Body | SKILL.md content | <5000 tokens | When skill triggers |
| 3. Resources | references/, scripts/, assets/ | Unlimited | On-demand by Claude |

**Key insight:** Keep SKILL.md lean. Move detailed content to references/.

## Skill Structure

```
skill-name/
├── SKILL.md           # Required: frontmatter + instructions (<500 lines)
├── references/        # Optional: documentation (on-demand loading)
├── scripts/           # Optional: executable code
└── assets/            # Optional: templates, images
```

**DO NOT create**: README.md, CHANGELOG.md, or other auxiliary files.

## Official Documentation

- **Agent Skills Specification**: <https://agentskills.io/specification>
- **Claude Code Skills**: <https://code.claude.com/docs/en/skills>
- **Best Practices**: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>
- **Official skill-creator**: <https://github.com/anthropics/skills/tree/main/skills/skill-creator>

## Workflow

### Phase 1: Understand

**Goal:** Understand what the user needs through concrete examples.

1. Ask the user for **2-3 concrete usage scenarios**:
   - "When would you use this skill?"
   - "Walk me through a typical invocation — what do you say, what happens?"
   - "What does the final output look like?"

2. For each scenario, capture:
   - **Trigger**: What the user says / situation that invokes the skill
   - **Input**: What information the skill receives
   - **Process**: What steps the skill performs
   - **Output**: What the user gets back

3. Confirm understanding: summarize the scenarios back to the user.

**Skip when:** Updating an existing skill with clear requirements.

### Phase 2: Research (PARALLEL)

**Run these in parallel:**

| Target | Method |
|--------|--------|
| Agent Skills Spec | WebFetch agentskills.io/specification |
| Existing similar skills | Agent(Explore) in skills/ directory |
| Domain tools | WebSearch "{tool-name} CLI documentation" |

**Skip when ALL of these are true:**

- Change is limited to existing SKILL.md body (no new resources needed)
- No workflow steps are being added, removed, or restructured
- No new tools or external commands are introduced
- Pattern already exists in this repository

### Phase 3: Plan Resources

**Goal:** From the concrete examples in Phase 1, reverse-engineer what resources the skill needs.

For **each scenario** from Phase 1, ask:

- "What operations repeat across scenarios?" → **scripts/**
- "Can consecutive deterministic steps be combined into one script?" → **scripts/**
- "What domain knowledge does Claude need?" → **references/**
- "What templates or files does the output need?" → **assets/**

**Resource planning table:**

| Scenario | Repeated Operation | Resource Type | File |
|----------|--------------------|---------------|------|
| (fill per scenario) | | scripts/refs/assets | |

**Then decide frontmatter:**

1. **allowed-tools** — Do not set (see `references/output-patterns.md` allowed-tools Decision). It grants, never restricts, so a checked-in grant buys nothing here. Use `disallowed-tools` when a skill must lose access to a tool
2. **argument-hint** — See `references/output-patterns.md` argument-hint Decision
3. **Invocation control** — See `references/output-patterns.md` Invocation Control
4. **paths** — Do not set (see `references/output-patterns.md` paths Decision). Express file affinity in `description`/`when_to_use` instead

**Do not set** `model`, `effort`, `context: fork`, `agent`, or `background`. No skill in this repository sets any of them. `context: fork` runs the skill in an isolated subagent with no conversation history, backgrounded by default since Claude Code 2.1.218 (`background: false` waits in-turn) — either way it cannot ask the user anything, which is why the field was removed from this repository in July. A skill that needs isolation spawns a subagent instead. `model` is worse than unnecessary: since 2.1.227 it is recorded but not applied in interactive sessions (works only under `claude -p`; Anthropic reproduced this on 2.1.233, issue #85658). Skills inherit the session's model and effort.

**Present the resource plan to the user for approval before proceeding.**

### Phase 4: Initialize

1. Run the initializer:

   ```bash
   bun ${CLAUDE_SKILL_DIR}/scripts/init_skill.ts {skill-name} --path skills
   ```

2. **Delete unused directories** from the generated scaffold:
   - No scripts planned? Delete `scripts/`
   - No references planned? Delete `references/`
   - No assets planned? Delete `assets/`

3. Delete placeholder files (`example.ts`, `api_reference.md`, `example_asset.txt`).

### Phase 5: Create Resources

**Resources FIRST, SKILL.md body SECOND.** This ensures the body can reference real resources.

**Order: scripts → test → references → assets**

#### 5a: Scripts

For each script identified in Phase 3:

1. **Write the script** following patterns in `references/resource-patterns.md`:
   - Shebang line (`#!/usr/bin/env bun`)
   - Usage documentation at top
   - Exit codes: 0 = success, 1 = failure
   - Errors to stderr, results to stdout

2. **Test the script immediately:**

   ```bash
   bun skills/{skill-name}/scripts/{script-name}.ts --help    # Verify it runs
   bun skills/{skill-name}/scripts/{script-name}.ts {test-input}  # Verify with real input
   ```

3. **Test against a real project:** Run the script against an actual project that uses the target tool/format. Do not rely on `--help` alone.

4. Fix any failures before moving on.

#### 5b: References

For each reference file identified in Phase 3:

- Write focused markdown files
- Use `_` prefix only for files that apply to ALL invocations (keep <200 lines), and inject them into SKILL.md with a `` ```! `` `cat` block — the injection runs without any allowed-tools entry, see `references/resource-patterns.md` Naming Conventions
- Load on-demand by default

#### 5c: Assets

For each asset identified in Phase 3:

- Copy or create template files
- Binary files placed directly, no encoding

### Phase 6: Write SKILL.md

Now write the SKILL.md body, referencing the resources created in Phase 5.

**Frontmatter** — Use values decided in Phase 3. See `references/output-patterns.md` for the field reference and invocation control.

**Body guidelines:**

1. Keep it concise — Claude is smart, don't over-explain. Skill content persists in context across turns, so every line is a recurring cost (see `references/output-patterns.md` Skill Content Lifecycle)
2. Explain the *why* behind instructions instead of stacking ALL-CAPS MUSTs — models follow reasoning better than rigid commands. Repeated MUST/ALWAYS/NEVER is a yellow flag (official guidance)
3. Reference scripts via the `CLAUDE_SKILL_DIR` substitution so paths resolve regardless of cwd — never write a cwd-relative `bun scripts/...` path. Exact syntax: see `references/resource-patterns.md` Referencing in SKILL.md
4. Reference files: "See `references/api.md` for details"
5. Include step-by-step workflow if the skill has 3+ steps (see `references/workflows.md`)
6. Add a **Reference Files** table at the bottom:

```markdown
## Reference Files

| File | Load When |
|------|-----------|
| references/foo.md | When doing X |
| references/bar.md | When doing Y |
```

**For skills that verify and retry:** see `references/workflows.md` Bounded retry.

### Phase 7: Review Gate (PARALLEL)

**Spawn both `labee-dev-tech-lead` and `labee-dev-apm` in one message via the Agent tool. This phase blocks Phase 8 until both approve.**

A skill you just wrote reads correctly to you because you hold the intent that produced it. A reader who does not catches the two things that intent hides: instructions that only make sense if you already know what was meant, and steps left as prose that should have been a script.

Not a process audit — do not ask whether references were read or TODOs remain.

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Spawn 2 reviewers via Agent                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Agent(labee-dev-tech-lead) → Instructions as written     │
│    - Steps that assume context the reader will not have     │
│    - Claims about tool behaviour that are not true          │
│    - Blocking questions on a path the user cannot reach     │
│    - Drift from how existing skills in this repo are built  │
│                                                             │
│ 2. Agent(labee-dev-apm) → Scripts and automation            │
│    - Script quality (error handling, exit codes, shebang)   │
│    - Scripts tested against real projects, not just --help  │
│    - Repeated manual steps that should have been a script   │
└─────────────────────────────────────────────────────────────┘
```

**Give each reviewer** the SKILL.md text, the resources created in Phase 5, and the plan from Phase 3. They run in fresh contexts and see nothing of this conversation.

**Each brief must state:**

- Where the review output goes and in what format
- Acceptance criteria — what "LGTM" requires, concretely
- What is out of scope (the other reviewer's lane, and the process audit above)

The reporting lines (plan to main, one line per milestone, message-and-wait before going outside the brief, results to a file) are delivered to every subagent at start by this plugin's `hooks/hooks.json` (a `SubagentStart` hook).

**Name the reviewers when you spawn them** (the Agent tool's `name` parameter, e.g. `tech-lead-review` and `apm-review`) so a rejection can go back to the same reviewer.

**On approval:** both LGTM → Phase 8.
**On rejection:** fix what they cite, then send the fix to the *same* reviewer with `SendMessage(to: <name>)` — what changed and where — and ask it to re-check its own findings. Do not spawn a fresh reviewer for the re-review: a new one has not seen the findings it would be verifying, and re-reads everything from zero. Repeat until it returns LGTM; a fresh spawn is only for a reviewer that has died or lost its context.

### Phase 8: Validate & Package

#### 8a: Quick Validate

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/quick_validate.ts skills/{skill-name}
```

Fix any errors and re-run.

#### 8b: Checklist

**Agent Skills Spec Compliance:**

- [ ] name: 1-64 chars, lowercase + hyphens only, matches folder (spec requires it; Claude Code falls back to the directory name, but set it for portability)
- [ ] name: no leading/trailing hyphens, no consecutive hyphens (`--`)
- [ ] description: 1-1024 chars, non-empty

**Labee Standards:**

- [ ] description has WHAT + WHEN, written in third person; trigger phrases (JP & EN) in `when_to_use` (or inline in description for cross-tool skills)
- [ ] description key info front-loaded (`description` + `when_to_use` are capped at 1,536 chars in the skill listing)
- [ ] name does not contain reserved words (`anthropic`, `claude`)
- [ ] allowed-tools NOT set — the validator enforces it
- [ ] `model`, `effort`, `context`, `agent`, `background`, `paths` NOT set — `quick_validate.ts` now fails the skill if any of them appears
- [ ] No instruction that blocks on user input sits in a code path the user cannot reach
- [ ] paths NOT set — removed from this repository over Claude Code bugs that break skill discovery (see `references/output-patterns.md` paths Decision)
- [ ] argument-hint set for skills with `disable-model-invocation: true` or meaningful arguments
- [ ] Invocation control set correctly for skill type
- [ ] `disable-model-invocation: true` skills carry no `when_to_use` trigger list — the model cannot see or invoke them, so trigger phrases there are dead text

**Context Efficiency:**

- [ ] SKILL.md body under 500 lines
- [ ] No redundant explanations
- [ ] Detailed content moved to references/
- [ ] No references to non-existent files
- [ ] All scripts tested and working
- [ ] Script invocations in SKILL.md use the `CLAUDE_SKILL_DIR` substitution, not cwd-relative paths

**Resources:**

- [ ] No unused directories (scripts/, references/, assets/)
- [ ] No placeholder files from init_skill.ts
- [ ] Scripts have shebang, usage docs, proper exit codes
- [ ] Scripts tested against a real project with real data

#### 8c: Package

Add the skill to `.claude-plugin/marketplace.json` if applicable.

## Improving Existing Skills

Principles from the official skill-creator (anthropics/skills) for iterating on a skill that already exists:

- **Test before and after.** Run 2-3 realistic prompts against the skill, ideally comparing old vs new versions (snapshot the old version first). Judge from real outputs, not from how the instructions read.
- **Generalize from feedback.** A skill is used across many prompts — fixes that only patch the tested examples are overfitting. Prefer reframing the instruction over adding narrow special cases.
- **Keep the prompt lean.** Read the transcripts, not just the outputs. If a section makes the model do unproductive work, removing it is an improvement.
- **Bundle repeated work.** If test runs keep writing the same helper script or repeating the same multi-step sequence, ship it in `scripts/` so future invocations don't reinvent it.
- **Strengthen triggering empirically.** If the skill undertriggers, make the description more concrete (and slightly "pushy") about when to use it; test with both should-trigger and tricky near-miss should-not-trigger phrasings.
- **Measure instead of guessing.** The official skill-creator plugin ships an eval loop — `evals/evals.json` plus per-eval grading, run isolated per subagent, with benchmark and version A/B modes — which is the documented way to compare two versions of a skill on the same prompts.

## Reference Files

| File | Load When |
|------|-----------|
| references/output-patterns.md | Defining frontmatter, description, invocation control |
| references/workflows.md | Creating skills with 3+ steps or conditional logic |
| references/resource-patterns.md | Deciding scripts/ vs references/ vs assets/, implementing scripts |
