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
    effectiveRanges,
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
    effectiveRanges,
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
    GanttDependency,
    GanttLabels,
    GanttMarker,
    GanttTask,
    GanttTimeUnit,
    GanttField,
    GanttExport,
    GanttFieldEdit,
} from "./gantt-chart.js";
export { MIME_TYPES, cellText, downloadBlob, exportBlob, exportFilename, toCsv, toDelimited, toTsv, toXlsx } from "./export-data.js";
export type { ExportFormat, ExportFormula, ExportTable } from "./export-data.js";
export { resolveColumn } from "./cell-types.js";
export type { DataGridCellType, DataGridOption } from "./cell-types.js";
export { draftOf, editorKind, evaluateEdit, exportFieldCell, exportableFields, fieldText, fieldValue, isEditableField, neighbourField, parseDraft, resolveFields } from "./typed-fields.js";
export type { Draft, EditOutcome, FieldDef, FieldValues, ResolvedField } from "./typed-fields.js";

if (typeof customElements !== "undefined" && !customElements.get("gantt-chart")) {
    customElements.define("gantt-chart", GanttChart);
}
export { ARROW_GAP, dependencyPath, weekdayOfEpochDay } from "./dependency-arrows.js";
export type { ArrowBox, DependencyKind } from "./dependency-arrows.js";
