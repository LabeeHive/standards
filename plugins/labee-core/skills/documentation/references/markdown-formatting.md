# Markdown formatting

## Purpose

The conventions a formatter cannot decide. Mechanical rules — spacing, list markers, line length, fence style, final newlines — belong to whatever linter or formatter the project configures; run it rather than checking those by eye, and treat its config as the authority over anything written here. A rule the tool already enforces is not repeated in this file, because the second copy drifts and the running one wins.

When the tool cannot be run, say so in the review. An unverified mechanical pass is worth stating; a hand-audited one is not worth the attention.

---

## Sentence case in headings

The rule is stated in `_core-rules.md`; this is why it needs a deliberate pass. Linters check the spelling of proper nouns, not the case of a heading, so this is the rule most often broken and the one most likely to survive a review.

```markdown
✅ ## Error handling patterns
✅ ## PostgreSQL configuration
❌ ## Error Handling Patterns
❌ ## Using The API Gateway
```

## Emphasis is a budget

Bold marks the one thing a reader must not miss. Bolding every technical term spends the budget and leaves nothing marked.

```markdown
✅ **Warning:** This operation is irreversible.
❌ Use **camelCase** for **variables** and **PascalCase** for **classes**.
```

Italic introduces a term on first use. Inline code is for identifiers — `UserService`, `authenticate()`, `timeout` — and never for emphasis.

## Link text says where it goes

A linter rejects the worst offenders — "click here", "read more". What it cannot tell is whether text that passes actually describes the destination. The text alone should tell a reader what they will get, because readers scan links out of context.

```markdown
✅ See the [PostgreSQL documentation](https://www.postgresql.org/docs/) for details.
❌ Click [here](https://www.postgresql.org/docs/) for details.
```

## Internal links are relative paths with the extension

Use `../core/naming-conventions.md`, not `/docs/core/naming-conventions` and not a full URL to the published site. Both alternatives break when the docs move or are read offline.

A link must also stay inside the directory that ships with the document. A file distributed as part of a plugin or package cannot reach anything above its own root, because only that root is copied — describe such a file in prose instead of linking to it.

File names are **kebab-case** — see `file-organization.md` for the full convention.

## Images

A linter catches a missing alt attribute. It cannot read the one you wrote: alt text describes what the image shows, not that it is an image. Store under `images/` or `assets/`, keep files under 1 MB, and pick the format by content: PNG for diagrams and screenshots, JPEG for photos, SVG for vector art. Captions go below the image in italics.

```markdown
![Diagram showing request flow through API gateway](images/request-flow.png)

*Figure 1: System architecture overview*
```
