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
 *   onMove?: (cardId: string, toColumnId: string) => void,
 *   labels?: { moveAnnouncement?: (cardTitle: string, columnTitle: string) => string },
 * }=} opts
 * @returns {{ destroy: () => void }}
 */
export function initKanbanBoard(root, opts = {}) {
  const noop = { destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const table = root.querySelector(".kanban-table");
  const statusEl = root.querySelector("[data-lily-kanban-board-status]");
  if (!table) return noop;

  function numCols() {
    return root.querySelectorAll("[data-lily-kanban-board-column-id]").length;
  }
  function numRows() {
    return root.querySelectorAll(".kanban-table-body > .kanban-table-row").length;
  }
  function cellAt(row, col) {
    return root.querySelector(
      `.kanban-table-td[data-row="${row}"][data-col="${col}"]`,
    );
  }
  function focusedCellEl() {
    return root.querySelector('.kanban-table-td[tabindex="0"]');
  }

  function moveFocus(row, col) {
    const clampedRow = Math.min(Math.max(row, 0), numRows() - 1);
    const clampedCol = Math.min(Math.max(col, 0), numCols() - 1);
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
      if (!cardId || !button) return;
      const keyboard = createListboxKeyboard(list, {
        clamp: true,
        onActivate: (index) => chooseOption(cardId, index),
        onEscape: () => closeMenu(cardId, true),
        onTabOut: () => {
          button.focus({ preventScroll: true });
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
      menus.set(cardId, { button, list, keyboard });
    },
  );

  function openMenu(cardId) {
    if (openCardId && openCardId !== cardId) closeMenu(openCardId, false);
    const entry = menus.get(cardId);
    if (!entry) return;
    openCardId = cardId;
    entry.button.setAttribute("aria-expanded", "true");
    entry.list.hidden = false;
    const options = Array.from(entry.list.querySelectorAll('[role="option"]'));
    const selectedIndex = options.findIndex(
      (o) => o.getAttribute("aria-selected") === "true",
    );
    entry.keyboard.setActive(selectedIndex >= 0 ? selectedIndex : 0);
    entry.list.focus({ preventScroll: true });
  }

  function closeMenu(cardId, refocus) {
    const entry = menus.get(cardId);
    if (!entry) return;
    entry.button.setAttribute("aria-expanded", "false");
    entry.list.hidden = true;
    entry.keyboard.setActive(-1);
    if (openCardId === cardId) openCardId = null;
    // Refocus THIS card's own button — never a shared "last" reference.
    // See the shared-ref regression note in this file's header comment.
    if (refocus) entry.button.focus({ preventScroll: true });
  }

  function columnTitleFor(columnId) {
    const option = root.querySelector(
      `.kanban-board-move-option[data-value="${escapeAttrValue(columnId)}"]`,
    );
    return option ? textOf(option) : columnId;
  }

  function announce(message) {
    if (message && statusEl) statusEl.textContent = message;
  }

  function applyMove(cardId, toColumnId) {
    const cardHandle = root.querySelector(
      `[data-lily-kanban-board-card-handle][data-lily-kanban-board-card-id="${escapeAttrValue(cardId)}"]`,
    );
    const cardTitle = textOf(cardHandle);
    const columnTitle = columnTitleFor(toColumnId);
    if (typeof opts.onMove === "function") opts.onMove(cardId, toColumnId);
    const moveAnnouncement = opts.labels && opts.labels.moveAnnouncement;
    if (typeof moveAnnouncement === "function") {
      announce(moveAnnouncement(cardTitle, columnTitle));
    }
  }

  function chooseOption(cardId, index) {
    const entry = menus.get(cardId);
    if (!entry) return;
    const options = Array.from(entry.list.querySelectorAll('[role="option"]'));
    const option = options[index];
    if (option) applyMove(cardId, option.getAttribute("data-value"));
    closeMenu(cardId, true);
  }

  // -----------------------------------------------------------------
  // Move button open/close (click) — delegated once at the root.
  // -----------------------------------------------------------------

  function onRootClick(event) {
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
    if (t && (entry.list.contains(t) || entry.button.contains(t))) return;
    closeMenu(openCardId, false);
  }

  function onRootFocusOut(event) {
    if (!openCardId) return;
    const entry = menus.get(openCardId);
    if (!entry) return;
    const next = event.relatedTarget;
    if (next && (entry.list.contains(next) || entry.button.contains(next))) return;
    closeMenu(openCardId, false);
  }

  // -----------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // -----------------------------------------------------------------

  function onGridKeydown(event) {
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    const row = Number(cell.getAttribute("data-row"));
    const col = Number(cell.getAttribute("data-col"));
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
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
  // Pointer drag-and-drop (supplementary, never the only move path)
  // -----------------------------------------------------------------

  let draggingCardId = null;

  function onDragStart(event) {
    const handle =
      event.target && event.target.closest
        ? event.target.closest("[data-lily-kanban-board-card-handle]")
        : null;
    if (!handle) return;
    draggingCardId = handle.getAttribute("data-lily-kanban-board-card-id");
    if (event.dataTransfer) event.dataTransfer.setData("text/plain", draggingCardId || "");
  }

  function onDragOver(event) {
    if (!draggingCardId) return;
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    event.preventDefault();
  }

  function onDrop(event) {
    const cell =
      event.target && event.target.closest
        ? event.target.closest("[data-row][data-col]")
        : null;
    if (!cell) return;
    event.preventDefault();
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
    applyMove(cardId, toColumnId);
  }

  table.addEventListener("keydown", onGridKeydown);
  root.addEventListener("click", onRootClick);
  root.addEventListener("focusout", onRootFocusOut);
  root.addEventListener("dragstart", onDragStart);
  root.addEventListener("dragover", onDragOver);
  root.addEventListener("drop", onDrop);
  document.addEventListener("click", onDocumentClick);

  return {
    destroy: () => {
      menus.forEach((entry) => entry.keyboard.destroy());
      table.removeEventListener("keydown", onGridKeydown);
      root.removeEventListener("click", onRootClick);
      root.removeEventListener("focusout", onRootFocusOut);
      root.removeEventListener("dragstart", onDragStart);
      root.removeEventListener("dragover", onDragOver);
      root.removeEventListener("drop", onDrop);
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
