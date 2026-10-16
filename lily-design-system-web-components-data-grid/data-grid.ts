/**
 * `<lily-data-grid>` — Lily Design System Web Components helper.
 *
 * An interactive data grid as a vanilla custom element (light DOM, no framework): sort, client-side filter, row
 * selection, column resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation, inline
 * cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types. Ships no CSS and no English.
 * Ported from the canonical Svelte package (its spec/index.md is the contract); the markup is the Svelte markup, built
 * with `document.createElement` (the DataTable family's classes: `data-table`, `data-table-head`, …).
 *
 * Properties carry the data and functions; attributes carry the scalars. A change of state dispatches a CustomEvent
 * (`selectionchange`, `filterchange`, `sortchange`, `columnorderchange`, `pagechange`, `celledit`, `filesselected`,
 * `fileremove`, `rowactivate`, `exportfile`) and calls the matching `on…` property.
 */

import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data.js";
import {
  filesOf,
  isInvalidForType,
  isZonedTime,
  linkParts,
  peopleOf,
  personName,
  resolveColumn,
  safeHref,
  zonedUtcTime,
  type DataGridCellType,
  type DataGridOption,
  type DataGridPerson,
} from "./cell-types.js";

export type DataGridSortDirection = "ascending" | "descending" | "none";
export type DataGridSort = { columnId: string; direction: DataGridSortDirection };
export type DataGridSelectionMode = "none" | "single" | "multiple";
export type DataGridRow = Record<string, unknown>;

/** What `onExport` and the `exportfile` event receive, before the file is saved. */
export type DataGridExport = {
  format: ExportFormat;
  /** The file name, with its extension. */
  filename: string;
  /** How many data rows (the header is not counted). */
  rowCount: number;
  /** The file. */
  blob: Blob;
};

/** What a column's `cell` function receives. */
export type DataGridCellContext = { value: unknown; formatted: string; row: DataGridRow; column: DataGridColumn };

/** What `onCellEdit` and the `celledit` event carry after a cell edit is committed. */
export type DataGridCellEdit = { rowId: string; row: DataGridRow; columnId: string; value: unknown; previous: unknown };

/** A node a column's render function returns: an element, a text string, or nothing. */
export type DataGridNode = Node | string | null | undefined;

export type DataGridColumn = {
  /** Stable column identifier; also the default property read from each row. */
  id: string;
  /** Accessible + visible column header text. */
  header: string;
  /** Reads this column's raw value from a row. Defaults to `row[id]`. */
  accessor?: (row: DataGridRow) => unknown;
  /** Formats a raw value for display. Defaults to `String(value)` (`""` for null/undefined). */
  format?: (value: unknown, row: DataGridRow) => string;
  /** Column participates in sorting. */
  sortable?: boolean;
  /** Orders two raw values when sorting. `null`/`undefined` always sort last, before `compare` is called. */
  compare?: (a: unknown, b: unknown) => number;
  /** Column participates in the text filter. Default true. */
  filterable?: boolean;
  /** Column can be resized (pointer + keyboard). */
  resizable?: boolean;
  /** Column can be reordered: Alt+ArrowLeft/Right on its focused header, or dragging the header onto another. */
  movable?: boolean;
  /** Pins the column: its header and cells get `data-pinned="start"` / `"end"` for the consumer's sticky CSS. */
  pinned?: "start" | "end";
  /** Set `false` to leave the column out of an export. Default true. */
  exportable?: boolean;
  /** The value this column exports for a row. */
  exportValue?: (row: DataGridRow) => unknown;
  /** Column can be hidden via the column-visibility control. */
  hidable?: boolean;
  /** Initial pixel width, meaningful only when `resizable`. */
  width?: number;
  /** Custom cell content (return an element or text). Defaults to the formatted value as text. */
  cell?: (ctx: DataGridCellContext) => DataGridNode;
  /** The header's content in place of the `header` text. `header` stays the accessible name. */
  headerCell?: (ctx: { column: DataGridColumn }) => DataGridNode;
  /** Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button `labels.editCell` gates. */
  editable?: boolean;
  /** The editor's control. Default `"text"`; a `type` sets its own. */
  editor?: "text" | "number" | "link" | "date" | "time" | "time-zone" | "select" | "radio" | "person" | "formula";
  /** The kind of value in this column: a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor`. */
  type?: DataGridCellType;
  /** BCP 47 locale for this column's formatting and collation. */
  locale?: string;
  /** `select` and `radio`: the choices. */
  options?: DataGridOption[];
  /** `time-zone`: the zones the editor's select offers. */
  timeZones?: DataGridOption[];
  /** `time-zone`: the date (ISO) that orders zoned times and names a zone. Never computed by the grid. */
  referenceDate?: string;
  /** `time-zone`: an export adds a second column holding the UTC time of day at `referenceDate`. */
  exportUtc?: boolean;
  /** `rollup`: how the related values are reduced. */
  aggregate?: "count" | "countUnique" | "sum" | "avg" | "median" | "min" | "max" | "range" | "percentTrue" | "percentEmpty";
  /** `rollup`: a reduction the named aggregates do not cover. */
  reduce?: (values: unknown[], row: DataGridRow) => unknown;
  /** `rollup`: reads the related values. */
  relation?: (row: DataGridRow) => unknown[];
  /** `rollup` and `formula`: the result's type. */
  resultType?: "number" | "date" | "text";
  /** `formula`: evaluates an expression. Lily ships no engine and never evaluates a string itself. */
  evaluate?: (expression: string, context: { row: DataGridRow; rows: DataGridRow[]; columnId: string }) => { value: unknown } | { error: string };
  /** `person`: how many people show before "+N". */
  maxPeople?: number;
  /** `person`: an avatar beside the name. Decorative. */
  avatar?: (ctx: { person: DataGridPerson }) => DataGridNode;
  /** `person`: the editor, given `{ value, commit, cancel }`. Without it a person cell is read-only. */
  personEditor?: (ctx: { value: unknown; commit: (value: unknown) => void; cancel: () => void }) => DataGridNode;
  /** `file`: formats a size in bytes. */
  formatSize?: (bytes: number) => string;
  /** `file`: the `accept` of the file input. */
  accept?: string;
  /** `file`: whether the input takes several files. Default true. */
  multiple?: boolean;
  /** `select`: sort by option label (default) or by option order. */
  sortBy?: "label" | "order";
  /** `select`/`radio`: export the option's `"label"` or `"id"`. `person`: `"email"`. */
  exportAs?: "label" | "id" | "email";
  /** `number`: options for `Intl.NumberFormat`. */
  numberFormat?: Intl.NumberFormatOptions;
  /** `date`: options for `Intl.DateTimeFormat`. */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** `time`: options for `Intl.DateTimeFormat`. */
  timeFormat?: Intl.DateTimeFormatOptions;
  /** The text the grid's filter matches for a value. */
  filterText?: (value: unknown, row: DataGridRow) => string;
  /** Turns the editor's text into the committed value. */
  parse?: (draft: string, row: DataGridRow) => unknown;
  /** Refuses a value: return a message and the cell stays in edit mode with `aria-invalid`. */
  validate?: (value: unknown, row: DataGridRow) => string | undefined;
  /** Set for a `formula` column: reads the expression a row holds. */
  source?: (row: DataGridRow) => unknown;
  /** Set for a `formula` column: the error message for a row, if any. */
  errorOf?: (row: DataGridRow) => string | undefined;
  /** Body cells of this column are `<th scope="row" role="rowheader">`. */
  rowHeader?: boolean;
  /** Horizontal alignment of the column's cells. */
  align?: "start" | "center" | "end";
  /** Extra class on each body cell of this column. */
  cellClass?: string | ((ctx: DataGridCellContext) => string);
  /** Extra attributes on each body cell of this column. */
  cellAttrs?: (ctx: DataGridCellContext) => Record<string, string>;
};

/**
 * Every field is optional, but its presence gates the control it names — no baked-in English fallback.
 * See the Svelte canonical's spec/index.md §5.
 */
export type DataGridLabels = {
  search?: string;
  columnVisibility?: string;
  columnVisibilityOption?: (header: string) => string;
  resizeHandle?: (header: string) => string;
  selectAll?: string;
  selectionColumn?: string;
  selectRow?: (rowLabel: string) => string;
  previousPage?: string;
  nextPage?: string;
  pageStatus?: (page: number, pageCount: number, rowCount: number) => string;
  pageAnnouncement?: (page: number, pageCount: number) => string;
  sortAnnouncement?: (header: string, direction: DataGridSortDirection) => string;
  filterAnnouncement?: (matchCount: number, totalCount: number) => string;
  selectionAnnouncement?: (selectedCount: number) => string;
  columnMoveAnnouncement?: (header: string, position: number, count: number) => string;
  editCell?: (header: string, rowLabel: string) => string;
  cellEditor?: (header: string) => string;
  editAnnouncement?: (header: string, value: string) => string;
  export?: string;
  exportCsv?: string;
  exportTsv?: string;
  exportExcel?: string;
  exportAnnouncement?: (format: ExportFormat, rowCount: number, filename: string) => string;
  invalidValue?: (header: string, type: string) => string;
  opensInNewTab?: (text: string) => string;
  radioGroup?: (header: string, rowLabel: string) => string;
  timeZone?: (header: string) => string;
  exportUtcHeader?: (header: string) => string;
  morePeople?: (count: number) => string;
  removeFile?: (name: string) => string;
  fileInput?: (header: string, rowLabel: string) => string;
  formulaEditor?: (header: string) => string;
  rollupDescription?: (header: string) => string;
  editCancelAnnouncement?: (header: string) => string;
  editError?: (header: string, message: string) => string;
};

export type DataGridFooterContext = { columns: DataGridColumn[]; rows: DataGridRow[] };

/** Mirrors the properties for typing convenience. */
export type DataGridProps = {
  label: string;
  caption?: string;
  columns: DataGridColumn[];
  rows: DataGridRow[];
  locale?: string;
  rowId?: (row: DataGridRow, index: number) => string;
  selectionMode?: DataGridSelectionMode;
  selected?: string[];
  filter?: string;
  sort?: DataGridSort;
  columnOrder?: string[];
  pageSize?: number;
  page?: number;
  storageKey?: string;
  labels?: DataGridLabels;
  mode?: "grid" | "table";
  rowClass?: (row: DataGridRow) => string;
  rowAttrs?: (row: DataGridRow) => Record<string, string>;
  onRowActivate?: (row: DataGridRow, id: string) => void;
  empty?: () => DataGridNode;
  footer?: (ctx: DataGridFooterContext) => DataGridNode;
  busy?: boolean;
  scrollable?: boolean;
  exportFilename?: string;
  exportScope?: "view" | "selected";
  exportFormulas?: boolean;
  onExport?: (file: DataGridExport) => boolean | void;
  onCellEdit?: (edit: DataGridCellEdit) => void;
  onFilesSelected?: (event: { rowId: string; row: DataGridRow; columnId: string; files: File[] }) => void;
  onFileRemove?: (event: { rowId: string; row: DataGridRow; columnId: string; fileId: string }) => void;
  virtualize?: { rowHeight: number; height: number; overscan?: number };
};

type Entry = { row: DataGridRow; id: string };
type Editing = { rowId: string; columnId: string; draft: string; zone?: string; error?: string; invalid?: boolean };
type RenderItem = { kind: "row"; index: number } | { kind: "spacer"; rows: number };

/** What counts as a widget inside a cell: something a person can operate. */
const WIDGET_SELECTOR = 'a[href], button, input, select, textarea, summary, [contenteditable="true"]';
const MIN_COLUMN_WIDTH = 40;
const RESIZE_STEP = 16;

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextDataGridId(): string {
  uid += 1;
  return `data-grid-${uid}`;
}

function defaultAccessor(column: DataGridColumn, row: DataGridRow): unknown {
  return column.accessor ? column.accessor(row) : row[column.id];
}

function formatCell(column: DataGridColumn, row: DataGridRow): string {
  const value = defaultAccessor(column, row);
  if (column.format) return column.format(value, row);
  return value === null || value === undefined ? "" : String(value);
}

/** An element with a class name and attributes (undefined and null attributes are skipped). */
function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string | number | boolean | null | undefined>,
  ...children: (Node | string | null | undefined)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (value === null || value === undefined || value === false) continue;
      node.setAttribute(name, value === true ? "" : String(value));
    }
  }
  for (const child of children) if (child !== null && child !== undefined) node.append(child);
  return node;
}

function nodeOf(value: DataGridNode): Node | null {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? document.createTextNode(value) : value;
}

/** Custom-element class implementing `<lily-data-grid>`. */
export class DataGrid extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["label", "caption", "class", "selection-mode", "page-size", "page", "storage-key", "mode", "busy", "no-scroll", "locale", "export-filename", "export-scope", "export-formulas", "activate-rows"];
  }

  // Property-only members (arrays of objects and functions cannot be attributes).
  #columnsIn: DataGridColumn[] = [];
  #rows: DataGridRow[] = [];
  #rowId: (row: DataGridRow, index: number) => string = (_row, index) => String(index);
  #selected: string[] = [];
  #filter = "";
  #sort: DataGridSort = { columnId: "", direction: "none" };
  #columnOrder: string[] = [];
  #page = 1;
  #labels: DataGridLabels = {};
  #rowClass?: (row: DataGridRow) => string;
  #rowAttrs?: (row: DataGridRow) => Record<string, string>;
  #empty?: () => DataGridNode;
  #footer?: (ctx: DataGridFooterContext) => DataGridNode;
  #virtualize?: { rowHeight: number; height: number; overscan?: number };
  #onRowActivate?: (row: DataGridRow, id: string) => void;
  #onExport?: (file: DataGridExport) => boolean | void;
  #onCellEdit?: (edit: DataGridCellEdit) => void;
  #onFilesSelected?: (event: { rowId: string; row: DataGridRow; columnId: string; files: File[] }) => void;
  #onFileRemove?: (event: { rowId: string; row: DataGridRow; columnId: string; fileId: string }) => void;

  // View state.
  #gridId = nextDataGridId();
  #hidden = new Set<string>();
  #widths: Record<string, number> = {};
  #focusedRow = -1;
  #focusedCol = 0;
  #lastSelectedIndex = -1;
  #editing: Editing | null = null;
  #statusMessage = "";
  #scrollTop = 0;
  #draggingColumnId: string | null = null;
  #restored = false;
  #rendering = false;
  #pendingFocus: "cell" | "editor" | "search" | null = null;
  #searchSelection: [number, number] | null = null;

  // Derived data.
  #resolved: DataGridColumn[] = [];
  #resolvedFrom: { columns: DataGridColumn[]; rows: DataGridRow[]; locale: string | undefined } | null = null;
  #cellCache = new WeakMap<DataGridRow, Map<string, DataGridCellContext>>();
  #entries: Entry[] = [];
  #searchIndex: string[][] = [];
  #ordered: DataGridColumn[] = [];
  #visible: DataGridColumn[] = [];
  #filtered: Entry[] = [];
  #sorted: Entry[] = [];
  #pageEntries: Entry[] = [];

  #rootEl: HTMLElement | null = null;
  #scrollEl: HTMLElement | null = null;
  #statusEl: HTMLElement | null = null;

  // ---- Properties ----

  get label(): string {
    return this.getAttribute("label") ?? "";
  }
  set label(v: string) {
    this.setAttribute("label", v);
  }
  get caption(): string {
    return this.getAttribute("caption") ?? "";
  }
  set caption(v: string) {
    if (v) this.setAttribute("caption", v);
    else this.removeAttribute("caption");
  }
  get columns(): DataGridColumn[] {
    return this.#columnsIn;
  }
  set columns(v: DataGridColumn[]) {
    this.#columnsIn = Array.isArray(v) ? v : [];
    this.#render();
  }
  get rows(): DataGridRow[] {
    return this.#rows;
  }
  set rows(v: DataGridRow[]) {
    this.#rows = Array.isArray(v) ? v : [];
    this.#render();
  }
  get locale(): string | undefined {
    return this.getAttribute("locale") ?? undefined;
  }
  set locale(v: string | undefined) {
    if (v) this.setAttribute("locale", v);
    else this.removeAttribute("locale");
  }
  /** Derives a stable id per row. Defaults to the row's index in `rows`. */
  get rowId(): (row: DataGridRow, index: number) => string {
    return this.#rowId;
  }
  set rowId(fn: ((row: DataGridRow, index: number) => string) | undefined) {
    this.#rowId = fn ?? ((_row, index) => String(index));
    this.#render();
  }
  get selectionMode(): DataGridSelectionMode {
    const v = this.getAttribute("selection-mode");
    return v === "single" || v === "multiple" ? v : "none";
  }
  set selectionMode(v: DataGridSelectionMode) {
    this.setAttribute("selection-mode", v);
  }
  get selected(): string[] {
    return [...this.#selected];
  }
  set selected(v: string[]) {
    this.#selected = Array.isArray(v) ? v.slice() : [];
    this.#render();
  }
  get filter(): string {
    return this.#filter;
  }
  set filter(v: string) {
    this.#filter = v ?? "";
    this.#render();
  }
  get sort(): DataGridSort {
    return this.#sort;
  }
  set sort(v: DataGridSort) {
    this.#sort = v ?? { columnId: "", direction: "none" };
    this.#render();
  }
  get columnOrder(): string[] {
    return [...this.#columnOrder];
  }
  set columnOrder(v: string[]) {
    this.#columnOrder = Array.isArray(v) ? v.slice() : [];
    this.#render();
  }
  get pageSize(): number | undefined {
    const v = this.getAttribute("page-size");
    return v === null || v === "" ? undefined : Number(v);
  }
  set pageSize(v: number | undefined) {
    if (v == null) this.removeAttribute("page-size");
    else this.setAttribute("page-size", String(v));
  }
  get page(): number {
    return this.#page;
  }
  set page(v: number) {
    this.#page = Number(v) || 1;
    this.#render();
  }
  get storageKey(): string | undefined {
    return this.getAttribute("storage-key") ?? undefined;
  }
  set storageKey(v: string | undefined) {
    if (v) this.setAttribute("storage-key", v);
    else this.removeAttribute("storage-key");
  }
  get labels(): DataGridLabels {
    return this.#labels;
  }
  set labels(v: DataGridLabels) {
    this.#labels = v ?? {};
    this.#render();
  }
  get mode(): "grid" | "table" {
    return this.getAttribute("mode") === "table" ? "table" : "grid";
  }
  set mode(v: "grid" | "table") {
    this.setAttribute("mode", v);
  }
  get rowClass(): ((row: DataGridRow) => string) | undefined {
    return this.#rowClass;
  }
  set rowClass(fn: ((row: DataGridRow) => string) | undefined) {
    this.#rowClass = fn;
    this.#render();
  }
  get rowAttrs(): ((row: DataGridRow) => Record<string, string>) | undefined {
    return this.#rowAttrs;
  }
  set rowAttrs(fn: ((row: DataGridRow) => Record<string, string>) | undefined) {
    this.#rowAttrs = fn;
    this.#render();
  }
  get empty(): (() => DataGridNode) | undefined {
    return this.#empty;
  }
  set empty(fn: (() => DataGridNode) | undefined) {
    this.#empty = fn;
    this.#render();
  }
  get footer(): ((ctx: DataGridFooterContext) => DataGridNode) | undefined {
    return this.#footer;
  }
  set footer(fn: ((ctx: DataGridFooterContext) => DataGridNode) | undefined) {
    this.#footer = fn;
    this.#render();
  }
  get busy(): boolean {
    return this.hasAttribute("busy");
  }
  set busy(v: boolean) {
    if (v) this.setAttribute("busy", "");
    else this.removeAttribute("busy");
  }
  /** Wrap the table in a scrollable `data-grid-scroll` region. Default true (the `no-scroll` attribute turns it off). */
  get scrollable(): boolean {
    return !this.hasAttribute("no-scroll");
  }
  set scrollable(v: boolean) {
    if (v) this.removeAttribute("no-scroll");
    else this.setAttribute("no-scroll", "");
  }
  get exportFilename(): string {
    return this.getAttribute("export-filename") ?? "data-grid";
  }
  set exportFilename(v: string) {
    this.setAttribute("export-filename", v);
  }
  get exportScope(): "view" | "selected" {
    return this.getAttribute("export-scope") === "selected" ? "selected" : "view";
  }
  set exportScope(v: "view" | "selected") {
    this.setAttribute("export-scope", v);
  }
  get exportFormulas(): boolean {
    return this.hasAttribute("export-formulas");
  }
  set exportFormulas(v: boolean) {
    if (v) this.setAttribute("export-formulas", "");
    else this.removeAttribute("export-formulas");
  }
  get virtualize(): { rowHeight: number; height: number; overscan?: number } | undefined {
    return this.#virtualize;
  }
  set virtualize(v: { rowHeight: number; height: number; overscan?: number } | undefined) {
    this.#virtualize = v;
    this.#render();
  }
  /** Enter on a body cell and a click outside any widget activate the row. Set by `onRowActivate`, or by the `activate-rows` attribute. */
  get activateRows(): boolean {
    return this.#onRowActivate !== undefined || this.hasAttribute("activate-rows");
  }
  set activateRows(v: boolean) {
    if (v) this.setAttribute("activate-rows", "");
    else this.removeAttribute("activate-rows");
  }
  get onRowActivate(): ((row: DataGridRow, id: string) => void) | undefined {
    return this.#onRowActivate;
  }
  set onRowActivate(fn: ((row: DataGridRow, id: string) => void) | undefined) {
    this.#onRowActivate = fn;
  }
  /** Called with the file before it is saved. Return `false` to keep the grid from saving it. */
  get onExport(): ((file: DataGridExport) => boolean | void) | undefined {
    return this.#onExport;
  }
  set onExport(fn: ((file: DataGridExport) => boolean | void) | undefined) {
    this.#onExport = fn;
  }
  get onCellEdit(): ((edit: DataGridCellEdit) => void) | undefined {
    return this.#onCellEdit;
  }
  set onCellEdit(fn: ((edit: DataGridCellEdit) => void) | undefined) {
    this.#onCellEdit = fn;
  }
  get onFilesSelected(): ((event: { rowId: string; row: DataGridRow; columnId: string; files: File[] }) => void) | undefined {
    return this.#onFilesSelected;
  }
  set onFilesSelected(fn: ((event: { rowId: string; row: DataGridRow; columnId: string; files: File[] }) => void) | undefined) {
    this.#onFilesSelected = fn;
  }
  get onFileRemove(): ((event: { rowId: string; row: DataGridRow; columnId: string; fileId: string }) => void) | undefined {
    return this.#onFileRemove;
  }
  set onFileRemove(fn: ((event: { rowId: string; row: DataGridRow; columnId: string; fileId: string }) => void) | undefined) {
    this.#onFileRemove = fn;
  }

  // ---- Lifecycle ----

  connectedCallback(): void {
    this.#restoreView();
    this.#render();
  }

  attributeChangedCallback(): void {
    this.#render();
  }

  // ---- Derived data ----

  #cellFor(column: DataGridColumn, row: DataGridRow): DataGridCellContext {
    let perRow = this.#cellCache.get(row);
    if (!perRow) {
      perRow = new Map();
      this.#cellCache.set(row, perRow);
    }
    let ctx = perRow.get(column.id);
    if (!ctx) {
      ctx = { value: defaultAccessor(column, row), formatted: formatCell(column, row), row, column };
      perRow.set(column.id, ctx);
    }
    return ctx;
  }

  #derive(): void {
    const locale = this.locale;
    const from = this.#resolvedFrom;
    if (!from || from.columns !== this.#columnsIn || from.rows !== this.#rows || from.locale !== locale) {
      this.#resolvedFrom = { columns: this.#columnsIn, rows: this.#rows, locale };
      this.#resolved = this.#columnsIn.map((c) => resolveColumn(c, locale, this.#rows)) as DataGridColumn[];
      this.#cellCache = new WeakMap();
      this.#entries = this.#rows.map((row, index) => ({ row, id: this.#rowId(row, index) }));
      const filterable = this.#resolved.filter((c) => c.filterable !== false);
      this.#searchIndex = this.#entries.map((entry) =>
        filterable.map((column) =>
          (column.filterText ? column.filterText(this.#cellFor(column, entry.row).value, entry.row) : this.#cellFor(column, entry.row).formatted).toLowerCase(),
        ),
      );
    }
    const order = this.#columnOrder;
    if (order.length === 0) this.#ordered = this.#resolved;
    else {
      const rank = (id: string) => {
        const i = order.indexOf(id);
        return i === -1 ? order.length : i;
      };
      this.#ordered = this.#resolved
        .map((c, i) => ({ c, i }))
        .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
        .map((x) => x.c);
    }
    this.#visible = this.#ordered.filter((c) => !this.#hidden.has(c.id));

    const text = this.#filter.trim().toLowerCase();
    this.#filtered = text ? this.#entries.filter((_entry, i) => this.#searchIndex[i].some((value) => value.includes(text))) : this.#entries;

    this.#sorted = this.#filtered;
    const sort = this.#sort;
    const column = sort.direction !== "none" && sort.columnId ? this.#resolved.find((c) => c.id === sort.columnId) : undefined;
    if (column) {
      const dir = sort.direction === "ascending" ? 1 : -1;
      const compare = column.compare;
      // Read each sort key once (n accessor calls), not twice per comparison.
      const keyed = this.#filtered.map((entry) => ({ entry, key: this.#cellFor(column, entry.row).value }));
      keyed.sort((a, b) => {
        const av = a.key;
        const bv = b.key;
        if (av === bv) return 0;
        // Missing values sort last in both directions.
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        if (compare) return compare(av, bv) * dir;
        return (av as never) > (bv as never) ? dir : -dir;
      });
      this.#sorted = keyed.map((k) => k.entry);
    }

    const size = this.pageSize;
    this.#pageEntries = size ? this.#sorted.slice(this.#pageStart(), this.#pageStart() + size) : this.#sorted;
  }

  #pageCount(): number {
    const size = this.pageSize;
    return size ? Math.max(1, Math.ceil(this.#sorted.length / size)) : 1;
  }
  #clampedPage(): number {
    return Math.min(Math.max(this.#page, 1), this.#pageCount());
  }
  #pageStart(): number {
    const size = this.pageSize;
    return size ? (this.#clampedPage() - 1) * size : 0;
  }
  get #isGrid(): boolean {
    return this.mode === "grid";
  }
  get #hasSelection(): boolean {
    return this.selectionMode !== "none";
  }
  get #colOffset(): number {
    return this.#hasSelection ? 1 : 0;
  }
  get #lastCol(): number {
    return this.#colOffset + this.#visible.length - 1;
  }
  get #activeRow(): number {
    return Math.max(-1, Math.min(this.#focusedRow, this.#pageEntries.length - 1));
  }
  get #activeCol(): number {
    return Math.max(0, Math.min(this.#focusedCol, this.#lastCol));
  }
  #selectedSet(): Set<string> {
    return new Set(this.#selected);
  }
  #allSelected(): boolean {
    const set = this.#selectedSet();
    return this.#sorted.length > 0 && this.#sorted.every((e) => set.has(e.id));
  }
  #someSelected(): boolean {
    const set = this.#selectedSet();
    return !this.#allSelected() && this.#sorted.some((e) => set.has(e.id));
  }

  // ---- Announce, events ----

  #announce(message: string | undefined): void {
    if (!message) return;
    this.#statusMessage = message;
    if (this.#statusEl) this.#statusEl.textContent = message;
  }

  #emit<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true }));
  }

  // ---- Sorting, filtering, selection, pagination ----

  #ariaSortFor(column: DataGridColumn): DataGridSortDirection | undefined {
    if (!column.sortable) return undefined;
    return this.#sort.columnId === column.id ? this.#sort.direction : "none";
  }

  #toggleSort(column: DataGridColumn): void {
    if (!column.sortable) return;
    const current = this.#sort;
    const next: DataGridSort =
      current.columnId !== column.id
        ? { columnId: column.id, direction: "ascending" }
        : current.direction === "ascending"
          ? { columnId: column.id, direction: "descending" }
          : current.direction === "descending"
            ? { columnId: "", direction: "none" }
            : { columnId: column.id, direction: "ascending" };
    this.#sort = next;
    this.#emit("sortchange", next);
    this.#derive();
    this.#announce(this.#labels.sortAnnouncement?.(column.header, next.direction));
    this.#persistView();
    this.#render();
  }

  #onFilterInput(input: HTMLInputElement): void {
    this.#filter = input.value;
    this.#page = 1;
    this.#searchSelection = [input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length];
    this.#pendingFocus = "search";
    this.#emit("filterchange", this.#filter);
    this.#emit("pagechange", 1);
    this.#derive();
    this.#announce(this.#labels.filterAnnouncement?.(this.#filtered.length, this.#rows.length));
    this.#render();
  }

  #setSelected(next: string[]): void {
    this.#selected = next;
    this.#emit("selectionchange", [...next]);
    this.#announce(this.#labels.selectionAnnouncement?.(next.length));
    this.#render();
  }

  /** `index` is the row's position in the sorted entries, not on the current page. */
  #toggleRow(index: number, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }): void {
    const id = this.#sorted[index].id;
    const selected = this.#selected;
    const isSelected = selected.includes(id);
    const mode = this.selectionMode;
    if (mode === "single") {
      this.#setSelected(isSelected ? [] : [id]);
    } else if (mode === "multiple") {
      if (event?.shiftKey && this.#lastSelectedIndex >= 0) {
        const [start, end] = this.#lastSelectedIndex < index ? [this.#lastSelectedIndex, index] : [index, this.#lastSelectedIndex];
        const range = this.#sorted.slice(start, end + 1).map((e) => e.id);
        this.#setSelected([...new Set([...selected, ...range])]);
      } else if (event?.ctrlKey || event?.metaKey) {
        this.#setSelected(isSelected ? selected.filter((x) => x !== id) : [...selected, id]);
      } else {
        this.#setSelected(isSelected && selected.length === 1 ? [] : [id]);
      }
    }
    this.#lastSelectedIndex = index;
  }

  #toggleSelectAll(): void {
    this.#setSelected(this.#allSelected() ? [] : this.#sorted.map((e) => e.id));
  }

  #goToPage(next: number): void {
    const target = Math.min(Math.max(next, 1), this.#pageCount());
    if (target === this.#clampedPage()) return;
    this.#page = target;
    this.#emit("pagechange", target);
    this.#derive();
    this.#announce(this.#labels.pageAnnouncement?.(target, this.#pageCount()));
    this.#render();
  }

  // ---- Column resize, visibility, reorder ----

  #widthFor(column: DataGridColumn): number | undefined {
    return this.#widths[column.id] ?? column.width;
  }

  #applyCellStyle(node: HTMLElement, column: DataGridColumn): void {
    const width = this.#widthFor(column);
    if (width) node.style.width = `${width}px`;
    if (column.align) node.style.textAlign = column.align;
  }

  #setWidth(column: DataGridColumn, width: number): void {
    this.#widths = { ...this.#widths, [column.id]: Math.max(MIN_COLUMN_WIDTH, width) };
    this.#persistView();
    this.#render();
  }

  #toggleColumnVisibility(columnId: string): void {
    if (this.#hidden.has(columnId)) this.#hidden.delete(columnId);
    else this.#hidden.add(columnId);
    this.#persistView();
    this.#render();
  }

  /** Move `columnId` to sit at `toVisibleIndex` among the visible columns. Returns whether it moved. */
  #moveColumn(columnId: string, toVisibleIndex: number): boolean {
    const ids = this.#visible.map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toVisibleIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
    const visibleSet = new Set(ids);
    let next = 0;
    this.#columnOrder = this.#ordered.map((c) => (visibleSet.has(c.id) ? ids[next++] : c.id));
    this.#emit("columnorderchange", [...this.#columnOrder]);
    this.#derive();
    const column = this.#resolved.find((c) => c.id === columnId)!;
    this.#announce(this.#labels.columnMoveAnnouncement?.(column.header, to + 1, ids.length));
    return true;
  }

  // ---- Persistence ----

  #restoreView(): void {
    const key = this.storageKey;
    if (!key || this.#restored) return;
    this.#restored = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as { columnWidths?: Record<string, number>; hiddenColumnIds?: string[]; sort?: DataGridSort };
        if (saved.columnWidths) this.#widths = saved.columnWidths;
        if (saved.hiddenColumnIds) this.#hidden = new Set(saved.hiddenColumnIds);
        if (saved.sort) this.#sort = saved.sort;
      }
    } catch {
      // ignore quota / privacy / parse errors
    }
    this.#persistView();
  }

  #persistView(): void {
    const key = this.storageKey;
    if (!key || !this.#restored || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify({ columnWidths: this.#widths, hiddenColumnIds: [...this.#hidden], sort: this.#sort }));
    } catch {
      // ignore quota / privacy errors
    }
  }

  // ---- Windowing ----

  #renderItems(): RenderItem[] {
    const total = this.#pageEntries.length;
    const v = this.#virtualize;
    if (!v) return this.#pageEntries.map((_, index) => ({ kind: "row", index }));
    const overscan = v.overscan ?? 3;
    const start = Math.max(0, Math.floor(this.#scrollTop / v.rowHeight) - overscan);
    const end = Math.min(total, Math.ceil((this.#scrollTop + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    const active = this.#activeRow;
    if (active >= 0 && active < total) indices.add(active);
    const items: RenderItem[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
      if (index - previous > 1) items.push({ kind: "spacer", rows: index - previous - 1 });
      items.push({ kind: "row", index });
      previous = index;
    }
    if (total - 1 - previous > 0) items.push({ kind: "spacer", rows: total - 1 - previous });
    return items;
  }

  /** Bring a body row into the scroll region. */
  #revealRow(index: number): void {
    const v = this.#virtualize;
    if (!v || index < 0) return;
    const top = index * v.rowHeight;
    let next = this.#scrollTop;
    if (top < this.#scrollTop) next = top;
    else if (top + v.rowHeight > this.#scrollTop + v.height) next = top + v.rowHeight - v.height;
    if (next === this.#scrollTop) return;
    this.#scrollTop = next;
  }

  // ---- Export ----

  #exportColumns(): DataGridColumn[] {
    return this.#visible.filter((c) => c.exportable !== false);
  }

  #exportEntries(): Entry[] {
    if (this.exportScope !== "selected") return this.#sorted;
    const set = this.#selectedSet();
    return this.#sorted.filter((e) => set.has(e.id));
  }

  /** One cell for an export: typed values stay typed, everything else is the text the grid shows. */
  #exportCell(column: DataGridColumn, row: DataGridRow): unknown {
    if (column.exportValue) return column.exportValue(row);
    const ctx = this.#cellFor(column, row);
    const value = ctx.value;
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
    return ctx.formatted;
  }

  #hasUtcColumn(c: DataGridColumn): boolean {
    return c.type === "time-zone" && !!c.exportUtc && !!c.referenceDate && !!this.#labels.exportUtcHeader;
  }

  #runExport(format: ExportFormat): void {
    const live = (c: DataGridColumn) => format === "xlsx" && this.exportFormulas && c.type === "formula" && !!c.source;
    const columns = this.#exportColumns();
    const headers: string[] = [];
    for (const c of columns) {
      headers.push(c.header);
      if (this.#hasUtcColumn(c)) headers.push(this.#labels.exportUtcHeader!(c.header));
    }
    const rows = this.#exportEntries().map((entry) => {
      const cells: unknown[] = [];
      for (const c of columns) {
        const expression = live(c) ? c.source!(entry.row) : undefined;
        cells.push(
          typeof expression === "string" && expression !== "" && !c.errorOf?.(entry.row)
            ? { formula: expression, result: this.#exportCell(c, entry.row) }
            : this.#exportCell(c, entry.row),
        );
        if (this.#hasUtcColumn(c)) cells.push(zonedUtcTime(this.#cellFor(c, entry.row).value, c.referenceDate));
      }
      return cells;
    });
    const filename = exportFilename(this.exportFilename, format);
    const blob = exportBlob({ headers, rows }, format, { sheetName: this.exportFilename });
    const file: DataGridExport = { format, filename, rowCount: rows.length, blob };
    this.#emit("exportfile", file);
    if (this.#onExport?.(file) === false) return;
    downloadBlob(blob, filename);
    this.#announce(this.#labels.exportAnnouncement?.(format, rows.length, filename));
  }

  // ---- Cell editing ----

  /** A cell the person can edit through the grid's edit model (not a rollup, a file cell with its own widgets, or a person cell with no editor). */
  #isEditable(column: DataGridColumn): boolean {
    if (!column.editable) return false;
    if (column.type === "rollup" || column.type === "file") return false;
    if (column.type === "person" && !column.personEditor) return false;
    return true;
  }

  #startEdit(entry: Entry, column: DataGridColumn): void {
    if (!this.#isEditable(column)) return;
    // A formula's editor shows the expression the row holds, not the result.
    const raw = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    if (column.type === "time-zone") {
      const zoned = isZonedTime(raw) ? raw : null;
      this.#editing = { rowId: entry.id, columnId: column.id, draft: zoned?.time ?? "", zone: zoned?.timeZone ?? column.timeZones?.[0]?.id ?? "" };
    } else {
      const text = column.type === "link" ? (linkParts(raw)?.href ?? "") : raw === null || raw === undefined ? "" : String(raw);
      this.#editing = { rowId: entry.id, columnId: column.id, draft: text };
    }
    this.#pendingFocus = "editor";
    this.#render();
  }

  #parseDraft(column: DataGridColumn, row: DataGridRow, draft: string, zone?: string): unknown {
    if (column.parse) return column.parse(draft, row);
    if (column.type === "time-zone") return draft === "" ? null : { time: draft, timeZone: zone ?? "" };
    if (column.editor === "number") return draft.trim() === "" ? null : Number(draft);
    if (column.editor === "date" || column.editor === "time" || column.editor === "select") return draft === "" ? null : draft;
    return draft;
  }

  /** Two link values with the same address and label are the same edit. */
  #isStructurallyEqual(a: unknown, b: unknown): boolean {
    return typeof a === "object" && typeof b === "object" && a !== null && b !== null && JSON.stringify(a) === JSON.stringify(b);
  }

  /** Validate and report one new value for a cell. Returns false (and keeps editing, if the editor is open) when it is refused. */
  #commitValue(entry: Entry, column: DataGridColumn, value: unknown): boolean {
    const message = column.validate?.(value, entry.row);
    const invalidType = isInvalidForType(column, value);
    if (message || invalidType) {
      const text = message ?? this.#labels.invalidValue?.(column.header, column.type ?? "") ?? "";
      if (this.#editing) {
        this.#editing = { ...this.#editing, error: text || undefined, invalid: true };
        this.#pendingFocus = "editor";
        this.#announce(this.#labels.editError?.(column.header, text));
        this.#render();
      } else this.#announce(this.#labels.editError?.(column.header, text));
      return false;
    }
    const previous = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    this.#editing = null;
    if (value !== previous && !this.#isStructurallyEqual(value, previous)) {
      const edit: DataGridCellEdit = { rowId: entry.id, row: entry.row, columnId: column.id, value, previous };
      this.#onCellEdit?.(edit);
      this.#emit("celledit", edit);
      this.#announce(this.#labels.editAnnouncement?.(column.header, column.format ? column.format(value, entry.row) : String(value ?? "")));
    }
    this.#pendingFocus = "cell";
    this.#render();
    return true;
  }

  #commitEdit(): void {
    const current = this.#editing;
    if (!current || this.#rendering) return;
    const entry = this.#entries.find((e) => e.id === current.rowId);
    const column = this.#resolved.find((c) => c.id === current.columnId);
    if (!entry || !column) {
      this.#editing = null;
      this.#render();
      return;
    }
    this.#commitValue(entry, column, this.#parseDraft(column, entry.row, current.draft, current.zone));
  }

  #cancelEdit(): void {
    const current = this.#editing;
    if (!current) return;
    this.#editing = null;
    const column = this.#resolved.find((c) => c.id === current.columnId);
    if (column) this.#announce(this.#labels.editCancelAnnouncement?.(column.header));
    this.#pendingFocus = "cell";
    this.#render();
  }

  #onEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys; none may reach the grid's own handler.
    event.stopPropagation();
    // While an input method is composing, Enter picks the candidate and Escape cancels the composition:
    // neither commits nor cancels the edit. Some browsers report the confirming Enter with `isComposing`
    // already false, but keyCode 229.
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      this.#commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.#cancelEdit();
    }
  }

  // ---- Keyboard (WAI-ARIA APG Grid pattern) ----

  #moveFocus(row: number, col: number): void {
    this.#focusedRow = Math.min(Math.max(row, -1), this.#pageEntries.length - 1);
    this.#focusedCol = Math.min(Math.max(col, 0), this.#lastCol);
    this.#revealRow(this.#focusedRow);
    this.#pendingFocus = "cell";
    this.#render();
  }

  #activateFocusedCell(): void {
    const activeRow = this.#activeRow;
    if (this.#activeCol === 0 && this.#hasSelection) {
      if (activeRow === -1) {
        if (this.selectionMode === "multiple") this.#toggleSelectAll();
      } else {
        this.#toggleRow(this.#pageStart() + activeRow);
      }
      return;
    }
    const column = this.#visible[this.#activeCol - this.#colOffset];
    if (!column) return;
    if (activeRow === -1) this.#toggleSort(column);
  }

  /** The widgets a consumer put in a body cell (never the grid's own controls). */
  #widgetsIn(cell: Element): HTMLElement[] {
    return Array.from(cell.querySelectorAll<HTMLElement>(WIDGET_SELECTOR)).filter((node) => !node.closest("[data-grid-own]"));
  }

  #setWidgetTabindex(cell: Element, value: "0" | "-1"): void {
    for (const widget of this.#widgetsIn(cell)) widget.setAttribute("tabindex", value);
  }

  /** Widgets in body cells are not tab stops, so Tab leaves the grid in one step. */
  #normaliseWidgets(): void {
    if (!this.#rootEl || !this.#isGrid) return;
    for (const cell of this.#rootEl.querySelectorAll(".data-table-body [data-row][data-col]")) {
      if (cell.getAttribute("data-grid-entered") === "true") continue;
      this.#setWidgetTabindex(cell, "-1");
    }
  }

  /** Focus the first widget of a cell; its widgets are tab stops while focus stays inside it. */
  #enterCell(cell: HTMLElement): boolean {
    const first = this.#widgetsIn(cell)[0];
    if (!first) return false;
    cell.setAttribute("data-grid-entered", "true");
    this.#setWidgetTabindex(cell, "0");
    first.focus();
    return true;
  }

  #leaveCell(cell: Element): void {
    if (cell.getAttribute("data-grid-entered") !== "true") return;
    cell.removeAttribute("data-grid-entered");
    this.#setWidgetTabindex(cell, "-1");
  }

  /** Pointer or programmatic focus on a cell moves the roving position to it (without a re-render: it is already focused). */
  #onGridFocusin(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    this.#focusedRow = Number(cell.dataset.row);
    this.#focusedCol = Number(cell.dataset.col);
    // The roving tab stop follows focus in the DOM, without a rebuild that would drop it.
    this.#rootEl?.querySelectorAll<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]').forEach((node) => {
      if (node !== cell) node.setAttribute("tabindex", "-1");
    });
    if (cell.matches(".data-table-th, .data-table-td")) cell.setAttribute("tabindex", "0");
    // Focus arriving on a widget (a click, or Tab inside the cell) makes the cell's widgets tab stops.
    if (target !== cell && !target.closest("[data-grid-own]") && cell.closest(".data-table-body")) {
      cell.setAttribute("data-grid-entered", "true");
      this.#setWidgetTabindex(cell, "0");
    }
  }

  #onGridFocusout(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const next = event.relatedTarget as Node | null;
    if (next && cell.contains(next)) return;
    this.#leaveCell(cell);
  }

  /** A click on a body cell, outside any widget, activates its row. */
  #onGridClick(event: MouseEvent): void {
    if (!this.activateRows) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head")) return;
    if (target.closest(WIDGET_SELECTOR) || target.closest("[data-grid-own]")) return;
    const entry = this.#pageEntries[Number(cell.dataset.row)];
    if (entry) this.#activate(entry);
  }

  #activate(entry: Entry): void {
    this.#onRowActivate?.(entry.row, entry.id);
    this.#emit("rowactivate", { row: entry.row, id: entry.id });
  }

  /** A double click on an editable body cell starts editing it. */
  #onGridDblclick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head") || target.closest("input, button, select, textarea")) return;
    const entry = this.#pageEntries[Number(cell.dataset.row)];
    const column = this.#visible[Number(cell.dataset.col) - this.#colOffset];
    if (entry && column && this.#isEditable(column)) this.#startEdit(entry, column);
  }

  #onGridKeydown(event: KeyboardEvent): void {
    if (!this.#isGrid) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    // A key pressed on a widget inside a cell belongs to the widget: the caret moves in a field, a select
    // opens, a link follows. Only Escape is the grid's, and it hands focus back to the cell.
    if (target !== cell && !target.closest("[data-grid-own]")) {
      if (event.key === "Escape") {
        event.preventDefault();
        cell.focus({ preventScroll: true });
      }
      return;
    }
    const activeRow = this.#activeRow;
    const activeCol = this.#activeCol;
    const colOffset = this.#colOffset;
    if (event.altKey && activeRow === -1 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const column = this.#visible[activeCol - colOffset];
      if (column?.movable) {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        if (this.#moveColumn(column.id, activeCol - colOffset + delta)) this.#moveFocus(-1, activeCol + delta);
        return;
      }
    }
    const size = this.pageSize;
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        this.#moveFocus(activeRow, activeCol + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.#moveFocus(activeRow, activeCol - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.#moveFocus(activeRow + 1, activeCol);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.#moveFocus(activeRow - 1, activeCol);
        break;
      case "Home":
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) this.#moveFocus(-1, 0);
        else this.#moveFocus(activeRow, 0);
        break;
      case "End":
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) this.#moveFocus(this.#pageEntries.length - 1, this.#lastCol);
        else this.#moveFocus(activeRow, this.#lastCol);
        break;
      case "PageDown":
        event.preventDefault();
        this.#moveFocus(activeRow + (size ?? 10), activeCol);
        break;
      case "PageUp":
        event.preventDefault();
        this.#moveFocus(activeRow - (size ?? 10), activeCol);
        break;
      case "F2": {
        const entry = this.#pageEntries[Number(cell.dataset.row)];
        const column = this.#visible[Number(cell.dataset.col) - colOffset];
        if (target === cell && entry && column && this.#isEditable(column)) {
          event.preventDefault();
          this.#startEdit(entry, column);
        }
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (event.key === "Enter" && target === cell && cell.closest(".data-table-body")) {
          const entry = this.#pageEntries[Number(cell.dataset.row)];
          const column = this.#visible[Number(cell.dataset.col) - colOffset];
          if (entry && column && this.#isEditable(column)) {
            this.#startEdit(entry, column);
            break;
          }
        }
        if (target === cell && cell.closest(".data-table-body") && !cell.querySelector("[data-grid-own]")) {
          // A cell with a widget in it is entered; one without activates its row.
          if (this.#enterCell(cell)) break;
          if (event.key === "Enter" && this.activateRows) {
            const entry = this.#pageEntries[Number(cell.dataset.row)];
            if (entry) this.#activate(entry);
            break;
          }
        }
        this.#activateFocusedCell();
        break;
    }
  }

  // ---- Rendering ----

  #button(className: string, text: string | null, onClick: () => void, attrs?: Record<string, string | number | boolean | null | undefined>): HTMLButtonElement {
    const button = el("button", className, { type: "button", ...attrs }, text);
    button.addEventListener("click", onClick);
    return button;
  }

  #render(): void {
    if (!this.isConnected) return;
    this.#restoreView();
    this.#derive();
    const labels = this.#labels;
    const isGrid = this.#isGrid;
    const colOffset = this.#colOffset;
    this.#rendering = true;

    const root = el("div", `data-grid ${this.getAttribute("class") ?? ""}`.trim());

    // ---- Toolbar ----
    const hidable = this.#resolved.filter((c) => c.hidable);
    const hasExport = !!(labels.exportCsv || labels.exportTsv || labels.exportExcel);
    if (labels.search || hidable.length > 0 || hasExport) {
      const toolbar = el("div", "data-grid-toolbar");
      if (labels.search) {
        const search = el("input", "data-grid-search", { type: "search", "aria-label": labels.search });
        search.value = this.#filter;
        search.addEventListener("input", () => this.#onFilterInput(search));
        toolbar.append(search);
      }
      if (hasExport) {
        const group = el("div", "data-grid-export", { role: "group", "aria-label": labels.export });
        const empty = this.#exportEntries().length === 0;
        for (const [format, text] of [["csv", labels.exportCsv], ["tsv", labels.exportTsv], ["xlsx", labels.exportExcel]] as const) {
          if (!text) continue;
          group.append(this.#button("data-grid-export-button", text, () => this.#runExport(format), { "data-grid-export-format": format, disabled: empty }));
        }
        toolbar.append(group);
      }
      if (hidable.length > 0 && labels.columnVisibility) {
        const fieldset = el("fieldset", "data-grid-column-visibility", undefined, el("legend", undefined, undefined, labels.columnVisibility));
        for (const column of hidable) {
          const box = el("input", undefined, { type: "checkbox" });
          box.checked = !this.#hidden.has(column.id);
          box.addEventListener("change", () => this.#toggleColumnVisibility(column.id));
          fieldset.append(el("label", undefined, undefined, box, labels.columnVisibilityOption?.(column.header) ?? column.header));
        }
        toolbar.append(fieldset);
      }
      root.append(toolbar);
    }

    // ---- Table ----
    const rowCount = this.pageSize ? this.#sorted.length + 1 : this.#virtualize ? this.#pageEntries.length + 1 : undefined;
    const indexed = !!this.pageSize || !!this.#virtualize;
    const table = el("table", "data-table", {
      role: isGrid ? "grid" : "table",
      "aria-label": this.label,
      "aria-rowcount": isGrid && rowCount !== undefined ? rowCount : null,
      "aria-busy": this.busy ? "true" : null,
    });
    if (this.caption) table.append(el("caption", undefined, undefined, this.caption));
    if (isGrid) {
      table.addEventListener("keydown", (e) => this.#onGridKeydown(e));
      table.addEventListener("focusin", (e) => this.#onGridFocusin(e));
      table.addEventListener("focusout", (e) => this.#onGridFocusout(e));
    }
    table.addEventListener("click", (e) => this.#onGridClick(e));
    table.addEventListener("dblclick", (e) => this.#onGridDblclick(e));

    // Head.
    const thead = el("thead", "data-table-head");
    const headRow = el("tr", "data-table-row", { "aria-rowindex": indexed ? 1 : null });
    const activeRow = this.#activeRow;
    const activeCol = this.#activeCol;
    if (this.#hasSelection) {
      const th = el("th", "data-table-th", {
        scope: "col",
        "data-row": -1,
        "data-col": 0,
        tabindex: isGrid ? (activeRow === -1 && activeCol === 0 ? 0 : -1) : null,
      });
      if (this.selectionMode === "multiple") {
        const box = el("input", undefined, { type: "checkbox", "data-grid-own": true, tabindex: isGrid ? -1 : null, "aria-label": labels.selectAll });
        box.checked = this.#allSelected();
        box.indeterminate = this.#someSelected();
        box.addEventListener("click", () => this.#toggleSelectAll());
        th.append(box);
      } else {
        th.append(el("span", "data-grid-selection-header-label", undefined, labels.selectionColumn));
      }
      headRow.append(th);
    }
    this.#visible.forEach((column, i) => {
      const th = el("th", "data-table-th", {
        scope: "col",
        "data-row": -1,
        "data-col": colOffset + i,
        "data-align": column.align,
        "data-cell-type": column.type,
        "data-pinned": column.pinned,
        tabindex: isGrid ? (activeRow === -1 && activeCol === colOffset + i ? 0 : -1) : null,
        "aria-sort": this.#ariaSortFor(column),
        "aria-describedby": column.type === "rollup" && labels.rollupDescription ? `${this.#gridId}-${column.id}-description` : null,
        draggable: column.movable ? "true" : null,
      });
      this.#applyCellStyle(th, column);
      if (column.movable) {
        th.addEventListener("dragstart", (e) => {
          this.#draggingColumnId = column.id;
          e.dataTransfer?.setData("text/plain", column.id);
        });
        th.addEventListener("dragover", (e) => {
          if (this.#draggingColumnId) e.preventDefault();
        });
        th.addEventListener("drop", (e) => {
          e.preventDefault();
          const id = this.#draggingColumnId;
          this.#draggingColumnId = null;
          if (!id || id === column.id) return;
          const to = this.#visible.findIndex((c) => c.id === column.id);
          if (to >= 0 && this.#moveColumn(id, to)) this.#render();
        });
      }
      const headContent = (): Node | null => (column.headerCell ? nodeOf(column.headerCell({ column })) : document.createTextNode(column.header));
      if (column.sortable) {
        const button = this.#button("data-grid-sort-button", null, () => this.#toggleSort(column), { "data-grid-own": true, tabindex: isGrid ? -1 : null });
        const content = headContent();
        if (content) button.append(content);
        th.append(button);
      } else {
        const content = headContent();
        if (content) th.append(content);
      }
      if (column.type === "rollup" && labels.rollupDescription) {
        th.append(el("span", "data-grid-visually-hidden", { id: `${this.#gridId}-${column.id}-description` }, labels.rollupDescription(column.header)));
      }
      if (column.resizable) {
        // WAI-ARIA "window splitter" pattern: role="separator" plus tabindex/aria-valuenow is how a resize handle becomes focusable and operable.
        const handle = el("span", "data-grid-resize-handle", {
          role: "separator",
          "data-grid-own": true,
          "aria-orientation": "vertical",
          "aria-label": labels.resizeHandle?.(column.header),
          "aria-valuenow": this.#widthFor(column) ?? 120,
          "aria-valuemin": MIN_COLUMN_WIDTH,
          tabindex: 0,
        });
        handle.addEventListener("keydown", (e) => {
          // The handle is its own tab stop outside the grid's roving-tabindex system — every key here must stop.
          e.stopPropagation();
          const current = this.#widthFor(column) ?? 120;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            this.#setWidth(column, current + RESIZE_STEP);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            this.#setWidth(column, current - RESIZE_STEP);
          }
        });
        handle.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = this.#widthFor(column) ?? th.getBoundingClientRect().width ?? 120;
          handle.setPointerCapture?.(e.pointerId);
          const onMove = (moveEvent: PointerEvent): void => this.#setWidth(column, startWidth + (moveEvent.clientX - startX));
          const onUp = (): void => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });
        th.append(handle);
      }
      headRow.append(th);
    });
    thead.append(headRow);
    table.append(thead);

    // Body.
    const tbody = el("tbody", "data-table-body");
    const selectedSet = this.#selectedSet();
    for (const item of this.#renderItems()) {
      if (item.kind === "spacer") {
        const spacer = el("tr", "data-grid-spacer", { "aria-hidden": "true" }, el("td", undefined, { colspan: this.#lastCol + 1 }));
        spacer.style.height = `${item.rows * (this.#virtualize?.rowHeight ?? 0)}px`;
        tbody.append(spacer);
        continue;
      }
      const rowIndex = item.index;
      const entry = this.#pageEntries[rowIndex];
      const tr = el("tr", `data-table-row ${this.#rowClass?.(entry.row) ?? ""}`.trim(), {
        "aria-selected": this.#hasSelection ? String(selectedSet.has(entry.id)) : null,
        "aria-rowindex": indexed ? this.#pageStart() + rowIndex + 2 : null,
      });
      for (const [name, value] of Object.entries(this.#rowAttrs?.(entry.row) ?? {})) tr.setAttribute(name, value);
      if (this.#hasSelection) {
        const td = el("td", "data-table-td", {
          role: isGrid ? "gridcell" : "cell",
          "data-row": rowIndex,
          "data-col": 0,
          tabindex: isGrid ? (activeRow === rowIndex && activeCol === 0 ? 0 : -1) : null,
        });
        const input = el("input", undefined, {
          type: this.selectionMode === "single" ? "radio" : "checkbox",
          "data-grid-own": true,
          tabindex: isGrid ? -1 : null,
          "aria-label": labels.selectRow?.(this.#rowLabelOf(entry)),
        });
        input.checked = selectedSet.has(entry.id);
        input.addEventListener("click", (e) => this.#toggleRow(this.#pageStart() + rowIndex, e));
        td.append(input);
        tr.append(td);
      }
      this.#visible.forEach((column, colIndex) => {
        const ctx = this.#cellFor(column, entry.row);
        const extraClass = typeof column.cellClass === "function" ? column.cellClass(ctx) : column.cellClass;
        const isActive = activeRow === rowIndex && activeCol === colOffset + colIndex;
        const cell = column.rowHeader
          ? el("th", `data-table-th ${extraClass ?? ""}`.trim(), { scope: "row", role: "rowheader", tabindex: isGrid ? (isActive ? 0 : -1) : null })
          : el("td", `data-table-td ${extraClass ?? ""}`.trim(), {
              role: isGrid ? "gridcell" : "cell",
              tabindex: isGrid ? (isActive ? 0 : -1) : null,
              "data-editable": this.#isEditable(column),
              "data-readonly": column.type === "rollup",
              "aria-readonly": column.type === "rollup" ? "true" : null,
              "data-editing": this.#editing?.rowId === entry.id && this.#editing.columnId === column.id,
            });
        cell.setAttribute("data-row", String(rowIndex));
        cell.setAttribute("data-col", String(colOffset + colIndex));
        if (column.align) cell.setAttribute("data-align", column.align);
        if (column.type) cell.setAttribute("data-cell-type", column.type);
        if (column.pinned) cell.setAttribute("data-pinned", column.pinned);
        if (column.errorOf?.(entry.row) !== undefined) cell.setAttribute("data-error", "");
        this.#applyCellStyle(cell, column);
        for (const [name, value] of Object.entries(column.cellAttrs?.(ctx) ?? {})) cell.setAttribute(name, value);
        if (column.type === "file" && column.editable && !column.rowHeader) {
          cell.addEventListener("dragover", (e) => {
            if (Array.from(e.dataTransfer?.types ?? []).includes("Files")) e.preventDefault();
          });
          cell.addEventListener("drop", (e) => {
            const dropped = Array.from(e.dataTransfer?.files ?? []);
            if (dropped.length === 0) return;
            e.preventDefault();
            this.#reportFiles(entry, column, column.multiple === false ? dropped.slice(0, 1) : dropped);
          });
        }
        this.#buildCellBody(cell, entry, column, ctx);
        tr.append(cell);
      });
      tbody.append(tr);
    }
    if (this.#pageEntries.length === 0 && this.#empty) {
      const content = nodeOf(this.#empty());
      const td = el("td", "data-table-td data-grid-empty", { colspan: this.#lastCol + 1, role: isGrid ? "gridcell" : "cell" });
      if (content) td.append(content);
      tbody.append(el("tr", "data-table-row data-grid-empty-row", undefined, td));
    }
    table.append(tbody);
    if (this.#footer) {
      const content = nodeOf(this.#footer({ columns: this.#visible, rows: this.#pageEntries.map((e) => e.row) }));
      const tfoot = el("tfoot", "data-table-foot");
      if (content) tfoot.append(content);
      table.append(tfoot);
    }

    // ---- Scroll region ----
    if (this.scrollable) {
      const scroll = el("div", "data-grid-scroll", { role: "region", "aria-label": this.label, tabindex: isGrid ? null : 0 });
      if (this.#virtualize) {
        scroll.style.height = `${this.#virtualize.height}px`;
        scroll.style.overflow = "auto";
        scroll.addEventListener("scroll", () => {
          this.#scrollTop = scroll.scrollTop;
          this.#render();
        });
      }
      scroll.append(table);
      root.append(scroll);
      this.#scrollEl = scroll;
    } else {
      root.append(table);
      this.#scrollEl = null;
    }

    // ---- Pagination ----
    if (this.pageSize) {
      const page = this.#clampedPage();
      const count = this.#pageCount();
      root.append(
        el(
          "div",
          "data-grid-pagination",
          undefined,
          this.#button("data-grid-page-previous", labels.previousPage ?? null, () => this.#goToPage(page - 1), { disabled: page <= 1 }),
          el("span", "data-grid-page-status", undefined, labels.pageStatus?.(page, count, this.#sorted.length)),
          this.#button("data-grid-page-next", labels.nextPage ?? null, () => this.#goToPage(page + 1), { disabled: page >= count }),
        ),
      );
    }

    const status = el("p", "data-grid-status", { "aria-live": "polite" }, this.#statusMessage);
    root.append(status);

    this.replaceChildren(root);
    this.#rootEl = root;
    this.#statusEl = status;
    if (this.#virtualize && this.#scrollEl) this.#scrollEl.scrollTop = this.#scrollTop;
    this.#rendering = false;
    this.#normaliseWidgets();
    this.#applyPendingFocus();
  }

  #applyPendingFocus(): void {
    const pending = this.#pendingFocus;
    this.#pendingFocus = null;
    if (!pending || !this.#rootEl) return;
    if (pending === "cell") {
      this.#rootEl.querySelector<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]')?.focus({ preventScroll: true });
    } else if (pending === "editor") {
      const editor = this.#rootEl.querySelector<HTMLInputElement | HTMLSelectElement>(".data-grid-cell-editor, .data-grid-zoned-editor input");
      editor?.focus();
      if (editor instanceof HTMLInputElement && editor.type === "text") editor.select();
    } else if (pending === "search") {
      const search = this.#rootEl.querySelector<HTMLInputElement>(".data-grid-search");
      if (search) {
        search.focus();
        const [start, end] = this.#searchSelection ?? [search.value.length, search.value.length];
        search.setSelectionRange(start, end);
      }
    }
  }

  #rowLabelOf(entry: Entry): string {
    const first = this.#visible[0];
    return first ? this.#cellFor(first, entry.row).formatted : entry.id;
  }

  #reportFiles(entry: Entry, column: DataGridColumn, files: File[]): void {
    const event = { rowId: entry.id, row: entry.row, columnId: column.id, files };
    this.#onFilesSelected?.(event);
    this.#emit("filesselected", event);
  }

  /** The cell's content: an editor, a radio group, or the type's display (plus the edit button). */
  #buildCellBody(cell: HTMLElement, entry: Entry, column: DataGridColumn, ctx: DataGridCellContext): void {
    const labels = this.#labels;
    const isGrid = this.#isGrid;
    const editing = this.#editing;
    const errorId = `${entry.id}-${column.id}-error`;

    if (editing && editing.rowId === entry.id && editing.columnId === column.id) {
      const name = (column.type === "formula" ? labels.formulaEditor?.(column.header) : undefined) ?? labels.cellEditor?.(column.header) ?? column.header;
      const invalid = editing.error || editing.invalid ? "true" : null;
      const describedBy = editing.error ? errorId : null;
      const onDraft = (value: string): void => {
        if (this.#editing) this.#editing = { ...this.#editing, draft: value, error: undefined, invalid: false };
      };
      if (column.editor === "person" && column.personEditor) {
        const node = nodeOf(column.personEditor({ value: ctx.value, commit: (v) => void this.#commitValue(entry, column, v), cancel: () => this.#cancelEdit() }));
        if (node) cell.append(node);
        return;
      }
      if (column.editor === "time-zone") {
        const group = el("span", "data-grid-zoned-editor", { role: "group", "aria-label": labels.cellEditor?.(column.header) ?? column.header });
        const time = el("input", "data-grid-cell-editor", { type: "time", step: 1, "aria-label": labels.cellEditor?.(column.header) ?? column.header, "aria-invalid": invalid, "aria-describedby": describedBy });
        time.value = editing.draft;
        time.addEventListener("input", () => onDraft(time.value));
        time.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        const select = el("select", "data-grid-cell-editor data-grid-zone-editor", { "aria-label": labels.timeZone?.(column.header) ?? column.header });
        for (const option of column.timeZones ?? []) {
          const node = el("option", undefined, { value: option.id }, option.label);
          node.selected = option.id === editing.zone;
          select.append(node);
        }
        select.addEventListener("change", () => {
          if (this.#editing) this.#editing = { ...this.#editing, zone: select.value, error: undefined, invalid: false };
        });
        select.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        group.addEventListener("focusout", (e) => {
          if (!this.#rendering && this.#editing && !group.contains(e.relatedTarget as Node | null)) this.#commitEdit();
        });
        group.append(time, select);
        cell.append(group);
      } else if (column.editor === "select") {
        const select = el("select", "data-grid-cell-editor", { "aria-label": name, "aria-invalid": invalid, "aria-describedby": describedBy });
        select.append(el("option", undefined, { value: "" }));
        const option = (o: DataGridOption) => {
          const node = el("option", undefined, { value: o.id, disabled: o.disabled }, o.label);
          node.selected = o.id === editing.draft;
          return node;
        };
        for (const o of (column.options ?? []).filter((x) => !x.group)) select.append(option(o));
        for (const group of [...new Set((column.options ?? []).filter((x) => x.group).map((x) => x.group as string))]) {
          const optgroup = el("optgroup", undefined, { label: group });
          for (const o of (column.options ?? []).filter((x) => x.group === group)) optgroup.append(option(o));
          select.append(optgroup);
        }
        select.value = editing.draft;
        select.addEventListener("change", () => onDraft(select.value));
        select.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        select.addEventListener("blur", () => {
          if (!this.#rendering && this.#editing) this.#commitEdit();
        });
        cell.append(select);
      } else {
        const input = el("input", "data-grid-cell-editor", {
          type: column.editor === "number" ? "number" : column.editor === "date" ? "date" : column.editor === "time" ? "time" : "text",
          step: column.editor === "time" ? 1 : null,
          inputmode: column.editor === "number" ? "decimal" : null,
          "aria-label": name,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
        });
        input.value = editing.draft;
        input.addEventListener("input", () => onDraft(input.value));
        input.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        input.addEventListener("blur", () => {
          if (!this.#rendering && this.#editing) this.#commitEdit();
        });
        cell.append(input);
      }
      if (editing.error) cell.append(el("span", "data-grid-cell-error", { id: errorId }, editing.error));
      return;
    }

    if (column.type === "radio" && column.editable) {
      const fieldset = el("fieldset", "data-grid-radio-group", { "data-grid-own-group": true }, el("legend", "data-grid-radio-legend", undefined, labels.radioGroup?.(column.header, this.#rowLabelOf(entry)) ?? column.header));
      for (const option of column.options ?? []) {
        const input = el("input", undefined, {
          type: "radio",
          name: `${this.#gridId}-${entry.id}-${column.id}`,
          value: option.id,
          disabled: option.disabled,
          tabindex: isGrid ? -1 : null,
        });
        input.checked = ctx.value === option.id;
        input.addEventListener("change", () => void this.#commitValue(entry, column, option.id));
        fieldset.append(el("label", "data-grid-radio-option", undefined, input, option.label));
      }
      cell.append(fieldset);
      return;
    }

    if (column.cell) {
      const node = nodeOf(column.cell(ctx));
      if (node) cell.append(node);
    } else if (column.type === "person") {
      const people = peopleOf(ctx.value);
      if (people.length > 0) {
        const shown = column.maxPeople !== undefined ? people.slice(0, Math.max(0, column.maxPeople)) : people;
        const list = el("ul", "data-grid-people");
        for (const person of shown) {
          const item = el("li", "data-grid-person");
          const avatar = column.avatar ? nodeOf(column.avatar({ person })) : null;
          if (avatar) item.append(el("span", "data-grid-avatar", { "aria-hidden": "true" }, avatar));
          item.append(el("span", "data-grid-person-name", undefined, personName(person)));
          list.append(item);
        }
        if (shown.length < people.length && labels.morePeople) {
          list.append(el("li", "data-grid-people-more", undefined, labels.morePeople(people.length - shown.length)));
        }
        cell.append(list);
      }
    } else if (column.type === "file") {
      const files = filesOf(ctx.value);
      if (files.length > 0) {
        const list = el("ul", "data-grid-files");
        for (const file of files) {
          const href = file.href ? safeHref(file.href) : null;
          const item = el("li", "data-grid-file");
          item.append(href ? el("a", "data-grid-link", { href }, file.name) : el("span", "data-grid-file-name", undefined, file.name));
          if (file.size !== undefined && column.formatSize) item.append(" ", el("span", "data-grid-file-size", undefined, column.formatSize(file.size)));
          if (column.editable && labels.removeFile) {
            item.append(
              this.#button(
                "data-grid-file-remove",
                null,
                () => {
                  const event = { rowId: entry.id, row: entry.row, columnId: column.id, fileId: file.id };
                  this.#onFileRemove?.(event);
                  this.#emit("fileremove", event);
                },
                { "data-grid-own": true, tabindex: isGrid ? -1 : null, "aria-label": labels.removeFile(file.name) },
              ),
            );
          }
          list.append(item);
        }
        cell.append(list);
      }
      if (column.editable) {
        const input = el("input", "data-grid-file-input", {
          type: "file",
          "aria-label": labels.fileInput?.(column.header, this.#rowLabelOf(entry)) ?? column.header,
          multiple: column.multiple !== false,
          accept: column.accept,
          tabindex: isGrid ? -1 : null,
        });
        input.addEventListener("change", () => {
          const chosen = Array.from(input.files ?? []);
          if (chosen.length > 0) this.#reportFiles(entry, column, chosen);
          input.value = "";
        });
        cell.append(input);
      }
    } else if (column.type === "link") {
      const link = linkParts(ctx.value);
      if (link) {
        const href = safeHref(link.href);
        const text = link.label ?? link.href;
        if (href) {
          const a = el("a", "data-grid-link", { href, target: link.external ? "_blank" : null, rel: link.external ? "noopener noreferrer" : null }, text);
          if (link.external && labels.opensInNewTab) a.append(" ", el("span", "data-grid-visually-hidden", undefined, labels.opensInNewTab(text)));
          cell.append(a);
        } else {
          // An address with an unsafe scheme is shown as text, never as a link.
          cell.append(el("span", "data-grid-link data-grid-link-unsafe", undefined, text));
        }
      }
    } else if (column.type === "date" || column.type === "time") {
      if (ctx.formatted !== "") cell.append(el("time", undefined, { datetime: String(ctx.value) }, ctx.formatted));
    } else {
      cell.append(ctx.formatted);
    }
    if (this.#isEditable(column) && column.type !== "radio" && labels.editCell) {
      cell.append(this.#button("data-grid-edit-button", null, () => this.#startEdit(entry, column), { "data-grid-own": true, tabindex: isGrid ? -1 : null, "aria-label": labels.editCell(column.header, this.#rowLabelOf(entry)) }));
    }
  }
}
