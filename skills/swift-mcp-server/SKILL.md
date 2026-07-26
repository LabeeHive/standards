---
name: swift-mcp-server
description: Builds an MCP server in a macOS Swift app using NuntiusKit's forwarder + resident daemon architecture. Use this when adding Claude/MCP integration to a Swift app. User-invoked only via /swift-mcp-server.
disable-model-invocation: true
argument-hint: "[app-name]"
allowed-tools: Read Glob Grep Write Edit Bash(swift:*) Bash(mkdir:*)
---

# Swift MCP Server Skill

You are an MCP (Model Context Protocol) implementation specialist for Swift apps. Guide users through embedding an MCP server with [NuntiusKit](https://github.com/LabeeHive/NuntiusKit), the pattern established and production-verified in Vigilare.

## Architecture

```
AI Agent --MCP(stdio)--> YourApp --mcp (forwarder) --Unix socket--> YourApp --daemon (touches TCC)
```

Both processes run the same app binary with different flags. The `--mcp` process is a thin forwarder that owns stdin/stdout and never touches TCC-protected resources. The `--daemon` process is a LaunchAgent (registered via `SMAppService`) that owns all protected access — EventKit, microphone, and similar — and serves MCP sessions over a Unix domain socket. Each tool call opens a fresh connection, so daemon availability is re-evaluated per call and recovery is automatic.

NuntiusKit provides the whole skeleton: `MCPAppSpec` (tool registry + handlers), `MCPAppServer` (both server builders and process bootstrap), the forwarder, the socket listener, and daemon lifecycle management. The app supplies only its tools, handlers, formatters, and error messages.

## Anti-pattern: daemonless stdio server

**Do not build a stdio MCP server that touches TCC-protected resources directly.** Some MCP hosts (Claude Desktop's Cowork / Claude Code feature) launch MCP server child processes through a helper that calls `responsibility_spawnattrs_setdisclaim()`, detaching the child's TCC responsible-process identity from the host app. TCC grants are recorded per bundle ID, so the disclaimed process silently works or fails depending on whether your app happened to have a prior grant — independent of anything the user opted into. Vigilare shipped this pattern first, hit the problem in production, and had to migrate off it; Chimr still runs the daemonless pattern (stdio server touching EventKit directly) and its migration to NuntiusKit is a planned task — do not copy Chimr's current MCP implementation.

The rule: all TCC-protected access lives in the daemon; the `--mcp` process only forwards. Tools that touch nothing protected (ping, settings) are listed in `localTools` and answered by the forwarder directly. Background and rationale: NuntiusKit `docs/01_architecture/architecture.md`.

## Technology Stack

- **Scaffolding**: [LabeeHive/NuntiusKit](https://github.com/LabeeHive/NuntiusKit) — pin an exact version (0.x, APIs change without notice)
- **SDK**: [modelcontextprotocol/swift-sdk](https://github.com/modelcontextprotocol/swift-sdk) (transitively via NuntiusKit; import `MCP` for `Tool`, `Value`, `CallTool.Result`)
- **Requirements**: macOS 13+, Swift 6 toolchain

## File Structure

```
{App}/MCP/
├── MCPAppSpecFactory.swift  # Builds the app's MCPAppSpec (tools + handlers wiring)
├── MCPTools.swift           # buildTools() — the [Tool] registry
├── MCPToolHandlers.swift    # Tool execution logic (talks to the app's stores/use cases)
├── MCPServiceError.swift    # App error type, conforms to MCPUserFacingError
└── MCPFormatters.swift      # Output formatting
```

NuntiusKit replaces the hand-written `MCPServer.swift`, forwarder, socket listener, and daemon runner from the pre-NuntiusKit generation.

## When Invoked

### Step 1: Add NuntiusKit

The app's own code uses swift-sdk types directly (`Tool`, `Value`, `CallTool.Result`), and SPM target dependencies are not transitive — add both packages and both products:

```swift
dependencies: [
  .package(url: "https://github.com/LabeeHive/NuntiusKit.git", exact: "0.1.0"),
  .package(url: "https://github.com/modelcontextprotocol/swift-sdk.git", from: "0.10.0"),
],
targets: [
  .target(
    name: "AppName",
    dependencies: [
      "NuntiusKit",
      .product(name: "MCP", package: "swift-sdk"),
    ]
  )
]
```

Replace `0.1.0` with the latest released NuntiusKit tag (0.x — pin exact, APIs change without notice). For `.xcodeproj`-based apps, add both packages in Xcode and link both the `NuntiusKit` and `MCP` products to the app target.

### Step 2: Define tools

Keep the registry as one function — it is the single source of truth for both processes, and Settings UIs can render it directly so the two never drift:

```swift
import MCP

enum MCPTools {
  static func buildTools() -> [Tool] {
    [
      Tool(
        name: "app_ping",
        description: "Check if AppName MCP server is running. Returns 'pong' with current timestamp.",
        inputSchema: .object([
          "type": .string("object"),
          "properties": .object([:]),
          "required": .array([]),
        ])
      ),
      Tool(
        name: "app_get_items",
        description: "Get items to review what needs attention. Use filter='active' for current work only.",
        inputSchema: .object([
          "type": .string("object"),
          "properties": .object([
            "filter": .object([
              "type": .string("string"),
              "description": .string("Filter type: 'all', 'active'. Defaults to 'all'."),
              "enum": .array([.string("all"), .string("active")]),
            ])
          ]),
          "required": .array([]),
        ])
      ),
    ]
  }
}
```

### Step 3: Define the error type

Conform the app's tool error type to `MCPUserFacingError`. NuntiusKit converts conforming errors into `isError: true` tool results whose message reaches the client; any other thrown error becomes a generic protocol-level "Tool execution failed" with no text. `LocalizedError` conformers get `guidanceText` for free from `errorDescription`:

```swift
import Foundation
import NuntiusKit

enum MCPServiceError: LocalizedError, MCPUserFacingError {
  case unauthorized
  case backgroundServiceRequired(daemonStatus: MCPDaemonStatus)
  case itemNotFound(id: String)
  case invalidParameter(name: String)

  var errorDescription: String? {
    switch self {
    case .unauthorized:
      return "Access not authorized. Launch AppName and allow access when prompted, or enable AppName in System Settings > Privacy & Security."
    case .backgroundServiceRequired(let daemonStatus):
      switch daemonStatus {
      case .requiresApproval:
        return "AppName's Background Service is waiting for approval — open System Settings > General > Login Items & Extensions, allow AppName, then try again."
      case .enabled:
        return "AppName's Background Service is enabled but not responding. Try restarting AppName, then try again."
      case .notRegistered, .notFound:
        return "AppName's Background Service isn't running. Open AppName > Settings and enable \"Background Service\", then try again."
      }
    case .itemNotFound(let id):
      return "Item not found (id: \(id)). Use app_get_items to find valid IDs."
    case .invalidParameter(let name):
      return "Missing required parameter: \(name). Please provide it and try again."
    }
  }
}
```

Write messages the user can act on — say what to open and what to click, not just what failed. The one deliberate exception: an unknown tool name is a client/integration bug and stays a protocol-level error (NuntiusKit handles this).

### Step 4: Handlers

Same shape as before — a class that talks to the app's stores/use cases and returns `CallTool.Result`. Throw `MCPServiceError` for user-actionable failures:

```swift
import Foundation
import MCP

final class MCPToolHandlers: Sendable {
  private let store: StoreProtocol

  init(store: StoreProtocol) {
    self.store = store
  }

  func ping() -> CallTool.Result {
    let timestamp = ISO8601DateFormatter().string(from: Date())
    return .init(
      content: [
        .text(text: "pong - AppName MCP is running! (\(timestamp))", annotations: nil, _meta: nil)
      ],
      isError: false)
  }

  func getItems(_ arguments: [String: Value]?) async throws -> CallTool.Result {
    guard store.isAuthorized else { throw MCPServiceError.unauthorized }
    let items = await store.fetchItems()
    return .init(
      content: [.text(text: MCPFormatters.formatItems(items), annotations: nil, _meta: nil)],
      isError: false)
  }
}
```

Handlers are stored in the spec as `@Sendable` closures and may run concurrently — keep `MCPToolHandlers` `Sendable` (immutable dependencies, or lock-guarded state). This requires `StoreProtocol` itself to be `Sendable`; if an existing store protocol isn't, either add `Sendable` to the protocol, isolate the store behind an actor, or fall back to `@unchecked Sendable` with lock-guarded state and a comment justifying it.

### Step 5: Build the spec

```swift
import Foundation
import NuntiusKit

enum MCPAppSpecFactory {
  static func make() -> MCPAppSpec {
    let handlers = MCPToolHandlers(store: Store.shared)
    return MCPAppSpec(
      serverName: "AppName",
      socketName: ".appname-mcp.sock",
      daemonPlistName: "com.example.appname.daemon.plist",
      tools: MCPTools.buildTools(),
      handlers: [
        "app_ping": { _ in handlers.ping() },
        "app_get_items": { try await handlers.getItems($0) },
      ],
      localTools: ["app_ping"],
      daemonUnreachableGuidance: {
        let status = MCPDaemonService(plistName: "com.example.appname.daemon.plist").status
        return MCPServiceError.backgroundServiceRequired(daemonStatus: status)
          .localizedDescription
      }
    )
  }
}
```

`localTools` are answered by the forwarder without a daemon round-trip — only tools that touch nothing TCC-protected belong there (ping, settings). `daemonUnreachableGuidance` is returned as an `isError: true` result whenever the daemon can't be reached; make it tell the user exactly how to enable the Background Service (branch on `MCPDaemonStatus` for a status-specific message, as Vigilare does).

### Step 6: main.swift

The whole process bootstrap is two branches — `RunLoop.main.run()` and its non-obvious rationale live inside NuntiusKit:

```swift
import NuntiusKit

let spec = MCPAppSpecFactory.make()

if CommandLine.arguments.contains("--daemon") {
  MCPAppServer.runDaemon(spec: spec)  // -> Never
}
if CommandLine.arguments.contains("--mcp") {
  MCPAppServer.runForwarder(spec: spec)  // -> Never
}

AppNameApp.main()
```

### Step 7: LaunchAgent registration

Ship the plist at `Contents/Library/LaunchAgents/{daemonPlistName}` (add a Copy Files build phase):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.example.appname.daemon</string>
  <key>BundleProgram</key>
  <string>Contents/MacOS/AppName</string>
  <key>ProgramArguments</key>
  <array>
    <string>AppName</string>
    <string>--daemon</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>AssociatedBundleIdentifiers</key>
  <array>
    <string>com.example.appname</string>
  </array>
</dict>
</plist>
```

`KeepAlive` must be an unconditional `true`: NuntiusKit's daemon runner self-restarts on binary updates by exiting 0 and letting launchd relaunch the new binary.

The daemon is opt-in. Wire a "Background Service" toggle in Settings to:

```swift
let useCase = UpdateMCPDaemonRegistrationUseCase(
  daemonService: MCPDaemonService(plistName: "com.example.appname.daemon.plist"))
useCase.execute(enabled: isOn)  // .enabled / .requiresApproval / .disabled / .failed
```

Surface `.requiresApproval` in the UI — the user must allow the agent in System Settings > General > Login Items & Extensions.

### Step 8: Verify manually

Unit tests cannot cover the process-level run-loop property. After wiring a new app, verify the `--mcp` binary end-to-end with the daemon stopped and running (FIFO-driven recipe: Vigilare `docs/01_architecture/mcp_architecture.md`). A forwarded call must return the daemon's result when it is up, and the guidance text — not a hang — within the timeout when it is down.

## Tool Naming Convention

```
{app_prefix}_{action}_{resource}
```

Examples from Vigilare: `vigilare_ping`, `vigilare_get_lists`, `vigilare_get_reminders`, `vigilare_create_reminder`, `vigilare_add_comment`.
Examples from Chimr: `chimr_ping`, `chimr_get_today_events`, `chimr_join_video_meeting`, `chimr_show_notification`.

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
