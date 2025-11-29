# File structure

## Purpose

This document defines the standard structure for Swift source files. Consistent file organization improves navigation, maintainability, and code review efficiency.

---

## File organization - P1

**Rules:**
- Follow a consistent order within each file
- Group related elements together
- Use `// MARK:` comments to separate sections

**Standard order:**

```swift
// 1. Import statements
import Foundation
import SwiftUI

// 2. Protocol definitions (if any)
protocol ProjectNameServiceProtocol {
  func fetchData() async throws -> [DataModel]
}

// 3. Main type definition
class ProjectNameService: ProjectNameServiceProtocol {
  // 3.1 Type aliases and nested types
  typealias CompletionHandler = (Result<Data, Error>) -> Void

  // 3.2 Static properties
  static let shared = ProjectNameService()

  // 3.3 Instance properties
  private let baseURL: String
  @Published var items: [Item] = []

  // 3.4 Initialization
  init(baseURL: String = "https://api.example.com") {
    self.baseURL = baseURL
  }

  // 3.5 Public methods
  func fetchData() async throws -> [DataModel] {
    // Implementation
  }

  // 3.6 Private methods
  private func processData(_ data: Data) -> [DataModel] {
    // Implementation
  }
}

// 4. Extensions
extension ProjectNameService {
  func additionalMethod() { }
}
```

---

## Import statements - P1

**Rules:**
- Group imports by category
- Order: Standard library → Apple frameworks → Third-party → Local modules
- Separate groups with blank lines

**✅ Good:**

```swift
import Foundation
import SwiftUI

import EventKit
import UserNotifications

@testable import ProjectName
```

**❌ Bad:**

```swift
import EventKit
import Foundation
@testable import ProjectName
import SwiftUI
```

---

## Type member order - P1

**Rules:**
- Follow this order within types:
  1. Type aliases and nested types
  2. Static properties
  3. Instance properties
  4. Initializers
  5. Public methods
  6. Private methods

**✅ Good:**

```swift
class ProjectNameViewModel: ObservableObject {
  // MARK: - Type aliases

  typealias ItemID = String

  // MARK: - Static properties

  static let defaultTimeout: TimeInterval = 30

  // MARK: - Properties

  @Published var items: [Item] = []
  @Published var isLoading = false
  private let repository: RepositoryProtocol

  // MARK: - Initialization

  init(repository: RepositoryProtocol) {
    self.repository = repository
  }

  // MARK: - Public methods

  func load() async {
    // Implementation
  }

  // MARK: - Private methods

  private func process(_ data: Data) {
    // Implementation
  }
}
```

---

## MARK comments - P1

**Rules:**
- Use `// MARK: -` for major sections (includes separator line)
- Use `// MARK:` for subsections (no separator line)
- Keep section names concise and consistent

**✅ Good:**

```swift
// MARK: - Properties

@Published var items: [Item] = []

// MARK: - Initialization

init() { }

// MARK: - Public methods

func load() { }

// MARK: - Private methods

private func process() { }
```

**❌ Bad:**

```swift
// MARK: Properties for the view model
// MARK: - - - Properties - - -
//MARK: - Properties  // Missing space
/* MARK: Properties */  // Wrong comment style
```

---

## Extensions - P2

**Rules:**
- Place extensions at the end of the file
- Use extensions to group protocol conformances
- One protocol conformance per extension when it adds significant functionality

**✅ Good:**

```swift
class ProjectNameViewController: UIViewController {
  // Main implementation
}

// MARK: - UITableViewDataSource

extension ProjectNameViewController: UITableViewDataSource {
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    items.count
  }

  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    // Implementation
  }
}

// MARK: - UITableViewDelegate

extension ProjectNameViewController: UITableViewDelegate {
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    // Implementation
  }
}
```

---

## File naming - P1

**Rules:**
- File name should match the primary type name
- Use `.swift` extension
- One primary type per file

**✅ Good:**

```
ReminderService.swift         // Contains class ReminderService
ReminderModel.swift           // Contains struct ReminderModel
FetchRemindersUseCase.swift   // Contains class FetchRemindersUseCase
ReminderServiceProtocol.swift // Contains protocol ReminderServiceProtocol
```

**❌ Bad:**

```
Services.swift                // Multiple types
reminderService.swift         // Lowercase
Reminder-Service.swift        // Hyphenated
```

---

## Directory structure - P2

**Recommended structure:**

```
ProjectName/
├── App/
│   ├── ProjectNameApp.swift
│   └── AppDelegate.swift
├── Views/
│   ├── ContentView.swift
│   └── SettingsView.swift
├── ViewModels/
│   ├── ContentViewModel.swift
│   └── SettingsViewModel.swift
├── UseCases/
│   ├── FetchRemindersUseCase.swift
│   └── AddReminderUseCase.swift
├── Repositories/
│   ├── ReminderRepository.swift
│   └── ReminderRepositoryProtocol.swift
├── Models/
│   ├── ReminderModel.swift
│   └── ReminderList.swift
└── Utilities/
    ├── Extensions/
    └── Helpers/
```

---

## References

- [Google Swift Style Guide - File Structure](https://google.github.io/swift/#file-structure)
- [Apple Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
