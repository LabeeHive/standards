---
name: skill-creator
description: Create and update Claude skills following best practices. Use this when building new skills or improving existing ones. Triggers on "スキル作成", "skill作成", "create skill", "new skill", "スキル改善".
model: opus
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(mkdir:*)
---

# Skill Creator

Create effective skills that extend Claude's capabilities.

## Official Guide

Full specification: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf

## Skill Structure

```
skill-name/
├── SKILL.md           # Required: frontmatter + instructions
├── references/        # Optional: documentation loaded as needed
├── scripts/           # Optional: executable code
└── assets/            # Optional: templates, images
```

**DO NOT create**: README.md, CHANGELOG.md, or other auxiliary files.

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: kebab-case-name
description: [WHAT it does]. [WHEN to use]. Triggers on "trigger1", "trigger2", "日本語トリガー".
model: haiku|sonnet|opus
context: fork          # For workflow skills
agent: general-purpose
allowed-tools: Read, Glob, Grep, Bash(specific:*)
---
```

**Model Selection:**
- `haiku`: Guidance/reference skills (read-only)
- `sonnet`: Code generation, file creation
- `opus`: Complex multi-step workflows

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
| Complex creation | skill-creator, swift-mcp-server | Large-scale changes, user should control timing |

**When to keep default (auto-invocation allowed):**

| Pattern | Example | Reason |
|---------|---------|--------|
| Daily tasks | commit-message, vigilare-task | Frequent use, "コミットメッセージ" triggers naturally |
| Code assistance | swift-development, documentation | Helps during normal development flow |
| Workflow shortcuts | github-workflow | "Issue作って" should just work |

### Body

Concise instructions only. Move detailed content to `references/`.

## When Invoked

### Step 1: Gather Requirements

Ask:
- What should the skill do?
- Example usage scenarios?
- What tools/commands are needed?

### Step 2: Determine Skill Type

| Type | context: fork | model | Example |
|------|:-------------:|:-----:|---------|
| Guidance | No | haiku | documentation |
| Code Generation | Yes | sonnet | swift-development |
| Workflow | Yes | opus | vigilare-task |

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

Check:
- [ ] name is kebab-case and matches folder
- [ ] description has WHAT + WHEN + Triggers (JP & EN)
- [ ] allowed-tools uses specific patterns
- [ ] context: fork for workflow skills
- [ ] disable-model-invocation: true for setup/release/config skills
- [ ] No non-existent reference files listed
- [ ] Under 500 lines in SKILL.md body

## Reference Files

| File | Use When |
|------|----------|
| references/workflows.md | Multi-step workflow patterns |
| references/output-patterns.md | Template and example patterns |
