# DataGrid — Specification (Angular helper)

Canonical contract for `@lilydesignsystem/angular-data-grid`, ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the cross-catalog contract). Same behaviour, Angular idioms. Where this file is silent the Svelte spec decides:
markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9), cell editing and virtualization (§13),
export (§14, and [excel-export](../../lily-design-system-svelte-data-grid/spec/excel-export/index.md)) and the twelve
[cell types](../../lily-design-system-svelte-data-grid/spec/cell-types/index.md).

## 1. Purpose

A headless interactive data grid over `@lilydesignsystem/angular-headless`'s unmodified `DataTable` family. It owns state and
behaviour; it ships no CSS and no English.

## 2. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTH` and
`DataTableTD` from `@lilydesignsystem/angular-headless` (a real dependency, never vendored). `cell-types.ts` and `export-data.ts` are
byte-for-byte copies of the Svelte modules (pure TypeScript) and ship with their own tests.

## 3. Angular idioms

- **Models and outputs.** `selected`, `filter`, `sort`, `columnOrder` and `page` are `model()`s; notifications are outputs (`cellEdit`, `filesSelected`, `fileRemove`, `rowActivate`, `exportFile`). `exportHandler` is an input because it must return `false` to stop the save; `activateRows` stands in for "a listener is attached", which an Angular output cannot report.
- **Templates.** `empty`, `footer` and a column's `cell`, `headerCell`, `avatar`, `personEditor` are `TemplateRef`s (context `$implicit`).
- **The table root.** The headless `lily-data-table` renders a plain `<table>` with no `role`, so the grid sets `role`, `aria-rowcount` and `aria-busy` on that inner table after each render. Body cells and rows are the native `td`/`tr`, so their roles and tabindex are bound directly.
- **Attributes.** `rowAttrs` and a column's `cellAttrs` are applied by the `lilyDataGridAttrs` directive (a template cannot spread a record). Extra attributes belong on the `<lily-data-grid>` host.
- **Cell cache, persistence.** Each cell's value and formatted text are read once per row object and column (reset when the columns change); `storageKey` restores widths, hidden columns and sort in an effect and writes in another.

## 4. Acceptance criteria

§8.1–§8.119 are the Svelte reference's clauses, each exercised in this package's tests with the same section number
(the `export-data` tests §8.57–§8.66, §8.78 and §8.115 run unchanged). The tests mount the component with TestBed and drive it with `@testing-library/dom`; the Svelte suite's callbacks map to outputs and models, and its snippets to `TemplateRef`s from a small host component.

## 5. Relationship to the headless layer

Depends on `@lilydesignsystem/angular-headless` as a regular dependency. In local dev/test `vitest.config.ts` aliases it to the ng-packagr output of `../lily-design-system-angular-headless/`, so build that first (`bin/list-helper-packages angular`).

## 6. Release notes

See [CHANGELOG.md](../CHANGELOG.md). 0.9.0 is the first release: it is at the version of the Svelte package it ports.
