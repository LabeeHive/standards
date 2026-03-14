# ViewModel conventions

## Purpose

This document defines conventions for ViewModels in SwiftUI applications. ViewModels manage UI state and coordinate with UseCases to execute business logic.

> **Note:** This document targets macOS 14+ / iOS 17+. Use `@Observable` for new code. Legacy `ObservableObject` patterns are provided for reference.

---

## Basic pattern - P1

**Rules:**
- Mark all ViewModels with `@MainActor`
- Use `@Observable` macro (recommended) or conform to `ObservableObject` (legacy)
- Inject dependencies through the initializer
- Keep UI-bound properties minimal

### @Observable pattern (Recommended)

```swift
@MainActor
@Observable
class ProjectNameViewModel {
  // MARK: - Properties

  var items: [Item] = []
  var isLoading = false
  var errorMessage: String?

  // MARK: - Dependencies

  @ObservationIgnored
  private let fetchItemsUseCase: FetchItemsUseCaseProtocol

  @ObservationIgnored
  private let deleteItemUseCase: DeleteItemUseCaseProtocol

  // MARK: - Initialization

  init(
    fetchItemsUseCase: FetchItemsUseCaseProtocol = FetchItemsUseCase(),
    deleteItemUseCase: DeleteItemUseCaseProtocol = DeleteItemUseCase()
  ) {
    self.fetchItemsUseCase = fetchItemsUseCase
    self.deleteItemUseCase = deleteItemUseCase
  }

  // MARK: - Public methods

  func load() {
    Task {
      await fetchItems()
    }
  }

  func delete(_ item: Item) {
    Task {
      await deleteItem(item)
    }
  }

  // MARK: - Private methods

  private func fetchItems() async {
    isLoading = true
    defer { isLoading = false }

    do {
      items = try await fetchItemsUseCase.execute()
    } catch {
      errorMessage = error.localizedDescription
    }
  }

  private func deleteItem(_ item: Item) async {
    do {
      try await deleteItemUseCase.execute(item)
      items.removeAll { $0.id == item.id }
    } catch {
      errorMessage = error.localizedDescription
    }
  }
}
```

**Key points for @Observable:**
- Use `@ObservationIgnored` for dependencies (they don't need observation)
- No `@Published` needed - all properties are automatically observed
- Use `@State` in View to own the ViewModel
- Performance: Only accessed properties trigger view updates

### ObservableObject pattern (Legacy)

```swift
@MainActor
class ProjectNameViewModel: ObservableObject {
  // MARK: - Published properties

  @Published var items: [Item] = []
  @Published var isLoading = false
  @Published var errorMessage: String?

  // MARK: - Dependencies

  private let fetchItemsUseCase: FetchItemsUseCaseProtocol
  private let deleteItemUseCase: DeleteItemUseCaseProtocol

  // MARK: - Initialization

  init(
    fetchItemsUseCase: FetchItemsUseCaseProtocol = FetchItemsUseCase(),
    deleteItemUseCase: DeleteItemUseCaseProtocol = DeleteItemUseCase()
  ) {
    self.fetchItemsUseCase = fetchItemsUseCase
    self.deleteItemUseCase = deleteItemUseCase
  }

  // ... methods same as above
}
```

**When to use ObservableObject:**
- Targeting macOS 13 / iOS 16 or earlier
- Gradual migration from existing codebase

---

## @MainActor - P1

**Rules:**
- Apply `@MainActor` to all ViewModels
- This ensures UI updates happen on the main thread
- Required for Swift 6 strict concurrency compliance

**✅ Good:**

```swift
@MainActor
class SettingsViewModel: ObservableObject {
  @Published var settings: [Setting] = []

  func load() async {
    // Safe to update @Published properties
    settings = await fetchSettings()
  }
}
```

**❌ Bad:**

```swift
class SettingsViewModel: ObservableObject {
  @Published var settings: [Setting] = []

  func load() async {
    // May crash: updating @Published from background thread
    settings = await fetchSettings()
  }
}
```

---

## Dependency injection - P1

**Rules:**
- Inject all dependencies through the initializer
- Use protocol types for dependencies
- Provide default values for production implementations
- This enables easy testing with mocks

**✅ Good:**

```swift
@MainActor
class ReminderViewModel: ObservableObject {
  private let fetchUseCase: FetchRemindersUseCaseProtocol
  private let addUseCase: AddReminderUseCaseProtocol

  init(
    fetchUseCase: FetchRemindersUseCaseProtocol = FetchRemindersUseCase(),
    addUseCase: AddReminderUseCaseProtocol = AddReminderUseCase()
  ) {
    self.fetchUseCase = fetchUseCase
    self.addUseCase = addUseCase
  }
}
```

**❌ Bad:**

```swift
@MainActor
class ReminderViewModel: ObservableObject {
  // Hard-coded dependency - cannot test
  private let useCase = FetchRemindersUseCase()

  // Direct service access - skips UseCase layer
  private let service = ReminderService.shared
}
```

---

## Property observation - P1

### With @Observable (Recommended)

**Rules:**
- All properties are automatically observed
- Use `@ObservationIgnored` for properties that should not trigger updates
- Dependencies should always be `@ObservationIgnored`

**✅ Good:**

```swift
@MainActor
@Observable
class ProjectNameViewModel {
  // UI-bound properties (automatically observed)
  var visibleItems: [Item] = []
  var isLoading = false
  var errorMessage: String?

  // Internal state (not observed)
  @ObservationIgnored
  private var allItems: [Item] = []

  @ObservationIgnored
  private var cache: [String: Data] = [:]

  // Dependencies (never observed)
  @ObservationIgnored
  private let useCase: SomeUseCaseProtocol
}
```

### With ObservableObject (Legacy)

**Rules:**
- Use `@Published` only for properties that drive UI updates
- Do not use `@Published` for internal state or caches
- Keep the number of `@Published` properties minimal

**✅ Good:**

```swift
@MainActor
class ProjectNameViewModel: ObservableObject {
  // UI-bound properties
  @Published var visibleItems: [Item] = []
  @Published var isLoading = false
  @Published var errorMessage: String?

  // Internal state (not @Published)
  private var allItems: [Item] = []
  private var cache: [String: Data] = [:]
}
```

**❌ Bad:**

```swift
@MainActor
class ProjectNameViewModel: ObservableObject {
  @Published var items: [Item] = []
  @Published private var cache: [String: Data] = [:]  // Cache doesn't need UI updates
  @Published private var lastFetchDate: Date?         // Internal tracking
}
```

---

## Delegate to UseCases - P1

**Rules:**
- ViewModels should not contain business logic
- Delegate business rules to UseCases
- ViewModels only handle presentation logic

**✅ Good:**

```swift
@MainActor
class AddReminderViewModel: ObservableObject {
  @Published var title = ""
  @Published var errorMessage: String?

  private let addReminderUseCase: AddReminderUseCaseProtocol

  func save() async {
    do {
      // UseCase handles validation and creation
      try await addReminderUseCase.execute(title: title)
    } catch {
      errorMessage = error.localizedDescription
    }
  }
}
```

**❌ Bad:**

```swift
@MainActor
class AddReminderViewModel: ObservableObject {
  @Published var title = ""

  func save() async {
    // Business logic in ViewModel
    guard !title.isEmpty else { return }
    guard title.count <= 100 else { return }
    let trimmed = title.trimmingCharacters(in: .whitespaces)

    // Direct repository access
    try? await repository.create(title: trimmed)
  }
}
```

---

## Anti-patterns - P1

### Massive ViewModels

**Problem:** ViewModels exceeding 500-1000 lines become difficult to maintain.

**Solution:** Split responsibilities into multiple ViewModels or extract logic to UseCases.

**❌ Bad:**

```swift
@MainActor
class MassiveViewModel: ObservableObject {
  // 1000+ lines of mixed responsibilities
  // Handles list, detail, editing, settings...
}
```

**✅ Good:**

```swift
@MainActor
class ItemListViewModel: ObservableObject { }

@MainActor
class ItemDetailViewModel: ObservableObject { }

@MainActor
class ItemEditorViewModel: ObservableObject { }
```

---

### Business rules in ViewModel

**Problem:** Mixing business rules with presentation logic makes testing difficult.

**❌ Bad:**

```swift
@MainActor
class OrderViewModel: ObservableObject {
  func calculateTotal() -> Decimal {
    // Business rule: 10% discount for orders over $100
    let subtotal = items.reduce(0) { $0 + $1.price }
    if subtotal > 100 {
      return subtotal * 0.9
    }
    return subtotal
  }
}
```

**✅ Good:**

```swift
// In UseCase
class CalculateOrderTotalUseCase {
  func execute(items: [OrderItem]) -> Decimal {
    let subtotal = items.reduce(0) { $0 + $1.price }
    if subtotal > 100 {
      return subtotal * 0.9
    }
    return subtotal
  }
}

// In ViewModel
@MainActor
class OrderViewModel: ObservableObject {
  private let calculateTotalUseCase: CalculateOrderTotalUseCaseProtocol

  var total: Decimal {
    calculateTotalUseCase.execute(items: items)
  }
}
```

---

## References

- [Architecture](architecture.md)
- [SwiftUI conventions](swiftui.md)
- [Testing](testing.md)
- [Apple Observation Framework](https://developer.apple.com/documentation/observation)
- [Migrating to @Observable](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro)
- [SwiftLee - @Observable Macro](https://www.avanderlee.com/swiftui/observable-macro-performance-increase-observableobject/)
