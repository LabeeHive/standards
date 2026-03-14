# Testing

## Purpose

This document defines testing conventions using Swift Testing framework. Following these conventions ensures consistent, maintainable, and reliable tests.

---

## Basic structure - P1

**Rules:**
- Use `import Testing` instead of `XCTest`
- Use `struct` for test suites (not `class`)
- Use `@Test` macro for test methods
- Use `init()` for setup

**Standard structure:**

```swift
import Testing

@testable import ProjectName

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
    let result = try await sut.execute(
      title: "Test",
      notes: nil,
      dueDate: nil,
      listID: nil
    )

    // Assert
    #expect(result.title == "Test")
    #expect(mockRepository.createCalled)
  }
}
```

---

## Test naming - P1

**Rules:**
- Format: `[method]_[condition]_[expected]`
- No `test` prefix (Swift Testing uses `@Test` macro)
- Use underscores to separate parts

**✅ Good:**

```swift
@Test func fetchReminders_WhenNoAuthorization_ThrowsUnauthorizedError()
@Test func submitFeedback_WithValidInput_ReturnsSuccess()
@Test func validateTitle_WhenEmpty_ThrowsValidationError()
@Test func execute_WithValidTitle_CreatesReminder()
```

**❌ Bad:**

```swift
@Test func testFetchReminders()                    // test prefix, missing condition
@Test func fetchRemindersThrowsError()             // No underscores
@Test func test_fetch_reminders()                  // test prefix
```

---

## Assertions - P1

### #expect

Use `#expect` for all assertions:

```swift
#expect(result == expected)
#expect(items.isEmpty)
#expect(mockRepository.createCalled)
#expect(count > 0)
```

### #expect(throws:)

Use for testing thrown errors:

```swift
await #expect(throws: ValidationError.self) {
  try await sut.execute(title: "")
}

// With specific error
await #expect(throws: ValidationError.emptyTitle) {
  try await sut.execute(title: "")
}
```

### #require

Use to unwrap optionals. Test fails if `nil`:

```swift
let item = try #require(items.first)
#expect(item.title == "Test")

let user = try #require(result.user)
#expect(user.name == "John")
```

---

## AAA pattern - P1

**Rules:**
- Structure all tests as Arrange-Act-Assert
- Separate sections with blank lines
- Keep each section focused

**Example:**

```swift
@Test func execute_WithValidTitle_CreatesReminder() async throws {
  // Arrange
  let expectedTitle = "Test Reminder"
  mockRepository.reminderToReturn = ReminderModel(id: "1", title: expectedTitle)

  // Act
  let result = try await sut.execute(
    title: expectedTitle,
    notes: nil,
    dueDate: nil,
    listID: nil
  )

  // Assert
  #expect(result.title == expectedTitle)
  #expect(mockRepository.createCalled)
}
```

---

## Single assertion principle - P1

**Rules:**
- Each test verifies one behavior
- Multiple `#expect` calls are acceptable if they verify the same behavior
- Split tests if verifying different behaviors

**✅ Good:**

```swift
@Test func addReminder_CallsRepository() async throws {
  _ = try await sut.execute(title: "Test", notes: nil, dueDate: nil, listID: nil)

  #expect(mockRepository.createCalled)
}

@Test func addReminder_ReturnsCreatedReminder() async throws {
  mockRepository.reminderToReturn = ReminderModel(id: "1", title: "Test")

  let result = try await sut.execute(title: "Test", notes: nil, dueDate: nil, listID: nil)

  #expect(result.id == "1")
  #expect(result.title == "Test")
}
```

**❌ Bad:**

```swift
@Test func addReminder_WorksCorrectly() async throws {
  // Testing too many behaviors in one test
  let result = try await sut.execute(title: "Test", notes: nil, dueDate: nil, listID: nil)

  #expect(mockRepository.createCalled)
  #expect(result != nil)
  #expect(result.title == "Test")
  #expect(mockValidator.validateCalled)
  #expect(logger.logCalled)
}
```

---

## Test organization with @Suite - P2

**Rules:**
- Use `@Suite` to group related tests
- Nest suites for hierarchical organization
- Use descriptive suite names

**Example:**

```swift
@Suite("Reminder UseCase Tests")
struct ReminderUseCaseTests {

  @Suite("Creation")
  struct Creation {
    @Test func withValidTitle_succeeds() { }
    @Test func withEmptyTitle_fails() { }
    @Test func withLongTitle_fails() { }
  }

  @Suite("Validation")
  struct Validation {
    @Test func titleTooLong_fails() { }
    @Test func titleWithOnlyWhitespace_fails() { }
  }

  @Suite("Deletion")
  struct Deletion {
    @Test func existingReminder_succeeds() { }
    @Test func nonExistentReminder_fails() { }
  }
}
```

---

## Parameterized tests - P2

**Rules:**
- Use `arguments` parameter for testing multiple inputs
- Reduces test duplication
- Each argument creates a separate test case

**Example:**

```swift
@Test(arguments: ["", " ", "   ", "\t", "\n"])
func validateTitle_WithWhitespaceOnly_ThrowsError(input: String) async {
  await #expect(throws: ValidationError.self) {
    try await sut.execute(title: input, notes: nil, dueDate: nil, listID: nil)
  }
}

@Test(arguments: [0, -1, -100])
func setQuantity_WithInvalidValue_ThrowsError(quantity: Int) async {
  await #expect(throws: ValidationError.invalidQuantity) {
    try await sut.setQuantity(quantity)
  }
}
```

---

## Serial execution - P2

**Rules:**
- Tests run in parallel by default
- Use `.serialized` when tests must run sequentially
- Required for tests that share state or resources

**Example:**

```swift
@Suite(.serialized)
struct DatabaseTests {
  @Test func createRecord_InsertsData() { }
  @Test func deleteRecord_RemovesData() { }
  // Tests run sequentially
}
```

---

## XCTest comparison - P2

| XCTest | Swift Testing |
|--------|---------------|
| `import XCTest` | `import Testing` |
| `class FooTests: XCTestCase` | `struct FooTests` |
| `func testFoo()` | `@Test func foo()` |
| `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| `XCTAssertTrue(condition)` | `#expect(condition)` |
| `XCTAssertNil(value)` | `#expect(value == nil)` |
| `XCTAssertThrowsError` | `#expect(throws:)` |
| `XCTUnwrap(optional)` | `try #require(optional)` |
| `setUp()` | `init()` |
| `tearDown()` | `deinit` (use `class` instead of `struct`) |

---

## Coverage goals - P2

**Targets:**
- Unit tests: 80%+ coverage
- Integration tests: Main use cases
- UI tests: Critical user paths

**Exclusions:**
- SwiftUI View layer
- Auto-generated code
- Debug-only code

---

## References

- [Mock patterns](mock-patterns.md)
- [Apple Swift Testing Documentation](https://developer.apple.com/documentation/testing)
- [SwiftLee - Swift Testing](https://www.avanderlee.com/swift-testing/modern-unit-test/)
- [Swift with Majid - Swift Testing](https://swiftwithmajid.com/2024/10/22/introducing-swift-testing-basics/)
