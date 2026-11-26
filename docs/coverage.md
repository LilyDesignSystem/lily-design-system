# Test coverage

<!-- Written by bin/coverage-report; run it again rather than editing. -->

Measured 2026-11-26 by `bin/coverage-report`, which runs each suite with coverage on: Vitest with
`@vitest/coverage-v8` for `shared/` and the Svelte headless catalog (its `components/`), and `dotnet test` with
coverlet for the Blazor catalog. The badge in `index.md` is the lines figure over all three. The Svelte figure
leaves out its byte-identical copies of `shared/` modules (15 files, such as `search-text.ts` and
`widget-keys.ts`): they are measured once, in `shared/`, where their tests are.

| Package                | Lines                        | Branches               | Functions              | Statements             |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- | ---------------------- |
| shared/ (pure modules) | 99.4% (4,196 of 4,220)       | 95.0% (4,322 of 4,548) | 99.9% (921 of 922)     | 98.7% (5,094 of 5,161) |
| Svelte headless        | 100.0% (4,696 of 4,698)      | 91.6% (1,589 of 1,735) | 99.8% (1,836 of 1,839) | 99.4% (6,577 of 6,614) |
| Blazor headless        | 99.8% (5,652 of 5,666)       | 90.0% (2,059 of 2,289) | —                      | —                      |
| **All three**          | **99.7%** (14,544 of 14,584) |                        |                        |                        |

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
