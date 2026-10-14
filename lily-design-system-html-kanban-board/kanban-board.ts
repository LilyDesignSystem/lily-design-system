/**
 * `<kanban-board>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A headless interactive kanban board: cards move between columns by
 * pointer drag-and-drop or, independently, by a keyboard-accessible
 * per-card "Move to…" menu — never drag-only (WCAG 2.5.7). WAI-ARIA APG
 * Grid roving-tabindex keyboard navigation across a rectangular grid
 * (columns × the largest column's card count).
 *
 * The table structure (`kanban-table`/`kanban-table-th`/
 * `kanban-table-td`/…) is this catalog's markup CONTRACT, documented in
 * `@lilydesignsystem/html-headless`'s `components/kanban-table*.html`
 * reference files — those are static templates, not JS classes, so this
 * element builds the class names/attributes they document by hand,
 * exclusively via `document.createElement`/`appendChild` (never
 * `innerHTML`/template strings: a `thead`/`tbody`/`tr`/`th`/`td` start
 * tag is silently dropped by the HTML parser whenever it isn't already
 * inside a real `<table>`'s own insertion mode, for `innerHTML` exactly
 * as for literal light-DOM children).
 *
 * The move menu reuses `@lilydesignsystem/html-headless`'s
 * `ListboxController` for its keyboard behaviour, the same module
 * `theme-picker` composes for its own dropdown.
 */
import { ListboxController } from "@lilydesignsystem/html-headless/components/listbox-controller.js";

const SVG_NS = "http://www.w3.org/2000/svg";

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
};

/** What `renderCard` receives. */
export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

/** What `renderColumnHeader` / `renderColumnFooter` receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback, matching every other helper's
 * label-gating convention. See spec/index.md §5.
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

/** Detail of the `reordercard` event, paired with the `onReorder` property. */
export type KanbanBoardReorderDetail = {
    cardId: string;
    /** 0-based index within the card's own column. */
    toIndex: number;
};

/** Detail of the `movecard` event, paired with the `onMove` property. */
export type KanbanBoardMoveDetail = {
    cardId: string;
    toColumnId: string;
    /** 0-based position in the visible column; present only when a pointer drop landed on a card. */
    toIndex?: number;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type KanbanBoardProps = {
    label: string;
    caption?: string;
    columns: KanbanColumn[];
    cards: KanbanCard[];
    cardLabel?: (card: KanbanCard) => string;
    onMove?: (cardId: string, toColumnId: string, toIndex?: number) => void;
    moveHandler?: (cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>;
    onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
    allowedColumns?: (card: KanbanCard) => string[];
    filter?: (card: KanbanCard) => boolean;
    compare?: (a: KanbanCard, b: KanbanCard) => number;
    cardAttrs?: (card: KanbanCard) => Record<string, string>;
    searchText?: (card: KanbanCard) => string;
    onReorder?: (cardId: string, toIndex: number) => void;
    canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
    readonly?: boolean;
    collapsedColumns?: string[];
    onCollapsedChange?: (collapsedColumns: string[]) => void;
    onAddCard?: (columnId: string) => void;
    labels?: KanbanLabels;
    class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextKanbanBoardId(): string {
    uid += 1;
    return `kanban-board-${uid}`;
}

const defaultCardLabel = (card: KanbanCard): string => card.title;

/** Custom-element class implementing `<kanban-board>`. */
export class KanbanBoard extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "caption", "class", "readonly", "search"];
    }

    // Backing storage for property-only members (arrays of objects and
    // functions can't be attributes — the same rule `date-time-picker`'s
    // §4.3 documents for its own `labels`/`shortcuts`/callbacks).
    #columns: KanbanColumn[] = [];
    #cards: KanbanCard[] = [];
    #cardLabel: (card: KanbanCard) => string = defaultCardLabel;
    #onMove: ((cardId: string, toColumnId: string, toIndex?: number) => void) | undefined;
    #moveHandler: ((cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>) | undefined;
    #onMoveError: ((cardId: string, toColumnId: string, error: unknown) => void) | undefined;
    #allowedColumns: ((card: KanbanCard) => string[]) | undefined;
    #filter: ((card: KanbanCard) => boolean) | undefined;
    #compare: ((a: KanbanCard, b: KanbanCard) => number) | undefined;
    #cardAttrs: ((card: KanbanCard) => Record<string, string>) | undefined;
    #searchText: ((card: KanbanCard) => string) | undefined;
    /** Cards moved optimistically by an async `moveHandler` that has not settled: id → destination column. */
    #optimistic: Record<string, string> = {};
    #dropTarget: string | null = null;
    #onReorder: ((cardId: string, toIndex: number) => void) | undefined;
    #canMove: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined;
    #labels: KanbanLabels = {};
    #collapsed: string[] = [];
    #onCollapsedChange: ((collapsedColumns: string[]) => void) | undefined;
    #onAddCard: ((columnId: string) => void) | undefined;

    // Rendered-DOM references.
    #rootEl: HTMLDivElement | null = null;
    #statusEl: HTMLParagraphElement | null = null;
    #statusMessage = "";

    // Roving-tabindex cursor (WAI-ARIA APG Grid pattern).
    #focusedRow = 0;
    #focusedCol = 0;
    // `"row-col"` -> the <td>. Rebuilt every #render(); read on every
    // focus move so moving the cursor never needs a structural rebuild.
    #cellEls = new Map<string, HTMLTableCellElement>();

    // Per-card move-button reference, keyed by card id — NOT a single
    // shared variable. Every other framework catalog's kanban-board port
    // independently found the same latent bug in the Svelte reference:
    // binding one shared element reference across every card's button
    // refocuses whichever card mounted last, not the card whose menu
    // closed. A `Map<cardId, button>` makes that bug structurally
    // impossible here — see kanban-board.test.ts's dedicated regression
    // test and spec/index.md §10.
    #moveButtonEls = new Map<string, HTMLButtonElement>();

    // Move menu (at most one open at a time).
    #openCardId: string | null = null;
    #moveListEl: HTMLUListElement | null = null;
    #moveOptionEls: HTMLLIElement[] = [];
    #moveController: ListboxController | null = null;

    // Pointer drag-and-drop (supplementary, never the only path).
    #draggingCardId: string | null = null;

    readonly #baseId = nextKanbanBoardId();

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get caption(): string {
        return this.getAttribute("caption") ?? "";
    }
    set caption(v: string) {
        if (v) this.setAttribute("caption", v);
        else this.removeAttribute("caption");
    }

    get columns(): KanbanColumn[] {
        return [...this.#columns];
    }
    set columns(v: KanbanColumn[]) {
        this.#columns = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get cards(): KanbanCard[] {
        return [...this.#cards];
    }
    set cards(v: KanbanCard[]) {
        this.#cards = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get cardLabel(): (card: KanbanCard) => string {
        return this.#cardLabel;
    }
    set cardLabel(fn: ((card: KanbanCard) => string) | undefined) {
        this.#cardLabel = fn ?? defaultCardLabel;
        this.#render();
    }

    get onMove(): ((cardId: string, toColumnId: string) => void) | undefined {
        return this.#onMove;
    }
    set onMove(fn: ((cardId: string, toColumnId: string) => void) | undefined) {
        this.#onMove = fn;
    }

    get onReorder(): ((cardId: string, toIndex: number) => void) | undefined {
        return this.#onReorder;
    }
    set onReorder(fn: ((cardId: string, toIndex: number) => void) | undefined) {
        this.#onReorder = fn;
    }

    /** Ids of collapsed columns: a collapsed column keeps its header and count but shows no cards. */
    get collapsedColumns(): string[] {
        return [...this.#collapsed];
    }
    set collapsedColumns(v: string[]) {
        this.#collapsed = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get onCollapsedChange(): ((collapsedColumns: string[]) => void) | undefined {
        return this.#onCollapsedChange;
    }
    set onCollapsedChange(fn: ((collapsedColumns: string[]) => void) | undefined) {
        this.#onCollapsedChange = fn;
    }

    /** Called with the column id when its add-card button is pressed; the consumer adds the card. */
    get onAddCard(): ((columnId: string) => void) | undefined {
        return this.#onAddCard;
    }
    set onAddCard(fn: ((columnId: string) => void) | undefined) {
        this.#onAddCard = fn;
    }

    /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
    /** Called when a card moves. `toIndex` is given only when a pointer drop landed on a card. */
    get moveHandler(): ((cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>) | undefined {
        return this.#moveHandler;
    }
    /**
     * An async move: awaited when a card moves. The card shows in its new column at once with `data-pending` and `aria-busy`
     * and goes back if the promise rejects (`labels.moveFailed`, `onMoveError`, the `moveerror` event). `onMove` and `movecard` fire either way.
     */
    set moveHandler(fn: ((cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>) | undefined) {
        this.#moveHandler = fn;
    }

    get onMoveError(): ((cardId: string, toColumnId: string, error: unknown) => void) | undefined {
        return this.#onMoveError;
    }
    set onMoveError(fn: ((cardId: string, toColumnId: string, error: unknown) => void) | undefined) {
        this.#onMoveError = fn;
    }

    /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
    get allowedColumns(): ((card: KanbanCard) => string[]) | undefined {
        return this.#allowedColumns;
    }
    set allowedColumns(fn: ((card: KanbanCard) => string[]) | undefined) {
        this.#allowedColumns = fn;
        this.#render();
    }

    /** Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
    get filter(): ((card: KanbanCard) => boolean) | undefined {
        return this.#filter;
    }
    set filter(fn: ((card: KanbanCard) => boolean) | undefined) {
        this.#filter = fn;
        this.#render();
    }

    /** Orders the cards shown within each column (a stable sort). */
    get compare(): ((a: KanbanCard, b: KanbanCard) => number) | undefined {
        return this.#compare;
    }
    set compare(fn: ((a: KanbanCard, b: KanbanCard) => number) | undefined) {
        this.#compare = fn;
        this.#render();
    }

    /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
    get cardAttrs(): ((card: KanbanCard) => Record<string, string>) | undefined {
        return this.#cardAttrs;
    }
    set cardAttrs(fn: ((card: KanbanCard) => Record<string, string>) | undefined) {
        this.#cardAttrs = fn;
        this.#render();
    }

    /** Board-level search (attribute `search`): shows only cards whose text contains it (case-insensitive). */
    get search(): string {
        return this.getAttribute("search") ?? "";
    }
    set search(v: string) {
        this.setAttribute("search", v);
    }

    /** The text `search` looks in. Defaults to the label, subtitle and badges. */
    get searchText(): ((card: KanbanCard) => string) | undefined {
        return this.#searchText;
    }
    set searchText(fn: ((card: KanbanCard) => string) | undefined) {
        this.#searchText = fn;
    }

    /** Replaces a card's title content. Return the node to put inside the title element. */
    renderCard?: (ctx: KanbanCardContext) => Node;
    /** Rendered in each column's header after its title and flag. */
    renderColumnHeader?: (ctx: KanbanColumnContext) => Node;
    /** Rendered in a `<tfoot>` cell per column: sums per stage. */
    renderColumnFooter?: (ctx: KanbanColumnContext) => Node;

    get canMove(): ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined {
        return this.#canMove;
    }
    set canMove(fn: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined) {
        this.#canMove = fn;
        this.#render();
    }

    /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
    get readonly(): boolean {
        return this.hasAttribute("readonly");
    }
    set readonly(v: boolean) {
        if (v) this.setAttribute("readonly", "");
        else this.removeAttribute("readonly");
    }

    get labels(): KanbanLabels {
        return { ...this.#labels };
    }
    set labels(v: KanbanLabels | undefined) {
        this.#labels = v && typeof v === "object" ? { ...v } : {};
        this.#render();
    }

    /** Is any card's move menu currently open? Read-only. */
    get moveMenuOpen(): boolean {
        return this.#openCardId !== null;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of a card's move-menu trigger button. Default: a
     * bundled swap-arrows SVG, `aria-hidden`, so the accessible name comes
     * from `labels.moveButton` alone — the same "no font-dependent glyph"
     * rule `theme-picker`/`share-picker` follow for their own buttons.
     */
    renderMoveButtonIcon(): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "kanban-board-move-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "1rem");
        svg.setAttribute("height", "1rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute(
            "d",
            "M2 5h9m0 0-3-3m3 3-3 3M14 11H5m0 0 3-3m-3 3 3 3",
        );
        svg.appendChild(path);
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
    }

    attributeChangedCallback(name: string): void {
        switch (name) {
            case "label":
            case "caption":
            case "class":
            case "readonly":
            case "search":
                this.#render();
                break;
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        this.#moveController?.destroy();
        this.#moveController = null;
    }

    // ---- Derived data ----

    /** Every card per column, optimistic moves applied (counts and WIP limits use this). */
    #allByColumn(): Map<string, KanbanCard[]> {
        const map = new Map<string, KanbanCard[]>();
        for (const column of this.#columns) map.set(column.id, []);
        for (const card of this.#cards) {
            const effective = card.id in this.#optimistic ? { ...card, columnId: this.#optimistic[card.id] } : card;
            map.get(effective.columnId)?.push(effective);
        }
        return map;
    }

    /** What the grid shows: the filtered, searched, sorted view. */
    #cardsByColumn(): Map<string, KanbanCard[]> {
        const map = new Map<string, KanbanCard[]>();
        const needle = this.search.trim().toLowerCase();
        const text =
            this.#searchText ??
            ((c: KanbanCard) => [this.#cardLabel(c), c.subtitle ?? "", ...(c.badges ?? [])].join(" "));
        for (const [id, list] of this.#allByColumn()) {
            let shown = this.#filter ? list.filter(this.#filter) : list.slice();
            if (needle) shown = shown.filter((c) => text(c).toLowerCase().includes(needle));
            if (this.#compare) shown = shown.sort(this.#compare);
            map.set(id, shown);
        }
        return map;
    }

    #isEmptyColumn(column: KanbanColumn, cardsByColumn: Map<string, KanbanCard[]>): boolean {
        return !this.#collapsed.includes(column.id) && (cardsByColumn.get(column.id)?.length ?? 0) === 0;
    }

    #maxRows(cardsByColumn: Map<string, KanbanCard[]>): number {
        let max = 0;
        for (const column of this.#columns) {
            if (this.#collapsed.includes(column.id)) continue;
            max = Math.max(max, cardsByColumn.get(column.id)?.length ?? 0);
        }
        // A row exists for an empty column's message even when no column has a card to show.
        if (max === 0 && this.#labels.emptyColumn && this.#columns.some((c) => this.#isEmptyColumn(c, cardsByColumn))) max = 1;
        return max;
    }

    #cardAt(
        colIndex: number,
        rowIndex: number,
        cardsByColumn: Map<string, KanbanCard[]>,
    ): KanbanCard | undefined {
        const column = this.#columns[colIndex];
        if (!column || this.#collapsed.includes(column.id)) return undefined;
        return cardsByColumn.get(column.id)?.[rowIndex];
    }

    #toggleCollapsed(column: KanbanColumn): void {
        this.#collapsed = this.#collapsed.includes(column.id)
            ? this.#collapsed.filter((id) => id !== column.id)
            : [...this.#collapsed, column.id];
        this.#onCollapsedChange?.([...this.#collapsed]);
        this.dispatchEvent(
            new CustomEvent<string[]>("collapsechange", { detail: [...this.#collapsed], bubbles: true, composed: true }),
        );
        this.#render();
    }

    #announce(message: string | undefined): void {
        if (!message) return;
        this.#statusMessage = message;
        if (this.#statusEl) this.#statusEl.textContent = message;
    }

    // ---- Move (keyboard + pointer share this) ----

    /**
     * Choosing the card's own column is not a move: the menu just closes.
     * A real move closes the menu first, then tells the consumer — whose
     * `cards` update rebuilds the board — and then focuses the card wherever
     * it now is, so focus is never left on a node the rebuild removed.
     */
    #isRefused(card: KanbanCard, toColumn: KanbanColumn): boolean {
        if (toColumn.id === card.columnId) return false;
        if (this.#allowedColumns && !this.#allowedColumns(card).includes(toColumn.id)) return true;
        if (this.#canMove && !this.#canMove(card, toColumn)) return true;
        return (
            !!toColumn.strictLimit &&
            toColumn.wipLimit != null &&
            (this.#allByColumn().get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
        );
    }

    /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
    #moveTargets(card: KanbanCard): KanbanColumn[] {
        if (!this.#allowedColumns) return this.#columns;
        const allowed = this.#allowedColumns(card);
        return this.#columns.filter((c) => c.id === card.columnId || allowed.includes(c.id));
    }

    async #runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): Promise<void> {
        if (toIndex === undefined) this.#onMove?.(card.id, toColumn.id);
        else this.#onMove?.(card.id, toColumn.id, toIndex);
        this.dispatchEvent(
            new CustomEvent<KanbanBoardMoveDetail>("movecard", {
                detail:
                    toIndex === undefined
                        ? { cardId: card.id, toColumnId: toColumn.id }
                        : { cardId: card.id, toColumnId: toColumn.id, toIndex },
                bubbles: true,
                composed: true,
            }),
        );
        const result = this.#moveHandler
            ? toIndex === undefined
                ? this.#moveHandler(card.id, toColumn.id)
                : this.#moveHandler(card.id, toColumn.id, toIndex)
            : undefined;
        if (!result || typeof (result as Promise<unknown>).then !== "function") {
            this.#announce(this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title));
            this.#focusCard(card.id);
            return;
        }
        this.#optimistic = { ...this.#optimistic, [card.id]: toColumn.id };
        this.#statusMessage = this.#labels.movePending?.(this.#cardLabel(card), toColumn.title) ?? this.#statusMessage;
        this.#render();
        try {
            await result;
            this.#statusMessage = this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title) ?? this.#statusMessage;
        } catch (error) {
            this.#statusMessage = this.#labels.moveFailed?.(this.#cardLabel(card), toColumn.title, error) ?? this.#statusMessage;
            this.#onMoveError?.(card.id, toColumn.id, error);
            this.dispatchEvent(
                new CustomEvent("moveerror", {
                    detail: { cardId: card.id, toColumnId: toColumn.id, error },
                    bubbles: true,
                    composed: true,
                }),
            );
        } finally {
            const { [card.id]: _settled, ...rest } = this.#optimistic;
            this.#optimistic = rest;
            this.#render();
        }
    }

    #moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): void {
        if (this.readonly || card.locked || card.id in this.#optimistic) return;
        if (this.#isRefused(card, toColumn)) {
            this.#closeMoveMenu();
            this.#announce(this.#labels.moveBlocked?.(this.#cardLabel(card), toColumn.title));
            return;
        }
        if (toColumn.id === card.columnId) {
            this.#closeMoveMenu();
            return;
        }
        this.#closeMoveMenu(false);
        void this.#runMove(card, toColumn, toIndex);
    }

    /** The cell holding a card, found by its id wherever the card now is. */
    #cellForCard(cardId: string): HTMLTableCellElement | undefined {
        for (const cell of this.#cellEls.values()) {
            if (cell.dataset.cardId === cardId) return cell;
        }
        return undefined;
    }

    /**
     * Move the roving cursor to a card and focus it: its move button, or its
     * cell when there is no button.
     */
    #focusCard(cardId: string): void {
        const cell = this.#cellForCard(cardId);
        if (!cell) return;
        this.#setActiveCell(Number(cell.dataset.row), Number(cell.dataset.col));
        const target = this.#moveButtonEls.get(cardId) ?? cell;
        target.focus({ preventScroll: true });
    }

    #openMoveMenu(card: KanbanCard): void {
        if (this.readonly || card.locked) return;
        // Only one move menu at a time; closing any other first also
        // exercises the same per-card-button lookup as a normal close.
        if (this.#openCardId && this.#openCardId !== card.id) {
            this.#closeMoveMenu(false);
        }
        const cell = this.#cellForCard(card.id);
        if (!cell) return;
        // The button exists only when labels.moveButton names it; Enter/Space
        // on the cell opens the menu either way.
        const button = this.#moveButtonEls.get(card.id);
        const listId = `${this.#baseId}-move-list`;

        this.#openCardId = card.id;
        button?.setAttribute("aria-expanded", "true");
        button?.setAttribute("aria-controls", listId);

        const list = document.createElement("ul");
        list.id = listId;
        list.className = "kanban-board-move-list";
        list.setAttribute("role", "listbox");
        // Named by the card itself when no menu label is given.
        list.setAttribute("aria-label", this.#labels.moveMenuLabel ?? this.#cardLabel(card));
        list.setAttribute("tabindex", "-1");

        const optionEls: HTMLLIElement[] = [];
        this.#moveTargets(card).forEach((destination, i) => {
            const li = document.createElement("li");
            li.className = "kanban-board-move-option";
            li.id = `${this.#baseId}-move-option-${i}`;
            li.setAttribute("role", "option");
            li.setAttribute(
                "aria-selected",
                String(destination.id === card.columnId),
            );
            if (this.#isRefused(card, destination)) li.setAttribute("aria-disabled", "true");
            li.textContent = destination.title;
            li.addEventListener("click", () => this.#moveCard(card, destination));
            list.appendChild(li);
            optionEls.push(li);
        });

        cell.appendChild(list);
        this.#moveListEl = list;
        this.#moveOptionEls = optionEls;

        const syncActive = (index: number): void => {
            optionEls.forEach((el, i) => {
                if (i === index) el.setAttribute("data-active", "");
                else el.removeAttribute("data-active");
            });
            if (index >= 0 && optionEls[index]) {
                list.setAttribute("aria-activedescendant", optionEls[index].id);
            } else {
                list.removeAttribute("aria-activedescendant");
            }
        };

        this.#moveController = new ListboxController({
            root: list,
            clamp: true,
            getOptionLabel: (option) => option.textContent ?? "",
            onActiveIndexChange: syncActive,
            onActivate: (index) => {
                const destination = this.#moveTargets(card)[index];
                if (destination) this.#moveCard(card, destination);
            },
            onEscape: () => this.#closeMoveMenu(),
            onTabOut: () => {
                // Focus the button first, then close without refocusing —
                // matches theme-picker's own onTabOut: hiding the focused
                // list first would drop focus to <body>, and the browser
                // would then compute Tab's default target from the top of
                // the document instead of from here.
                (button ?? cell).focus({ preventScroll: true });
                this.#closeMoveMenu(false);
            },
        });

        const currentIndex = this.#columns.findIndex((c) => c.id === card.columnId);
        this.#moveController.setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
        syncActive(this.#moveController.activeIndex);
        list.focus({ preventScroll: true });
    }

    #closeMoveMenu(refocus = true): void {
        if (this.#openCardId === null) return;
        const cardId = this.#openCardId;
        this.#openCardId = null;
        this.#moveController?.destroy();
        this.#moveController = null;
        this.#moveListEl?.remove();
        this.#moveListEl = null;
        this.#moveOptionEls = [];

        // Looked up per-card via the Map, never a shared scalar — the
        // fix for the cross-catalog move-menu refocus bug (see the field
        // comment on #moveButtonEls and spec/index.md §10).
        const button = this.#moveButtonEls.get(cardId);
        button?.setAttribute("aria-expanded", "false");
        button?.removeAttribute("aria-controls");
        if (refocus) this.#focusCard(cardId);
    }

    // ---- Pointer drag-and-drop (supplementary, never the only path) ----

    #onCardDragStart(card: KanbanCard, event: DragEvent): void {
        if (card.locked) {
            event.preventDefault();
            return;
        }
        this.#draggingCardId = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
    }

    #onColumnDragOver(event: DragEvent, td: HTMLElement, rowIndex: number, colIndex: number): void {
        if (!this.#draggingCardId || this.readonly) return;
        event.preventDefault();
        this.#dropTarget = `${rowIndex}-${colIndex}`;
        this.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
        td.setAttribute("data-drop-target", "");
    }

    #onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
        event.preventDefault();
        const cardId = this.#draggingCardId ?? event.dataTransfer?.getData("text/plain");
        this.#draggingCardId = null;
        this.#dropTarget = null;
        this.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
        if (this.readonly) return;
        const card = this.#cards.find((c) => c.id === cardId);
        if (!card) return;
        const shown = this.#cardsByColumn().get(column.id) ?? [];
        const overCard = shown[rowIndex];
        if (card.columnId === column.id) {
            // Dropped on another card of its own column: reorder to that position.
            const from = shown.findIndex((c) => c.id === card.id);
            if (overCard && from >= 0 && from !== rowIndex) {
                this.#onReorder?.(card.id, rowIndex);
                this.dispatchEvent(
                    new CustomEvent<KanbanBoardReorderDetail>("reordercard", {
                        detail: { cardId: card.id, toIndex: rowIndex },
                        bubbles: true,
                        composed: true,
                    }),
                );
                this.#announce(this.#labels.reorderAnnouncement?.(this.#cardLabel(card), rowIndex + 1, shown.length));
            }
            return;
        }
        this.#moveCard(card, column, overCard ? rowIndex : undefined);
    }

    // ---- Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern) ----

    #setActiveCell(row: number, col: number): HTMLTableCellElement | undefined {
        const oldCell = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
        oldCell?.setAttribute("tabindex", "-1");

        this.#focusedRow = row;
        this.#focusedCol = col;

        const newCell = this.#cellEls.get(`${row}-${col}`);
        newCell?.setAttribute("tabindex", "0");
        return newCell;
    }

    #moveFocus(row: number, col: number, maxRows: number): void {
        const clampedCol = Math.min(Math.max(col, 0), Math.max(this.#columns.length - 1, 0));
        const clampedRow = Math.min(Math.max(row, 0), Math.max(maxRows - 1, 0));
        const cell = this.#setActiveCell(clampedRow, clampedCol);
        cell?.focus({ preventScroll: true });
    }

    /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
    #onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        this.#setActiveCell(Number(cell.dataset.row), Number(cell.dataset.col));
    }

    #reorderCard(delta: 1 | -1, cardsByColumn: Map<string, KanbanCard[]>): void {
        if (this.readonly) return;
        const card = this.#cardAt(this.#focusedCol, this.#focusedRow, cardsByColumn);
        if (!card || card.locked) return;
        const total = cardsByColumn.get(card.columnId)?.length ?? 0;
        const toIndex = this.#focusedRow + delta;
        if (toIndex < 0 || toIndex >= total) return;
        this.#onReorder?.(card.id, toIndex);
        this.dispatchEvent(
            new CustomEvent<KanbanBoardReorderDetail>("reordercard", {
                detail: { cardId: card.id, toIndex },
                bubbles: true,
                composed: true,
            }),
        );
        this.#announce(this.#labels.reorderAnnouncement?.(this.#cardLabel(card), toIndex + 1, total));
        this.#focusCard(card.id);
    }

    #onGridKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        // The open move menu owns its own keys; letting them bubble here moved the
        // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
        if (target.closest(".kanban-board-move-list")) return;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const cardsByColumn = this.#cardsByColumn();
        const maxRows = this.#maxRows(cardsByColumn);
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            event.preventDefault();
            const card = this.#cardAt(this.#focusedCol, this.#focusedRow, cardsByColumn);
            const destination = this.#columns[this.#focusedCol + (event.key === "ArrowLeft" ? -1 : 1)];
            if (card && destination) this.#moveCard(card, destination);
            return;
        }
        if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            event.preventDefault();
            this.#reorderCard(event.key === "ArrowUp" ? -1 : 1, cardsByColumn);
            return;
        }
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow - 1, this.#focusedCol, maxRows);
                break;
            case "ArrowDown":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow + 1, this.#focusedCol, maxRows);
                break;
            case "ArrowLeft":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow, this.#focusedCol - 1, maxRows);
                break;
            case "ArrowRight":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow, this.#focusedCol + 1, maxRows);
                break;
            case "Home":
                event.preventDefault();
                if (ctrlOrMeta) this.#moveFocus(0, 0, maxRows);
                else this.#moveFocus(0, this.#focusedCol, maxRows);
                break;
            case "End":
                event.preventDefault();
                if (ctrlOrMeta) this.#moveFocus(maxRows - 1, this.#columns.length - 1, maxRows);
                else this.#moveFocus(maxRows - 1, this.#focusedCol, maxRows);
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const card = this.#cardAt(this.#focusedCol, this.#focusedRow, cardsByColumn);
                if (card) this.#openMoveMenu(card);
                break;
            }
            default:
                break;
        }
    }

    // ---- Rendering ----

    #render(): void {
        if (!this.isConnected) return;

        // A structural rebuild cannot preserve the open move menu's DOM
        // (its list lives inside a <td> that is about to be replaced).
        this.#moveController?.destroy();
        this.#moveController = null;
        this.#openCardId = null;
        this.#moveListEl = null;
        this.#moveOptionEls = [];
        this.#cellEls = new Map();
        this.#moveButtonEls = new Map();

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `kanban-board ${extraClass}`.trim();
        if (this.readonly) root.setAttribute("data-readonly", "");

        const table = document.createElement("table");
        table.className = "kanban-table";
        table.setAttribute("role", "grid");
        table.setAttribute("aria-label", this.label);
        table.addEventListener("keydown", (event) =>
            this.#onGridKeydown(event as KeyboardEvent),
        );
        table.addEventListener("focusin", (event) => this.#onGridFocusin(event as FocusEvent));

        if (this.caption) {
            const caption = document.createElement("caption");
            caption.textContent = this.caption;
            table.appendChild(caption);
        }

        const cardsByColumn = this.#cardsByColumn();
        const allByColumn = this.#allByColumn();
        const maxRows = this.#maxRows(cardsByColumn);

        if (this.#labels.search) {
            const input = document.createElement("input");
            input.type = "search";
            input.className = "kanban-board-search";
            input.setAttribute("aria-label", this.#labels.search);
            input.value = this.search;
            input.addEventListener("input", () => {
                this.setAttribute("search", input.value);
                const again = this.querySelector<HTMLInputElement>(".kanban-board-search");
                again?.focus();
                again?.setSelectionRange(input.value.length, input.value.length);
            });
            root.appendChild(input);
        }

        // Clamp the roving cursor to whatever the new data still has.
        this.#focusedCol = Math.min(Math.max(this.#focusedCol, 0), Math.max(this.#columns.length - 1, 0));
        this.#focusedRow = Math.min(Math.max(this.#focusedRow, 0), Math.max(maxRows - 1, 0));

        const thead = document.createElement("thead");
        thead.className = "kanban-table-head";
        const headRow = document.createElement("tr");
        headRow.className = "kanban-table-row";

        for (const column of this.#columns) {
            const count = allByColumn.get(column.id)?.length ?? 0;
            const hidden = count - (cardsByColumn.get(column.id)?.length ?? 0);
            const overLimit = column.wipLimit != null && count > column.wipLimit;
            const th = document.createElement("th");
            th.className = "kanban-table-th";
            if (hidden > 0) th.setAttribute("data-hidden-count", String(hidden));
            if (column.flag) th.setAttribute("data-flag", column.flag);
            if (column.accent) th.setAttribute("data-accent", column.accent);
            if (overLimit) th.setAttribute("data-over-limit", "");
            const isCollapsed = this.#collapsed.includes(column.id);
            if (isCollapsed) th.setAttribute("data-collapsed", "");
            if (this.#labels.collapseColumn) {
                const toggle = document.createElement("button");
                toggle.type = "button";
                toggle.className = "kanban-board-collapse-button";
                toggle.setAttribute("aria-expanded", String(!isCollapsed));
                toggle.setAttribute("aria-label", this.#labels.collapseColumn(column, isCollapsed));
                toggle.textContent = isCollapsed ? "▸" : "▾";
                toggle.addEventListener("click", () => this.#toggleCollapsed(column));
                th.appendChild(toggle);
            }
            th.appendChild(document.createTextNode(column.title));
            if (column.flag) {
                const flag = document.createElement("span");
                flag.className = "kanban-board-column-flag";
                flag.textContent = column.flag;
                th.appendChild(flag);
            }
            if (this.renderColumnHeader) {
                th.appendChild(this.renderColumnHeader({ column, cards: allByColumn.get(column.id) ?? [], count }));
            }
            if (this.#labels.cardCount) {
                const span = document.createElement("span");
                span.className = "kanban-board-count";
                span.textContent = this.#labels.cardCount(count);
                th.appendChild(span);
            }
            if (overLimit && this.#labels.overLimit) {
                const span = document.createElement("span");
                span.className = "kanban-board-wip-warning";
                span.textContent = this.#labels.overLimit(count, column.wipLimit ?? 0);
                th.appendChild(span);
            }
            if (this.#labels.addCard && !this.readonly) {
                const add = document.createElement("button");
                add.type = "button";
                add.className = "kanban-board-add-button";
                add.setAttribute("aria-label", this.#labels.addCard(column));
                add.textContent = "+";
                add.addEventListener("click", () => {
                    this.#onAddCard?.(column.id);
                    this.dispatchEvent(
                        new CustomEvent<string>("addcard", { detail: column.id, bubbles: true, composed: true }),
                    );
                });
                th.appendChild(add);
            }
            headRow.appendChild(th);
        }
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.className = "kanban-table-body";

        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            const tr = document.createElement("tr");
            tr.className = "kanban-table-row";

            this.#columns.forEach((column, colIndex) => {
                const card = this.#cardAt(colIndex, rowIndex, cardsByColumn);
                const td = document.createElement("td");
                td.className = "kanban-table-td";
                td.setAttribute("data-row", String(rowIndex));
                td.setAttribute("data-col", String(colIndex));
                if (this.#collapsed.includes(column.id)) td.setAttribute("data-collapsed", "");
                const active = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
                td.setAttribute("tabindex", active ? "0" : "-1");
                if (card) {
                    td.setAttribute("aria-label", this.#cardLabel(card));
                    td.dataset.cardId = card.id;
                }
                if (column.accent) td.setAttribute("data-accent", column.accent);
                if (card?.locked) td.setAttribute("data-locked", "");
                if (card && card.id in this.#optimistic) {
                    td.setAttribute("data-pending", "");
                    td.setAttribute("aria-busy", "true");
                }
                if (card?.flag) {
                    td.setAttribute("data-flag", card.flag);
                    td.setAttribute("aria-describedby", `${this.#baseId}-flag-${card.id}`);
                }
                if (!card && rowIndex === 0 && this.#labels.emptyColumn && this.#isEmptyColumn(column, cardsByColumn)) {
                    td.setAttribute("data-empty", "");
                }
                td.addEventListener("dragover", (event) =>
                    this.#onColumnDragOver(event as DragEvent, td, rowIndex, colIndex),
                );
                td.addEventListener("dragleave", () => td.removeAttribute("data-drop-target"));
                td.addEventListener("drop", (event) =>
                    this.#onColumnDrop(column, rowIndex, event as DragEvent),
                );
                if (card && this.#cardAttrs) {
                    for (const [name, value] of Object.entries(this.#cardAttrs(card))) td.setAttribute(name, value);
                }

                if (card) {
                    const titleSpan = document.createElement("span");
                    titleSpan.className = "kanban-board-card-title";
                    if (!this.readonly && !card.locked && card.draggable !== false) titleSpan.setAttribute("draggable", "true");
                    if (this.renderCard) {
                        titleSpan.appendChild(
                            this.renderCard({ card, label: this.#cardLabel(card), column, pending: card.id in this.#optimistic }),
                        );
                    } else if (card.href) {
                        const link = document.createElement("a");
                        link.className = "kanban-board-card-link";
                        link.href = card.href;
                        link.textContent = this.#cardLabel(card);
                        titleSpan.appendChild(link);
                    } else {
                        titleSpan.textContent = this.#cardLabel(card);
                    }
                    titleSpan.addEventListener("dragstart", (event) =>
                        this.#onCardDragStart(card, event as DragEvent),
                    );
                    td.appendChild(titleSpan);
                    if (!this.renderCard) {
                        if (card.subtitle) {
                            const sub = document.createElement("span");
                            sub.className = "kanban-board-card-subtitle";
                            sub.textContent = card.subtitle;
                            td.appendChild(sub);
                        }
                        if (card.badges?.length) {
                            const badges = document.createElement("span");
                            badges.className = "kanban-board-card-badges";
                            for (const badge of card.badges) {
                                const b = document.createElement("span");
                                b.className = "kanban-board-card-badge";
                                b.textContent = badge;
                                badges.appendChild(b);
                            }
                            td.appendChild(badges);
                        }
                    }
                    if (card.flag) {
                        const flag = document.createElement("span");
                        flag.className = "kanban-board-card-flag";
                        flag.id = `${this.#baseId}-flag-${card.id}`;
                        flag.textContent = card.flag;
                        td.appendChild(flag);
                    }

                    // Gated on labels.moveButton: an unnamed button is worse than
                    // none, and Enter/Space on the cell opens the menu either way.
                    if (this.#labels.moveButton && !this.readonly && !card.locked) {
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "kanban-board-move-button";
                        button.setAttribute("aria-label", this.#labels.moveButton(card));
                        button.setAttribute("aria-haspopup", "listbox");
                        button.setAttribute("aria-expanded", "false");
                        button.setAttribute("tabindex", "-1");
                        button.appendChild(this.renderMoveButtonIcon());
                        button.addEventListener("click", () => {
                            if (this.#openCardId === card.id) this.#closeMoveMenu();
                            else this.#openMoveMenu(card);
                        });
                        td.appendChild(button);
                        this.#moveButtonEls.set(card.id, button);
                    }
                }

                if (!card && rowIndex === 0 && this.#labels.emptyColumn && this.#isEmptyColumn(column, cardsByColumn)) {
                    const empty = document.createElement("span");
                    empty.className = "kanban-board-empty";
                    empty.textContent = this.#labels.emptyColumn(column);
                    td.appendChild(empty);
                }
                tr.appendChild(td);
                this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
            });

            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        if (this.renderColumnFooter) {
            const tfoot = document.createElement("tfoot");
            tfoot.className = "kanban-table-foot";
            const frow = document.createElement("tr");
            frow.className = "kanban-table-row";
            for (const column of this.#columns) {
                const fcell = document.createElement("td");
                fcell.className = "kanban-table-td kanban-board-column-footer";
                if (column.accent) fcell.setAttribute("data-accent", column.accent);
                const cardsAll = allByColumn.get(column.id) ?? [];
                fcell.appendChild(this.renderColumnFooter({ column, cards: cardsAll, count: cardsAll.length }));
                frow.appendChild(fcell);
            }
            tfoot.appendChild(frow);
            table.appendChild(tfoot);
        }
        root.appendChild(table);

        const status = document.createElement("p");
        status.className = "kanban-board-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = this.#statusMessage;
        root.appendChild(status);

        this.replaceChildren(root);
        this.#rootEl = root;
        this.#statusEl = status;
    }
}
