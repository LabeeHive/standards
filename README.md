# Coding standards

## Purpose

This repository contains shared coding standards for Labee LLC projects. Add it as a Git submodule to maintain consistency across repositories.

---

## Standards

| Directory | Description |
|-----------|-------------|
| [documentation/](documentation/) | Documentation writing standards |
| [swift/](swift/) | Swift and SwiftUI coding standards |

---

## Installation

```bash
# Add as submodule
git submodule add https://github.com/labee/coding-standards.git docs/05_standards

# Clone with submodules
git clone --recurse-submodules <your-project-url>

# Initialize submodules in existing clone
git submodule update --init --recursive
```

---

## Updates

```bash
git submodule update --remote docs/05_standards
```

