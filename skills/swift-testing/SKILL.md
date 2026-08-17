---
name: swift-testing
description: Write and review Swift tests following Labee standards. Unit tests, mock/stub patterns, test doubles. Use when writing tests or reviewing test code.
when_to_use: Triggers on "test", "テスト", "mock", "stub", "TDD", "テスト駆動", "XCTest", "Swift Testing".
---

# Swift Testing

Labee's test standards: Swift Testing with `@Suite`/`@Test`, AAA structure, and protocol-based test doubles. Read the reference before writing or reviewing tests.

Mocks carry a hard rule that is easy to break by accident: never mock a UseCase. Mock the protocol below it and let the real UseCase run.

## Reference Files

| File | Load When |
|------|-----------|
| references/testing.md | Structuring a test — naming, assertions, AAA, `@Suite` organization, parameterized tests |
| references/mock-patterns.md | Building a test double — call tracking, return value and error control, what may not be mocked |
