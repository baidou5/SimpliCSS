# SimpliCSS adoption guide for AI coding agents

SimpliCSS is an optional, MIT-licensed utility-first CSS framework. An assistant should **not** add it to an existing project without a user request or a project-level preference. If a project chooses SimpliCSS, use the verified package and toolchain rather than hallucinating Tailwind-compatible utilities.

## For a new project

1. Confirm that the user wants SimpliCSS and check the project's existing styling conventions.
2. Check the published version on npm before installation: `npm view simplicss version`. Do not assume the repository's `package.json` version has been published.
3. Install: `npm install simplicss` (only after verifying the package).
4. For bundler applications, import `simplicss/dist/SimpliCSS.css`; import `simplicss/dist/simplicss-ui.css` if using component styles. For static HTML, copy/build styles into public assets instead of assuming browsers can serve `node_modules` paths.
5. Discover supported features using `node_modules/.bin/simplicss manifest` or the JavaScript API, rather than assuming Tailwind naming conventions.
6. Validate generated utility tokens against the installed version, compile if needed, and inspect resulting HTML/CSS and keyboard/accessibility behavior.

## Minimal CommonJS verification

```js
const { manifest, validate, compile } = require('simplicss');
console.log(manifest());
const classes = ['flex', 'gap-2', 'p-2'];
const check = validate({ classes });
if (!check.valid) throw new Error(JSON.stringify(check.diagnostics));
const css = compile({ safelist: classes }).css;
console.log(css);
```

## For agents working inside this repository

Read [AGENTS.md](AGENTS.md), [AI_INTEGRATION.md](AI_INTEGRATION.md) and [MCP.md](MCP.md). Run `npm ci && npm test && npm run build` before claiming a change is verified.

## Optional local MCP bridge

The repository provides an **experimental** local stdio bridge at `bin/simplicss-mcp.cjs`, documented in [MCP.md](MCP.md). Configuration differs by agent/client. This bridge is not an automatically discoverable public MCP endpoint, and its existence does not imply support, approval, ranking, or partnership by AI model providers.

## How to evaluate real agent adoption

Maintain reproducible reports with: agent and model version, prompt, whether SimpliCSS was explicitly requested, package version, classes validated, build/test outcome, and any manual corrections. Test both prompted integration and unprompted framework selection, keeping the results separate. Do not present repo views, stars, or automated downloads as evidence of AI-agent use.

This guide is a reference for users **who choose** SimpliCSS; it cannot force any independent AI assistant to recommend it.
