# Markdown formatting

## Purpose

This document defines Markdown syntax and formatting standards for all technical documentation. Consistent Markdown usage ensures readability, maintainability, and proper rendering across different platforms.

---

## Headings - P1

### ATX-style headings

**Rules:**
- Use ATX-style (`#`) headings, not Setext-style (`===` or `---`)
- Add one space after `#` symbols
- Limit heading depth to H3 (`###`) when possible

**✅ Good:**

```markdown
# Top-level heading

## Second-level heading

### Third-level heading
```

**❌ Bad:**

```markdown
Top-Level Heading
=================

Second-Level Heading
--------------------

####Fourth-Level Heading (no space)
```

---

### Sentence case

**Rules:**
- Use sentence case for headings (capitalize only the first word and proper nouns)
- Exception: Technical terms that require specific capitalization (e.g., "PostgreSQL", "OAuth")

**✅ Good:**

```markdown
## Error handling patterns
## PostgreSQL configuration
## Using the API gateway
```

**❌ Bad:**

```markdown
## Error Handling Patterns
## POSTGRESQL CONFIGURATION
## Using The API Gateway
```

---

### Heading hierarchy

**Rules:**
- Don't skip heading levels (e.g., H1 → H3)
- Use H1 (`#`) only once per document (for title)
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections

**✅ Good:**

```markdown
# Document title

## Main section

### Subsection

### Another subsection

## Another main section
```

**❌ Bad:**

```markdown
# Document title

### Subsection (skipped H2)

## Main section (after H3)
```

---

## Code formatting - P1

### Code blocks

**Rules:**
- Use triple backticks (```) for code blocks
- Always specify language identifier in lowercase
- Add blank lines before and after code blocks

**Common language identifiers:**
- `python` - Python
- `javascript` / `typescript` - JavaScript / TypeScript
- `go` - Go
- `rust` - Rust
- `java` - Java
- `csharp` - C#
- `bash` / `shell` - Shell commands
- `json` - JSON
- `yaml` - YAML
- `sql` - SQL
- `markdown` - Markdown

**✅ Good:**

````markdown
Use connection pooling for database connections:

```python
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://user:pass@localhost/db",
    pool_size=5
)
```
````

**❌ Bad:**

````markdown
Use connection pooling:
```
engine = create_engine("postgresql://user:pass@localhost/db")
```
````

---

### Inline code

**Rules:**
- Use single backticks for inline code, class names, methods, and variables
- Use for technical terms and identifiers
- Do not use for emphasis

**✅ Good:**

```markdown
The `UserService` class uses the `authenticate()` method to verify credentials. Set the `timeout` parameter to control request duration.
```

**❌ Bad:**

```markdown
The UserService class uses the authenticate() method. Use `important` for emphasis.
```

---

## Lists - P1

### Unordered lists

**Rules:**
- Use `-` (hyphen) for unordered lists, not `*` or `+`
- Add one space after the hyphen
- Use consistent indentation (2 spaces for nested lists)

**✅ Good:**

```markdown
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item
```

**❌ Bad:**

```markdown
* First item
+ Second item
    * Nested (inconsistent indentation)
```

---

### Ordered lists

**Rules:**
- Use `1.`, `2.`, `3.` for ordered lists
- Or use `1.` for all items (Markdown auto-numbers)
- Add one space after the period

**✅ Good:**

```markdown
1. First step
2. Second step
3. Third step
```

or

```markdown
1. First step
1. Second step
1. Third step
```

---

### Serial comma

**Rules:**
- Use serial comma (Oxford comma) in lists within sentences
- Example: "A, B, and C" not "A, B and C"

**✅ Good:**

```markdown
This architecture uses controllers, services, and repositories.
```

**❌ Bad:**

```markdown
This architecture uses controllers, services and repositories.
```

---

### Task lists

**Rules:**
- Use GitHub-style task lists for checklists
- Format: `- [ ]` for unchecked, `- [x]` for checked
- One space after brackets

**Example:**

```markdown
- [ ] Implement authentication
- [x] Create database schema
- [ ] Add API endpoints
```

---

## Links - P1

### Descriptive link text

**Rules:**
- Use descriptive text that explains the link destination
- Avoid generic phrases like "click here", "this link", "read more"

**✅ Good:**

```markdown
See the [PostgreSQL documentation](https://www.postgresql.org/docs/) for details.

Read more about [RESTful API design patterns](api_design.md).
```

**❌ Bad:**

```markdown
Click [here](https://www.postgresql.org/docs/) for details.

Read more [here](api-design.md).
```

---

### Internal links

**Rules:**
- Use relative paths for internal documentation links
- Include `.md` extension
- Use snake_case for file names

**✅ Good:**

```markdown
- [Naming conventions](../core/naming_conventions.md)
- [Error handling](../core/error_handling.md)
```

**❌ Bad:**

```markdown
- [Naming Conventions](/docs/core/naming-conventions)
- [Error Handling](https://myproject.com/docs/error-handling)
```

---

### External links

**Rules:**
- Use full URLs for external links

**✅ Good:**

```markdown
- [Python documentation](https://docs.python.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
```

---

## Emphasis - P2

### Bold

**Rules:**
- Use `**text**` for bold (not `__text__`)
- Use sparingly for critical emphasis only
- Do not overuse bold for every technical term

**✅ Good:**

```markdown
**Warning:** This operation is irreversible.

The `main()` function is the entry point.
```

**❌ Bad:**

```markdown
Use **camelCase** for **variables** and **PascalCase** for **classes**.
```

---

### Italic

**Rules:**
- Use `*text*` for italic (not `_text_`)
- Use for introducing new terms or subtle emphasis

**✅ Good:**

```markdown
The *singleton pattern* should be used sparingly.
```

---

### Strikethrough

**Rules:**
- Use `~~text~~` for strikethrough
- Use to show deprecated or outdated information

**Example:**

```markdown
~~Use global variables~~ → Use dependency injection instead.
```

---

## Images and diagrams - P2

### Image syntax

**Rules:**
- Use `![alt text](path/to/image.png)` format
- Always provide descriptive alt text
- Use relative paths for images
- Store images in `images/` or `assets/` directory

**✅ Good:**

```markdown
![Diagram showing request flow through API gateway](images/request_flow.png)
```

**❌ Bad:**

```markdown
![](image.png)
```

---

### Image guidelines

**P2 rules:**
- Optimize image file size (< 1 MB recommended)
- Use PNG for diagrams and screenshots
- Use JPEG for photos
- Use SVG for vector graphics when possible

**P3 rules:**
- Add captions below images using italic text
- Specify image dimensions when layout matters

**Example:**

```markdown
![Architecture diagram](images/architecture.png)

*Figure 1: System architecture overview*
```

---

## Tables - P2

### Basic table format

**Rules:**
- Use pipe (`|`) for columns
- Use hyphens (`-`) for header separator
- Align columns for readability (optional but recommended)

**✅ Good:**

```markdown
| Component     | Responsibility        | Dependencies     |
|---------------|-----------------------|------------------|
| AuthService   | User authentication   | UserRepository   |
| UserService   | User management       | AuthService      |
| APIGateway    | Request routing       | All services     |
```

---

### Table alignment

**Rules:**
- Use `:` for column alignment
- `:---` (left), `:---:` (center), `---:` (right)

**Example:**

```markdown
| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Text         | Text           | 123           |
| Text         | Text           | 456           |
```

---

## Horizontal rules - P1

**Rules:**
- Use `---` for horizontal rules (three hyphens)
- Add blank lines before and after
- Use to separate major sections

**✅ Good:**

```markdown
## Section 1

Content for section 1.

---

## Section 2

Content for section 2.
```

**❌ Bad:**

```markdown
## Section 1
Content.
***
## Section 2
```

---

## Blockquotes - P2

**Rules:**
- Use `>` for blockquotes
- Add one space after `>`
- Use for quotes, notes, or callouts

**Example:**

```markdown
> **Note:** Configuration changes require a service restart.
```

---

## Escaping characters - P3

**Rules:**
- Use backslash (`\`) to escape Markdown syntax
- Common escapes: `\*`, `\_`, `\#`, `\[`, `\]`

**Example:**

```markdown
Use \*asterisks\* to create italic text.
```

---

## Line length - P3

**Rules:**
- Soft limit: 80-100 characters per line
- Hard limit: 120 characters per line
- Break long sentences at natural points

**Benefits:**
- Easier to review in diff tools
- Better readability in side-by-side views
- Cleaner Git diffs

---

## Markdown linters - P3

**Recommended tools:**
- `markdownlint` - Linting and style checking
- `prettier` - Auto-formatting
- `remark` - Markdown processor

**Common rules:**
- MD001: Heading levels should only increment by one
- MD003: Heading style (ATX)
- MD004: Unordered list style (dash)
- MD022: Headings should be surrounded by blank lines
- MD031: Fenced code blocks should be surrounded by blank lines

---

## References

- [CommonMark specification](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Markdown guide](https://www.markdownguide.org/)
- [Google Markdown style guide](https://google.github.io/styleguide/docguide/style.html)
- [GitLab Markdown guide](https://docs.gitlab.com/ee/user/markdown.html)
