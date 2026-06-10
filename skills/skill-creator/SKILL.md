---
name: skill-creator
description: Create and update Claude skills following best practices. Use this when building new skills or improving existing ones.
when_to_use: Triggers on "スキル作成", "skill作成", "create skill", "new skill", "スキル改善".
model: opus
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(mkdir:*), Bash(bun:*), WebFetch, WebSearch, Task, TaskCreate, TaskUpdate, TaskList
---

# Skill Creator

Create effective skills that extend Claude's capabilities.

> **Claude is already very smart.** Only add context Claude doesn't already have. Prefer concise examples over verbose explanations.

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 1: Understand"
TaskCreate: "Phase 2: Research              | WebFetch spec + guide, Task(Explore)"
TaskCreate: "Phase 3: Plan Resources"
TaskCreate: "Phase 4: Initialize            | MUST run: bun scripts/init_skill.ts"
TaskCreate: "Phase 5: Create Resources      | Test scripts against real project"
TaskCreate: "Phase 6: Write SKILL.md"
TaskCreate: "Phase 7: Review Gate           | Agents: labee-dev-tech-lead, labee-dev-apm"
TaskCreate: "Phase 8: Validate & Package    | MUST run: bun scripts/quick_validate.ts"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

**Execution checklist (verify at end):**

| Phase | Must Execute | Condition |
|-------|-------------|-----------|
| 2 | WebFetch spec + guide, Task(Explore) | Unless skip criteria met |
| 4 | `bun scripts/init_skill.ts` | New skill only |
| 5 | Test scripts against real project | Scripts exist |
| 7 | `Task(labee-dev-tech-lead)` + `Task(labee-dev-apm)` | Always |
| 8 | `bun scripts/quick_validate.ts` | Always |

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

- **Agent Skills Specification**: https://agentskills.io/specification
- **Claude Code Skills**: https://code.claude.com/docs/en/skills
- **Best Practices**: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- **Official skill-creator**: https://github.com/anthropics/skills/tree/main/skills/skill-creator

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
| Building Skills Guide | WebFetch the PDF URL (if not recently read) |
| Existing similar skills | Task(Explore) in skills/ directory |
| Other marketplaces | WebSearch "claude code skills marketplace" |
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

1. **model** — See `references/output-patterns.md` Model Selection
2. **effort** — See `references/output-patterns.md` effort Decision
3. **allowed-tools** — List specific tool patterns needed (space-delimited)
4. **paths** — See `references/output-patterns.md` paths Decision. Set for any file-type-specific skill
5. **argument-hint** — See `references/output-patterns.md` argument-hint Decision
6. **Invocation control** — See `references/output-patterns.md` Invocation Control
7. **context: fork** — See `references/output-patterns.md` context: fork Decision

**Present the resource plan to the user for approval before proceeding.**

### Phase 4: Initialize

1. Run the initializer:
   ```bash
   bun skills/skill-creator/scripts/init_skill.ts {skill-name} --path skills
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
   bun scripts/{script-name}.ts --help    # Verify it runs
   bun scripts/{script-name}.ts {test-input}  # Verify with real input
   ```

3. **Test against a real project:** Run the script against an actual project that uses the target tool/format. Do not rely on `--help` alone.

4. Fix any failures before moving on.

#### 5b: References

For each reference file identified in Phase 3:

- Write focused markdown files
- Use `_` prefix only for files that apply to ALL invocations (keep <200 lines)
- Load on-demand by default

#### 5c: Assets

For each asset identified in Phase 3:

- Copy or create template files
- Binary files placed directly, no encoding

### Phase 6: Write SKILL.md

Now write the SKILL.md body, referencing the resources created in Phase 5.

**Frontmatter** — Use values decided in Phase 3. See `references/output-patterns.md` for:
- Frontmatter field reference
- Model selection criteria
- Invocation control patterns
- allowed-tools patterns

**Body guidelines:**

1. Keep it concise — Claude is smart, don't over-explain. Skill content persists in context across turns, so every line is a recurring cost (see `references/output-patterns.md` Skill Content Lifecycle)
2. Explain the *why* behind instructions instead of stacking ALL-CAPS MUSTs — models follow reasoning better than rigid commands. Repeated MUST/ALWAYS/NEVER is a yellow flag (official guidance)
3. Reference scripts by exact path: `` `bun scripts/validate.ts <input>` ``
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

**For ARL-enabled skills:** See `references/autonomous-refinement-loop.md` and `references/arl-skill-template.md`.

### Phase 7: Review Gate (PARALLEL)

**Required agents:** MUST spawn both `labee-dev-tech-lead` and `labee-dev-apm` via Task tool.

**This phase is BLOCKING. Both reviewers must approve before proceeding to Phase 8.**

```
┌─────────────────────────────────────────────────────────────┐
│ PARALLEL: Spawn 2 reviewers via Task                        │
├─────────────────────────────────────────────────────────────┤
│ 1. Task(labee-dev-tech-lead) → Process compliance review    │
│    - References were read before writing SKILL.md           │
│    - Structure follows existing skill patterns              │
│    - No TODO placeholders or incomplete sections            │
│    - Frontmatter values are justified (model, tools, etc.)  │
│                                                             │
│ 2. Task(labee-dev-apm) → Technical & automation review      │
│    - Script quality (error handling, exit codes, shebang)   │
│    - Scripts tested against real projects, not just --help  │
│    - Missed automation: repeated operations that SHOULD be  │
│      scripts but were left as manual SKILL.md instructions  │
│    - Deterministic steps that could be combined into one    │
│      script                                                 │
└─────────────────────────────────────────────────────────────┘
```

**Provide each reviewer with:**
- The complete SKILL.md content
- List of all resources created in Phase 5
- The resource plan from Phase 3 (so reviewers can verify completeness)

**On approval:** Both return LGTM → proceed to Phase 8.
**On rejection:** Fix issues cited by reviewers → re-run Phase 7.

### Phase 8: Validate & Package

#### 8a: Quick Validate

```bash
bun skills/skill-creator/scripts/quick_validate.ts skills/{skill-name}
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
- [ ] allowed-tools uses specific patterns (not generic `Bash`)
- [ ] model selected by numeric criteria (see `references/output-patterns.md`)
- [ ] effort set appropriately for model (opus → max, haiku → low)
- [ ] paths set for file-type-specific skills (glob patterns) — but NOT when `disable-model-invocation: true` (auto-activation is disabled, so paths can never fire)
- [ ] argument-hint set for skills with `disable-model-invocation: true` or meaningful arguments
- [ ] Invocation control set correctly for skill type
- [ ] context: fork ONLY for self-contained tasks

**Context Efficiency:**
- [ ] SKILL.md body under 500 lines
- [ ] No redundant explanations
- [ ] Detailed content moved to references/
- [ ] No references to non-existent files
- [ ] All scripts tested and working

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

## Reference Files

| File | Load When |
|------|-----------|
| references/output-patterns.md | Defining frontmatter, description, allowed-tools, model, invocation control |
| references/workflows.md | Creating skills with 3+ steps or conditional logic |
| references/resource-patterns.md | Deciding scripts/ vs references/ vs assets/, implementing scripts |
| references/autonomous-refinement-loop.md | Creating skills that need self-correction loops |
| references/arl-skill-template.md | Quick-starting an ARL-enabled skill |

## Session Learning Scripts

For Autonomous Refinement Loop enabled skills:

| Script | Purpose |
|--------|---------|
| `scripts/init_session.ts` | Initialize session learning file |
| `scripts/log_iteration.ts` | Log each verification attempt |
| `scripts/finalize_session.ts` | Finalize session with learnings |
