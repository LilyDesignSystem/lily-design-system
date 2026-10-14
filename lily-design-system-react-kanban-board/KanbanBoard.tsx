import * as React from "react";
import {
  IconButton,
  KanbanTable,
  KanbanTableBody,
  KanbanTableHead,
  KanbanTableRow,
  KanbanTableTD,
  KanbanTableTH,
  Listbox,
} from "@lilydesignsystem/react-headless";

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

/** What the `renderCard` prop receives. */
export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

/** What the `columnHeader` / `columnFooter` props receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other
 * helper's label-gating convention. See spec/index.md §5.
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
  reorderAnnouncement?: (
    cardTitle: string,
    position: number,
    total: number,
  ) => string;
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

/** Public props for KanbanBoard. See `spec/index.md` §5 for the contract. */
export type Props = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> & {
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
  /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
  cardAttrs?: (card: KanbanCard) => Record<string, unknown>;
  /** Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
  filter?: (card: KanbanCard) => boolean;
  /** Orders the cards shown within each column (a stable sort). */
  compare?: (a: KanbanCard, b: KanbanCard) => number;
  /**
   * Called when a card moves to a new column, by pointer or the move menu. `toIndex` (0-based, in the visible column) is given only when a
   * pointer drop landed on a card. May return a promise: the card shows in its new column at once with `data-pending` and `aria-busy`,
   * and goes back (announcing `labels.moveFailed`, calling `onMoveError`) if the promise rejects.
   */
  onMove?: (cardId: string, toColumnId: string, toIndex?: number) => void | Promise<unknown>;
  /** Called when an async `onMove` rejects, after the card has gone back. */
  onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
  /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
  allowedColumns?: (card: KanbanCard) => string[];
  /** Board-level search: shows only cards whose text contains it (case-insensitive). Controlled when given; combines with `filter`. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** The text `search` looks in. Defaults to the label, subtitle and badges. */
  searchText?: (card: KanbanCard) => string;
  /** Replaces the title content of a card (the subtitle and badges are then this render prop's own). */
  renderCard?: (ctx: KanbanCardContext) => React.ReactNode;
  /** Rendered in each column's header after its title and flag. */
  columnHeader?: (ctx: KanbanColumnContext) => React.ReactNode;
  /** Rendered in a `<tfoot>` cell per column: sums per stage. */
  columnFooter?: (ctx: KanbanColumnContext) => React.ReactNode;
  /** Called when Alt+ArrowUp/Down moves a card within its column; `toIndex` is 0-based. The consumer reorders `cards`. */
  onReorder?: (cardId: string, toIndex: number) => void;
  /** Ids of collapsed columns. Controlled when given. A collapsed column keeps its header and count but shows no cards. */
  collapsedColumns?: string[];
  defaultCollapsedColumns?: string[];
  onCollapsedColumnsChange?: (collapsedColumns: string[]) => void;
  /** Fired when a column's add-card button is pressed. The consumer adds the card (Lily ships no editor). */
  onAddCard?: (columnId: string) => void;
  /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
  canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
  /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
  readonly?: boolean;
  /** User-facing strings. See KanbanLabels — presence gates each control. */
  labels?: KanbanLabels;
  /** Extra CSS class on the root. */
  className?: string;
};

function groupCardsByColumn(
  columns: KanbanColumn[],
  cards: KanbanCard[],
): Map<string, KanbanCard[]> {
  const map = new Map<string, KanbanCard[]>();
  for (const column of columns) map.set(column.id, []);
  for (const card of cards) {
    map.get(card.columnId)?.push(card);
  }
  return map;
}

export function KanbanBoard({
  label,
  caption,
  columns,
  cards,
  cardLabel = (card: KanbanCard) => card.title,
  cardAttrs,
  filter,
  compare,
  onMove,
  onMoveError,
  allowedColumns,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  searchText,
  renderCard,
  columnHeader,
  columnFooter,
  onReorder,
  canMove,
  collapsedColumns: collapsedProp,
  defaultCollapsedColumns = [],
  onCollapsedColumnsChange,
  onAddCard,
  readonly = false,
  labels = {},
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const baseId = `kanban-board-${React.useId()}`;
  const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;
  const moveListId = `${baseId}-move-list`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [focusedRow, setFocusedRow] = React.useState(0);
  const [focusedCol, setFocusedCol] = React.useState(0);

  /** The card whose move menu is open, if any. */
  const [openCardId, setOpenCardId] = React.useState<string | null>(null);
  const [moveActiveIndex, setMoveActiveIndex] = React.useState(-1);

  const moveListRef = React.useRef<HTMLElement | null>(null);
  /**
   * Focus to move after the next commit: the menu, the cursor's cell, or a card
   * found by id wherever it now is. Only ever set by a user action, so mounting
   * the board never takes focus from the page.
   */
  const pendingFocusRef = React.useRef<
    { kind: "menu" } | { kind: "cell" } | { kind: "card"; id: string } | null
  >(null);
  const draggingCardIdRef = React.useRef<string | null>(null);

  /** Cards moved optimistically by an async `onMove` that has not settled: id → destination column. */
  const [optimistic, setOptimistic] = React.useState<Record<string, string>>({});
  const isPending = (cardId: string) => cardId in optimistic;
  const effectiveCards = cards.map((c) => (c.id in optimistic ? { ...c, columnId: optimistic[c.id] } : c));
  const [searchInner, setSearchInner] = React.useState(defaultSearch);
  const search = searchProp ?? searchInner;
  const cardsByColumn = groupCardsByColumn(columns, effectiveCards);
  // What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
  const shownByColumn = new Map<string, KanbanCard[]>();
  for (const [id, list] of cardsByColumn) {
    let shown = filter ? list.filter(filter) : list.slice();
    const needle = search.trim().toLowerCase();
    if (needle) {
      const text = searchText ?? ((c: KanbanCard) => [cardLabel(c), c.subtitle ?? "", ...(c.badges ?? [])].join(" "));
      shown = shown.filter((c) => text(c).toLowerCase().includes(needle));
    }
    if (compare) shown = shown.sort(compare);
    shownByColumn.set(id, shown);
  }
  const [dropTarget, setDropTarget] = React.useState<string | null>(null);

  const [collapsedInner, setCollapsedInner] = React.useState<string[]>(defaultCollapsedColumns);
  const collapsedColumns = collapsedProp ?? collapsedInner;
  const isCollapsed = (columnId: string) => collapsedColumns.includes(columnId);
  function toggleCollapsed(column: KanbanColumn): void {
    const next = isCollapsed(column.id)
      ? collapsedColumns.filter((id) => id !== column.id)
      : [...collapsedColumns, column.id];
    if (collapsedProp === undefined) setCollapsedInner(next);
    onCollapsedColumnsChange?.(next);
  }

  // A collapsed column shows no cards, so it does not count towards the board's height.
  const isEmptyColumn = (column: KanbanColumn) =>
    !isCollapsed(column.id) && (shownByColumn.get(column.id)?.length ?? 0) === 0;
  // A row exists for an empty column's message even when no column has a card to show.
  const maxRows = Math.max(
    columns.reduce(
      (max, column) =>
        Math.max(max, isCollapsed(column.id) ? 0 : (shownByColumn.get(column.id)?.length ?? 0)),
      0,
    ),
    labels.emptyColumn && columns.some(isEmptyColumn) ? 1 : 0,
  );

  // The roving cursor, clamped to the cells that exist now: a move can shrink
  // the board, and a cursor left on a vanished row would take the grid out of
  // the tab order altogether.
  const activeRow = Math.min(focusedRow, maxRows - 1);
  const activeCol = Math.min(focusedCol, columns.length - 1);

  function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = columns[colIndex];
    if (!column || isCollapsed(column.id)) return undefined;
    return shownByColumn.get(column.id)?.[rowIndex];
  }

  function announce(message: string | undefined): void {
    if (message) setStatusMessage(message);
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
    return (
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      (cardsByColumn.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
    );
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
    setOptimistic((o) => ({ ...o, [card.id]: toColumn.id }));
    announce(labels.movePending?.(cardLabel(card), toColumn.title));
    try {
      await result;
      announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
    } catch (error) {
      announce(labels.moveFailed?.(cardLabel(card), toColumn.title, error));
      onMoveError?.(card.id, toColumn.id, error);
    } finally {
      setOptimistic((o) => {
        const { [card.id]: _settled, ...rest } = o;
        return rest;
      });
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

  function openMoveMenu(card: KanbanCard): void {
    if (readonly || card.locked) return;
    setOpenCardId(card.id);
    const currentIndex = moveTargets(card).findIndex((c) => c.id === card.columnId);
    setMoveActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    pendingFocusRef.current = { kind: "menu" };
  }

  function closeMoveMenu(cardId: string, refocus = true): void {
    setOpenCardId(null);
    setMoveActiveIndex(-1);
    pendingFocusRef.current = refocus ? { kind: "card", id: cardId } : null;
  }

  // Runs after every commit, and acts only on a pending request. A card is
  // found by id after the commit — after a move the consumer's `cards` has put
  // it in another column — and the roving cursor follows it there; focus lands
  // on its move button, or on its cell when there is no button.
  React.useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;
    const root = rootRef.current;
    if (!root) return;
    if (pending.kind === "menu") {
      moveListRef.current?.focus({ preventScroll: true });
    } else if (pending.kind === "cell") {
      root
        .querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')
        ?.focus({ preventScroll: true });
    } else {
      const cell = Array.from(
        root.querySelectorAll<HTMLElement>("[data-card-id]"),
      ).find((el) => el.dataset.cardId === pending.id);
      if (!cell) return;
      setFocusedRow(Number(cell.dataset.row));
      setFocusedCol(Number(cell.dataset.col));
      (
        cell.querySelector<HTMLElement>(".kanban-board-move-button") ?? cell
      ).focus({ preventScroll: true });
    }
  });

  // ---------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only path)
  // ---------------------------------------------------------------

  function onCardDragStart(card: KanbanCard, event: React.DragEvent): void {
    if (card.locked) {
      event.preventDefault();
      return;
    }
    draggingCardIdRef.current = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
  }

  function onColumnDragOver(event: React.DragEvent, rowIndex: number, colIndex: number): void {
    if (!draggingCardIdRef.current || readonly) return;
    event.preventDefault();
    setDropTarget(`${rowIndex}-${colIndex}`);
  }

  function onColumnDrop(column: KanbanColumn, rowIndex: number, event: React.DragEvent): void {
    event.preventDefault();
    const cardId =
      draggingCardIdRef.current ?? event.dataTransfer?.getData("text/plain");
    draggingCardIdRef.current = null;
    setDropTarget(null);
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

  function moveFocus(row: number, col: number): void {
    setFocusedCol(Math.min(Math.max(col, 0), columns.length - 1));
    setFocusedRow(Math.min(Math.max(row, 0), maxRows - 1));
    pendingFocusRef.current = { kind: "cell" };
  }

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  function onGridFocus(event: React.FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-row][data-col]",
    );
    if (!cell) return;
    setFocusedRow(Number(cell.dataset.row));
    setFocusedCol(Number(cell.dataset.col));
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
    pendingFocusRef.current = { kind: "card", id: card.id };
    setFocusedRow(toIndex);
  }

  function onGridKeyDown(event: React.KeyboardEvent): void {
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
        if (card) openMoveMenu(card);
        break;
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`kanban-board ${className}`.trim()}
      data-readonly={readonly ? "" : undefined}
      {...restProps}
    >
      {labels.search && (
        <input
          type="search"
          className="kanban-board-search"
          aria-label={labels.search}
          value={search}
          onChange={(e) => {
            setSearchInner(e.target.value);
            onSearchChange?.(e.target.value);
          }}
        />
      )}
      <KanbanTable
        label={label}
        caption={caption}
        onKeyDown={onGridKeyDown}
        onFocus={onGridFocus}
      >
        <KanbanTableHead>
          <KanbanTableRow>
            {columns.map((column) => {
              const count = cardsByColumn.get(column.id)?.length ?? 0;
              const overLimit =
                column.wipLimit != null && count > column.wipLimit;
              return (
                <KanbanTableTH
                  key={column.id}
                  data-over-limit={overLimit ? "" : undefined}
                  data-hidden-count={count - (shownByColumn.get(column.id)?.length ?? 0) > 0 ? count - (shownByColumn.get(column.id)?.length ?? 0) : undefined}
                  data-collapsed={isCollapsed(column.id) ? "" : undefined}
                  data-flag={column.flag}
                  data-accent={column.accent}
                >
                  {labels.collapseColumn && (
                    <button
                      type="button"
                      className="kanban-board-collapse-button"
                      aria-expanded={!isCollapsed(column.id)}
                      aria-label={labels.collapseColumn(column, isCollapsed(column.id))}
                      onClick={() => toggleCollapsed(column)}
                    >
                      {isCollapsed(column.id) ? "▸" : "▾"}
                    </button>
                  )}
                  {column.title}
                  {column.flag && <span className="kanban-board-column-flag">{column.flag}</span>}
                  {columnHeader?.({ column, cards: cardsByColumn.get(column.id) ?? [], count })}
                  {labels.cardCount && (
                    <span className="kanban-board-count">
                      {labels.cardCount(count)}
                    </span>
                  )}
                  {overLimit && labels.overLimit && (
                    <span className="kanban-board-wip-warning">
                      {labels.overLimit(count, column.wipLimit ?? 0)}
                    </span>
                  )}
                  {labels.addCard && !readonly && (
                    <button
                      type="button"
                      className="kanban-board-add-button"
                      aria-label={labels.addCard(column)}
                      onClick={() => onAddCard?.(column.id)}
                    >
                      +
                    </button>
                  )}
                </KanbanTableTH>
              );
            })}
          </KanbanTableRow>
        </KanbanTableHead>
        <KanbanTableBody>
          {Array.from({ length: maxRows }, (_, rowIndex) => (
            <KanbanTableRow key={rowIndex}>
              {columns.map((column, colIndex) => {
                const card = cardAt(colIndex, rowIndex);
                return (
                  <KanbanTableTD
                    key={column.id}
                    data-row={rowIndex}
                    data-col={colIndex}
                    data-card-id={card?.id}
                    data-collapsed={isCollapsed(column.id) ? "" : undefined}
                    data-locked={card?.locked ? "" : undefined}
                    data-pending={card && isPending(card.id) ? "" : undefined}
                    aria-busy={card && isPending(card.id) ? true : undefined}
                    data-flag={card?.flag}
                    data-accent={column.accent}
                    data-empty={!card && rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column) ? "" : undefined}
                    aria-describedby={card?.flag ? `${baseId}-flag-${card.id}` : undefined}
                    data-drop-target={dropTarget === `${rowIndex}-${colIndex}` ? "" : undefined}
                    {...(card ? (cardAttrs?.(card) ?? {}) : {})}
                    active={activeRow === rowIndex && activeCol === colIndex}
                    label={card ? cardLabel(card) : undefined}
                    onDragOver={(e: React.DragEvent) => onColumnDragOver(e, rowIndex, colIndex)}
                    onDragLeave={() => setDropTarget(null)}
                    onDrop={(e: React.DragEvent) => onColumnDrop(column, rowIndex, e)}
                  >
                    {card && (
                      <>
                        {/*
                          The card title is a supplementary pointer-drag
                          handle inside an already-interactive gridcell
                          (role comes from the parent KanbanTableTD);
                          dragstart here is one of two equally-real move
                          paths, not the accessible one — see the
                          move-button/listbox below for that.
                        */}
                        <span
                          className="kanban-board-card-title"
                          draggable={readonly || card.locked || card.draggable === false ? undefined : true}
                          onDragStart={(e) => onCardDragStart(card, e)}
                        >
                          {renderCard ? (
                            renderCard({ card, label: cardLabel(card), column, pending: isPending(card.id) })
                          ) : card.href ? (
                            <a className="kanban-board-card-link" href={card.href}>
                              {cardLabel(card)}
                            </a>
                          ) : (
                            cardLabel(card)
                          )}
                        </span>
                        {!renderCard && card.subtitle && (
                          <span className="kanban-board-card-subtitle">{card.subtitle}</span>
                        )}
                        {!renderCard && card.badges?.length ? (
                          <span className="kanban-board-card-badges">
                            {card.badges.map((badge) => (
                              <span key={badge} className="kanban-board-card-badge">
                                {badge}
                              </span>
                            ))}
                          </span>
                        ) : null}
                        {card.flag && (
                          <span className="kanban-board-card-flag" id={`${baseId}-flag-${card.id}`}>
                            {card.flag}
                          </span>
                        )}
                        {/*
                          Gated on labels.moveButton: an unnamed button is
                          worse than none, and Enter/Space on the cell opens
                          the menu either way.
                        */}
                        {labels.moveButton && !readonly && !card.locked && (
                          <IconButton
                            baseClass="kanban-board-move-button"
                            label={labels.moveButton(card)}
                            tabIndex={-1}
                            aria-haspopup="listbox"
                            aria-expanded={openCardId === card.id}
                            aria-controls={
                              openCardId === card.id ? moveListId : undefined
                            }
                            onClick={() =>
                              openCardId === card.id
                                ? closeMoveMenu(card.id)
                                : openMoveMenu(card)
                            }
                          >
                            ⇄
                          </IconButton>
                        )}
                        {openCardId === card.id && (
                          <Listbox
                            ref={moveListRef}
                            as="ul"
                            id={moveListId}
                            baseClass="kanban-board-move-list"
                            label={labels.moveMenuLabel ?? cardLabel(card)}
                            navigation="active-descendant"
                            clamp
                            activeIndex={moveActiveIndex}
                            onActiveIndexChange={setMoveActiveIndex}
                            onActivate={(i: number) => moveCard(card, moveTargets(card)[i])}
                            onEscape={() => closeMoveMenu(card.id)}
                            onTabOut={() => closeMoveMenu(card.id, false)}
                          >
                            {moveTargets(card).map((destination, i) => (
                              <li
                                key={destination.id}
                                className="kanban-board-move-option"
                                id={moveOptionId(i)}
                                role="option"
                                aria-selected={destination.id === card.columnId}
                                aria-disabled={isRefused(card, destination) ? true : undefined}
                                data-active={i === moveActiveIndex ? "" : undefined}
                                onClick={() => moveCard(card, destination)}
                              >
                                {destination.title}
                              </li>
                            ))}
                          </Listbox>
                        )}
                      </>
                    )}
                    {!card && rowIndex === 0 && labels.emptyColumn && isEmptyColumn(column) && (
                      <span className="kanban-board-empty">{labels.emptyColumn(column)}</span>
                    )}
                  </KanbanTableTD>
                );
              })}
            </KanbanTableRow>
          ))}
        </KanbanTableBody>
        {columnFooter && (
          <tfoot className="kanban-table-foot">
            <tr className="kanban-table-row">
              {columns.map((column) => (
                <td key={column.id} className="kanban-table-td kanban-board-column-footer" data-accent={column.accent}>
                  {columnFooter({
                    column,
                    cards: cardsByColumn.get(column.id) ?? [],
                    count: cardsByColumn.get(column.id)?.length ?? 0,
                  })}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </KanbanTable>

      <p className="kanban-board-status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

export default KanbanBoard;
