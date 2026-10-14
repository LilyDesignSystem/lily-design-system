// KanbanBoard client-side runtime.
//
// Pairs with kanban-board.njk. The macro renders every card's move
// button + move listbox UNCONDITIONALLY (hidden via the `hidden`
// attribute) — this module owns:
//
// A. WAI-ARIA APG Grid roving-tabindex keyboard navigation across the
//    board's body cells (arrow move/clamp, Home/End, Ctrl+Home/
//    Ctrl+End) — the vanilla-DOM translation of the same model
//    data-grid and every other framework catalog's own kanban-board
//    port uses.
// B. Each card's own "Move to…" listbox: open/close and the APG
//    listbox active-descendant keyboard contract, delegated to the
//    shared @lilydesignsystem/nunjucks-listbox-behavior module (the
//    same module theme-picker.client.js, locale-picker.client.js,
//    text-size-picker.client.js and motion-picker.client.js already
//    factor this out to) — one controller per card, since each
//    card's listbox is its own stable DOM node.
// C. Native HTML5 drag-and-drop as a SUPPLEMENTARY move path — never
//    the only one; the move menu in (B) is the accessible path,
//    openable by Enter/Space with no pointer involved at all.
// D. One shared aria-live status announcement per successful move.
//
// SHARED-REF REGRESSION NOTE (see spec/index.md §10 and kanban-board.njk's
// own header comment): every other framework catalog's port of this
// component independently found and fixed the same latent bug in the
// Svelte canonical — its move-menu binds a SINGLE shared button
// reference across every card (`bind:this={moveButtonEl}`), so
// closing one card's menu can refocus whichever card's button mounted
// LAST, not the card whose own menu closed. That bug's precondition
// (multiple cards sharing one mutable "the button" variable) cannot
// occur here: kanban-board.njk renders one real, permanent DOM node
// per card at SSR time, and this module looks every button up by the
// SPECIFIC card id being closed (via the `menus` Map below), never
// through a single "last opened/mounted" variable. See
// kanban-board.test.ts's "shared-ref regression" describe block for
// the test that would have caught the Svelte-style bug had it been
// reintroduced here.
//
// See spec/index.md §4.3 (client.js exports), §6 (behaviour).

import { createListboxKeyboard } from "@lilydesignsystem/nunjucks-listbox-behavior";

function escapeAttrValue(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

function textOf(el) {
  return el ? (el.textContent || "").trim() : "";
}

/**
 * Wire one rendered KanbanBoard root.
 *
 * @param {HTMLElement} root - The `[data-lily-kanban-board-root]`.
 * @param {{
 *   onMove?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void,
 *   moveHandler?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>,
 *   onSelectionChange?: (selected: string[]) => void,
 *   onColumnOrderChange?: (order: string[]) => void,
 *   dragPreviewText?: (cards: Array<{ id: string, title: string }>) => string,
 *   onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void,
 *   onReorder?: (cardId: string, toIndex: number) => void,
 *   canMove?: (cardId: string, toColumnId: string) => boolean,
 *   onCollapsedChange?: (collapsedColumns: string[]) => void,
 *   onAddCard?: (columnId: string) => void,
 *   labels?: {
 *     moveAnnouncement?: (cardTitle: string, columnTitle: string) => string,
 *     moveBlocked?: (cardTitle: string, columnTitle: string) => string,
 *     reorderAnnouncement?: (cardTitle: string, position: number, total: number) => string,
 *     movePending?: (cardTitle: string, columnTitle: string) => string,
 *     moveFailed?: (cardTitle: string, columnTitle: string, error: unknown) => string,
 *     moveManyAnnouncement?: (count: number, columnTitle: string) => string,
 *     undoAnnouncement?: (cardTitle: string, columnTitle: string) => string,
 *     undoManyAnnouncement?: (count: number) => string,
 *     columnMoveAnnouncement?: (columnTitle: string, position: number, count: number) => string,
 *   },
 * }=} opts
 * @returns {{ destroy: () => void, collapsedColumns: () => string[], selected: () => string[], columnOrder: () => string[], undo: () => Promise<void> }}
 */
export function initKanbanBoard(root, opts = {}) {
  const noop = { destroy: () => {}, collapsedColumns: () => [], selected: () => [], columnOrder: () => [], undo: async () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const table = root.querySelector(".kanban-table");
  const statusEl = root.querySelector("[data-lily-kanban-board-status]");
  if (!table) return noop;

  const tbody = table.querySelector(".kanban-table-body");
  /** Every body row — lane header rows included — whether or not it is in the DOM right now (virtualization takes rows out). */
  const rows = tbody ? Array.from(tbody.children) : [];
  const isCell = (el) => el.classList.contains("kanban-table-td");
  const isDataRow = (tr) => Array.from(tr.children).some(isCell);
  const dataRows = () => rows.filter(isDataRow);
  const allCells = () => rows.flatMap((tr) => Array.from(tr.children).filter(isCell));
  const cellsOfRow = (tr) => Array.from(tr.children).filter(isCell);
  const hasLanes = root.hasAttribute("data-lily-kanban-board-has-lanes");

  /** Read-only is the macro's `readonly` param, surfaced as `data-readonly`. */
  function isReadonly() {
    return root.hasAttribute("data-readonly");
  }

  // -----------------------------------------------------------------
  // Collapsed columns: a collapsed column keeps its header and count but its
  // cards are taken out of the DOM (stashed, restored on expand).
  // -----------------------------------------------------------------

  /** @type {WeakMap<Element, Node[]>} */
  const stash = new WeakMap();
  const columnIds = () =>
    Array.from(root.querySelectorAll("[data-lily-kanban-board-column-id]"))
      .filter((th) => th.tagName === "TH")
      .map((th) => th.getAttribute("data-lily-kanban-board-column-id"));
  const headerFor = (columnId) =>
    root.querySelector(`th[data-lily-kanban-board-column-id="${escapeAttrValue(columnId)}"]`);
  const cellsOfColumn = (index) => allCells().filter((td) => td.getAttribute("data-col") === String(index));

  function isCollapsed(columnId) {
    const th = headerFor(columnId);
    return !!th && th.hasAttribute("data-collapsed");
  }

  /** The text a search matches a card on (the macro puts title, subtitle and badges in a data attribute). */
  const searchNeedle = () => {
    const input = root.querySelector("[data-lily-kanban-board-search]");
    return input ? input.value.trim().toLowerCase() : "";
  };

  /**
   * One pass over every cell: a cell is emptied (its content stashed out of the DOM) when its column is collapsed
   * or its card does not match the search; rows with nothing left to show are hidden.
   */
  function refreshVisibility() {
    const ids = columnIds();
    const needle = searchNeedle();
    const hiddenByColumn = new Map();
    allCells().forEach((td) => {
      const index = Number(td.getAttribute("data-col"));
      const collapsed = isCollapsed(ids[index]);
      const text = (td.getAttribute("data-lily-kanban-board-search-text") || "").toLowerCase();
      const filtered = !!needle && td.hasAttribute("data-lily-kanban-board-card-id") && !text.includes(needle);
      const hide = collapsed || filtered;
      if (collapsed) td.setAttribute("data-collapsed", "");
      else td.removeAttribute("data-collapsed");
      if (hide) {
        if (!stash.has(td)) {
          stash.set(td, Array.from(td.childNodes));
          td.replaceChildren();
        }
        if (filtered) hiddenByColumn.set(index, (hiddenByColumn.get(index) || 0) + 1);
      } else {
        const nodes = stash.get(td);
        if (nodes) {
          td.replaceChildren(...nodes);
          stash.delete(td);
        }
      }
    });
    ids.forEach((id, index) => {
      const th = headerFor(id);
      if (!th) return;
      const hidden = hiddenByColumn.get(index) || 0;
      if (hidden > 0) th.setAttribute("data-hidden-count", String(hidden));
      else th.removeAttribute("data-hidden-count");
    });
    // A row with nothing left to show is hidden, so the board's height follows what is shown.
    rows.filter(isDataRow).forEach((tr) => {
      const cells = cellsOfRow(tr);
      const empty = cells.every((td) => td.childNodes.length === 0);
      tr.hidden = empty && cells.some((td) => stash.has(td));
    });
    // Keep the roving tab stop on a visible row.
    const stop = focusedCellEl();
    if (stop && stop.parentElement && stop.parentElement.hidden) {
      const firstRow = rows.find((tr) => isDataRow(tr) && !tr.hidden);
      const first = firstRow ? cellsOfRow(firstRow)[0] : null;
      stop.setAttribute("tabindex", "-1");
      if (first) first.setAttribute("tabindex", "0");
    }
    applyWindow(true);
  }

  function applyCollapsed(columnId, collapsed) {
    const th = headerFor(columnId);
    if (!th) return;
    if (collapsed) th.setAttribute("data-collapsed", "");
    else th.removeAttribute("data-collapsed");
    const toggle = th.querySelector("[data-lily-kanban-board-collapse]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.textContent = collapsed ? "▸" : "▾";
    }
    refreshVisibility();
  }

  function collapsedIds() {
    return columnIds().filter((id) => isCollapsed(id));
  }

  /** The cell holding a card (its id is on the cell, so this works while the card is stashed). */
  const cellForCard = (cardId) => allCells().find((td) => td.getAttribute("data-lily-kanban-board-card-id") === String(cardId)) || null;

  /** A move is refused by the card's allowed columns, the consumer's veto or by a full hard-limited column. */
  function isRefused(cardId, toColumnId, extra = 0) {
    const owner = cellForCard(cardId);
    const allowed = owner && owner.getAttribute("data-lily-kanban-board-allowed-columns");
    const ownColumn = owner ? columnIds()[Number(owner.getAttribute("data-col"))] : null;
    if (allowed != null && toColumnId !== ownColumn && !allowed.split(",").includes(toColumnId)) return true;
    if (typeof opts.canMove === "function" && !opts.canMove(cardId, toColumnId)) return true;
    const th = headerFor(toColumnId);
    if (!th || !th.hasAttribute("data-strict-limit")) return false;
    const limit = Number(th.getAttribute("data-wip-limit"));
    const index = columnIds().indexOf(toColumnId);
    const count = cellsOfColumn(index).filter((td) => td.hasAttribute("data-lily-kanban-board-card-id")).length;
    return Number.isFinite(limit) && count + extra >= limit;
  }

  function numCols() {
    return root.querySelectorAll("[data-lily-kanban-board-column-id]").length;
  }
  function numRows() {
    return dataRows().length;
  }
  function cellAt(row, col) {
    const tr = dataRows()[row];
    return tr ? cellsOfRow(tr).find((td) => td.getAttribute("data-col") === String(col)) || null : null;
  }
  function focusedCellEl() {
    return allCells().find((td) => td.getAttribute("tabindex") === "0") || null;
  }

  // -----------------------------------------------------------------
  // Virtualization: every row is rendered by the macro; only the rows in view (plus the roving tab stop's row)
  // stay in the DOM, between spacer rows. Without the client script the area is just scrollable.
  // -----------------------------------------------------------------

  const scrollEl = root.querySelector("[data-lily-kanban-board-virtualize]");
  const rowHeight = scrollEl ? Number(scrollEl.getAttribute("data-row-height")) : 0;
  const overscan = scrollEl ? Number(scrollEl.getAttribute("data-overscan") || 3) : 0;
  const viewHeight = scrollEl ? parseFloat(scrollEl.style.height) || 0 : 0;
  let scrollTopState = 0;
  let windowSig = null;

  const windowedRows = () => rows.filter((tr) => !tr.hidden);

  function applyWindow(force) {
    if (!scrollEl || !tbody || !rowHeight) return;
    const visible = windowedRows();
    const start = Math.max(0, Math.floor(scrollTopState / rowHeight) - overscan);
    const end = Math.min(visible.length, Math.ceil((scrollTopState + viewHeight) / rowHeight) + overscan);
    const indices = new Set();
    for (let i = start; i < end; i++) indices.add(i);
    const stop = focusedCellEl();
    const stopRow = stop ? visible.indexOf(stop.parentElement) : -1;
    if (stopRow >= 0) indices.add(stopRow);
    const sorted = Array.from(indices).sort((a, b) => a - b);
    const sig = sorted.join(",") + "|" + visible.length;
    if (!force && sig === windowSig) return;
    windowSig = sig;
    const hadFocus = !!document.activeElement && tbody.contains(document.activeElement);
    const focused = hadFocus ? document.activeElement : null;
    const spacer = (count) => {
      const tr = document.createElement("tr");
      tr.className = "kanban-board-spacer";
      tr.setAttribute("aria-hidden", "true");
      tr.style.height = `${count * rowHeight}px`;
      const td = document.createElement("td");
      td.colSpan = numCols();
      tr.appendChild(td);
      return tr;
    };
    const children = [];
    let previous = -1;
    for (const index of sorted) {
      if (index - previous > 1) children.push(spacer(index - previous - 1));
      children.push(visible[index]);
      previous = index;
    }
    if (visible.length - 1 - previous > 0) children.push(spacer(visible.length - 1 - previous));
    tbody.replaceChildren(...children);
    if (focused && focused.isConnected === false) focused.focus({ preventScroll: true });
  }

  /** Bring a row into the scroll area. */
  function revealRow(rowIndex) {
    if (!scrollEl || !rowHeight) return;
    const tr = dataRows()[rowIndex];
    const slot = tr ? windowedRows().indexOf(tr) : -1;
    if (slot < 0) return;
    const top = slot * rowHeight;
    let next = scrollTopState;
    if (top < scrollTopState) next = top;
    else if (top + rowHeight > scrollTopState + viewHeight) next = top + rowHeight - viewHeight;
    if (next === scrollTopState) return;
    scrollTopState = next;
    scrollEl.scrollTop = next;
    applyWindow(false);
  }

  function onScroll() {
    scrollTopState = scrollEl.scrollTop;
    applyWindow(false);
  }

  function moveFocus(row, col) {
    const clampedRow = Math.min(Math.max(row, 0), numRows() - 1);
    const clampedCol = Math.min(Math.max(col, 0), numCols() - 1);
    revealRow(clampedRow);
    const target = cellAt(clampedRow, clampedCol);
    if (!target) return;
    const current = focusedCellEl();
    if (current && current !== target) current.setAttribute("tabindex", "-1");
    target.setAttribute("tabindex", "0");
    target.focus({ preventScroll: true });
  }

  // -----------------------------------------------------------------
  // Move menus — one controller per card, keyed by the card's own id.
  // -----------------------------------------------------------------

  /** @type {Map<string, {button: HTMLElement, list: HTMLElement, keyboard: ReturnType<typeof createListboxKeyboard>}>} */
  const menus = new Map();
  let openCardId = null;

  Array.from(root.querySelectorAll("[data-lily-kanban-board-move-list]")).forEach(
    (list) => {
      const cardId = list.getAttribute("data-lily-kanban-board-card-id");
      const button = root.querySelector(
        `[data-lily-kanban-board-move-button][data-lily-kanban-board-card-id="${escapeAttrValue(cardId)}"]`,
      );
      // The button renders only when labels.moveButton names it; without it
      // the card's own cell opens the menu and takes focus back.
      const cell = list.closest("[data-row][data-col]");
      const focusTarget = button || cell;
      if (!cardId || !focusTarget) return;
      const keyboard = createListboxKeyboard(list, {
        clamp: true,
        onActivate: (index) => chooseOption(cardId, index),
        onEscape: () => closeMenu(cardId, true),
        onTabOut: () => {
          focusTarget.focus({ preventScroll: true });
          closeMenu(cardId, false);
        },
      });
      list.addEventListener("click", (event) => {
        const li =
          event.target && event.target.closest
            ? event.target.closest('[role="option"]')
            : null;
        if (!li) return;
        const options = Array.from(list.querySelectorAll('[role="option"]'));
        const index = options.indexOf(li);
        if (index >= 0) chooseOption(cardId, index);
      });
      menus.set(cardId, { button, focusTarget, list, keyboard });
    },
  );

  function openMenu(cardId) {
    if (isReadonly()) return;
    const owner = cellForCard(cardId);
    if (owner && owner.hasAttribute("data-locked")) return;
    if (openCardId && openCardId !== cardId) closeMenu(openCardId, false);
    const entry = menus.get(cardId);
    if (!entry) return;
    openCardId = cardId;
    if (entry.button) entry.button.setAttribute("aria-expanded", "true");
    entry.list.hidden = false;
    const options = Array.from(entry.list.querySelectorAll('[role="option"]'));
    const selectedIndex = options.findIndex(
      (o) => o.getAttribute("aria-selected") === "true",
    );
    // A veto (opts.canMove) marks refused destinations aria-disabled.
    options.forEach((option) => {
      const refused =
        option.getAttribute("aria-selected") !== "true" &&
        isRefused(cardId, option.getAttribute("data-value"));
      if (refused) option.setAttribute("aria-disabled", "true");
      else option.removeAttribute("aria-disabled");
    });
    entry.keyboard.setActive(selectedIndex >= 0 ? selectedIndex : 0);
    entry.list.focus({ preventScroll: true });
  }

  function closeMenu(cardId, refocus) {
    const entry = menus.get(cardId);
    if (!entry) return;
    if (entry.button) entry.button.setAttribute("aria-expanded", "false");
    entry.list.hidden = true;
    entry.keyboard.setActive(-1);
    if (openCardId === cardId) openCardId = null;
    // Refocus THIS card's own button (or its cell, when it has none) —
    // never a shared "last" reference. See the shared-ref regression note
    // in this file's header comment.
    if (refocus) entry.focusTarget.focus({ preventScroll: true });
  }

  function columnTitleFor(columnId) {
    const th = headerFor(columnId);
    if (th && th.getAttribute("data-lily-kanban-board-column-title")) return th.getAttribute("data-lily-kanban-board-column-title");
    const option = root.querySelector(
      `.kanban-board-move-option[data-value="${escapeAttrValue(columnId)}"]`,
    );
    return option ? textOf(option) : columnId;
  }

  function announce(message) {
    if (message && statusEl) statusEl.textContent = message;
  }

  function cardHandleFor(cardId) {
    return root.querySelector(
      `[data-lily-kanban-board-card-handle][data-lily-kanban-board-card-id="${escapeAttrValue(cardId)}"]`,
    );
  }

  const columnOfCard = (cardId) => {
    const cell = cellForCard(cardId);
    return cell ? columnIds()[Number(cell.getAttribute("data-col"))] : null;
  };
  const laneOfCell = (cell) => {
    const tr = cell && cell.parentElement;
    return tr ? tr.getAttribute("data-lane-id") : null;
  };

  /** Resolves true when the move went through (a synchronous `onMove`, or a promise that resolved). */
  async function applyMove(cardId, toColumnId, toIndex, toLaneId, silent) {
    const cardTitle = textOf(cardHandleFor(cardId));
    const columnTitle = columnTitleFor(toColumnId);
    const cell = cellForCard(cardId);
    if (cell && cell.hasAttribute("data-pending")) return false; // a pending card cannot be moved again
    if (typeof opts.onMove === "function") {
      if (toLaneId !== undefined) opts.onMove(cardId, toColumnId, toIndex, toLaneId);
      else if (toIndex === undefined) opts.onMove(cardId, toColumnId);
      else opts.onMove(cardId, toColumnId, toIndex);
    }
    const labelsObj = opts.labels || {};
    const result =
      typeof opts.moveHandler === "function"
        ? toLaneId !== undefined
          ? opts.moveHandler(cardId, toColumnId, toIndex, toLaneId)
          : toIndex === undefined
            ? opts.moveHandler(cardId, toColumnId)
            : opts.moveHandler(cardId, toColumnId, toIndex)
        : undefined;
    if (!result || typeof result.then !== "function") {
      if (!silent && typeof labelsObj.moveAnnouncement === "function") announce(labelsObj.moveAnnouncement(cardTitle, columnTitle));
      return true;
    }
    // Async: the board is rendered by the server, so the card stays put and shows it is pending.
    if (cell) {
      cell.setAttribute("data-pending", "");
      cell.setAttribute("aria-busy", "true");
    }
    if (!silent && typeof labelsObj.movePending === "function") announce(labelsObj.movePending(cardTitle, columnTitle));
    let ok = true;
    try {
      await result;
      if (!silent && typeof labelsObj.moveAnnouncement === "function") announce(labelsObj.moveAnnouncement(cardTitle, columnTitle));
    } catch (error) {
      ok = false;
      if (typeof labelsObj.moveFailed === "function") announce(labelsObj.moveFailed(cardTitle, columnTitle, error));
      if (typeof opts.onMoveError === "function") opts.onMoveError(cardId, toColumnId, error);
      root.dispatchEvent(new CustomEvent("moveerror", { detail: { cardId, toColumnId, error }, bubbles: true }));
    }
    if (cell) {
      cell.removeAttribute("data-pending");
      cell.removeAttribute("aria-busy");
    }
    return ok;
  }

  // -----------------------------------------------------------------
  // Selection: several cards move together
  // -----------------------------------------------------------------

  const isSelectable = () => root.hasAttribute("data-lily-kanban-board-selectable");
  const selectedIds = () =>
    allCells()
      .filter((td) => td.hasAttribute("data-selected") && td.hasAttribute("data-lily-kanban-board-card-id"))
      .map((td) => td.getAttribute("data-lily-kanban-board-card-id"));

  function setSelected(cardId, on) {
    const cell = cellForCard(cardId);
    if (!cell) return;
    if (on) {
      cell.setAttribute("data-selected", "");
      cell.setAttribute("aria-selected", "true");
    } else {
      cell.removeAttribute("data-selected");
      cell.removeAttribute("aria-selected");
    }
  }

  function notifySelection() {
    const ids = selectedIds();
    if (typeof opts.onSelectionChange === "function") opts.onSelectionChange(ids);
    root.dispatchEvent(new CustomEvent("selectionchange", { detail: ids, bubbles: true }));
  }

  function toggleSelected(cardId) {
    if (isReadonly()) return;
    const cell = cellForCard(cardId);
    if (!cell) return;
    setSelected(cardId, !cell.hasAttribute("data-selected"));
    notifySelection();
  }

  function clearSelection() {
    selectedIds().forEach((id) => setSelected(id, false));
    notifySelection();
  }

  /** The cards that move when `cardId` moves: the whole selection when it is in it, else just that card. */
  function movingGroup(cardId) {
    if (!isSelectable()) return [cardId];
    const ids = selectedIds();
    return ids.length >= 2 && ids.includes(cardId) ? ids : [cardId];
  }

  // -----------------------------------------------------------------
  // Undo: the client keeps the stack; the consumer owns the data, so an undo calls onMove back.
  // -----------------------------------------------------------------

  const undoStack = [];
  const undoButton = root.querySelector("[data-lily-kanban-board-undo]");
  const isUndoable = () => root.hasAttribute("data-lily-kanban-board-undoable");
  function syncUndo() {
    if (undoButton) undoButton.disabled = undoStack.length === 0;
  }
  function recordUndo(group) {
    if (!isUndoable() || group.length === 0) return;
    undoStack.push(group);
    if (undoStack.length > 50) undoStack.shift();
    syncUndo();
  }

  async function undo() {
    if (!isUndoable() || isReadonly()) return;
    const labelsObj = opts.labels || {};
    while (undoStack.length > 0) {
      const group = undoStack.pop();
      syncUndo();
      const live = group.filter((m) => {
        const cell = cellForCard(m.cardId);
        return !!cell && !cell.hasAttribute("data-locked");
      });
      if (live.length === 0) continue;
      for (const m of live) await applyMove(m.cardId, m.fromColumnId, undefined, undefined, true);
      if (live.length === 1) {
        if (typeof labelsObj.undoAnnouncement === "function") {
          announce(labelsObj.undoAnnouncement(textOf(cardHandleFor(live[0].cardId)), columnTitleFor(live[0].fromColumnId)));
        }
      } else if (typeof labelsObj.undoManyAnnouncement === "function") {
        announce(labelsObj.undoManyAnnouncement(live.length));
      }
      return;
    }
  }

  /**
   * One path for every move (menu, Alt+Arrow, drop): a selection moves together, a refused move is announced,
   * a successful one is remembered for undo.
   */
  async function requestMove(cardId, toColumnId, toIndex, toLaneId) {
    const labelsObj = opts.labels || {};
    const group = movingGroup(cardId);
    if (group.length > 1) {
      const moved = [];
      let admitted = 0;
      const runs = [];
      for (const id of group) {
        const cell = cellForCard(id);
        if (!cell || cell.hasAttribute("data-locked") || cell.hasAttribute("data-pending") || columnOfCard(id) === toColumnId) continue;
        if (isRefused(id, toColumnId, admitted)) {
          if (typeof labelsObj.moveBlocked === "function") announce(labelsObj.moveBlocked(textOf(cardHandleFor(id)), columnTitleFor(toColumnId)));
          continue;
        }
        admitted += 1;
        const from = columnOfCard(id);
        runs.push(applyMove(id, toColumnId, undefined, undefined, true).then((ok) => {
          if (ok) moved.push({ cardId: id, fromColumnId: from, toColumnId });
          return ok;
        }));
      }
      if (runs.length === 0) return;
      if (typeof labelsObj.moveManyAnnouncement === "function") announce(labelsObj.moveManyAnnouncement(runs.length, columnTitleFor(toColumnId)));
      clearSelection();
      await Promise.all(runs);
      recordUndo(moved);
      return;
    }
    if (isRefused(cardId, toColumnId)) {
      if (typeof labelsObj.moveBlocked === "function") announce(labelsObj.moveBlocked(textOf(cardHandleFor(cardId)), columnTitleFor(toColumnId)));
      return;
    }
    const from = columnOfCard(cardId);
    const ok = await applyMove(cardId, toColumnId, toIndex, toLaneId);
    if (ok && from !== toColumnId) recordUndo([{ cardId, fromColumnId: from, toColumnId }]);
  }

  function chooseOption(cardId, index) {
    const entry = menus.get(cardId);
    if (!entry) return;
    const options = Array.from(entry.list.querySelectorAll('[role="option"]'));
    const option = options[index];
    // Choosing the card's own column (the selected option) is not a move.
    if (option && option.getAttribute("aria-selected") !== "true" && !isReadonly()) {
      void requestMove(cardId, option.getAttribute("data-value"));
    }
    closeMenu(cardId, true);
  }

  // -----------------------------------------------------------------
  // Move button open/close (click) — delegated once at the root.
  // -----------------------------------------------------------------

  function onRootClick(event) {
    const target = event.target && event.target.closest ? event.target : null;
    const collapse = target && target.closest("[data-lily-kanban-board-collapse]");
    if (collapse) {
      const id = collapse.getAttribute("data-lily-kanban-board-column-id");
      applyCollapsed(id, !isCollapsed(id));
      const ids = collapsedIds();
      if (typeof opts.onCollapsedChange === "function") opts.onCollapsedChange(ids);
      root.dispatchEvent(new CustomEvent("collapsechange", { detail: ids, bubbles: true }));
      return;
    }
    if (target && target.closest("[data-lily-kanban-board-undo]")) {
      void undo();
      return;
    }
    if (isSelectable() && (event.ctrlKey || event.metaKey) && target) {
      const clicked = target.closest(".kanban-table-td[data-lily-kanban-board-card-id]");
      if (clicked) {
        event.preventDefault();
        toggleSelected(clicked.getAttribute("data-lily-kanban-board-card-id"));
        return;
      }
    }
    const add = target && target.closest("[data-lily-kanban-board-add]");
    if (add) {
      const id = add.getAttribute("data-lily-kanban-board-column-id");
      if (typeof opts.onAddCard === "function") opts.onAddCard(id);
      root.dispatchEvent(new CustomEvent("addcard", { detail: id, bubbles: true }));
      return;
    }
    const button =
      event.target && event.target.closest
        ? event.target.closest("[data-lily-kanban-board-move-button]")
        : null;
    if (!button) return;
    const cardId = button.getAttribute("data-lily-kanban-board-card-id");
    if (!cardId) return;
    if (openCardId === cardId) closeMenu(cardId, true);
    else openMenu(cardId);
  }

  function onDocumentClick(event) {
    if (!openCardId) return;
    const entry = menus.get(openCardId);
    if (!entry) return;
    const t = event.target;
    if (t && (entry.list.contains(t) || entry.focusTarget.contains(t))) return;
    closeMenu(openCardId, false);
  }

  function onRootFocusOut(event) {
    if (!openCardId) return;
    const entry = menus.get(openCardId);
    if (!entry) return;
    const next = event.relatedTarget;
    if (next && (entry.list.contains(next) || (entry.button && entry.button.contains(next)))) return;
    closeMenu(openCardId, false);
  }

  // -----------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // -----------------------------------------------------------------

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  function onGridFocusin(event) {
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    const current = focusedCellEl();
    if (current && current !== cell) current.setAttribute("tabindex", "-1");
    cell.setAttribute("tabindex", "0");
  }

  /** A cell's row within its lane (its row across the board without lanes). */
  function laneRowOf(cell) {
    const tr = cell.parentElement;
    return hasLanes && tr && tr.hasAttribute("data-lane-row")
      ? Number(tr.getAttribute("data-lane-row"))
      : Number(cell.getAttribute("data-row"));
  }

  /** Alt+ArrowUp/Down: move the focused card within its own column. */
  function reorderCard(cell, delta) {
    if (isReadonly()) return;
    const cardId = cell.getAttribute("data-lily-kanban-board-card-id");
    if (!cardId || cell.hasAttribute("data-locked")) return;
    const col = Number(cell.getAttribute("data-col"));
    const lane = laneOfCell(cell);
    const total = cellsOfColumn(col).filter(
      (td) => td.hasAttribute("data-lily-kanban-board-card-id") && (!hasLanes || laneOfCell(td) === lane),
    ).length;
    const row = laneRowOf(cell);
    const toIndex = row + delta;
    if (toIndex < 0 || toIndex >= total) return;
    if (typeof opts.onReorder === "function") opts.onReorder(cardId, toIndex);
    const reorderAnnouncement = opts.labels && opts.labels.reorderAnnouncement;
    if (typeof reorderAnnouncement === "function") {
      announce(reorderAnnouncement(textOf(cardHandleFor(cardId)), toIndex + 1, total));
    }
  }

  function onGridKeydown(event) {
    // The open move menu owns its own keys; letting them bubble here moved the
    // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
    if (
      event.target &&
      event.target.closest &&
      event.target.closest("[data-lily-kanban-board-move-list]")
    ) {
      return;
    }
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    const row = Number(cell.getAttribute("data-row"));
    const col = Number(cell.getAttribute("data-col"));
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (isUndoable() && ctrlOrMeta && !event.altKey && (event.key === "z" || event.key === "Z")) {
      event.preventDefault();
      void undo();
      return;
    }
    if (isMovableColumns() && event.altKey && event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
      event.preventDefault();
      const columnId = columnIds()[col];
      const to = col + (event.key === "ArrowLeft" ? -1 : 1);
      if (columnId && moveColumn(columnId, to)) {
        const moved = cellAt(row, to);
        if (moved) {
          const current = focusedCellEl();
          if (current && current !== moved) current.setAttribute("tabindex", "-1");
          moved.setAttribute("tabindex", "0");
          moved.focus({ preventScroll: true });
        }
      }
      return;
    }
    if (isSelectable() && !ctrlOrMeta && !event.altKey && (event.key === "x" || event.key === "X")) {
      const cardId = cell.getAttribute("data-lily-kanban-board-card-id");
      if (cardId && !isReadonly()) {
        event.preventDefault();
        toggleSelected(cardId);
      }
      return;
    }
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
      event.preventDefault();
      const cardId = cell.getAttribute("data-lily-kanban-board-card-id");
      const destination = columnIds()[col + (event.key === "ArrowLeft" ? -1 : 1)];
      if (cardId && destination && !isReadonly() && !cell.hasAttribute("data-locked")) void requestMove(cardId, destination);
      return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      reorderCard(cell, event.key === "ArrowUp" ? -1 : 1);
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        moveFocus(row - 1, col);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(row + 1, col);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(row, col - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(row, col + 1);
        break;
      case "Home":
        event.preventDefault();
        if (ctrlOrMeta) moveFocus(0, 0);
        else moveFocus(0, col);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) moveFocus(numRows() - 1, numCols() - 1);
        else moveFocus(numRows() - 1, col);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const cardId = cell.getAttribute("data-lily-kanban-board-card-id");
        if (cardId) openMenu(cardId);
        break;
      }
      default:
        break;
    }
  }

  // -----------------------------------------------------------------
  // Column reordering: the columns move in place (the macro's `columnOrder` is only the starting order)
  // -----------------------------------------------------------------

  const isMovableColumns = () => root.hasAttribute("data-lily-kanban-board-movable-columns");

  function moveColumn(columnId, toIndex) {
    const ids = columnIds();
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    const order = ids.slice();
    order.splice(to, 0, ...order.splice(from, 1));
    const permute = (parent, items) => {
      order.map((id) => items[ids.indexOf(id)]).forEach((el) => parent.appendChild(el));
    };
    const headRow = table.querySelector(".kanban-table-head .kanban-table-row");
    if (headRow) permute(headRow, Array.from(headRow.children));
    rows.filter(isDataRow).forEach((tr) => {
      const cells = cellsOfRow(tr);
      permute(tr, cells);
      cells.forEach((td) => td.setAttribute("data-col", String(order.indexOf(ids[Number(td.getAttribute("data-col"))]))));
    });
    const footRow = table.querySelector(".kanban-table-foot .kanban-table-row");
    if (footRow) permute(footRow, Array.from(footRow.children));
    // Each card's move menu lists the columns in their new order.
    menus.forEach((entry) => {
      const options = Array.from(entry.list.children);
      options
        .slice()
        .sort((a, b) => order.indexOf(a.getAttribute("data-value")) - order.indexOf(b.getAttribute("data-value")))
        .forEach((li) => entry.list.appendChild(li));
    });
    if (typeof opts.onColumnOrderChange === "function") opts.onColumnOrderChange(order);
    root.dispatchEvent(new CustomEvent("columnorderchange", { detail: order, bubbles: true }));
    const columnMove = opts.labels && opts.labels.columnMoveAnnouncement;
    if (typeof columnMove === "function") announce(columnMove(columnTitleFor(columnId), to + 1, order.length));
    return true;
  }

  // -----------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only move path)
  // -----------------------------------------------------------------

  let draggingCardId = null;
  let draggingColumnId = null;

  function onDragStart(event) {
    const header =
      event.target && event.target.closest && isMovableColumns() ? event.target.closest("th[data-lily-kanban-board-column-id]") : null;
    if (header) {
      draggingColumnId = header.getAttribute("data-lily-kanban-board-column-id");
      if (event.dataTransfer) event.dataTransfer.setData("text/plain", draggingColumnId || "");
      return;
    }
    const handle =
      event.target && event.target.closest
        ? event.target.closest("[data-lily-kanban-board-card-handle]")
        : null;
    if (!handle) return;
    const dragged = handle.getAttribute("data-lily-kanban-board-card-id");
    const owner = cellForCard(dragged);
    if (owner && owner.hasAttribute("data-locked")) {
      event.preventDefault();
      return;
    }
    draggingCardId = dragged;
    if (event.dataTransfer) event.dataTransfer.setData("text/plain", draggingCardId || "");
    const group = movingGroup(dragged);
    group.forEach((id) => {
      const groupCell = cellForCard(id);
      if (groupCell) groupCell.setAttribute("data-dragging", "");
    });
    if (typeof opts.dragPreviewText === "function" && event.dataTransfer && event.dataTransfer.setDragImage) {
      const preview = document.createElement("div");
      preview.className = "kanban-board-drag-preview";
      preview.textContent = opts.dragPreviewText(group.map((id) => ({ id, title: textOf(cardHandleFor(id)) })));
      preview.style.position = "absolute";
      preview.style.top = "-1000px";
      root.appendChild(preview);
      event.dataTransfer.setDragImage(preview, 0, 0);
      setTimeout(() => preview.remove(), 0);
    }
  }

  function onDragEnd() {
    draggingCardId = null;
    draggingColumnId = null;
    root.querySelectorAll("[data-dragging]").forEach((el) => el.removeAttribute("data-dragging"));
    root.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
  }

  function onDragOver(event) {
    if (draggingColumnId) {
      if (event.target && event.target.closest && event.target.closest("th[data-lily-kanban-board-column-id]")) event.preventDefault();
      return;
    }
    if (!draggingCardId) return;
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell || isReadonly()) return;
    event.preventDefault();
    root.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
    cell.setAttribute("data-drop-target", "");
  }

  function onDrop(event) {
    if (draggingColumnId) {
      const target = event.target && event.target.closest ? event.target.closest("th[data-lily-kanban-board-column-id]") : null;
      const id = draggingColumnId;
      draggingColumnId = null;
      if (!target) return;
      event.preventDefault();
      const targetId = target.getAttribute("data-lily-kanban-board-column-id");
      if (id && targetId && id !== targetId) moveColumn(id, columnIds().indexOf(targetId));
      return;
    }
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    event.preventDefault();
    root.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
    root.querySelectorAll("[data-dragging]").forEach((el) => el.removeAttribute("data-dragging"));
    const cardId =
      draggingCardId ||
      (event.dataTransfer && event.dataTransfer.getData
        ? event.dataTransfer.getData("text/plain")
        : "");
    draggingCardId = null;
    if (!cardId) return;
    const colIndex = Number(cell.getAttribute("data-col"));
    const headerCells = Array.from(
      root.querySelectorAll("[data-lily-kanban-board-column-id]"),
    );
    const toColumnId =
      headerCells[colIndex] &&
      headerCells[colIndex].getAttribute("data-lily-kanban-board-column-id");
    if (!toColumnId) return;
    if (isReadonly()) return;
    const cardCell = cellForCard(cardId);
    const dropRow = laneRowOf(cell);
    const dropLane = hasLanes ? laneOfCell(cell) : undefined;
    const overCard = cell.hasAttribute("data-lily-kanban-board-card-id") && stash.has(cell) === false;
    if (cardCell && hasLanes && Number(cardCell.getAttribute("data-col")) === colIndex && dropLane !== laneOfCell(cardCell)) {
      // Dropped into another lane of its own column: only the lane changes.
      if (!cardCell.hasAttribute("data-locked")) void requestMove(cardId, toColumnId, undefined, dropLane);
      return;
    }
    if (cardCell && Number(cardCell.getAttribute("data-col")) === colIndex) {
      // Dropped on another card of its own column: reorder to that position.
      const fromRow = laneRowOf(cardCell);
      if (overCard && fromRow !== dropRow && !cardCell.hasAttribute("data-locked")) {
        if (typeof opts.onReorder === "function") opts.onReorder(cardId, dropRow);
        const reorderAnnouncement = opts.labels && opts.labels.reorderAnnouncement;
        if (typeof reorderAnnouncement === "function") {
          const total = cellsOfColumn(colIndex).filter(
            (td) => td.hasAttribute("data-lily-kanban-board-card-id") && (!hasLanes || laneOfCell(td) === laneOfCell(cell)),
          ).length;
          announce(reorderAnnouncement(textOf(cardHandleFor(cardId)), dropRow + 1, total));
        }
      }
      return;
    }
    void requestMove(cardId, toColumnId, overCard ? dropRow : undefined, dropLane);
  }

  function onSearchInput(event) {
    if (event.target && event.target.closest && event.target.closest("[data-lily-kanban-board-search]")) refreshVisibility();
  }

  table.addEventListener("keydown", onGridKeydown);
  table.addEventListener("focusin", onGridFocusin);
  root.addEventListener("click", onRootClick);
  root.addEventListener("focusout", onRootFocusOut);
  root.addEventListener("dragstart", onDragStart);
  root.addEventListener("dragover", onDragOver);
  root.addEventListener("drop", onDrop);
  root.addEventListener("dragend", onDragEnd);
  root.addEventListener("input", onSearchInput);
  if (scrollEl) scrollEl.addEventListener("scroll", onScroll);
  document.addEventListener("click", onDocumentClick);

  // Columns the macro rendered collapsed, and a search it started with: take those cards out of the DOM now.
  refreshVisibility();

  syncUndo();

  return {
    collapsedColumns: collapsedIds,
    selected: selectedIds,
    columnOrder: columnIds,
    undo,
    destroy: () => {
      menus.forEach((entry) => entry.keyboard.destroy());
      table.removeEventListener("keydown", onGridKeydown);
      table.removeEventListener("focusin", onGridFocusin);
      root.removeEventListener("click", onRootClick);
      root.removeEventListener("focusout", onRootFocusOut);
      root.removeEventListener("dragstart", onDragStart);
      root.removeEventListener("dragover", onDragOver);
      root.removeEventListener("drop", onDrop);
      root.removeEventListener("dragend", onDragEnd);
      if (scrollEl) scrollEl.removeEventListener("scroll", onScroll);
      root.removeEventListener("input", onSearchInput);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every `[data-lily-kanban-board-root]` and wire it.
 *
 * @param {Parameters<typeof initKanbanBoard>[1]=} opts
 * @returns {Array<ReturnType<typeof initKanbanBoard>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-kanban-board-root]"),
  );
  return roots.map((root) => initKanbanBoard(root, opts));
}
