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
    labels: () => ({}),
    class: "",
});

// The Svelte canonical takes an `onMove` callback prop; the Vue idiom
// for the same contract is an emitted event, matching `picker-bar`'s
// `theme-change` et al. and `date-time-picker`'s `change`.
const emit = defineEmits<{
    (event: "move", cardId: string, toColumnId: string): void;
}>();

const baseId = nextKanbanBoardId();
const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;

const rootEl = ref<HTMLDivElement | null>(null);
const statusMessage = ref("");
const focusedRow = ref(0);
const focusedCol = ref(0);

/** The card whose move menu is open, if any. */
const openCardId = ref<string | null>(null);
const moveActiveIndex = ref(-1);

// IconButton/Listbox are compositions: a template ref on them resolves
// to whatever they defineExpose (`{ el }`), not the raw DOM node. Only
// one move menu is ever open at a time, but the trigger buttons repeat
// once per card inside a v-for — a static `ref="…"` name there would
// collect into an array (Vue's v-for-ref rule), so each button's ref is
// captured into a plain Map keyed by card id via a function ref instead,
// letting `closeMoveMenu` refocus the SPECIFIC card's own button
// regardless of whether Enter/Space (keyboard) or a click opened it.
const moveButtonRefs = new Map<string, { el?: HTMLButtonElement } | null>();
function setMoveButtonRef(cardId: string, el: unknown): void {
    if (el) moveButtonRefs.set(cardId, el as { el?: HTMLButtonElement });
    else moveButtonRefs.delete(cardId);
}
// The open Listbox is also lexically inside that same v-for (even though
// `v-if` only ever mounts one at a time), so it gets the same array-ref
// treatment — a function ref sidesteps that too.
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

const maxRows = computed(() =>
    props.columns.reduce((max, column) => Math.max(max, cardsByColumn.value.get(column.id)?.length ?? 0), 0),
);

const rowIndices = computed(() => Array.from({ length: maxRows.value }, (_, i) => i));

function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = props.columns[colIndex];
    if (!column) return undefined;
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

function moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
    emit("move", card.id, toColumn.id);
    announce(props.labels?.moveAnnouncement?.(resolveCardLabel(card), toColumn.title));
    closeMoveMenu();
}

async function openMoveMenu(card: KanbanCard): Promise<void> {
    openCardId.value = card.id;
    const currentIndex = props.columns.findIndex((c) => c.id === card.columnId);
    moveActiveIndex.value = currentIndex >= 0 ? currentIndex : 0;
    await nextTick();
    moveListRef?.el?.focus({ preventScroll: true });
}

async function closeMoveMenu(refocus = true): Promise<void> {
    if (openCardId.value === null) return;
    const cardId = openCardId.value;
    openCardId.value = null;
    moveActiveIndex.value = -1;
    if (refocus) {
        await nextTick();
        moveButtonRefs.get(cardId)?.el?.focus({ preventScroll: true });
    }
}

function onMoveButtonClick(card: KanbanCard): void {
    void (openCardId.value === card.id ? closeMoveMenu() : openMoveMenu(card));
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
    if (card) moveCard(card, column);
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

function onGridKeydown(event: KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            moveFocus(focusedRow.value - 1, focusedCol.value);
            break;
        case "ArrowDown":
            event.preventDefault();
            moveFocus(focusedRow.value + 1, focusedCol.value);
            break;
        case "ArrowLeft":
            event.preventDefault();
            moveFocus(focusedRow.value, focusedCol.value - 1);
            break;
        case "ArrowRight":
            event.preventDefault();
            moveFocus(focusedRow.value, focusedCol.value + 1);
            break;
        case "Home":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(0, 0);
            else moveFocus(0, focusedCol.value);
            break;
        case "End":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(maxRows.value - 1, props.columns.length - 1);
            else moveFocus(maxRows.value - 1, focusedCol.value);
            break;
        case "Enter":
        case " ": {
            event.preventDefault();
            const card = cardAt(focusedCol.value, focusedRow.value);
            if (card) void openMoveMenu(card);
            break;
        }
    }
}
</script>

<template>
    <div ref="rootEl" :class="`kanban-board ${props.class ?? ''}`.trim()">
        <KanbanTable :label="label" :caption="caption" @keydown="onGridKeydown">
            <KanbanTableHead>
                <KanbanTableRow>
                    <KanbanTableTH
                        v-for="column in columns"
                        :key="column.id"
                        :data-over-limit="overLimitFor(column) ? '' : undefined"
                    >
                        {{ column.title }}
                        <span v-if="labels?.cardCount" class="kanban-board-count">{{
                            labels.cardCount(countFor(column))
                        }}</span>
                        <span
                            v-if="overLimitFor(column) && labels?.overLimit"
                            class="kanban-board-wip-warning"
                            >{{ labels.overLimit(countFor(column), column.wipLimit ?? 0) }}</span
                        >
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
                        :active="focusedRow === rowIndex && focusedCol === cell.colIndex"
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
                                draggable="true"
                                @dragstart="(e: DragEvent) => onCardDragStart(cell.card!, e)"
                                >{{ resolveCardLabel(cell.card!) }}</span
                            >
                            <IconButton
                                :ref="(el: unknown) => setMoveButtonRef(cell.card!.id, el)"
                                baseClass="kanban-board-move-button"
                                :label="labels?.moveButton?.(cell.card!) ?? ''"
                                tabindex="-1"
                                aria-haspopup="listbox"
                                :aria-expanded="openCardId === cell.card!.id ? 'true' : 'false'"
                                @click="onMoveButtonClick(cell.card!)"
                            >⇄</IconButton>
                            <Listbox
                                v-if="openCardId === cell.card!.id"
                                :ref="setMoveListRef"
                                as="ul"
                                baseClass="kanban-board-move-list"
                                :label="labels?.moveMenuLabel ?? ''"
                                navigation="active-descendant"
                                clamp
                                v-model:activeIndex="moveActiveIndex"
                                @activate="(i: number) => moveCard(cell.card!, columns[i])"
                                @escape="() => closeMoveMenu()"
                                @tab-out="() => closeMoveMenu(false)"
                            >
                                <li
                                    v-for="(destination, i) in columns"
                                    :key="destination.id"
                                    class="kanban-board-move-option"
                                    :id="moveOptionId(i)"
                                    role="option"
                                    :aria-selected="destination.id === cell.card!.columnId"
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
