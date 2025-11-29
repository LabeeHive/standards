# Industry comparison

## Purpose

This document compares Labee LLC's Swift coding standards with industry-wide best practices from:
- [Apple Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Google Swift Style Guide](https://google.github.io/swift/)
- [Kodeco Swift Style Guide](https://github.com/kodecocodes/swift-style-guide)
- [Airbnb Swift Style Guide](https://github.com/airbnb/swift)
- [Uncle Bob's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## Comparison Summary

| Category | Labee LLC | Industry Standard | Assessment |
|----------|-----------|-------------------|------------|
| Architecture | 4-layer (View→ViewModel→UseCase→Repository) | 3-layer or 4-layer | Aligned |
| Protocol naming | "Protocol" suffix | `-able/-ible` (capability) or noun | Labee-specific |
| Indentation | 2 spaces | 2 spaces | Aligned |
| Line length | 100 characters | 100 characters | Aligned |
| Test naming | `[Method]_[Condition]_[Expected]` | Same (Swift Testing) | Aligned |
| Boolean naming | `is`/`has`/`should` prefix | `is`/`has` prefix | Aligned |
| Event handlers | `didTapXxx` | `didTapXxx` | Aligned |
| @MainActor | Required | Recommended (critical in Swift 6) | Aligned |
| Mock pattern | Mock Repository, not UseCase | Common practice | Good decision |
| AAA pattern | Adopted | Standard | Aligned |

---

## Architecture Comparison

### Uncle Bob's Original Clean Architecture (4 Layers)

```
┌─────────────────────────────────────┐
│     Frameworks & Drivers            │  ← DB, Web, UI, External
├─────────────────────────────────────┤
│     Interface Adapters              │  ← Controllers, Presenters, Gateways
├─────────────────────────────────────┤
│     Use Cases                       │  ← Application Business Rules
├─────────────────────────────────────┤
│     Entities                        │  ← Enterprise Business Rules
└─────────────────────────────────────┘
```

**Key Principles:**
- **Dependency Rule**: Source code dependencies only point inward
- **Entities**: Contain enterprise-wide critical business rules
- **Use Cases**: Application-specific business rules
- **Interface Adapters**: Convert data between use cases and external systems
- **Frameworks/Drivers**: External concerns (DB, Web, UI)

---

### iOS Common Clean Architecture (3 Layers)

```
┌─────────────────────────────────────┐
│     Presentation Layer              │  ← View + ViewModel
├─────────────────────────────────────┤
│     Domain Layer                    │  ← Entity + UseCase + Repository Protocol
├─────────────────────────────────────┤
│     Data Layer                      │  ← Repository Impl + Service/DataSource
└─────────────────────────────────────┘
```

**Key Characteristics:**
- Domain Layer has NO dependencies on other layers
- Repository Protocol defined in Domain, implemented in Data
- Entity contains business rules, not just data

---

### Labee LLC's Architecture (4 Layers)

```
┌─────────────────────────────────────┐
│     View                            │  ← SwiftUI Views
├─────────────────────────────────────┤
│     ViewModel                       │  ← UI State, @MainActor, ObservableObject
├─────────────────────────────────────┤
│     UseCase                         │  ← Business Logic (conditional)
├─────────────────────────────────────┤
│     Repository                      │  ← Data Access + External Systems
└─────────────────────────────────────┘
```

**UseCase is conditional:**
- Required if: validation, data transformation, multi-Repository coordination, reusable
- ViewModel can call Repository directly for pure CRUD operations

---

### Key Differences

| Aspect | Uncle Bob | iOS Common | Labee LLC |
|--------|-----------|------------|----------|
| Layers | 4 | 3 | 4 |
| Entity Layer | Yes (business rules) | Yes (Domain) | No (Models are DTOs) |
| Dependency Direction | Inward only | Inward only | Top to bottom |
| Repository Position | Interface Adapters | Domain (protocol) + Data (impl) | Separate layer (includes external systems) |
| ViewModel/Presenter | Interface Adapters | Presentation | Separate layer |
| UseCase | Required | Required | Conditional (can skip for pure CRUD) |

---

### This is NOT "Clean Architecture" - It's "Layered MVVM"

**Why it's different:**

1. **No Entity Layer**
   - Labee LLC's `ReminderModel` is a DTO (Data Transfer Object)
   - It wraps `EKReminder` but contains no business rules
   - Uncle Bob's Entity contains critical business rules

   ```swift
   // Labee LLC's Model (DTO)
   struct ReminderModel: Identifiable {
       let id: String
       let title: String
       // ... just data, no business methods
   }

   // Uncle Bob's Entity (would have business rules)
   struct Reminder {
       func isOverdue() -> Bool { ... }
       func canBeCompleted() -> Bool { ... }
       func priorityScore() -> Int { ... }
   }
   ```

2. **Dependency Direction**
   - Uncle Bob: Dependencies point inward (outer layers depend on inner)
   - Labee LLC: Dependencies flow top-to-bottom (View→ViewModel→UseCase→Repository)
   - This is a subtle but important difference

3. **Repository Contains Framework Dependencies**
   ```swift
   // Repository example (has EventKit import)
   import EventKit  // Framework dependency in Repository

   class ReminderRepository: ReminderRepositoryProtocol {
       // Uses EKCalendar directly
   }
   ```
   - In strict Clean Architecture, Repository would not import frameworks
   - Repository Protocol would be in Domain layer, implementation in Data layer

4. **Conditional UseCase**
   - Labee LLC allows ViewModel to call Repository directly for pure CRUD
   - Uncle Bob's Clean Architecture requires UseCase for all business operations
   - This pragmatic approach reduces boilerplate while preserving testability

---

### Architecture Naming

**Accurate names for this pattern:**
- **Layered MVVM**
- **MVVM + UseCase Pattern**

**This is a practical adaptation that:**
- Provides clear separation of concerns
- Enables testability through DI
- Works well with SwiftUI/Combine

---

## Testing (Swift Testing)

Labee LLC uses Swift Testing. Here are the conventions:

### Test Naming

```swift
// Swift Testing - no "test" prefix needed
@Test func fetchReminders_WhenNoAuthorization_ThrowsUnauthorizedError() { }
@Test func submitFeedback_WithValidInput_ReturnsSuccess() { }
@Test func validateTitle_WhenEmpty_ThrowsValidationError() { }
```

**Format:** `[Method]_[Condition]_[Expected]`

### Test Structure

```swift
import Testing

struct ReminderUseCaseTests {
  // Setup via init
  let mockRepository: MockReminderRepository
  let sut: AddReminderUseCase

  init() {
    mockRepository = MockReminderRepository()
    sut = AddReminderUseCase(repository: mockRepository)
  }

  @Test func execute_WithValidTitle_CreatesReminder() async throws {
    // Arrange
    mockRepository.reminderToReturn = ReminderModel(id: "1", title: "Test")

    // Act
    let result = try await sut.execute(title: "Test", notes: nil, dueDate: nil, listID: nil)

    // Assert
    #expect(result.title == "Test")
    #expect(mockRepository.createCalled)
  }

  @Test func execute_WithEmptyTitle_ThrowsValidationError() async {
    // Act & Assert
    await #expect(throws: ReminderValidationError.self) {
      try await sut.execute(title: "", notes: nil, dueDate: nil, listID: nil)
    }
  }
}
```

### Key Differences from XCTest

| XCTest | Swift Testing |
|--------|---------------|
| `import XCTest` | `import Testing` |
| `class FooTests: XCTestCase` | `struct FooTests` |
| `func testFoo()` | `@Test func foo()` |
| `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| `XCTAssertThrowsError` | `#expect(throws:)` |
| `XCTUnwrap` | `try #require()` |
| `setUp()` / `tearDown()` | `init()` / `deinit` |

### Parameterized Tests

```swift
@Test(arguments: ["", " ", "   "])
func validateTitle_WithWhitespaceOnly_ThrowsError(input: String) async {
  await #expect(throws: ReminderValidationError.self) {
    try await sut.execute(title: input, notes: nil, dueDate: nil, listID: nil)
  }
}
```

### Test Organization with @Suite

```swift
@Suite("Reminder UseCase Tests")
struct ReminderUseCaseTests {

  @Suite("Creation")
  struct Creation {
    @Test func withValidTitle_succeeds() { }
    @Test func withEmptyTitle_fails() { }
  }

  @Suite("Validation")
  struct Validation {
    @Test func titleTooLong_fails() { }
  }
}
```

### Serial Execution (when needed)

```swift
@Suite(.serialized)
struct DatabaseTests {
  // Tests run sequentially
}
```

---

## Naming Conventions

### Protocol Naming

**Labee LLC:**
```swift
protocol FeedbackRepositoryProtocol { }
protocol ReminderRepositoryProtocol { }
```

**Industry (Apple):**
```swift
// Capability protocols: -able/-ible/-ing
protocol Equatable { }
protocol ProgressReporting { }

// Conceptual protocols: noun
protocol Collection { }
```

**Analysis:**
- Labee LLC uses "Protocol" suffix for all protocols
- Apple recommends different approaches based on protocol purpose
- "Protocol" suffix is common in enterprise codebases for clarity
- Both approaches are valid; Labee LLC's is more consistent

### Boolean Naming

**Labee LLC:**
```swift
var isEmpty: Bool
var hasChildren: Bool
var isEnabled: Bool
var shouldRefresh: Bool
```

**Industry (Apple, Airbnb):**
```swift
var isEmpty: Bool
var hasChildren: Bool
var isEnabled: Bool
```

**Analysis:** Aligned with industry standards. Use `is`/`has`/`should`/`can` prefix.

### Event Handler Naming

**Labee LLC:**
```swift
func didTapSaveButton()
func didSelectRow(at indexPath: IndexPath)
func willAppear()
```

**Industry (Airbnb):**
```swift
func didTapBookButton()
func didSelectRow(at indexPath: IndexPath)
```

**Analysis:** Aligned with industry standards. Use `did`/`will` prefix.

---

## Formatting

### Indentation

**Labee LLC:** 2 spaces (no tabs)

**Industry (Google, Kodeco, Airbnb):** 2 spaces (universal consensus)

**Analysis:** Aligned with industry standards.

### Line Length

**Labee LLC:** 100 characters maximum

**Industry:**
- Google: 100 characters
- Airbnb: 100 characters (strict 130)
- Kodeco: ~70 characters (for print readability)

**Analysis:** Aligned with industry standards.

### Brace Style

**Labee LLC:** K&R style (opening brace on same line)

**Industry (Google):** K&R style

**Analysis:** Aligned with industry standards.

### Self Usage

**Labee LLC:** Omit unless required (disambiguation, closures)

**Industry (Airbnb, Google):** Omit unless required

**Analysis:** Aligned with industry standards.

---

## Architecture Strengths

1. **Pragmatic architecture** - Works well in practice with clear separation of concerns
2. **@MainActor requirement** - Aligned with Swift 6 strict concurrency
3. **Mock pattern** - Repository mocking, not UseCase
4. **Localization-first** - `String(localized:)` everywhere
5. **Repository layer abstraction** - External systems isolated behind protocols
6. **Conditional UseCase** - Reduces boilerplate for pure CRUD operations
7. **Anti-patterns documentation** - Explicit "don't do this" guidance
8. **Swift Testing adoption** - Modern testing framework with parameterized tests

---

## References

- [Apple Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Google Swift Style Guide](https://google.github.io/swift/)
- [Kodeco Swift Style Guide](https://github.com/kodecocodes/swift-style-guide)
- [Airbnb Swift Style Guide](https://github.com/airbnb/swift)
- [Uncle Bob's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [iOS Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM)
- [SwiftLee - Swift Testing](https://www.avanderlee.com/swift-testing/modern-unit-test/)
- [Swift with Majid - Swift Testing Lifecycle](https://swiftwithmajid.com/2024/10/29/introducing-swift-testing-lifecycle/)
- [SwiftUI and @MainActor](https://fatbobman.com/en/posts/swiftui-views-and-mainactor/)
