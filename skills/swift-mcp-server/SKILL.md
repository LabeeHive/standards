---
name: swift-mcp-server
description: Guide MCP server implementation for Swift apps. Use this when building Claude integrations in Swift. Triggers on "MCP server", "MCPサーバー", "Model Context Protocol", "Claude連携", "AI統合".
model: opus
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(swift:*), Bash(mkdir:*)
---

# Swift MCP Server Skill

You are an MCP (Model Context Protocol) implementation specialist for Swift apps. Guide users through building MCP servers based on the patterns established in Vigilare and Chimr.

## Technology Stack

- **SDK**: [modelcontextprotocol/swift-sdk](https://github.com/modelcontextprotocol/swift-sdk)
- **Transport**: StdioTransport

## File Structure (Based on Vigilare/Chimr)

```
{App}/MCP/
├── MCPServer.swift        # Server entry point and tool definitions
├── MCPToolHandlers.swift  # Tool execution logic
├── MCPServiceError.swift  # Error types
└── MCPFormatters.swift    # Output formatting
```

## When Invoked

### Step 1: MCPServer.swift

Entry point with tool definitions:

```swift
import Foundation
import MCP

enum MCPServer {
  static func run(store: StoreProtocol = Store.shared) async throws {
    let server = Server(
      name: "AppName",
      version: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
      capabilities: .init(tools: .init(listChanged: false))
    )

    let handlers = MCPToolHandlers(store: store)
    let tools = buildTools()

    await server.withMethodHandler(ListTools.self) { _ in
      .init(tools: tools)
    }

    await server.withMethodHandler(CallTool.self) { params in
      try await handleToolCall(params, handlers: handlers)
    }

    let transport = StdioTransport()
    try await server.start(transport: transport)
    await server.waitUntilCompleted()
  }
}
```

### Step 2: Tool Definition Pattern

```swift
private static func buildTools() -> [Tool] {
  [
    Tool(
      name: "app_ping",
      description: "Check if MCP server is running. Returns 'pong' with current timestamp.",
      inputSchema: .object([
        "type": .string("object"),
        "properties": .object([:]),
        "required": .array([])
      ])
    ),
    Tool(
      name: "app_get_items",
      description: "Get items with optional filtering.",
      inputSchema: .object([
        "type": .string("object"),
        "properties": .object([
          "filter": .object([
            "type": .string("string"),
            "description": .string("Filter type: 'all', 'active'. Defaults to 'all'."),
            "enum": .array([.string("all"), .string("active")])
          ]),
          "include_archived": .object([
            "type": .string("boolean"),
            "description": .string("Include archived items. Defaults to false.")
          ])
        ]),
        "required": .array([])
      ])
    ),
    Tool(
      name: "app_get_item",
      description: "Get full details of a specific item.",
      inputSchema: .object([
        "type": .string("object"),
        "properties": .object([
          "id": .object([
            "type": .string("string"),
            "description": .string("The item ID to get details for.")
          ])
        ]),
        "required": .array([.string("id")])
      ])
    )
  ]
}
```

### Step 3: Tool Dispatch

```swift
private static func handleToolCall(
  _ params: CallTool.Parameters,
  handlers: MCPToolHandlers
) async throws -> CallTool.Result {
  switch params.name {
  case "app_ping":
    return handlers.handlePing()
  case "app_get_items":
    return try await handlers.handleGetItems(params.arguments)
  case "app_get_item":
    return try await handlers.handleGetItem(params.arguments)
  default:
    throw MCPServiceError.unknownTool(name: params.name)
  }
}
```

### Step 4: MCPToolHandlers.swift

```swift
import Foundation
import MCP

final class MCPToolHandlers {
  private let store: StoreProtocol

  init(store: StoreProtocol) {
    self.store = store
  }

  // MARK: - Authorization (for system APIs)

  func ensureAuthorized() async throws {
    let status = store.authorizationStatus()
    switch status {
    case .authorized, .fullAccess:
      return
    case .notDetermined:
      let granted = try await store.requestAccess()
      if !granted { throw MCPServiceError.unauthorized }
    case .denied, .restricted:
      throw MCPServiceError.accessDenied
    @unknown default:
      throw MCPServiceError.unauthorized
    }
  }

  // MARK: - Handlers

  func handlePing() -> CallTool.Result {
    let timestamp = ISO8601DateFormatter().string(from: Date())
    let response = "pong - AppName MCP is running! (\(timestamp))"
    return .init(content: [.text(response)], isError: false)
  }

  func handleGetItems(_ arguments: [String: Value]?) async throws -> CallTool.Result {
    try await ensureAuthorized()

    let filter = arguments?["filter"]?.stringValue ?? "all"
    let includeArchived = arguments?["include_archived"]?.boolValue ?? false

    let items = await store.fetchItems()
    let output = MCPFormatters.formatItems(items)

    return .init(content: [.text(output)], isError: false)
  }

  func handleGetItem(_ arguments: [String: Value]?) async throws -> CallTool.Result {
    try await ensureAuthorized()

    guard let itemId = arguments?["id"]?.stringValue else {
      throw MCPServiceError.invalidParameter(name: "id")
    }

    guard let item = store.item(withIdentifier: itemId) else {
      throw MCPServiceError.itemNotFound(id: itemId)
    }

    let output = MCPFormatters.formatItemFull(item)
    return .init(content: [.text(output)], isError: false)
  }
}
```

### Step 5: MCPServiceError.swift

```swift
import Foundation

enum MCPServiceError: LocalizedError {
  case unauthorized
  case accessDenied
  case itemNotFound(id: String)
  case invalidParameter(name: String)
  case unknownTool(name: String)
  case saveFailed(String)

  var errorDescription: String? {
    switch self {
    case .unauthorized:
      return "Access not authorized"
    case .accessDenied:
      return "Access denied. Please grant access in System Settings."
    case .itemNotFound(let id):
      return "Item not found: \(id)"
    case .invalidParameter(let name):
      return "Missing required parameter: \(name)"
    case .unknownTool(let name):
      return "Unknown tool: \(name)"
    case .saveFailed(let reason):
      return "Failed to save: \(reason)"
    }
  }
}
```

### Step 6: MCPFormatters.swift

```swift
import Foundation

enum MCPFormatters {
  static func formatItems(_ items: [Item]) -> String {
    var output = "# Items\n\n"

    if items.isEmpty {
      output += "No items found.\n"
    } else {
      output += "Total: \(items.count)\n\n"
      for item in items {
        output += "## \(item.title)\n"
        output += "- ID: `\(item.id)`\n\n"
      }
    }

    return output
  }

  static func formatItemFull(_ item: Item) -> String {
    var output = "# \(item.title)\n\n"
    output += "- ID: `\(item.id)`\n"
    if let notes = item.notes {
      output += "\n## Notes\n\(notes)\n"
    }
    return output
  }
}
```

## Tool Naming Convention

```
{app_prefix}_{action}_{resource}
```

Examples from Vigilare:
- `vigilare_ping`
- `vigilare_get_lists`
- `vigilare_get_reminders`
- `vigilare_get_reminder`
- `vigilare_create_reminder`
- `vigilare_update_reminder`
- `vigilare_complete_reminder`
- `vigilare_add_comment`

Examples from Chimr:
- `chimr_ping`
- `chimr_get_today_events`
- `chimr_get_events`
- `chimr_get_events_range`
- `chimr_join_video_meeting`
- `chimr_show_notification`

## Tool Description Guidelines

- Explain **what** the tool does and **when** to use it
- Mention return values and any prerequisites
- Use natural language, not technical jargon

**Good:**
```
"Get tasks to review what needs to be done. Use filter='today' to see urgent items (today + overdue), or 'all' for everything."
```

**Bad:**
```
"Returns reminder array filtered by date"
```

