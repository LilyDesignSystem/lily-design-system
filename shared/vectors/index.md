# Shared test vectors

Input and output cases for the pure modules in `shared/`, so the Swift and Kotlin ports
([spec/apple-swift](../../spec/apple-swift/index.md), [spec/android-kotlin](../../spec/android-kotlin/index.md)) can prove they
behave as the TypeScript does (tasks.md P43-T3).

- One file per module, `{module}.json`: `{ "module", "description", "cases": [{ "fn", "args", "expected" | "throws" }] }`.
- `expected` is `null` where the TypeScript returns `undefined` or `null`.
- `throws: true` means the call must fail (a `RangeError` in TypeScript; an error or `nil`-returning throw in the ports).
- `truncateMiddleByClusters` is `truncateMiddle` with `measure` counting grapheme clusters, so every platform measures alike.
- `highlightSegments` works on code points (TypeScript `Array.from`): use Unicode scalars in Swift and code points in Kotlin.
- Only locale-independent functions are here. Locale-formatted output (`formatQuantity`, `formatRange`, …) depends on each
  platform's ICU data and is tested in each port against its own platform.

`shared/vectors.test.ts` replays every file against the TypeScript, so a vector edited without the module agreeing fails
`pnpm test` in `shared/`. To add cases, add them to a file (or a file for a new module and its functions to the runner) and run
that test. The first run of these vectors found that `ageParts` could return a negative day count after the end of a short
month; fixed 2026-11-22 in TypeScript and C#.
