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
  effectiveRanges,
  endOfMonth,
  flattenTasks,
  generateColumns,
  nextGanttChartId,
} from "./gantt-chart.js";
export { GanttChart, compareISO, effectiveRange, effectiveRanges, endOfMonth, flattenTasks, generateColumns, nextGanttChartId };
export type {
  GanttChartProps,
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

export { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text.js";
export type { SearchSegment } from "./search-text.js";
export { copyToClipboard, toClipboardText } from "./export-data.js";
export { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, TYPEAHEAD_RESET_MS } from "./typeahead.js";
export type { TypeaheadState } from "./typeahead.js";
export { EMPTY_HISTORY, HISTORY_LIMIT, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history.js";
export type { EditHistory, EditRecord } from "./edit-history.js";
export { epochDayOf, unavailableIn, unavailableKinds, unavailableOn } from "./unavailable.js";
export type { Unavailable } from "./unavailable.js";
export { isRtl, logicalKey } from "./direction.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-gantt-chart")) {
  customElements.define("lily-gantt-chart", GanttChart);
}
export { ARROW_GAP, dependencyPath, weekdayOfEpochDay } from "./dependency-arrows.js";
export type { ArrowBox, DependencyKind } from "./dependency-arrows.js";
export { applyCriticalPath, criticalPath } from "./critical-path.js";
export type { CriticalPathDependency, CriticalPathDependencyType, CriticalPathResult, CriticalPathTask } from "./critical-path.js";
