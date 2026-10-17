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
import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data.js";
import { civilDateToDate } from "./cell-types.js";
import {
  draftOf,
  editorKind,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText,
  isEditableField,
  neighbourField,
  resolveFields,
  type Draft,
  type FieldDef,
  type ResolvedField,
} from "./typed-fields.js";


// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

/**
* A typed field a task carries (an owner, a status, an estimate), shown as a column between the task name and the timeline and
* read from `task.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
*/
export type GanttField = FieldDef;

/** What `onExport` and the `exportfile` event receive. Return `false` from `onExport` to take over the download. */
export type GanttExport = { format: ExportFormat; filename: string; taskCount: number; blob: Blob };

/** What `onFieldEdit` and the `fieldedit` event carry. */
export type GanttFieldEdit = { taskId: string; fieldId: string; value: unknown; previous: unknown };

/** A dependency with its type (`e2s` finish-to-start, `s2s`, `s2e`, `e2e`) and lag in days; data and text only. */
export type GanttDependency = { id: string; type?: "e2s" | "s2s" | "s2e" | "e2e"; lag?: number };

export type GanttTask = {
  /** Stable task identifier. */
  id: string;
  /** Visible task label. */
  label: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. Absent (with `end`) means the task is unscheduled: its row shows no bar (`data-unscheduled`) and its edit region sets the dates. */
  start?: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. Equal to `start` means a milestone. */
  end?: string;
  /** 0-100. Rendering the fill is the consumer's own CSS. */
  percentComplete?: number;
  /** Another task's id; builds the row hierarchy. */
  parentId?: string;
  /** Other tasks' ids this task depends on (finish-to-start). */
  dependsOn?: (string | GanttDependency)[];
  /** The planned span, shown as a second marked span (`data-baseline`) so slippage is visible. */
  baseline?: { start: string; end: string };
  /** Class hook only: becomes `data-task-type` on the row (e.g. "design", "review"). */
  type?: string;
  /** On the critical path; becomes `data-critical`. Lily computes nothing. */
  critical?: boolean;
  /** Slack in days, from the consumer's own scheduling; becomes `data-slack`. */
  slack?: number;
  /** Values of the chart's `fields`, by field id. */
  values?: Record<string, unknown>;
};

/** A dated column marker (holiday, release, deadline). `label` is rendered as text so a marker is never colour-only. */
export type GanttMarker = { date: string; kind?: string; label?: string };

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
  /** Header for the leading task-label column; an empty header cell otherwise. */
  taskColumnHeader?: string;
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
  /** Accessible name for the zoom-in button (finer columns). Gates the button. */
  zoomIn?: string;
  /** Accessible name for the zoom-out button (coarser columns). Gates the button. */
  zoomOut?: string;
  /** Announced after a zoom step with the new unit. */
  zoomAnnouncement?: (timeUnit: GanttTimeUnit) => string;
  /** Label of the progress field in the edit region (0–100). Gates the field. */
  percentLabel?: string;
  /** Text for one typed dependency: (predecessor label, type, lag in days). Untyped dependencies use the label. */
  dependencyDetail?: (predecessorLabel: string, type: string, lag: number) => string;
  /** Text for a task with a baseline: (task label, baseline, days the end has slipped; negative = early). */
  baselineSummary?: (
    taskLabel: string,
    baseline: { start: string; end: string },
    varianceDays: number,
  ) => string;
  collapseButton?: (task: GanttTask, collapsed: boolean) => string;
  /** Accessible name for the button that expands every parent task. Gates the button. */
  expandAll?: string;
  /** Accessible name for the button that collapses every parent task. Gates the button. */
  collapseAll?: string;
  /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
  export?: string;
  /** Visible text of the CSV, TSV and Excel export buttons. Each gates its button. */
  exportCsv?: string;
  exportTsv?: string;
  exportExcel?: string;
  /** Announced after an export: (format, how many tasks, file name). */
  exportAnnouncement?: (format: ExportFormat, taskCount: number, filename: string) => string;
  /** Headers of the export's own columns. An export needs `exportHeaders`; there is no English default. The others are included only when named. */
  exportHeaders?: { task: string; start: string; end: string; percentComplete?: string; parent?: string; dependsOn?: string; baselineStart?: string; baselineEnd?: string };
  /** Announced after a field edit: (task label, field header, the new text). */
  editAnnouncement?: (taskLabel: string, fieldHeader: string, text: string) => string;
  /** Announced when an edit is refused as invalid for the field's type: (task label, field header). */
  editInvalid?: (taskLabel: string, fieldHeader: string) => string;
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
  /** Property-only. Dated markers; each marks the column that contains its date with `data-marker`. */
  markers?: GanttMarker[];
  /** Property-only. Consumer's own working calendar; a column is `data-non-working` when every day in it is non-working. */
  isNonWorking?: (isoDate: string) => boolean;
  /** Attribute `readonly`. Suppresses editing, drag and the edit region; navigation and collapse still work. */
  readonly?: boolean;
  /** Property-only. Resolves a task to its display label. Defaults to `task.label`. */
  taskLabel?: (task: GanttTask) => string;
  /** Property-only. Called after a task's start/end changes, by pointer or the edit region. */
  onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
  /** Property-only. See GanttLabels — presence gates each control. */
  labels?: GanttLabels;
  fields?: GanttField[];
  locale?: string;
  onFieldEdit?: (edit: GanttFieldEdit) => void;
  editableFields?: boolean;
  exportFilename?: string;
  exportScope?: "all" | "visible";
  onExport?: (file: GanttExport) => boolean | void;
  virtualize?: { rowHeight: number; height: number; overscan?: number };
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

/**
 * Depth-first flatten of the parentId tree, skipping collapsed subtrees.
 * A task whose `parentId` names no task is a top-level row, not dropped.
 */
export function flattenTasks(tasks: GanttTask[], collapsed: ReadonlySet<string>): GanttFlatRow[] {
  const ids = new Set(tasks.map((t) => t.id));
  const childrenOf = new Map<string | undefined, GanttTask[]>();
  for (const task of tasks) {
    const key = task.parentId != null && ids.has(task.parentId) ? task.parentId : undefined;
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
  return effectiveRanges(allTasks).get(task.id) ?? { start: task.start ?? "", end: task.end ?? "" };
}

/**
 * Every task's effective range in one pass over the tree — computed once per
 * render rather than re-walking every parent's subtree for each row.
 * A `parentId` cycle cannot recurse forever: a task already on the walk is
 * read as a leaf.
 */
export function effectiveRanges(tasks: GanttTask[]): Map<string, { start: string; end: string }> {
  const childrenOf = new Map<string, GanttTask[]>();
  for (const task of tasks) {
    if (task.parentId == null) continue;
    const list = childrenOf.get(task.parentId) ?? [];
    list.push(task);
    childrenOf.set(task.parentId, list);
  }
  const ranges = new Map<string, { start: string; end: string }>();
  const onWalk = new Set<string>();
  function visit(task: GanttTask): { start: string; end: string } {
    const known = ranges.get(task.id);
    if (known) return known;
    const children = childrenOf.get(task.id) ?? [];
    if (children.length === 0 || onWalk.has(task.id)) return { start: task.start ?? "", end: task.end ?? "" };
    onWalk.add(task.id);
    let start = "";
    let end = "";
    for (const child of children) {
      const r = visit(child);
      if (!r.start) continue; // an unscheduled child does not shape its parent's span
      if (!start || compareISO(r.start, start) < 0) start = r.start;
      if (!end || compareISO(r.end, end) > 0) end = r.end;
    }
    onWalk.delete(task.id);
    const range = { start, end };
    ranges.set(task.id, range);
    return range;
  }
  for (const task of tasks) ranges.set(task.id, visit(task));
  return ranges;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextGanttChartId(): string {
  uid += 1;
  return `gantt-chart-${uid}`;
}

const HANDLED_ATTRS = new Set(["label", "caption", "class", "today", "time-unit", "readonly", "selected-task-id"]);

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
    return ["label", "caption", "today", "time-unit", "class", "readonly", "selected-task-id"];
  }

  // ---- Backing storage for property-only members ----
  #range: { start: string; end: string } = { start: "", end: "" };
  #tasks: GanttTask[] = [];
  #taskLabel: (task: GanttTask) => string = (task) => task.label;
  #onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
  #editPercentEl: HTMLInputElement | null = null;
  #labels: GanttLabels = {};
  #markers: GanttMarker[] = [];
  #isNonWorking?: (isoDate: string) => boolean;

  // ---- Internal state ----
  #statusMessage = "";
  #collapsed = new Set<string>();
  #onCollapsedTaskIdsChange: ((collapsedTaskIds: string[]) => void) | undefined;
  #focusedRow = 0;
  #focusedCol = 0;
  #editingTaskId: string | null = null;
  #editStart = "";
  #editEnd = "";
  #draggingTaskId: string | null = null;

  #fields: GanttField[] | undefined;
  #resolvedFields: ResolvedField[] = [];
  #locale: string | undefined;
  #onFieldEdit: ((edit: GanttFieldEdit) => void) | undefined;
  #editableFields = false;
  #exportFilename = "gantt-chart";
  #exportScope: "all" | "visible" = "all";
  #onExport: ((file: GanttExport) => boolean | void) | undefined;
  /** The field being edited, if any: the draft is the editor's text, kept current by the editor's own events (no re-render per keystroke). */
  #editingField: { taskId: string; fieldId: string; draft: Draft } | null = null;
  #virtualize: { rowHeight: number; height: number; overscan?: number } | undefined;
  #scrollTop = 0;
  #scrollEl: HTMLDivElement | null = null;
  #windowSig = "";
  #taskAttrs?: (task: GanttTask) => Record<string, string>;
  #onTaskSelect?: (taskId: string | undefined) => void;
  /** Which edge of the dragged task's bar is being resized, or null for a whole-bar move. */
  #resizingEdge: "start" | "end" | null = null;

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

  /** The selected task's id (attribute `selected-task-id`). A click on a task's row or the `s` key on it selects (again deselects); `aria-selected`, `data-selected`. */
  get selectedTaskId(): string | undefined {
    return this.getAttribute("selected-task-id") ?? undefined;
  }
  set selectedTaskId(v: string | undefined) {
    if (v == null) this.removeAttribute("selected-task-id");
    else this.setAttribute("selected-task-id", v);
  }

  /** Called with the task id when selection changes, or `undefined` when it clears; also fires `taskselect`. */
  get onTaskSelect(): ((taskId: string | undefined) => void) | undefined {
    return this.#onTaskSelect;
  }
  set onTaskSelect(fn: ((taskId: string | undefined) => void) | undefined) {
    this.#onTaskSelect = fn;
  }

  /** Ids of collapsed parent tasks; the collapse buttons, `labels.expandAll` and `labels.collapseAll` change it. */
  get collapsedTaskIds(): string[] {
    return [...this.#collapsed];
  }
  set collapsedTaskIds(v: string[]) {
    this.#collapsed = new Set(Array.isArray(v) ? v : []);
    this.#render();
  }

  /** Property-only. Called with the collapsed ids when the user changes them (the `collapsechange` event also fires). */
  get onCollapsedTaskIdsChange(): ((collapsedTaskIds: string[]) => void) | undefined {
    return this.#onCollapsedTaskIdsChange;
  }
  set onCollapsedTaskIdsChange(fn: ((collapsedTaskIds: string[]) => void) | undefined) {
    this.#onCollapsedTaskIdsChange = fn;
  }

  /** Extra attributes on each task's row (for example `data-team`); merged after Lily's own. */
  get taskAttrs(): ((task: GanttTask) => Record<string, string>) | undefined {
    return this.#taskAttrs;
  }
  set taskAttrs(fn: ((task: GanttTask) => Record<string, string>) | undefined) {
    this.#taskAttrs = fn;
    this.#render();
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

  get onTaskChange(): ((taskId: string, start: string, end: string, percentComplete?: number) => void) | undefined {
    return this.#onTaskChange;
  }
  set onTaskChange(fn: ((taskId: string, start: string, end: string, percentComplete?: number) => void) | undefined) {
    this.#onTaskChange = fn;
  }

  get markers(): GanttMarker[] {
    return [...this.#markers];
  }
  set markers(v: GanttMarker[]) {
    this.#markers = Array.isArray(v) ? v.slice() : [];
    this.#render();
  }

  get isNonWorking(): ((isoDate: string) => boolean) | undefined {
    return this.#isNonWorking;
  }
  set isNonWorking(fn: ((isoDate: string) => boolean) | undefined) {
    this.#isNonWorking = fn;
    this.#render();
  }

  get readonly(): boolean {
    return this.hasAttribute("readonly");
  }
  set readonly(v: boolean) {
    if (v) this.setAttribute("readonly", "");
    else this.removeAttribute("readonly");
  }

  /** Typed fields: a column per field between the task name and the timeline, read from `task.values`. Editable types edit in place (click the value, or F2 on the task's row for the first editable field; Tab moves to the next) when `onFieldEdit` is set or `editableFields` is on. */
  get fields(): GanttField[] | undefined {
    return this.#fields ? [...this.#fields] : undefined;
  }
  set fields(v: GanttField[] | undefined) {
    this.#fields = Array.isArray(v) ? v.slice() : undefined;
    this.#resolvedFields = resolveFields(this.#fields, this.#locale);
    this.#render();
  }

  /** Locale for number and date fields. Never defaulted. */
  get locale(): string | undefined {
    return this.#locale;
  }
  set locale(v: string | undefined) {
    this.#locale = v || undefined;
    this.#resolvedFields = resolveFields(this.#fields, this.#locale);
    this.#render();
  }

  /** Called with each accepted field edit; the consumer updates `tasks`. Setting it turns field editing on. The `fieldedit` event reports the same edit. */
  get onFieldEdit(): ((edit: GanttFieldEdit) => void) | undefined {
    return this.#onFieldEdit;
  }
  set onFieldEdit(fn: ((edit: GanttFieldEdit) => void) | undefined) {
    this.#onFieldEdit = fn;
    this.#render();
  }

  /** Turns field editing on without `onFieldEdit` (for a consumer that only listens to the `fieldedit` event; an element cannot see its own listeners). */
  get editableFields(): boolean {
    return this.#editableFields;
  }
  set editableFields(v: boolean) {
    this.#editableFields = !!v;
    this.#render();
  }

  /** The file name without its extension. Default `"gantt-chart"`. */
  get exportFilename(): string {
    return this.#exportFilename;
  }
  set exportFilename(v: string) {
    this.#exportFilename = v || "gantt-chart";
  }

  /** What an export holds: `"all"` (default) is every task; `"visible"` leaves out the tasks under a collapsed parent. */
  get exportScope(): "all" | "visible" {
    return this.#exportScope;
  }
  set exportScope(v: "all" | "visible") {
    this.#exportScope = v === "visible" ? "visible" : "all";
    this.#render();
  }

  /** Called before the download with the finished file. Return `false` to skip the built-in download. The `exportfile` event reports the same file. */
  get onExport(): ((file: GanttExport) => boolean | void) | undefined {
    return this.#onExport;
  }
  set onExport(fn: ((file: GanttExport) => boolean | void) | undefined) {
    this.#onExport = fn;
  }

  /** Renders only the task rows in view (windowing). The chart gets a scroll area of `height` px; every row is assumed `rowHeight` px tall. */
  get virtualize(): { rowHeight: number; height: number; overscan?: number } | undefined {
    return this.#virtualize;
  }
  set virtualize(v: { rowHeight: number; height: number; overscan?: number } | undefined) {
    this.#virtualize = v;
    this.#render();
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
    if (name === "label" || name === "caption" || name === "today" || name === "time-unit" || name === "class" || name === "readonly" || name === "selected-task-id") {
      this.#render();
    }
  }

  // ---- Derived data ----

  #gridColumns(): GanttColumn[] {
    return generateColumns(this.#range, this.timeUnit);
  }

  #taskById(): Map<string, GanttTask> {
    return new Map(this.#tasks.map((t) => [t.id, t]));
  }

  #gridRows(): GanttFlatRow[] {
    return flattenTasks(this.#tasks, this.#collapsed);
  }

  #rangeFor(
    task: GanttTask,
    hasChildren: boolean,
    ranges: Map<string, { start: string; end: string }>,
  ): { start: string; end: string } {
    return hasChildren ? (ranges.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
  }

  /** Editing needs every label its controls show; an unnamed Save is worse than none. */
  #canEdit(): boolean {
    const l = this.#labels;
    return !this.readonly && !!l.dateTimePickerLabels && !!l.startLabel && !!l.endLabel && !!l.saveLabel && !!l.cancelLabel;
  }

  /** Focus the grid's tab stop — after a rebuild, the new cell standing where the old one was. */
  #focusActiveCell(): void {
    this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.focus({ preventScroll: true });
  }

  #predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((dep) => {
      const id = typeof dep === "string" ? dep : dep.id;
      const predecessor = this.#taskById().get(id);
      const text = predecessor ? this.#taskLabel(predecessor) : id;
      const detail = this.#labels.dependencyDetail;
      if (typeof dep === "string" || !detail) return text;
      return detail(text, dep.type ?? "e2s", dep.lag ?? 0);
    });
  }

  #baselineId(taskId: string): string {
    return `${this.#baseId}-baseline-${taskId}`;
  }

  /** The ids a cell is described by: the dependency summary, then the baseline summary. */
  #describedBy(task: GanttTask, hasDeps: boolean): string | null {
    const ids: string[] = [];
    if (hasDeps) ids.push(this.#dependencyId(task.id));
    if (task.baseline && this.#labels.baselineSummary) ids.push(this.#baselineId(task.id));
    return ids.length ? ids.join(" ") : null;
  }

  #dependencyId(taskId: string): string {
    return `${this.#baseId}-deps-${taskId}`;
  }

  #announce(message: string | undefined): void {
    if (!message) return;
    this.#statusMessage = message;
    if (this.#statusEl) this.#statusEl.textContent = message;
  }

  // ---- Typed fields, inline editing, export ----

  #isFieldEditable(f: GanttField): boolean {
    return (!!this.#onFieldEdit || this.#editableFields) && !this.readonly && isEditableField(f);
  }

  #startFieldEdit(task: GanttTask, f: ResolvedField): void {
    if (!this.#isFieldEditable(f)) return;
    this.#editingField = { taskId: task.id, fieldId: f.id, draft: draftOf(f, task.values) };
    this.#render();
    const editor = this.querySelector<HTMLInputElement>(".gantt-chart-field-editor");
    editor?.focus({ preventScroll: true });
    if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  #commitFieldEdit(): boolean {
    const current = this.#editingField;
    if (!current) return true;
    const { taskId, fieldId, draft } = current;
    const task = this.#tasks.find((t) => t.id === taskId);
    const f = this.#resolvedFields.find((x) => x.id === fieldId);
    if (!task || !f) {
      this.#editingField = null;
      this.#render();
      return true;
    }
    const outcome = evaluateEdit(f, task.values, draft);
    if (outcome.invalid) {
      this.#announce(this.#labels.editInvalid?.(this.#taskLabel(task), f.header));
      return false;
    }
    this.#editingField = null;
    if (outcome.changed) {
      const edit: GanttFieldEdit = { taskId, fieldId, value: outcome.value, previous: outcome.previous };
      this.#onFieldEdit?.(edit);
      this.dispatchEvent(new CustomEvent<GanttFieldEdit>("fieldedit", { detail: edit, bubbles: true, composed: true }));
      this.#statusMessage = this.#labels.editAnnouncement?.(this.#taskLabel(task), f.header, outcome.text) ?? this.#statusMessage;
    }
    this.#render();
    return true;
  }

  #cancelFieldEdit(): void {
    if (!this.#editingField) return;
    this.#editingField = null;
    this.#render();
    this.#focusActiveCell();
  }

  #onEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (this.#commitFieldEdit()) this.#focusActiveCell();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.#cancelFieldEdit();
    } else if (event.key === "Tab" && this.#editingField) {
      // Tab commits and moves to the task's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const current = this.#editingField;
      const task = this.#tasks.find((t) => t.id === current.taskId);
      const next = neighbourField(this.#resolvedFields.filter((x) => this.#isFieldEditable(x)), current.fieldId, event.shiftKey);
      if (task && next) {
        event.preventDefault();
        if (this.#commitFieldEdit()) this.#startFieldEdit(this.#tasks.find((t) => t.id === task.id) ?? task, next);
      } else {
        this.#commitFieldEdit();
      }
    }
  }

  /** One field's cell content: the text, a button that opens the editor, or the editor itself. */
  #fieldContent(task: GanttTask, f: ResolvedField, td: HTMLElement): void {
    const text = fieldText(f, task.values);
    const editable = this.#isFieldEditable(f);
    const nameId = `${this.#baseId}-fn-${task.id}-${f.id}`;
    const valueId = `${this.#baseId}-fv-${task.id}-${f.id}`;
    const editing = this.#editingField;
    if (editing && editing.taskId === task.id && editing.fieldId === f.id) {
      const kind = editorKind(f);
      if (kind === "select" || kind === "radio") {
        const select = document.createElement("select");
        select.className = "gantt-chart-field-editor";
        select.setAttribute("aria-label", f.editLabel ?? f.header);
        const blank = document.createElement("option");
        blank.value = "";
        select.appendChild(blank);
        for (const option of f.options ?? []) {
          const o = document.createElement("option");
          o.value = option.id;
          o.disabled = !!option.disabled;
          o.textContent = option.label;
          select.appendChild(o);
        }
        select.value = String(editing.draft ?? "");
        select.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        select.addEventListener("change", () => {
          editing.draft = select.value;
          if (this.#commitFieldEdit()) this.#focusActiveCell();
        });
        select.addEventListener("blur", () => this.#commitFieldEdit());
        td.appendChild(select);
      } else {
        const input = document.createElement("input");
        input.className = "gantt-chart-field-editor";
        input.setAttribute("aria-label", f.editLabel ?? f.header);
        input.type = kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text";
        if (kind === "number") input.setAttribute("inputmode", "decimal");
        input.value = String(editing.draft ?? "");
        input.addEventListener("input", () => {
          editing.draft = input.value;
        });
        input.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
        input.addEventListener("blur", () => this.#commitFieldEdit());
        td.appendChild(input);
      }
    } else if (editable) {
      const name = document.createElement("span");
      name.id = nameId;
      name.hidden = true;
      name.textContent = f.header;
      td.appendChild(name);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gantt-chart-field-button";
      button.id = valueId;
      button.setAttribute("tabindex", "-1");
      button.setAttribute("aria-labelledby", `${nameId} ${valueId}`);
      button.textContent = text;
      button.addEventListener("click", () => this.#startFieldEdit(task, f));
      td.appendChild(button);
    } else {
      td.textContent = text;
    }
  }

  #exportTasks(): GanttTask[] {
    return (this.#exportScope === "visible" ? this.#gridRows() : flattenTasks(this.#tasks, new Set<string>())).map((r) => r.task);
  }

  #runExport(format: ExportFormat): void {
    const h = this.#labels.exportHeaders;
    if (!h) return;
    const byId = new Map(this.#tasks.map((t) => [t.id, t]));
    const ranges = effectiveRanges(this.#tasks);
    const exportFields = exportableFields(this.#resolvedFields);
    const headers = [h.task, h.start, h.end];
    if (h.percentComplete) headers.push(h.percentComplete);
    if (h.parent) headers.push(h.parent);
    if (h.dependsOn) headers.push(h.dependsOn);
    if (h.baselineStart) headers.push(h.baselineStart);
    if (h.baselineEnd) headers.push(h.baselineEnd);
    for (const f of exportFields) headers.push(f.header);
    const hasChildren = new Set(this.#tasks.filter((t) => t.parentId != null && byId.has(t.parentId)).map((t) => t.parentId as string));
    const exportDate = (iso: string | undefined): Date | null => (iso ? civilDateToDate(iso) : null);
    const body = this.#exportTasks().map((task) => {
      const span = hasChildren.has(task.id) ? (ranges.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
      const cells: unknown[] = [this.#taskLabel(task), exportDate(span.start), exportDate(span.end)];
      if (h.percentComplete) cells.push(task.percentComplete ?? null);
      if (h.parent) cells.push(task.parentId != null && byId.has(task.parentId) ? this.#taskLabel(byId.get(task.parentId)!) : null);
      if (h.dependsOn) {
        cells.push(
          (task.dependsOn ?? [])
            .map((dep) => {
              const id = typeof dep === "string" ? dep : dep.id;
              const predecessor = byId.get(id);
              return predecessor ? this.#taskLabel(predecessor) : id;
            })
            .join("; "),
        );
      }
      if (h.baselineStart) cells.push(exportDate(task.baseline?.start));
      if (h.baselineEnd) cells.push(exportDate(task.baseline?.end));
      for (const f of exportFields) cells.push(exportFieldCell(f, task.values));
      return cells;
    });
    const filename = exportFilename(this.#exportFilename, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: this.#exportFilename });
    const file: GanttExport = { format, filename, taskCount: body.length, blob };
    this.dispatchEvent(new CustomEvent<GanttExport>("exportfile", { detail: file, bubbles: true, composed: true }));
    if (this.#onExport?.(file) === false) return;
    downloadBlob(blob, filename);
    this.#announce(this.#labels.exportAnnouncement?.(format, body.length, filename));
  }

  // ---- Windowing (virtualize) ----

  /** The row indices to render: the window in view, plus the roving tab stop's row (everything without `virtualize`). */
  #windowIndices(rowCount: number): number[] {
    const v = this.#virtualize;
    if (!v) return Array.from({ length: rowCount }, (_, i) => i);
    const overscan = v.overscan ?? 3;
    const start = Math.max(0, Math.floor(this.#scrollTop / v.rowHeight) - overscan);
    const end = Math.min(rowCount, Math.ceil((this.#scrollTop + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    const active = Math.min(this.#focusedRow, rowCount - 1);
    if (active >= 0) indices.add(active);
    return [...indices].sort((a, b) => a - b);
  }

  /** Bring a row into the scroll area (a virtualized chart renders only what is in view). */
  #revealRow(rowIndex: number, rowCount: number): void {
    const v = this.#virtualize;
    if (!v) return;
    const top = rowIndex * v.rowHeight;
    let next = this.#scrollTop;
    if (top < this.#scrollTop) next = top;
    else if (top + v.rowHeight > this.#scrollTop + v.height) next = top + v.rowHeight - v.height;
    if (next === this.#scrollTop) return;
    this.#scrollTop = next;
    if (this.#scrollEl) this.#scrollEl.scrollTop = next;
    if (this.#windowIndices(rowCount).join(",") !== this.#windowSig) this.#render();
  }

  #onScroll(): void {
    const v = this.#virtualize;
    if (!v || !this.#scrollEl) return;
    this.#scrollTop = this.#scrollEl.scrollTop;
    const rowCount = this.#gridRows().length;
    if (this.#windowIndices(rowCount).join(",") === this.#windowSig) return;
    // The rebuild replaces the cells: keep focus on the cursor's cell if it was there.
    const hadFocus = !!document.activeElement && this.contains(document.activeElement) && !!(document.activeElement as HTMLElement).closest("[data-row][data-col]");
    this.#render();
    if (hadFocus) this.#focusActiveCell();
  }

  // ---------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------

  #reportCollapsed(): void {
    const ids = [...this.#collapsed];
    this.#onCollapsedTaskIdsChange?.(ids);
    this.dispatchEvent(new CustomEvent<string[]>("collapsechange", { detail: ids, bubbles: true, composed: true }));
  }

  /** Every task that has children (the ones a collapse button applies to). */
  #parentIds(): string[] {
    return Array.from(new Set(this.#tasks.filter((t) => t.parentId != null).map((t) => t.parentId as string))).filter((id) =>
      this.#taskById().has(id),
    );
  }

  #setAllCollapsed(value: boolean, focusClass: string): void {
    this.#collapsed = new Set(value ? this.#parentIds() : []);
    this.#reportCollapsed();
    this.#render();
    this.querySelector<HTMLElement>(`.${focusClass}`)?.focus({ preventScroll: true });
  }

  #toggleCollapse(taskId: string): void {
    const next = new Set(this.#collapsed);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    this.#collapsed = next;
    this.#reportCollapsed();
    this.#render();
    // The rebuild replaced the button that had focus; give focus to its
    // successor rather than letting it fall to <body>.
    this.#rowEls.get(taskId)?.querySelector<HTMLElement>(".gantt-chart-collapse-button")?.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------
  // Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
  // ---------------------------------------------------------------

  #applyChange(task: GanttTask, start: string, end: string, percentComplete?: number): void {
    if (percentComplete === undefined) this.#onTaskChange?.(task.id, start, end);
    else this.#onTaskChange?.(task.id, start, end, percentComplete);
    this.#announce(this.#labels.dateAnnouncement?.(this.#taskLabel(task), start, end));
  }

  #openEdit(task: GanttTask): void {
    if (!this.#canEdit()) return;
    if (this.#editingTaskId) this.#closeEditRow();
    this.#editingTaskId = task.id;
    this.#editStart = task.start ?? "";
    this.#editEnd = task.end ?? "";
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
    td.colSpan = this.#gridColumns().length + 1 + this.#resolvedFields.length;
    td.addEventListener("keydown", (event) => {
      // Escape cancels, unless a date picker's own dialog used it to close itself.
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        this.#cancelEdit();
      }
    });

    const startPicker = document.createElement("lily-date-time-picker") as DateTimePickerElement;
    startPicker.setAttribute("label", this.#labels.startLabel ?? "");
    startPicker.mode = "date";
    startPicker.labels = dateTimePickerLabels;
    startPicker.value = this.#editStart;
    startPicker.onChange = (value: string) => {
      this.#editStart = value;
      syncSave();
    };
    td.appendChild(startPicker);

    const endPicker = document.createElement("lily-date-time-picker") as DateTimePickerElement;
    endPicker.setAttribute("label", this.#labels.endLabel ?? "");
    endPicker.mode = "date";
    endPicker.labels = dateTimePickerLabels;
    endPicker.value = this.#editEnd;
    endPicker.onChange = (value: string) => {
      this.#editEnd = value;
      syncSave();
    };
    td.appendChild(endPicker);

    this.#editPercentEl = null;
    if (this.#labels.percentLabel) {
      const label = document.createElement("label");
      label.className = "gantt-chart-percent-label";
      label.appendChild(document.createTextNode(this.#labels.percentLabel));
      const input = document.createElement("input");
      input.className = "gantt-chart-percent-input";
      input.type = "number";
      input.min = "0";
      input.max = "100";
      input.step = "1";
      input.value = task.percentComplete != null ? String(task.percentComplete) : "";
      label.appendChild(input);
      td.appendChild(label);
      this.#editPercentEl = input;
    }

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "gantt-chart-save-button";
    saveButton.textContent = this.#labels.saveLabel ?? "";
    saveButton.addEventListener("click", () => this.#saveEdit(task));
    td.appendChild(saveButton);
    // Save is disabled while either date is empty.
    function syncSave(): void {
      saveButton.disabled = !startPicker.value || !endPicker.value;
    }

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "gantt-chart-cancel-button";
    cancelButton.textContent = this.#labels.cancelLabel ?? "";
    cancelButton.addEventListener("click", () => this.#cancelEdit());
    td.appendChild(cancelButton);
    syncSave(); // an unscheduled task opens with both dates empty

    tr.appendChild(td);
    taskRow.insertAdjacentElement("afterend", tr);
    upgradeNestedCustomElements(tr);
    this.#editRowEl = tr;
    // Focus moves into the region it opened, onto the start date's field.
    startPicker.querySelector<HTMLElement>(".date-time-picker-input")?.focus({ preventScroll: true });
  }

  /**
   * A range entered end-first is saved start-first. The region closes before
   * the consumer hears of the change — its `tasks` update rebuilds the chart —
   * and focus then returns to the grid's tab stop on the edited row.
   */
  #saveEdit(task: GanttTask): void {
    const a = this.#editStart;
    const b = this.#editEnd;
    if (!a || !b) return;
    const [start, end] = compareISO(a, b) <= 0 ? [a, b] : [b, a];
    const raw = this.#editPercentEl?.value ?? "";
    const rounded = raw === "" ? NaN : Math.min(100, Math.max(0, Math.round(Number(raw))));
    this.#closeEditRow();
    this.#applyChange(task, start, end, Number.isFinite(rounded) ? rounded : undefined);
    this.#focusActiveCell();
  }

  /** Cancel returns focus to the grid's tab stop, on the edited task's row. */
  #cancelEdit(): void {
    this.#closeEditRow();
    this.#focusActiveCell();
  }

  #closeEditRow(): void {
    this.#editPercentEl = null;
    this.#editingTaskId = null;
    this.#editRowEl?.remove();
    this.#editRowEl = null;
  }

  #onBarDragStart = (task: GanttTask, event: DragEvent): void => {
    this.#draggingTaskId = task.id;
    this.#resizingEdge = null;
    event.dataTransfer?.setData("text/plain", task.id);
  };

  #onHandleDragStart(task: GanttTask, edge: "start" | "end", event: DragEvent): void {
    event.stopPropagation();
    this.#draggingTaskId = task.id;
    this.#resizingEdge = edge;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  // ---- Zoom ----

  static readonly #ZOOM_ORDER: GanttTimeUnit[] = ["month", "week", "day"];

  #zoom(delta: 1 | -1): void {
    const next = GanttChart.#ZOOM_ORDER[GanttChart.#ZOOM_ORDER.indexOf(this.timeUnit) + delta];
    if (!next) return;
    this.#statusMessage = this.#labels.zoomAnnouncement?.(next) ?? this.#statusMessage;
    this.timeUnit = next;
  }

  // ---- Selection ----

  #selectTask(taskId: string): void {
    const next = this.selectedTaskId === taskId ? undefined : taskId;
    this.selectedTaskId = next;
    this.#onTaskSelect?.(next);
    this.dispatchEvent(new CustomEvent("taskselect", { detail: next, bubbles: true, composed: true }));
  }

  // ---- Keyboard shift / resize (Alt+Arrow) ----

  #columnIndexOf(isoDate: string): number {
    return this.#gridColumns().findIndex((c) => rangesOverlap(c.start, c.end, isoDate, isoDate));
  }

  #shiftTask(task: GanttTask, delta: 1 | -1, endOnly: boolean): void {
    if (!task.start || !task.end) return; // an unscheduled task has nothing to shift
    const columns = this.#gridColumns();
    if (endOnly) {
      const target = columns[this.#columnIndexOf(task.end) + delta];
      if (target && compareISO(task.start, target.end) <= 0) this.#applyChange(task, task.start, target.end);
      return;
    }
    const target = columns[this.#columnIndexOf(task.start) + delta];
    if (!target) return;
    const a = parseIsoDate(task.start);
    const b = parseIsoDate(task.end);
    const duration = a && b ? toEpochDay(b) - toEpochDay(a) : 0;
    this.#applyChange(task, target.start, addDays(target.start, duration));
  }

  #onCellDragOver = (event: DragEvent): void => {
    if (this.#draggingTaskId) event.preventDefault();
  };

  #onCellDrop = (column: GanttColumn, event: DragEvent): void => {
    event.preventDefault();
    if (this.readonly) return;
    const taskId = this.#draggingTaskId ?? event.dataTransfer?.getData("text/plain");
    this.#draggingTaskId = null;
    const task = taskId ? this.#tasks.find((t) => t.id === taskId) : undefined;
    const edge = this.#resizingEdge;
    this.#resizingEdge = null;
    if (!task || !task.start || !task.end) return;
    if (edge) {
      // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
      const start = edge === "start" ? column.start : task.start;
      const end = edge === "end" ? column.end : task.end;
      if (compareISO(start, end) <= 0 && (start !== task.start || end !== task.end)) this.#applyChange(task, start, end);
      return;
    }
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
    }
    const next = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
    if (next) {
      next.setAttribute("tabindex", "0");
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
    if (this.#virtualize) {
      this.#revealRow(this.#focusedRow, rows.length);
      // The target row may have been outside the rendered window: the reveal re-renders.
      if (!this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.isConnected) {
        this.#render();
        this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.focus({ preventScroll: true });
        return;
      }
    }
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

  #onGridKeydown = (event: KeyboardEvent): void => {
    if ((event.target as HTMLElement).closest(".gantt-chart-field-editor")) return;
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    const rows = this.#gridRows();
    const columns = this.#gridColumns();
    if (event.key === "F2" && (this.#onFieldEdit || this.#editableFields)) {
      // F2: edit the task's first editable field (the keyboard twin of clicking its value).
      const row = rows[this.#focusedRow];
      const first = this.#resolvedFields.find((f) => this.#isFieldEditable(f));
      if (row && first) {
        event.preventDefault();
        this.#startFieldEdit(row.task, first);
      }
      return;
    }
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
      const row = rows[this.#focusedRow];
      if (row && !row.hasChildren && !this.readonly && (event.target as HTMLElement).closest(".gantt-chart-td")) {
        event.preventDefault();
        this.#shiftTask(row.task, event.key === "ArrowLeft" ? -1 : 1, event.shiftKey);
        return;
      }
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
        else this.#moveFocus(this.#focusedRow, 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.#moveFocus(rows.length - 1, columns.length - 1);
        else this.#moveFocus(this.#focusedRow, columns.length - 1);
        break;
      case "s":
      case "S": {
        if (event.ctrlKey || event.metaKey || event.altKey) break;
        const row = rows[this.#focusedRow];
        if (row && (event.target as HTMLElement).closest(".gantt-chart-td")) {
          event.preventDefault();
          this.#selectTask(row.task.id);
        }
        break;
      }
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
    if (this.readonly) root.setAttribute("data-readonly", "");
    passThroughAttributes(this, root);

    const parentIds = this.#parentIds();
    if (parentIds.length > 0 && (this.#labels.expandAll || this.#labels.collapseAll)) {
      const group = document.createElement("div");
      group.className = "gantt-chart-collapse-all";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", this.label);
      const mkAll = (cls: string, text: string, disabled: boolean, value: boolean) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = cls;
        b.textContent = text;
        b.disabled = disabled;
        b.addEventListener("click", () => this.#setAllCollapsed(value, cls));
        group.appendChild(b);
      };
      if (this.#labels.expandAll) mkAll("gantt-chart-expand-all-button", this.#labels.expandAll, this.#collapsed.size === 0, false);
      if (this.#labels.collapseAll) mkAll("gantt-chart-collapse-all-button", this.#labels.collapseAll, parentIds.every((id) => this.#collapsed.has(id)), true);
      root.appendChild(group);
    }

    if (this.#labels.zoomIn || this.#labels.zoomOut) {
      const zoomIndex = GanttChart.#ZOOM_ORDER.indexOf(this.timeUnit);
      const group = document.createElement("div");
      group.className = "gantt-chart-zoom";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", this.label);
      const mk = (cls: string, text: string, name: string, disabled: boolean, delta: 1 | -1) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = cls;
        b.setAttribute("aria-label", name);
        b.textContent = text;
        b.disabled = disabled;
        b.addEventListener("click", () => this.#zoom(delta));
        group.appendChild(b);
      };
      if (this.#labels.zoomOut) mk("gantt-chart-zoom-out-button", "−", this.#labels.zoomOut, zoomIndex <= 0, -1);
      if (this.#labels.zoomIn) mk("gantt-chart-zoom-in-button", "+", this.#labels.zoomIn, zoomIndex >= GanttChart.#ZOOM_ORDER.length - 1, 1);
      root.appendChild(group);
    }

    if (this.#labels.exportHeaders && (this.#labels.exportCsv || this.#labels.exportTsv || this.#labels.exportExcel)) {
      const exportRows = this.#exportTasks();
      const group = document.createElement("div");
      group.className = "gantt-chart-export";
      group.setAttribute("role", "group");
      if (this.#labels.export) group.setAttribute("aria-label", this.#labels.export);
      const formats: [ExportFormat, string | undefined][] = [
        ["csv", this.#labels.exportCsv],
        ["tsv", this.#labels.exportTsv],
        ["xlsx", this.#labels.exportExcel],
      ];
      for (const [format, text] of formats) {
        if (!text) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gantt-chart-export-button";
        button.setAttribute("data-gantt-export-format", format);
        button.disabled = exportRows.length === 0;
        button.textContent = text;
        button.addEventListener("click", () => this.#runExport(format));
        group.appendChild(button);
      }
      root.appendChild(group);
    }

    const table = document.createElement("lily-gantt-table");
    table.setAttribute("label", this.label);
    table.addEventListener("click", (event) => {
      const t = event.target as HTMLElement;
      if (t.closest("button, input, select, .gantt-chart-edit-row, .gantt-chart-field-editor")) return;
      const id = t.closest<HTMLElement>("[data-task-id]")?.dataset.taskId;
      if (id) this.#selectTask(id);
    });
    if (this.caption) {
      const captionEl = document.createElement("caption");
      captionEl.textContent = this.caption;
      table.appendChild(captionEl);
    }
    table.addEventListener("keydown", this.#onGridKeydown);
    table.addEventListener("focusin", this.#onGridFocusin);

    const today = this.today || null;

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const leadingTh = document.createElement("th");
    leadingTh.className = "gantt-chart-th";
    leadingTh.setAttribute("scope", "col");
    leadingTh.textContent = this.#labels.taskColumnHeader ?? "";
    headRow.appendChild(leadingTh);
    for (const f of this.#resolvedFields) {
      const fieldTh = document.createElement("th");
      fieldTh.className = "gantt-chart-th";
      fieldTh.setAttribute("scope", "col");
      fieldTh.setAttribute("data-field", f.id);
      fieldTh.textContent = f.header;
      headRow.appendChild(fieldTh);
    }
    const columnMarkers = columns.map((column) =>
      this.#markers.filter((m) => rangesOverlap(column.start, column.end, m.date, m.date)),
    );
    const columnNonWorking = columns.map((column) => {
      const isNonWorking = this.#isNonWorking;
      if (!isNonWorking) return false;
      for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
        if (!isNonWorking(d)) return false;
      }
      return true;
    });
    columns.forEach((column, columnIndex) => {
      const isToday = today != null && rangesOverlap(column.start, column.end, today, today);
      const th = document.createElement("th");
      th.className = "gantt-chart-th";
      th.setAttribute("scope", "col");
      if (isToday) th.setAttribute("data-today", "");
      if (columnNonWorking[columnIndex]) th.setAttribute("data-non-working", "");
      const markers = columnMarkers[columnIndex];
      if (markers.length) th.setAttribute("data-marker", markers.map((m) => m.kind ?? "marker").join(" "));
      th.appendChild(
        document.createTextNode(this.#labels.columnLabel?.(column.start, column.end, this.timeUnit) ?? column.start),
      );
      for (const marker of markers) {
        if (!marker.label) continue;
        const span = document.createElement("span");
        span.className = "gantt-chart-marker-label";
        span.textContent = marker.label;
        th.appendChild(span);
      }
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const ranges = effectiveRanges(this.#tasks);
    if (this.#virtualize) table.setAttribute("aria-rowcount", String(rows.length + 1));
    const windowIdx = this.#windowIndices(rows.length);
    this.#windowSig = windowIdx.join(",");
    const rowHeight = this.#virtualize?.rowHeight ?? 0;
    const columnCount = columns.length + 1 + this.#resolvedFields.length;
    const spacer = (count: number): void => {
      const spacerRow = document.createElement("tr");
      spacerRow.className = "gantt-chart-spacer";
      spacerRow.setAttribute("aria-hidden", "true");
      spacerRow.style.height = `${count * rowHeight}px`;
      const spacerCell = document.createElement("td");
      spacerCell.colSpan = columnCount;
      spacerRow.appendChild(spacerCell);
      tbody.appendChild(spacerRow);
    };
    let previousIdx = -1;
    for (const rowIndex of windowIdx) {
      if (this.#virtualize && rowIndex - previousIdx > 1) spacer(rowIndex - previousIdx - 1);
      previousIdx = rowIndex;
      const row = rows[rowIndex];
      const { start, end } = this.#rangeFor(row.task, row.hasChildren, ranges);
      const deps = this.#predecessorLabels(row.task);
      const hasDependencySummary = deps.length > 0 && !!this.#labels.dependencySummary;

      const tr = document.createElement("tr");
      if (row.task.type) tr.setAttribute("data-task-type", row.task.type);
      if (row.task.critical) tr.setAttribute("data-critical", "");
      if (row.task.slack != null) tr.setAttribute("data-slack", String(row.task.slack));
      tr.dataset.taskId = row.task.id;
      if (this.#virtualize) tr.setAttribute("aria-rowindex", String(rowIndex + 2));
      if (!row.hasChildren && (!row.task.start || !row.task.end)) tr.setAttribute("data-unscheduled", "");
      if (this.selectedTaskId === row.task.id) {
        tr.setAttribute("aria-selected", "true");
        tr.setAttribute("data-selected", "");
      }
      if (this.#taskAttrs) {
        for (const [name, value] of Object.entries(this.#taskAttrs(row.task))) tr.setAttribute(name, value);
      }

      const rowHeader = document.createElement("th");
      rowHeader.className = "gantt-chart-row-header";
      rowHeader.setAttribute("scope", "row");
      // Depth is data for the consumer's CSS (indentation), never an inline style.
      rowHeader.dataset.depth = String(row.depth);
      if (row.hasChildren && this.#labels.collapseButton) {
        const collapseButton = document.createElement("button");
        collapseButton.type = "button";
        collapseButton.className = "gantt-chart-collapse-button";
        const isCollapsed = this.#collapsed.has(row.task.id);
        collapseButton.setAttribute("aria-expanded", String(!isCollapsed));
        collapseButton.setAttribute("aria-label", this.#labels.collapseButton(row.task, isCollapsed));
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
      if (row.task.baseline && this.#labels.baselineSummary) {
        const a = parseIsoDate(row.task.baseline.end);
        const c = parseIsoDate(end);
        const variance = a && c ? toEpochDay(c) - toEpochDay(a) : 0;
        const summary = document.createElement("span");
        summary.id = this.#baselineId(row.task.id);
        summary.className = "gantt-chart-baseline-summary";
        summary.hidden = true;
        summary.textContent = this.#labels.baselineSummary(this.#taskLabel(row.task), row.task.baseline, variance);
        rowHeader.appendChild(summary);
      }
      tr.appendChild(rowHeader);

      for (const f of this.#resolvedFields) {
        const fieldTd = document.createElement("td");
        fieldTd.className = "gantt-chart-td";
        fieldTd.setAttribute("data-field", f.id);
        fieldTd.setAttribute("data-type", f.type ?? "text");
        if (f.align) fieldTd.setAttribute("data-align", f.align);
        this.#fieldContent(row.task, f, fieldTd);
        tr.appendChild(fieldTd);
      }

      columns.forEach((column, colIndex) => {
        const inRange = !!start && !!end && rangesOverlap(column.start, column.end, start, end);
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
        if (inRange) td.setAttribute("data-in-range", "");
        if (isMilestone) td.setAttribute("data-milestone", "");
        if (isToday) td.setAttribute("data-today", "");
        if (columnNonWorking[colIndex]) td.setAttribute("data-non-working", "");
        if (columnMarkers[colIndex].length) td.setAttribute("data-marker", "");
        const describedBy = this.#describedBy(row.task, hasDependencySummary);
        if (describedBy) td.setAttribute("aria-describedby", describedBy);
        if (
          row.task.baseline &&
          rangesOverlap(column.start, column.end, row.task.baseline.start, row.task.baseline.end)
        ) {
          td.setAttribute("data-baseline", "");
        }
        td.addEventListener("dragover", this.#onCellDragOver);
        td.addEventListener("drop", (e) => this.#onCellDrop(column, e as DragEvent));

        if (isLeadingCell) {
          const bar = document.createElement("span");
          bar.className = "gantt-chart-bar";
          if (row.task.percentComplete != null) {
            bar.setAttribute("data-percent-complete", String(row.task.percentComplete));
          }
          if (!row.hasChildren && !this.readonly) {
            bar.setAttribute("draggable", "true");
            bar.addEventListener("dragstart", (e) => this.#onBarDragStart(row.task, e as DragEvent));
            const startHandle = document.createElement("span");
            startHandle.className = "gantt-chart-bar-handle gantt-chart-bar-handle-start";
            startHandle.setAttribute("draggable", "true");
            startHandle.setAttribute("aria-hidden", "true");
            startHandle.addEventListener("dragstart", (e) => this.#onHandleDragStart(row.task, "start", e as DragEvent));
            bar.appendChild(startHandle);
          }
          td.appendChild(bar);
        }
        if (!row.hasChildren && !this.readonly && inRange && rangesOverlap(column.start, column.end, end, end)) {
          const endHandle = document.createElement("span");
          endHandle.className = "gantt-chart-bar-handle gantt-chart-bar-handle-end";
          endHandle.setAttribute("draggable", "true");
          endHandle.setAttribute("aria-hidden", "true");
          endHandle.addEventListener("dragstart", (e) => this.#onHandleDragStart(row.task, "end", e as DragEvent));
          td.appendChild(endHandle);
        }

        tr.appendChild(td);
        this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
      });

      tbody.appendChild(tr);
      this.#rowEls.set(row.task.id, tr);
    }
    if (this.#virtualize && rows.length - 1 - previousIdx > 0) spacer(rows.length - 1 - previousIdx);
    table.appendChild(tbody);
    // The scroll area is structural: a virtualized chart renders only the rows in view inside it.
    const scroll = document.createElement("div");
    scroll.className = this.#virtualize ? "gantt-chart-scroll" : "gantt-chart-body";
    if (this.#virtualize) {
      scroll.style.height = `${this.#virtualize.height}px`;
      scroll.style.overflow = "auto";
      scroll.addEventListener("scroll", () => this.#onScroll());
    }
    scroll.appendChild(table);
    root.appendChild(scroll);
    this.#scrollEl = scroll;

    const status = document.createElement("p");
    status.className = "gantt-chart-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = this.#statusMessage;
    root.appendChild(status);

    this.replaceChildren(root);
    upgradeNestedCustomElements(root);

    this.#statusEl = status;
    if (this.#virtualize) scroll.scrollTop = this.#scrollTop;
  }
}
