# Core Documentation Rules

The rules that apply to every Labee document. Read this on every invocation of the skill.

Anything mechanically checkable is left to `markdownlint-cli2` — heading levels, one H1, code
block languages, list markers, emphasis style, line length. Run it rather than reviewing those
by eye; the config is in `markdown-formatting.md`. What follows is what the linter cannot judge.

---

## Document Structure

**Every document must have:**

1. Single H1 title, in sentence case
2. Purpose section immediately after the title
3. Horizontal rules (`---`) between major sections
4. References section at the end, if applicable

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

## Writing Style

**Voice** — conversational but professional, direct, active. "The engine retries the request",
not "the request is retried by the engine".

**Person** — address the reader as "you". Avoid "I" and "we" outside genuinely collaborative
context; "our team designed" tells the reader nothing they can act on.

**Headings** — sentence case, no trailing period. Sentence case is the rule most often broken
and no linter checks it, so it is worth a deliberate pass.

**Lists** — Oxford comma within sentences. Numbered lists only for real sequences; a numbered
list of unordered things implies an order that is not there.

**Paragraphs** — 3-5 sentences. One idea per sentence. A paragraph that has to be re-read to
find where a thought ended is too long regardless of its line count.

---

## Anti-Patterns

❌ **Don't:**

- Write walls of text with no structure
- Use passive voice to avoid naming who acts
- Use Title Case For Every Heading
- Add emoji or decoration that carries no information
- Explain at length what a short code example would show

✅ **Do:**

- Start with Purpose
- Break content into scannable chunks
- Prefer a code example to a paragraph about the code
- Use tables when comparing options
