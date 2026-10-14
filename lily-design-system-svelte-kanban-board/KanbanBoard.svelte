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
    };

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
        /** Called after a card moves to a new column, by pointer or by the move menu. */
        onMove?: (cardId: string, toColumnId: string) => void;
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
    import { tick } from "svelte";

    let {
        class: className = "",
        label,
        caption,
        columns,
        cards,
        cardLabel = (card: KanbanCard) => card.title,
        onMove,
        onReorder,
        canMove,
        collapsedColumns = $bindable([]),
        onAddCard,
        readonly = false,
        labels = {},
        ...restProps
    }: Props = $props();

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

    const cardsByColumn = $derived.by(() => {
        const map = new Map<string, KanbanCard[]>();
        for (const column of columns) map.set(column.id, []);
        for (const card of cards) {
            map.get(card.columnId)?.push(card);
        }
        return map;
    });

    const isCollapsed = (columnId: string) => collapsedColumns.includes(columnId);

    // A collapsed column shows no cards, so it does not count towards the board's height.
    const maxRows = $derived(
        columns.reduce(
            (max, column) => Math.max(max, isCollapsed(column.id) ? 0 : (cardsByColumn.get(column.id)?.length ?? 0)),
            0,
        ),
    );

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
        if (!column || isCollapsed(column.id)) return undefined;
        return cardsByColumn.get(column.id)?.[rowIndex];
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Move menu (keyboard + pointer share this)
    // ---------------------------------------------------------------

    /** Choosing the card's own column is not a move: the menu just closes. */
    /** A move is refused by the consumer's `canMove`, or by the destination's hard limit. */
    function isRefused(card: KanbanCard, toColumn: KanbanColumn): boolean {
        if (toColumn.id === card.columnId) return false;
        if (canMove && !canMove(card, toColumn)) return true;
        return !!toColumn.strictLimit && toColumn.wipLimit != null && (cardsByColumn.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit;
    }

    function moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
        if (readonly) return;
        if (isRefused(card, toColumn)) {
            announce(labels.moveBlocked?.(cardLabel(card), toColumn.title));
            closeMoveMenu(card.id);
            return;
        }
        if (toColumn.id !== card.columnId) {
            onMove?.(card.id, toColumn.id);
            announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
        }
        closeMoveMenu(card.id);
    }

    async function openMoveMenu(card: KanbanCard): Promise<void> {
        if (readonly) return;
        openCardId = card.id;
        const currentIndex = columns.findIndex((c) => c.id === card.columnId);
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
        const card = cards.find((c) => c.id === cardId);
        // Dropping a card back on its own column is not a move.
        if (card && card.columnId !== column.id) moveCard(card, column);
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
        void focusActiveCell();
    }

    function reorderCard(delta: 1 | -1): void {
        if (readonly) return;
        const card = cardAt(activeCol, activeRow);
        if (!card) return;
        const total = cardsByColumn.get(card.columnId)?.length ?? 0;
        const toIndex = activeRow + delta;
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
    <KanbanTable {label} {caption} onkeydown={onGridKeydown} onfocusin={onGridFocusin}>
        <KanbanTableHead>
            <KanbanTableRow>
                {#each columns as column (column.id)}
                    {@const count = cardsByColumn.get(column.id)?.length ?? 0}
                    {@const overLimit = column.wipLimit != null && count > column.wipLimit}
                    <KanbanTableTH data-over-limit={overLimit ? "" : undefined} data-collapsed={isCollapsed(column.id) ? "" : undefined}>
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
            {#each { length: maxRows } as _, rowIndex (rowIndex)}
                <KanbanTableRow>
                    {#each columns as column, colIndex (column.id)}
                        {@const card = cardAt(colIndex, rowIndex)}
                        <KanbanTableTD
                            data-row={rowIndex}
                            data-col={colIndex}
                            data-card-id={card?.id}
                            data-collapsed={isCollapsed(column.id) ? "" : undefined}
                            active={activeRow === rowIndex && activeCol === colIndex}
                            label={card ? cardLabel(card) : undefined}
                            ondragover={onColumnDragOver}
                            ondrop={(e: DragEvent) => onColumnDrop(column, e)}
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
                                    draggable={readonly ? undefined : "true"}
                                    ondragstart={(e: DragEvent) => onCardDragStart(card, e)}
                                >
                                    {cardLabel(card)}
                                </span>
                                <!-- Gated on labels.moveButton: an unnamed button is worse than
                                     none, and Enter/Space on the cell opens the menu either way. -->
                                {#if labels.moveButton && !readonly}
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
                                        onActivate={(i: number) => moveCard(card, columns[i])}
                                        onEscape={() => closeMoveMenu(card.id)}
                                        onTabOut={() => closeMoveMenu(card.id, false)}
                                    >
                                        {#each columns as destination, i (destination.id)}
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
                            {/if}
                        </KanbanTableTD>
                    {/each}
                </KanbanTableRow>
            {/each}
        </KanbanTableBody>
    </KanbanTable>

    <p class="kanban-board-status" aria-live="polite">{statusMessage}</p>
</div>
