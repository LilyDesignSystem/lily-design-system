<script lang="ts">
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

/** A single card. */
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
    /** A non-colour status (for example "SLA breached"): visible text, `data-flag`, and linked to the cell with `aria-describedby`. */
    flag?: string;
    /** Makes the title a link to the record (`<a href>`). */
    href?: string;
    /** `false` stops pointer dragging this card while keeping the move menu and keyboard moves. */
    draggable?: boolean;
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
    /** Announced when an async `moveHandler` rejects and the card goes back: (card title, column title, the rejection). */
    moveFailed?: (cardTitle: string, columnTitle: string, error: unknown) => string;
    /** Accessible name of the board's search field. Gates the field. */
    search?: string;
};

/** Public props for KanbanBoard. See `spec/index.md` §4 for the contract. */
export type Props = {
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
    /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
    allowedColumns?: (card: KanbanCard) => string[];
    /**
     * An async move: awaited when a card moves. The card shows in its new column at once with `data-pending` and `aria-busy`
     * and goes back if the promise rejects (`labels.moveFailed`, the `move-error` event). The `move` event is emitted either way.
     */
    moveHandler?: (cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>;
    /** The text `search` looks in. Defaults to the label, subtitle and badges. */
    searchText?: (card: KanbanCard) => string;
    /** Ids of collapsed columns (`v-model:collapsedColumns`). A collapsed column keeps its header and count but shows no cards. */
    collapsedColumns?: string[];
    /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
    canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
    /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
    readonly?: boolean;
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
import { computed, nextTick, ref } from "vue";
import {
    IconButton,
    KanbanTable,
    KanbanTableBody,
    KanbanTableHead,
    KanbanTableRow,
    KanbanTableTD,
    KanbanTableTH,
    Listbox,
} from "@lilydesignsystem/vue-headless";

const props = withDefaults(defineProps<Props>(), {
    caption: undefined,
    cardLabel: undefined,
    cardAttrs: undefined,
    filter: undefined,
    compare: undefined,
    allowedColumns: undefined,
    moveHandler: undefined,
    searchText: undefined,
    canMove: undefined,
    collapsedColumns: undefined,
    readonly: false,
    labels: () => ({}),
    class: "",
});

// The Svelte canonical takes an `onMove` callback prop; the Vue idiom
// for the same contract is an emitted event, matching `picker-bar`'s
// `theme-change` et al. and `date-time-picker`'s `change`.
const collapsedModel = defineModel<string[]>("collapsedColumns", { default: () => [] });
/** Board-level search (`v-model:search`): shows only cards whose text contains it (case-insensitive). Combines with `filter`. */
const search = defineModel<string>("search", { default: "" });

const emit = defineEmits<{
    /** A card moved. `toIndex` (0-based, in the visible column) is given only when a pointer drop landed on a card. */
    (event: "move", cardId: string, toColumnId: string, toIndex?: number): void;
    /** An async `moveHandler` rejected, after the card went back. */
    (event: "move-error", cardId: string, toColumnId: string, error: unknown): void;
    /** A column's add-card button was pressed. The consumer adds the card (Lily ships no editor). */
    (event: "add-card", columnId: string): void;
    /** Alt+ArrowUp/Down moved a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
    (event: "reorder", cardId: string, toIndex: number): void;
}>();

defineSlots<{
    card?: (ctx: KanbanCardContext) => unknown;
    columnHeader?: (ctx: KanbanColumnContext) => unknown;
    columnFooter?: (ctx: KanbanColumnContext) => unknown;
}>();

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
    for (const column of props.columns) map.set(column.id, []);
    for (const card of effectiveCards.value) {
        map.get(card.columnId)?.push(card);
    }
    return map;
});

// What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
const shownByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    const needle = search.value.trim().toLowerCase();
    for (const [id, list] of cardsByColumn.value) {
        let shown = props.filter ? list.filter(props.filter) : list.slice();
        if (needle) {
            const text = props.searchText ?? ((c: KanbanCard) => [resolveCardLabel(c), c.subtitle ?? "", ...(c.badges ?? [])].join(" "));
            shown = shown.filter((c) => text(c).toLowerCase().includes(needle));
        }
        if (props.compare) shown = shown.sort(props.compare);
        map.set(id, shown);
    }
    return map;
});

const isEmptyColumn = (column: KanbanColumn) => !isCollapsed(column.id) && (shownByColumn.value.get(column.id)?.length ?? 0) === 0;
const hiddenCountFor = (column: KanbanColumn) =>
    (cardsByColumn.value.get(column.id)?.length ?? 0) - (shownByColumn.value.get(column.id)?.length ?? 0);

const isCollapsed = (columnId: string) => collapsedModel.value.includes(columnId);

function toggleCollapsed(column: KanbanColumn): void {
    collapsedModel.value = isCollapsed(column.id)
        ? collapsedModel.value.filter((id) => id !== column.id)
        : [...collapsedModel.value, column.id];
}

// A collapsed column shows no cards, so it does not count towards the board's height.
// A row exists for an empty column's message even when no column has a card to show.
const maxRows = computed(() =>
    Math.max(
        props.columns.reduce(
            (max, column) => Math.max(max, isCollapsed(column.id) ? 0 : (shownByColumn.value.get(column.id)?.length ?? 0)),
            0,
        ),
        props.labels?.emptyColumn && props.columns.some(isEmptyColumn) ? 1 : 0,
    ),
);

// The roving cursor, clamped to the cells that exist now: a move can shrink
// the board, and a cursor left on a vanished row would take the grid out of
// the tab order altogether.
const activeRow = computed(() => Math.min(focusedRow.value, maxRows.value - 1));
const activeCol = computed(() => Math.min(focusedCol.value, props.columns.length - 1));

const rowIndices = computed(() => Array.from({ length: maxRows.value }, (_, i) => i));

function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = props.columns[colIndex];
    if (!column || isCollapsed(column.id)) return undefined;
    return shownByColumn.value.get(column.id)?.[rowIndex];
}

/** One row's cells, precomputed so the template calls `cardAt` exactly once per cell. */
function cellsForRow(rowIndex: number) {
    return props.columns.map((column, colIndex) => ({ column, colIndex, card: cardAt(colIndex, rowIndex) }));
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

// ---------------------------------------------------------------
// Move menu (keyboard + pointer share this)
// ---------------------------------------------------------------

/** Choosing the card's own column is not a move: the menu just closes. */
/** A move is refused by the consumer's `canMove`, or by the destination's hard limit. */
function isRefused(card: KanbanCard, toColumn: KanbanColumn): boolean {
    if (toColumn.id === card.columnId) return false;
    if (props.allowedColumns && !props.allowedColumns(card).includes(toColumn.id)) return true;
    if (props.canMove && !props.canMove(card, toColumn)) return true;
    return (
        !!toColumn.strictLimit &&
        toColumn.wipLimit != null &&
        (cardsByColumn.value.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
    );
}

/** The columns the move menu offers for `card`: its own, and the ones it may move to. */
function moveTargets(card: KanbanCard): KanbanColumn[] {
    if (!props.allowedColumns) return props.columns;
    const allowed = props.allowedColumns(card);
    return props.columns.filter((c) => c.id === card.columnId || allowed.includes(c.id));
}

async function runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): Promise<void> {
    if (toIndex === undefined) emit("move", card.id, toColumn.id);
    else emit("move", card.id, toColumn.id, toIndex);
    const result = props.moveHandler
        ? toIndex === undefined
            ? props.moveHandler(card.id, toColumn.id)
            : props.moveHandler(card.id, toColumn.id, toIndex)
        : undefined;
    if (!result || typeof (result as Promise<unknown>).then !== "function") {
        announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
        return;
    }
    optimistic.value = { ...optimistic.value, [card.id]: toColumn.id };
    announce(props.labels?.movePending?.(resolveCardLabel(card), toColumn.title));
    try {
        await result;
        announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
    } catch (error) {
        announce(props.labels?.moveFailed?.(resolveCardLabel(card), toColumn.title, error));
        emit("move-error", card.id, toColumn.id, error);
    } finally {
        const { [card.id]: _settled, ...rest } = optimistic.value;
        optimistic.value = rest;
    }
}

function moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): void {
    if (props.readonly || card.locked || isPending(card.id)) return;
    if (isRefused(card, toColumn)) {
        announce(props.labels?.moveBlocked?.(resolveCardLabel(card), toColumn.title));
        void closeMoveMenu(card.id);
        return;
    }
    if (toColumn.id !== card.columnId) {
        void runMove(card, toColumn, toIndex);
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

function onCardDragStart(card: KanbanCard, event: DragEvent): void {
    if (card.locked) {
        event.preventDefault();
        return;
    }
    draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
}

/** The cell a dragged card is over, for `data-drop-target` styling. */
const dropTarget = ref<string | null>(null);

function onColumnDragOver(event: DragEvent, rowIndex: number, colIndex: number): void {
    if (!draggingCardId || props.readonly) return;
    event.preventDefault();
    dropTarget.value = `${rowIndex}-${colIndex}`;
}

function onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
    event.preventDefault();
    const cardId = draggingCardId ?? event.dataTransfer?.getData("text/plain");
    draggingCardId = null;
    dropTarget.value = null;
    if (props.readonly) return;
    const card = props.cards.find((c) => c.id === cardId);
    if (!card) return;
    const shown = shownByColumn.value.get(column.id) ?? [];
    const overCard = shown[rowIndex];
    if (card.columnId === column.id) {
        // Dropped on another card of its own column: reorder to that position.
        const from = shown.findIndex((c) => c.id === card.id);
        if (overCard && from >= 0 && from !== rowIndex) {
            emit("reorder", card.id, rowIndex);
            announce(props.labels?.reorderAnnouncement?.(resolveCardLabel(card), rowIndex + 1, shown.length));
        }
        return;
    }
    moveCard(card, column, overCard ? rowIndex : undefined);
}

// ---------------------------------------------------------------
// Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
// ---------------------------------------------------------------

async function focusActiveCell(): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')?.focus({ preventScroll: true });
}

function moveFocus(row: number, col: number): void {
    focusedCol.value = Math.min(Math.max(col, 0), props.columns.length - 1);
    focusedRow.value = Math.min(Math.max(row, 0), maxRows.value - 1);
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
    const total = shownByColumn.value.get(card.columnId)?.length ?? 0;
    const toIndex = activeRow.value + delta;
    if (toIndex < 0 || toIndex >= total) return;
    emit("reorder", card.id, toIndex);
    announce(props.labels?.reorderAnnouncement?.(resolveCardLabel(card), toIndex + 1, total));
    void focusCard(card.id);
}

function onGridKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    // The open move menu owns its own keys; letting them bubble here moved the
    // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
    if (target.closest(".kanban-board-move-list")) return;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
        event.preventDefault();
        const card = cardAt(activeCol.value, activeRow.value);
        const destination = props.columns[activeCol.value + (event.key === "ArrowLeft" ? -1 : 1)];
        if (card && destination) moveCard(card, destination);
        return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        reorderCard(event.key === "ArrowUp" ? -1 : 1);
        return;
    }
    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            moveFocus(activeRow.value - 1, activeCol.value);
            break;
        case "ArrowDown":
            event.preventDefault();
            moveFocus(activeRow.value + 1, activeCol.value);
            break;
        case "ArrowLeft":
            event.preventDefault();
            moveFocus(activeRow.value, activeCol.value - 1);
            break;
        case "ArrowRight":
            event.preventDefault();
            moveFocus(activeRow.value, activeCol.value + 1);
            break;
        case "Home":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(0, 0);
            else moveFocus(0, activeCol.value);
            break;
        case "End":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(maxRows.value - 1, props.columns.length - 1);
            else moveFocus(maxRows.value - 1, activeCol.value);
            break;
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
    <div ref="rootEl" :class="`kanban-board ${props.class ?? ''}`.trim()" :data-readonly="readonly ? '' : undefined">
        <input v-if="labels?.search" v-model="search" type="search" class="kanban-board-search" :aria-label="labels.search" />
        <KanbanTable :label="label" :caption="caption" @keydown="onGridKeydown" @focusin="onGridFocusin">
            <KanbanTableHead>
                <KanbanTableRow>
                    <KanbanTableTH
                        v-for="column in columns"
                        :key="column.id"
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
                <KanbanTableRow v-for="rowIndex in rowIndices" :key="rowIndex">
                    <KanbanTableTD
                        v-for="cell in cellsForRow(rowIndex)"
                        :key="cell.column.id"
                        :data-row="rowIndex"
                        :data-col="cell.colIndex"
                        :data-card-id="cell.card?.id"
                        :data-collapsed="isCollapsed(cell.column.id) ? '' : undefined"
                        :data-locked="cell.card?.locked ? '' : undefined"
                        :data-pending="cell.card && isPending(cell.card.id) ? '' : undefined"
                        :aria-busy="cell.card && isPending(cell.card.id) ? 'true' : undefined"
                        :data-flag="cell.card?.flag"
                        :data-accent="cell.column.accent"
                        :data-empty="!cell.card && rowIndex === 0 && labels?.emptyColumn && isEmptyColumn(cell.column) ? '' : undefined"
                        :data-drop-target="dropTarget === `${rowIndex}-${cell.colIndex}` ? '' : undefined"
                        :aria-describedby="cell.card?.flag ? `${baseId}-flag-${cell.card.id}` : undefined"
                        v-bind="cell.card ? (cardAttrs?.(cell.card) ?? {}) : {}"
                        :active="activeRow === rowIndex && activeCol === cell.colIndex"
                        :label="cell.card ? resolveCardLabel(cell.card) : ''"
                        @dragover="(e: DragEvent) => onColumnDragOver(e, rowIndex, cell.colIndex)"
                        @dragleave="() => (dropTarget = null)"
                        @drop="(e: DragEvent) => onColumnDrop(cell.column, rowIndex, e)"
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
                                :draggable="readonly || cell.card!.locked || cell.card!.draggable === false ? undefined : 'true'"
                                @dragstart="(e: DragEvent) => onCardDragStart(cell.card!, e)"
                            >
                                <slot
                                    v-if="$slots.card"
                                    name="card"
                                    :card="cell.card!"
                                    :label="resolveCardLabel(cell.card!)"
                                    :column="cell.column"
                                    :pending="isPending(cell.card!.id)"
                                />
                                <a v-else-if="cell.card!.href" class="kanban-board-card-link" :href="cell.card!.href">{{ resolveCardLabel(cell.card!) }}</a>
                                <template v-else>{{ resolveCardLabel(cell.card!) }}</template>
                            </span>
                            <template v-if="!$slots.card">
                                <span v-if="cell.card!.subtitle" class="kanban-board-card-subtitle">{{ cell.card!.subtitle }}</span>
                                <span v-if="cell.card!.badges?.length" class="kanban-board-card-badges">
                                    <span v-for="badge in cell.card!.badges" :key="badge" class="kanban-board-card-badge">{{ badge }}</span>
                                </span>
                            </template>
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
                            v-else-if="rowIndex === 0 && labels?.emptyColumn && isEmptyColumn(cell.column)"
                            class="kanban-board-empty"
                            >{{ labels.emptyColumn(cell.column) }}</span
                        >
                    </KanbanTableTD>
                </KanbanTableRow>
            </KanbanTableBody>
            <tfoot v-if="$slots.columnFooter" class="kanban-table-foot">
                <tr class="kanban-table-row">
                    <td v-for="column in columns" :key="column.id" class="kanban-table-td kanban-board-column-footer" :data-accent="column.accent">
                        <slot name="columnFooter" :column="column" :cards="cardsByColumn.get(column.id) ?? []" :count="countFor(column)" />
                    </td>
                </tr>
            </tfoot>
        </KanbanTable>

        <p class="kanban-board-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
