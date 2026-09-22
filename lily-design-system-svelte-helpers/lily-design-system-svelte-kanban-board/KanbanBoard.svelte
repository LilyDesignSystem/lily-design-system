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
    let {
        class: className = "",
        label,
        caption,
        columns,
        cards,
        cardLabel = (card: KanbanCard) => card.title,
        onMove,
        labels = {},
        ...restProps
    }: Props = $props();

    const baseId = nextKanbanBoardId();
    const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    let focusedRow = $state(0);
    let focusedCol = $state(0);

    /** The card whose move menu is open, if any. */
    let openCardId = $state<string | null>(null);
    let moveActiveIndex = $state(-1);
    let moveButtonEl: HTMLButtonElement | undefined = $state();
    let moveListEl: HTMLElement | undefined = $state();

    const cardsByColumn = $derived.by(() => {
        const map = new Map<string, KanbanCard[]>();
        for (const column of columns) map.set(column.id, []);
        for (const card of cards) {
            map.get(card.columnId)?.push(card);
        }
        return map;
    });

    const maxRows = $derived(
        columns.reduce((max, column) => Math.max(max, cardsByColumn.get(column.id)?.length ?? 0), 0),
    );

    function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
        const column = columns[colIndex];
        if (!column) return undefined;
        return cardsByColumn.get(column.id)?.[rowIndex];
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Move menu (keyboard + pointer share this)
    // ---------------------------------------------------------------

    function moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
        onMove?.(card.id, toColumn.id);
        announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
        closeMoveMenu();
    }

    function openMoveMenu(card: KanbanCard): void {
        openCardId = card.id;
        const currentIndex = columns.findIndex((c) => c.id === card.columnId);
        moveActiveIndex = currentIndex >= 0 ? currentIndex : 0;
        queueMicrotask(() => {
            moveListEl?.focus({ preventScroll: true });
        });
    }

    function closeMoveMenu(refocus = true): void {
        if (openCardId === null) return;
        openCardId = null;
        moveActiveIndex = -1;
        if (refocus) queueMicrotask(() => moveButtonEl?.focus({ preventScroll: true }));
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
        if (card) moveCard(card, column);
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    function focusActiveCell(): void {
        queueMicrotask(() => {
            rootEl?.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')?.focus({ preventScroll: true });
        });
    }

    function moveFocus(row: number, col: number): void {
        focusedCol = Math.min(Math.max(col, 0), columns.length - 1);
        focusedRow = Math.min(Math.max(row, 0), maxRows - 1);
        focusActiveCell();
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                moveFocus(focusedRow - 1, focusedCol);
                break;
            case "ArrowDown":
                event.preventDefault();
                moveFocus(focusedRow + 1, focusedCol);
                break;
            case "ArrowLeft":
                event.preventDefault();
                moveFocus(focusedRow, focusedCol - 1);
                break;
            case "ArrowRight":
                event.preventDefault();
                moveFocus(focusedRow, focusedCol + 1);
                break;
            case "Home":
                event.preventDefault();
                if (ctrlOrMeta) moveFocus(0, 0);
                else moveFocus(0, focusedCol);
                break;
            case "End":
                event.preventDefault();
                if (ctrlOrMeta) moveFocus(maxRows - 1, columns.length - 1);
                else moveFocus(maxRows - 1, focusedCol);
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const card = cardAt(focusedCol, focusedRow);
                if (card) openMoveMenu(card);
                break;
            }
        }
    }
</script>

<div bind:this={rootEl} class={`kanban-board ${className}`.trim()} {...restProps}>
    <KanbanTable {label} {caption} onkeydown={onGridKeydown}>
        <KanbanTableHead>
            <KanbanTableRow>
                {#each columns as column (column.id)}
                    {@const count = cardsByColumn.get(column.id)?.length ?? 0}
                    {@const overLimit = column.wipLimit != null && count > column.wipLimit}
                    <KanbanTableTH data-over-limit={overLimit ? "" : undefined}>
                        {column.title}
                        {#if labels.cardCount}
                            <span class="kanban-board-count">{labels.cardCount(count)}</span>
                        {/if}
                        {#if overLimit && labels.overLimit}
                            <span class="kanban-board-wip-warning">{labels.overLimit(count, column.wipLimit ?? 0)}</span>
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
                            active={focusedRow === rowIndex && focusedCol === colIndex}
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
                                    draggable="true"
                                    ondragstart={(e: DragEvent) => onCardDragStart(card, e)}
                                >
                                    {cardLabel(card)}
                                </span>
                                <IconButton
                                    bind:ref={moveButtonEl}
                                    baseClass="kanban-board-move-button"
                                    label={labels.moveButton?.(card) ?? ""}
                                    tabindex="-1"
                                    aria-haspopup="listbox"
                                    aria-expanded={openCardId === card.id}
                                    onclick={() => (openCardId === card.id ? closeMoveMenu() : openMoveMenu(card))}
                                >
                                    ⇄
                                </IconButton>
                                {#if openCardId === card.id}
                                    <Listbox
                                        bind:ref={moveListEl}
                                        as="ul"
                                        baseClass="kanban-board-move-list"
                                        label={labels.moveMenuLabel ?? ""}
                                        navigation="active-descendant"
                                        clamp
                                        bind:activeIndex={moveActiveIndex}
                                        onActivate={(i: number) => moveCard(card, columns[i])}
                                        onEscape={() => closeMoveMenu()}
                                        onTabOut={() => closeMoveMenu(false)}
                                    >
                                        {#each columns as destination, i (destination.id)}
                                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                                            <li
                                                class="kanban-board-move-option"
                                                id={moveOptionId(i)}
                                                role="option"
                                                aria-selected={destination.id === card.columnId}
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
