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
| Svelte headless        | 99.3% (4,542 of 4,573)       | 89.1% (1,494 of 1,677) | 99.4% (1,772 of 1,782) | 98.4% (6,337 of 6,437) |
| Blazor headless        | 99.5% (5,439 of 5,464)       | 86.1% (1,764 of 2,049) | —                      | —                      |
| **All three**          | **99.3%** (13,308 of 13,397) |                        |                        |                        |

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
