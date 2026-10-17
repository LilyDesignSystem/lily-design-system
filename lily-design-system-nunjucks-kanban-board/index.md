# KanbanBoard (Nunjucks helper)

A reusable, headless Nunjucks 3 + vanilla-JS kanban board: cards move
between columns by pointer drag-and-drop or, independently, by a
keyboard-accessible per-card "Move to…" menu — never drag-only.
WAI-ARIA APG Grid roving-tabindex keyboard navigation throughout.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide. For topic deep-dives see [docs/](./docs/) and
for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [How the pieces fit](#how-the-pieces-fit)
- [Install](#install)
- [Quick start](#quick-start)
- [Macro parameters](#macro-parameters)
- [Client.js API](#clientjs-api)
- [Moving a card](#moving-a-card)
- [WIP limits](#wip-limits)
- [Accessibility](#accessibility)
- [Styling](#styling)
- [SSR and the first paint](#ssr-and-the-first-paint)
- [Testing](#testing)

## Why this exists

A kanban board is a grid with two independent, equally real ways to
move a card: pointer drag-and-drop, and a keyboard-accessible menu.
Most kanban implementations ship the first and treat the second as an
afterthought (or omit it — WCAG 2.5.7 Dragging Movements exists
precisely because drag-only interfaces lock out anyone who can't drag).
This helper makes the menu path a first-class citizen, structurally
identical to a picker helper's own icon-button-opens-listbox shape,
just anchored inside a grid cell instead of a page header.

The helper is a direct port of the Svelte canonical
`@lilydesignsystem/svelte-kanban-board`. The DOM contract and
behaviour match clause-for-clause; only the framework idioms differ —
see [spec/index.md §4](./spec/index.md#4-macro-parameters-and-nunjucks-deviations)
for the handful of documented deviations a Nunjucks macro's inability
to evaluate a callback requires.

## How the pieces fit

The helper is a **macro + client.js** pair, the same shape every
helper in this catalog follows:

- The macro (`kanban-board.njk`) renders the whole grid — columns,
  cards, every card's move button and move listbox (always present,
  hidden) — server-side or at static-site build time.
- The client (`kanban-board.client.js`) is an ES module the consumer
  loads once per page. It owns the roving-tabindex keyboard
  navigation, the move menu's open/close/keyboard contract, pointer
  drag-and-drop, and the `aria-live` announcement.

```
Nunjucks render time                   │  Browser runtime
                                        │
{{ kanbanBoard({…}) }}                  │  import { autoInit } from
   │                                    │    "./kanban-board.client.js";
   ▼                                    │  autoInit({ onMove, labels });
<div data-lily-kanban-board-root>       │     │
  <table role="grid">…</table>          │     ▼
  <p class="kanban-board-status"        │  finds every
     aria-live="polite"></p>            │  [data-lily-kanban-board-root]
</div>                                  │     │
                                        │     ▼
                                        │  wires roving-tabindex, one
                                        │  listbox controller per card,
                                        │  drag-and-drop, announcements
```

The board's cells are not interactive until `kanban-board.client.js`
runs. See [SSR and the first paint](#ssr-and-the-first-paint).

## Install

| File | Purpose |
| --- | --- |
| `kanban-board.njk` | The Nunjucks macro. |
| `kanban-board.client.js` | The ES-module runtime. |
| `spec/index.md` / `index.md` | Documentation. |

Runtime dependencies: `nunjucks` ≥ 3 server-side; standard DOM APIs
client-side. `@lilydesignsystem/nunjucks-headless` (kanban-table
macro family) and `@lilydesignsystem/nunjucks-listbox-behavior`
(the move menu's keyboard contract) are real npm `dependencies` of
this package.

## Quick start

```njk
{% from "@lilydesignsystem/nunjucks-kanban-board/template" import kanbanBoard %}

{{ kanbanBoard({
  label: "Sprint board",
  columns: [
    { id: "todo", title: "To do" },
    { id: "doing", title: "In progress", wipLimit: 3 },
    { id: "done", title: "Done" }
  ],
  cards: [
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "doing", title: "Build the macro" }
  ],
  labels: {
    cardCount: "{count} cards",
    overLimit: "Over limit: {count}/{limit}",
    moveButton: "Move {card}",
    moveMenuLabel: "Move to column",
    moveAnnouncement: "Moved" // stays a client.js concern — see below
  }
}) }}
```

```html
<script type="module">
  import { autoInit } from "@lilydesignsystem/nunjucks-kanban-board";

  autoInit({
    onMove(cardId, toColumnId) {
      // persist the move — an API call, a form submit, whatever your app does
    },
    labels: {
      moveAnnouncement: (cardTitle, columnTitle) => `${cardTitle} moved to ${columnTitle}`,
    },
  });
</script>
```

## Macro parameters

Full table, and every Svelte-prop-to-Nunjucks deviation, in
[spec/index.md §4](./spec/index.md#4-macro-parameters-and-nunjucks-deviations).
Required: `label`, `columns`, `cards`. Optional: `caption`, `labels`,
`name`, `id`, `classes`, `attributes`.

`cardLabel` has no macro-param equivalent — a macro cannot evaluate a
callback. The macro always renders `card.title`; resolve your own
display text on the card data itself before calling the macro.

## Client.js API

```js
import { initKanbanBoard, autoInit } from "@lilydesignsystem/nunjucks-kanban-board";
```

- `autoInit(opts?)` — find every `[data-lily-kanban-board-root]` on
  the page and wire it.
- `initKanbanBoard(root, opts?)` — wire a single root `<div>`; returns
  `{ destroy }`.

`opts`:

- `onMove(cardId, toColumnId)` — called after every successful move,
  by either path.
- `labels.moveAnnouncement(cardTitle, columnTitle)` — builds the
  `aria-live` announcement text. Absent means no announcement fires.

## Typed fields, editing and export

- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `editableFields` makes editable types edit in place (click, or F2). See [spec §12](./spec/index.md#12-typed-fields-inline-editing-export-060-2026-10-16).
- **Export** (0.6.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown (or selected) cards.
- Pass `fields` (declarative), each card's `values`, `editableFields: true` to edit in place, and `labels.exportHeaders` with `labels.exportCsv` / `exportTsv` / `exportExcel` for the export buttons. The client's `initKanbanBoard(root, { onFieldEdit, onExport, fieldHooks })` reports edits and files. See the spec for the label templates.

## Moving a card

**Keyboard (the accessible path).** Enter/Space on a focused card
opens that card's own "Move to…" menu. Arrow keys move the active
option; Enter/Space chooses it, calling `onMove`, closing the menu,
and returning focus to THAT card's own move button. Escape closes
without moving.

**Pointer (supplementary).** Drag a card's title onto another
column's cell. Calls the same `onMove` callback.

Neither path is more "real" than the other — see
[spec/index.md §7](./spec/index.md#7-behaviour) and
`spec/helpers/index.md`'s kanban-board contract for the WCAG 2.5.7
rationale.

## WIP limits

Set `column.wipLimit` (a number, including `0`) to mark a column
`data-over-limit` once its card count reaches or exceeds it, and to
render `labels.overLimit`'s substituted warning text. This is a
styling/announcement hook only — the board never refuses a move that
would exceed a limit.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly by this
  macro).
- Roving tabindex for the grid; the move menu itself uses
  `aria-activedescendant` mode (an APG listbox), via
  `@lilydesignsystem/nunjucks-listbox-behavior`.
- One `aria-live="polite"` region for every move announcement.

### Keyboard

| Key | Where | Action |
| --- | --- | --- |
| `Arrow` keys | Grid cell | Move the roving-tabindex cursor; clamp at the grid's edges. |
| `Home` / `End` | Grid cell | Jump to the first/last row of the current column. |
| `Ctrl+Home` / `Ctrl+End` | Grid cell | Jump to the grid's first/last cell. |
| `Enter` / `Space` | Grid cell | Open the focused card's move menu. |
| `Arrow Up` / `Down` | Move menu | Move the active destination option; clamps. |
| `Enter` / `Space` | Move menu | Choose the active option: move the card, close, refocus the button. |
| `Escape` | Move menu | Close without moving. |

## Styling

Ships no CSS. Class hooks: `.kanban-board` (root), `.kanban-board-count`,
`.kanban-board-wip-warning`, `.kanban-board-card-title`,
`.kanban-board-move-button`, `.kanban-board-move-list`,
`.kanban-board-move-option`, `.kanban-board-status`, plus every
`.kanban-table*` class from the composed headless macro family.

## SSR and the first paint

Nunjucks **is** the server side. The macro is pure and emits a
complete, correctly-labelled grid — every card in place, every move
menu present but hidden. **The board is not usable without
JavaScript**: drag-and-drop and the move menu both require
`kanban-board.client.js` to have run. This matches every other
picker/helper in this catalog's own documented no-JS trade-off.

## Testing

`vitest` under a jsdom environment exercises every §9 acceptance
clause in [spec/index.md §9](./spec/index.md#9-acceptance-criteria),
plus a dedicated regression suite for the shared-ref bug described in
[spec/index.md §10](./spec/index.md#10-shared-ref-regression-rigor-note).

## Files in this directory

| File | Purpose |
| --- | --- |
| `spec/index.md` | Single source of truth — API, behaviour, tests. |
| `AGENTS.md` | Fast-index pointer. |
| `kanban-board.njk` | The macro. |
| `kanban-board.client.js` | The ES-module runtime. |
| `kanban-board.test.ts` | vitest suite covering every spec §9 item. |
| `index.md` | This file. |
| `docs/` | Deep-dive topic guides. |
| `examples/` | Runnable Nunjucks templates. |
| `CHANGELOG.md` | Version history. |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the client option `onCopy({ text, rowCount })` (and the `copy` event) may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next card in the focused column whose label starts with them. A lone `x` stays the select shortcut when `selectable`; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(card, header, reason)` is announced, falling back to `labels.editInvalid`.
- With `undoable`, Ctrl/Cmd+Z takes back a **move** first while there is one, then field edits.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.fieldUndoAnnouncement(card, header, text)` / `labels.fieldRedoAnnouncement(card, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Drop cue, labels and direction (0.7.0)

- **A live "can't drop here" cue.** While a card is dragged, the cell under the pointer carries `data-drop-target` if it would accept the card, and `data-drop-blocked` (not `data-drop-target`) if `canMove`, `allowedColumns` or a full strict WIP limit would refuse it. A refused `dragover` is not cancelled and sets `dropEffect` to `none`, so the browser shows its own not-allowed cursor; an accepted one is cancelled and sets `move`. The cues clear on leave, drop and drag end. The reference themes outline an accepted cell with a dashed ring and stripe a refused one. This is the live twin of the announcement `labels.moveBlocked` makes after a refused keyboard move; a server-side refusal (a 422) still snaps the card back through `onMove` rejecting.
- **Every label is overridable.** All visible and spoken text is in `labels` (`emptyColumn`, `addCard`, `collapseColumn`, `laneCount`, the announcements and the rest); the only literal in the markup is the decorative `+` glyph of the add-card button, which has its accessible name from `labels.addCard`. A complete Chinese bundle is tested to leave no English in the DOM.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next column, and Alt+ArrowLeft/Right (move the card) and Alt+Shift+ArrowLeft/Right (move the column) follow the arrow. Vertical keys, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.137–§8.148.

## Search (0.7.0)

`search` (a macro param; the field renders when `labels.search` names it) narrows the cards: every word must appear, in any order, ignoring case and diacritics. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it. See spec §18.
