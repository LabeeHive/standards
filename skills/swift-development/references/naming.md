# Naming conventions

## Purpose

This document defines naming conventions for Swift code. Consistent naming improves code readability, maintainability, and team collaboration.

---

## Types - P1

### Classes, structs, and enums

**Rules:**
- Use `UpperCamelCase` for all type names
- Use nouns or noun phrases
- Avoid abbreviations unless widely understood

**✅ Good:**

```swift
class ReminderService { }
struct ReminderModel { }
enum WindowLevel { }
enum AuthenticationError { }
```

**❌ Bad:**

```swift
class reminderService { }   // lowerCamelCase
struct reminder_model { }   // snake_case
enum Wlvl { }               // Abbreviation
```

---

### Protocols - P1

**Rules:**
- Use `UpperCamelCase` with `Protocol` suffix
- This distinguishes protocols from concrete types

**✅ Good:**

```swift
protocol ReminderServiceProtocol { }
protocol ReminderRepositoryProtocol { }
protocol AuthenticationRepositoryProtocol { }
```

**❌ Bad:**

```swift
protocol ReminderServiceable { }  // Unclear naming
protocol IReminderService { }     // Hungarian notation
```

> **Note:** Apple recommends `-able`, `-ible`, or `-ing` suffixes for capability protocols (e.g., `Equatable`, `Codable`). Labee LLC uses `Protocol` suffix for consistency and clarity in application code.

---

## Functions and variables - P1

**Rules:**
- Use `lowerCamelCase` for all function and variable names
- Use verb phrases for functions
- Use nouns for variables

**✅ Good:**

```swift
func fetchReminders() async throws -> [ReminderModel] { }
func validateTitle(_ title: String) throws { }

var isLoading = false
let maxRetryCount = 3
private var cachedItems: [Item] = []
```

**❌ Bad:**

```swift
func FetchReminders() { }    // UpperCamelCase
func fetch_reminders() { }   // snake_case
var IsLoading = false        // UpperCamelCase
```

---

## Booleans - P1

**Rules:**
- Use `is`, `has`, `should`, or `can` prefix
- Name should read as an assertion

**✅ Good:**

```swift
var isEmpty: Bool
var hasChildren: Bool
var isEnabled: Bool
var shouldRefresh: Bool
var canSubmit: Bool
```

**❌ Bad:**

```swift
var empty: Bool       // Missing prefix
var children: Bool    // Ambiguous (count or existence?)
var enabled: Bool     // Missing prefix
var refresh: Bool     // Unclear meaning
```

---

## Event handlers - P1

**Rules:**
- Use `did` or `will` prefix
- Follow with action verb

**✅ Good:**

```swift
func didTapSaveButton() { }
func didSelectRow(at indexPath: IndexPath) { }
func willAppear() { }
func didFinishLoading() { }
```

**❌ Bad:**

```swift
func handleSaveButtonTap() { }   // handle prefix
func onRowSelected() { }         // on prefix
func saveButtonPressed() { }     // No did/will prefix
```

---

## UseCases - P1

**Rules:**
- Start with a verb (describing the action)
- End with `UseCase` suffix
- Be specific and descriptive

**✅ Good:**

```swift
class FetchRemindersUseCase { }
class ToggleReminderCompletionUseCase { }
class SaveSelectedListUseCase { }
class ValidateReminderTitleUseCase { }
```

**❌ Bad:**

```swift
class RemindersUseCase { }       // No verb
class GetDataUseCase { }         // Too vague
class ReminderManager { }        // Missing UseCase suffix
```

---

## Test methods - P1

**Rules:**
- Format: `[method]_[condition]_[expected]`
- No `test` prefix (Swift Testing uses `@Test` macro)
- Use underscores to separate parts

**✅ Good:**

```swift
@Test func fetchReminders_WhenNoAuthorization_ThrowsUnauthorizedError() { }
@Test func submitFeedback_WithValidInput_ReturnsSuccess() { }
@Test func validateTitle_WhenEmpty_ThrowsValidationError() { }
@Test func execute_WithValidTitle_CreatesReminder() { }
```

**❌ Bad:**

```swift
@Test func testFetchReminders() { }           // test prefix, missing condition
@Test func fetchRemindersThrowsError() { }    // No underscores
@Test func test_fetch_reminders() { }         // test prefix, snake_case
```

---

## Constants - P2

**Rules:**
- Use `lowerCamelCase` for constants
- Avoid global constants (prefer static properties)
- Use descriptive names

**✅ Good:**

```swift
struct APIConstants {
  static let baseURL = "https://api.example.com"
  static let timeoutInterval: TimeInterval = 30
}

class ProjectNameService {
  static let shared = ProjectNameService()
  private let maxRetryCount = 3
}
```

**❌ Bad:**

```swift
let API_BASE_URL = "..."        // SCREAMING_SNAKE_CASE
let kMaxRetryCount = 3          // k prefix (Objective-C style)
var TIMEOUT = 30                // SCREAMING_SNAKE_CASE, mutable
```

---

## Abbreviations - P2

**Rules:**
- Avoid abbreviations unless widely understood
- When used, follow Swift conventions (URL, ID, HTTP)

**✅ Good:**

```swift
let userID: String
let imageURL: URL
let httpResponse: HTTPURLResponse
let backgroundColor: Color
```

**❌ Bad:**

```swift
let usrId: String           // Unclear abbreviation
let imgUrl: URL             // Inconsistent casing
let bgColor: Color          // Abbreviation
let numberOfChars: Int      // Use characterCount instead
```

---

## References

- [Apple Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Google Swift Style Guide - Naming](https://google.github.io/swift/#naming)
