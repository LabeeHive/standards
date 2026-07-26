# Markdown formatting

## Purpose

Labee's Markdown conventions. Markdown syntax itself is not documented here — what follows is
only the choices a writer could reasonably get wrong, split by whether a linter can catch them.

---

## Enforced by markdownlint

Install `markdownlint-cli2` (available in nixpkgs) and run it rather than reviewing these by eye:

```bash
markdownlint-cli2 "**/*.md"
```

The config lives at [`.markdownlint-cli2.jsonc`](../../../.markdownlint-cli2.jsonc) in the repo
root. It is not reproduced here — a second copy drifts from the one that actually runs, and the
running one wins.

**Every markdownlint rule is on unless the config turns it off.** Rules the config never mentions
— MD032 blank lines around lists, MD047 final newline, MD045 alt text, MD059 descriptive link
text — are all enforced. Treat the whole default rule set as the linter's territory.

Seven rules are switched off, and it is worth knowing which before you flag something the
standard has deliberately dropped:

| Rule | Off because |
|------|-------------|
| MD013 line length | Wrapping changes nothing about how a document renders, and hard-wrapping makes a one-word edit re-flow every line after it, so the diff overstates the change |
| MD040 code fence language | Label a fence holding real code — highlighting earns its keep. A directory tree gains nothing from a `text` tag, and forcing it turns a rule into a ritual |
| MD036 emphasis as heading | Bold lead-ins like `**Rules:**` are house style, not headings in disguise |
| MD060 table column style | Enforcing one pipe style across the repo was several hundred edits for no reader |
| MD046 code block style | Indented blocks are how this repo shows markdown inside markdown |
| MD028 blank line in blockquote | A blank line between two quotes is a paragraph break |
| MD041 first line is a heading | Agent and skill files open with frontmatter |

If the linter cannot be run, say so in the review rather than checking its rules by eye. An
unverified mechanical pass is worth stating; a hand-audited one is not worth the attention.

---

## What the linter cannot judge

The linter checks that something is present. Whether it is any good is the reviewer's call, and
that gap is where these rules live.

### Sentence case in headings

The rule is stated in `_core-rules.md`; this is why it needs a deliberate pass. No linter checks
heading case — MD044 only verifies the spelling of proper nouns you configure by name — so it is
the rule most often broken, and the one most likely to survive a review.

```markdown
✅ ## Error handling patterns
✅ ## PostgreSQL configuration
❌ ## Error Handling Patterns
❌ ## Using The API Gateway
```

### Emphasis is a budget

Bold marks the one thing a reader must not miss. Bolding every technical term spends the budget
and leaves nothing marked.

```markdown
✅ **Warning:** This operation is irreversible.
❌ Use **camelCase** for **variables** and **PascalCase** for **classes**.
```

Italic introduces a term on first use. Inline code is for identifiers — `UserService`,
`authenticate()`, `timeout` — and never for emphasis.

### Link text says where it goes

MD059 rejects the worst offenders — "click here", "read more" — so the linter has the floor
covered. What it cannot tell is whether text that passes actually describes the destination. The
text alone should tell a reader what they will get, because readers scan links out of context.

```markdown
✅ See the [PostgreSQL documentation](https://www.postgresql.org/docs/) for details.
❌ Click [here](https://www.postgresql.org/docs/) for details.
```

### Internal links are relative paths with the extension

Use `../core/naming-conventions.md`, not `/docs/core/naming-conventions` and not a full URL to
the published site. Both alternatives break when the docs move or are read offline.

File names are **kebab-case** — see `file-organization.md` for the full convention.

### Images

MD045 catches a missing alt attribute. It cannot read the one you wrote: alt text describes what
the image shows, not that it is an image. Store under `images/` or
`assets/`, keep files under 1 MB, and pick the format by content: PNG for diagrams and
screenshots, JPEG for photos, SVG for vector art. Captions go below the image in italics.

```markdown
![Diagram showing request flow through API gateway](images/request_flow.png)

*Figure 1: System architecture overview*
```

---

## References

- [CommonMark specification](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [markdownlint rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [Google Markdown style guide](https://google.github.io/styleguide/docguide/style.html)
