# Project structure

## Purpose

This document defines the standard directory structure for Docusaurus-based product websites within monorepos.

---

## Directory placement - P1

### Use `pages/` directory in monorepo

Place the Docusaurus project in a `pages/` directory at the root of the product repository.

**Rules:**
- Directory name: `pages/`
- Location: repository root
- Purpose: public-facing product website

**Example:**

```text
{product}/
├── pages/                    # Docusaurus public site
│   ├── docusaurus.config.ts
│   ├── sidebars.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── docs/
│   ├── src/
│   ├── static/
│   └── i18n/
├── src/                      # Product source code
├── docs/                     # Internal documentation
└── ...
```

**Rationale:**
- Separates public site from internal docs
- Consistent location across all products
- Easy to identify and deploy

---

## Internal structure - P1

### Required directories and files

Every Docusaurus project must have these directories and files:

```text
pages/
├── docusaurus.config.ts      # Main configuration
├── sidebars.ts               # Sidebar navigation
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── docs/                     # Documentation content
│   └── intro.md              # Entry point
├── src/
│   ├── css/
│   │   └── custom.css        # Custom styles
│   └── pages/                # Custom pages (optional)
│       └── index.tsx         # Landing page
├── static/
│   └── img/                  # Static assets
│       ├── app-icon.png      # App icon
│       └── og-image.png      # Social card image
└── i18n/
    └── ja/                   # Japanese translations
        └── docusaurus-plugin-content-docs/
            └── current/
```

---

## Static assets - P1

### Required images

| Image | Purpose | Recommended size |
|-------|---------|------------------|
| `app-icon.png` | Favicon and navbar logo | 512x512 |
| `og-image.png` | Social card (OG/Twitter) | 1200x630 |

### Image location

Place all images in `static/img/`:

```text
static/
└── img/
    ├── app-icon.png
    ├── app-icon-dark.png     # Optional: dark mode variant
    └── og-image.png
```

---

## Documentation content - P2

### Entry point

Create `docs/intro.md` as the documentation entry point:

```markdown
---
sidebar_position: 1
---

# Introduction

Brief introduction to the product.
```

### Sidebar organization

Use `sidebars.ts` to organize documentation:

```typescript
import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      items: ["getting-started/installation", "getting-started/usage"],
    },
  ],
};

export default sidebars;
```

---

## References

- [Docusaurus Project Structure](https://docusaurus.io/docs/installation#project-structure)
- [Docusaurus Static Assets](https://docusaurus.io/docs/static-assets)
