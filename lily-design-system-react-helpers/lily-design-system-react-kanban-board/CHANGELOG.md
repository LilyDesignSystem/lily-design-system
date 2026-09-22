# Changelog — KanbanBoard (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/)
(see [spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)),
translated to React 19 idioms (hooks instead of runes, controlled
callbacks instead of two-way binding). Composes
`@lilydesignsystem/react-headless`'s `KanbanTable` family (structural,
unmodified) and its `IconButton`/`Listbox` pair (the same components
every React preference picker already depends on) for the per-card
"Move to…" action menu. Per WCAG 2.5.7 and the Atlassian Pragmatic
Drag and Drop accessibility research cited in the Svelte spec, card
movement is never arrow-key-drag-only: Enter/Space opens the move
menu; native HTML5 drag-and-drop is supplementary. WIP limits render
as a `data-over-limit` styling hook, not an enforced block. One
`aria-live="polite"` status region announces every successful move.

Deliberate deviation from the reference: move-button focus-return uses
a per-card ref map instead of the Svelte version's single shared
`bind:ref` (which silently points at whichever card mounted last) —
see spec/index.md §12.

---

Lily™ and Lily Design System™ are trademarks.
