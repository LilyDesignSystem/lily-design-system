# AGENTS — DataGrid (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the Svelte
reference for anything it does not restate. Read it first; everything below is a fast index.

## What this package is

A reusable Nunjucks (a macro that server-renders a readable table skeleton, plus a client runtime that makes it interactive) headless interactive data grid. It composes `@lilydesignsystem/nunjucks-headless`'s `DataTable`
family (a real dependency, unmodified) and adds sort, filter, selection, resize, reorder,
pagination, APG Grid keyboard navigation, cell editing, virtualization, export and twelve cell
types. Ships no CSS.

Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/)
(2026-10-16), the reference implementation — see [spec/helpers/index.md § data-grid contract](../spec/helpers/index.md).
Run `pnpm install`, `pnpm test`, `pnpm build` here; there are no Lily dependencies.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `data-grid.njk` | The macro: skeleton table plus embedded JSON config. |
| `data-grid.client.ts` | `initDataGrid`, `autoInit`, `resolveLabels`; bundles the grid. |
| `data-grid.ts`, `cell-types.ts`, `export-data.ts` | The grid element and pure modules (copies of the HTML / Svelte ones). |
| `data-grid.test.ts`, `export-data.test.ts` | Vitest tests (Nunjucks render + jsdom). |
| `index.md` | User guide. |

## Public surface

- Template `./template` (macro `dataGrid`); module: `initDataGrid`, `autoInit`, `resolveLabels`, `DataGrid`, and the pure helpers.

Required: `label`, `columns`, `rows`.

## Conventions this package follows

- Row ids are computed once from each row's position in `rows`; never derive an id from a sorted or paged index.
- Hot-path work (sort keys, filter search index, selection set, each cell's value and formatted text, rollup
  and formula results) is computed once per input change, never per render, comparison or keystroke.
- No bundled CSS, fonts or images; every user-facing string is a `labels.*` prop, and a label's presence gates the control it names.
- No formula engine and no string evaluation: a formula column calls the consumer's `evaluate`.
- The grid never uploads files, fetches people or mutates `rows`.
