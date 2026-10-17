# AGENTS — Filter (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; below is a fast index.

## What this package is

A headless Svelte 5 filter builder (`Filter.svelte`) and the pure functions behind it (`filter-model.ts`): build a tree of typed conditions and groups, then write it as JSON, SQL (parameterised, five dialects), MongoDB, OData, or an in-memory predicate. No CSS, no English, no default locale, no dependencies beyond Svelte.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | The contract (canonical). |
| `filter-model.ts` | Model, editing, validation, predicate, JSON, SQL, MongoDB, OData. Pure. |
| `filter-model.test.ts` | Its tests, including SQL quoting, escaping and injection cases. |
| `Filter.svelte` | The component (TypeScript + Svelte 5 runes). |
| `Filter.test.ts` | Component tests, §8.1–§8.25. |
| `search-text.ts` | The shared case- and diacritic-blind text folding (`foldText`). |
| `index.ts` | Barrel. |

## Rules to keep

- Every output is made from the **normalised** tree: incomplete conditions never reach one.
- SQL values are parameters; column names come only from declared fields and must be plain identifiers; `inline` is for display.
- No default English: add a string by adding it to `FilterLabels`.
- Immutable value: edits return new objects and share what did not change.

## Verify

`pnpm test`, `pnpm run build`, and `bin/test` from the monorepo root.
