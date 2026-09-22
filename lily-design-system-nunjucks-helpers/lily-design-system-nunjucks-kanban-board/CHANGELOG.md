# Changelog — KanbanBoard (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-kanban-board`
(proposed 2026-09-21) to this catalog's macro + client.js
architecture: a keyboard-and-pointer-accessible kanban board with
WAI-ARIA APG Grid roving-tabindex keyboard navigation, a per-card
"Move to…" menu (composed from `@lilydesignsystem/nunjucks-listbox-
behavior`), WIP-limit warnings, derived card counts, and `aria-live`
move announcements. Composes `@lilydesignsystem/nunjucks-headless`'s
kanban-table macro family unmodified. No other framework catalog's
port is affected by this release.
