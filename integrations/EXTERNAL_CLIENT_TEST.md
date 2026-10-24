# Claude Code and Gemini CLI: external interoperability test

These instructions describe **real clients**, but running them requires that the software and any required account authentication are installed on the operator's machine. Passing the repository's MCP subprocess tests is not equivalent to a provider model run.

## Claude Code (example)

From an installed clone of SimpliCSS, configure the server using an absolute path:

```bash
claude mcp add --transport stdio simplicss -- node /absolute/path/to/SimpliCSS/bin/simplicss-mcp.cjs
claude mcp list
```

Start Claude Code, inspect `/mcp`, and ask:
> Use the SimpliCSS MCP tools to discover the design manifest and component registry, then create an accessible dashboard. Validate the classes and compile CSS before reporting the result. Save the resulting HTML and validation errors.

Consult the current Claude Code MCP documentation if your installed version differs.

## Gemini CLI (example)

```bash
gemini mcp add simplicss node /absolute/path/to/SimpliCSS/bin/simplicss-mcp.cjs
gemini mcp list
```

Start Gemini CLI and issue the same task, using the same model version and evaluation budget. Alternatively, add `mcpServers.simplicss` with a `command` and `args` to `.gemini/settings.json`.

## Evidence required for an actual external test

- Exact model/client and version, date, SimpliCSS commit and CLI invocation.
- Screenshot or saved logs proving the agent discovered and called MCP tools.
- Generated HTML, CSS and class diagnostics, number of corrections and failure details.
- Real browser and accessibility results where available; label missing evidence *not tested*.

Do not check in client API keys, access tokens, private prompts or account credentials.
