<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data";
    import { foldText, searchTerms } from "./search-text";
    import {
        isInvalidForType,
        linkParts,
        resolveColumn,
        safeHref,
        filesOf,
        isZonedTime,
        peopleOf,
        personName,
        zonedUtcTime,
        type DataGridCellType,
        type DataGridFile,
        type DataGridOption,
        type DataGridPerson,
    } from "./cell-types";
    import {
        DataTable,
        DataTableBody,
        DataTableFoot,
        DataTableHead,
        DataTableRow,
        DataTableTD,
        DataTableTH,
    } from "@lilydesignsystem/svelte-headless";

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

    /** Arguments a column's `cell` snippet receives. See spec/index.md §5. */
    export type DataGridCellContext = {
        value: unknown;
        formatted: string;
        row: DataGridRow;
        column: DataGridColumn;
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
        cell?: Snippet<[DataGridCellContext]>;
        /** The header's content in place of the `header` text. `header` stays the accessible name. */
        headerCell?: Snippet<[{ column: DataGridColumn }]>;
        /** Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button `labels.editCell` gates. Enter commits, Escape cancels, leaving the field commits. */
        editable?: boolean;
        /** The editor's control. Default `"text"`; a `type` sets its own (`"number"`, `"link"`, `"date"`, `"time"`, `"time-zone"`, `"select"`, `"radio"`, `"person"`, `"formula"`). */
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
        avatar?: Snippet<[{ person: DataGridPerson }]>;
        /** `person`: the editor, given `{ value, commit, cancel }`. Lily cannot look people up; the consumer builds the combobox. Without it a person cell is read-only. */
        personEditor?: Snippet<[{ value: unknown; commit: (value: unknown) => void; cancel: () => void }]>;
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
        /** BCP 47 locale for this column's formatting and collation. Falls back to the grid's `locale`; with neither, values show as stored. */
        locale?: string;
        /** `select` and `radio`: the choices. The label is displayed, the id is stored. */
        options?: DataGridOption[];
        /** `select`: sort by option label (default) or by option order. (`radio` always sorts by order.) */
        sortBy?: "label" | "order";
        /** `select` and `radio`: export the option's `"label"` (default) or its `"id"`. */
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
        /** Announced when `validate` refuses a value: (column header, the message). */
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
        /** BCP 47 locale for the typed columns' formatting and collation. Never defaulted: with none, values show as stored. */
        locale?: string;
        /** Derives a stable id per row. Defaults to the row's index in `rows`. */
        rowId?: (row: DataGridRow, index: number) => string;
        /** Row selection mode. */
        selectionMode?: DataGridSelectionMode;
        /** Selected row ids. Two-way bindable. */
        selected?: string[];
        /** Called with the new id list after every selection change. */
        onSelectionChange?: (ids: string[]) => void;
        /** Text filter. Two-way bindable. */
        filter?: string;
        /** Called with the new filter text after every change. */
        onFilterChange?: (filter: string) => void;
        /** Current sort. Two-way bindable. */
        sort?: DataGridSort;
        /** Called with the new sort after every change. */
        onSortChange?: (sort: DataGridSort) => void;
        /** Column ids in display order. Two-way bindable; columns it does not name follow in their `columns` order. */
        columnOrder?: string[];
        /** Called with the new order after a column moves. */
        onColumnOrderChange?: (order: string[]) => void;
        /** Rows per page. Unset disables pagination. */
        pageSize?: number;
        /** Current 1-indexed page. Two-way bindable. */
        page?: number;
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
        empty?: Snippet;
        /** Rendered inside a `<tfoot>`. */
        footer?: Snippet<[{ columns: DataGridColumn[]; rows: DataGridRow[] }]>;
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
        class?: string;
        [key: string]: unknown;
    };

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    function nextDataGridId(): string {
        uid += 1;
        return `data-grid-${uid}`;
    }

    /** What counts as a widget inside a cell: something a person can operate. */
    const WIDGET_SELECTOR =
        'a[href], button, input, select, textarea, summary, [contenteditable="true"]';

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

    /** Svelte action: `indeterminate` is a JS-only DOM property, not an attribute. */
    function indeterminateAction(node: HTMLInputElement, value: boolean) {
        node.indeterminate = value;
        return {
            update(next: boolean) {
                node.indeterminate = next;
            },
        };
    }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        caption,
        columns: columnsProp,
        rows,
        locale,
        rowId = (_row: DataGridRow, index: number) => String(index),
        selectionMode = "none",
        selected = $bindable<string[]>([]),
        onSelectionChange,
        filter = $bindable(""),
        onFilterChange,
        sort = $bindable<DataGridSort>({ columnId: "", direction: "none" }),
        onSortChange,
        columnOrder = $bindable<string[]>([]),
        onColumnOrderChange,
        pageSize,
        page = $bindable(1),
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
        ...restProps
    }: Props = $props();

    // Each column with its type's defaults filled in under its own props.
    const columns = $derived(columnsProp.map((c) => resolveColumn(c, locale, rows)));

    const gridId = nextDataGridId();

    const isGrid = $derived(mode === "grid");

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    // Always replaced wholesale, never mutated in place, so `$state.raw`:
    // no deep proxy to build or to read through. See spec/index.md §6.
    let hiddenColumnIds = $state.raw<Set<string>>(new Set());
    let columnWidths = $state.raw<Record<string, number>>({});
    let focusedRow = $state(-1); // -1 = header row
    let focusedCol = $state(0);
    let lastSelectedIndex = -1; // index into sortedEntries, not into the page

    const hasSelection = $derived(selectionMode !== "none");
    const colOffset = $derived(hasSelection ? 1 : 0);

    // Columns in display order: those named in `columnOrder` first, the rest after in their own order.
    const orderedColumns = $derived.by(() => {
        if (columnOrder.length === 0) return columns;
        const rank = (id: string) => {
            const i = columnOrder.indexOf(id);
            return i === -1 ? columnOrder.length : i;
        };
        return columns
            .map((c, i) => ({ c, i }))
            .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
            .map((x) => x.c);
    });
    const visibleColumns = $derived(orderedColumns.filter((c) => !hiddenColumnIds.has(c.id)));
    const hidableColumns = $derived(columns.filter((c) => c.hidable));

    // Each row's id is derived once, from its position in `rows`, so it
    // survives sorting, filtering and paging (spec/index.md §6 "Row identity").
    type Entry = { row: DataGridRow; id: string };
    const entries = $derived<Entry[]>(rows.map((row, index) => ({ row, id: rowId(row, index) })));

    // Folded (lower-case, no diacritics) search text per row: its filterable cells joined by a space,
    // built once per rows/columns change rather than reformatting every cell on every keystroke.
    // Read only when a filter is active, so an unfiltered grid never builds it.
    const searchIndex = $derived.by(() => {
        const filterableColumns = columns.filter((c) => c.filterable !== false);
        return entries.map((entry) =>
            foldText(
                filterableColumns
                    .map((column) => (column.filterText ? column.filterText(defaultAccessor(column, entry.row), entry.row) : formatCell(column, entry.row)))
                    .join(" "),
            ),
        );
    });

    // Every word of the filter must appear somewhere in the row (any order, any cells), ignoring case and diacritics.
    const filteredEntries = $derived.by(() => {
        const terms = searchTerms(filter);
        if (terms.length === 0) return entries;
        const index = searchIndex;
        return entries.filter((_entry, i) => terms.every((term) => index[i].includes(term)));
    });

    const sortedEntries = $derived.by(() => {
        if (sort.direction === "none" || !sort.columnId) return filteredEntries;
        const column = columns.find((c) => c.id === sort.columnId);
        if (!column) return filteredEntries;
        const dir = sort.direction === "ascending" ? 1 : -1;
        const compare = column.compare;
        // Read each sort key once (n accessor calls), not twice per comparison.
        const keyed = filteredEntries.map((entry) => ({ entry, key: defaultAccessor(column, entry.row) }));
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
        return keyed.map((k) => k.entry);
    });

    const pageCount = $derived(
        pageSize ? Math.max(1, Math.ceil(sortedEntries.length / pageSize)) : 1,
    );
    const clampedPage = $derived(Math.min(Math.max(page, 1), pageCount));
    const pageStart = $derived(pageSize ? (clampedPage - 1) * pageSize : 0);
    const pageEntries = $derived(
        pageSize ? sortedEntries.slice(pageStart, pageStart + pageSize) : sortedEntries,
    );

    const lastCol = $derived(colOffset + visibleColumns.length - 1);

    // The roving position clamped to the cells that exist now. Filtering,
    // paging, or hiding a column can remove the cell focusedRow/focusedCol
    // name; without the clamp no cell would be tabbable and the grid would
    // drop out of the tab order (spec/index.md §8.20).
    const activeRow = $derived(Math.max(-1, Math.min(focusedRow, pageEntries.length - 1)));
    const activeCol = $derived(Math.max(0, Math.min(focusedCol, lastCol)));

    // Row position for assistive technology, only when pagination means the
    // DOM holds a subset of the rows (spec/index.md §8.21). Header row is 1.
    const rowCount = $derived(
        pageSize ? sortedEntries.length + 1 : virtualize ? pageEntries.length + 1 : undefined,
    );
    const indexed = $derived(!!pageSize || !!virtualize);

    // ---- Windowing (virtualize): only the rows in view, plus the roving tab stop's row ----
    let scrollTop = $state(0);
    let scrollEl: HTMLDivElement | undefined = $state();
    type RenderItem = { kind: "row"; index: number } | { kind: "spacer"; rows: number; key: string };
    const renderItems = $derived.by<RenderItem[]>(() => {
        const total = pageEntries.length;
        if (!virtualize) return pageEntries.map((_, index) => ({ kind: "row", index }));
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
    });

    /** Bring a body row into the scroll region. */
    function revealRow(index: number): void {
        if (!virtualize || index < 0) return;
        const top = index * virtualize.rowHeight;
        let next = scrollTop;
        if (top < scrollTop) next = top;
        else if (top + virtualize.rowHeight > scrollTop + virtualize.height) next = top + virtualize.rowHeight - virtualize.height;
        if (next === scrollTop) return;
        scrollTop = next;
        if (scrollEl) scrollEl.scrollTop = next;
    }

    // O(1) membership instead of `selected.includes` per row.
    const selectedSet = $derived(new Set(selected));
    const allSelected = $derived(
        sortedEntries.length > 0 && sortedEntries.every((entry) => selectedSet.has(entry.id)),
    );
    const someSelected = $derived(!allSelected && sortedEntries.some((entry) => selectedSet.has(entry.id)));

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Sorting
    // ---------------------------------------------------------------

    function ariaSortFor(column: DataGridColumn): DataGridSortDirection | undefined {
        if (!column.sortable) return undefined;
        return sort.columnId === column.id ? sort.direction : "none";
    }

    function toggleSort(column: DataGridColumn): void {
        if (!column.sortable) return;
        const next: DataGridSort =
            sort.columnId !== column.id
                ? { columnId: column.id, direction: "ascending" }
                : sort.direction === "ascending"
                  ? { columnId: column.id, direction: "descending" }
                  : sort.direction === "descending"
                    ? { columnId: "", direction: "none" }
                    : { columnId: column.id, direction: "ascending" };
        sort = next;
        onSortChange?.(next);
        announce(labels.sortAnnouncement?.(column.header, next.direction));
    }

    // ---------------------------------------------------------------
    // Filtering
    // ---------------------------------------------------------------

    function setFilter(value: string): void {
        filter = value;
        page = 1;
        onFilterChange?.(filter);
        announce(labels.filterAnnouncement?.(filteredEntries.length, rows.length));
    }

    function onFilterInput(event: Event): void {
        setFilter((event.target as HTMLInputElement).value);
    }

    /** Escape in the search field clears it. */
    function onFilterKeydown(event: KeyboardEvent): void {
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
        selected = next;
        onSelectionChange?.(next);
        announce(labels.selectionAnnouncement?.(next.length));
    }

    /** `index` is the row's position in `sortedEntries`, not on the current page. */
    function toggleRow(index: number, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }): void {
        const id = sortedEntries[index].id;
        if (selectionMode === "single") {
            setSelected(isSelected(id) ? [] : [id]);
        } else if (selectionMode === "multiple") {
            if (event?.shiftKey && lastSelectedIndex >= 0) {
                const [start, end] = lastSelectedIndex < index ? [lastSelectedIndex, index] : [index, lastSelectedIndex];
                const range = sortedEntries.slice(start, end + 1).map((entry) => entry.id);
                setSelected([...new Set([...selected, ...range])]);
            } else if (event?.ctrlKey || event?.metaKey) {
                setSelected(isSelected(id) ? selected.filter((x) => x !== id) : [...selected, id]);
            } else {
                setSelected(isSelected(id) && selected.length === 1 ? [] : [id]);
            }
        }
        lastSelectedIndex = index;
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
    function cellStyle(column: DataGridColumn): string | undefined {
        const parts: string[] = [];
        const width = widthFor(column);
        if (width) parts.push(`width:${width}px`);
        if (column.align) parts.push(`text-align:${column.align}`);
        return parts.length > 0 ? parts.join(";") : undefined;
    }

    function setWidth(column: DataGridColumn, width: number): void {
        columnWidths = { ...columnWidths, [column.id]: Math.max(MIN_COLUMN_WIDTH, width) };
    }

    function onResizeKeydown(column: DataGridColumn, event: KeyboardEvent): void {
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

    function onResizePointerDown(column: DataGridColumn, event: PointerEvent): void {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = widthFor(column) ?? (event.target as HTMLElement).closest("th")?.getBoundingClientRect().width ?? 120;
        const target = event.target as HTMLElement;
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
        const next = new Set(hiddenColumnIds);
        if (next.has(columnId)) next.delete(columnId);
        else next.add(columnId);
        hiddenColumnIds = next;
    }

    // ---------------------------------------------------------------
    // Pagination
    // ---------------------------------------------------------------

    function goToPage(next: number): void {
        const target = Math.min(Math.max(next, 1), pageCount);
        if (target === clampedPage) return;
        page = target;
        announce(labels.pageAnnouncement?.(target, pageCount));
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    function focusActiveCell(): void {
        queueMicrotask(() => {
            rootEl
                ?.querySelector<HTMLElement>('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]')
                ?.focus({ preventScroll: true });
        });
    }

    /** Move `columnId` to sit at `toVisibleIndex` among the visible columns. Returns whether it moved. */
    function moveColumn(columnId: string, toVisibleIndex: number): boolean {
        const ids = visibleColumns.map((c) => c.id);
        const from = ids.indexOf(columnId);
        const to = Math.min(Math.max(toVisibleIndex, 0), ids.length - 1);
        if (from === -1 || from === to) return false;
        ids.splice(to, 0, ...ids.splice(from, 1));
        // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
        const full = orderedColumns.map((c) => c.id);
        const hiddenAt = full.map((id) => (ids.includes(id) ? null : id));
        let next = 0;
        columnOrder = hiddenAt.map((id) => id ?? ids[next++]);
        onColumnOrderChange?.(columnOrder);
        const column = columns.find((c) => c.id === columnId)!;
        announce(labels.columnMoveAnnouncement?.(column.header, to + 1, ids.length));
        return true;
    }

    let draggingColumnId: string | null = null;

    function onHeaderDrop(targetId: string, event: DragEvent): void {
        event.preventDefault();
        const id = draggingColumnId;
        draggingColumnId = null;
        if (!id || id === targetId) return;
        const to = visibleColumns.findIndex((c) => c.id === targetId);
        if (to >= 0) moveColumn(id, to);
    }

    function moveFocus(row: number, col: number): void {
        focusedRow = Math.min(Math.max(row, -1), pageEntries.length - 1);
        focusedCol = Math.min(Math.max(col, 0), lastCol);
        revealRow(focusedRow);
        focusActiveCell();
    }

    // ---------------------------------------------------------------
    // Export (CSV / TSV / Excel)
    // ---------------------------------------------------------------

    const exportColumns = $derived(visibleColumns.filter((c) => c.exportable !== false));
    const exportEntries = $derived(
        exportScope === "selected" ? sortedEntries.filter((entry) => selectedSet.has(entry.id)) : sortedEntries,
    );
    const hasExportButtons = $derived(!!(labels.exportCsv || labels.exportTsv || labels.exportExcel));

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

    function runExport(format: ExportFormat): void {
        const live = (c: DataGridColumn) => format === "xlsx" && exportFormulas && c.type === "formula" && !!c.source;
        const headers: string[] = [];
        for (const c of exportColumns) {
            headers.push(c.header);
            if (hasUtcColumn(c)) headers.push(labels.exportUtcHeader!(c.header));
        }
        const rows = exportEntries.map((entry) => {
            const cells: unknown[] = [];
            for (const c of exportColumns) {
                const expression = live(c) ? c.source!(entry.row) : undefined;
                cells.push(typeof expression === "string" && expression !== "" && !c.errorOf?.(entry.row) ? { formula: expression, result: exportCell(c, entry.row) } : exportCell(c, entry.row));
                if (hasUtcColumn(c)) cells.push(zonedUtcTime(defaultAccessor(c, entry.row), c.referenceDate));
            }
            return cells;
        });
        const table = { headers, rows };
        const filename = exportFilename(exportBase, format);
        const blob = exportBlob(table, format, { sheetName: exportBase });
        const rowCount = table.rows.length;
        if (onExport?.({ format, filename, rowCount, blob }) === false) return;
        downloadBlob(blob, filename);
        announce(labels.exportAnnouncement?.(format, rowCount, filename));
    }

    /** Files dropped on an editable file cell: the same report as the file input. The grid uploads nothing. */
    function onFileDrop(entry: Entry, column: DataGridColumn, event: DragEvent): void {
        const dropped = Array.from(event.dataTransfer?.files ?? []);
        if (dropped.length === 0) return;
        event.preventDefault();
        const files = column.multiple === false ? dropped.slice(0, 1) : dropped;
        onFilesSelected?.({ rowId: entry.id, row: entry.row, columnId: column.id, files });
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
    let editing = $state<Editing | null>(null);

    function startEdit(entry: Entry, column: DataGridColumn): void {
        if (!isEditable(column)) return;
        // A formula's editor shows the expression the row holds, not the result.
        const raw = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
        if (column.type === "time-zone") {
            const zoned = isZonedTime(raw) ? raw : null;
            editing = { rowId: entry.id, columnId: column.id, draft: zoned?.time ?? "", zone: zoned?.timeZone ?? column.timeZones?.[0]?.id ?? "" };
            return;
        }
        const text = column.type === "link" ? (linkParts(raw)?.href ?? "") : raw === null || raw === undefined ? "" : String(raw);
        editing = { rowId: entry.id, columnId: column.id, draft: text };
    }

    function parseDraft(column: DataGridColumn, row: DataGridRow, draft: string, zone?: string): unknown {
        if (column.parse) return column.parse(draft, row);
        if (column.type === "time-zone") return draft === "" ? null : { time: draft, timeZone: zone ?? "" };
        if (column.editor === "number") return draft.trim() === "" ? null : Number(draft);
        if (column.editor === "date" || column.editor === "time" || column.editor === "select") return draft === "" ? null : draft;
        return draft;
    }

    /** Validate and report one new value for a cell. Returns false (and keeps editing, if the editor is open) when it is refused. */
    function commitValue(entry: Entry, column: DataGridColumn, value: unknown): boolean {
        const message = column.validate?.(value, entry.row);
        const invalidType = isInvalidForType(column, value);
        if (message || invalidType) {
            const text = message ?? labels.invalidValue?.(column.header, column.type ?? "") ?? "";
            if (editing) editing = { ...editing, error: text || undefined, invalid: true };
            announce(labels.editError?.(column.header, text));
            return false;
        }
        const previous = column.type === "formula" && column.source ? column.source(entry.row) : defaultAccessor(column, entry.row);
        editing = null;
        if (value !== previous && !(isStructurallyEqual(value, previous))) {
            onCellEdit?.({ rowId: entry.id, row: entry.row, columnId: column.id, value, previous });
            announce(labels.editAnnouncement?.(column.header, column.format ? column.format(value, entry.row) : String(value ?? "")));
        }
        return true;
    }

    /** Two link values with the same address and label are the same edit. */
    function isStructurallyEqual(a: unknown, b: unknown): boolean {
        return typeof a === "object" && typeof b === "object" && a !== null && b !== null && JSON.stringify(a) === JSON.stringify(b);
    }

    function commitEdit(): void {
        const current = editing;
        if (!current) return;
        const entry = entries.find((e) => e.id === current.rowId);
        const column = columns.find((c) => c.id === current.columnId);
        if (!entry || !column) {
            editing = null;
            return;
        }
        if (commitValue(entry, column, parseDraft(column, entry.row, current.draft, current.zone))) focusActiveCell();
    }

    function cancelEdit(): void {
        const current = editing;
        if (!current) return;
        editing = null;
        const column = columns.find((c) => c.id === current.columnId);
        if (column) announce(labels.editCancelAnnouncement?.(column.header));
        focusActiveCell();
    }

    function onEditorKeydown(event: KeyboardEvent): void {
        // The editor owns its keys; none may reach the grid's own handler.
        event.stopPropagation();
        // While an input method is composing (a candidate list is open), Enter picks the candidate and
        // Escape cancels the composition: neither commits nor cancels the edit. Some browsers report
        // the confirming Enter with `isComposing` already false, but keyCode 229.
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === "Enter") {
            event.preventDefault();
            commitEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancelEdit();
        }
    }

    /** Focus and select the editor's text as it appears. */
    function focusEditor(node: HTMLInputElement | HTMLSelectElement) {
        node.focus();
        if (node instanceof HTMLInputElement && node.type === "text") node.select();
    }

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

    /** Widgets in body cells are not tab stops, so Tab leaves the grid in one step. */
    function normaliseWidgets(): void {
        if (!rootEl || !isGrid) return;
        for (const cell of rootEl.querySelectorAll(".data-table-body [data-row][data-col]")) {
            if (cell.getAttribute("data-grid-entered") === "true") continue;
            setWidgetTabindex(cell, "-1");
        }
    }

    $effect(() => {
        // Re-run whenever what is on screen could have changed.
        void pageEntries;
        void visibleColumns;
        void isGrid;
        queueMicrotask(normaliseWidgets);
    });

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
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
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
        if (!onRowActivate) return;
        const target = event.target as HTMLElement;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell || cell.closest(".data-table-head")) return;
        if (target.closest(WIDGET_SELECTOR) || target.closest("[data-grid-own]")) return;
        const entry = pageEntries[Number(cell.dataset.row)];
        if (entry) onRowActivate(entry.row, entry.id);
    }

    /** A double click on an editable body cell starts editing it. */
    function onGridDblclick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell || cell.closest(".data-table-head") || target.closest("input, button, select, textarea")) return;
        const entry = pageEntries[Number(cell.dataset.row)];
        const column = visibleColumns[Number(cell.dataset.col) - colOffset];
        if (entry && column && isEditable(column)) startEdit(entry, column);
    }

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
        if (event.altKey && activeRow === -1 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
            const column = visibleColumns[activeCol - colOffset];
            if (column?.movable) {
                event.preventDefault();
                const delta = event.key === "ArrowRight" ? 1 : -1;
                if (moveColumn(column.id, activeCol - colOffset + delta)) moveFocus(-1, activeCol + delta);
                return;
            }
        }
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                moveFocus(activeRow, activeCol + 1);
                break;
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(activeRow, activeCol - 1);
                break;
            case "ArrowDown":
                event.preventDefault();
                moveFocus(activeRow + 1, activeCol);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveFocus(activeRow - 1, activeCol);
                break;
            case "Home":
                event.preventDefault();
                if (event.ctrlKey || event.metaKey) moveFocus(-1, 0);
                else moveFocus(activeRow, 0);
                break;
            case "End":
                event.preventDefault();
                if (event.ctrlKey || event.metaKey) moveFocus(pageEntries.length - 1, lastCol);
                else moveFocus(activeRow, lastCol);
                break;
            case "PageDown":
                event.preventDefault();
                moveFocus(activeRow + (pageSize ?? 10), activeCol);
                break;
            case "PageUp":
                event.preventDefault();
                moveFocus(activeRow - (pageSize ?? 10), activeCol);
                break;
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

    let restored = false;

    $effect(() => {
        if (!storageKey || restored) return;
        restored = true;
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const saved = JSON.parse(raw) as {
                    columnWidths?: Record<string, number>;
                    hiddenColumnIds?: string[];
                    sort?: DataGridSort;
                };
                if (saved.columnWidths) columnWidths = saved.columnWidths;
                if (saved.hiddenColumnIds) hiddenColumnIds = new Set(saved.hiddenColumnIds);
                if (saved.sort) sort = saved.sort;
            }
        } catch {
            // ignore quota / privacy / parse errors
        }
    });

    $effect(() => {
        // Re-runs on every columnWidths / hiddenColumnIds / sort change.
        const snapshot = {
            columnWidths,
            hiddenColumnIds: [...hiddenColumnIds],
            sort,
        };
        if (!storageKey || typeof localStorage === "undefined") return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(snapshot));
        } catch {
            // ignore quota / privacy errors
        }
    });
</script>

<div bind:this={rootEl} class={`data-grid ${className}`.trim()} {...restProps}>
    {#if labels.search || hidableColumns.length > 0 || hasExportButtons}
        <div class="data-grid-toolbar">
            {#if labels.search}
                <input
                    class="data-grid-search"
                    type="search"
                    aria-label={labels.search}
                    value={filter}
                    oninput={onFilterInput}
                    onkeydown={onFilterKeydown}
                />
            {/if}
            {#if hasExportButtons}
                <div class="data-grid-export" role="group" aria-label={labels.export}>
                    {#if labels.exportCsv}
                        <button type="button" class="data-grid-export-button" data-grid-export-format="csv" disabled={exportEntries.length === 0} onclick={() => runExport("csv")}>{labels.exportCsv}</button>
                    {/if}
                    {#if labels.exportTsv}
                        <button type="button" class="data-grid-export-button" data-grid-export-format="tsv" disabled={exportEntries.length === 0} onclick={() => runExport("tsv")}>{labels.exportTsv}</button>
                    {/if}
                    {#if labels.exportExcel}
                        <button type="button" class="data-grid-export-button" data-grid-export-format="xlsx" disabled={exportEntries.length === 0} onclick={() => runExport("xlsx")}>{labels.exportExcel}</button>
                    {/if}
                </div>
            {/if}
            {#if hidableColumns.length > 0 && labels.columnVisibility}
                <fieldset class="data-grid-column-visibility">
                    <legend>{labels.columnVisibility}</legend>
                    {#each hidableColumns as column (column.id)}
                        <label>
                            <input
                                type="checkbox"
                                checked={!hiddenColumnIds.has(column.id)}
                                onchange={() => toggleColumnVisibility(column.id)}
                            />
                            {labels.columnVisibilityOption?.(column.header) ?? column.header}
                        </label>
                    {/each}
                </fieldset>
            {/if}
        </div>
    {/if}

    {#snippet cellBody(entry: Entry, column: DataGridColumn, ctx: DataGridCellContext)}
        {#if editing && editing.rowId === entry.id && editing.columnId === column.id}
            {#if column.editor === "person" && column.personEditor}
                {@render column.personEditor({ value: ctx.value, commit: (v: unknown) => { commitValue(entry, column, v); }, cancel: cancelEdit })}
            {:else if column.editor === "time-zone"}
                <span
                    class="data-grid-zoned-editor"
                    role="group"
                    aria-label={labels.cellEditor?.(column.header) ?? column.header}
                    onfocusout={(e: FocusEvent) => { if (editing && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) commitEdit(); }}
                >
                    <input
                        class="data-grid-cell-editor"
                        type="time"
                        step="1"
                        aria-label={labels.cellEditor?.(column.header) ?? column.header}
                        aria-invalid={editing.error || editing.invalid ? "true" : undefined}
                        aria-describedby={editing.error ? `${entry.id}-${column.id}-error` : undefined}
                        value={editing.draft}
                        oninput={(e: Event) => { if (editing) editing = { ...editing, draft: (e.target as HTMLInputElement).value, error: undefined, invalid: false }; }}
                        onkeydown={onEditorKeydown}
                        use:focusEditor
                    />
                    <select
                        class="data-grid-cell-editor data-grid-zone-editor"
                        aria-label={labels.timeZone?.(column.header) ?? column.header}
                        value={editing.zone}
                        onchange={(e: Event) => { if (editing) editing = { ...editing, zone: (e.target as HTMLSelectElement).value, error: undefined, invalid: false }; }}
                        onkeydown={onEditorKeydown}
                    >
                        {#each column.timeZones ?? [] as option (option.id)}
                            <option value={option.id} selected={option.id === editing.zone}>{option.label}</option>
                        {/each}
                    </select>
                </span>
            {:else if column.editor === "select"}
                <select
                    class="data-grid-cell-editor"
                    aria-label={labels.cellEditor?.(column.header) ?? column.header}
                    aria-invalid={editing.error || editing.invalid ? "true" : undefined}
                    aria-describedby={editing.error ? `${entry.id}-${column.id}-error` : undefined}
                    value={editing.draft}
                    onchange={(e: Event) => { if (editing) editing = { ...editing, draft: (e.target as HTMLSelectElement).value, error: undefined, invalid: false }; }}
                    onkeydown={onEditorKeydown}
                    onblur={() => { if (editing) commitEdit(); }}
                    use:focusEditor
                >
                    <option value=""></option>
                    {#each (column.options ?? []).filter((o) => !o.group) as option (option.id)}
                        <option value={option.id} disabled={option.disabled} selected={option.id === editing.draft}>{option.label}</option>
                    {/each}
                    {#each [...new Set((column.options ?? []).filter((o) => o.group).map((o) => o.group as string))] as group (group)}
                        <optgroup label={group}>
                            {#each (column.options ?? []).filter((o) => o.group === group) as option (option.id)}
                                <option value={option.id} disabled={option.disabled} selected={option.id === editing.draft}>{option.label}</option>
                            {/each}
                        </optgroup>
                    {/each}
                </select>
            {:else}
                <input
                    class="data-grid-cell-editor"
                    type={column.editor === "number" ? "number" : column.editor === "date" ? "date" : column.editor === "time" ? "time" : "text"}
                    step={column.editor === "time" ? 1 : undefined}
                    inputmode={column.editor === "number" ? "decimal" : undefined}
                    aria-label={(column.type === "formula" ? labels.formulaEditor?.(column.header) : undefined) ?? labels.cellEditor?.(column.header) ?? column.header}
                    aria-invalid={editing.error || editing.invalid ? "true" : undefined}
                    aria-describedby={editing.error ? `${entry.id}-${column.id}-error` : undefined}
                    value={editing.draft}
                    oninput={(e: Event) => { if (editing) editing = { ...editing, draft: (e.target as HTMLInputElement).value, error: undefined, invalid: false }; }}
                    onkeydown={onEditorKeydown}
                    onblur={() => { if (editing) commitEdit(); }}
                    use:focusEditor
                />
            {/if}
            {#if editing.error}
                <span class="data-grid-cell-error" id={`${entry.id}-${column.id}-error`}>{editing.error}</span>
            {/if}
        {:else if column.type === "radio" && column.editable}
            <fieldset class="data-grid-radio-group" data-grid-own-group>
                <legend class="data-grid-radio-legend">{labels.radioGroup?.(column.header, visibleColumns[0] ? formatCell(visibleColumns[0], entry.row) : entry.id) ?? column.header}</legend>
                {#each column.options ?? [] as option (option.id)}
                    <label class="data-grid-radio-option">
                        <input
                            type="radio"
                            name={`${gridId}-${entry.id}-${column.id}`}
                            value={option.id}
                            checked={ctx.value === option.id}
                            disabled={option.disabled}
                            tabindex={isGrid ? -1 : undefined}
                            onchange={() => commitValue(entry, column, option.id)}
                        />{option.label}</label>
                {/each}
            </fieldset>
        {:else}
            {#if column.cell}{@render column.cell(ctx)}{:else if column.type === "person"}{@render personBody(column, ctx)}{:else if column.type === "file"}{@render fileBody(entry, column, ctx)}{:else if column.type === "link"}{@render linkBody(ctx)}{:else if column.type === "date" || column.type === "time"}{#if ctx.formatted !== ""}<time datetime={String(ctx.value)}>{ctx.formatted}</time>{/if}{:else}{ctx.formatted}{/if}{#if isEditable(column) && column.type !== "radio" && labels.editCell}
                <button
                    type="button"
                    class="data-grid-edit-button"
                    data-grid-own
                    tabindex={isGrid ? -1 : undefined}
                    aria-label={labels.editCell(column.header, visibleColumns[0] ? formatCell(visibleColumns[0], entry.row) : entry.id)}
                    onclick={() => startEdit(entry, column)}
                ></button>{/if}
        {/if}
    {/snippet}

    {#snippet personBody(column: DataGridColumn, ctx: DataGridCellContext)}
        {@const people = peopleOf(ctx.value)}
        {#if people.length > 0}
            {@const shown = column.maxPeople !== undefined ? people.slice(0, Math.max(0, column.maxPeople)) : people}
            <ul class="data-grid-people">
                {#each shown as person (person.id)}
                    <li class="data-grid-person">{#if column.avatar}<span class="data-grid-avatar" aria-hidden="true">{@render column.avatar({ person })}</span>{/if}<span class="data-grid-person-name">{personName(person)}</span></li>
                {/each}
                {#if shown.length < people.length && labels.morePeople}
                    <li class="data-grid-people-more">{labels.morePeople(people.length - shown.length)}</li>
                {/if}
            </ul>
        {/if}
    {/snippet}

    {#snippet fileBody(entry: Entry, column: DataGridColumn, ctx: DataGridCellContext)}
        {@const files = filesOf(ctx.value)}
        {#if files.length > 0}
            <ul class="data-grid-files">
                {#each files as file (file.id)}
                    {@const href = file.href ? safeHref(file.href) : null}
                    <li class="data-grid-file">
                        {#if href}<a class="data-grid-link" {href}>{file.name}</a>{:else}<span class="data-grid-file-name">{file.name}</span>{/if}{#if file.size !== undefined && column.formatSize} <span class="data-grid-file-size">{column.formatSize(file.size)}</span>{/if}{#if column.editable && labels.removeFile}
                            <button
                                type="button"
                                class="data-grid-file-remove"
                                data-grid-own
                                tabindex={isGrid ? -1 : undefined}
                                aria-label={labels.removeFile(file.name)}
                                onclick={() => onFileRemove?.({ rowId: entry.id, row: entry.row, columnId: column.id, fileId: file.id })}
                            ></button>{/if}
                    </li>
                {/each}
            </ul>
        {/if}
        {#if column.editable}
            <input
                type="file"
                class="data-grid-file-input"
                aria-label={labels.fileInput?.(column.header, visibleColumns[0] ? formatCell(visibleColumns[0], entry.row) : entry.id) ?? column.header}
                multiple={column.multiple !== false}
                accept={column.accept}
                tabindex={isGrid ? -1 : undefined}
                onchange={(e: Event) => {
                    const input = e.target as HTMLInputElement;
                    const chosen = Array.from(input.files ?? []);
                    if (chosen.length > 0) onFilesSelected?.({ rowId: entry.id, row: entry.row, columnId: column.id, files: chosen });
                    input.value = "";
                }}
            />
        {/if}
    {/snippet}

    {#snippet linkBody(ctx: DataGridCellContext)}
        {@const link = linkParts(ctx.value)}
        {@const href = link ? safeHref(link.href) : null}
        {#if link}
            {#if href}
                <a class="data-grid-link" {href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>{link.label ?? link.href}{#if link.external && labels.opensInNewTab}{" "}<span class="data-grid-visually-hidden">{labels.opensInNewTab(link.label ?? link.href)}</span>{/if}</a>
            {:else}
                <!-- An address with an unsafe scheme is shown as text, never as a link. -->
                <span class="data-grid-link data-grid-link-unsafe">{link.label ?? link.href}</span>
            {/if}
        {/if}
    {/snippet}

    {#snippet table()}
    <DataTable
        {label}
        {caption}
        role={isGrid ? "grid" : "table"}
        aria-rowcount={isGrid ? rowCount : undefined}
        aria-busy={busy ? "true" : undefined}
        onkeydown={isGrid ? onGridKeydown : undefined}
        onfocusin={isGrid ? onGridFocusin : undefined}
        onfocusout={isGrid ? onGridFocusout : undefined}
        onclick={onRowActivate ? onGridClick : undefined}
        ondblclick={onGridDblclick}
    >
        <DataTableHead>
            <DataTableRow aria-rowindex={indexed ? 1 : undefined}>
                {#if hasSelection}
                    <DataTableTH
                        data-row={-1}
                        data-col={0}
                        tabindex={isGrid ? (activeRow === -1 && activeCol === 0 ? 0 : -1) : undefined}
                    >
                        {#if selectionMode === "multiple"}
                            <input
                                type="checkbox"
                                data-grid-own
                                tabindex={isGrid ? -1 : undefined}
                                aria-label={labels.selectAll}
                                checked={allSelected}
                                use:indeterminateAction={someSelected}
                                onclick={toggleSelectAll}
                            />
                        {:else}
                            <span class="data-grid-selection-header-label">{labels.selectionColumn}</span>
                        {/if}
                    </DataTableTH>
                {/if}
                {#each visibleColumns as column, i (column.id)}
                    <DataTableTH
                        data-row={-1}
                        data-col={colOffset + i}
                        data-align={column.align}
                        data-cell-type={column.type}
                        data-pinned={column.pinned}
                        tabindex={isGrid ? (activeRow === -1 && activeCol === colOffset + i ? 0 : -1) : undefined}
                        aria-sort={ariaSortFor(column)}
                        aria-describedby={column.type === "rollup" && labels.rollupDescription ? `${gridId}-${column.id}-description` : undefined}
                        style={cellStyle(column)}
                        draggable={column.movable ? "true" : undefined}
                        ondragstart={column.movable ? (e: DragEvent) => { draggingColumnId = column.id; e.dataTransfer?.setData("text/plain", column.id); } : undefined}
                        ondragover={column.movable ? (e: DragEvent) => { if (draggingColumnId) e.preventDefault(); } : undefined}
                        ondrop={column.movable ? (e: DragEvent) => onHeaderDrop(column.id, e) : undefined}
                    >
                        {#if column.sortable}
                            <button
                                type="button"
                                class="data-grid-sort-button"
                                data-grid-own
                                tabindex={isGrid ? -1 : undefined}
                                onclick={() => toggleSort(column)}
                            >
                                {#if column.headerCell}{@render column.headerCell({ column })}{:else}{column.header}{/if}
                            </button>
                        {:else if column.headerCell}
                            {@render column.headerCell({ column })}
                        {:else}
                            {column.header}
                        {/if}
                        {#if column.type === "rollup" && labels.rollupDescription}
                            <span class="data-grid-visually-hidden" id={`${gridId}-${column.id}-description`}>{labels.rollupDescription(column.header)}</span>
                        {/if}
                        {#if column.resizable}
                            <!-- WAI-ARIA "window splitter" pattern: role="separator" plus
                                 tabindex/aria-valuenow is exactly how a resize handle becomes
                                 focusable and operable, which the static a11y linter does not
                                 special-case (it flags focusable non-interactive roles
                                 generically) — same accepted shape as Splitter/Resizable in the
                                 headless catalog. -->
                            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                            <span
                                class="data-grid-resize-handle"
                                role="separator"
                                data-grid-own
                                aria-orientation="vertical"
                                aria-label={labels.resizeHandle?.(column.header)}
                                aria-valuenow={widthFor(column) ?? 120}
                                aria-valuemin={MIN_COLUMN_WIDTH}
                                tabindex="0"
                                onkeydown={(e: KeyboardEvent) => onResizeKeydown(column, e)}
                                onpointerdown={(e: PointerEvent) => onResizePointerDown(column, e)}
                            ></span>
                        {/if}
                    </DataTableTH>
                {/each}
            </DataTableRow>
        </DataTableHead>
        <DataTableBody>
            {#each renderItems as item (item.kind === "row" ? pageEntries[item.index].id : item.key)}
              {#if item.kind === "spacer"}
                <tr class="data-grid-spacer" aria-hidden="true" style={`height:${item.rows * (virtualize?.rowHeight ?? 0)}px`}>
                    <td colspan={lastCol + 1}></td>
                </tr>
              {:else}
                {@const rowIndex = item.index}
                {@const entry = pageEntries[rowIndex]}
                {@const row = entry.row}
                {@const id = entry.id}
                <DataTableRow
                    class={rowClass?.(row)}
                    aria-selected={hasSelection ? isSelected(id) : undefined}
                    aria-rowindex={indexed ? pageStart + rowIndex + 2 : undefined}
                    {...rowAttrs?.(row) ?? {}}
                >
                    {#if hasSelection}
                        <DataTableTD
                            data-row={rowIndex}
                            data-col={0}
                            role={isGrid ? "gridcell" : "cell"}
                            {...isGrid ? { active: activeRow === rowIndex && activeCol === 0 } : { tabindex: undefined }}
                            aria-selected={undefined}
                        >
                            <input
                                type={selectionMode === "single" ? "radio" : "checkbox"}
                                data-grid-own
                                tabindex={isGrid ? -1 : undefined}
                                aria-label={labels.selectRow?.(
                                    visibleColumns[0] ? formatCell(visibleColumns[0], row) : String(rowIndex + 1),
                                )}
                                checked={isSelected(id)}
                                onclick={(e: MouseEvent) => toggleRow(pageStart + rowIndex, e)}
                            />
                        </DataTableTD>
                    {/if}
                    {#each visibleColumns as column, colIndex (column.id)}
                        {@const ctx = {
                            value: defaultAccessor(column, row),
                            formatted: formatCell(column, row),
                            row,
                            column,
                        }}
                        {@const extra = column.cellAttrs?.(ctx) ?? {}}
                        {@const extraClass = typeof column.cellClass === "function" ? column.cellClass(ctx) : column.cellClass}
                        {#if column.rowHeader}
                            <DataTableTH
                                scope="row"
                                role="rowheader"
                                class={extraClass}
                                data-row={rowIndex}
                                data-col={colOffset + colIndex}
                                data-align={column.align}
                        data-cell-type={column.type}
                        data-pinned={column.pinned}
                                data-error={column.errorOf?.(row) !== undefined ? "" : undefined}
                                tabindex={isGrid ? (activeRow === rowIndex && activeCol === colOffset + colIndex ? 0 : -1) : undefined}
                                style={cellStyle(column)}
                                {...extra}
                            >
                                {@render cellBody(entry, column, ctx)}
                            </DataTableTH>
                        {:else}
                            <DataTableTD
                                class={extraClass}
                                data-row={rowIndex}
                                data-col={colOffset + colIndex}
                                data-align={column.align}
                        data-cell-type={column.type}
                        data-pinned={column.pinned}
                                data-editable={isEditable(column) ? "" : undefined}
                                data-readonly={column.type === "rollup" ? "" : undefined}
                                ondragover={column.type === "file" && column.editable ? (e: DragEvent) => { if (Array.from(e.dataTransfer?.types ?? []).includes("Files")) e.preventDefault(); } : undefined}
                                ondrop={column.type === "file" && column.editable ? (e: DragEvent) => onFileDrop(entry, column, e) : undefined}
                                aria-readonly={column.type === "rollup" ? "true" : undefined}
                                data-error={column.errorOf?.(row) !== undefined ? "" : undefined}
                                data-editing={editing?.rowId === id && editing.columnId === column.id ? "" : undefined}
                                role={isGrid ? "gridcell" : "cell"}
                                {...isGrid ? { active: activeRow === rowIndex && activeCol === colOffset + colIndex } : { tabindex: undefined }}
                                aria-selected={undefined}
                                style={cellStyle(column)}
                                {...extra}
                            >
                                {@render cellBody(entry, column, ctx)}
                            </DataTableTD>
                        {/if}
                    {/each}
                </DataTableRow>
              {/if}
            {/each}
            {#if pageEntries.length === 0 && empty}
                <DataTableRow class="data-grid-empty-row">
                    <DataTableTD
                        class="data-grid-empty"
                        colspan={lastCol + 1}
                        role={isGrid ? "gridcell" : "cell"}
                        tabindex={undefined}
                    >
                        {@render empty()}
                    </DataTableTD>
                </DataTableRow>
            {/if}
        </DataTableBody>
        {#if footer}
            <DataTableFoot>
                {@render footer({ columns: visibleColumns, rows: pageEntries.map((e) => e.row) })}
            </DataTableFoot>
        {/if}
    </DataTable>
    {/snippet}

    {#if scroll}
        <!-- A scrollable region must be reachable by keyboard (WCAG 2.1.1; axe `scrollable-region-focusable`).
             In grid mode a roving cell is already a tab stop, so only table mode makes the region one. -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
            bind:this={scrollEl}
            class="data-grid-scroll"
            role="region"
            aria-label={label}
            tabindex={isGrid ? undefined : 0}
            style={virtualize ? `height:${virtualize.height}px;overflow:auto` : undefined}
            onscroll={virtualize ? (e: Event) => { scrollTop = (e.currentTarget as HTMLElement).scrollTop; } : undefined}
        >
            {@render table()}
        </div>
    {:else}
        {@render table()}
    {/if}

    {#if pageSize}
        <div class="data-grid-pagination">
            <button
                type="button"
                class="data-grid-page-previous"
                disabled={clampedPage <= 1}
                onclick={() => goToPage(clampedPage - 1)}
            >
                {labels.previousPage}
            </button>
            <span class="data-grid-page-status">{labels.pageStatus?.(clampedPage, pageCount, sortedEntries.length)}</span>
            <button
                type="button"
                class="data-grid-page-next"
                disabled={clampedPage >= pageCount}
                onclick={() => goToPage(clampedPage + 1)}
            >
                {labels.nextPage}
            </button>
        </div>
    {/if}

    <p class="data-grid-status" aria-live="polite">{statusMessage}</p>
</div>
