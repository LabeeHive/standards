# Workflow Patterns

Patterns for designing effective skill workflows.

## Degrees of Freedom

Match specificity to task fragility:

| Freedom | Use When | Format | Risk if Wrong |
|---------|----------|--------|---------------|
| High | Multiple valid approaches | Text instructions | Low - easily corrected |
| Medium | Preferred pattern exists | Pseudocode with params | Medium - rework needed |
| Low | Fragile operations | Specific scripts | High - data loss, side effects |

**Decision criteria:**

| Question | Yes → | No → |
|----------|-------|------|
| Can user easily undo mistakes? | Higher freedom | Lower freedom |
| Are there external side effects? | Lower freedom | Higher freedom |
| Does order matter strictly? | Lower freedom | Higher freedom |
| Is output format critical? | Lower freedom | Higher freedom |

**Example - High freedom:**
```markdown
Analyze the code and suggest improvements based on the project's style.
```

**Example - Medium freedom:**
```markdown
Create commit message following conventional commits:
- type: feat|fix|refactor|docs|test
- scope: optional, in parentheses
- description: imperative mood, lowercase
```

**Example - Low freedom:**
```markdown
Run exactly:
1. `git fetch origin`
2. `git rebase origin/main`
3. `git push --force-with-lease`
```

## Phase Tracking

For skills with 3+ steps, use Phase Tracking to ensure progress visibility and mandatory execution.

**Pattern:** Create tasks at workflow start, annotate each with what must be executed:

    ## Phase Tracking

    **At workflow start, create tasks for each phase:**

    TaskCreate: "Step 1: Verify        | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts"
    TaskCreate: "Step 2: Execute       | Skills: /some-skill"
    TaskCreate: "Step 3: Re-verify     | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts"
    TaskCreate: "Step 4: Report"

    Update status as you progress: `in_progress` when starting, `completed` when done.

**Annotation format:**

| Annotation | Use When | Example |
|------------|----------|---------|
| `\| MUST run: {command}` | Script execution is required | `\| MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts` |
| `\| Skills: /name` | Skill invocation is required | `\| Skills: /swift-development` |
| `\| Skills: /name (if condition)` | Conditional skill invocation | `\| Skills: /localization (if UI strings changed)` |
| (no annotation) | No specific execution required | Phase is purely manual or analytical |

**Add an execution checklist table after the phase list** to make mandatory actions scannable:

    **Execution checklist (verify at end):**

    | Phase | Must Execute | Condition |
    |-------|-------------|-----------|
    | 1 | `bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts` | Always |
    | 2 | `Skill("some-skill")` | Always |
    | 3 | `bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts` | Always |

**When to use Phase Tracking:**
- Skill has 3+ sequential steps
- Steps include mandatory script runs or skill invocations
- Skipping a step could produce incorrect output

**Real examples:** See `swift-workflow` (8 phases with skill annotations) and `swift-localization` (4 steps with MUST run annotations).

## Sequential Workflows

Break complex tasks into numbered steps:

```markdown
## When Invoked

### Step 1: Gather Information
[What to collect and how]

### Step 2: Validate Input
[Validation criteria]

### Step 3: Execute
[Main operation]

### Step 4: Verify
[How to confirm success]

### Step 5: Report
[What to tell the user]
```

## Conditional Workflows

Guide through decision points:

```markdown
### Step 1: Determine Type

**Bug fix?** → Use `fix:` prefix, reference issue
**New feature?** → Use `feat:` prefix, describe behavior
**Refactor?** → Use `refactor:` prefix, explain why
```

## Progressive Disclosure

**3-Level Loading System:**

| Level | Content | When Loaded | Budget |
|-------|---------|-------------|--------|
| 1 | name + description | Always | ~100 tokens |
| 2 | SKILL.md body | Skill triggers | <5000 tokens |
| 3 | references/, scripts/ | On-demand | Unlimited |

**Reference Loading Rules:**

| Indicator | Behavior | Example |
|-----------|----------|---------|
| `_filename.md` | Auto-load with skill | `_core-rules.md` |
| `filename.md` | Load when task matches | `api.md` → API work |
| Explicit instruction | Load when SKILL.md says | "See schemas.md for DB" |

**When to load a reference (Claude's decision):**
- Task explicitly mentions the reference topic
- SKILL.md instruction points to it
- Current step requires domain-specific knowledge

**When NOT to load:**
- General task that doesn't need specifics
- Information already in SKILL.md body
- Reference would duplicate context

**Pattern: Domain-specific organization**
```
skill/
├── SKILL.md (workflow + navigation)
└── references/
    ├── aws.md (AWS-specific)
    ├── gcp.md (GCP-specific)
    └── azure.md (Azure-specific)
```

Load only the relevant reference based on user's context.

## Error Handling

Include recovery paths:

```markdown
### Step 3: Build

Run `npm run build`

**If build fails:**
1. Check error message
2. Fix the issue
3. Return to Step 3

**If build succeeds:** Continue to Step 4
```

## Isolation Considerations

Do not use `context: fork` — a forked skill cannot reach the user, so any step that asks a
question or waits for approval stalls silently. Workflow skills run in the main context.

When a workflow genuinely needs isolated work (a wide investigation, a parallel review), spawn
subagents with the Task tool from inside the skill. Give each one a self-contained brief, since
it cannot see the conversation, and have it report back to you rather than to the user.

## Autonomous Refinement Loop (Advanced)

For skills that need self-correction capability:

```
Execute → Verify → [Pass?] → Done
                ↓ No
           Diagnose → Refine → Re-verify (loop)
```

**When to use:**
- Output has automatable verification criteria
- Failures can be diagnosed and fixed by agent
- Multiple iterations may be needed

**Key components:**
1. Verification step with clear pass/fail criteria
2. Diagnosis logic to categorize failures
3. Refinement strategy based on diagnosis
4. Session learning file for recording iterations

**See:** `references/autonomous-refinement-loop.md` for full pattern details.

**Template:** `references/arl-skill-template.md` for quick start.
