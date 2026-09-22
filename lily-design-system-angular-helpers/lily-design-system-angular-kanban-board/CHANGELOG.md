# Changelog — KanbanBoard (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-kanban-board`
(2026-09-22) to Angular 20: composes
`@lilydesignsystem/angular-headless`'s `KanbanTable` family
(structural, unmodified) and `IconButton`/`Listbox` (the same headless
pair every `*-picker` in this catalog already depends on) for a
per-card "Move to…" action menu. Per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, card
movement is never arrow-key-drag-only: pointer drag-and-drop is
supplementary to the move-menu keyboard path. Also ships WIP-limit
warnings as a `data-over-limit` styling hook (not enforced), derived
card counts, and one `aria-live="polite"` status region. Column
reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns, drag-preview rendering, virtualization, and
undo/redo are documented v1 non-goals, not gaps — see spec/index.md
§9.

Three real deviations from the Svelte reference were found while
reading Angular's headless `KanbanTable`/`KanbanTableTD` source (as
this port's own instructions required, rather than guessing the
markup):

- `KanbanTableTD` has **no `active` prop at all** in this catalog's
  Angular port (Svelte's does, and reuses it for the roving-tabindex
  cursor). There is no contract to collide with; `KanbanBoard` sets
  `data-row`/`data-col`/`tabindex`/`aria-selected` directly via
  attribute bindings on the native `<td lily-kanban-table-td>` cell in
  its own template instead. `KanbanTableTD` is not modified.
- `KanbanTable` sets **no `role="grid"`** on its rendered `<table>`
  (Svelte's does). Since `KanbanTable` is on this port's "do not
  modify" list, `KanbanBoard` applies `role="grid"` itself in
  `ngAfterViewInit()` — a plain DOM write outside Angular's own
  change-detection tracking (so it persists across later checks),
  the same category of fix as the roving-tabindex `querySelector` this
  component already performs. See spec/index.md §3.
- `KanbanTable` has **no `caption` input** (Svelte's does). A
  `<caption>` element is valid projected content as a `<table>`'s
  first child regardless, so `KanbanBoard` projects one conditionally;
  no headless change needed.

One additive extension to the shared headless `IconButton` component
(`lily-design-system-angular-headless/components/IconButton.ts`) was
needed and made: a `tabIndex` input (default `null`, unchanged
behaviour when unset) so the per-card move-menu trigger is not an
independent Tab stop inside the WAI-ARIA APG grid — the roving-tabindex
cursor must be the *only* stop. The Svelte reference achieves the same
thing with a plain `tabindex="-1"` rest-prop spread, which Angular's
`IconButton` (no generic spread-onto-inputs mechanism, per its own doc
comment) has no equivalent for. This mirrors the same additive-only
extension precedent already recorded for `IconButton`/`Listbox` in
[spec/helpers/index.md § Composition with the headless layer](../../spec/helpers/index.md).
`IconButton`'s own 7-test suite, and the full headless catalog suite
(1029 tests across 491 components), were re-run after the change and
stay green.

A real correctness bug was caught and fixed during test-rigor
verification (mutation-testing each new test, per this catalog's own
calibration standard): the first draft of `focusMoveButton` used a
single shared reference to "the move button," matching a latent defect
already present in the Svelte reference this package ports (there,
every card's `IconButton` binds the same `bind:ref` variable, so
whichever card's button mounts *last* wins, not necessarily the one
whose menu just closed — invisible because the original test only
asserted the focused element's shared CSS class, which every card's
button carries regardless). Fixed here by querying the specific card's
own button via a `data-card-id` attribute rather than any shared
reference, and the test was strengthened to assert the focused
button's `aria-label` (unique per card), which fails against the
"last-rendered wins" behaviour and passes against the fix — see
`kanban-board.component.spec.ts`'s own comment on §8.8.

`onMove` (a Svelte callback prop) becomes the `move` output, this
catalog's established idiom.

---

Lily™ and Lily Design System™ are trademarks.
