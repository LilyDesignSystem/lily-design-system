/**
 * Barrel re-export for `<calendar-view>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"calendar-view"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./calendar-view` and call
 * `customElements.define(...)` themselves.
 */

import {
    CalendarView,
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./calendar-view.js";
export { CalendarView, eventsByDay, isOutsidePeriod, periodDays, periodRange, weekStart };
export type {
    CalendarEvent,
    CalendarRange,
    SelectedRange,
    CalendarViewDayArgs,
    CalendarViewLabels,
    CalendarViewMode,
    CalendarViewNavigateDetail,
    CalendarViewProps,
    CalendarEventField,
    CalendarExport,
    CalendarFieldEdit,
} from "./calendar-view.js";
export { MIME_TYPES, cellText, downloadBlob, exportBlob, exportFilename, toCsv, toDelimited, toTsv, toXlsx } from "./export-data.js";
export type { ExportFormat, ExportFormula, ExportTable } from "./export-data.js";
export { resolveColumn } from "./cell-types.js";
export type { DataGridCellType, DataGridOption } from "./cell-types.js";
export { draftOf, editorKind, evaluateEdit, exportFieldCell, exportableFields, fieldText, fieldValue, isEditableField, neighbourField, parseDraft, resolveFields } from "./typed-fields.js";
export type { Draft, EditOutcome, FieldDef, FieldValues, ResolvedField } from "./typed-fields.js";
export { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text.js";
export type { SearchSegment } from "./search-text.js";
export { copyToClipboard, toClipboardText } from "./export-data.js";
export { EMPTY_HISTORY, HISTORY_LIMIT, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history.js";
export type { EditHistory, EditRecord } from "./edit-history.js";
export { isRtl, logicalKey } from "./direction.js";

if (typeof customElements !== "undefined" && !customElements.get("calendar-view")) {
    customElements.define("calendar-view", CalendarView);
}
