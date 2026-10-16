# DataGrid — Specification (Nunjucks helper)

Canonical contract for `@lilydesignsystem/nunjucks-data-grid`, ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the cross-catalog contract). Same behaviour, Nunjucks idioms. Where this file is silent the Svelte spec decides:
markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9), cell editing and virtualization (§13),
export (§14, and [excel-export](../../lily-design-system-svelte-data-grid/spec/excel-export/index.md)) and the twelve
[cell types](../../lily-design-system-svelte-data-grid/spec/cell-types/index.md).

## 1. Purpose

A headless interactive data grid over `@lilydesignsystem/nunjucks-headless`'s unmodified `DataTable` family. It owns state and
behaviour; it ships no CSS and no English.

## 2. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTH` and
`DataTableTD` from `@lilydesignsystem/nunjucks-headless` (a real dependency, never vendored). `cell-types.ts` and `export-data.ts` are
byte-for-byte copies of the Svelte modules (pure TypeScript) and ship with their own tests.

## 3. Nunjucks idioms

- **Skeleton and config.** The macro emits a readable `<table>` and a `<script type="application/json" data-data-grid-config>`; `<` is escaped as `\u003c` so data cannot close the script.
- **Labels.** Function labels are template strings with `{placeholders}`; `resolveLabels` converts them.
- **Declarative columns.** No functions cross the macro boundary.
- **Deviation.** The skeleton shows raw values; typed formatting appears when the client runs.

## 4. Acceptance criteria

§8.1–§8.119 are the Svelte reference's clauses, each exercised in this package's tests with the same section number
(the `export-data` tests §8.57–§8.66, §8.78 and §8.115 run unchanged). Tests render the macro with Nunjucks and run the client in jsdom.

## 5. Relationship to the headless layer

Depends on `@lilydesignsystem/nunjucks-headless` as a regular dependency. This package has no Lily dependencies.

## 6. Release notes

See [CHANGELOG.md](../CHANGELOG.md). 0.9.0 is the first release: it is at the version of the Svelte package it ports.
