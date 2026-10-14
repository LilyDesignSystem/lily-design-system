/**
 * `<lily-kanban-board>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A headless kanban board: cards move between columns by pointer
 * drag-and-drop or, independently, by a keyboard-accessible per-card
 * "Move to…" menu — never drag-only (WCAG 2.5.7). WAI-ARIA APG Grid
 * roving-tabindex keyboard navigation.
 *
 * Direct port of `@lilydesignsystem/svelte-kanban-board`. Composes
 * `@lilydesignsystem/web-components-headless`'s `<lily-kanban-table>`
 * (unmodified — the consumer supplies `<thead>`/`<tbody>`/`<tr>`/`<th>`/
 * `<td>` as plain light-DOM children, this catalog has no
 * `KanbanTableTD`-style sub-element family) and `<lily-icon-button>` for
 * the per-card move-menu trigger. The move menu itself is hand-rolled
 * markup (a `<ul role="listbox">`), NOT a composed `<lily-listbox>| —
 * see spec/index.md §3 for why: `<lily-listbox>` is an autonomous
 * custom element with a fixed `<ul>` shape of its own; nesting one
 * inside a grid cell would add an extra wrapper element with no
 * matching native-tag benefit the way Svelte's `<svelte:element>`
 * composition gets, and `theme-picker`'s own dropdown already
 * establishes "hand-roll the popup `<ul>`" as this catalog's answer to
 * the same tradeoff.
 *
 * Imported here (not only from `index.ts`) so `lily-icon-button` and
 * `lily-kanban-table` are registered regardless of which module a
 * consumer (or this package's own tests) imports first.
 */

import "@lilydesignsystem/web-components-headless";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

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
 * names — no baked-in English fallback, matching every other helper's
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
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type KanbanBoardProps = {
  /** Accessible name for the board, passed through to `<lily-kanban-table>`. */
  label: string;
  /** Optional visible caption. */
  caption?: string;
  /** Property-only — column definitions. */
  columns: KanbanColumn[];
  /** Property-only — card data. */
  cards: KanbanCard[];
  /** Property-only. Resolves a card to its display label. Defaults to `card.title`. */
  cardLabel?: (card: KanbanCard) => string;
  /** Property-only. Called after a card moves, by pointer or the move menu. */
  onMove?: (cardId: string, toColumnId: string) => void;
  /** Property-only. Called when Alt+ArrowUp/Down moves a card within its column; `toIndex` is 0-based. */
  onReorder?: (cardId: string, toIndex: number) => void;
  /** Property-only. Veto a move; refused columns show `aria-disabled` in the move menu. */
  canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
  /** Attribute `readonly`. Disables the move menu, drag and reorder; navigation still works. */
  readonly?: boolean;
  /** Property-only. Ids of collapsed columns; a collapsed column keeps its header and count but shows no cards. */
  collapsedColumns?: string[];
  /** Property-only. Called with the new collapsed ids when a column's toggle is pressed. */
  onCollapsedChange?: (collapsedColumns: string[]) => void;
  /** Property-only. Called with the column id when its add-card button is pressed. */
  onAddCard?: (columnId: string) => void;
  /** Property-only. See KanbanLabels — presence gates each control. */
  labels?: KanbanLabels;
  class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextKanbanBoardId(): string {
  uid += 1;
  return `kanban-board-${uid}`;
}

const HANDLED_ATTRS = new Set(["label", "caption", "class", "readonly"]);

/**
 * Copy every attribute the consumer set on the HOST element (this
 * custom element) onto `target`, except the ones this component
 * handles itself. Mirrors the headless catalog's own
 * `passThroughAttributes` (see `dom-utils.ts`), reimplemented locally
 * so this package does not reach into headless's unexported internals
 * — the same self-contained-helpers convention `theme-picker.ts`
 * follows for its own module-local `parseCsv`/`parseJsonObject`.
 */
function passThroughAttributes(host: Element, target: Element): void {
  for (const attr of Array.from(host.attributes)) {
    if (attr.name === "class" || HANDLED_ATTRS.has(attr.name)) continue;
    target.setAttribute(attr.name, attr.value);
  }
}

/**
 * Defensive nested-custom-element upgrade sweep.
 *
 * This component builds a THREE-level-deep nested custom-element tree
 * fully detached (`<lily-kanban-board>` root div → `<lily-kanban-table>`
 * → `<td>` → `<lily-icon-button>`) before attaching it to the document in
 * one `appendChild`. Per the HTML spec, inserting a connected subtree
 * upgrades every custom element within it, in tree order — but
 * `picker-bar.ts`'s own comment documents observing this NOT happen
 * reliably in jsdom for even one level of nesting, which is why that
 * component connects `root` first and appends each picker into it
 * one at a time instead of building the whole subtree upfront.
 *
 * Doing that node-by-node dance for a whole grid (potentially dozens
 * of cells) is impractical, so instead this sweep runs once, right
 * after the whole tree is attached: it calls `connectedCallback()`
 * directly (a plain public method) on every nested `<lily-kanban-table>`
 * / `<lily-icon-button>` that has not yet built its expected inner
 * element. Both of those components' own `connectedCallback`s guard
 * themselves against re-entry (`if (this.querySelector(...)) return;`),
 * so calling one that already ran is a safe no-op — this sweep is
 * correct whether or not the engine already upgraded some or all of
 * these elements on its own.
 */
function upgradeNestedCustomElements(root: ParentNode): void {
  root.querySelectorAll("lily-kanban-table, lily-icon-button").forEach((el) => {
    (el as HTMLElement & { connectedCallback?: () => void }).connectedCallback?.();
  });
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// ---------------------------------------------------------------------
// Custom element
// ---------------------------------------------------------------------

/** Custom-element class implementing `<lily-kanban-board>`. */
export class KanbanBoard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["label", "caption", "class", "readonly"];
  }

  // ---- Backing storage for property-only members ----
  #columns: KanbanColumn[] = [];
  #cards: KanbanCard[] = [];
  #cardLabel: (card: KanbanCard) => string = (card) => card.title;
  #onMove?: (cardId: string, toColumnId: string) => void;
  #onReorder?: (cardId: string, toIndex: number) => void;
  #canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
  #labels: KanbanLabels = {};
  #collapsed: string[] = [];
  #onCollapsedChange?: (collapsedColumns: string[]) => void;
  #onAddCard?: (columnId: string) => void;

  // ---- Internal state ----
  #statusMessage = "";
  #focusedRow = 0;
  #focusedCol = 0;
  #openCardId: string | null = null;
  #moveActiveIndex = -1;
  #draggingCardId: string | null = null;

  readonly #baseId = nextKanbanBoardId();

  // ---- Rendered-DOM references. Null/empty until #render() has run. ----
  #rootEl: HTMLDivElement | null = null;
  #tableEl: HTMLElement | null = null;
  #statusEl: HTMLParagraphElement | null = null;
  #cellEls = new Map<string, HTMLTableCellElement>(); // "row-col" -> td
  #moveButtonHosts = new Map<string, HTMLElement>(); // cardId -> <lily-icon-button>
  #moveListEls = new Map<string, HTMLUListElement>(); // cardId -> <ul>
  #moveOptionEls = new Map<string, HTMLLIElement[]>(); // cardId -> li[]

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
    this.#cardLabel = fn ?? ((card) => card.title);
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

  get onAddCard(): ((columnId: string) => void) | undefined {
    return this.#onAddCard;
  }
  set onAddCard(fn: ((columnId: string) => void) | undefined) {
    this.#onAddCard = fn;
  }

  get canMove(): ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined {
    return this.#canMove;
  }
  set canMove(fn: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined) {
    this.#canMove = fn;
    this.#render();
  }

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
    this.#labels = v ?? {};
    this.#render();
  }

  // ---- Lifecycle ----

  connectedCallback(): void {
    this.#render();
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "label" || name === "caption" || name === "class" || name === "readonly") {
      this.#render();
    }
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
    return this.#columns.reduce(
      (max, column) =>
        Math.max(max, this.#collapsed.includes(column.id) ? 0 : (cardsByColumn.get(column.id)?.length ?? 0)),
      0,
    );
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

  #moveListId(cardId: string): string {
    return `${this.#baseId}-move-list-${cardId}`;
  }

  #moveOptionId(cardId: string, i: number): string {
    return `${this.#baseId}-move-option-${cardId}-${i}`;
  }

  #announce(message: string | undefined): void {
    if (!message) return;
    this.#statusMessage = message;
    if (this.#statusEl) this.#statusEl.textContent = message;
  }

  // ---------------------------------------------------------------
  // Move menu (keyboard + pointer share this)
  // ---------------------------------------------------------------

  /**
   * Choosing the card's own column is not a move: the menu just closes.
   * A real move closes the menu first, then tells the consumer — whose
   * `cards` update rebuilds the board — and then focuses the card wherever
   * it now is, so focus is never left on a node the rebuild removed.
   */
  #isRefused(card: KanbanCard, toColumn: KanbanColumn): boolean {
    if (toColumn.id === card.columnId) return false;
    if (this.#canMove && !this.#canMove(card, toColumn)) return true;
    return (
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      (this.#cardsByColumn().get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
    );
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
    this.#announce(this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title));
    this.#focusCard(card.id);
  }

  /** The cell holding a card, found by its id wherever the card now is. */
  #cellForCard(cardId: string): HTMLTableCellElement | undefined {
    for (const cell of this.#cellEls.values()) {
      if (cell.dataset.cardId === cardId) return cell;
    }
    return undefined;
  }

  /** A card's own move button, or its cell when there is no button. */
  #cardFocusTarget(cardId: string): HTMLElement | undefined {
    return (
      this.#moveButtonHosts.get(cardId)?.querySelector<HTMLButtonElement>("button") ??
      this.#cellForCard(cardId)
    );
  }

  /** Move the roving cursor to a card and focus it. */
  #focusCard(cardId: string): void {
    const cell = this.#cellForCard(cardId);
    if (!cell) return;
    const previousRow = this.#focusedRow;
    const previousCol = this.#focusedCol;
    this.#focusedRow = Number(cell.dataset.row);
    this.#focusedCol = Number(cell.dataset.col);
    this.#syncFocusState(previousRow, previousCol, false);
    this.#cardFocusTarget(cardId)?.focus({ preventScroll: true });
  }

  #openMoveMenu(card: KanbanCard): void {
    if (this.readonly) return;
    this.#openCardId = card.id;
    const currentIndex = this.#columns.findIndex((c) => c.id === card.columnId);
    this.#moveActiveIndex = currentIndex >= 0 ? currentIndex : 0;
    this.#syncMoveMenu(card.id);
    this.#moveListEls.get(card.id)?.focus({ preventScroll: true });
  }

  /** Close the open move menu, if any. Returns focus to ITS OWN card's move button — never a shared/last-mounted one (see spec/index.md §10). */
  #closeMoveMenu(refocus = true): void {
    const cardId = this.#openCardId;
    if (cardId === null) return;
    this.#openCardId = null;
    this.#moveActiveIndex = -1;
    this.#syncMoveMenu(cardId);
    if (refocus) this.#focusCard(cardId);
  }

  #moveActiveIndexBy(cardId: string, delta: number): void {
    if (this.#columns.length === 0) return;
    this.#moveActiveIndex = clamp(this.#moveActiveIndex + delta, 0, this.#columns.length - 1);
    this.#syncMoveMenu(cardId);
  }

  #setMoveActiveIndex(cardId: string, index: number): void {
    this.#moveActiveIndex = index;
    this.#syncMoveMenu(cardId);
  }

  /** Update one card's move-button/listbox state attributes in place — no structural rebuild, so open/close/navigate never disturbs the rest of the grid or steals focus. */
  #syncMoveMenu(cardId: string): void {
    const isOpen = this.#openCardId === cardId;
    // <lily-icon-button> passes attributes through to its real inner
    // <button> only once, in its own connectedCallback — it has no
    // attributeChangedCallback, so setting aria-expanded on the HOST
    // after connect is a silent no-op. The real button (already
    // resolved at connect time) must be updated directly.
    const button = this.#moveButtonHosts.get(cardId)?.querySelector<HTMLButtonElement>("button");
    button?.setAttribute("aria-expanded", String(isOpen));

    const list = this.#moveListEls.get(cardId);
    if (!list) return;
    if (isOpen) list.removeAttribute("hidden");
    else list.setAttribute("hidden", "");

    if (isOpen && this.#moveActiveIndex >= 0) {
      list.setAttribute("aria-activedescendant", this.#moveOptionId(cardId, this.#moveActiveIndex));
    } else {
      list.removeAttribute("aria-activedescendant");
    }

    const card = this.#cards.find((c) => c.id === cardId);
    const options = this.#moveOptionEls.get(cardId) ?? [];
    options.forEach((option, i) => {
      const destination = this.#columns[i];
      option.setAttribute("aria-selected", String(!!card && destination?.id === card.columnId));
      if (isOpen && i === this.#moveActiveIndex) option.setAttribute("data-active", "");
      else option.removeAttribute("data-active");
    });
  }

  #onMoveListKeydown = (event: KeyboardEvent, card: KanbanCard): void => {
    // The listbox lives inside the currently-focused grid cell, so a
    // keydown here also bubbles up to the grid's own onGridKeydown
    // (attached higher, on <lily-kanban-table>) unless stopped —
    // otherwise ArrowDown/Up would BOTH move the listbox's active
    // option AND move the roving-tabindex grid cursor at once.
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        this.#moveActiveIndexBy(card.id, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        this.#moveActiveIndexBy(card.id, -1);
        break;
      case "Home":
        event.preventDefault();
        event.stopPropagation();
        this.#setMoveActiveIndex(card.id, 0);
        break;
      case "End":
        event.preventDefault();
        event.stopPropagation();
        this.#setMoveActiveIndex(card.id, this.#columns.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        event.stopPropagation();
        if (this.#moveActiveIndex >= 0) this.#moveCard(card, this.#columns[this.#moveActiveIndex]);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        this.#closeMoveMenu();
        break;
      case "Tab":
        event.stopPropagation();
        // Mirrors theme-picker's own Tab handling: focus moves to the
        // button FIRST (without cancelling the key), so the browser's
        // default Tab proceeds from the picker's position rather than
        // from wherever hiding the focused list would drop focus to.
        this.#cardFocusTarget(card.id)?.focus({ preventScroll: true });
        this.#closeMoveMenu(false);
        break;
      default:
        break;
    }
  };

  // ---------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only path)
  // ---------------------------------------------------------------

  #onCardDragStart = (card: KanbanCard, event: DragEvent): void => {
    this.#draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
  };

  #onColumnDragOver = (event: DragEvent): void => {
    if (this.#draggingCardId) event.preventDefault();
  };

  #onColumnDrop = (column: KanbanColumn, event: DragEvent): void => {
    event.preventDefault();
    const cardId = this.#draggingCardId ?? event.dataTransfer?.getData("text/plain");
    this.#draggingCardId = null;
    const card = this.#cards.find((c) => c.id === cardId);
    // Dropping a card back on its own column is not a move.
    if (card && card.columnId !== column.id) this.#moveCard(card, column);
  };

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  #syncFocusState(previousRow: number, previousCol: number, focusNewCell: boolean): void {
    const previous = this.#cellEls.get(`${previousRow}-${previousCol}`);
    if (previous) {
      previous.setAttribute("tabindex", "-1");
    }
    const next = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
    if (next) {
      next.setAttribute("tabindex", "0");
      if (focusNewCell) next.focus({ preventScroll: true });
    }
  }

  #moveFocus(row: number, col: number): void {
    const cardsByColumn = this.#cardsByColumn();
    const maxRows = this.#maxRows(cardsByColumn);
    const previousRow = this.#focusedRow;
    const previousCol = this.#focusedCol;
    this.#focusedCol = clamp(col, 0, this.#columns.length - 1);
    this.#focusedRow = clamp(row, 0, maxRows - 1);
    if (this.#focusedRow === previousRow && this.#focusedCol === previousCol) return;
    this.#syncFocusState(previousRow, previousCol, true);
  }

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  #onGridFocusin = (event: FocusEvent): void => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const previousRow = this.#focusedRow;
    const previousCol = this.#focusedCol;
    this.#focusedRow = Number(cell.dataset.row);
    this.#focusedCol = Number(cell.dataset.col);
    this.#syncFocusState(previousRow, previousCol, false);
  };

  #reorderCard(delta: 1 | -1, cardsByColumn: Map<string, KanbanCard[]>): void {
    if (this.readonly) return;
    const card = this.#cardAt(this.#focusedCol, this.#focusedRow, cardsByColumn);
    if (!card) return;
    const total = cardsByColumn.get(card.columnId)?.length ?? 0;
    const toIndex = this.#focusedRow + delta;
    if (toIndex < 0 || toIndex >= total) return;
    this.#onReorder?.(card.id, toIndex);
    this.#announce(this.#labels.reorderAnnouncement?.(this.#cardLabel(card), toIndex + 1, total));
    this.#focusCard(card.id);
  }

  #onGridKeydown = (event: KeyboardEvent): void => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const cardsByColumn = this.#cardsByColumn();
    const maxRows = this.#maxRows(cardsByColumn);
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      this.#reorderCard(event.key === "ArrowUp" ? -1 : 1, cardsByColumn);
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.#moveFocus(this.#focusedRow - 1, this.#focusedCol);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.#moveFocus(this.#focusedRow + 1, this.#focusedCol);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.#moveFocus(this.#focusedRow, this.#focusedCol - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.#moveFocus(this.#focusedRow, this.#focusedCol + 1);
        break;
      case "Home":
        event.preventDefault();
        if (ctrlOrMeta) this.#moveFocus(0, 0);
        else this.#moveFocus(0, this.#focusedCol);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.#moveFocus(maxRows - 1, this.#columns.length - 1);
        else this.#moveFocus(maxRows - 1, this.#focusedCol);
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
  };

  // ---------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------

  #render(): void {
    if (!this.isConnected) return;

    // A structural rebuild cannot preserve focus inside an open move
    // menu; it closes first (mirrors theme-picker's own `#render()`).
    this.#openCardId = null;
    this.#moveActiveIndex = -1;

    const cardsByColumn = this.#cardsByColumn();
    const maxRows = this.#maxRows(cardsByColumn);
    this.#focusedCol = clamp(this.#focusedCol, 0, this.#columns.length - 1);
    this.#focusedRow = clamp(this.#focusedRow, 0, Math.max(maxRows - 1, 0));

    this.#cellEls = new Map();
    this.#moveButtonHosts = new Map();
    this.#moveListEls = new Map();
    this.#moveOptionEls = new Map();

    const extraClass = this.getAttribute("class") ?? "";
    const root = document.createElement("div");
    root.className = `kanban-board ${extraClass}`.trim();
    passThroughAttributes(this, root);
    if (this.readonly) root.setAttribute("data-readonly", "");

    const table = document.createElement("lily-kanban-table");
    table.setAttribute("label", this.label);
    // See architecture note: <lily-kanban-table> defaults its inner
    // <table> to role="region" (a documented, deliberate quirk kept
    // as-is); setting role="grid" here overrides it via that
    // component's own passThroughAttributes mechanism.
    table.setAttribute("role", "grid");
    if (this.caption) {
      const captionEl = document.createElement("caption");
      captionEl.textContent = this.caption;
      table.appendChild(captionEl);
    }
    table.addEventListener("keydown", this.#onGridKeydown);
    table.addEventListener("focusin", this.#onGridFocusin);

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    this.#columns.forEach((column) => {
      const count = cardsByColumn.get(column.id)?.length ?? 0;
      const overLimit = column.wipLimit != null && count > column.wipLimit;
      const th = document.createElement("th");
      th.className = "kanban-board-th";
      th.setAttribute("scope", "col");
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
      if (this.#labels.cardCount) {
        const span = document.createElement("span");
        span.className = "kanban-board-count";
        span.textContent = this.#labels.cardCount(count);
        th.appendChild(span);
      }
      if (overLimit && this.#labels.overLimit) {
        const warn = document.createElement("span");
        warn.className = "kanban-board-wip-warning";
        warn.textContent = this.#labels.overLimit(count, column.wipLimit ?? 0);
        th.appendChild(warn);
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
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      const tr = document.createElement("tr");
      this.#columns.forEach((column, colIndex) => {
        const card = this.#cardAt(colIndex, rowIndex, cardsByColumn);
        const td = document.createElement("td");
        td.className = "kanban-board-td";
        td.setAttribute("role", "gridcell");
        td.setAttribute("data-row", String(rowIndex));
        td.setAttribute("data-col", String(colIndex));
        if (this.#collapsed.includes(column.id)) td.setAttribute("data-collapsed", "");
        const isActive = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
        td.setAttribute("tabindex", isActive ? "0" : "-1");
        td.addEventListener("dragover", this.#onColumnDragOver);
        td.addEventListener("drop", (e) => this.#onColumnDrop(column, e as DragEvent));

        if (card) {
          td.dataset.cardId = card.id;
          const cardSpan = document.createElement("span");
          cardSpan.className = "kanban-board-card-title";
          if (!this.readonly) cardSpan.setAttribute("draggable", "true");
          cardSpan.textContent = this.#cardLabel(card);
          cardSpan.addEventListener("dragstart", (e) => this.#onCardDragStart(card, e as DragEvent));
          td.appendChild(cardSpan);

          // Gated on labels.moveButton: an unnamed button is worse than
          // none, and Enter/Space on the cell opens the menu either way.
          if (this.#labels.moveButton && !this.readonly) {
            const buttonHost = document.createElement("lily-icon-button");
            buttonHost.setAttribute("base-class", "kanban-board-move-button");
            buttonHost.setAttribute("label", this.#labels.moveButton(card));
            buttonHost.setAttribute("tabindex", "-1");
            buttonHost.setAttribute("aria-haspopup", "listbox");
            buttonHost.setAttribute("aria-expanded", "false");
            buttonHost.setAttribute("aria-controls", this.#moveListId(card.id));
            buttonHost.textContent = "⇄";
            buttonHost.addEventListener("click", () => {
              if (this.#openCardId === card.id) this.#closeMoveMenu();
              else this.#openMoveMenu(card);
            });
            td.appendChild(buttonHost);
            this.#moveButtonHosts.set(card.id, buttonHost);
          }

          const list = document.createElement("ul");
          list.className = "kanban-board-move-list";
          list.id = this.#moveListId(card.id);
          list.setAttribute("role", "listbox");
          // Named by the card itself when no menu label is given.
          list.setAttribute("aria-label", this.#labels.moveMenuLabel ?? this.#cardLabel(card));
          list.setAttribute("tabindex", "-1");
          list.setAttribute("hidden", "");
          list.addEventListener("keydown", (e) => this.#onMoveListKeydown(e as KeyboardEvent, card));

          const optionEls: HTMLLIElement[] = [];
          this.#columns.forEach((destination, i) => {
            const option = document.createElement("li");
            option.className = "kanban-board-move-option";
            option.id = this.#moveOptionId(card.id, i);
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", String(destination.id === card.columnId));
            if (this.#isRefused(card, destination)) option.setAttribute("aria-disabled", "true");
            option.textContent = destination.title;
            option.addEventListener("click", () => this.#moveCard(card, destination));
            list.appendChild(option);
            optionEls.push(option);
          });
          td.appendChild(list);
          this.#moveListEls.set(card.id, list);
          this.#moveOptionEls.set(card.id, optionEls);
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
    upgradeNestedCustomElements(root);

    this.#rootEl = root;
    this.#tableEl = table;
    this.#statusEl = status;
  }
}
