---
name: documentation
description: Write and review documentation following Labee standards. Use this when creating or reviewing markdown files.
when_to_use: Triggers on "ドキュメント", "README", "markdown", "docs", "文書作成", "ドキュメントレビュー".
allowed-tools: Read Glob Grep Edit Write Bash(cat:*)
---

# Documentation

Labee's documentation standards. The core rules apply to everything and are injected below. The rest load on demand.

## Core Rules (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_core-rules.md" 2>/dev/null || echo "(reference missing: _core-rules.md)"
```

## Workflow

**Writing** — pick the document type from `references/content-types.md` and use its template, which lives in the same file. `references/document-structure.md` covers how sections group inside the document and YAML frontmatter. Draft against the core rules. This skill covers how a document is written; where it goes under `docs/` — the numbered namespaces, the placement rules, and the ADR conventions — belongs to `/project-conventions`.

**Reviewing** — the core rules are the floor, not the whole standard. On top of them, pull in whichever references the document actually exercises: `references/writing-principles.md` for word choice, jargon, inclusive language, numbers and units, `references/markdown-formatting.md` for markdown conventions and what the linter does not cover, `references/code-examples.md` where the document contains code. Report each issue as line number, what is wrong, and the suggested fix. Point at specific lines rather than summarizing.

**A formatting question on its own** — go straight to `references/markdown-formatting.md`.

## Reference Files

| File | Load When |
|------|-----------|
| references/_core-rules.md | Injected on every invocation (above) — essential rules for all documentation |
| references/writing-principles.md | Word choice, jargon, inclusive language, numbers and units |
| references/document-structure.md | Grouping sections inside a document, YAML frontmatter |
| references/markdown-formatting.md | Which rules the linter owns, and the conventions it cannot check |
| references/file-organization.md | Organizing files and folders |
| references/content-types.md | Choosing a document type, and its template |
| references/code-examples.md | Including code in docs |
| references/ai-documentation.md | Writing AI context files (CLAUDE.md, AGENTS.md) |
| references/culture-principles.md | Company values and culture content |

## Related Skills

| Skill | Purpose |
|-------|---------|
| /humanizer | Remove AI writing patterns from documentation |
| /project-conventions | Where a document goes — the `docs/` layout, namespaces, and the ADR rules |
