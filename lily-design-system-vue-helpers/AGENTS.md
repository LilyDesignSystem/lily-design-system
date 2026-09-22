# AGENTS — Lily Vue Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`@lilydesignsystem/vue-theme-picker`](./lily-design-system-vue-theme-picker/) — dynamic theme CSS loader.
- [`@lilydesignsystem/vue-locale-picker`](./lily-design-system-vue-locale-picker/) — `lang` + `dir` locale picker.
- [`@lilydesignsystem/vue-text-size-picker`](./lily-design-system-vue-text-size-picker/) — `data-text-size` text-size picker.
- [`@lilydesignsystem/vue-motion-picker`](./lily-design-system-vue-motion-picker/) — `data-motion` reduced-motion picker; defaults to the OS's own `(prefers-reduced-motion: reduce)` signal rather than a fixed slug.
- [`@lilydesignsystem/vue-share-picker`](./lily-design-system-vue-share-picker/) — native share sheet / destination disclosure + copy URL.
- [`@lilydesignsystem/vue-date-time-picker`](./lily-design-system-vue-date-time-picker/) — date / time / datetime form control with an APG date-picker dialog.
- [`@lilydesignsystem/vue-picker-bar`](./lily-design-system-vue-picker-bar/) — composes theme-picker, locale-picker, text-size-picker, and share-picker into one page-header row. Owns no preference/action/form-value of its own; depends on the four wrapped pickers as real npm packages and pre-wires the 45-theme reference list and the seven-step text-size scale.
- [`@lilydesignsystem/vue-kanban-board`](./lily-design-system-vue-kanban-board/) — interactive kanban board composing the headless `KanbanTable` family plus `IconButton`/`Listbox` for a per-card "Move to…" menu. WAI-ARIA APG Grid roving-tabindex; card movement is never drag-only (WCAG 2.5.7). Ports `@lilydesignsystem/svelte-kanban-board`.
- [`@lilydesignsystem/vue-gantt-chart`](./lily-design-system-vue-gantt-chart/) — interactive Gantt chart composing the headless `GanttTable` family plus the sibling helper `@lilydesignsystem/vue-date-time-picker` (used twice per edit session). Row hierarchy, milestones, percent-complete, today marker, finish-to-start dependencies via `aria-describedby`. Ports `@lilydesignsystem/svelte-gantt-chart`.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Vue 3 Composition API only — `<script setup lang="ts">`,
  `defineProps`, `defineEmits`, `defineModel`, `ref`, `watch`,
  `onMounted`. No Options API, no `mixins`, no `defineComponent`
  wrappers.
- Tests use vitest + jsdom + `@vue/test-utils`.
- No hardcoded user-facing strings; everything comes from props.
- The canonical reference is the parallel
  [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  catalog; Vue helpers are direct ports with framework idioms swapped.
