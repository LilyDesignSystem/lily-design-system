export { default, default as GanttChart, nextGanttChartId } from "./GanttChart.vue";
export type { Props, GanttColumn, GanttDependency, GanttLabels, GanttMarker, GanttTask, GanttTimeUnit, FlatRow, GanttField, GanttExport, GanttFieldEdit } from "./GanttChart.vue";
export { compareISO, effectiveRange, effectiveRanges, endOfMonth, flattenTasks, generateColumns } from "./GanttChart.vue";
// Re-exported for parity with the Svelte canonical's own public surface
// (which defines `addDays` locally); this port reuses
// @lilydesignsystem/vue-date-time-picker's own UTC-epoch-day-safe
// implementation instead of re-deriving it — see spec/index.md §3.
export { addDays } from "@lilydesignsystem/vue-date-time-picker";
export { MIME_TYPES, cellText, downloadBlob, exportBlob, exportFilename, toCsv, toDelimited, toTsv, toXlsx } from "./export-data";
export type { ExportFormat, ExportFormula, ExportTable } from "./export-data";
export { resolveColumn } from "./cell-types";
export type { DataGridCellType, DataGridOption } from "./cell-types";
export { draftOf, editorKind, evaluateEdit, exportFieldCell, exportableFields, fieldText, fieldValue, isEditableField, neighbourField, parseDraft, resolveFields } from "./typed-fields";
export type { Draft, EditOutcome, FieldDef, FieldValues, ResolvedField } from "./typed-fields";
export { ARROW_GAP, dependencyPath, weekdayOfEpochDay } from "./dependency-arrows";
export type { ArrowBox, DependencyKind } from "./dependency-arrows";
