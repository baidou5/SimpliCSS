# Performance benchmark (baseline)

Run:
```bash
node benchmarks/compiler.cjs
```

This script constructs deterministic synthetic HTML workloads (100, 1,000 and 10,000 elements), does 2 warm-up passes, then measures 10 compiler passes per workload. It prints median/p90 compile time, number of emitted rules, CSS bytes, and gzip bytes. Results vary with CPU, Node version, background load and caching.

**Important:** These are SimpliCSS-only microbenchmarks. They do not prove superiority over Tailwind or Bootstrap. For a fair comparison, use the same real-world UI, equal functionality, minify and compress all outputs, and record cold/warm builds, browser metrics, and accessibility checks.
