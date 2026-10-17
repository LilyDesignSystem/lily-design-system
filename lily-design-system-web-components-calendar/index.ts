/**
 * Barrel re-export for `<lily-calendar-view>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-calendar-view"`. Registration is idempotent — re-imports do
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

if (typeof customElements !== "undefined" && !customElements.get("lily-calendar-view")) {
    customElements.define("lily-calendar-view", CalendarView);
}
