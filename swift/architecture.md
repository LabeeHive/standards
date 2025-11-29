# Architecture

## Purpose

This document defines the architecture pattern for Swift applications at Labee LLC. This standard uses a Layered MVVM architecture that provides clear separation of concerns, testability, and maintainability.

> **Note:** This architecture is inspired by Clean Architecture but is not a strict implementation. See [Industry comparison](comparison_with_industry.md) for details on the differences.

---

## Layer structure - P1

```
┌─────────────────────────────────────┐
│     View                            │  SwiftUI Views
├─────────────────────────────────────┤
│     ViewModel                       │  UI state, @MainActor
├─────────────────────────────────────┤
│     UseCase                         │  Business logic (conditional)
├─────────────────────────────────────┤
│     Repository                      │  Data access + External systems
└─────────────────────────────────────┘
```

**Data flow:**

```
View → ViewModel → UseCase → Repository
             ↘ Repository (pure CRUD can skip UseCase)
```

---

## View layer - P1

**Responsibilities:**
- Render UI using SwiftUI
- Handle user input
- Display ViewModel state
- Trigger ViewModel actions

**Prohibited:**
- Business logic
- Data transformation
- Direct Repository access

**Example:**

```swift
struct ReminderListView: View {
  @StateObject private var viewModel = ReminderListViewModel()

  var body: some View {
    List(viewModel.reminders) { reminder in
      ReminderRow(reminder: reminder)
    }
    .onAppear { viewModel.load() }
  }
}
```

---

## ViewModel layer - P1

**Responsibilities:**
- Manage UI state with `@Published`
- Call UseCases to execute business logic
- Transform errors into user-friendly messages
- Handle presentation logic

**Prohibited:**
- Business rules (validation, transformation)
- Data persistence logic

**Example:**

```swift
@MainActor
class ReminderListViewModel: ObservableObject {
  @Published var reminders: [ReminderModel] = []
  @Published var isLoading = false
  @Published var errorMessage: String?

  private let fetchRemindersUseCase: FetchRemindersUseCaseProtocol

  init(fetchRemindersUseCase: FetchRemindersUseCaseProtocol = FetchRemindersUseCase()) {
    self.fetchRemindersUseCase = fetchRemindersUseCase
  }

  func load() {
    Task {
      isLoading = true
      defer { isLoading = false }

      do {
        reminders = try await fetchRemindersUseCase.execute()
      } catch {
        errorMessage = error.localizedDescription
      }
    }
  }
}
```

---

## UseCase layer - P1

**Responsibilities:**
- Implement business logic
- Validate business rules
- Coordinate multiple Repositories
- Manage transactions

**Prohibited:**
- UI logic
- Direct framework access (EventKit, UserDefaults)
- Presentation formatting

### UseCase usage criteria - P1

**UseCase required (any of these):**
- Validation logic exists
- Data transformation required
- Multiple Repositories coordinated
- Reused across multiple ViewModels

**Repository direct allowed (all of these):**
- Pure CRUD operation
- No validation
- No data transformation
- Single Repository only
- Used only in that ViewModel

**Principle: When in doubt, create a UseCase.**

**Example:**

```swift
protocol AddReminderUseCaseProtocol {
  func execute(
    title: String,
    notes: String?,
    dueDate: Date?,
    listID: String?
  ) async throws -> ReminderModel
}

class AddReminderUseCase: AddReminderUseCaseProtocol {
  private let repository: ReminderRepositoryProtocol

  init(repository: ReminderRepositoryProtocol = ReminderRepository()) {
    self.repository = repository
  }

  func execute(
    title: String,
    notes: String?,
    dueDate: Date?,
    listID: String?
  ) async throws -> ReminderModel {
    // Business logic: validation
    try ReminderValidator.validateTitle(title)

    // Business logic: data preparation
    let preparedTitle = ReminderValidator.prepareTitle(title)
    let preparedNotes = notes?.nilIfEmpty

    // Delegate to Repository
    return try await repository.create(
      title: preparedTitle,
      notes: preparedNotes,
      dueDate: dueDate,
      listID: listID
    )
  }
}
```

---

## Repository layer - P1

**Responsibilities:**
- Abstract data access
- Integrate with external systems (EventKit, APIs, UserDefaults)
- Implement caching strategies
- Transform data between layers
- Hide persistence and external system details

**Prohibited:**
- Business logic
- UI logic

**Example:**

```swift
protocol ReminderRepositoryProtocol {
  func fetchAll() async throws -> [ReminderModel]
  func create(
    title: String,
    notes: String?,
    dueDate: Date?,
    listID: String?
  ) async throws -> ReminderModel
  func update(_ reminder: ReminderModel) async throws -> ReminderModel
  func delete(_ reminderID: String) async throws
  var isAuthorized: Bool { get }
}

class ReminderRepository: ReminderRepositoryProtocol {
  private let eventStore: EKEventStore

  init(eventStore: EKEventStore = EKEventStore()) {
    self.eventStore = eventStore
  }

  var isAuthorized: Bool {
    EKEventStore.authorizationStatus(for: .reminder) == .fullAccess
  }

  func fetchAll() async throws -> [ReminderModel] {
    // EventKit integration
    let predicate = eventStore.predicateForReminders(in: nil)
    let reminders = try await eventStore.reminders(matching: predicate)
    return reminders.map { ReminderModel(from: $0) }
  }

  func create(
    title: String,
    notes: String?,
    dueDate: Date?,
    listID: String?
  ) async throws -> ReminderModel {
    let reminder = EKReminder(eventStore: eventStore)
    reminder.title = title
    reminder.notes = notes
    // ... configure reminder
    try eventStore.save(reminder, commit: true)
    return ReminderModel(from: reminder)
  }

  // Other implementations...
}
```

---

## Dependency injection - P1

**Rules:**
- All dependencies are injected through initializers
- Use protocol types for dependencies
- Provide default values for production implementations

**Example:**

```swift
class SettingsViewModel: ObservableObject {
  private let feedbackRepository: FeedbackRepositoryProtocol

  init(feedbackRepository: FeedbackRepositoryProtocol = FeedbackRepository.shared) {
    self.feedbackRepository = feedbackRepository
  }
}
```

---

## Data flow - P1

```
User action
    │
    ▼
View ─────────────► ViewModel
                        │
                        ▼
                UseCase (if needed)
                        │
                        ▼
                    Repository
                        │
                        ▼
                External system (EventKit, API, etc.)
                        │
                        ▼
                    Repository
                        │
                        ▼
                UseCase (if needed)
                        │
                        ▼
ViewModel ◄───────── Result
    │
    ▼
View update
```

---

## Directory structure - P2

```
ProjectName/
├── App/
│   ├── ProjectNameApp.swift
│   └── AppDelegate.swift
├── Views/
│   ├── ReminderListView.swift
│   └── SettingsView.swift
├── ViewModels/
│   ├── ReminderListViewModel.swift
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

## Anti-patterns - P1

### Direct Repository access from View

**❌ Bad:**

```swift
Button("Submit") {
  FeedbackRepository.shared.submit(feedback: text)
}
```

**✅ Good:**

```swift
Button("Submit") {
  viewModel.submitFeedback()
}
```

---

### Business rules in ViewModel

**❌ Bad:**

```swift
@MainActor
class ReminderViewModel: ObservableObject {
  func validate() -> Bool {
    // Business rules in ViewModel
    return title.count >= 3 && title.count <= 100
  }
}
```

**✅ Good:**

```swift
class AddReminderUseCase {
  func execute(title: String) throws {
    try ReminderValidator.validateTitle(title)
    // ...
  }
}
```

---

### UI logic in Repository

**❌ Bad:**

```swift
class ReminderRepository {
  func fetchAndFormat() -> String {
    let reminders = fetchReminders()
    return reminders.map { "• \($0.title)" }.joined(separator: "\n")
  }
}
```

**✅ Good:**

```swift
// Repository returns raw data
class ReminderRepository {
  func fetchReminders() -> [ReminderModel] { }
}

// ViewModel handles formatting
@MainActor
class ReminderViewModel {
  var formattedList: String {
    reminders.map { "• \($0.title)" }.joined(separator: "\n")
  }
}
```

---

## References

- [Industry comparison](comparison_with_industry.md)
- [Uncle Bob's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [iOS Clean Architecture MVVM](https://github.com/kudoleh/iOS-Clean-Architecture-MVVM)
