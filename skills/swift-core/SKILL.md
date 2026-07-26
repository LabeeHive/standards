---
name: swift-core
description: Write Swift code following Labee core standards. Naming conventions, code formatting, file organization. Use when writing or reviewing Swift code structure.
when_to_use: Triggers on "naming", "format", "命名", "フォーマット", "ファイル構成", "code style", "file structure".
allowed-tools: Read Glob Grep Edit Write
---

# Swift Core

Labee's Swift naming, formatting, and file organization standards. The rules live in the
reference files — read the ones the change actually touches before writing or reviewing code.

Where a standard here differs from a common Swift convention, the difference is deliberate.
Follow the reference rather than the convention you would otherwise reach for.

Formatting is enforced by the tool, not by reading. Run it rather than reviewing indentation,
line length, braces, spacing, trailing commas, blank lines, or comment style by eye:

```bash
xcrun swift-format lint --recursive .        # report
xcrun swift-format --recursive . --in-place  # fix
```

## Reference Files

| File | Load When |
|------|-----------|
| references/naming.md | Naming a type, function, variable, boolean, event handler, UseCase, constant, or test method |
| references/formatting.md | Indentation, line length, braces, `self` usage, comments, trailing commas, blank lines |
| references/file-structure.md | Placing a new file, ordering imports or type members, MARK comments, extensions, directory layout |
