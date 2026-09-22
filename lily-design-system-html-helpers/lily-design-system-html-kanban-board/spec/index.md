# `<kanban-board>` — Specification

Single source of truth for the `@lilydesignsystem/html-kanban-board` HTML
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-kanban-board`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/spec/index.md).
Per `AGENTS/helpers.md` the Svelte side wins on behaviour; this file
records the vanilla-custom-element idiom and the places the API shape
could not be carried over verbatim (§4 property-only members, §10 the
move-menu button-identity fix).

Sibling files:

- `kanban-board.ts` — the implementation (custom-element class)
- `kanban-board.test.ts` — vitest + jsdom spec exercising every clause in §8
- `index.ts` — barrel re-export + side-effectful registration
- `index.md` — user-facing guide

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only (WCAG 2.5.7; Atlassian's Pragmatic
Drag and Drop accessibility research, cited by the Svelte canonical).
WAI-ARIA APG Grid roving-tabindex keyboard navigation. The element owns
state and behaviour; it does not own the grid's visual styling.

## 2. Scope

In scope: rendering a board from `columns`/`cards` data, pointer
drag-and-drop between columns, a keyboard-accessible move menu per card,
WIP (work-in-progress) limits with a warning state, derived card counts,
APG grid roving-tabindex keyboard navigation, and an `aria-live` move
announcement region.

Out of scope (v1 non-goals, identical to the Svelte canonical's §2, not
silent gaps): drag-preview/ghost-element rendering, virtualization,
undo/redo, column reordering, swimlanes, card selection/bulk-move,
search/filter, collapsible columns. Each either requires real
visual/layout ownership that conflicts with "no bundled CSS, no
rendering opinion," or is a v2-sized feature better designed once v1
ships and is exercised in a real app.

## 3. Composition

Unlike the Svelte canonical (which composes `@lilydesignsystem/
svelte-headless`'s `KanbanTable` family and `IconButton`/`Listbox` as
real component dependencies), **this catalog's `kanban-table` family in
`@lilydesignsystem/html-headless` is pure markup-CONTRACT documentation**
(`.html` reference templates plus `.md` naming tables under
`lily-design-system-html-headless/components/kanban-table*.html` and
`AGENTS/components-helpers/kanban-table.md`) — there is no `KanbanTable`
JS class to import or instantiate. `<kanban-board>` therefore builds the
documented class names and structure by hand:

| Contract slug        | Rendered as                         |
| --------------------- | ------------------------------------ |
| `kanban-table`         | `<table class="kanban-table" role="grid">` |
| `kanban-table-head`    | `<thead class="kanban-table-head">`  |
| `kanban-table-body`    | `<tbody class="kanban-table-body">`  |
| `kanban-table-row`     | `<tr class="kanban-table-row">`      |
| `kanban-table-th`      | `<th class="kanban-table-th">`       |
| `kanban-table-td`      | `<td class="kanban-table-td">`       |

The contract's own accessibility note is "Implicit table role" (i.e.
none) — `<kanban-board>` sets `role="grid"` itself with no override to
resolve. Every element is built exclusively via
`document.createElement`/`appendChild`, never `innerHTML` or a template
string: a `thead`/`tbody`/`tr`/`th`/`td` start tag is silently dropped by
the HTML parser whenever it isn't already inside a real `<table>`'s own
insertion mode — true for `innerHTML` assignment exactly as for literal
light-DOM children.

The per-card move menu reuses `@lilydesignsystem/html-headless`'s
`ListboxController` (`components/listbox-controller.js`) for its
keyboard behaviour — the exact module `theme-picker` composes for its
own dropdown (see `theme-picker.ts`'s `#openMoveMenu`-equivalent
`openList()`/`#listboxController` for the established usage pattern).
The move menu's own markup (a hand-built `<ul role="listbox">` /
`<li role="option">` popup) is built the same way every picker in this
catalog builds its own dropdown — there is no fixed-tag autonomous
custom element that could stand in for it (see
[spec/helpers/index.md § Composition with the headless layer](../../../spec/helpers/index.md)
for why).

## 4. API surface

Unlike the Svelte canonical's flat `Props` object, a custom element
cannot receive an array of objects or a function as an HTML attribute.
This mirrors `date-time-picker`'s own §4.3 "property-only members" rule:

**Observed attributes** (string-valued, reflected as properties):
`label` (required — accessible name for the grid), `caption` (optional,
rendered as a `<caption>`), `class` (extra class on the rendered root).

**Property-only members** (set via JS, not HTML attributes):

| Property     | Type                                                     | Required | Default |
| ------------ | --------------------------------------------------------- | -------- | ------- |
| `columns`    | `KanbanColumn[]`                                           | yes      | `[]`    |
| `cards`      | `KanbanCard[]`                                             | yes      | `[]`    |
| `cardLabel`  | `(card: KanbanCard) => string`                              | no       | `card.title` |
| `onMove`     | `(cardId: string, toColumnId: string) => void`              | no       | —       |
| `labels`     | `KanbanLabels`                                              | no       | `{}`    |

`KanbanColumn`: `id` (required), `title` (required), `wipLimit?: number`.

`KanbanCard`: `id` (required), `columnId` (required), `title`
(required). Card order within a column follows the order cards appear
in the `cards` array.

`KanbanLabels` — every field optional, but its presence gates the
control it names, matching every other helper's label-gating
convention: `cardCount(count)`, `overLimit(count, limit)`,
`moveButton(card)` (accessible name for the per-card move trigger),
`moveMenuLabel` (accessible name for the move listbox),
`moveAnnouncement(cardTitle, columnTitle)`.

**Event.** Every move — by pointer or by the move menu — fires a
bubbling, composed `movecard` `CustomEvent` with
`detail: { cardId: string; toColumnId: string }`, paired with the
`onMove` property exactly as `theme-picker`'s `themechange` pairs with
its own callback convention. `onMove` runs first, then the event
dispatches.

## 5. HTML

```html
<kanban-board label="Sprint board">
  <div class="kanban-board {class}">
    <table class="kanban-table" role="grid" aria-label="{label}">
      <caption>{caption}</caption> <!-- only when caption is set -->
      <thead class="kanban-table-head">
        <tr class="kanban-table-row">
          <th class="kanban-table-th" data-over-limit>            <!-- only when column.wipLimit is exceeded -->
            {column.title}
            <span class="kanban-board-count">{labels.cardCount(count)}</span>            <!-- only when labels.cardCount -->
            <span class="kanban-board-wip-warning">{labels.overLimit(count, limit)}</span>  <!-- only when over limit -->
          </th>
        </tr>
      </thead>
      <tbody class="kanban-table-body">
        <tr class="kanban-table-row">
          <td class="kanban-table-td" data-row="{r}" data-col="{c}" tabindex="0|-1" aria-selected="true|false" aria-label="{cardLabel}">
            <span class="kanban-board-card-title" draggable="true">{cardLabel(card)}</span>
            <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded="false|true" tabindex="-1">…</button>
            <ul class="kanban-board-move-list" role="listbox" aria-label="{moveMenuLabel}" tabindex="-1">  <!-- only while open -->
              <li class="kanban-board-move-option" role="option" aria-selected="true|false">{destinationColumn.title}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="kanban-board-status" aria-live="polite"></p>
  </div>
</kanban-board>
```

## 6. Behaviour

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `.kanban-table-td` cells.

**Card move — pointer.** Native HTML5 drag-and-drop: a card's title
`<span>` is `draggable`; dropping it on another column's cell moves it
there via the same path the keyboard move menu uses. Supplementary, not
primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens that
card's own "Move to…" menu (a hand-built `role="listbox"` popup driven
by `ListboxController` in clamped-cursor mode); choosing a destination
column moves the card, closes the menu, and returns focus to **that
card's own** move button. Escape closes without moving.

**WIP limits.** `column.wipLimit`, when set, is compared against that
column's current card count; a column at or over its limit carries
`data-over-limit` on its header cell and renders `labels.overLimit`'s
text — rendered only when `labels.overLimit` is supplied. Not enforced
— a styling hook only.

**Announcements.** Every move writes a string to a single
`.kanban-board-status[aria-live="polite"]` region, built from
`labels.moveAnnouncement` — never a hardcoded sentence.

**Keyboard.** WAI-ARIA APG Grid pattern: exactly one body cell carries
`tabindex="0"` at a time. `ArrowUp`/`ArrowDown` move within a column and
clamp; `ArrowLeft`/`ArrowRight` move across columns and clamp;
`Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell; `Enter`/
`Space` opens the focused card's move menu.

**Custom-element lifecycle.** No work happens before
`connectedCallback()` — the constructor sets no DOM and reads no
attribute, matching `date-time-picker`'s own SSR-safety rule. Setting
`columns`, `cards`, `cardLabel`, or `labels` triggers a full structural
rebuild (`#render()`), which closes any open move menu — the same
"a structural change closes transient UI" rule `date-time-picker`
applies to its dialog on a structural attribute change.

## 7. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, set directly since the
headless `kanban-table` contract specifies no default role). Roving-
tabindex focus management for body cells. The move menu follows the
same icon-button-opens-listbox contract every picker in this catalog
uses (`aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant`
inside the open listbox, driven by `ListboxController`). State changes
are announced through one live region.

## 8. Acceptance criteria

- §8.1 Renders `<div class="kanban-board">` wrapping a
  `<table class="kanban-table" role="grid">` whose `aria-label` comes
  from `label`.
- §8.2 Renders one `.kanban-table-th` per column with its title and,
  when `labels.cardCount` is supplied, a derived card count.
- §8.3 A column at or over `wipLimit` carries `data-over-limit` and
  renders `labels.overLimit`'s text; a column under its limit, or with
  no `wipLimit` set, carries neither.
- §8.4 Cards render as a rectangular grid: the body has as many rows as
  the largest column's card count, and shorter columns pad with empty
  cells rather than shifting other columns' rows.
- §8.5 Exactly one body cell (`.kanban-table-td`) carries `tabindex="0"`
  at any time; arrow keys move it and clamp at the grid's edges rather
  than wrapping.
- §8.6 `Home`/`End` move within the current column; `Ctrl+Home`/
  `Ctrl+End` move to the grid's first/last cell.
- §8.7 Enter/Space on a focused card opens that card's own move menu
  (`aria-haspopup="listbox"`, `aria-expanded` toggles, a
  `role="listbox"` of destination columns appears).
- §8.8 Choosing a destination column in the move menu calls `onMove`
  (and dispatches `movecard`) with the card's id and the destination
  column's id, closes the menu, and returns focus to **that card's
  own** move button (see §10).
- §8.9 Escape closes the move menu without calling `onMove`.
- §8.10 A pointer drag-and-drop of a card onto another column's cell
  calls `onMove` the same way the keyboard path does.
- §8.11 Every successful move writes an announcement to
  `.kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §8.12 Any extra HTML attribute a consumer sets directly on the
  `<kanban-board>` element (e.g. `data-testid`) is already present on
  that element without any forwarding step — see §10's deviation note.
- §8.13 No hardcoded user-facing strings: every label comes from a
  property or a `labels.*` function; its absence disables the control
  it names (no count, no warning, no accessible name on the move
  button).

## 9. Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo, column
reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns. See §2 and
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md)
for the reasoning behind each.

## 10. Deviations from the Svelte canonical

1. **No `KanbanTable`/`IconButton`/`Listbox` component dependency.**
   This catalog's headless layer ships markup-contract `.html` files,
   not JS classes (see §3) — `<kanban-board>` builds the documented
   class names by hand instead of composing a component.

2. **`columns`/`cards`/`cardLabel`/`onMove`/`labels` are property-only,
   not attributes.** Custom-element attributes are strings; arrays of
   objects and functions cannot round-trip through one. Mirrors
   `date-time-picker`'s §4.3 precedent exactly.

3. **The move-menu button-identity fix.** Every other framework
   catalog's kanban-board port (React, Vue, Angular, Blazor, Web
   Components) independently found the same latent bug in the Svelte
   canonical: its move-menu binds a *single shared* button reference
   across every card, so closing a menu refocuses whichever card's
   button happened to render last — not the card whose menu actually
   closed. It is invisible to the Svelte test suite because that suite
   only asserts a CSS class on `document.activeElement`, never DOM
   identity. This port keeps a `Map<cardId, HTMLButtonElement>`
   (`#moveButtonEls`) instead of a scalar field, making the bug
   structurally impossible, and `kanban-board.test.ts` includes a
   dedicated regression test that opens and closes two different
   cards' menus in sequence and asserts DOM-node identity (`toBe`, not
   a class-name substring) — confirmed load-bearing by temporarily
   reintroducing a shared-reference field and observing both that test
   and the pre-existing §8.8 test fail.

4. **§8.12 "extra attributes spread onto the root" is re-scoped.** The
   Svelte version spreads unrecognised props onto a `<div>` it
   synthesizes at render time — necessary because Svelte creates that
   element. A custom element's own tag *is* the element the consumer
   authored; any attribute they set on `<kanban-board>` is already
   present in the DOM with no forwarding step required, so this port's
   §8.12 test asserts that directly rather than adding a generic
   attribute-forwarding mechanism with no established precedent
   elsewhere in this catalog (`theme-picker`/`date-time-picker` only
   forward `class` to their own inner root, nothing else).

5. **`movecard` event.** Not present in the Svelte canonical (Svelte
   uses only the `onMove` prop). Added to match this catalog's
   established convention that every property-only callback pairs with
   a bubbling, composed `CustomEvent` (`theme-picker`'s `themechange`,
   `date-time-picker`'s `datetimechange`).

## 11. Tracking

- Package directory: `lily-design-system-html-helpers/lily-design-system-html-kanban-board/`
- Spec version: 0.1.0
- Created: 2026-09-22
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
