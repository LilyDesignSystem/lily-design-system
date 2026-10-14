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
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type KanbanBoardProps = {
    label: string;
    caption?: string;
    columns: KanbanColumn[];
    cards: KanbanCard[];
    cardLabel?: (card: KanbanCard) => string;
    onMove?: (cardId: string, toColumnId: string) => void;
    onReorder?: (cardId: string, toIndex: number) => void;
    canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
    readonly?: boolean;
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
        return ["label", "caption", "class", "readonly"];
    }

    // Backing storage for property-only members (arrays of objects and
    // functions can't be attributes — the same rule `date-time-picker`'s
    // §4.3 documents for its own `labels`/`shortcuts`/callbacks).
    #columns: KanbanColumn[] = [];
    #cards: KanbanCard[] = [];
    #cardLabel: (card: KanbanCard) => string = defaultCardLabel;
    #onMove: ((cardId: string, toColumnId: string) => void) | undefined;
    #onReorder: ((cardId: string, toIndex: number) => void) | undefined;
    #canMove: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined;
    #labels: KanbanLabels = {};

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

    /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
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

    #cardsByColumn(): Map<string, KanbanCard[]> {
        const map = new Map<string, KanbanCard[]>();
        for (const column of this.#columns) map.set(column.id, []);
        for (const card of this.#cards) {
            map.get(card.columnId)?.push(card);
        }
        return map;
    }

    #maxRows(cardsByColumn: Map<string, KanbanCard[]>): number {
        let max = 0;
        for (const column of this.#columns) {
            max = Math.max(max, cardsByColumn.get(column.id)?.length ?? 0);
        }
        return max;
    }

    #cardAt(
        colIndex: number,
        rowIndex: number,
        cardsByColumn: Map<string, KanbanCard[]>,
    ): KanbanCard | undefined {
        const column = this.#columns[colIndex];
        if (!column) return undefined;
        return cardsByColumn.get(column.id)?.[rowIndex];
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
        return toColumn.id !== card.columnId && !!this.#canMove && !this.#canMove(card, toColumn);
    }

    #moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
        if (this.readonly) return;
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
        this.#onMove?.(card.id, toColumn.id);
        this.dispatchEvent(
            new CustomEvent<KanbanBoardMoveDetail>("movecard", {
                detail: { cardId: card.id, toColumnId: toColumn.id },
                bubbles: true,
                composed: true,
            }),
        );
        this.#announce(
            this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title),
        );
        this.#focusCard(card.id);
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
        if (this.readonly) return;
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
        this.#columns.forEach((destination, i) => {
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
                const destination = this.#columns[index];
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
        this.#draggingCardId = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
    }

    #onColumnDragOver(event: DragEvent): void {
        if (this.#draggingCardId) event.preventDefault();
    }

    #onColumnDrop(column: KanbanColumn, event: DragEvent): void {
        event.preventDefault();
        const cardId = this.#draggingCardId ?? event.dataTransfer?.getData("text/plain");
        this.#draggingCardId = null;
        const card = this.#cards.find((c) => c.id === cardId);
        // Dropping a card back on its own column is not a move.
        if (card && card.columnId !== column.id) this.#moveCard(card, column);
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
        if (!card) return;
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
        const maxRows = this.#maxRows(cardsByColumn);

        // Clamp the roving cursor to whatever the new data still has.
        this.#focusedCol = Math.min(Math.max(this.#focusedCol, 0), Math.max(this.#columns.length - 1, 0));
        this.#focusedRow = Math.min(Math.max(this.#focusedRow, 0), Math.max(maxRows - 1, 0));

        const thead = document.createElement("thead");
        thead.className = "kanban-table-head";
        const headRow = document.createElement("tr");
        headRow.className = "kanban-table-row";

        for (const column of this.#columns) {
            const count = cardsByColumn.get(column.id)?.length ?? 0;
            const overLimit = column.wipLimit != null && count > column.wipLimit;
            const th = document.createElement("th");
            th.className = "kanban-table-th";
            if (overLimit) th.setAttribute("data-over-limit", "");
            th.appendChild(document.createTextNode(column.title));
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
                const active = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
                td.setAttribute("tabindex", active ? "0" : "-1");
                if (card) {
                    td.setAttribute("aria-label", this.#cardLabel(card));
                    td.dataset.cardId = card.id;
                }
                td.addEventListener("dragover", (event) =>
                    this.#onColumnDragOver(event as DragEvent),
                );
                td.addEventListener("drop", (event) =>
                    this.#onColumnDrop(column, event as DragEvent),
                );

                if (card) {
                    const titleSpan = document.createElement("span");
                    titleSpan.className = "kanban-board-card-title";
                    if (!this.readonly) titleSpan.setAttribute("draggable", "true");
                    titleSpan.textContent = this.#cardLabel(card);
                    titleSpan.addEventListener("dragstart", (event) =>
                        this.#onCardDragStart(card, event as DragEvent),
                    );
                    td.appendChild(titleSpan);

                    // Gated on labels.moveButton: an unnamed button is worse than
                    // none, and Enter/Space on the cell opens the menu either way.
                    if (this.#labels.moveButton && !this.readonly) {
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

                tr.appendChild(td);
                this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
            });

            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
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
