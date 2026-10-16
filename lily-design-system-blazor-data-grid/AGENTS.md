# AGENTS — DataGrid (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the Svelte
reference for anything it does not restate. Read it first; everything below is a fast index.

## What this package is

A reusable Blazor (.NET 10) headless interactive data grid. It composes `LilyDesignSystem.Blazor.Headless`'s `DataTable`
family (a real dependency, unmodified) and adds sort, filter, selection, resize, reorder,
pagination, APG Grid keyboard navigation, cell editing, virtualization, export and twelve cell
types. Ships no CSS.

Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/)
(2026-10-16), the reference implementation — see [spec/helpers/index.md § data-grid contract](../spec/helpers/index.md).
Run `dotnet test` in `tests/` here; it builds `lily-design-system-blazor-headless` from source.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `DataGrid.razor`, `DataGrid.razor.cs` | The component: markup and code-behind. |
| `DataGridModels.cs` | Columns, labels, enums, row and value types. |
| `CellTypes.cs`, `ExportData.cs` | The C# ports of the Svelte `cell-types.ts` and `export-data.ts`. |
| `DataGridTests.cs`, `ExportDataTests.cs` | bUnit and xUnit specs (compiled by `tests/`). |
| `index.md` | User guide. |

## Public surface

- `DataGrid` (component), `DataGridColumn`, `DataGridRow`, `DataGridLabels`, `DataGridSort`, the enums, the value records, `CellTypes` and `ExportData` (static helpers).

Required parameters: `Label`, `Columns`, `Rows`.

## Conventions this package follows

- Row ids are computed once from each row's position in `rows`; never derive an id from a sorted or paged index.
- Hot-path work (sort keys, filter search index, selection set, each cell's value and formatted text, rollup
  and formula results) is computed once per input change, never per render, comparison or keystroke.
- No bundled CSS, fonts or images; every user-facing string is a `labels.*` prop, and a label's presence gates the control it names.
- No formula engine and no string evaluation: a formula column calls the consumer's `evaluate`.
- The grid never uploads files, fetches people or mutates `rows`.
