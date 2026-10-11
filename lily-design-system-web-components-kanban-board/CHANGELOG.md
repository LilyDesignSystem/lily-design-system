# Changelog — `<lily-kanban-board>` (Web Components helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; focus and the roving cursor follow a moved card to its new
column; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `labels.moveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Direct port of
`@lilydesignsystem/svelte-kanban-board`, following the React, Vue,
Angular, and Blazor ports. Composes
`@lilydesignsystem/web-components-headless`'s `<lily-kanban-table>`
(unmodified) and `<lily-icon-button>` for the per-card move menu.
