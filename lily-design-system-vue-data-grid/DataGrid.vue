<script lang="ts">
// DataGrid (Vue helper). A Vue 3 port of the canonical Svelte data grid; the
// contract is that package's spec/index.md. Types and module-level helpers
// live here so they can be exported; the component is the <script setup>.
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

/** What `exportHandler` and the `export-file` event receive, before the file is saved. */
export type DataGridExport = {
    format: ExportFormat;
    /** The file name, with its extension. */
    filename: string;
    /** How many data rows (the header is not counted). */
    rowCount: number;
    /** The file. */
    blob: Blob;
};

/** Arguments a column's `cell` render function receives. */
export type DataGridCellContext = {
    value: unknown;
    formatted: string;
    row: DataGridRow;
    column: DataGridColumn;
};

/** What the `cell-edit` event carries after a cell edit is committed. */
export type DataGridCellEdit = {
    rowId: string;
    row: DataGridRow;
    columnId: string;
    /** The parsed new value (a number for the `"number"` editor, the text otherwise). */
    value: unknown;
    /** The cell's value before the edit. */
    previous: unknown;
};

/** A Vue render result: a vnode, a string, or an array of them (what `h()` returns). */
export type DataGridNode = unknown;

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
    /** Pins the column to one side: its header and cells get `data-pinned="start"` / `"end"` for the consumer's `position: sticky` CSS. */
    pinned?: "start" | "end";
    /** Set `false` to leave the column out of an export. Default true. */
    exportable?: boolean;
    /** The value this column exports for a row. */
    exportValue?: (row: DataGridRow) => unknown;
    /** Column can be hidden via the column-visibility control. */
    hidable?: boolean;
    /** Initial pixel width, meaningful only when `resizable`. */
    width?: number;
    /** Custom cell renderer (return a vnode from `h()`). Defaults to the formatted value as text. */
    cell?: (ctx: DataGridCellContext) => DataGridNode;
    /** The header's content in place of the `header` text. `header` stays the accessible name. */
    headerCell?: (ctx: { column: DataGridColumn }) => DataGridNode;
    /** Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button `labels.editCell` gates. */
    editable?: boolean;
    /** The editor's control. Default `"text"`; a `type` sets its own. */
    editor?: "text" | "number" | "link" | "date" | "time" | "time-zone" | "select" | "radio" | "person" | "formula";
    /** The kind of value in this column: a bundle of defaults for `format`, `compare`, `filterText`, `exportValue`, `align` and `editor`. */
    type?: DataGridCellType;
    /** Shown instead of nothing when this column's value is missing (`null`, `undefined` or `""`). Overrides the grid's `emptyValue`. A missing value always carries `data-empty` on its cell. */
    emptyValue?: string;
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
    cellAttrs?: (ctx: DataGridCellContext) => Record<string, unknown>;
};

/**
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback. See the Svelte canonical's spec/index.md §5.
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

export type Props = {
    /** Accessible name for the grid, passed through to DataTable. */
    label: string;
    /** Optional visible caption, passed through to DataTable. */
    caption?: string;
    /** Column definitions. */
    columns: DataGridColumn[];
    /** Row data. */
    rows: DataGridRow[];
    /** BCP 47 locale for the typed columns' formatting and collation, and for sorting plain text: with a locale, text sorts with `Intl.Collator(locale, { numeric: true })`. Never defaulted: with none, values show as stored and text sorts by code point. */
    locale?: string;
    /** What a cell shows when its value is missing (`null`, `undefined` or `""`), for example `"—"`. A column's own `emptyValue` wins. No default: Lily ships no text. The cell always carries `data-empty`, and an export is unaffected. */
    emptyValue?: string;
    /** In development, log (once per grid) the labels the grid's features call for but `labels` leaves out. Default `true`; it never logs in production. */
    warnMissingLabels?: boolean;
    /** Where missing values sort: `"last"` (default, in both directions) or `"first"`. */
    nulls?: "first" | "last";
    /** Make every column movable (Alt+Arrow on its header, or drag it) unless its own `movable` is `false`. Default `false`. */
    movableColumns?: boolean;
    /** Hides rows for which it returns false (a status or date-range filter). Combines with the text filter; both must pass. */
    rowFilter?: (row: DataGridRow) => boolean;
    /** Derives a stable id per row. Defaults to the row's index in `rows`. */
    rowId?: (row: DataGridRow, index: number) => string;
    /** Row selection mode. */
    selectionMode?: DataGridSelectionMode;
    /** Rows per page. Unset disables pagination. */
    pageSize?: number;
    /** If set, persist column widths / hidden columns / sort to localStorage. */
    storageKey?: string;
    /** User-facing strings. */
    labels?: DataGridLabels;
    /** `"grid"` (default): roving-tabindex grid. `"table"`: a plain table with ordinary tab stops. */
    mode?: "grid" | "table";
    /** Extra class on each body row. */
    rowClass?: (row: DataGridRow) => string;
    /** Extra attributes on each body row. */
    rowAttrs?: (row: DataGridRow) => Record<string, unknown>;
    /** Sets `aria-busy` on the table. */
    busy?: boolean;
    /** Wrap the table in a scrollable `data-grid-scroll` region. Default true. */
    scroll?: boolean;
    /** The file name without its extension. Default `"data-grid"`. */
    exportFilename?: string;
    /** What an export holds: `"view"` (default) or `"selected"`. */
    exportScope?: "view" | "selected";
    /** `.xlsx` only: a `formula` column keeps the live expression with the result cached. */
    exportFormulas?: boolean;
    /** Called with the file before it is saved. Return `false` to keep the grid from saving it. */
    exportHandler?: (file: DataGridExport) => boolean | void;
    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` event fires first. */
    copyHandler?: (copy: { text: string; rowCount: number }) => boolean | void;
    /** Renders only the rows in view, in a scroll region of `height` px (needs `scroll`). */
    virtualize?: { rowHeight: number; height: number; overscan?: number };
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextDataGridId(): string {
    uid += 1;
    return `data-grid-${uid}`;
}

/** What counts as a widget inside a cell: something a person can operate. */
const WIDGET_SELECTOR = 'a[href], button, input, select, textarea, summary, [contenteditable="true"]';

const MIN_COLUMN_WIDTH = 40;
const RESIZE_STEP = 16;

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

/** A missing value: `null`, `undefined` or an empty string. */
const isMissing = (value: unknown): boolean => value === null || value === undefined || value === "";

/** Renders a vnode a column's render function returned. */
const RenderNode = (props: { node: unknown }) => props.node as never;
RenderNode.props = ["node"];

/** Renders its default slot and nothing else (the table when there is no scroll region around it). */
const Passthrough = (_props: unknown, ctx: { slots: { default?: () => unknown } }) => ctx.slots.default?.() as never;
Passthrough.inheritAttrs = false;
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, shallowRef, watch } from "vue";
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
} from "@lilydesignsystem/vue-headless";

const props = withDefaults(defineProps<Props>(), {
    caption: undefined,
    locale: undefined,
    emptyValue: undefined,
    warnMissingLabels: true,
    nulls: "last",
    movableColumns: false,
    rowFilter: undefined,
    copyHandler: undefined,
    rowId: (_row: DataGridRow, index: number) => String(index),
    selectionMode: "none",
    pageSize: undefined,
    storageKey: undefined,
    labels: () => ({}),
    mode: "grid",
    rowClass: undefined,
    rowAttrs: undefined,
    busy: false,
    scroll: true,
    exportFilename: "data-grid",
    exportScope: "view",
    exportFormulas: false,
    exportHandler: undefined,
    virtualize: undefined,
});

/** Selected row ids (`v-model:selected`). */
const selected = defineModel<string[]>("selected", { default: () => [] });
/** Text filter (`v-model:filter`). */
const filter = defineModel<string>("filter", { default: "" });
/** Limits the text filter to one column: a column id, or `""` for every filterable column (`v-model:filterField`). */
const filterField = defineModel<string>("filterField", { default: "" });
/** Further sort keys after `sort`, for ties: Shift+click on another sortable header adds it (`v-model:thenBy`). */
const thenBy = defineModel<DataGridSort[]>("thenBy", { default: () => [] });
/** Current sort (`v-model:sort`). */
const sort = defineModel<DataGridSort>("sort", { default: () => ({ columnId: "", direction: "none" }) });
/** Column ids in display order (`v-model:columnOrder`); columns it does not name follow in their `columns` order. */
const columnOrder = defineModel<string[]>("columnOrder", { default: () => [] });
/** Current 1-indexed page (`v-model:page`). */
const page = defineModel<number>("page", { default: 1 });

const emit = defineEmits<{
    (event: "cell-edit", edit: DataGridCellEdit): void;
    (event: "files-selected", payload: { rowId: string; row: DataGridRow; columnId: string; files: File[] }): void;
    (event: "file-remove", payload: { rowId: string; row: DataGridRow; columnId: string; fileId: string }): void;
    (event: "row-activate", row: DataGridRow, id: string): void;
    (event: "export-file", file: DataGridExport): void;
    (event: "copy", copy: { text: string; rowCount: number }): void;
}>();

defineSlots<{
    empty?: () => unknown;
    footer?: (ctx: { columns: DataGridColumn[]; rows: DataGridRow[] }) => unknown;
}>();

// The listener's presence changes behaviour (Enter on a cell, a click on a row), so it is read from the vnode.
const hasRowActivate = !!(getCurrentInstance()?.vnode.props as Record<string, unknown> | null)?.onRowActivate;
// Undo and redo only mean something when the consumer listens for edits, so the listener's presence is read from the vnode too.
const hasCellEdit = !!(getCurrentInstance()?.vnode.props as Record<string, unknown> | null)?.onCellEdit;

// Each column with its type's defaults filled in under its own props.
const columns = computed(() => props.columns.map((c) => resolveColumn(c, props.locale, props.rows)));

const gridId = nextDataGridId();
const isGrid = computed(() => props.mode === "grid");

const rootEl = ref<HTMLDivElement | null>(null);
const statusMessage = ref("");
const hiddenColumnIds = shallowRef<Set<string>>(new Set());
const columnWidths = shallowRef<Record<string, number>>({});
const focusedRow = ref(-1); // -1 = header row
const focusedCol = ref(0);
let lastSelectedIndex = -1; // index into sortedEntries, not into the page

const hasSelection = computed(() => props.selectionMode !== "none");
const colOffset = computed(() => (hasSelection.value ? 1 : 0));

// Columns in display order: those named in `columnOrder` first, the rest after in their own order.
const orderedColumns = computed(() => {
    if (columnOrder.value.length === 0) return columns.value;
    const order = columnOrder.value;
    const rank = (id: string) => {
        const i = order.indexOf(id);
        return i === -1 ? order.length : i;
    };
    return columns.value
        .map((c, i) => ({ c, i }))
        .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
        .map((x) => x.c);
});
const visibleColumns = computed(() => orderedColumns.value.filter((c) => !hiddenColumnIds.value.has(c.id)));
/** A column the user can move: its own `movable`, else the grid's `movableColumns`. */
const isMovable = (column: DataGridColumn): boolean => column.movable ?? props.movableColumns;

// What the grid renders, as far as labels go, so a missing one can be named in development.
const labelFeatures = computed<LabelFeatures>(() => ({
    selection: props.selectionMode !== "none",
    pagination: !!props.pageSize,
    hidableColumns: columns.value.some((c) => c.hidable),
    resizableColumns: columns.value.some((c) => c.resizable),
    editing: hasCellEdit,
    sorting: columns.value.some((c) => c.sortable),
    search: !!props.labels.search,
    exporting: !!(props.labels.exportCsv || props.labels.exportTsv || props.labels.exportExcel || props.labels.copy),
}));
const reportedLabels = new Set<string>();
watch(
    [labelFeatures, () => props.labels, () => props.warnMissingLabels],
    () => {
        const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
        if (!props.warnMissingLabels || env?.NODE_ENV === "production") return;
        const fresh = missingLabels(labelFeatures.value, props.labels as Record<string, unknown>).filter((m) => !reportedLabels.has(m.key));
        if (fresh.length === 0) return;
        for (const m of fresh) reportedLabels.add(m.key);
        const controls = fresh.filter((m) => m.kind === "control").map((m) => m.key);
        const announcements = fresh.filter((m) => m.kind === "announcement").map((m) => m.key);
        console.warn(
            `[data-grid] "${props.label}": labels left out — ` +
                [controls.length ? `controls with no name: ${controls.join(", ")}` : "", announcements.length ? `silent announcements: ${announcements.join(", ")}` : ""].filter(Boolean).join("; "),
        );
    },
    { immediate: true, flush: "post" },
);

const hidableColumns = computed(() => columns.value.filter((c) => c.hidable));

type Entry = { row: DataGridRow; id: string };

// Each cell's value and formatted text, read once per row object and column (the accessor and formatter are the
// consumer's code and may be costly). Reset when `columns` changes, so a new accessor or formatter is picked up.
const cellCache = computed(() => {
    void columns.value;
    return new WeakMap<DataGridRow, Map<string, DataGridCellContext>>();
});
function cellFor(column: DataGridColumn, row: DataGridRow): DataGridCellContext {
    const cache = cellCache.value;
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

const entries = computed<Entry[]>(() => props.rows.map((row, index) => ({ row, id: props.rowId(row, index) })));

// One folded (lower-case, no diacritics) text per filterable cell, built once per rows/columns change.
const filterableColumns = computed(() => columns.value.filter((c) => c.filterable !== false));
const searchIndex = computed(() =>
    entries.value.map((entry) =>
        filterableColumns.value.map((column) =>
            foldText(column.filterText ? column.filterText(cellFor(column, entry.row).value, entry.row) : cellFor(column, entry.row).formatted),
        ),
    ),
);

// Every word of the filter must appear somewhere in the row (any order, any cells), ignoring case and diacritics.
const filteredEntries = computed(() => {
    const terms = searchTerms(filter.value);
    if (terms.length === 0 && !props.rowFilter) return entries.value;
    const index = terms.length > 0 ? searchIndex.value : null;
    // With a field chosen, every word must be in that field's cell; otherwise anywhere in the row.
    const only = filterField.value ? filterableColumns.value.findIndex((c) => c.id === filterField.value) : -1;
    const rowText = (i: number): string => (only >= 0 ? index![i][only] : index![i].join(" "));
    return entries.value.filter((entry, i) => (!props.rowFilter || props.rowFilter(entry.row)) && (!index || terms.every((term) => rowText(i).includes(term))));
});

/** The sort keys in order: the primary, then `thenBy`, each with a real column and a direction. */
const sortKeys = computed(() =>
    [sort.value, ...thenBy.value]
        .map((k) => ({ column: columns.value.find((c) => c.id === k.columnId), dir: k.direction === "ascending" ? 1 : k.direction === "descending" ? -1 : 0 }))
        .filter((k): k is { column: DataGridColumn; dir: 1 | -1 } => !!k.column && k.dir !== 0),
);

const sortedEntries = computed(() => {
    if (sortKeys.value.length === 0) return filteredEntries.value;
    const keys = sortKeys.value;
    const collators = keys.map((k) => {
        const tag = k.column.locale ?? props.locale;
        return tag ? new Intl.Collator(tag, { numeric: true }) : null;
    });
    // Read each sort key once per column (n accessor calls), not twice per comparison.
    const keyed = filteredEntries.value.map((entry) => ({ entry, keys: keys.map((k) => cellFor(k.column, entry.row).value) }));
    keyed.sort((a, b) => {
        for (let i = 0; i < keys.length; i++) {
            const { column, dir } = keys[i];
            const av = a.keys[i];
            const bv = b.keys[i];
            if (av === bv) continue;
            // Missing values sort together at one end, in both directions (`nulls`).
            const aMissing = av === null || av === undefined;
            const bMissing = bv === null || bv === undefined;
            if (aMissing || bMissing) return aMissing === bMissing ? 0 : (aMissing ? 1 : -1) * (props.nulls === "first" ? -1 : 1);
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

const pageCount = computed(() => (props.pageSize ? Math.max(1, Math.ceil(sortedEntries.value.length / props.pageSize)) : 1));
const clampedPage = computed(() => Math.min(Math.max(page.value, 1), pageCount.value));
const pageStart = computed(() => (props.pageSize ? (clampedPage.value - 1) * props.pageSize : 0));
const pageEntries = computed(() =>
    props.pageSize ? sortedEntries.value.slice(pageStart.value, pageStart.value + props.pageSize) : sortedEntries.value,
);

const lastCol = computed(() => colOffset.value + visibleColumns.value.length - 1);

// The roving position clamped to the cells that exist now.
const activeRow = computed(() => Math.max(-1, Math.min(focusedRow.value, pageEntries.value.length - 1)));
const activeCol = computed(() => Math.max(0, Math.min(focusedCol.value, lastCol.value)));

// Row position for assistive technology, only when the DOM holds a subset of the rows. Header row is 1.
const rowCount = computed(() =>
    props.pageSize ? sortedEntries.value.length + 1 : props.virtualize ? pageEntries.value.length + 1 : undefined,
);
const indexed = computed(() => !!props.pageSize || !!props.virtualize);

// ---- Windowing (virtualize): only the rows in view, plus the roving tab stop's row ----
const scrollTop = ref(0);
const scrollEl = ref<HTMLDivElement | null>(null);
type RenderItem = { kind: "row"; index: number } | { kind: "spacer"; rows: number; key: string };
const renderItems = computed<RenderItem[]>(() => {
    const total = pageEntries.value.length;
    const v = props.virtualize;
    if (!v) return pageEntries.value.map((_, index) => ({ kind: "row", index }) as RenderItem);
    const overscan = v.overscan ?? 3;
    const start = Math.max(0, Math.floor(scrollTop.value / v.rowHeight) - overscan);
    const end = Math.min(total, Math.ceil((scrollTop.value + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    if (activeRow.value >= 0 && activeRow.value < total) indices.add(activeRow.value);
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

/** Bring a body row into the scroll region. */
function revealRow(index: number): void {
    const v = props.virtualize;
    if (!v || index < 0) return;
    const top = index * v.rowHeight;
    let next = scrollTop.value;
    if (top < scrollTop.value) next = top;
    else if (top + v.rowHeight > scrollTop.value + v.height) next = top + v.rowHeight - v.height;
    if (next === scrollTop.value) return;
    scrollTop.value = next;
    if (scrollEl.value) scrollEl.value.scrollTop = next;
}

// O(1) membership instead of `selected.includes` per row.
const selectedSet = computed(() => new Set(selected.value));
const allSelected = computed(() => sortedEntries.value.length > 0 && sortedEntries.value.every((entry) => selectedSet.value.has(entry.id)));
const someSelected = computed(() => !allSelected.value && sortedEntries.value.some((entry) => selectedSet.value.has(entry.id)));

function announce(message: string | undefined): void {
    if (message) statusMessage.value = message;
}

// ---------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------

function ariaSortFor(column: DataGridColumn): DataGridSortDirection | undefined {
    if (!column.sortable) return undefined;
    if (sort.value.columnId === column.id) return sort.value.direction;
    return thenBy.value.find((k) => k.columnId === column.id)?.direction ?? "none";
}

/** 1 for the primary key, 2… for `thenBy`, only while more than one key is in force. */
function sortOrderFor(column: DataGridColumn): number | undefined {
    if (sortKeys.value.length < 2) return undefined;
    const at = sortKeys.value.findIndex((k) => k.column.id === column.id);
    return at === -1 ? undefined : at + 1;
}

function toggleSort(column: DataGridColumn, additive = false): void {
    if (!column.sortable) return;
    const current = sort.value;
    if (additive && current.direction !== "none" && current.columnId && current.columnId !== column.id) {
        const existing = thenBy.value.find((k) => k.columnId === column.id);
        const nextThen: DataGridSort[] = !existing
            ? [...thenBy.value, { columnId: column.id, direction: "ascending" }]
            : existing.direction === "ascending"
              ? thenBy.value.map((k) => (k.columnId === column.id ? { columnId: column.id, direction: "descending" as const } : k))
              : thenBy.value.filter((k) => k.columnId !== column.id);
        thenBy.value = nextThen;
        announce(props.labels.sortAnnouncement?.(column.header, nextThen.find((k) => k.columnId === column.id)?.direction ?? "none"));
        return;
    }
    if (thenBy.value.length > 0) thenBy.value = [];
    const next: DataGridSort =
        current.columnId !== column.id
            ? { columnId: column.id, direction: "ascending" }
            : current.direction === "ascending"
              ? { columnId: column.id, direction: "descending" }
              : current.direction === "descending"
                ? { columnId: "", direction: "none" }
                : { columnId: column.id, direction: "ascending" };
    sort.value = next;
    announce(props.labels.sortAnnouncement?.(column.header, next.direction));
}

// ---------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------

function setFilter(value: string): void {
    filter.value = value;
    page.value = 1;
    // `filteredEntries` is a computed: reading it after the write gives the new count.
    announce(props.labels.filterAnnouncement?.(filteredEntries.value.length, props.rows.length));
}

/** Escape in the search field clears it. */
function onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && filter.value !== "") {
        event.preventDefault();
        setFilter("");
    }
}

function onFilterFieldChange(event: Event): void {
    filterField.value = (event.target as HTMLSelectElement).value;
    page.value = 1;
    announce(props.labels.filterAnnouncement?.(filteredEntries.value.length, props.rows.length));
}

// ---------------------------------------------------------------
// Selection
// ---------------------------------------------------------------

const isSelected = (id: string): boolean => selectedSet.value.has(id);

function setSelected(next: string[]): void {
    selected.value = next;
    announce(props.labels.selectionAnnouncement?.(next.length));
}

/** `index` is the row's position in `sortedEntries`, not on the current page. */
function toggleRow(index: number, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }): void {
    const id = sortedEntries.value[index].id;
    if (props.selectionMode === "single") {
        setSelected(isSelected(id) ? [] : [id]);
    } else if (props.selectionMode === "multiple") {
        if (event?.shiftKey && lastSelectedIndex >= 0) {
            const [start, end] = lastSelectedIndex < index ? [lastSelectedIndex, index] : [index, lastSelectedIndex];
            const range = sortedEntries.value.slice(start, end + 1).map((entry) => entry.id);
            setSelected([...new Set([...selected.value, ...range])]);
        } else if (event?.ctrlKey || event?.metaKey) {
            setSelected(isSelected(id) ? selected.value.filter((x) => x !== id) : [...selected.value, id]);
        } else {
            setSelected(isSelected(id) && selected.value.length === 1 ? [] : [id]);
        }
    }
    lastSelectedIndex = index;
}

function toggleSelectAll(): void {
    if (allSelected.value) setSelected([]);
    else setSelected(sortedEntries.value.map((entry) => entry.id));
}

// ---------------------------------------------------------------
// Column resize
// ---------------------------------------------------------------

const widthFor = (column: DataGridColumn): number | undefined => columnWidths.value[column.id] ?? column.width;

/** Inline style of a column's cells: its width, and its alignment where one is set. */
function cellStyle(column: DataGridColumn): string | undefined {
    const parts: string[] = [];
    const width = widthFor(column);
    if (width) parts.push(`width:${width}px`);
    if (column.align) parts.push(`text-align:${column.align}`);
    return parts.length > 0 ? parts.join(";") : undefined;
}

function setWidth(column: DataGridColumn, width: number): void {
    columnWidths.value = { ...columnWidths.value, [column.id]: Math.max(MIN_COLUMN_WIDTH, width) };
}

function onResizeKeydown(column: DataGridColumn, event: KeyboardEvent): void {
    // The resize handle is its own tab stop outside the grid's roving-tabindex system — every key here
    // must stop, or it bubbles into onGridKeydown and moves grid focus out from under the handle.
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

function onResizePointerDown(column: DataGridColumn, event: PointerEvent): void {
    event.preventDefault();
    const startX = event.clientX;
    const target = event.target as HTMLElement;
    const startWidth = widthFor(column) ?? target.closest("th")?.getBoundingClientRect().width ?? 120;
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
    const next = new Set(hiddenColumnIds.value);
    if (next.has(columnId)) next.delete(columnId);
    else next.add(columnId);
    hiddenColumnIds.value = next;
}

// ---------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------

function goToPage(next: number): void {
    const target = Math.min(Math.max(next, 1), pageCount.value);
    if (target === clampedPage.value) return;
    page.value = target;
    announce(props.labels.pageAnnouncement?.(target, pageCount.value));
}

// ---------------------------------------------------------------
// Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
// ---------------------------------------------------------------

function focusActiveCell(): void {
    nextTick(() => {
        rootEl.value
            ?.querySelector<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]')
            ?.focus({ preventScroll: true });
    });
}

/** Move `columnId` to sit at `toVisibleIndex` among the visible columns. Returns whether it moved. */
function moveColumn(columnId: string, toVisibleIndex: number): boolean {
    const ids = visibleColumns.value.map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toVisibleIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
    const full = orderedColumns.value.map((c) => c.id);
    const hiddenAt = full.map((id) => (ids.includes(id) ? null : id));
    let next = 0;
    columnOrder.value = hiddenAt.map((id) => id ?? ids[next++]);
    const column = columns.value.find((c) => c.id === columnId)!;
    announce(props.labels.columnMoveAnnouncement?.(column.header, to + 1, ids.length));
    return true;
}

let draggingColumnId: string | null = null;

function onHeaderDrop(targetId: string, event: DragEvent): void {
    event.preventDefault();
    const id = draggingColumnId;
    draggingColumnId = null;
    if (!id || id === targetId) return;
    const to = visibleColumns.value.findIndex((c) => c.id === targetId);
    if (to >= 0) moveColumn(id, to);
}

function moveFocus(row: number, col: number): void {
    focusedRow.value = Math.min(Math.max(row, -1), pageEntries.value.length - 1);
    focusedCol.value = Math.min(Math.max(col, 0), lastCol.value);
    revealRow(focusedRow.value);
    focusActiveCell();
}

// ---------------------------------------------------------------
// Export (CSV / TSV / Excel)
// ---------------------------------------------------------------

const exportColumns = computed(() => visibleColumns.value.filter((c) => c.exportable !== false));
const exportEntries = computed(() =>
    props.exportScope === "selected" ? sortedEntries.value.filter((entry) => selectedSet.value.has(entry.id)) : sortedEntries.value,
);
const hasExportButtons = computed(() => !!(props.labels.exportCsv || props.labels.exportTsv || props.labels.exportExcel || props.labels.copy));

/** One cell for an export: typed values stay typed, everything else is the text the grid shows. */
function exportCell(column: DataGridColumn, row: DataGridRow): unknown {
    if (column.exportValue) return column.exportValue(row);
    const value = defaultAccessor(column, row);
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
    return formatCell(column, row);
}

/** The extra column a `time-zone` column asks for: its UTC time of day at the reference date. */
const hasUtcColumn = (c: DataGridColumn) => c.type === "time-zone" && !!c.exportUtc && !!c.referenceDate && !!props.labels.exportUtcHeader;

function buildExportTable(format: ExportFormat) {
    const live = (c: DataGridColumn) => format === "xlsx" && props.exportFormulas && c.type === "formula" && !!c.source;
    const headers: string[] = [];
    for (const c of exportColumns.value) {
        headers.push(c.header);
        if (hasUtcColumn(c)) headers.push(props.labels.exportUtcHeader!(c.header));
    }
    const rows = exportEntries.value.map((entry) => {
        const cells: unknown[] = [];
        for (const c of exportColumns.value) {
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
    return { headers, rows };
}

/** Copy the export (what a download would hold) to the clipboard as tab-separated text. `copyHandler` may return false to take over. */
async function runCopy(): Promise<void> {
    const table = buildExportTable("tsv");
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    emit("copy", copied);
    if (props.copyHandler?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    announce(ok ? props.labels.copyAnnouncement?.(table.rows.length) : props.labels.copyFailed);
}

function runExport(format: ExportFormat): void {
    const table = buildExportTable(format);
    const filename = exportFilename(props.exportFilename, format);
    const blob = exportBlob(table, format, { sheetName: props.exportFilename });
    const count = table.rows.length;
    const file: DataGridExport = { format, filename, rowCount: count, blob };
    emit("export-file", file);
    if (props.exportHandler?.(file) === false) return;
    downloadBlob(blob, filename);
    announce(props.labels.exportAnnouncement?.(format, count, filename));
}

/** Files dropped on an editable file cell: the same report as the file input. The grid uploads nothing. */
function onFileDrop(entry: Entry, column: DataGridColumn, event: DragEvent): void {
    const dropped = Array.from(event.dataTransfer?.files ?? []);
    if (dropped.length === 0) return;
    event.preventDefault();
    const files = column.multiple === false ? dropped.slice(0, 1) : dropped;
    emit("files-selected", { rowId: entry.id, row: entry.row, columnId: column.id, files });
}

function onFileInput(entry: Entry, column: DataGridColumn, event: Event): void {
    const input = event.target as HTMLInputElement;
    const chosen = Array.from(input.files ?? []);
    if (chosen.length > 0) emit("files-selected", { rowId: entry.id, row: entry.row, columnId: column.id, files: chosen });
    input.value = "";
}

// ---------------------------------------------------------------
// Cell editing
// ---------------------------------------------------------------

type Editing = { rowId: string; columnId: string; draft: string; zone?: string; error?: string; invalid?: boolean };
const editing = ref<Editing | null>(null);

/** A cell the person can edit through the grid's edit model (not a rollup, a file cell with its own widgets, or a person cell with no editor). */
function isEditable(column: DataGridColumn): boolean {
    if (!column.editable) return false;
    if (column.type === "rollup" || column.type === "file") return false;
    if (column.type === "person" && !column.personEditor) return false;
    return true;
}

function startEdit(entry: Entry, column: DataGridColumn): void {
    if (!isEditable(column)) return;
    // A formula's editor shows the expression the row holds, not the result.
    const raw = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    if (column.type === "time-zone") {
        const zoned = isZonedTime(raw) ? raw : null;
        editing.value = { rowId: entry.id, columnId: column.id, draft: zoned?.time ?? "", zone: zoned?.timeZone ?? column.timeZones?.[0]?.id ?? "" };
        return;
    }
    const text = column.type === "link" ? (linkParts(raw)?.href ?? "") : raw === null || raw === undefined ? "" : String(raw);
    editing.value = { rowId: entry.id, columnId: column.id, draft: text };
}

function parseDraft(column: DataGridColumn, row: DataGridRow, draft: string, zone?: string): unknown {
    if (column.parse) return column.parse(draft, row);
    if (column.type === "time-zone") return draft === "" ? null : { time: draft, timeZone: zone ?? "" };
    if (column.editor === "number") return draft.trim() === "" ? null : Number(draft);
    if (column.editor === "date" || column.editor === "time" || column.editor === "select") return draft === "" ? null : draft;
    return draft;
}

/** Accepted cell edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through the `cell-edit` event like any edit. */
let history: EditHistory = EMPTY_HISTORY;

/** Put an earlier cell value back, or re-apply it, through `cell-edit`. */
function stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(history) : redoEdit(history);
    if (!step.record) return;
    history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const entry = entries.value.find((e) => e.id === ownerId);
    const column = columns.value.find((c) => c.id === fieldId);
    if (!entry || !column) return;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    emit("cell-edit", { rowId: entry.id, row: entry.row, columnId: column.id, value: restored, previous: replaced });
    const text = column.format ? column.format(restored, entry.row) : String(restored ?? "");
    announce((direction === "undo" ? props.labels.undoAnnouncement : props.labels.redoAnnouncement)?.(column.header, text));
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
        const text = message ?? props.labels.invalidValue?.(column.header, column.type ?? "") ?? "";
        if (editing.value) editing.value = { ...editing.value, error: text || undefined, invalid: true };
        announce(props.labels.editError?.(column.header, text));
        return false;
    }
    const previous = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
    editing.value = null;
    if (value !== previous && !isStructurallyEqual(value, previous)) {
        history = recordEdit(history, { ownerId: entry.id, fieldId: column.id, value, previous });
        emit("cell-edit", { rowId: entry.id, row: entry.row, columnId: column.id, value, previous });
        announce(props.labels.editAnnouncement?.(column.header, column.format ? column.format(value, entry.row) : String(value ?? "")));
    }
    return true;
}

function commitEdit(): void {
    const current = editing.value;
    if (!current) return;
    const entry = entries.value.find((e) => e.id === current.rowId);
    const column = columns.value.find((c) => c.id === current.columnId);
    if (!entry || !column) {
        editing.value = null;
        return;
    }
    if (commitValue(entry, column, parseDraft(column, entry.row, current.draft, current.zone))) focusActiveCell();
}

function cancelEdit(): void {
    const current = editing.value;
    if (!current) return;
    editing.value = null;
    const column = columns.value.find((c) => c.id === current.columnId);
    if (column) announce(props.labels.editCancelAnnouncement?.(column.header));
    focusActiveCell();
}

function onEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys; none may reach the grid's own handler.
    event.stopPropagation();
    // While an input method is composing, Enter picks the candidate and Escape cancels the composition:
    // neither commits nor cancels the edit. Some browsers report the confirming Enter with `isComposing`
    // already false, but keyCode 229.
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
        event.preventDefault();
        commitEdit();
    } else if (event.key === "Escape") {
        event.preventDefault();
        cancelEdit();
    }
}

function setDraft(draft: string): void {
    if (editing.value) editing.value = { ...editing.value, draft, error: undefined, invalid: false };
}

function setZone(zone: string): void {
    if (editing.value) editing.value = { ...editing.value, zone, error: undefined, invalid: false };
}

/** Focus and select the editor's text as it appears. */
const vFocusEditor = {
    mounted(node: HTMLInputElement | HTMLSelectElement) {
        node.focus();
        if (node instanceof HTMLInputElement && node.type === "text") node.select();
    },
};

function activateFocusedCell(): void {
    if (activeCol.value === 0 && hasSelection.value) {
        if (activeRow.value === -1) {
            if (props.selectionMode === "multiple") toggleSelectAll();
        } else {
            toggleRow(pageStart.value + activeRow.value);
        }
        return;
    }
    const column = visibleColumns.value[activeCol.value - colOffset.value];
    if (!column) return;
    if (activeRow.value === -1) toggleSort(column);
}

// ---------------------------------------------------------------
// Widgets inside cells (APG grid: interactive cell contents)
// ---------------------------------------------------------------

/** The widgets a consumer put in a body cell (never the grid's own controls). */
function widgetsIn(cell: Element): HTMLElement[] {
    return Array.from(cell.querySelectorAll<HTMLElement>(WIDGET_SELECTOR)).filter((el) => !el.closest("[data-grid-own]"));
}

function setWidgetTabindex(cell: Element, value: "0" | "-1"): void {
    for (const widget of widgetsIn(cell)) widget.setAttribute("tabindex", value);
}

/** Widgets in body cells are not tab stops, so Tab leaves the grid in one step. */
function normaliseWidgets(): void {
    if (!rootEl.value || !isGrid.value) return;
    for (const cell of rootEl.value.querySelectorAll(".data-table-body [data-row][data-col]")) {
        if (cell.getAttribute("data-grid-entered") === "true") continue;
        setWidgetTabindex(cell, "-1");
    }
}

// Re-run whenever what is on screen could have changed.
watch([pageEntries, visibleColumns, isGrid, scrollTop, editing], () => nextTick(normaliseWidgets), { flush: "post" });
onMounted(normaliseWidgets);

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
function onGridFocusin(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    focusedRow.value = Number(cell.dataset.row);
    focusedCol.value = Number(cell.dataset.col);
    // Focus arriving on a widget (a click, or Tab inside the cell) makes the cell's widgets tab stops.
    if (target !== cell && !target.closest("[data-grid-own]") && cell.closest(".data-table-body")) {
        cell.setAttribute("data-grid-entered", "true");
        setWidgetTabindex(cell, "0");
    }
}

function onGridFocusout(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const next = event.relatedTarget as Node | null;
    if (next && cell.contains(next)) return;
    leaveCell(cell);
}

/** A click on a body cell, outside any widget, activates its row. */
function onGridClick(event: MouseEvent): void {
    if (!hasRowActivate) return;
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head")) return;
    if (target.closest(WIDGET_SELECTOR) || target.closest("[data-grid-own]")) return;
    const entry = pageEntries.value[Number(cell.dataset.row)];
    if (entry) emit("row-activate", entry.row, entry.id);
}

/** A double click on an editable body cell starts editing it. */
function onGridDblclick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell || cell.closest(".data-table-head") || target.closest("input, button, select, textarea")) return;
    const entry = pageEntries.value[Number(cell.dataset.row)];
    const column = visibleColumns.value[Number(cell.dataset.col) - colOffset.value];
    if (entry && column && isEditable(column)) startEdit(entry, column);
}

const TYPEAHEAD_WINDOW_MS = 700;
let typeahead: TypeaheadState = { prefix: "", at: 0 };

function onGridKeydown(event: KeyboardEvent): void {
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
    if (event.altKey && activeRow.value === -1 && (key === "ArrowRight" || key === "ArrowLeft")) {
        const column = visibleColumns.value[activeCol.value - colOffset.value];
        if (column && isMovable(column)) {
            event.preventDefault();
            const delta = key === "ArrowRight" ? 1 : -1;
            if (moveColumn(column.id, activeCol.value - colOffset.value + delta)) moveFocus(-1, activeCol.value + delta);
            return;
        }
    }
    const historyAction = hasCellEdit && target === cell ? historyKey(event) : null;
    if (historyAction) {
        event.preventDefault();
        stepHistory(historyAction);
        return;
    }
    // Type-ahead in the focused column: letters typed in quick succession move to the next row whose cell text starts with them.
    if (isTypeaheadKey(event) && target === cell && activeRow.value >= 0) {
        const column = visibleColumns.value[activeCol.value - colOffset.value];
        if (column) {
            const state = nextTypeaheadState(typeahead, event.key, Date.now(), TYPEAHEAD_WINDOW_MS);
            const hit = findTypeaheadMatch(pageEntries.value.map((entry) => cellFor(column, entry.row).formatted), activeRow.value, state.prefix);
            if (hit !== -1) {
                typeahead = state;
                event.preventDefault();
                moveFocus(hit, activeCol.value);
                return;
            }
        }
    }
    const move = gridMove(
        event,
        { row: activeRow.value, col: activeCol.value },
        { firstRow: -1, lastRow: pageEntries.value.length - 1, lastCol: lastCol.value, pageStep: props.pageSize ?? 10, rtl: isRtl(cell) },
    );
    if (move) {
        event.preventDefault();
        moveFocus(move.row, move.col);
        return;
    }
    switch (key) {
        case "F2": {
            const entry = pageEntries.value[Number(cell.dataset.row)];
            const column = visibleColumns.value[Number(cell.dataset.col) - colOffset.value];
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
                const entry = pageEntries.value[Number(cell.dataset.row)];
                const column = visibleColumns.value[Number(cell.dataset.col) - colOffset.value];
                if (entry && column && isEditable(column)) {
                    startEdit(entry, column);
                    break;
                }
            }
            if (target === cell && cell.closest(".data-table-body") && !cell.querySelector("[data-grid-own]")) {
                // A cell with a widget in it is entered; one without activates its row.
                if (enterCell(cell)) break;
                if (event.key === "Enter" && hasRowActivate) {
                    const entry = pageEntries.value[Number(cell.dataset.row)];
                    if (entry) emit("row-activate", entry.row, entry.id);
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

let restored = false;

function restoreView(): void {
    if (!props.storageKey || restored) return;
    restored = true;
    try {
        const raw = localStorage.getItem(props.storageKey);
        if (raw) {
            const saved = JSON.parse(raw) as {
                columnWidths?: Record<string, number>;
                hiddenColumnIds?: string[];
                sort?: DataGridSort;
            };
            if (saved.columnWidths) columnWidths.value = saved.columnWidths;
            if (saved.hiddenColumnIds) hiddenColumnIds.value = new Set(saved.hiddenColumnIds);
            if (saved.sort) sort.value = saved.sort;
        }
    } catch {
        // ignore quota / privacy / parse errors
    }
}
restoreView();

watch(
    [columnWidths, hiddenColumnIds, sort],
    () => {
        if (!props.storageKey || typeof localStorage === "undefined") return;
        try {
            localStorage.setItem(
                props.storageKey,
                JSON.stringify({ columnWidths: columnWidths.value, hiddenColumnIds: [...hiddenColumnIds.value], sort: sort.value }),
            );
        } catch {
            // ignore quota / privacy errors
        }
        },
    { immediate: true },
);

// ---------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------

const rowLabelOf = (entry: Entry): string => (visibleColumns.value[0] ? cellFor(visibleColumns.value[0], entry.row).formatted : entry.id);

function shownPeople(column: DataGridColumn, value: unknown): DataGridPerson[] {
    const people = peopleOf(value);
    return column.maxPeople !== undefined ? people.slice(0, Math.max(0, column.maxPeople)) : people;
}

/** A node that is the cell's own content (not a built-in type body). */
const groupsOf = (column: DataGridColumn): string[] => [...new Set((column.options ?? []).filter((o) => o.group).map((o) => o.group as string))];

/** `indeterminate` is a JS-only DOM property, not an attribute. */
function setIndeterminate(node: unknown): void {
    if (node) (node as HTMLInputElement).indeterminate = someSelected.value;
}

/** The attributes a body cell's headless element gets (the cell is a TD, or a TH for a row-header column). */
function cellProps(column: DataGridColumn, rowIndex: number, colIndex: number, ctx: DataGridCellContext, id: string): Record<string, unknown> {
    const extra = column.cellAttrs?.(ctx) ?? {};
    const extraClass = typeof column.cellClass === "function" ? column.cellClass(ctx) : column.cellClass;
    const isActive = activeRow.value === rowIndex && activeCol.value === colOffset.value + colIndex;
    const common: Record<string, unknown> = {
        class: extraClass,
        "data-row": rowIndex,
        "data-col": colOffset.value + colIndex,
        "data-align": column.align,
        "data-cell-type": column.type,
        "data-pinned": column.pinned,
        "data-error": column.errorOf?.(ctx.row) !== undefined ? "" : undefined,
        "data-empty": isMissing(ctx.value) ? "" : undefined,
        style: cellStyle(column),
    };
    if (column.rowHeader) {
        return { ...common, scope: "row", role: "rowheader", tabindex: isGrid.value ? (isActive ? 0 : -1) : undefined, ...extra };
    }
    return {
        ...common,
        "data-editable": isEditable(column) ? "" : undefined,
        "data-readonly": column.type === "rollup" ? "" : undefined,
        "aria-readonly": column.type === "rollup" ? "true" : undefined,
        "data-editing": editing.value?.rowId === id && editing.value.columnId === column.id ? "" : undefined,
        role: isGrid.value ? "gridcell" : "cell",
        ...(isGrid.value ? { active: isActive } : { tabindex: undefined }),
        onDragover:
            column.type === "file" && column.editable
                ? (e: DragEvent) => {
                      if (Array.from(e.dataTransfer?.types ?? []).includes("Files")) e.preventDefault();
                  }
                : undefined,
        onDrop: column.type === "file" && column.editable ? (e: DragEvent) => onFileDrop(entryById(id)!, column, e) : undefined,
        ...extra,
    };
}

function entryById(id: string): Entry | undefined {
    return pageEntries.value.find((e) => e.id === id);
}
</script>

<template>
    <!-- DataGrid.vue -->
    <div ref="rootEl" class="data-grid">
        <div v-if="labels.search || hidableColumns.length > 0 || hasExportButtons" class="data-grid-toolbar">
            <select
                v-if="labels.search && labels.searchField && labels.searchAllFields"
                class="data-grid-search-field"
                :aria-label="labels.searchField"
                :value="filterField"
                @change="onFilterFieldChange"
            >
                <option value="">{{ labels.searchAllFields }}</option>
                <option v-for="c in filterableColumns" :key="c.id" :value="c.id">{{ c.header }}</option>
            </select>
            <SearchInput
                v-if="labels.search"
                class="data-grid-search"
                :label="labels.search"
                :model-value="filter"
                @update:model-value="setFilter"
                @keydown="onFilterKeydown"
            />
            <div v-if="hasExportButtons" class="data-grid-export" role="group" :aria-label="labels.export">
                <button
                    v-if="labels.copy"
                    type="button"
                    class="data-grid-export-button"
                    data-grid-export-format="copy"
                    :disabled="exportEntries.length === 0"
                    @click="runCopy()"
                >{{ labels.copy }}</button>
                <button
                    v-if="labels.exportCsv"
                    type="button"
                    class="data-grid-export-button"
                    data-grid-export-format="csv"
                    :disabled="exportEntries.length === 0"
                    @click="runExport('csv')"
                >{{ labels.exportCsv }}</button>
                <button
                    v-if="labels.exportTsv"
                    type="button"
                    class="data-grid-export-button"
                    data-grid-export-format="tsv"
                    :disabled="exportEntries.length === 0"
                    @click="runExport('tsv')"
                >{{ labels.exportTsv }}</button>
                <button
                    v-if="labels.exportExcel"
                    type="button"
                    class="data-grid-export-button"
                    data-grid-export-format="xlsx"
                    :disabled="exportEntries.length === 0"
                    @click="runExport('xlsx')"
                >{{ labels.exportExcel }}</button>
            </div>
            <fieldset v-if="hidableColumns.length > 0 && labels.columnVisibility" class="data-grid-column-visibility">
                <legend>{{ labels.columnVisibility }}</legend>
                <label v-for="column in hidableColumns" :key="column.id">
                    <input type="checkbox" :checked="!hiddenColumnIds.has(column.id)" @change="toggleColumnVisibility(column.id)" />
                    {{ labels.columnVisibilityOption?.(column.header) ?? column.header }}
                </label>
            </fieldset>
        </div>

        <component
            :is="scroll ? 'div' : Passthrough"
            v-bind="scroll ? {
                ref: (n: unknown) => (scrollEl = n as HTMLDivElement | null),
                class: 'data-grid-scroll',
                role: 'region',
                'aria-label': label,
                tabindex: isGrid ? undefined : 0,
                style: virtualize ? `height:${virtualize.height}px;overflow:auto` : undefined,
                onScroll: virtualize ? (e: Event) => { scrollTop = (e.currentTarget as HTMLElement).scrollTop; } : undefined,
            } : {}"
        >
            <DataTable
                :label="label"
                :caption="caption"
                :role="isGrid ? 'grid' : 'table'"
                :aria-rowcount="isGrid ? rowCount : undefined"
                :aria-busy="busy ? 'true' : undefined"
                @keydown="isGrid ? onGridKeydown($event) : undefined"
                @focusin="isGrid ? onGridFocusin($event) : undefined"
                @focusout="isGrid ? onGridFocusout($event) : undefined"
                @click="hasRowActivate ? onGridClick($event) : undefined"
                @dblclick="onGridDblclick"
            >
                <DataTableHead>
                    <DataTableRow :aria-rowindex="indexed ? 1 : undefined">
                        <DataTableTH
                            v-if="hasSelection"
                            :data-row="-1"
                            :data-col="0"
                            :tabindex="isGrid ? (activeRow === -1 && activeCol === 0 ? 0 : -1) : undefined"
                        >
                            <input
                                v-if="selectionMode === 'multiple'"
                                type="checkbox"
                                data-grid-own
                                :tabindex="isGrid ? -1 : undefined"
                                :aria-label="labels.selectAll"
                                :checked="allSelected"
                                :ref="setIndeterminate"
                                @click="toggleSelectAll"
                            />
                            <span v-else class="data-grid-selection-header-label">{{ labels.selectionColumn }}</span>
                        </DataTableTH>
                        <DataTableTH
                            v-for="(column, i) in visibleColumns"
                            :key="column.id"
                            :data-row="-1"
                            :data-col="colOffset + i"
                            :data-align="column.align"
                            :data-cell-type="column.type"
                            :data-pinned="column.pinned"
                            :tabindex="isGrid ? (activeRow === -1 && activeCol === colOffset + i ? 0 : -1) : undefined"
                            :aria-sort="ariaSortFor(column)"
                            :data-sort-order="sortOrderFor(column)"
                            :aria-describedby="column.type === 'rollup' && labels.rollupDescription ? `${gridId}-${column.id}-description` : undefined"
                            :style="cellStyle(column)"
                            :draggable="isMovable(column) ? 'true' : undefined"
                            @dragstart="isMovable(column) ? ((e: DragEvent) => { draggingColumnId = column.id; e.dataTransfer?.setData('text/plain', column.id); })($event) : undefined"
                            @dragover="isMovable(column) ? ((e: DragEvent) => { if (draggingColumnId) e.preventDefault(); })($event) : undefined"
                            @drop="isMovable(column) ? onHeaderDrop(column.id, $event) : undefined"
                        >
                            <button
                                v-if="column.sortable"
                                type="button"
                                class="data-grid-sort-button"
                                data-grid-own
                                :tabindex="isGrid ? -1 : undefined"
                                @click="toggleSort(column, $event.shiftKey)"
                            >
                                <RenderNode v-if="column.headerCell" :node="column.headerCell({ column })" />
                                <template v-else>{{ column.header }}</template>
                            </button>
                            <RenderNode v-else-if="column.headerCell" :node="column.headerCell({ column })" />
                            <template v-else>{{ column.header }}</template>
                            <span v-if="column.type === 'rollup' && labels.rollupDescription" class="data-grid-visually-hidden" :id="`${gridId}-${column.id}-description`">{{ labels.rollupDescription(column.header) }}</span>
                            <!-- WAI-ARIA "window splitter" pattern: role="separator" plus tabindex/aria-valuenow is exactly how a resize handle becomes focusable and operable. -->
                            <span
                                v-if="column.resizable"
                                class="data-grid-resize-handle"
                                role="separator"
                                data-grid-own
                                aria-orientation="vertical"
                                :aria-label="labels.resizeHandle?.(column.header)"
                                :aria-valuenow="widthFor(column) ?? 120"
                                :aria-valuemin="MIN_COLUMN_WIDTH"
                                tabindex="0"
                                @keydown="onResizeKeydown(column, $event)"
                                @pointerdown="onResizePointerDown(column, $event)"
                            ></span>
                        </DataTableTH>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    <template v-for="item in renderItems" :key="item.kind === 'row' ? pageEntries[item.index].id : item.key">
                        <tr v-if="item.kind === 'spacer'" class="data-grid-spacer" aria-hidden="true" :style="`height:${item.rows * (virtualize?.rowHeight ?? 0)}px`">
                            <td :colspan="lastCol + 1"></td>
                        </tr>
                        <DataTableRow
                            v-else
                            :class="rowClass?.(pageEntries[item.index].row)"
                            :aria-selected="hasSelection ? isSelected(pageEntries[item.index].id) : undefined"
                            :aria-rowindex="indexed ? pageStart + item.index + 2 : undefined"
                            v-bind="rowAttrs?.(pageEntries[item.index].row) ?? {}"
                        >
                            <DataTableTD
                                v-if="hasSelection"
                                :data-row="item.index"
                                :data-col="0"
                                :role="isGrid ? 'gridcell' : 'cell'"
                                v-bind="isGrid ? { active: activeRow === item.index && activeCol === 0 } : { tabindex: undefined }"
                            >
                                <input
                                    :type="selectionMode === 'single' ? 'radio' : 'checkbox'"
                                    data-grid-own
                                    :tabindex="isGrid ? -1 : undefined"
                                    :aria-label="labels.selectRow?.(visibleColumns[0] ? cellFor(visibleColumns[0], pageEntries[item.index].row).formatted : String(item.index + 1))"
                                    :checked="isSelected(pageEntries[item.index].id)"
                                    @click="toggleRow(pageStart + item.index, $event)"
                                />
                            </DataTableTD>
                            <template v-for="(column, colIndex) in visibleColumns" :key="column.id">
                                <component
                                    :is="column.rowHeader ? DataTableTH : DataTableTD"
                                    v-bind="cellProps(column, item.index, colIndex, cellFor(column, pageEntries[item.index].row), pageEntries[item.index].id)"
                                >
                                    <template v-if="editing && editing.rowId === pageEntries[item.index].id && editing.columnId === column.id">
                                        <RenderNode
                                            v-if="column.editor === 'person' && column.personEditor"
                                            :node="column.personEditor({ value: cellFor(column, pageEntries[item.index].row).value, commit: (v: unknown) => { commitValue(pageEntries[item.index], column, v); }, cancel: cancelEdit })"
                                        />
                                        <span
                                            v-else-if="column.editor === 'time-zone'"
                                            class="data-grid-zoned-editor"
                                            role="group"
                                            :aria-label="labels.cellEditor?.(column.header) ?? column.header"
                                            @focusout="(e: FocusEvent) => { if (editing && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) commitEdit(); }"
                                        >
                                            <input
                                                v-focus-editor
                                                class="data-grid-cell-editor"
                                                type="time"
                                                step="1"
                                                :aria-label="labels.cellEditor?.(column.header) ?? column.header"
                                                :aria-invalid="editing.error || editing.invalid ? 'true' : undefined"
                                                :aria-describedby="editing.error ? `${pageEntries[item.index].id}-${column.id}-error` : undefined"
                                                :value="editing.draft"
                                                @input="setDraft(($event.target as HTMLInputElement).value)"
                                                @keydown="onEditorKeydown"
                                            />
                                            <select
                                                class="data-grid-cell-editor data-grid-zone-editor"
                                                :aria-label="labels.timeZone?.(column.header) ?? column.header"
                                                :value="editing.zone"
                                                @change="setZone(($event.target as HTMLSelectElement).value)"
                                                @keydown="onEditorKeydown"
                                            >
                                                <option v-for="option in column.timeZones ?? []" :key="option.id" :value="option.id" :selected="option.id === editing.zone">{{ option.label }}</option>
                                            </select>
                                        </span>
                                        <select
                                            v-else-if="column.editor === 'select'"
                                            v-focus-editor
                                            class="data-grid-cell-editor"
                                            :aria-label="labels.cellEditor?.(column.header) ?? column.header"
                                            :aria-invalid="editing.error || editing.invalid ? 'true' : undefined"
                                            :aria-describedby="editing.error ? `${pageEntries[item.index].id}-${column.id}-error` : undefined"
                                            :value="editing.draft"
                                            @change="setDraft(($event.target as HTMLSelectElement).value)"
                                            @keydown="onEditorKeydown"
                                            @blur="editing && commitEdit()"
                                        >
                                            <option value=""></option>
                                            <option v-for="option in (column.options ?? []).filter((o) => !o.group)" :key="option.id" :value="option.id" :disabled="option.disabled" :selected="option.id === editing.draft">{{ option.label }}</option>
                                            <optgroup v-for="group in groupsOf(column)" :key="group" :label="group">
                                                <option v-for="option in (column.options ?? []).filter((o) => o.group === group)" :key="option.id" :value="option.id" :disabled="option.disabled" :selected="option.id === editing.draft">{{ option.label }}</option>
                                            </optgroup>
                                        </select>
                                        <input
                                            v-else
                                            v-focus-editor
                                            class="data-grid-cell-editor"
                                            :type="column.editor === 'number' ? 'number' : column.editor === 'date' ? 'date' : column.editor === 'time' ? 'time' : 'text'"
                                            :step="column.editor === 'time' ? 1 : undefined"
                                            :inputmode="column.editor === 'number' ? 'decimal' : undefined"
                                            :aria-label="(column.type === 'formula' ? labels.formulaEditor?.(column.header) : undefined) ?? labels.cellEditor?.(column.header) ?? column.header"
                                            :aria-invalid="editing.error || editing.invalid ? 'true' : undefined"
                                            :aria-describedby="editing.error ? `${pageEntries[item.index].id}-${column.id}-error` : undefined"
                                            :value="editing.draft"
                                            @input="setDraft(($event.target as HTMLInputElement).value)"
                                            @keydown="onEditorKeydown"
                                            @blur="editing && commitEdit()"
                                        />
                                        <span v-if="editing.error" class="data-grid-cell-error" :id="`${pageEntries[item.index].id}-${column.id}-error`">{{ editing.error }}</span>
                                    </template>
                                    <fieldset v-else-if="column.type === 'radio' && column.editable" class="data-grid-radio-group" data-grid-own-group>
                                        <legend class="data-grid-radio-legend">{{ labels.radioGroup?.(column.header, rowLabelOf(pageEntries[item.index])) ?? column.header }}</legend>
                                        <label v-for="option in column.options ?? []" :key="option.id" class="data-grid-radio-option">
                                            <input
                                                type="radio"
                                                :name="`${gridId}-${pageEntries[item.index].id}-${column.id}`"
                                                :value="option.id"
                                                :checked="cellFor(column, pageEntries[item.index].row).value === option.id"
                                                :disabled="option.disabled"
                                                :tabindex="isGrid ? -1 : undefined"
                                                @change="commitValue(pageEntries[item.index], column, option.id)"
                                            />{{ option.label }}</label>
                                    </fieldset>
                                    <template v-else>
                                        <RenderNode v-if="column.cell" :node="column.cell(cellFor(column, pageEntries[item.index].row))" />
                                        <template v-else-if="isMissing(cellFor(column, pageEntries[item.index].row).value) && (column.emptyValue ?? emptyValue)">{{ column.emptyValue ?? emptyValue }}</template>
                                        <ul v-else-if="column.type === 'person'" class="data-grid-people">
                                            <template v-if="peopleOf(cellFor(column, pageEntries[item.index].row).value).length > 0">
                                                <li v-for="person in shownPeople(column, cellFor(column, pageEntries[item.index].row).value)" :key="person.id" class="data-grid-person"><span v-if="column.avatar" class="data-grid-avatar" aria-hidden="true"><RenderNode :node="column.avatar({ person })" /></span><span class="data-grid-person-name">{{ personName(person) }}</span></li>
                                                <li v-if="shownPeople(column, cellFor(column, pageEntries[item.index].row).value).length < peopleOf(cellFor(column, pageEntries[item.index].row).value).length && labels.morePeople" class="data-grid-people-more">{{ labels.morePeople(peopleOf(cellFor(column, pageEntries[item.index].row).value).length - shownPeople(column, cellFor(column, pageEntries[item.index].row).value).length) }}</li>
                                            </template>
                                        </ul>
                                        <template v-else-if="column.type === 'file'">
                                            <ul v-if="filesOf(cellFor(column, pageEntries[item.index].row).value).length > 0" class="data-grid-files">
                                                <li v-for="file in filesOf(cellFor(column, pageEntries[item.index].row).value)" :key="file.id" class="data-grid-file">
                                                    <a v-if="file.href && safeHref(file.href)" class="data-grid-link" :href="safeHref(file.href)!">{{ file.name }}</a><span v-else class="data-grid-file-name">{{ file.name }}</span><template v-if="file.size !== undefined && column.formatSize">{{ " " }}<span class="data-grid-file-size">{{ column.formatSize(file.size) }}</span></template><button
                                                        v-if="column.editable && labels.removeFile"
                                                        type="button"
                                                        class="data-grid-file-remove"
                                                        data-grid-own
                                                        :tabindex="isGrid ? -1 : undefined"
                                                        :aria-label="labels.removeFile(file.name)"
                                                        @click="emit('file-remove', { rowId: pageEntries[item.index].id, row: pageEntries[item.index].row, columnId: column.id, fileId: file.id })"
                                                    ></button>
                                                </li>
                                            </ul>
                                            <input
                                                v-if="column.editable"
                                                type="file"
                                                class="data-grid-file-input"
                                                :aria-label="labels.fileInput?.(column.header, rowLabelOf(pageEntries[item.index])) ?? column.header"
                                                :multiple="column.multiple !== false"
                                                :accept="column.accept"
                                                :tabindex="isGrid ? -1 : undefined"
                                                @change="onFileInput(pageEntries[item.index], column, $event)"
                                            />
                                        </template>
                                        <template v-else-if="column.type === 'link'">
                                            <template v-if="linkParts(cellFor(column, pageEntries[item.index].row).value)">
                                                <a
                                                    v-if="safeHref(linkParts(cellFor(column, pageEntries[item.index].row).value)!.href)"
                                                    class="data-grid-link"
                                                    :href="safeHref(linkParts(cellFor(column, pageEntries[item.index].row).value)!.href)!"
                                                    :target="linkParts(cellFor(column, pageEntries[item.index].row).value)!.external ? '_blank' : undefined"
                                                    :rel="linkParts(cellFor(column, pageEntries[item.index].row).value)!.external ? 'noopener noreferrer' : undefined"
                                                >{{ linkParts(cellFor(column, pageEntries[item.index].row).value)!.label ?? linkParts(cellFor(column, pageEntries[item.index].row).value)!.href }}<template v-if="linkParts(cellFor(column, pageEntries[item.index].row).value)!.external && labels.opensInNewTab">{{ " " }}<span class="data-grid-visually-hidden">{{ labels.opensInNewTab(linkParts(cellFor(column, pageEntries[item.index].row).value)!.label ?? linkParts(cellFor(column, pageEntries[item.index].row).value)!.href) }}</span></template></a>
                                                <!-- An address with an unsafe scheme is shown as text, never as a link. -->
                                                <span v-else class="data-grid-link data-grid-link-unsafe">{{ linkParts(cellFor(column, pageEntries[item.index].row).value)!.label ?? linkParts(cellFor(column, pageEntries[item.index].row).value)!.href }}</span>
                                            </template>
                                        </template>
                                        <template v-else-if="column.type === 'date' || column.type === 'time'">
                                            <time v-if="cellFor(column, pageEntries[item.index].row).formatted !== ''" :datetime="String(cellFor(column, pageEntries[item.index].row).value)">{{ cellFor(column, pageEntries[item.index].row).formatted }}</time>
                                        </template>
                                        <template v-else>{{ cellFor(column, pageEntries[item.index].row).formatted }}</template>
                                        <button
                                            v-if="isEditable(column) && column.type !== 'radio' && labels.editCell"
                                            type="button"
                                            class="data-grid-edit-button"
                                            data-grid-own
                                            :tabindex="isGrid ? -1 : undefined"
                                            :aria-label="labels.editCell(column.header, rowLabelOf(pageEntries[item.index]))"
                                            @click="startEdit(pageEntries[item.index], column)"
                                        ></button>
                                    </template>
                                </component>
                            </template>
                        </DataTableRow>
                    </template>
                    <DataTableRow v-if="pageEntries.length === 0 && $slots.empty" class="data-grid-empty-row">
                        <DataTableTD class="data-grid-empty" :colspan="lastCol + 1" :role="isGrid ? 'gridcell' : 'cell'" :tabindex="undefined">
                            <slot name="empty" />
                        </DataTableTD>
                    </DataTableRow>
                </DataTableBody>
                <DataTableFoot v-if="$slots.footer">
                    <slot name="footer" :columns="visibleColumns" :rows="pageEntries.map((e) => e.row)" />
                </DataTableFoot>
            </DataTable>
        </component>

        <component
            :is="labels.pagination ? PaginationNav : 'div'"
            v-if="pageSize"
            v-bind="labels.pagination ? { label: labels.pagination } : {}"
            class="data-grid-pagination"
        >
            <button type="button" class="data-grid-page-previous" :disabled="clampedPage <= 1" @click="goToPage(clampedPage - 1)">{{ labels.previousPage }}</button>
            <span class="data-grid-page-status">{{ labels.pageStatus?.(clampedPage, pageCount, sortedEntries.length) }}</span>
            <button type="button" class="data-grid-page-next" :disabled="clampedPage >= pageCount" @click="goToPage(clampedPage + 1)">{{ labels.nextPage }}</button>
        </component>

        <p class="data-grid-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
