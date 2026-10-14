<script lang="ts" module>
    import type { Snippet } from "svelte";
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

    /** Arguments a column's `cell` snippet receives. See spec/index.md §5. */
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
        /** Column can be hidden via the column-visibility control. */
        hidable?: boolean;
        /** Initial pixel width, meaningful only when `resizable`. */
        width?: number;
        /** Custom cell renderer. Defaults to the formatted value as text. */
        cell?: Snippet<[DataGridCellContext]>;
        /** The header's content in place of the `header` text. `header` stays the accessible name. */
        headerCell?: Snippet<[{ column: DataGridColumn }]>;
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
        /** Extra CSS class on the root. */
        class?: string;
        [key: string]: unknown;
    };

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
        columns,
        rows,
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
        ...restProps
    }: Props = $props();

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

    // Lowercased search text per row, built once per rows/columns change
    // rather than reformatting every cell on every keystroke. Read only
    // when a filter is active, so an unfiltered grid never builds it.
    const searchIndex = $derived.by(() => {
        const filterableColumns = columns.filter((c) => c.filterable !== false);
        return entries.map((entry) =>
            filterableColumns.map((column) => formatCell(column, entry.row).toLowerCase()),
        );
    });

    const filteredEntries = $derived.by(() => {
        const text = filter.trim().toLowerCase();
        if (!text) return entries;
        const index = searchIndex;
        return entries.filter((_entry, i) => index[i].some((value) => value.includes(text)));
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
    const rowCount = $derived(pageSize ? sortedEntries.length + 1 : undefined);

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

    function onFilterInput(event: Event): void {
        filter = (event.target as HTMLInputElement).value;
        page = 1;
        onFilterChange?.(filter);
        announce(labels.filterAnnouncement?.(filteredEntries.length, rows.length));
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
        focusActiveCell();
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
            case "Enter":
            case " ":
                event.preventDefault();
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
    {#if labels.search || hidableColumns.length > 0}
        <div class="data-grid-toolbar">
            {#if labels.search}
                <input
                    class="data-grid-search"
                    type="search"
                    aria-label={labels.search}
                    value={filter}
                    oninput={onFilterInput}
                />
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
    >
        <DataTableHead>
            <DataTableRow aria-rowindex={pageSize ? 1 : undefined}>
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
                        data-pinned={column.pinned}
                        tabindex={isGrid ? (activeRow === -1 && activeCol === colOffset + i ? 0 : -1) : undefined}
                        aria-sort={ariaSortFor(column)}
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
            {#each pageEntries as entry, rowIndex (entry.id)}
                {@const row = entry.row}
                {@const id = entry.id}
                <DataTableRow
                    class={rowClass?.(row)}
                    aria-selected={hasSelection ? isSelected(id) : undefined}
                    aria-rowindex={pageSize ? pageStart + rowIndex + 2 : undefined}
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
                        data-pinned={column.pinned}
                                tabindex={isGrid ? (activeRow === rowIndex && activeCol === colOffset + colIndex ? 0 : -1) : undefined}
                                style={cellStyle(column)}
                                {...extra}
                            >
                                {#if column.cell}{@render column.cell(ctx)}{:else}{ctx.formatted}{/if}
                            </DataTableTH>
                        {:else}
                            <DataTableTD
                                class={extraClass}
                                data-row={rowIndex}
                                data-col={colOffset + colIndex}
                                data-align={column.align}
                        data-pinned={column.pinned}
                                role={isGrid ? "gridcell" : "cell"}
                                {...isGrid ? { active: activeRow === rowIndex && activeCol === colOffset + colIndex } : { tabindex: undefined }}
                                aria-selected={undefined}
                                style={cellStyle(column)}
                                {...extra}
                            >
                                {#if column.cell}
                                    {@render column.cell(ctx)}
                                {:else}
                                    {ctx.formatted}
                                {/if}
                            </DataTableTD>
                        {/if}
                    {/each}
                </DataTableRow>
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
            class="data-grid-scroll"
            role="region"
            aria-label={label}
            tabindex={isGrid ? undefined : 0}
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
