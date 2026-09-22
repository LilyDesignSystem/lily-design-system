# Changelog — KanbanBoard (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[Svelte package](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/)
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
