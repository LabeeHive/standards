# Document structure

## Purpose

How to organize the inside of a document. The outer skeleton — H1, Purpose, `---` separators, References, sentence case, stopping at H3 — is in `_core-rules.md` and is not repeated here.

---

## Content sections

Name sections for what a reader is looking for, not for what the writer was thinking about. "Error handling" beats "Considerations around failures".

Group related subsections under one H2 rather than promoting each to its own section. A document with eleven H2s and no H3s has usually skipped a layer of grouping.

```markdown
---

## Authentication

### API keys

Use API keys for server-to-server communication...

### OAuth 2.0

Use OAuth 2.0 for user-facing applications...

---

## Error handling

### Error response format

All errors should return a consistent JSON structure...
```

---

## YAML frontmatter

Only when tooling requires it — a static site generator, a docs platform. Git history is the source of truth for authorship and dates, so frontmatter carries only what the tooling needs.

```markdown
---
title: API authentication guide
status: active
---

# API authentication guide

## Purpose

...
```

**Common fields:**

- `title`: document title
- `status`: active, draft, deprecated, archived

---

## References

- [Google developer documentation style guide](https://developers.google.com/style)
- [GitLab documentation structure](https://docs.gitlab.com/ee/development/documentation/structure.html)
