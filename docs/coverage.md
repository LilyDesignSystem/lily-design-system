# Test coverage

<!-- Written by bin/coverage-report; run it again rather than editing. -->

Measured 2026-11-20 by `bin/coverage-report`, which runs each suite with coverage on: Vitest with
`@vitest/coverage-v8` for `shared/` and the Svelte headless catalog (its `components/`), and `dotnet test` with
coverlet for the Blazor catalog. The badge in `index.md` is the lines figure over all three.

| Package                | Lines                        | Branches               | Functions              | Statements             |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- | ---------------------- |
| shared/ (pure modules) | 99.0% (3,319 of 3,352)       | 92.2% (3,159 of 3,427) | 99.3% (753 of 758)     | 98.0% (3,965 of 4,046) |
| Svelte headless        | 96.2% (5,428 of 5,644)       | 84.7% (2,300 of 2,714) | 97.0% (1,969 of 2,029) | 95.0% (7,350 of 7,739) |
| Blazor headless        | 96.4% (5,258 of 5,453)       | 83.2% (1,691 of 2,033) | —                      | —                      |
| **All three**          | **96.9%** (14,005 of 14,449) |                        |                        |                        |

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
