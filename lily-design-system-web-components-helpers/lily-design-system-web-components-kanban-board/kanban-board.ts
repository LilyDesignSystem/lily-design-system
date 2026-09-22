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

const HANDLED_ATTRS = new Set(["label", "caption", "class"]);

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
    return ["label", "caption", "class"];
  }

  // ---- Backing storage for property-only members ----
  #columns: KanbanColumn[] = [];
  #cards: KanbanCard[] = [];
  #cardLabel: (card: KanbanCard) => string = (card) => card.title;
  #onMove?: (cardId: string, toColumnId: string) => void;
  #labels: KanbanLabels = {};

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
    if (name === "label" || name === "caption" || name === "class") {
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
      (max, column) => Math.max(max, cardsByColumn.get(column.id)?.length ?? 0),
      0,
    );
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

  #moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
    this.#onMove?.(card.id, toColumn.id);
    this.#announce(this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title));
    this.#closeMoveMenu();
  }

  #openMoveMenu(card: KanbanCard): void {
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
    if (refocus) {
      const button = this.#moveButtonHosts.get(cardId)?.querySelector<HTMLButtonElement>("button");
      button?.focus({ preventScroll: true });
    }
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
        this.#moveButtonHosts.get(card.id)?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
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
    if (card) this.#moveCard(card, column);
  };

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  #syncFocusState(previousRow: number, previousCol: number, focusNewCell: boolean): void {
    const previous = this.#cellEls.get(`${previousRow}-${previousCol}`);
    if (previous) {
      previous.setAttribute("tabindex", "-1");
      previous.setAttribute("aria-selected", "false");
    }
    const next = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
    if (next) {
      next.setAttribute("tabindex", "0");
      next.setAttribute("aria-selected", "true");
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

  #onGridKeydown = (event: KeyboardEvent): void => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const cardsByColumn = this.#cardsByColumn();
    const maxRows = this.#maxRows(cardsByColumn);
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

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    this.#columns.forEach((column) => {
      const count = cardsByColumn.get(column.id)?.length ?? 0;
      const overLimit = column.wipLimit != null && count > column.wipLimit;
      const th = document.createElement("th");
      th.className = "kanban-board-th";
      th.setAttribute("scope", "col");
      if (overLimit) th.setAttribute("data-over-limit", "");
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
        const isActive = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
        td.setAttribute("tabindex", isActive ? "0" : "-1");
        td.setAttribute("aria-selected", String(isActive));
        td.addEventListener("dragover", this.#onColumnDragOver);
        td.addEventListener("drop", (e) => this.#onColumnDrop(column, e as DragEvent));

        if (card) {
          const cardSpan = document.createElement("span");
          cardSpan.className = "kanban-board-card-title";
          cardSpan.setAttribute("draggable", "true");
          cardSpan.textContent = this.#cardLabel(card);
          cardSpan.addEventListener("dragstart", (e) => this.#onCardDragStart(card, e as DragEvent));
          td.appendChild(cardSpan);

          const buttonHost = document.createElement("lily-icon-button");
          buttonHost.setAttribute("base-class", "kanban-board-move-button");
          buttonHost.setAttribute("label", this.#labels.moveButton?.(card) ?? "");
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

          const list = document.createElement("ul");
          list.className = "kanban-board-move-list";
          list.id = this.#moveListId(card.id);
          list.setAttribute("role", "listbox");
          list.setAttribute("aria-label", this.#labels.moveMenuLabel ?? "");
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
