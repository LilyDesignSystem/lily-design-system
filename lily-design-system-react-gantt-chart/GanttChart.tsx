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

/** A dependency with its type (`e2s` finish-to-start, `s2s`, `s2e`, `e2e`) and lag in days; data and text only. */
export type GanttDependency = { id: string; type?: "e2s" | "s2s" | "s2e" | "e2e"; lag?: number };

export type GanttTask = {
  /** Stable task identifier. */
  id: string;
  /** Visible task label. */
  label: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. */
  start: string;
  /** ISO date (`YYYY-MM-DD`), inclusive. Equal to `start` means a milestone. */
  end: string;
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
  /** Column granularity. A static rendering choice, not an interactive zoom control. */
  timeUnit?: GanttTimeUnit;
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
    effectiveRanges(allTasks).get(task.id) ?? { start: task.start, end: task.end }
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
      return { start: task.start, end: task.end };
    }
    onWalk.add(task.id);
    let start = "";
    let end = "";
    for (const child of children) {
      const r = visit(child);
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
  timeUnit = "day",
  today,
  markers = [],
  isNonWorking,
  readonly = false,
  taskLabel = (task: GanttTask) => task.label,
  onTaskChange,
  labels = {},
  className = "",
  ...restProps
}: Props): React.ReactElement {
  const baseId = `gantt-chart-${React.useId()}`;
  const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    new Set(),
  );
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
  const pendingFocusRef = React.useRef<"cell" | "edit" | null>(null);

  const columns = generateColumns(range, timeUnit);
  const rows = flattenTasks(tasks, collapsed);
  const ranges = React.useMemo(() => effectiveRanges(tasks), [tasks]);

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

  function markersIn(column: GanttColumn): GanttMarker[] {
    return markers.filter((m) =>
      rangesOverlap(column.start, column.end, m.date, m.date),
    );
  }

  function columnNonWorking(column: GanttColumn): boolean {
    if (!isNonWorking) return false;
    for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
      if (!isNonWorking(d)) return false;
    }
    return true;
  }

  const nonWorking = columns.map(columnNonWorking);

  function rangeFor(
    task: GanttTask,
    hasChildren: boolean,
  ): { start: string; end: string } {
    return hasChildren
      ? (ranges.get(task.id) ?? task)
      : { start: task.start, end: task.end };
  }

  function announce(message: string | undefined): void {
    if (message) setStatusMessage(message);
  }

  // ---------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------

  function toggleCollapse(taskId: string): void {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  // ---------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------

  function predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((dep) => {
      const id = typeof dep === "string" ? dep : dep.id;
      const predecessor = tasks.find((t) => t.id === id);
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
    setEditStart(task.start);
    setEditEnd(task.end);
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
    event.dataTransfer?.setData("text/plain", task.id);
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const duration = epochDaysBetween(task.start, task.end);
    applyChange(task, column.start, addDays(column.start, duration));
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  function moveFocus(row: number, col: number): void {
    setFocusedRow(Math.min(Math.max(row, 0), rows.length - 1));
    setFocusedCol(Math.min(Math.max(col, 0), columns.length - 1));
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
        : '.gantt-table-td[tabindex="0"]';
    rootRef.current
      ?.querySelector<HTMLElement>(selector)
      ?.focus({ preventScroll: true });
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
      <GanttTable
        label={label}
        caption={caption}
        onKeyDown={onGridKeyDown}
        onFocus={onGridFocus}
      >
        <GanttTableThead>
          <GanttTableTr>
            <GanttTableTH scope="col">{labels.taskColumnHeader ?? ""}</GanttTableTH>
            {columns.map((column, headIndex) => {
              const isToday =
                today != null &&
                rangesOverlap(column.start, column.end, today, today);
              const colMarkers = markersIn(column);
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
          {rows.map((row, rowIndex) => {
            const { start, end } = rangeFor(row.task, row.hasChildren);
            const deps = predecessorLabels(row.task);
            const hasDependencySummary = deps.length > 0 && !!labels.dependencySummary;
            return (
              <React.Fragment key={row.task.id}>
                <GanttTableTr
                  data-task-type={row.task.type}
                  data-critical={row.task.critical ? "" : undefined}
                  data-slack={row.task.slack}
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
                          epochDaysBetween(row.task.baseline.end, end),
                        )}
                      </span>
                    )}
                  </GanttTableTH>
                  {columns.map((column, colIndex) => {
                    const inRange = rangesOverlap(column.start, column.end, start, end);
                    const isMilestone = inRange && start === end;
                    const isToday =
                      today != null &&
                      rangesOverlap(column.start, column.end, today, today);
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
                        data-marker={markersIn(column).length ? "" : undefined}
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
                          />
                        )}
                      </GanttTableTD>
                    );
                  })}
                </GanttTableTr>
                {editingTaskId === row.task.id && canEdit && labels.dateTimePickerLabels && (
                  <tr className="gantt-chart-edit-row">
                    <td colSpan={columns.length + 1} onKeyDown={onEditKeyDown}>
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

      <p className="gantt-chart-status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}

export default GanttChart;
