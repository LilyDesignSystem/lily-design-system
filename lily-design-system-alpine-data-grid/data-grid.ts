/**
 * DataGrid for Alpine.js: the state and behaviour behind `snippet.html`. Headless: no CSS, no text, no icons;
 * every string is a `labels.*` value the consumer supplies, and a label's presence gates the control it names.
 *
 * What it does: multi-column sort (Shift-click adds a key), a text filter over the visible columns, single or multiple row
 * selection, pagination, column visibility, WAI-ARIA APG grid keyboard navigation with a roving tabindex, and export
 * (CSV / TSV download, copy to clipboard). What it does not do yet: inline editing, column resize / reorder / pinning,
 * row virtualization, and the typed cell kinds of the Svelte reference (see spec/index.md).
 */
import { gridMove } from "./grid-navigation.js";
import { isRtl } from "./direction.js";
import { matchesSearch } from "./search-text.js";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText } from "./export-data.js";
import type { ExportFormat, ExportTable } from "./export-data.js";

export type GridRow = Record<string, unknown>;

export type GridColumn = {
    id: string;
    header: string;
    sortable?: boolean;
    /** The column may be hidden with `toggleColumn`. */
    hidable?: boolean;
    /** Text shown for a cell; defaults to `String(value)`. Also used by filter and export. */
    format?: (value: unknown, row: GridRow) => string;
};

export type SortKey = { id: string; dir: "asc" | "desc" };

export type DataGridLabels = {
    /** Accessible name of the grid (required in practice). */
    grid?: string;
    caption?: string;
    search?: string;
    /** Name of the pager group. */
    pagination?: string;
    selectAll?: string;
    selectRow?: (rowName: string) => string;
    sortButton?: (header: string) => string;
    previousPage?: string;
    nextPage?: string;
    /** "Page 2 of 5". */
    pageStatus?: (page: number, pageCount: number) => string;
    empty?: string;
    exportCsv?: string;
    exportTsv?: string;
    copy?: string;
    copyAnnouncement?: (rowCount: number) => string;
    copyFailed?: string;
    sortAnnouncement?: (header: string, dir: "asc" | "desc" | "none") => string;
    filterAnnouncement?: (rowCount: number) => string;
    /** Name of the column-visibility group. */
    columns?: string;
    toggleColumn?: (header: string) => string;
};

export type DataGridOptions = {
    columns: GridColumn[];
    rows: GridRow[];
    /** The row property holding a unique id, or a function; defaults to the row's index. */
    rowId?: string | ((row: GridRow, index: number) => string);
    /** The column whose text names a row for `labels.selectRow`; defaults to the first column. */
    rowNameColumn?: string;
    selectionMode?: "none" | "single" | "multiple";
    /** Rows per page; 0 (default) shows every row. */
    pageSize?: number;
    /** BCP 47 tag for sorting text; the grid never picks one, so unset uses the runtime default collation. */
    locale?: string;
    labels?: DataGridLabels;
    exportFilename?: string;
    /** Which rows an export or copy holds. Default "filtered". */
    exportScope?: "page" | "filtered" | "selected" | "all";
};

type Position = { row: number; col: number };

const present = (v: unknown) => v !== undefined && v !== null && v !== "";

/** Types the methods' `this` as the Alpine component (state plus the `$dispatch`, `$nextTick` and `$root` magics). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const define = <T extends object>(object: T & ThisType<any>): T => object;

export function createDataGrid(options: DataGridOptions) {
    const collator = new Intl.Collator(options.locale);
    return define({
        columns: options.columns,
        rows: options.rows,
        labels: options.labels ?? ({} as DataGridLabels),
        selectionMode: options.selectionMode ?? "none",
        pageSize: options.pageSize ?? 0,
        exportScope: options.exportScope ?? "filtered",
        filter: "",
        sort: [] as SortKey[],
        page: 0,
        selected: [] as string[],
        hidden: [] as string[],
        /** The cell the keyboard is on: row -1 is the header row; col 0 is the selection column when there is one. */
        active: { row: -1, col: 0 } as Position,
        status: "",

        // ---- derived ----------------------------------------------------------------------------------------------
        get selectable(): boolean {
            return this.selectionMode !== "none";
        },
        get visibleColumns(): GridColumn[] {
            return this.columns.filter((c: GridColumn) => !this.hidden.includes(c.id));
        },
        get filteredRows(): GridRow[] {
            const query = this.filter.trim();
            if (!query) return this.rows;
            return this.rows.filter((row: GridRow) =>
                matchesSearch(this.visibleColumns.map((c: GridColumn) => this.cell(row, c)).join(" "), query),
            );
        },
        get sortedRows(): GridRow[] {
            const rows = this.filteredRows;
            if (!this.sort.length) return rows;
            const keys = this.sort.map((k: SortKey) => ({ ...k, col: this.columns.find((c: GridColumn) => c.id === k.id) as GridColumn }));
            return rows
                .map((row: GridRow, index: number) => ({ row, index }))
                .sort((a: { row: GridRow; index: number }, b: { row: GridRow; index: number }) => {
                    for (const k of keys) {
                        const x = a.row[k.id];
                        const y = b.row[k.id];
                        // Missing values sort last whichever way the column runs.
                        if (!present(x) || !present(y)) {
                            if (present(x) === present(y)) continue;
                            return present(x) ? -1 : 1;
                        }
                        const diff =
                            typeof x === "number" && typeof y === "number"
                                ? x - y
                                : x instanceof Date && y instanceof Date
                                  ? x.getTime() - y.getTime()
                                  : collator.compare(this.cell(a.row, k.col), this.cell(b.row, k.col));
                        if (diff !== 0) return k.dir === "asc" ? diff : -diff;
                    }
                    return a.index - b.index;
                })
                .map((entry: { row: GridRow }) => entry.row);
        },
        get pageCount(): number {
            return this.pageSize > 0 ? Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize)) : 1;
        },
        get pageRows(): GridRow[] {
            if (this.pageSize <= 0) return this.sortedRows;
            const start = Math.min(this.page, this.pageCount - 1) * this.pageSize;
            return this.sortedRows.slice(start, start + this.pageSize);
        },
        get colOffset(): number {
            return this.selectable ? 1 : 0;
        },
        /** Columns in the keyboard grid: the selection column plus the visible data columns. */
        get colCount(): number {
            return this.colOffset + this.visibleColumns.length;
        },
        get allSelected(): boolean {
            return this.pageRows.length > 0 && this.pageRows.every((r: GridRow) => this.isSelected(this.id(r)));
        },
        get someSelected(): boolean {
            return !this.allSelected && this.pageRows.some((r: GridRow) => this.isSelected(this.id(r)));
        },

        // ---- cells ------------------------------------------------------------------------------------------------
        id(row: GridRow): string {
            const rule = options.rowId;
            const index = this.rows.indexOf(row);
            if (typeof rule === "function") return String(rule(row, index));
            if (typeof rule === "string") return String(row[rule]);
            return String(index);
        },
        cell(row: GridRow, col: GridColumn): string {
            const value = row[col.id];
            if (col.format) return col.format(value, row);
            return present(value) ? String(value) : "";
        },
        rowName(row: GridRow): string {
            const col = this.columns.find((c: GridColumn) => c.id === options.rowNameColumn) ?? this.columns[0];
            return col ? this.cell(row, col) : "";
        },

        // ---- sort -------------------------------------------------------------------------------------------------
        sortDir(col: GridColumn): "asc" | "desc" | "none" {
            return this.sort.find((k: SortKey) => k.id === col.id)?.dir ?? "none";
        },
        /** aria-sort for a header: only a sortable column has one. */
        ariaSort(col: GridColumn): string | null {
            if (!col.sortable) return null;
            const dir = this.sortDir(col);
            return dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none";
        },
        /** 1 for the primary key, 2 for the next…; null while one key or fewer is set (the `data-sort-order` contract). */
        sortOrder(col: GridColumn): number | null {
            if (this.sort.length < 2) return null;
            const at = this.sort.findIndex((k: SortKey) => k.id === col.id);
            return at < 0 ? null : at + 1;
        },
        /** Ascending, then descending, then off. Shift (`additive`) keeps the other keys. */
        toggleSort(col: GridColumn, additive = false): void {
            if (!col.sortable) return;
            const current = this.sortDir(col);
            const next = current === "none" ? "asc" : current === "asc" ? "desc" : "none";
            const others = additive ? this.sort.filter((k: SortKey) => k.id !== col.id) : [];
            const keys = next === "none" ? others : additive && current !== "none" ? this.sort.map((k: SortKey) => (k.id === col.id ? { id: col.id, dir: next } : k)) : [...others, { id: col.id, dir: next }];
            this.sort = keys;
            this.page = 0;
            this.status = this.labels.sortAnnouncement?.(col.header, next) ?? "";
            this.$dispatch?.("lily:sort", { sort: [...this.sort] });
        },

        // ---- filter and page --------------------------------------------------------------------------------------
        setFilter(value: string): void {
            this.filter = value;
            this.page = 0;
            this.status = this.labels.filterAnnouncement?.(this.filteredRows.length) ?? "";
        },
        goto(page: number): void {
            this.page = Math.min(Math.max(0, page), this.pageCount - 1);
            this.active = { row: Math.min(this.active.row, this.pageRows.length - 1), col: this.active.col };
            this.$dispatch?.("lily:page", { page: this.page });
        },
        get pageLabel(): string {
            return this.labels.pageStatus?.(this.page + 1, this.pageCount) ?? "";
        },

        // ---- selection --------------------------------------------------------------------------------------------
        isSelected(id: string): boolean {
            return this.selected.includes(id);
        },
        toggleRow(id: string): void {
            if (this.selectionMode === "none") return;
            if (this.selectionMode === "single") this.selected = this.isSelected(id) ? [] : [id];
            else this.selected = this.isSelected(id) ? this.selected.filter((s: string) => s !== id) : [...this.selected, id];
            this.$dispatch?.("lily:select", { selected: [...this.selected] });
        },
        toggleAll(): void {
            if (this.selectionMode !== "multiple") return;
            const ids = this.pageRows.map((r: GridRow) => this.id(r));
            this.selected = this.allSelected ? this.selected.filter((s: string) => !ids.includes(s)) : [...new Set([...this.selected, ...ids])];
            this.$dispatch?.("lily:select", { selected: [...this.selected] });
        },

        // ---- columns ----------------------------------------------------------------------------------------------
        toggleColumn(id: string): void {
            const col = this.columns.find((c: GridColumn) => c.id === id);
            if (!col?.hidable) return;
            this.hidden = this.hidden.includes(id) ? this.hidden.filter((h: string) => h !== id) : [...this.hidden, id];
            this.active = { row: this.active.row, col: Math.min(this.active.col, Math.max(0, this.colCount - 1)) };
        },

        // ---- export -----------------------------------------------------------------------------------------------
        exportRows(scope: "page" | "filtered" | "selected" | "all" = this.exportScope): GridRow[] {
            if (scope === "all") return this.rows;
            if (scope === "page") return this.pageRows;
            if (scope === "selected") return this.sortedRows.filter((r: GridRow) => this.isSelected(this.id(r)));
            return this.sortedRows;
        },
        exportTable(scope?: "page" | "filtered" | "selected" | "all"): ExportTable {
            const cols = this.visibleColumns;
            return {
                headers: cols.map((c: GridColumn) => c.header),
                rows: this.exportRows(scope).map((r: GridRow) => cols.map((c: GridColumn) => this.cell(r, c))),
            };
        },
        download(format: ExportFormat = "csv"): void {
            downloadBlob(exportBlob(this.exportTable(), format), exportFilename(options.exportFilename ?? "data", format));
        },
        async copy(): Promise<void> {
            const table = this.exportTable();
            const ok = await copyToClipboard(toClipboardText(table));
            this.status = ok ? (this.labels.copyAnnouncement?.(table.rows.length) ?? "") : (this.labels.copyFailed ?? "");
        },

        // ---- keyboard ---------------------------------------------------------------------------------------------
        /** The tab stop: only the active cell is tabbable. */
        tabindex(row: number, col: number): string {
            return this.active.row === row && this.active.col === col ? "0" : "-1";
        },
        focusCell(): void {
            // The cell is already rendered (only its tabindex follows `active`), so focus it now.
            const cell = this.$root.querySelector(`[data-row="${this.active.row}"][data-col="${this.active.col}"]`) as HTMLElement | null;
            cell?.focus();
        },
        onFocusCell(row: number, col: number): void {
            this.active = { row, col };
        },
        onKeydown(event: KeyboardEvent): void {
            const at = this.active as Position;
            const move = gridMove(event, at, {
                firstRow: -1,
                lastRow: this.pageRows.length - 1,
                lastCol: Math.max(0, this.colCount - 1),
                pageStep: 10,
                rtl: isRtl(this.$root),
            });
            if (move) {
                event.preventDefault();
                this.active = move;
                this.focusCell();
                return;
            }
            if (event.key !== "Enter" && event.key !== " ") return;
            const dataCol = at.col - this.colOffset;
            if (at.row === -1) {
                // Header cell: the selection header toggles all; a data header sorts.
                event.preventDefault();
                if (dataCol < 0) this.toggleAll();
                else this.toggleSort(this.visibleColumns[dataCol], event.shiftKey);
                return;
            }
            const row = this.pageRows[at.row];
            if (!row) return;
            event.preventDefault();
            if (dataCol < 0) this.toggleRow(this.id(row));
            else if (event.key === "Enter") this.$dispatch?.("lily:activate", { id: this.id(row), row });
        },
    });
}

/** The Alpine plugin: registers `Alpine.data("lilyDataGrid", options => …)`. */
export default function lilyDataGrid(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyDataGrid", ((options: DataGridOptions) => createDataGrid(options)) as (...args: never[]) => object);
}
