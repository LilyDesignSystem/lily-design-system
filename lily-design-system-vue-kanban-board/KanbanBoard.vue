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
};

/** A single card. */
export type KanbanCard = {
    /** Stable card identifier. */
    id: string;
    /** The column this card currently belongs to. */
    columnId: string;
    /** Visible card title. */
    title: string;
};

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

const emit = defineEmits<{
    (event: "move", cardId: string, toColumnId: string): void;
    /** A column's add-card button was pressed. The consumer adds the card (Lily ships no editor). */
    (event: "add-card", columnId: string): void;
    /** Alt+ArrowUp/Down moved a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
    (event: "reorder", cardId: string, toIndex: number): void;
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

const cardsByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const column of props.columns) map.set(column.id, []);
    for (const card of props.cards) {
        map.get(card.columnId)?.push(card);
    }
    return map;
});

const isCollapsed = (columnId: string) => collapsedModel.value.includes(columnId);

function toggleCollapsed(column: KanbanColumn): void {
    collapsedModel.value = isCollapsed(column.id)
        ? collapsedModel.value.filter((id) => id !== column.id)
        : [...collapsedModel.value, column.id];
}

// A collapsed column shows no cards, so it does not count towards the board's height.
const maxRows = computed(() =>
    props.columns.reduce(
        (max, column) => Math.max(max, isCollapsed(column.id) ? 0 : (cardsByColumn.value.get(column.id)?.length ?? 0)),
        0,
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
    return cardsByColumn.value.get(column.id)?.[rowIndex];
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
    if (props.canMove && !props.canMove(card, toColumn)) return true;
    return (
        !!toColumn.strictLimit &&
        toColumn.wipLimit != null &&
        (cardsByColumn.value.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
    );
}

function moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
    if (props.readonly) return;
    if (isRefused(card, toColumn)) {
        announce(props.labels?.moveBlocked?.(resolveCardLabel(card), toColumn.title));
        void closeMoveMenu(card.id);
        return;
    }
    if (toColumn.id !== card.columnId) {
        emit("move", card.id, toColumn.id);
        announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
    }
    void closeMoveMenu(card.id);
}

async function openMoveMenu(card: KanbanCard): Promise<void> {
    if (props.readonly) return;
    openCardId.value = card.id;
    const currentIndex = props.columns.findIndex((c) => c.id === card.columnId);
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
    draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
}

function onColumnDragOver(event: DragEvent): void {
    if (draggingCardId) event.preventDefault();
}

function onColumnDrop(column: KanbanColumn, event: DragEvent): void {
    event.preventDefault();
    const cardId = draggingCardId ?? event.dataTransfer?.getData("text/plain");
    draggingCardId = null;
    const card = props.cards.find((c) => c.id === cardId);
    // Dropping a card back on its own column is not a move.
    if (card && card.columnId !== column.id) moveCard(card, column);
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
    if (!card) return;
    const total = cardsByColumn.value.get(card.columnId)?.length ?? 0;
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
        <KanbanTable :label="label" :caption="caption" @keydown="onGridKeydown" @focusin="onGridFocusin">
            <KanbanTableHead>
                <KanbanTableRow>
                    <KanbanTableTH
                        v-for="column in columns"
                        :key="column.id"
                        :data-over-limit="overLimitFor(column) ? '' : undefined"
                        :data-collapsed="isCollapsed(column.id) ? '' : undefined"
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
                        :active="activeRow === rowIndex && activeCol === cell.colIndex"
                        :label="cell.card ? resolveCardLabel(cell.card) : ''"
                        @dragover="onColumnDragOver"
                        @drop="(e: DragEvent) => onColumnDrop(cell.column, e)"
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
                                :draggable="readonly ? undefined : 'true'"
                                @dragstart="(e: DragEvent) => onCardDragStart(cell.card!, e)"
                                >{{ resolveCardLabel(cell.card!) }}</span
                            >
                            <!-- Gated on labels.moveButton: an unnamed button is worse than
                                 none, and Enter/Space on the cell opens the menu either way. -->
                            <IconButton
                                v-if="labels?.moveButton && !readonly"
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
                                @activate="(i: number) => moveCard(cell.card!, columns[i])"
                                @escape="() => closeMoveMenu(cell.card!.id)"
                                @tab-out="() => closeMoveMenu(cell.card!.id, false)"
                            >
                                <li
                                    v-for="(destination, i) in columns"
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
                    </KanbanTableTD>
                </KanbanTableRow>
            </KanbanTableBody>
        </KanbanTable>

        <p class="kanban-board-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
