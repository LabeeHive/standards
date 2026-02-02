# Formatting

## Purpose

This document defines code formatting standards for Swift. Consistent formatting improves readability and reduces cognitive load during code reviews.

---

## Indentation - P1

**Rules:**
- Use 2 spaces for indentation
- Never use tabs
- Configure your editor to insert spaces when pressing Tab

**✅ Good:**

```swift
struct ContentView: View {
  var body: some View {
    VStack {
      Text("Hello")
      Button("Action") {
        performAction()
      }
    }
  }
}
```

**❌ Bad:**

```swift
struct ContentView: View {
    var body: some View {  // 4 spaces
        VStack {
            Text("Hello")
        }
    }
}
```

---

## Line length - P1

**Rules:**
- Maximum 100 characters per line
- Break long lines at logical points
- Align continuation lines appropriately

**✅ Good:**

```swift
func createReminder(
  title: String,
  notes: String?,
  dueDate: Date?,
  listID: String?
) async throws -> ReminderModel {
  // Implementation
}

let description = """
  This is a long description that would exceed the line limit \
  if written on a single line.
  """
```

**❌ Bad:**

```swift
func createReminder(title: String, notes: String?, dueDate: Date?, listID: String?) async throws -> ReminderModel {
  // Line exceeds 100 characters
}
```

---

## Braces - P1

**Rules:**
- Use K&R style (opening brace on same line)
- Closing brace on its own line
- Always use braces for control flow, even for single statements

**✅ Good:**

```swift
if condition {
  doSomething()
} else {
  doSomethingElse()
}

guard let value = optional else {
  return
}

for item in items {
  process(item)
}
```

**❌ Bad:**

```swift
if condition
{
  doSomething()
}

if condition { doSomething() }  // Single line

if condition
  doSomething()  // Missing braces
```

---

## Self usage - P1

**Rules:**
- Omit `self` unless required
- Required cases: initializer disambiguation, closures capturing `self`

**✅ Good:**

```swift
class ProjectNameService {
  var name: String
  var items: [Item] = []

  init(name: String) {
    self.name = name  // Required for disambiguation
  }

  func greet() {
    print(name)  // No self needed
  }

  func loadAsync() {
    Task {
      self.items = await fetchItems()  // Required in closure
    }
  }
}
```

**❌ Bad:**

```swift
class ProjectNameService {
  var name: String

  func greet() {
    print(self.name)  // Unnecessary self
  }

  func process() {
    self.validate()   // Unnecessary self
    self.save()       // Unnecessary self
  }
}
```

---

## Comments - P1

**Rules:**
- Use `//` for single-line comments
- Use `///` for documentation comments
- Never use `/* */` block comments

**✅ Good:**

```swift
// This is a single-line comment

/// Fetches all reminders from the repository.
/// - Returns: Array of reminder models
/// - Throws: `RepositoryError` if fetch fails
func fetchReminders() async throws -> [ReminderModel]
```

**❌ Bad:**

```swift
/* This is a block comment
   that spans multiple lines */

/**
 * JavaDoc style comment
 */
func fetchReminders() { }
```

---

## Trailing commas - P2

**Rules:**
- Use trailing commas in multi-line arrays and dictionaries
- This simplifies diffs when adding items

**✅ Good:**

```swift
let items = [
  "apple",
  "banana",
  "cherry",
]

let config: [String: Any] = [
  "timeout": 30,
  "retryCount": 3,
  "debug": true,
]
```

**❌ Bad:**

```swift
let items = [
  "apple",
  "banana",
  "cherry"  // Missing trailing comma
]
```

---

## Blank lines - P2

**Rules:**
- One blank line between methods
- One blank line between logical sections within a method
- No blank line at the start or end of a type body

**✅ Good:**

```swift
struct ProjectNameViewModel {
  let name: String

  func methodA() {
    // Implementation
  }

  func methodB() {
    // Step 1
    prepare()

    // Step 2
    execute()
  }
}
```

**❌ Bad:**

```swift
struct ProjectNameViewModel {

  let name: String  // Unnecessary blank line at start
  func methodA() {
    // Implementation
  }
  func methodB() {  // Missing blank line between methods
    // Implementation
  }

}  // Unnecessary blank line at end
```

---

## Whitespace - P2

**Rules:**
- One space after colons in type declarations
- One space around operators
- No trailing whitespace

**✅ Good:**

```swift
let name: String = "value"
let count = items.count + 1
func process(item: Item) -> Result
```

**❌ Bad:**

```swift
let name:String = "value"     // No space after colon
let count = items.count+1     // No spaces around operator
func process(item : Item)     // Space before colon
```

---

## Type inference - P2

**Rules:**
- Prefer type inference when the type is obvious
- Specify types when it improves clarity or is required

**✅ Good:**

```swift
let name = "John"                           // Obviously String
let count = 42                              // Obviously Int
let items: [ReminderModel] = []             // Empty collection needs type
let result: Result<Data, Error> = .success(data)  // Complex type
```

**❌ Bad:**

```swift
let name: String = "John"     // Redundant type annotation
let count: Int = 42           // Redundant type annotation
let items = []                // Type cannot be inferred
```

---

## References

- [Google Swift Style Guide - Formatting](https://google.github.io/swift/#formatting)
- [Airbnb Swift Style Guide](https://github.com/airbnb/swift)
