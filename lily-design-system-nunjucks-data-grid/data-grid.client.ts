/**
 * Client runtime for `data-grid.njk`.
 *
 * The macro renders a plain, readable `<table>` of the data (so the page works without JavaScript) plus a JSON
 * config. `initDataGrid(root)` replaces that skeleton with the interactive `<data-grid>` custom element: sort,
 * filter, selection, resize, reorder, pagination, inline editing, virtualization, export and the twelve cell types.
 *
 * Nunjucks cannot pass functions, so label functions are template strings with `{placeholders}` (e.g.
 * `selectRow: "Select {rowLabel}"`), and columns are declarative (`type`, `options`, `format` options …) — no
 * `accessor`, `cell` or callbacks. Behaviour hooks are the element's properties/events after init, via the returned
 * element.
 */

import { DataGrid } from "./data-grid.js";
import type { DataGridColumn, DataGridLabels } from "./data-grid.js";

export { DataGrid };
export * from "./export-data.js";
export * from "./cell-types.js";
export type { DataGridColumn, DataGridLabels, DataGridRow, DataGridSort } from "./data-grid.js";

/** Label keys that are functions in the canonical contract, with their parameter names in call order. */
export const FUNCTION_LABELS: Record<string, string[]> = {
  columnVisibilityOption: ["header"],
  resizeHandle: ["header"],
  selectRow: ["rowLabel"],
  pageStatus: ["page", "pageCount", "rowCount"],
  pageAnnouncement: ["page", "pageCount"],
  sortAnnouncement: ["header", "direction"],
  filterAnnouncement: ["matchCount", "totalCount"],
  selectionAnnouncement: ["selectedCount"],
  columnMoveAnnouncement: ["header", "position", "count"],
  editCell: ["header", "rowLabel"],
  cellEditor: ["header"],
  editAnnouncement: ["header", "value"],
  exportAnnouncement: ["format", "rowCount", "filename"],
  invalidValue: ["header", "type"],
  opensInNewTab: ["text"],
  radioGroup: ["header", "rowLabel"],
  timeZone: ["header"],
  exportUtcHeader: ["header"],
  morePeople: ["count"],
  removeFile: ["name"],
  fileInput: ["header", "rowLabel"],
  formulaEditor: ["header"],
  rollupDescription: ["header"],
  editCancelAnnouncement: ["header"],
  editError: ["header", "message"],
  copyAnnouncement: ["rowCount"],
  undoAnnouncement: ["header", "text"],
  redoAnnouncement: ["header", "text"],
};

/** Labels whose wording depends on one argument: the value is an object keyed by that argument (its index here), as a label pack gives. */
const SELECT_LABELS: Record<string, number> = { sortAnnouncement: 1 };

const fillArgs = (template: string, params: string[], args: unknown[]): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const i = params.indexOf(name);
    return i === -1 || args[i] === undefined ? match : String(args[i]);
  });

/** Turns string labels with `{placeholders}` into the function labels the grid takes. */
export function resolveLabels(raw: Record<string, unknown> | undefined): DataGridLabels {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const params = FUNCTION_LABELS[key];
    if (params && typeof value === "string") {
      out[key] = (...args: unknown[]) => fillArgs(value, params, args);
    } else if (params && key in SELECT_LABELS && value && typeof value === "object") {
      const branches = value as Record<string, string>;
      out[key] = (...args: unknown[]) => fillArgs(branches[String(args[SELECT_LABELS[key]])] ?? branches.other ?? "", params, args);
    } else out[key] = value;
  }
  return out as DataGridLabels;
}

type Config = {
  label: string;
  caption?: string;
  columns: DataGridColumn[];
  rows: Record<string, unknown>[];
  labels?: Record<string, unknown>;
  selectionMode?: string;
  pageSize?: number;
  storageKey?: string;
  mode?: string;
  locale?: string;
  className?: string;
  busy?: boolean;
  exportFilename?: string;
  exportScope?: string;
  exportFormulas?: boolean;
  emptyValue?: string;
  nulls?: string;
  movableColumns?: boolean;
  warnMissingLabels?: boolean;
  filterField?: string;
  virtualize?: { rowHeight: number; height: number; overscan?: number };
};

/** Replaces one `[data-data-grid]` root's skeleton with the interactive grid. Returns the element (or null if there is no config). */
export function initDataGrid(root: Element): DataGrid | null {
  const script = root.querySelector<HTMLScriptElement>("script[data-data-grid-config]");
  if (!script) return null;
  const config = JSON.parse(script.textContent || "{}") as Config;
  if (typeof customElements !== "undefined" && !customElements.get("data-grid")) customElements.define("data-grid", DataGrid);
  const grid = document.createElement("data-grid") as DataGrid;
  grid.setAttribute("label", config.label);
  if (config.caption) grid.setAttribute("caption", config.caption);
  if (config.selectionMode) grid.setAttribute("selection-mode", config.selectionMode);
  if (config.pageSize) grid.setAttribute("page-size", String(config.pageSize));
  if (config.storageKey) grid.setAttribute("storage-key", config.storageKey);
  if (config.mode) grid.setAttribute("mode", config.mode);
  if (config.locale) grid.setAttribute("locale", config.locale);
  if (config.className) grid.setAttribute("class", config.className);
  if (config.busy) grid.setAttribute("busy", "");
  if (config.exportFilename) grid.setAttribute("export-filename", config.exportFilename);
  if (config.exportScope) grid.setAttribute("export-scope", config.exportScope);
  if (config.exportFormulas) grid.setAttribute("export-formulas", "");
  if (config.emptyValue) grid.setAttribute("empty-value", config.emptyValue);
  if (config.nulls === "first") grid.setAttribute("nulls", "first");
  if (config.movableColumns) grid.setAttribute("movable-columns", "");
  if (config.warnMissingLabels === false) grid.setAttribute("no-warn-missing-labels", "");
  grid.columns = config.columns;
  grid.rows = config.rows;
  grid.labels = resolveLabels(config.labels);
  if (config.filterField) grid.filterField = config.filterField;
  if (config.virtualize) grid.virtualize = config.virtualize;
  root.replaceChildren(grid);
  root.setAttribute("data-data-grid-ready", "");
  return grid;
}

/** Initialises every `[data-data-grid]` on the page. */
export function autoInit(scope: ParentNode = document): DataGrid[] {
  const grids: DataGrid[] = [];
  for (const root of scope.querySelectorAll("[data-data-grid]:not([data-data-grid-ready])")) {
    const grid = initDataGrid(root);
    if (grid) grids.push(grid);
  }
  return grids;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => autoInit());
  else autoInit();
}
