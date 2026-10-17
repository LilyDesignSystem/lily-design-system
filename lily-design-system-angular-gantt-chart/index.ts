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
  effectiveRanges,
} from "./gantt-chart.component";
export type {
  GanttTask,
  GanttTimeUnit,
  GanttLabels,
  GanttTaskChangeEvent,
  GanttColumn,
  GanttDependency,
  GanttMarker,
  GanttFlatRow,
  GanttField,
  GanttExport,
  GanttFieldEdit,
} from "./gantt-chart.component";
export { MIME_TYPES, cellText, downloadBlob, exportBlob, exportFilename, toCsv, toDelimited, toTsv, toXlsx } from "./export-data";
export type { ExportFormat, ExportFormula, ExportTable } from "./export-data";
export { resolveColumn } from "./cell-types";
export type { DataGridCellType, DataGridOption } from "./cell-types";
export { draftOf, editorKind, evaluateEdit, exportFieldCell, exportableFields, fieldText, fieldValue, isEditableField, neighbourField, parseDraft, resolveFields } from "./typed-fields";
export type { Draft, EditOutcome, FieldDef, FieldValues, ResolvedField } from "./typed-fields";
export { ARROW_GAP, dependencyPath, weekdayOfEpochDay } from "./dependency-arrows";
export type { ArrowBox, DependencyKind } from "./dependency-arrows";
export { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text";
export type { SearchSegment } from "./search-text";
export { copyToClipboard, toClipboardText } from "./export-data";
export { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, TYPEAHEAD_RESET_MS } from "./typeahead";
export type { TypeaheadState } from "./typeahead";
export { EMPTY_HISTORY, HISTORY_LIMIT, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history";
export type { EditHistory, EditRecord } from "./edit-history";
export { epochDayOf, unavailableIn, unavailableKinds, unavailableOn } from "./unavailable";
export type { Unavailable } from "./unavailable";
export { isRtl, logicalKey } from "./direction";
