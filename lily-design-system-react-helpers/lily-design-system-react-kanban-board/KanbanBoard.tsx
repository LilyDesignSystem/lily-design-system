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
 * names — no baked-in English fallback, matching every other
 * helper's label-gating convention. See spec/index.md §5.
 */
export type KanbanLabels = {
  cardCount?: (count: number) => string;
  overLimit?: (count: number, limit: number) => string;
  moveButton?: (card: KanbanCard) => string;
  moveMenuLabel?: string;
  moveAnnouncement?: (cardTitle: string, columnTitle: string) => string;
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
  /** Called after a card moves to a new column, by pointer or by the move menu. */
  onMove?: (cardId: string, toColumnId: string) => void;
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
  onMove,
  labels = {},
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const baseId = `kanban-board-${React.useId()}`;
  const moveOptionId = (i: number) => `${baseId}-move-option-${i}`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [focusedRow, setFocusedRow] = React.useState(0);
  const [focusedCol, setFocusedCol] = React.useState(0);

  /** The card whose move menu is open, if any. */
  const [openCardId, setOpenCardId] = React.useState<string | null>(null);
  const [moveActiveIndex, setMoveActiveIndex] = React.useState(-1);

  // One button ref per card (keyed by id), not a single shared ref, so
  // closing a given card's menu always returns focus to THAT card's own
  // move button, not to whichever card happened to mount last.
  const moveButtonRefs = React.useRef<Map<string, HTMLButtonElement>>(
    new Map(),
  );
  const moveListRef = React.useRef<HTMLElement | null>(null);
  const refocusCardIdRef = React.useRef<string | null>(null);
  const draggingCardIdRef = React.useRef<string | null>(null);

  const cardsByColumn = groupCardsByColumn(columns, cards);
  const maxRows = columns.reduce(
    (max, column) => Math.max(max, cardsByColumn.get(column.id)?.length ?? 0),
    0,
  );

  function cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = columns[colIndex];
    if (!column) return undefined;
    return cardsByColumn.get(column.id)?.[rowIndex];
  }

  function announce(message: string | undefined): void {
    if (message) setStatusMessage(message);
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
    setOpenCardId(card.id);
    const currentIndex = columns.findIndex((c) => c.id === card.columnId);
    setMoveActiveIndex(currentIndex >= 0 ? currentIndex : 0);
  }

  function closeMoveMenu(refocus = true): void {
    setOpenCardId((current) => {
      if (current === null) return current;
      refocusCardIdRef.current = refocus ? current : null;
      return null;
    });
    setMoveActiveIndex(-1);
  }

  // Focus management: opening moves focus into the listbox; closing
  // returns it to the move button of the card that was open, mirroring
  // the Svelte reference's queueMicrotask-after-mutation timing via an
  // effect that runs after the DOM commit.
  React.useEffect(() => {
    if (openCardId !== null) {
      moveListRef.current?.focus({ preventScroll: true });
    } else if (refocusCardIdRef.current) {
      const id = refocusCardIdRef.current;
      refocusCardIdRef.current = null;
      moveButtonRefs.current.get(id)?.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCardId]);

  // ---------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only path)
  // ---------------------------------------------------------------

  function onCardDragStart(card: KanbanCard, event: React.DragEvent): void {
    draggingCardIdRef.current = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
  }

  function onColumnDragOver(event: React.DragEvent): void {
    if (draggingCardIdRef.current) event.preventDefault();
  }

  function onColumnDrop(column: KanbanColumn, event: React.DragEvent): void {
    event.preventDefault();
    const cardId =
      draggingCardIdRef.current ?? event.dataTransfer?.getData("text/plain");
    draggingCardIdRef.current = null;
    const card = cards.find((c) => c.id === cardId);
    if (card) moveCard(card, column);
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  function moveFocus(row: number, col: number): void {
    setFocusedCol(Math.min(Math.max(col, 0), columns.length - 1));
    setFocusedRow(Math.min(Math.max(row, 0), maxRows - 1));
  }

  React.useEffect(() => {
    rootRef.current
      ?.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')
      ?.focus({ preventScroll: true });
  }, [focusedRow, focusedCol]);

  function onGridKeyDown(event: React.KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-row][data-col]",
    );
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

  return (
    <div
      ref={rootRef}
      className={`kanban-board ${className}`.trim()}
      {...restProps}
    >
      <KanbanTable label={label} caption={caption} onKeyDown={onGridKeyDown}>
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
                >
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
                    active={focusedRow === rowIndex && focusedCol === colIndex}
                    label={card ? cardLabel(card) : undefined}
                    onDragOver={onColumnDragOver}
                    onDrop={(e: React.DragEvent) => onColumnDrop(column, e)}
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
                          draggable
                          onDragStart={(e) => onCardDragStart(card, e)}
                        >
                          {cardLabel(card)}
                        </span>
                        <IconButton
                          ref={(el: HTMLButtonElement | null) => {
                            if (el) moveButtonRefs.current.set(card.id, el);
                            else moveButtonRefs.current.delete(card.id);
                          }}
                          baseClass="kanban-board-move-button"
                          label={labels.moveButton?.(card) ?? ""}
                          tabIndex={-1}
                          aria-haspopup="listbox"
                          aria-expanded={openCardId === card.id}
                          onClick={() =>
                            openCardId === card.id
                              ? closeMoveMenu()
                              : openMoveMenu(card)
                          }
                        >
                          ⇄
                        </IconButton>
                        {openCardId === card.id && (
                          <Listbox
                            ref={moveListRef}
                            as="ul"
                            baseClass="kanban-board-move-list"
                            label={labels.moveMenuLabel ?? ""}
                            navigation="active-descendant"
                            clamp
                            activeIndex={moveActiveIndex}
                            onActiveIndexChange={setMoveActiveIndex}
                            onActivate={(i: number) => moveCard(card, columns[i])}
                            onEscape={() => closeMoveMenu()}
                            onTabOut={() => closeMoveMenu(false)}
                          >
                            {columns.map((destination, i) => (
                              <li
                                key={destination.id}
                                className="kanban-board-move-option"
                                id={moveOptionId(i)}
                                role="option"
                                aria-selected={destination.id === card.columnId}
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
