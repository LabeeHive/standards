# Writing principles

## Purpose

Language and word-choice standards for Labee documentation.

Structure, headings, active voice, second person, the serial comma, paragraph length, link text
and alt text live in `_core-rules.md` — they apply to every document and are not repeated here.
This file covers the choices that come up while writing sentences.

---

## Grammar

### Present tense

**Rules:**
- Use present tense for describing behavior
- Use imperative mood for instructions
- Use future tense sparingly

**✅ Good:**

```markdown
The `initialize()` method sets up the database connection.

Create a new configuration file in the config directory.

The system logs errors when validation fails.
```

---

## Language and clarity
### English language

**Rules:**
- Write all documentation in English
- Use American English spelling (e.g., "color" not "colour")
- Exception: Proper nouns and brand names

**Examples:**
- `color`, `center`, `optimize` (American English)
- Kubernetes, PostgreSQL, macOS (proper nouns)

---

### Clear and concise

**Rules:**
- Avoid unnecessary words
- Break long sentences into shorter ones
- One main idea per sentence

**✅ Good:**

```markdown
Cache database connections at startup. This avoids repeated connection overhead and improves performance.
```

**❌ Bad:**

```markdown
It is generally considered a best practice to cache database connections at startup, as doing so will help to avoid making repeated connections, which can negatively impact performance.
```

---

### Avoid jargon

**Rules:**
- Define technical terms on first use
- Link to glossary or detailed explanations
- Use common terminology when possible

**✅ Good:**

```markdown
Use message queues (asynchronous communication channels between services) to decouple systems.
```

**❌ Bad:**

```markdown
Leverage the pub-sub paradigm via event buses for orthogonal system decoupling.
```

---

## Accessibility

### Color and contrast
**Rules:**
- Don't rely on color alone to convey meaning
- Use symbols or text in addition to color
- Ensure sufficient contrast for readability

**✅ Good:**

```markdown
✅ **Good:** Use dependency injection for loose coupling.

❌ **Bad:** Use global variables for shared state.
```

**❌ Bad:**

```markdown
<span style="color: green">Good:</span> Use dependency injection.

<span style="color: red">Bad:</span> Use global variables.
```

---

## Inclusive language
### Avoid ableist terms

**Rules:**
- Avoid terms that reference disabilities in a negative way
- Use neutral alternatives

**Examples:**

| ❌ Avoid          | ✅ Use instead       |
|-------------------|----------------------|
| sanity check      | validation check     |
| crazy, insane     | unexpected, complex  |
| blind to          | unaware of           |
| crippled          | limited, restricted  |
| dummy             | placeholder, mock    |

---

### Inclusive technical terms

**Rules:**
- Use inclusive alternatives for loaded terms
- Industry is moving toward these standards

**Examples:**

| ❌ Avoid            | ✅ Use instead         |
|---------------------|------------------------|
| whitelist/blacklist | allowlist/blocklist    |
| master/slave        | primary/replica        |
| master branch       | main branch            |
| grandfathered       | legacy, existing       |

---

### Gender-neutral language

**Rules:**
- Use "they/their" for singular indefinite pronouns
- Avoid gendered assumptions

**✅ Good:**

```markdown
When a developer creates a new component, they should follow the naming conventions.

The user can customize their settings in the preferences panel.
```

**❌ Bad:**

```markdown
When a developer creates a new component, he should follow the naming conventions.

The user can customize his settings in the preferences panel.
```

---

## Word choice
### Be specific

**Rules:**
- Use precise technical terms
- Avoid vague words like "thing", "stuff", "very"

**✅ Good:**

```markdown
Cache the `DatabaseConnection` instance at startup to avoid repeated connection overhead.
```

**❌ Bad:**

```markdown
Save the thing at startup to avoid calling the method a lot.
```

---

### Use positive language

**Rules:**
- Focus on what to do, not just what to avoid
- Provide alternatives when showing anti-patterns

**✅ Good:**

```markdown
Use dependency injection to manage dependencies. Avoid global state for shared resources.
```

**❌ Bad:**

```markdown
Don't use global state. It's bad.
```

---

### Consistent terminology

**Rules:**
- Use the same term for the same concept throughout documentation
- Follow official terminology for third-party tools and frameworks

**Examples:**
- Kubernetes (not "k8s" in formal docs)
- PostgreSQL (not "Postgres" or "postgres")
- macOS (not "MacOS" or "OSX")

---

## Numbers and units
### Numbers in text

**Rules:**
- Spell out numbers one through nine
- Use numerals for 10 and above
- Use numerals for technical values (e.g., versions, measurements)

**Examples:**

```markdown
The API supports three authentication methods.

The cache holds 50 entries.

Version 2.1.0 includes five new features.
```

---

### Units of measurement

**Rules:**
- Include units with numerical values
- Use standard abbreviations (MB, KB, ms, s)
- Add space between number and unit

**Examples:**

```markdown
The file size limit is 10 MB.

The request timeout is 30 s.

Average response time is 50 ms.
```

---

## References

- [Google developer documentation style guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/)
- [Inclusive language guidelines](https://www.apa.org/about/apa/equity-diversity-inclusion/language-guidelines)
- [Write the Docs - Style guides](https://www.writethedocs.org/guide/writing/style-guides/)
- [WCAG 2.1 guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
