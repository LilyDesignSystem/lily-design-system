<script lang="ts">
import type { ExportFormat } from "./export-data";
import type { FieldDef } from "./typed-fields";

/**
 * A typed field a card carries (an owner, a due date, an estimate): a bundle of display, sort and export defaults from
 * the data grid's cell types, read from `card.values[id]`. Plain data; the board shows it as text.
 */
export type KanbanField = FieldDef;

/** What `exportHandler` and the `export-file` event receive. Return `false` from `exportHandler` to take over the download. */
export type KanbanExport = { format: ExportFormat; filename: string; cardCount: number; blob: Blob };

/** What the `copy` event carries. */
export type KanbanCopy = { text: string; rowCount: number };

/** What the `title-edit` event carries: the card, its new title, and the title it had. */
export type KanbanTitleEdit = { cardId: string; title: string; previous: string };

/** What the `field-edit` event carries. */
export type KanbanFieldEdit = { cardId: string; fieldId: string; value: unknown; previous: unknown };

/**
 * Column definition. Card order within a column follows the order
 * cards appear in the `cards` prop array.
 */
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

/** A swimlane: a horizontal band of rows (an owner, an account) that cards are grouped into. */
export type KanbanLane = {
    /** Stable lane identifier. */
    id: string;
    /** Visible lane title. */
    title: string;
};

/** A single card. */
export type KanbanCard = {
    /** Stable card identifier. */
    id: string;
    /** The column this card currently belongs to. */
    columnId: string;
    /** Visible card title. */
    title: string;
    /** The swimlane this card sits in (an id from `lanes`); the first lane when absent. */
    laneId?: string;
    /** A locked card cannot be moved, dragged or reordered (`data-locked` on its cell); it still counts toward WIP limits and can be navigated to. */
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
    /** Values of the board's `fields`, by field id. */
    values?: Record<string, unknown>;
};

/** What the `card` slot receives. */
export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

/** What the `columnHeader` / `columnFooter` slots receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other helper's
 * label-presence-gates-control convention. See spec/index.md §5.
 */
export type KanbanLabels = {
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
    /** Announced after the search changes: (matching cards, all cards). */
    searchAnnouncement?: (matchCount: number, totalCount: number) => string;
    /** Headers of the export's own columns (card title, column, lane, subtitle, badges, flag). An export needs `exportHeaders`; there is no English default. */
    exportHeaders?: { title: string; column: string; lane?: string; subtitle?: string; badges?: string; flag?: string };
    /** Announced after a field edit: (card title, field header, the new text). */
    editAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced when an edit is refused as invalid for the field's type: (card title, field header). */
    editInvalid?: (cardTitle: string, fieldHeader: string) => string;
    /** Announced when a field's `validate` refuses a value: (card title, field header, the reason). Falls back to `editInvalid`. */
    editRefused?: (cardTitle: string, fieldHeader: string, message: string) => string;
    /** Accessible name of a card's title editor: (the card's current title). Defaults to the title. */
    titleEditor?: (cardTitle: string) => string;
    /** Announced after a title edit: (previous title, new title). */
    titleEditAnnouncement?: (previous: string, title: string) => string;
    /** Announced after Ctrl/Cmd+Z puts an earlier field value back: (card title, field header, the restored text). */
    fieldUndoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies a field edit: (card title, field header, the text). */
    fieldRedoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
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
    /** Announced while an async `moveHandler` is pending: (card title, column title). */
    movePending?: (cardTitle: string, columnTitle: string) => string;
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
    /** Announced when an async `moveHandler` rejects and the card goes back: (card title, column title, the rejection). */
    moveFailed?: (cardTitle: string, columnTitle: string, error: unknown) => string;
    /** Accessible name for a lane's collapse toggle: (lane, collapsed). Gates the toggle. */
    collapseLane?: (lane: KanbanLane, collapsed: boolean) => string;
    /** Visible card count in a lane header: (lane, how many cards). Gates the count. */
    laneCount?: (lane: KanbanLane, count: number) => string;
    /** Accessible name of the board's search field. Gates the field. */
    search?: string;
};

/** Public props for KanbanBoard. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the board, passed through to KanbanTable. */
    label: string;
    /** Typed fields shown under each card's title, read from `card.values`. Editable types edit in place (click the value, or F2 on the card for the first editable field; Tab moves to the next) when a `field-edit` listener is attached. */
    fields?: KanbanField[];
    /** Locale for number and date fields. Never defaulted. */
    locale?: string;
    /** The file name without its extension. Default `"kanban-board"`. */
    exportFilename?: string;
    /** What an export holds: `"view"` (default) is every card the search and filter leave, column by column; `"selected"` is only the selected cards. */
    exportScope?: "view" | "selected";
    /** Called before the download with the finished file. Return `false` to skip the built-in download. */
    exportHandler?: (file: KanbanExport) => boolean | void;
    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` event fires first. */
    copyHandler?: (copy: { text: string; rowCount: number }) => boolean | void;
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
    /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
    allowedColumns?: (card: KanbanCard) => string[];
    /**
     * An async move: awaited when a card moves. The card shows in its new column at once with `data-pending` and `aria-busy`
     * and goes back if the promise rejects (`labels.moveFailed`, the `move-error` event). The `move` event is emitted either way.
     */
    moveHandler?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>;
    /** Swimlanes: horizontal bands of rows. Each card sits in the lane named by `card.laneId` (the first lane when absent). A drop into another lane's cell changes the lane: `move` gets the lane id as its fourth argument. */
    lanes?: KanbanLane[];
    /** Several cards can be selected and moved together: Ctrl/Cmd+click or the `x` key toggles the card under the cursor (`v-model:selected`). */
    selectable?: boolean;
    /** Text for the drag preview (one card, or the whole selection): `setDragImage` gets an element with this text (class `kanban-board-drag-preview`). */
    dragPreviewText?: (cards: KanbanCard[]) => string;
    /** Remember successful moves so Ctrl/Cmd+Z (and `labels.undo`'s button) can take them back. A selection move is one undo step. */
    undoable?: boolean;
    /** Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column (`v-model:columnOrder`). */
    movableColumns?: boolean;
    /** Renders only the rows in view. The board gets a scroll area of `height` px; every row is assumed `rowHeight` px tall (lane headers count as a row). */
    virtualize?: { rowHeight: number; height: number; overscan?: number };
    /** The text `search` looks in. Defaults to the label, subtitle and badges. */
    searchText?: (card: KanbanCard) => string;
    /** Ids of collapsed columns (`v-model:collapsedColumns`). A collapsed column keeps its header and count but shows no cards. */
    collapsedColumns?: string[];
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
    /** Extra CSS class on the root. */
    class?: string;
};

/** Default `cardLabel`: the card's own title. Mirrors `date-time-picker`'s `defaultFormat` fallback idiom. */
function defaultCardLabel(card: KanbanCard): string {
    return card.title;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextKanbanBoardId(): string {
    uid += 1;
    return `kanban-board-${uid}`;
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, useSlots, watch } from "vue";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText } from "./export-data";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove, pageStepFor } from "./grid-navigation";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, type TypeaheadState } from "./typeahead";
import {
    draftOf,
    editorKind,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText as fieldTextOf,
    isEditableField,
    neighbourField,
    resolveFields,
    type Draft,
    type ResolvedField,
} from "./typed-fields";
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
} from "@lilydesignsystem/vue-headless";

const props = withDefaults(defineProps<Props>(), {
    caption: undefined,
    cardLabel: undefined,
    cardAttrs: undefined,
    filter: undefined,
    compare: undefined,
    allowedColumns: undefined,
    moveHandler: undefined,
    lanes: undefined,
    selectable: false,
    dragPreviewText: undefined,
    undoable: false,
    movableColumns: false,
    virtualize: undefined,
    searchText: undefined,
    canMove: undefined,
    allowLaneChange: true,
    collapsedColumns: undefined,
    readonly: false,
    showSearchLabel: false,
    fieldLayout: "stacked",
    fields: undefined,
    locale: undefined,
    exportFilename: "kanban-board",
    exportScope: "view",
    exportHandler: undefined,
    copyHandler: undefined,
    labels: () => ({}),
    class: "",
});

// The Svelte canonical takes an `onMove` callback prop; the Vue idiom
// for the same contract is an emitted event, matching `picker-bar`'s
// `theme-change` et al. and `date-time-picker`'s `change`.
const collapsedModel = defineModel<string[]>("collapsedColumns", { default: () => [] });
/** Ids of collapsed swimlanes (`v-model:collapsedLanes`). A collapsed lane keeps its header row (and count) but renders no card rows. */
const collapsedLanesModel = defineModel<string[]>("collapsedLanes", { default: () => [] });
/** Board-level search (`v-model:search`): shows only cards whose text contains every word of it (any order, ignoring case and diacritics) and wraps matches in the card's title in `<mark class="kanban-board-match">`. Combines with `filter`. Escape in the field clears it. */
const search = defineModel<string>("search", { default: "" });
/** The selected card ids (`v-model:selected`). */
const selectedModel = defineModel<string[]>("selected", { default: () => [] });
/** Column ids in display order (`v-model:columnOrder`); columns it does not name follow in their own order. */
const columnOrderModel = defineModel<string[]>("columnOrder", { default: () => [] });

const emit = defineEmits<{
    /** A card moved. `toIndex` (0-based, in the visible column) is given only when a pointer drop landed on a card. */
    (event: "move", cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string): void;
    /** An async `moveHandler` rejected, after the card went back. */
    (event: "move-error", cardId: string, toColumnId: string, error: unknown): void;
    /** A column's add-card button was pressed. The consumer adds the card (Lily ships no editor). */
    (event: "add-card", columnId: string): void;
    /** Alt+ArrowUp/Down moved a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
    (event: "reorder", cardId: string, toIndex: number): void;
    /** An accepted field edit. The consumer updates `cards`. A field is editable only when a listener is attached (and the board is not `readonly`). */
    (event: "field-edit", edit: KanbanFieldEdit): void;
    /** Card titles are editable in place (double-click, or F2 on the card) when a listener is attached: Enter or leaving the field commits, Escape cancels, an empty title is refused. Lily changes nothing itself; the consumer renames the card. Not for cards with a link (`href`) or a `card` slot. */
    (event: "title-edit", edit: KanbanTitleEdit): void;
    /** An export file, before it is saved. */
    (event: "export-file", file: KanbanExport): void;
    /** A copy to the clipboard, before it is written. */
    (event: "copy", copy: KanbanCopy): void;
}>();

// The listener's presence decides whether fields are editable, so it is read from the vnode.
const hasFieldEdit = !!(getCurrentInstance()?.vnode.props as Record<string, unknown> | null)?.onFieldEdit;
const hasTitleEdit = !!(getCurrentInstance()?.vnode.props as Record<string, unknown> | null)?.onTitleEdit;

defineSlots<{
    card?: (ctx: KanbanCardContext) => unknown;
    columnHeader?: (ctx: KanbanColumnContext) => unknown;
    columnFooter?: (ctx: KanbanColumnContext) => unknown;
}>();

// Columns in display order: those named in `columnOrder` first, the rest after in their own order.
const orderedColumns = computed(() => {
    const order = columnOrderModel.value;
    if (order.length === 0) return props.columns;
    const rank = (id: string) => (order.indexOf(id) === -1 ? order.length : order.indexOf(id));
    return props.columns
        .map((c, i) => ({ c, i }))
        .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
        .map((x) => x.c);
});

const baseId = nextKanbanBoardId();
const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;
const moveListId = `${baseId}-move-list`;

const rootEl = ref<HTMLDivElement | null>(null);
const statusMessage = ref("");
const focusedRow = ref(0);
const focusedCol = ref(0);

/** The card whose move menu is open, if any. */
const openCardId = ref<string | null>(null);
const moveActiveIndex = ref(-1);

// The open Listbox is lexically inside a v-for (even though `v-if` only
// ever mounts one at a time), so a static `ref="…"` name would collect
// into an array (Vue's v-for-ref rule) — a function ref sidesteps that.
// It resolves to what Listbox defineExposes (`{ el }`), not the DOM node.
let moveListRef: { el?: HTMLElement } | null = null;
function setMoveListRef(el: unknown): void {
    moveListRef = (el as { el?: HTMLElement } | null) ?? null;
}

/** Cards moved optimistically by an async `moveHandler` that has not settled: id → destination column. */
const optimistic = ref<Record<string, string>>({});
const isPending = (cardId: string) => cardId in optimistic.value;
const effectiveCards = computed(() =>
    props.cards.map((c) => (c.id in optimistic.value ? { ...c, columnId: optimistic.value[c.id] } : c)),
);

const cardsByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const column of orderedColumns.value) map.set(column.id, []);
    for (const card of effectiveCards.value) {
        map.get(card.columnId)?.push(card);
    }
    return map;
});

const searching = computed(() => search.value.trim() !== "");
const defaultSearchText = (c: KanbanCard): string =>
    [resolveCardLabel(c), c.subtitle ?? "", ...(c.badges ?? []), ...resolvedFields.value.map((f) => fieldText(f, c))].join(" ");

// What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
const shownByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const [id, list] of cardsByColumn.value) {
        let shown = props.filter ? list.filter(props.filter) : list.slice();
        if (searching.value) {
            const text = props.searchText ?? defaultSearchText;
            shown = shown.filter((c) => matchesSearch(text(c), search.value));
        }
        if (props.compare) shown = shown.sort(props.compare);
        map.set(id, shown);
    }
    return map;
});

const isEmptyColumn = (column: KanbanColumn) => !isCollapsed(column.id) && (shownByColumn.value.get(column.id)?.length ?? 0) === 0;
const hiddenCountFor = (column: KanbanColumn) =>
    (cardsByColumn.value.get(column.id)?.length ?? 0) - (shownByColumn.value.get(column.id)?.length ?? 0);

const isLaneCollapsed = (laneId: string) => collapsedLanesModel.value.includes(laneId);
function toggleLane(lane: KanbanLane): void {
    collapsedLanesModel.value = isLaneCollapsed(lane.id)
        ? collapsedLanesModel.value.filter((id) => id !== lane.id)
        : [...collapsedLanesModel.value, lane.id];
}
const isCollapsed = (columnId: string) => collapsedModel.value.includes(columnId);

function toggleCollapsed(column: KanbanColumn): void {
    collapsedModel.value = isCollapsed(column.id)
        ? collapsedModel.value.filter((id) => id !== column.id)
        : [...collapsedModel.value, column.id];
}

// ---- Rows: one band per lane (a single anonymous band without `lanes`) ----
const hasLanes = computed(() => !!props.lanes && props.lanes.length > 0);
const laneOf = (card: KanbanCard) => (hasLanes.value ? (card.laneId ?? props.lanes![0].id) : "");
const cellCards = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const [colId, list] of shownByColumn.value) {
        for (const card of list) {
            const key = `${colId}\u0000${laneOf(card)}`;
            const group = map.get(key);
            if (group) group.push(card);
            else map.set(key, [card]);
        }
    }
    return map;
});
type Slot = { kind: "lane"; lane: KanbanLane } | { kind: "row"; rowIndex: number; laneId: string; laneRow: number };
const slots = computed<Slot[]>(() => {
    const out: Slot[] = [];
    const bands: KanbanLane[] = hasLanes.value ? props.lanes! : [{ id: "", title: "" }];
    let rowIndex = 0;
    for (const lane of bands) {
        if (hasLanes.value) out.push({ kind: "lane", lane });
        // A collapsed lane keeps its header and shows no card rows.
        if (hasLanes.value && isLaneCollapsed(lane.id)) continue;
        let rows = 0;
        for (const column of orderedColumns.value) {
            if (isCollapsed(column.id)) continue;
            rows = Math.max(rows, cellCards.value.get(`${column.id}\u0000${lane.id}`)?.length ?? 0);
        }
        // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
        // empty column's message even when no column has a card to show.
        if (hasLanes.value) rows = Math.max(rows, 1);
        else if (rows === 0 && props.labels?.emptyColumn && orderedColumns.value.some(isEmptyColumn)) rows = 1;
        for (let laneRow = 0; laneRow < rows; laneRow++) out.push({ kind: "row", rowIndex: rowIndex++, laneId: lane.id, laneRow });
    }
    return out;
});
const rowSlots = computed(() => slots.value.filter((x): x is Extract<Slot, { kind: "row" }> => x.kind === "row"));
const maxRows = computed(() => rowSlots.value.length);

// The roving cursor, clamped to the cells that exist now: a move can shrink
// the board, and a cursor left on a vanished row would take the grid out of
// the tab order altogether.
const activeRow = computed(() => Math.min(focusedRow.value, maxRows.value - 1));
const activeCol = computed(() => Math.min(focusedCol.value, orderedColumns.value.length - 1));

function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = orderedColumns.value[colIndex];
    const slot = rowSlots.value[rowIndex];
    if (!column || !slot || isCollapsed(column.id)) return undefined;
    return cellCards.value.get(`${column.id}\u0000${slot.laneId}`)?.[slot.laneRow];
}

/** One row's cells, precomputed so the template calls `cardAt` exactly once per cell. */
const rowOf = (item: { kind: string; slot?: Slot }) => ((item as { slot: Extract<Slot, { kind: "row" }> }).slot).rowIndex;

const laneIdOf = (item: { kind: string; slot?: Slot }) => ((item as { slot: Extract<Slot, { kind: "row" }> }).slot).laneId;

function cellsForRow(rowIndex: number) {
    return orderedColumns.value.map((column, colIndex) => ({ column, colIndex, card: cardAt(colIndex, rowIndex) }));
}

// ---- Windowing (virtualize) ----
const scrollTop = ref(0);
const scrollEl = ref<HTMLDivElement | null>(null);
// Row index → slot index, built once per change so a row does not scan `slots` to find itself.
const slotIndexByRow = computed(() => {
    const map = new Map<number, number>();
    slots.value.forEach((x, i) => {
        if (x.kind === "row") map.set(x.rowIndex, i);
    });
    return map;
});
const slotIndexOfRow = (rowIndex: number) => slotIndexByRow.value.get(rowIndex) ?? -1;
type RenderItem = { kind: "spacer"; height: number; key: string } | { kind: "slot"; slot: Slot; key: string };
/** Every card in a lane (the search/filter view still applies). */
const laneCardCount = (laneId: string) => {
    let n = 0;
    for (const column of orderedColumns.value) n += cellCards.value.get(`${column.id}\u0000${laneId}`)?.length ?? 0;
    return n;
};
const slotKey = (slot: Slot) => (slot.kind === "lane" ? `lane:${slot.lane.id}` : `row:${slot.rowIndex}`);
const renderItems = computed<RenderItem[]>(() => {
    const all = slots.value;
    const v = props.virtualize;
    if (!v) return all.map((slot) => ({ kind: "slot", slot, key: slotKey(slot) }));
    const overscan = v.overscan ?? 3;
    const start = Math.max(0, Math.floor(scrollTop.value / v.rowHeight) - overscan);
    const end = Math.min(all.length, Math.ceil((scrollTop.value + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    // The roving tab stop's row always renders, so the grid never leaves the tab order.
    const active = slotIndexOfRow(activeRow.value);
    if (active >= 0) indices.add(active);
    const out: RenderItem[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
        if (index - previous > 1) out.push({ kind: "spacer", height: (index - previous - 1) * v.rowHeight, key: `spacer:${previous}` });
        out.push({ kind: "slot", slot: all[index], key: slotKey(all[index]) });
        previous = index;
    }
    if (all.length - 1 - previous > 0) out.push({ kind: "spacer", height: (all.length - 1 - previous) * v.rowHeight, key: `spacer:${previous}` });
    return out;
});

/** Bring a row into the scroll area (virtualized boards render only what is in view). */
function revealRow(rowIndex: number): void {
    const v = props.virtualize;
    if (!v) return;
    const slotIndex = slotIndexOfRow(rowIndex);
    if (slotIndex < 0) return;
    const top = slotIndex * v.rowHeight;
    let next = scrollTop.value;
    if (top < scrollTop.value) next = top;
    else if (top + v.rowHeight > scrollTop.value + v.height) next = top + v.rowHeight - v.height;
    if (next !== scrollTop.value) {
        scrollTop.value = next;
        if (scrollEl.value) scrollEl.value.scrollTop = next;
    }
}

function countFor(column: KanbanColumn): number {
    return cardsByColumn.value.get(column.id)?.length ?? 0;
}

function overLimitFor(column: KanbanColumn): boolean {
    return column.wipLimit != null && countFor(column) > column.wipLimit;
}

function resolveCardLabel(card: KanbanCard): string {
    return (props.cardLabel ?? defaultCardLabel)(card);
}

function announce(message: string | undefined): void {
    if (message) statusMessage.value = message;
}

// Announce how many cards match after the search changes (not on the first render).
watch(search, () => {
    let matched = 0;
    for (const list of shownByColumn.value.values()) matched += list.length;
    announce(props.labels?.searchAnnouncement?.(matched, props.cards.length));
});

// ---------------------------------------------------------------
// Typed fields, inline editing, export
// ---------------------------------------------------------------

// Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per card or keystroke.
const resolvedFields = computed(() => resolveFields(props.fields, props.locale));
const isFieldEditable = (f: KanbanField, card: KanbanCard) => hasFieldEdit && !props.readonly && !card.locked && isEditableField(f);
const fieldText = (f: ResolvedField, card: KanbanCard): string => fieldTextOf(f, card.values);

/** The field being edited, if any: the draft is the editor's text. */
const editing = ref<{ cardId: string; fieldId: string; draft: Draft; invalid?: boolean } | null>(null);
/** Accepted field edits, for Ctrl/Cmd+Z once there is no move left to undo. The consumer owns the data, so an undo is reported through `field-edit`. */
let history: EditHistory = EMPTY_HISTORY;

async function startFieldEdit(card: KanbanCard, f: ResolvedField): Promise<void> {
    if (!isFieldEditable(f, card)) return;
    openCardId.value = null;
    moveActiveIndex.value = -1;
    editing.value = { cardId: card.id, fieldId: f.id, draft: draftOf(f, card.values) };
    await nextTick();
    const editor = rootEl.value?.querySelector<HTMLInputElement>(".kanban-board-field-editor");
    editor?.focus({ preventScroll: true });
    if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
}

/** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
function commitFieldEdit(refocus = true): boolean {
    const current = editing.value;
    if (!current) return true;
    const { cardId, fieldId, draft } = current;
    const card = effectiveCards.value.find((c) => c.id === cardId);
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    if (!card || !f) {
        editing.value = null;
        return true;
    }
    const outcome = evaluateEdit(f, card.values, draft);
    if (outcome.invalid) {
        editing.value = { ...current, invalid: true };
        announce((outcome.message ? props.labels?.editRefused?.(resolveCardLabel(card), f.header, outcome.message) : undefined) ?? props.labels?.editInvalid?.(resolveCardLabel(card), f.header));
        return false;
    }
    editing.value = null;
    if (outcome.changed) {
        history = recordEdit(history, { ownerId: cardId, fieldId, value: outcome.value, previous: outcome.previous });
        emit("field-edit", { cardId, fieldId, value: outcome.value, previous: outcome.previous });
        announce(props.labels?.editAnnouncement?.(resolveCardLabel(card), f.header, outcome.text));
    }
    if (refocus) void focusCard(cardId);
    return true;
}

// ---- In-place title editing (`title-edit`) ----

const componentSlots = useSlots();
const isTitleEditable = (card: KanbanCard) => hasTitleEdit && !props.readonly && !card.locked && !card.href && !componentSlots.card;
const editingTitle = ref<{ cardId: string; draft: string } | null>(null);

async function startTitleEdit(card: KanbanCard): Promise<void> {
    if (!isTitleEditable(card)) return;
    openCardId.value = null;
    moveActiveIndex.value = -1;
    editingTitle.value = { cardId: card.id, draft: resolveCardLabel(card) };
    await nextTick();
    const editor = rootEl.value?.querySelector<HTMLInputElement>(".kanban-board-title-editor");
    editor?.focus({ preventScroll: true });
    editor?.select();
}

function commitTitleEdit(refocus = true): void {
    const current = editingTitle.value;
    if (!current) return;
    editingTitle.value = null;
    const card = effectiveCards.value.find((c) => c.id === current.cardId);
    const title = current.draft.trim();
    if (card && title !== "" && title !== resolveCardLabel(card)) {
        const previous = resolveCardLabel(card);
        emit("title-edit", { cardId: current.cardId, title, previous });
        announce(props.labels?.titleEditAnnouncement?.(previous, title));
    }
    if (refocus) void focusCard(current.cardId);
}

function onTitleEditorKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
        event.preventDefault();
        commitTitleEdit();
    } else if (event.key === "Escape") {
        event.preventDefault();
        const current = editingTitle.value;
        editingTitle.value = null;
        if (current) void focusCard(current.cardId);
    }
}

/** Put an earlier field value back, or re-apply it, through `field-edit`. */
function stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(history) : redoEdit(history);
    if (!step.record) return;
    history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    emit("field-edit", { cardId: ownerId, fieldId, value: restored, previous: replaced });
    const card = effectiveCards.value.find((c) => c.id === ownerId);
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    if (!card || !f) return;
    const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(card.values ?? {}), [fieldId]: restored }) : String(restored);
    announce((direction === "undo" ? props.labels?.fieldUndoAnnouncement : props.labels?.fieldRedoAnnouncement)?.(resolveCardLabel(card), f.header, text));
}

function cancelFieldEdit(): void {
    const current = editing.value;
    if (!current) return;
    editing.value = null;
    void focusCard(current.cardId);
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
    } else if (event.key === "Tab" && editing.value) {
        // Tab commits and moves to the card's next (Shift+Tab: previous) editable field; past the last, it moves on.
        const current = editing.value;
        const card = effectiveCards.value.find((c) => c.id === current.cardId);
        const next = card ? neighbourField(resolvedFields.value.filter((x) => isFieldEditable(x, card)), current.fieldId, event.shiftKey) : undefined;
        if (card && next) {
            event.preventDefault();
            if (commitFieldEdit(false)) void startFieldEdit(card, next);
        } else {
            commitFieldEdit(false);
        }
    }
}

const editorValue = (draft: Draft): string => String(draft ?? "");

const exportCards = computed(() => {
    const out: KanbanCard[] = [];
    for (const column of orderedColumns.value) {
        for (const card of shownByColumn.value.get(column.id) ?? []) if (props.exportScope !== "selected" || isSelected(card.id)) out.push(card);
    }
    return out;
});
const hasExportButtons = computed(() => !!props.labels?.exportHeaders && !!(props.labels.copy || props.labels.exportCsv || props.labels.exportTsv || props.labels.exportExcel));

async function finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
    const text = toClipboardText(table);
    const copied: KanbanCopy = { text, rowCount: table.rows.length };
    emit("copy", copied);
    if (props.copyHandler?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    announce(ok ? props.labels?.copyAnnouncement?.(table.rows.length) : props.labels?.copyFailed);
}

function runExport(format: ExportFormat | "copy"): void {
    const h = props.labels?.exportHeaders;
    if (!h) return;
    const exportFields = exportableFields(resolvedFields.value);
    const headers = [h.title, h.column];
    if (hasLanes.value && h.lane) headers.push(h.lane);
    if (h.subtitle) headers.push(h.subtitle);
    if (h.badges) headers.push(h.badges);
    if (h.flag) headers.push(h.flag);
    for (const f of exportFields) headers.push(f.header);
    const columnTitle = new Map(props.columns.map((c) => [c.id, c.title]));
    const laneTitle = new Map((props.lanes ?? []).map((l) => [l.id, l.title]));
    const rows = exportCards.value.map((card) => {
        const cells: unknown[] = [resolveCardLabel(card), columnTitle.get(card.columnId) ?? card.columnId];
        if (hasLanes.value && h.lane) cells.push(laneTitle.get(laneOf(card)) ?? "");
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
    const filename = exportFilename(props.exportFilename, format);
    const blob = exportBlob({ headers, rows }, format, { sheetName: props.exportFilename });
    const file: KanbanExport = { format, filename, cardCount: rows.length, blob };
    emit("export-file", file);
    if (props.exportHandler?.(file) === false) return;
    downloadBlob(blob, filename);
    announce(props.labels?.exportAnnouncement?.(format, rows.length, filename));
}

// ---------------------------------------------------------------
// Move menu (keyboard + pointer share this)
// ---------------------------------------------------------------

/** Choosing the card's own column is not a move: the menu just closes. */
/** A move is refused by the consumer's `canMove`, or by the destination's hard limit. */
function isRefused(card: KanbanCard, toColumn: KanbanColumn, extra = 0, toLaneId?: string): boolean {
    const laneChange = hasLanes.value && toLaneId !== undefined && toLaneId !== laneOf(card);
    if (laneChange && !props.allowLaneChange) return true;
    const sameColumn = toColumn.id === card.columnId;
    if (sameColumn && !laneChange) return false;
    if (!sameColumn && props.allowedColumns && !props.allowedColumns(card).includes(toColumn.id)) return true;
    const toLane = hasLanes.value ? props.lanes!.find((l) => l.id === (toLaneId ?? laneOf(card))) : undefined;
    if (props.canMove && !props.canMove(card, toColumn, toLane)) return true;
    return (
        !sameColumn &&
        !!toColumn.strictLimit &&
        toColumn.wipLimit != null &&
        (cardsByColumn.value.get(toColumn.id)?.length ?? 0) + extra >= toColumn.wipLimit
    );
}

/** The columns the move menu offers for `card`: its own, and the ones it may move to. */
function moveTargets(card: KanbanCard): KanbanColumn[] {
    if (!props.allowedColumns) return orderedColumns.value;
    const allowed = props.allowedColumns(card);
    return orderedColumns.value.filter((c) => c.id === card.columnId || allowed.includes(c.id));
}

type UndoStep = { cardId: string; fromColumnId: string; toColumnId: string };
const undoStack = ref<UndoStep[][]>([]);
function recordUndo(group: UndoStep[]): void {
    if (!props.undoable || group.length === 0) return;
    undoStack.value = [...undoStack.value.slice(-49), group];
}

/** Resolves true when the move went through (no handler, a synchronous one, or a promise that resolved). */
async function runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string, silent = false): Promise<boolean> {
    if (toLaneId !== undefined) emit("move", card.id, toColumn.id, toIndex, toLaneId);
    else if (toIndex === undefined) emit("move", card.id, toColumn.id);
    else emit("move", card.id, toColumn.id, toIndex);
    const result = props.moveHandler
        ? toLaneId !== undefined
            ? props.moveHandler(card.id, toColumn.id, toIndex, toLaneId)
            : toIndex === undefined
              ? props.moveHandler(card.id, toColumn.id)
              : props.moveHandler(card.id, toColumn.id, toIndex)
        : undefined;
    if (!result || typeof (result as Promise<unknown>).then !== "function") {
        if (!silent) announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
        return true;
    }
    optimistic.value = { ...optimistic.value, [card.id]: toColumn.id };
    if (!silent) announce(props.labels?.movePending?.(resolveCardLabel(card), toColumn.title));
    try {
        await result;
        if (!silent) announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
        return true;
    } catch (error) {
        announce(props.labels?.moveFailed?.(resolveCardLabel(card), toColumn.title, error));
        emit("move-error", card.id, toColumn.id, error);
        return false;
    } finally {
        const { [card.id]: _settled, ...rest } = optimistic.value;
        optimistic.value = rest;
    }
}

// ---- Selection: several cards move together ----
const selectedSet = computed(() => new Set(selectedModel.value));
const isSelected = (cardId: string) => selectedSet.value.has(cardId);
function toggleSelected(cardId: string): void {
    selectedModel.value = isSelected(cardId)
        ? selectedModel.value.filter((id) => id !== cardId)
        : [...selectedModel.value, cardId];
}

/** The cards that move when `card` moves: the whole selection when `card` is in it, else just `card`. */
function movingGroup(card: KanbanCard): KanbanCard[] {
    if (!props.selectable || !isSelected(card.id) || selectedModel.value.length < 2) return [card];
    return effectiveCards.value.filter((c) => isSelected(c.id));
}

async function moveGroup(group: KanbanCard[], toColumn: KanbanColumn): Promise<void> {
    const moved: UndoStep[] = [];
    let admitted = 0;
    const runs: Promise<boolean>[] = [];
    for (const member of group) {
        if (member.locked || isPending(member.id) || member.columnId === toColumn.id) continue;
        if (isRefused(member, toColumn, admitted)) {
            announce(props.labels?.moveBlocked?.(resolveCardLabel(member), toColumn.title));
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
    announce(props.labels?.moveManyAnnouncement?.(runs.length, toColumn.title));
    selectedModel.value = [];
    await Promise.all(runs);
    recordUndo(moved);
}

// ---- Undo ----
async function undo(): Promise<void> {
    if (!props.undoable || props.readonly) return;
    let stack = undoStack.value;
    while (stack.length > 0) {
        const group = stack[stack.length - 1];
        stack = stack.slice(0, -1);
        undoStack.value = stack;
        const live = group
            .map((m) => ({ m, card: effectiveCards.value.find((c) => c.id === m.cardId) }))
            .filter((x): x is { m: UndoStep; card: KanbanCard } => !!x.card && x.card.columnId === x.m.toColumnId && !x.card.locked);
        if (live.length === 0) continue; // nothing of this step is where it was left: try the one before
        for (const { m, card } of live) {
            const back = orderedColumns.value.find((c) => c.id === m.fromColumnId);
            if (back) await runMove(card, back, undefined, undefined, true);
        }
        if (live.length === 1) {
            const back = orderedColumns.value.find((c) => c.id === live[0].m.fromColumnId);
            announce(props.labels?.undoAnnouncement?.(resolveCardLabel(live[0].card), back?.title ?? ""));
        } else {
            announce(props.labels?.undoManyAnnouncement?.(live.length));
        }
        return;
    }
}

function moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string): void {
    if (props.readonly || card.locked || isPending(card.id)) return;
    const group = movingGroup(card);
    if (group.length > 1) {
        void moveGroup(group, toColumn);
        void closeMoveMenu(card.id);
        return;
    }
    if (isRefused(card, toColumn, 0, toLaneId)) {
        announce(props.labels?.moveBlocked?.(resolveCardLabel(card), toColumn.title));
        void closeMoveMenu(card.id);
        return;
    }
    if (toColumn.id !== card.columnId || (toLaneId !== undefined && toLaneId !== laneOf(card))) {
        const from = card.columnId;
        void runMove(card, toColumn, toIndex, toLaneId).then((ok) => {
            if (ok && toColumn.id !== from) recordUndo([{ cardId: card.id, fromColumnId: from, toColumnId: toColumn.id }]);
        });
    }
    void closeMoveMenu(card.id);
}

async function openMoveMenu(card: KanbanCard): Promise<void> {
    if (props.readonly || card.locked) return;
    openCardId.value = card.id;
    const currentIndex = moveTargets(card).findIndex((c) => c.id === card.columnId);
    moveActiveIndex.value = currentIndex >= 0 ? currentIndex : 0;
    await nextTick();
    moveListRef?.el?.focus({ preventScroll: true });
}

async function closeMoveMenu(cardId: string, refocus = true): Promise<void> {
    if (openCardId.value === null) return;
    openCardId.value = null;
    moveActiveIndex.value = -1;
    if (refocus) await focusCard(cardId);
}

/**
 * Focus a card wherever it is after the next render — after a move the
 * consumer has put it in another column. The roving cursor follows it
 * there, and focus lands on its move button, or on its cell when there is
 * no button.
 */
async function focusCard(cardId: string): Promise<void> {
    await nextTick();
    const cell = Array.from(rootEl.value?.querySelectorAll<HTMLElement>("[data-card-id]") ?? []).find(
        (el) => el.dataset.cardId === cardId,
    );
    if (!cell) return;
    focusedRow.value = Number(cell.dataset.row);
    focusedCol.value = Number(cell.dataset.col);
    await nextTick();
    (cell.querySelector<HTMLElement>(".kanban-board-move-button") ?? cell).focus({ preventScroll: true });
}

function onMoveButtonClick(card: KanbanCard): void {
    void (openCardId.value === card.id ? closeMoveMenu(card.id) : openMoveMenu(card));
}

// ---------------------------------------------------------------
// Pointer drag-and-drop (supplementary, never the only path)
// ---------------------------------------------------------------

let draggingCardId: string | null = null;
let draggingColumnId: string | null = null;
const draggingGroup = ref<string[]>([]);

function onCardDragStart(card: KanbanCard, event: DragEvent): void {
    if (card.locked) {
        event.preventDefault();
        return;
    }
    draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
    const group = movingGroup(card);
    draggingGroup.value = group.map((c) => c.id);
    const root = rootEl.value;
    if (props.dragPreviewText && event.dataTransfer?.setDragImage && root) {
        const preview = document.createElement("div");
        preview.className = "kanban-board-drag-preview";
        preview.textContent = props.dragPreviewText(group);
        preview.style.position = "absolute";
        preview.style.top = "-1000px";
        root.appendChild(preview);
        event.dataTransfer.setDragImage(preview, 0, 0);
        setTimeout(() => preview.remove(), 0);
    }
}

function onCardDragEnd(): void {
    draggingGroup.value = [];
    dropTarget.value = null;
    dropBlocked.value = false;
}

// ---- Column reordering ----
function moveColumnTo(columnId: string, toIndex: number): boolean {
    const ids = orderedColumns.value.map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    columnOrderModel.value = ids;
    const column = props.columns.find((c) => c.id === columnId);
    if (column) announce(props.labels?.columnMoveAnnouncement?.(column.title, to + 1, ids.length));
    return true;
}

function onHeaderDrop(targetId: string, event: DragEvent): void {
    event.preventDefault();
    const id = draggingColumnId;
    draggingColumnId = null;
    if (!id || id === targetId) return;
    const to = orderedColumns.value.findIndex((c) => c.id === targetId);
    if (to >= 0) moveColumnTo(id, to);
}

/** The cell a dragged card is over, for `data-drop-target` styling. */
const dropTarget = ref<string | null>(null);

/** Whether the cell a dragged card is over would refuse it (`canMove`, `allowedColumns`, a strict WIP limit): the live "can't drop here" cue. */
const dropBlocked = ref(false);

function onColumnDragOver(event: DragEvent, column: KanbanColumn, rowIndex: number, colIndex: number): void {
    if (!draggingCardId || props.readonly) return;
    const card = props.cards.find((c) => c.id === draggingCardId);
    const slot = rowSlots.value[rowIndex];
    const blocked = !!card && isRefused(card, column, Math.max(0, draggingGroup.value.length - 1), hasLanes.value && slot ? slot.laneId : undefined);
    dropBlocked.value = blocked;
    dropTarget.value = `${rowIndex}-${colIndex}`;
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
    const cardId = draggingCardId ?? event.dataTransfer?.getData("text/plain");
    draggingCardId = null;
    draggingGroup.value = [];
    dropTarget.value = null;
    dropBlocked.value = false;
    if (props.readonly) return;
    const card = props.cards.find((c) => c.id === cardId);
    if (!card) return;
    const slot = rowSlots.value[rowIndex];
    const dropLane = hasLanes.value && slot ? slot.laneId : undefined;
    const shown = (slot ? cellCards.value.get(`${column.id}\u0000${slot.laneId}`) : shownByColumn.value.get(column.id)) ?? [];
    const overCard = slot ? shown[slot.laneRow] : shown[rowIndex];
    const dropIndex = slot ? slot.laneRow : rowIndex;
    if (card.columnId === column.id && hasLanes.value && dropLane !== undefined && dropLane !== laneOf(card)) {
        // Dropped into another lane of its own column: only the lane changes.
        moveCard(card, column, undefined, dropLane);
        return;
    }
    if (card.columnId === column.id) {
        // Dropped on another card of its own column: reorder to that position.
        const from = shown.findIndex((c) => c.id === card.id);
        if (overCard && from >= 0 && from !== dropIndex) {
            emit("reorder", card.id, dropIndex);
            announce(props.labels?.reorderAnnouncement?.(resolveCardLabel(card), dropIndex + 1, shown.length));
        }
        return;
    }
    moveCard(card, column, overCard ? dropIndex : undefined, dropLane);
}

// ---------------------------------------------------------------
// Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
// ---------------------------------------------------------------

async function focusActiveCell(): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')?.focus({ preventScroll: true });
}

function moveFocus(row: number, col: number): void {
    focusedCol.value = Math.min(Math.max(col, 0), orderedColumns.value.length - 1);
    focusedRow.value = Math.min(Math.max(row, 0), maxRows.value - 1);
    revealRow(focusedRow.value);
    void focusActiveCell();
}

/** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
function onGridFocusin(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    focusedRow.value = Number(cell.dataset.row);
    focusedCol.value = Number(cell.dataset.col);
}

function reorderCard(delta: 1 | -1): void {
    if (props.readonly) return;
    const card = cardAt(activeCol.value, activeRow.value);
    if (!card || card.locked) return;
    const slot = rowSlots.value[activeRow.value];
    const total = (slot ? cellCards.value.get(`${card.columnId}\u0000${slot.laneId}`) : shownByColumn.value.get(card.columnId))?.length ?? 0;
    const laneRow = slot ? slot.laneRow : activeRow.value;
    const toIndex = laneRow + delta;
    if (toIndex < 0 || toIndex >= total) return;
    emit("reorder", card.id, toIndex);
    announce(props.labels?.reorderAnnouncement?.(resolveCardLabel(card), toIndex + 1, total));
    void focusCard(card.id);
}

const TYPEAHEAD_WINDOW_MS = 700;
let typeahead: TypeaheadState = { prefix: "", at: 0 };

function onGridKeydown(event: KeyboardEvent): void {
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
    const historyAction = hasFieldEdit && !props.readonly ? historyKey(event) : null;
    if (props.undoable && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z") && undoStack.value.length > 0) {
        event.preventDefault();
        void undo();
        return;
    }
    if (historyAction) {
        event.preventDefault();
        stepHistory(historyAction);
        return;
    }
    if (props.undoable && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z")) {
        event.preventDefault();
        void undo();
        return;
    }
    if (props.movableColumns && event.altKey && event.shiftKey && (key === "ArrowLeft" || key === "ArrowRight")) {
        // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
        event.preventDefault();
        const column = orderedColumns.value[activeCol.value];
        const to = activeCol.value + (key === "ArrowLeft" ? -1 : 1);
        if (column && moveColumnTo(column.id, to)) {
            focusedCol.value = to;
            void focusActiveCell();
        }
        return;
    }
    if (event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
        // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
        event.preventDefault();
        const card = cardAt(activeCol.value, activeRow.value);
        const destination = orderedColumns.value[activeCol.value + (key === "ArrowLeft" ? -1 : 1)];
        if (card && destination) moveCard(card, destination);
        return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        reorderCard(event.key === "ArrowUp" ? -1 : 1);
        return;
    }
    if (event.key === "F2" && hasTitleEdit) {
        // F2 with title editing on: rename the card (its fields are edited by clicking them or Tab from the title).
        const card = cardAt(activeCol.value, activeRow.value);
        if (card && isTitleEditable(card)) {
            event.preventDefault();
            void startTitleEdit(card);
            return;
        }
    }
    if (event.key === "F2" && hasFieldEdit) {
        // F2: edit the card's first editable field (the keyboard twin of clicking its value).
        const card = cardAt(activeCol.value, activeRow.value);
        const first = card ? resolvedFields.value.find((f) => isFieldEditable(f, card)) : undefined;
        if (card && first) {
            event.preventDefault();
            void startFieldEdit(card, first);
        }
        return;
    }
    // Type-ahead in the focused column: letters typed in quick succession move to the next card whose label starts with them.
    // A lone "x" stays the select shortcut when cards are selectable; it joins a prefix already in progress.
    if (isTypeaheadKey(event)) {
        const now = Date.now();
        const continuing = typeahead.prefix !== "" && now - typeahead.at <= TYPEAHEAD_WINDOW_MS;
        const isSelectKey = props.selectable && (event.key === "x" || event.key === "X");
        if (continuing || !isSelectKey) {
            const state = nextTypeaheadState(typeahead, event.key, now, TYPEAHEAD_WINDOW_MS);
            const labelsInColumn = Array.from({ length: maxRows.value }, (_, row) => {
                const card = cardAt(activeCol.value, row);
                return card ? resolveCardLabel(card) : "";
            });
            const hit = findTypeaheadMatch(labelsInColumn, activeRow.value, state.prefix);
            if (hit !== -1) {
                typeahead = state;
                event.preventDefault();
                moveFocus(hit, activeCol.value);
                return;
            }
        }
    }
    if (props.selectable && !ctrlOrMeta && !event.altKey && (event.key === "x" || event.key === "X")) {
        const card = cardAt(activeCol.value, activeRow.value);
        if (card && !props.readonly) {
            event.preventDefault();
            toggleSelected(card.id);
        }
        return;
    }
    const move = gridMove(
        event,
        { row: activeRow.value, col: activeCol.value },
        { firstRow: 0, lastRow: maxRows.value - 1, lastCol: orderedColumns.value.length - 1, pageStep: pageStepFor(props.virtualize), homeEnd: "column", rtl: isRtl(cell) },
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
            const card = cardAt(activeCol.value, activeRow.value);
            if (card) void openMoveMenu(card);
            break;
        }
    }
}
</script>

<template>
    <div ref="rootEl" :class="`kanban-board ${props.class ?? ''}`.trim()" :data-readonly="readonly ? '' : undefined" :data-field-layout="fieldLayout === 'compact' ? 'compact' : undefined">
        <label v-if="labels?.search && showSearchLabel" class="kanban-board-search-label" :for="`${baseId}-search`">{{ labels.search }}</label>
        <SearchInput
            v-if="labels?.search"
            :id="`${baseId}-search`"
            v-model="search"
            class="kanban-board-search"
            :label="labels.search"
            @keydown="(e: KeyboardEvent) => { if (e.key === 'Escape' && search !== '') { e.preventDefault(); search = ''; } }"
        />
        <div v-if="hasExportButtons" class="kanban-board-export" role="group" :aria-label="labels?.export">
            <button v-if="labels?.copy" type="button" class="kanban-board-export-button" data-kanban-export-format="copy" :disabled="exportCards.length === 0" @click="runExport('copy')">{{ labels.copy }}</button>
            <button v-if="labels?.exportCsv" type="button" class="kanban-board-export-button" data-kanban-export-format="csv" :disabled="exportCards.length === 0" @click="runExport('csv')">{{ labels.exportCsv }}</button>
            <button v-if="labels?.exportTsv" type="button" class="kanban-board-export-button" data-kanban-export-format="tsv" :disabled="exportCards.length === 0" @click="runExport('tsv')">{{ labels.exportTsv }}</button>
            <button v-if="labels?.exportExcel" type="button" class="kanban-board-export-button" data-kanban-export-format="xlsx" :disabled="exportCards.length === 0" @click="runExport('xlsx')">{{ labels.exportExcel }}</button>
        </div>
        <button v-if="undoable && labels?.undo && !readonly" type="button" class="kanban-board-undo-button" :disabled="undoStack.length === 0" @click="undo">{{ labels.undo }}</button>
        <!-- The scroll area is structural: a virtualized board renders only the rows in view inside it. -->
        <div
            ref="scrollEl"
            :class="virtualize ? 'kanban-board-scroll' : 'kanban-board-body'"
            :style="virtualize ? { height: `${virtualize.height}px`, overflow: 'auto' } : undefined"
            @scroll="virtualize ? (scrollTop = ($event.currentTarget as HTMLElement).scrollTop) : undefined"
        >
        <KanbanTable
            :label="label"
            :caption="caption"
            :aria-multiselectable="selectable ? 'true' : undefined"
            :aria-rowcount="virtualize ? slots.length + 1 : undefined"
            @keydown="onGridKeydown"
            @focusin="onGridFocusin"
        >
            <KanbanTableHead>
                <KanbanTableRow>
                    <KanbanTableTH
                        v-for="column in orderedColumns"
                        :key="column.id"
                        :draggable="movableColumns ? 'true' : undefined"
                        @dragstart="movableColumns ? ((e: DragEvent) => { draggingColumnId = column.id; e.dataTransfer?.setData('text/plain', column.id); })($event) : undefined"
                        @dragover="movableColumns && draggingColumnId ? $event.preventDefault() : undefined"
                        @drop="movableColumns ? onHeaderDrop(column.id, $event) : undefined"
                        :data-over-limit="overLimitFor(column) ? '' : undefined"
                        :data-collapsed="isCollapsed(column.id) ? '' : undefined"
                        :data-hidden-count="hiddenCountFor(column) > 0 ? hiddenCountFor(column) : undefined"
                        :data-flag="column.flag"
                        :data-accent="column.accent"
                    >
                        <button
                            v-if="labels?.collapseColumn"
                            type="button"
                            class="kanban-board-collapse-button"
                            :aria-expanded="!isCollapsed(column.id) ? 'true' : 'false'"
                            :aria-label="labels.collapseColumn(column, isCollapsed(column.id))"
                            @click="toggleCollapsed(column)"
                        >{{ isCollapsed(column.id) ? "▸" : "▾" }}</button>
                        {{ column.title }}
                        <span v-if="column.flag" class="kanban-board-column-flag">{{ column.flag }}</span>
                        <slot
                            name="columnHeader"
                            :column="column"
                            :cards="cardsByColumn.get(column.id) ?? []"
                            :count="countFor(column)"
                        />
                        <span v-if="labels?.cardCount" class="kanban-board-count">{{
                            labels.cardCount(countFor(column))
                        }}</span>
                        <span
                            v-if="overLimitFor(column) && labels?.overLimit"
                            class="kanban-board-wip-warning"
                            >{{ labels.overLimit(countFor(column), column.wipLimit ?? 0) }}</span
                        >
                        <button
                            v-if="labels?.addCard && !readonly"
                            type="button"
                            class="kanban-board-add-button"
                            :aria-label="labels.addCard(column)"
                            @click="emit('add-card', column.id)"
                        >+</button>
                    </KanbanTableTH>
                </KanbanTableRow>
            </KanbanTableHead>
            <KanbanTableBody>
                <template v-for="item in renderItems" :key="item.key">
                <tr v-if="item.kind === 'spacer'" class="kanban-board-spacer" aria-hidden="true" :style="{ height: `${item.height}px` }"><td :colspan="orderedColumns.length"></td></tr>
                <KanbanTableRow v-else-if="item.slot.kind === 'lane'" data-lane-row="">
                    <th
                        class="kanban-board-lane"
                        scope="rowgroup"
                        :colspan="orderedColumns.length"
                        :data-lane-id="item.slot.lane.id"
                        :data-collapsed="isLaneCollapsed(item.slot.lane.id) ? '' : undefined"
                    >
                        <button
                            v-if="labels?.collapseLane"
                            type="button"
                            class="kanban-board-lane-toggle"
                            :aria-expanded="!isLaneCollapsed(item.slot.lane.id)"
                            :aria-label="labels.collapseLane(item.slot.lane, isLaneCollapsed(item.slot.lane.id))"
                            @click="toggleLane(item.slot.lane)"
                        >{{ isLaneCollapsed(item.slot.lane.id) ? "▸" : "▾" }}</button>
                        <span class="kanban-board-lane-title">{{ item.slot.lane.title }}</span>
                        <span v-if="labels?.laneCount" class="kanban-board-lane-count">{{ labels.laneCount(item.slot.lane, laneCardCount(item.slot.lane.id)) }}</span>
                    </th>
                </KanbanTableRow>
                <KanbanTableRow
                    v-else
                    :aria-rowindex="virtualize ? slotIndexOfRow(rowOf(item)) + 2 : undefined"
                    :data-lane-id="hasLanes ? laneIdOf(item) : undefined"
                >
                    <KanbanTableTD
                        v-for="cell in cellsForRow(rowOf(item))"
                        :key="cell.column.id"
                        :data-row="rowOf(item)"
                        :data-selected="cell.card && selectable && isSelected(cell.card.id) ? '' : undefined"
                        :aria-selected="cell.card && selectable && isSelected(cell.card.id) ? 'true' : undefined"
                        :data-dragging="cell.card && draggingGroup.includes(cell.card.id) ? '' : undefined"
                        @click="(e: MouseEvent) => { if (selectable && (e.ctrlKey || e.metaKey) && cell.card && !readonly) { e.preventDefault(); toggleSelected(cell.card.id); } }"
                        :data-col="cell.colIndex"
                        :data-card-id="cell.card?.id"
                        :data-collapsed="isCollapsed(cell.column.id) ? '' : undefined"
                        :data-locked="cell.card?.locked ? '' : undefined"
                        :data-pending="cell.card && isPending(cell.card.id) ? '' : undefined"
                        :aria-busy="cell.card && isPending(cell.card.id) ? 'true' : undefined"
                        :data-flag="cell.card?.flag"
                        :data-accent="cell.column.accent"
                        :data-empty="!cell.card && !hasLanes && rowOf(item) === 0 && labels?.emptyColumn && isEmptyColumn(cell.column) ? '' : undefined"
                        :data-drop-target="dropTarget === `${rowOf(item)}-${cell.colIndex}` && !dropBlocked ? '' : undefined"
                        :data-drop-blocked="dropTarget === `${rowOf(item)}-${cell.colIndex}` && dropBlocked ? '' : undefined"
                        :aria-describedby="cell.card?.flag ? `${baseId}-flag-${cell.card.id}` : undefined"
                        v-bind="cell.card ? (cardAttrs?.(cell.card) ?? {}) : {}"
                        :active="activeRow === rowOf(item) && activeCol === cell.colIndex"
                        :label="cell.card ? resolveCardLabel(cell.card) : ''"
                        @dragover="(e: DragEvent) => onColumnDragOver(e, cell.column, rowOf(item), cell.colIndex)"
                        @dragleave="() => { dropTarget = null; dropBlocked = false; }"
                        @drop="(e: DragEvent) => onColumnDrop(cell.column, rowOf(item), e)"
                    >
                        <template v-if="cell.card">
                            <!--
                                The card title is a supplementary pointer-drag handle inside
                                an already-interactive gridcell (role comes from the parent
                                KanbanTableTD); dragstart here is one of two equally-real move
                                paths, not the accessible one — see the move-button/listbox
                                below for that. No separate role fits a drag handle that isn't
                                itself a widget.
                            -->
                            <span
                                class="kanban-board-card-title"
                                :draggable="readonly || cell.card!.locked || cell.card!.draggable === false || editingTitle?.cardId === cell.card!.id ? undefined : 'true'"
                                @dragstart="(e: DragEvent) => onCardDragStart(cell.card!, e)"
                                @dragend="onCardDragEnd"
                                @dblclick="startTitleEdit(cell.card!)"
                            >
                                <input
                                    v-if="editingTitle?.cardId === cell.card!.id"
                                    class="kanban-board-title-editor"
                                    type="text"
                                    :aria-label="labels?.titleEditor ? labels.titleEditor(resolveCardLabel(cell.card!)) : resolveCardLabel(cell.card!)"
                                    v-model="editingTitle.draft"
                                    @keydown="onTitleEditorKeydown"
                                    @blur="commitTitleEdit(false)"
                                />
                                <slot
                                    v-else-if="$slots.card"
                                    name="card"
                                    :card="cell.card!"
                                    :label="resolveCardLabel(cell.card!)"
                                    :column="cell.column"
                                    :pending="isPending(cell.card!.id)"
                                />
                                <a v-else-if="cell.card!.href" class="kanban-board-card-link" :href="cell.card!.href"><template v-if="searching"><template v-for="(part, i) in highlightSegments(resolveCardLabel(cell.card!), search)" :key="i"><Mark v-if="part.match" class="kanban-board-match">{{ part.text }}</Mark><template v-else>{{ part.text }}</template></template></template><template v-else>{{ resolveCardLabel(cell.card!) }}</template></a>
                                <template v-else-if="searching"><template v-for="(part, i) in highlightSegments(resolveCardLabel(cell.card!), search)" :key="i"><Mark v-if="part.match" class="kanban-board-match">{{ part.text }}</Mark><template v-else>{{ part.text }}</template></template></template>
                                <template v-else>{{ resolveCardLabel(cell.card!) }}</template>
                            </span>
                            <template v-if="!$slots.card">
                                <span v-if="cell.card!.subtitle" class="kanban-board-card-subtitle">{{ cell.card!.subtitle }}</span>
                                <span v-if="cell.card!.badges?.length" class="kanban-board-card-badges">
                                    <span v-for="badge in cell.card!.badges" :key="badge" class="kanban-board-card-badge">{{ badge }}</span>
                                </span>
                            </template>
                            <span v-if="!$slots.card && resolvedFields.length > 0" class="kanban-board-card-fields">
                                <template v-for="f in resolvedFields" :key="f.id">
                                    <span
                                        v-if="editing && editing.cardId === cell.card!.id && editing.fieldId === f.id"
                                        class="kanban-board-card-field"
                                        :data-field="f.id"
                                        data-editing=""
                                    >
                                        <span class="kanban-board-card-field-name" :id="`${baseId}-fn-${cell.card!.id}-${f.id}`">{{ f.header }}</span>{{ " " }}
                                        <select
                                            v-if="editorKind(f) === 'select' || editorKind(f) === 'radio'"
                                            class="kanban-board-field-editor"
                                            :aria-label="f.editLabel ?? f.header"
                                            :aria-invalid="editing.invalid ? 'true' : undefined"
                                            :value="editorValue(editing.draft)"
                                            @change="(e) => { editing!.draft = (e.target as HTMLSelectElement).value; commitFieldEdit(); }"
                                            @keydown="onEditorKeydown"
                                            @blur="commitFieldEdit(false)"
                                        >
                                            <option value=""></option>
                                            <option v-for="option in f.options ?? []" :key="option.id" :value="option.id" :disabled="option.disabled">{{ option.label }}</option>
                                        </select>
                                        <input
                                            v-else
                                            class="kanban-board-field-editor"
                                            :aria-label="f.editLabel ?? f.header"
                                            :aria-invalid="editing.invalid ? 'true' : undefined"
                                            :type="editorKind(f) === 'number' ? 'number' : editorKind(f) === 'date' ? 'date' : editorKind(f) === 'time' ? 'time' : 'text'"
                                            :inputmode="editorKind(f) === 'number' ? 'decimal' : undefined"
                                            :value="editorValue(editing.draft)"
                                            @input="(e) => { editing!.draft = (e.target as HTMLInputElement).value; editing!.invalid = false; }"
                                            @keydown="onEditorKeydown"
                                            @blur="commitFieldEdit(false)"
                                        />
                                    </span>
                                    <span
                                        v-else-if="fieldText(f, cell.card!) !== '' || isFieldEditable(f, cell.card!)"
                                        class="kanban-board-card-field"
                                        :data-field="f.id"
                                        :data-type="f.type ?? 'text'"
                                    >
                                        <span class="kanban-board-card-field-name" :id="`${baseId}-fn-${cell.card!.id}-${f.id}`">{{ f.header }}</span>{{ " " }}
                                        <button
                                            v-if="isFieldEditable(f, cell.card!)"
                                            type="button"
                                            class="kanban-board-field-button"
                                            :id="`${baseId}-fv-${cell.card!.id}-${f.id}`"
                                            tabindex="-1"
                                            :aria-labelledby="`${baseId}-fn-${cell.card!.id}-${f.id} ${baseId}-fv-${cell.card!.id}-${f.id}`"
                                            @click="startFieldEdit(cell.card!, f)"
                                        >{{ fieldText(f, cell.card!) }}</button>
                                        <span v-else class="kanban-board-card-field-value">{{ fieldText(f, cell.card!) }}</span>
                                    </span>
                                </template>
                            </span>
                            <span v-if="cell.card!.flag" class="kanban-board-card-flag" :id="`${baseId}-flag-${cell.card!.id}`">{{ cell.card!.flag }}</span>
                            <!-- Gated on labels.moveButton: an unnamed button is worse than
                                 none, and Enter/Space on the cell opens the menu either way. -->
                            <IconButton
                                v-if="labels?.moveButton && !readonly && !cell.card!.locked"
                                baseClass="kanban-board-move-button"
                                :label="labels.moveButton(cell.card!)"
                                tabindex="-1"
                                aria-haspopup="listbox"
                                :aria-expanded="openCardId === cell.card!.id ? 'true' : 'false'"
                                :aria-controls="openCardId === cell.card!.id ? moveListId : undefined"
                                @click="onMoveButtonClick(cell.card!)"
                            >⇄</IconButton>
                            <Listbox
                                v-if="openCardId === cell.card!.id"
                                :ref="setMoveListRef"
                                as="ul"
                                :id="moveListId"
                                baseClass="kanban-board-move-list"
                                :label="labels?.moveMenuLabel ?? resolveCardLabel(cell.card!)"
                                navigation="active-descendant"
                                clamp
                                v-model:activeIndex="moveActiveIndex"
                                @activate="(i: number) => moveCard(cell.card!, moveTargets(cell.card!)[i])"
                                @escape="() => closeMoveMenu(cell.card!.id)"
                                @tab-out="() => closeMoveMenu(cell.card!.id, false)"
                            >
                                <li
                                    v-for="(destination, i) in moveTargets(cell.card!)"
                                    :key="destination.id"
                                    class="kanban-board-move-option"
                                    :id="moveOptionId(i)"
                                    role="option"
                                    :aria-selected="destination.id === cell.card!.columnId"
                                    :aria-disabled="isRefused(cell.card!, destination) ? 'true' : undefined"
                                    :data-active="i === moveActiveIndex ? '' : undefined"
                                    @click="() => moveCard(cell.card!, destination)"
                                >
                                    {{ destination.title }}
                                </li>
                            </Listbox>
                        </template>
                        <span
                            v-else-if="!hasLanes && rowOf(item) === 0 && labels?.emptyColumn && isEmptyColumn(cell.column)"
                            class="kanban-board-empty"
                            >{{ labels.emptyColumn(cell.column) }}</span
                        >
                    </KanbanTableTD>
                </KanbanTableRow>
                </template>
            </KanbanTableBody>
            <tfoot v-if="$slots.columnFooter" class="kanban-table-foot">
                <tr class="kanban-table-row">
                    <td v-for="column in orderedColumns" :key="column.id" class="kanban-table-td kanban-board-column-footer" :data-accent="column.accent">
                        <slot name="columnFooter" :column="column" :cards="cardsByColumn.get(column.id) ?? []" :count="countFor(column)" />
                    </td>
                </tr>
            </tfoot>
        </KanbanTable>
        </div>

        <p class="kanban-board-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
