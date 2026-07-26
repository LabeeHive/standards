---
name: swift-architecture
description: Design Swift app architecture following Labee standards. MVVM, ViewModel patterns, architectural decisions. Use when designing app structure or reviewing architecture.
when_to_use: Triggers on "architecture", "MVVM", "ViewModel", "アーキテクチャ", "設計", "依存", "dependency".
allowed-tools: Read Glob Grep Edit Write
---

# Swift Architecture

Labee's app architecture: View → ViewModel → UseCase → Repository, with dependencies injected
through protocols. The layer rules and their anti-patterns live in the reference files — read
the relevant one before designing or reviewing structure.

Layer boundaries are the part that gets violated. A View reaching a Repository directly, or
business logic sitting in a ViewModel, is a violation even when the code works.

## Reference Files

| File | Load When |
|------|-----------|
| references/architecture.md | Deciding which layer something belongs in, wiring dependency injection, tracing data flow |
| references/viewmodel.md | Writing or reviewing a ViewModel — `@MainActor`, property observation, delegating to UseCases |
| references/comparison-with-industry.md | Justifying why a Labee rule diverges from common practice |
