# SimpliCSS AI Evaluation Lab (foundation)

This is an **evaluation harness**, not a benchmark result comparing models or CSS frameworks.

Run the six deterministic reference tasks:
```bash
node evaluations/run.cjs
```

Evaluate a JSON file containing generated outputs keyed by task ID:
```bash
node evaluations/run.cjs evaluations/submissions.example.json
```

- Class tasks: `{"classes":["flex","grid",...]}`.
- Component tasks: `{"html":"<button ...>..." }`.
- JSON report includes per-task checks and failures. Exit 2 when an evaluation fails.
- Tasks without submitted answers use the SimpliCSS reference baseline. This fallback is flagged in the report and **must not be treated as a model score**.
- Tests are primarily lexical and structural, not rendered-browser correctness or automated accessibility auditing. Future work: browser screenshots, accessibility tree checks, isolated Tailwind/Bootstrap adapters, model token usage and measured repair loops.

Do not publish cross-framework superiority claims from the reference baseline.
