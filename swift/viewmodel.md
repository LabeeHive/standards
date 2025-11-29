# ViewModel conventions

## Purpose

This document defines conventions for ViewModels in SwiftUI applications. ViewModels manage UI state and coordinate with UseCases to execute business logic.

---

## Basic pattern - P1

**Rules:**
- Mark all ViewModels with `@MainActor`
- Conform to `ObservableObject`
- Inject dependencies through the initializer
- Use `@Published` only for UI-bound properties

**Standard pattern:**

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

## @Published usage - P1

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
- [Testing](testing.md)
- [Apple Observation Framework](https://developer.apple.com/documentation/observation)
