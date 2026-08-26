<!-- Synced from the canonical repository by bin/sync-special-files.
     Do not edit here; edit the root copy and re-run the script.
     Canonical: https://github.com/LilyDesignSystem/lily-design-system/blob/main/BENCHMARKS.md -->

# Benchmarks

**There are no runtime performance benchmarks for Lily Design System™ yet.**

This file says so plainly rather than leaving the question open, records the
measurements that *do* exist, and defines the methodology a future benchmark suite
should follow so its numbers mean something.

## Why there are no runtime benchmarks

Not an oversight — a consequence of what Lily is. A headless component renders
semantic HTML with ARIA attributes and attaches keyboard handlers. There is no
virtual DOM diffing strategy of Lily's own, no layout engine, no animation loop,
no data layer, and no CSS. What a Lily component costs at runtime is almost
entirely what the host framework costs to render an element, which is a benchmark
of Svelte, React, or Vue rather than of Lily.

Benchmarking that would produce numbers that look meaningful and are not. The
measurements below are the ones that actually reflect decisions Lily makes.

## What is measured

### Package size

Measured from the npm registry on 2026-08-26. `unpackedSize` is the installed
footprint before any bundling; `sideEffects: false` means a bundler drops what you
do not import, so the number that matters to your users is your bundle, not this
table.

| Package | Version | Unpacked | Files |
| --- | --- | --- | --- |
| `lily-design-system-svelte-headless` | 0.3.0 | 1364 KB | 987 |
| `lily-design-system-vue-headless` | 0.3.0 | 660 KB | 496 |
| `lily-design-system-react-headless` | 0.3.0 | 572 KB | 5 |
| `lily-design-system-react-theme-picker` | 0.1.0 | 38 KB | 4 |
| `lily-design-system-svelte-date-time-picker` | 0.1.0 | 82 KB | 6 |

All figures cover the full 491-component catalog. The file-count spread is a
packaging-format artifact: React bundles to a single ESM file through tsup, Vue
emits per-component chunks from Vite library mode, and Svelte ships compiled
component files because `svelte-package` must, so the Svelte consumer's compiler
can do its own work.

The 0.3.0 release was itself a size exercise, and the before/after is the clearest
optimisation record the project has:

| Package | 0.2.0 | 0.3.0 | Change |
| --- | --- | --- | --- |
| React | 1995 files / 2.8 MB | 5 files / 572 KB | −80% |
| Vue | 1980 files / 2.6 MB | 496 files / 660 KB | −75% |
| Svelte | 3968 files / 6.8 MB | 987 files / 1.36 MB | −80% |

Cause: 0.2.0 shipped the entire source tree with a `main` pointing at a file that
was never built, so the packages were both oversized and unimportable. 0.3.0 added
a real `dist/`, a `files` allowlist, and an entry point verified by installing the
packed tarball into a scratch project and importing it as a consumer would. Full
record in [CHANGELOG.md](CHANGELOG.md).

### Runtime cost of the zero-install path

Zero. Path 1 in [INSTALL.md](INSTALL.md) — copying the markup — adds no
JavaScript, no dependency, and no bytes beyond the HTML itself. For the many
components that are pure structure, this is the whole story, and it is the reason
the website leads with it.

### Theme stylesheet size

The 45 stylesheets in [`themes/`](https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes) are plain CSS, loaded one at a time.
`theme-picker` swaps the `href` on a single managed `<link>`, so exactly one theme
is ever fetched — switching costs one stylesheet request, not 45.

### Test suite scale

Point-in-time snapshots. Re-run the suites for current numbers; these are recorded
so a regression in *coverage* is visible.

| Suite | Cases | Snapshot |
| --- | --- | --- |
| svelte-headless (vitest) | 4,016 | 2026-05-30 |
| nunjucks-headless (vitest) | 2,393 | 2026-05-30 |
| react-headless (vitest) | 2,205 | 2026-05-30 |
| vue-headless (vitest) | 2,187 | 2026-05-30 |
| blazor-headless (bUnit) | 1,245 | 2026-05-30 |
| angular-headless (vitest) | 974 | 2026-05-30 |
| html-headless (WebDriverIO) | 407 spec files | 2026-05-30 |
| All seven helper catalogs | 1,847 | 2026-07-31 |
| Playwright e2e, per browser-runnable example app | 612–1,221 specs | 2026-05-30 |

### Accessibility baselines

axe-core via Playwright, on the WCAG 2.0 A+AA, 2.1 A+AA, and 2.2 AA rule sets:
29/29 routes clean on five example apps, 17/17 on the Nunjucks Eleventy app
(2026-05-30 snapshot).

Read [AI_STATEMENT.md](AI_STATEMENT.md) §12 before treating this as an
accessibility result. Automated tooling covers a minority of WCAG success criteria,
and Lily has shipped fully green suites over real defects.

### Responsive sweep

Four viewports (375×667, 768×1024, 1280×800, 2560×1440) × ~10 routes per app,
asserting skip-link presence, visible `<main>` and H1, and no horizontal page
overflow.

## Methodology for future benchmarks

If runtime benchmarks are added, they should answer questions a consumer actually
has, and each must state its baseline — a number without one is not a benchmark.

| Question worth answering | Measure | Baseline to compare against |
| --- | --- | --- |
| Does importing Lily bloat my bundle? | Bundled + minified + gzipped size of a realistic app importing 10, 50, and 200 components | The same app with hand-written equivalents |
| Does tree-shaking actually work? | Bundle size for one imported component vs. the whole barrel | Should be within noise of hand-written |
| Do the helpers cost anything meaningful? | Time to interactive with 3 pickers in a page header | The same page without them |
| Is a large catalog page usable? | Render and interaction timing on `/components` at 491 entries | Framework baseline for a list of the same size |
| Does theme switching stall? | Time from click to repaint on a `theme-picker` selection | A hardcoded `<link>` swap |

Rules for any such suite:

- **State the hardware, the browser, the versions, and the date.** An unlabelled
  number rots.
- **Report a distribution, not one run.** Median and p95 across at least 10 runs.
- **Publish the harness in the repository.** A benchmark nobody can re-run is a
  claim, not a measurement.
- **Compare against a real alternative**, not against nothing.
- **Never publish a number the project would not publish if it were bad.**

## Contributing a benchmark

If you have measured Lily against something in production, that is more valuable
than anything the project can generate for itself, and it is wanted here — good or
bad. Open an issue at
<https://github.com/LilyDesignSystem/lily-design-system/> or email
<joel@joelparkerhenderson.com>.

---

Lily™ and Lily Design System™ are trademarks.
