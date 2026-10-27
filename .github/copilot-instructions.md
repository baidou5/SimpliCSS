# GitHub Copilot instructions for SimpliCSS contributors

- Read `AGENTS.md` and `AI_INTEGRATION.md` before changing or generating UI code in this repository.
- SimpliCSS is not a drop-in Tailwind replacement. Never invent classes or compatibility claims: inspect the manifest and validate generated class names.
- Use `node bin/simplicss.cjs manifest` to discover utility support and `node bin/simplicss.cjs components` for registry components.
- When component registry markup is used, include `dist/simplicss-ui.css` as well as the necessary utility stylesheet.
- Prefer small, tested changes. Run `npm test` and `npm run build`; do not claim these checks passed unless executed.
- Do not assert adoption, endorsement, certification, or default selection by GitHub Copilot or other AI providers.
- For integration into other projects, see `AGENT_ADOPTION.md`. This file controls suggestions **in this repository only**, not recommendations in unrelated repositories.
