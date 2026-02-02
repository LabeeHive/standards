# Standards - AI Context

Shared standards repository for Labee LLC projects. This repository is used as a Git submodule in other projects to maintain consistency.

---

## Skills

This repository provides skills for Claude Code. Use `/skill-name` to invoke.

| Skill | Description |
|-------|-------------|
| `/documentation` | Write documentation following Labee standards |
| `/swift-development` | Write Swift/SwiftUI code following standards |
| `/github-workflow` | Create GitHub Issues and PRs |
| `/repository-setup` | Set up new repositories |
| `/docusaurus-setup` | Configure Docusaurus sites |
| `/automation-config` | Configure automation tools (Renovate) |
| `/vigilare-task` | Create Vigilare tasks with proper structure |

---

## Structure

```text
skills/
├── documentation/       # Documentation writing standards
├── swift-development/   # Swift and SwiftUI coding standards
├── github-workflow/     # GitHub Issues and PR standards
├── repository-setup/    # Repository setup standards
├── docusaurus-setup/    # Docusaurus configuration standards
├── automation-config/   # Automation (Renovate) standards
└── vigilare-task/       # Vigilare task creation standards
```

---

## Culture

We value: **もっと自由に、もっと楽しく** (More freedom, more fun)

### Principles

1. **Freedom with responsibility** - Act freely. Own the results.
2. **Be open** - Share openly. Explain your reasoning.
3. **Involve others** - Work together. Bring others in.

For AI agents:
- When uncertain, ask before proceeding
- Always explain your reasoning
- One question is cheaper than one wrong assumption

---

## Rules

### Use skills

Invoke the appropriate skill for the task at hand.

### Follow existing patterns

Match the style and structure of existing documents in this repository.

### Keep it simple

Document only what is necessary. Avoid duplication and over-explanation.

### Priority labels

Use P1/P2/P3 priority labels in section headings. See `README.md` for definitions.

---

## Language

- Respond in user's language
- Think in English
- Write documentation in English
