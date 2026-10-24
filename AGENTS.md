# SimpliCSS — instructions for AI coding agents

You are working in the SimpliCSS repository. Prefer evidence from the code over assumptions about Tailwind or Bootstrap.

## AI-first workflow
1. Read `AI_INTEGRATION.md` and `AI_NATIVE.md` before generating interfaces.
2. Discover supported features using `node bin/simplicss.cjs manifest`.
3. Discover UI components with `node bin/simplicss.cjs components` and inspect any component schema with `node bin/simplicss.cjs component button`.
4. Render supported UI components using the registry rather than inventing class names. Include `dist/simplicss-ui.css` for registry components.
5. Check generated classes via `node bin/simplicss.cjs validate <config-file>`. Where using the MCP bridge, call `simplicss_validate`.
6. If a runtime-generated or dynamic class cannot be detected statically, add explicit complete class tokens to a safelist.
7. Run `npm test` and `npm run build` for source changes. Check generated CSS and HTML accessibility.

## Important limitations
- SimpliCSS utility syntax resembles Tailwind, but it is **not** Tailwind-compatible. Never presume a utility exists; consult the manifest or validator.
- Only static class attributes and certain literal JSX forms are scanned. Do not assume Blade/Vue/React runtime expressions are fully parsed.
- Component registry currently has button, card, input, and alert only.
- Local MCP support is experimental. Do not claim approval, adoption, or partnership by any AI provider.
- Do not claim performance or model-generation superiority without running equivalent benchmarks.
- The checked-in LICENSE is GPL-3.0 and package metadata reflects it. Do not relicense or publish until the maintainer approves distribution and licensing implications.
