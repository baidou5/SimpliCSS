# AI Evaluation Phase 2: model submissions and browser checks

Run real model submissions with strict scoring:

```bash
node evaluations/run.cjs model-results.json --strict
```

Every task ID in `evaluations/tasks.json` must be present in the JSON file. A missing submission **fails** the task; reference baseline answers never inflate model results. The report indicates `strict`, `submitted`, `submittedPassed` and task-level failures. The default run without `--strict` is for deterministic reference testing only.

Optional local real-browser checks:

```bash
npm install --no-save playwright
npx playwright install chromium
node evaluations/browser.cjs sample.html chromium
```

This browser script currently checks accessible names for basic buttons and form controls, duplicate IDs, and image alt attributes. It is **not** a WCAG audit or visual regression test. Browser dependencies are not installed in default CI, so no browser pass is claimed.

To compare against Tailwind and Bootstrap fairly, use the same natural-language prompts, model versions, budgets and attempt counts, then run framework-specific validators and visual/accessibility checks on all output. Until executed with actual model-generated answers, there is **no measured cross-framework winner**.
