# Mock patterns

## Purpose

This document defines patterns for creating and using mocks in tests. Proper mocking enables isolated unit tests that are fast, reliable, and maintainable.

---

## Critical rule

**All tests must use mocks. Tests must never affect real services or data.**

### Forbidden in tests

- `ReminderService.shared` or any real singleton
- `UserDefaults.standard`
- `EKEventStore` direct instantiation
- Real network communication
- File system modifications
- Database operations

---

## Mock structure

**Rules:**
- Include call tracking properties
- Include return value control properties
- Include error control properties
- Match the protocol interface exactly

**Standard pattern:**

```swift
class MockReminderRepository: ReminderRepositoryProtocol {
  // MARK: - Call tracking

  var fetchAllCalled = false
  var createCalled = false
  var createParameters: (title: String, notes: String?, dueDate: Date?, listID: String?)?
  var deleteCalled = false
  var deleteID: String?

  // MARK: - Return value control

  var remindersToReturn: [ReminderModel] = []
  var reminderToReturn: ReminderModel?

  // MARK: - Error control

  var shouldThrowError = false
  var errorToThrow: Error = TestError.generic

  // MARK: - Protocol implementation

  func fetchAll() async throws -> [ReminderModel] {
    fetchAllCalled = true

    if shouldThrowError {
      throw errorToThrow
    }

    return remindersToReturn
  }

  func create(
    title: String,
    notes: String?,
    dueDate: Date?,
    listID: String?
  ) async throws -> ReminderModel {
    createCalled = true
    createParameters = (title, notes, dueDate, listID)

    if shouldThrowError {
      throw errorToThrow
    }

    return reminderToReturn ?? ReminderModel(id: "mock-id", title: title)
  }

  func delete(_ reminderID: String) async throws {
    deleteCalled = true
    deleteID = reminderID

    if shouldThrowError {
      throw errorToThrow
    }
  }
}
```

---

## Call tracking

**Rules:**
- Add a boolean `xxxCalled` property for each method
- Add a `xxxParameters` property to capture arguments

**Example:**

```swift
class MockFeedbackRepository: FeedbackRepositoryProtocol {
  // Call tracking
  var submitCalled = false
  var submitParameters: (feedback: String, email: String?)?

  func submit(feedback: String, email: String?) async throws {
    submitCalled = true
    submitParameters = (feedback, email)
  }
}

// In test
@Test func submitFeedback_CallsRepository() async throws {
  await viewModel.submitFeedback()

  #expect(mockRepository.submitCalled)
  #expect(mockRepository.submitParameters?.feedback == "Test feedback")
}
```

---

## Return value control

**Rules:**
- Add properties to configure return values
- Use optionals when the return value might not be set
- Provide sensible defaults

**Example:**

```swift
class MockUserRepository: UserRepositoryProtocol {
  // Return value control
  var userToReturn: User?
  var usersToReturn: [User] = []

  func fetchUser(id: String) async throws -> User? {
    return userToReturn
  }

  func fetchAllUsers() async throws -> [User] {
    return usersToReturn
  }
}

// In test
@Test func load_ReturnsUsers() async {
  mockRepository.usersToReturn = [User(id: "1", name: "John")]

  await viewModel.load()

  #expect(viewModel.users.count == 1)
}
```

---

## Error control

**Rules:**
- Add `shouldThrowError` boolean property
- Add `errorToThrow` property with a default value
- Check error condition at the start of methods

**Example:**

```swift
class MockReminderRepository: ReminderRepositoryProtocol {
  var shouldThrowError = false
  var errorToThrow: Error = TestError.generic

  func fetchAll() async throws -> [ReminderModel] {
    if shouldThrowError {
      throw errorToThrow
    }
    return remindersToReturn
  }
}

// In test
@Test func load_WhenRepositoryFails_SetsErrorMessage() async {
  mockRepository.shouldThrowError = true
  mockRepository.errorToThrow = RepositoryError.unauthorized

  await viewModel.load()

  #expect(viewModel.errorMessage != nil)
}
```

---

## Never mock UseCases

**Rules:**
- Mock Repositories, not UseCases
- Use real UseCases with mocked dependencies
- This ensures business logic is tested

**❌ Bad:**

```swift
class MockFetchRemindersUseCase: FetchRemindersUseCaseProtocol {
  var reminders: [ReminderModel] = []

  func execute() async throws -> [ReminderModel] {
    return reminders
  }
}

// Test uses mock UseCase - business logic is NOT tested
let viewModel = ReminderViewModel(useCase: MockFetchRemindersUseCase())
```

**✅ Good:**

```swift
// Mock Repository
let mockRepository = MockReminderRepository()
mockRepository.remindersToReturn = [testReminder]

// Real UseCase with mocked Repository
let useCase = FetchRemindersUseCase(repository: mockRepository)

// ViewModel with real UseCase
let viewModel = ReminderViewModel(useCase: useCase)
```

**Why avoid UseCase mocks?**
1. Skips business logic testing
2. Repository mocks already provide test data control
3. More mocks means more maintenance
4. Tests become less reliable

---

## Test setup with mocks

**Example:**

```swift
struct AddReminderUseCaseTests {
  let mockRepository: MockReminderRepository
  let sut: AddReminderUseCase

  init() {
    mockRepository = MockReminderRepository()
    sut = AddReminderUseCase(repository: mockRepository)
  }

  @Test func execute_WithValidTitle_CallsRepository() async throws {
    // Arrange
    mockRepository.reminderToReturn = ReminderModel(id: "1", title: "Test")

    // Act
    _ = try await sut.execute(
      title: "Test",
      notes: nil,
      dueDate: nil,
      listID: nil
    )

    // Assert
    #expect(mockRepository.createCalled)
    #expect(mockRepository.createParameters?.title == "Test")
  }
}
```

---

## Reset helper

**Rules:**
- Add a `reset()` method for tests that need multiple arrangements
- Reset all tracking and configuration properties

**Example:**

```swift
class MockReminderRepository: ReminderRepositoryProtocol {
  // ... properties ...

  func reset() {
    fetchAllCalled = false
    createCalled = false
    createParameters = nil
    deleteCalled = false
    deleteID = nil
    remindersToReturn = []
    reminderToReturn = nil
    shouldThrowError = false
    errorToThrow = TestError.generic
  }
}
```

---

## Test error enum

**Rules:**
- Create a simple error enum for tests
- Use descriptive case names

**Example:**

```swift
enum TestError: Error {
  case generic
  case networkError
  case unauthorized
  case notFound
  case validationFailed
}
```

---

## Repository mocks with external systems

**Example:**

```swift
class MockEventKitRepository: EventKitRepositoryProtocol {
  // Call tracking
  var fetchRemindersCalled = false
  var createReminderCalled = false
  var requestAccessCalled = false

  // Return value control
  var remindersToReturn: [ReminderModel] = []
  var isAuthorizedToReturn = true

  // Error control
  var shouldThrowError = false
  var errorToThrow: Error = TestError.generic

  // Protocol implementation
  var isAuthorized: Bool {
    return isAuthorizedToReturn
  }

  func fetchReminders() async throws -> [ReminderModel] {
    fetchRemindersCalled = true

    if shouldThrowError {
      throw errorToThrow
    }

    return remindersToReturn
  }

  func requestAccess() async -> Bool {
    requestAccessCalled = true
    return isAuthorizedToReturn
  }
}
```

---

## Pre-test checklist

Before running tests, verify:

- [ ] All dependencies are mocked
- [ ] No real singletons are used
- [ ] No file system modifications
- [ ] No network communication
- [ ] No database operations
- [ ] No system settings changes

---

## System dependency abstraction

Abstract system APIs (Timer, Task.sleep-based delay, Date, UUID, etc.) to make code testable without real delays or non-deterministic values.

### Timer abstraction

**Protocol definition:**

```swift
protocol TimerProviderProtocol {
  func scheduledTimer(
    withTimeInterval interval: TimeInterval,
    repeats: Bool,
    block: @escaping () -> Void
  ) -> TimerToken
}

protocol TimerToken {
  func invalidate()
}
```

**Default implementation:**

```swift
final class DefaultTimerProvider: TimerProviderProtocol {
  func scheduledTimer(
    withTimeInterval interval: TimeInterval,
    repeats: Bool,
    block: @escaping () -> Void
  ) -> TimerToken {
    let timer = Timer.scheduledTimer(
      withTimeInterval: interval,
      repeats: repeats
    ) { _ in block() }
    return DefaultTimerToken(timer: timer)
  }
}
```

**Mock implementation:**

```swift
final class MockTimerProvider: TimerProviderProtocol {
  var scheduledTimerCallCount = 0
  private(set) var storedHandler: (() -> Void)?

  func scheduledTimer(
    withTimeInterval interval: TimeInterval,
    repeats: Bool,
    block: @escaping () -> Void
  ) -> TimerToken {
    scheduledTimerCallCount += 1
    storedHandler = block
    return MockTimerToken(provider: self)
  }

  /// Fire the timer callback synchronously
  func fire() {
    storedHandler?()
  }
}
```

**Usage in production:**

```swift
class MouseTracker {
  private let timerProvider: TimerProviderProtocol

  init(timerProvider: TimerProviderProtocol = DefaultTimerProvider()) {
    self.timerProvider = timerProvider
  }
}
```

**Usage in tests:**

```swift
@Test func start_WhenTimerFires_CallsHandler() {
  let mockTimer = MockTimerProvider()
  let tracker = MouseTracker(timerProvider: mockTimer)

  tracker.start()
  mockTimer.fire()  // Synchronous, no sleep needed

  #expect(/* handler was called */)
}
```

### Task.sleep-based debounce abstraction (DebounceScheduler abstraction)

Debounce/delay logic implemented as `Task { try? await Task.sleep(nanoseconds:) }` has the same testability problem as `Timer`: the test must wait for the real delay. Injecting a "shortened" duration does not fix this — real waiting still happens, so timing skews under parallel test execution (CPU contention) make the test flaky.

**Determinism requires two things, not just the mock:** the owning type must be `@MainActor`-isolated (so `Task { [weak self] in ... }`, which captures a `@MainActor`-isolated `self`, is inferred `@MainActor` too, and cancelling a previous debounce task always happens on the same serial executor as the task body), **and** the mock must not resolve the delay until the test explicitly says so. A mock that returns immediately is not enough on its own: when a call site cancels a pending task and starts a replacement (the exact "rapid calls" scenario debounce exists for), resolving too early can race the replacement task before it has even reached its `sleep` call. Hold the delay as a suspended continuation and let the test resolve it once every expected call has actually started waiting.

**Protocol definition:**

```swift
protocol DebounceSchedulerProtocol: Sendable {
  func sleep(nanoseconds: UInt64) async throws
}
```

**Default implementation:**

```swift
struct SystemDebounceScheduler: DebounceSchedulerProtocol {
  func sleep(nanoseconds: UInt64) async throws {
    try await Task.sleep(nanoseconds: nanoseconds)
  }
}
```

**Mock implementation:**

A cancelled Task in a cancel-and-replace debounce still runs its body up to the cancellation check — it does reach `sleep(nanoseconds:)` and must still be counted. And a Task can be cancelled at any point relative to this mock's internal bookkeeping, including *before* its continuation is even registered. Get either of these wrong and a count-gated wait like `fireAll(afterSleepCallCount:)` can hang forever waiting for a call that will never be counted.

```swift
final class MockDebounceScheduler: DebounceSchedulerProtocol, @unchecked Sendable {
  private let lock = NSLock()
  private var nextID = 0
  private var pendingContinuations: [Int: CheckedContinuation<Void, Error>] = [:]
  private var cancelledIDs: Set<Int> = []
  private var countWaiters: [(threshold: Int, continuation: CheckedContinuation<Void, Never>)] = []

  private(set) var sleepCallCount = 0
  private(set) var lastNanoseconds: UInt64?

  func sleep(nanoseconds: UInt64) async throws {
    // Count first, unconditionally — even a Task that is already cancelled
    // still runs its body this far, and threshold waiters below must see it.
    lock.lock()
    sleepCallCount += 1
    lastNanoseconds = nanoseconds
    let id = nextID
    nextID += 1
    let readyWaiters = countWaiters.filter { sleepCallCount >= $0.threshold }
    countWaiters.removeAll { sleepCallCount >= $0.threshold }
    lock.unlock()
    // Resume outside the lock: a continuation's resume can synchronously
    // re-enter this class on another thread.
    for waiter in readyWaiters { waiter.continuation.resume() }

    try await withTaskCancellationHandler {
      try await withCheckedThrowingContinuation { continuation in
        lock.lock()
        if cancelledIDs.remove(id) != nil {
          // Cancelled before we got here (see onCancel below) — resolve now.
          lock.unlock()
          continuation.resume(throwing: CancellationError())
        } else {
          pendingContinuations[id] = continuation
          lock.unlock()
        }
      }
    } onCancel: {
      lock.lock()
      let pending = pendingContinuations.removeValue(forKey: id)
      if pending == nil {
        // Registration hasn't happened yet — leave a marker for it to see.
        cancelledIDs.insert(id)
      }
      lock.unlock()
      pending?.resume(throwing: CancellationError())
    }
  }

  /// Resolves all pending sleeps, simulating debounce/timer completion.
  func fireAll() {
    lock.lock()
    let continuations = pendingContinuations
    pendingContinuations.removeAll()
    lock.unlock()

    for continuation in continuations.values {
      continuation.resume()
    }
  }

  /// Waits until `count` `sleep(nanoseconds:)` calls have been recorded —
  /// including calls made by Tasks that were already cancelled before
  /// reaching `sleep` — then fires. This uses a continuation-based waiter
  /// registered under the same lock as the counter, never a `Task.yield()`
  /// poll loop: polling has no forward-progress guarantee on the cooperative
  /// thread pool and can hang indefinitely.
  func fireAll(afterSleepCallCount count: Int) async {
    await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
      lock.lock()
      if sleepCallCount >= count {
        lock.unlock()
        continuation.resume()
      } else {
        countWaiters.append((threshold: count, continuation: continuation))
        lock.unlock()
      }
    }
    fireAll()
  }
}
```

**Usage in production:**

```swift
@MainActor
final class FloatingReminderViewModel {
  private let debounceScheduler: DebounceSchedulerProtocol
  private var colorUpdateTask: Task<Void, Never>?
  private(set) var committedColor: Color?

  init(debounceScheduler: DebounceSchedulerProtocol = SystemDebounceScheduler()) {
    self.debounceScheduler = debounceScheduler
  }

  func updateListColor(_ color: Color) {
    colorUpdateTask?.cancel()
    let scheduler = debounceScheduler
    colorUpdateTask = Task { [weak self] in
      try? await scheduler.sleep(nanoseconds: 300_000_000)
      guard !Task.isCancelled else { return }
      self?.committedColor = color
    }
  }

  // Test-only: wait for the current debounce cycle to finish without
  // exposing the underlying Task itself.
  func awaitPendingColorUpdate() async {
    await colorUpdateTask?.value
  }
}
```

**Usage in tests:**

```swift
@MainActor
@Test func updateListColor_DebouncesRapidCalls_OnlyCommitsLastColor() async {
  let mockScheduler = MockDebounceScheduler()
  let viewModel = FloatingReminderViewModel(debounceScheduler: mockScheduler)

  viewModel.updateListColor(.red)
  viewModel.updateListColor(.blue)

  // Wait until both the cancelled first task and the active second task
  // have reached `sleep`, then resolve both at once.
  await mockScheduler.fireAll(afterSleepCallCount: 2)
  await viewModel.awaitPendingColorUpdate()

  #expect(viewModel.committedColor == .blue)  // No real sleep: deterministic
}
```

**Rules:**
- Isolate the owning type (and its tests) with `@MainActor` so cancellation and task execution share the same serial executor
- Never resolve a mocked delay before every expected `sleep` call has been recorded — use a call-count gate like `fireAll(afterSleepCallCount:)`, not a bare `fireAll()`, whenever a call site cancels and replaces a pending task
- Never wait for a call-count gate with a `Task.yield()` poll loop (`while condition { await Task.yield() }`) — it has no forward-progress guarantee and can hang indefinitely; use a continuation-based waiter instead
- Count a `sleep` call *before* touching its cancellation state — a cancelled Task's body still runs far enough to call `sleep`, and it must still be counted, or a count-gated wait can hang forever
- Mutate the call counter, the continuation registry, and the waiter list under one lock, and only resume continuations after releasing it — resuming while holding the lock risks reentrancy, and mutating outside the lock risks a registration racing a resolve
- Handle cancellation with `withTaskCancellationHandler`, and account for the race where cancellation fires before the continuation is registered (mirror this with a "cancelled IDs" set, the same technique `TestClock` from `pointfreeco/swift-clocks` uses)
- Check `Task.isCancelled` (or `try Task.checkCancellation()`) immediately after the delay resolves — cancellation correctness must not depend on timing
- Never inject a shortened *real* duration to speed up tests; replace the delay mechanism itself so tests never wait on real time
- Expose a dedicated `awaitPendingXxx()` test-support method instead of making the debounce `Task` itself `private(set)` — this keeps the property genuinely private and gives tests only "wait until settled" semantics

**Timer vs. DebounceScheduler abstraction:**

| Situation | Use |
|-----------|-----|
| Callback-based, repeating, or `Timer.scheduledTimer`-driven code | Timer abstraction (`TimerProviderProtocol`) |
| Swift Concurrency delay (`Task.sleep`), one-shot debounce cancelled via `Task.cancel()` | DebounceScheduler abstraction (`DebounceSchedulerProtocol`) |

### Date abstraction (Closure injection)

For simple cases, use closure injection instead of protocols:

**Production code:**

```swift
class CacheManager {
  private let dateGenerator: () -> Date

  init(dateGenerator: @escaping () -> Date = Date.init) {
    self.dateGenerator = dateGenerator
  }

  func isExpired(cachedAt: Date, ttl: TimeInterval) -> Bool {
    let now = dateGenerator()
    return now.timeIntervalSince(cachedAt) > ttl
  }
}
```

**Test code:**

```swift
@Test func isExpired_AfterTTL_ReturnsTrue() {
  let fixedDate = Date(timeIntervalSince1970: 1000)
  let cache = CacheManager(dateGenerator: { fixedDate })

  let cachedAt = Date(timeIntervalSince1970: 0)
  let result = cache.isExpired(cachedAt: cachedAt, ttl: 500)

  #expect(result == true)
}
```

### UUID abstraction

**Production code:**

```swift
class ItemFactory {
  private let uuidGenerator: () -> UUID

  init(uuidGenerator: @escaping () -> UUID = UUID.init) {
    self.uuidGenerator = uuidGenerator
  }

  func createItem(name: String) -> Item {
    Item(id: uuidGenerator().uuidString, name: name)
  }
}
```

**Test code:**

```swift
@Test func createItem_UsesGeneratedUUID() {
  let fixedUUID = UUID(uuidString: "12345678-1234-1234-1234-123456789ABC")!
  let factory = ItemFactory(uuidGenerator: { fixedUUID })

  let item = factory.createItem(name: "Test")

  #expect(item.id == "12345678-1234-1234-1234-123456789ABC")
}
```

### When to use which pattern

| Pattern | Use case |
|---------|----------|
| Protocol abstraction | Timer, complex APIs with multiple methods |
| Closure injection | Date, UUID, simple single-value generators |
| DebounceScheduler abstraction | Task.sleep-based debounce/delay in async code |

---

## References

- [Testing](testing.md)
- [Architecture](architecture.md)
- [Swift by Sundell - Time Traveling in Tests](https://www.swiftbysundell.com/articles/time-traveling-in-swift-unit-tests/)
- [Point-Free swift-dependencies](https://github.com/pointfreeco/swift-dependencies)
