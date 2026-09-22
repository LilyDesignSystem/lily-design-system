# KanbanBoard — Specification (Nunjucks helper)

Canonical contract for `@lilydesignsystem/nunjucks-kanban-board`. Ports
[the Svelte canonical's spec](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/spec/index.md)
(proposed 2026-09-21 in
[spec/helpers/index.md § kanban-board contract](../../../spec/helpers/index.md))
to this catalog's macro + client.js architecture. The DOM contract and
behaviour match clause-for-clause; only the framework idioms — and the
handful of documented deviations §4 covers — differ.

## 1. Purpose

A headless control that turns a set of cards and columns into an
interactive kanban board: cards move between columns by pointer
drag-and-drop or, independently, by a keyboard-accessible per-card
"Move to…" menu — never drag-only. WAI-ARIA APG Grid roving-tabindex
keyboard navigation. The macro renders the markup; `kanban-board.client.js`
owns all state and interactive behaviour, the same server/client split
every helper in this catalog follows.

## 2. Scope

In scope: rendering a board from `columns`/`cards` data, pointer
drag-and-drop between columns, a keyboard-accessible move menu per
card, WIP (work-in-progress) limits with a warning state, derived card
counts, APG grid roving-tabindex keyboard navigation, and `aria-live`
move announcements.

Out of scope (v1 non-goals, not silent gaps — see §9): drag-preview/
ghost-element rendering, virtualization, undo/redo, column reordering,
swimlanes, card selection/bulk-move, search/filter, collapsible
columns. Each either requires real visual/layout ownership that
conflicts with "no bundled CSS, no rendering opinion," or is a
v2-sized feature better designed once v1 ships and is exercised in a
real app. Matches the Svelte canonical's own non-goal list exactly.

## 3. Composition

`kanban-board.njk` imports, unmodified, a real npm dependency's
macros: `@lilydesignsystem/nunjucks-headless`'s kanban-table family
(`kanbanTable`, `kanbanTableHead`, `kanbanTableBody`, `kanbanTableRow`,
`kanbanTableTh`, `kanbanTableTd`) — the same "depend on, don't vendor"
rule the Svelte canonical follows for `KanbanTable`. `kanban-table`'s
own `<table role="grid">` role is NOT a macro default — this macro
sets `attributes: {role: "grid"}` explicitly on every call, since none
of the headless table-family macros set one themselves.

Unlike the Svelte canonical (which also composes headless `IconButton`/
`Listbox` for the move-menu popup), this macro renders the move
button and move listbox itself as plain HTML — there is no headless
`IconButton`/`Listbox` MACRO pair in this catalog (those are Svelte
components); `kanban-board.client.js` instead composes
`@lilydesignsystem/nunjucks-listbox-behavior`'s `createListboxKeyboard`
for the move listbox's own APG keyboard contract, the same shared
module every picker helper's `client.js` already depends on.

## 4. Macro parameters and Nunjucks deviations

A Nunjucks macro cannot evaluate a callback prop. Every deviation below
follows an established precedent elsewhere in this catalog (see
`kanban-board.njk`'s own header comment for the full reasoning):

| Svelte prop | Nunjucks shape | Rule |
| --- | --- | --- |
| `cardLabel: (card) => string` | not a macro param | Always renders `card.title`. Resolve the display text on the card data itself before calling the macro — mirrors `share-picker`'s "pass the already-resolved value" precedent. |
| `labels.cardCount: (count) => string` | `labels.cardCount` — template string, `{count}` token | e.g. `"{count} cards"`. Substituted via the `replace` filter. |
| `labels.overLimit: (count, limit) => string` | `labels.overLimit` — template string, `{count}`/`{limit}` tokens | e.g. `"Over limit: {count}/{limit}"`. |
| `labels.moveButton: (card) => string` | `labels.moveButton` — template string, `{card}` token | e.g. `"Move {card}"`, substituted with the card's title. |
| `labels.moveMenuLabel` | `labels.moveMenuLabel` — plain string | Already a plain string in Svelte; no deviation needed. |
| `labels.moveAnnouncement: (cardTitle, columnTitle) => string` | `initKanbanBoard(root, {labels: {moveAnnouncement}})` — stays a real function | Never called by the macro: a move only ever happens after hydration, so the announcement is entirely `kanban-board.client.js`'s concern. |
| `onMove: (cardId, toColumnId) => void` | `initKanbanBoard(root, {onMove})` — client.js init option | Same reasoning as `moveAnnouncement`. |

Every `labels.*` field stays optional; its presence gates the
control/text it names, matching every other Lily helper's i18n-clean
convention — absence means "" / no render, never a baked-in English
string.

Params (single `opts` object):

| Param | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | yes | — |
| `columns` | `array<{id, title, wipLimit?}>` | yes | — |
| `cards` | `array<{id, columnId, title}>` | yes | — |
| `caption` | `string` | no | — |
| `labels` | `object` (see table above) | no | `{}` |
| `name` | `string` | no | `"board"` |
| `id` | `string` | no | `"kanban-board-{name}"` |
| `classes` | `string` | no | — |
| `attributes` | `object` | no | — |

Card order within a column follows the order cards appear in the
`cards` array — matches the Svelte canonical.

Custom move-button glyph: call the macro with a `{% call %}` block; the
block body replaces the default glyph inside EVERY card's move button
(one macro invocation renders the whole board, so there is no per-card
override — a documented Nunjucks-shape limitation, not a bug).

## 5. Implementation notes — Nunjucks scoping

Every nested composition in `kanban-board.njk` is built with plain
macro-call expressions (`{{ someMacro(args) }}`) and each headless
macro's `html`/`attributes` params, NEVER Nunjucks' `{% call %}` block
form for structural nesting. A variable introduced with `{% set %}` in
an enclosing macro body is NOT visible inside a nested
`{% call otherMacro() %}...{% endcall %}` body (only that body's own
loop variables and the enclosing macro's OWN parameters are) — a real
Nunjucks scoping trap. Building every level bottom-up as a `| safe`-
marked HTML string, threading every value the leaf needs as an
explicit macro parameter, sidesteps it entirely. See AGENTS.md
"Nunjucks gotchas".

## 6. HTML

```
<div class="kanban-board {classes}" data-lily-kanban-board-root>
  <table class="kanban-table" role="grid" aria-label="{label}">
    <thead class="kanban-table-thead">
      <tr class="kanban-table-row">
        <th class="kanban-table-th" data-over-limit>            <!-- only when column.wipLimit is exceeded -->
          {column.title}
          <span class="kanban-board-count">{cardCount substituted}</span>
          <span class="kanban-board-wip-warning">{overLimit substituted}</span>  <!-- only when over limit -->
        </th>
      </tr>
    </thead>
    <tbody class="kanban-table-tbody">
      <tr class="kanban-table-row">
        <td class="kanban-table-td" data-row data-col tabindex>   <!-- tabindex=0 only at [0,0] -->
          <span class="kanban-board-card-title" draggable="true">{card.title}</span>
          <button class="kanban-board-move-button" aria-haspopup="listbox" aria-expanded="false">…</button>
          <ul class="kanban-board-move-list" role="listbox" hidden>  <!-- always rendered, hidden -->
            <li class="kanban-board-move-option" role="option">{destinationColumn.title}</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="kanban-board-status" aria-live="polite"></p>
</div>
```

Unlike the Svelte canonical's `{#if openCardId === card.id}` block,
every card's move button and move listbox render UNCONDITIONALLY at
SSR time (hidden via the `hidden` attribute and `aria-expanded="false"`)
— there is no server-side notion of "the menu that happens to be
open." This is also why the shared-ref regression described in §10
cannot occur here: every card's move button is a distinct, stable DOM
node from first render onward.

## 7. Behaviour

**Rendering.** Cards are grouped by `columnId` and rendered as a
rectangular grid: the number of body rows equals the largest column's
card count, and a column with fewer cards pads its remaining rows with
empty `<td>` cells — the same "sparse but rectangular" trade-off
documented in spec/helpers/index.md.

**Card move — pointer.** Native HTML5 drag-and-drop: a card's title
span is `draggable`; dropping it on another column's cell moves it
there via the same `onMove` callback the keyboard path uses.
Supplementary, not primary.

**Card move — keyboard.** Enter/Space on a focused card cell opens
that card's own "Move to…" menu — a `<ul role="listbox">`, its APG
keyboard contract (arrow move/clamp, Home/End, Escape, Tab-out) owned
by `@lilydesignsystem/nunjucks-listbox-behavior`'s
`createListboxKeyboard`, one controller per card. Choosing a
destination column calls `onMove`, closes the menu, returns focus to
THAT card's own move-button (never a shared "last opened" reference —
see §10), and announces the result. Escape closes without moving.

**WIP limits.** `column.wipLimit`, when set (including `0`), is
compared against that column's current card count; a column at or
over its limit carries `data-over-limit` on its header cell and
renders `labels.overLimit`'s substituted text — rendered only when
`labels.overLimit` is supplied.

**Announcements.** Every move writes a string to a single
`kanban-board-status` `aria-live="polite"` region, built from
`labels.moveAnnouncement` — never a hardcoded sentence.

**Keyboard.** WAI-ARIA APG Grid pattern: exactly one body cell carries
`tabindex="0"` at a time. `ArrowUp`/`ArrowDown` move within a column
and clamp; `ArrowLeft`/`ArrowRight` move across columns and clamp;
`Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell; `Enter`/
`Space` opens the focused card's move menu.

**SSR.** The macro is pure — same `opts` in, same HTML out — and emits
`cards` in their given order with every move menu closed. None of the
interactive behaviour above works until `kanban-board.client.js` runs
and `autoInit()`/`initKanbanBoard()` is called — the same real, real,
documented no-JS regression every other picker in this catalog
accepts.

## 8. Accessibility

WAI-ARIA APG Grid pattern (`role="grid"`, set explicitly by this
macro). Roving-tabindex focus management for body cells. The move menu
follows the exact icon-button-opens-listbox contract every preference
picker uses (`aria-haspopup="listbox"`, `aria-expanded`,
`aria-controls`, an APG listbox inside). State changes are announced
through one live region.

## 9. Acceptance criteria

- §9.1 Renders `<div class="kanban-board">` wrapping a `<table
  role="grid">` whose `aria-label` comes from `label`.
- §9.2 Renders one header cell per column with its title and, when
  `labels.cardCount` is supplied, a derived card count.
- §9.3 A column at or over `wipLimit` (including exactly `0`) carries
  `data-over-limit` and renders `labels.overLimit`'s substituted text;
  a column under its limit, or with no `wipLimit` set, carries
  neither.
- §9.4 Cards render as a rectangular grid: the body has as many rows
  as the largest column's card count, and shorter columns pad with
  empty cells rather than shifting other columns' rows.
- §9.5 Exactly one body cell (`.kanban-table-td`) carries
  `tabindex="0"` at any time; arrow keys move it and clamp at the
  grid's edges rather than wrapping.
- §9.6 `Home`/`End` move within the current column; `Ctrl+Home`/
  `Ctrl+End` move to the grid's first/last cell.
- §9.7 Enter/Space on a focused card opens that card's own move menu
  (`aria-haspopup="listbox"`, `aria-expanded` toggles, a
  `role="listbox"` of destination columns appears).
- §9.8 Choosing a destination column in the move menu calls `onMove`
  with the card's id and the destination column's id, closes the
  menu, and returns focus to THAT card's own move button — never a
  different card's (see §10).
- §9.9 Escape closes the move menu without calling `onMove`.
- §9.10 A pointer drag-and-drop of a card onto another column's cell
  calls `onMove` the same way the keyboard path does.
- §9.11 Every successful move writes an announcement to
  `kanban-board-status` (`aria-live="polite"`) built from
  `labels.moveAnnouncement`; no announcement fires when that label is
  absent.
- §9.12 Extra attributes spread onto the root `<div>`.
- §9.13 No hardcoded user-facing strings: every label comes from a
  macro param or a `labels.*` template string/function.

## 10. Shared-ref regression (rigor note)

Every other framework catalog's port of this component (React, Vue,
Angular, Blazor, Web Components, HTML) independently found and fixed
the same latent bug in the Svelte canonical: its move-menu binds a
SINGLE shared button reference (`bind:this={moveButtonEl}`) across
every card, so closing one card's menu can refocus whichever card's
button mounted LAST, not the card whose own menu closed.

That bug's precondition — multiple cards sharing one mutable "the
button" variable — cannot occur in this port BY CONSTRUCTION:
`kanban-board.njk` renders one real, permanent DOM node per card at
SSR time (§6), and `kanban-board.client.js` keeps one controller per
card in a `Map` keyed by the card's own id, always looking a card's
button up by ITS id, never through a single "last opened/mounted"
variable. `kanban-board.test.ts`'s "shared-ref regression" describe
block opens and closes two different cards' menus in sequence and
asserts each one refocuses its own button — proven load-bearing by
deliberately reintroducing a single shared variable and confirming the
test fails.

## 11. Relationship to the headless layer and other helpers

`kanban-board.njk` composes two different dependencies: the structural
kanban-table macro family (matching `data-grid`'s relationship to
`data-table` in this catalog) and `@lilydesignsystem/nunjucks-listbox-
behavior`'s `createListboxKeyboard` for the move-menu's own APG
keyboard contract (the same shared module every picker helper already
depends on). Follows every other helper's established rules: headless
(no bundled CSS), SSR-safe, i18n-clean (label-presence gates each
control), macro + client.js architecture throughout.
