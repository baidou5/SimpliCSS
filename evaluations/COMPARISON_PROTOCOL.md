# Cross-framework AI evaluation protocol (experimental)

This suite prepares a **fair input protocol** for AI-generated SimpliCSS, Tailwind CSS and Bootstrap interfaces. It does **not** run AI models or report real competitive results.

## Experiment

1. Use the same task text from `evaluations/comparison-tasks.json` for all frameworks, with framework-specific instructions limited to choosing the framework.
2. Record model provider/name and exact model version, framework version, temperature 0 and attempt 1 for each submission.
3. Save model HTML in JSON as described below; submit all nine task/framework combinations.
4. Run the structural gate: `node evaluations/compare-frameworks.cjs results.json`.
5. Run browser, visual and accessibility checks independently before making any performance or quality claims.

## Submission format

```json
{
  "entries": [
    {
      "framework": "simplicss",
      "taskId": "dashboard",
      "model": "your-model-name",
      "modelVersion": "exact-version",
      "frameworkVersion": "commit-sha",
      "attempt": 1,
      "temperature": 0,
      "html": "<main><nav></nav><article></article><article></article><article></article><button>Save</button></main>"
    }
  ]
}
```

Accepted framework names are `simplicss`, `tailwind` and `bootstrap`. Every task requires one submission per framework. Missing/duplicate entries and differing model versions for the same task invalidate a comparison. The current scorer checks **static HTML structure only**, not visual parity, CSS framework utility validity, live accessibility, render time, or actual AI token consumption. It is intentionally conservative and labels incomplete runs ineligible.
