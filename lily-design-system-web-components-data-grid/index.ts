/**
 * Barrel re-export for `<lily-data-grid>`. Importing this module registers the custom element under the tag name
 * `"lily-data-grid"` (idempotent). Import the class from `./data-grid` to register a different tag name yourself.
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

if (typeof customElements !== "undefined" && !customElements.get("lily-data-grid")) {
  customElements.define("lily-data-grid", DataGrid);
}
