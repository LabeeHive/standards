# File organization

## Purpose

This document defines standards for file naming, directory structure, and version control practices for documentation. Consistent file organization improves discoverability, maintainability, and collaboration across all projects.

---

## File naming - P1

### Snake_case convention

**Rules:**
- Use lowercase letters with underscores (`snake_case`)
- No spaces, hyphens, or camelCase
- Use descriptive names that indicate content

**✅ Good:**

```
naming_conventions.md
api_reference.md
getting_started.md
error_handling_patterns.md
```

**❌ Bad:**

```
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
error_handling.md           (14 chars)
dependency_management.md    (21 chars)
api_authentication.md       (18 chars)
```

**❌ Bad:**

```
error_handling_patterns_and_best_practices_guide.md  (50 chars - too long)
err_hdl.md                                           (7 chars - unclear)
```

---

### Special characters

**Rules:**
- Avoid spaces, hyphens, and special characters
- Do not use: `!@#$%^&*()+=[]{}|;:'",<>?/\-`
- Exception: Use `_` (underscore) as word separator

**✅ Good:**

```
database_design.md
event_driven_architecture.md
```

**❌ Bad:**

```
database-design.md
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

## Directory structure - P1

### Type-based organization

**Rules:**
- Organize files by type or topic
- Keep related files together
- Use clear, descriptive directory names

**Example structure:**

```
docs/
├── 00_overview/           # Project overview and terminology
├── 01_architecture/       # Architecture decisions
├── 02_business/           # Business-related (optional)
├── 03_development/        # Development guides
│   └── testing/           # Testing guidelines
├── 04_designs/            # UI/UX designs (optional)
├── 05_standards/          # Shared coding standards (Git submodule)
├── 98_plans/              # Implementation plans (optional)
└── 99_ideas/              # Ideas and exploration (optional)
```

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

- [Naming conventions](naming_conventions.md)
- [Code organization](code_organization.md)
- [Error handling](error_handling.md)
- [Testing guidelines](testing_guidelines.md)
```

---

## Version control - P2

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
- Restructured coding standards into shared submodule

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

## File metadata - P3

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

## Directory naming - P1

### Snake_case for directories

**Rules:**
- Use snake_case for directory names
- Keep names short and descriptive
- Use numbers for ordering when needed

**✅ Good:**

```
docs/
├── getting_started/
├── guides/
├── reference/
│   ├── api/
│   └── cli/
└── standards/
```

**❌ Bad:**

```
docs/
├── GettingStarted/
├── User-Guides/
├── technicalReference/
└── Coding Standards/
```

---

### Numbered prefixes

**Rules:**
- Use numbered prefixes for enforcing order
- Format: `00_`, `01_`, `02_`, etc. (two digits with underscore)
- Use for sequential or priority-based organization

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

## Asset organization - P2

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
│   ├── service_flow.png
│   ├── database_schema.png
│   └── deployment_diagram.png
```

---

### Asset file size

**P2 guidelines:**
- Images: < 1 MB per file
- Diagrams: Prefer SVG when possible
- Screenshots: Optimize PNG compression

**P3 guidelines:**
- Use lossy compression for photos (JPEG 80-90% quality)
- Use lossless compression for diagrams (PNG)
- Consider WebP format for modern browsers

---

## Cross-project reusability - P1

### Shared documentation repositories

**Rules:**
- Use Git submodules for shared documentation
- Keep shared content project-agnostic
- Use `ProjectName` placeholder in examples

**Example:**

```
project_a/
└── docs/
    └── 05_standards/  (Git submodule)

project_b/
└── docs/
    └── 05_standards/  (Same submodule)
```

---

### Submodule configuration

**`.gitmodules` example:**

```ini
[submodule "docs/05_standards"]
    path = docs/05_standards
    url = https://github.com/your-org/coding-standards.git
```

**Commands:**

```bash
# Add submodule
git submodule add https://github.com/your-org/coding-standards.git docs/05_standards

# Update submodule
git submodule update --remote docs/05_standards

# Clone project with submodules
git clone --recursive https://github.com/your-org/project.git
```

---

## Archiving and deprecation - P3

### Marking deprecated documents

**Rules:**
- Add deprecation notice at the top
- Link to replacement document
- Keep file accessible for reference

**Example:**

```markdown
# Legacy authentication

> **Deprecated:** This document is deprecated as of 2025-01-15. See [OAuth 2.0 guide](oauth2_guide.md) for the current approach.

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
│   ├── legacy_auth.md
│   └── old_api_v1.md
```

---

## References

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Git Submodules documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub repository structure best practices](https://github.blog/2021-11-18-repository-structure-best-practices/)
