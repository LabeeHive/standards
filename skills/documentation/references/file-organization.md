# File organization

## Purpose

This document defines standards for file naming, directory structure, and version control practices for documentation. Consistent file organization improves discoverability, maintainability, and collaboration across all projects.

---

## File naming

### kebab-case convention

**Rules:**

- Lowercase letters with hyphens (`kebab-case`)
- No spaces, underscores, or camelCase
- Descriptive names that indicate content
- A leading underscore is a prefix, not a separator: `_core-rules.md` marks a file injected on every invocation of its skill

**✅ Good:**

```
naming-conventions.md
api-reference.md
getting-started.md
error-handling-patterns.md
```

**❌ Bad:**

```
naming_conventions.md
Naming-Conventions.md
apiReference.md
Getting Started.md
error-handling-patterns.MD
```

---

### File name length

**Rules:**

- Keep file names under 30 characters (excluding extension)
- Use abbreviations sparingly and only when widely understood
- Prioritize clarity over brevity

**✅ Good:**

```
error-handling.md           (14 chars)
dependency-management.md    (21 chars)
api-authentication.md       (18 chars)
```

**❌ Bad:**

```
error-handling-patterns-and-best-practices-guide.md  (48 chars - too long)
err-hdl.md                                           (7 chars - unclear)
```

---

### Special characters

**Rules:**

- Avoid spaces and special characters
- Do not use: `!@#$%^&*()+=[]{}|;:'",<>?/\`
- Use `-` (hyphen) as the word separator
- `_` (underscore) is never a separator; it appears only as the leading marker on a reference injected on every invocation of its skill, as in `_core-rules.md`

**✅ Good:**

```
database-design.md
event-driven-architecture.md
```

**❌ Bad:**

```
database_design.md
event & messaging.md
architecture (v2).md
```

---

### File extensions

**Rules:**

- Use `.md` for Markdown documentation
- Use `.json` for JSON configuration
- Use `.yaml` or `.yml` for YAML configuration
- Use `.txt` only for plain text (rare)

---

## Directory structure

### Type-based organization

**Rules:**

- Organize files by type or topic
- Keep related files together
- Use clear, descriptive directory names

The `docs/` tree itself — which numbered namespaces exist, what each holds, and which document belongs in which — is defined in `/project-conventions` (`references/docs-structure.md`). The rules here apply to organizing files inside whichever directory a document lands in.

---

### Shallow hierarchy

**Rules:**

- Limit directory depth to 3-4 levels maximum
- Avoid deeply nested structures
- Use flat structures when possible

**✅ Good:**

```
docs/05_standards/swift/naming.md  (4 levels)
```

**❌ Bad:**

```
docs/technical/standards/coding/languages/python/core/naming/conventions.md  (9 levels)
```

---

### Index files

**Rules:**

- Use `README.md` as the index for top-level `docs/` directories (e.g., `00_overview/`, `01_architecture/`)
- Do NOT create README.md for subdirectories (e.g., `mockups/`, `images/`, `test/`)
- README should provide overview and navigation
- Link to subdirectories and key files

**Example:**

```markdown
# Coding standards

## Purpose

This directory contains coding standards applicable to all projects.

## Contents

- [Naming conventions](naming-conventions.md)
- [Code organization](code-organization.md)
- [Error handling](error-handling.md)
- [Testing guidelines](testing-guidelines.md)
```

---

## Version control

### Git as source of truth

**Rules:**

- Use Git commit history for tracking changes
- Avoid "Last Updated" or "Version" sections in documents
- Exception: YAML frontmatter for publishing systems

**✅ Good:**

```bash
# View document history
git log --follow docs/05_standards/swift/naming.md

# View specific changes
git diff HEAD~1 docs/05_standards/swift/naming.md
```

**❌ Bad:**

```markdown
# Naming conventions

**Last Updated:** 2025-01-15
**Version:** 1.2.3

## Purpose
...
```

---

### CHANGELOG.md

**Rules:**

- Maintain `CHANGELOG.md` at project root for significant updates
- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Use semantic versioning for releases

**Example:**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation writing guide with 5 core documents

### Changed
- Restructured coding standards into per-topic guides

### Deprecated
- Legacy authentication patterns

### Removed
- Redundant API documentation

### Fixed
- Broken links in architecture documentation

## [1.0.0] - 2025-01-15

### Added
- Initial coding standards documentation
- API design guidelines
- Testing best practices
```

---

### Semantic versioning

**Rules:**

- Use `MAJOR.MINOR.PATCH` format
- MAJOR: Breaking changes or major restructuring
- MINOR: New content or non-breaking additions
- PATCH: Fixes, typos, minor clarifications

**Examples:**

- `1.0.0` - Initial release
- `1.1.0` - Added new documentation section
- `1.1.1` - Fixed typos and broken links
- `2.0.0` - Major restructure of documentation

---

## File metadata

### YAML frontmatter

**Rules:**

- Use YAML frontmatter for metadata when needed by publishing tools
- Place at the very beginning of the document
- Keep minimal and relevant

**Example:**

```markdown
---
title: Naming conventions
status: active
---

# Naming conventions

## Purpose
...
```

**Common fields:**

- `title`: Document title
- `status`: active, draft, deprecated, archived

---

## Directory naming

### kebab-case for directories

**Rules:**

- Lowercase with hyphens, matching the file convention
- Keep names short and descriptive
- Use numbers for ordering when needed

**✅ Good:**

```
docs/
├── getting-started/
├── guides/
├── reference/
│   ├── api/
│   └── cli/
└── standards/
```

**❌ Bad:**

```
docs/
├── getting_started/
├── GettingStarted/
├── technicalReference/
└── Coding Standards/
```

---

### Numbered prefixes

**Rules:**

- Use numbered prefixes for enforcing order
- Format: `00_`, `01_`, `02_`, etc. (two digits with underscore)
- Use for sequential or priority-based organization
- The numbers assigned to `docs/` namespaces are not chosen per project — they come from `/project-conventions` (`references/docs-structure.md`)

**Example:**

```
docs/
├── 00_overview/
├── 01_architecture/
├── 02_business/
├── 03_development/
└── 04_designs/
```

---

## Asset organization

### Documentation assets

**Rules:**

- Store images in `images/` or `assets/` subdirectory
- Use descriptive file names for assets
- Keep asset files close to referencing documents

**Example:**

```
docs/architecture/
├── microservices.md
├── images/
│   ├── service-flow.png
│   ├── database-schema.png
│   └── deployment-diagram.png
```

---

### Asset file size

**Guidelines:**

- Images: < 1 MB per file
- Diagrams: Prefer SVG when possible
- Screenshots: Optimize PNG compression

**Additional guidelines:**

- Use lossy compression for photos (JPEG 80-90% quality)
- Use lossless compression for diagrams (PNG)
- Consider WebP format for modern browsers

---

## Cross-project reusability

Where shared standards sit in a project's `docs/` tree, and how a project takes them in, is a layout question — see `/project-conventions` (`references/docs-structure.md`). What belongs here is the writing side: keep content that is meant to be shared project-agnostic, and use a `ProjectName` placeholder in its examples rather than one project's name.

---

## Archiving and deprecation

### Marking deprecated documents

**Rules:**

- Add deprecation notice at the top
- Link to replacement document
- Keep file accessible for reference

**Example:**

```markdown
# Legacy authentication

> **Deprecated:** This document is deprecated as of 2025-01-15. See [OAuth 2.0 guide](oauth2-guide.md) for the current approach.

## Purpose

This document describes the legacy authentication pattern...
```

---

### Moving to archive

**Rules:**

- Create `archive/` directory for old documents
- Move deprecated files instead of deleting
- Update links to archived files

**Example:**

```
docs/
├── guides/
├── reference/
├── archive/
│   ├── legacy-auth.md
│   └── old-api-v1.md
```

---

## References

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [GitHub repository structure best practices](https://github.blog/2021-11-18-repository-structure-best-practices/)
