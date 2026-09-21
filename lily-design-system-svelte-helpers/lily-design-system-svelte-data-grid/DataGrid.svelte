<script lang="ts" module>
    import {
        DataTable,
        DataTableBody,
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
        /** Column participates in the text filter. Default true. */
        filterable?: boolean;
        /** Column can be resized (pointer + keyboard). */
        resizable?: boolean;
        /** Column can be hidden via the column-visibility control. */
        hidable?: boolean;
        /** Initial pixel width, meaningful only when `resizable`. */
        width?: number;
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
        sortAnnouncement?: (header: string, direction: DataGridSortDirection) => string;
        filterAnnouncement?: (matchCount: number, totalCount: number) => string;
        selectionAnnouncement?: (selectedCount: number) => string;
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
        /** Derives a stable id per row. Defaults to the row's index. */
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
        /** Rows per page. Unset disables pagination. */
        pageSize?: number;
        /** Current 1-indexed page. Two-way bindable. */
        page?: number;
        /** If set, persist column widths / hidden columns / sort to localStorage. */
        storageKey?: string;
        /** User-facing strings. See DataGridLabels — presence gates each control. */
        labels?: DataGridLabels;
        /** Extra CSS class on the root. */
        class?: string;
        [key: string]: unknown;
    };

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
        pageSize,
        page = $bindable(1),
        storageKey,
        labels = {},
        ...restProps
    }: Props = $props();

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    let hiddenColumnIds = $state<Set<string>>(new Set());
    let columnWidths = $state<Record<string, number>>({});
    let focusedRow = $state(-1); // -1 = header row
    let focusedCol = $state(0);
    let lastSelectedIndex = -1;

    const hasSelection = $derived(selectionMode !== "none");
    const colOffset = $derived(hasSelection ? 1 : 0);

    const visibleColumns = $derived(columns.filter((c) => !hiddenColumnIds.has(c.id)));
    const hidableColumns = $derived(columns.filter((c) => c.hidable));

    const filteredRows = $derived.by(() => {
        const text = filter.trim().toLowerCase();
        if (!text) return rows;
        const filterableColumns = columns.filter((c) => c.filterable !== false);
        return rows.filter((row) =>
            filterableColumns.some((column) => formatCell(column, row).toLowerCase().includes(text)),
        );
    });

    const sortedRows = $derived.by(() => {
        if (sort.direction === "none" || !sort.columnId) return filteredRows;
        const column = columns.find((c) => c.id === sort.columnId);
        if (!column) return filteredRows;
        const dir = sort.direction === "ascending" ? 1 : -1;
        return [...filteredRows].sort((a, b) => {
            const av = defaultAccessor(column, a);
            const bv = defaultAccessor(column, b);
            if (av === bv) return 0;
            if (av === null || av === undefined) return 1;
            if (bv === null || bv === undefined) return -1;
            return av > bv ? dir : -dir;
        });
    });

    const pageCount = $derived(
        pageSize ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1,
    );
    const clampedPage = $derived(Math.min(Math.max(page, 1), pageCount));
    const pageRows = $derived(
        pageSize ? sortedRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize) : sortedRows,
    );

    const lastCol = $derived(colOffset + visibleColumns.length - 1);

    const allSelected = $derived(
        sortedRows.length > 0 && sortedRows.every((row, i) => selected.includes(rowId(row, i))),
    );
    const someSelected = $derived(!allSelected && sortedRows.some((row, i) => selected.includes(rowId(row, i))));

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
        announce(labels.filterAnnouncement?.(filteredRows.length, rows.length));
    }

    // ---------------------------------------------------------------
    // Selection
    // ---------------------------------------------------------------

    function isSelected(id: string): boolean {
        return selected.includes(id);
    }

    function setSelected(next: string[]): void {
        selected = next;
        onSelectionChange?.(next);
        announce(labels.selectionAnnouncement?.(next.length));
    }

    function toggleRow(row: Record<string, unknown>, index: number, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }): void {
        const id = rowId(row, index);
        if (selectionMode === "single") {
            setSelected(isSelected(id) ? [] : [id]);
        } else if (selectionMode === "multiple") {
            if (event?.shiftKey && lastSelectedIndex >= 0) {
                const [start, end] = lastSelectedIndex < index ? [lastSelectedIndex, index] : [index, lastSelectedIndex];
                const range = sortedRows.slice(start, end + 1).map((r, i) => rowId(r, start + i));
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
            setSelected(sortedRows.map((row, i) => rowId(row, i)));
        }
    }

    // ---------------------------------------------------------------
    // Column resize
    // ---------------------------------------------------------------

    function widthFor(column: DataGridColumn): number | undefined {
        return columnWidths[column.id] ?? column.width;
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
        page = Math.min(Math.max(next, 1), pageCount);
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

    function moveFocus(row: number, col: number): void {
        focusedRow = Math.min(Math.max(row, -1), pageRows.length - 1);
        focusedCol = Math.min(Math.max(col, 0), lastCol);
        focusActiveCell();
    }

    function activateFocusedCell(): void {
        if (focusedCol === 0 && hasSelection) {
            if (focusedRow === -1) {
                if (selectionMode === "multiple") toggleSelectAll();
            } else {
                toggleRow(pageRows[focusedRow], focusedRow);
            }
            return;
        }
        const column = visibleColumns[focusedCol - colOffset];
        if (!column) return;
        if (focusedRow === -1) {
            toggleSort(column);
        }
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                moveFocus(focusedRow, focusedCol + 1);
                break;
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(focusedRow, focusedCol - 1);
                break;
            case "ArrowDown":
                event.preventDefault();
                moveFocus(focusedRow + 1, focusedCol);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveFocus(focusedRow - 1, focusedCol);
                break;
            case "Home":
                event.preventDefault();
                if (event.ctrlKey || event.metaKey) moveFocus(-1, 0);
                else moveFocus(focusedRow, 0);
                break;
            case "End":
                event.preventDefault();
                if (event.ctrlKey || event.metaKey) moveFocus(pageRows.length - 1, lastCol);
                else moveFocus(focusedRow, lastCol);
                break;
            case "PageDown":
                event.preventDefault();
                moveFocus(focusedRow + (pageSize ?? 10), focusedCol);
                break;
            case "PageUp":
                event.preventDefault();
                moveFocus(focusedRow - (pageSize ?? 10), focusedCol);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
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

    <DataTable {label} {caption} onkeydown={onGridKeydown}>
        <DataTableHead>
            <DataTableRow>
                {#if hasSelection}
                    <DataTableTH
                        data-row={-1}
                        data-col={0}
                        tabindex={focusedRow === -1 && focusedCol === 0 ? 0 : -1}
                    >
                        {#if selectionMode === "multiple"}
                            <input
                                type="checkbox"
                                tabindex="-1"
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
                        tabindex={focusedRow === -1 && focusedCol === colOffset + i ? 0 : -1}
                        aria-sort={ariaSortFor(column)}
                        style={widthFor(column) ? `width:${widthFor(column)}px` : undefined}
                    >
                        {#if column.sortable}
                            <button
                                type="button"
                                class="data-grid-sort-button"
                                tabindex="-1"
                                onclick={() => toggleSort(column)}
                            >
                                {column.header}
                            </button>
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
                                aria-orientation="vertical"
                                aria-label={labels.resizeHandle?.(column.header)}
                                aria-valuenow={widthFor(column) ?? 120}
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
            {#each pageRows as row, rowIndex (rowId(row, rowIndex))}
                {@const id = rowId(row, rowIndex)}
                <DataTableRow aria-selected={hasSelection ? isSelected(id) : undefined}>
                    {#if hasSelection}
                        <DataTableTD
                            data-row={rowIndex}
                            data-col={0}
                            active={focusedRow === rowIndex && focusedCol === 0}
                        >
                            <input
                                type={selectionMode === "single" ? "radio" : "checkbox"}
                                tabindex="-1"
                                aria-label={labels.selectRow?.(
                                    visibleColumns[0] ? formatCell(visibleColumns[0], row) : String(rowIndex + 1),
                                )}
                                checked={isSelected(id)}
                                onclick={(e: MouseEvent) => toggleRow(row, rowIndex, e)}
                            />
                        </DataTableTD>
                    {/if}
                    {#each visibleColumns as column, colIndex (column.id)}
                        <DataTableTD
                            data-row={rowIndex}
                            data-col={colOffset + colIndex}
                            active={focusedRow === rowIndex && focusedCol === colOffset + colIndex}
                            style={widthFor(column) ? `width:${widthFor(column)}px` : undefined}
                        >
                            {formatCell(column, row)}
                        </DataTableTD>
                    {/each}
                </DataTableRow>
            {/each}
        </DataTableBody>
    </DataTable>

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
            <span class="data-grid-page-status">{labels.pageStatus?.(clampedPage, pageCount, sortedRows.length)}</span>
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
