# Lily Design System™ — Alpine.js GanttChart — Specification

Living specification. Project-wide rules: [root spec](../../spec/index.md). The contract is the Svelte reference
([spec](../../lily-design-system-svelte-gantt-chart/spec/index.md)); where they differ, Svelte wins.

## 1. Scope

### Built (0.1.0)

- A day scale over `range`; one row per visible task; `grid`, or `treegrid` with `aria-level` / `aria-expanded` when tasks nest.
- Bars as cell data attributes; milestones (`start === end`); `percentComplete`; parents spanning their descendants.
- Collapse and expand (a button, and Enter or Space on the parent's task cell); `collapsed` for the initial state.
- `today` and `weekends` marks on headers and cells; dependencies as an `aria-describedby` text summary.
- The optional critical path (shared `critical-path`): `data-critical`, `data-slack`, `labels.criticalLabel`.
- APG grid keys with a roving tabindex and right-to-left (shared `grid-navigation`, `direction`).

### Not built yet

Week and month scales, dragging and editing task dates (and undo), dependency arrows, `unavailable` days, `labels.dateAnnouncement`,
export, search, task selection, virtualization.

## 2. Rules

- No CSS, no text, no icons; every string is a `labels.*` value. The clock is never read.
- An Alpine expression that evaluates to a function is *called* by Alpine, so snippets test `!!labels.x`, never `labels.x`, in `x-if`.
- Shared pure modules are copies of `shared/`; edit `shared/`.

## 3. Acceptance criteria

- [x] `pnpm test` passes (rendering, bars, hierarchy, dependencies and critical path, keyboard).
- [x] `pnpm build` emits `dist/` with types.
- [x] Tests were checked by breaking the code (span, collapse, bar range, milestone, parent toggle, cursor clamp).
- [ ] The not-built list above.

## Related topics

[helpers](../../spec/helpers/index.md), [Alpine headless](../../lily-design-system-alpine-headless/spec/index.md).

Lily™ and Lily Design System™ are trademarks.
