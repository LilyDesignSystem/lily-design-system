// DataGrid (Angular helper). An Angular port of the canonical Svelte data grid; the contract is that
// package's spec/index.md. Standalone component, OnPush, signals; it composes the headless
// DataTable family (`lily-data-table`, `thead[lily-data-table-head]`, …) from
// @lilydesignsystem/angular-headless.
//
// Angular idioms: `selected`, `filter`, `sort`, `columnOrder` and `page` are `model()`s (`[(selected)]`);
// notifications are outputs; the Svelte snippets (`empty`, `footer`, a column's `cell`, `headerCell`,
// `avatar`, `personEditor`) are `TemplateRef`s. The headless `lily-data-table` root renders a plain
// `<table>` with no `role`, so the grid sets `role`, `aria-rowcount` and `aria-busy` on that inner table
// after each render.

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Injector,
  TemplateRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  DataTable,
  DataTableBody,
  DataTableFoot,
  DataTableHead,
  DataTableRow,
  DataTableTD,
  DataTableTH,
  PaginationNav,
  SearchInput,
} from "@lilydesignsystem/angular-headless";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data";
import { foldText, searchTerms } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove } from "./grid-navigation";
import { missingLabels, type LabelFeatures } from "./label-coverage";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, type TypeaheadState } from "./typeahead";
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
  type DataGridFile,
  type DataGridLink,
  type DataGridOption,
  type DataGridPerson,
} from "./cell-types";

/** A missing value: `null`, `undefined` or an empty string. */
const isMissing = (value: unknown): boolean => value === null || value === undefined || value === "";

export type DataGridSortDirection = "ascending" | "descending" | "none";

export type DataGridSort = { columnId: string; direction: DataGridSortDirection };

export type DataGridSelectionMode = "none" | "single" | "multiple";

export type DataGridRow = Record<string, unknown>;

/** What `exportHandler` and the `exportFile` output receive, before the file is saved. */
export type DataGridExport = {
  format: ExportFormat;
  /** The file name, with its extension. */
  filename: string;
  /** How many data rows (the header is not counted). */
  rowCount: number;
  /** The file. */
  blob: Blob;
};

/** What a column's `cell` template receives (as `$implicit`). */
export type DataGridCellContext = {
  value: unknown;
  formatted: string;
  row: DataGridRow;
  column: DataGridColumn;
};

/** What the `cellEdit` output carries after a cell edit is committed. */
export type DataGridCellEdit = {
  rowId: string;
  row: DataGridRow;
  columnId: string;
  /** The parsed new value (a number for the `"number"` editor, the text otherwise). */
  value: unknown;
  /** The cell's value before the edit. */
  previous: unknown;
};

/** What a person editor template receives (as `$implicit`). */
export type DataGridPersonEditorContext = { value: unknown; commit: (value: unknown) => void; cancel: () => void };

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
  /** Custom cell content: a template receiving the cell context as `$implicit`. */
  cell?: TemplateRef<{ $implicit: DataGridCellContext }>;
  /** The header's content in place of the `header` text. `header` stays the accessible name. */
  headerCell?: TemplateRef<{ $implicit: DataGridColumn }>;
  /** Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button `labels.editCell` gates. */
  editable?: boolean;
  /** The editor's control. Default `"text"`; a `type` sets its own. */
  editor?: "text" | "number" | "link" | "date" | "time" | "time-zone" | "select" | "radio" | "person" | "formula";
  /** The kind of value in this column: a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor`. */
  type?: DataGridCellType;
  /** BCP 47 locale for this column's formatting and collation. */
  /** Shown instead of nothing when this column's value is missing (`null`, `undefined` or `""`). Overrides the grid's `emptyValue`. A missing value always carries `data-empty` on its cell. */
  emptyValue?: string;
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
  avatar?: TemplateRef<{ $implicit: DataGridPerson }>;
  /** `person`: the editor template (`$implicit`: `{ value, commit, cancel }`). Without it a person cell is read-only. */
  personEditor?: TemplateRef<{ $implicit: DataGridPersonEditorContext }>;
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
  /** Accessible name of the select that limits the search to one column. Gates the select (needs `searchAllFields` too). */
  searchField?: string;
  /** The select's first option: search every column. */
  searchAllFields?: string;
  /** Accessible name of the pager. When given, the pager is a labelled `<nav>` landmark (the headless `PaginationNav`); without it the pager is a plain `<div>`. */
  pagination?: string;
  /** Visible text of the copy button, which puts the export (header row first, tab-separated) on the clipboard for pasting into a spreadsheet. Gates the button. */
  copy?: string;
  /** Announced after a copy: (how many rows). */
  copyAnnouncement?: (rowCount: number) => string;
  /** Announced when the clipboard could not be written. */
  copyFailed?: string;
  /** Announced after Ctrl/Cmd+Z puts an earlier value back: (column header, the restored text). */
  undoAnnouncement?: (header: string, text: string) => string;
  /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies an edit: (column header, the text). */
  redoAnnouncement?: (header: string, text: string) => string;
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

/** What a footer template receives (as `$implicit`). */
export type DataGridFooterContext = { columns: DataGridColumn[]; rows: DataGridRow[] };

export type DataGridEntry = { row: DataGridRow; id: string };

type Editing = { rowId: string; columnId: string; draft: string; zone?: string; error?: string; invalid?: boolean };

type RenderItem = { kind: "row"; index: number } | { kind: "spacer"; rows: number; key: string };

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

/** Default cell value reader: `row[column.id]`. */
function defaultAccessor(column: DataGridColumn, row: DataGridRow): unknown {
  return column.accessor ? column.accessor(row) : row[column.id];
}

/** Default cell formatter: `String(value)`, `""` for null/undefined. */
function formatCell(column: DataGridColumn, row: DataGridRow): string {
  const value = defaultAccessor(column, row);
  if (column.format) return column.format(value, row);
  return value === null || value === undefined ? "" : String(value);
}

/** Sets a record of attributes on its host element (Angular cannot spread a dictionary in a template). */
@Directive({ selector: "[lilyDataGridAttrs]", standalone: true })
export class DataGridAttrs {
  readonly lilyDataGridAttrs = input<Record<string, string> | undefined>(undefined);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private applied: string[] = [];

  constructor() {
    effect(() => {
      const next = this.lilyDataGridAttrs() ?? {};
      for (const name of this.applied) if (!(name in next)) this.host.nativeElement.removeAttribute(name);
      for (const [name, value] of Object.entries(next)) this.host.nativeElement.setAttribute(name, value);
      this.applied = Object.keys(next);
    });
  }
}

@Component({
  selector: "lily-data-grid",
  standalone: true,
  imports: [NgTemplateOutlet, DataGridAttrs, DataTable, DataTableBody, DataTableFoot, DataTableHead, DataTableRow, DataTableTD, DataTableTH, PaginationNav, SearchInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #rootEl class="data-grid {{ className() }}">
      @if (labels().search || hidableColumns().length > 0 || hasExportButtons()) {
        <div class="data-grid-toolbar">
          @if (labels().search && labels().searchField && labels().searchAllFields) {
            <select class="data-grid-search-field" [attr.aria-label]="labels().searchField" [value]="filterField()" (change)="onFilterFieldChange($event)">
              <option value="">{{ labels().searchAllFields }}</option>
              @for (c of filterableColumns(); track c.id) {
                <option [value]="c.id">{{ c.header }}</option>
              }
            </select>
          }
          @if (labels().search; as searchLabel) {
            <lily-search-input className="data-grid-search" [label]="searchLabel" [value]="filter()" (valueChange)="setFilter($event)" (keydown)="onFilterKeydown($event)" />
          }
          @if (hasExportButtons()) {
            <div class="data-grid-export" role="group" [attr.aria-label]="labels().export ?? null">
              @if (labels().copy; as copy) {
                <button type="button" class="data-grid-export-button" data-grid-export-format="copy" [disabled]="exportEntries().length === 0" (click)="runCopy()">{{ copy }}</button>
              }
              @if (labels().exportCsv; as csv) {
                <button type="button" class="data-grid-export-button" data-grid-export-format="csv" [disabled]="exportEntries().length === 0" (click)="runExport('csv')">{{ csv }}</button>
              }
              @if (labels().exportTsv; as tsv) {
                <button type="button" class="data-grid-export-button" data-grid-export-format="tsv" [disabled]="exportEntries().length === 0" (click)="runExport('tsv')">{{ tsv }}</button>
              }
              @if (labels().exportExcel; as excel) {
                <button type="button" class="data-grid-export-button" data-grid-export-format="xlsx" [disabled]="exportEntries().length === 0" (click)="runExport('xlsx')">{{ excel }}</button>
              }
            </div>
          }
          @if (hidableColumns().length > 0 && labels().columnVisibility; as visibilityLabel) {
            <fieldset class="data-grid-column-visibility">
              <legend>{{ visibilityLabel }}</legend>
              @for (column of hidableColumns(); track column.id) {
                <label>
                  <input type="checkbox" [checked]="!hiddenColumnIds().has(column.id)" (change)="toggleColumnVisibility(column.id)" />
                  {{ labels().columnVisibilityOption?.(column.header) ?? column.header }}
                </label>
              }
            </fieldset>
          }
        </div>
      }

      @if (scroll()) {
        <!-- A scrollable region must be reachable by keyboard (WCAG 2.1.1); in grid mode a roving cell is already a tab stop. -->
        <div
          #scrollEl
          class="data-grid-scroll"
          role="region"
          [attr.aria-label]="label()"
          [attr.tabindex]="isGrid() ? null : 0"
          [attr.style]="scrollStyle()"
          (scroll)="onScroll($event)"
        >
          <ng-container *ngTemplateOutlet="tableTemplate" />
        </div>
      } @else {
        <ng-container *ngTemplateOutlet="tableTemplate" />
      }

      @if (pageSize()) {
        @if (labels().pagination; as pagination) {
          <lily-pagination-nav className="data-grid-pagination" [label]="pagination">
            <ng-container *ngTemplateOutlet="pager" />
          </lily-pagination-nav>
        } @else {
          <div class="data-grid-pagination">
            <ng-container *ngTemplateOutlet="pager" />
          </div>
        }
      }

      <p class="data-grid-status" aria-live="polite">{{ statusMessage() }}</p>
    </div>

    <ng-template #pager>
      <button type="button" class="data-grid-page-previous" [disabled]="clampedPage() <= 1" (click)="goToPage(clampedPage() - 1)">{{ labels().previousPage }}</button>
      <span class="data-grid-page-status">{{ labels().pageStatus?.(clampedPage(), pageCount(), sortedEntries().length) }}</span>
      <button type="button" class="data-grid-page-next" [disabled]="clampedPage() >= pageCount()" (click)="goToPage(clampedPage() + 1)">{{ labels().nextPage }}</button>
    </ng-template>

    <ng-template #tableTemplate>
      <lily-data-table
        [label]="label()"
        [className]="''"
        (keydown)="onGridKeydown($event)"
        (focusin)="onGridFocusin($event)"
        (focusout)="onGridFocusout($event)"
        (click)="onGridClick($event)"
        (dblclick)="onGridDblclick($event)"
      >
        @if (caption()) {
          <caption>{{ caption() }}</caption>
        }
        <thead lily-data-table-head>
          <tr lily-data-table-row [attr.aria-rowindex]="indexed() ? 1 : null">
            @if (hasSelection()) {
              <th
                lily-data-table-th
                data-row="-1"
                data-col="0"
                [attr.tabindex]="isGrid() ? (activeRow() === -1 && activeCol() === 0 ? 0 : -1) : null"
              >
                @if (selectionMode() === 'multiple') {
                  <input
                    type="checkbox"
                    data-grid-own
                    [attr.tabindex]="isGrid() ? -1 : null"
                    [attr.aria-label]="labels().selectAll ?? null"
                    [checked]="allSelected()"
                    [indeterminate]="someSelected()"
                    (click)="toggleSelectAll()"
                  />
                } @else {
                  <span class="data-grid-selection-header-label">{{ labels().selectionColumn }}</span>
                }
              </th>
            }
            @for (column of visibleColumns(); track column.id; let i = $index) {
              <th
                lily-data-table-th
                data-row="-1"
                [attr.data-col]="colOffset() + i"
                [attr.data-align]="column.align ?? null"
                [attr.data-cell-type]="column.type ?? null"
                [attr.data-pinned]="column.pinned ?? null"
                [attr.tabindex]="isGrid() ? (activeRow() === -1 && activeCol() === colOffset() + i ? 0 : -1) : null"
                [attr.aria-sort]="ariaSortFor(column)"
                [attr.data-sort-order]="sortOrderFor(column)"
                [attr.aria-describedby]="column.type === 'rollup' && labels().rollupDescription ? gridId + '-' + column.id + '-description' : null"
                [attr.style]="cellStyle(column)"
                [attr.draggable]="isMovable(column) ? 'true' : null"
                (dragstart)="onHeaderDragStart(column, $event)"
                (dragover)="onHeaderDragOver($event)"
                (drop)="onHeaderDrop(column.id, $event)"
              >
                @if (column.sortable) {
                  <button type="button" class="data-grid-sort-button" data-grid-own [attr.tabindex]="isGrid() ? -1 : null" (click)="toggleSort(column, $any($event).shiftKey)">
                    @if (column.headerCell; as headerTemplate) {
                      <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: column }" />
                    } @else {<ng-container>{{ column.header }}</ng-container>}
                  </button>
                } @else if (column.headerCell; as headerTemplate) {
                  <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: column }" />
                } @else {<ng-container>{{ column.header }}</ng-container>}
                @if (column.type === 'rollup' && labels().rollupDescription; as describe) {
                  <span class="data-grid-visually-hidden" [id]="gridId + '-' + column.id + '-description'">{{ describe(column.header) }}</span>
                }
                @if (column.resizable) {
                  <!-- WAI-ARIA "window splitter" pattern: role="separator" plus tabindex/aria-valuenow is how a resize handle becomes focusable and operable. -->
                  <span
                    class="data-grid-resize-handle"
                    role="separator"
                    data-grid-own
                    aria-orientation="vertical"
                    [attr.aria-label]="labels().resizeHandle?.(column.header) ?? null"
                    [attr.aria-valuenow]="widthFor(column) ?? 120"
                    [attr.aria-valuemin]="minColumnWidth"
                    tabindex="0"
                    (keydown)="onResizeKeydown(column, $event)"
                    (pointerdown)="onResizePointerDown(column, $event)"
                  ></span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody lily-data-table-body>
          @for (item of renderItems(); track item.kind === 'row' ? pageEntries()[item.index].id : item.key) {
            @if (item.kind === 'spacer') {
              <tr class="data-grid-spacer" aria-hidden="true" [attr.style]="'height:' + item.rows * (virtualize()?.rowHeight ?? 0) + 'px'">
                <td [attr.colspan]="lastCol() + 1"></td>
              </tr>
            } @else {
              @let entry = pageEntries()[item.index];
              <tr
                lily-data-table-row
                [className]="rowClass()?.(entry.row) ?? ''"
                [attr.aria-selected]="hasSelection() ? isSelected(entry.id) : null"
                [attr.aria-rowindex]="indexed() ? pageStart() + item.index + 2 : null"
                [lilyDataGridAttrs]="rowAttrs()?.(entry.row)"
              >
                @if (hasSelection()) {
                  <td
                    lily-data-table-td
                    [attr.role]="isGrid() ? 'gridcell' : 'cell'"
                    [attr.data-row]="item.index"
                    data-col="0"
                    [attr.tabindex]="isGrid() ? (activeRow() === item.index && activeCol() === 0 ? 0 : -1) : null"
                  >
                    <input
                      [type]="selectionMode() === 'single' ? 'radio' : 'checkbox'"
                      data-grid-own
                      [attr.tabindex]="isGrid() ? -1 : null"
                      [attr.aria-label]="labels().selectRow?.(rowLabelOf(entry)) ?? null"
                      [checked]="isSelected(entry.id)"
                      (click)="onRowSelectClick(pageStart() + item.index, $event)"
                    />
                  </td>
                }
                @for (column of visibleColumns(); track column.id; let colIndex = $index) {
                  @let ctx = cellFor(column, entry.row);
                  @if (column.rowHeader) {
                    <th
                      lily-data-table-th
                      scope="row"
                      role="rowheader"
                      [className]="cellClassOf(column, ctx)"
                      [attr.data-row]="item.index"
                      [attr.data-col]="colOffset() + colIndex"
                      [attr.data-align]="column.align ?? null"
                      [attr.data-cell-type]="column.type ?? null"
                      [attr.data-pinned]="column.pinned ?? null"
                      [attr.data-error]="column.errorOf?.(entry.row) !== undefined ? '' : null"
                      [attr.data-empty]="isMissing(ctx.value) ? '' : null"
                      [attr.tabindex]="isGrid() ? (activeRow() === item.index && activeCol() === colOffset() + colIndex ? 0 : -1) : null"
                      [attr.style]="cellStyle(column)"
                      [lilyDataGridAttrs]="column.cellAttrs?.(ctx)"
                    >
                      <ng-container *ngTemplateOutlet="cellBody; context: { entry: entry, column: column, ctx: ctx }" />
                    </th>
                  } @else {
                    <td
                      lily-data-table-td
                      [className]="cellClassOf(column, ctx)"
                      [attr.role]="isGrid() ? 'gridcell' : 'cell'"
                      [attr.data-row]="item.index"
                      [attr.data-col]="colOffset() + colIndex"
                      [attr.data-align]="column.align ?? null"
                      [attr.data-cell-type]="column.type ?? null"
                      [attr.data-pinned]="column.pinned ?? null"
                      [attr.data-editable]="isEditable(column) ? '' : null"
                      [attr.data-readonly]="column.type === 'rollup' ? '' : null"
                      [attr.aria-readonly]="column.type === 'rollup' ? 'true' : null"
                      [attr.data-error]="column.errorOf?.(entry.row) !== undefined ? '' : null"
                      [attr.data-empty]="isMissing(ctx.value) ? '' : null"
                      [attr.data-editing]="isEditingCell(entry, column) ? '' : null"
                      [attr.tabindex]="isGrid() ? (activeRow() === item.index && activeCol() === colOffset() + colIndex ? 0 : -1) : null"
                      [attr.style]="cellStyle(column)"
                      [lilyDataGridAttrs]="column.cellAttrs?.(ctx)"
                      (dragover)="onFileDragOver(column, $event)"
                      (drop)="onFileDrop(entry, column, $event)"
                    >
                      <ng-container *ngTemplateOutlet="cellBody; context: { entry: entry, column: column, ctx: ctx }" />
                    </td>
                  }
                }
              </tr>
            }
          }
          @if (pageEntries().length === 0 && empty(); as emptyTemplate) {
            <tr lily-data-table-row className="data-grid-empty-row">
              <td lily-data-table-td className="data-grid-empty" [attr.colspan]="lastCol() + 1" [attr.role]="isGrid() ? 'gridcell' : 'cell'">
                <ng-container *ngTemplateOutlet="emptyTemplate" />
              </td>
            </tr>
          }
        </tbody>
        @if (footer(); as footerTemplate) {
          <tfoot lily-data-table-foot>
            <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: footerContext() }" />
          </tfoot>
        }
      </lily-data-table>
    </ng-template>

    <ng-template #cellBody let-entry="entry" let-column="column" let-ctx="ctx">
      @if (isEditingCell(entry, column)) {
        @let editing = editingState()!;
        @if (column.editor === 'person' && column.personEditor) {
          <ng-container *ngTemplateOutlet="column.personEditor; context: { $implicit: personEditorContext(entry, column, ctx) }" />
        } @else if (column.editor === 'time-zone') {
          <span
            class="data-grid-zoned-editor"
            role="group"
            [attr.aria-label]="labels().cellEditor?.(column.header) ?? column.header"
            (focusout)="onZonedFocusout($event)"
          >
            <input
              class="data-grid-cell-editor"
              type="time"
              step="1"
              [attr.aria-label]="labels().cellEditor?.(column.header) ?? column.header"
              [attr.aria-invalid]="editing.error || editing.invalid ? 'true' : null"
              [attr.aria-describedby]="editing.error ? entry.id + '-' + column.id + '-error' : null"
              [value]="editing.draft"
              (input)="setDraft($event)"
              (keydown)="onEditorKeydown($event)"
            />
            <select
              class="data-grid-cell-editor data-grid-zone-editor"
              [attr.aria-label]="labels().timeZone?.(column.header) ?? column.header"
              (change)="setZone($event)"
              (keydown)="onEditorKeydown($event)"
            >
              @for (option of column.timeZones ?? []; track option.id) {
                <option [value]="option.id" [selected]="option.id === editing.zone">{{ option.label }}</option>
              }
            </select>
          </span>
        } @else if (column.editor === 'select') {
          <select
            class="data-grid-cell-editor"
            [attr.aria-label]="labels().cellEditor?.(column.header) ?? column.header"
            [attr.aria-invalid]="editing.error || editing.invalid ? 'true' : null"
            [attr.aria-describedby]="editing.error ? entry.id + '-' + column.id + '-error' : null"
            (change)="setDraft($event)"
            (keydown)="onEditorKeydown($event)"
            (blur)="onEditorBlur()"
          >
            <option value="" [selected]="editing.draft === ''"></option>
            @for (option of ungroupedOptions(column); track option.id) {
              <option [value]="option.id" [disabled]="option.disabled ?? false" [selected]="option.id === editing.draft">{{ option.label }}</option>
            }
            @for (group of groupsOf(column); track group) {
              <optgroup [label]="group">
                @for (option of optionsInGroup(column, group); track option.id) {
                  <option [value]="option.id" [disabled]="option.disabled ?? false" [selected]="option.id === editing.draft">{{ option.label }}</option>
                }
              </optgroup>
            }
          </select>
        } @else {
          <input
            class="data-grid-cell-editor"
            [type]="column.editor === 'number' ? 'number' : column.editor === 'date' ? 'date' : column.editor === 'time' ? 'time' : 'text'"
            [attr.step]="column.editor === 'time' ? 1 : null"
            [attr.inputmode]="column.editor === 'number' ? 'decimal' : null"
            [attr.aria-label]="(column.type === 'formula' ? labels().formulaEditor?.(column.header) : undefined) ?? labels().cellEditor?.(column.header) ?? column.header"
            [attr.aria-invalid]="editing.error || editing.invalid ? 'true' : null"
            [attr.aria-describedby]="editing.error ? entry.id + '-' + column.id + '-error' : null"
            [value]="editing.draft"
            (input)="setDraft($event)"
            (keydown)="onEditorKeydown($event)"
            (blur)="onEditorBlur()"
          />
        }
        @if (editing.error) {
          <span class="data-grid-cell-error" [id]="entry.id + '-' + column.id + '-error'">{{ editing.error }}</span>
        }
      } @else if (column.type === 'radio' && column.editable) {
        <fieldset class="data-grid-radio-group" data-grid-own-group>
          <legend class="data-grid-radio-legend">{{ labels().radioGroup?.(column.header, rowLabelOf(entry)) ?? column.header }}</legend>
          @for (option of column.options ?? []; track option.id) {
            <label class="data-grid-radio-option">
              <input
                type="radio"
                [name]="gridId + '-' + entry.id + '-' + column.id"
                [value]="option.id"
                [checked]="ctx.value === option.id"
                [disabled]="option.disabled ?? false"
                [attr.tabindex]="isGrid() ? -1 : null"
                (change)="commitValue(entry, column, option.id)"
              />{{ option.label }}</label>
          }
        </fieldset>
      } @else {
        @if (column.cell; as cellTemplate) {
          <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: ctx }" />
        } @else if (isMissing(ctx.value) && (column.emptyValue ?? emptyValue())) {
          <ng-container>{{ column.emptyValue ?? emptyValue() }}</ng-container>
        } @else if (column.type === 'person') {
          @let people = peopleIn(ctx.value);
          @if (people.length > 0) {
            @let shown = shownPeople(column, ctx.value);
            <ul class="data-grid-people">
              @for (person of shown; track person.id) {
                <li class="data-grid-person">
                  @if (column.avatar; as avatarTemplate) {
                    <span class="data-grid-avatar" aria-hidden="true"><ng-container *ngTemplateOutlet="avatarTemplate; context: { $implicit: person }" /></span>
                  }
                  <span class="data-grid-person-name">{{ nameOf(person) }}</span>
                </li>
              }
              @if (shown.length < people.length && labels().morePeople; as more) {
                <li class="data-grid-people-more">{{ more(people.length - shown.length) }}</li>
              }
            </ul>
          }
        } @else if (column.type === 'file') {
          @let files = filesIn(ctx.value);
          @if (files.length > 0) {
            <ul class="data-grid-files">
              @for (file of files; track file.id) {
                <li class="data-grid-file">
                  @if (hrefOf(file.href); as fileHref) {
                    <a class="data-grid-link" [href]="fileHref">{{ file.name }}</a>
                  } @else {
                    <span class="data-grid-file-name">{{ file.name }}</span>
                  }
                  @if (file.size !== undefined && column.formatSize; as sizeText) {
                    {{ ' ' }}<span class="data-grid-file-size">{{ column.formatSize(file.size) }}</span>
                  }
                  @if (column.editable && labels().removeFile; as removeLabel) {
                    <button
                      type="button"
                      class="data-grid-file-remove"
                      data-grid-own
                      [attr.tabindex]="isGrid() ? -1 : null"
                      [attr.aria-label]="removeLabel(file.name)"
                      (click)="fileRemove.emit({ rowId: entry.id, row: entry.row, columnId: column.id, fileId: file.id })"
                    ></button>
                  }
                </li>
              }
            </ul>
          }
          @if (column.editable) {
            <input
              type="file"
              class="data-grid-file-input"
              [attr.aria-label]="labels().fileInput?.(column.header, rowLabelOf(entry)) ?? column.header"
              [multiple]="column.multiple !== false"
              [attr.accept]="column.accept ?? null"
              [attr.tabindex]="isGrid() ? -1 : null"
              (change)="onFileInput(entry, column, $event)"
            />
          }
        } @else if (column.type === 'link') {
          @let link = linkIn(ctx.value);
          @if (link) {
            @if (hrefOf(link.href); as href) {
              <a class="data-grid-link" [href]="href" [attr.target]="link.external ? '_blank' : null" [attr.rel]="link.external ? 'noopener noreferrer' : null">{{ link.label ?? link.href }}@if (link.external && labels().opensInNewTab; as newTab) {{{ ' ' }}<span class="data-grid-visually-hidden">{{ newTab(link.label ?? link.href) }}</span>}</a>
            } @else {
              <!-- An address with an unsafe scheme is shown as text, never as a link. -->
              <span class="data-grid-link data-grid-link-unsafe">{{ link.label ?? link.href }}</span>
            }
          }
        } @else if (column.type === 'date' || column.type === 'time') {
          @if (ctx.formatted !== '') {
            <time [attr.datetime]="stringOf(ctx.value)">{{ ctx.formatted }}</time>
          }
        } @else {<ng-container>{{ ctx.formatted }}</ng-container>}
        @if (isEditable(column) && column.type !== 'radio' && labels().editCell; as editLabel) {
          <button
            type="button"
            class="data-grid-edit-button"
            data-grid-own
            [attr.tabindex]="isGrid() ? -1 : null"
            [attr.aria-label]="editLabel(column.header, rowLabelOf(entry))"
            (click)="startEdit(entry, column)"
          ></button>
        }
      }
    </ng-template>
  `,
})
export class DataGrid {
  // ---- Inputs ----

  /** Accessible name for the grid, passed through to DataTable. */
  readonly label = input.required<string>();
  /** Optional visible caption. */
  readonly caption = input<string | undefined>(undefined);
  /** Column definitions. */
  readonly columns = input.required<DataGridColumn[]>();
  /** Row data. */
  readonly rows = input.required<DataGridRow[]>();
  /** BCP 47 locale for the typed columns' formatting and collation. Never defaulted: with none, values show as stored. */
  readonly locale = input<string | undefined>(undefined);
  /** What a cell shows when its value is missing (`null`, `undefined` or `""`), for example `"—"`. A column's own `emptyValue` wins. No default: Lily ships no text. The cell always carries `data-empty`, and an export is unaffected. */
  readonly emptyValue = input<string | undefined>(undefined);
  /** In development, log (once per grid) the labels the grid's features call for but `labels` leaves out. Default `true`; it never logs in production. */
  readonly warnMissingLabels = input<boolean>(true);
  /** Where missing values sort: `"last"` (default, in both directions) or `"first"`. */
  readonly nulls = input<"first" | "last">("last");
  /** Make every column movable (Alt+Arrow on its header, or drag it) unless its own `movable` is `false`. Default `false`. */
  readonly movableColumns = input<boolean>(false);
  /** Hides rows for which it returns false (a status or date-range filter). Combines with the text filter; both must pass. */
  readonly rowFilter = input<((row: DataGridRow) => boolean) | undefined>(undefined);
  /** Derives a stable id per row. Defaults to the row's index in `rows`. */
  readonly rowId = input<(row: DataGridRow, index: number) => string>((_row, index) => String(index));
  /** Row selection mode. */
  readonly selectionMode = input<DataGridSelectionMode>("none");
  /** Rows per page. Unset disables pagination. */
  readonly pageSize = input<number | undefined>(undefined);
  /** If set, persist column widths / hidden columns / sort to localStorage. */
  readonly storageKey = input<string | undefined>(undefined);
  /** User-facing strings. */
  readonly labels = input<DataGridLabels>({});
  /** `"grid"` (default): roving-tabindex grid. `"table"`: a plain table with ordinary tab stops. */
  readonly mode = input<"grid" | "table">("grid");
  /** Extra class on each body row. */
  readonly rowClass = input<((row: DataGridRow) => string) | undefined>(undefined);
  /** Extra attributes on each body row. */
  readonly rowAttrs = input<((row: DataGridRow) => Record<string, string>) | undefined>(undefined);
  /** Enter on a body cell with no widget, and a click outside any widget, emit `rowActivate` — only when this is true (Angular outputs cannot be tested for a listener). */
  readonly activateRows = input<boolean>(false);
  /** Shown in one row spanning every column when no row is to be shown. */
  readonly empty = input<TemplateRef<void> | undefined>(undefined);
  /** Rendered inside a `<tfoot>`: a template receiving `{ columns, rows }` as `$implicit`. */
  readonly footer = input<TemplateRef<{ $implicit: DataGridFooterContext }> | undefined>(undefined);
  /** Sets `aria-busy` on the table. */
  readonly busy = input<boolean>(false);
  /** Wrap the table in a scrollable `data-grid-scroll` region. Default true. */
  readonly scroll = input<boolean>(true);
  /** The file name without its extension. Default `"data-grid"`. */
  readonly exportFilename = input<string>("data-grid");
  /** What an export holds: `"view"` (default) or `"selected"`. */
  readonly exportScope = input<"view" | "selected">("view");
  /** `.xlsx` only: a `formula` column keeps the live expression with the result cached. */
  readonly exportFormulas = input<boolean>(false);
  /** Called with the file before it is saved. Return `false` to keep the grid from saving it. */
  readonly exportHandler = input<((file: DataGridExport) => boolean | void) | undefined>(undefined);
  /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` output fires first. */
  readonly copyHandler = input<((copy: { text: string; rowCount: number }) => boolean | void) | undefined>(undefined);
  /** Renders only the rows in view, in a scroll region of `height` px (needs `scroll`). */
  readonly virtualize = input<{ rowHeight: number; height: number; overscan?: number } | undefined>(undefined);
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  // ---- Two-way models ----

  /** Selected row ids. Two-way bindable: `[(selected)]`. */
  readonly selected = model<string[]>([]);
  /** Text filter. Two-way bindable: `[(filter)]`. */
  readonly filter = model<string>("");
  /** Limits the text filter to one column: a column id, or `""` for every filterable column. Two-way bindable: `[(filterField)]`. */
  readonly filterField = model<string>("");
  /** Further sort keys after `sort`, for ties: Shift+click on another sortable header adds it. Two-way bindable: `[(thenBy)]`. */
  readonly thenBy = model<DataGridSort[]>([]);
  /** Current sort. Two-way bindable: `[(sort)]`. */
  readonly sort = model<DataGridSort>({ columnId: "", direction: "none" });
  /** Column ids in display order. Two-way bindable: `[(columnOrder)]`; columns it does not name follow in their `columns` order. */
  readonly columnOrder = model<string[]>([]);
  /** Current 1-indexed page. Two-way bindable: `[(page)]`. */
  readonly page = model<number>(1);

  // ---- Outputs ----

  readonly cellEdit = output<DataGridCellEdit>();
  readonly filesSelected = output<{ rowId: string; row: DataGridRow; columnId: string; files: File[] }>();
  readonly fileRemove = output<{ rowId: string; row: DataGridRow; columnId: string; fileId: string }>();
  readonly rowActivate = output<{ row: DataGridRow; id: string }>();
  readonly exportFile = output<DataGridExport>();
  readonly copy = output<{ text: string; rowCount: number }>();

  // ---- State ----

  protected readonly gridId = nextDataGridId();
  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;
  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly scrollRef = viewChild<ElementRef<HTMLDivElement>>("scrollEl");
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  protected readonly hiddenColumnIds = signal<ReadonlySet<string>>(new Set());
  private readonly columnWidths = signal<Record<string, number>>({});
  private readonly focusedRow = signal(-1); // -1 = header row
  private readonly focusedCol = signal(0);
  private lastSelectedIndex = -1;
  protected readonly editingState = signal<Editing | null>(null);
  private readonly scrollTop = signal(0);
  private draggingColumnId: string | null = null;

  // ---- Derived data ----

  /** Each column with its type's defaults filled in under its own props. */
  protected readonly resolvedColumns = computed(() => this.columns().map((c) => resolveColumn(c, this.locale(), this.rows())) as DataGridColumn[]);
  protected readonly isGrid = computed(() => this.mode() === "grid");
  protected readonly hasSelection = computed(() => this.selectionMode() !== "none");
  protected readonly colOffset = computed(() => (this.hasSelection() ? 1 : 0));

  /** Columns in display order: those named in `columnOrder` first, the rest after in their own order. */
  private readonly orderedColumns = computed(() => {
    const order = this.columnOrder();
    const columns = this.resolvedColumns();
    if (order.length === 0) return columns;
    const rank = (id: string) => {
      const i = order.indexOf(id);
      return i === -1 ? order.length : i;
    };
    return columns
      .map((c, i) => ({ c, i }))
      .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
      .map((x) => x.c);
  });
  protected readonly visibleColumns = computed(() => this.orderedColumns().filter((c) => !this.hiddenColumnIds().has(c.id)));
  protected readonly hidableColumns = computed(() => this.resolvedColumns().filter((c) => c.hidable));

  private readonly entries = computed<DataGridEntry[]>(() => {
    const rowId = this.rowId();
    return this.rows().map((row, index) => ({ row, id: rowId(row, index) }));
  });

  /** Each cell's value and formatted text, read once per row object and column (reset when the columns change). */
  private readonly cellCache = computed(() => {
    this.resolvedColumns();
    return new WeakMap<DataGridRow, Map<string, DataGridCellContext>>();
  });

  protected cellFor(column: DataGridColumn, row: DataGridRow): DataGridCellContext {
    const cache = this.cellCache();
    let perRow = cache.get(row);
    if (!perRow) {
      perRow = new Map();
      cache.set(row, perRow);
    }
    let ctx = perRow.get(column.id);
    if (!ctx) {
      ctx = { value: defaultAccessor(column, row), formatted: formatCell(column, row), row, column };
      perRow.set(column.id, ctx);
    }
    return ctx;
  }

  /** A missing value: `null`, `undefined` or an empty string. */
  protected readonly isMissing = isMissing;

  /** A column the user can move: its own `movable`, else the grid's `movableColumns`. */
  protected isMovable(column: DataGridColumn): boolean {
    return column.movable ?? this.movableColumns();
  }

  protected readonly filterableColumns = computed(() => this.resolvedColumns().filter((c) => c.filterable !== false));

  /** One folded (lower-case, no diacritics) text per filterable cell, built once per rows/columns change. */
  private readonly searchIndex = computed(() =>
    this.entries().map((entry) =>
      this.filterableColumns().map((column) =>
        foldText(column.filterText ? column.filterText(this.cellFor(column, entry.row).value, entry.row) : this.cellFor(column, entry.row).formatted),
      ),
    ),
  );

  // Every word of the filter must appear somewhere in the row (any order, any cells), ignoring case and diacritics.
  private readonly filteredEntries = computed(() => {
    const terms = searchTerms(this.filter());
    const rowFilter = this.rowFilter();
    if (terms.length === 0 && !rowFilter) return this.entries();
    const index = terms.length > 0 ? this.searchIndex() : null;
    // With a field chosen, every word must be in that field's cell; otherwise anywhere in the row.
    const field = this.filterField();
    const only = field ? this.filterableColumns().findIndex((c) => c.id === field) : -1;
    const rowText = (i: number): string => (only >= 0 ? index![i][only] : index![i].join(" "));
    return this.entries().filter((entry, i) => (!rowFilter || rowFilter(entry.row)) && (!index || terms.every((term) => rowText(i).includes(term))));
  });

  /** The sort keys in order: the primary, then `thenBy`, each with a real column and a direction. */
  private readonly sortKeys = computed(() =>
    [this.sort(), ...this.thenBy()]
      .map((k) => ({ column: this.resolvedColumns().find((c) => c.id === k.columnId), dir: k.direction === "ascending" ? 1 : k.direction === "descending" ? -1 : 0 }))
      .filter((k): k is { column: DataGridColumn; dir: 1 | -1 } => !!k.column && k.dir !== 0),
  );

  protected readonly sortedEntries = computed(() => {
    const keys = this.sortKeys();
    const filtered = this.filteredEntries();
    if (keys.length === 0) return filtered;
    const nulls = this.nulls();
    const collators = keys.map((k) => {
      const tag = k.column.locale ?? this.locale();
      return tag ? new Intl.Collator(tag, { numeric: true }) : null;
    });
    // Read each sort key once per column (n accessor calls), not twice per comparison.
    const keyed = filtered.map((entry) => ({ entry, keys: keys.map((k) => this.cellFor(k.column, entry.row).value) }));
    keyed.sort((a, b) => {
      for (let i = 0; i < keys.length; i++) {
        const { column, dir } = keys[i];
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
  });

  protected readonly pageCount = computed(() => {
    const size = this.pageSize();
    return size ? Math.max(1, Math.ceil(this.sortedEntries().length / size)) : 1;
  });
  protected readonly clampedPage = computed(() => Math.min(Math.max(this.page(), 1), this.pageCount()));
  protected readonly pageStart = computed(() => {
    const size = this.pageSize();
    return size ? (this.clampedPage() - 1) * size : 0;
  });
  protected readonly pageEntries = computed(() => {
    const size = this.pageSize();
    return size ? this.sortedEntries().slice(this.pageStart(), this.pageStart() + size) : this.sortedEntries();
  });
  protected readonly lastCol = computed(() => this.colOffset() + this.visibleColumns().length - 1);

  // The roving position clamped to the cells that exist now.
  protected readonly activeRow = computed(() => Math.max(-1, Math.min(this.focusedRow(), this.pageEntries().length - 1)));
  protected readonly activeCol = computed(() => Math.max(0, Math.min(this.focusedCol(), this.lastCol())));

  protected readonly indexed = computed(() => !!this.pageSize() || !!this.virtualize());
  private readonly rowCount = computed(() =>
    this.pageSize() ? this.sortedEntries().length + 1 : this.virtualize() ? this.pageEntries().length + 1 : undefined,
  );

  protected readonly renderItems = computed<RenderItem[]>(() => {
    const total = this.pageEntries().length;
    const v = this.virtualize();
    if (!v) return this.pageEntries().map((_, index) => ({ kind: "row", index }) as RenderItem);
    const overscan = v.overscan ?? 3;
    const top = this.scrollTop();
    const start = Math.max(0, Math.floor(top / v.rowHeight) - overscan);
    const end = Math.min(total, Math.ceil((top + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    const active = this.activeRow();
    if (active >= 0 && active < total) indices.add(active);
    const items: RenderItem[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
      if (index - previous > 1) items.push({ kind: "spacer", rows: index - previous - 1, key: `spacer-${previous}` });
      items.push({ kind: "row", index });
      previous = index;
    }
    if (total - 1 - previous > 0) items.push({ kind: "spacer", rows: total - 1 - previous, key: `spacer-${previous}` });
    return items;
  });

  protected readonly scrollStyle = computed(() => {
    const v = this.virtualize();
    return v ? `height:${v.height}px;overflow:auto` : null;
  });

  private readonly selectedSet = computed(() => new Set(this.selected()));
  protected readonly allSelected = computed(() => this.sortedEntries().length > 0 && this.sortedEntries().every((e) => this.selectedSet().has(e.id)));
  protected readonly someSelected = computed(() => !this.allSelected() && this.sortedEntries().some((e) => this.selectedSet().has(e.id)));

  protected readonly footerContext = computed<DataGridFooterContext>(() => ({
    columns: this.visibleColumns(),
    rows: this.pageEntries().map((e) => e.row),
  }));

  protected readonly exportColumns = computed(() => this.visibleColumns().filter((c) => c.exportable !== false));
  protected readonly exportEntries = computed(() =>
    this.exportScope() === "selected" ? this.sortedEntries().filter((e) => this.selectedSet().has(e.id)) : this.sortedEntries(),
  );
  protected readonly hasExportButtons = computed(() => {
    const l = this.labels();
    return !!(l.exportCsv || l.exportTsv || l.exportExcel || l.copy);
  });

  constructor() {
    // The headless `lily-data-table` root renders a plain <table>: give it the grid's role and counts.
    effect(() => {
      const root = this.rootRef().nativeElement;
      const grid = this.isGrid();
      const count = this.rowCount();
      const busy = this.busy();
      this.sortedEntries();
      this.pageEntries();
      this.visibleColumns();
      this.scroll();
      afterNextRender(
        () => {
          const table = root.querySelector<HTMLElement>("table.data-table");
          if (!table) return;
          table.setAttribute("role", grid ? "grid" : "table");
          if (grid && count !== undefined) table.setAttribute("aria-rowcount", String(count));
          else table.removeAttribute("aria-rowcount");
          if (busy) table.setAttribute("aria-busy", "true");
          else table.removeAttribute("aria-busy");
        },
        { injector: this.injector },
      );
    });

    // What the grid renders, as far as labels go, so a missing one can be named in development.
    const reportedLabels = new Set<string>();
    effect(() => {
      const labels = this.labels();
      const columns = this.resolvedColumns();
      const features: LabelFeatures = {
        selection: this.selectionMode() !== "none",
        pagination: !!this.pageSize(),
        hidableColumns: columns.some((c) => c.hidable),
        resizableColumns: columns.some((c) => c.resizable),
        editing: columns.some((c) => c.editable),
        sorting: columns.some((c) => c.sortable),
        search: !!labels.search,
        exporting: !!(labels.exportCsv || labels.exportTsv || labels.exportExcel || labels.copy),
      };
      const warn = this.warnMissingLabels();
      const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
      if (!warn || env?.["NODE_ENV"] === "production") return;
      const fresh = missingLabels(features, labels as Record<string, unknown>).filter((m) => !reportedLabels.has(m.key));
      if (fresh.length === 0) return;
      for (const m of fresh) reportedLabels.add(m.key);
      const controls = fresh.filter((m) => m.kind === "control").map((m) => m.key);
      const announcements = fresh.filter((m) => m.kind === "announcement").map((m) => m.key);
      console.warn(
        `[data-grid] "${this.label()}": labels left out — ` +
          [controls.length ? `controls with no name: ${controls.join(", ")}` : "", announcements.length ? `silent announcements: ${announcements.join(", ")}` : ""].filter(Boolean).join("; "),
      );
    });

    // Widgets in body cells are not tab stops, so Tab leaves the grid in one step. Re-run whenever what is on screen changes.
    effect(() => {
      this.pageEntries();
      this.visibleColumns();
      this.isGrid();
      this.scrollTop();
      this.editingState();
      afterNextRender(() => this.normaliseWidgets(), { injector: this.injector });
    });

    // Persistence (view state only: widths, hidden columns, sort — never rows/selection).
    let restored = false;
    effect(() => {
      const key = this.storageKey();
      if (!key || restored) return;
      restored = true;
      untracked(() => this.restoreView(key));
    });
    effect(() => {
      const key = this.storageKey();
      const snapshot = { columnWidths: this.columnWidths(), hiddenColumnIds: [...this.hiddenColumnIds()], sort: this.sort() };
      if (!key || typeof localStorage === "undefined") return;
      try {
        localStorage.setItem(key, JSON.stringify(snapshot));
      } catch {
        // ignore quota / privacy errors
      }
    });
  }

  // ---- Announcements ----

  private announce(message: string | undefined): void {
    if (message) this.statusMessage.set(message);
  }

  // ---- Sorting ----

  protected ariaSortFor(column: DataGridColumn): DataGridSortDirection | null {
    if (!column.sortable) return null;
    if (this.sort().columnId === column.id) return this.sort().direction;
    return this.thenBy().find((k) => k.columnId === column.id)?.direction ?? "none";
  }

  /** 1 for the primary key, 2… for `thenBy`, only while more than one key is in force. */
  protected sortOrderFor(column: DataGridColumn): number | null {
    const keys = this.sortKeys();
    if (keys.length < 2) return null;
    const at = keys.findIndex((k) => k.column.id === column.id);
    return at === -1 ? null : at + 1;
  }

  protected toggleSort(column: DataGridColumn, additive = false): void {
    if (!column.sortable) return;
    const current = this.sort();
    if (additive && current.direction !== "none" && current.columnId && current.columnId !== column.id) {
      const thenBy = this.thenBy();
      const existing = thenBy.find((k) => k.columnId === column.id);
      const nextThen: DataGridSort[] = !existing
        ? [...thenBy, { columnId: column.id, direction: "ascending" }]
        : existing.direction === "ascending"
          ? thenBy.map((k) => (k.columnId === column.id ? { columnId: column.id, direction: "descending" as const } : k))
          : thenBy.filter((k) => k.columnId !== column.id);
      this.thenBy.set(nextThen);
      this.announce(this.labels().sortAnnouncement?.(column.header, nextThen.find((k) => k.columnId === column.id)?.direction ?? "none"));
      return;
    }
    if (this.thenBy().length > 0) this.thenBy.set([]);
    const next: DataGridSort =
      current.columnId !== column.id
        ? { columnId: column.id, direction: "ascending" }
        : current.direction === "ascending"
          ? { columnId: column.id, direction: "descending" }
          : current.direction === "descending"
            ? { columnId: "", direction: "none" }
            : { columnId: column.id, direction: "ascending" };
    this.sort.set(next);
    this.announce(this.labels().sortAnnouncement?.(column.header, next.direction));
  }

  // ---- Filtering ----

  protected setFilter(value: string): void {
    this.filter.set(value);
    this.page.set(1);
    this.announce(this.labels().filterAnnouncement?.(this.filteredEntries().length, this.rows().length));
  }

  /** Escape in the search field clears it. */
  protected onFilterKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    if (e.key === "Escape" && this.filter() !== "") {
      e.preventDefault();
      this.setFilter("");
    }
  }

  protected onFilterFieldChange(event: Event): void {
    this.filterField.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
    this.announce(this.labels().filterAnnouncement?.(this.filteredEntries().length, this.rows().length));
  }

  // ---- Selection ----

  protected isSelected(id: string): boolean {
    return this.selectedSet().has(id);
  }

  private setSelected(next: string[]): void {
    this.selected.set(next);
    this.announce(this.labels().selectionAnnouncement?.(next.length));
  }

  protected onRowSelectClick(index: number, event: Event): void {
    const e = event as MouseEvent;
    this.toggleRow(index, e);
  }

  /** `index` is the row's position in the sorted entries, not on the current page. */
  private toggleRow(index: number, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }): void {
    const sorted = this.sortedEntries();
    const id = sorted[index].id;
    const selected = this.selected();
    const mode = this.selectionMode();
    if (mode === "single") {
      this.setSelected(this.isSelected(id) ? [] : [id]);
    } else if (mode === "multiple") {
      if (event?.shiftKey && this.lastSelectedIndex >= 0) {
        const [start, end] = this.lastSelectedIndex < index ? [this.lastSelectedIndex, index] : [index, this.lastSelectedIndex];
        const range = sorted.slice(start, end + 1).map((e) => e.id);
        this.setSelected([...new Set([...selected, ...range])]);
      } else if (event?.ctrlKey || event?.metaKey) {
        this.setSelected(this.isSelected(id) ? selected.filter((x) => x !== id) : [...selected, id]);
      } else {
        this.setSelected(this.isSelected(id) && selected.length === 1 ? [] : [id]);
      }
    }
    this.lastSelectedIndex = index;
  }

  protected toggleSelectAll(): void {
    if (this.allSelected()) this.setSelected([]);
    else this.setSelected(this.sortedEntries().map((e) => e.id));
  }

  // ---- Column resize ----

  protected widthFor(column: DataGridColumn): number | undefined {
    return this.columnWidths()[column.id] ?? column.width;
  }

  /** Inline style of a column's cells: its width, and its alignment where one is set. */
  protected cellStyle(column: DataGridColumn): string | null {
    const parts: string[] = [];
    const width = this.widthFor(column);
    if (width) parts.push(`width:${width}px`);
    if (column.align) parts.push(`text-align:${column.align}`);
    return parts.length > 0 ? parts.join(";") : null;
  }

  private setWidth(column: DataGridColumn, width: number): void {
    this.columnWidths.update((current) => ({ ...current, [column.id]: Math.max(MIN_COLUMN_WIDTH, width) }));
  }

  protected onResizeKeydown(column: DataGridColumn, event: Event): void {
    const e = event as KeyboardEvent;
    // The resize handle is its own tab stop outside the grid's roving-tabindex system — every key here must stop.
    e.stopPropagation();
    const current = this.widthFor(column) ?? 120;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this.setWidth(column, current + RESIZE_STEP);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.setWidth(column, current - RESIZE_STEP);
    }
  }

  protected onResizePointerDown(column: DataGridColumn, event: Event): void {
    const e = event as PointerEvent;
    e.preventDefault();
    const startX = e.clientX;
    const target = e.target as HTMLElement;
    const startWidth = this.widthFor(column) ?? target.closest("th")?.getBoundingClientRect().width ?? 120;
    target.setPointerCapture?.(e.pointerId);
    const onMove = (moveEvent: PointerEvent): void => this.setWidth(column, startWidth + (moveEvent.clientX - startX));
    const onUp = (): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // ---- Column visibility, pagination ----

  protected toggleColumnVisibility(columnId: string): void {
    this.hiddenColumnIds.update((current) => {
      const next = new Set(current);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }

  protected goToPage(next: number): void {
    const target = Math.min(Math.max(next, 1), this.pageCount());
    if (target === this.clampedPage()) return;
    this.page.set(target);
    this.announce(this.labels().pageAnnouncement?.(target, this.pageCount()));
  }

  // ---- Column reorder ----

  /** Move `columnId` to sit at `toVisibleIndex` among the visible columns. Returns whether it moved. */
  private moveColumn(columnId: string, toVisibleIndex: number): boolean {
    const ids = this.visibleColumns().map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toVisibleIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
    const visibleSet = new Set(ids);
    let next = 0;
    this.columnOrder.set(this.orderedColumns().map((c) => (visibleSet.has(c.id) ? ids[next++] : c.id)));
    const column = this.resolvedColumns().find((c) => c.id === columnId)!;
    this.announce(this.labels().columnMoveAnnouncement?.(column.header, to + 1, ids.length));
    return true;
  }

  protected onHeaderDragStart(column: DataGridColumn, event: Event): void {
    if (!column.movable) return;
    this.draggingColumnId = column.id;
    (event as DragEvent).dataTransfer?.setData("text/plain", column.id);
  }

  protected onHeaderDragOver(event: Event): void {
    if (this.draggingColumnId) event.preventDefault();
  }

  protected onHeaderDrop(targetId: string, event: Event): void {
    event.preventDefault();
    const id = this.draggingColumnId;
    this.draggingColumnId = null;
    if (!id || id === targetId) return;
    const to = this.visibleColumns().findIndex((c) => c.id === targetId);
    if (to >= 0) this.moveColumn(id, to);
  }

  // ---- Windowing ----

  protected onScroll(event: Event): void {
    if (this.virtualize()) this.scrollTop.set((event.currentTarget as HTMLElement).scrollTop);
  }

  /** Bring a body row into the scroll region. */
  private revealRow(index: number): void {
    const v = this.virtualize();
    if (!v || index < 0) return;
    const top = index * v.rowHeight;
    const current = this.scrollTop();
    let next = current;
    if (top < current) next = top;
    else if (top + v.rowHeight > current + v.height) next = top + v.rowHeight - v.height;
    if (next === current) return;
    this.scrollTop.set(next);
    const el = this.scrollRef()?.nativeElement;
    if (el) el.scrollTop = next;
  }

  // ---- Focus ----

  private focusActiveCell(): void {
    afterNextRender(
      () => {
        this.rootRef().nativeElement
          .querySelector<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]')
          ?.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }

  private moveFocus(row: number, col: number): void {
    const nextRow = Math.min(Math.max(row, -1), this.pageEntries().length - 1);
    this.focusedRow.set(nextRow);
    this.focusedCol.set(Math.min(Math.max(col, 0), this.lastCol()));
    this.revealRow(nextRow);
    this.focusActiveCell();
  }

  // ---- Export ----

  /** One cell for an export: typed values stay typed, everything else is the text the grid shows. */
  private exportCell(column: DataGridColumn, row: DataGridRow): unknown {
    if (column.exportValue) return column.exportValue(row);
    const ctx = this.cellFor(column, row);
    const value = ctx.value;
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
    return ctx.formatted;
  }

  private hasUtcColumn(c: DataGridColumn): boolean {
    return c.type === "time-zone" && !!c.exportUtc && !!c.referenceDate && !!this.labels().exportUtcHeader;
  }

  private buildExportTable(format: ExportFormat) {
    const live = (c: DataGridColumn) => format === "xlsx" && this.exportFormulas() && c.type === "formula" && !!c.source;
    const headers: string[] = [];
    for (const c of this.exportColumns()) {
      headers.push(c.header);
      if (this.hasUtcColumn(c)) headers.push(this.labels().exportUtcHeader!(c.header));
    }
    const rows = this.exportEntries().map((entry) => {
      const cells: unknown[] = [];
      for (const c of this.exportColumns()) {
        const expression = live(c) ? c.source!(entry.row) : undefined;
        cells.push(
          typeof expression === "string" && expression !== "" && !c.errorOf?.(entry.row)
            ? { formula: expression, result: this.exportCell(c, entry.row) }
            : this.exportCell(c, entry.row),
        );
        if (this.hasUtcColumn(c)) cells.push(zonedUtcTime(this.cellFor(c, entry.row).value, c.referenceDate));
      }
      return cells;
    });
    return { headers, rows };
  }

  /** Copy the export (what a download would hold) to the clipboard as tab-separated text. `copyHandler` may return false to take over. */
  protected async runCopy(): Promise<void> {
    const table = this.buildExportTable("tsv");
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    this.copy.emit(copied);
    if (this.copyHandler()?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    this.announce(ok ? this.labels().copyAnnouncement?.(table.rows.length) : this.labels().copyFailed);
  }

  protected runExport(format: ExportFormat): void {
    const table = this.buildExportTable(format);
    const rows = table.rows;
    const name = this.exportFilename();
    const filename = exportFilename(name, format);
    const blob = exportBlob(table, format, { sheetName: name });
    const file: DataGridExport = { format, filename, rowCount: rows.length, blob };
    this.exportFile.emit(file);
    if (this.exportHandler()?.(file) === false) return;
    downloadBlob(blob, filename);
    this.announce(this.labels().exportAnnouncement?.(format, rows.length, filename));
  }

  // ---- Files ----

  /** Files dropped on an editable file cell: the same report as the file input. The grid uploads nothing. */
  protected onFileDragOver(column: DataGridColumn, event: Event): void {
    if (column.type !== "file" || !column.editable) return;
    if (Array.from((event as DragEvent).dataTransfer?.types ?? []).includes("Files")) event.preventDefault();
  }

  protected onFileDrop(entry: DataGridEntry, column: DataGridColumn, event: Event): void {
    if (column.type !== "file" || !column.editable) return;
    const dropped = Array.from((event as DragEvent).dataTransfer?.files ?? []);
    if (dropped.length === 0) return;
    event.preventDefault();
    const files = column.multiple === false ? dropped.slice(0, 1) : dropped;
    this.filesSelected.emit({ rowId: entry.id, row: entry.row, columnId: column.id, files });
  }

  protected onFileInput(entry: DataGridEntry, column: DataGridColumn, event: Event): void {
    const input = event.target as HTMLInputElement;
    const chosen = Array.from(input.files ?? []);
    if (chosen.length > 0) this.filesSelected.emit({ rowId: entry.id, row: entry.row, columnId: column.id, files: chosen });
    input.value = "";
  }

  // ---- Cell editing ----

  /** A cell the person can edit through the grid's edit model (not a rollup, a file cell with its own widgets, or a person cell with no editor). */
  protected isEditable(column: DataGridColumn): boolean {
    if (!column.editable) return false;
    if (column.type === "rollup" || column.type === "file") return false;
    if (column.type === "person" && !column.personEditor) return false;
    return true;
  }

  protected isEditingCell(entry: DataGridEntry, column: DataGridColumn): boolean {
    const e = this.editingState();
    return !!e && e.rowId === entry.id && e.columnId === column.id;
  }

  protected startEdit(entry: DataGridEntry, column: DataGridColumn): void {
    if (!this.isEditable(column)) return;
    // A formula's editor shows the expression the row holds, not the result.
    const raw = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    if (column.type === "time-zone") {
      const zoned = isZonedTime(raw) ? raw : null;
      this.editingState.set({ rowId: entry.id, columnId: column.id, draft: zoned?.time ?? "", zone: zoned?.timeZone ?? column.timeZones?.[0]?.id ?? "" });
    } else {
      const text = column.type === "link" ? (linkParts(raw)?.href ?? "") : raw === null || raw === undefined ? "" : String(raw);
      this.editingState.set({ rowId: entry.id, columnId: column.id, draft: text });
    }
    afterNextRender(
      () => {
        const editor = this.rootRef().nativeElement.querySelector<HTMLInputElement | HTMLSelectElement>(".data-grid-cell-editor");
        editor?.focus();
        if (editor instanceof HTMLInputElement && editor.type === "text") editor.select();
      },
      { injector: this.injector },
    );
  }

  private parseDraft(column: DataGridColumn, row: DataGridRow, draft: string, zone?: string): unknown {
    if (column.parse) return column.parse(draft, row);
    if (column.type === "time-zone") return draft === "" ? null : { time: draft, timeZone: zone ?? "" };
    if (column.editor === "number") return draft.trim() === "" ? null : Number(draft);
    if (column.editor === "date" || column.editor === "time" || column.editor === "select") return draft === "" ? null : draft;
    return draft;
  }

  /** Two link values with the same address and label are the same edit. */
  /** Accepted cell edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through the `cellEdit` output like any edit. */
  private history: EditHistory = EMPTY_HISTORY;

  /** Put an earlier cell value back, or re-apply it, through `cellEdit`. */
  private stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(this.history) : redoEdit(this.history);
    if (!step.record) return;
    this.history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const entry = this.entries().find((e) => e.id === ownerId);
    const column = this.resolvedColumns().find((c) => c.id === fieldId);
    if (!entry || !column) return;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    this.cellEdit.emit({ rowId: entry.id, row: entry.row, columnId: column.id, value: restored, previous: replaced });
    const text = column.format ? column.format(restored, entry.row) : String(restored ?? "");
    this.announce((direction === "undo" ? this.labels().undoAnnouncement : this.labels().redoAnnouncement)?.(column.header, text));
  }

  private isStructurallyEqual(a: unknown, b: unknown): boolean {
    return typeof a === "object" && typeof b === "object" && a !== null && b !== null && JSON.stringify(a) === JSON.stringify(b);
  }

  /** Validate and report one new value for a cell. Returns false (and keeps editing, if the editor is open) when it is refused. */
  protected commitValue(entry: DataGridEntry, column: DataGridColumn, value: unknown): boolean {
    const message = column.validate?.(value, entry.row);
    const invalidType = isInvalidForType(column, value);
    if (message || invalidType) {
      const text = message ?? this.labels().invalidValue?.(column.header, column.type ?? "") ?? "";
      const current = this.editingState();
      if (current) this.editingState.set({ ...current, error: text || undefined, invalid: true });
      this.announce(this.labels().editError?.(column.header, text));
      return false;
    }
    const previous = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    this.editingState.set(null);
    if (value !== previous && !this.isStructurallyEqual(value, previous)) {
      this.history = recordEdit(this.history, { ownerId: entry.id, fieldId: column.id, value, previous });
      this.cellEdit.emit({ rowId: entry.id, row: entry.row, columnId: column.id, value, previous });
      this.announce(this.labels().editAnnouncement?.(column.header, column.format ? column.format(value, entry.row) : String(value ?? "")));
    }
    return true;
  }

  private commitEdit(): void {
    const current = this.editingState();
    if (!current) return;
    const entry = this.entries().find((e) => e.id === current.rowId);
    const column = this.resolvedColumns().find((c) => c.id === current.columnId);
    if (!entry || !column) {
      this.editingState.set(null);
      return;
    }
    if (this.commitValue(entry, column, this.parseDraft(column, entry.row, current.draft, current.zone))) this.focusActiveCell();
  }

  private cancelEdit(): void {
    const current = this.editingState();
    if (!current) return;
    this.editingState.set(null);
    const column = this.resolvedColumns().find((c) => c.id === current.columnId);
    if (column) this.announce(this.labels().editCancelAnnouncement?.(column.header));
    this.focusActiveCell();
  }

  protected onEditorKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    // The editor owns its keys; none may reach the grid's own handler.
    e.stopPropagation();
    // While an input method is composing, Enter picks the candidate and Escape cancels the composition:
    // neither commits nor cancels the edit. Some browsers report the confirming Enter with `isComposing`
    // already false, but keyCode 229.
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") {
      e.preventDefault();
      this.commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.cancelEdit();
    }
  }

  protected onEditorBlur(): void {
    if (this.editingState()) this.commitEdit();
  }

  /** Focus leaving the time-zone editor's pair (not moving between its two controls) commits. */
  protected onZonedFocusout(event: Event): void {
    const e = event as FocusEvent;
    if (this.editingState() && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) this.commitEdit();
  }

  protected setDraft(event: Event): void {
    const current = this.editingState();
    if (current) this.editingState.set({ ...current, draft: (event.target as HTMLInputElement | HTMLSelectElement).value, error: undefined, invalid: false });
  }

  protected setZone(event: Event): void {
    const current = this.editingState();
    if (current) this.editingState.set({ ...current, zone: (event.target as HTMLSelectElement).value, error: undefined, invalid: false });
  }

  protected personEditorContext(entry: DataGridEntry, column: DataGridColumn, ctx: DataGridCellContext): DataGridPersonEditorContext {
    return { value: ctx.value, commit: (v: unknown) => void this.commitValue(entry, column, v), cancel: () => this.cancelEdit() };
  }

  // ---- Keyboard (WAI-ARIA APG Grid pattern) ----

  private activateFocusedCell(): void {
    if (this.activeCol() === 0 && this.hasSelection()) {
      if (this.activeRow() === -1) {
        if (this.selectionMode() === "multiple") this.toggleSelectAll();
      } else {
        this.toggleRow(this.pageStart() + this.activeRow());
      }
      return;
    }
    const column = this.visibleColumns()[this.activeCol() - this.colOffset()];
    if (!column) return;
    if (this.activeRow() === -1) this.toggleSort(column);
  }

  /** The widgets a consumer put in a body cell (never the grid's own controls). */
  private widgetsIn(cell: Element): HTMLElement[] {
    return Array.from(cell.querySelectorAll<HTMLElement>(WIDGET_SELECTOR)).filter((el) => !el.closest("[data-grid-own]"));
  }

  private setWidgetTabindex(cell: Element, value: "0" | "-1"): void {
    for (const widget of this.widgetsIn(cell)) widget.setAttribute("tabindex", value);
  }

  private normaliseWidgets(): void {
    if (!this.isGrid()) return;
    for (const cell of this.rootRef().nativeElement.querySelectorAll(".data-table-body [data-row][data-col]")) {
      if (cell.getAttribute("data-grid-entered") === "true") continue;
      this.setWidgetTabindex(cell, "-1");
    }
  }

  /** Focus the first widget of a cell; its widgets are tab stops while focus stays inside it. */
  private enterCell(cell: HTMLElement): boolean {
    const first = this.widgetsIn(cell)[0];
    if (!first) return false;
    cell.setAttribute("data-grid-entered", "true");
    this.setWidgetTabindex(cell, "0");
    first.focus();
    return true;
  }

  private leaveCell(cell: Element): void {
    if (cell.getAttribute("data-grid-entered") !== "true") return;
    cell.removeAttribute("data-grid-entered");
    this.setWidgetTabindex(cell, "-1");
  }

  /** Pointer or programmatic focus on a cell moves the roving position to it. */
  protected onGridFocusin(event: Event): void {
    if (!this.isGrid()) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    this.focusedRow.set(Number(cell.dataset["row"]));
    this.focusedCol.set(Number(cell.dataset["col"]));
    // Focus arriving on a widget (a click, or Tab inside the cell) makes the cell's widgets tab stops.
    if (target !== cell && !target.closest("[data-grid-own]") && cell.closest(".data-table-body")) {
      cell.setAttribute("data-grid-entered", "true");
      this.setWidgetTabindex(cell, "0");
    }
  }

  protected onGridFocusout(event: Event): void {
    if (!this.isGrid()) return;
    const e = event as FocusEvent;
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const next = e.relatedTarget as Node | null;
    if (next && cell.contains(next)) return;
    this.leaveCell(cell);
  }

  /** A click on a body cell, outside any widget, activates its row. */
  protected onGridClick(event: Event): void {
    if (!this.activateRows()) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head")) return;
    if (target.closest(WIDGET_SELECTOR) || target.closest("[data-grid-own]")) return;
    const entry = this.pageEntries()[Number(cell.dataset["row"])];
    if (entry) this.rowActivate.emit({ row: entry.row, id: entry.id });
  }

  /** A double click on an editable body cell starts editing it. */
  protected onGridDblclick(event: Event): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head") || target.closest("input, button, select, textarea")) return;
    const entry = this.pageEntries()[Number(cell.dataset["row"])];
    const column = this.visibleColumns()[Number(cell.dataset["col"]) - this.colOffset()];
    if (entry && column && this.isEditable(column)) this.startEdit(entry, column);
  }

  private typeahead: TypeaheadState = { prefix: "", at: 0 };

  protected onGridKeydown(event: Event): void {
    if (!this.isGrid()) return;
    const e = event as KeyboardEvent;
    const target = e.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    // A key pressed on a widget inside a cell belongs to the widget: the caret moves in a field, a select
    // opens, a link follows. Only Escape is the grid's, and it hands focus back to the cell.
    if (target !== cell && !target.closest("[data-grid-own]")) {
      if (e.key === "Escape") {
        e.preventDefault();
        cell.focus({ preventScroll: true });
      }
      return;
    }
    const activeRow = this.activeRow();
    const activeCol = this.activeCol();
    const colOffset = this.colOffset();
    // In a right-to-left layout the horizontal arrows swap: ArrowLeft goes to the next cell (`key` is the logical key).
    const key = logicalKey(e.key, isRtl(cell));
    if (e.altKey && activeRow === -1 && (key === "ArrowRight" || key === "ArrowLeft")) {
      const column = this.visibleColumns()[activeCol - colOffset];
      if (column && this.isMovable(column)) {
        e.preventDefault();
        const delta = key === "ArrowRight" ? 1 : -1;
        if (this.moveColumn(column.id, activeCol - colOffset + delta)) this.moveFocus(-1, activeCol + delta);
        return;
      }
    }
    const historyAction = target === cell && this.resolvedColumns().some((c) => c.editable) ? historyKey(e) : null;
    if (historyAction) {
      e.preventDefault();
      this.stepHistory(historyAction);
      return;
    }
    // Type-ahead in the focused column: letters typed in quick succession move to the next row whose cell text starts with them.
    if (isTypeaheadKey(e) && target === cell && activeRow >= 0) {
      const column = this.visibleColumns()[activeCol - colOffset];
      if (column) {
        const state = nextTypeaheadState(this.typeahead, e.key, Date.now(), 700);
        const hit = findTypeaheadMatch(this.pageEntries().map((entry) => this.cellFor(column, entry.row).formatted), activeRow, state.prefix);
        if (hit !== -1) {
          this.typeahead = state;
          e.preventDefault();
          this.moveFocus(hit, activeCol);
          return;
        }
      }
    }
    const move = gridMove(
      e,
      { row: activeRow, col: activeCol },
      { firstRow: -1, lastRow: this.pageEntries().length - 1, lastCol: this.lastCol(), pageStep: this.pageSize() ?? 10, rtl: isRtl(cell) },
    );
    if (move) {
      e.preventDefault();
      this.moveFocus(move.row, move.col);
      return;
    }
    switch (key) {
      case "F2": {
        const entry = this.pageEntries()[Number(cell.dataset["row"])];
        const column = this.visibleColumns()[Number(cell.dataset["col"]) - colOffset];
        if (target === cell && entry && column && this.isEditable(column)) {
          e.preventDefault();
          this.startEdit(entry, column);
        }
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        if (e.key === "Enter" && target === cell && cell.closest(".data-table-body")) {
          const entry = this.pageEntries()[Number(cell.dataset["row"])];
          const column = this.visibleColumns()[Number(cell.dataset["col"]) - colOffset];
          if (entry && column && this.isEditable(column)) {
            this.startEdit(entry, column);
            break;
          }
        }
        if (target === cell && cell.closest(".data-table-body") && !cell.querySelector("[data-grid-own]")) {
          // A cell with a widget in it is entered; one without activates its row.
          if (this.enterCell(cell)) break;
          if (e.key === "Enter" && this.activateRows()) {
            const entry = this.pageEntries()[Number(cell.dataset["row"])];
            if (entry) this.rowActivate.emit({ row: entry.row, id: entry.id });
            break;
          }
        }
        this.activateFocusedCell();
        break;
    }
  }

  // ---- Persistence ----

  private restoreView(key: string): void {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as { columnWidths?: Record<string, number>; hiddenColumnIds?: string[]; sort?: DataGridSort };
        if (saved.columnWidths) this.columnWidths.set(saved.columnWidths);
        if (saved.hiddenColumnIds) this.hiddenColumnIds.set(new Set(saved.hiddenColumnIds));
        if (saved.sort) this.sort.set(saved.sort);
      }
    } catch {
      // ignore quota / privacy / parse errors
    }
  }

  // ---- Template helpers ----

  protected rowLabelOf(entry: DataGridEntry): string {
    const first = this.visibleColumns()[0];
    return first ? this.cellFor(first, entry.row).formatted : entry.id;
  }

  protected cellClassOf(column: DataGridColumn, ctx: DataGridCellContext): string {
    const extra = typeof column.cellClass === "function" ? column.cellClass(ctx) : column.cellClass;
    return extra ?? "";
  }

  protected peopleIn(value: unknown): DataGridPerson[] {
    return peopleOf(value);
  }

  protected shownPeople(column: DataGridColumn, value: unknown): DataGridPerson[] {
    const people = peopleOf(value);
    return column.maxPeople !== undefined ? people.slice(0, Math.max(0, column.maxPeople)) : people;
  }

  protected nameOf(person: DataGridPerson): string {
    return personName(person);
  }

  protected filesIn(value: unknown): DataGridFile[] {
    return filesOf(value);
  }

  protected linkIn(value: unknown): DataGridLink | null {
    return linkParts(value);
  }

  protected hrefOf(href: string | undefined): string | null {
    return href === undefined ? null : safeHref(href);
  }

  protected stringOf(value: unknown): string {
    return String(value);
  }

  protected ungroupedOptions(column: DataGridColumn): DataGridOption[] {
    return (column.options ?? []).filter((o) => !o.group);
  }

  protected groupsOf(column: DataGridColumn): string[] {
    return [...new Set((column.options ?? []).filter((o) => o.group).map((o) => o.group as string))];
  }

  protected optionsInGroup(column: DataGridColumn, group: string): DataGridOption[] {
    return (column.options ?? []).filter((o) => o.group === group);
  }
}

export default DataGrid;
