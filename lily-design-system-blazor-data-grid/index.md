# DataGrid (Blazor helper)

A reusable Blazor (.NET 10) headless **interactive data grid**. It composes
`LilyDesignSystem.Blazor.Headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<DataGrid Label="Users" Columns="columns" Rows="rows" SelectionMode="DataGridSelectionMode.Multiple"
          @bind-Selected="selected" Labels="labels" />

@code {
    private IReadOnlyList<string> selected = Array.Empty<string>();

    private static readonly DataGridColumn[] columns =
    {
        new() { Id = "name", Header = "Name", Sortable = true, Resizable = true },
        new() { Id = "email", Header = "Email", Sortable = true },
        new() { Id = "role", Header = "Role", Sortable = true, Hidable = true },
    };

    private static readonly DataGridRow[] rows =
    {
        new() { ["name"] = "Alice", ["email"] = "alice@example.com", ["role"] = "Admin" },
        new() { ["name"] = "Bob", ["email"] = "bob@example.com", ["role"] = "Editor" },
    };

    private static readonly DataGridLabels labels = new()
    {
        Search = "Search users",
        SelectAll = "Select all rows",
        SelectRow = name => $"Select {name}",
    };
}
```

## What is Blazor-specific

| Svelte | Blazor |
| --- | --- |
| `selected`, `filter`, `sort`, `columnOrder`, `page` (bindable) | `@bind-Selected`, `@bind-Filter`, `@bind-Sort`, `@bind-ColumnOrder`, `@bind-Page` (a value plus a `…Changed` `EventCallback`) |
| a row (`Record<string, unknown>`) | `DataGridRow`, a `Dictionary<string, object?>`; links are `DataGridLink`, zoned times `DataGridZonedTime`, people `DataGridPerson`, files `DataGridFile` |
| `onCellEdit`, `onFilesSelected`, `onFileRemove`, `onRowActivate`, `onExport` | `OnCellEdit`, `OnFilesSelected`, `OnFileRemove`, `OnRowActivate` (`EventCallback`s), `OnExport`, and `ExportHandler` (a `Func<DataGridExport, bool>`: return `false` to stop the save) |
| `empty`, `footer`, column `cell`, `headerCell`, `avatar`, `personEditor` snippets | `Empty`, `Footer`, `DataGridColumn.Cell`, `HeaderCell`, `Avatar`, `PersonEditor` (`RenderFragment`s) |
| the closed string unions (`type`, `editor`, `pinned`, `align`, `aggregate`, …) | enums (`DataGridCellType`, `DataGridEditor`, `DataGridPinned`, …) |
| `Intl.NumberFormat` / `Intl.DateTimeFormat` options | .NET format strings: `NumberFormat`, `DateFormat`, `TimeFormat` (a zone shows as its id, never a short name) |
| `class` | `CssClass`; extra attributes splat onto the root |

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.DataGrid
```

Requires `LilyDesignSystem.Blazor.Headless`.

## Search, copy, keyboard and undo (0.10.0)

- Added search that matches every typed word in any order, ignoring case and diacritics (`SearchText`); Escape in the field clears it; `Labels.FilterAnnouncement` announces the count. The field carries the headless `search-input` class (written by hand, not composed).
- Added field search (`FilterField`, `FilterFieldChanged`, `Labels.SearchField`, `Labels.SearchAllFields`) and `RowFilter`.
- Added `EmptyValue` (and a column's own) with `data-empty` on every missing cell, and `Nulls` (`First` or `Last`) for where missing values sort.
- Added copy to the clipboard: `Labels.Copy` button, `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added undo and redo of cell edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `OnCellEdit`, with `Labels.UndoAnnouncement` / `RedoAnnouncement`.
- Added PageUp / PageDown by ten rows (the rows in view when virtualized), type-ahead on the first cell, and right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says). `GridMotion`, `Typeahead`, `EditHistory` and `SearchText` are public pure classes with the Svelte shared tests' vectors; the kanban board, Gantt chart and calendar reference this package and can use them.
- Added `Labels.Pagination`: the pager becomes a labelled `<nav>` landmark.
