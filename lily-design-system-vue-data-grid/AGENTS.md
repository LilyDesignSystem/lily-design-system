# AGENTS — DataGrid (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the Svelte
reference for anything it does not restate. Read it first; everything below is a fast index.

## What this package is

A reusable Vue 3 headless interactive data grid. It composes `@lilydesignsystem/vue-headless`'s `DataTable`
family (a real dependency, unmodified) and adds sort, filter, selection, resize, reorder,
pagination, APG Grid keyboard navigation, cell editing, virtualization, export and twelve cell
types. Ships no CSS.

Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/)
(2026-10-16), the reference implementation — see [spec/helpers/index.md § data-grid contract](../spec/helpers/index.md).
Run `pnpm install`, `pnpm test`, `pnpm build` here; tests resolve `@lilydesignsystem/vue-headless` from `../lily-design-system-vue-headless/dist/`, so build that first.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `DataGrid.vue` | Implementation. Vue 3 Composition API (`<script setup>` plus exported types). |
| `cell-types.ts`, `export-data.ts` | Pure TypeScript, byte-for-byte copies of the Svelte modules. |
| `DataGrid.test.ts`, `export-data.test.ts` | Vitest specs (`@testing-library/vue`), one or more assertions per §8 acceptance. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |

## Public surface

- Default export and named export: `DataGrid`; types `Props`, `DataGridColumn`, `DataGridRow`, `DataGridLabels`, `DataGridCellContext`, `DataGridCellEdit`, `DataGridExport`, `DataGridSelectionMode`, `DataGridSort`, `DataGridSortDirection`; the pure helpers of `cell-types.ts` and `export-data.ts`.

Required props: `label`, `columns`, `rows`.

## Conventions this package follows

- Row ids are computed once from each row's position in `rows`; never derive an id from a sorted or paged index.
- Hot-path work (sort keys, filter search index, selection set, each cell's value and formatted text, rollup
  and formula results) is computed once per input change, never per render, comparison or keystroke.
- No bundled CSS, fonts or images; every user-facing string is a `labels.*` prop, and a label's presence gates the control it names.
- No formula engine and no string evaluation: a formula column calls the consumer's `evaluate`.
- The grid never uploads files, fetches people or mutates `rows`.
