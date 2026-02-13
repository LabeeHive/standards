# Translate Patterns

Code patterns for wrapping Docusaurus pages with `<Translate>` / `translate()`.

## Import

```tsx
import Translate, { translate } from "@docusaurus/Translate";
```

## Basic Patterns

### JSX text
```tsx
<Translate id="page.section.element">English text</Translate>
```

### String props (title, placeholder, alt, aria-label, etc.)
```tsx
translate({ message: "English text", id: "page.section.element" })
```

### Alt text
```tsx
<img alt={translate({ message: "description", id: "page.section.img-alt" })} />
```

## Complex JSX

Split into segments when containing `<strong>`, `<br/>`, `<a>`, etc.

### Bold text
```tsx
<strong>
  <Translate id="xxx.label">Bold text:</Translate>
</strong>{" "}
<Translate id="xxx.desc">Regular text after bold.</Translate>
```

### Line breaks
```tsx
<Translate id="xxx.line1">First line</Translate>
<br />
<Translate id="xxx.line2">Second line</Translate>
```

### Links
```tsx
<Translate id="xxx.before-link">See our </Translate>
<a href="/docs"><Translate id="xxx.link-text">documentation</Translate></a>
<Translate id="xxx.after-link"> for details.</Translate>
```

### Whitespace between segments
Use `{" "}` for intentional spaces:
```tsx
<Translate id="xxx.label">Label</Translate>{" "}
<Translate id="xxx.value">value text</Translate>
```

## ID Naming Convention

Pattern: `{page}.{section}.{subsection}.{element}` — lowercase, dot-separated.

```
homepage.hero.title.line1
homepage.hero.subtitle
homepage.features.mcp.title
homepage.features.mcp.description
homepage.faq.mcp.q
homepage.faq.mcp.a
privacy.header.title
privacy.section1.heading
```

## code.json Structure

After `npx docusaurus write-translations --locale ja`:

```json
{
  "homepage.hero.title.line1": {
    "message": "English default text",
    "description": "homepage hero title line 1"
  }
}
```

Replace `"message"` values with translated text per locale.

## Docusaurus-Specific Pitfalls

### trailingSlash changes relative link resolution
When `trailingSlash: true`:
- `./privacy` resolves differently than expected
- Use `../privacy` or absolute paths `/privacy`
- Always test links after enabling trailingSlash

### Non-ASCII headings need explicit anchors
Docusaurus auto-generates anchors from heading text. Non-ASCII produces unreadable anchors:
```markdown
### 日本語見出し {#english-anchor}
```
Always add explicit `{#anchor}` for non-ASCII headings.

### Do not translate brand names
- Keep "Chimr", "Claude", "MCP" etc. as-is in all locales
- Technical terms like "API", "URL" stay in English
