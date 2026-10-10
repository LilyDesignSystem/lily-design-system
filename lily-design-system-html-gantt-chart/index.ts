/**
 * Barrel re-export for `<gantt-chart>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"gantt-chart"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./gantt-chart` and call
 * `customElements.define(...)` themselves.
 *
 * Also registers `<date-time-picker>` (a side effect of importing
 * `./gantt-chart.js`, which composes it twice per edit session).
 */

import {
    GanttChart,
    addDays,
    compareISO,
    effectiveRange,
    endOfMonth,
    flattenTasks,
    generateColumns,
    nextGanttChartId,
} from "./gantt-chart.js";
export {
    GanttChart,
    addDays,
    compareISO,
    effectiveRange,
    endOfMonth,
    flattenTasks,
    generateColumns,
    nextGanttChartId,
};
export type {
    GanttChartProps,
    GanttChartTaskChangeDetail,
    GanttColumn,
    GanttFlatRow,
    GanttLabels,
    GanttTask,
    GanttTimeUnit,
} from "./gantt-chart.js";

if (typeof customElements !== "undefined" && !customElements.get("gantt-chart")) {
    customElements.define("gantt-chart", GanttChart);
}
