# CI Job Durations — P24-T11 Baseline

Record of job durations from GitHub Actions runs, for identifying optimization opportunities.

## Methodology

Data collected via `gh run list` and `gh run view --json jobs`, then calculating duration from `startedAt` to `completedAt`.

## Baseline: 2026-11-11 (Run 43017807653)

| Job                                                         | Duration | Notes                                  |
| ----------------------------------------------------------- | -------- | -------------------------------------- |
| spell check                                                 | 20s      | root docs + hand-authored site content |
| bin/test + link check + junk guard                          | 66s      | verify job                             |
| changed files                                               | 12s      | path filter                            |
| eslint                                                      | 405s     | 7m 45s                                 |
| headless tests (html-headless, WebDriverIO)                 | 472s     | 7m 52s                                 |
| dotnet test (Blazor helper packages)                        | 128s     | 2m 8s                                  |
| example-app Playwright smoke (svelte-sveltekit-examples)    | 265s     | 4m 25s                                 |
| dotnet test (blazor-headless)                               | 83s      | 1m 23s                                 |
| example-app build + Playwright (alpine-examples)            | 370s     | 6m 10s                                 |
| headless tests (vue-headless)                               | 370s     | 6m 10s                                 |
| consumer smoke                                              | 807s     | 13m 27s                                |
| helper packages tests (react)                               | 147s     | 2m 27s                                 |
| headless tests (nunjucks-headless)                          | 293s     | 4m 53s                                 |
| headless tests (web-components-headless)                    | 211s     | 3m 31s                                 |
| example-app build + Playwright (nunjucks-eleventy-examples) | 2134s    | 35m 34s                                |
| headless tests (angular-headless)                           | 109s     | 1m 49s                                 |
| headless tests (react-headless)                             | 336s     | 5m 36s                                 |
| helper packages tests (nunjucks)                            | 170s     | 2m 50s                                 |
| helper packages tests (vue)                                 | 200s     | 3m 20s                                 |
| headless tests (svelte-headless)                            | 201s     | 3m 21s                                 |
| helper packages tests (alpine)                              | 82s      | 1m 22s                                 |
| helper packages tests (web-components)                      | 229s     | 3m 49s                                 |
| helper packages tests (angular)                             | 274s     | 4m 34s                                 |
| shadcn registry                                             | 55s      | npx shadcn add test                    |
| headless tests (alpine-headless)                            | 263s     | 4m 23s                                 |
| helper packages tests (svelte)                              | 347s     | 5m 47s                                 |
| helper packages tests (html)                                | 229s     | 3m 49s                                 |

### Totals

- **Total wall-clock**: ~35-40 minutes (jobs run in parallel)
- **Total sequential**: ~168 minutes if run serially
- **Longest jobs**: nunjucks-eleventy-examples (35m 34s), consumer smoke (13m 27s), headless tests

### Observations

1. **nunjucks-eleventy-examples** is the longest at 35+ minutes — its Playwright suite is the bottleneck
2. **consumer smoke** (13m 27s) packs and installs all published packages
3. **headless tests** range from 1m 49s (angular) to 7m 52s (html-headless)
4. **helper packages tests** range from 1m 22s (alpine) to 5m 47s (svelte)
5. **Install-heavy jobs** (eslint, headless, helper-packages) take 2-7 minutes each

## Optimization opportunities

Based on P24-T11: "the 13 jobs repeat the same installs, so a shared cache or a combined install may save more than any local tool."

### High-value targets

1. **Shared pnpm cache** — All Node jobs install pnpm dependencies. A shared cache could save ~1-2 minutes per job
2. **Combined install** — Instead of installing in each job, install once at the workflow level
3. **Parallelism** — The 13 headless catalogs could be matrixed more aggressively

### Cache hit rate tracking

To be measured over time. Current setup uses:

- pnpm cache (per-job)
- Node modules cache (per-job)
- NuGet cache (for .NET jobs)
- Playwright browser cache

## Collection script

```bash
# Get latest successful run
RUN_ID=$(gh run list -L 1 --json databaseId,conclusion --jq '.[] | select(.conclusion == "success") | .databaseId')

# Get job durations
gh run view $RUN_ID --json jobs | jq -r '
  .jobs[] |
  .name as $name |
  .startedAt as $start |
  .completedAt as $end |
  ((($end | fromdateiso8601) - ($start | fromdateiso8601)) / 60 | floor) as $mins |
  "\($name): \($mins)m"
'
```

## Next steps

- Record durations weekly for one month
- Track cache hit/miss patterns
- Identify jobs with the most install time vs. test time

---

_tasks.md P24-T11 — baseline collected 2026-11-11_
