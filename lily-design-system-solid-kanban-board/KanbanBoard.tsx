import type { JSX } from "@solidjs/web";
import {
    omit,
    createEffect,
    createSignal,
    createUniqueId,
    For,
    onSettled,
    untrack,
    createMemo,
} from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import {
    IconButton,
    KanbanTable,
    KanbanTableBody,
    KanbanTableHead,
    KanbanTableRow,
    KanbanTableTD,
    KanbanTableTH,
    Listbox,
    Mark,
    SearchInput,
} from "@lilydesignsystem/solid-headless";
import {
    copyToClipboard,
    downloadBlob,
    exportBlob,
    exportFilename,
    toClipboardText,
    type ExportFormat,
} from "./export-data";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove, pageStepFor } from "./grid-navigation";
import {
    EMPTY_HISTORY,
    historyKey,
    recordEdit,
    redoEdit,
    undoEdit,
    type EditHistory,
} from "./edit-history";
import {
    findTypeaheadMatch,
    isTypeaheadKey,
    nextTypeaheadState,
    type TypeaheadState,
} from "./typeahead";
import {
    draftOf,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText,
    editorKind,
    isEditableField,
    neighbourField,
    resolveFields,
    type Draft,
    type FieldDef,
    type ResolvedField,
} from "./typed-fields";

/**
 * A typed field a card carries (an owner, a due date, an estimate): a bundle of display, sort and export defaults from
 * the data grid's cell types, read from `card.values[id]`. Plain data; the board shows it as text.
 */
export type KanbanField = FieldDef;

/** What `onExport` receives. Return `false` to take over the download. */
export type KanbanExport = {
    format: ExportFormat;
    filename: string;
    cardCount: number;
    blob: Blob;
};

/** What `onTitleEdit` receives: the card, its new title, and the title it had. */
export type KanbanTitleEdit = { cardId: string; title: string; previous: string };

/** What `onFieldEdit` receives. */
export type KanbanFieldEdit = {
    cardId: string;
    fieldId: string;
    value: unknown;
    previous: unknown;
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
    /** A non-colour status for the column (for example "Over capacity"): visible text in its header and `data-flag`. */
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
    /** A locked card cannot be moved, dragged or reordered (`data-locked` on its cell); it still counts toward WIP limits. */
    locked?: boolean;
    /** A second line under the title (a priority, "source · score", an amount). */
    subtitle?: string;
    /** Short labels shown under the subtitle (each a `.kanban-board-card-badge`). */
    badges?: string[];
    /** A non-colour status (for example "SLA breached"): visible text, `data-flag`, and linked to the cell with `aria-describedby`. */
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

/** What the `renderCard` prop receives. */
export type KanbanCardContext = {
    card: KanbanCard;
    label: string;
    column: KanbanColumn;
    pending: boolean;
};

/** What the `columnHeader` / `columnFooter` props receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other
 * helper's label-gating convention. See spec/index.md §5.
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
    /** Accessible name for a lane's collapse toggle: (lane, collapsed). Gates the toggle. */
    collapseLane?: (lane: KanbanLane, collapsed: boolean) => string;
    /** Visible card count in a lane header: (lane, how many cards). Gates the count. */
    laneCount?: (lane: KanbanLane, count: number) => string;
    /** Accessible name of the board's search field. Gates the field. */
    search?: string;
    /** Announced after the search changes: (matching cards, all cards). */
    searchAnnouncement?: (matchCount: number, totalCount: number) => string;
    /** Announced after several selected cards move together: (how many moved, destination column title). */
    moveManyAnnouncement?: (count: number, columnTitle: string) => string;
    /** Visible text of the undo button. Gates the button (with `undoable`). */
    undo?: string;
    /** Announced after an undo: (card title, column it went back to). */
    undoAnnouncement?: (cardTitle: string, columnTitle: string) => string;
    /** Announced after undoing a group of moves: (how many). */
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
    /** Visible text of the copy button, which puts the export (header row first, tab-separated) on the clipboard for pasting into a spreadsheet. Gates the button (with `exportHeaders`). */
    copy?: string;
    /** Announced after a copy: (how many rows). */
    copyAnnouncement?: (rowCount: number) => string;
    /** Announced when the clipboard could not be written. */
    copyFailed?: string;
    /** Headers of the export's own columns (card title, column, lane, subtitle, badges, flag). An export needs `exportHeaders`; there is no English default. */
    exportHeaders?: {
        title: string;
        column: string;
        lane?: string;
        subtitle?: string;
        badges?: string;
        flag?: string;
    };
    /** Accessible name of a card's title editor: (the card's current title). Defaults to the title. */
    titleEditor?: (cardTitle: string) => string;
    /** Announced after a title edit: (previous title, new title). */
    titleEditAnnouncement?: (previous: string, title: string) => string;
    /** Announced after a field edit: (card title, field header, the new text). */
    editAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced when a field's `validate` refuses a value: (card title, field header, the reason). Falls back to `editInvalid`. */
    editRefused?: (cardTitle: string, fieldHeader: string, message: string) => string;
    /** Announced after Ctrl/Cmd+Z puts an earlier field value back: (card title, field header, the restored text). */
    fieldUndoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies a field edit: (card title, field header, the text). */
    fieldRedoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced when an edit is refused as invalid for the field's type: (card title, field header). */
    editInvalid?: (cardTitle: string, fieldHeader: string) => string;
};

/** Public props for KanbanBoard. See `spec/index.md` §5 for the contract. */
export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> & {
    /** Accessible name for the board, passed through to KanbanTable. */
    label: string;
    /** Optional visible caption, passed through to KanbanTable. */
    caption?: string;
    /** Column definitions. */
    columns: KanbanColumn[];
    /** Card data. */
    cards: KanbanCard[];
    /** Resolves a card to its display label. Defaults to `card.title`. */
    cardLabel?: (card: KanbanCard) => string;
    /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
    cardAttrs?: (card: KanbanCard) => Record<string, unknown>;
    /** Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
    filter?: (card: KanbanCard) => boolean;
    /** Orders the cards shown within each column (a stable sort). */
    compare?: (a: KanbanCard, b: KanbanCard) => number;
    /**
     * Called when a card moves to a new column, by pointer or the move menu. `toIndex` (0-based, in the visible column) is given only when a
     * pointer drop landed on a card. May return a promise: the card shows in its new column at once with `data-pending` and `aria-busy`,
     * and goes back (announcing `labels.moveFailed`, calling `onMoveError`) if the promise rejects.
     */
    onMove?: (
        cardId: string,
        toColumnId: string,
        toIndex?: number,
        toLaneId?: string,
    ) => void | Promise<unknown>;
    /** Swimlanes: horizontal bands of rows. Each card sits in the lane named by `card.laneId` (the first lane when absent). A drop into another lane's cell changes the lane: `onMove` gets the lane id as its fourth argument. */
    lanes?: KanbanLane[];
    /** Ids of collapsed swimlanes. Controlled when given. A collapsed lane keeps its header row (and count) but renders no card rows. */
    collapsedLanes?: string[];
    defaultCollapsedLanes?: string[];
    onCollapsedLanesChange?: (collapsedLanes: string[]) => void;
    /** Several cards can be selected and moved together: Ctrl/Cmd+click or the `x` key toggles the card under the cursor; moving one selected card moves them all. */
    selectable?: boolean;
    /** The selected card ids. Controlled when given. */
    selected?: string[];
    defaultSelected?: string[];
    /** Called with the new selection after every change. */
    onSelectionChange?: (selected: string[]) => void;
    /** Text for the drag preview shown while dragging (one card, or the whole selection): `setDragImage` gets an element with this text (class `kanban-board-drag-preview`). */
    dragPreviewText?: (cards: KanbanCard[]) => string;
    /** Remember successful moves so Ctrl/Cmd+Z (and `labels.undo`'s button) can take them back. A selection move is one undo step. */
    undoable?: boolean;
    /** Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column. */
    movableColumns?: boolean;
    /** Column ids in display order. Controlled when given; columns it does not name follow in their own order. */
    columnOrder?: string[];
    defaultColumnOrder?: string[];
    /** Called with the new order after a column moves. */
    onColumnOrderChange?: (order: string[]) => void;
    /** Renders only the rows in view. The board gets a scroll area of `height` px; every row is assumed `rowHeight` px tall (lane headers count as a row). */
    virtualize?: { rowHeight: number; height: number; overscan?: number };
    /** Called when an async `onMove` rejects, after the card has gone back. */
    onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
    /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
    allowedColumns?: (card: KanbanCard) => string[];
    /** Board-level search: shows only cards whose text contains it (case-insensitive). Controlled when given; combines with `filter`. */
    search?: string;
    defaultSearch?: string;
    onSearchChange?: (search: string) => void;
    /** The text `search` looks in. Defaults to the label, subtitle and badges. */
    searchText?: (card: KanbanCard) => string;
    /** Replaces the title content of a card (the subtitle and badges are then this render prop's own). */
    renderCard?: (ctx: KanbanCardContext) => JSX.Element;
    /** Rendered in each column's header after its title and flag. */
    columnHeader?: (ctx: KanbanColumnContext) => JSX.Element;
    /** Rendered in a `<tfoot>` cell per column: sums per stage. */
    columnFooter?: (ctx: KanbanColumnContext) => JSX.Element;
    /** Called when Alt+ArrowUp/Down moves a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
    onReorder?: (cardId: string, toIndex: number) => void;
    /** Ids of collapsed columns. Controlled when given. A collapsed column keeps its header and count but shows no cards. */
    collapsedColumns?: string[];
    defaultCollapsedColumns?: string[];
    onCollapsedColumnsChange?: (collapsedColumns: string[]) => void;
    /** Fired when a column's add-card button is pressed. The consumer adds the card (Lily ships no editor). */
    onAddCard?: (columnId: string) => void;
    /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. `toLane` is the swimlane the card would land in (the card's own lane unless it is dropped into another), so a rule can depend on the owner as well as the column. */
    canMove?: (card: KanbanCard, toColumn: KanbanColumn, toLane?: KanbanLane) => boolean;
    /** With swimlanes: may a card be dropped into another lane? Default true. False refuses every cross-lane drop (the cue shows "not allowed"), whatever `canMove` says. */
    allowLaneChange?: boolean;
    /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
    readonly?: boolean;
    /** Show `labels.search` as visible text beside the search field (`.kanban-board-search-label`), not only as its accessible name. The text is the same string, so the visible label is part of the name (WCAG 2.5.3). */
    showSearchLabel?: boolean;
    /** How typed fields sit under a card's title. `compact` sets `data-field-layout="compact"` on the board so CSS can put each field's name and value on one line; the markup is the same either way. Default stacked. */
    fieldLayout?: "stacked" | "compact";
    /** User-facing strings. See KanbanLabels — presence gates each control. */
    labels?: KanbanLabels;
    /** Typed fields shown under each card's title, read from `card.values`. Editable types edit in place (click the value, or F2 on the card for the first editable field; Tab moves to the next). */
    fields?: KanbanField[];
    /** Locale for number and date fields. Never defaulted. */
    locale?: string;
    /** Called with each accepted field edit. The consumer updates `cards`. A field is editable only when this is set (and the board is not `readonly`). */
    onFieldEdit?: (edit: KanbanFieldEdit) => void;
    /** Makes card titles editable in place (double-click, or F2 on the card): Enter or leaving the field commits, Escape cancels, an empty title is refused. Lily changes nothing itself; the consumer renames the card. Not for cards with a link (`href`) or a `renderCard`, whose title is not plain text. */
    onTitleEdit?: (edit: KanbanTitleEdit) => void;
    /** Base of an export's file name (`.csv`, `.tsv` or `.xlsx` is added). Default `"kanban-board"`. */
    exportFilename?: string;
    /** What an export holds: `"view"` (default) is every card the search and filter leave, column by column; `"selected"` is only the selected cards. */
    exportScope?: "view" | "selected";
    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). */
    onCopy?: (copy: { text: string; rowCount: number }) => boolean | void;
    /** Called before the download with the finished file. Return `false` to skip the built-in download. */
    onExport?: (info: KanbanExport) => boolean | void;
    /** Extra CSS class on the root. */
    class?: string;
};

function groupCardsByColumn(
    columns: KanbanColumn[],
    cards: KanbanCard[],
): Map<string, KanbanCard[]> {
    const map = new Map<string, KanbanCard[]>();
    for (const column of columns) map.set(column.id, []);
    for (const card of cards) {
        map.get(card.columnId)?.push(card);
    }
    return map;
}

export function KanbanBoard(props: Props) {
    const p = withDefaults(
        {
            defaultCollapsedLanes: [],
            selectable: false,
            defaultSelected: [],
            undoable: false,
            movableColumns: false,
            defaultColumnOrder: [],
            cardLabel: (card: KanbanCard) => card.title,
            defaultSearch: "" as const,
            allowLaneChange: true,
            defaultCollapsedColumns: [],
            readonly: false,
            showSearchLabel: false,
            fieldLayout: "stacked" as const,
            labels: {} as KanbanLabels,
            exportFilename: "kanban-board" as const,
            exportScope: "view" as const,
            class: "" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "label",
        "caption",
        "columns",
        "cards",
        "lanes",
        "collapsedLanes",
        "defaultCollapsedLanes",
        "onCollapsedLanesChange",
        "selectable",
        "selected",
        "defaultSelected",
        "onSelectionChange",
        "dragPreviewText",
        "undoable",
        "movableColumns",
        "columnOrder",
        "defaultColumnOrder",
        "onColumnOrderChange",
        "virtualize",
        "cardLabel",
        "cardAttrs",
        "filter",
        "compare",
        "onMove",
        "onMoveError",
        "allowedColumns",
        "search",
        "defaultSearch",
        "onSearchChange",
        "searchText",
        "renderCard",
        "columnHeader",
        "columnFooter",
        "onReorder",
        "canMove",
        "allowLaneChange",
        "collapsedColumns",
        "defaultCollapsedColumns",
        "onCollapsedColumnsChange",
        "onAddCard",
        "readonly",
        "showSearchLabel",
        "fieldLayout",
        "labels",
        "fields",
        "locale",
        "onFieldEdit",
        "onTitleEdit",
        "exportFilename",
        "exportScope",
        "onExport",
        "onCopy",
        "class",
    );
    const [columnOrderInner, setColumnOrderInner] = createSignal<string[]>(
        untrack(() => p.defaultColumnOrder),
    );
    const columnOrder = () => p.columnOrder ?? columnOrderInner();
    // Columns in display order: those named in `columnOrder` first, the rest after in their own order.
    const columns = () =>
        columnOrder().length === 0
            ? p.columns
            : p.columns
                  .map((c, i) => ({ c, i }))
                  .sort((a, b) => {
                      const rank = (id: string) =>
                          columnOrder().indexOf(id) === -1
                              ? columnOrder().length
                              : columnOrder().indexOf(id);
                      return rank(a.c.id) - rank(b.c.id) || a.i - b.i;
                  })
                  .map((x) => x.c);

    const baseId = `kanban-board-${createUniqueId()}`;
    const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;
    const moveListId = () => `${baseId}-move-list`;

    const rootRef: { current: HTMLDivElement | null | null } = { current: null };
    const [statusMessage, setStatusMessage] = createSignal("");
    const [focusedRow, setFocusedRow] = createSignal(0);
    const [focusedCol, setFocusedCol] = createSignal(0);

    /** The card whose move menu is open, if any. */
    const [openCardId, setOpenCardId] = createSignal<string | null>(null);
    const [moveActiveIndex, setMoveActiveIndex] = createSignal(-1);

    const moveListRef: { current: HTMLElement | null | null } = { current: null };
    /**
     * Focus to move after the next commit: the menu, the cursor's cell, or a card
     * found by id wherever it now is. Only ever set by a user action, so mounting
     * the board never takes focus from the page.
     */
    type FocusRequest =
        | { kind: "menu" }
        | { kind: "cell" }
        | { kind: "editor" }
        | { kind: "title-editor" }
        | { kind: "card"; id: string }
        | null;
    // A signal, so the focus effect below runs once the DOM has updated; each request is a new object, so asking
    // twice for the same target still runs.
    const [focusRequest, setFocusRequest] = createSignal<FocusRequest>(null);
    const pendingFocusRef = {
        set current(want: FocusRequest) {
            setFocusRequest(want ? { ...want } : null);
        },
        get current(): FocusRequest {
            return untrack(focusRequest);
        },
    };
    const draggingCardIdRef: { current: string | null | null } = { current: null };
    const draggingColumnIdRef: { current: string | null | null } = { current: null };
    const [draggingGroup, setDraggingGroup] = createSignal<string[]>([]);
    const [scrollTop, setScrollTop] = createSignal(0);
    const scrollRef: { current: HTMLDivElement | null | null } = { current: null };
    const [selectedInner, setSelectedInner] = createSignal<string[]>(
        untrack(() => p.defaultSelected),
    );
    const selected = () => p.selected ?? selectedInner();
    const selectedSet = createMemo(() => new Set(selected()));
    const isSelected = (cardId: string) => selectedSet().has(cardId);
    type UndoGroup = { cardId: string; fromColumnId: string; toColumnId: string }[];
    const [undoStack, setUndoStackSignal] = createSignal<UndoGroup[]>([]);
    // Handlers read the stack as it is now: a move records itself in a promise continuation, and Solid applies the
    // signal only at its next flush, so a Ctrl+Z straight after would read the stack from before the move.
    let undoStackNow: UndoGroup[] = [];
    function setUndoStack(next: UndoGroup[] | ((stack: UndoGroup[]) => UndoGroup[])): void {
        undoStackNow = typeof next === "function" ? next(undoStackNow) : next;
        setUndoStackSignal(undoStackNow);
    }

    /** Cards moved optimistically by an async `onMove` that has not settled: id → destination column. */
    const [optimistic, setOptimistic] = createSignal<Record<string, string>>({});
    const isPending = (cardId: string) => cardId in optimistic();
    const effectiveCards = createMemo(() =>
        p.cards.map((c) => (c.id in optimistic() ? { ...c, columnId: optimistic()[c.id] } : c)),
    );
    const [searchInner, setSearchInner] = createSignal(untrack(() => p.defaultSearch));
    const search = () => p.search ?? searchInner();
    const searching = () => search().trim() !== "";
    // Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per card or keystroke.
    const resolvedFields = createMemo(() => resolveFields(p.fields, p.locale));
    // Every card's searchable text: label, subtitle, badges and each field's text .
    const defaultSearchText = (c: KanbanCard): string =>
        [
            p.cardLabel(c),
            c.subtitle ?? "",
            ...(c.badges ?? []),
            ...resolvedFields().map((f) => fieldText(f, c.values)),
        ].join(" ");
    const cardsByColumn = createMemo(() => groupCardsByColumn(columns(), effectiveCards()));
    // What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
    const shownByColumn = createMemo(() => {
        const out = new Map<string, KanbanCard[]>();
        for (const [id, list] of cardsByColumn()) {
            let shown = p.filter ? list.filter(p.filter) : list.slice();
            if (searching()) {
                const text = p.searchText ?? defaultSearchText;
                shown = shown.filter((c) => matchesSearch(text(c), search()));
            }
            if (p.compare) shown = shown.sort(p.compare);
            out.set(id, shown);
        }
        return out;
    });

    const [dropTarget, setDropTarget] = createSignal<string | null>(null);

    const [collapsedInner, setCollapsedInner] = createSignal<string[]>(
        untrack(() => p.defaultCollapsedColumns),
    );
    const collapsedColumns = () => p.collapsedColumns ?? collapsedInner();
    const isCollapsed = (columnId: string) => collapsedColumns().includes(columnId);
    function toggleCollapsed(column: KanbanColumn): void {
        const next = isCollapsed(column.id)
            ? collapsedColumns().filter((id) => id !== column.id)
            : [...collapsedColumns(), column.id];
        if (p.collapsedColumns === undefined) setCollapsedInner(next);
        p.onCollapsedColumnsChange?.(next);
    }

    const [collapsedLanesInner, setCollapsedLanesInner] = createSignal<string[]>(
        untrack(() => p.defaultCollapsedLanes),
    );
    const collapsedLanes = () => p.collapsedLanes ?? collapsedLanesInner();
    const isLaneCollapsed = (laneId: string) => collapsedLanes().includes(laneId);
    function toggleLane(lane: KanbanLane): void {
        const next = isLaneCollapsed(lane.id)
            ? collapsedLanes().filter((id) => id !== lane.id)
            : [...collapsedLanes(), lane.id];
        if (p.collapsedLanes === undefined) setCollapsedLanesInner(next);
        p.onCollapsedLanesChange?.(next);
    }

    // A collapsed column shows no cards, so it does not count towards the board's height.
    const isEmptyColumn = (column: KanbanColumn) =>
        !isCollapsed(column.id) && (shownByColumn().get(column.id)?.length ?? 0) === 0;

    // ---- Rows: one band per lane (a single anonymous band without `lanes`) ----
    const hasLanes = () => !!p.lanes && p.lanes.length > 0;
    const laneBands = (): KanbanLane[] => (hasLanes() ? p.lanes! : [{ id: "", title: "" }]);
    const laneOf = (card: KanbanCard) => (hasLanes() ? (card.laneId ?? p.lanes![0].id) : "");
    const cellCards = createMemo(() => {
        const out = new Map<string, KanbanCard[]>();
        for (const [colId, list] of shownByColumn()) {
            for (const card of list) {
                const key = `${colId}\u0000${laneOf(card)}`;
                const group = out.get(key);
                if (group) group.push(card);
                else out.set(key, [card]);
            }
        }
        return out;
    });

    type Slot =
        | { kind: "lane"; lane: KanbanLane }
        | { kind: "row"; rowIndex: number; laneId: string; laneRow: number };
    const slots = createMemo<Slot[]>(() => {
        const out: Slot[] = [];
        {
            let rowIndex = 0;
            for (const lane of laneBands()) {
                if (hasLanes()) out.push({ kind: "lane", lane });
                // A collapsed lane keeps its header and shows no card rows.
                if (hasLanes() && isLaneCollapsed(lane.id)) continue;
                let rows = 0;
                for (const column of columns()) {
                    if (isCollapsed(column.id)) continue;
                    rows = Math.max(
                        rows,
                        cellCards().get(`${column.id}\u0000${lane.id}`)?.length ?? 0,
                    );
                }
                // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
                // empty column's message even when no column has a card to show.
                if (hasLanes()) rows = Math.max(rows, 1);
                else if (rows === 0 && p.labels.emptyColumn && columns().some(isEmptyColumn))
                    rows = 1;
                for (let laneRow = 0; laneRow < rows; laneRow++)
                    out.push({ kind: "row", rowIndex: rowIndex++, laneId: lane.id, laneRow });
            }
        }
        return out;
    });

    /** Every card in a lane (the search/filter view still applies). */
    const laneCardCount = (laneId: string) => {
        let n = 0;
        for (const column of columns())
            n += cellCards().get(`${column.id}\u0000${laneId}`)?.length ?? 0;
        return n;
    };
    const rowSlots = createMemo(() =>
        slots().filter((x): x is Extract<Slot, { kind: "row" }> => x.kind === "row"),
    );
    const maxRows = () => rowSlots().length;

    // The roving cursor, clamped to the cells that exist now: a move can shrink
    // the board, and a cursor left on a vanished row would take the grid out of
    // the tab order altogether.
    const activeRow = () => Math.min(focusedRow(), maxRows() - 1);
    const activeCol = () => Math.min(focusedCol(), columns().length - 1);

    function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
        const column = columns()[colIndex];
        const slot = rowSlots()[rowIndex];
        if (!column || !slot || isCollapsed(column.id)) return undefined;
        return cellCards().get(`${column.id}\u0000${slot.laneId}`)?.[slot.laneRow];
    }

    // ---- Windowing (virtualize) ----
    // Row index → slot index, built once per render so a row does not scan `slots` to find itself.
    const slotIndexByRow = createMemo(() => {
        const out = new Map<number, number>();
        slots().forEach((x, i) => {
            if (x.kind === "row") out.set(x.rowIndex, i);
        });
        return out;
    });

    const slotIndexOfRow = (rowIndex: number) => slotIndexByRow().get(rowIndex) ?? -1;
    type RenderItem =
        { kind: "spacer"; height: number; key: string } | { kind: "slot"; slot: Slot; key: string };
    const slotKey = (slot: Slot) =>
        slot.kind === "lane" ? `lane:${slot.lane.id}` : `row:${slot.rowIndex}`;
    const renderItems = createMemo<RenderItem[]>(() => {
        const out: RenderItem[] = [];
        if (!p.virtualize) {
            for (const slot of slots()) out.push({ kind: "slot", slot, key: slotKey(slot) });
        } else {
            const overscan = p.virtualize.overscan ?? 3;
            const start = Math.max(0, Math.floor(scrollTop() / p.virtualize.rowHeight) - overscan);
            const end = Math.min(
                slots().length,
                Math.ceil((scrollTop() + p.virtualize.height) / p.virtualize.rowHeight) + overscan,
            );
            const indices = new Set<number>();
            for (let i = start; i < end; i++) indices.add(i);
            // The roving tab stop's row always renders, so the grid never leaves the tab order.
            const active = slotIndexOfRow(activeRow());
            if (active >= 0) indices.add(active);
            let previous = -1;
            for (const index of [...indices].sort((a, b) => a - b)) {
                if (index - previous > 1)
                    out.push({
                        kind: "spacer",
                        height: (index - previous - 1) * p.virtualize.rowHeight,
                        key: `spacer:${previous}`,
                    });
                out.push({ kind: "slot", slot: slots()[index], key: slotKey(slots()[index]) });
                previous = index;
            }
            if (slots().length - 1 - previous > 0) {
                out.push({
                    kind: "spacer",
                    height: (slots().length - 1 - previous) * p.virtualize.rowHeight,
                    key: `spacer:${previous}`,
                });
            }
        }
        return out;
    });

    /** Bring a row into the scroll area (virtualized boards render only what is in view). */
    function revealRow(rowIndex: number): void {
        if (!p.virtualize) return;
        const slotIndex = slotIndexOfRow(rowIndex);
        if (slotIndex < 0) return;
        const top = slotIndex * p.virtualize.rowHeight;
        let next = scrollTop();
        if (top < scrollTop()) next = top;
        else if (top + p.virtualize.rowHeight > scrollTop() + p.virtualize.height)
            next = top + p.virtualize.rowHeight - p.virtualize.height;
        if (next !== scrollTop()) {
            setScrollTop(next);
            if (scrollRef.current) scrollRef.current.scrollTop = next;
        }
    }

    function announce(message: string | undefined): void {
        if (message) setStatusMessage(message);
    }

    // Announce how many cards match after the search changes (not on the first render).
    const searchAnnouncedRef = { current: false };
    createEffect(
        () => [search()],
        () =>
            untrack(() => {
                if (!searchAnnouncedRef.current) {
                    searchAnnouncedRef.current = true;
                    return;
                }
                let matched = 0;
                for (const list of shownByColumn().values()) matched += list.length;
                announce(p.labels.searchAnnouncement?.(matched, p.cards.length));
            }),
    );

    // ---------------------------------------------------------------
    // Typed fields, inline editing, export
    // ---------------------------------------------------------------

    const isFieldEditable = (f: KanbanField, card: KanbanCard) =>
        !!p.onFieldEdit && !p.readonly && !card.locked && isEditableField(f);

    /** The field being edited, if any: the draft is the editor's text. A ref mirrors it so a blur that lands in the same event as Enter sees it cleared. */
    type Editing = { cardId: string; fieldId: string; draft: Draft; invalid?: boolean };
    const [editing, setEditingState] = createSignal<Editing | null>(null);
    const editingRef: { current: Editing | null | null } = { current: null };
    function setEditing(next: Editing | null): void {
        editingRef.current = next;
        setEditingState(next);
    }

    function startFieldEdit(card: KanbanCard, f: ResolvedField): void {
        if (!isFieldEditable(f, card)) return;
        setOpenCardId(null);
        setMoveActiveIndex(-1);
        setEditing({ cardId: card.id, fieldId: f.id, draft: draftOf(f, card.values) });
        pendingFocusRef.current = { kind: "editor" };
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
    function commitFieldEdit(refocus = true): boolean {
        const current = editingRef.current;
        if (!current) return true;
        const { cardId, fieldId, draft } = current;
        const card = effectiveCards().find((c) => c.id === cardId);
        const f = resolvedFields().find((x) => x.id === fieldId);
        if (!card || !f) {
            setEditing(null);
            return true;
        }
        const outcome = evaluateEdit(f, card.values, draft);
        if (outcome.invalid) {
            setEditing({ ...current, invalid: true });
            announce(
                (outcome.message
                    ? p.labels.editRefused?.(p.cardLabel(card), f.header, outcome.message)
                    : undefined) ?? p.labels.editInvalid?.(p.cardLabel(card), f.header),
            );
            return false;
        }
        setEditing(null);
        if (outcome.changed) {
            historyRef.current = recordEdit(historyRef.current, {
                ownerId: cardId,
                fieldId,
                value: outcome.value,
                previous: outcome.previous,
            });
            p.onFieldEdit?.({ cardId, fieldId, value: outcome.value, previous: outcome.previous });
            announce(p.labels.editAnnouncement?.(p.cardLabel(card), f.header, outcome.text));
        }
        if (refocus) pendingFocusRef.current = { kind: "card", id: cardId };
        return true;
    }

    // ---- In-place title editing (`onTitleEdit`) ----

    const isTitleEditable = (card: KanbanCard) =>
        !!p.onTitleEdit && !p.readonly && !card.locked && !card.href && !p.renderCard;
    type EditingTitle = { cardId: string; draft: string };
    const [editingTitle, setEditingTitleState] = createSignal<EditingTitle | null>(null);
    const editingTitleRef: { current: EditingTitle | null | null } = { current: null };
    function setEditingTitle(next: EditingTitle | null): void {
        editingTitleRef.current = next;
        setEditingTitleState(next);
    }

    function startTitleEdit(card: KanbanCard): void {
        if (!isTitleEditable(card)) return;
        setOpenCardId(null);
        setMoveActiveIndex(-1);
        setEditingTitle({ cardId: card.id, draft: p.cardLabel(card) });
        pendingFocusRef.current = { kind: "title-editor" };
    }

    function commitTitleEdit(refocus = true): void {
        const current = editingTitleRef.current;
        if (!current) return;
        setEditingTitle(null);
        const card = effectiveCards().find((c) => c.id === current.cardId);
        const title = current.draft.trim();
        if (card && title !== "" && title !== p.cardLabel(card)) {
            const previous = p.cardLabel(card);
            p.onTitleEdit?.({ cardId: current.cardId, title, previous });
            announce(p.labels.titleEditAnnouncement?.(previous, title));
        }
        if (refocus) pendingFocusRef.current = { kind: "card", id: current.cardId };
    }

    function onTitleEditorKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
        const native = event;
        if (native.isComposing || native.keyCode === 229) return;
        if (event.key === "Enter") {
            event.preventDefault();
            commitTitleEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            const current = editingTitleRef.current;
            setEditingTitle(null);
            if (current) pendingFocusRef.current = { kind: "card", id: current.cardId };
        }
    }

    /** Accepted field edits, for Ctrl/Cmd+Z once there is no move left to undo. The consumer owns the data, so an undo is reported through `onFieldEdit`. */
    const historyRef: { current: EditHistory } = { current: EMPTY_HISTORY };

    /** Put an earlier field value back, or re-apply it, through `onFieldEdit`. */
    function stepHistory(direction: "undo" | "redo"): void {
        const step =
            direction === "undo" ? undoEdit(historyRef.current) : redoEdit(historyRef.current);
        if (!step.record) return;
        historyRef.current = step.history;
        const { ownerId, fieldId, value, previous } = step.record;
        const restored = direction === "undo" ? previous : value;
        const replaced = direction === "undo" ? value : previous;
        p.onFieldEdit?.({ cardId: ownerId, fieldId, value: restored, previous: replaced });
        const card = effectiveCards().find((c) => c.id === ownerId);
        const f = resolvedFields().find((x) => x.id === fieldId);
        if (!card || !f) return;
        const text =
            restored === null || restored === undefined
                ? ""
                : f.format
                  ? f.format(restored, { ...(card.values ?? {}), [fieldId]: restored })
                  : String(restored);
        announce(
            (direction === "undo"
                ? p.labels.fieldUndoAnnouncement
                : p.labels.fieldRedoAnnouncement)?.(p.cardLabel(card), f.header, text),
        );
    }

    function cancelFieldEdit(): void {
        const current = editingRef.current;
        if (!current) return;
        setEditing(null);
        pendingFocusRef.current = { kind: "card", id: current.cardId };
    }

    function onEditorKeyDown(event: KeyboardEvent): void {
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
        } else if (event.key === "Tab" && editingRef.current) {
            // Tab commits and moves to the card's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const current = editingRef.current;
            const card = effectiveCards().find((c) => c.id === current.cardId);
            const next = card
                ? neighbourField(
                      resolvedFields().filter((x) => isFieldEditable(x, card)),
                      current.fieldId,
                      event.shiftKey,
                  )
                : undefined;
            if (card && next) {
                event.preventDefault();
                if (commitFieldEdit(false)) startFieldEdit(card, next);
            } else {
                commitFieldEdit(false);
            }
        }
    }

    const exportCards = createMemo<KanbanCard[]>(() => {
        const out: KanbanCard[] = [];
        for (const column of columns()) {
            for (const card of shownByColumn().get(column.id) ?? [])
                if (p.exportScope !== "selected" || isSelected(card.id)) out.push(card);
        }
        return out;
    });

    const hasExportButtons = () =>
        !!p.labels.exportHeaders &&
        !!(p.labels.copy || p.labels.exportCsv || p.labels.exportTsv || p.labels.exportExcel);

    async function finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
        const text = toClipboardText(table);
        if (p.onCopy?.({ text, rowCount: table.rows.length }) === false) return;
        const ok = await copyToClipboard(text);
        announce(ok ? p.labels.copyAnnouncement?.(table.rows.length) : p.labels.copyFailed);
    }

    function runExport(format: ExportFormat | "copy"): void {
        const h = p.labels.exportHeaders;
        if (!h) return;
        const exportFields = exportableFields(resolvedFields());
        const headers = [h.title, h.column];
        if (hasLanes() && h.lane) headers.push(h.lane);
        if (h.subtitle) headers.push(h.subtitle);
        if (h.badges) headers.push(h.badges);
        if (h.flag) headers.push(h.flag);
        for (const f of exportFields) headers.push(f.header);
        const columnTitle = new Map(p.columns.map((c) => [c.id, c.title]));
        const laneTitle = new Map((p.lanes ?? []).map((l) => [l.id, l.title]));
        const rows = exportCards().map((card) => {
            const cells: unknown[] = [
                p.cardLabel(card),
                columnTitle.get(card.columnId) ?? card.columnId,
            ];
            if (hasLanes() && h.lane) cells.push(laneTitle.get(laneOf(card)) ?? "");
            if (h.subtitle) cells.push(card.subtitle ?? null);
            if (h.badges) cells.push((card.badges ?? []).join("; "));
            if (h.flag) cells.push(card.flag ?? null);
            for (const f of exportFields) cells.push(exportFieldCell(f, card.values));
            return cells;
        });
        if (format === "copy") {
            void finishCopy({ headers, rows });
            return;
        }
        const filename = exportFilename(p.exportFilename, format);
        const blob = exportBlob({ headers, rows }, format, { sheetName: p.exportFilename });
        if (p.onExport?.({ format, filename, cardCount: rows.length, blob }) === false) return;
        downloadBlob(blob, filename);
        announce(p.labels.exportAnnouncement?.(format, rows.length, filename));
    }

    // ---------------------------------------------------------------
    // Move menu (keyboard + pointer share this)
    // ---------------------------------------------------------------

    /** Choosing the card's own column is not a move: the menu just closes. */
    /** A move is refused by the consumer's `canMove`, or by the destination's hard limit. */
    function isRefused(
        card: KanbanCard,
        toColumn: KanbanColumn,
        extra = 0,
        toLaneId?: string,
    ): boolean {
        const laneChange = hasLanes() && toLaneId !== undefined && toLaneId !== laneOf(card);
        if (laneChange && !p.allowLaneChange) return true;
        const sameColumn = toColumn.id === card.columnId;
        if (sameColumn && !laneChange) return false;
        if (!sameColumn && p.allowedColumns && !p.allowedColumns(card).includes(toColumn.id))
            return true;
        const toLane = hasLanes()
            ? p.lanes!.find((l) => l.id === (toLaneId ?? laneOf(card)))
            : undefined;
        if (p.canMove && !p.canMove(card, toColumn, toLane)) return true;
        return (
            !sameColumn &&
            !!toColumn.strictLimit &&
            toColumn.wipLimit != null &&
            (cardsByColumn().get(toColumn.id)?.length ?? 0) + extra >= toColumn.wipLimit
        );
    }

    /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
    function moveTargets(card: KanbanCard): KanbanColumn[] {
        if (!p.allowedColumns) return columns();
        const allowed = p.allowedColumns(card);
        return columns().filter((c) => c.id === card.columnId || allowed.includes(c.id));
    }

    function recordUndo(
        group: { cardId: string; fromColumnId: string; toColumnId: string }[],
    ): void {
        if (!p.undoable || group.length === 0) return;
        setUndoStack((stack) => [...stack.slice(-49), group]);
    }

    /** Resolves true when the move went through (a synchronous `onMove`, or a promise that resolved). */
    async function runMove(
        card: KanbanCard,
        toColumn: KanbanColumn,
        toIndex?: number,
        toLaneId?: string,
        silent = false,
    ): Promise<boolean> {
        const result =
            toLaneId !== undefined
                ? p.onMove?.(card.id, toColumn.id, toIndex, toLaneId)
                : toIndex === undefined
                  ? p.onMove?.(card.id, toColumn.id)
                  : p.onMove?.(card.id, toColumn.id, toIndex);
        if (!result || typeof (result as Promise<unknown>).then !== "function") {
            if (!silent) announce(p.labels.moveAnnouncement?.(p.cardLabel(card), toColumn.title));
            return true;
        }
        setOptimistic((o) => ({ ...o, [card.id]: toColumn.id }));
        if (!silent) announce(p.labels.movePending?.(p.cardLabel(card), toColumn.title));
        try {
            await result;
            if (!silent) announce(p.labels.moveAnnouncement?.(p.cardLabel(card), toColumn.title));
            return true;
        } catch (error) {
            announce(p.labels.moveFailed?.(p.cardLabel(card), toColumn.title, error));
            p.onMoveError?.(card.id, toColumn.id, error);
            return false;
        } finally {
            setOptimistic((o) => {
                const { [card.id]: _settled, ...rest } = o;
                return rest;
            });
        }
    }

    // ---- Selection: several cards move together ----

    function setSelection(next: string[]): void {
        if (p.selected === undefined) setSelectedInner(next);
        p.onSelectionChange?.(next);
    }

    function toggleSelected(cardId: string): void {
        setSelection(
            isSelected(cardId) ? selected().filter((id) => id !== cardId) : [...selected(), cardId],
        );
    }

    /** The cards that move when `card` moves: the whole selection when `card` is in it, else just `card`. */
    function movingGroup(card: KanbanCard): KanbanCard[] {
        if (!p.selectable || !isSelected(card.id) || selected().length < 2) return [card];
        return effectiveCards().filter((c) => isSelected(c.id));
    }

    async function moveGroup(group: KanbanCard[], toColumn: KanbanColumn): Promise<void> {
        const moved: { cardId: string; fromColumnId: string; toColumnId: string }[] = [];
        let admitted = 0;
        const runs: Promise<boolean>[] = [];
        for (const member of group) {
            if (member.locked || isPending(member.id) || member.columnId === toColumn.id) continue;
            if (isRefused(member, toColumn, admitted)) {
                announce(p.labels.moveBlocked?.(p.cardLabel(member), toColumn.title));
                continue;
            }
            admitted += 1;
            const from = member.columnId;
            runs.push(
                runMove(member, toColumn, undefined, undefined, true).then((ok) => {
                    if (ok)
                        moved.push({
                            cardId: member.id,
                            fromColumnId: from,
                            toColumnId: toColumn.id,
                        });
                    return ok;
                }),
            );
        }
        if (runs.length === 0) return;
        announce(p.labels.moveManyAnnouncement?.(runs.length, toColumn.title));
        setSelection([]);
        await Promise.all(runs);
        recordUndo(moved);
    }

    // ---- Undo ----
    async function undo(): Promise<void> {
        if (!p.undoable || p.readonly) return;
        let stack = undoStackNow;
        while (stack.length > 0) {
            const group = stack[stack.length - 1];
            stack = stack.slice(0, -1);
            setUndoStack(stack);
            const live = group
                .map((m) => ({ m, card: effectiveCards().find((c) => c.id === m.cardId) }))
                .filter(
                    (x): x is { m: (typeof group)[number]; card: KanbanCard } =>
                        !!x.card && x.card.columnId === x.m.toColumnId && !x.card.locked,
                );
            if (live.length === 0) continue; // nothing of this step is where it was left: try the one before
            for (const { m, card } of live) {
                const back = columns().find((c) => c.id === m.fromColumnId);
                if (back) await runMove(card, back, undefined, undefined, true);
            }
            if (live.length === 1) {
                const back = columns().find((c) => c.id === live[0].m.fromColumnId);
                announce(p.labels.undoAnnouncement?.(p.cardLabel(live[0].card), back?.title ?? ""));
            } else {
                announce(p.labels.undoManyAnnouncement?.(live.length));
            }
            return;
        }
    }

    function moveCard(
        card: KanbanCard,
        toColumn: KanbanColumn,
        toIndex?: number,
        toLaneId?: string,
    ): void {
        if (p.readonly || card.locked || isPending(card.id)) return;
        const group = movingGroup(card);
        if (group.length > 1) {
            void moveGroup(group, toColumn);
            closeMoveMenu(card.id);
            return;
        }
        if (isRefused(card, toColumn, 0, toLaneId)) {
            announce(p.labels.moveBlocked?.(p.cardLabel(card), toColumn.title));
            closeMoveMenu(card.id);
            return;
        }
        if (
            toColumn.id !== card.columnId ||
            (toLaneId !== undefined && toLaneId !== laneOf(card))
        ) {
            const from = card.columnId;
            void runMove(card, toColumn, toIndex, toLaneId).then((ok) => {
                if (ok && toColumn.id !== from)
                    recordUndo([{ cardId: card.id, fromColumnId: from, toColumnId: toColumn.id }]);
            });
        }
        closeMoveMenu(card.id);
    }

    function openMoveMenu(card: KanbanCard): void {
        if (p.readonly || card.locked) return;
        setOpenCardId(card.id);
        const currentIndex = moveTargets(card).findIndex((c) => c.id === card.columnId);
        setMoveActiveIndex(currentIndex >= 0 ? currentIndex : 0);
        pendingFocusRef.current = { kind: "menu" };
    }

    function closeMoveMenu(cardId: string, refocus = true): void {
        setOpenCardId(null);
        setMoveActiveIndex(-1);
        pendingFocusRef.current = refocus ? { kind: "card", id: cardId } : null;
    }

    // Runs after every commit, and acts only on a pending request. A card is
    // found by id after the commit — after a move the consumer's `cards` has put
    // it in another column — and the roving cursor follows it there; focus lands
    // on its move button, or on its cell when there is no button.
    createEffect(focusRequest, (pending) => {
        if (!pending) return;
        untrack(() => {
            const root = rootRef.current;
            if (!root) return;
            if (pending.kind === "menu") {
                moveListRef.current?.focus({ preventScroll: true });
            } else if (pending.kind === "title-editor") {
                const editor = root.querySelector<HTMLInputElement>(".kanban-board-title-editor");
                editor?.focus({ preventScroll: true });
                editor?.select();
            } else if (pending.kind === "editor") {
                const editor = root.querySelector<HTMLInputElement>(".kanban-board-field-editor");
                editor?.focus({ preventScroll: true });
                if (
                    editor &&
                    "select" in editor &&
                    editor.type !== "number" &&
                    editor.type !== "date" &&
                    editor.type !== "time"
                )
                    editor.select();
            } else if (pending.kind === "cell") {
                root.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')?.focus({
                    preventScroll: true,
                });
            } else {
                const cell = Array.from(root.querySelectorAll<HTMLElement>("[data-card-id]")).find(
                    (el) => el.dataset.cardId === pending.id,
                );
                if (!cell) return;
                setFocusedRow(Number(cell.dataset.row));
                setFocusedCol(Number(cell.dataset.col));
                (cell.querySelector<HTMLElement>(".kanban-board-move-button") ?? cell).focus({
                    preventScroll: true,
                });
            }
        });
    });

    // ---------------------------------------------------------------
    // Pointer drag-and-drop (supplementary, never the only path)
    // ---------------------------------------------------------------

    function onCardDragStart(card: KanbanCard, event: DragEvent): void {
        if (card.locked) {
            event.preventDefault();
            return;
        }
        draggingCardIdRef.current = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
        const group = movingGroup(card);
        setDraggingGroup(group.map((c) => c.id));
        const root = rootRef.current;
        if (p.dragPreviewText && event.dataTransfer?.setDragImage && root) {
            const preview = document.createElement("div");
            preview.className = "kanban-board-drag-preview";
            preview.textContent = p.dragPreviewText(group);
            preview.style.position = "absolute";
            preview.style.top = "-1000px";
            root.appendChild(preview);
            event.dataTransfer.setDragImage(preview, 0, 0);
            setTimeout(() => preview.remove(), 0);
        }
    }

    function onCardDragEnd(): void {
        setDraggingGroup([]);
        setDropTarget(null);
        setDropBlocked(false);
    }

    // ---- Column reordering ----
    function moveColumnTo(columnId: string, toIndex: number): boolean {
        const ids = columns().map((c) => c.id);
        const from = ids.indexOf(columnId);
        const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
        if (from === -1 || from === to) return false;
        ids.splice(to, 0, ...ids.splice(from, 1));
        if (p.columnOrder === undefined) setColumnOrderInner(ids);
        p.onColumnOrderChange?.(ids);
        const column = p.columns.find((c) => c.id === columnId);
        if (column) announce(p.labels.columnMoveAnnouncement?.(column.title, to + 1, ids.length));
        return true;
    }

    function onHeaderDrop(targetId: string, event: DragEvent): void {
        event.preventDefault();
        const id = draggingColumnIdRef.current;
        draggingColumnIdRef.current = null;
        if (!id || id === targetId) return;
        const to = columns().findIndex((c) => c.id === targetId);
        if (to >= 0) moveColumnTo(id, to);
    }

    /** Whether the cell a dragged card is over would refuse it (`canMove`, `allowedColumns`, a strict WIP limit): the live "can't drop here" cue. */
    const [dropBlocked, setDropBlocked] = createSignal(false);

    function onColumnDragOver(
        event: DragEvent,
        column: KanbanColumn,
        rowIndex: number,
        colIndex: number,
    ): void {
        if (!draggingCardIdRef.current || p.readonly) return;
        const card = p.cards.find((c) => c.id === draggingCardIdRef.current);
        const slot = rowSlots()[rowIndex];
        const blocked =
            !!card &&
            isRefused(
                card,
                column,
                Math.max(0, draggingGroup().length - 1),
                hasLanes() && slot ? slot.laneId : undefined,
            );
        setDropBlocked(blocked);
        setDropTarget(`${rowIndex}-${colIndex}`);
        // A refused drop is not a drop target: leaving dragover un-prevented makes the browser show its "not allowed" cursor.
        if (blocked) {
            if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    }

    function onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
        event.preventDefault();
        const cardId = draggingCardIdRef.current ?? event.dataTransfer?.getData("text/plain");
        draggingCardIdRef.current = null;
        setDraggingGroup([]);
        setDropTarget(null);
        setDropBlocked(false);
        if (p.readonly) return;
        const card = p.cards.find((c) => c.id === cardId);
        if (!card) return;
        const slot = rowSlots()[rowIndex];
        const dropLane = hasLanes() && slot ? slot.laneId : undefined;
        const shown =
            (slot
                ? cellCards().get(`${column.id}\u0000${slot.laneId}`)
                : shownByColumn().get(column.id)) ?? [];
        const overCard = slot ? shown[slot.laneRow] : shown[rowIndex];
        const dropIndex = slot ? slot.laneRow : rowIndex;
        if (
            card.columnId === column.id &&
            hasLanes() &&
            dropLane !== undefined &&
            dropLane !== laneOf(card)
        ) {
            // Dropped into another lane of its own column: only the lane changes.
            moveCard(card, column, undefined, dropLane);
            return;
        }
        if (card.columnId === column.id) {
            // Dropped on another card of its own column: reorder to that position.
            const from = shown.findIndex((c) => c.id === card.id);
            if (overCard && from >= 0 && from !== dropIndex) {
                p.onReorder?.(card.id, dropIndex);
                announce(
                    p.labels.reorderAnnouncement?.(p.cardLabel(card), dropIndex + 1, shown.length),
                );
            }
            return;
        }
        moveCard(card, column, overCard ? dropIndex : undefined, dropLane);
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    function moveFocus(row: number, col: number): void {
        setFocusedCol(Math.min(Math.max(col, 0), columns().length - 1));
        const nextRow = Math.min(Math.max(row, 0), maxRows() - 1);
        setFocusedRow(nextRow);
        revealRow(nextRow);
        pendingFocusRef.current = { kind: "cell" };
    }

    /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
    function onGridFocus(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        setFocusedRow(Number(cell.dataset.row));
        setFocusedCol(Number(cell.dataset.col));
    }

    function reorderCard(delta: 1 | -1): void {
        if (p.readonly) return;
        const card = cardAt(activeCol(), activeRow());
        if (!card || card.locked) return;
        const slot = rowSlots()[activeRow()];
        const total =
            (slot
                ? cellCards().get(`${card.columnId}\u0000${slot.laneId}`)
                : shownByColumn().get(card.columnId)
            )?.length ?? 0;
        const laneRow = slot ? slot.laneRow : activeRow();
        const toIndex = laneRow + delta;
        if (toIndex < 0 || toIndex >= total) return;
        p.onReorder?.(card.id, toIndex);
        announce(p.labels.reorderAnnouncement?.(p.cardLabel(card), toIndex + 1, total));
        pendingFocusRef.current = { kind: "card", id: card.id };
        setFocusedRow(activeRow() + delta);
    }

    const TYPEAHEAD_WINDOW_MS = () => 700;
    const typeaheadRef: { current: TypeaheadState } = { current: { prefix: "", at: 0 } };

    /** A card's title, with the words the search matched wrapped in `Mark`. */
    function titleText(card: KanbanCard): JSX.Element {
        if (!searching()) return p.cardLabel(card);
        return highlightSegments(p.cardLabel(card), search()).map((part, i) =>
            part.match ? <Mark class="kanban-board-match">{part.text}</Mark> : <>{part.text}</>,
        );
    }

    function onGridKeyDown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        // The open move menu owns its own keys; letting them bubble here moved the
        // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
        if (target.closest(".kanban-board-move-list")) return;
        if (target.closest(".kanban-board-field-editor")) return;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        // The horizontal arrows are visual: in a right-to-left layout the next column is on the left, so ArrowLeft goes forward.
        const key = logicalKey(event.key, isRtl(cell));
        // Ctrl/Cmd+Z undoes the last move while there is one (`undoable`), then the last field edit; Ctrl/Cmd+Shift+Z and Ctrl+Y redo field edits.
        const historyAction = p.onFieldEdit && !p.readonly ? historyKey(event) : null;
        if (
            p.undoable &&
            ctrlOrMeta &&
            !event.altKey &&
            !event.shiftKey &&
            (event.key === "z" || event.key === "Z") &&
            undoStackNow.length > 0
        ) {
            event.preventDefault();
            void undo();
            return;
        }
        if (historyAction) {
            event.preventDefault();
            stepHistory(historyAction);
            return;
        }
        if (
            p.undoable &&
            ctrlOrMeta &&
            !event.altKey &&
            !event.shiftKey &&
            (event.key === "z" || event.key === "Z")
        ) {
            event.preventDefault();
            void undo();
            return;
        }
        if (
            p.movableColumns &&
            event.altKey &&
            event.shiftKey &&
            (key === "ArrowLeft" || key === "ArrowRight")
        ) {
            // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
            event.preventDefault();
            const column = columns()[activeCol()];
            const to = activeCol() + (key === "ArrowLeft" ? -1 : 1);
            if (column && moveColumnTo(column.id, to)) {
                setFocusedCol(to);
                pendingFocusRef.current = { kind: "cell" };
            }
            return;
        }
        if (event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            event.preventDefault();
            const card = cardAt(activeCol(), activeRow());
            const destination = columns()[activeCol() + (key === "ArrowLeft" ? -1 : 1)];
            if (card && destination) moveCard(card, destination);
            return;
        }
        if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            event.preventDefault();
            reorderCard(event.key === "ArrowUp" ? -1 : 1);
            return;
        }
        if (event.key === "F2" && p.onTitleEdit) {
            // F2 with title editing on: rename the card (its fields are edited by clicking them or Tab from the title).
            const card = cardAt(activeCol(), activeRow());
            if (card && isTitleEditable(card)) {
                event.preventDefault();
                startTitleEdit(card);
                return;
            }
        }
        if (event.key === "F2" && p.onFieldEdit) {
            // F2: edit the card's first editable field (the keyboard twin of clicking its value).
            const card = cardAt(activeCol(), activeRow());
            const first = card ? resolvedFields().find((f) => isFieldEditable(f, card)) : undefined;
            if (card && first) {
                event.preventDefault();
                startFieldEdit(card, first);
            }
            return;
        }
        // Type-ahead in the focused column: letters typed in quick succession move to the next card whose label starts with them.
        // A lone "x" stays the select shortcut when cards are selectable; it joins a prefix already in progress.
        if (isTypeaheadKey(event)) {
            const now = Date.now();
            const continuing =
                typeaheadRef.current.prefix !== "" &&
                now - typeaheadRef.current.at <= TYPEAHEAD_WINDOW_MS();
            const isSelectKey = p.selectable && (event.key === "x" || event.key === "X");
            if (continuing || !isSelectKey) {
                const state = nextTypeaheadState(
                    typeaheadRef.current,
                    event.key,
                    now,
                    TYPEAHEAD_WINDOW_MS(),
                );
                const labelsInColumn = Array.from({ length: maxRows() }, (_, row) => {
                    const card = cardAt(activeCol(), row);
                    return card ? p.cardLabel(card) : "";
                });
                const hit = findTypeaheadMatch(labelsInColumn, activeRow(), state.prefix);
                if (hit !== -1) {
                    typeaheadRef.current = state;
                    event.preventDefault();
                    moveFocus(hit, activeCol());
                    return;
                }
            }
        }
        if (
            p.selectable &&
            !ctrlOrMeta &&
            !event.altKey &&
            (event.key === "x" || event.key === "X")
        ) {
            const card = cardAt(activeCol(), activeRow());
            if (card && !p.readonly) {
                event.preventDefault();
                toggleSelected(card.id);
            }
            return;
        }
        const move = gridMove(
            event,
            { row: activeRow(), col: activeCol() },
            {
                firstRow: 0,
                lastRow: maxRows() - 1,
                lastCol: columns().length - 1,
                pageStep: pageStepFor(p.virtualize),
                homeEnd: "column",
                rtl: isRtl(cell),
            },
        );
        if (move) {
            event.preventDefault();
            moveFocus(move.row, move.col);
            return;
        }
        switch (key) {
            case "Enter":
            case " ": {
                event.preventDefault();
                const card = cardAt(activeCol(), activeRow());
                if (card) openMoveMenu(card);
                break;
            }
        }
    }

    return (
        <div
            ref={(el) => (rootRef.current = el)}
            class={`kanban-board ${p.class}`.trim()}
            data-readonly={attr(p.readonly ? "" : undefined)}
            data-field-layout={attr(p.fieldLayout === "compact" ? "compact" : undefined)}
            {...restProps}
        >
            {p.labels.search && p.showSearchLabel && (
                <label
                    class="kanban-board-search-label"
                    for={`${baseId}-search`}
                >
                    {p.labels.search}
                </label>
            )}
            {p.labels.search && (
                <SearchInput
                    id={`${baseId}-search`}
                    class="kanban-board-search"
                    label={p.labels.search}
                    value={search()}
                    onChange={(next) => {
                        setSearchInner(next);
                        p.onSearchChange?.(next);
                    }}
                    onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === "Escape" && search() !== "") {
                            e.preventDefault();
                            setSearchInner("");
                            p.onSearchChange?.("");
                        }
                    }}
                />
            )}
            {hasExportButtons() && (
                <div
                    class="kanban-board-export"
                    role="group"
                    aria-label={p.labels.export}
                >
                    {p.labels.copy && (
                        <button
                            type="button"
                            class="kanban-board-export-button"
                            data-kanban-export-format="copy"
                            disabled={exportCards().length === 0}
                            onClick={() => runExport("copy")}
                        >
                            {p.labels.copy}
                        </button>
                    )}
                    {p.labels.exportCsv && (
                        <button
                            type="button"
                            class="kanban-board-export-button"
                            data-kanban-export-format="csv"
                            disabled={exportCards().length === 0}
                            onClick={() => runExport("csv")}
                        >
                            {p.labels.exportCsv}
                        </button>
                    )}
                    {p.labels.exportTsv && (
                        <button
                            type="button"
                            class="kanban-board-export-button"
                            data-kanban-export-format="tsv"
                            disabled={exportCards().length === 0}
                            onClick={() => runExport("tsv")}
                        >
                            {p.labels.exportTsv}
                        </button>
                    )}
                    {p.labels.exportExcel && (
                        <button
                            type="button"
                            class="kanban-board-export-button"
                            data-kanban-export-format="xlsx"
                            disabled={exportCards().length === 0}
                            onClick={() => runExport("xlsx")}
                        >
                            {p.labels.exportExcel}
                        </button>
                    )}
                </div>
            )}
            {p.undoable && p.labels.undo && !p.readonly && (
                <button
                    type="button"
                    class="kanban-board-undo-button"
                    disabled={undoStack().length === 0}
                    onClick={() => void undo()}
                >
                    {p.labels.undo}
                </button>
            )}
            {/* The scroll area is structural: a virtualized board renders only the rows in view inside it. */}
            <div
                ref={(el) => (scrollRef.current = el)}
                class={p.virtualize ? "kanban-board-scroll" : "kanban-board-body"}
                style={
                    p.virtualize
                        ? { height: `${p.virtualize.height}px`, overflow: "auto" }
                        : undefined
                }
                onScroll={
                    p.virtualize
                        ? (e) => setScrollTop((e.currentTarget as HTMLElement).scrollTop)
                        : undefined
                }
            >
                <KanbanTable
                    label={p.label}
                    caption={p.caption}
                    data-consumer-keys="true"
                    onKeyDown={onGridKeyDown}
                    onFocusIn={onGridFocus}
                    aria-multiselectable={attr(p.selectable ? true : undefined)}
                    aria-rowcount={attr(p.virtualize ? slots().length + 1 : undefined)}
                >
                    <KanbanTableHead>
                        <KanbanTableRow>
                            {columns().map((column) => {
                                const count = () => cardsByColumn().get(column.id)?.length ?? 0;
                                const overLimit = () =>
                                    column.wipLimit != null && count() > column.wipLimit;
                                return (
                                    <KanbanTableTH
                                        draggable={p.movableColumns ? "true" : undefined}
                                        onDragStart={
                                            p.movableColumns
                                                ? (e: DragEvent) => {
                                                      draggingColumnIdRef.current = column.id;
                                                      e.dataTransfer?.setData(
                                                          "text/plain",
                                                          column.id,
                                                      );
                                                  }
                                                : undefined
                                        }
                                        onDragOver={
                                            p.movableColumns
                                                ? (e: DragEvent) => {
                                                      if (draggingColumnIdRef.current)
                                                          e.preventDefault();
                                                  }
                                                : undefined
                                        }
                                        onDrop={
                                            p.movableColumns
                                                ? (e: DragEvent) => onHeaderDrop(column.id, e)
                                                : undefined
                                        }
                                        data-over-limit={attr(overLimit() ? "" : undefined)}
                                        data-hidden-count={attr(
                                            count() -
                                                (shownByColumn().get(column.id)?.length ?? 0) >
                                                0
                                                ? count() -
                                                      (shownByColumn().get(column.id)?.length ?? 0)
                                                : undefined,
                                        )}
                                        data-collapsed={attr(
                                            isCollapsed(column.id) ? "" : undefined,
                                        )}
                                        data-flag={attr(column.flag)}
                                        data-accent={attr(column.accent)}
                                    >
                                        {p.labels.collapseColumn && (
                                            <button
                                                type="button"
                                                class="kanban-board-collapse-button"
                                                aria-expanded={attr(!isCollapsed(column.id))}
                                                aria-label={p.labels.collapseColumn(
                                                    column,
                                                    isCollapsed(column.id),
                                                )}
                                                onClick={() => toggleCollapsed(column)}
                                            >
                                                {isCollapsed(column.id) ? "▸" : "▾"}
                                            </button>
                                        )}
                                        {column.title}
                                        {column.flag && (
                                            <span class="kanban-board-column-flag">
                                                {column.flag}
                                            </span>
                                        )}
                                        {p.columnHeader?.({
                                            column,
                                            cards: cardsByColumn().get(column.id) ?? [],
                                            count: count(),
                                        })}
                                        {p.labels.cardCount && (
                                            <span class="kanban-board-count">
                                                {p.labels.cardCount(count())}
                                            </span>
                                        )}
                                        {overLimit() && p.labels.overLimit && (
                                            <span class="kanban-board-wip-warning">
                                                {p.labels.overLimit(count(), column.wipLimit ?? 0)}
                                            </span>
                                        )}
                                        {p.labels.addCard && !p.readonly && (
                                            <button
                                                type="button"
                                                class="kanban-board-add-button"
                                                aria-label={p.labels.addCard(column)}
                                                onClick={() => p.onAddCard?.(column.id)}
                                            >
                                                +
                                            </button>
                                        )}
                                    </KanbanTableTH>
                                );
                            })}
                        </KanbanTableRow>
                    </KanbanTableHead>
                    <KanbanTableBody>
                        <For
                            each={renderItems()}
                            keyed={(item) =>
                                item.kind === "spacer"
                                    ? `${item.key}:${item.height}`
                                    : item.slot.kind === "lane"
                                      ? `lane:${item.slot.lane.id}\u0000${item.slot.lane.title}`
                                      : `row:${item.slot.rowIndex}:${item.slot.laneId}:${item.slot.laneRow}`
                            }
                        >
                            {(itemAccessor) => {
                                // The key holds every field the row shows, so a row reads its item once.
                                const item = untrack(itemAccessor);
                                if (item.kind === "spacer") {
                                    return (
                                        <tr
                                            class="kanban-board-spacer"
                                            aria-hidden="true"
                                            style={{ height: `${item.height}px` }}
                                        >
                                            <td colspan={columns().length} />
                                        </tr>
                                    );
                                }
                                const slot = item.slot;
                                if (slot.kind === "lane") {
                                    return (
                                        <KanbanTableRow data-lane-row="">
                                            <th
                                                class="kanban-board-lane"
                                                scope="rowgroup"
                                                colspan={columns().length}
                                                data-lane-id={attr(slot.lane.id)}
                                                data-collapsed={attr(
                                                    isLaneCollapsed(slot.lane.id) ? "" : undefined,
                                                )}
                                            >
                                                {p.labels.collapseLane && (
                                                    <button
                                                        type="button"
                                                        class="kanban-board-lane-toggle"
                                                        aria-expanded={attr(
                                                            !isLaneCollapsed(slot.lane.id),
                                                        )}
                                                        aria-label={p.labels.collapseLane(
                                                            slot.lane,
                                                            isLaneCollapsed(slot.lane.id),
                                                        )}
                                                        onClick={() => toggleLane(slot.lane)}
                                                    >
                                                        {isLaneCollapsed(slot.lane.id) ? "▸" : "▾"}
                                                    </button>
                                                )}
                                                <span class="kanban-board-lane-title">
                                                    {slot.lane.title}
                                                </span>
                                                {p.labels.laneCount && (
                                                    <span class="kanban-board-lane-count">
                                                        {p.labels.laneCount(
                                                            slot.lane,
                                                            laneCardCount(slot.lane.id),
                                                        )}
                                                    </span>
                                                )}
                                            </th>
                                        </KanbanTableRow>
                                    );
                                }
                                const rowIndex = slot.rowIndex;
                                return (
                                    <KanbanTableRow
                                        aria-rowindex={attr(
                                            p.virtualize ? slotIndexOfRow(rowIndex) + 2 : undefined,
                                        )}
                                        data-lane-id={attr(hasLanes() ? slot.laneId : undefined)}
                                    >
                                        <For each={columns()}>
                                            {(column, colIndex) => {
                                                const cardNow = createMemo(() =>
                                                    cardAt(colIndex(), rowIndex),
                                                );
                                                return (
                                                    <KanbanTableTD
                                                        data-row={attr(rowIndex)}
                                                        data-selected={attr(
                                                            cardNow() &&
                                                                p.selectable &&
                                                                isSelected(cardNow()!.id)
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        aria-selected={attr(
                                                            cardNow() &&
                                                                p.selectable &&
                                                                isSelected(cardNow()!.id)
                                                                ? true
                                                                : undefined,
                                                        )}
                                                        data-dragging={attr(
                                                            cardNow() &&
                                                                draggingGroup().includes(
                                                                    cardNow()!.id,
                                                                )
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        onClick={
                                                            p.selectable
                                                                ? (e: MouseEvent) => {
                                                                      if (
                                                                          (e.ctrlKey ||
                                                                              e.metaKey) &&
                                                                          cardNow() &&
                                                                          !p.readonly
                                                                      ) {
                                                                          e.preventDefault();
                                                                          toggleSelected(
                                                                              cardNow()!.id,
                                                                          );
                                                                      }
                                                                  }
                                                                : undefined
                                                        }
                                                        data-col={attr(colIndex())}
                                                        data-card-id={attr(cardNow()?.id)}
                                                        data-collapsed={attr(
                                                            isCollapsed(column.id) ? "" : undefined,
                                                        )}
                                                        data-locked={attr(
                                                            cardNow()?.locked ? "" : undefined,
                                                        )}
                                                        data-pending={attr(
                                                            cardNow() && isPending(cardNow()!.id)
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        aria-busy={attr(
                                                            cardNow() && isPending(cardNow()!.id)
                                                                ? true
                                                                : undefined,
                                                        )}
                                                        data-flag={attr(cardNow()?.flag)}
                                                        data-accent={attr(column.accent)}
                                                        data-empty={attr(
                                                            !cardNow() &&
                                                                !hasLanes() &&
                                                                rowIndex === 0 &&
                                                                p.labels.emptyColumn &&
                                                                isEmptyColumn(column)
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        aria-describedby={
                                                            cardNow()?.flag
                                                                ? `${baseId}-flag-${cardNow()!.id}`
                                                                : undefined
                                                        }
                                                        data-drop-target={attr(
                                                            dropTarget() ===
                                                                `${rowIndex}-${colIndex()}` &&
                                                                !dropBlocked()
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        data-drop-blocked={attr(
                                                            dropTarget() ===
                                                                `${rowIndex}-${colIndex()}` &&
                                                                dropBlocked()
                                                                ? ""
                                                                : undefined,
                                                        )}
                                                        {...(cardNow()
                                                            ? (p.cardAttrs?.(cardNow()!) ?? {})
                                                            : {})}
                                                        active={
                                                            activeRow() === rowIndex &&
                                                            activeCol() === colIndex()
                                                        }
                                                        onDragOver={(e: DragEvent) =>
                                                            onColumnDragOver(
                                                                e,
                                                                column,
                                                                rowIndex,
                                                                colIndex(),
                                                            )
                                                        }
                                                        onDragLeave={() => {
                                                            setDropTarget(null);
                                                            setDropBlocked(false);
                                                        }}
                                                        onDrop={(e: DragEvent) =>
                                                            onColumnDrop(column, rowIndex, e)
                                                        }
                                                    >
                                                        {(() => {
                                                            const card = cardNow();
                                                            return (
                                                                card &&
                                                                untrack(() => (
                                                                    <>
                                                                        {/*
                          The card title is a supplementary pointer-drag
                          handle inside an already-interactive gridcell
                          (role comes from the parent KanbanTableTD);
                          dragstart here is one of two equally-real move
                          paths, not the accessible one — see the
                          move-button/listbox below for that.
                        */}
                                                                        <span
                                                                            class="kanban-board-card-title"
                                                                            draggable={
                                                                                p.readonly ||
                                                                                card.locked ||
                                                                                card.draggable ===
                                                                                    false ||
                                                                                editingTitle()
                                                                                    ?.cardId ===
                                                                                    card.id
                                                                                    ? undefined
                                                                                    : "true"
                                                                            }
                                                                            onDragStart={(e) =>
                                                                                onCardDragStart(
                                                                                    card,
                                                                                    e,
                                                                                )
                                                                            }
                                                                            onDragEnd={
                                                                                onCardDragEnd
                                                                            }
                                                                            onDblClick={() =>
                                                                                startTitleEdit(card)
                                                                            }
                                                                        >
                                                                            {editingTitle()
                                                                                ?.cardId ===
                                                                            card.id ? (
                                                                                <input
                                                                                    class="kanban-board-title-editor"
                                                                                    type="text"
                                                                                    aria-label={
                                                                                        p.labels
                                                                                            .titleEditor
                                                                                            ? p.labels.titleEditor(
                                                                                                  p.cardLabel(
                                                                                                      card,
                                                                                                  ),
                                                                                              )
                                                                                            : p.cardLabel(
                                                                                                  card,
                                                                                              )
                                                                                    }
                                                                                    value={
                                                                                        editingTitle()!
                                                                                            .draft
                                                                                    }
                                                                                    defaultValue={
                                                                                        editingTitle()!
                                                                                            .draft
                                                                                    }
                                                                                    onInput={(e) =>
                                                                                        setEditingTitle(
                                                                                            {
                                                                                                cardId: card.id,
                                                                                                draft: e
                                                                                                    .currentTarget
                                                                                                    .value,
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                    onKeyDown={
                                                                                        onTitleEditorKeyDown
                                                                                    }
                                                                                    onBlur={() =>
                                                                                        commitTitleEdit(
                                                                                            false,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ) : p.renderCard ? (
                                                                                p.renderCard({
                                                                                    card,
                                                                                    label: p.cardLabel(
                                                                                        card,
                                                                                    ),
                                                                                    column,
                                                                                    pending:
                                                                                        isPending(
                                                                                            card.id,
                                                                                        ),
                                                                                })
                                                                            ) : card.href ? (
                                                                                <a
                                                                                    class="kanban-board-card-link"
                                                                                    href={card.href}
                                                                                >
                                                                                    {titleText(
                                                                                        card,
                                                                                    )}
                                                                                </a>
                                                                            ) : (
                                                                                titleText(card)
                                                                            )}
                                                                        </span>
                                                                        {!p.renderCard &&
                                                                            card.subtitle && (
                                                                                <span class="kanban-board-card-subtitle">
                                                                                    {card.subtitle}
                                                                                </span>
                                                                            )}
                                                                        {!p.renderCard &&
                                                                        card.badges?.length ? (
                                                                            <span class="kanban-board-card-badges">
                                                                                {card.badges.map(
                                                                                    (badge) => (
                                                                                        <span class="kanban-board-card-badge">
                                                                                            {badge}
                                                                                        </span>
                                                                                    ),
                                                                                )}
                                                                            </span>
                                                                        ) : null}
                                                                        {!p.renderCard &&
                                                                            resolvedFields()
                                                                                .length > 0 && (
                                                                                <span class="kanban-board-card-fields">
                                                                                    {resolvedFields().map(
                                                                                        (f) => {
                                                                                            // Rebuilt only when this field starts or stops editing, never on a keystroke in its editor.
                                                                                            const editingThis =
                                                                                                createMemo(
                                                                                                    () =>
                                                                                                        editing()
                                                                                                            ?.cardId ===
                                                                                                            card.id &&
                                                                                                        editing()
                                                                                                            ?.fieldId ===
                                                                                                            f.id,
                                                                                                );
                                                                                            return (
                                                                                                <>
                                                                                                    {(() => {
                                                                                                        editingThis();
                                                                                                        return untrack(
                                                                                                            () => {
                                                                                                                const text =
                                                                                                                    fieldText(
                                                                                                                        f,
                                                                                                                        card.values,
                                                                                                                    );
                                                                                                                const editable =
                                                                                                                    isFieldEditable(
                                                                                                                        f,
                                                                                                                        card,
                                                                                                                    );
                                                                                                                const nameId = `${baseId}-fn-${card.id}-${f.id}`;
                                                                                                                const valueId = `${baseId}-fv-${card.id}-${f.id}`;
                                                                                                                if (
                                                                                                                    editing() &&
                                                                                                                    editing()!
                                                                                                                        .cardId ===
                                                                                                                        card.id &&
                                                                                                                    editing()!
                                                                                                                        .fieldId ===
                                                                                                                        f.id
                                                                                                                ) {
                                                                                                                    const kind =
                                                                                                                        editorKind(
                                                                                                                            f,
                                                                                                                        );
                                                                                                                    return (
                                                                                                                        <span
                                                                                                                            class="kanban-board-card-field"
                                                                                                                            data-field={attr(
                                                                                                                                f.id,
                                                                                                                            )}
                                                                                                                            data-editing=""
                                                                                                                        >
                                                                                                                            <span
                                                                                                                                class="kanban-board-card-field-name"
                                                                                                                                id={
                                                                                                                                    nameId
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    f.header
                                                                                                                                }
                                                                                                                            </span>{" "}
                                                                                                                            {kind ===
                                                                                                                                "select" ||
                                                                                                                            kind ===
                                                                                                                                "radio" ? (
                                                                                                                                <select
                                                                                                                                    class="kanban-board-field-editor"
                                                                                                                                    aria-label={
                                                                                                                                        f.editLabel ??
                                                                                                                                        f.header
                                                                                                                                    }
                                                                                                                                    aria-invalid={attr(
                                                                                                                                        editing()!
                                                                                                                                            .invalid
                                                                                                                                            ? true
                                                                                                                                            : undefined,
                                                                                                                                    )}
                                                                                                                                    value={String(
                                                                                                                                        editing()!
                                                                                                                                            .draft ??
                                                                                                                                            "",
                                                                                                                                    )}
                                                                                                                                    onChange={(
                                                                                                                                        e,
                                                                                                                                    ) => {
                                                                                                                                        setEditing(
                                                                                                                                            {
                                                                                                                                                ...editing()!,
                                                                                                                                                draft: e
                                                                                                                                                    .target
                                                                                                                                                    .value,
                                                                                                                                                invalid: false,
                                                                                                                                            },
                                                                                                                                        );
                                                                                                                                        commitFieldEdit();
                                                                                                                                    }}
                                                                                                                                    onKeyDown={
                                                                                                                                        onEditorKeyDown
                                                                                                                                    }
                                                                                                                                    onBlur={() =>
                                                                                                                                        commitFieldEdit(
                                                                                                                                            false,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <option value="" />
                                                                                                                                    {(
                                                                                                                                        f.options ??
                                                                                                                                        []
                                                                                                                                    ).map(
                                                                                                                                        (
                                                                                                                                            option,
                                                                                                                                        ) => (
                                                                                                                                            <option
                                                                                                                                                value={
                                                                                                                                                    option.id
                                                                                                                                                }
                                                                                                                                                disabled={
                                                                                                                                                    option.disabled
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {
                                                                                                                                                    option.label
                                                                                                                                                }
                                                                                                                                            </option>
                                                                                                                                        ),
                                                                                                                                    )}
                                                                                                                                </select>
                                                                                                                            ) : (
                                                                                                                                <input
                                                                                                                                    class="kanban-board-field-editor"
                                                                                                                                    aria-label={
                                                                                                                                        f.editLabel ??
                                                                                                                                        f.header
                                                                                                                                    }
                                                                                                                                    aria-invalid={attr(
                                                                                                                                        editing()!
                                                                                                                                            .invalid
                                                                                                                                            ? true
                                                                                                                                            : undefined,
                                                                                                                                    )}
                                                                                                                                    type={
                                                                                                                                        kind ===
                                                                                                                                        "number"
                                                                                                                                            ? "number"
                                                                                                                                            : kind ===
                                                                                                                                                "date"
                                                                                                                                              ? "date"
                                                                                                                                              : kind ===
                                                                                                                                                  "time"
                                                                                                                                                ? "time"
                                                                                                                                                : "text"
                                                                                                                                    }
                                                                                                                                    inputmode={
                                                                                                                                        kind ===
                                                                                                                                        "number"
                                                                                                                                            ? "decimal"
                                                                                                                                            : undefined
                                                                                                                                    }
                                                                                                                                    value={String(
                                                                                                                                        editing()!
                                                                                                                                            .draft ??
                                                                                                                                            "",
                                                                                                                                    )}
                                                                                                                                    defaultValue={String(
                                                                                                                                        editing()!
                                                                                                                                            .draft ??
                                                                                                                                            "",
                                                                                                                                    )}
                                                                                                                                    onInput={(
                                                                                                                                        e,
                                                                                                                                    ) =>
                                                                                                                                        setEditing(
                                                                                                                                            {
                                                                                                                                                ...editing()!,
                                                                                                                                                draft: e
                                                                                                                                                    .target
                                                                                                                                                    .value,
                                                                                                                                                invalid: false,
                                                                                                                                            },
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    onKeyDown={
                                                                                                                                        onEditorKeyDown
                                                                                                                                    }
                                                                                                                                    onBlur={() =>
                                                                                                                                        commitFieldEdit(
                                                                                                                                            false,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            )}
                                                                                                                        </span>
                                                                                                                    );
                                                                                                                }
                                                                                                                if (
                                                                                                                    text ===
                                                                                                                        "" &&
                                                                                                                    !editable
                                                                                                                )
                                                                                                                    return null;
                                                                                                                return (
                                                                                                                    <span
                                                                                                                        class="kanban-board-card-field"
                                                                                                                        data-field={attr(
                                                                                                                            f.id,
                                                                                                                        )}
                                                                                                                        data-type={attr(
                                                                                                                            f.type ??
                                                                                                                                "text",
                                                                                                                        )}
                                                                                                                    >
                                                                                                                        <span
                                                                                                                            class="kanban-board-card-field-name"
                                                                                                                            id={
                                                                                                                                nameId
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                f.header
                                                                                                                            }
                                                                                                                        </span>{" "}
                                                                                                                        {editable ? (
                                                                                                                            <button
                                                                                                                                type="button"
                                                                                                                                class="kanban-board-field-button"
                                                                                                                                id={
                                                                                                                                    valueId
                                                                                                                                }
                                                                                                                                tabindex={
                                                                                                                                    -1
                                                                                                                                }
                                                                                                                                aria-labelledby={`${nameId} ${valueId}`}
                                                                                                                                onClick={() =>
                                                                                                                                    startFieldEdit(
                                                                                                                                        card,
                                                                                                                                        f,
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    text
                                                                                                                                }
                                                                                                                            </button>
                                                                                                                        ) : (
                                                                                                                            <span class="kanban-board-card-field-value">
                                                                                                                                {
                                                                                                                                    text
                                                                                                                                }
                                                                                                                            </span>
                                                                                                                        )}
                                                                                                                    </span>
                                                                                                                );
                                                                                                            },
                                                                                                        );
                                                                                                    })()}
                                                                                                </>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        {card.flag && (
                                                                            <span
                                                                                class="kanban-board-card-flag"
                                                                                id={`${baseId}-flag-${card.id}`}
                                                                            >
                                                                                {card.flag}
                                                                            </span>
                                                                        )}
                                                                        {/*
                          Gated on labels.moveButton: an unnamed button is
                          worse than none, and Enter/Space on the cell opens
                          the menu either way.
                        */}
                                                                        {p.labels.moveButton &&
                                                                            !p.readonly &&
                                                                            !card.locked && (
                                                                                <IconButton
                                                                                    baseClass="kanban-board-move-button"
                                                                                    label={p.labels.moveButton(
                                                                                        card,
                                                                                    )}
                                                                                    tabindex={-1}
                                                                                    aria-haspopup="listbox"
                                                                                    aria-expanded={attr(
                                                                                        openCardId() ===
                                                                                            card.id,
                                                                                    )}
                                                                                    aria-controls={
                                                                                        openCardId() ===
                                                                                        card.id
                                                                                            ? moveListId()
                                                                                            : undefined
                                                                                    }
                                                                                    onClick={() =>
                                                                                        openCardId() ===
                                                                                        card.id
                                                                                            ? closeMoveMenu(
                                                                                                  card.id,
                                                                                              )
                                                                                            : openMoveMenu(
                                                                                                  card,
                                                                                              )
                                                                                    }
                                                                                >
                                                                                    ⇄
                                                                                </IconButton>
                                                                            )}
                                                                        {openCardId() ===
                                                                            card.id && (
                                                                            <Listbox
                                                                                ref={(el) =>
                                                                                    (moveListRef.current =
                                                                                        el)
                                                                                }
                                                                                as="ul"
                                                                                id={moveListId()}
                                                                                baseClass="kanban-board-move-list"
                                                                                label={
                                                                                    p.labels
                                                                                        .moveMenuLabel ??
                                                                                    p.cardLabel(
                                                                                        card,
                                                                                    )
                                                                                }
                                                                                navigation="active-descendant"
                                                                                clamp
                                                                                activeIndex={moveActiveIndex()}
                                                                                onActiveIndexChange={
                                                                                    setMoveActiveIndex
                                                                                }
                                                                                onActivate={(
                                                                                    i: number,
                                                                                ) =>
                                                                                    moveCard(
                                                                                        card,
                                                                                        moveTargets(
                                                                                            card,
                                                                                        )[i],
                                                                                    )
                                                                                }
                                                                                onEscape={() =>
                                                                                    closeMoveMenu(
                                                                                        card.id,
                                                                                    )
                                                                                }
                                                                                onTabOut={() =>
                                                                                    closeMoveMenu(
                                                                                        card.id,
                                                                                        false,
                                                                                    )
                                                                                }
                                                                            >
                                                                                {moveTargets(
                                                                                    card,
                                                                                ).map(
                                                                                    (
                                                                                        destination,
                                                                                        i,
                                                                                    ) => (
                                                                                        <li
                                                                                            class="kanban-board-move-option"
                                                                                            id={moveOptionId(
                                                                                                i,
                                                                                            )}
                                                                                            role="option"
                                                                                            aria-selected={attr(
                                                                                                destination.id ===
                                                                                                    card.columnId,
                                                                                            )}
                                                                                            aria-disabled={attr(
                                                                                                isRefused(
                                                                                                    card,
                                                                                                    destination,
                                                                                                )
                                                                                                    ? true
                                                                                                    : undefined,
                                                                                            )}
                                                                                            data-active={attr(
                                                                                                i ===
                                                                                                    moveActiveIndex()
                                                                                                    ? ""
                                                                                                    : undefined,
                                                                                            )}
                                                                                            onClick={() =>
                                                                                                moveCard(
                                                                                                    card,
                                                                                                    destination,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                destination.title
                                                                                            }
                                                                                        </li>
                                                                                    ),
                                                                                )}
                                                                            </Listbox>
                                                                        )}
                                                                    </>
                                                                ))
                                                            );
                                                        })()}
                                                        {!cardNow() &&
                                                            !hasLanes() &&
                                                            rowIndex === 0 &&
                                                            p.labels.emptyColumn &&
                                                            isEmptyColumn(column) && (
                                                                <span class="kanban-board-empty">
                                                                    {p.labels.emptyColumn(column)}
                                                                </span>
                                                            )}
                                                    </KanbanTableTD>
                                                );
                                            }}
                                        </For>
                                    </KanbanTableRow>
                                );
                            }}
                        </For>
                    </KanbanTableBody>
                    {p.columnFooter && (
                        <tfoot class="kanban-table-foot">
                            <tr class="kanban-table-row">
                                {columns().map((column) => (
                                    <td
                                        class="kanban-table-td kanban-board-column-footer"
                                        data-accent={attr(column.accent)}
                                    >
                                        {p.columnFooter!({
                                            column,
                                            cards: cardsByColumn().get(column.id) ?? [],
                                            count: cardsByColumn().get(column.id)?.length ?? 0,
                                        })}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </KanbanTable>
            </div>

            <p
                class="kanban-board-status"
                aria-live="polite"
            >
                {statusMessage()}
            </p>
        </div>
    );
}

export default KanbanBoard;
