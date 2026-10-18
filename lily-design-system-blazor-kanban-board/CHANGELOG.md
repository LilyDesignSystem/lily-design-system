# Changelog — KanbanBoard (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.8.1 — 2026-10-18

- Fixed: a card's cell no longer carries an `aria-label` of the title alone. Its accessible name was the title while a sighted user also saw the subtitle, badges and fields (WCAG 2.5.3, label in name; reported against a waitlist board). The cell is now named by its content, so the name includes everything visible. `cardLabel` still drives the title text, the title editor and the announcements.

## 0.8.0 — 2026-10-18

- Added `CanMoveToLane` (like `CanMove` plus the lane the card would land in; both vetoes apply, so existing `CanMove` code is unchanged), `AllowLaneChange`, `ShowSearchLabel` and `FieldLayout`. `AllowLaneChange=false` refuses every cross-lane drop; `ShowSearchLabel` shows `Labels.Search` as visible text tied to the search field (WCAG 2.5.3); `FieldLayout="compact"` sets `data-field-layout="compact"` on the board. Ported from the Svelte package.
- `ToKanbanLabels()` builds `KanbanLabels` from a label pack.
- In-place card title editing: `OnTitleEdit` (double-click a title, or F2 on the card; Enter or leaving the field commits, Escape cancels, an empty title is refused; not for linked cards or a `CardTemplate`). New labels `TitleEditor` and `TitleEditAnnouncement`.

## 0.7.0 — 2026-10-17

- Added search that matches every typed word in any order, ignoring case and diacritics, and looks in typed field text too; Escape in the field clears it; `Labels.SearchAnnouncement`. The field carries the headless `search-input` class (written by hand, not composed).
- Added copy to the clipboard: `Labels.Copy` (needs `ExportHeaders`), `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added PageUp / PageDown, type-ahead on card titles in the focused column, and right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says). Movement uses the new public `GridMotion` from the data-grid package.
- Added field `Validate` messages (`Labels.EditRefused`, `aria-invalid` on the open editor, cleared when the person types) and undo / redo of field edits (Ctrl/Cmd+Z once no move is left to undo, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `OnFieldEdit`, with `Labels.FieldUndoAnnouncement` / `FieldRedoAnnouncement`.
- Added a live drop cue: the cell a dragged card is over carries `data-drop-blocked` (not `data-drop-target`) when `CanMove`, `AllowedColumns` or a strict WIP limit would refuse it. Blazor cannot conditionally cancel `dragover`, so the browser's not-allowed cursor is not shown.
- Not yet ported from the Svelte package: composition from the headless layer and a missing-label check.

## 0.6.0 — 2026-10-16

- Added typed card fields (`Fields` as `DataGridColumn`s, `card.Values`, `Locale`), using the data grid's cell types, shown under the card title.
- Added inline field editing (`OnFieldEdit`, each field's `Editable`): click a value or press F2; typed editors, Enter / Escape / blur, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`Labels.ExportCsv` etc., `Labels.ExportHeaders`, `ExportScope`, `ExportFilename`, `OnExport` / `ExportHandler`).
- The package now references `LilyDesignSystem.Blazor.DataGrid`.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: a collapsed lane keeps its header row but renders no card rows. `@bind-CollapsedLanes` holds the collapsed lane ids; `Labels.CollapseLane` gates a toggle button in the lane header (`aria-expanded`); `Labels.LaneCount` gates a visible card count. The lane title is now wrapped in `.kanban-board-lane-title`.

## 0.4.0 — 2026-10-15

- Added multi-select (`selectable`, `selected`, selection-change callback; Ctrl/Cmd+click or `x`; moving one selected card moves the group), undo (`undoable`, Ctrl/Cmd+Z, `labels.undo`), column reordering (`movableColumns`, `columnOrder`; drag a header or Alt+Shift+ArrowLeft/Right), swimlanes (`lanes`, `card.laneId`; lane id as the fourth `onMove` argument), a drag preview (`dragPreviewText`, `data-dragging`) and virtualization (`virtualize`), ported from the Svelte 0.4.0.

## 0.3.0 — 2026-10-14

- Added collapsible columns, per-column add-card buttons and hard WIP limits (`strictLimit`), ported from the Svelte 0.3.0.
- Added `filter` and `compare`, drop position and in-column drag reorder, locked cards, Alt+ArrowLeft/Right column move and `cardAttrs`, plus the consumer-requested capabilities (card `subtitle` / `badges` / `href` and a card slot, `card.flag` / `column.flag` / `column.accent`, `allowedColumns`, async move with a pending state and rollback, column header and footer slots, `labels.emptyColumn`, board `search`), ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `canMove` (with `labels.moveBlocked`) and within-column reorder (Alt+ArrowUp/Down fires `onReorder`, with `labels.reorderAnnouncement`), ported from the Svelte 0.2.0.

## 0.8.1 — 2026-10-18 — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; focus and the roving cursor follow a moved card to its new
column; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `Labels.MoveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[Svelte package](../lily-design-system-svelte-kanban-board/)
to this catalog's own idioms: `partial class` code-behind, `xUnit` +
`bUnit`, NuGet packaging via `ProjectReference`.

Composes this catalog's own headless `KanbanTable` family
(`LilyBlazorHeadless.Components`) unmodified, plus `IconButton`/
`Listbox` for the per-card "Move to…" menu — the same components every
`*-picker` helper already depends on for its own trigger-button-opens-
listbox popup. Per WCAG 2.5.7 and the Atlassian Pragmatic Drag and Drop
accessibility research cited in the Svelte spec, card movement is never
arrow-key-drag-only: Enter/Space opens the move menu; native HTML5
drag-and-drop is supplementary. WIP limits render as a `data-over-limit`
styling hook, never enforced. One `aria-live="polite"` status region.

### Real finding: this catalog's headless `KanbanTable` family predates the WAI-ARIA Grid pattern

The canonical Svelte spec's §3 says the headless `KanbanTable` already
owns `<table role="grid">` and that `KanbanTableTD`'s own `active` prop
(roving `tabindex`/`aria-selected`) is reused as-is. Neither is true in
this catalog: `KanbanTable`/`KanbanTableBody`/`KanbanTableTD` render
`role="region"` / `role="list"` / `role="listitem"` respectively, and
`KanbanTableTD` has no `Active`/roving-tabindex concept at all — only
`Label`/`CssClass`/`ChildContent`/`AdditionalAttributes`.

Rather than modify the headless components (explicitly out of scope for
this port), each `role` is overridden per element to `grid`/`rowgroup`/
`gridcell` via `AdditionalAttributes` splatting, relying on Blazor's
documented attribute-merge order: in each headless component's own
markup the explicit `role="…"` appears *before* its own
`@attributes="AdditionalAttributes"`, so a caller-supplied `role` in
the splatted dictionary always wins. This was verified against the
actual rendered DOM (`KanbanBoardTests.cs`,
`Section_8_1_Body_And_Cells_Carry_Rowgroup_And_Gridcell_Roles`), not
assumed from reading the source. The entire roving-tabindex mechanism
(`tabindex`, `aria-selected`, `data-row`, `data-col`) is likewise
hand-rolled through the same splatting mechanism, ported directly from
the Svelte reference's behaviour (no headless `data-grid` exists yet in
this catalog to copy a roving-tabindex model from).

### Other deviations from the Svelte reference

- **Grid keydown stands down while the move menu is open.** Blazor's
  `KeyboardEventArgs` carries no event-target information (unlike the
  DOM event the Svelte reference inspects via
  `event.target.closest('[data-row][data-col]')`), so the grid-level
  handler cannot tell "key pressed on the cell" from "key pressed on
  the nested move button/listbox" by target alone. Guarding on
  "no menu is open" is simpler and more robust than trying to
  reconstruct target introspection.
- **`@ondragover` cannot carry both a handler and `:preventDefault` on
  a component tag.** Blazor's compiler lowers both to a single
  `ondragover` component parameter and rejects the collision
  (`RZ10010`). Default is prevented unconditionally via the modifier
  alone (no gating on "a card drag is in progress"); harmless, since
  the drop handler still only acts when it can resolve a real dragged
  `KanbanCard`.
- **Cell/move-button focus.** No component in the headless
  `KanbanTable` family exposes an `ElementReference` for its `<td>`.
  Grid-cell focus uses `IJSRuntime.InvokeVoidAsync("eval", …)` against
  a per-cell `id`, deferred to `OnAfterRenderAsync` (mirrors
  `DateTimePicker`'s own established pattern for the same situation).
  Move-button/listbox focus uses real `ElementReference`s, since both
  `IconButton` and `Listbox` expose one.

### Testing note

bUnit has no live browser focus model — a documented, pre-existing
limitation of this test harness (see the project memory note on a
prior picker bug that was "invisible to jsdom/bUnit"). This package's
suite verifies focus *intent*: which `ElementReference`/element id a
`FocusAsync`/`eval` interop call targeted, the same technique
`ThemePickerTests`/`DateTimePickerTests` already use. 15 tests, one or
more per §8 acceptance clause, all passing.

---

Lily™ and Lily Design System™ are trademarks.
