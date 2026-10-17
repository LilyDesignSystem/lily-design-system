/**
 * Barrel re-export for `<data-grid>`. Importing this module registers the custom element under the tag name
 * `"data-grid"` (idempotent). Import the class from `./data-grid` to register a different tag name yourself.
 */

import { DataGrid, nextDataGridId } from "./data-grid.js";
export { DataGrid, nextDataGridId };
export type {
  DataGridCellContext,
  DataGridCellEdit,
  DataGridColumn,
  DataGridExport,
  DataGridFooterContext,
  DataGridLabels,
  DataGridNode,
  DataGridProps,
  DataGridRow,
  DataGridSelectionMode,
  DataGridSort,
  DataGridSortDirection,
} from "./data-grid.js";
export * from "./export-data.js";
export * from "./cell-types.js";
export { foldText, highlightSegments, matchesSearch, searchTerms } from "./search-text.js";
export type { SearchSegment } from "./search-text.js";
export { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, TYPEAHEAD_RESET_MS } from "./typeahead.js";
export type { TypeaheadState } from "./typeahead.js";
export { EMPTY_HISTORY, HISTORY_LIMIT, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history.js";
export type { EditHistory, EditRecord } from "./edit-history.js";
export { ANNOUNCEMENT_LABELS, CONTROL_LABELS, missingLabels, requiredLabels } from "./label-coverage.js";
export type { LabelFeatures, LabelKind } from "./label-coverage.js";

if (typeof customElements !== "undefined" && !customElements.get("data-grid")) {
  customElements.define("data-grid", DataGrid);
}
