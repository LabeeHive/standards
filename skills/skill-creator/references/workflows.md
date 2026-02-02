# Workflow Patterns

Patterns for designing effective skill workflows.

## Degrees of Freedom

Match specificity to task fragility:

| Freedom | Use When | Format |
|---------|----------|--------|
| High | Multiple valid approaches, context-dependent | Text instructions |
| Medium | Preferred pattern exists, some variation OK | Pseudocode with parameters |
| Low | Fragile operations, consistency critical | Specific scripts, few parameters |

**Example - High freedom:**
```markdown
Analyze the code and suggest improvements based on the project's style.
```

**Example - Low freedom:**
```markdown
Run exactly:
1. `git fetch origin`
2. `git rebase origin/main`
3. `git push --force-with-lease`
```

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

Keep SKILL.md lean, load details as needed:

```markdown
## Reference Files

| File | Use When |
|------|----------|
| references/api.md | Working with external APIs |
| references/schemas.md | Database operations |
```

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

## context: fork Considerations

For workflow skills using `context: fork`:
- Agent runs in isolated context
- Cannot see main conversation history
- Must be self-contained with clear instructions
- Report results back explicitly
