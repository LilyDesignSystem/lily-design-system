# Changelog — KanbanBoard (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/CHANGELOG.md)
(2026-09-22). Composes `@lilydesignsystem/vue-headless`'s `KanbanTable`
family (structural, unmodified) and its `IconButton`/`Listbox` pair
(the same composition every Vue preference picker already uses) for a
per-card "Move to…" action menu. Per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, card
movement is never arrow-key-drag-only: pointer drag-and-drop is
supplementary to the keyboard-accessible move menu. WIP limits render
as a `data-over-limit` styling hook, not an enforced block. Keyboard
follows the same WAI-ARIA APG Grid roving-tabindex model as
`data-grid`. Drag-preview rendering, virtualization, undo/redo, column
reordering, swimlanes, card selection/bulk-move, search/filter, and
collapsible columns are documented v1 non-goals, not gaps — see
spec/index.md §9.

The Svelte canonical's `onMove` callback prop is this port's `move`
emitted event, matching how `picker-bar` and `date-time-picker`
already translate a callback prop into a Vue event. Per-card
`IconButton`/`Listbox` instances inside the `v-for` are captured via
function `ref`s rather than a static `ref="…"` name, since Vue
collects a static ref name lexically inside a `v-for` into an array —
this also fixes a latent focus-management inaccuracy the Svelte
canonical has (its single `bind:ref` inside an `#each` ends up bound
to whichever card's button rendered last, not necessarily the card
whose own move menu just closed; invisible to its own test suite
because the assertion only checks the focused element's class, not
its identity). This port refocuses the specific card's own button.

Needs its own `shims.d.ts` ambient module declaration for
`@lilydesignsystem/vue-headless`, for `vue-tsc`'s separate declaration
pass — the same convention every other Vue helper composing that
package already follows.

---

Lily™ and Lily Design System™ are trademarks.
