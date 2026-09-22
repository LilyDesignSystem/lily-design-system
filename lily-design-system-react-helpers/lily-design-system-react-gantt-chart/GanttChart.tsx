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
  dependsOn?: string[];
};

export type GanttTimeUnit = "day" | "week" | "month";

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other
 * helper's label-gating convention. See spec/index.md §5.
 */
export type GanttLabels = {
  columnLabel?: (start: string, end: string, timeUnit: GanttTimeUnit) => string;
  editButton?: (task: GanttTask) => string;
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
  /** Resolves a task to its display label. Defaults to `task.label`. */
  taskLabel?: (task: GanttTask) => string;
  /** Called after a task's start/end changes, by pointer or by the edit region. */
  onTaskChange?: (taskId: string, start: string, end: string) => void;
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
  const childrenOf = new Map<string | undefined, GanttTask[]>();
  for (const task of tasks) {
    const key = task.parentId;
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

export function GanttChart({
  label,
  caption,
  range,
  tasks,
  timeUnit = "day",
  today,
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

  const draggingTaskIdRef = React.useRef<string | null>(null);

  const columns = generateColumns(range, timeUnit);
  const rows = flattenTasks(tasks, collapsed);

  function rangeFor(
    task: GanttTask,
    hasChildren: boolean,
  ): { start: string; end: string } {
    return hasChildren ? effectiveRange(task, tasks) : { start: task.start, end: task.end };
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
    return task.dependsOn.map((id) => {
      const predecessor = tasks.find((t) => t.id === id);
      return predecessor ? taskLabel(predecessor) : id;
    });
  }

  // ---------------------------------------------------------------
  // Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
  // ---------------------------------------------------------------

  function applyChange(task: GanttTask, start: string, end: string): void {
    onTaskChange?.(task.id, start, end);
    announce(labels.dateAnnouncement?.(taskLabel(task), start, end));
  }

  function openEdit(task: GanttTask): void {
    if (!labels.dateTimePickerLabels) return;
    setEditingTaskId(task.id);
    setEditStart(task.start);
    setEditEnd(task.end);
  }

  function saveEdit(task: GanttTask): void {
    applyChange(task, editStart, editEnd);
    setEditingTaskId(null);
  }

  function cancelEdit(): void {
    setEditingTaskId(null);
  }

  function onBarDragStart(task: GanttTask, event: React.DragEvent): void {
    draggingTaskIdRef.current = task.id;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  function onCellDragOver(event: React.DragEvent): void {
    if (draggingTaskIdRef.current) event.preventDefault();
  }

  function onCellDrop(column: GanttColumn, event: React.DragEvent): void {
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
  }

  React.useEffect(() => {
    rootRef.current
      ?.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')
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
        else moveFocus(focusedRow, 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) moveFocus(rows.length - 1, columns.length - 1);
        else moveFocus(focusedRow, columns.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const row = rows[focusedRow];
        if (row && !row.hasChildren) openEdit(row.task);
        break;
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`gantt-chart ${className}`.trim()}
      {...restProps}
    >
      <GanttTable label={label} caption={caption} onKeyDown={onGridKeyDown}>
        <GanttTableThead>
          <GanttTableTr>
            <GanttTableTH scope="col"></GanttTableTH>
            {columns.map((column) => {
              const isToday =
                today != null &&
                rangesOverlap(column.start, column.end, today, today);
              return (
                <GanttTableTH
                  key={column.start}
                  scope="col"
                  data-today={isToday ? "" : undefined}
                >
                  {labels.columnLabel?.(column.start, column.end, timeUnit) ??
                    column.start}
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
                <GanttTableTr>
                  <GanttTableTH
                    scope="row"
                    style={{ paddingInlineStart: `${row.depth}em` }}
                  >
                    {row.hasChildren && (
                      <button
                        type="button"
                        className="gantt-chart-collapse-button"
                        aria-expanded={!collapsed.has(row.task.id)}
                        aria-label={
                          labels.collapseButton?.(row.task, collapsed.has(row.task.id)) ?? ""
                        }
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
                        active={focusedRow === rowIndex && focusedCol === colIndex}
                        data-in-range={inRange ? "" : undefined}
                        data-milestone={isMilestone ? "" : undefined}
                        data-today={isToday ? "" : undefined}
                        aria-describedby={
                          hasDependencySummary ? dependencyId(row.task.id) : undefined
                        }
                        onDragOver={onCellDragOver}
                        onDrop={(e: React.DragEvent) => onCellDrop(column, e)}
                      >
                        {isLeadingCell && (
                          <span
                            className="gantt-chart-bar"
                            data-percent-complete={row.task.percentComplete ?? undefined}
                            draggable={!row.hasChildren}
                            onDragStart={(e) => onBarDragStart(row.task, e)}
                          />
                        )}
                      </GanttTableTD>
                    );
                  })}
                </GanttTableTr>
                {editingTaskId === row.task.id && labels.dateTimePickerLabels && (
                  <tr className="gantt-chart-edit-row">
                    <td colSpan={columns.length + 1}>
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
                      <button
                        type="button"
                        className="gantt-chart-save-button"
                        onClick={() => saveEdit(row.task)}
                      >
                        {labels.saveLabel ?? ""}
                      </button>
                      <button
                        type="button"
                        className="gantt-chart-cancel-button"
                        onClick={cancelEdit}
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
