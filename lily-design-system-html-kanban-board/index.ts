/**
 * Barrel re-export for `<kanban-board>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"kanban-board"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./kanban-board` and call
 * `customElements.define(...)` themselves.
 */

import { KanbanBoard, nextKanbanBoardId } from "./kanban-board.js";
export { KanbanBoard, nextKanbanBoardId };
export type {
    KanbanBoardProps,
    KanbanCardContext,
    KanbanColumnContext,
    KanbanBoardMoveDetail,
    KanbanBoardReorderDetail,
    KanbanColumn,
    KanbanLane,
    KanbanCard,
    KanbanLabels,
    KanbanField,
    KanbanExport,
    KanbanFieldEdit,
} from "./kanban-board.js";
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
export { isRtl, logicalKey } from "./direction.js";

if (typeof customElements !== "undefined" && !customElements.get("kanban-board")) {
    customElements.define("kanban-board", KanbanBoard);
}
