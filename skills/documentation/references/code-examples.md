# Code examples

## Purpose

This document defines standards for writing code examples in documentation. Clear, consistent code examples improve understanding and reduce ambiguity across all projects.

---

## Placeholder names - P1

### Use ProjectName as placeholder

**Rules:**
- Use `ProjectName` as the placeholder namespace/package in code examples
- Never use real project names in shared documentation
- This ensures documentation is project-agnostic and reusable

**✅ Good:**

```python
# projectname/services/user_service.py
from projectname.repositories import UserRepository

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository
```

```typescript
// src/services/user-service.ts
import { UserRepository } from '@projectname/repositories';

export class UserService {
  constructor(private repository: UserRepository) {}
}
```

**❌ Bad:**

```python
# Using specific project name
from acme_corp.repositories import UserRepository
```

---

### Common placeholder hierarchy

Use consistent placeholder structure across examples:

```
projectname/
├── core/           # Core business logic
├── services/       # Service layer
├── repositories/   # Data access layer
├── models/         # Data models
├── api/            # API endpoints
└── utils/          # Utility functions
```

---

## Code block formatting - P1

### Syntax highlighting

**Rules:**
- Always specify language in code blocks
- Use lowercase language identifiers
- Use the most specific identifier available

**Common language identifiers:**

| Language | Identifier |
|----------|------------|
| Python | `python` |
| TypeScript | `typescript` |
| JavaScript | `javascript` |
| Go | `go` |
| Rust | `rust` |
| Java | `java` |
| C# | `csharp` |
| Shell | `bash` or `shell` |
| SQL | `sql` |
| JSON | `json` |
| YAML | `yaml` |

**✅ Good:**

````markdown
```python
def calculate_total(items: list[Item]) -> float:
    return sum(item.price for item in items)
```
````

**❌ Bad:**

````markdown
```
def calculate_total(items):
    return sum(item.price for item in items)
```
````

---

### Inline code formatting

**Rules:**
- Use backticks for class names, methods, variables, and technical terms
- Use inline code for identifiers that appear in code

**Example:**

```markdown
The `UserService` class uses the `authenticate()` method to verify credentials. Set the `timeout` parameter to control request duration.
```

---

## Good vs bad examples - P1

### Use comparison format

**Rules:**
- Show bad examples before good examples (or side by side)
- Use ❌ emoji for bad examples
- Use ✅ emoji for good examples
- Explain why the bad example is problematic

**Example:**

````markdown
### Dependency management

**❌ Bad:**

```python
# Hidden dependency - hard to test
class OrderService:
    def process(self, order_id: str):
        db = Database.get_instance()  # Hidden global state
        return db.query(f"SELECT * FROM orders WHERE id = {order_id}")
```

**Problem:** Hidden dependencies make testing difficult and create tight coupling.

**✅ Good:**

```python
# Explicit dependency - easy to test and mock
class OrderService:
    def __init__(self, db: Database):
        self.db = db

    def process(self, order_id: str):
        return self.db.query("SELECT * FROM orders WHERE id = ?", [order_id])
```

**Benefits:** Explicit dependencies, easy to test, no global state.
````

---

## Code comments - P2

### When to add comments

**Add comments for:**
- Non-obvious logic or algorithms
- Design decisions or tradeoffs
- Performance optimizations
- Workarounds for known issues

**Example:**

```python
class ConnectionPool:
    def __init__(self, max_size: int = 10):
        # Pre-allocate connections to avoid latency during peak load
        self.pool = [self._create_connection() for _ in range(max_size)]

    def get_connection(self):
        # Use LIFO to keep recently-used connections warm
        if self.pool:
            return self.pool.pop()
        return self._create_connection()
```

---

### Avoid obvious comments

**❌ Bad:**

```python
# Get the user
user = get_user(user_id)

# Return the user
return user
```

**✅ Good:**

```python
# Fetch user with cached permissions to avoid N+1 queries
user = get_user_with_permissions(user_id)
return user
```

---

## Context provision - P1

### Provide surrounding context

**Rules:**
- Don't show isolated snippets without context
- Include imports and class/function declarations
- Show enough code for the example to make sense

**❌ Bad:**

```python
total -= discount
notify_customer(customer_id, total)
```

**✅ Good:**

```python
from projectname.notifications import notify_customer
from projectname.models import Order

class OrderProcessor:
    def apply_discount(self, order: Order, discount: float) -> float:
        total = order.total - discount
        total = max(0, total)  # Ensure non-negative

        notify_customer(order.customer_id, total)
        return total
```

---

## Complete examples - P1

### Ensure examples work

**Rules:**
- All code examples should be correct and runnable
- Include necessary imports
- Follow the coding standards of the language
- Test examples before publishing

**Example:**

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, CreateUserDto } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    return this.userRepository.create(dto);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
```

---

## Documentation comments - P2

### Include doc comments for public APIs

**Rules:**
- Use the documentation comment style for each language
- Provide description, parameters, and return values
- Keep descriptions concise (1-2 sentences)

**Python example:**

```python
def calculate_shipping(weight: float, destination: str) -> float:
    """Calculate shipping cost based on weight and destination.

    Args:
        weight: Package weight in kilograms.
        destination: Two-letter country code (ISO 3166-1 alpha-2).

    Returns:
        Shipping cost in USD.

    Raises:
        ValueError: If weight is negative or destination is invalid.
    """
    if weight < 0:
        raise ValueError("Weight cannot be negative")
    # Implementation...
```

**TypeScript example:**

```typescript
/**
 * Calculate shipping cost based on weight and destination.
 *
 * @param weight - Package weight in kilograms
 * @param destination - Two-letter country code (ISO 3166-1 alpha-2)
 * @returns Shipping cost in USD
 * @throws {Error} If weight is negative or destination is invalid
 */
function calculateShipping(weight: number, destination: string): number {
  if (weight < 0) {
    throw new Error("Weight cannot be negative");
  }
  // Implementation...
}
```

---

## Example categories - P2

### Full class/module examples

Use for demonstrating complete patterns:

```go
package user

import (
    "context"
    "errors"
)

// Service handles user-related business logic.
type Service struct {
    repo Repository
}

// NewService creates a new user service.
func NewService(repo Repository) *Service {
    return &Service{repo: repo}
}

// Create creates a new user with the given details.
func (s *Service) Create(ctx context.Context, req CreateRequest) (*User, error) {
    existing, err := s.repo.FindByEmail(ctx, req.Email)
    if err != nil && !errors.Is(err, ErrNotFound) {
        return nil, err
    }
    if existing != nil {
        return nil, ErrEmailAlreadyExists
    }

    return s.repo.Create(ctx, req)
}
```

---

### Snippet examples

Use for demonstrating specific techniques:

```python
# Using context manager for resource cleanup
with database.transaction() as tx:
    tx.execute("INSERT INTO users (name) VALUES (?)", [name])
    tx.execute("INSERT INTO audit_log (action) VALUES (?)", ["user_created"])
# Transaction automatically committed or rolled back
```

---

### Anti-pattern examples

Use for showing what NOT to do:

```python
# ❌ BAD: SQL injection vulnerability
def get_user(user_id: str):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    return db.execute(query)

# ✅ GOOD: Parameterized query
def get_user(user_id: str):
    query = "SELECT * FROM users WHERE id = ?"
    return db.execute(query, [user_id])
```

---

## Multi-language examples - P2

When documenting APIs or concepts that apply across languages, show examples in multiple languages:

````markdown
### Making an API request

**Python:**

```python
import requests

response = requests.get(
    "https://api.example.com/users",
    headers={"Authorization": f"Bearer {token}"}
)
users = response.json()
```

**JavaScript:**

```javascript
const response = await fetch("https://api.example.com/users", {
  headers: { Authorization: `Bearer ${token}` },
});
const users = await response.json();
```

**curl:**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/users
```
````

---

## References

- [Google code samples guide](https://developers.google.com/style/code-samples)
- [MDN code example guidelines](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide)
- [Python docstring conventions (PEP 257)](https://peps.python.org/pep-0257/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
