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
        onMove?: (cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>;
        /** Called when an async `onMove` rejects, after the card has gone back. */
        onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
        /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
        allowedColumns?: (card: KanbanCard) => string[];
        /** Board-level search, bindable: shows only cards whose text contains it (case-insensitive). Combines with `filter`. */
        search?: string;
        /** The text `search` looks in. Defaults to the label, subtitle and badges. */
        searchText?: (card: KanbanCard) => string;
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
    import { tick, type Snippet } from "svelte";

    let {
        class: className = "",
        label,
        caption,
        columns,
        cards,
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
        ...restProps
    }: Props & {
        card?: Snippet<[KanbanCardContext]>;
        columnHeader?: Snippet<[KanbanColumnContext]>;
        columnFooter?: Snippet<[KanbanColumnContext]>;
    } = $props();

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
    // A row exists for an empty column's message even when no column has a card to show.
    const maxRows = $derived(
        Math.max(
            columns.reduce(
                (max, column) => Math.max(max, isCollapsed(column.id) ? 0 : (shownByColumn.get(column.id)?.length ?? 0)),
                0,
            ),
            labels.emptyColumn && columns.some(isEmptyColumn) ? 1 : 0,
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
        return shownByColumn.get(column.id)?.[rowIndex];
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
        if (allowedColumns && !allowedColumns(card).includes(toColumn.id)) return true;
        if (canMove && !canMove(card, toColumn)) return true;
        return !!toColumn.strictLimit && toColumn.wipLimit != null && (cardsByColumn.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit;
    }

    /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
    function moveTargets(card: KanbanCard): KanbanColumn[] {
        if (!allowedColumns) return columns;
        const allowed = allowedColumns(card);
        return columns.filter((c) => c.id === card.columnId || allowed.includes(c.id));
    }

    async function runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): Promise<void> {
        const result = toIndex === undefined ? onMove?.(card.id, toColumn.id) : onMove?.(card.id, toColumn.id, toIndex);
        if (!result || typeof (result as Promise<unknown>).then !== "function") {
            announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
            return;
        }
        optimistic = { ...optimistic, [card.id]: toColumn.id };
        announce(labels.movePending?.(cardLabel(card), toColumn.title));
        try {
            await result;
            announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
        } catch (error) {
            announce(labels.moveFailed?.(cardLabel(card), toColumn.title, error));
            onMoveError?.(card.id, toColumn.id, error);
        } finally {
            const { [card.id]: _settled, ...rest } = optimistic;
            optimistic = rest;
        }
    }

    function moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): void {
        if (readonly || card.locked || isPending(card.id)) return;
        if (isRefused(card, toColumn)) {
            announce(labels.moveBlocked?.(cardLabel(card), toColumn.title));
            closeMoveMenu(card.id);
            return;
        }
        if (toColumn.id !== card.columnId) {
            void runMove(card, toColumn, toIndex);
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

    function onCardDragStart(card: KanbanCard, event: DragEvent): void {
        if (card.locked) {
            event.preventDefault();
            return;
        }
        draggingCardId = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
    }

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
        dropTarget = null;
        if (readonly) return;
        const card = cards.find((c) => c.id === cardId);
        if (!card) return;
        const shown = shownByColumn.get(column.id) ?? [];
        const overCard = shown[rowIndex];
        if (card.columnId === column.id) {
            // Dropped on another card of its own column: reorder to that position.
            const from = shown.findIndex((c) => c.id === card.id);
            if (overCard && from >= 0 && from !== rowIndex) {
                onReorder?.(card.id, rowIndex);
                announce(labels.reorderAnnouncement?.(cardLabel(card), rowIndex + 1, shown.length));
            }
            return;
        }
        moveCard(card, column, overCard ? rowIndex : undefined);
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
        if (!card || card.locked) return;
        const total = shownByColumn.get(card.columnId)?.length ?? 0;
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
    <KanbanTable {label} {caption} onkeydown={onGridKeydown} onfocusin={onGridFocusin}>
        <KanbanTableHead>
            <KanbanTableRow>
                {#each columns as column (column.id)}
                    {@const count = cardsByColumn.get(column.id)?.length ?? 0}
                    {@const overLimit = column.wipLimit != null && count > column.wipLimit}
                    <KanbanTableTH data-over-limit={overLimit ? "" : undefined} data-hidden-count={count - (shownByColumn.get(column.id)?.length ?? 0) > 0 ? count - (shownByColumn.get(column.id)?.length ?? 0) : undefined} data-collapsed={isCollapsed(column.id) ? "" : undefined} data-flag={column.flag} data-accent={column.accent}>
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
            {#each { length: maxRows } as _, rowIndex (rowIndex)}
                <KanbanTableRow>
                    {#each columns as column, colIndex (column.id)}
                        {@const card = cardAt(colIndex, rowIndex)}
                        <KanbanTableTD
                            data-row={rowIndex}
                            data-col={colIndex}
                            data-card-id={card?.id}
                            data-locked={card?.locked ? "" : undefined}
                            data-pending={card && isPending(card.id) ? "" : undefined}
                            aria-busy={card && isPending(card.id) ? "true" : undefined}
                            data-flag={card?.flag}
                            data-accent={column.accent}
                            data-empty={!card && rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column) ? "" : undefined}
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
                            {:else if rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column)}
                                <span class="kanban-board-empty">{labels.emptyColumn(column)}</span>
                            {/if}
                        </KanbanTableTD>
                    {/each}
                </KanbanTableRow>
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

    <p class="kanban-board-status" aria-live="polite">{statusMessage}</p>
</div>
