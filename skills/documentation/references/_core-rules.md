# Core documentation rules

## Purpose

The rules that apply to every Labee document, and the only reference read on every invocation.
Most of it is what a linter cannot judge; the skeleton below is the exception, stated because a
reader needs the shape even though `markdownlint-cli2` also enforces parts of it. Run the linter
rather than checking mechanical rules by eye — the config is `.markdownlint-cli2.jsonc`.

---

## Document skeleton

Every document has, in order:

1. A single H1 title
2. A `## Purpose` section immediately after it
3. `---` between major sections
4. A `## References` section at the end, where there is anything to link

```markdown
# Document title

## Purpose

Brief explanation of what this document covers.

---

## Section 1

Content...

---

## References

- [Related doc](path/to/doc.md)
```

Stop at H3. Wanting an H4 usually means the document should be split, not nested deeper.

---

## Writing

**Voice** — active. "The engine retries the request", not "the request is retried by the engine".

**Person** — address the reader as "you". Avoid "I" and "we", and avoid third-party attribution
that reads the same way: "the platform team decided" tells a reader no more than "we decided"
does. Say what the system does, or what the reader should do.

**Headings** — sentence case. See `markdown-formatting.md` for why this one needs a deliberate
pass rather than a linter.

**Lists** — Oxford comma within sentences: "controllers, services, and repositories". Numbered
lists only for real sequences; numbering unordered things implies an order that is not there.

**Paragraphs** — 3-5 sentences, one idea per sentence. A paragraph you have to re-read to find
where a thought ended is too long, whatever its line count.

---

## Anti-patterns

- Emoji or decoration carrying no information — the ✅/❌ pair in examples is the one exception,
  and it is a convention, not decoration
- A paragraph explaining what a three-line code example would show

---

## References

- [markdown-formatting.md](markdown-formatting.md) — which rules the linter owns, and the conventions it cannot check
- [writing-principles.md](writing-principles.md) — word choice, inclusive language, numbers and units
- [document-structure.md](document-structure.md) — organizing sections, YAML frontmatter
