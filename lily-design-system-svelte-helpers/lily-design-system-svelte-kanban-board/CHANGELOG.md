# Changelog — KanbanBoard (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Proposed and specced in
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md),
then implemented here as the canonical (and, for now, only) catalog.
Composes `@lilydesignsystem/svelte-headless`'s `KanbanTable` family
(structural) and `IconButton`/`Listbox` (the per-card "Move to…"
action-menu trigger and popup) rather than duplicating either. Ships
pointer drag-and-drop between columns and, independently, a
keyboard-accessible move menu — per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, the
keyboard path is the action-menu, not arrow-key dragging. Also ships
WIP limits with a warning state, derived card counts, and `aria-live`
move announcements. Drag-preview rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
and collapsible columns are documented v1 non-goals, not gaps — see
spec/index.md §9.

---

Lily™ and Lily Design System™ are trademarks.
