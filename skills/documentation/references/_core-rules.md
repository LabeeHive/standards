# Core Documentation Rules

Essential rules that apply to all documentation. Auto-loaded with every skill invocation.

---

## Document Structure

**Every document must have:**
1. Single H1 title (sentence case)
2. Purpose section immediately after title
3. Horizontal rules (`---`) between major sections
4. References section at the end (if applicable)

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

---

## Writing Style

### Voice and Tone
- Conversational but professional
- Direct and to the point
- Active voice, not passive

### Person
- Use "you" (second person) to address readers
- Avoid "I" or "we" except in collaborative contexts

### Grammar
- Sentence case for headings
- No period at end of headings
- Oxford comma in lists

---

## Formatting

### Headings
- H1: Document title only (one per document)
- H2: Major sections
- H3: Subsections within H2
- H4: Only when necessary, prefer flat structure

### Code Blocks
- Always specify language: ` ```swift`, ` ```bash`
- Keep examples minimal and focused
- Include comments only when logic is non-obvious

### Lists
- Bullet lists for unordered items
- Numbered lists only for sequences/steps
- Max 3 levels of nesting

---

## Anti-Patterns

❌ **Don't:**
- Use multiple H1 headings
- Skip heading levels (H2 → H4)
- Write walls of text without structure
- Use passive voice ("was implemented by")
- Use Title Case For Every Heading
- Add unnecessary emoji or decoration

✅ **Do:**
- Start with Purpose section
- Break content into scannable chunks
- Use code examples over lengthy explanations
- Keep paragraphs short (3-5 sentences max)
- Use tables for comparing options
