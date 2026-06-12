# Resource Patterns

Guidelines for organizing skill resources: scripts/, references/, assets/.

## Directory Decision Matrix

| Directory | Purpose | Context Cost | Use When |
|-----------|---------|--------------|----------|
| scripts/ | Execute code | Output only | Deterministic, repeatable operations |
| references/ | Read into context | Full file | Documentation Claude needs to understand |
| assets/ | Use in output | On-demand | Templates, images, binary files |

**Delete unused directories.** Most skills need only 1-2 of these.

---

## scripts/

### When to Use

| Use scripts/ | Don't use scripts/ |
|--------------|-------------------|
| Deterministic operations | Claude needs to modify logic |
| Repeated execution expected | One-time exploratory task |
| Token efficiency matters | Simple operation (< 10 lines) |
| Complex multi-step automation | - |

### Language Selection

**Default: TypeScript with Bun**

Bun executes TypeScript natively without transpilation.

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/validate.ts input.json
```

| Language | Use When |
|----------|----------|
| TypeScript (bun) | Default choice |
| Python | Required library has no JS equivalent |
| Bash | Simple file/git operations |

### Bun Usage Guidelines

**✓ Recommended:**
```bash
bun ${CLAUDE_SKILL_DIR}/scripts/example.ts        # Direct TypeScript execution
bun ${CLAUDE_SKILL_DIR}/scripts/example.ts --flag # With arguments
```

**⚠ Use with caution:**
```bash
bunx tsc --noEmit             # Type checking (acceptable)
bunx prettier --write .       # Dev tools (acceptable)
```

**✗ Avoid in CI/production scripts:**
```bash
bunx some-cli-tool            # Exit code issues (GitHub #26674)
```

**Known bunx issues:**
- May silently swallow exit codes (CI failures go undetected)
- Requires network even for cached packages
- Use `bun` direct execution instead when possible

### Security: Dependency Policy

**Prefer self-contained scripts** using only:
- Language built-ins
- Bun standard APIs

**If external dependencies required:**
1. Include `package.json` with **exact versions**
2. Include `bun.lock` (lockfile)
3. Document why the dependency is needed
4. Prefer established packages (>1M weekly downloads)

**Never:**
- Dynamic package installation at runtime
- Unpinned dependency versions
- Packages from unknown sources

### Implementation Pattern

```typescript
#!/usr/bin/env bun
/**
 * Brief description of what this script does.
 *
 * Usage:
 *   bun <skill-dir>/scripts/example.ts <input> [--option value]
 *
 * Examples:
 *   bun <skill-dir>/scripts/example.ts data.json
 *   bun <skill-dir>/scripts/example.ts data.json --format pretty
 */

import { parseArgs } from "util";

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      format: { type: "string", default: "json" },
    },
    allowPositionals: true,
  });

  if (positionals.length < 1) {
    console.error("Usage: bun <skill-dir>/scripts/example.ts <input>");
    process.exit(1);
  }

  // Processing logic
  const result = process(positionals[0]);

  // Output to stdout (consumed by Claude)
  console.log(JSON.stringify(result, null, 2));
}

main();
```

**Requirements:**
- Shebang: `#!/usr/bin/env bun`
- Usage documentation at top
- Exit codes: 0 = success, 1 = failure
- Errors to stderr, results to stdout

### Referencing in SKILL.md

Always prefix script paths with `${CLAUDE_SKILL_DIR}` — Claude Code substitutes it with the skill's directory at invocation, so the command works regardless of the current working directory. A cwd-relative `bun scripts/...` breaks when the skill runs inside another project and invites improvised workarounds.

```markdown
Run the validation script:
`bun ${CLAUDE_SKILL_DIR}/scripts/validate.ts <input.json>`

If validation fails, fix the errors and retry.
```

Note: this works only in SKILL.md content (where substitution happens). Do not use it inside script source code or shell strings — write `<skill-dir>` as a plain placeholder there.

### Output Format

Choose format based on **who consumes the output**:

| Consumer | Format | Rationale |
|----------|--------|-----------|
| Claude (reads and acts) | Raw text | Claude reads human-readable output directly. No parsing needed, no bugs from format mismatches. |
| Another script | JSON | Structured data for programmatic consumption. |

**Default to raw text.** Only use JSON when another script must parse the output.

### Context Efficiency

Scripts execute **without loading code into context**. Only output consumes tokens.

| Approach | Tokens Used |
|----------|-------------|
| Inline code in SKILL.md | Code + output |
| Script execution | Output only |

---

## references/

### When to Use

| Use references/ | Don't use references/ |
|-----------------|----------------------|
| Detailed documentation | Executable logic |
| API specs, schemas | Simple instructions |
| Domain knowledge | Content < 50 lines (put in SKILL.md) |
| Optional context | Always-needed content |

### Naming Conventions

| Pattern | Behavior |
|---------|----------|
| `_filename.md` | Auto-load with skill |
| `filename.md` | Load on-demand |

**Auto-load (`_` prefix) guidelines:**
- Use sparingly
- Keep under 200 lines
- Only for rules that apply to ALL invocations

### Structure

```
references/
├── _core-rules.md    # Auto-load (small!)
├── api.md            # On-demand
└── schemas.md        # On-demand
```

---

## assets/

### When to Use

Files used **in output**, not for Claude's understanding:
- Templates (pptx, docx)
- Images, icons, fonts
- Boilerplate code/projects
- Configuration templates

### Structure

```
assets/
├── template.pptx
├── logo.png
└── boilerplate/
    └── ...
```

---

## Degrees of Freedom

Match resource type to operation risk (see workflows.md):

| Freedom | Resource Choice | Example |
|---------|-----------------|---------|
| Low (fragile) | scripts/ with exact commands | PDF form filling |
| Medium | scripts/ with parameters | Validation with options |
| High | references/ with guidelines | Code style suggestions |
