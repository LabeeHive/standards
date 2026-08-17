---
name: swift-ui
description: Build SwiftUI views following Labee standards. View implementation, layout, modifiers, components. Use when writing or reviewing SwiftUI views.
when_to_use: Triggers on "SwiftUI", "View", "ビュー", "UI", "レイアウト", "layout", "modifier", "component".
allowed-tools: Read Glob Grep Edit Write
---

# Swift UI

Labee's SwiftUI standards: state management, view composition, and property order. Read the reference before writing or reviewing a View.

Two rules cause most review rejections: a View holds no business logic, and a View never touches a Repository directly — both go through the ViewModel.

## Reference Files

| File | Load When |
|------|-----------|
| references/swiftui.md | Writing or reviewing any View — state management, property order, composition, previews |
