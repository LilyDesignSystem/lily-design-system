/**
 * Barrel re-export for `<lily-gantt-chart>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-gantt-chart"`. Registration is idempotent — re-imports
 * do not throw.
 *
 * Depends on `@lilydesignsystem/web-components-headless` for
 * `<lily-gantt-table>` and, twice per edit session, the sibling helper
 * `@lilydesignsystem/web-components-date-time-picker`. Importing both
 * here (for their side effects) registers them before `#render()` ever
 * runs.
 */

import "@lilydesignsystem/web-components-headless";
import "@lilydesignsystem/web-components-date-time-picker";
import {
  GanttChart,
  compareISO,
  effectiveRange,
  endOfMonth,
  flattenTasks,
  generateColumns,
  nextGanttChartId,
} from "./gantt-chart.js";
export { GanttChart, compareISO, effectiveRange, endOfMonth, flattenTasks, generateColumns, nextGanttChartId };
export type {
  GanttChartProps,
  GanttColumn,
  GanttFlatRow,
  GanttLabels,
  GanttTask,
  GanttTimeUnit,
} from "./gantt-chart.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-gantt-chart")) {
  customElements.define("lily-gantt-chart", GanttChart);
}
