# SimpliCSS AI Integration Kit v1 (preview)

**Goal:** give AI coding agents and human developers a reliable source of truth about the framework, not a prompt-only approximation.

## Quick start (from this repository)

```bash
git clone https://github.com/baidou5/SimpliCSS.git
cd SimpliCSS
git checkout feat/ai-integration-kit-v1
npm ci
node bin/simplicss.cjs manifest
node bin/simplicss.cjs components
npm test
```

The AI-Native features developed on feature branches must reach the checked-out commit before these commands work. **Do not assume they are available on the repository's `main` branch yet.** For this kit, check out `feat/ai-integration-kit-v1` until integration is merged.

## AI agent contract

- `manifest`: supported theme tokens, variants, utility families and component definitions
- `validate`: JSON diagnostics for unsupported classes
- `components` and `component <name>`: safe property schemas
- `render <name> <json-props>`: escaped semantic HTML
- `bin/simplicss-mcp.cjs`: local MCP tools for the above operations plus CSS compilation

An agent should discover → generate → validate → compile → inspect rendered HTML; if validation fails, repair based on actual diagnostics, not guesses.

## MCP local setup

Start the server with:

```bash
node bin/simplicss-mcp.cjs
```

Example for clients accepting the common `mcpServers` JSON format:

```json
{
  "mcpServers": {
    "simplicss": {
      "command": "node",
      "args": ["/absolute/path/to/SimpliCSS/bin/simplicss-mcp.cjs"]
    }
  }
}
```

This is an **example**, not a universal configuration format for every Claude, Gemini, Copilot or ChatGPT client. Refer to the individual client's current MCP support and instructions. The bridge has not been certified against each vendor's client.

## AI model evaluation

Use `evaluations/comparison-tasks.json` and `evaluations/COMPARISON_PROTOCOL.md` to give identical tasks to supported model environments. Keep model IDs, model versions, prompt budgets, framework versions and attempts consistent. Use `node evaluations/compare-frameworks.cjs results.json` to check that required outputs exist. Browser, visual parity, model costs and accessibility tests require separate runs and evidence.

## Adoption readiness

Before external submission: publish a tagged stable release; resolve GPL license/package metadata conflict; verify npm naming and packaging; run CI and a real MCP client smoke test; capture genuine model evaluation results. Integration instructions do not constitute an endorsement from any model vendor.
