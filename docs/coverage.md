# Test coverage

<!-- Written by bin/coverage-report; run it again rather than editing. -->

Measured 2026-11-19 by `bin/coverage-report`, which runs each suite with coverage on: Vitest with
`@vitest/coverage-v8` for `shared/` and the Svelte headless catalog (its `components/`), and `dotnet test` with
coverlet for the Blazor catalog. The badge in `index.md` is the lines figure over all three.

| Package                | Lines                        | Branches               | Functions              | Statements             |
| ---------------------- | ---------------------------- | ---------------------- | ---------------------- | ---------------------- |
| shared/ (pure modules) | 81.2% (2,594 of 3,196)       | 73.6% (2,404 of 3,267) | 86.1% (619 of 719)     | 79.7% (3,065 of 3,847) |
| Svelte headless        | 96.2% (5,426 of 5,642)       | 84.6% (2,304 of 2,722) | 97.0% (1,968 of 2,029) | 94.9% (7,346 of 7,737) |
| Blazor headless        | 96.4% (5,250 of 5,445)       | 83.1% (1,689 of 2,033) | —                      | —                      |
| **All three**          | **92.9%** (13,270 of 14,283) |                        |                        |                        |

Why these three: `shared/` holds the logic every package copies (search, filter, export, keyboard machines,
calendars), Svelte is the canonical catalog the others port, and Blazor is the one catalog in another language. The
other catalogs run the same tests in their own framework (each catalog's suite counts are in
[spec/testing](../spec/testing/index.md)); coverage for them is not measured yet.

Most of what `shared/` leaves uncovered is `pattern-tester.ts`, the harness the packages' own tests run (172 test
files of them), so `shared/` itself barely calls it. `cell-types.ts` had no test of its own until P38-T12 added one.

Coverage says which lines a test ran, not that the test checked them: the mutation tests (`bin/mutation-test`) and
the property tests (`shared/*.property.test.ts`) are the measure of how well `shared/` is checked.

---

Lily™ and Lily Design System™ are trademarks.
