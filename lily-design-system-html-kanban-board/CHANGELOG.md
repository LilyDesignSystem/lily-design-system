# Changelog — `<kanban-board>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-10-01

**Dependency: `@lilydesignsystem/html-headless` widened to `^0.3.0`.**
This package imports `@lilydesignsystem/html-headless/components/listbox-controller.js`,
which no html-headless release before 0.3.0 actually delivered (0.1.x
lacks the module; 0.2.0 omitted it from the tarball and blocked it in
`exports`), so every earlier version of this package failed to import
from a real npm install with `ERR_PACKAGE_PATH_NOT_EXPORTED`. No source
change.

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
