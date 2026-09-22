# Changelog — GanttChart (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-gantt-chart`
(proposed 2026-09-21) to this catalog's macro + client.js
architecture: a keyboard-and-pointer-accessible Gantt chart with row
hierarchy, milestones, percent-complete, finish-to-start dependency
data, a today marker, and a keyboard-accessible edit region composing
`@lilydesignsystem/nunjucks-date-time-picker` twice per session — the
first helper-to-helper macro composition in this catalog. Composes
`@lilydesignsystem/nunjucks-headless`'s gantt-table macro family
unmodified. The time-axis columns and every grid-body cell are built
by `gantt-chart.client.js` rather than the macro, since generating
them needs real civil-date arithmetic Nunjucks cannot do — see
spec/index.md §3. No other framework catalog's port is affected by
this release.
