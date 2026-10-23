# Framework comparison — exploratory harness

`node benchmarks/compare.cjs` produces a JSON report of CSS size and Gzip size for a small dashboard fixture. Tailwind CLI and Bootstrap are optional benchmark dependencies; install `@tailwindcss/cli`, `tailwindcss`, and `bootstrap` locally before running, without changing production dependencies.

**Important limitations:** Bootstrap's precompiled full bundle is compared to SimpliCSS's generated CSS, which is **not an apples-to-apples result**. Tailwind CSS may need source configuration depending on installation. The fixture is intentionally small; it does not validate visual equivalence, accessibility, CSS specificity or browser performance. The harness should evolve into a true feature-parity comparison before publishing marketing performance claims. Errors are printed rather than silently treated as a win.

Canonical fixture: `benchmarks/fixture.html`. Do not claim faster rendering based on this benchmark.
