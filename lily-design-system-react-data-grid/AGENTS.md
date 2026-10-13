# AGENTS — DataGrid (React helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the Svelte
reference for anything it does not restate. Read it first; everything below is a fast index.

## What this package is

A reusable React 19 headless interactive data grid. It composes
`@lilydesignsystem/react-headless`'s `DataTable` family (a real npm dependency, unmodified)
and adds sort, client-side filter, row selection, column resize/visibility, pagination, and
WAI-ARIA APG Grid roving-tabindex keyboard navigation. Ships no CSS.

Ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/) (2026-10-13),
which is the reference implementation — see
[spec/helpers/index.md § data-grid contract](../spec/helpers/index.md).
Run `pnpm install`, `pnpm test`, `pnpm build` here; tests resolve
`@lilydesignsystem/react-headless` from `../lily-design-system-react-headless/dist/`, so build
that first.

## Files

| File                | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `spec/index.md`     | Specification-driven contract (canonical).              |
| `DataGrid.tsx`      | Implementation. TypeScript + React 19 hooks.            |
| `DataGrid.test.tsx` | Vitest spec, one or more assertions per §8 acceptance.  |
| `index.ts`          | Barrel re-export.                                       |
| `index.md`          | User guide.                                             |

## Public surface

- Default export and named export: `DataGrid`.
- Type exports: `Props`, `DataGridColumn`, `DataGridRow`, `DataGridLabels`,
  `DataGridCellContext`, `DataGridSelectionMode`, `DataGridSort`, `DataGridSortDirection`.

Required props: `label`, `columns`, `rows`.

## Conventions this package follows

- Each of `selected`, `filter`, `sort`, `page` is controlled when supplied, else owned by the
  component and seeded by its `default…` twin; every change calls the matching `on…Change`.
- Render props (`cell`, `headerCell`, `footer`) and a node (`empty`) instead of snippets.
- Row ids are computed once from each row's position in `rows` and key the body rows; never
  derive an id from a sorted or paged index.
- Hot-path work (sort keys, filter search index, selection `Set`, each cell's value and
  formatted text) is computed once per input change, never per render, comparison or keystroke.
- No bundled CSS, fonts or images; every user-facing string is a `labels.*` prop, and a
  label's presence gates the control it names.
