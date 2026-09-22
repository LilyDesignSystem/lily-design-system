// GanttChart client-side runtime.
//
// Pairs with gantt-chart.njk. That macro renders every piece of markup
// whose content is fixed at render time (root wrapper, status region,
// the table's leading header cell, one <tr> per task in hierarchy
// order with its row header and, for editable leaf tasks, an inline
// edit region composing @lilydesignsystem/nunjucks-date-time-picker
// TWICE) and leaves the rest to this module, because it needs real
// civil-date arithmetic Nunjucks cannot do — see gantt-chart.njk's own
// header comment for the full account. This module owns:
//
// A. Generating the `range`/`timeUnit` column list (UTC/epoch-day
//    arithmetic, reusing @lilydesignsystem/nunjucks-date-time-picker's
//    exported `addDays`/`parseIsoDate`/`formatIsoDate`/`daysInMonth`/
//    `toEpochDay` rather than re-deriving them) and building the date
//    column <th> cells.
// B. Building every body <td> cell in every row — data-in-range,
//    data-milestone, data-today, the task bar (data-percent-complete,
//    draggable) — from each row's own `data-lily-gantt-chart-start`/
//    `-end`/`-percent-complete` attributes, which the macro already
//    resolved (a parent row's are the derived min/max of its
//    descendants; see gantt-chart.njk's recursive row walk). Rebuilt
//    whenever the visible row list changes (collapse/expand) or a
//    task's dates change (edit save, drag-drop) — see rebuildGrid().
// C. WAI-ARIA APG Grid roving-tabindex keyboard navigation across the
//    body cells, the vanilla-DOM translation of the same model
//    kanban-board.client.js and data-grid use, scoped to the CURRENTLY
//    VISIBLE row list (collapse/expand changes it) rather than a
//    static row count.
// D. Row collapse/expand: removes/restores descendant <tr> elements
//    (and their own edit-row <tr>, if any) from the DOM OUTRIGHT —
//    never just hidden — the same "remove, don't just hide" rule
//    data-grid applies to hidden columns. Descendants of a row are
//    exactly its contiguous run of next-siblings whose own
//    data-lily-gantt-chart-depth is greater than the row's own, so no
//    separate tree structure needs rebuilding here — see collapseRow().
// E. The inline edit region: lazily calls `initDateTimePicker` (from
//    @lilydesignsystem/nunjucks-date-time-picker) on each of the two
//    composed pickers EVERY time a row's edit region opens, and
//    `destroy()`s both when it closes (Save or Cancel). That
//    package's client.js exposes no imperative "reset to this value"
//    call, so a fresh init/destroy pair each session is how this
//    module resets the two fields to the task's own original
//    start/end before every edit — see openEdit()'s own comment.
// F. Native HTML5 drag-and-drop as a SUPPLEMENTARY reschedule path —
//    never the only one; the edit region in (E) is the accessible
//    path, openable by Enter/Space with no pointer involved at all.
// G. One shared aria-live status announcement per successful edit
//    (Save or drag-drop), built from `opts.labels.dateAnnouncement`.
//
// See spec/index.md §4.3 (client.js exports), §6 (behaviour), §10
// (why this module, not the macro, owns the grid body).

import {
  addDays,
  parseIsoDate,
  formatIsoDate,
  daysInMonth,
  toEpochDay,
  initDateTimePicker,
} from "@lilydesignsystem/nunjucks-date-time-picker";

// ---------------------------------------------------------------------
// Civil-date arithmetic not already exported by date-time-picker.
// `addDays`/`parseIsoDate`/`formatIsoDate`/`daysInMonth`/`toEpochDay`
// above are REUSED, not re-derived — see spec/index.md §3 and this
// package's AGENTS.md "Nunjucks gotchas". Only what date-time-picker
// does not itself need (whole-range comparison, end-of-month, column
// generation, overlap testing) is ported here, from the Svelte
// canonical's <script module> block.
// ---------------------------------------------------------------------

/** -1 / 0 / 1. Ordinary string comparison works for zero-padded ISO dates. */
export function compareISO(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The last day of the calendar month `iso` falls in, UTC-safe. */
export function endOfMonth(iso) {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return formatIsoDate({
    year: parsed.year,
    month: parsed.month,
    day: daysInMonth(parsed.year, parsed.month),
  });
}

/** Whether `[aStart, aEnd]` and `[bStart, bEnd]` (inclusive) overlap. */
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

/** Generate the fixed set of columns a `range`/`timeUnit` pair produces. */
export function generateColumns(range, timeUnit) {
  const columns = [];
  let cursor = range.start;
  let guard = 0;
  while (compareISO(cursor, range.end) <= 0 && guard < 10000) {
    guard += 1;
    let periodEnd;
    if (timeUnit === "day") periodEnd = cursor;
    else if (timeUnit === "week") periodEnd = addDays(cursor, 6);
    else periodEnd = endOfMonth(cursor);
    if (compareISO(periodEnd, range.end) > 0) periodEnd = range.end;
    columns.push({ start: cursor, end: periodEnd });
    cursor = addDays(periodEnd, 1);
  }
  return columns;
}

/** Whole days between two ISO dates (`end` minus `start`). */
function daysBetween(startIso, endIso) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return 0;
  return toEpochDay(end) - toEpochDay(start);
}

function escapeAttrValue(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

function applyTemplate(template, taskLabel) {
  return String(template || "").replace("{task}", taskLabel);
}

/**
 * Wire one rendered GanttChart root.
 *
 * @param {HTMLElement} root - The `[data-lily-gantt-chart-root]`.
 * @param {{
 *   onTaskChange?: (taskId: string, start: string, end: string) => void,
 *   labels?: {
 *     columnLabel?: (start: string, end: string, timeUnit: string) => string,
 *     dateAnnouncement?: (taskLabel: string, start: string, end: string) => string,
 *   },
 * }=} opts
 * @returns {{ destroy: () => void }}
 */
export function initGanttChart(root, opts = {}) {
  const noop = { destroy: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const table = root.querySelector(".gantt-table");
  const thead = root.querySelector(".gantt-table-thead");
  const headerRow = root.querySelector("[data-lily-gantt-chart-header-row]");
  const tbody = root.querySelector(".gantt-table-tbody");
  const statusEl = root.querySelector("[data-lily-gantt-chart-status]");
  if (!table || !thead || !headerRow || !tbody) return noop;

  const range = {
    start: root.getAttribute("data-lily-gantt-chart-range-start") || "",
    end: root.getAttribute("data-lily-gantt-chart-range-end") || "",
  };
  const timeUnit = root.getAttribute("data-lily-gantt-chart-time-unit") || "day";
  const today = root.getAttribute("data-lily-gantt-chart-today") || "";

  const columns = generateColumns(range, timeUnit);

  // -----------------------------------------------------------------
  // Header — one <th> per generated column, appended after the
  // macro's own leading blank <th>.
  // -----------------------------------------------------------------

  Array.from(headerRow.querySelectorAll(".gantt-table-th[data-lily-gantt-chart-column-index]")).forEach((el) =>
    el.remove(),
  );
  columns.forEach((column, index) => {
    const th = document.createElement("th");
    th.className = "gantt-table-th";
    th.setAttribute("scope", "col");
    th.setAttribute("data-lily-gantt-chart-column-index", String(index));
    if (today && rangesOverlap(column.start, column.end, today, today)) {
      th.setAttribute("data-today", "");
    }
    const columnLabelFn = opts.labels && opts.labels.columnLabel;
    th.textContent = typeof columnLabelFn === "function" ? columnLabelFn(column.start, column.end, timeUnit) : column.start;
    headerRow.appendChild(th);
  });

  // -----------------------------------------------------------------
  // Row helpers
  // -----------------------------------------------------------------

  function visibleTaskRows() {
    return Array.from(tbody.querySelectorAll(":scope > .gantt-table-tr[data-lily-gantt-chart-task-id]"));
  }

  function taskRowFor(taskId) {
    return tbody.querySelector(
      `.gantt-table-tr[data-lily-gantt-chart-task-id="${escapeAttrValue(taskId)}"]`,
    );
  }

  function editRowFor(taskId) {
    return tbody.querySelector(
      `.gantt-chart-edit-row[data-lily-gantt-chart-task-id="${escapeAttrValue(taskId)}"]`,
    );
  }

  // -----------------------------------------------------------------
  // Grid body — every <td> in every visible row. Rebuilt wholesale on
  // any change (collapse/expand, a saved edit, a drop) rather than
  // patched incrementally: the state this depends on (which rows are
  // visible, and each one's own start/end) already lives entirely in
  // the DOM's data attributes, so a full rebuild is cheap and never
  // drifts out of sync with it.
  // -----------------------------------------------------------------

  /** The roving-tabindex cursor, as an index into the CURRENT visible row list. */
  let focusedRow = 0;
  let focusedCol = 0;

  function rebuildGrid() {
    const rows = visibleTaskRows();
    focusedRow = Math.min(Math.max(focusedRow, 0), Math.max(rows.length - 1, 0));
    focusedCol = Math.min(Math.max(focusedCol, 0), Math.max(columns.length - 1, 0));

    rows.forEach((row, rowIndex) => {
      Array.from(row.querySelectorAll(".gantt-table-td")).forEach((el) => el.remove());
      const start = row.getAttribute("data-lily-gantt-chart-start") || "";
      const end = row.getAttribute("data-lily-gantt-chart-end") || "";
      const taskId = row.getAttribute("data-lily-gantt-chart-task-id") || "";
      const hasChildren = row.hasAttribute("data-lily-gantt-chart-has-children");
      const percentAttr = row.getAttribute("data-lily-gantt-chart-percent-complete");
      const depSpan = row.querySelector("[data-lily-gantt-chart-dependency-summary]");
      const describedBy = depSpan ? depSpan.id : "";

      columns.forEach((column, colIndex) => {
        const inRange = rangesOverlap(column.start, column.end, start, end);
        const isMilestone = inRange && start === end;
        const isToday = today !== "" && rangesOverlap(column.start, column.end, today, today);
        const isLeading = inRange && rangesOverlap(column.start, column.end, start, start);

        const td = document.createElement("td");
        td.className = "gantt-table-td";
        td.setAttribute("data-row", String(rowIndex));
        td.setAttribute("data-col", String(colIndex));
        td.setAttribute("tabindex", rowIndex === focusedRow && colIndex === focusedCol ? "0" : "-1");
        if (inRange) td.setAttribute("data-in-range", "");
        if (isMilestone) td.setAttribute("data-milestone", "");
        if (isToday) td.setAttribute("data-today", "");
        if (describedBy) td.setAttribute("aria-describedby", describedBy);

        if (isLeading) {
          const bar = document.createElement("span");
          bar.className = "gantt-chart-bar";
          bar.setAttribute("data-lily-gantt-chart-bar", "");
          bar.setAttribute("data-lily-gantt-chart-task-id", taskId);
          if (percentAttr != null && percentAttr !== "") bar.setAttribute("data-percent-complete", percentAttr);
          if (!hasChildren) bar.setAttribute("draggable", "true");
          td.appendChild(bar);
        }

        row.appendChild(td);
      });
    });
  }

  // -----------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // -----------------------------------------------------------------

  function focusActiveCell() {
    const target = table.querySelector('.gantt-table-td[tabindex="0"]');
    target?.focus({ preventScroll: true });
  }

  function moveFocus(row, col) {
    const rows = visibleTaskRows();
    const clampedRow = Math.min(Math.max(row, 0), Math.max(rows.length - 1, 0));
    const clampedCol = Math.min(Math.max(col, 0), Math.max(columns.length - 1, 0));
    const current = table.querySelector('.gantt-table-td[tabindex="0"]');
    if (current) current.setAttribute("tabindex", "-1");
    focusedRow = clampedRow;
    focusedCol = clampedCol;
    const target = table.querySelector(`.gantt-table-td[data-row="${clampedRow}"][data-col="${clampedCol}"]`);
    if (target) {
      target.setAttribute("tabindex", "0");
      target.focus({ preventScroll: true });
    }
  }

  function onGridKeydown(event) {
    const cell = event.target && event.target.closest ? event.target.closest("[data-row][data-col]") : null;
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
        else moveFocus(row, 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) moveFocus(visibleTaskRows().length - 1, columns.length - 1);
        else moveFocus(row, columns.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const rows = visibleTaskRows();
        const taskRow = rows[row];
        if (taskRow && !taskRow.hasAttribute("data-lily-gantt-chart-has-children")) {
          openEdit(taskRow.getAttribute("data-lily-gantt-chart-task-id"));
        }
        break;
      }
      default:
        break;
    }
  }

  // -----------------------------------------------------------------
  // Collapse / expand — removes/restores descendant <tr> (and their
  // own edit-row) from the DOM outright. Descendants of a row are
  // exactly the contiguous run of next-siblings whose own
  // data-lily-gantt-chart-depth is greater than the row's.
  // -----------------------------------------------------------------

  /** @type {Map<string, ChildNode[]>} taskId -> the nodes removed while collapsed. */
  const collapsedChildren = new Map();

  function collapseRow(taskId, row) {
    const depth = Number(row.getAttribute("data-lily-gantt-chart-depth") || "0");
    const removed = [];
    let node = row.nextElementSibling;
    while (node) {
      const isTaskRow = node.classList.contains("gantt-table-tr") && node.hasAttribute("data-lily-gantt-chart-task-id");
      const isEditRow = node.classList.contains("gantt-chart-edit-row");
      if (isTaskRow) {
        const d = Number(node.getAttribute("data-lily-gantt-chart-depth") || "0");
        if (d <= depth) break;
      } else if (!isEditRow) {
        break;
      }
      const next = node.nextElementSibling;
      node.remove();
      removed.push(node);
      node = next;
    }
    collapsedChildren.set(taskId, removed);
  }

  function expandRow(taskId, row) {
    const removed = collapsedChildren.get(taskId);
    if (!removed) return;
    const fragment = document.createDocumentFragment();
    removed.forEach((node) => fragment.appendChild(node));
    row.after(fragment);
    collapsedChildren.delete(taskId);
  }

  function onCollapseButtonClick(button) {
    const taskId = button.getAttribute("data-lily-gantt-chart-task-id");
    const row = taskId ? taskRowFor(taskId) : null;
    if (!taskId || !row) return;
    const label = row.getAttribute("data-lily-gantt-chart-task-label") || "";
    const collapseLabelRaw = button.getAttribute("data-lily-gantt-chart-collapse-label") || "";
    const expandLabelRaw = button.getAttribute("data-lily-gantt-chart-expand-label") || "";
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      collapseRow(taskId, row);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", applyTemplate(expandLabelRaw, label));
    } else {
      expandRow(taskId, row);
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", applyTemplate(collapseLabelRaw, label));
    }
    rebuildGrid();
  }

  function onTbodyClick(event) {
    const collapseButton =
      event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-collapse-button]") : null;
    if (collapseButton) {
      onCollapseButtonClick(collapseButton);
      return;
    }
    const saveButton =
      event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-save-button]") : null;
    if (saveButton) {
      saveEdit(saveButton.getAttribute("data-lily-gantt-chart-task-id"));
      return;
    }
    const cancelButton =
      event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-cancel-button]") : null;
    if (cancelButton) {
      cancelEdit(cancelButton.getAttribute("data-lily-gantt-chart-task-id"));
    }
  }

  // -----------------------------------------------------------------
  // Edit region — two composed DateTimePicker instances, initialised
  // fresh on every open and destroyed on every close. date-time-
  // picker's client.js exposes no "reset to this value" call, so
  // re-seeding the underlying hidden input + text field to the task's
  // ORIGINAL start/end (carried on the edit row as data attributes)
  // before each fresh init is how this module guarantees Cancel — or
  // simply re-opening — never shows a stale half-typed edit from a
  // previous session. See this file's header comment (E).
  // -----------------------------------------------------------------

  /** @type {Map<string, {startRoot: HTMLElement, endRoot: HTMLElement, startController: ReturnType<typeof initDateTimePicker>, endController: ReturnType<typeof initDateTimePicker>}>} */
  const openEdits = new Map();

  function resetPickerRoot(pickerRoot, value) {
    const hidden = pickerRoot.querySelector("[data-lily-date-time-picker-hidden-input]");
    const input = pickerRoot.querySelector("[data-lily-date-time-picker-input]");
    if (hidden) hidden.value = value || "";
    if (input) input.value = value || "";
  }

  function openEdit(taskId) {
    if (!taskId) return;
    const editRow = editRowFor(taskId);
    if (!editRow) return; // no edit row exists: dateTimePickerLabels was absent, or this is a parent row
    if (openEdits.has(taskId)) return; // already open

    const pickerRoots = Array.from(editRow.querySelectorAll("[data-lily-date-time-picker-root]"));
    const [startRoot, endRoot] = pickerRoots;
    if (!startRoot || !endRoot) return;

    const originalStart = editRow.getAttribute("data-lily-gantt-chart-original-start") || "";
    const originalEnd = editRow.getAttribute("data-lily-gantt-chart-original-end") || "";
    resetPickerRoot(startRoot, originalStart);
    resetPickerRoot(endRoot, originalEnd);

    const cell = editRow.querySelector("td");
    if (cell) cell.colSpan = columns.length + 1;

    editRow.hidden = false;
    const startController = initDateTimePicker(startRoot, {});
    const endController = initDateTimePicker(endRoot, {});
    openEdits.set(taskId, { startRoot, endRoot, startController, endController });

    const firstField = startRoot.querySelector("[data-lily-date-time-picker-input]");
    firstField?.focus?.({ preventScroll: true });
  }

  function closeEdit(taskId) {
    const entry = openEdits.get(taskId);
    if (!entry) return;
    entry.startController.destroy();
    entry.endController.destroy();
    openEdits.delete(taskId);
    const editRow = editRowFor(taskId);
    if (editRow) editRow.hidden = true;

    // Refocus the task's own grid cell — never leave focus stranded
    // inside a now-hidden row.
    const rows = visibleTaskRows();
    const row = taskRowFor(taskId);
    const rowIndex = row ? rows.indexOf(row) : -1;
    if (rowIndex >= 0) moveFocus(rowIndex, focusedCol);
    else focusActiveCell();
  }

  function applyChange(taskId, start, end) {
    if (!taskId || !start || !end) return;
    const row = taskRowFor(taskId);
    if (!row) return;
    row.setAttribute("data-lily-gantt-chart-start", start);
    row.setAttribute("data-lily-gantt-chart-end", end);
    if (typeof opts.onTaskChange === "function") opts.onTaskChange(taskId, start, end);
    const announceFn = opts.labels && opts.labels.dateAnnouncement;
    if (typeof announceFn === "function") {
      const taskLabel = row.getAttribute("data-lily-gantt-chart-task-label") || "";
      const message = announceFn(taskLabel, start, end);
      if (message && statusEl) statusEl.textContent = message;
    }
    rebuildGrid();
  }

  function saveEdit(taskId) {
    const entry = openEdits.get(taskId);
    if (!entry) return;
    const start = entry.startController.getValue();
    const end = entry.endController.getValue();
    closeEdit(taskId);
    applyChange(taskId, start, end);
  }

  function cancelEdit(taskId) {
    closeEdit(taskId);
  }

  // -----------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only reschedule
  // path) — preserves the task's own duration.
  // -----------------------------------------------------------------

  let draggingTaskId = null;

  function onDragStart(event) {
    const bar = event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-bar]") : null;
    if (!bar) return;
    draggingTaskId = bar.getAttribute("data-lily-gantt-chart-task-id");
    if (event.dataTransfer) event.dataTransfer.setData("text/plain", draggingTaskId || "");
  }

  function onDragOver(event) {
    if (!draggingTaskId) return;
    const cell = event.target && event.target.closest ? event.target.closest("[data-row][data-col]") : null;
    if (!cell) return;
    event.preventDefault();
  }

  function onDrop(event) {
    const cell = event.target && event.target.closest ? event.target.closest("[data-row][data-col]") : null;
    if (!cell) return;
    event.preventDefault();
    const taskId = draggingTaskId || (event.dataTransfer && event.dataTransfer.getData ? event.dataTransfer.getData("text/plain") : "");
    draggingTaskId = null;
    if (!taskId) return;
    const colIndex = Number(cell.getAttribute("data-col"));
    const column = columns[colIndex];
    const row = taskRowFor(taskId);
    if (!column || !row) return;
    const start = row.getAttribute("data-lily-gantt-chart-start") || "";
    const end = row.getAttribute("data-lily-gantt-chart-end") || "";
    const duration = daysBetween(start, end);
    const newStart = column.start;
    const newEnd = addDays(newStart, duration);
    applyChange(taskId, newStart, newEnd);
  }

  // -----------------------------------------------------------------
  // Wire everything up
  // -----------------------------------------------------------------

  table.addEventListener("keydown", onGridKeydown);
  tbody.addEventListener("click", onTbodyClick);
  table.addEventListener("dragstart", onDragStart);
  table.addEventListener("dragover", onDragOver);
  table.addEventListener("drop", onDrop);

  rebuildGrid();

  return {
    destroy: () => {
      openEdits.forEach((entry) => {
        entry.startController.destroy();
        entry.endController.destroy();
      });
      openEdits.clear();
      table.removeEventListener("keydown", onGridKeydown);
      tbody.removeEventListener("click", onTbodyClick);
      table.removeEventListener("dragstart", onDragStart);
      table.removeEventListener("dragover", onDragOver);
      table.removeEventListener("drop", onDrop);
    },
  };
}

/**
 * Find every `[data-lily-gantt-chart-root]` and wire it.
 *
 * @param {Parameters<typeof initGanttChart>[1]=} opts
 * @returns {Array<ReturnType<typeof initGanttChart>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(document.querySelectorAll("[data-lily-gantt-chart-root]"));
  return roots.map((root) => initGanttChart(root, opts));
}
