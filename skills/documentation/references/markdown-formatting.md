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

**Every markdownlint rule is on by default.** The config below does not opt rules in — it only
pins the ones that take an option to Labee's choice. Rules that are not listed, such as MD032
(blank lines around lists) or MD047 (file ends with a newline), are still enforced. Treat the
linter's whole default rule set as its territory, not just what appears here.

If the linter cannot be run, say so in the review rather than checking its rules by eye. An
unverified mechanical pass is worth stating; a hand-audited one is not worth the attention.

```jsonc
// .markdownlint-cli2.jsonc
{
  "config": {
    "MD003": { "style": "atx" },        // # headings, never === / ---
    "MD004": { "style": "dash" },       // - for unordered lists, not * or +
    "MD007": { "indent": 2 },           // 2-space nesting
    "MD013": { "line_length": 120 },    // hard limit; aim for 80-100
    "MD035": { "style": "---" },        // horizontal rules
    "MD048": { "style": "backtick" },   // code fences
    "MD049": { "style": "asterisk" },   // *italic*, not _italic_
    "MD050": { "style": "asterisk" },   // **bold**, not __bold__
    "MD025": true,                       // one H1 per document
    "MD001": true,                       // no skipped heading levels
    "MD040": true,                       // code blocks declare a language
    "MD045": true                        // images have alt text
  }
}
```

Heading depth is a judgement the linter cannot make: stop at H3. Reaching for H4 usually means
the document wants splitting, not another level.

---

## Not enforced by anything

These are the rules worth a reviewer's attention, because nothing else will catch them.

### Sentence case in headings

Capitalize the first word and proper nouns only. This is the rule most often broken, and no
linter checks it — MD044 only verifies the spelling of names you configure.

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

The text alone should tell a reader what they will get. "Click here" fails that test even when
the surrounding sentence explains it, because readers scan links out of context.

```markdown
✅ See the [PostgreSQL documentation](https://www.postgresql.org/docs/) for details.
❌ Click [here](https://www.postgresql.org/docs/) for details.
```

### Internal links are relative paths with the extension

Use `../core/naming_conventions.md`, not `/docs/core/naming-conventions` and not a full URL to
the published site. Both alternatives break when the docs move or are read offline.

File names are **snake_case**.

### Serial comma

"controllers, services, and repositories" — not "controllers, services and repositories".

### Images

Alt text describes what the image shows, not that it is an image. Store under `images/` or
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
