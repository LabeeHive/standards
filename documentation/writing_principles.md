# Writing principles

## Purpose

This document defines voice, tone, grammar, and style guidelines for technical documentation. Following these principles ensures documentation is clear, accessible, and professional across all projects.

---

## Voice and tone - P1

### Conversational and clear

**Rules:**
- Write in a conversational but professional tone
- Avoid overly formal or academic language
- Be direct and to the point
- Use contractions sparingly in technical writing

**✅ Good:**

```markdown
Use dependency injection to decouple services. This approach makes testing easier and reduces dependencies between components.
```

**❌ Bad:**

```markdown
It is recommended that one should utilize dependency injection for the purpose of decoupling services. This approach facilitates the testing process and minimizes inter-component dependencies.
```

---

### Respectful and professional

**Rules:**
- Be respectful of all readers
- Avoid condescending language
- Don't assume reader's skill level
- Provide context when needed

**✅ Good:**

```markdown
If you're new to async/await, start with the [basic introduction](async_intro.md) before diving into advanced patterns.
```

**❌ Bad:**

```markdown
Obviously, everyone knows async/await. If you don't, you shouldn't be reading this.
```

---

## Grammar and style - P1

### Active voice

**Rules:**
- Use active voice instead of passive voice
- Subject performs the action
- Makes writing clearer and more direct

**✅ Good (Active):**

```markdown
The `AuthService` handles user authentication.

You can cache database connections at startup.

The middleware validates request tokens.
```

**❌ Bad (Passive):**

```markdown
User authentication is handled by the `AuthService`.

Database connections can be cached at startup.

Request tokens are validated by the middleware.
```

---

### Second person ("you")

**Rules:**
- Address the reader as "you" (second person)
- Avoid first person ("I", "we") in technical documentation
- Exception: Use "we" for collaborative context or team decisions

**✅ Good:**

```markdown
You should validate input parameters before processing.

Add the configuration to your project's settings file.

You can use environment variables to manage secrets.
```

**❌ Bad:**

```markdown
One should validate input parameters before processing.

The developer must add the configuration to the project.

We will use environment variables to manage secrets.
```

---

### Serial comma (Oxford comma)

**Rules:**
- Use serial comma before "and" or "or" in lists
- Format: "A, B, and C" not "A, B and C"
- Reduces ambiguity

**✅ Good:**

```markdown
This system uses controllers, services, and repositories.

You can implement authentication, authorization, and logging.
```

**❌ Bad:**

```markdown
This system uses controllers, services and repositories.

You can implement authentication, authorization and logging.
```

---

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

## Language and clarity - P1

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

## Accessibility - P2

### Heading hierarchy

**Rules:**
- Use proper heading hierarchy (H1 → H2 → H3)
- Don't skip levels (H1 → H3)
- Use headings to structure content logically

**Benefits:**
- Screen readers can navigate by headings
- Improves document scannability
- Helps search engines understand structure

---

### Alt text for images

**Rules:**
- Provide descriptive alt text for all images
- Describe what the image shows, not just its title
- Keep alt text concise (1-2 sentences)

**✅ Good:**

```markdown
![Diagram showing request flow from client through API gateway to microservices](images/request_flow.png)
```

**❌ Bad:**

```markdown
![Architecture](images/request_flow.png)
```

---

### Link text clarity

**Rules:**
- Use descriptive link text that explains the destination
- Avoid "click here" or "read more"
- Link text should make sense out of context

**✅ Good:**

```markdown
See the [PostgreSQL documentation](https://www.postgresql.org/docs/) for connection pooling options.
```

**❌ Bad:**

```markdown
Click [here](https://www.postgresql.org/docs/) for more information.
```

---

### Color and contrast - P3

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

## Inclusive language - P1

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

## Formatting for readability - P2

### Short paragraphs

**Rules:**
- Keep paragraphs short (3-5 sentences)
- Break up long blocks of text
- Use whitespace generously

**✅ Good:**

```markdown
Message queues provide a decoupled communication pattern. Publishers send messages without knowing who consumes them.

Consumers subscribe to queues and process messages asynchronously. This approach reduces dependencies and improves scalability.
```

**❌ Bad:**

```markdown
Message queues provide a decoupled communication pattern where publishers send messages without knowing who consumes them and consumers subscribe to queues and process messages asynchronously and this approach reduces dependencies between systems and improves scalability by allowing components to scale independently.
```

---

### Bullet points and lists

**Rules:**
- Use lists to present multiple items
- Each list item should be parallel in structure
- Introduce lists with a colon or complete sentence

**✅ Good:**

```markdown
Message queues offer several benefits:

- Reduce coupling between services
- Improve scalability
- Enable asynchronous processing
- Support multiple consumers
```

**❌ Bad:**

```markdown
Message queues are beneficial because they reduce coupling and you can scale them easily and multiple consumers can process messages.
```

---

### Code formatting

**Rules:**
- Use inline code formatting for technical terms
- Use code blocks for examples
- Always specify language in code blocks

See [Code examples](code_examples.md) for detailed guidelines.

---

## Word choice - P2

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

## Numbers and units - P3

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
