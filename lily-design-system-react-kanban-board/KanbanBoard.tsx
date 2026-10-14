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
};

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
  /** Called after a card moves to a new column, by pointer or by the move menu. `toIndex` (0-based, in the visible column) is given only when a pointer drop landed on a card. */
  onMove?: (cardId: string, toColumnId: string, toIndex?: number) => void;
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

  const cardsByColumn = groupCardsByColumn(columns, cards);
  // What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
  const shownByColumn = new Map<string, KanbanCard[]>();
  for (const [id, list] of cardsByColumn) {
    let shown = filter ? list.filter(filter) : list.slice();
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
  const maxRows = columns.reduce(
    (max, column) =>
      Math.max(max, isCollapsed(column.id) ? 0 : (shownByColumn.get(column.id)?.length ?? 0)),
    0,
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
    if (canMove && !canMove(card, toColumn)) return true;
    return (
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      (cardsByColumn.get(toColumn.id)?.length ?? 0) >= toColumn.wipLimit
    );
  }

  function moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): void {
    if (readonly || card.locked) return;
    if (isRefused(card, toColumn)) {
      announce(labels.moveBlocked?.(cardLabel(card), toColumn.title));
      closeMoveMenu(card.id);
      return;
    }
    if (toColumn.id !== card.columnId) {
      if (toIndex === undefined) onMove?.(card.id, toColumn.id);
      else onMove?.(card.id, toColumn.id, toIndex);
      announce(labels.moveAnnouncement?.(cardLabel(card), toColumn.title));
    }
    closeMoveMenu(card.id);
  }

  function openMoveMenu(card: KanbanCard): void {
    if (readonly || card.locked) return;
    setOpenCardId(card.id);
    const currentIndex = columns.findIndex((c) => c.id === card.columnId);
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
                          draggable={readonly || card.locked ? undefined : true}
                          onDragStart={(e) => onCardDragStart(card, e)}
                        >
                          {cardLabel(card)}
                        </span>
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
                            onActivate={(i: number) => moveCard(card, columns[i])}
                            onEscape={() => closeMoveMenu(card.id)}
                            onTabOut={() => closeMoveMenu(card.id, false)}
                          >
                            {columns.map((destination, i) => (
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
                  </KanbanTableTD>
                );
              })}
            </KanbanTableRow>
          ))}
        </KanbanTableBody>
      </KanbanTable>

      <p className="kanban-board-status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

export default KanbanBoard;
