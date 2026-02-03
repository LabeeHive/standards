---
name: skill-creator
description: Create and update Claude skills following best practices. Use this when building new skills or improving existing ones. Triggers on "スキル作成", "skill作成", "create skill", "new skill", "スキル改善".
model: opus
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(mkdir:*), WebFetch, WebSearch, Task
---

# Skill Creator

Create effective skills that extend Claude's capabilities.

## Core Principle

> **Claude is already very smart.** Only add context Claude doesn't already have. Prefer concise examples over verbose explanations.

## Official Documentation

- **Agent Skills Specification**: https://agentskills.io/specification
- **Building Skills Guide**: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf
- **Claude Code Skills**: https://code.claude.com/docs/en/skills

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

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: kebab-case-name
description: [WHAT it does]. [WHEN to use]. Triggers on "english1", "english2", "日本語トリガー".
model: haiku|sonnet|opus
context: fork          # Required for Code Gen/Workflow, optional for Guidance
agent: general-purpose
allowed-tools: Read, Glob, Grep, Bash(specific:*)
---
```

**Triggers must include both English AND Japanese** for accessibility.

**Field Constraints (Agent Skills Spec):**

| Field | Required | Constraints |
|-------|:--------:|-------------|
| name | Yes | 1-64 chars, lowercase + hyphens, must match folder name |
| description | Yes | 1-1024 chars, WHAT + WHEN + Triggers |

**Model Selection (with numeric criteria):**

| Model | Use When | Criteria |
|-------|----------|----------|
| haiku | Read-only guidance | 0 file writes, 0 external calls |
| sonnet | Code generation | 1-3 steps, ≤2 external services |
| opus | Complex workflows | 4+ steps OR 3+ services OR MCP tools |

**allowed-tools:** Use specific patterns like `Bash(git:*)`, `Bash(gh:*)`, not generic `Bash`.

### Invocation Control

```yaml
disable-model-invocation: true  # User must invoke manually with /skill-name
user-invocable: false           # Only Claude can invoke (hidden from / menu)
```

**When to use `disable-model-invocation: true`:**

| Pattern | Example | Reason |
|---------|---------|--------|
| Setup/Init | repository-setup, docusaurus-setup | One-time setup should be intentional |
| Release/Deploy | swift-release | Side effects, requires user confirmation |
| Config changes | automation-config | Modifies project configuration |
| Complex creation | swift-mcp-server | Large-scale changes, user should control timing |

**When to keep default (auto-invocation allowed):**

| Pattern | Example | Reason |
|---------|---------|--------|
| Daily tasks | commit-message, vigilare-task | Frequent use, "コミットメッセージ" triggers naturally |
| Code assistance | swift-development, documentation | Helps during normal development flow |
| Workflow shortcuts | github-workflow | "Issue作って" should just work |

### Body

Concise instructions only. Move detailed content to `references/`.

## When Invoked

### Step 0: Research (if needed)

**When to research:**
- Creating a new type of skill (no similar existing skill)
- User asks for "best practices" or "latest patterns"
- Unfamiliar domain or tool integration

**Research targets (parallel):**

| Target | Method |
|--------|--------|
| Agent Skills Spec | WebFetch agentskills.io/specification |
| Existing skills | Task(Explore) in skills/ directory |
| Other marketplaces | WebSearch "claude code skills marketplace" |
| Similar tools | WebSearch "{tool-name} claude skill" |

**Skip research when:**
- Simple modification to existing skill
- Pattern already exists in this repository
- User provides clear, complete requirements

### Step 1: Gather Requirements

**Essential:**
- What should the skill do?
- Example usage scenarios?
- What tools/commands are needed?

**Invocation & scope:**
- Should it auto-invoke, or manual only? → `disable-model-invocation`
- Who uses it? JP users, EN users, or both? → Triggers in description
- Does it have side effects (deploy, release, config)? → manual only

### Step 2: Determine Skill Type

| Type | context: fork | model | Criteria | Example |
|------|:-------------:|:-----:|----------|---------|
| Guidance | Optional | haiku | 0 writes, 0 services | documentation |
| Code Gen | Yes | sonnet | 1-3 steps, ≤2 services | swift-development |
| Workflow | Yes | opus | 4+ steps OR 3+ services OR MCP | vigilare-task |

**context: fork:** Use for context isolation. Required for Code Gen/Workflow. Optional for Guidance when you want to avoid polluting the main conversation context.

**Quick check:** Does it use MCP tools? → opus. Does it write files? → sonnet+. Read-only? → haiku.

### Step 3: Plan Structure

Identify:
- Required `allowed-tools` with specific patterns
- Reference files needed
- Scripts or assets (if any)

### Step 4: Create Skill

1. Create directory: `skills/{skill-name}/`
2. Create `SKILL.md` with proper frontmatter
3. Create `references/` if needed
4. Add to `.claude-plugin/marketplace.json`

### Step 5: Validate

**Agent Skills Spec Compliance:**
- [ ] name: 1-64 chars, lowercase + hyphens only, matches folder
- [ ] name: no leading/trailing hyphens, no consecutive hyphens (`--`)
- [ ] description: 1-1024 chars, non-empty

**Labee Standards:**
- [ ] description has WHAT + WHEN + Triggers (JP & EN)
- [ ] allowed-tools uses specific patterns (not generic `Bash`)
- [ ] model selected by numeric criteria (see references/output-patterns.md)
- [ ] context: fork for workflow skills (sonnet/opus)
- [ ] disable-model-invocation: true for setup/release/config skills

**Context Efficiency:**
- [ ] SKILL.md body under 500 lines
- [ ] No redundant explanations (Claude is smart)
- [ ] Detailed content moved to references/
- [ ] No non-existent reference files listed

## Reference Files

**Loading behavior:**
- **Standard files:** Claude loads on-demand when the task requires them
- **Auto-load files (`_` prefix):** Always loaded when skill triggers

| File | Load When |
|------|-----------|
| references/workflows.md | Creating skills with 3+ steps or conditional logic |
| references/output-patterns.md | Defining description format, allowed-tools patterns, or model selection |
| references/resource-patterns.md | Deciding scripts/ vs references/ vs assets/, implementing scripts |

**Auto-load guidelines:**
- Use `_` prefix for core rules that apply to ALL invocations (e.g., `_core-rules.md`)
- Keep auto-load files small (<200 lines) to preserve token budget
- Examples: `documentation/_core-rules.md`, `research/_source-patterns.md`
