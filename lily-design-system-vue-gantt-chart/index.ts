export { default, default as GanttChart, nextGanttChartId } from "./GanttChart.vue";
export type { Props, GanttColumn, GanttLabels, GanttMarker, GanttTask, GanttTimeUnit, FlatRow } from "./GanttChart.vue";
export { compareISO, effectiveRange, effectiveRanges, endOfMonth, flattenTasks, generateColumns } from "./GanttChart.vue";
// Re-exported for parity with the Svelte canonical's own public surface
// (which defines `addDays` locally); this port reuses
// @lilydesignsystem/vue-date-time-picker's own UTC-epoch-day-safe
// implementation instead of re-deriving it — see spec/index.md §3.
export { addDays } from "@lilydesignsystem/vue-date-time-picker";
