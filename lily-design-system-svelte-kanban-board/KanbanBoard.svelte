<script lang="ts" module>
    import {
        IconButton,
        KanbanTable,
        KanbanTableBody,
        KanbanTableHead,
        KanbanTableRow,
        KanbanTableTD,
        KanbanTableTH,
        Listbox,
    } from "@lilydesignsystem/svelte-headless";
    import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data";
    import { isInvalidForType, resolveColumn, type DataGridCellType, type DataGridOption, type TypedColumn } from "./cell-types";

    /**
     * A typed field a card carries (an owner, a due date, an estimate): a bundle of display, sort and export defaults from
     * the data grid's cell types, read from `card.values[id]`. Plain data; the board shows it as text.
     */
    export type KanbanField = Omit<TypedColumn, "type"> & {
        /** Visible name of the field; also the header of its export column. */
        header: string;
        /** The kind of value: `text`, `number`, `link`, `date`, `time`, `select` or `radio` are editable here; the others display and export only. */
        type?: DataGridCellType;
        /** Set `false` to keep this field out of an export. */
        exportable?: boolean;
        /** Accessible name of the field's editor. Defaults to `header`. */
        editLabel?: string;
    };

    export type KanbanColumn = {
        /** Stable column identifier. */
        id: string;
        /** Visible column title. */
        title: string;
        /** Work-in-progress limit; the column warns when its card count exceeds this. */
        wipLimit?: number;
        /** A hard limit: a move into this column is refused once it holds `wipLimit` cards. */
        strictLimit?: boolean;
        /** A non-colour status for the column (for example "Over capacity"): shown as visible text in its header and as `data-flag`. */
        flag?: string;
        /** A hook for per-column colour: becomes `data-accent` on the header and every cell. Lily sets no colour. */
        accent?: string;
    };

    export type KanbanCard = {
        /** Stable card identifier. */
        id: string;
        /** The column this card currently belongs to. */
        columnId: string;
        /** Visible card title. */
        title: string;
        /** A locked card cannot be moved, dragged or reordered (`data-locked` on its cell); it still counts toward WIP limits and can be navigated to. */
        locked?: boolean;
        /** A second line under the title (a priority, "source · score", an amount). */
        subtitle?: string;
        /** Short labels shown under the subtitle (each a `.kanban-board-card-badge`). */
        badges?: string[];
        /** A non-colour status (for example "SLA breached"): shown as visible text, set as `data-flag` and linked to the cell with `aria-describedby`, so a screen reader announces it. */
        flag?: string;
        /** Makes the title a link to the record (`<a href>`). */
        href?: string;
        /** `false` stops pointer dragging this card while keeping the move menu and keyboard moves. */
        draggable?: boolean;
        /** The swimlane this card sits in (an id from `lanes`); the first lane when absent. */
        laneId?: string;
        /** Values of the board's `fields`, by field id. */
        values?: Record<string, unknown>;
    };

    /** A swimlane: a horizontal band of rows (an owner, an account) that cards are grouped into. */
    export type KanbanLane = {
        /** Stable lane identifier. */
        id: string;
        /** Visible lane title. */
        title: string;
    };

    /** What the `card` snippet receives. */
    export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

    /** What the `columnHeader` / `columnFooter` snippets receive: the column and every card in it (unfiltered). */
    export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

    /**
     * Every field is optional, but its presence gates the control it
     * names — no baked-in English fallback, matching share-picker's
     * `copyLabel` and data-grid's label-gated toolbar. See spec/index.md §5.
     */
    export type KanbanLabels = {
        cardCount?: (count: number) => string;
        overLimit?: (count: number, limit: number) => string;
        moveButton?: (card: KanbanCard) => string;
        moveMenuLabel?: string;
        moveAnnouncement?: (cardTitle: string, columnTitle: string) => string;
        /** Announced when `canMove` refuses a move. */
        moveBlocked?: (cardTitle: string, columnTitle: string) => string;
        /** Announced after Alt+ArrowUp/Down reorders a card; `position` is 1-based. */
        reorderAnnouncement?: (cardTitle: string, position: number, total: number) => string;
        /** Accessible name for a column's collapse toggle. Gates the toggle. */
        collapseColumn?: (column: KanbanColumn, collapsed: boolean) => string;
        /** Accessible name for a column's add-card button. Gates the button. */
        addCard?: (column: KanbanColumn) => string;
        /** Message shown in an empty column (a column with no cards to show). Gates the message. */
        emptyColumn?: (column: KanbanColumn) => string;
        /** Announced while an async `onMove` is pending: (card title, column title). */
        movePending?: (cardTitle: string, columnTitle: string) => string;
        /** Announced when an async `onMove` rejects and the card goes back: (card title, column title, the rejection). */
        moveFailed?: (cardTitle: string, columnTitle: string, error: unknown) => string;
        /** Accessible name of the board's search field. Gates the field. */
        search?: string;
        /** Accessible name for a lane's collapse toggle: (lane, collapsed). Gates the toggle. */
        collapseLane?: (lane: KanbanLane, collapsed: boolean) => string;
        /** Visible card count in a lane header: (lane, how many cards). Gates the count. */
        laneCount?: (lane: KanbanLane, count: number) => string;
        /** Announced after several selected cards move together: (how many moved, destination column title). */
        moveManyAnnouncement?: (count: number, columnTitle: string) => string;
        /** Visible text of the undo button. Gates the button (with `undoable`). */
        undo?: string;
        /** Announced after an undo: (card title, column it went back to). For a group, the first card's title and the group size is in `undoManyAnnouncement`. */
        undoAnnouncement?: (cardTitle: string, columnTitle: string) => string;
        /** Announced after undoing a group of moves: (how many, ). */
        undoManyAnnouncement?: (count: number) => string;
        /** Announced after a column moves: (column title, 1-based position, how many columns). */
        columnMoveAnnouncement?: (columnTitle: string, position: number, count: number) => string;
        /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
        export?: string;
        /** Visible text of the CSV, TSV and Excel export buttons. Each gates its button. */
        exportCsv?: string;
        exportTsv?: string;
        exportExcel?: string;
        /** Announced after an export: (format, how many cards, file name). */
        exportAnnouncement?: (format: ExportFormat, cardCount: number, filename: string) => string;
        /** Headers of the export's own columns (card title, column, lane, subtitle, badges, flag). An export needs `exportHeaders`; there is no English default. */
        exportHeaders?: { title: string; column: string; lane?: string; subtitle?: string; badges?: string; flag?: string };
        /** Announced after a field edit: (card title, field header, the new text). */
        editAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
        /** Announced when an edit is refused as invalid for the field's type: (card title, field header). */
        editInvalid?: (cardTitle: string, fieldHeader: string) => string;
    };

    /** What `onExport` receives. Return `false` to take over the download. */
    export type KanbanExport = { format: ExportFormat; filename: string; cardCount: number; blob: Blob };

    /** What `onFieldEdit` receives. */
    export type KanbanFieldEdit = { cardId: string; fieldId: string; value: unknown; previous: unknown };

    export type Props = {
        /** Accessible name for the board, passed through to KanbanTable. */
        label: string;
        /** Optional visible caption, passed through to KanbanTable. */
        caption?: string;
        /** Column definitions. */
        columns: KanbanColumn[];
        /** Card data. */
        cards: KanbanCard[];
        /** Hides cards for which it returns false (a search or label filter). Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
        filter?: (card: KanbanCard) => boolean;
        /** Orders the cards shown within each column (a stable sort; the `cards` order is kept when absent). */
        compare?: (a: KanbanCard, b: KanbanCard) => number;
        /** Resolves a card to its display label. Defaults to `card.title`. */
        cardLabel?: (card: KanbanCard) => string;
        /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
        cardAttrs?: (card: KanbanCard) => Record<string, unknown>;
        /**
         * Called when a card moves to a new column, by pointer or the move menu. `toIndex` (0-based, in the visible column) is given only
         * when a pointer drop landed on a card. May return a promise: the card shows in its new column at once with `data-pending`
         * and `aria-busy`, and goes back (announcing `labels.moveFailed`, calling `onMoveError`) if the promise rejects.
         */
        onMove?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>;
        /** Called when an async `onMove` rejects, after the card has gone back. */
        onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
        /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
        allowedColumns?: (card: KanbanCard) => string[];
        /** Board-level search, bindable: shows only cards whose text contains it (case-insensitive). Combines with `filter`. */
        search?: string;
        /** The text `search` looks in. Defaults to the label, subtitle and badges. */
        searchText?: (card: KanbanCard) => string;
        /** Ids of collapsed swimlanes. Two-way bindable. A collapsed lane keeps its header row (and count) but renders no card rows. */
        collapsedLanes?: string[];
        /** Swimlanes: horizontal bands of rows. Each card sits in the lane named by `card.laneId` (the first lane when absent). A drop into another lane's cell changes the lane: `onMove` gets the lane id as its fourth argument. */
        lanes?: KanbanLane[];
        /** Several cards can be selected and moved together: Ctrl/Cmd+click or the `x` key toggles the card under the cursor; moving one selected card moves them all. Bindable ids. */
        selectable?: boolean;
        selected?: string[];
        /** Called with the new selection after every change. */
        onSelectionChange?: (selected: string[]) => void;
        /** Text for the drag preview shown while dragging (one card, or the whole selection): `setDragImage` gets an element with this text (class `kanban-board-drag-preview`). */
        dragPreviewText?: (cards: KanbanCard[]) => string;
        /** Remember successful moves so Ctrl/Cmd+Z (and `labels.undo`'s button) can take them back. A move that took several cards back out is one undo step. The undo calls `onMove` with the column the card came from. */
        undoable?: boolean;
        /** Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column. */
        movableColumns?: boolean;
        /** Column ids in display order, bindable; columns it does not name follow in their own order. */
        columnOrder?: string[];
        /** Called with the new order after a column moves. */
        onColumnOrderChange?: (order: string[]) => void;
        /** Renders only the rows in view (windowing). The board gets a scroll area of `height` px; every row is assumed `rowHeight` px tall (lane headers count as a row). */
        virtualize?: { rowHeight: number; height: number; overscan?: number };
        /** Called when Alt+ArrowUp/Down moves a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
        onReorder?: (cardId: string, toIndex: number) => void;
        /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
        canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
        /** Ids of collapsed columns, bindable. A collapsed column keeps its header and count but shows no cards. */
        collapsedColumns?: string[];
        /** Fired when a column's add-card button is pressed. The consumer adds the card (Lily ships no editor). */
        onAddCard?: (columnId: string) => void;
        /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
        readonly?: boolean;
        /** User-facing strings. See KanbanLabels — presence gates each control. */
        labels?: KanbanLabels;
        /** Typed fields shown under each card's title, read from `card.values`. Editable types edit in place (click the value, or F2 on the card for the first editable field). */
        fields?: KanbanField[];
        /** Locale for number and date fields. Never defaulted. */
        locale?: string;
        /** Called with each accepted field edit. The consumer updates `cards`. A field is editable only when this is set (and the board is not `readonly`). */
        onFieldEdit?: (edit: KanbanFieldEdit) => void;
        /** Base of an export's file name (`.csv`, `.tsv` or `.xlsx` is added). Default `"kanban-board"`. */
        exportFilename?: string;
        /** What an export holds: `"view"` (default) is every card the search and filter leave, column by column; `"selected"` is only the selected cards. */
        exportScope?: "view" | "selected";
        /** Called before the download with the finished file. Return `false` to skip the built-in download. */
        onExport?: (info: KanbanExport) => boolean | void;
        /** Extra CSS class on the root. */
        class?: string;
        [key: string]: unknown;
    };

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextKanbanBoardId(): string {
        uid += 1;
        return `kanban-board-${uid}`;
    }
</script>

<script lang="ts">
    import { tick, type Snippet } from "svelte";

    let {
        class: className = "",
        label,
        caption,
        columns: columnsProp,
        cards,
        lanes = undefined,
        collapsedLanes = $bindable([]),
        selectable = false,
        selected = $bindable([]),
        onSelectionChange = undefined,
        dragPreviewText = undefined,
        undoable = false,
        movableColumns = false,
        columnOrder = $bindable([]),
        onColumnOrderChange = undefined,
        virtualize = undefined,
        filter = undefined,
        compare = undefined,
        cardLabel = (card: KanbanCard) => card.title,
        cardAttrs = undefined,
        onMove,
        onMoveError = undefined,
        allowedColumns = undefined,
        search = $bindable(""),
        searchText = undefined,
        card: cardSnippet = undefined,
        columnHeader = undefined,
        columnFooter = undefined,
        onReorder,
        canMove,
        collapsedColumns = $bindable([]),
        onAddCard,
        readonly = false,
        labels = {},
        fields = undefined,
        locale = undefined,
        onFieldEdit = undefined,
        exportFilename: exportBase = "kanban-board",
        exportScope = "view",
        onExport = undefined,
        ...restProps
    }: Props & {
        card?: Snippet<[KanbanCardContext]>;
        columnHeader?: Snippet<[KanbanColumnContext]>;
        columnFooter?: Snippet<[KanbanColumnContext]>;
    } = $props();

    // Columns in display order: those named in `columnOrder` first, the rest after in their own order.
    const columns = $derived.by(() => {
        if (columnOrder.length === 0) return columnsProp;
        const rank = (id: string) => {
            const i = columnOrder.indexOf(id);
            return i === -1 ? columnOrder.length : i;
        };
        return columnsProp
            .map((c, i) => ({ c, i }))
            .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
            .map((x) => x.c);
    });

    const baseId = nextKanbanBoardId();
    const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;
    const moveListId = `${baseId}-move-list`;

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    let focusedRow = $state(0);
    let focusedCol = $state(0);

    /** The card whose move menu is open, if any. */
    let openCardId = $state<string | null>(null);
    let moveActiveIndex = $state(-1);
    let moveListEl: HTMLElement | undefined = $state();

    /** Cards moved optimistically by an async `onMove` that has not settled: id → destination column. */
    let optimistic = $state<Record<string, string>>({});
    const isPending = (cardId: string) => cardId in optimistic;
    const effectiveCards = $derived(cards.map((c) => (c.id in optimistic ? { ...c, columnId: optimistic[c.id] } : c)));

    const cardsByColumn = $derived.by(() => {
        const map = new Map<string, KanbanCard[]>();
        for (const column of columns) map.set(column.id, []);
        for (const card of effectiveCards) {
            map.get(card.columnId)?.push(card);
        }
        return map;
    });

    // What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
    const shownByColumn = $derived.by(() => {
        const map = new Map<string, KanbanCard[]>();
        for (const [id, list] of cardsByColumn) {
            let shown = filter ? list.filter(filter) : list.slice();
            const needle = search.trim().toLowerCase();
            if (needle) {
                const text = searchText ?? ((c: KanbanCard) => [cardLabel(c), c.subtitle ?? "", ...(c.badges ?? [])].join(" "));
                shown = shown.filter((c) => text(c).toLowerCase().includes(needle));
            }
            if (compare) shown = shown.sort(compare);
            map.set(id, shown);
        }
        return map;
    });

    const isCollapsed = (columnId: string) => collapsedColumns.includes(columnId);

    // A collapsed column shows no cards, so it does not count towards the board's height.
    const isEmptyColumn = (column: KanbanColumn) => !isCollapsed(column.id) && (shownByColumn.get(column.id)?.length ?? 0) === 0;

    // ---- Rows: one band per lane (a single anonymous band without `lanes`) ----
    const laneBands = $derived(lanes && lanes.length > 0 ? lanes : [{ id: "", title: "" } as KanbanLane]);
    const hasLanes = $derived(!!lanes && lanes.length > 0);
    const laneOf = (card: KanbanCard) => (hasLanes ? (card.laneId ?? lanes![0].id) : "");

    /** Shown cards per (column, lane) cell group, in column order. */
    const cellCards = $derived.by(() => {
        const map = new Map<string, KanbanCard[]>();
        for (const [colId, list] of shownByColumn) {
            for (const card of list) {
                const key = `${colId}\u0000${laneOf(card)}`;
                const group = map.get(key);
                if (group) group.push(card);
                else map.set(key, [card]);
            }
        }
        return map;
    });

    /** The grid's rows and lane headers, flattened: `row` slots carry the global (data-row) index. */
    type Slot = { kind: "lane"; lane: KanbanLane } | { kind: "row"; rowIndex: number; laneId: string; laneRow: number };
    const slots = $derived.by(() => {
        const out: Slot[] = [];
        let rowIndex = 0;
        for (const lane of laneBands) {
            if (hasLanes) out.push({ kind: "lane", lane });
            // A collapsed lane keeps its header and shows no card rows.
            if (hasLanes && collapsedLanes.includes(lane.id)) continue;
            let rows = 0;
            for (const column of columns) {
                if (isCollapsed(column.id)) continue;
                rows = Math.max(rows, cellCards.get(`${column.id}\u0000${lane.id}`)?.length ?? 0);
            }
            // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
            // empty column's message even when no column has a card to show.
            if (hasLanes) rows = Math.max(rows, 1);
            else if (rows === 0 && labels.emptyColumn && columns.some(isEmptyColumn)) rows = 1;
            for (let laneRow = 0; laneRow < rows; laneRow++) out.push({ kind: "row", rowIndex: rowIndex++, laneId: lane.id, laneRow });
        }
        return out;
    });
    const rowSlots = $derived(slots.filter((x): x is Extract<Slot, { kind: "row" }> => x.kind === "row"));
    const maxRows = $derived(rowSlots.length);

    const isLaneCollapsed = (laneId: string) => collapsedLanes.includes(laneId);
    /** Every card in a lane (unfiltered by collapse; the search/filter view still applies). */
    const laneCardCount = (laneId: string) => {
        let n = 0;
        for (const column of columns) n += cellCards.get(`${column.id}\u0000${laneId}`)?.length ?? 0;
        return n;
    };
    function toggleLane(lane: KanbanLane): void {
        collapsedLanes = isLaneCollapsed(lane.id) ? collapsedLanes.filter((id) => id !== lane.id) : [...collapsedLanes, lane.id];
    }

    function toggleCollapsed(column: KanbanColumn): void {
        collapsedColumns = isCollapsed(column.id)
            ? collapsedColumns.filter((id) => id !== column.id)
            : [...collapsedColumns, column.id];
    }

    // The roving cursor, clamped to the cells that exist now: a move can shrink
    // the board, and a cursor left on a vanished row would take the grid out of
    // the tab order altogether.
    const activeRow = $derived(Math.min(focusedRow, maxRows - 1));
    const activeCol = $derived(Math.min(focusedCol, columns.length - 1));

    function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
        const column = columns[colIndex];
        const slot = rowSlots[rowIndex];
        if (!column || !slot || isCollapsed(column.id)) return undefined;
        return cellCards.get(`${column.id}\u0000${slot.laneId}`)?.[slot.laneRow];
    }

    // ---- Windowing (virtualize) ----
    let scrollTop = $state(0);
    let scrollEl: HTMLDivElement | undefined = $state();
    // Row index → slot index, built once per layout so a render does not scan `slots` for every row.
    const slotIndexByRow = $derived.by(() => {
        const map = new Map<number, number>();
        slots.forEach((x, i) => {
            if (x.kind === "row") map.set(x.rowIndex, i);
        });
        return map;
    });
    const slotIndexOfRow = (rowIndex: number) => slotIndexByRow.get(rowIndex) ?? -1;
    type RenderItem = { kind: "spacer"; height: number; key: string } | { kind: "slot"; slot: Slot; key: string };
    /** What renders: the slots in view plus the roving tab stop's row (so the grid never leaves the tab order), with spacers for the gaps. */
    const renderItems = $derived.by(() => {
        if (!virtualize) return slots.map((slot): RenderItem => ({ kind: "slot", slot, key: slot.kind === "lane" ? `lane:${slot.lane.id}` : `row:${slot.rowIndex}` }));
        const overscan = virtualize.overscan ?? 3;
        const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
        const end = Math.min(slots.length, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
        const indices = new Set<number>();
        for (let i = start; i < end; i++) indices.add(i);
        const active = slotIndexOfRow(activeRow);
        if (active >= 0) indices.add(active);
        const items: RenderItem[] = [];
        let previous = -1;
        for (const index of [...indices].sort((a, b) => a - b)) {
            if (index - previous > 1) items.push({ kind: "spacer", height: (index - previous - 1) * virtualize.rowHeight, key: `spacer:${previous}` });
            const slot = slots[index];
            items.push({ kind: "slot", slot, key: slot.kind === "lane" ? `lane:${slot.lane.id}` : `row:${slot.rowIndex}` });
            previous = index;
        }
        if (slots.length - 1 - previous > 0) items.push({ kind: "spacer", height: (slots.length - 1 - previous) * virtualize.rowHeight, key: `spacer:${previous}` });
        return items;
    });

    /** Bring a row into the scroll area (virtualized boards render only what is in view). */
    function revealRow(rowIndex: number): void {
        if (!virtualize) return;
        const slotIndex = slotIndexOfRow(rowIndex);
        if (slotIndex < 0) return;
        const top = slotIndex * virtualize.rowHeight;
        if (top < scrollTop) scrollTop = top;
        else if (top + virtualize.rowHeight > scrollTop + virtualize.height) scrollTop = top + virtualize.rowHeight - virtualize.height;
        if (scrollEl) scrollEl.scrollTop = scrollTop;
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Typed fields, inline editing, export
    // ---------------------------------------------------------------

    // Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per card or keystroke.
    const resolvedFields = $derived((fields ?? []).map((f) => resolveColumn(f as KanbanField & TypedColumn, locale) as KanbanField & TypedColumn));
    const EDITABLE_TYPES = new Set(["text", "number", "link", "date", "time", "select", "radio"]);
    const isFieldEditable = (f: KanbanField, card: KanbanCard) =>
        !!onFieldEdit && !readonly && !card.locked && f.editable !== false && EDITABLE_TYPES.has(f.type ?? "text");
    const fieldValue = (f: KanbanField & TypedColumn, card: KanbanCard): unknown => (f.accessor ? f.accessor(card.values ?? {}) : (card.values ?? {})[f.id]);
    const fieldText = (f: KanbanField & TypedColumn, card: KanbanCard): string => {
        const value = fieldValue(f, card);
        if (value === null || value === undefined || value === "") return "";
        const row = card.values ?? {};
        return f.format ? f.format(value, row) : String(value);
    };
    const editorKind = (f: KanbanField): string => f.editor ?? f.type ?? "text";

    /** The field being edited, if any: the draft is the editor's text. */
    let editing = $state<{ cardId: string; fieldId: string; draft: string } | null>(null);
    let committing = false;

    function draftOf(f: KanbanField & TypedColumn, card: KanbanCard): string {
        const value = fieldValue(f, card);
        if (value === null || value === undefined) return "";
        if (f.type === "link") return typeof value === "string" ? value : String((value as { href?: string }).href ?? "");
        return String(value);
    }

    async function startFieldEdit(card: KanbanCard, f: KanbanField & TypedColumn): Promise<void> {
        if (!isFieldEditable(f, card)) return;
        closeMoveMenu(card.id, false);
        editing = { cardId: card.id, fieldId: f.id, draft: draftOf(f, card) };
        await tick();
        const editor = rootEl?.querySelector<HTMLInputElement>(".kanban-board-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }

    function parseDraft(f: KanbanField & TypedColumn, raw: string | number | null): unknown {
        // A number input's bound value arrives as a number (or null when empty), whatever the draft was typed as.
        const draft = raw === null || raw === undefined ? "" : String(raw);
        if (f.parse) return f.parse(draft, {});
        const kind = editorKind(f);
        if (kind === "number") return draft.trim() === "" ? null : Number(draft);
        if (kind === "date" || kind === "time" || kind === "select" || kind === "radio") return draft === "" ? null : draft;
        return draft;
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. */
    function commitFieldEdit(refocus = true): boolean {
        if (!editing || committing) return true;
        const { cardId, fieldId, draft } = editing;
        const card = effectiveCards.find((c) => c.id === cardId);
        const f = resolvedFields.find((x) => x.id === fieldId);
        if (!card || !f) {
            editing = null;
            return true;
        }
        const value = parseDraft(f, draft);
        if (isInvalidForType(f, value)) {
            announce(labels.editInvalid?.(cardLabel(card), f.header));
            return false;
        }
        committing = true;
        const previous = fieldValue(f, card);
        editing = null;
        if (value !== previous) {
            onFieldEdit?.({ cardId, fieldId, value, previous });
            announce(labels.editAnnouncement?.(cardLabel(card), f.header, value === null ? "" : String(value)));
        }
        committing = false;
        if (refocus) void focusCard(cardId);
        return true;
    }

    function cancelFieldEdit(): void {
        if (!editing) return;
        const { cardId } = editing;
        editing = null;
        void focusCard(cardId);
    }

    function onEditorKeydown(event: KeyboardEvent): void {
        // The editor owns its keys. While an IME composes, Enter and Escape belong to the IME: some browsers
        // report the confirming Enter with `isComposing` already false but keyCode 229.
        event.stopPropagation();
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === "Enter") {
            event.preventDefault();
            commitFieldEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancelFieldEdit();
        } else if (event.key === "Tab" && editing) {
            // Tab commits and moves to the card's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const card = effectiveCards.find((c) => c.id === editing!.cardId);
            const editable = card ? resolvedFields.filter((x) => isFieldEditable(x, card)) : [];
            const at = editable.findIndex((x) => x.id === editing!.fieldId);
            const next = editable[at + (event.shiftKey ? -1 : 1)];
            if (card && next) {
                event.preventDefault();
                if (commitFieldEdit(false)) void startFieldEdit(card, next);
            } else {
                commitFieldEdit(false);
            }
        }
    }

    const exportCards = $derived.by(() => {
        const out: KanbanCard[] = [];
        for (const column of columns) for (const card of shownByColumn.get(column.id) ?? []) if (exportScope !== "selected" || isSelected(card.id)) out.push(card);
        return out;
    });
    const exportFieldList = $derived(resolvedFields.filter((f) => f.exportable !== false));
    const hasExportButtons = $derived(!!labels.exportHeaders && !!(labels.exportCsv || labels.exportTsv || labels.exportExcel));

    /** One field for an export: typed values stay typed, everything else is the text the board shows. */
    function exportFieldCell(f: KanbanField & TypedColumn, card: KanbanCard): unknown {
        const row = card.values ?? {};
        if (f.exportValue) return f.exportValue(row);
        const value = fieldValue(f, card);
        if (value === null || value === undefined) return null;
        if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
        return fieldText(f, card);
    }

    function runExport(format: ExportFormat): void {
        const h = labels.exportHeaders;
        if (!h) return;
        const headers = [h.title, h.column];
        if (hasLanes && h.lane) headers.push(h.lane);
        if (h.subtitle) headers.push(h.subtitle);
        if (h.badges) headers.push(h.badges);
        if (h.flag) headers.push(h.flag);
        for (const f of exportFieldList) headers.push(f.header);
        const columnTitle = new Map(columnsProp.map((c) => [c.id, c.title]));
        const laneTitle = new Map((lanes ?? []).map((l) => [l.id, l.title]));
        const rows = exportCards.map((card) => {
            const cells: unknown[] = [cardLabel(card), columnTitle.get(card.columnId) ?? card.columnId];
            if (hasLanes && h.lane) cells.push(laneTitle.get(laneOf(card)) ?? "");
            if (h.subtitle) cells.push(card.subtitle ?? null);
            if (h.badges) cells.push((card.badges ?? []).join("; "));
            if (h.flag) cells.push(card.flag ?? null);
            for (const f of exportFieldList) cells.push(exportFieldCell(f, card));
            return cells;
        });
        const filename = exportFilename(exportBase, format);
        const blob = exportBlob({ headers, rows }, format, { sheetName: exportBase });
        if (onExport?.({ format, filename, cardCount: rows.length, blob }) === false) return;
        downloadBlob(blob, filename);
        announce(labels.exportAnnouncement?.(format, rows.length, filename));
    }

    // ---------------------------------------------------------------
    // Move menu (keyboard + pointer share this)
    // ---------------------------------------------------------------

    /** Choosing the card's own column is not a move: the menu just closes. */
    /** A move is refused by the consumer's `canMove`, or by the destination's hard limit. */
    function isRefused(card: KanbanCard, toColumn: KanbanColumn, extra = 0): boolean {
        if (toColumn.id === card.columnId) return false;
        if (allowedColumns && !allowedColumns(card).includes(toColumn.id)) return true;
        if (canMove && !canMove(card, toColumn)) return true;
        return !!toColumn.strictLimit && toColumn.wipLimit != null && (cardsByColumn.get(toColumn.id)?.length ?? 0) + extra >= toColumn.wipLimit;
    }

    /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
    function moveTargets(card: KanbanCard): KanbanColumn[] {
        if (!allowedColumns) return columns;
        const allowed = allowedColumns(card);
        return columns.filter((c) => c.id === card.columnId || allowed.includes(c.id));
    }

    /** Successful moves, newest last; one entry is one undo step (a group moves back together). */
    let undoStack = $state<{ cardId: string; fromColumnId: string; toColumnId: string }[][]>([]);

    function recordUndo(group: { cardId: string; fromColumnId: string; toColumnId: string }[]): void {
        if (!undoable || group.length === 0) return;
        undoStack = [...undoStack.slice(-49), group];
    }

    /** Resolves true when the move went through (a synchronous `onMove`, or a promise that resolved). */
    async function runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string, silent = false): Promise<boolean> {
        const fromColumnId = card.columnId;
        const result =
            toLaneId !== undefined
                ? onMove?.(card.id, toColumn.id, toIndex, toLaneId)
                : toIndex === undefined
                  ? onMove?.(card.id, toColumn.id)
                  : onMove?.(card.id, toColumn.id, toIndex);
        if (!result || typeof (result as Promise<unknown>).then !== "function") {
            if (!silent) announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
            return true;
        }
        optimistic = { ...optimistic, [card.id]: toColumn.id };
        if (!silent) announce(labels.movePending?.(cardLabel(card), toColumn.title));
        try {
            await result;
            if (!silent) announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
            return true;
        } catch (error) {
            announce(labels.moveFailed?.(cardLabel(card), toColumn.title, error));
            onMoveError?.(card.id, toColumn.id, error);
            return false;
        } finally {
            const { [card.id]: _settled, ...rest } = optimistic;
            optimistic = rest;
            void fromColumnId;
        }
    }

    // ---- Selection: several cards move together ----
    const selectedSet = $derived(new Set(selected));
    const isSelected = (cardId: string) => selectedSet.has(cardId);

    function toggleSelected(cardId: string): void {
        selected = isSelected(cardId) ? selected.filter((id) => id !== cardId) : [...selected, cardId];
        onSelectionChange?.(selected);
    }

    function setSelection(next: string[]): void {
        selected = next;
        onSelectionChange?.(selected);
    }

    /** The cards that move when `card` moves: the whole selection when `card` is in it, else just `card`. */
    function movingGroup(card: KanbanCard): KanbanCard[] {
        if (!selectable || !isSelected(card.id) || selected.length < 2) return [card];
        return effectiveCards.filter((c) => isSelected(c.id));
    }

    async function moveGroup(group: KanbanCard[], toColumn: KanbanColumn): Promise<void> {
        const moved: { cardId: string; fromColumnId: string; toColumnId: string }[] = [];
        let admitted = 0;
        const runs: Promise<boolean>[] = [];
        for (const member of group) {
            if (member.locked || isPending(member.id) || member.columnId === toColumn.id) continue;
            if (isRefused(member, toColumn, admitted)) {
                announce(labels.moveBlocked?.(cardLabel(member), toColumn.title));
                continue;
            }
            admitted += 1;
            const from = member.columnId;
            runs.push(
                runMove(member, toColumn, undefined, undefined, true).then((ok) => {
                    if (ok) moved.push({ cardId: member.id, fromColumnId: from, toColumnId: toColumn.id });
                    return ok;
                }),
            );
        }
        if (runs.length === 0) return;
        announce(labels.moveManyAnnouncement?.(runs.length, toColumn.title));
        setSelection([]);
        await Promise.all(runs);
        recordUndo(moved);
    }

    // ---- Undo ----
    async function undo(): Promise<void> {
        if (!undoable || readonly) return;
        while (undoStack.length > 0) {
            const group = undoStack[undoStack.length - 1];
            undoStack = undoStack.slice(0, -1);
            const live = group
                .map((m) => ({ m, card: effectiveCards.find((c) => c.id === m.cardId) }))
                .filter((x): x is { m: (typeof group)[number]; card: KanbanCard } => !!x.card && x.card.columnId === x.m.toColumnId && !x.card.locked);
            if (live.length === 0) continue; // nothing of this step is where it was left: try the one before
            for (const { m, card } of live) {
                const back = columns.find((c) => c.id === m.fromColumnId);
                if (back) await runMove(card, back, undefined, undefined, true);
            }
            if (live.length === 1) {
                const back = columns.find((c) => c.id === live[0].m.fromColumnId);
                announce(labels.undoAnnouncement?.(cardLabel(live[0].card), back?.title ?? ""));
            } else {
                announce(labels.undoManyAnnouncement?.(live.length));
            }
            return;
        }
    }

    function moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string): void {
        if (readonly || card.locked || isPending(card.id)) return;
        const group = movingGroup(card);
        if (group.length > 1) {
            void moveGroup(group, toColumn);
            closeMoveMenu(card.id);
            return;
        }
        if (isRefused(card, toColumn)) {
            announce(labels.moveBlocked?.(cardLabel(card), toColumn.title));
            closeMoveMenu(card.id);
            return;
        }
        if (toColumn.id !== card.columnId || (toLaneId !== undefined && toLaneId !== laneOf(card))) {
            const from = card.columnId;
            void runMove(card, toColumn, toIndex, toLaneId).then((ok) => {
                if (ok && toColumn.id !== from) recordUndo([{ cardId: card.id, fromColumnId: from, toColumnId: toColumn.id }]);
            });
        }
        closeMoveMenu(card.id);
    }

    async function openMoveMenu(card: KanbanCard): Promise<void> {
        if (readonly || card.locked) return;
        openCardId = card.id;
        const currentIndex = moveTargets(card).findIndex((c) => c.id === card.columnId);
        moveActiveIndex = currentIndex >= 0 ? currentIndex : 0;
        await tick();
        moveListEl?.focus({ preventScroll: true });
    }

    function closeMoveMenu(cardId: string, refocus = true): void {
        if (openCardId === null) return;
        openCardId = null;
        moveActiveIndex = -1;
        if (refocus) void focusCard(cardId);
    }

    /**
     * Focus a card wherever it is after the next render — after a move the
     * consumer's `cards` has put it in another column. The roving cursor
     * follows it there, and focus lands on its move button, or on its cell
     * when there is no button.
     */
    async function focusCard(cardId: string): Promise<void> {
        await tick();
        const cell = Array.from(rootEl?.querySelectorAll<HTMLElement>("[data-card-id]") ?? []).find(
            (el) => el.dataset.cardId === cardId,
        );
        if (!cell) return;
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
        await tick();
        const target = cell.querySelector<HTMLElement>(".kanban-board-move-button") ?? cell;
        target.focus({ preventScroll: true });
    }

    // ---------------------------------------------------------------
    // Pointer drag-and-drop (supplementary, never the only path)
    // ---------------------------------------------------------------

    let draggingCardId: string | null = null;
    let draggingColumnId: string | null = null;

    function onCardDragStart(card: KanbanCard, event: DragEvent): void {
        if (card.locked) {
            event.preventDefault();
            return;
        }
        draggingCardId = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
        draggingGroup = movingGroup(card).map((c) => c.id);
        if (dragPreviewText && event.dataTransfer?.setDragImage && rootEl) {
            const preview = document.createElement("div");
            preview.className = "kanban-board-drag-preview";
            preview.textContent = dragPreviewText(movingGroup(card));
            preview.style.position = "absolute";
            preview.style.top = "-1000px";
            rootEl.appendChild(preview);
            event.dataTransfer.setDragImage(preview, 0, 0);
            setTimeout(() => preview.remove(), 0);
        }
    }

    /** The ids being dragged (the card, or the whole selection), for `data-dragging`. */
    let draggingGroup = $state<string[]>([]);

    /** The cell a dragged card is over, for `data-drop-target` styling. */
    let dropTarget = $state<string | null>(null);

    function onColumnDragOver(event: DragEvent, rowIndex: number, colIndex: number): void {
        if (!draggingCardId || readonly) return;
        event.preventDefault();
        dropTarget = `${rowIndex}-${colIndex}`;
    }

    function onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
        event.preventDefault();
        const cardId = draggingCardId ?? event.dataTransfer?.getData("text/plain");
        draggingCardId = null;
        draggingGroup = [];
        dropTarget = null;
        if (readonly) return;
        const card = cards.find((c) => c.id === cardId);
        if (!card) return;
        const slot = rowSlots[rowIndex];
        const dropLane = hasLanes && slot ? slot.laneId : undefined;
        const shown = (slot ? cellCards.get(`${column.id}\u0000${slot.laneId}`) : shownByColumn.get(column.id)) ?? [];
        const overCard = slot ? shown[slot.laneRow] : shown[rowIndex];
        const dropIndex = slot ? slot.laneRow : rowIndex;
        if (card.columnId === column.id && hasLanes && dropLane !== undefined && dropLane !== laneOf(card)) {
            // Dropped into another lane of its own column: only the lane changes.
            moveCard(card, column, undefined, dropLane);
            return;
        }
        if (card.columnId === column.id) {
            // Dropped on another card of its own column: reorder to that position.
            const from = shown.findIndex((c) => c.id === card.id);
            if (overCard && from >= 0 && from !== dropIndex) {
                onReorder?.(card.id, dropIndex);
                announce(labels.reorderAnnouncement?.(cardLabel(card), dropIndex + 1, shown.length));
            }
            return;
        }
        moveCard(card, column, overCard ? dropIndex : undefined, dropLane);
    }

    function onCardDragEnd(): void {
        draggingGroup = [];
        dropTarget = null;
    }

    // ---- Column reordering ----
    function moveColumnTo(columnId: string, toIndex: number): boolean {
        const ids = columns.map((c) => c.id);
        const from = ids.indexOf(columnId);
        const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
        if (from === -1 || from === to) return false;
        ids.splice(to, 0, ...ids.splice(from, 1));
        columnOrder = ids;
        onColumnOrderChange?.(ids);
        const column = columnsProp.find((c) => c.id === columnId);
        if (column) announce(labels.columnMoveAnnouncement?.(column.title, to + 1, ids.length));
        return true;
    }

    function onHeaderDrop(targetId: string, event: DragEvent): void {
        event.preventDefault();
        const id = draggingColumnId;
        draggingColumnId = null;
        if (!id || id === targetId) return;
        const to = columns.findIndex((c) => c.id === targetId);
        if (to >= 0) moveColumnTo(id, to);
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    async function focusActiveCell(): Promise<void> {
        await tick();
        rootEl?.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')?.focus({ preventScroll: true });
    }

    /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
    function onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
    }

    function moveFocus(row: number, col: number): void {
        focusedCol = Math.min(Math.max(col, 0), columns.length - 1);
        focusedRow = Math.min(Math.max(row, 0), maxRows - 1);
        revealRow(focusedRow);
        void focusActiveCell();
    }

    function reorderCard(delta: 1 | -1): void {
        if (readonly) return;
        const card = cardAt(activeCol, activeRow);
        if (!card || card.locked) return;
        const slot = rowSlots[activeRow];
        const total = (slot ? cellCards.get(`${card.columnId}\u0000${slot.laneId}`) : shownByColumn.get(card.columnId))?.length ?? 0;
        const laneRow = slot ? slot.laneRow : activeRow;
        const toIndex = laneRow + delta;
        if (toIndex < 0 || toIndex >= total) return;
        onReorder?.(card.id, toIndex);
        announce(labels.reorderAnnouncement?.(cardLabel(card), toIndex + 1, total));
        void focusCard(card.id);
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        // The open move menu owns its own keys; letting them bubble here moved the
        // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
        if (target.closest(".kanban-board-move-list")) return;
        if (target.closest(".kanban-board-field-editor")) return;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        if (undoable && ctrlOrMeta && !event.altKey && (event.key === "z" || event.key === "Z")) {
            event.preventDefault();
            void undo();
            return;
        }
        if (movableColumns && event.altKey && event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
            event.preventDefault();
            const column = columns[activeCol];
            const to = activeCol + (event.key === "ArrowLeft" ? -1 : 1);
            if (column && moveColumnTo(column.id, to)) {
                focusedCol = to;
                void focusActiveCell();
            }
            return;
        }
        if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            event.preventDefault();
            const card = cardAt(activeCol, activeRow);
            const destination = columns[activeCol + (event.key === "ArrowLeft" ? -1 : 1)];
            if (card && destination) moveCard(card, destination);
            return;
        }
        if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            event.preventDefault();
            reorderCard(event.key === "ArrowUp" ? -1 : 1);
            return;
        }
        if (selectable && !ctrlOrMeta && !event.altKey && (event.key === "x" || event.key === "X")) {
            const card = cardAt(activeCol, activeRow);
            if (card && !readonly) {
                event.preventDefault();
                toggleSelected(card.id);
            }
            return;
        }
        if (event.key === "F2" && onFieldEdit) {
            // F2: edit the card's first editable field (the keyboard twin of clicking its value).
            const card = cardAt(activeCol, activeRow);
            const first = card ? resolvedFields.find((f) => isFieldEditable(f, card)) : undefined;
            if (card && first) {
                event.preventDefault();
                void startFieldEdit(card, first);
            }
            return;
        }
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                moveFocus(activeRow - 1, activeCol);
                break;
            case "ArrowDown":
                event.preventDefault();
                moveFocus(activeRow + 1, activeCol);
                break;
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(activeRow, activeCol - 1);
                break;
            case "ArrowRight":
                event.preventDefault();
                moveFocus(activeRow, activeCol + 1);
                break;
            case "Home":
                event.preventDefault();
                if (ctrlOrMeta) moveFocus(0, 0);
                else moveFocus(0, activeCol);
                break;
            case "End":
                event.preventDefault();
                if (ctrlOrMeta) moveFocus(maxRows - 1, columns.length - 1);
                else moveFocus(maxRows - 1, activeCol);
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const card = cardAt(activeCol, activeRow);
                if (card) void openMoveMenu(card);
                break;
            }
        }
    }
</script>

<div bind:this={rootEl} class={`kanban-board ${className}`.trim()} data-readonly={readonly ? "" : undefined} {...restProps}>
    {#if labels.search}
        <input type="search" class="kanban-board-search" aria-label={labels.search} bind:value={search} />
    {/if}
    {#if hasExportButtons}
        <div class="kanban-board-export" role="group" aria-label={labels.export}>
            {#if labels.exportCsv}
                <button type="button" class="kanban-board-export-button" data-kanban-export-format="csv" disabled={exportCards.length === 0} onclick={() => runExport("csv")}>{labels.exportCsv}</button>
            {/if}
            {#if labels.exportTsv}
                <button type="button" class="kanban-board-export-button" data-kanban-export-format="tsv" disabled={exportCards.length === 0} onclick={() => runExport("tsv")}>{labels.exportTsv}</button>
            {/if}
            {#if labels.exportExcel}
                <button type="button" class="kanban-board-export-button" data-kanban-export-format="xlsx" disabled={exportCards.length === 0} onclick={() => runExport("xlsx")}>{labels.exportExcel}</button>
            {/if}
        </div>
    {/if}
    {#if undoable && labels.undo && !readonly}
        <button type="button" class="kanban-board-undo-button" disabled={undoStack.length === 0} onclick={() => void undo()}>{labels.undo}</button>
    {/if}
    <!-- The scroll area is structural: a virtualized board renders only the rows in view inside it. -->
    <div
        bind:this={scrollEl}
        class={virtualize ? "kanban-board-scroll" : "kanban-board-body"}
        style={virtualize ? `height:${virtualize.height}px;overflow:auto` : undefined}
        onscroll={virtualize ? (e) => (scrollTop = (e.currentTarget as HTMLElement).scrollTop) : undefined}
    >
    <KanbanTable {label} {caption} onkeydown={onGridKeydown} onfocusin={onGridFocusin} aria-multiselectable={selectable ? "true" : undefined} aria-rowcount={virtualize ? slots.length + 1 : undefined}>
        <KanbanTableHead>
            <KanbanTableRow>
                {#each columns as column (column.id)}
                    {@const count = cardsByColumn.get(column.id)?.length ?? 0}
                    {@const overLimit = column.wipLimit != null && count > column.wipLimit}
                    <KanbanTableTH draggable={movableColumns ? "true" : undefined} ondragstart={movableColumns ? (e: DragEvent) => { draggingColumnId = column.id; e.dataTransfer?.setData("text/plain", column.id); } : undefined} ondragover={movableColumns ? (e: DragEvent) => { if (draggingColumnId) e.preventDefault(); } : undefined} ondrop={movableColumns ? (e: DragEvent) => onHeaderDrop(column.id, e) : undefined} data-over-limit={overLimit ? "" : undefined} data-hidden-count={count - (shownByColumn.get(column.id)?.length ?? 0) > 0 ? count - (shownByColumn.get(column.id)?.length ?? 0) : undefined} data-collapsed={isCollapsed(column.id) ? "" : undefined} data-flag={column.flag} data-accent={column.accent}>
                        {#if labels.collapseColumn}
                            <button
                                type="button"
                                class="kanban-board-collapse-button"
                                aria-expanded={!isCollapsed(column.id)}
                                aria-label={labels.collapseColumn(column, isCollapsed(column.id))}
                                onclick={() => toggleCollapsed(column)}
                            >{isCollapsed(column.id) ? "▸" : "▾"}</button>
                        {/if}
                        {column.title}
                        {#if column.flag}
                            <span class="kanban-board-column-flag">{column.flag}</span>
                        {/if}
                        {#if columnHeader}
                            {@render columnHeader({ column, cards: cardsByColumn.get(column.id) ?? [], count })}
                        {/if}
                        {#if labels.cardCount}
                            <span class="kanban-board-count">{labels.cardCount(count)}</span>
                        {/if}
                        {#if overLimit && labels.overLimit}
                            <span class="kanban-board-wip-warning">{labels.overLimit(count, column.wipLimit ?? 0)}</span>
                        {/if}
                        {#if labels.addCard && !readonly}
                            <button
                                type="button"
                                class="kanban-board-add-button"
                                aria-label={labels.addCard(column)}
                                onclick={() => onAddCard?.(column.id)}
                            >+</button>
                        {/if}
                    </KanbanTableTH>
                {/each}
            </KanbanTableRow>
        </KanbanTableHead>
        <KanbanTableBody>
            {#each renderItems as item (item.key)}
                {#if item.kind === "spacer"}
                    <tr class="kanban-board-spacer" aria-hidden="true" style={`height:${item.height}px`}><td colspan={columns.length}></td></tr>
                {:else}
                {@const slot = item.slot}
                {#if slot.kind === "lane"}
                    <KanbanTableRow data-lane-row>
                        <th
                            class="kanban-board-lane"
                            scope="rowgroup"
                            colspan={columns.length}
                            data-lane-id={slot.lane.id}
                            data-collapsed={isLaneCollapsed(slot.lane.id) ? "" : undefined}
                        >
                            {#if labels.collapseLane}
                                <button
                                    type="button"
                                    class="kanban-board-lane-toggle"
                                    aria-expanded={!isLaneCollapsed(slot.lane.id)}
                                    aria-label={labels.collapseLane(slot.lane, isLaneCollapsed(slot.lane.id))}
                                    onclick={() => toggleLane(slot.lane)}
                                >{isLaneCollapsed(slot.lane.id) ? "▸" : "▾"}</button>
                            {/if}
                            <span class="kanban-board-lane-title">{slot.lane.title}</span>
                            {#if labels.laneCount}
                                <span class="kanban-board-lane-count">{labels.laneCount(slot.lane, laneCardCount(slot.lane.id))}</span>
                            {/if}
                        </th>
                    </KanbanTableRow>
                {:else}
                {@const rowIndex = slot.rowIndex}
                <KanbanTableRow aria-rowindex={virtualize ? slotIndexOfRow(rowIndex) + 2 : undefined} data-lane-id={hasLanes ? slot.laneId : undefined}>
                    {#each columns as column, colIndex (column.id)}
                        {@const card = cardAt(colIndex, rowIndex)}
                        <KanbanTableTD
                            data-row={rowIndex}
                            data-selected={card && selectable && isSelected(card.id) ? "" : undefined}
                            aria-selected={card && selectable && isSelected(card.id) ? "true" : undefined}
                            data-dragging={card && draggingGroup.includes(card.id) ? "" : undefined}
                            onclick={selectable ? (e: MouseEvent) => { if ((e.ctrlKey || e.metaKey) && card && !readonly) { e.preventDefault(); toggleSelected(card.id); } } : undefined}
                            data-col={colIndex}
                            data-card-id={card?.id}
                            data-locked={card?.locked ? "" : undefined}
                            data-pending={card && isPending(card.id) ? "" : undefined}
                            aria-busy={card && isPending(card.id) ? "true" : undefined}
                            data-flag={card?.flag}
                            data-accent={column.accent}
                            data-empty={!card && !hasLanes && rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column) ? "" : undefined}
                            aria-describedby={card?.flag ? `${baseId}-flag-${card.id}` : undefined}
                            {...(card ? (cardAttrs?.(card) ?? {}) : {})}
                            data-collapsed={isCollapsed(column.id) ? "" : undefined}
                            active={activeRow === rowIndex && activeCol === colIndex}
                            label={card ? cardLabel(card) : undefined}
                            data-drop-target={dropTarget === `${rowIndex}-${colIndex}` ? "" : undefined}
                            ondragover={(e: DragEvent) => onColumnDragOver(e, rowIndex, colIndex)}
                            ondragleave={() => (dropTarget = null)}
                            ondrop={(e: DragEvent) => onColumnDrop(column, rowIndex, e)}
                        >
                            {#if card}
                                <!-- The card title is a supplementary pointer-drag handle inside
                                     an already-interactive gridcell (role comes from the parent
                                     KanbanTableTD); dragstart here is one of two equally-real move
                                     paths, not the accessible one — see the move-button/listbox
                                     below for that. No separate role fits a drag handle that isn't
                                     itself a widget. -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <span
                                    class="kanban-board-card-title"
                                    draggable={readonly || card.locked || card.draggable === false ? undefined : "true"}
                                    ondragstart={(e: DragEvent) => onCardDragStart(card, e)}
                                    ondragend={onCardDragEnd}
                                >
                                    {#if cardSnippet}
                                        {@render cardSnippet({ card, label: cardLabel(card), column, pending: isPending(card.id) })}
                                    {:else if card.href}
                                        <a class="kanban-board-card-link" href={card.href}>{cardLabel(card)}</a>
                                    {:else}
                                        {cardLabel(card)}
                                    {/if}
                                </span>
                                {#if !cardSnippet}
                                    {#if card.subtitle}
                                        <span class="kanban-board-card-subtitle">{card.subtitle}</span>
                                    {/if}
                                    {#if card.badges?.length}
                                        <span class="kanban-board-card-badges">
                                            {#each card.badges as badge (badge)}
                                                <span class="kanban-board-card-badge">{badge}</span>
                                            {/each}
                                        </span>
                                    {/if}
                                    {#if resolvedFields.length > 0}
                                        <span class="kanban-board-card-fields">
                                            {#each resolvedFields as f (f.id)}
                                                {@const text = fieldText(f, card)}
                                                {@const editable = isFieldEditable(f, card)}
                                                {@const nameId = `${baseId}-fn-${card.id}-${f.id}`}
                                                {@const valueId = `${baseId}-fv-${card.id}-${f.id}`}
                                                {#if editing && editing.cardId === card.id && editing.fieldId === f.id}
                                                    <span class="kanban-board-card-field" data-field={f.id} data-editing="">
                                                        <span class="kanban-board-card-field-name" id={nameId}>{f.header}</span>
                                                        {#if editorKind(f) === "select" || editorKind(f) === "radio"}
                                                            <select class="kanban-board-field-editor" aria-label={f.editLabel ?? f.header} bind:value={editing.draft} onkeydown={onEditorKeydown} onchange={() => commitFieldEdit()} onblur={() => commitFieldEdit(false)}>
                                                                <option value=""></option>
                                                                {#each (f.options ?? []) as option (option.id)}
                                                                    <option value={option.id} disabled={option.disabled}>{option.label}</option>
                                                                {/each}
                                                            </select>
                                                        {:else}
                                                            <input
                                                                class="kanban-board-field-editor"
                                                                aria-label={f.editLabel ?? f.header}
                                                                type={editorKind(f) === "number" ? "number" : editorKind(f) === "date" ? "date" : editorKind(f) === "time" ? "time" : "text"}
                                                                inputmode={editorKind(f) === "number" ? "decimal" : undefined}
                                                                bind:value={editing.draft}
                                                                onkeydown={onEditorKeydown}
                                                                onblur={() => commitFieldEdit(false)}
                                                            />
                                                        {/if}
                                                    </span>
                                                {:else if text !== "" || editable}
                                                    <span class="kanban-board-card-field" data-field={f.id} data-type={f.type ?? "text"}>
                                                        <span class="kanban-board-card-field-name" id={nameId}>{f.header}</span>
                                                        {#if editable}
                                                            <button type="button" class="kanban-board-field-button" id={valueId} tabindex="-1" aria-labelledby={`${nameId} ${valueId}`} onclick={() => void startFieldEdit(card, f)}>{text}</button>
                                                        {:else}
                                                            <span class="kanban-board-card-field-value">{text}</span>
                                                        {/if}
                                                    </span>
                                                {/if}
                                            {/each}
                                        </span>
                                    {/if}
                                {/if}
                                {#if card.flag}
                                    <span class="kanban-board-card-flag" id={`${baseId}-flag-${card.id}`}>{card.flag}</span>
                                {/if}
                                <!-- Gated on labels.moveButton: an unnamed button is worse than
                                     none, and Enter/Space on the cell opens the menu either way. -->
                                {#if labels.moveButton && !readonly && !card.locked}
                                    <IconButton
                                        baseClass="kanban-board-move-button"
                                        label={labels.moveButton(card)}
                                        tabindex="-1"
                                        aria-haspopup="listbox"
                                        aria-expanded={openCardId === card.id}
                                        aria-controls={openCardId === card.id ? moveListId : undefined}
                                        onclick={() => (openCardId === card.id ? closeMoveMenu(card.id) : openMoveMenu(card))}
                                    >
                                        ⇄
                                    </IconButton>
                                {/if}
                                {#if openCardId === card.id}
                                    <Listbox
                                        bind:ref={moveListEl}
                                        as="ul"
                                        id={moveListId}
                                        baseClass="kanban-board-move-list"
                                        label={labels.moveMenuLabel ?? cardLabel(card)}
                                        navigation="active-descendant"
                                        clamp
                                        bind:activeIndex={moveActiveIndex}
                                        onActivate={(i: number) => moveCard(card, moveTargets(card)[i])}
                                        onEscape={() => closeMoveMenu(card.id)}
                                        onTabOut={() => closeMoveMenu(card.id, false)}
                                    >
                                        {#each moveTargets(card) as destination, i (destination.id)}
                                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                                            <li
                                                class="kanban-board-move-option"
                                                id={moveOptionId(i)}
                                                role="option"
                                                aria-selected={destination.id === card.columnId}
                                                aria-disabled={isRefused(card, destination) ? true : undefined}
                                                data-active={i === moveActiveIndex ? "" : undefined}
                                                onclick={() => moveCard(card, destination)}
                                            >
                                                {destination.title}
                                            </li>
                                        {/each}
                                    </Listbox>
                                {/if}
                            {:else if !hasLanes && rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column)}
                                <span class="kanban-board-empty">{labels.emptyColumn(column)}</span>
                            {/if}
                        </KanbanTableTD>
                    {/each}
                </KanbanTableRow>
                {/if}
                {/if}
            {/each}
        </KanbanTableBody>
        {#if columnFooter}
            <tfoot class="kanban-table-foot">
                <tr class="kanban-table-row">
                    {#each columns as column (column.id)}
                        <td class="kanban-table-td kanban-board-column-footer" data-accent={column.accent}>
                            {@render columnFooter({ column, cards: cardsByColumn.get(column.id) ?? [], count: cardsByColumn.get(column.id)?.length ?? 0 })}
                        </td>
                    {/each}
                </tr>
            </tfoot>
        {/if}
    </KanbanTable>
    </div>

    <p class="kanban-board-status" aria-live="polite">{statusMessage}</p>
</div>
