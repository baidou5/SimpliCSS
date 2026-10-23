# SimpliCSS AI Bridge (experimental MCP server)

A local Model Context Protocol server exposing SimpliCSS capabilities to AI assistants and developer tools. Uses **stdio JSON-RPC**, one JSON message per line, with no runtime dependencies.

Run:
```bash
node bin/simplicss-mcp.cjs
```

Example MCP client configuration:
```json
{"mcpServers":{"simplicss":{"command":"node","args":["/absolute/path/to/SimpliCSS/bin/simplicss-mcp.cjs"]}}}
```

Available tools:
- `simplicss_manifest`: token and capability manifest
- `simplicss_validate`: class diagnostics and suggestions
- `simplicss_components`: all component schemas
- `simplicss_component`: one component schema
- `simplicss_render`: safe HTML for a named component
- `simplicss_compile`: CSS generation from explicit sources or classes

No file-system write access or network listener. The server accepts limited-size stdio messages and returns deterministic results. This is an initial MCP interoperability implementation, not yet certified across major MCP clients.
