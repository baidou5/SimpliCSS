# SimpliCSS

**AI-native, utility-first CSS for developers and coding agents.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm package](https://img.shields.io/npm/v/simplicss.svg)](https://www.npmjs.com/package/simplicss)
[![GitHub release](https://img.shields.io/github/v/release/baidou5/SimpliCSS)](https://github.com/baidou5/SimpliCSS/releases)
[![CI](https://github.com/baidou5/SimpliCSS/actions/workflows/node.js.yml/badge.svg)](https://github.com/baidou5/SimpliCSS/actions/workflows/node.js.yml)

SimpliCSS is a lightweight CSS framework with prebuilt utilities, a configurable utility compiler, a small UI component registry, and **machine-readable tools for AI coding assistants**. It supports responsive variants, design tokens, dark-mode and RTL selectors, and an experimental local Model Context Protocol (MCP) bridge.

> **Status:** SimpliCSS v1.0.4 is the repository's release candidate. Consult [npm](https://www.npmjs.com/package/simplicss) to confirm which versions are actually published. The MCP integration is experimental; no partnership or certification with AI model providers is implied.

## Quick start

### Install from npm (when the package version is published)

```bash
npm install simplicss
```

Link the distributed stylesheets in your HTML or bundle them with your application:

```html
<link rel="stylesheet" href="./node_modules/simplicss/dist/SimpliCSS.css">
<link rel="stylesheet" href="./node_modules/simplicss/dist/simplicss-ui.css">
```

The `node_modules` paths above work only when the files are served or copied by your build/deployment environment; browsers cannot automatically resolve local npm packages on a hosted site.

### Use the GitHub-hosted CSS

For a static prototype, load a version-pinned stylesheet via jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/baidou5/SimpliCSS@v1.0.4/dist/SimpliCSS.css">
```

This URL requires the `v1.0.4` Git tag to exist. For local development or if that tag is not available, build from source instead:

```bash
git clone https://github.com/baidou5/SimpliCSS.git
cd SimpliCSS
npm ci
npm run build
npm test
```

Then include `dist/SimpliCSS.css` and optionally `dist/simplicss-ui.css` in your site.

## Example

The prebuilt CSS includes core utility classes. This example also loads component styles.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SimpliCSS example</title>
  <link rel="stylesheet" href="./dist/SimpliCSS.css">
  <link rel="stylesheet" href="./dist/simplicss-ui.css">
</head>
<body>
  <main class="flex justify-center items-center p-3">
    <section class="bg-blue text-light p-3 rounded-lg shadow-md">
      <h1>Welcome to SimpliCSS</h1>
      <p>Build interfaces using simple CSS utilities.</p>
    </section>
  </main>
</body>
</html>
```

See the [dashboard example](examples/dashboard.html) for a more complete layout. Utility support differs between the **prebuilt CSS stylesheet** and **on-demand compiler output**; validate classes against the runtime you choose.

## Features

| Feature | Available capability |
| --- | --- |
| Utility CSS | Layout, spacing, colors, typography, borders and shadows |
| Compiler | Generates classes from scanned sources or an explicit safelist |
| Responsive & states | Responsive breakpoints and composable state variants |
| Theming | Custom design tokens, dark overrides and RTL-aware output |
| Component registry | Button, card, input and alert definitions with safe rendering |
| AI integration | Machine-readable manifest, validator and component schemas |
| MCP bridge | Experimental local stdio server with six tools |
| Developer tooling | Command-line utilities, automated tests and packaging checks |

SimpliCSS is **not a drop-in replacement for Tailwind class syntax**. Discover supported classes before generating an interface.

## Use SimpliCSS from JavaScript

The npm package exposes CommonJS APIs via `index.cjs`:

```js
const { manifest, validate, compile, renderComponent } = require('simplicss');

const capabilities = manifest();
const classes = ['flex', 'gap-2', 'p-2'];
const result = validate({ classes });

if (!result.valid) {
  console.error(result.diagnostics);
} else {
  const css = compile({ safelist: classes }).css;
  const html = renderComponent('button', { label: 'Save', variant: 'primary' });
  console.log({ css, html });
}
```

Use the generated CSS alongside `dist/simplicss-ui.css` when you rely on the component registry's UI classes. Refer to [AI-native APIs](AI_NATIVE.md) and [component registry documentation](COMPONENT_REGISTRY.md) for supported contracts.

## Command-line interface

From a repository checkout:

```bash
node bin/simplicss.cjs manifest
node bin/simplicss.cjs components
node bin/simplicss.cjs component button
node bin/simplicss.cjs build
```

For package consumers, the npm binary is named `simplicss`. See [agent instructions](AGENTS.md) for validation workflows and [Engine 3 documentation](ENGINE3.md) for supported variants.

## AI coding agents and MCP

AI agents should **discover → generate → validate → compile → inspect** rather than assuming unsupported utility names.

The experimental MCP server exposes these tools:

- `simplicss_manifest` — available CSS capabilities and tokens
- `simplicss_validate` — diagnostics for utility classes
- `simplicss_components` — component schemas
- `simplicss_component` — details for a named component
- `simplicss_render` — safe component HTML
- `simplicss_compile` — CSS output from specified inputs

Start the local server from a checkout:

```bash
node bin/simplicss-mcp.cjs
```

Example configuration for clients supporting a JSON `mcpServers` structure:

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

Use the client's own configuration conventions; this JSON is not universal to all clients. See [MCP reference](MCP.md), [AI integration guide](AI_INTEGRATION.md), and [external client testing guide](integrations/EXTERNAL_CLIENT_TEST.md). Real Claude Code / Gemini CLI model-generated interfaces have **not been independently verified** by the repository's automated tests.

## Framework integration

**Laravel / Blade:** copy the built CSS to `public/css/` and reference it from a layout:

```bash
cp dist/SimpliCSS.css public/css/SimpliCSS.css
cp dist/simplicss-ui.css public/css/simplicss-ui.css
```

```blade
<link rel="stylesheet" href="{{ asset('css/SimpliCSS.css') }}">
<link rel="stylesheet" href="{{ asset('css/simplicss-ui.css') }}">
```

**Vue / React (bundler projects):** once the npm package is published and installed, import the distributable CSS from your application entrypoint:

```js
import 'simplicss/dist/SimpliCSS.css';
import 'simplicss/dist/simplicss-ui.css';
```

**CodeIgniter:** copy the built CSS into your public assets folder and reference it through `base_url()`.

For dynamically generated utility classes, configure the compiler's source scanning or safelist rather than relying on static extraction of runtime expressions.

## Development and verification

```bash
npm ci
npm test
npm run build
npm run check:size
npm run benchmark
npm pack --dry-run
```

The automated suite covers compiler behavior, diagnostics, components and MCP subprocess behavior. Automated protocol checks are not proof of acceptance by a specific AI vendor. See the [evaluation protocol](evaluations/COMPARISON_PROTOCOL.md).

## Documentation

- [AI integration](AI_INTEGRATION.md) · [Instructions for AI agents](AGENTS.md)
- [MCP bridge](MCP.md) · [External client setup/testing](integrations/EXTERNAL_CLIENT_TEST.md)
- [Engine 3](ENGINE3.md) · [AI-native API](AI_NATIVE.md) · [Component registry](COMPONENT_REGISTRY.md)
- [Example dashboard](examples/dashboard.html) · [Documentation landing page source](docs/index.html)
- [Release notes](https://github.com/baidou5/SimpliCSS/releases) · [Report an issue](https://github.com/baidou5/SimpliCSS/issues)

## Roadmap

- Validate MCP interoperability through real provider clients and reproducible UI generation tasks.
- Expand accessible component coverage, documentation and browser testing.
- Improve compiler efficiency, compatibility and third-party integrations.
- Grow the open-source contributor community.

## Contributing

Issues and pull requests are welcome. Before contributing, run `npm test` and `npm run build`, document any new classes in the manifest, and include tests for behavior changes.

## License

SimpliCSS project-owned code is distributed under the [MIT License](LICENSE). Keep the copyright and permission notices when redistributing copies or substantial portions. Third-party dependencies may have separate terms.

---

Created by **Abdellah Baidou** · [GitHub](https://github.com/baidou5/SimpliCSS)
