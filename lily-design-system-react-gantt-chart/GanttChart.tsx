import * as React from "react";
import {
  GanttTable,
  GanttTableTD,
  GanttTableTH,
  GanttTableTbody,
  GanttTableThead,
  GanttTableTr,
} from "@lilydesignsystem/react-headless";
import DateTimePicker, {
  addDays,
  parseIsoDate,
  toEpochDay,
} from "@lilydesignsystem/react-date-time-picker";
import type { DateTimePickerLabels } from "@lilydesignsystem/react-date-time-picker";
import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data";
import { civilDateToDate } from "./cell-types";
import {
  draftOf,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText,
  editorKind,
  isEditableField,
  neighbourField,
  resolveFields,
  type Draft,
  type FieldDef,
  type ResolvedField,
} from "./typed-fields";

/**
 * A typed field a task carries (an owner, a status, an estimate), shown as a column between the task name and the timeline and
 * read from `task.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
 */
export type GanttField = FieldDef;

/** What `onExport` receives. Return `false` to take over the download. */
export type GanttExport = { format: ExportFormat; filename: string; taskCount: number; blob: Blob };

/** What `onFieldEdit` receives. */
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
  /** 0–100. Rendering the fill is the consumer's own CSS. */
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
 * names — no baked-in English fallback, matching every other
 * helper's label-gating convention. See spec/index.md §5.
 */
export type GanttLabels = {
  /** Header for the leading task-label column; an empty header cell otherwise. */
  taskColumnHeader?: string;
  columnLabel?: (start: string, end: string, timeUnit: GanttTimeUnit) => string;
  editButton?: (task: GanttTask) => string;
  startLabel?: string;
  endLabel?: string;
  /**
   * Reused for both composed DateTimePicker instances. Editing is gated on
   * this, together with `startLabel`, `endLabel`, `saveLabel` and `cancelLabel`.
   */
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

/** Public props for GanttChart. See `spec/index.md` §5 for the contract. */
export type Props = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> & {
  /** Accessible name for the chart, passed through to GanttTable. */
  label: string;
  /** Optional visible caption, passed through to GanttTable. */
  caption?: string;
  /** The chart's own overall time range. */
  range: { start: string; end: string };
  /** Task data. */
  tasks: GanttTask[];
  /** Column granularity. Controlled when given; the zoom buttons (shown when `labels.zoomIn` / `labels.zoomOut` name them) step it month ↔ week ↔ day. */
  timeUnit?: GanttTimeUnit;
  /** Called with the new unit when a zoom button is pressed. */
  onTimeUnitChange?: (timeUnit: GanttTimeUnit) => void;
  /** The selected task's id. Controlled when given. A click on a task's row or the `s` key on it selects (again deselects); the row gets `aria-selected` and `data-selected`. */
  selectedTaskId?: string;
  /** Called with the task id when selection changes, or `undefined` when it clears. */
  onTaskSelect?: (taskId: string | undefined) => void;
  /** Ids of collapsed parent tasks. Controlled when given; the collapse buttons, `labels.expandAll` and `labels.collapseAll` change it. */
  collapsedTaskIds?: string[];
  defaultCollapsedTaskIds?: string[];
  onCollapsedTaskIdsChange?: (collapsedTaskIds: string[]) => void;
  /** Extra attributes on each task's row (for example `data-team`); merged after Lily's own. */
  taskAttrs?: (task: GanttTask) => Record<string, unknown>;
  /** ISO date marking "today"; never computed internally (stays SSR-safe). */
  today?: string;
  /** Dated markers; each marks the column that contains its date with `data-marker`. */
  markers?: GanttMarker[];
  /** Consumer's own working calendar; a column is `data-non-working` when every day in it is non-working. */
  isNonWorking?: (isoDate: string) => boolean;
  /** Suppress editing, drag and the edit region; navigation and collapse still work. */
  readonly?: boolean;
  /** Resolves a task to its display label. Defaults to `task.label`. */
  taskLabel?: (task: GanttTask) => string;
  /** Called after a task's start/end changes, by pointer or by the edit region. */
  onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
  /** User-facing strings. See GanttLabels — presence gates each control. */
  labels?: GanttLabels;
  /** Typed fields: a column per field between the task name and the timeline, read from `task.values`. Editable types edit in place (click the value, or F2 on the task's row for the first editable field; Tab moves to the next). */
  fields?: GanttField[];
  /** Locale for number and date fields. Never defaulted. */
  locale?: string;
  /** Called with each accepted field edit. The consumer updates `tasks`. A field is editable only when this is set (and the chart is not `readonly`). */
  onFieldEdit?: (edit: GanttFieldEdit) => void;
  /** Base of an export's file name (`.csv`, `.tsv` or `.xlsx` is added). Default `"gantt-chart"`. */
  exportFilename?: string;
  /** What an export holds: `"all"` (default) is every task; `"visible"` leaves out the tasks under a collapsed parent. */
  exportScope?: "all" | "visible";
  /** Called before the download with the finished file. Return `false` to skip the built-in download. */
  onExport?: (info: GanttExport) => boolean | void;
  /** Renders only the task rows in view (windowing). The chart gets a scroll area of `height` px; every row is assumed `rowHeight` px tall. */
  virtualize?: { rowHeight: number; height: number; overscan?: number };
  /** Extra CSS class on the root. */
  className?: string;
};

// ---------------------------------------------------------------
// Civil-date arithmetic: UTC/epoch-day only, never local-midnight
// `Date` construction — the same rule `date-time-picker` follows, so no
// column boundary can land on the wrong day across a DST transition.
// `addDays` is reused directly from `@lilydesignsystem/react-date-time-picker`
// (same UTC-epoch-day implementation); the rest below is Gantt-specific
// and has no reusable counterpart there.
// ---------------------------------------------------------------

/** -1 / 0 / 1, ordinary string comparison works for zero-padded ISO dates. */
export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The last day of the calendar month `iso` falls in, UTC-safe. */
export function endOfMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m, 0)); // day 0 of next month = last day of this month
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Days between two ISO dates, via `date-time-picker`'s own epoch-day arithmetic. */
function epochDaysBetween(startIso: string, endIso: string): number {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return 0;
  return toEpochDay(end) - toEpochDay(start);
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

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

type FlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

/** Depth-first flatten of the parentId tree, skipping collapsed subtrees. */
export function flattenTasks(
  tasks: GanttTask[],
  collapsed: ReadonlySet<string>,
): FlatRow[] {
  // A task whose `parentId` names no task is a top-level row, not dropped.
  const ids = new Set(tasks.map((t) => t.id));
  const childrenOf = new Map<string | undefined, GanttTask[]>();
  for (const task of tasks) {
    const key =
      task.parentId != null && ids.has(task.parentId) ? task.parentId : undefined;
    const list = childrenOf.get(key) ?? [];
    list.push(task);
    childrenOf.set(key, list);
  }
  const rows: FlatRow[] = [];
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
export function effectiveRange(
  task: GanttTask,
  allTasks: GanttTask[],
): { start: string; end: string } {
  return (
    effectiveRanges(allTasks).get(task.id) ?? { start: task.start ?? "", end: task.end ?? "" }
  );
}

/**
 * Every task's effective range in one pass over the tree — computed once per
 * `tasks` change rather than re-walking every parent's subtree on each render.
 * A `parentId` cycle cannot recurse forever: a task already on the walk is
 * read as a leaf.
 */
export function effectiveRanges(
  tasks: GanttTask[],
): Map<string, { start: string; end: string }> {
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
    if (children.length === 0 || onWalk.has(task.id)) {
      return { start: task.start ?? "", end: task.end ?? "" };
    }
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

export function GanttChart({
  label,
  caption,
  range,
  tasks,
  timeUnit: timeUnitProp,
  onTimeUnitChange,
  selectedTaskId: selectedTaskIdProp,
  onTaskSelect,
  collapsedTaskIds: collapsedProp,
  defaultCollapsedTaskIds = [],
  onCollapsedTaskIdsChange,
  taskAttrs,
  today,
  markers = [],
  isNonWorking,
  readonly = false,
  taskLabel = (task: GanttTask) => task.label,
  onTaskChange,
  labels = {},
  fields,
  locale,
  onFieldEdit,
  exportFilename: exportBase = "gantt-chart",
  exportScope = "all",
  onExport,
  virtualize,
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const baseId = `gantt-chart-${React.useId()}`;
  const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [timeUnitState, setTimeUnitState] = React.useState<GanttTimeUnit>(timeUnitProp ?? "day");
  const timeUnit = timeUnitProp ?? timeUnitState;
  const [selectedState, setSelectedState] = React.useState<string | undefined>(undefined);
  const selectedTaskId = selectedTaskIdProp ?? selectedState;
  const resizingEdgeRef = React.useRef<"start" | "end" | null>(null);
  const [collapsedInner, setCollapsedInner] = React.useState<string[]>(defaultCollapsedTaskIds);
  const collapsedTaskIds = collapsedProp ?? collapsedInner;
  const collapsed = React.useMemo<ReadonlySet<string>>(() => new Set(collapsedTaskIds), [collapsedTaskIds]);
  function commitCollapsed(next: string[]): void {
    if (collapsedProp === undefined) setCollapsedInner(next);
    onCollapsedTaskIdsChange?.(next);
  }
  const [focusedRow, setFocusedRow] = React.useState(0);
  const [focusedCol, setFocusedCol] = React.useState(0);

  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(
    null,
  );
  const [editStart, setEditStart] = React.useState("");
  const [editEnd, setEditEnd] = React.useState("");
  const [editPercent, setEditPercent] = React.useState("");

  const draggingTaskIdRef = React.useRef<string | null>(null);
  /**
   * Focus to move after the next commit: the grid's tab stop, or the edit
   * region's start field. Only ever set by a user action, so mounting the
   * chart never takes focus from the page.
   */
  const pendingFocusRef = React.useRef<"cell" | "edit" | "field" | null>(null);

  const columns = React.useMemo(() => generateColumns(range, timeUnit), [range.start, range.end, timeUnit]);
  const rows = flattenTasks(tasks, collapsed);
  const ranges = React.useMemo(() => effectiveRanges(tasks), [tasks]);
  const taskById = React.useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  // Markers and today per column, found once per change rather than once per cell per render.
  const markersByColumn = React.useMemo(
    () => columns.map((column) => markers.filter((m) => rangesOverlap(column.start, column.end, m.date, m.date))),
    [columns, markers],
  );
  const markersAt = (colIndex: number): GanttMarker[] => markersByColumn[colIndex] ?? [];
  const todayColumns = React.useMemo(
    () => columns.map((column) => today != null && rangesOverlap(column.start, column.end, today, today)),
    [columns, today],
  );

  // The roving cursor, clamped to the cells that exist now: collapsing a parent
  // can remove the row it named, and the grid must never leave the tab order.
  const activeRow = Math.min(focusedRow, rows.length - 1);
  const activeCol = Math.min(focusedCol, columns.length - 1);

  /** Editing needs every label its controls show; an unnamed Save is worse than none. */
  const canEdit =
    !readonly &&
    !!labels.dateTimePickerLabels &&
    !!labels.startLabel &&
    !!labels.endLabel &&
    !!labels.saveLabel &&
    !!labels.cancelLabel;

  function columnNonWorking(column: GanttColumn): boolean {
    if (!isNonWorking) return false;
    for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
      if (!isNonWorking(d)) return false;
    }
    return true;
  }

  const nonWorking = React.useMemo(() => columns.map(columnNonWorking), [columns, isNonWorking]);

  function rangeFor(
    task: GanttTask,
    hasChildren: boolean,
  ): { start: string; end: string } {
    return hasChildren
      ? (ranges.get(task.id) ?? { start: "", end: "" })
      : { start: task.start ?? "", end: task.end ?? "" };
  }

  function announce(message: string | undefined): void {
    if (message) setStatusMessage(message);
  }

  // ---------------------------------------------------------------
  // Typed fields, inline editing, export
  // ---------------------------------------------------------------

  // Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per task or keystroke.
  const resolvedFields = React.useMemo(() => resolveFields(fields, locale), [fields, locale]);
  const isFieldEditable = (f: GanttField) => !!onFieldEdit && !readonly && isEditableField(f);

  /** The field being edited, if any: the draft is the editor's text. A ref mirrors it so a blur that lands in the same event as Enter sees it cleared. */
  type Editing = { taskId: string; fieldId: string; draft: Draft };
  const [editingField, setEditingFieldState] = React.useState<Editing | null>(null);
  const editingFieldRef = React.useRef<Editing | null>(null);
  function setEditingField(next: Editing | null): void {
    editingFieldRef.current = next;
    setEditingFieldState(next);
  }

  function startFieldEdit(task: GanttTask, f: ResolvedField): void {
    if (!isFieldEditable(f)) return;
    setEditingTaskId(null);
    setEditingField({ taskId: task.id, fieldId: f.id, draft: draftOf(f, task.values) });
    pendingFocusRef.current = "field";
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  function commitFieldEdit(): boolean {
    const current = editingFieldRef.current;
    if (!current) return true;
    const { taskId, fieldId, draft } = current;
    const task = taskById.get(taskId);
    const f = resolvedFields.find((x) => x.id === fieldId);
    if (!task || !f) {
      setEditingField(null);
      return true;
    }
    const outcome = evaluateEdit(f, task.values, draft);
    if (outcome.invalid) {
      announce(labels.editInvalid?.(taskLabel(task), f.header));
      return false;
    }
    setEditingField(null);
    if (outcome.changed) {
      onFieldEdit?.({ taskId, fieldId, value: outcome.value, previous: outcome.previous });
      announce(labels.editAnnouncement?.(taskLabel(task), f.header, outcome.text));
    }
    return true;
  }

  function cancelFieldEdit(): void {
    setEditingField(null);
    pendingFocusRef.current = "cell";
  }

  function onFieldEditorKeyDown(event: React.KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      if (commitFieldEdit()) pendingFocusRef.current = "cell";
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelFieldEdit();
    } else if (event.key === "Tab" && editingFieldRef.current) {
      // Tab commits and moves to the task's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const current = editingFieldRef.current;
      const task = taskById.get(current.taskId);
      const next = neighbourField(resolvedFields.filter(isFieldEditable), current.fieldId, event.shiftKey);
      if (task && next) {
        event.preventDefault();
        if (commitFieldEdit()) startFieldEdit(task, next);
      } else {
        commitFieldEdit();
      }
    }
  }

  const exportRows = exportScope === "visible" ? rows.map((r) => r.task) : flattenTasks(tasks, new Set<string>()).map((r) => r.task);
  const hasExportButtons = !!labels.exportHeaders && !!(labels.exportCsv || labels.exportTsv || labels.exportExcel);

  /** A civil date as a real date for the spreadsheet; an unscheduled task's empty date as null. */
  const exportDate = (iso: string | undefined): Date | null => (iso ? civilDateToDate(iso) : null);

  function runExport(format: ExportFormat): void {
    const h = labels.exportHeaders;
    if (!h) return;
    const exportFields = exportableFields(resolvedFields);
    const headers = [h.task, h.start, h.end];
    if (h.percentComplete) headers.push(h.percentComplete);
    if (h.parent) headers.push(h.parent);
    if (h.dependsOn) headers.push(h.dependsOn);
    if (h.baselineStart) headers.push(h.baselineStart);
    if (h.baselineEnd) headers.push(h.baselineEnd);
    for (const f of exportFields) headers.push(f.header);
    const hasChildren = new Set(tasks.filter((t) => t.parentId != null && taskById.has(t.parentId)).map((t) => t.parentId as string));
    const body = exportRows.map((task) => {
      const span = hasChildren.has(task.id) ? (ranges.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
      const cells: unknown[] = [taskLabel(task), exportDate(span.start), exportDate(span.end)];
      if (h.percentComplete) cells.push(task.percentComplete ?? null);
      if (h.parent) cells.push(task.parentId != null && taskById.has(task.parentId) ? taskLabel(taskById.get(task.parentId)!) : null);
      if (h.dependsOn) {
        cells.push(
          (task.dependsOn ?? [])
            .map((dep) => {
              const id = typeof dep === "string" ? dep : dep.id;
              const predecessor = taskById.get(id);
              return predecessor ? taskLabel(predecessor) : id;
            })
            .join("; "),
        );
      }
      if (h.baselineStart) cells.push(exportDate(task.baseline?.start));
      if (h.baselineEnd) cells.push(exportDate(task.baseline?.end));
      for (const f of exportFields) cells.push(exportFieldCell(f, task.values));
      return cells;
    });
    const filename = exportFilename(exportBase, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: exportBase });
    if (onExport?.({ format, filename, taskCount: body.length, blob }) === false) return;
    downloadBlob(blob, filename);
    announce(labels.exportAnnouncement?.(format, body.length, filename));
  }

  // ---------------------------------------------------------------
  // Windowing (virtualize)
  // ---------------------------------------------------------------

  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  type RenderItem = { kind: "spacer"; height: number; key: string } | { kind: "row"; row: (typeof rows)[number]; index: number; key: string };
  /** What renders: the rows in view plus the roving tab stop's row (so the grid never leaves the tab order), with spacers for the gaps. */
  const renderItems: RenderItem[] = [];
  if (!virtualize) {
    rows.forEach((row, index) => renderItems.push({ kind: "row", row, index, key: row.task.id }));
  } else {
    const overscan = virtualize.overscan ?? 3;
    const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
    const end = Math.min(rows.length, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    if (activeRow >= 0 && activeRow < rows.length) indices.add(activeRow);
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
      if (index - previous > 1) renderItems.push({ kind: "spacer", height: (index - previous - 1) * virtualize.rowHeight, key: `spacer:${previous}` });
      renderItems.push({ kind: "row", row: rows[index], index, key: rows[index].task.id });
      previous = index;
    }
    if (rows.length - 1 - previous > 0) renderItems.push({ kind: "spacer", height: (rows.length - 1 - previous) * virtualize.rowHeight, key: `spacer:${previous}` });
  }

  /** Bring a row into the scroll area (a virtualized chart renders only what is in view). */
  function revealRow(rowIndex: number): void {
    if (!virtualize) return;
    const top = rowIndex * virtualize.rowHeight;
    let next = scrollTop;
    if (top < scrollTop) next = top;
    else if (top + virtualize.rowHeight > scrollTop + virtualize.height) next = top + virtualize.rowHeight - virtualize.height;
    if (next !== scrollTop) {
      setScrollTop(next);
      if (scrollRef.current) scrollRef.current.scrollTop = next;
    }
  }

  // ---------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------

  function toggleCollapse(taskId: string): void {
    commitCollapsed(collapsed.has(taskId) ? collapsedTaskIds.filter((id) => id !== taskId) : [...collapsedTaskIds, taskId]);
  }

  /** Every task that has children (the ones a collapse button applies to). */
  const parentIds = Array.from(new Set(tasks.filter((t) => t.parentId != null).map((t) => t.parentId as string))).filter((id) =>
    taskById.has(id),
  );

  function setAllCollapsed(value: boolean): void {
    commitCollapsed(value ? parentIds : []);
  }

  // ---------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------

  function predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((dep) => {
      const id = typeof dep === "string" ? dep : dep.id;
      const predecessor = taskById.get(id);
      const text = predecessor ? taskLabel(predecessor) : id;
      if (typeof dep === "string" || !labels.dependencyDetail) return text;
      return labels.dependencyDetail(text, dep.type ?? "e2s", dep.lag ?? 0);
    });
  }

  // ---------------------------------------------------------------
  // Baseline
  // ---------------------------------------------------------------

  const baselineId = (taskId: string) => `${baseId}-baseline-${taskId}`;

  /** The ids a cell is described by: the dependency summary, then the baseline summary. */
  function describedBy(task: GanttTask, hasDeps: boolean): string | undefined {
    const ids: string[] = [];
    if (hasDeps && labels.dependencySummary) ids.push(dependencyId(task.id));
    if (task.baseline && labels.baselineSummary) ids.push(baselineId(task.id));
    return ids.length ? ids.join(" ") : undefined;
  }

  // ---------------------------------------------------------------
  // Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
  // ---------------------------------------------------------------

  function applyChange(task: GanttTask, start: string, end: string, percentComplete?: number): void {
    if (percentComplete === undefined) onTaskChange?.(task.id, start, end);
    else onTaskChange?.(task.id, start, end, percentComplete);
    announce(labels.dateAnnouncement?.(taskLabel(task), start, end));
  }

  function openEdit(task: GanttTask): void {
    if (!canEdit) return;
    setEditingTaskId(task.id);
    setEditStart(task.start ?? "");
    setEditEnd(task.end ?? "");
    setEditPercent(task.percentComplete != null ? String(task.percentComplete) : "");
    // Focus moves into the region it opened, onto the start date's field.
    pendingFocusRef.current = "edit";
  }

  /** A range entered end-first is saved start-first; Save is disabled while either date is empty. */
  function saveEdit(task: GanttTask): void {
    if (!editStart || !editEnd) return;
    const [start, end] =
      compareISO(editStart, editEnd) <= 0
        ? [editStart, editEnd]
        : [editEnd, editStart];
    const percent =
      labels.percentLabel && editPercent !== ""
        ? Math.min(100, Math.max(0, Math.round(Number(editPercent))))
        : undefined;
    applyChange(task, start, end, percent !== undefined && Number.isFinite(percent) ? percent : undefined);
    closeEdit();
  }

  /** Closing either way returns focus to the grid's tab stop, on the edited task's row. */
  function closeEdit(): void {
    setEditingTaskId(null);
    pendingFocusRef.current = "cell";
  }

  function onEditKeyDown(event: React.KeyboardEvent): void {
    // Escape cancels, unless a date picker's own dialog used it to close itself.
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      closeEdit();
    }
  }

  function onBarDragStart(task: GanttTask, event: React.DragEvent): void {
    draggingTaskIdRef.current = task.id;
    resizingEdgeRef.current = null;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  function onHandleDragStart(task: GanttTask, edge: "start" | "end", event: React.DragEvent): void {
    event.stopPropagation();
    draggingTaskIdRef.current = task.id;
    resizingEdgeRef.current = edge;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  // ---- Zoom ----
  const ZOOM_ORDER: GanttTimeUnit[] = ["month", "week", "day"];
  const zoomIndex = ZOOM_ORDER.indexOf(timeUnit);

  function zoom(delta: 1 | -1): void {
    const next = ZOOM_ORDER[zoomIndex + delta];
    if (!next) return;
    setTimeUnitState(next);
    onTimeUnitChange?.(next);
    announce(labels.zoomAnnouncement?.(next));
  }

  // ---- Selection ----
  function selectTask(taskId: string): void {
    const next = selectedTaskId === taskId ? undefined : taskId;
    setSelectedState(next);
    onTaskSelect?.(next);
  }

  function onGridClick(event: React.MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, select, .gantt-chart-edit-row, .gantt-chart-field-editor")) return;
    const taskId = target.closest<HTMLElement>("[data-task-id]")?.dataset.taskId;
    if (taskId) selectTask(taskId);
  }

  // ---- Keyboard shift / resize (Alt+Arrow) ----
  function columnIndexOf(isoDate: string): number {
    return columns.findIndex((c) => rangesOverlap(c.start, c.end, isoDate, isoDate));
  }

  function shiftTask(task: GanttTask, delta: 1 | -1, endOnly: boolean): void {
    if (!task.start || !task.end) return; // an unscheduled task has nothing to shift
    if (endOnly) {
      const target = columns[columnIndexOf(task.end) + delta];
      if (target && compareISO(task.start, target.end) <= 0) applyChange(task, task.start, target.end);
      return;
    }
    const target = columns[columnIndexOf(task.start) + delta];
    if (!target) return;
    applyChange(task, target.start, addDays(target.start, epochDaysBetween(task.start, task.end)));
  }

  function onCellDragOver(event: React.DragEvent): void {
    if (draggingTaskIdRef.current) event.preventDefault();
  }

  function onCellDrop(column: GanttColumn, event: React.DragEvent): void {
    if (readonly) return;
    event.preventDefault();
    const taskId =
      draggingTaskIdRef.current ?? event.dataTransfer?.getData("text/plain");
    draggingTaskIdRef.current = null;
    const task = taskId ? taskById.get(taskId) : undefined;
    const edge = resizingEdgeRef.current;
    resizingEdgeRef.current = null;
    if (!task || !task.start || !task.end) return;
    if (edge) {
      // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
      const start = edge === "start" ? column.start : task.start;
      const end = edge === "end" ? column.end : task.end;
      if (compareISO(start, end) <= 0 && (start !== task.start || end !== task.end)) applyChange(task, start, end);
      return;
    }
    const duration = epochDaysBetween(task.start, task.end);
    applyChange(task, column.start, addDays(column.start, duration));
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  function moveFocus(row: number, col: number): void {
    const nextRow = Math.min(Math.max(row, 0), rows.length - 1);
    setFocusedRow(nextRow);
    setFocusedCol(Math.min(Math.max(col, 0), columns.length - 1));
    revealRow(nextRow);
    pendingFocusRef.current = "cell";
  }

  // Runs after every commit, and acts only on a pending request.
  React.useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;
    const selector =
      pending === "edit"
        ? ".gantt-chart-edit-row .date-time-picker-input"
        : pending === "field"
          ? ".gantt-chart-field-editor"
          : '.gantt-table-td[tabindex="0"]';
    const target = rootRef.current?.querySelector<HTMLElement>(selector);
    target?.focus({ preventScroll: true });
    if (pending === "field" && target instanceof HTMLInputElement && target.type !== "number" && target.type !== "date" && target.type !== "time") target.select();
  });

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  function onGridFocus(event: React.FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-row][data-col]",
    );
    if (!cell) return;
    setFocusedRow(Number(cell.dataset.row));
    setFocusedCol(Number(cell.dataset.col));
  }

  function onGridKeyDown(event: React.KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-row][data-col]",
    );
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (event.key === "F2" && onFieldEdit) {
      // F2: edit the task's first editable field (the keyboard twin of clicking its value).
      const row = rows[activeRow];
      const first = resolvedFields.find(isFieldEditable);
      if (row && first) {
        event.preventDefault();
        startFieldEdit(row.task, first);
      }
      return;
    }
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
      const row = rows[activeRow];
      if (row && !row.hasChildren && !readonly && (event.target as HTMLElement).closest(".gantt-table-td")) {
        event.preventDefault();
        shiftTask(row.task, event.key === "ArrowLeft" ? -1 : 1, event.shiftKey);
        return;
      }
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
        else moveFocus(activeRow, 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) moveFocus(rows.length - 1, columns.length - 1);
        else moveFocus(activeRow, columns.length - 1);
        break;
      case "s":
      case "S": {
        if (event.ctrlKey || event.metaKey || event.altKey) break;
        const row = rows[activeRow];
        if (row && (event.target as HTMLElement).closest(".gantt-table-td")) {
          event.preventDefault();
          selectTask(row.task.id);
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const row = rows[activeRow];
        if (row && !row.hasChildren) openEdit(row.task);
        break;
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`gantt-chart ${className}`.trim()}
      data-readonly={readonly ? "" : undefined}
      {...restProps}
    >
      {parentIds.length > 0 && (labels.expandAll || labels.collapseAll) && (
        <div className="gantt-chart-collapse-all" role="group" aria-label={label}>
          {labels.expandAll && (
            <button type="button" className="gantt-chart-expand-all-button" disabled={collapsedTaskIds.length === 0} onClick={() => setAllCollapsed(false)}>
              {labels.expandAll}
            </button>
          )}
          {labels.collapseAll && (
            <button type="button" className="gantt-chart-collapse-all-button" disabled={parentIds.every((id) => collapsed.has(id))} onClick={() => setAllCollapsed(true)}>
              {labels.collapseAll}
            </button>
          )}
        </div>
      )}
      {hasExportButtons && (
        <div className="gantt-chart-export" role="group" aria-label={labels.export}>
          {labels.exportCsv && (
            <button type="button" className="gantt-chart-export-button" data-gantt-export-format="csv" disabled={exportRows.length === 0} onClick={() => runExport("csv")}>
              {labels.exportCsv}
            </button>
          )}
          {labels.exportTsv && (
            <button type="button" className="gantt-chart-export-button" data-gantt-export-format="tsv" disabled={exportRows.length === 0} onClick={() => runExport("tsv")}>
              {labels.exportTsv}
            </button>
          )}
          {labels.exportExcel && (
            <button type="button" className="gantt-chart-export-button" data-gantt-export-format="xlsx" disabled={exportRows.length === 0} onClick={() => runExport("xlsx")}>
              {labels.exportExcel}
            </button>
          )}
        </div>
      )}
      {(labels.zoomIn || labels.zoomOut) && (
        <div className="gantt-chart-zoom" role="group" aria-label={label}>
          {labels.zoomOut && (
            <button type="button" className="gantt-chart-zoom-out-button" aria-label={labels.zoomOut} disabled={zoomIndex <= 0} onClick={() => zoom(-1)}>
              −
            </button>
          )}
          {labels.zoomIn && (
            <button type="button" className="gantt-chart-zoom-in-button" aria-label={labels.zoomIn} disabled={zoomIndex >= ZOOM_ORDER.length - 1} onClick={() => zoom(1)}>
              +
            </button>
          )}
        </div>
      )}
      {/* The scroll area is structural: a virtualized chart renders only the rows in view inside it. */}
      <div
        ref={scrollRef}
        className={virtualize ? "gantt-chart-scroll" : "gantt-chart-body"}
        style={virtualize ? { height: virtualize.height, overflow: "auto" } : undefined}
        onScroll={virtualize ? (e) => setScrollTop((e.currentTarget as HTMLElement).scrollTop) : undefined}
      >
      <GanttTable
        label={label}
        caption={caption}
        onKeyDown={onGridKeyDown}
        onFocus={onGridFocus}
        onClick={onGridClick}
        aria-rowcount={virtualize ? rows.length + 1 : undefined}
      >
        <GanttTableThead>
          <GanttTableTr>
            <GanttTableTH scope="col">{labels.taskColumnHeader ?? ""}</GanttTableTH>
            {resolvedFields.map((f) => (
              <GanttTableTH key={f.id} scope="col" data-field={f.id}>
                {f.header}
              </GanttTableTH>
            ))}
            {columns.map((column, headIndex) => {
              const isToday = todayColumns[headIndex];
              const colMarkers = markersAt(headIndex);
              return (
                <GanttTableTH
                  key={column.start}
                  scope="col"
                  data-today={isToday ? "" : undefined}
                  data-non-working={nonWorking[headIndex] ? "" : undefined}
                  data-marker={
                    colMarkers.length
                      ? colMarkers.map((m) => m.kind ?? "marker").join(" ")
                      : undefined
                  }
                >
                  {labels.columnLabel?.(column.start, column.end, timeUnit) ??
                    column.start}
                  {colMarkers.map(
                    (marker) =>
                      marker.label && (
                        <span
                          key={marker.date + (marker.kind ?? "")}
                          className="gantt-chart-marker-label"
                        >
                          {marker.label}
                        </span>
                      ),
                  )}
                </GanttTableTH>
              );
            })}
          </GanttTableTr>
        </GanttTableThead>
        <GanttTableTbody>
          {renderItems.map((item) => {
            if (item.kind === "spacer") {
              return (
                <tr key={item.key} className="gantt-chart-spacer" aria-hidden="true" style={{ height: item.height }}>
                  <td colSpan={columns.length + 1 + resolvedFields.length} />
                </tr>
              );
            }
            const row = item.row;
            const rowIndex = item.index;
            const { start, end } = rangeFor(row.task, row.hasChildren);
            const deps = predecessorLabels(row.task);
            const hasDependencySummary = deps.length > 0 && !!labels.dependencySummary;
            return (
              <React.Fragment key={row.task.id}>
                <GanttTableTr
                  data-task-type={row.task.type}
                  data-critical={row.task.critical ? "" : undefined}
                  data-slack={row.task.slack}
                  aria-rowindex={virtualize ? rowIndex + 2 : undefined}
                  data-task-id={row.task.id}
                  data-unscheduled={!row.hasChildren && (!row.task.start || !row.task.end) ? "" : undefined}
                  aria-selected={selectedTaskId === row.task.id ? true : undefined}
                  data-selected={selectedTaskId === row.task.id ? "" : undefined}
                  {...(taskAttrs?.(row.task) ?? {})}
                >
                  {/* Depth is data for the consumer's CSS (indentation), never an inline style. */}
                  <GanttTableTH scope="row" data-depth={row.depth}>
                    {row.hasChildren && labels.collapseButton && (
                      <button
                        type="button"
                        className="gantt-chart-collapse-button"
                        aria-expanded={!collapsed.has(row.task.id)}
                        aria-label={labels.collapseButton(
                          row.task,
                          collapsed.has(row.task.id),
                        )}
                        onClick={() => toggleCollapse(row.task.id)}
                      >
                        {collapsed.has(row.task.id) ? "▸" : "▾"}
                      </button>
                    )}
                    {taskLabel(row.task)}
                    {hasDependencySummary && (
                      <span
                        id={dependencyId(row.task.id)}
                        className="gantt-chart-dependency-summary"
                        hidden
                      >
                        {labels.dependencySummary!(deps)}
                      </span>
                    )}
                    {row.task.baseline && labels.baselineSummary && (
                      <span
                        id={baselineId(row.task.id)}
                        className="gantt-chart-baseline-summary"
                        hidden
                      >
                        {labels.baselineSummary(
                          taskLabel(row.task),
                          row.task.baseline,
                          end ? epochDaysBetween(row.task.baseline.end, end) : 0,
                        )}
                      </span>
                    )}
                  </GanttTableTH>
                  {resolvedFields.map((f) => {
                    const text = fieldText(f, row.task.values);
                    const editable = isFieldEditable(f);
                    const nameId = `${baseId}-fn-${row.task.id}-${f.id}`;
                    const valueId = `${baseId}-fv-${row.task.id}-${f.id}`;
                    const kind = editorKind(f);
                    return (
                      <GanttTableTD key={f.id} data-field={f.id} data-type={f.type ?? "text"} data-align={f.align}>
                        {editingField && editingField.taskId === row.task.id && editingField.fieldId === f.id ? (
                          kind === "select" || kind === "radio" ? (
                            <select
                              className="gantt-chart-field-editor"
                              aria-label={f.editLabel ?? f.header}
                              value={String(editingField.draft ?? "")}
                              onChange={(e) => {
                                setEditingField({ ...editingField, draft: e.target.value });
                                if (commitFieldEdit()) pendingFocusRef.current = "cell";
                              }}
                              onKeyDown={onFieldEditorKeyDown}
                              onBlur={() => commitFieldEdit()}
                            >
                              <option value="" />
                              {(f.options ?? []).map((option) => (
                                <option key={option.id} value={option.id} disabled={option.disabled}>{option.label}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="gantt-chart-field-editor"
                              aria-label={f.editLabel ?? f.header}
                              type={kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text"}
                              inputMode={kind === "number" ? "decimal" : undefined}
                              value={String(editingField.draft ?? "")}
                              onChange={(e) => setEditingField({ ...editingField, draft: e.target.value })}
                              onKeyDown={onFieldEditorKeyDown}
                              onBlur={() => commitFieldEdit()}
                            />
                          )
                        ) : editable ? (
                          <>
                            <span id={nameId} hidden>{f.header}</span>
                            <button type="button" className="gantt-chart-field-button" id={valueId} tabIndex={-1} aria-labelledby={`${nameId} ${valueId}`} onClick={() => startFieldEdit(row.task, f)}>{text}</button>
                          </>
                        ) : (
                          text
                        )}
                      </GanttTableTD>
                    );
                  })}
                  {columns.map((column, colIndex) => {
                    const inRange = !!start && !!end && rangesOverlap(column.start, column.end, start, end);
                    const isMilestone = inRange && start === end;
                    const isToday = todayColumns[colIndex];
                    const isLeadingCell =
                      inRange && rangesOverlap(column.start, column.end, start, start);
                    return (
                      <GanttTableTD
                        key={column.start}
                        data-row={rowIndex}
                        data-col={colIndex}
                        active={activeRow === rowIndex && activeCol === colIndex}
                        data-in-range={inRange ? "" : undefined}
                        data-milestone={isMilestone ? "" : undefined}
                        data-today={isToday ? "" : undefined}
                        data-non-working={nonWorking[colIndex] ? "" : undefined}
                        data-marker={markersAt(colIndex).length ? "" : undefined}
                        aria-describedby={describedBy(row.task, deps.length > 0)}
                        data-baseline={
                          row.task.baseline &&
                          rangesOverlap(column.start, column.end, row.task.baseline.start, row.task.baseline.end)
                            ? ""
                            : undefined
                        }
                        onDragOver={onCellDragOver}
                        onDrop={(e: React.DragEvent) => onCellDrop(column, e)}
                      >
                        {isLeadingCell && (
                          <span
                            className="gantt-chart-bar"
                            data-percent-complete={row.task.percentComplete ?? undefined}
                            draggable={!row.hasChildren && !readonly}
                            onDragStart={(e) => onBarDragStart(row.task, e)}
                          >
                            {!row.hasChildren && !readonly && (
                              <span
                                className="gantt-chart-bar-handle gantt-chart-bar-handle-start"
                                draggable
                                aria-hidden="true"
                                onDragStart={(e) => onHandleDragStart(row.task, "start", e)}
                              />
                            )}
                          </span>
                        )}
                        {!row.hasChildren && !readonly && inRange && rangesOverlap(column.start, column.end, end, end) && (
                          <span
                            className="gantt-chart-bar-handle gantt-chart-bar-handle-end"
                            draggable
                            aria-hidden="true"
                            onDragStart={(e) => onHandleDragStart(row.task, "end", e)}
                          />
                        )}
                      </GanttTableTD>
                    );
                  })}
                </GanttTableTr>
                {editingTaskId === row.task.id && canEdit && labels.dateTimePickerLabels && (
                  <tr className="gantt-chart-edit-row">
                    <td colSpan={columns.length + 1 + resolvedFields.length} onKeyDown={onEditKeyDown}>
                      <DateTimePicker
                        label={labels.startLabel ?? ""}
                        labels={labels.dateTimePickerLabels}
                        mode="date"
                        value={editStart}
                        onChange={setEditStart}
                      />
                      <DateTimePicker
                        label={labels.endLabel ?? ""}
                        labels={labels.dateTimePickerLabels}
                        mode="date"
                        value={editEnd}
                        onChange={setEditEnd}
                      />
                      {labels.percentLabel && (
                        <label className="gantt-chart-percent-label">
                          {labels.percentLabel}
                          <input
                            className="gantt-chart-percent-input"
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={editPercent}
                            onChange={(e) => setEditPercent(e.target.value)}
                          />
                        </label>
                      )}
                      <button
                        type="button"
                        className="gantt-chart-save-button"
                        disabled={!editStart || !editEnd}
                        onClick={() => saveEdit(row.task)}
                      >
                        {labels.saveLabel ?? ""}
                      </button>
                      <button
                        type="button"
                        className="gantt-chart-cancel-button"
                        onClick={closeEdit}
                      >
                        {labels.cancelLabel ?? ""}
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </GanttTableTbody>
      </GanttTable>
      </div>

      <p className="gantt-chart-status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

export default GanttChart;
