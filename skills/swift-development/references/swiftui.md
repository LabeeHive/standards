# SwiftUI conventions

## Purpose

This document defines conventions for SwiftUI Views. Following these conventions ensures consistent, maintainable, and testable UI code.

> **Note:** This document targets macOS 14+ / iOS 17+, which supports the Observation framework (`@Observable`).

---

## State management patterns - P1

### @Observable vs ObservableObject

Use `@Observable` for new code. It provides better performance through granular property tracking.

| Aspect | @Observable (Recommended) | ObservableObject (Legacy) |
|--------|---------------------------|---------------------------|
| Performance | Better - tracks only accessed properties | All @Published trigger redraws |
| Boilerplate | Less - no @Published needed | More - requires @Published |
| Property wrapper | `@State` / `@Environment` | `@StateObject` / `@EnvironmentObject` |
| Minimum target | macOS 14+ / iOS 17+ | macOS 10.15+ / iOS 13+ |

**✅ Good (@Observable):**

```swift
@Observable
class ContentViewModel {
  var items: [Item] = []
  var isLoading = false
}

struct ContentView: View {
  @State private var viewModel = ContentViewModel()
  // ...
}
```

**Legacy (ObservableObject):**

```swift
class ContentViewModel: ObservableObject {
  @Published var items: [Item] = []
  @Published var isLoading = false
}

struct ContentView: View {
  @StateObject private var viewModel = ContentViewModel()
  // ...
}
```

### @Environment vs @EnvironmentObject - P1

Use `@Environment` with `@Observable` for type-safe environment injection.

| Aspect | @Environment (Recommended) | @EnvironmentObject (Legacy) |
|--------|----------------------------|----------------------------|
| Type safety | Compile-time | Runtime (crash if missing) |
| Usage | `@Environment(MyType.self)` | `@EnvironmentObject var obj: MyType` |
| For | @Observable classes | ObservableObject classes |

**✅ Good (@Environment):**

```swift
// App entry point
@main
struct MyApp: App {
  @State private var appState = AppState()

  var body: some Scene {
    WindowGroup {
      ContentView()
        .environment(appState)
    }
  }
}

// Child view
struct ChildView: View {
  @Environment(AppState.self) private var appState
  // ...
}
```

**Legacy (@EnvironmentObject):**

```swift
// App entry point
@main
struct MyApp: App {
  @StateObject private var appState = AppState()

  var body: some Scene {
    WindowGroup {
      ContentView()
        .environmentObject(appState)
    }
  }
}

// Child view - crashes if .environmentObject() is missing
struct ChildView: View {
  @EnvironmentObject var appState: AppState
  // ...
}
```

### @Bindable for two-way binding - P1

Use `@Bindable` when you need bindings to an `@Observable` object's properties but don't own the instance.

```swift
struct EditView: View {
  @Bindable var item: Item  // Item is @Observable

  var body: some View {
    TextField("Name", text: $item.name)
  }
}
```

---

## View structure - P1

**Rules:**
- Follow a consistent property order
- Extract complex subviews using `@ViewBuilder`
- Keep `body` concise and readable

**Standard structure:**

```swift
struct ProjectNameView: View {
  // 1. Environment properties
  @Environment(\.dismiss) private var dismiss
  @Environment(\.colorScheme) private var colorScheme

  // 2. State properties
  @State private var isLoading = false
  @State private var searchText = ""

  // 3. Binding and observed properties
  @Binding var selectedItem: Item?
  @StateObject private var viewModel = ProjectNameViewModel()

  // 4. Regular properties
  let title: String
  let items: [Item]

  // 5. Body
  var body: some View {
    content
      .navigationTitle(title)
      .onAppear { viewModel.load() }
  }

  // 6. Subviews
  @ViewBuilder
  private var content: some View {
    if isLoading {
      loadingView
    } else {
      itemList
    }
  }

  @ViewBuilder
  private var loadingView: some View {
    ProgressView()
  }

  @ViewBuilder
  private var itemList: some View {
    List(items) { item in
      ItemRow(item: item)
    }
  }

  // 7. Methods
  private func handleSelection(_ item: Item) {
    selectedItem = item
  }
}
```

---

## Property order - P1

**Rules:**
- Follow this order for properties:
  1. `@Environment` properties
  2. `@State` properties
  3. `@Binding`, `@Bindable`, `@StateObject`, `@ObservedObject` properties
  4. Regular properties (`let`, `var`)
  5. `body`
  6. `@ViewBuilder` subviews
  7. Methods

**✅ Good (@Observable pattern):**

```swift
struct ContentView: View {
  @Environment(\.dismiss) private var dismiss
  @Environment(AppState.self) private var appState
  @State private var text = ""
  @State private var viewModel = ContentViewModel()
  @Bindable var item: Item
  let title: String

  var body: some View {
    // ...
  }
}
```

**✅ Good (Legacy ObservableObject pattern):**

```swift
struct ContentView: View {
  @Environment(\.dismiss) private var dismiss
  @State private var text = ""
  @Binding var isPresented: Bool
  @StateObject private var viewModel = ContentViewModel()
  let title: String

  var body: some View {
    // ...
  }
}
```

**❌ Bad:**

```swift
struct ContentView: View {
  let title: String                              // Regular property before State
  @StateObject private var viewModel = VM()      // Before State
  @State private var text = ""
  @Environment(\.dismiss) private var dismiss    // Environment after State

  var body: some View { }
}
```

---

## View composition - P1

**Rules:**
- Extract complex subviews using `@ViewBuilder` computed properties
- Keep `body` clean by delegating to subviews
- Avoid deeply nested view hierarchies in `body`

**✅ Good:**

```swift
var body: some View {
  VStack {
    headerView
    contentView
    footerView
  }
}

@ViewBuilder
private var headerView: some View {
  HStack {
    Text(title)
    Spacer()
    Button("Close") { dismiss() }
  }
  .padding()
}

@ViewBuilder
private var contentView: some View {
  ScrollView {
    LazyVStack {
      ForEach(items) { item in
        ItemRow(item: item)
      }
    }
  }
}
```

**❌ Bad:**

```swift
var body: some View {
  VStack {
    HStack {
      Text(title)
      Spacer()
      Button("Close") { dismiss() }
    }
    .padding()
    ScrollView {
      LazyVStack {
        ForEach(items) { item in
          HStack {
            // Many more nested views...
          }
        }
      }
    }
    HStack {
      // Footer content...
    }
  }
}
```

---

## No business logic in Views - P1

**Rules:**
- Views should only handle presentation logic
- Delegate business logic to ViewModels
- Delegate complex operations to UseCases

**✅ Good:**

```swift
struct ReminderView: View {
  @StateObject private var viewModel = ReminderViewModel()

  var body: some View {
    Button("Save") {
      viewModel.save()
    }
    .disabled(!viewModel.canSave)
  }
}
```

**❌ Bad:**

```swift
struct ReminderView: View {
  @State private var title = ""

  var body: some View {
    Button("Save") {
      // Business logic in View
      if title.count > 10 && !title.isEmpty {
        let reminder = ReminderModel(title: title.trimmingCharacters(in: .whitespaces))
        ReminderService.shared.save(reminder)
      }
    }
  }
}
```

---

## No direct Repository access - P1

**Rules:**
- Never call Services or Repositories directly from Views
- Always go through ViewModel

**✅ Good:**

```swift
Button("Submit") {
  viewModel.submitFeedback()
}
```

**❌ Bad:**

```swift
Button("Submit") {
  FeedbackRepository.shared.submit(feedback: text)
}
```

---

## Preview providers - P2

**Rules:**
- Provide previews for all Views
- Include multiple preview configurations when useful
- Use mock data for previews

**✅ Good:**

```swift
#Preview("Default") {
  ProjectNameView(title: "Sample", items: Item.samples)
}

#Preview("Empty State") {
  ProjectNameView(title: "Empty", items: [])
}

#Preview("Dark Mode") {
  ProjectNameView(title: "Dark", items: Item.samples)
    .preferredColorScheme(.dark)
}
```

---

## Modifiers - P2

**Rules:**
- Apply modifiers in a logical order
- Group related modifiers together
- Extract repeated modifier combinations into custom view modifiers

**✅ Good:**

```swift
Text("Hello")
  .font(.headline)
  .foregroundStyle(.primary)
  .padding()
  .background(.secondarySystemBackground)
  .clipShape(RoundedRectangle(cornerRadius: 8))
```

> **Note:** Use `clipShape(RoundedRectangle(cornerRadius:))` instead of the deprecated `cornerRadius(_:)`.

**Custom modifier example:**

```swift
struct CardModifier: ViewModifier {
  func body(content: Content) -> some View {
    content
      .padding()
      .background(.secondarySystemBackground)
      .clipShape(RoundedRectangle(cornerRadius: 8))
      .shadow(radius: 2)
  }
}

extension View {
  func cardStyle() -> some View {
    modifier(CardModifier())
  }
}

// Usage
Text("Content")
  .cardStyle()
```

---

## References

- [ViewModel conventions](viewmodel.md)
- [Apple SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Apple Observation Framework](https://developer.apple.com/documentation/observation)
- [Migrating to @Observable](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro)
- [SwiftLee - @Observable Macro](https://www.avanderlee.com/swiftui/observable-macro-performance-increase-observableobject/)
