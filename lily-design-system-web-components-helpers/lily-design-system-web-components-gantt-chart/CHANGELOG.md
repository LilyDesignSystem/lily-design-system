# Changelog — `<lily-gantt-chart>` (Web Components helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-22

Initial release. Direct port of `@lilydesignsystem/svelte-gantt-chart`.
Composes `@lilydesignsystem/web-components-headless`'s
`<lily-gantt-table>` (unmodified) and, twice per edit session, the
sibling helper `@lilydesignsystem/web-components-date-time-picker` —
this catalog's first helper-to-helper composition. Civil-date
arithmetic is reused from `date-time-picker` rather than re-derived.
