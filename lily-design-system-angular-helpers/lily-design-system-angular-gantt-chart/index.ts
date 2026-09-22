export {
  GanttChart,
  nextGanttChartId,
  // Civil-date arithmetic and hierarchy helpers this package ports from
  // the Svelte reference (`compareISO`, `endOfMonth`, `generateColumns`,
  // `flattenTasks`, `effectiveRange`) — exported because a consumer
  // wiring `range`/`timeUnit` or a custom hierarchy view is doing the
  // same date/tree maths, matching `date-time-picker`'s own reasoning
  // for exporting its arithmetic.
  compareISO,
  endOfMonth,
  generateColumns,
  flattenTasks,
  effectiveRange,
} from "./gantt-chart.component";
export type {
  GanttTask,
  GanttTimeUnit,
  GanttLabels,
  GanttTaskChangeEvent,
  GanttColumn,
  GanttFlatRow,
} from "./gantt-chart.component";
