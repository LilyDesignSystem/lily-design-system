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
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText } from "./export-data";
import { highlightSegments, matchesSearch as wordsMatch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove, pageStepFor } from "./grid-navigation";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState } from "./typeahead";
import { civilDateToDate } from "./cell-types";
import { dependencyPath, weekdayOfEpochDay } from "./dependency-arrows";

// Optional: fills each leaf task's `critical` / `slack` (shared/critical-path.ts); the template renders them.
export { applyCriticalPath, criticalPath } from "./critical-path";
import {
  draftOf,
  editorKind,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText,
  neighbourField,
  resolveFields,
} from "./typed-fields";

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
 *   onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void,
 *   fieldHooks?: Record<string, Record<string, unknown>>,
 *   onFieldEdit?: (edit: { taskId: string, fieldId: string, value: unknown, previous: unknown }) => void,
 *   onExport?: (file: { format: string, filename: string, taskCount: number, blob: Blob }) => boolean | void,
 *   onTaskSelect?: (taskId: string | undefined) => void,
 *   labels?: {
 *     zoomAnnouncement?: (timeUnit: string) => string,
 *     baselineSummary?: (taskLabel: string, baseline: { start: string, end: string }, varianceDays: number) => string,
 *     columnLabel?: (start: string, end: string, timeUnit: string) => string,
 *     dateAnnouncement?: (taskLabel: string, start: string, end: string) => string,
 *   },
 *   markers?: Array<{ date: string, kind?: string, label?: string }>,
 *   isNonWorking?: (isoDate: string) => boolean,
 *   weekends?: number[],
 *   dependencyArrows?: boolean,
 * }=} opts
 *
 * `weekends` is a list of weekdays (0 = Sunday … 6 = Saturday), never defaulted, that marks day columns
 * `data-weekend` on the header and every cell. `dependencyArrows` draws an aria-hidden SVG arrow per
 * dependency, by its type, measured from the rendered cells; the text description remains.
 * @returns {{ destroy: () => void, getSelectedTaskId: () => string | undefined, collapsedTaskIds: () => string[] }}
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
  let timeUnit = root.getAttribute("data-lily-gantt-chart-time-unit") || "day";
  const today = root.getAttribute("data-lily-gantt-chart-today") || "";

  let columns = generateColumns(range, timeUnit);
  const readonly = root.hasAttribute("data-readonly");

  // The macro's typed fields, label templates and the tasks' data, read from the root.
  let config = {};
  try {
    config = JSON.parse(root.getAttribute("data-lily-gantt-chart-config") || "{}");
  } catch {
    config = {};
  }
  // Type defaults (format, compare, export value) resolved once per init, never per task or keystroke.
  // `opts.fieldHooks` carries the functions the macro cannot (a field's `parse`, `exportValue`, …), by field id.
  const fields = resolveFields(
    (config.fields || []).map((f) => ({ ...f, ...((opts.fieldHooks || {})[f.id] || {}) })),
    config.locale,
  );

  // Markers and the consumer's working calendar, resolved once per column (again after a zoom).
  let columnMarkers = [];
  let columnNonWorking = [];
  let columnWeekend = [];
  function resolveColumns() {
    columns = generateColumns(range, timeUnit);
    columnMarkers = columns.map((column) =>
      (Array.isArray(opts.markers) ? opts.markers : []).filter((m) =>
        rangesOverlap(column.start, column.end, m.date, m.date),
      ),
    );
    columnWeekend = columns.map((column) => {
      if (!Array.isArray(opts.weekends) || !opts.weekends.length || column.start !== column.end) return false;
      const day = parseIsoDate(column.start);
      return !!day && opts.weekends.includes(weekdayOfEpochDay(toEpochDay(day)));
    });
    columnNonWorking = columns.map((column) => {
      if (typeof opts.isNonWorking !== "function") return false;
      for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
        if (!opts.isNonWorking(d)) return false;
      }
      return true;
    });
  }
  resolveColumns();

  // -----------------------------------------------------------------
  // Header — one <th> per generated column, appended after the
  // macro's own leading blank <th>.
  // -----------------------------------------------------------------

  function buildHeader() {
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
    if (columnNonWorking[index]) th.setAttribute("data-non-working", "");
    if (columnWeekend[index]) th.setAttribute("data-weekend", "");
    const markers = columnMarkers[index];
    if (markers.length) th.setAttribute("data-marker", markers.map((m) => m.kind || "marker").join(" "));
    const columnLabelFn = opts.labels && opts.labels.columnLabel;
    th.appendChild(
      document.createTextNode(
        typeof columnLabelFn === "function" ? columnLabelFn(column.start, column.end, timeUnit) : column.start,
      ),
    );
    markers.forEach((marker) => {
      if (!marker.label) return;
      const span = document.createElement("span");
      span.className = "gantt-chart-marker-label";
      span.textContent = marker.label;
      th.appendChild(span);
    });
    headerRow.appendChild(th);
  });
  }
  buildHeader();

  // -----------------------------------------------------------------
  // Zoom: month <-> week <-> day. Re-derives the columns, the header and every row's cells.
  // -----------------------------------------------------------------

  const ZOOM_ORDER = ["month", "week", "day"];

  function syncZoomButtons() {
    const index = ZOOM_ORDER.indexOf(timeUnit);
    const out = root.querySelector("[data-lily-gantt-chart-zoom-out]");
    const inn = root.querySelector("[data-lily-gantt-chart-zoom-in]");
    if (out) out.disabled = index <= 0;
    if (inn) inn.disabled = index >= ZOOM_ORDER.length - 1;
  }

  function zoom(delta) {
    const next = ZOOM_ORDER[ZOOM_ORDER.indexOf(timeUnit) + delta];
    if (!next) return;
    timeUnit = next;
    root.setAttribute("data-lily-gantt-chart-time-unit", next);
    resolveColumns();
    buildHeader();
    rebuildGrid();
    syncZoomButtons();
    const fn = opts.labels && opts.labels.zoomAnnouncement;
    if (typeof fn === "function" && statusEl) statusEl.textContent = fn(next);
  }

  // -----------------------------------------------------------------
  // Row helpers
  // -----------------------------------------------------------------

  // Every task row and every edit row, captured once, in document order: the DOM holds only what is shown (a collapsed
  // subtree's rows, and with `virtualize` the rows out of view, leave it), but their dates still count toward their
  // ancestors' derived range and they come back when needed.
  const allRows = Array.from(tbody.querySelectorAll(":scope > .gantt-table-tr[data-lily-gantt-chart-task-id]"));
  const rowById = new Map(allRows.map((row) => [row.getAttribute("data-lily-gantt-chart-task-id"), row]));
  const editRows = new Map(
    Array.from(tbody.querySelectorAll(":scope > .gantt-chart-edit-row")).map((row) => [
      row.getAttribute("data-lily-gantt-chart-task-id"),
      row,
    ]),
  );
  /** Rows a collapsed ancestor hides. */
  const removedRows = new Set();
  /** Rows the search leaves out (kept apart from `removedRows`, which a collapsed ancestor owns). */
  const searchHidden = new Set();

  /** The rows that are shown, in order: every row except the ones a collapsed ancestor hides. */
  function visibleTaskRows() {
    return allRows.filter((row) => !removedRows.has(row) && !searchHidden.has(row));
  }

  function taskRowFor(taskId) {
    return rowById.get(taskId) || null;
  }

  /**
   * A parent's start/end are derived from its descendants (min start / max
   * end). The server derived them once; a change applied here must derive
   * them again, or a parent's bar goes stale after its child moves. A
   * `parentId` cycle cannot recurse forever: a row already on the walk is
   * read as a leaf.
   */
  function recomputeParentRanges() {
    const childrenOf = new Map();
    rowById.forEach((row) => {
      const parentId = row.getAttribute("data-lily-gantt-chart-parent-id") || "";
      if (!parentId || !rowById.has(parentId)) return;
      if (!childrenOf.has(parentId)) childrenOf.set(parentId, []);
      childrenOf.get(parentId).push(row);
    });
    const onWalk = new Set();
    function visit(row) {
      const id = row.getAttribute("data-lily-gantt-chart-task-id");
      const children = childrenOf.get(id) || [];
      const own = {
        start: row.getAttribute("data-lily-gantt-chart-start") || "",
        end: row.getAttribute("data-lily-gantt-chart-end") || "",
      };
      if (children.length === 0 || onWalk.has(id)) return own;
      onWalk.add(id);
      let start = "";
      let end = "";
      children.forEach((child) => {
        const r = visit(child);
        if (!r.start) return; // an unscheduled child does not shape its parent's span
        if (!start || compareISO(r.start, start) < 0) start = r.start;
        if (!end || compareISO(r.end, end) > 0) end = r.end;
      });
      onWalk.delete(id);
      row.setAttribute("data-lily-gantt-chart-start", start);
      row.setAttribute("data-lily-gantt-chart-end", end);
      return { start, end };
    }
    rowById.forEach((row) => visit(row));
  }

  function editRowFor(taskId) {
    return editRows.get(taskId) || null;
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

  /** The hidden baseline summary (text for the row's cells), refreshed whenever the row's dates change. */
  function ensureBaselineSummary(row, taskId, start, end, baselineStart, baselineEnd) {
    const summaryFn = opts.labels && opts.labels.baselineSummary;
    const existing = row.querySelector("[data-lily-gantt-chart-baseline-summary]");
    if (typeof summaryFn !== "function" || !baselineStart || !baselineEnd) {
      if (existing) existing.remove();
      return null;
    }
    const a = parseIsoDate(baselineEnd);
    const c = parseIsoDate(end);
    const variance = a && c ? toEpochDay(c) - toEpochDay(a) : 0;
    const span = existing || document.createElement("span");
    span.id = `${root.id || "gantt-chart"}-baseline-${taskId}`;
    span.className = "gantt-chart-baseline-summary";
    span.hidden = true;
    span.setAttribute("data-lily-gantt-chart-baseline-summary", "");
    span.textContent = summaryFn(
      row.getAttribute("data-lily-gantt-chart-task-label") || "",
      { start: baselineStart, end: baselineEnd },
      variance,
    );
    if (!existing) {
      const th = row.querySelector(".gantt-table-th");
      if (th) th.appendChild(span);
    }
    return span;
  }

  /** Row → the index its cells were built for; a row whose cells are current is not built again. */
  let built = new Map();

  function rebuildGrid() {
    const rows = visibleTaskRows();
    focusedRow = Math.min(Math.max(focusedRow, 0), Math.max(rows.length - 1, 0));
    focusedCol = Math.min(Math.max(focusedCol, 0), Math.max(columns.length - 1, 0));
    built = new Map();
    applyWindow(true);
  }

  /** The timeline cells of one row, built from the row's own data attributes. */
  function buildCells(row, rowIndex) {
    {
      Array.from(row.querySelectorAll(":scope > .gantt-table-td[data-col]")).forEach((el) => el.remove());
      const start = row.getAttribute("data-lily-gantt-chart-start") || "";
      const end = row.getAttribute("data-lily-gantt-chart-end") || "";
      const taskId = row.getAttribute("data-lily-gantt-chart-task-id") || "";
      const hasChildren = row.hasAttribute("data-lily-gantt-chart-has-children");
      const percentAttr = row.getAttribute("data-lily-gantt-chart-percent-complete");
      const depSpan = row.querySelector("[data-lily-gantt-chart-dependency-summary]");
      const baselineStart = row.getAttribute("data-lily-gantt-chart-baseline-start") || "";
      const baselineEnd = row.getAttribute("data-lily-gantt-chart-baseline-end") || "";
      const hasBaseline = baselineStart !== "" && baselineEnd !== "";
      const baselineSpan = ensureBaselineSummary(row, taskId, start, end, baselineStart, baselineEnd);
      const describedBy = [depSpan ? depSpan.id : "", baselineSpan ? baselineSpan.id : ""]
        .filter(Boolean)
        .join(" ");

      columns.forEach((column, colIndex) => {
        const inRange = !!start && !!end && rangesOverlap(column.start, column.end, start, end);
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
        if (columnNonWorking[colIndex]) td.setAttribute("data-non-working", "");
        if (columnWeekend[colIndex]) td.setAttribute("data-weekend", "");
        if (columnMarkers[colIndex].length) td.setAttribute("data-marker", "");
        if (describedBy) td.setAttribute("aria-describedby", describedBy);
        if (hasBaseline && rangesOverlap(column.start, column.end, baselineStart, baselineEnd)) {
          td.setAttribute("data-baseline", "");
        }

        if (isLeading) {
          const bar = document.createElement("span");
          bar.className = "gantt-chart-bar";
          bar.setAttribute("data-lily-gantt-chart-bar", "");
          bar.setAttribute("data-lily-gantt-chart-task-id", taskId);
          if (percentAttr != null && percentAttr !== "") bar.setAttribute("data-percent-complete", percentAttr);
          if (!hasChildren && !readonly) {
            bar.setAttribute("draggable", "true");
            const startHandle = document.createElement("span");
            startHandle.className = "gantt-chart-bar-handle gantt-chart-bar-handle-start";
            startHandle.setAttribute("draggable", "true");
            startHandle.setAttribute("aria-hidden", "true");
            startHandle.setAttribute("data-lily-gantt-chart-handle", "start");
            startHandle.setAttribute("data-lily-gantt-chart-task-id", taskId);
            bar.appendChild(startHandle);
          }
          td.appendChild(bar);
        }
        if (!hasChildren && !readonly && inRange && rangesOverlap(column.start, column.end, end, end)) {
          const endHandle = document.createElement("span");
          endHandle.className = "gantt-chart-bar-handle gantt-chart-bar-handle-end";
          endHandle.setAttribute("draggable", "true");
          endHandle.setAttribute("aria-hidden", "true");
          endHandle.setAttribute("data-lily-gantt-chart-handle", "end");
          endHandle.setAttribute("data-lily-gantt-chart-task-id", taskId);
          td.appendChild(endHandle);
        }

        row.appendChild(td);
      });
      if (virtualEl) row.setAttribute("aria-rowindex", String(rowIndex + 2));
    }
  }

  // -----------------------------------------------------------------
  // Virtualization: every row is rendered by the macro; only the rows in view (plus the roving tab stop's row) stay in
  // the DOM, between spacer rows, and only those get their cells built. Without `virtualize` every shown row is in the DOM.
  // -----------------------------------------------------------------

  const virtualEl = root.querySelector("[data-lily-gantt-chart-virtualize]");
  const rowHeight = virtualEl ? Number(virtualEl.getAttribute("data-row-height")) : 0;
  const overscan = virtualEl ? Number(virtualEl.getAttribute("data-overscan") || 3) : 0;
  const viewHeight = virtualEl ? parseFloat(virtualEl.style.height) || 0 : 0;
  let scrollTopState = 0;
  let windowSig = null;

  function windowIndices(count) {
    if (!virtualEl || !rowHeight) return Array.from({ length: count }, (_, i) => i);
    const start = Math.max(0, Math.floor(scrollTopState / rowHeight) - overscan);
    const end = Math.min(count, Math.ceil((scrollTopState + viewHeight) / rowHeight) + overscan);
    const indices = new Set();
    for (let i = start; i < end; i++) indices.add(i);
    if (count > 0) indices.add(Math.min(focusedRow, count - 1));
    return Array.from(indices).sort((a, b) => a - b);
  }

  /** Put the right rows in the tbody, building the cells of any that have none yet. */
  function applyWindow(force) {
    const logical = visibleTaskRows();
    const indices = windowIndices(logical.length);
    const sig = indices.join(",") + "|" + logical.length + "|" + columns.length;
    if (!force && sig === windowSig) return;
    windowSig = sig;
    const hadFocus = !!document.activeElement && tbody.contains(document.activeElement);
    const focused = hadFocus ? document.activeElement : null;
    const spacer = (count) => {
      const tr = document.createElement("tr");
      tr.className = "gantt-chart-spacer";
      tr.setAttribute("aria-hidden", "true");
      tr.style.height = `${count * rowHeight}px`;
      const td = document.createElement("td");
      td.colSpan = columns.length + 1 + fields.length;
      tr.appendChild(td);
      return tr;
    };
    const desired = [];
    let previous = -1;
    for (const index of indices) {
      if (virtualEl && index - previous > 1) desired.push(spacer(index - previous - 1));
      const row = logical[index];
      if (built.get(row) !== index) {
        buildCells(row, index);
        built.set(row, index);
      }
      desired.push(row);
      const editRow = editRows.get(row.getAttribute("data-lily-gantt-chart-task-id"));
      if (editRow) desired.push(editRow);
      previous = index;
    }
    if (virtualEl && logical.length - 1 - previous > 0) desired.push(spacer(logical.length - 1 - previous));
    // Reconcile in place so a row that stays keeps its focus: drop what is not wanted, then add what is missing.
    const wanted = new Set(desired);
    Array.from(tbody.children).forEach((child) => {
      if (!wanted.has(child)) child.remove();
    });
    let cursor = tbody.firstElementChild;
    for (const node of desired) {
      if (cursor === node) cursor = cursor.nextElementSibling;
      else tbody.insertBefore(node, cursor);
    }
    if (virtualEl) table.setAttribute("aria-rowcount", String(logical.length + 1));
    if (focused && focused.isConnected === false) focused.focus({ preventScroll: true });
    measureArrows();
  }

  // -----------------------------------------------------------------
  // Dependency arrows — an aria-hidden SVG overlay measured from the rendered cells,
  // rebuilt after every window change and when the table's own size changes.
  // -----------------------------------------------------------------

  let arrowObserver;
  let observedTable = null;
  function measureArrows() {
    if (observedTable !== table) {
      if (arrowObserver) arrowObserver.disconnect();
      arrowObserver = undefined;
      observedTable = table;
      if (opts.dependencyArrows && typeof ResizeObserver !== "undefined") {
        // Observing fires a first callback; it re-measures but never re-observes (same table).
        arrowObserver = new ResizeObserver(() => measureArrows());
        arrowObserver.observe(table);
      }
    }
    const host = table.parentElement;
    if (!host) return;
    const old = host.querySelector(".gantt-chart-dependency-arrows");
    if (old) old.remove();
    if (!opts.dependencyArrows) return;
    host.style.position = "relative";
    const rect = host.getBoundingClientRect();
    const dx = host.scrollLeft - rect.left;
    const dy = host.scrollTop - rect.top;
    const boxes = new Map();
    tbody.querySelectorAll("tr[data-lily-gantt-chart-task-id]").forEach((tr) => {
      const cells = tr.querySelectorAll("td[data-in-range]");
      if (!cells.length) return;
      const first = cells[0].getBoundingClientRect();
      const last = cells[cells.length - 1].getBoundingClientRect();
      boxes.set(tr.getAttribute("data-lily-gantt-chart-task-id"), { left: first.left + dx, right: last.right + dx, top: first.top + dy, bottom: first.bottom + dy });
    });
    const paths = [];
    boxes.forEach((to, id) => {
      const task = (config.tasks || []).find((t) => t.id === id);
      (task && task.dependsOn ? task.dependsOn : []).forEach((dep) => {
        const predecessorId = typeof dep === "string" ? dep : dep.id;
        const from = boxes.get(predecessorId);
        if (!from) return;
        const kind = (typeof dep === "string" ? undefined : dep.type) || "e2s";
        paths.push({ from: predecessorId, to: id, kind, d: dependencyPath(kind, from, to) });
      });
    });
    if (!paths.length) return;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "gantt-chart-dependency-arrows");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", String(host.scrollWidth));
    svg.setAttribute("height", String(host.scrollHeight));
    svg.setAttribute("style", "position:absolute;left:0;top:0;pointer-events:none");
    const headId = `${table.id || "gantt-chart"}-arrowhead-${Math.abs(paths.length)}`;
    const defs = document.createElementNS(NS, "defs");
    const marker = document.createElementNS(NS, "marker");
    Object.entries({ id: headId, markerWidth: "6", markerHeight: "6", refX: "6", refY: "3", orient: "auto", markerUnits: "userSpaceOnUse" }).forEach(([n, v]) => marker.setAttribute(n, v));
    const head = document.createElementNS(NS, "path");
    head.setAttribute("d", "M0 0L6 3L0 6z");
    head.setAttribute("fill", "currentColor");
    marker.appendChild(head);
    defs.appendChild(marker);
    svg.appendChild(defs);
    paths.forEach((p) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("class", "gantt-chart-dependency-arrow");
      path.setAttribute("data-from", p.from);
      path.setAttribute("data-to", p.to);
      path.setAttribute("data-dependency-type", p.kind);
      path.setAttribute("d", p.d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("marker-end", `url(#${headId})`);
      svg.appendChild(path);
    });
    host.appendChild(svg);
  }

  /** Bring a row into the scroll area. */
  function revealRow(rowIndex) {
    if (!virtualEl || !rowHeight) return;
    const top = rowIndex * rowHeight;
    let next = scrollTopState;
    if (top < scrollTopState) next = top;
    else if (top + rowHeight > scrollTopState + viewHeight) next = top + rowHeight - viewHeight;
    if (next === scrollTopState) return;
    scrollTopState = next;
    virtualEl.scrollTop = next;
  }

  function onScroll() {
    scrollTopState = virtualEl.scrollTop;
    applyWindow(false);
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
    revealRow(clampedRow);
    applyWindow(false);
    const target = table.querySelector(`.gantt-table-td[data-row="${clampedRow}"][data-col="${clampedCol}"]`);
    if (target) {
      target.setAttribute("tabindex", "0");
      target.focus({ preventScroll: true });
    }
  }

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  function onGridFocusin(event) {
    const cell = event.target && event.target.closest ? event.target.closest("[data-row][data-col]") : null;
    if (!cell) return;
    const current = table.querySelector('.gantt-table-td[tabindex="0"]');
    if (current && current !== cell) current.setAttribute("tabindex", "-1");
    cell.setAttribute("tabindex", "0");
    focusedRow = Number(cell.getAttribute("data-row"));
    focusedCol = Number(cell.getAttribute("data-col"));
  }

  /** Escape in an open edit region cancels it, unless a date picker used it to close its own dialog. */
  function onTbodyKeydown(event) {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    const editRow = event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-edit-row]") : null;
    if (!editRow) return;
    event.preventDefault();
    cancelEdit(editRow.getAttribute("data-lily-gantt-chart-task-id"));
  }

  let typeahead = { prefix: "", at: 0 };

  function onGridKeydown(event) {
    if (event.target && event.target.closest && event.target.closest(".gantt-chart-field-editor")) return;
    const cell = event.target && event.target.closest ? event.target.closest("[data-row][data-col]") : null;
    if (!cell) return;
    const row = Number(cell.getAttribute("data-row"));
    const col = Number(cell.getAttribute("data-col"));
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const key = logicalKey(event.key, isRtl(cell));
    const historyAction = config.editableFields && !readonly ? historyKey(event) : null;
    if (historyAction) {
      event.preventDefault();
      stepHistory(historyAction);
      return;
    }
    if (event.key === "F2") {
      // F2: edit the task's first editable field (the keyboard twin of clicking its value).
      if (editFirstField(visibleTaskRows()[row])) event.preventDefault();
      return;
    }
    if (event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
      // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
      const taskRow = visibleTaskRows()[row];
      if (taskRow && !taskRow.hasAttribute("data-lily-gantt-chart-has-children") && !readonly && event.target.closest(".gantt-table-td")) {
        event.preventDefault();
        shiftTask(taskRow, key === "ArrowLeft" ? -1 : 1, event.shiftKey);
        return;
      }
    }
    // Type-ahead in the focused column's row labels; "s" stays the select shortcut unless a prefix is in progress.
    if (isTypeaheadKey(event) && !event.altKey) {
      const now = Date.now();
      const continuing = typeahead.prefix !== "" && now - typeahead.at <= 700;
      if (continuing || !(event.key === "s" || event.key === "S")) {
        const state = nextTypeaheadState(typeahead, event.key, now, 700);
        const rows = visibleTaskRows();
        const hit = findTypeaheadMatch(rows.map((r) => labelOf(r.getAttribute("data-lily-gantt-chart-task-id"))), row, state.prefix);
        if (hit !== -1) {
          typeahead = state;
          event.preventDefault();
          moveFocus(hit, col);
          return;
        }
      }
    }
    const move = gridMove(
      event,
      { row, col },
      { firstRow: 0, lastRow: visibleTaskRows().length - 1, lastCol: columns.length - 1, pageStep: pageStepFor(virtualEl ? { height: viewHeight, rowHeight } : undefined), rtl: isRtl(cell) },
    );
    if (move) {
      event.preventDefault();
      moveFocus(move.row, move.col);
      return;
    }
    switch (key) {
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
      case "s":
      case "S": {
        if (event.ctrlKey || event.metaKey || event.altKey) break;
        const taskRow = visibleTaskRows()[row];
        if (taskRow && event.target.closest(".gantt-table-td")) {
          event.preventDefault();
          selectTask(taskRow.getAttribute("data-lily-gantt-chart-task-id"));
        }
        break;
      }
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

  /** @type {Map<string, Element[]>} taskId -> the rows hidden while it is collapsed. */
  const collapsedChildren = new Map();

  /** The rows under `row`: the run after it in document order whose depth is greater. */
  function descendantsOf(row) {
    const depth = Number(row.getAttribute("data-lily-gantt-chart-depth") || "0");
    const out = [];
    for (let i = allRows.indexOf(row) + 1; i < allRows.length; i++) {
      if (Number(allRows[i].getAttribute("data-lily-gantt-chart-depth") || "0") <= depth) break;
      out.push(allRows[i]);
    }
    return out;
  }

  function collapseRow(taskId, row) {
    const removed = descendantsOf(row);
    removed.forEach((r) => removedRows.add(r));
    collapsedChildren.set(taskId, removed);
  }

  function expandRow(taskId) {
    const removed = collapsedChildren.get(taskId);
    if (!removed) return;
    collapsedChildren.delete(taskId);
    // A row stays hidden while another collapsed ancestor still covers it.
    const stillCovered = new Set(Array.from(collapsedChildren.values()).flat());
    removed.forEach((r) => {
      if (!stillCovered.has(r)) removedRows.delete(r);
    });
  }

  /** Collapse or expand one parent (its button, when it has one, follows). Does not rebuild the grid. */
  function setCollapsed(taskId, collapsed) {
    const row = taskRowFor(taskId);
    if (!row || !row.hasAttribute("data-lily-gantt-chart-has-children")) return;
    if (collapsedChildren.has(taskId) === collapsed) return;
    if (collapsed) collapseRow(taskId, row);
    else expandRow(taskId);
    const button = row.querySelector("[data-lily-gantt-chart-collapse-button]");
    if (button) {
      const label = row.getAttribute("data-lily-gantt-chart-task-label") || "";
      const raw = button.getAttribute(collapsed ? "data-lily-gantt-chart-expand-label" : "data-lily-gantt-chart-collapse-label") || "";
      button.setAttribute("aria-expanded", String(!collapsed));
      button.setAttribute("aria-label", applyTemplate(raw, label));
    }
  }

  /** Every task that has children, in document order (rows leave the DOM when collapsed, `rowById` keeps them). */
  const parentTaskIds = () =>
    Array.from(rowById.entries())
      .filter(([, row]) => row.hasAttribute("data-lily-gantt-chart-has-children"))
      .map(([id]) => id);
  const collapsedTaskIds = () => parentTaskIds().filter((id) => collapsedChildren.has(id));

  const expandAllButton = root.querySelector("[data-lily-gantt-chart-expand-all]");
  const collapseAllButton = root.querySelector("[data-lily-gantt-chart-collapse-all]");
  function syncCollapseAllButtons() {
    const parents = parentTaskIds();
    if (expandAllButton) expandAllButton.disabled = collapsedTaskIds().length === 0;
    if (collapseAllButton) collapseAllButton.disabled = parents.every((id) => collapsedChildren.has(id));
  }

  function reportCollapsed() {
    const ids = collapsedTaskIds();
    if (typeof opts.onCollapsedTaskIdsChange === "function") opts.onCollapsedTaskIdsChange(ids);
    root.dispatchEvent(new CustomEvent("collapsechange", { detail: ids, bubbles: true }));
    syncCollapseAllButtons();
  }

  function onCollapseButtonClick(button) {
    const taskId = button.getAttribute("data-lily-gantt-chart-task-id");
    if (!taskId) return;
    setCollapsed(taskId, button.getAttribute("aria-expanded") === "true");
    rebuildGrid();
    reportCollapsed();
  }

  /** Collapse every parent deepest-first (so each still sits in the DOM), or expand parents-first (so each does). */
  function setAllCollapsed(collapsed) {
    const ids = parentTaskIds();
    (collapsed ? ids.slice().reverse() : ids).forEach((id) => setCollapsed(id, collapsed));
    rebuildGrid();
    reportCollapsed();
  }

  // -----------------------------------------------------------------
  // Selection (click or the `s` key); Alt+Arrow shift / resize
  // -----------------------------------------------------------------

  function selectedId() {
    const row = allRows.find((r) => r.hasAttribute("data-selected"));
    return row ? row.getAttribute("data-lily-gantt-chart-task-id") : undefined;
  }

  function selectTask(taskId) {
    const was = selectedId();
    rowById.forEach((row) => {
      row.removeAttribute("aria-selected");
      row.removeAttribute("data-selected");
    });
    const next = was === taskId ? undefined : taskId;
    if (next) {
      const row = taskRowFor(next);
      if (row) {
        row.setAttribute("aria-selected", "true");
        row.setAttribute("data-selected", "");
      }
    }
    if (typeof opts.onTaskSelect === "function") opts.onTaskSelect(next);
    root.dispatchEvent(new CustomEvent("taskselect", { detail: next, bubbles: true }));
  }

  function columnIndexOf(iso) {
    return columns.findIndex((c) => rangesOverlap(c.start, c.end, iso, iso));
  }

  function shiftTask(taskRow, delta, endOnly) {
    const taskId = taskRow.getAttribute("data-lily-gantt-chart-task-id");
    const start = taskRow.getAttribute("data-lily-gantt-chart-start") || "";
    const end = taskRow.getAttribute("data-lily-gantt-chart-end") || "";
    if (!start || !end) return; // an unscheduled task has nothing to shift
    if (endOnly) {
      const target = columns[columnIndexOf(end) + delta];
      if (target && compareISO(start, target.end) <= 0) applyChange(taskId, start, target.end);
      return;
    }
    const target = columns[columnIndexOf(start) + delta];
    if (!target) return;
    applyChange(taskId, target.start, addDays(target.start, daysBetween(start, end)));
  }

  function onTbodyClick(event) {
    const clicked = event.target && event.target.closest ? event.target : null;
    if (clicked && !clicked.closest("button, input, select, [data-lily-gantt-chart-edit-row]") && !clicked.closest("[data-lily-date-time-picker-root]")) {
      const taskRow = clicked.closest(".gantt-table-tr[data-lily-gantt-chart-task-id]");
      if (taskRow) selectTask(taskRow.getAttribute("data-lily-gantt-chart-task-id"));
    }
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
    if (cell) cell.colSpan = columns.length + 1 + fields.length;

    const percentInput = editRow.querySelector("[data-lily-gantt-chart-percent-input]");
    if (percentInput) {
      const row = taskRowFor(taskId);
      const current = row ? row.getAttribute("data-lily-gantt-chart-percent-complete") : null;
      percentInput.value = current == null ? "" : current;
    }

    editRow.hidden = false;
    // Save is disabled while either date is empty.
    const saveButton = editRow.querySelector("[data-lily-gantt-chart-save-button]");
    let startController = null;
    let endController = null;
    const syncSave = () => {
      if (!saveButton || !startController || !endController) return;
      saveButton.disabled = !startController.getValue() || !endController.getValue();
    };
    startController = initDateTimePicker(startRoot, { onChange: () => syncSave() });
    endController = initDateTimePicker(endRoot, { onChange: () => syncSave() });
    syncSave(); // an unscheduled task opens with both dates empty
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

  function applyChange(taskId, start, end, percentComplete) {
    if (!taskId || !start || !end) return;
    const row = taskRowFor(taskId);
    if (!row) return;
    row.setAttribute("data-lily-gantt-chart-start", start);
    row.setAttribute("data-lily-gantt-chart-end", end);
    row.removeAttribute("data-unscheduled"); // scheduling an unscheduled task
    if (percentComplete !== undefined) row.setAttribute("data-lily-gantt-chart-percent-complete", String(percentComplete));
    recomputeParentRanges();
    if (typeof opts.onTaskChange === "function") {
      if (percentComplete === undefined) opts.onTaskChange(taskId, start, end);
      else opts.onTaskChange(taskId, start, end, percentComplete);
    }
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
    const a = entry.startController.getValue();
    const b = entry.endController.getValue();
    if (!a || !b) return;
    // A range entered end-first is saved start-first.
    const [start, end] = compareISO(a, b) <= 0 ? [a, b] : [b, a];
    const percentInput = editRowFor(taskId)?.querySelector("[data-lily-gantt-chart-percent-input]");
    const raw = percentInput ? percentInput.value : "";
    const rounded = raw === "" ? NaN : Math.min(100, Math.max(0, Math.round(Number(raw))));
    closeEdit(taskId);
    applyChange(taskId, start, end, Number.isFinite(rounded) ? rounded : undefined);
  }

  function cancelEdit(taskId) {
    closeEdit(taskId);
  }

  // -----------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only reschedule
  // path) — preserves the task's own duration.
  // -----------------------------------------------------------------

  let draggingTaskId = null;

  /** Which edge of the dragged task's bar is being resized, or null for a whole-bar move. */
  let resizingEdge = null;

  function onDragStart(event) {
    const handle = event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-handle]") : null;
    if (handle) {
      event.stopPropagation();
      draggingTaskId = handle.getAttribute("data-lily-gantt-chart-task-id");
      resizingEdge = handle.getAttribute("data-lily-gantt-chart-handle");
      if (event.dataTransfer) event.dataTransfer.setData("text/plain", draggingTaskId || "");
      return;
    }
    const bar = event.target && event.target.closest ? event.target.closest("[data-lily-gantt-chart-bar]") : null;
    if (!bar) return;
    resizingEdge = null;
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
    if (readonly) return;
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
    const edge = resizingEdge;
    resizingEdge = null;
    if (!start || !end) return; // an unscheduled task has no bar to drag
    if (edge) {
      // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
      const edgeStart = edge === "start" ? column.start : start;
      const edgeEnd = edge === "end" ? column.end : end;
      if (compareISO(edgeStart, edgeEnd) <= 0 && (edgeStart !== start || edgeEnd !== end)) applyChange(taskId, edgeStart, edgeEnd);
      return;
    }
    const duration = daysBetween(start, end);
    const newStart = column.start;
    const newEnd = addDays(newStart, duration);
    applyChange(taskId, newStart, newEnd);
  }

  // -----------------------------------------------------------------
  // Wire everything up
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Typed fields, inline editing, export (the macro's `fields`, `editableFields` and export labels)
  // -----------------------------------------------------------------

  const fieldDef = (id) => fields.find((f) => f.id === id);
  /** The consumer's data by task id; an accepted edit updates it, so the chart stays what the user sees. */
  const dataTasks = new Map((config.tasks || []).map((t) => [t.id, { ...t, values: { ...(t.values || {}) } }]));
  const fill = (template, tokens) => String(template).replace(/\{(\w+)\}/g, (match, name) => (name in tokens ? String(tokens[name]) : match));
  const labelOf = (taskId) => {
    const row = taskRowFor(taskId);
    return (row && row.getAttribute("data-lily-gantt-chart-task-label")) || taskId;
  };
  const announce = (message) => {
    if (message && statusEl) statusEl.textContent = message;
  };
  const fieldCellOf = (row, fieldId) =>
    Array.from(row.querySelectorAll("[data-lily-gantt-chart-field-cell]")).find((td) => td.getAttribute("data-field") === fieldId) || null;

  /** A label as text: the client option's function wins, else the macro's template string. */
  function labelText(name, tokens, ...args) {
    const fn = opts.labels && opts.labels[name];
    if (typeof fn === "function") return fn(...args);
    const template = (config.labels || {})[name];
    return template ? fill(template, tokens) : undefined;
  }

  const searchInput = root.querySelector("[data-lily-gantt-chart-search]");
  const taskSearchText = (row) => {
    const id = row.getAttribute("data-lily-gantt-chart-task-id");
    const data = dataTasks.get(id);
    return [labelOf(id), ...(data ? fields.map((f) => fieldText(f, data.values)) : [])].join(" ");
  };
  const searchMatches = (row) => !searchInput || searchInput.value.trim() === "" || wordsMatch(taskSearchText(row), searchInput.value);

  /** Wrap the matched words of each task label in `<mark class="mark gantt-chart-match">`; plain text when not searching. */
  function highlightLabels(query) {
    const searching = query.trim() !== "";
    allRows.forEach((row) => {
      const host = row.querySelector("[data-lily-gantt-chart-task-label-text]");
      if (!host) return;
      if (!host.hasAttribute("data-original-label")) host.setAttribute("data-original-label", host.textContent || "");
      const original = host.getAttribute("data-original-label") || "";
      if (!searching && !host.querySelector("mark")) return;
      host.replaceChildren(
        ...(!searching
          ? [document.createTextNode(original)]
          : highlightSegments(original, query).map((part) => {
              if (!part.match) return document.createTextNode(part.text);
              const mark = document.createElement("mark");
              mark.className = "mark gantt-chart-match";
              mark.textContent = part.text;
              return mark;
            })),
      );
    });
  }

  function applySearch() {
    searchHidden.clear();
    allRows.forEach((row) => {
      if (!searchMatches(row)) searchHidden.add(row);
    });
    highlightLabels(searchInput ? searchInput.value : "");
    rebuildGrid();
    syncExport();
  }

  function syncExport() {
    const disabled = visibleTaskRows().length === 0;
    root.querySelectorAll("[data-gantt-export-format]").forEach((b) => {
      b.disabled = disabled;
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applySearch();
      const matched = allRows.length - searchHidden.size;
      announce(labelText("searchAnnouncement", { matched, total: allRows.length }, matched, allRows.length));
    });
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || searchInput.value === "") return;
      event.preventDefault();
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  /** Show each field's value formatted by its type: the server rendered the raw value. */
  function formatFields() {
    allRows.forEach((row) => {
      const data = dataTasks.get(row.getAttribute("data-lily-gantt-chart-task-id"));
      if (!data) return;
      row.querySelectorAll("[data-lily-gantt-chart-field-cell]").forEach((td) => {
        const f = fieldDef(td.getAttribute("data-field"));
        if (!f) return;
        const button = td.querySelector("[data-lily-gantt-chart-field-button]");
        const text = fieldText(f, data.values);
        if (button) button.textContent = text;
        else td.textContent = text;
      });
    });
  }

  /** @type {{ taskId: string, fieldId: string, draft: unknown, editor: HTMLElement, button: HTMLElement } | null} */
  let editingField = null;

  function startFieldEdit(taskId, fieldId) {
    const f = fieldDef(fieldId);
    const row = taskRowFor(taskId);
    if (!f || !row || readonly) return;
    const td = fieldCellOf(row, fieldId);
    const button = td && td.querySelector("[data-lily-gantt-chart-field-button]");
    if (!td || !button) return;
    if (editingField) commitFieldEdit(false);
    const data = dataTasks.get(taskId);
    const kind = editorKind(f);
    let editor;
    if (kind === "select" || kind === "radio") {
      editor = document.createElement("select");
      const blank = document.createElement("option");
      blank.value = "";
      editor.appendChild(blank);
      for (const option of f.options || []) {
        const o = document.createElement("option");
        o.value = option.id;
        o.disabled = !!option.disabled;
        o.textContent = option.label;
        editor.appendChild(o);
      }
    } else {
      editor = document.createElement("input");
      editor.type = kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text";
      if (kind === "number") editor.setAttribute("inputmode", "decimal");
    }
    editor.className = "gantt-chart-field-editor";
    editor.setAttribute("aria-label", f.editLabel || f.header);
    const draft = draftOf(f, data ? data.values : undefined);
    editor.value = String(draft == null ? "" : draft);
    editingField = { taskId, fieldId, draft: editor.value, editor, button };
    editor.addEventListener("input", () => {
      if (editingField) editingField.draft = editor.value;
      editor.removeAttribute("aria-invalid");
    });
    editor.addEventListener("keydown", onFieldEditorKeydown);
    if (kind === "select" || kind === "radio") {
      editor.addEventListener("change", () => {
        if (editingField) editingField.draft = editor.value;
        if (commitFieldEdit()) focusActiveCell();
      });
    }
    editor.addEventListener("blur", () => commitFieldEdit());
    button.replaceWith(editor);
    editor.focus({ preventScroll: true });
    if (editor.tagName === "INPUT" && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
  }

  /** Put the value button back in place of the editor. */
  function closeFieldEditor() {
    if (!editingField) return null;
    const closing = editingField;
    editingField = null;
    closing.editor.replaceWith(closing.button);
    return closing;
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  function commitFieldEdit() {
    if (!editingField) return true;
    const { taskId, fieldId, draft } = editingField;
    const f = fieldDef(fieldId);
    const data = dataTasks.get(taskId);
    if (!f || !data) {
      closeFieldEditor();
      return true;
    }
    const outcome = evaluateEdit(f, data.values, draft);
    if (outcome.invalid) {
      editingField.editor.setAttribute("aria-invalid", "true");
      const refused = outcome.message
        ? labelText("editRefused", { task: labelOf(taskId), field: f.header, message: outcome.message }, labelOf(taskId), f.header, outcome.message)
        : undefined;
      const template = (config.labels || {}).editInvalid;
      announce(refused ?? (template ? fill(template, { task: labelOf(taskId), field: f.header }) : undefined));
      return false;
    }
    const closing = closeFieldEditor();
    if (outcome.changed) {
      data.values[fieldId] = outcome.value;
      history = recordEdit(history, { ownerId: taskId, fieldId, value: outcome.value, previous: outcome.previous });
      if (closing) closing.button.textContent = outcome.text;
      const edit = { taskId, fieldId, value: outcome.value, previous: outcome.previous };
      if (typeof opts.onFieldEdit === "function") opts.onFieldEdit(edit);
      root.dispatchEvent(new CustomEvent("fieldedit", { detail: edit, bubbles: true }));
      const template = (config.labels || {}).editAnnouncement;
      if (template) announce(fill(template, { task: labelOf(taskId), field: f.header, value: outcome.text }));
    }
    return true;
  }

  /** Accepted field edits for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `onFieldEdit` / `fieldedit`. */
  let history = EMPTY_HISTORY;

  function stepHistory(direction) {
    const step = direction === "undo" ? undoEdit(history) : redoEdit(history);
    if (!step.record) return;
    history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const f = fieldDef(fieldId);
    const data = dataTasks.get(ownerId);
    const row = taskRowFor(ownerId);
    if (!f || !data || !row) return;
    const restored = direction === "undo" ? previous : value;
    data.values[fieldId] = restored;
    const text = fieldText(f, data.values);
    const td = fieldCellOf(row, fieldId);
    const valueEl = td && (td.querySelector("[data-lily-gantt-chart-field-button]") || td);
    if (valueEl) valueEl.textContent = text;
    const edit = { taskId: ownerId, fieldId, value: restored, previous: direction === "undo" ? value : previous };
    if (typeof opts.onFieldEdit === "function") opts.onFieldEdit(edit);
    root.dispatchEvent(new CustomEvent("fieldedit", { detail: edit, bubbles: true }));
    const name = direction === "undo" ? "fieldUndoAnnouncement" : "fieldRedoAnnouncement";
    announce(labelText(name, { task: labelOf(ownerId), field: f.header, value: text }, labelOf(ownerId), f.header, text));
  }

  function cancelFieldEdit() {
    if (closeFieldEditor()) focusActiveCell();
  }

  function onFieldEditorKeydown(event) {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (commitFieldEdit()) focusActiveCell();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelFieldEdit();
    } else if (event.key === "Tab" && editingField) {
      // Tab commits and moves to the task's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const { taskId, fieldId } = editingField;
      const row = taskRowFor(taskId);
      const editable = row
        ? Array.from(row.querySelectorAll("[data-lily-gantt-chart-field-cell]"))
            .filter((td) => td.querySelector("[data-lily-gantt-chart-field-button], .gantt-chart-field-editor"))
            .map((td) => fieldDef(td.getAttribute("data-field")))
            .filter(Boolean)
        : [];
      const next = neighbourField(editable, fieldId, event.shiftKey);
      if (next) {
        event.preventDefault();
        if (commitFieldEdit()) startFieldEdit(taskId, next.id);
      } else {
        commitFieldEdit();
      }
    }
  }

  /** F2 on a task's row: edit its first editable field. */
  function editFirstField(taskRow) {
    const button = taskRow && taskRow.querySelector("[data-lily-gantt-chart-field-button]");
    if (!button) return false;
    startFieldEdit(taskRow.getAttribute("data-lily-gantt-chart-task-id"), button.getAttribute("data-field-id"));
    return true;
  }

  async function finishCopy(table) {
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    root.dispatchEvent(new CustomEvent("copy", { detail: copied, bubbles: true }));
    if (typeof opts.onCopy === "function" && opts.onCopy(copied) === false) return;
    const ok = await copyToClipboard(text);
    announce(ok ? labelText("copyAnnouncement", { count: table.rows.length }, table.rows.length) : labelText("copyFailed", {}));
  }

  function runExport(format) {
    const h = (config.labels || {}).exportHeaders;
    if (!h) return;
    const exportRows = config.exportScope === "visible" ? visibleTaskRows() : allRows.filter((row) => !searchHidden.has(row));
    const exportFields = exportableFields(fields);
    const headers = [h.task, h.start, h.end];
    if (h.percentComplete) headers.push(h.percentComplete);
    if (h.parent) headers.push(h.parent);
    if (h.dependsOn) headers.push(h.dependsOn);
    if (h.baselineStart) headers.push(h.baselineStart);
    if (h.baselineEnd) headers.push(h.baselineEnd);
    for (const f of exportFields) headers.push(f.header);
    const exportDate = (iso) => (iso ? civilDateToDate(iso) : null);
    const body = exportRows.map((row) => {
      const taskId = row.getAttribute("data-lily-gantt-chart-task-id");
      const data = dataTasks.get(taskId) || { id: taskId, label: labelOf(taskId), values: {} };
      const start = row.getAttribute("data-lily-gantt-chart-start") || "";
      const end = row.getAttribute("data-lily-gantt-chart-end") || "";
      const cells = [labelOf(taskId), exportDate(start), exportDate(end)];
      if (h.percentComplete) {
        const raw = row.getAttribute("data-lily-gantt-chart-percent-complete");
        cells.push(raw == null || raw === "" ? null : Number(raw));
      }
      if (h.parent) cells.push(data.parentId != null && rowById.has(data.parentId) ? labelOf(data.parentId) : null);
      if (h.dependsOn) {
        cells.push(
          (data.dependsOn || [])
            .map((dep) => {
              const id = typeof dep === "string" ? dep : dep.id;
              return rowById.has(id) ? labelOf(id) : id;
            })
            .join("; "),
        );
      }
      if (h.baselineStart) cells.push(exportDate(data.baseline && data.baseline.start));
      if (h.baselineEnd) cells.push(exportDate(data.baseline && data.baseline.end));
      for (const f of exportFields) cells.push(exportFieldCell(f, data.values));
      return cells;
    });
    if (format === "copy") {
      void finishCopy({ headers, rows: body });
      return;
    }
    const base = config.exportFilename || "gantt-chart";
    const filename = exportFilename(base, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: base });
    const file = { format, filename, taskCount: body.length, blob };
    root.dispatchEvent(new CustomEvent("exportfile", { detail: file, bubbles: true }));
    if (typeof opts.onExport === "function" && opts.onExport(file) === false) return;
    downloadBlob(blob, filename);
    const template = (config.labels || {}).exportAnnouncement;
    if (template) announce(fill(template, { count: body.length, format, filename }));
  }

  table.addEventListener("keydown", onGridKeydown);
  table.addEventListener("focusin", onGridFocusin);
  tbody.addEventListener("keydown", onTbodyKeydown);
  tbody.addEventListener("click", onTbodyClick);
  table.addEventListener("dragstart", onDragStart);
  table.addEventListener("dragover", onDragOver);
  table.addEventListener("drop", onDrop);

  function onRootClick(event) {
    const t = event.target && event.target.closest ? event.target : null;
    if (!t) return;
    const fieldButton = t.closest("[data-lily-gantt-chart-field-button]");
    const exportButton = t.closest("[data-gantt-export-format]");
    if (fieldButton) startFieldEdit(fieldButton.getAttribute("data-lily-gantt-chart-task-id"), fieldButton.getAttribute("data-field-id"));
    else if (exportButton) runExport(exportButton.getAttribute("data-gantt-export-format"));
    else if (t.closest("[data-lily-gantt-chart-expand-all]")) setAllCollapsed(false);
    else if (t.closest("[data-lily-gantt-chart-collapse-all]")) setAllCollapsed(true);
    else if (t.closest("[data-lily-gantt-chart-zoom-in]")) zoom(1);
    else if (t.closest("[data-lily-gantt-chart-zoom-out]")) zoom(-1);
  }
  root.addEventListener("click", onRootClick);
  if (virtualEl) virtualEl.addEventListener("scroll", onScroll);

  // Show each field's value formatted by its type, then build the grid.
  formatFields();
  if (searchInput && searchInput.value.trim() !== "") applySearch();
  else rebuildGrid();
  syncZoomButtons();
  const initialSelected = root.getAttribute("data-lily-gantt-chart-selected-task-id");
  if (initialSelected) {
    const row = taskRowFor(initialSelected);
    if (row) {
      row.setAttribute("aria-selected", "true");
      row.setAttribute("data-selected", "");
    }
  }

  // Parents the macro rendered collapsed (`collapsedTaskIds`): take their descendants out now, deepest-first.
  parentTaskIds()
    .slice()
    .reverse()
    .forEach((id) => {
      const button = taskRowFor(id).querySelector("[data-lily-gantt-chart-collapse-button]");
      if (root.getAttribute("data-lily-gantt-chart-collapsed-ids")?.split(",").includes(id) || (button && button.getAttribute("aria-expanded") === "false")) {
        setCollapsed(id, true);
      }
    });
  rebuildGrid();
  syncCollapseAllButtons();

  return {
    getSelectedTaskId: selectedId,
    collapsedTaskIds,
    destroy: () => {
      root.removeEventListener("click", onRootClick);
      if (virtualEl) virtualEl.removeEventListener("scroll", onScroll);
      if (arrowObserver) arrowObserver.disconnect();
      openEdits.forEach((entry) => {
        entry.startController.destroy();
        entry.endController.destroy();
      });
      openEdits.clear();
      table.removeEventListener("keydown", onGridKeydown);
      table.removeEventListener("focusin", onGridFocusin);
      tbody.removeEventListener("keydown", onTbodyKeydown);
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
