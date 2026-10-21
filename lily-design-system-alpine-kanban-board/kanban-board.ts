/**
 * KanbanBoard for Alpine.js: the state and behaviour behind `snippet.html`. Headless: no CSS, no text, no icons; every string is
 * a `labels.*` value and a label's absence removes the control it names.
 *
 * Cards move between columns by pointer drag-and-drop or, independently, by a keyboard "Move to…" menu and Alt+ArrowLeft /
 * Alt+ArrowRight — never drag-only (WCAG 2.5.7). The board is a `role="grid"` with a roving tabindex. What it does not do yet:
 * typed card fields and inline editing, column reorder, selection, search, export (see spec/index.md).
 */
import { gridMove } from "./grid-navigation.js";
import { isRtl, logicalKey } from "./direction.js";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState } from "./typeahead.js";
import type { TypeaheadState } from "./typeahead.js";

export type KanbanColumn = { id: string; title: string; wipLimit?: number };
export type KanbanCard = { id: string; columnId: string; title: string };

export type KanbanLabels = {
    /** Accessible name of the grid. */
    grid?: string;
    caption?: string;
    cardCount?: (count: number) => string;
    overLimit?: (count: number, limit: number) => string;
    moveButton?: (cardTitle: string) => string;
    moveMenu?: string;
    moveAnnouncement?: (cardTitle: string, columnTitle: string) => string;
    moveBlocked?: (cardTitle: string, columnTitle: string) => string;
    emptyColumn?: string;
};

export type KanbanOptions = {
    columns: KanbanColumn[];
    cards: KanbanCard[];
    labels?: KanbanLabels;
    /** Refuse a move (return false). Called before every move, drag or keyboard. */
    canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
    /** A column at its `wipLimit` refuses further cards. Default false: the limit only warns (`data-over-limit`). */
    strictWip?: boolean;
    cardLabel?: (card: KanbanCard) => string;
};

type Position = { row: number; col: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const define = <T extends object>(object: T & ThisType<any>): T => object;

export function createKanbanBoard(options: KanbanOptions) {
    let typeahead: TypeaheadState = { prefix: "", at: 0 };
    return define({
        columns: options.columns,
        cards: options.cards,
        labels: options.labels ?? ({} as KanbanLabels),
        /** The cell the keyboard is on; row -1 is the column-header row. */
        active: { row: -1, col: 0 } as Position,
        /** The card whose move menu is open, and the option the cursor is on. */
        menu: null as null | { cardId: string; index: number },
        dragging: null as null | string,
        dropColumn: null as null | string,
        status: "",

        // ---- derived ----------------------------------------------------------------------------------------------
        cardsIn(columnId: string): KanbanCard[] {
            return this.cards.filter((c: KanbanCard) => c.columnId === columnId);
        },
        get rowCount(): number {
            return Math.max(1, ...this.columns.map((c: KanbanColumn) => this.cardsIn(c.id).length));
        },
        get rows(): number[] {
            return Array.from({ length: this.rowCount }, (_, i) => i);
        },
        cardAt(row: number, col: number): KanbanCard | undefined {
            return this.cardsIn(this.columns[col].id)[row];
        },
        /** The card in a cell as a list of zero or one, so a template can alias it with x-for. */
        cardsAt(row: number, col: number): KanbanCard[] {
            const card = this.cardAt(row, col);
            return card ? [card] : [];
        },
        title(card: KanbanCard): string {
            return options.cardLabel ? options.cardLabel(card) : card.title;
        },
        countLabel(column: KanbanColumn): string {
            return this.labels.cardCount?.(this.cardsIn(column.id).length) ?? "";
        },
        isOverLimit(column: KanbanColumn): boolean {
            return column.wipLimit !== undefined && this.cardsIn(column.id).length > column.wipLimit;
        },
        limitLabel(column: KanbanColumn): string {
            return column.wipLimit !== undefined && this.isOverLimit(column)
                ? (this.labels.overLimit?.(this.cardsIn(column.id).length, column.wipLimit) ?? "")
                : "";
        },

        // ---- moving -----------------------------------------------------------------------------------------------
        /** Whether `cardId` may go to `columnId`: a different column, `canMove`, and room under a strict WIP limit. */
        accepts(cardId: string, columnId: string): boolean {
            const card = this.cards.find((c: KanbanCard) => c.id === cardId);
            const column = this.columns.find((c: KanbanColumn) => c.id === columnId);
            if (!card || !column || card.columnId === columnId) return false;
            if (options.canMove && !options.canMove(card, column)) return false;
            if (options.strictWip && column.wipLimit !== undefined && this.cardsIn(columnId).length >= column.wipLimit) return false;
            return true;
        },
        move(cardId: string, toColumnId: string): boolean {
            const card = this.cards.find((c: KanbanCard) => c.id === cardId);
            const column = this.columns.find((c: KanbanColumn) => c.id === toColumnId);
            if (!card || !column) return false;
            if (!this.accepts(cardId, toColumnId)) {
                if (card.columnId !== toColumnId) this.status = this.labels.moveBlocked?.(this.title(card), column.title) ?? "";
                return false;
            }
            // The card joins the end of its new column (an unordered store: order is the cards array's).
            this.cards = [...this.cards.filter((c: KanbanCard) => c.id !== cardId), { ...card, columnId: toColumnId }];
            this.status = this.labels.moveAnnouncement?.(this.title(card), column.title) ?? "";
            this.$dispatch?.("lily:move", { cardId, toColumnId });
            // The cursor follows the card.
            const col = this.columns.indexOf(column);
            this.active = { row: this.cardsIn(toColumnId).findIndex((c: KanbanCard) => c.id === cardId), col };
            this.$nextTick?.(() => this.focusCell());
            return true;
        },

        // ---- move menu --------------------------------------------------------------------------------------------
        /** The destinations the menu offers: every other column. */
        destinations(cardId: string): KanbanColumn[] {
            const card = this.cards.find((c: KanbanCard) => c.id === cardId);
            return this.columns.filter((c: KanbanColumn) => c.id !== card?.columnId);
        },
        openMenu(cardId: string): void {
            this.menu = { cardId, index: 0 };
        },
        closeMenu(returnFocus = true): void {
            this.menu = null;
            if (returnFocus) this.focusCell();
        },
        isMenuOpen(cardId: string): boolean {
            return this.menu?.cardId === cardId;
        },
        optionId(cardId: string, index: number): string {
            return `kanban-move-${cardId}-${index}`;
        },
        menuKey(event: KeyboardEvent): void {
            const menu = this.menu as { cardId: string; index: number } | null;
            if (!menu) return;
            const options_ = this.destinations(menu.cardId);
            const stop = () => { event.preventDefault(); event.stopPropagation(); };
            if (event.key === "ArrowDown") { stop(); menu.index = Math.min(menu.index + 1, options_.length - 1); }
            else if (event.key === "ArrowUp") { stop(); menu.index = Math.max(menu.index - 1, 0); }
            else if (event.key === "Home") { stop(); menu.index = 0; }
            else if (event.key === "End") { stop(); menu.index = options_.length - 1; }
            else if (event.key === "Enter" || event.key === " ") {
                stop();
                const target = options_[menu.index];
                this.closeMenu(false);
                if (target) this.move(menu.cardId, target.id);
            } else if (event.key === "Escape") { stop(); this.closeMenu(); }
            else if (event.key === "Tab") this.closeMenu(false);
        },

        // ---- drag and drop ----------------------------------------------------------------------------------------
        dragStart(cardId: string, event: DragEvent): void {
            this.dragging = cardId;
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", cardId);
            }
        },
        dragOver(columnId: string, event: DragEvent): void {
            if (!this.dragging) return;
            if (this.accepts(this.dragging, columnId)) {
                event.preventDefault();
                if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
                this.dropColumn = columnId;
            } else if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "none";
                this.dropColumn = null;
            }
        },
        drop(columnId: string, event: DragEvent): void {
            event.preventDefault();
            const id = this.dragging;
            this.dragEnd();
            if (id) this.move(id, columnId);
        },
        dragEnd(): void {
            this.dragging = null;
            this.dropColumn = null;
        },
        /** `data-drop-target` while a dragged card would be accepted by the column; `data-drop-blocked` when it would not. */
        dropState(columnId: string): "target" | "blocked" | null {
            if (!this.dragging) return null;
            return this.accepts(this.dragging, columnId) ? (this.dropColumn === columnId ? "target" : null) : this.cardsIn(columnId).some((c: KanbanCard) => c.id === this.dragging) ? null : "blocked";
        },

        // ---- keyboard ---------------------------------------------------------------------------------------------
        tabindex(row: number, col: number): string {
            return this.active.row === row && this.active.col === col ? "0" : "-1";
        },
        onFocusCell(row: number, col: number): void {
            this.active = { row, col };
        },
        focusCell(): void {
            // $root is gone if the board was removed before a deferred focus ran.
            const cell = this.$root?.querySelector(`[data-row="${this.active.row}"][data-col="${this.active.col}"]`) as HTMLElement | null;
            cell?.focus();
        },
        onKeydown(event: KeyboardEvent): void {
            if (this.menu) return this.menuKey(event);
            const at = this.active as Position;
            const rtl = isRtl(this.$root);
            const card = at.row >= 0 ? this.cardAt(at.row, at.col) : undefined;
            if (event.altKey && card && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                event.preventDefault();
                const step = logicalKey(event.key, rtl) === "ArrowRight" ? 1 : -1;
                const target = this.columns[at.col + step];
                if (target) this.move(card.id, target.id);
                return;
            }
            if (!event.altKey) {
                const to = gridMove(event, at, { firstRow: -1, lastRow: this.rowCount - 1, lastCol: this.columns.length - 1, pageStep: 10, homeEnd: "column", rtl });
                if (to) {
                    event.preventDefault();
                    this.active = to;
                    this.focusCell();
                    return;
                }
            }
            if ((event.key === "Enter" || event.key === " ") && card && this.labels.moveButton) {
                event.preventDefault();
                this.openMenu(card.id);
                return;
            }
            if (at.row >= 0 && isTypeaheadKey(event)) {
                typeahead = nextTypeaheadState(typeahead, event.key, Date.now());
                const column = this.cardsIn(this.columns[at.col].id);
                const found = findTypeaheadMatch(column.map((c: KanbanCard) => this.title(c)), at.row, typeahead.prefix);
                if (found >= 0) {
                    event.preventDefault();
                    this.active = { row: found, col: at.col };
                    this.focusCell();
                }
            }
        },
    });
}

/** The Alpine plugin: registers `Alpine.data("lilyKanbanBoard", options => …)`. */
export default function lilyKanbanBoard(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyKanbanBoard", ((options: KanbanOptions) => createKanbanBoard(options)) as (...args: never[]) => object);
}
