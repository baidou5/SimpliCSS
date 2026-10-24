# External AI model testing brief

**Project:** SimpliCSS — https://github.com/baidou5/SimpliCSS

## Instructions for the testing agent

You are evaluating an experimental AI-native CSS framework. Inspect the checked-out source and tools before producing HTML/CSS. Do not guess Tailwind compatibility. First call `simplicss_manifest`, then `simplicss_components`. Generate a responsive dashboard, accessible contact form, and dark-mode RTL settings panel using only supported classes/components. Validate all SimpliCSS utilities with `simplicss_validate`; compile CSS when needed.

Record: model name and exact version, tested SimpliCSS git commit, date, input prompt, first-attempt generated files, any validation diagnostics, number of repair attempts, resulting HTML/CSS and how browser accessibility was checked. Report failures, missing features, and ambiguous documentation as well as successes. Do not claim provider adoption or superiority based on one demonstration.

## Submission

Run the evaluation protocol in `evaluations/COMPARISON_PROTOCOL.md` and return machine-readable `results.json` alongside a concise evaluation memo. For Tailwind and Bootstrap, use their documented classes and equal prompt/task budgets. Tests that have not run must be marked **not tested**.
