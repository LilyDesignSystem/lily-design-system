# Test coverage

<!-- Written by bin/coverage-report; run it again rather than editing. -->

Measured 2026-11-21 by `bin/coverage-report`, which runs each suite with coverage on: Vitest with
`@vitest/coverage-v8` for `shared/` and the Svelte headless catalog (its `components/`), and `dotnet test` with
coverlet for the Blazor catalog. The badge in `index.md` is the lines figure over all three. The Svelte figure
leaves out its byte-identical copies of `shared/` modules (13 files, such as `search-text.ts` and
`widget-keys.ts`): they are measured once, in `shared/`, where their tests are.

| Package                | Lines                        | Branches               | Functions              | Statements             |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- | ---------------------- |
| shared/ (pure modules) | 99.0% (3,327 of 3,360)       | 92.2% (3,171 of 3,439) | 99.3% (754 of 759)     | 98.0% (3,975 of 4,056) |
| Svelte headless        | 99.9% (4,567 of 4,573)       | 91.1% (1,531 of 1,681) | 99.8% (1,781 of 1,784) | 99.4% (6,400 of 6,441) |
| Blazor headless        | 99.7% (5,450 of 5,464)       | 86.4% (1,771 of 2,049) | —                      | —                      |
| **All three**          | **99.6%** (13,344 of 13,397) |                        |                        |                        |

Why these three: `shared/` holds the logic every package copies (search, filter, export, keyboard machines,
calendars), Svelte is the canonical catalog the others port, and Blazor is the one catalog in another language. The
other catalogs run the same tests in their own framework (each catalog's suite counts are in
[spec/testing](../spec/testing/index.md)); coverage for them is not measured yet.

The shared suite exercises `pattern-tester.ts` directly through the same framework-neutral handlers that catalogs
ship, and hands each of its runners broken and sabotaged widgets to check it rejects them. It also tests
`cell-types.ts` directly, including links, civil dates and times, zones, aggregates and formulas.
Its Vitest configuration enforces at least 98 percent line and function coverage whenever coverage is measured.

Coverage says which lines a test ran, not that the test checked them: the mutation tests (`bin/mutation-test`) and
the property tests (`shared/*.property.test.ts`) are the measure of how well `shared/` is checked.

---

Lily™ and Lily Design System™ are trademarks.
