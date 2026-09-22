# Changelog — `<kanban-board>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial implementation. Ported from the canonical
`@lilydesignsystem/svelte-kanban-board`, adapted to this catalog's
vanilla-custom-element idiom: no `KanbanTable`/`IconButton`/`Listbox`
component dependency (this catalog's headless `kanban-table` family is
markup-contract documentation, not a JS class), `columns`/`cards`/
`cardLabel`/`onMove`/`labels` are property-only, and a `movecard` event
pairs with the `onMove` property. Fixes the move-menu shared-button-
reference bug present in the Svelte canonical (and independently found
by every other framework catalog's own port) by keying move-button
references per card id instead of a single shared field. See
`spec/index.md` §10 for the full deviation list.
