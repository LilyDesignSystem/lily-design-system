<script lang="ts" module>
    import type { Snippet } from "svelte";
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
        /** Column can be hidden via the column-visibility control. */
        hidable?: boolean;
        /** Initial pixel width, meaningful only when `resizable`. */
        width?: number;
        /** Custom cell renderer. Defaults to the formatted value as text. */
        cell?: Snippet<[DataGridCellContext]>;
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
    // Always replaced wholesale, never mutated in place, so `$state.raw`:
    // no deep proxy to build or to read through. See spec/index.md §6.
    let hiddenColumnIds = $state.raw<Set<string>>(new Set());
    let columnWidths = $state.raw<Record<string, number>>({});
    let focusedRow = $state(-1); // -1 = header row
    let focusedCol = $state(0);
    let lastSelectedIndex = -1; // index into sortedEntries, not into the page

    const hasSelection = $derived(selectionMode !== "none");
    const colOffset = $derived(hasSelection ? 1 : 0);

    const visibleColumns = $derived(columns.filter((c) => !hiddenColumnIds.has(c.id)));
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

    /** Pointer or programmatic focus on a cell moves the roving position to it. */
    function onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
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

    <DataTable {label} {caption} aria-rowcount={rowCount} onkeydown={onGridKeydown} onfocusin={onGridFocusin}>
        <DataTableHead>
            <DataTableRow aria-rowindex={pageSize ? 1 : undefined}>
                {#if hasSelection}
                    <DataTableTH
                        data-row={-1}
                        data-col={0}
                        tabindex={activeRow === -1 && activeCol === 0 ? 0 : -1}
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
                        tabindex={activeRow === -1 && activeCol === colOffset + i ? 0 : -1}
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
                    aria-selected={hasSelection ? isSelected(id) : undefined}
                    aria-rowindex={pageSize ? pageStart + rowIndex + 2 : undefined}
                >
                    {#if hasSelection}
                        <DataTableTD
                            data-row={rowIndex}
                            data-col={0}
                            active={activeRow === rowIndex && activeCol === 0}
                            aria-selected={undefined}
                        >
                            <input
                                type={selectionMode === "single" ? "radio" : "checkbox"}
                                tabindex="-1"
                                aria-label={labels.selectRow?.(
                                    visibleColumns[0] ? formatCell(visibleColumns[0], row) : String(rowIndex + 1),
                                )}
                                checked={isSelected(id)}
                                onclick={(e: MouseEvent) => toggleRow(pageStart + rowIndex, e)}
                            />
                        </DataTableTD>
                    {/if}
                    {#each visibleColumns as column, colIndex (column.id)}
                        <DataTableTD
                            data-row={rowIndex}
                            data-col={colOffset + colIndex}
                            active={activeRow === rowIndex && activeCol === colOffset + colIndex}
                            aria-selected={undefined}
                            style={widthFor(column) ? `width:${widthFor(column)}px` : undefined}
                        >
                            {#if column.cell}
                                {@render column.cell({
                                    value: defaultAccessor(column, row),
                                    formatted: formatCell(column, row),
                                    row,
                                    column,
                                })}
                            {:else}
                                {formatCell(column, row)}
                            {/if}
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
