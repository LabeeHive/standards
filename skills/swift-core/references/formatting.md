# Formatting

## Purpose

Swift formatting standards for Labee projects. Most of them are enforced by `swift-format`, so
this file covers only what the tool cannot decide for you.

---

## Run the formatter

```bash
xcrun swift-format lint --recursive .        # report
xcrun swift-format --recursive . --in-place  # fix
```

Each project's `.swift-format` is authoritative. Labee projects currently agree on 2-space
indentation, a 100-character line length, and at most one consecutive blank line, which also
match the tool's defaults — so do not restate those numbers in a review comment, run the tool.

`swift-format` decides indentation, line length, brace placement and spacing, trailing commas in
multi-line literals, blank-line runs, whitespace, and comment style: `/* */` block comments and
JavaDoc-style `/** */` documentation are both rejected in favour of `//` and `///`. Findings of
that kind belong to the tool, not to a reviewer.

Measured on a deliberately malformed file, `swift-format` reported 15 findings across those
categories and `swiftlint` reported 11. Neither reported anything on a file whose only problems
were the two below.

---

## Self usage

`swift-format` does not check this.

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

## Type inference

`swift-format` does not check this either — a redundant `: Bool = true` passes the tool cleanly.

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
