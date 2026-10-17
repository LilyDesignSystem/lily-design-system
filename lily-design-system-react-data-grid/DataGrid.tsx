import * as React from "react";
import {
  DataTable,
  DataTableBody,
  DataTableFoot,
  DataTableHead,
  DataTableRow,
  DataTableTD,
  DataTableTH,
} from "@lilydesignsystem/react-headless";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data";
import { foldText, searchTerms } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove } from "./grid-navigation";
import { missingLabels, type LabelFeatures } from "./label-coverage";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, type TypeaheadState } from "./typeahead";
import {
  isInvalidForType,
  linkParts,
  resolveColumn,
  filesOf,
  isZonedTime,
  peopleOf,
  personName,
  safeHref,
  zonedUtcTime,
  type DataGridCellType,
  type DataGridOption,
  type DataGridPerson,
} from "./cell-types";

export type DataGridSortDirection = "ascending" | "descending" | "none";

export type DataGridSort = {
  columnId: string;
  direction: DataGridSortDirection;
};

export type DataGridSelectionMode = "none" | "single" | "multiple";

export type DataGridRow = Record<string, unknown>;

/** What `onExport` receives, before the file is saved. */
export type DataGridExport = {
  format: ExportFormat;
  /** The file name, with its extension. */
  filename: string;
  /** How many data rows (the header is not counted). */
  rowCount: number;
  /** The file. */
  blob: Blob;
};

/** What `onCellEdit` receives after a cell edit is committed. */
export type DataGridCellEdit = {
  rowId: string;
  row: DataGridRow;
  columnId: string;
  /** The parsed new value (a number for the `"number"` editor, the text otherwise). */
  value: unknown;
  /** The cell's value before the edit. */
  previous: unknown;
};

/** Arguments a column's `cell` render prop receives. See spec/index.md §5. */
export type DataGridCellContext = {
  value: unknown;
  formatted: string;
  row: DataGridRow;
  column: DataGridColumn;
};

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
  /**
   * Orders two raw values when sorting (negative, zero, positive),
   * e.g. a consumer's `Intl.Collator#compare`. Defaults to `<`/`>`.
   * `null`/`undefined` always sort last, before `compare` is called.
   */
  compare?: (a: unknown, b: unknown) => number;
  /** Column participates in the text filter. Default true. */
  filterable?: boolean;
  /** Column can be resized (pointer + keyboard). */
  resizable?: boolean;
  /** Column can be reordered: Alt+ArrowLeft/Right on its focused header, or dragging the header onto another. */
  movable?: boolean;
  /** Pins the column to one side: its header and cells get `data-pinned="start"` / `"end"` for the consumer's `position: sticky` CSS. Lily sets no offsets. */
  pinned?: "start" | "end";
  /** Set `false` to leave the column out of an export (an actions column, say). Default true. */
  exportable?: boolean;
  /** The value this column exports for a row. Default: a number, boolean or `Date` as itself, anything else as its displayed text (so `format` applies). */
  exportValue?: (row: DataGridRow) => unknown;
  /** Column can be hidden via the column-visibility control. */
  hidable?: boolean;
  /** Initial pixel width, meaningful only when `resizable`. */
  width?: number;
  /** Custom cell renderer. Defaults to the formatted value as text. */
  cell?: (ctx: DataGridCellContext) => React.ReactNode;
  /** The header's content in place of the `header` text. `header` stays the accessible name. */
  headerCell?: (ctx: { column: DataGridColumn }) => React.ReactNode;
  /** Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button `labels.editCell` gates. Enter commits, Escape cancels, leaving the field commits. */
  editable?: boolean;
  /** The editor's control. Default `"text"`; a `type` sets its own (`"number"`, `"link"`, `"date"`, `"time"`, `"select"`, `"radio"`). */
  editor?: "text" | "number" | "link" | "date" | "time" | "time-zone" | "select" | "radio" | "person" | "formula";
  /** `time-zone`: the zones the editor's select offers. */
  timeZones?: DataGridOption[];
  /** `time-zone`: the date (ISO) that orders zoned times and names a zone. Never computed by the grid. */
  referenceDate?: string;
  /** `time-zone`: an export adds a second column holding the UTC time of day at `referenceDate`, headed by `labels.exportUtcHeader`. */
  exportUtc?: boolean;
  /** `rollup`: how the related values are reduced. */
  aggregate?: "count" | "countUnique" | "sum" | "avg" | "median" | "min" | "max" | "range" | "percentTrue" | "percentEmpty";
  /** `rollup`: a reduction the named aggregates do not cover. */
  reduce?: (values: unknown[], row: DataGridRow) => unknown;
  /** `rollup`: reads the related values. Defaults to the row's own array at the column id. */
  relation?: (row: DataGridRow) => unknown[];
  /** `rollup` and `formula`: the result's type, so it formats and sorts like one. */
  resultType?: "number" | "date" | "text";
  /** `formula`: evaluates an expression. Lily ships no engine and never evaluates a string itself. */
  evaluate?: (expression: string, context: { row: DataGridRow; rows: DataGridRow[]; columnId: string }) => { value: unknown } | { error: string };
  /** `person`: how many people show before "+N" (`labels.morePeople`). */
  maxPeople?: number;
  /** `person`: an avatar beside the name. Decorative: the name is always shown as text. */
  avatar?: (ctx: { person: DataGridPerson }) => React.ReactNode;
  /** `person`: the editor, given `{ value, commit, cancel }`. Lily cannot look people up; the consumer builds the combobox. Without it a person cell is read-only. */
  personEditor?: (ctx: { value: unknown; commit: (value: unknown) => void; cancel: () => void }) => React.ReactNode;
  /** `file`: formats a size in bytes (no unit strings are bundled). */
  formatSize?: (bytes: number) => string;
  /** `file`: the `accept` of the file input. */
  accept?: string;
  /** `file`: whether the input takes several files. Default true. */
  multiple?: boolean;
  /** Set for a `formula` column: reads the expression a row holds. */
  source?: (row: DataGridRow) => unknown;
  /** Set for a `formula` column: the error message for a row, if any. */
  errorOf?: (row: DataGridRow) => string | undefined;
  /** The kind of value in this column: a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor`, plus the cell's markup. Your own props win. See spec/cell-types/index.md. */
  type?: DataGridCellType;
  /** Shown instead of nothing when this column's value is missing (`null`, `undefined` or `""`). Overrides the grid's `emptyValue`. A missing value always carries `data-empty` on its cell. */
  emptyValue?: string;
  /** BCP 47 locale for this column's formatting and collation. Falls back to the grid's `locale`; with neither, values show as stored. */
  locale?: string;
  /** `select` and `radio`: the choices. The label is displayed, the id is stored. */
  options?: DataGridOption[];
  /** `select`: sort by option label (default) or by option order. (`radio` always sorts by order.) */
  sortBy?: "label" | "order";
  /** `select` and `radio`: export the option's `"label"` (default) or its `"id"`. `person`: `"email"` exports the emails. */
  exportAs?: "label" | "id" | "email";
  /** `number`: options for `Intl.NumberFormat`. */
  numberFormat?: Intl.NumberFormatOptions;
  /** `date`: options for `Intl.DateTimeFormat` (the zone is always UTC: a civil date does not shift). */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** `time`: options for `Intl.DateTimeFormat`. */
  timeFormat?: Intl.DateTimeFormatOptions;
  /** The text the grid's filter matches for a value. Default: the displayed text. */
  filterText?: (value: unknown, row: DataGridRow) => string;
  /** Turns the editor's text into the committed value. Defaults to the text (`Number(text)`, or `null` when empty, for `"number"`). */
  parse?: (draft: string, row: DataGridRow) => unknown;
  /** Refuses a value: return a message and the cell stays in edit mode with `aria-invalid`; return nothing to accept. */
  validate?: (value: unknown, row: DataGridRow) => string | undefined;
  /** Body cells of this column are `<th scope="row" role="rowheader">`. */
  rowHeader?: boolean;
  /** Horizontal alignment of the column's cells (`data-align` and `text-align`). */
  align?: "start" | "center" | "end";
  /** Extra class on each body cell of this column. */
  cellClass?: string | ((ctx: DataGridCellContext) => string);
  /** Extra attributes on each body cell of this column. */
  cellAttrs?: (ctx: DataGridCellContext) => Record<string, unknown>;
};

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching share-picker's
 * `copyLabel` and date-time-picker's `labels`. See spec/index.md §5.
 */
export type DataGridLabels = {
  search?: string;
  columnVisibility?: string;
  columnVisibilityOption?: (header: string) => string;
  resizeHandle?: (header: string) => string;
  /** Accessible name of the select that limits the search to one column. Gates the select (needs `searchAllFields` too). */
  searchField?: string;
  /** The select's first option: search every column. */
  searchAllFields?: string;
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
  /** Announced after a column moves: (header, 1-based position among the visible columns, how many are visible). */
  columnMoveAnnouncement?: (header: string, position: number, count: number) => string;
  /** Accessible name of a cell's edit button: (column header, row label). Gates the button (for pointer and table-mode use). */
  editCell?: (header: string, rowLabel: string) => string;
  /** Accessible name of the cell editor's field. Defaults to the column header. */
  cellEditor?: (header: string) => string;
  /** Announced after a committed edit: (column header, formatted new value). */
  editAnnouncement?: (header: string, value: string) => string;
  /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
  export?: string;
  /** Visible text of the CSV button. Gates the button. */
  exportCsv?: string;
  /** Visible text of the TSV button. Gates the button. */
  exportTsv?: string;
  /** Visible text of the Excel (.xlsx) button. Gates the button. */
  exportExcel?: string;
  /** Announced after an export: (format, how many rows, file name). */
  exportAnnouncement?: (format: ExportFormat, rowCount: number, filename: string) => string;
  /** Visible text of the copy button, which puts the export (header row first, tab-separated) on the clipboard for pasting into a spreadsheet. Gates the button. */
  copy?: string;
  /** Announced after a copy: (how many rows). */
  copyAnnouncement?: (rowCount: number) => string;
  /** Announced when the clipboard could not be written. */
  copyFailed?: string;
  /** Why a typed value was refused: (column header, the column's type). Gates the message; the cell stays in edit mode with `aria-invalid` either way. */
  invalidValue?: (header: string, type: string) => string;
  /** Appended, visually hidden, to a link that opens a new tab: (link text). */
  opensInNewTab?: (text: string) => string;
  /** Accessible name of a radio group in a cell: (column header, row label). Default the header. */
  radioGroup?: (header: string, rowLabel: string) => string;
  /** Accessible name of a `time-zone` editor's zone select. Defaults to the column header. */
  timeZone?: (header: string) => string;
  /** `time-zone`: the header of the extra UTC export column: (column header). Gates the column (with `exportUtc` and a `referenceDate`). */
  exportUtcHeader?: (header: string) => string;
  /** `person`: "+N more" text: (how many are hidden). Gates the text. */
  morePeople?: (count: number) => string;
  /** `file`: accessible name of a remove button: (file name). Gates the button. */
  removeFile?: (name: string) => string;
  /** `file`: accessible name of the file input: (column header, row label). Defaults to the header. */
  fileInput?: (header: string, rowLabel: string) => string;
  /** `formula`: accessible name of the expression editor. Defaults to the column header. */
  formulaEditor?: (header: string) => string;
  /** `rollup`: says what the derived number is ("Sum of hours"): read with the header. Gates the description. */
  rollupDescription?: (header: string) => string;
  /** Announced after an edit is cancelled with Escape. */
  editCancelAnnouncement?: (header: string) => string;
  /** Announced after Ctrl/Cmd+Z puts an earlier value back: (column header, the restored text). */
  undoAnnouncement?: (header: string, text: string) => string;
  /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies an edit: (column header, the text). */
  redoAnnouncement?: (header: string, text: string) => string;
  /** Announced when `validate` refuses a value: (column header, the message). */
  editError?: (header: string, message: string) => string;
};

/** Public props for DataGrid. See `spec/index.md` §5 for the contract. */
export type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Accessible name for the grid, passed through to DataTable. */
  label: string;
  /** Optional visible caption, passed through to DataTable. */
  caption?: string;
  /** Column definitions. */
  columns: DataGridColumn[];
  /** Row data. */
  rows: DataGridRow[];
  /** BCP 47 locale for the typed columns' formatting and collation, and for sorting plain text: with a locale, text sorts with `Intl.Collator(locale, { numeric: true })` ("Item 2" before "Item 10", "ä" with "a"). Never defaulted: with none, values show as stored and text sorts by code point. */
  locale?: string;
  /** What a cell shows when its value is missing (`null`, `undefined` or `""`), for example `"—"`. A column's own `emptyValue` wins. No default: Lily ships no text. The cell always carries `data-empty`, so CSS can style it, and an export is unaffected. */
  emptyValue?: string;
  /** In development, log (once per grid) the labels the grid's features call for but `labels` leaves out. Default `true`; it never logs in production. See `requiredLabels` / `missingLabels` to check a locale's bundle in a test. */
  warnMissingLabels?: boolean;
  /** Where missing values sort: `"last"` (default, in both directions) or `"first"`. */
  nulls?: "first" | "last";
  /** Make every column movable (Alt+Arrow on its header, or drag it) unless its own `movable` is `false`. Default `false`. */
  movableColumns?: boolean;
  /** Limits the text filter to one column: a column id, or `""` (default) for every filterable column. Controlled when given. The field select shows when `labels.searchField` names it. */
  filterField?: string;
  /** Initial `filterField` when uncontrolled. */
  defaultFilterField?: string;
  /** Called with the new `filterField` after every change. */
  onFilterFieldChange?: (columnId: string) => void;
  /** Derives a stable id per row. Defaults to the row's index in `rows`. */
  rowId?: (row: DataGridRow, index: number) => string;
  /** Row selection mode. */
  selectionMode?: DataGridSelectionMode;
  /** Selected row ids. When supplied, selection is controlled. */
  selected?: string[];
  /** Initial selection when uncontrolled. */
  defaultSelected?: string[];
  /** Called with the new id list after every selection change. */
  onSelectionChange?: (ids: string[]) => void;
  /** Text filter. When supplied, the filter is controlled. */
  filter?: string;
  /** Initial filter when uncontrolled. */
  defaultFilter?: string;
  /** Called with the new filter text after every change. */
  onFilterChange?: (filter: string) => void;
  /** Hides rows for which it returns false (a status or date-range filter). Combines with `filter`; both must pass. */
  rowFilter?: (row: DataGridRow) => boolean;
  /** Further sort keys after `sort`, for ties: Shift+click on another sortable header adds it (ascending, then descending, then off); a plain click sets `sort` alone and clears these. Controlled when given. Headers carry `data-sort-order` (1 = primary) while more than one key is set. */
  thenBy?: DataGridSort[];
  /** Initial `thenBy` when uncontrolled. */
  defaultThenBy?: DataGridSort[];
  /** Called with `thenBy` after every change. */
  onThenByChange?: (thenBy: DataGridSort[]) => void;
  /** Current sort. When supplied, the sort is controlled. */
  sort?: DataGridSort;
  /** Initial sort when uncontrolled. */
  defaultSort?: DataGridSort;
  /** Called with the new sort after every change. */
  onSortChange?: (sort: DataGridSort) => void;
  /** Column ids in display order. Controlled when given; columns it does not name follow in their `columns` order. */
  columnOrder?: string[];
  defaultColumnOrder?: string[];
  /** Called with the new order after a column moves. */
  onColumnOrderChange?: (order: string[]) => void;
  /** Rows per page. Unset disables pagination. */
  pageSize?: number;
  /** Current 1-indexed page. When supplied, the page is controlled. */
  page?: number;
  /** Initial page when uncontrolled. */
  defaultPage?: number;
  /** Called with the new page after every change (including the reset to 1 when the filter changes). */
  onPageChange?: (page: number) => void;
  /** If set, persist column widths / hidden columns / sort to localStorage. */
  storageKey?: string;
  /** User-facing strings. See DataGridLabels — presence gates each control. */
  labels?: DataGridLabels;
  /** `"grid"` (default): roving-tabindex grid. `"table"`: a plain table with ordinary tab stops. */
  mode?: "grid" | "table";
  /** Extra class on each body row. */
  rowClass?: (row: DataGridRow) => string;
  /** Extra attributes on each body row. */
  rowAttrs?: (row: DataGridRow) => Record<string, unknown>;
  /** Enter on a body cell with no widget, or a click outside any widget. */
  onRowActivate?: (row: DataGridRow, id: string) => void;
  /** Shown in one row spanning every column when no row is to be shown. */
  empty?: React.ReactNode;
  /** Rendered inside a `<tfoot>`. */
  footer?: (ctx: { columns: DataGridColumn[]; rows: DataGridRow[] }) => React.ReactNode;
  /** Sets `aria-busy` on the table. */
  busy?: boolean;
  /** Wrap the table in a scrollable `data-grid-scroll` region. Default true. */
  scroll?: boolean;
  /** `.xlsx` only: a `formula` column's cells keep the live expression with the result cached, so a spreadsheet user keeps the formula. CSV and TSV always carry the result. */
  exportFormulas?: boolean;
  /** The file name without its extension. Default `"data-grid"`. */
  exportFilename?: string;
  /** What an export holds: `"view"` (default) is every row the filter leaves, in the current sort and not just the shown page; `"selected"` is only the selected rows. Hidden columns are never exported. */
  exportScope?: "view" | "selected";
  /** Called with the file before it is saved. Return `false` to keep the grid from saving it (to upload it, say). */
  onExport?: (file: DataGridExport) => boolean | void;
  /** Called before a copy puts text on the clipboard. Return `false` to take over (the grid then copies nothing). */
  onCopy?: (copy: { text: string; rowCount: number }) => boolean | void;
  /** `file` columns: called with the `File` objects the person chose. Lily does not upload: the consumer does, then updates `rows`. */
  onFilesSelected?: (event: { rowId: string; row: DataGridRow; columnId: string; files: File[] }) => void;
  /** `file` columns: called when a file's remove button is pressed. The consumer updates `rows`. */
  onFileRemove?: (event: { rowId: string; row: DataGridRow; columnId: string; fileId: string }) => void;
  /** Called after a cell edit is committed. The consumer updates `rows`; the grid never mutates them. */
  onCellEdit?: (edit: DataGridCellEdit) => void;
  /**
   * Renders only the rows in view, in a scroll region of `height` px (needs `scroll`). Every row is assumed
   * `rowHeight` px tall; Lily measures nothing. `aria-rowcount` and every row's `aria-rowindex` are always set,
   * so assistive technology still sees the whole grid.
   */
  virtualize?: { rowHeight: number; height: number; overscan?: number };
  /** Extra CSS class on the root. */
  className?: string;
};

/** What counts as a widget inside a cell: something a person can operate. */
const WIDGET_SELECTOR =
  'a[href], button, input, select, textarea, summary, [contenteditable="true"]';

const MIN_COLUMN_WIDTH = 40;
const RESIZE_STEP = 16;

const DEFAULT_SORT: DataGridSort = { columnId: "", direction: "none" };
const NO_ROWS: string[] = [];

/** Default cell value reader: `row[column.id]`. */
function defaultAccessor(column: DataGridColumn, row: DataGridRow): unknown {
  return column.accessor ? column.accessor(row) : row[column.id];
}

/** Default cell formatter: `String(value)`, `""` for null/undefined. */
/** A missing value: `null`, `undefined` or an empty string. */
const isMissing = (value: unknown): boolean => value === null || value === undefined || value === "";

function formatCell(column: DataGridColumn, row: DataGridRow): string {
  const value = defaultAccessor(column, row);
  if (column.format) return column.format(value, row);
  return value === null || value === undefined ? "" : String(value);
}

/** A value the consumer may control (`value` supplied) or leave to the component (`defaultValue`). */
const NO_SORTS: DataGridSort[] = [];

function useControllable<T>(value: T | undefined, defaultValue: T): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  return [value !== undefined ? value : internal, setInternal];
}

type Entry = { row: DataGridRow; id: string };

export function DataGrid({
  className = "",
  label,
  caption,
  columns: columnsProp,
  rows,
  locale,
  emptyValue,
  nulls = "last",
  warnMissingLabels = true,
  movableColumns = false,
  filterField: filterFieldProp,
  defaultFilterField = "",
  onFilterFieldChange,
  rowId = (_row: DataGridRow, index: number) => String(index),
  selectionMode = "none",
  selected: selectedProp,
  defaultSelected = NO_ROWS,
  onSelectionChange,
  filter: filterProp,
  defaultFilter = "",
  onFilterChange,
  rowFilter,
  thenBy: thenByProp,
  defaultThenBy = NO_SORTS,
  onThenByChange,
  sort: sortProp,
  defaultSort = DEFAULT_SORT,
  onSortChange,
  columnOrder: columnOrderProp,
  defaultColumnOrder,
  onColumnOrderChange,
  pageSize,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  storageKey,
  labels = {},
  mode = "grid",
  rowClass,
  rowAttrs,
  onRowActivate,
  empty,
  footer,
  busy = false,
  scroll = true,
  onCellEdit,
  onFilesSelected,
  onFileRemove,
  virtualize,
  exportFilename: exportBase = "data-grid",
  exportScope = "view",
  exportFormulas = false,
  onExport,
  onCopy,
  ...restProps
}: Props): React.ReactElement {
  // Each column with its type's defaults filled in under its own props.
  const columns = React.useMemo(() => columnsProp.map((c) => resolveColumn(c, locale, rows)), [columnsProp, locale, rows]);

  const gridId = React.useId();

  const isGrid = mode === "grid";

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [hiddenColumnIds, setHiddenColumnIds] = React.useState<Set<string>>(() => new Set());
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [focusedRow, setFocusedRow] = React.useState(-1); // -1 = header row
  const [focusedCol, setFocusedCol] = React.useState(0);
  const lastSelectedIndexRef = React.useRef(-1); // index into sortedEntries, not into the page
  const pendingFocusRef = React.useRef(false);

  const [selected, setSelectedState] = useControllable(selectedProp, defaultSelected);
  const [filter, setFilterState] = useControllable(filterProp, defaultFilter);
  const [filterField, setFilterFieldState] = useControllable(filterFieldProp, defaultFilterField);
  const [sort, setSortState] = useControllable(sortProp, defaultSort);
  const [thenBy, setThenByState] = useControllable(thenByProp, defaultThenBy);
  const [page, setPageState] = useControllable(pageProp, defaultPage);

  const hasSelection = selectionMode !== "none";
  // What the grid renders, as far as labels go, so a missing one can be named in development.
  const labelFeatures: LabelFeatures = {
    selection: selectionMode !== "none",
    pagination: !!pageSize,
    hidableColumns: columns.some((c) => c.hidable),
    resizableColumns: columns.some((c) => c.resizable),
    editing: !!onCellEdit,
    sorting: columns.some((c) => c.sortable),
    search: !!labels.search,
    exporting: !!(labels.exportCsv || labels.exportTsv || labels.exportExcel || labels.copy),
  };
  const reportedLabels = React.useRef(new Set<string>());
  React.useEffect(() => {
    const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
    if (!warnMissingLabels || env?.NODE_ENV === "production") return;
    const fresh = missingLabels(labelFeatures, labels as Record<string, unknown>).filter((m) => !reportedLabels.current.has(m.key));
    if (fresh.length === 0) return;
    for (const m of fresh) reportedLabels.current.add(m.key);
    const controls = fresh.filter((m) => m.kind === "control").map((m) => m.key);
    const announcements = fresh.filter((m) => m.kind === "announcement").map((m) => m.key);
    console.warn(
      `[data-grid] "${label}": labels left out — ` +
        [controls.length ? `controls with no name: ${controls.join(", ")}` : "", announcements.length ? `silent announcements: ${announcements.join(", ")}` : ""]
          .filter(Boolean)
          .join("; "),
    );
  });

  const colOffset = hasSelection ? 1 : 0;

  const [columnOrder, setColumnOrderState] = useControllable<string[]>(columnOrderProp, defaultColumnOrder ?? []);
  // Columns in display order: those named in `columnOrder` first, the rest after in their own order.
  const orderedColumns = React.useMemo(() => {
    if (columnOrder.length === 0) return columns;
    const rank = (id: string) => {
      const i = columnOrder.indexOf(id);
      return i === -1 ? columnOrder.length : i;
    };
    return columns
      .map((c, i) => ({ c, i }))
      .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
      .map((x) => x.c);
  }, [columns, columnOrder]);
  const visibleColumns = React.useMemo(
    () => orderedColumns.filter((c) => !hiddenColumnIds.has(c.id)),
    [orderedColumns, hiddenColumnIds],
  );
  /** A column the user can move: its own `movable`, else the grid's `movableColumns`. */
  const isMovable = (column: DataGridColumn): boolean => column.movable ?? movableColumns;

  const hidableColumns = React.useMemo(() => columns.filter((c) => c.hidable), [columns]);

  // Each row's id is derived once, from its position in `rows`, so it
  // survives sorting, filtering and paging (spec/index.md §6 "Row identity").
  // `rowId` is read at call time, so an inline arrow does not defeat the memo.
  const rowIdRef = React.useRef(rowId);
  rowIdRef.current = rowId;
  const entries = React.useMemo<Entry[]>(
    () => rows.map((row, index) => ({ row, id: rowIdRef.current(row, index) })),
    [rows],
  );

  // Each cell's value and formatted text, read once per row object and column
  // (React re-renders every cell on every state change; the accessor and
  // formatter are the consumer's code and may be costly). Reset when `columns`
  // changes, so a new accessor or formatter is picked up.
  const cellCache = React.useMemo(
    () => new WeakMap<DataGridRow, Map<string, DataGridCellContext>>(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns],
  );
  function cellFor(column: DataGridColumn, row: DataGridRow): DataGridCellContext {
    let perRow = cellCache.get(row);
    if (!perRow) {
      perRow = new Map();
      cellCache.set(row, perRow);
    }
    let ctx = perRow.get(column.id);
    if (!ctx) {
      ctx = { value: defaultAccessor(column, row), formatted: formatCell(column, row), row, column };
      perRow.set(column.id, ctx);
    }
    return ctx;
  }

  // One folded (lower-case, no diacritics) text per filterable cell, built once per rows/columns change
  // rather than reformatting every cell on every keystroke. Read only when a filter is active.
  const filterableColumns = React.useMemo(() => columns.filter((c) => c.filterable !== false), [columns]);
  const searchIndexRef = React.useRef<{ key: unknown[]; index: string[][] } | null>(null);
  function searchIndex(): string[][] {
    const cached = searchIndexRef.current;
    if (cached && cached.key[0] === entries && cached.key[1] === columns) return cached.index;
    const index = entries.map((entry) =>
      filterableColumns.map((column) =>
        foldText(
          column.filterText
            ? column.filterText(defaultAccessor(column, entry.row), entry.row)
            : cellFor(column, entry.row).formatted,
        ),
      ),
    );
    searchIndexRef.current = { key: [entries, columns], index };
    return index;
  }

  // Every word of the filter must appear somewhere in the row (any order, any cells), ignoring case and diacritics.
  // With a field chosen, every word must be in that field's cell.
  function filterEntries(text: string, field: string = filterField): Entry[] {
    const terms = searchTerms(text);
    if (terms.length === 0 && !rowFilter) return entries;
    const index = terms.length > 0 ? searchIndex() : null;
    const only = field ? filterableColumns.findIndex((c) => c.id === field) : -1;
    const rowText = (i: number): string => (only >= 0 ? index![i][only] : index![i].join(" "));
    return entries.filter(
      (entry, i) => (!rowFilter || rowFilter(entry.row)) && (!index || terms.every((term) => rowText(i).includes(term))),
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredEntries = React.useMemo(() => filterEntries(filter), [entries, columns, filter, filterField, rowFilter]);

  /** The sort keys in order: the primary, then `thenBy`, each with a real column and a direction. */
  const sortKeys = React.useMemo(
    () =>
      [sort, ...thenBy]
        .map((k) => ({
          column: columns.find((c) => c.id === k.columnId),
          dir: k.direction === "ascending" ? 1 : k.direction === "descending" ? -1 : 0,
        }))
        .filter((k): k is { column: DataGridColumn; dir: 1 | -1 } => !!k.column && k.dir !== 0),
    [sort, thenBy, columns],
  );

  const sortedEntries = React.useMemo(() => {
    if (sortKeys.length === 0) return filteredEntries;
    // Read each sort key once per column (n accessor calls), not twice per comparison.
    const collators = sortKeys.map((k) => {
      const tag = k.column.locale ?? locale;
      return tag ? new Intl.Collator(tag, { numeric: true }) : null;
    });
    const keyed = filteredEntries.map((entry) => ({ entry, keys: sortKeys.map((k) => cellFor(k.column, entry.row).value) }));
    keyed.sort((a, b) => {
      for (let i = 0; i < sortKeys.length; i++) {
        const { column, dir } = sortKeys[i];
        const av = a.keys[i];
        const bv = b.keys[i];
        if (av === bv) continue;
        // Missing values sort together at one end, in both directions (`nulls`).
        const aMissing = av === null || av === undefined;
        const bMissing = bv === null || bv === undefined;
        if (aMissing || bMissing) return aMissing === bMissing ? 0 : (aMissing ? 1 : -1) * (nulls === "first" ? -1 : 1);
        const collator = collators[i];
        const result = column.compare
          ? column.compare(av, bv) * dir
          : collator && typeof av === "string" && typeof bv === "string"
            ? collator.compare(av, bv) * dir
            : (av as never) > (bv as never)
              ? dir
              : -dir;
        if (result !== 0) return result;
      }
      return 0;
    });
    return keyed.map((k) => k.entry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEntries, sortKeys, nulls, locale]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sortedEntries.length / pageSize)) : 1;
  const clampedPage = Math.min(Math.max(page, 1), pageCount);
  const pageStart = pageSize ? (clampedPage - 1) * pageSize : 0;
  const pageEntries = React.useMemo(
    () => (pageSize ? sortedEntries.slice(pageStart, pageStart + pageSize) : sortedEntries),
    [sortedEntries, pageSize, pageStart],
  );

  const lastCol = colOffset + visibleColumns.length - 1;

  // The roving position clamped to the cells that exist now. Filtering,
  // paging, or hiding a column can remove the cell focusedRow/focusedCol
  // name; without the clamp no cell would be tabbable and the grid would
  // drop out of the tab order (spec/index.md §8.20).
  const activeRow = Math.max(-1, Math.min(focusedRow, pageEntries.length - 1));
  const activeCol = Math.max(0, Math.min(focusedCol, lastCol));

  // Row position for assistive technology, only when pagination means the
  // DOM holds a subset of the rows (spec/index.md §8.21). Header row is 1.
  const rowCount = pageSize ? sortedEntries.length + 1 : virtualize ? pageEntries.length + 1 : undefined;
  const indexed = !!pageSize || !!virtualize;

  // ---- Windowing (virtualize): only the rows in view, plus the roving tab stop's row ----
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  type RenderItem = { kind: "row"; index: number } | { kind: "spacer"; rows: number; key: string };
  const renderItems: RenderItem[] = (() => {
    const total = pageEntries.length;
    if (!virtualize) return pageEntries.map((_, index) => ({ kind: "row", index }) as RenderItem);
    const overscan = virtualize.overscan ?? 3;
    const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
    const end = Math.min(total, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    if (activeRow >= 0 && activeRow < total) indices.add(activeRow);
    const items: RenderItem[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
      if (index - previous > 1) items.push({ kind: "spacer", rows: index - previous - 1, key: `spacer-${previous}` });
      items.push({ kind: "row", index });
      previous = index;
    }
    if (total - 1 - previous > 0) items.push({ kind: "spacer", rows: total - 1 - previous, key: `spacer-${previous}` });
    return items;
  })();

  /** Bring a body row into the scroll region. */
  function revealRow(index: number): void {
    if (!virtualize || index < 0) return;
    const top = index * virtualize.rowHeight;
    let next = scrollTop;
    if (top < scrollTop) next = top;
    else if (top + virtualize.rowHeight > scrollTop + virtualize.height) next = top + virtualize.rowHeight - virtualize.height;
    if (next === scrollTop) return;
    setScrollTop(next);
    if (scrollRef.current) scrollRef.current.scrollTop = next;
  }

  // O(1) membership instead of `selected.includes` per row.
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const allSelected =
    sortedEntries.length > 0 && sortedEntries.every((entry) => selectedSet.has(entry.id));
  const someSelected = !allSelected && sortedEntries.some((entry) => selectedSet.has(entry.id));

  function announce(message: string | undefined): void {
    if (message) setStatusMessage(message);
  }

  function setSort(next: DataGridSort): void {
    setSortState(next);
    onSortChange?.(next);
  }

  function setPage(next: number): void {
    setPageState(next);
    onPageChange?.(next);
  }

  // ---------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------

  function ariaSortFor(column: DataGridColumn): DataGridSortDirection | undefined {
    if (!column.sortable) return undefined;
    if (sort.columnId === column.id) return sort.direction;
    return thenBy.find((k) => k.columnId === column.id)?.direction ?? "none";
  }

  /** 1 for the primary key, 2… for `thenBy`, only while more than one key is in force. */
  function sortOrderFor(column: DataGridColumn): number | undefined {
    if (sortKeys.length < 2) return undefined;
    const at = sortKeys.findIndex((k) => k.column.id === column.id);
    return at === -1 ? undefined : at + 1;
  }

  function setThenBy(next: DataGridSort[]): void {
    setThenByState(next);
    onThenByChange?.(next);
  }

  function toggleSort(column: DataGridColumn, additive = false): void {
    if (!column.sortable) return;
    if (additive && sort.direction !== "none" && sort.columnId && sort.columnId !== column.id) {
      const current = thenBy.find((k) => k.columnId === column.id);
      const nextThen: DataGridSort[] = !current
        ? [...thenBy, { columnId: column.id, direction: "ascending" }]
        : current.direction === "ascending"
          ? thenBy.map((k) => (k.columnId === column.id ? { columnId: column.id, direction: "descending" as const } : k))
          : thenBy.filter((k) => k.columnId !== column.id);
      setThenBy(nextThen);
      announce(labels.sortAnnouncement?.(column.header, nextThen.find((k) => k.columnId === column.id)?.direction ?? "none"));
      return;
    }
    if (thenBy.length > 0) setThenBy([]);
    const next: DataGridSort =
      sort.columnId !== column.id
        ? { columnId: column.id, direction: "ascending" }
        : sort.direction === "ascending"
          ? { columnId: column.id, direction: "descending" }
          : sort.direction === "descending"
            ? { columnId: "", direction: "none" }
            : { columnId: column.id, direction: "ascending" };
    setSort(next);
    announce(labels.sortAnnouncement?.(column.header, next.direction));
  }

  // ---------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------

  function onFilterFieldChangeEvent(event: React.ChangeEvent<HTMLSelectElement>): void {
    const next = event.target.value;
    setFilterFieldState(next);
    setPage(1);
    onFilterFieldChange?.(next);
    announce(labels.filterAnnouncement?.(filterEntries(filter, next).length, rows.length));
  }

  function setFilter(next: string): void {
    setFilterState(next);
    setPage(1);
    onFilterChange?.(next);
    announce(labels.filterAnnouncement?.(filterEntries(next).length, rows.length));
  }

  function onFilterInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setFilter(event.target.value);
  }

  /** Escape in the search field clears it. */
  function onFilterKeydown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape" && filter !== "") {
      event.preventDefault();
      setFilter("");
    }
  }

  // ---------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------

  function isSelected(id: string): boolean {
    return selectedSet.has(id);
  }

  function setSelected(next: string[]): void {
    setSelectedState(next);
    onSelectionChange?.(next);
    announce(labels.selectionAnnouncement?.(next.length));
  }

  /** `index` is the row's position in `sortedEntries`, not on the current page. */
  function toggleRow(
    index: number,
    event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean },
  ): void {
    const id = sortedEntries[index].id;
    const lastSelectedIndex = lastSelectedIndexRef.current;
    if (selectionMode === "single") {
      setSelected(isSelected(id) ? [] : [id]);
    } else if (selectionMode === "multiple") {
      if (event?.shiftKey && lastSelectedIndex >= 0) {
        const [start, end] =
          lastSelectedIndex < index ? [lastSelectedIndex, index] : [index, lastSelectedIndex];
        const range = sortedEntries.slice(start, end + 1).map((entry) => entry.id);
        setSelected([...new Set([...selected, ...range])]);
      } else if (event?.ctrlKey || event?.metaKey) {
        setSelected(isSelected(id) ? selected.filter((x) => x !== id) : [...selected, id]);
      } else {
        setSelected(isSelected(id) && selected.length === 1 ? [] : [id]);
      }
    }
    lastSelectedIndexRef.current = index;
  }

  function toggleSelectAll(): void {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(sortedEntries.map((entry) => entry.id));
    }
  }

  // ---------------------------------------------------------------
  // Column resize
  // ---------------------------------------------------------------

  function widthFor(column: DataGridColumn): number | undefined {
    return columnWidths[column.id] ?? column.width;
  }

  /** Inline style of a column's cells: its width, and its alignment where one is set. */
  function cellStyle(column: DataGridColumn): React.CSSProperties | undefined {
    const style: Record<string, string> = {};
    const width = widthFor(column);
    if (width) style.width = `${width}px`;
    if (column.align) style.textAlign = column.align;
    return Object.keys(style).length > 0 ? (style as React.CSSProperties) : undefined;
  }

  function setWidth(column: DataGridColumn, width: number): void {
    setColumnWidths((current) => ({ ...current, [column.id]: Math.max(MIN_COLUMN_WIDTH, width) }));
  }

  function onResizeKeydown(column: DataGridColumn, event: React.KeyboardEvent): void {
    // The resize handle is its own tab stop outside the grid's
    // roving-tabindex system (see spec/index.md §6) — every key here
    // must stop, or it bubbles into onGridKeydown and moves grid focus
    // out from under the handle the user is actually operating.
    event.stopPropagation();
    const current = widthFor(column) ?? 120;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setWidth(column, current + RESIZE_STEP);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setWidth(column, current - RESIZE_STEP);
    }
  }

  function onResizePointerDown(column: DataGridColumn, event: React.PointerEvent): void {
    event.preventDefault();
    const startX = event.clientX;
    const target = event.target as HTMLElement;
    const startWidth =
      widthFor(column) ?? target.closest("th")?.getBoundingClientRect().width ?? 120;
    target.setPointerCapture?.(event.pointerId);

    function onMove(moveEvent: PointerEvent): void {
      setWidth(column, startWidth + (moveEvent.clientX - startX));
    }
    function onUp(): void {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // ---------------------------------------------------------------
  // Column visibility
  // ---------------------------------------------------------------

  function toggleColumnVisibility(columnId: string): void {
    setHiddenColumnIds((current) => {
      const next = new Set(current);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }

  // ---------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------

  function goToPage(next: number): void {
    const target = Math.min(Math.max(next, 1), pageCount);
    if (target === clampedPage) return;
    setPage(target);
    announce(labels.pageAnnouncement?.(target, pageCount));
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  // Focus is moved after the commit that makes the target cell the tab stop,
  // and only after a user action — mounting the grid never takes focus.
  React.useEffect(() => {
    if (!pendingFocusRef.current) return;
    pendingFocusRef.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]')
      ?.focus({ preventScroll: true });
  });

  /** Move `columnId` to sit at `toVisibleIndex` among the visible columns. Returns whether it moved. */
  function moveColumn(columnId: string, toVisibleIndex: number): boolean {
    const ids = visibleColumns.map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toVisibleIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
    let next = 0;
    const order = orderedColumns.map((c) => (ids.includes(c.id) ? ids[next++] : c.id));
    setColumnOrderState(order);
    onColumnOrderChange?.(order);
    const column = columns.find((c) => c.id === columnId)!;
    announce(labels.columnMoveAnnouncement?.(column.header, to + 1, ids.length));
    return true;
  }

  const draggingColumnId = React.useRef<string | null>(null);

  function onHeaderDrop(targetId: string, event: React.DragEvent): void {
    event.preventDefault();
    const id = draggingColumnId.current;
    draggingColumnId.current = null;
    if (!id || id === targetId) return;
    const to = visibleColumns.findIndex((c) => c.id === targetId);
    if (to >= 0) moveColumn(id, to);
  }

  function moveFocus(row: number, col: number): void {
    const nextRow = Math.min(Math.max(row, -1), pageEntries.length - 1);
    setFocusedRow(nextRow);
    setFocusedCol(Math.min(Math.max(col, 0), lastCol));
    revealRow(nextRow);
    pendingFocusRef.current = true;
  }

  // ---------------------------------------------------------------
  // Export (CSV / TSV / Excel)
  // ---------------------------------------------------------------

  const exportColumns = visibleColumns.filter((c) => c.exportable !== false);
  const exportEntries = exportScope === "selected" ? sortedEntries.filter((entry) => selectedSet.has(entry.id)) : sortedEntries;
  const hasExportButtons = !!(labels.exportCsv || labels.exportTsv || labels.exportExcel || labels.copy);

  /** One cell for an export: typed values stay typed, everything else is the text the grid shows. */
  function exportCell(column: DataGridColumn, row: DataGridRow): unknown {
    if (column.exportValue) return column.exportValue(row);
    const value = defaultAccessor(column, row);
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
    return formatCell(column, row);
  }

  /** The extra column a `time-zone` column asks for: its UTC time of day at the reference date. */
  const hasUtcColumn = (c: DataGridColumn) => c.type === "time-zone" && !!c.exportUtc && !!c.referenceDate && !!labels.exportUtcHeader;

  function buildExportTable(format: ExportFormat) {
    const live = (c: DataGridColumn) => format === "xlsx" && exportFormulas && c.type === "formula" && !!c.source;
    const headers: string[] = [];
    for (const c of exportColumns) {
      headers.push(c.header);
      if (hasUtcColumn(c)) headers.push(labels.exportUtcHeader!(c.header));
    }
    const exportRows = exportEntries.map((entry) => {
      const cells: unknown[] = [];
      for (const c of exportColumns) {
        const expression = live(c) ? c.source!(entry.row) : undefined;
        cells.push(
          typeof expression === "string" && expression !== "" && !c.errorOf?.(entry.row)
            ? { formula: expression, result: exportCell(c, entry.row) }
            : exportCell(c, entry.row),
        );
        if (hasUtcColumn(c)) cells.push(zonedUtcTime(defaultAccessor(c, entry.row), c.referenceDate));
      }
      return cells;
    });
    return { headers, rows: exportRows };
  }

  /** Copy the export (what a download would hold) to the clipboard as tab-separated text. `onCopy` may return false to take over. */
  async function runCopy(): Promise<void> {
    const table = buildExportTable("tsv");
    const text = toClipboardText(table);
    if (onCopy?.({ text, rowCount: table.rows.length }) === false) return;
    const ok = await copyToClipboard(text);
    announce(ok ? labels.copyAnnouncement?.(table.rows.length) : labels.copyFailed);
  }

  function runExport(format: ExportFormat): void {
    const table = buildExportTable(format);
    const filename = exportFilename(exportBase, format);
    const blob = exportBlob(table, format, { sheetName: exportBase });
    const count = table.rows.length;
    if (onExport?.({ format, filename, rowCount: count, blob }) === false) return;
    downloadBlob(blob, filename);
    announce(labels.exportAnnouncement?.(format, count, filename));
  }

  // ---------------------------------------------------------------
  // Cell editing
  // ---------------------------------------------------------------

  type Editing = { rowId: string; columnId: string; draft: string; zone?: string; error?: string; invalid?: boolean };

  /** A cell the person can edit through the grid's edit model (not a rollup, a file cell with its own widgets, or a person cell with no editor). */
  function isEditable(column: DataGridColumn): boolean {
    if (!column.editable) return false;
    if (column.type === "rollup" || column.type === "file") return false;
    if (column.type === "person" && !column.personEditor) return false;
    return true;
  }
  const [editing, setEditingState] = React.useState<Editing | null>(null);
  // Mirrors `editing` synchronously, so a blur that follows a commit in the same tick sees it already closed.
  const editingRef = React.useRef<Editing | null>(null);
  function setEditing(next: Editing | null): void {
    editingRef.current = next;
    setEditingState(next);
  }

  function startEdit(entry: Entry, column: DataGridColumn): void {
    if (!isEditable(column)) return;
    // A formula's editor shows the expression the row holds, not the result.
    const raw = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    if (column.type === "time-zone") {
      const zoned = isZonedTime(raw) ? raw : null;
      setEditing({ rowId: entry.id, columnId: column.id, draft: zoned?.time ?? "", zone: zoned?.timeZone ?? column.timeZones?.[0]?.id ?? "" });
      return;
    }
    const text = column.type === "link" ? (linkParts(raw)?.href ?? "") : raw === null || raw === undefined ? "" : String(raw);
    setEditing({ rowId: entry.id, columnId: column.id, draft: text });
  }

  function parseDraft(column: DataGridColumn, row: DataGridRow, draft: string, zone?: string): unknown {
    if (column.parse) return column.parse(draft, row);
    if (column.type === "time-zone") return draft === "" ? null : { time: draft, timeZone: zone ?? "" };
    if (column.editor === "number") return draft.trim() === "" ? null : Number(draft);
    if (column.editor === "date" || column.editor === "time" || column.editor === "select") return draft === "" ? null : draft;
    return draft;
  }

  /** Accepted cell edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `onCellEdit` like any edit. */
  const historyRef = React.useRef<EditHistory>(EMPTY_HISTORY);

  /** Put an earlier cell value back, or re-apply it, through `onCellEdit`. */
  function stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(historyRef.current) : redoEdit(historyRef.current);
    if (!step.record) return;
    historyRef.current = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const entry = entries.find((e) => e.id === ownerId);
    const column = columns.find((c) => c.id === fieldId);
    if (!entry || !column) return;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    onCellEdit?.({ rowId: entry.id, row: entry.row, columnId: column.id, value: restored, previous: replaced });
    const text = column.format ? column.format(restored, entry.row) : String(restored ?? "");
    announce((direction === "undo" ? labels.undoAnnouncement : labels.redoAnnouncement)?.(column.header, text));
  }

  /** Two link values with the same address and label are the same edit. */
  function isStructurallyEqual(a: unknown, b: unknown): boolean {
    return typeof a === "object" && typeof b === "object" && a !== null && b !== null && JSON.stringify(a) === JSON.stringify(b);
  }

  /** Validate and report one new value for a cell. Returns false (and keeps editing, if the editor is open) when it is refused. */
  function commitValue(entry: Entry, column: DataGridColumn, value: unknown): boolean {
    const message = column.validate?.(value, entry.row);
    const invalidType = isInvalidForType(column, value);
    if (message || invalidType) {
      const text = message ?? labels.invalidValue?.(column.header, column.type ?? "") ?? "";
      const current = editingRef.current;
      if (current) setEditing({ ...current, error: text || undefined, invalid: true });
      announce(labels.editError?.(column.header, text));
      return false;
    }
    const previous = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    setEditing(null);
    if (value !== previous && !isStructurallyEqual(value, previous)) {
      historyRef.current = recordEdit(historyRef.current, { ownerId: entry.id, fieldId: column.id, value, previous });
      onCellEdit?.({ rowId: entry.id, row: entry.row, columnId: column.id, value, previous });
      announce(labels.editAnnouncement?.(column.header, column.format ? column.format(value, entry.row) : String(value ?? "")));
    }
    return true;
  }

  function commitEdit(): void {
    const current = editingRef.current;
    if (!current) return;
    const entry = entries.find((e) => e.id === current.rowId);
    const column = columns.find((c) => c.id === current.columnId);
    if (!entry || !column) {
      setEditing(null);
      return;
    }
    if (commitValue(entry, column, parseDraft(column, entry.row, current.draft, current.zone))) pendingFocusRef.current = true;
  }

  function cancelEdit(): void {
    const current = editingRef.current;
    if (!current) return;
    setEditing(null);
    const column = columns.find((c) => c.id === current.columnId);
    if (column) announce(labels.editCancelAnnouncement?.(column.header));
    pendingFocusRef.current = true;
  }

  function onEditorKeydown(event: React.KeyboardEvent): void {
    // The editor owns its keys; none may reach the grid's own handler.
    event.stopPropagation();
    // While an input method is composing (a candidate list is open), Enter picks the candidate and
    // Escape cancels the composition: neither commits nor cancels the edit. Some browsers report
    // the confirming Enter with `isComposing` already false, but keyCode 229.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  }

  function setDraft(draft: string): void {
    const current = editingRef.current;
    if (current) setEditing({ ...current, draft, error: undefined, invalid: false });
  }

  /** Focus and select the editor's text as it appears (a stable callback ref: it runs on mount only). */
  const focusEditor = React.useCallback((node: HTMLInputElement | HTMLSelectElement | null) => {
    if (!node) return;
    node.focus();
    if (node instanceof HTMLInputElement && node.type === "text") node.select();
  }, []);

  function activateFocusedCell(): void {
    if (activeCol === 0 && hasSelection) {
      if (activeRow === -1) {
        if (selectionMode === "multiple") toggleSelectAll();
      } else {
        toggleRow(pageStart + activeRow);
      }
      return;
    }
    const column = visibleColumns[activeCol - colOffset];
    if (!column) return;
    if (activeRow === -1) {
      toggleSort(column);
    }
  }

  // ---------------------------------------------------------------
  // Widgets inside cells (APG grid: interactive cell contents)
  // ---------------------------------------------------------------

  /** The widgets a consumer put in a body cell (never the grid's own controls). */
  function widgetsIn(cell: Element): HTMLElement[] {
    return Array.from(cell.querySelectorAll<HTMLElement>(WIDGET_SELECTOR)).filter(
      (el) => !el.closest("[data-grid-own]"),
    );
  }

  function setWidgetTabindex(cell: Element, value: "0" | "-1"): void {
    for (const widget of widgetsIn(cell)) widget.setAttribute("tabindex", value);
  }

  // Widgets in body cells are not tab stops, so Tab leaves the grid in one step.
  // Re-run whenever what is on screen could have changed.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !isGrid) return;
    for (const cell of root.querySelectorAll(".data-table-body [data-row][data-col]")) {
      if (cell.getAttribute("data-grid-entered") === "true") continue;
      setWidgetTabindex(cell, "-1");
    }
  }, [pageEntries, visibleColumns, isGrid, scrollTop]);

  /** Focus the first widget of a cell; its widgets are tab stops while focus stays inside it. */
  function enterCell(cell: HTMLElement): boolean {
    const first = widgetsIn(cell)[0];
    if (!first) return false;
    cell.setAttribute("data-grid-entered", "true");
    setWidgetTabindex(cell, "0");
    first.focus();
    return true;
  }

  function leaveCell(cell: Element): void {
    if (cell.getAttribute("data-grid-entered") !== "true") return;
    cell.removeAttribute("data-grid-entered");
    setWidgetTabindex(cell, "-1");
  }

  /** Pointer or programmatic focus on a cell moves the roving position to it. */
  function onGridFocus(event: React.FocusEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    setFocusedRow(Number(cell.dataset.row));
    setFocusedCol(Number(cell.dataset.col));
    // Focus arriving on a widget (a click, or Tab inside the cell) makes the cell's widgets tab stops.
    if (target !== cell && !target.closest("[data-grid-own]") && cell.closest(".data-table-body")) {
      cell.setAttribute("data-grid-entered", "true");
      setWidgetTabindex(cell, "0");
    }
  }

  function onGridBlur(event: React.FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const next = event.relatedTarget as Node | null;
    if (next && cell.contains(next)) return;
    leaveCell(cell);
  }

  /** A click on a body cell, outside any widget, activates its row. */
  function onGridClick(event: React.MouseEvent): void {
    if (!onRowActivate) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head")) return;
    if (target.closest(WIDGET_SELECTOR) || target.closest("[data-grid-own]")) return;
    const entry = pageEntries[Number(cell.dataset.row)];
    if (entry) onRowActivate(entry.row, entry.id);
  }

  /** A double click on an editable body cell starts editing it. */
  function onGridDoubleClick(event: React.MouseEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head") || target.closest("input, button, select, textarea")) return;
    const entry = pageEntries[Number(cell.dataset.row)];
    const column = visibleColumns[Number(cell.dataset.col) - colOffset];
    if (entry && column && isEditable(column)) startEdit(entry, column);
  }

  const TYPEAHEAD_WINDOW_MS = 700;
  const typeaheadRef = React.useRef<TypeaheadState>({ prefix: "", at: 0 });

  function onGridKeydown(event: React.KeyboardEvent): void {
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
    // In a right-to-left layout the horizontal arrows swap: ArrowLeft goes to the next cell (`key` is the logical key).
    const key = logicalKey(event.key, isRtl(cell));
    if (event.altKey && activeRow === -1 && (key === "ArrowRight" || key === "ArrowLeft")) {
      const column = visibleColumns[activeCol - colOffset];
      if (column && isMovable(column)) {
        event.preventDefault();
        const delta = key === "ArrowRight" ? 1 : -1;
        if (moveColumn(column.id, activeCol - colOffset + delta)) moveFocus(-1, activeCol + delta);
        return;
      }
    }
    const historyAction = onCellEdit && target === cell ? historyKey(event) : null;
    if (historyAction) {
      event.preventDefault();
      stepHistory(historyAction);
      return;
    }
    // Type-ahead in the focused column: letters typed in quick succession move to the next row whose cell text starts with them.
    if (isTypeaheadKey(event) && target === cell && activeRow >= 0) {
      const column = visibleColumns[activeCol - colOffset];
      if (column) {
        const state = nextTypeaheadState(typeaheadRef.current, event.key, Date.now(), TYPEAHEAD_WINDOW_MS);
        const hit = findTypeaheadMatch(pageEntries.map((entry) => formatCell(column, entry.row)), activeRow, state.prefix);
        if (hit !== -1) {
          typeaheadRef.current = state;
          event.preventDefault();
          moveFocus(hit, activeCol);
          return;
        }
      }
    }
    const move = gridMove(
      event,
      { row: activeRow, col: activeCol },
      { firstRow: -1, lastRow: pageEntries.length - 1, lastCol, pageStep: pageSize ?? 10, rtl: isRtl(cell) },
    );
    if (move) {
      event.preventDefault();
      moveFocus(move.row, move.col);
      return;
    }
    switch (key) {
      case "F2": {
        const entry = pageEntries[Number(cell.dataset.row)];
        const column = visibleColumns[Number(cell.dataset.col) - colOffset];
        if (target === cell && entry && column && isEditable(column)) {
          event.preventDefault();
          startEdit(entry, column);
        }
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (event.key === "Enter" && target === cell && cell.closest(".data-table-body")) {
          const entry = pageEntries[Number(cell.dataset.row)];
          const column = visibleColumns[Number(cell.dataset.col) - colOffset];
          if (entry && column && isEditable(column)) {
            startEdit(entry, column);
            break;
          }
        }
        if (target === cell && cell.closest(".data-table-body") && !cell.querySelector("[data-grid-own]")) {
          // A cell with a widget in it is entered; one without activates its row.
          if (enterCell(cell)) break;
          if (event.key === "Enter" && onRowActivate) {
            const entry = pageEntries[Number(cell.dataset.row)];
            if (entry) onRowActivate(entry.row, entry.id);
            break;
          }
        }
        activateFocusedCell();
        break;
    }
  }

  // ---------------------------------------------------------------
  // Persistence (view state only: widths, hidden columns, sort — never rows/selection)
  // ---------------------------------------------------------------

  // Restoring and writing are separate steps: the first commit must not overwrite
  // what is stored with the defaults before the stored view has been applied.
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as {
          columnWidths?: Record<string, number>;
          hiddenColumnIds?: string[];
          sort?: DataGridSort;
        };
        if (saved.columnWidths) setColumnWidths(saved.columnWidths);
        if (saved.hiddenColumnIds) setHiddenColumnIds(new Set(saved.hiddenColumnIds));
        if (saved.sort) setSort(saved.sort);
      }
    } catch {
      // ignore quota / privacy / parse errors
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  React.useEffect(() => {
    if (!storageKey || !hydrated || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ columnWidths, hiddenColumnIds: [...hiddenColumnIds], sort }),
      );
    } catch {
      // ignore quota / privacy errors
    }
  }, [storageKey, hydrated, columnWidths, hiddenColumnIds, sort]);

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------

  /** A link value: an `<a>` only for a safe scheme, text otherwise. */
  function linkBody(ctx: DataGridCellContext): React.ReactNode {
    const link = linkParts(ctx.value);
    if (!link) return null;
    const href = safeHref(link.href);
    if (!href) {
      // An address with an unsafe scheme is shown as text, never as a link.
      return <span className="data-grid-link data-grid-link-unsafe">{link.label ?? link.href}</span>;
    }
    return (
      <a
        className="data-grid-link"
        href={href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
      >
        {link.label ?? link.href}
        {link.external && labels.opensInNewTab && (
          <>
            {" "}
            <span className="data-grid-visually-hidden">{labels.opensInNewTab(link.label ?? link.href)}</span>
          </>
        )}
      </a>
    );
  }

  function personBody(column: DataGridColumn, ctx: DataGridCellContext): React.ReactNode {
    const people = peopleOf(ctx.value);
    if (people.length === 0) return null;
    const shown = column.maxPeople !== undefined ? people.slice(0, Math.max(0, column.maxPeople)) : people;
    return (
      <ul className="data-grid-people">
        {shown.map((person) => (
          <li key={person.id} className="data-grid-person">
            {column.avatar && (
              <span className="data-grid-avatar" aria-hidden="true">
                {column.avatar({ person })}
              </span>
            )}
            <span className="data-grid-person-name">{personName(person)}</span>
          </li>
        ))}
        {shown.length < people.length && labels.morePeople && (
          <li className="data-grid-people-more">{labels.morePeople(people.length - shown.length)}</li>
        )}
      </ul>
    );
  }

  function fileBody(entry: Entry, column: DataGridColumn, ctx: DataGridCellContext): React.ReactNode {
    const files = filesOf(ctx.value);
    const rowLabel = visibleColumns[0] ? cellFor(visibleColumns[0], entry.row).formatted : entry.id;
    return (
      <>
        {files.length > 0 && (
          <ul className="data-grid-files">
            {files.map((file) => {
              const href = file.href ? safeHref(file.href) : null;
              return (
                <li key={file.id} className="data-grid-file">
                  {href ? (
                    <a className="data-grid-link" href={href}>
                      {file.name}
                    </a>
                  ) : (
                    <span className="data-grid-file-name">{file.name}</span>
                  )}
                  {file.size !== undefined && column.formatSize && (
                    <>
                      {" "}
                      <span className="data-grid-file-size">{column.formatSize(file.size)}</span>
                    </>
                  )}
                  {column.editable && labels.removeFile && (
                    <button
                      type="button"
                      className="data-grid-file-remove"
                      data-grid-own=""
                      tabIndex={isGrid ? -1 : undefined}
                      aria-label={labels.removeFile(file.name)}
                      onClick={() => onFileRemove?.({ rowId: entry.id, row: entry.row, columnId: column.id, fileId: file.id })}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {column.editable && (
          <input
            type="file"
            className="data-grid-file-input"
            aria-label={labels.fileInput?.(column.header, rowLabel) ?? column.header}
            multiple={column.multiple !== false}
            accept={column.accept}
            tabIndex={isGrid ? -1 : undefined}
            onChange={(e) => {
              const input = e.target;
              const chosen = Array.from(input.files ?? []);
              if (chosen.length > 0) onFilesSelected?.({ rowId: entry.id, row: entry.row, columnId: column.id, files: chosen });
              input.value = "";
            }}
          />
        )}
      </>
    );
  }

  /** Files dropped on an editable file cell: the same report as the file input. The grid uploads nothing. */
  function onFileDrop(entry: Entry, column: DataGridColumn, event: React.DragEvent): void {
    const dropped = Array.from(event.dataTransfer?.files ?? []);
    if (dropped.length === 0) return;
    event.preventDefault();
    const files = column.multiple === false ? dropped.slice(0, 1) : dropped;
    onFilesSelected?.({ rowId: entry.id, row: entry.row, columnId: column.id, files });
  }

  function cellBody(entry: Entry, column: DataGridColumn, ctx: DataGridCellContext): React.ReactNode {
    const rowLabel = () => (visibleColumns[0] ? cellFor(visibleColumns[0], entry.row).formatted : entry.id);
    if (editing && editing.rowId === entry.id && editing.columnId === column.id) {
      const errorId = `${entry.id}-${column.id}-error`;
      const common = {
        className: "data-grid-cell-editor",
        "aria-label": (column.type === "formula" ? labels.formulaEditor?.(column.header) : undefined) ?? labels.cellEditor?.(column.header) ?? column.header,
        "aria-invalid": editing.error || editing.invalid ? ("true" as const) : undefined,
        "aria-describedby": editing.error ? errorId : undefined,
        onKeyDown: onEditorKeydown,
        onBlur: () => {
          if (editingRef.current) commitEdit();
        },
      };
      const groups = [...new Set((column.options ?? []).filter((o) => o.group).map((o) => o.group as string))];
      if (column.editor === "person" && column.personEditor) {
        return <>{column.personEditor({ value: ctx.value, commit: (v: unknown) => void commitValue(entry, column, v), cancel: cancelEdit })}</>;
      }
      if (column.editor === "time-zone") {
        return (
          <>
            <span
              className="data-grid-zoned-editor"
              role="group"
              aria-label={labels.cellEditor?.(column.header) ?? column.header}
              onBlur={(e) => {
                if (editingRef.current && !e.currentTarget.contains(e.relatedTarget as Node | null)) commitEdit();
              }}
            >
              <input
                className="data-grid-cell-editor"
                aria-label={labels.cellEditor?.(column.header) ?? column.header}
                aria-invalid={editing.error || editing.invalid ? "true" : undefined}
                aria-describedby={editing.error ? errorId : undefined}
                onKeyDown={onEditorKeydown}
                ref={focusEditor}
                type="time"
                step={1}
                value={editing.draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <select
                className="data-grid-cell-editor data-grid-zone-editor"
                aria-label={labels.timeZone?.(column.header) ?? column.header}
                onKeyDown={onEditorKeydown}
                value={editing.zone}
                onChange={(e) => {
                  const current = editingRef.current;
                  if (current) setEditing({ ...current, zone: e.target.value, error: undefined, invalid: false });
                }}
              >
                {(column.timeZones ?? []).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
            {editing.error && (
              <span className="data-grid-cell-error" id={errorId}>
                {editing.error}
              </span>
            )}
          </>
        );
      }
      return (
        <>
          {column.editor === "select" ? (
            <select
              {...common}
              ref={focusEditor}
              value={editing.draft}
              onChange={(e) => setDraft(e.target.value)}
            >
              <option value="" />
              {(column.options ?? [])
                .filter((o) => !o.group)
                .map((option) => (
                  <option key={option.id} value={option.id} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              {groups.map((group) => (
                <optgroup key={group} label={group}>
                  {(column.options ?? [])
                    .filter((o) => o.group === group)
                    .map((option) => (
                      <option key={option.id} value={option.id} disabled={option.disabled}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          ) : (
            <input
              {...common}
              ref={focusEditor}
              type={column.editor === "number" ? "number" : column.editor === "date" ? "date" : column.editor === "time" ? "time" : "text"}
              step={column.editor === "time" ? 1 : undefined}
              inputMode={column.editor === "number" ? "decimal" : undefined}
              value={editing.draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
          {editing.error && (
            <span className="data-grid-cell-error" id={errorId}>
              {editing.error}
            </span>
          )}
        </>
      );
    }
    if (column.type === "radio" && column.editable) {
      return (
        <fieldset className="data-grid-radio-group" data-grid-own-group="">
          <legend className="data-grid-radio-legend">{labels.radioGroup?.(column.header, rowLabel()) ?? column.header}</legend>
          {(column.options ?? []).map((option) => (
            <label key={option.id} className="data-grid-radio-option">
              <input
                type="radio"
                name={`${gridId}-${entry.id}-${column.id}`}
                value={option.id}
                checked={ctx.value === option.id}
                disabled={option.disabled}
                tabIndex={isGrid ? -1 : undefined}
                onChange={() => commitValue(entry, column, option.id)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      );
    }
    const shown = column.cell ? (
      column.cell(ctx)
    ) : isMissing(ctx.value) && (column.emptyValue ?? emptyValue) ? (
      (column.emptyValue ?? emptyValue)
    ) : column.type === "person" ? (
      personBody(column, ctx)
    ) : column.type === "file" ? (
      fileBody(entry, column, ctx)
    ) : column.type === "link" ? (
      linkBody(ctx)
    ) : column.type === "date" || column.type === "time" ? (
      ctx.formatted !== "" ? <time dateTime={String(ctx.value)}>{ctx.formatted}</time> : null
    ) : (
      ctx.formatted
    );
    return (
      <>
        {shown}
        {isEditable(column) && column.type !== "radio" && labels.editCell && (
          <button
            type="button"
            className="data-grid-edit-button"
            data-grid-own=""
            tabIndex={isGrid ? -1 : undefined}
            aria-label={labels.editCell(column.header, rowLabel())}
            onClick={() => startEdit(entry, column)}
          />
        )}
      </>
    );
  }

  const table = (
    <DataTable
      label={label}
      caption={caption}
      role={isGrid ? "grid" : "table"}
      aria-rowcount={isGrid ? rowCount : undefined}
      aria-busy={busy ? "true" : undefined}
      onKeyDown={isGrid ? onGridKeydown : undefined}
      onFocus={isGrid ? onGridFocus : undefined}
      onBlur={isGrid ? onGridBlur : undefined}
      onClick={onRowActivate ? onGridClick : undefined}
      onDoubleClick={onGridDoubleClick}
    >
      <DataTableHead>
        <DataTableRow aria-rowindex={indexed ? 1 : undefined}>
          {hasSelection && (
            <DataTableTH
              data-row={-1}
              data-col={0}
              tabIndex={isGrid ? (activeRow === -1 && activeCol === 0 ? 0 : -1) : undefined}
            >
              {selectionMode === "multiple" ? (
                <input
                  type="checkbox"
                  data-grid-own=""
                  tabIndex={isGrid ? -1 : undefined}
                  aria-label={labels.selectAll}
                  checked={allSelected}
                  ref={(node) => {
                    // `indeterminate` is a JS-only DOM property, not an attribute.
                    if (node) node.indeterminate = someSelected;
                  }}
                  onChange={() => {}}
                  onClick={toggleSelectAll}
                />
              ) : (
                <span className="data-grid-selection-header-label">{labels.selectionColumn}</span>
              )}
            </DataTableTH>
          )}
          {visibleColumns.map((column, i) => (
            <DataTableTH
              key={column.id}
              data-row={-1}
              data-col={colOffset + i}
              data-align={column.align}
              data-cell-type={column.type}
              data-pinned={column.pinned}
              draggable={isMovable(column) ? true : undefined}
              onDragStart={isMovable(column) ? (e: React.DragEvent) => { draggingColumnId.current = column.id; e.dataTransfer?.setData("text/plain", column.id); } : undefined}
              onDragOver={isMovable(column) ? (e: React.DragEvent) => { if (draggingColumnId.current) e.preventDefault(); } : undefined}
              onDrop={isMovable(column) ? (e: React.DragEvent) => onHeaderDrop(column.id, e) : undefined}
              tabIndex={isGrid ? (activeRow === -1 && activeCol === colOffset + i ? 0 : -1) : undefined}
              aria-sort={ariaSortFor(column)}
              data-sort-order={sortOrderFor(column)}
              aria-describedby={column.type === "rollup" && labels.rollupDescription ? `${gridId}-${column.id}-description` : undefined}
              style={cellStyle(column)}
            >
              {column.sortable ? (
                <button
                  type="button"
                  className="data-grid-sort-button"
                  data-grid-own=""
                  tabIndex={isGrid ? -1 : undefined}
                  onClick={(e) => toggleSort(column, e.shiftKey)}
                >
                  {column.headerCell ? column.headerCell({ column }) : column.header}
                </button>
              ) : column.headerCell ? (
                column.headerCell({ column })
              ) : (
                column.header
              )}
              {column.type === "rollup" && labels.rollupDescription && (
                <span className="data-grid-visually-hidden" id={`${gridId}-${column.id}-description`}>
                  {labels.rollupDescription(column.header)}
                </span>
              )}
              {column.resizable && (
                // WAI-ARIA "window splitter" pattern: role="separator" plus tabindex/aria-valuenow is
                // exactly how a resize handle becomes focusable and operable.
                <span
                  className="data-grid-resize-handle"
                  role="separator"
                  data-grid-own=""
                  aria-orientation="vertical"
                  aria-label={labels.resizeHandle?.(column.header)}
                  aria-valuenow={widthFor(column) ?? 120}
                  aria-valuemin={MIN_COLUMN_WIDTH}
                  tabIndex={0}
                  onKeyDown={(e) => onResizeKeydown(column, e)}
                  onPointerDown={(e) => onResizePointerDown(column, e)}
                />
              )}
            </DataTableTH>
          ))}
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {renderItems.map((item) => {
          if (item.kind === "spacer") {
            return (
              <tr key={item.key} className="data-grid-spacer" aria-hidden="true" style={{ height: `${item.rows * (virtualize?.rowHeight ?? 0)}px` }}>
                <td colSpan={lastCol + 1} />
              </tr>
            );
          }
          const rowIndex = item.index;
          const entry = pageEntries[rowIndex];
          const row = entry.row;
          const id = entry.id;
          return (
            <DataTableRow
              key={id}
              className={rowClass?.(row)}
              aria-selected={hasSelection ? isSelected(id) : undefined}
              aria-rowindex={indexed ? pageStart + rowIndex + 2 : undefined}
              {...(rowAttrs?.(row) ?? {})}
            >
              {hasSelection && (
                <DataTableTD
                  data-row={rowIndex}
                  data-col={0}
                  role={isGrid ? "gridcell" : "cell"}
                  {...(isGrid
                    ? { active: activeRow === rowIndex && activeCol === 0 }
                    : { tabIndex: undefined })}
                >
                  <input
                    type={selectionMode === "single" ? "radio" : "checkbox"}
                    data-grid-own=""
                    tabIndex={isGrid ? -1 : undefined}
                    aria-label={labels.selectRow?.(
                      visibleColumns[0] ? cellFor(visibleColumns[0], row).formatted : String(rowIndex + 1),
                    )}
                    checked={isSelected(id)}
                    onChange={() => {}}
                    onClick={(e) => toggleRow(pageStart + rowIndex, e)}
                  />
                </DataTableTD>
              )}
              {visibleColumns.map((column, colIndex) => {
                const ctx = cellFor(column, row);
                const extra = column.cellAttrs?.(ctx) ?? {};
                const extraClass =
                  typeof column.cellClass === "function" ? column.cellClass(ctx) : column.cellClass;
                const content = cellBody(entry, column, ctx);
                const isActive = activeRow === rowIndex && activeCol === colOffset + colIndex;
                const isEditingCell = editing?.rowId === id && editing.columnId === column.id;
                return column.rowHeader ? (
                  <DataTableTH
                    key={column.id}
                    scope="row"
                    role="rowheader"
                    className={extraClass}
                    data-row={rowIndex}
                    data-col={colOffset + colIndex}
                    data-align={column.align}
                    data-cell-type={column.type}
                    data-pinned={column.pinned}
                    data-error={column.errorOf?.(row) !== undefined ? "" : undefined}
                    data-empty={isMissing(ctx.value) ? "" : undefined}
                    tabIndex={isGrid ? (isActive ? 0 : -1) : undefined}
                    style={cellStyle(column)}
                    {...extra}
                  >
                    {content}
                  </DataTableTH>
                ) : (
                  <DataTableTD
                    key={column.id}
                    className={extraClass}
                    data-row={rowIndex}
                    data-col={colOffset + colIndex}
                    data-align={column.align}
                    data-cell-type={column.type}
                    data-pinned={column.pinned}
                    data-editable={isEditable(column) ? "" : undefined}
                    data-readonly={column.type === "rollup" ? "" : undefined}
                    onDragOver={
                      column.type === "file" && column.editable
                        ? (e: React.DragEvent) => {
                            if (Array.from(e.dataTransfer?.types ?? []).includes("Files")) e.preventDefault();
                          }
                        : undefined
                    }
                    onDrop={column.type === "file" && column.editable ? (e: React.DragEvent) => onFileDrop(entry, column, e) : undefined}
                    aria-readonly={column.type === "rollup" ? true : undefined}
                    data-error={column.errorOf?.(row) !== undefined ? "" : undefined}
                    data-empty={isMissing(ctx.value) ? "" : undefined}
                    data-editing={isEditingCell ? "" : undefined}
                    role={isGrid ? "gridcell" : "cell"}
                    {...(isGrid ? { active: isActive } : { tabIndex: undefined })}
                    style={cellStyle(column)}
                    {...extra}
                  >
                    {content}
                  </DataTableTD>
                );
              })}
            </DataTableRow>
          );
        })}
        {pageEntries.length === 0 && empty !== undefined && empty !== null && (
          <DataTableRow className="data-grid-empty-row">
            <DataTableTD
              className="data-grid-empty"
              colSpan={lastCol + 1}
              role={isGrid ? "gridcell" : "cell"}
              tabIndex={undefined}
            >
              {empty}
            </DataTableTD>
          </DataTableRow>
        )}
      </DataTableBody>
      {footer && (
        <DataTableFoot>
          {footer({ columns: visibleColumns, rows: pageEntries.map((e) => e.row) })}
        </DataTableFoot>
      )}
    </DataTable>
  );

  return (
    <div ref={rootRef} className={`data-grid ${className}`.trim()} {...restProps}>
      {(labels.search || hidableColumns.length > 0 || hasExportButtons) && (
        <div className="data-grid-toolbar">
          {labels.search && labels.searchField && labels.searchAllFields && (
            <select
              className="data-grid-search-field"
              aria-label={labels.searchField}
              value={filterField}
              onChange={onFilterFieldChangeEvent}
            >
              <option value="">{labels.searchAllFields}</option>
              {filterableColumns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.header}
                </option>
              ))}
            </select>
          )}
          {labels.search && (
            <input
              className="data-grid-search"
              type="search"
              aria-label={labels.search}
              value={filter}
              onChange={onFilterInput}
              onKeyDown={onFilterKeydown}
            />
          )}
          {hasExportButtons && (
            <div className="data-grid-export" role="group" aria-label={labels.export}>
              {labels.copy && (
                <button type="button" className="data-grid-export-button" data-grid-export-format="copy" disabled={exportEntries.length === 0} onClick={() => void runCopy()}>
                  {labels.copy}
                </button>
              )}
              {labels.exportCsv && (
                <button type="button" className="data-grid-export-button" data-grid-export-format="csv" disabled={exportEntries.length === 0} onClick={() => runExport("csv")}>
                  {labels.exportCsv}
                </button>
              )}
              {labels.exportTsv && (
                <button type="button" className="data-grid-export-button" data-grid-export-format="tsv" disabled={exportEntries.length === 0} onClick={() => runExport("tsv")}>
                  {labels.exportTsv}
                </button>
              )}
              {labels.exportExcel && (
                <button type="button" className="data-grid-export-button" data-grid-export-format="xlsx" disabled={exportEntries.length === 0} onClick={() => runExport("xlsx")}>
                  {labels.exportExcel}
                </button>
              )}
            </div>
          )}
          {hidableColumns.length > 0 && labels.columnVisibility && (
            <fieldset className="data-grid-column-visibility">
              <legend>{labels.columnVisibility}</legend>
              {hidableColumns.map((column) => (
                <label key={column.id}>
                  <input
                    type="checkbox"
                    checked={!hiddenColumnIds.has(column.id)}
                    onChange={() => toggleColumnVisibility(column.id)}
                  />
                  {labels.columnVisibilityOption?.(column.header) ?? column.header}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      )}

      {scroll ? (
        // A scrollable region must be reachable by keyboard (WCAG 2.1.1; axe `scrollable-region-focusable`).
        // In grid mode a roving cell is already a tab stop, so only table mode makes the region one.
        <div
          ref={scrollRef}
          className="data-grid-scroll"
          role="region"
          aria-label={label}
          tabIndex={isGrid ? undefined : 0}
          style={virtualize ? { height: `${virtualize.height}px`, overflow: "auto" } : undefined}
          onScroll={virtualize ? (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop) : undefined}
        >
          {table}
        </div>
      ) : (
        table
      )}

      {pageSize ? (
        <div className="data-grid-pagination">
          <button
            type="button"
            className="data-grid-page-previous"
            disabled={clampedPage <= 1}
            onClick={() => goToPage(clampedPage - 1)}
          >
            {labels.previousPage}
          </button>
          <span className="data-grid-page-status">
            {labels.pageStatus?.(clampedPage, pageCount, sortedEntries.length)}
          </span>
          <button
            type="button"
            className="data-grid-page-next"
            disabled={clampedPage >= pageCount}
            onClick={() => goToPage(clampedPage + 1)}
          >
            {labels.nextPage}
          </button>
        </div>
      ) : null}

      <p className="data-grid-status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

export default DataGrid;
