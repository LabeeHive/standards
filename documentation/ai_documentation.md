# AI documentation

## Purpose

This document defines standards for writing AI agent context files (AGENTS.md, CLAUDE.md, etc.). These files help AI coding assistants understand project context and follow project-specific rules.

---

## File structure - P1

### AGENTS.md as single source of truth

**Rules:**
- Use `AGENTS.md` as the primary context file
- Create symlinks for tool-specific files (CLAUDE.md, GEMINI.md, etc.)
- Place at the repository root

**Setup:**

```bash
# Create AGENTS.md as the main file
# Then create symlinks for tool-specific files
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```

**Rationale:**
- AGENTS.md is a vendor-neutral standard supported by Cursor, Zed, GitHub Copilot, JetBrains, and others
- Single source of truth avoids duplication and maintenance burden
- Symlinks ensure all AI tools read the same instructions

---

### Monorepo structure

**Rules:**
- Place root-level AGENTS.md for global rules
- Add subdirectory AGENTS.md for component-specific rules
- AI reads the closest file to the working context

**Example:**

```
project/
├── AGENTS.md           # Global rules
├── CLAUDE.md -> AGENTS.md
├── frontend/
│   └── AGENTS.md       # Frontend-specific rules
└── backend/
    └── AGENTS.md       # Backend-specific rules
```

---

## Content to include - P1

### Project overview

**Rules:**
- Provide 1-2 paragraphs describing what the project does
- Keep it minimal (enough for AI to understand context)
- Do not duplicate README content

**Example:**

```markdown
## Project overview

**ProjectName** is a macOS desktop application built with SwiftUI. It provides
a side-tab widget interface for launching mini applications.
```

---

### Terminology

**Rules:**
- Define project-specific terms when code and UI use different names
- Link to detailed terminology docs if available
- Use a table for clarity

**Example:**

```markdown
## Terminology

| Concept | Code | UI |
|---------|------|-----|
| Individual item | `Tab` | Bookmark |
| Container | `TabGroup` | Folder |

See `docs/terminology.md` for details.
```

---

### Documentation structure

**Rules:**
- Show the docs/ hierarchy
- Help AI navigate to relevant documentation
- Do not include the content itself

**Example:**

```markdown
## Documentation structure

```
docs/
├── 00_overview/        # Project overview
├── 01_architecture/    # System architecture
├── 03_development/     # Development guides
├── 04_designs/         # UI/UX designs
└── 05_standards/       # Shared coding standards (submodule)
```
```

---

### Development workflow

**Rules:**
- List documents AI must read before starting work
- Provide scenario-based references
- Use tables for quick lookup

**Example:**

```markdown
## Development workflow

### Before starting any work

Read these documents first:

1. `docs/00_overview/README.md`
2. `docs/01_architecture/architecture.md`
3. `docs/05_standards/`

### Common scenarios

| Task | Reference |
|------|-----------|
| Understanding architecture | `docs/01_architecture/` |
| Writing new code | `docs/05_standards/` |
| UI design reference | `docs/04_designs/ui_mockup.md` |
```

---

### Critical rules

**Rules:**
- Define AI-specific behavioral rules
- Keep rules actionable and clear
- Focus on what makes this project different

**Example:**

```markdown
## Critical rules

### 1. Read documentation first

Read relevant documentation before writing code. Follow existing design
patterns and architecture decisions.

### 2. Keep it simple

- Implement only what is explicitly requested
- Follow existing code patterns
- Avoid over-engineering
```

---

## Content NOT to include - P1

### What belongs elsewhere

| Content | Where it belongs |
|---------|-----------------|
| Architecture details | `docs/01_architecture/` |
| API specifications | `docs/01_architecture/` or dedicated API docs |
| Setup instructions | `README.md` |
| General programming knowledge | (AI already knows) |

**Rules:**
- Do not duplicate content that exists in docs/
- Reference existing documentation instead of copying
- AI does not need general programming advice

**❌ Bad:**

```markdown
## Architecture

Our system uses a microservices architecture with the following components:
[500 lines of architecture details...]
```

**✅ Good:**

```markdown
## Architecture

See `docs/01_architecture/architecture.md` for system design.
```

---

## AI behavior rules - P1

### Language rules

**Rules:**
- Respond in the user's language
- Think in English (internal reasoning)
- Use English for code, comments, and technical terms

**Example rule in AGENTS.md:**

```markdown
## Language

- Respond in the user's language (Japanese, English, etc.)
- Internal thinking and reasoning: always English
- Code and comments: English
```

---

### Common behavioral rules

**Recommended rules to include:**

```markdown
## Rules

### Documentation first
Read relevant documentation before writing any code.

### Follow existing patterns
Match the coding style and patterns already used in the codebase.

### Minimal changes
Implement only what is explicitly requested. Do not add unrequested features
or refactoring.

### Ask when uncertain
If requirements are unclear, ask for clarification before proceeding.
```

---

## Template - P2

### Basic template

```markdown
# ProjectName - AI Context

Brief description of the project (1-2 sentences).

---

## Terminology

| Concept | Code | UI |
|---------|------|-----|
| Term 1 | `CodeName` | Display Name |

---

## Documentation

```
docs/
├── 00_overview/
├── 01_architecture/
├── 03_development/
├── 04_designs/
└── 05_standards/
```

---

## Before starting work

1. `docs/00_overview/README.md`
2. `docs/01_architecture/architecture.md`
3. `docs/05_standards/`

---

## Rules

### Read docs first
Read relevant documentation before coding.

### Follow patterns
Match existing code style and architecture.

### Keep it simple
Implement only requested changes.

### Language
- Respond in user's language
- Think in English
- Code in English
```

---

## References

- [AGENTS.md standard](https://github.com/openai/agents.md)
- [Builder.io - Improve your AI code output](https://www.builder.io/blog/agents-md)
- [How to use AGENTS.md in Claude Code](https://aiengineerguide.com/blog/how-to-use-agents-md-in-claude-code/)
