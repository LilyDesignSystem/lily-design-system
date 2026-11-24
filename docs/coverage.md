# Test coverage

<!-- Written by bin/coverage-report; run it again rather than editing. -->

Measured 2026-11-24 by `bin/coverage-report`, which runs each suite with coverage on: Vitest with
`@vitest/coverage-v8` for `shared/` and the Svelte headless catalog (its `components/`), and `dotnet test` with
coverlet for the Blazor catalog. The badge in `index.md` is the lines figure over all three. The Svelte figure
leaves out its byte-identical copies of `shared/` modules (14 files, such as `search-text.ts` and
`widget-keys.ts`): they are measured once, in `shared/`, where their tests are.

| Package                | Lines                        | Branches               | Functions              | Statements             |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- | ---------------------- |
| shared/ (pure modules) | 99.4% (4,130 of 4,154)       | 93.8% (4,206 of 4,485) | 99.9% (907 of 908)     | 98.6% (5,021 of 5,092) |
| Svelte headless        | 100.0% (4,598 of 4,600)      | 91.4% (1,557 of 1,704) | 99.8% (1,787 of 1,790) | 99.4% (6,432 of 6,469) |
| Blazor headless        | 99.7% (5,506 of 5,520)       | 89.1% (1,883 of 2,113) | —                      | —                      |
| **All three**          | **99.7%** (14,234 of 14,274) |                        |                        |                        |

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
