# Project structure

## Purpose

This document defines the standard directory structure for project documentation. Following this structure ensures consistency, discoverability, and maintainability across all projects.

---

## Directory structure - P1

### Standard docs/ structure

All projects should organize their documentation using numbered directories:

```
docs/
├── 00_overview/          # Project overview and terminology
├── 01_architecture/      # System architecture and design decisions
├── 02_business/          # Business-related documentation (optional)
├── 03_development/       # Development guides and processes
│   └── testing/          # Testing guidelines
├── 04_designs/           # UI/UX designs and mockups (optional)
├── 05_standards/         # Shared coding standards (Git submodule)
├── 98_plans/             # Implementation plans and roadmaps (optional)
└── 99_ideas/             # Ideas and exploration (optional)
```

---

### Numbering convention

**Rules:**
- Use two-digit prefixes with underscore separator (e.g., `00_`, `01_`)
- Core directories use `00-09` range
- Auxiliary directories use `98-99` range
- Reserve gaps for future additions

**Number assignments:**

| Range | Purpose | Examples |
|-------|---------|----------|
| 00-09 | Core documentation | overview, architecture, development |
| 10-89 | Reserved for expansion | - |
| 90-97 | Reserved | - |
| 98-99 | Auxiliary content | plans, ideas |

---

## Directory descriptions - P1

### 00_overview/

**Purpose:** Project introduction and foundational information.

**Contents:**
- `README.md` - Project overview and navigation
- `terminology.md` - Project-specific terms and definitions
- `product_identity.md` - Product vision and identity (optional)

**Required:** Yes

---

### 01_architecture/

**Purpose:** System architecture and technical design decisions.

**Contents:**
- `architecture.md` - System architecture overview
- `adr/` - Architecture Decision Records (optional)
- Component-specific documentation

**Required:** Yes

---

### 02_business/

**Purpose:** Business-related documentation.

**Contents:**
- Monetization strategies
- Competitive analysis
- Business requirements

**Required:** No (depends on project type)

---

### 03_development/

**Purpose:** Development processes and guidelines.

**Contents:**
- `testing/` - Testing guidelines and patterns
- Project-specific development guides
- Build and deployment documentation

**Required:** Yes

---

### 04_designs/

**Purpose:** UI/UX designs and visual documentation.

**Contents:**
- `ui_mockup.md` - UI design documentation
- `mockups/` - Design files and screenshots
- Design system documentation

**Required:** No (depends on project type)

---

### 05_standards/

**Purpose:** Shared coding and documentation standards.

**Contents:** Git submodule containing shared standards repository.

**Required:** Yes

**Setup:**

```bash
git submodule add https://github.com/labee/coding-standards.git docs/05_standards
```

---

### 98_plans/

**Purpose:** Implementation plans and roadmaps.

**Contents:**
- Feature implementation plans
- Migration plans
- Release roadmaps

**Required:** No

---

### 99_ideas/

**Purpose:** Ideas, research, and exploration.

**Contents:**
- Feature ideas and proposals
- Research notes
- Technology exploration

**Required:** No

---

## Shared standards integration - P1

### Mounting the standards submodule

The shared coding standards repository should be mounted at `docs/05_standards/`:

```bash
# Add submodule
git submodule add https://github.com/labee/coding-standards.git docs/05_standards

# Clone with submodules
git clone --recurse-submodules <your-project-url>

# Initialize submodules in existing clone
git submodule update --init --recursive

# Update to latest version
git submodule update --remote docs/05_standards
```

---

### Project-specific standards

If a project needs additional standards beyond the shared ones, place them in `docs/03_development/`:

```
docs/
├── 03_development/
│   ├── testing/              # Testing guidelines
│   ├── localization.md       # Project-specific localization rules
│   └── performance.md        # Project-specific performance rules
└── 05_standards/             # Shared standards (submodule)
    ├── documentation/
    └── swift/
```

Project-specific standards should reference shared standards where applicable:

```markdown
# Localization

## Purpose

This document defines localization rules specific to this project.

For general coding standards, see `../05_standards/swift/`.

---

## Project-specific rules

...
```

---

## AGENTS.md integration - P2

When using AI coding assistants, include the documentation structure in your AGENTS.md file:

```markdown
## Documentation structure

```
docs/
├── 00_overview/        # Project overview
├── 01_architecture/    # System architecture
├── 03_development/     # Development guides
├── 04_designs/         # UI/UX designs
└── 05_standards/       # Shared coding standards (submodule)
```

## Before starting work

1. `docs/00_overview/README.md`
2. `docs/01_architecture/architecture.md`
3. `docs/05_standards/`
```

---

## References

- [File organization](file_organization.md)
- [AI documentation](ai_documentation.md)
- [Git Submodules documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
