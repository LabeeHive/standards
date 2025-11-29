# Mock patterns

## Purpose

This document defines patterns for creating and using mocks in tests. Proper mocking enables isolated unit tests that are fast, reliable, and maintainable.

---

## Critical rule - P1

**All tests must use mocks. Tests must never affect real services or data.**

### Forbidden in tests

- `ReminderService.shared` or any real singleton
- `UserDefaults.standard`
- `EKEventStore` direct instantiation
- Real network communication
- File system modifications
- Database operations

---

## Mock structure - P1

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

## Call tracking - P1

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

## Return value control - P1

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

## Error control - P1

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

## Never mock UseCases - P1

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

## Test setup with mocks - P1

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

## Reset helper - P2

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

## Test error enum - P2

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

## Repository mocks with external systems - P2

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

## Pre-test checklist - P2

Before running tests, verify:

- [ ] All dependencies are mocked
- [ ] No real singletons are used
- [ ] No file system modifications
- [ ] No network communication
- [ ] No database operations
- [ ] No system settings changes

---

## References

- [Testing](testing.md)
- [Architecture](architecture.md)
