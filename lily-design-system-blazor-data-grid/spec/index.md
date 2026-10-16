# DataGrid — Specification (Blazor helper)

Canonical contract for `LilyDesignSystem.Blazor.DataGrid`, ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see [spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
for the cross-catalog contract). Same behaviour, Blazor idioms. Where this file is silent the Svelte spec decides:
markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9), cell editing and virtualization (§13),
export (§14, and [excel-export](../../lily-design-system-svelte-data-grid/spec/excel-export/index.md)) and the twelve
[cell types](../../lily-design-system-svelte-data-grid/spec/cell-types/index.md).

## 1. Purpose

A headless interactive data grid over `LilyDesignSystem.Blazor.Headless`'s unmodified `DataTable` family. It owns state and
behaviour; it ships no CSS and no English.

## 2. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTH` and
`DataTableTD` from `LilyDesignSystem.Blazor.Headless` (a real dependency, never vendored). `cell-types.ts` and `export-data.ts` are
byte-for-byte copies of the Svelte modules (pure TypeScript) and ship with their own tests.

## 3. Blazor idioms

- **Parameters.** The five bindable values are a parameter plus a `…Changed` `EventCallback`; unbound, the grid owns the value. Notifications are `EventCallback`s; `ExportHandler` is a `Func` because it must return `false` to stop the save.
- **Rows and values.** A row is a `DataGridRow` (a dictionary); typed values are records (`DataGridLink`, `DataGridZonedTime`, `DataGridPerson`, `DataGridFile`). A civil date is `"YYYY-MM-DD"` or `DateOnly`.
- **Formatting.** There is no `Intl`: a `Locale` is a .NET culture name, and `NumberFormat`, `DateFormat`, `TimeFormat` are .NET format strings. A time zone shows as its id (.NET has no short zone names). With no locale a value shows as stored.
- **Focus.** Focus moves are JS-eval-by-id calls deferred to `OnAfterRenderAsync`, as in KanbanBoard and DateTimePicker.
- **What Blazor cannot do** (each is a documented deviation from the Svelte reference): a key event carries no target element, so the grid cannot tell a key pressed on a cell from one pressed on a widget inside it (the grid's own editors stop their keys; a consumer's widgets in a cell are ordinary tab stops and there is no cell-entering model); a handler cannot conditionally `preventDefault`, so an arrow key may also scroll the page; the resize handle is keyboard-only; a time-zone editor commits on Enter (focus leaving the pair is not observable); the file input is `InputFile` (`IBrowserFile`, no `File` objects, dropping is the browser's own); an input method's Enter is `Process`, which is how composition is ignored.

## 4. Acceptance criteria

§8.1–§8.119 are the Svelte reference's clauses, each exercised in this package's tests with the same section number
(the `export-data` tests §8.57–§8.66, §8.78 and §8.115 run unchanged). The tests are bUnit `[Fact]`s named `Section_8_n_…`; the clauses that need a key-event target, pointer capture, `File` objects or `Intl` are not ported (see § 3).

## 5. Relationship to the headless layer

Depends on `LilyDesignSystem.Blazor.Headless` as a regular dependency. The project references `lily-design-system-blazor-headless` as a `ProjectReference`; `dotnet pack` turns it into a NuGet dependency.

## 6. Release notes

See [CHANGELOG.md](../CHANGELOG.md). 0.9.0 is the first release: it is at the version of the Svelte package it ports.
