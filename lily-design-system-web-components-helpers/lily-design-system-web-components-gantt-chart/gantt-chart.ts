/**
 * `<lily-gantt-chart>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A headless Gantt chart: task bars as column-spanning grid cells
 * (never pixel-positioned floating divs), keyboard-accessible date
 * editing composed from `date-time-picker` (never arrow-key drag as the
 * only path), row hierarchy, milestones, percent-complete, a today
 * marker, and dependency data exposed as text (never a rendered arrow).
 *
 * Direct port of `@lilydesignsystem/svelte-gantt-chart`. Composes
 * `@lilydesignsystem/web-components-headless`'s `<lily-gantt-table>`
 * (unmodified — the consumer supplies `<thead>`/`<tbody>`/`<tr>`/`<th>`/
 * `<td>` as plain light-DOM children, this catalog has no
 * `GanttTableTD`-style sub-element family) and, twice per edit session,
 * the sibling helper `@lilydesignsystem/web-components-date-time-picker`
 * — the first Web Components helper-to-helper composition, the same
 * shape the Svelte/React/Vue/Angular ports already use.
 *
 * Imported here (not only from `index.ts`) so `lily-gantt-table` is
 * registered regardless of which module a consumer imports first.
 */

import "@lilydesignsystem/web-components-headless";
import "@lilydesignsystem/web-components-date-time-picker";
import {
  addDays,
  daysInMonth,
  formatIsoDate,
  parseIsoDate,
  toEpochDay,
} from "@lilydesignsystem/web-components-date-time-picker";
import type { DateTimePickerLabels } from "@lilydesignsystem/web-components-date-time-picker";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export type GanttTask = {
  /** Stable task identifier. */
  id: string;
  /** Visible task label. */
  label: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. */
  start: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. Equal to `start` means a milestone. */
  end: string;
  /** 0-100. Rendering the fill is the consumer's own CSS. */
  percentComplete?: number;
  /** Another task's id; builds the row hierarchy. */
  parentId?: string;
  /** Other tasks' ids this task depends on (finish-to-start). */
  dependsOn?: string[];
};

export type GanttTimeUnit = "day" | "week" | "month";

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other helper's
 * label-gating convention. See spec/index.md §5.
 *
 * `editButton`/`editDialogLabel` are accepted for API parity with the
 * canonical Svelte contract's own `GanttLabels` type, but — mirroring
 * that reference exactly — neither is wired to any rendered control
 * there either: editing opens from Enter/Space on the row itself, not
 * a dedicated button. Not a gap introduced by this port.
 */
export type GanttLabels = {
  columnLabel?: (start: string, end: string, timeUnit: GanttTimeUnit) => string;
  editButton?: (task: GanttTask) => string;
  editDialogLabel?: (task: GanttTask) => string;
  startLabel?: string;
  endLabel?: string;
  /** Reused for both composed DateTimePicker instances. Editing is gated on this. */
  dateTimePickerLabels?: DateTimePickerLabels;
  saveLabel?: string;
  cancelLabel?: string;
  dependencySummary?: (predecessorLabels: string[]) => string;
  dateAnnouncement?: (taskLabel: string, start: string, end: string) => string;
  collapseButton?: (task: GanttTask, collapsed: boolean) => string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type GanttChartProps = {
  /** Accessible name for the chart, passed through to `<lily-gantt-table>`. */
  label: string;
  /** Optional visible caption. */
  caption?: string;
  /** Property-only — the chart's own overall time range. */
  range: { start: string; end: string };
  /** Property-only — task data. */
  tasks: GanttTask[];
  /** Column granularity. A static rendering choice, not an interactive zoom control. */
  timeUnit?: GanttTimeUnit;
  /** ISO date marking "today"; never computed internally (stays SSR-safe). */
  today?: string;
  /** Property-only. Resolves a task to its display label. Defaults to `task.label`. */
  taskLabel?: (task: GanttTask) => string;
  /** Property-only. Called after a task's start/end changes, by pointer or the edit region. */
  onTaskChange?: (taskId: string, start: string, end: string) => void;
  /** Property-only. See GanttLabels — presence gates each control. */
  labels?: GanttLabels;
  class?: string;
};

// ---------------------------------------------------------------------
// Civil-date arithmetic
//
// `addDays`/`parseIsoDate`/`formatIsoDate`/`daysInMonth`/`toEpochDay`
// are REUSED from `@lilydesignsystem/web-components-date-time-picker`
// rather than re-derived (that package already went through the
// UTC/epoch-day-safe exercise; re-deriving here would be a second,
// divergence-prone implementation of the same rule). Only the two
// small helpers that package does not itself need — `compareISO` (a
// plain string comparison; ordinary comparison already works for
// zero-padded ISO dates) and `endOfMonth` (composed from the imported
// primitives) — are defined locally, matching the Svelte reference's
// own exported surface.
// ---------------------------------------------------------------------

/** -1 / 0 / 1, ordinary string comparison works for zero-padded ISO dates. */
export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The last day of the calendar month `iso` falls in, UTC-safe. */
export function endOfMonth(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return formatIsoDate({ year: date.year, month: date.month, day: daysInMonth(date.year, date.month) });
}

export type GanttColumn = { start: string; end: string };

/** Generate the fixed set of columns a `range`/`timeUnit` pair produces. */
export function generateColumns(
  range: { start: string; end: string },
  timeUnit: GanttTimeUnit,
): GanttColumn[] {
  const columns: GanttColumn[] = [];
  let cursor = range.start;
  let guard = 0;
  while (compareISO(cursor, range.end) <= 0 && guard < 10000) {
    guard += 1;
    let periodEnd: string;
    if (timeUnit === "day") periodEnd = cursor;
    else if (timeUnit === "week") periodEnd = addDays(cursor, 6);
    else periodEnd = endOfMonth(cursor);
    if (compareISO(periodEnd, range.end) > 0) periodEnd = range.end;
    columns.push({ start: cursor, end: periodEnd });
    cursor = addDays(periodEnd, 1);
  }
  return columns;
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

export type GanttFlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

/** Depth-first flatten of the parentId tree, skipping collapsed subtrees. */
export function flattenTasks(tasks: GanttTask[], collapsed: ReadonlySet<string>): GanttFlatRow[] {
  const childrenOf = new Map<string | undefined, GanttTask[]>();
  for (const task of tasks) {
    const key = task.parentId;
    const list = childrenOf.get(key) ?? [];
    list.push(task);
    childrenOf.set(key, list);
  }
  const rows: GanttFlatRow[] = [];
  function walk(parentId: string | undefined, depth: number): void {
    for (const task of childrenOf.get(parentId) ?? []) {
      const kids = childrenOf.get(task.id) ?? [];
      rows.push({ task, depth, hasChildren: kids.length > 0 });
      if (kids.length > 0 && !collapsed.has(task.id)) walk(task.id, depth + 1);
    }
  }
  walk(undefined, 0);
  return rows;
}

/** A parent's start/end are derived (min start / max end of descendants), never its own data. */
export function effectiveRange(task: GanttTask, allTasks: GanttTask[]): { start: string; end: string } {
  const children = allTasks.filter((t) => t.parentId === task.id);
  if (children.length === 0) return { start: task.start, end: task.end };
  let start = "";
  let end = "";
  for (const child of children) {
    const r = effectiveRange(child, allTasks);
    if (!start || compareISO(r.start, start) < 0) start = r.start;
    if (!end || compareISO(r.end, end) > 0) end = r.end;
  }
  return { start, end };
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextGanttChartId(): string {
  uid += 1;
  return `gantt-chart-${uid}`;
}

const HANDLED_ATTRS = new Set(["label", "caption", "class", "today", "time-unit"]);

/** See kanban-board.ts's identical helper for the rationale. */
function passThroughAttributes(host: Element, target: Element): void {
  for (const attr of Array.from(host.attributes)) {
    if (attr.name === "class" || HANDLED_ATTRS.has(attr.name)) continue;
    target.setAttribute(attr.name, attr.value);
  }
}

/** See kanban-board.ts's identical helper for the rationale — generalised to the two custom elements this component nests. */
function upgradeNestedCustomElements(root: ParentNode): void {
  root.querySelectorAll("lily-gantt-table, lily-date-time-picker").forEach((el) => {
    (el as HTMLElement & { connectedCallback?: () => void }).connectedCallback?.();
  });
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

type DateTimePickerElement = HTMLElement & {
  mode: string;
  value: string;
  labels: DateTimePickerLabels;
  onChange?: (value: string) => void;
};

// ---------------------------------------------------------------------
// Custom element
// ---------------------------------------------------------------------

/** Custom-element class implementing `<lily-gantt-chart>`. */
export class GanttChart extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["label", "caption", "today", "time-unit", "class"];
  }

  // ---- Backing storage for property-only members ----
  #range: { start: string; end: string } = { start: "", end: "" };
  #tasks: GanttTask[] = [];
  #taskLabel: (task: GanttTask) => string = (task) => task.label;
  #onTaskChange?: (taskId: string, start: string, end: string) => void;
  #labels: GanttLabels = {};

  // ---- Internal state ----
  #statusMessage = "";
  #collapsed = new Set<string>();
  #focusedRow = 0;
  #focusedCol = 0;
  #editingTaskId: string | null = null;
  #editStart = "";
  #editEnd = "";
  #draggingTaskId: string | null = null;

  readonly #baseId = nextGanttChartId();

  // ---- Rendered-DOM references ----
  #statusEl: HTMLParagraphElement | null = null;
  #cellEls = new Map<string, HTMLTableCellElement>(); // "row-col" -> td
  #rowEls = new Map<string, HTMLTableRowElement>(); // taskId -> tr
  #editRowEl: HTMLTableRowElement | null = null;

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

  get today(): string {
    return this.getAttribute("today") ?? "";
  }
  set today(v: string) {
    if (v) this.setAttribute("today", v);
    else this.removeAttribute("today");
  }

  get timeUnit(): GanttTimeUnit {
    const v = this.getAttribute("time-unit");
    return v === "week" || v === "month" ? v : "day";
  }
  set timeUnit(v: GanttTimeUnit) {
    this.setAttribute("time-unit", v);
  }

  get range(): { start: string; end: string } {
    return { ...this.#range };
  }
  set range(v: { start: string; end: string }) {
    this.#range = v ?? { start: "", end: "" };
    this.#render();
  }

  get tasks(): GanttTask[] {
    return [...this.#tasks];
  }
  set tasks(v: GanttTask[]) {
    this.#tasks = Array.isArray(v) ? v.slice() : [];
    this.#render();
  }

  get taskLabel(): (task: GanttTask) => string {
    return this.#taskLabel;
  }
  set taskLabel(fn: ((task: GanttTask) => string) | undefined) {
    this.#taskLabel = fn ?? ((task) => task.label);
    this.#render();
  }

  get onTaskChange(): ((taskId: string, start: string, end: string) => void) | undefined {
    return this.#onTaskChange;
  }
  set onTaskChange(fn: ((taskId: string, start: string, end: string) => void) | undefined) {
    this.#onTaskChange = fn;
  }

  get labels(): GanttLabels {
    return { ...this.#labels };
  }
  set labels(v: GanttLabels | undefined) {
    this.#labels = v ?? {};
    this.#render();
  }

  // ---- Lifecycle ----

  connectedCallback(): void {
    this.#render();
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "label" || name === "caption" || name === "today" || name === "time-unit" || name === "class") {
      this.#render();
    }
  }

  // ---- Derived data ----

  #gridColumns(): GanttColumn[] {
    return generateColumns(this.#range, this.timeUnit);
  }

  #gridRows(): GanttFlatRow[] {
    return flattenTasks(this.#tasks, this.#collapsed);
  }

  #rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
    return hasChildren ? effectiveRange(task, this.#tasks) : { start: task.start, end: task.end };
  }

  #predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((id) => {
      const predecessor = this.#tasks.find((t) => t.id === id);
      return predecessor ? this.#taskLabel(predecessor) : id;
    });
  }

  #dependencyId(taskId: string): string {
    return `${this.#baseId}-deps-${taskId}`;
  }

  #announce(message: string | undefined): void {
    if (!message) return;
    this.#statusMessage = message;
    if (this.#statusEl) this.#statusEl.textContent = message;
  }

  // ---------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------

  #toggleCollapse(taskId: string): void {
    const next = new Set(this.#collapsed);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    this.#collapsed = next;
    this.#render();
  }

  // ---------------------------------------------------------------
  // Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
  // ---------------------------------------------------------------

  #applyChange(task: GanttTask, start: string, end: string): void {
    this.#onTaskChange?.(task.id, start, end);
    this.#announce(this.#labels.dateAnnouncement?.(this.#taskLabel(task), start, end));
  }

  #openEdit(task: GanttTask): void {
    if (!this.#labels.dateTimePickerLabels) return;
    if (this.#editingTaskId) this.#closeEditRow();
    this.#editingTaskId = task.id;
    this.#editStart = task.start;
    this.#editEnd = task.end;
    this.#insertEditRow(task);
  }

  #insertEditRow(task: GanttTask): void {
    const taskRow = this.#rowEls.get(task.id);
    if (!taskRow) return;
    const dateTimePickerLabels = this.#labels.dateTimePickerLabels;
    if (!dateTimePickerLabels) return;

    const tr = document.createElement("tr");
    tr.className = "gantt-chart-edit-row";
    const td = document.createElement("td");
    td.colSpan = this.#gridColumns().length + 1;

    const startPicker = document.createElement("lily-date-time-picker") as DateTimePickerElement;
    startPicker.setAttribute("label", this.#labels.startLabel ?? "");
    startPicker.mode = "date";
    startPicker.labels = dateTimePickerLabels;
    startPicker.value = this.#editStart;
    startPicker.onChange = (value: string) => {
      this.#editStart = value;
    };
    td.appendChild(startPicker);

    const endPicker = document.createElement("lily-date-time-picker") as DateTimePickerElement;
    endPicker.setAttribute("label", this.#labels.endLabel ?? "");
    endPicker.mode = "date";
    endPicker.labels = dateTimePickerLabels;
    endPicker.value = this.#editEnd;
    endPicker.onChange = (value: string) => {
      this.#editEnd = value;
    };
    td.appendChild(endPicker);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "gantt-chart-save-button";
    saveButton.textContent = this.#labels.saveLabel ?? "";
    saveButton.addEventListener("click", () => this.#saveEdit(task));
    td.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "gantt-chart-cancel-button";
    cancelButton.textContent = this.#labels.cancelLabel ?? "";
    cancelButton.addEventListener("click", () => this.#cancelEdit());
    td.appendChild(cancelButton);

    tr.appendChild(td);
    taskRow.insertAdjacentElement("afterend", tr);
    upgradeNestedCustomElements(tr);
    this.#editRowEl = tr;
  }

  #saveEdit(task: GanttTask): void {
    this.#applyChange(task, this.#editStart, this.#editEnd);
    this.#closeEditRow();
  }

  #cancelEdit(): void {
    this.#closeEditRow();
  }

  #closeEditRow(): void {
    this.#editingTaskId = null;
    this.#editRowEl?.remove();
    this.#editRowEl = null;
  }

  #onBarDragStart = (task: GanttTask, event: DragEvent): void => {
    this.#draggingTaskId = task.id;
    event.dataTransfer?.setData("text/plain", task.id);
  };

  #onCellDragOver = (event: DragEvent): void => {
    if (this.#draggingTaskId) event.preventDefault();
  };

  #onCellDrop = (column: GanttColumn, event: DragEvent): void => {
    event.preventDefault();
    const taskId = this.#draggingTaskId ?? event.dataTransfer?.getData("text/plain");
    this.#draggingTaskId = null;
    const task = this.#tasks.find((t) => t.id === taskId);
    if (!task) return;
    const startDate = parseIsoDate(task.start);
    const endDate = parseIsoDate(task.end);
    const duration = startDate && endDate ? toEpochDay(endDate) - toEpochDay(startDate) : 0;
    this.#applyChange(task, column.start, addDays(column.start, duration));
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
    const rows = this.#gridRows();
    const columns = this.#gridColumns();
    const previousRow = this.#focusedRow;
    const previousCol = this.#focusedCol;
    this.#focusedRow = clamp(row, 0, Math.max(rows.length - 1, 0));
    this.#focusedCol = clamp(col, 0, Math.max(columns.length - 1, 0));
    if (this.#focusedRow === previousRow && this.#focusedCol === previousCol) return;
    this.#syncFocusState(previousRow, previousCol, true);
  }

  #onGridKeydown = (event: KeyboardEvent): void => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const rows = this.#gridRows();
    const columns = this.#gridColumns();
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
        else this.#moveFocus(this.#focusedRow, 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.#moveFocus(rows.length - 1, columns.length - 1);
        else this.#moveFocus(this.#focusedRow, columns.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const row = rows[this.#focusedRow];
        if (row && !row.hasChildren) this.#openEdit(row.task);
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

    // A structural rebuild cannot preserve an in-progress edit region.
    this.#editingTaskId = null;
    this.#editRowEl = null;

    const columns = this.#gridColumns();
    const rows = this.#gridRows();
    this.#focusedRow = clamp(this.#focusedRow, 0, Math.max(rows.length - 1, 0));
    this.#focusedCol = clamp(this.#focusedCol, 0, Math.max(columns.length - 1, 0));

    this.#cellEls = new Map();
    this.#rowEls = new Map();

    const extraClass = this.getAttribute("class") ?? "";
    const root = document.createElement("div");
    root.className = `gantt-chart ${extraClass}`.trim();
    passThroughAttributes(this, root);

    const table = document.createElement("lily-gantt-table");
    table.setAttribute("label", this.label);
    if (this.caption) {
      const captionEl = document.createElement("caption");
      captionEl.textContent = this.caption;
      table.appendChild(captionEl);
    }
    table.addEventListener("keydown", this.#onGridKeydown);

    const today = this.today || null;

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const leadingTh = document.createElement("th");
    leadingTh.className = "gantt-chart-th";
    leadingTh.setAttribute("scope", "col");
    headRow.appendChild(leadingTh);
    columns.forEach((column) => {
      const isToday = today != null && rangesOverlap(column.start, column.end, today, today);
      const th = document.createElement("th");
      th.className = "gantt-chart-th";
      th.setAttribute("scope", "col");
      if (isToday) th.setAttribute("data-today", "");
      th.textContent = this.#labels.columnLabel?.(column.start, column.end, this.timeUnit) ?? column.start;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row, rowIndex) => {
      const { start, end } = this.#rangeFor(row.task, row.hasChildren);
      const deps = this.#predecessorLabels(row.task);
      const hasDependencySummary = deps.length > 0 && !!this.#labels.dependencySummary;

      const tr = document.createElement("tr");

      const rowHeader = document.createElement("th");
      rowHeader.className = "gantt-chart-row-header";
      rowHeader.setAttribute("scope", "row");
      rowHeader.style.paddingInlineStart = `${row.depth}em`;
      if (row.hasChildren) {
        const collapseButton = document.createElement("button");
        collapseButton.type = "button";
        collapseButton.className = "gantt-chart-collapse-button";
        const isCollapsed = this.#collapsed.has(row.task.id);
        collapseButton.setAttribute("aria-expanded", String(!isCollapsed));
        collapseButton.setAttribute("aria-label", this.#labels.collapseButton?.(row.task, isCollapsed) ?? "");
        collapseButton.textContent = isCollapsed ? "▸" : "▾";
        collapseButton.addEventListener("click", () => this.#toggleCollapse(row.task.id));
        rowHeader.appendChild(collapseButton);
      }
      rowHeader.appendChild(document.createTextNode(this.#taskLabel(row.task)));
      if (hasDependencySummary) {
        const summary = document.createElement("span");
        summary.id = this.#dependencyId(row.task.id);
        summary.className = "gantt-chart-dependency-summary";
        summary.hidden = true;
        summary.textContent = this.#labels.dependencySummary!(deps);
        rowHeader.appendChild(summary);
      }
      tr.appendChild(rowHeader);

      columns.forEach((column, colIndex) => {
        const inRange = rangesOverlap(column.start, column.end, start, end);
        const isMilestone = inRange && start === end;
        const isToday = today != null && rangesOverlap(column.start, column.end, today, today);
        const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start);

        const td = document.createElement("td");
        td.className = "gantt-chart-td";
        td.setAttribute("role", "gridcell");
        td.setAttribute("data-row", String(rowIndex));
        td.setAttribute("data-col", String(colIndex));
        const isActive = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
        td.setAttribute("tabindex", isActive ? "0" : "-1");
        td.setAttribute("aria-selected", String(isActive));
        if (inRange) td.setAttribute("data-in-range", "");
        if (isMilestone) td.setAttribute("data-milestone", "");
        if (isToday) td.setAttribute("data-today", "");
        if (hasDependencySummary) td.setAttribute("aria-describedby", this.#dependencyId(row.task.id));
        td.addEventListener("dragover", this.#onCellDragOver);
        td.addEventListener("drop", (e) => this.#onCellDrop(column, e as DragEvent));

        if (isLeadingCell) {
          const bar = document.createElement("span");
          bar.className = "gantt-chart-bar";
          if (row.task.percentComplete != null) {
            bar.setAttribute("data-percent-complete", String(row.task.percentComplete));
          }
          if (!row.hasChildren) {
            bar.setAttribute("draggable", "true");
            bar.addEventListener("dragstart", (e) => this.#onBarDragStart(row.task, e as DragEvent));
          }
          td.appendChild(bar);
        }

        tr.appendChild(td);
        this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
      });

      tbody.appendChild(tr);
      this.#rowEls.set(row.task.id, tr);
    });
    table.appendChild(tbody);
    root.appendChild(table);

    const status = document.createElement("p");
    status.className = "gantt-chart-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = this.#statusMessage;
    root.appendChild(status);

    this.replaceChildren(root);
    upgradeNestedCustomElements(root);

    this.#statusEl = status;
  }
}
