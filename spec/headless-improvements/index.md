# What the helpers can teach the `*-headless` libraries

Research note, 2026-10-17. Question: which of the features the calendar, kanban board, Gantt chart and data grid helpers gained this month should move down into the headless libraries — so every consumer gets them, and the helpers stop carrying code the headless layer should own?

## Summary

The helpers sit on the headless table families (`DataTable`, `CalendarTable`, `KanbanTable`, `GanttTable`) and add almost everything themselves. Those families are thin: a `label`, a `caption`, a `class`, and an `active` or `selected` flag on one cell. Everything else a grid needs is passed through rest props or rebuilt by hand in each helper, four times over, in eight frameworks. The best improvements fall into three groups: **small additive props** on the table parts (cheap, no breaking change), **shared behaviour** that all four helpers re-implement (high leverage), and **headless components that exist but the helpers never use**.

## Evidence

- The helpers import from `@lilydesignsystem/*-headless` only the table families, plus `IconButton` and `Listbox` in the pickers. They do not use `Tooltip`, `Mark`, `SearchInput`, `PaginationNav`, `EmptyState`, `Editable`, `DataFilterForm` or `TagInput`, all of which exist, and hand-roll the same things (a tooltip per picker, `<mark>` for highlights, a pagination footer, an empty row, a cell editor, a search field).
- Seven framework-neutral modules are **copied byte for byte** between packages in Svelte alone: `search-text.ts` (5 copies), `cell-types.ts` and `export-data.ts` and `edit-history.ts` (4 each), `typeahead.ts` and `typed-fields.ts` (3 each), plus `unavailable.ts`. `md5` shows one distinct file per name. The ports multiply that by seven frameworks, and Blazor re-implements each in C#.
- Each helper carries its own APG grid keyboard handler: about 110 lines (data grid), 130 (kanban), 100 (Gantt), 75 (calendar) — arrows, Home/End, Ctrl+Home/End, PageUp/PageDown, type-ahead, undo/redo, roving tabindex.
- `DataTableTD`, `KanbanTableTD` and `GanttTableTD` deliberately never set `aria-selected` ("focus is not selection"), so a helper that has real selection must pass it through rest props; `CalendarTableTD` does set it. The family is inconsistent.

## Tier 1 — additive props on the table parts (no breaking change)

| Add | To | Why |
| --- | --- | --- |
| `sort` (`"ascending" \| "descending" \| "none"`) → `aria-sort`, plus `sortOrder` → `data-sort-order` | `*TableTH` | Every helper writes `aria-sort` and `data-sort-order` by hand. |
| `rowCount`, `colCount` → `aria-rowcount`, `aria-colcount`; `rowIndex` → `aria-rowindex`; `colIndex` → `aria-colindex` | `*Table`, `*TableRow`, `*TableTD/TH` | Needed whenever rows are paged or virtualized; the data grid, kanban and Gantt set them by hand. |
| `selected` → `aria-selected` and `data-selected`, separate from `active` | `*TableRow`, `*TableTD` (Data, Kanban, Gantt) | Make the four families agree with `CalendarTableTD`. |
| `weekend`, `outside`, `disabled`, `unavailable` (kinds) → `data-weekend`, `data-outside-period`, `data-disabled` + `aria-disabled`, `data-unavailable` | `CalendarTableTD/TH`, `GanttTableTD/TH` | The helpers set these through rest props; the names should be one contract (`data-partly-unavailable` too). |
| `pinned` → `data-pinned` | `DataTableTH/TD` | Sticky columns. |
| `dropAllowed` → `data-drop-allowed` / `data-drop-blocked` | `KanbanTableTD` | The "can't drop here" cue (see the open feedback). |

## Tier 2 — shared behaviour (highest leverage)

1. **A grid keyboard behaviour** as a headless primitive: a Svelte action / React hook / Vue composable / Angular directive / Blazor helper `gridKeyboard({ rows, cols, moveTo, typeahead, rtl })`. It owns arrows, Home/End, Ctrl+Home/End, PageUp/PageDown, type-ahead and the **right-to-left flip** (in RTL, ArrowLeft is "next"), and returns the roving position. Removes ~420 lines across four helpers per framework, and fixes RTL in one place.
2. **A framework-neutral core package** (`@lilydesignsystem/core`, zero dependencies) holding the pure modules — text folding and search, type-ahead, edit history, unavailable-day matching, export (CSV / TSV / XLSX / clipboard), cell types and typed fields, windowing math (`windowRows`), dependency-arrow geometry, SQL / JSON / Mongo / OData output of the filter. The TypeScript frameworks import it; `bin/test` already needs a drift check for the copies, which becomes unnecessary. Blazor keeps its C# ports, with a shared test-vector file so both are tested against the same cases.
3. **Windowing**: the spacer-row windowing in the data grid, kanban and Gantt is the same algorithm. A headless `TableSpacerRow` plus `windowRows()` in the core.
4. **A live-region primitive** (`LiveRegion` / `StatusRegion`): every helper and picker hand-rolls a polite status paragraph; a component that announces a message (and re-announces an identical one) would be reused everywhere.

## Tier 3 — use what already exists

| Existing headless component | Replaces in the helpers |
| --- | --- |
| `Mark` | the highlighted-match `<mark>` in search results |
| `SearchInput` | the hand-written `<input type="search">` + Escape-to-clear in four helpers (add `onclear` / Escape handling to `SearchInput` first) |
| `Tooltip` | the tooltip each of the ten pickers builds itself |
| `PaginationNav` / `PaginationList` | the data grid's footer |
| `EmptyState` | the data grid's empty row, the kanban empty-column text |
| `Editable` / `EditableForm` | the cell editors (Escape cancels, Enter commits, IME-safe) |
| `DataFilterForm` | the wrapper for the new `svelte-filter` builder; and `svelte-filter`'s rules could be offered as headless `FilterRule` / `FilterGroup` parts |
| `*-view` components (`DateTimeView`, …) | formatting a typed cell: a `DataTableCell` that takes `type`, `value`, `locale` |

Adoption needs checking against each helper's accessibility behaviour; where a headless component cannot yet do what the helper does, improve the component first — that is the point of moving down.

## Tier 4 — conventions and tests

- **Accessible-name coverage**: the headless parts already make names required props. Add a dev-only warning when a required name is an empty string, and give every helper the same `labels` pattern: a documented list of keys, a `requiredLabels(features)` function, and a dev warning for a missing one (this is also the open data-grid feedback).
- **A shared conformance suite** run by every grid-like component: renders with a non-English label bundle and fails on any English text or `aria-label` it did not supply; renders left-to-right and right-to-left and checks the keyboard flip; checks `aria-rowindex` / `aria-rowcount` under paging; checks `aria-sort`. One suite, imported by each package's tests.
- **Spec the contract once**: `data-*` names (`data-weekend`, `data-unavailable`, `data-selected`, `data-pinned`, `data-sort-order`, `data-today`, `data-drop-allowed`) in `spec/components` so the themes and consumers rely on one vocabulary.

## Suggested order

1. Tier 1 props, all eight frameworks (small, additive; unblocks removing rest-prop workarounds).
2. The core package and the grid keyboard primitive in Svelte, then React and Vue; the helpers switch over and shrink.
3. `LiveRegion` and the windowing spacer.
4. Adopt `Mark`, `SearchInput`, `Tooltip`, `PaginationNav`, `EmptyState` in the helpers, improving each where needed.
5. The conformance suite.

## Risks

- A core package is a new published dependency for every helper and a new thing to version; the alternative (keep copying, add a drift check) works but scales with frameworks × packages.
- Tier 1 changes headless attributes: additive, but the example apps and 57 themes select on some of them — verify with `bin/check-theme` and the axe sweeps.
- The keyboard primitive must keep each helper's quirks (kanban's Alt+Arrow move, the Gantt's `s` select shortcut, the data grid's header row at index −1); expose hooks rather than one rigid handler.

## Status

- **Done 2026-10-17 — one source for the copied modules.** `shared/` holds the pure modules and their tests; `bin/sync-shared-modules` copies each into every package that has a file of that name, and `--check` runs in `bin/test`. The first run fixed 60 stale copies (23 packages had an old `export-data.ts`, 18 an old `typed-fields.ts`). This is the note's "keep copying, add a drift check" alternative: it needs no new published package. The `@lilydesignsystem/core` package remains open as the longer-term option.
- **Done 2026-10-17 — the grid keyboard primitive (Tier 2.1), as a pure function.** `shared/grid-navigation.ts` (`gridMove`, `pageStepFor`) owns the arrows, Home / End (Ctrl or Cmd for the corners), PageUp / PageDown, clamping and the right-to-left swap; the Svelte data grid, kanban board and Gantt chart, and the React data grid, call it and keep only their own keys (Enter, F2, Alt+Arrow, `s`, undo, type-ahead) — about 70 lines removed. It is a function, not an action / hook / directive per framework: the movement is the shared part; focusing and roving tabindex differ per framework and stay in each helper. The calendar navigates by date, not by row and column, so it does not use it. The other frameworks adopt it as their helpers are ported.
- **Done 2026-10-17 (Svelte) — `Mark` and `SearchInput` adopted.** The data grid, kanban board, Gantt chart and calendar render their search field with the headless `SearchInput` and a highlighted match with `Mark`. The `search-input` and `mark` base classes join the existing `*-search` / `*-match` hooks; all 57 themes already style them, so the helpers' search fields now match the rest of the system. The other seven frameworks adopt them as their helpers are ported.
- **Done 2026-10-17 — `PaginationNav` adopted in the data grid (Svelte, React).** With `labels.pagination` the pager is a labelled `<nav>` landmark (it was an unnamed `<div>`); optional, so existing bundles are unaffected.
- **Checked and held back — each needs the headless component improved first, as the note warned:**
  - `Tooltip` renders nothing until `visible`; the ten pickers keep a `hidden` sibling in the DOM (the documented contract, and what the themes and tests rely on). `Tooltip` needs a mode that renders hidden before a picker can use it.
  - `EmptyState` is a `<div>`; the data grid's empty state is a table cell (`role="gridcell"` inside a row) and the kanban's is a `<span>` in a card slot, so a `<div>` would break the table structure for no gain.
  - `Editable` is plain text only: no IME guard (Enter confirming a candidate would commit), no `validate` / `aria-invalid`, no commit on blur, no typed editors — the data grid's cell editor does all of these, so `Editable` needs them first.
  - `DataFilterForm` is a `<form role="search">` wrapper; the `svelte-filter` builder is a `role="group"` with many buttons, and a `<form>` would make any button without `type="button"` submit. Adopting it means deciding the builder is a search form, which is a design call, not a swap.
- Open: the held-back Tier 3 components above, after improving each in the headless libraries.
