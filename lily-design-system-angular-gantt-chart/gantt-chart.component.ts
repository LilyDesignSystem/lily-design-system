import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  afterNextRender,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import {
  GanttTable,
  GanttTableTD,
  GanttTableTH,
  GanttTableTbody,
  GanttTableThead,
  GanttTableTr,
} from "@lilydesignsystem/angular-headless";
import {
  DateTimePicker,
  addDays,
  daysInMonth,
  formatIsoDate,
  parseIsoDate,
  toEpochDay,
  type DateTimePickerLabels,
} from "@lilydesignsystem/angular-date-time-picker";

// Re-exported so `index.ts` (and this package's own spec) can import
// the reused civil-date arithmetic directly from this module, matching
// how `compareISO`/`endOfMonth`/`generateColumns`/`flattenTasks`/
// `effectiveRange` (ported here, not reused) are exported below.
export { addDays };

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
};

/** A dated column marker (holiday, release, deadline). `label` is rendered as text so a marker is never colour-only. */
export type GanttMarker = { date: string; kind?: string; label?: string };

export type GanttTimeUnit = "day" | "week" | "month";

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other helper's
 * label-gating convention. See spec/index.md §5.
 */
export type GanttLabels = {
  /** Header for the leading task-label column; an empty header cell otherwise. */
  taskColumnHeader?: string;
  columnLabel?: (start: string, end: string, timeUnit: GanttTimeUnit) => string;
  /** Carried for API parity with the Svelte reference; unused there too. */
  editButton?: (task: GanttTask) => string;
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
};

/** Payload of the `taskChange` output. */
export type GanttTaskChangeEvent = {
  taskId: string;
  start: string;
  end: string;
  /** Present only when the edit region's progress field is shown. */
  percentComplete?: number;
};

// ---------------------------------------------------------------
// Civil-date arithmetic: UTC/epoch-day only, never local-midnight
// `Date` construction. `addDays`, `daysInMonth`, `formatIsoDate`,
// `parseIsoDate`, and `toEpochDay` are reused from
// `@lilydesignsystem/angular-date-time-picker` — the sibling helper
// this package also composes for editing — rather than re-derived,
// per this port's own instructions. Only the pieces date-time-picker
// does not already export (`compareISO`, `endOfMonth`,
// `generateColumns`, `flattenTasks`, `effectiveRange`) are ported here
// from the Svelte reference.
// ---------------------------------------------------------------

/** -1 / 0 / 1, ordinary string comparison works for zero-padded ISO dates. */
export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** The last day of the calendar month `iso` falls in, UTC-safe. */
export function endOfMonth(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return formatIsoDate({
    year: parsed.year,
    month: parsed.month,
    day: daysInMonth(parsed.year, parsed.month),
  });
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

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

export type GanttFlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

/**
 * Depth-first flatten of the parentId tree, skipping collapsed subtrees.
 * A task whose `parentId` names no task is a top-level row, not dropped.
 */
export function flattenTasks(
  tasks: GanttTask[],
  collapsed: ReadonlySet<string>,
): GanttFlatRow[] {
  const ids = new Set(tasks.map((t) => t.id));
  const childrenOf = new Map<string | undefined, GanttTask[]>();
  for (const task of tasks) {
    const key =
      task.parentId != null && ids.has(task.parentId) ? task.parentId : undefined;
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

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextGanttChartId(): string {
  uid += 1;
  return `gantt-chart-${uid}`;
}

/**
 * GanttChart — a headless, interactive Gantt chart.
 *
 * Composes `@lilydesignsystem/angular-headless`'s `GanttTable` family
 * (a real npm dependency, unmodified) for the grid's own markup, and
 * the sibling helper `@lilydesignsystem/angular-date-time-picker` —
 * used twice per edit session, for a task's start and end date — as
 * the keyboard-accessible editing surface (Syncfusion's own
 * accessibility documentation: no keyboard shortcut exists for
 * dragging a bar; a typed-field edit surface is the accessible path).
 * Pointer drag-to-resize/reschedule is supplementary. See
 * `spec/index.md` for the full contract.
 */
@Component({
  selector: "lily-gantt-chart",
  standalone: true,
  imports: [
    DateTimePicker,
    GanttTable,
    GanttTableTD,
    GanttTableTH,
    GanttTableTbody,
    GanttTableThead,
    GanttTableTr,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #rootEl
      class="gantt-chart {{ className() }}"
      [attr.data-readonly]="readonly() ? '' : null"
    >
      @if (labels().zoomIn || labels().zoomOut) {
        <div class="gantt-chart-zoom" role="group" [attr.aria-label]="label()">
          @if (labels().zoomOut; as zoomOut) {
            <button
              type="button"
              class="gantt-chart-zoom-out-button"
              [attr.aria-label]="zoomOut"
              [disabled]="zoomIndex() <= 0"
              (click)="zoom(-1)"
            >−</button>
          }
          @if (labels().zoomIn; as zoomIn) {
            <button
              type="button"
              class="gantt-chart-zoom-in-button"
              [attr.aria-label]="zoomIn"
              [disabled]="zoomIndex() >= ZOOM_ORDER.length - 1"
              (click)="zoom(1)"
            >+</button>
          }
        </div>
      }
      <lily-gantt-table
        [label]="label()"
        (keydown)="onGridKeydown($event)"
        (focusin)="onGridFocusin($event)"
        (click)="onGridClick($event)"
      >
        @if (caption()) {
          <!-- GanttTable has no "caption" input (Angular headless
               deviation from the Svelte contract); a <caption> element
               is valid projected content as the table's first child,
               so this needs no headless-component change. -->
          <caption class="gantt-chart-caption">{{ caption() }}</caption>
        }
        <thead lily-gantt-table-thead>
          <tr lily-gantt-table-tr>
            <th lily-gantt-table-th scope="col">{{ labels().taskColumnHeader ?? "" }}</th>
            @for (column of columns(); track column.start) {
              @let colToday = isTodayColumn(column);
              @let colMarkers = markersIn(column);
              <th
                lily-gantt-table-th
                scope="col"
                [attr.data-today]="colToday ? '' : null"
                [attr.data-non-working]="isNonWorkingColumn(column) ? '' : null"
                [attr.data-marker]="markerKinds(colMarkers)"
              >
                {{ labels().columnLabel?.(column.start, column.end, timeUnit()) ?? column.start }}
                @for (marker of colMarkers; track marker.date + (marker.kind ?? "")) {
                  @if (marker.label) {
                    <span class="gantt-chart-marker-label">{{ marker.label }}</span>
                  }
                }
              </th>
            }
          </tr>
        </thead>
        <tbody lily-gantt-table-tbody>
          @for (row of rows(); track row.task.id; let rowIndex = $index) {
            @let rowRange = rangeFor(row.task, row.hasChildren);
            @let deps = predecessorLabels(row.task);
            @let hasDeps = deps.length > 0 && !!labels().dependencySummary;
            <tr
              lily-gantt-table-tr
              [attr.data-task-type]="row.task.type ?? null"
              [attr.data-critical]="row.task.critical ? '' : null"
              [attr.data-slack]="row.task.slack ?? null"
              [attr.data-task-id]="row.task.id"
              [attr.aria-selected]="selectedTaskId() === row.task.id ? 'true' : null"
              [attr.data-selected]="selectedTaskId() === row.task.id ? '' : null"
            >
              <!-- Depth is data for the consumer's CSS (indentation), never an inline style. -->
              <th lily-gantt-table-th scope="row" [attr.data-depth]="row.depth">
                @if (row.hasChildren && labels().collapseButton) {
                  <button
                    type="button"
                    class="gantt-chart-collapse-button"
                    [attr.aria-expanded]="!collapsedIds().has(row.task.id)"
                    [attr.aria-label]="labels().collapseButton!(row.task, collapsedIds().has(row.task.id))"
                    (click)="toggleCollapse(row.task.id)"
                  >{{ collapsedIds().has(row.task.id) ? "▸" : "▾" }}</button>
                }
                {{ taskLabel()(row.task) }}
                @if (hasDeps) {
                  <span [id]="dependencyId(row.task.id)" class="gantt-chart-dependency-summary" hidden>{{
                    labels().dependencySummary!(deps)
                  }}</span>
                }
                @if (row.task.baseline && labels().baselineSummary) {
                  <span [id]="baselineId(row.task.id)" class="gantt-chart-baseline-summary" hidden>{{
                    baselineText(row.task, rowRange.end)
                  }}</span>
                }
              </th>
              @for (column of columns(); track column.start; let colIndex = $index) {
                @let inRange = rangesOverlap(column.start, column.end, rowRange.start, rowRange.end);
                @let isMilestone = inRange && rowRange.start === rowRange.end;
                @let colToday = isTodayColumn(column);
                @let isLeadingCell = inRange && rangesOverlap(column.start, column.end, rowRange.start, rowRange.start);
                <td
                  lily-gantt-table-td
                  [attr.data-row]="rowIndex"
                  [attr.data-col]="colIndex"
                  [attr.tabindex]="isFocused(rowIndex, colIndex) ? 0 : -1"
                  [attr.data-in-range]="inRange ? '' : null"
                  [attr.data-milestone]="isMilestone ? '' : null"
                  [attr.data-today]="colToday ? '' : null"
                  [attr.data-non-working]="isNonWorkingColumn(column) ? '' : null"
                  [attr.data-marker]="markersIn(column).length ? '' : null"
                  [attr.aria-describedby]="describedBy(row.task, deps.length > 0)"
                  [attr.data-baseline]="hasBaseline(row.task, column) ? '' : null"
                  (dragover)="onCellDragOver($event)"
                  (drop)="onCellDrop(column, $event)"
                >
                  @if (isLeadingCell) {
                    <span
                      class="gantt-chart-bar"
                      [attr.data-percent-complete]="row.task.percentComplete ?? null"
                      [attr.draggable]="!row.hasChildren && !readonly() ? 'true' : null"
                      (dragstart)="onBarDragStart(row.task, $event)"
                    >@if (!row.hasChildren && !readonly()) {<span
                        class="gantt-chart-bar-handle gantt-chart-bar-handle-start"
                        draggable="true"
                        aria-hidden="true"
                        (dragstart)="onHandleDragStart(row.task, 'start', $event)"
                      ></span>}</span>
                  }
                  @if (!row.hasChildren && !readonly() && inRange && rangesOverlap(column.start, column.end, rowRange.end, rowRange.end)) {
                    <span
                      class="gantt-chart-bar-handle gantt-chart-bar-handle-end"
                      draggable="true"
                      aria-hidden="true"
                      (dragstart)="onHandleDragStart(row.task, 'end', $event)"
                    ></span>
                  }
                </td>
              }
            </tr>
            @if (editingTaskId() === row.task.id && canEdit()) {
              <tr class="gantt-chart-edit-row">
                <td [attr.colspan]="columns().length + 1" (keydown)="onEditKeydown($event)">
                  <lily-date-time-picker
                    [label]="labels().startLabel ?? ''"
                    [labels]="labels().dateTimePickerLabels!"
                    mode="date"
                    [(value)]="editStart"
                  />
                  <lily-date-time-picker
                    [label]="labels().endLabel ?? ''"
                    [labels]="labels().dateTimePickerLabels!"
                    mode="date"
                    [(value)]="editEnd"
                  />
                  @if (labels().percentLabel) {
                    <label class="gantt-chart-percent-label">
                      {{ labels().percentLabel }}
                      <input
                        class="gantt-chart-percent-input"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        [value]="editPercent()"
                        (input)="editPercent.set($any($event.target).value)"
                      />
                    </label>
                  }
                  <button
                    type="button"
                    class="gantt-chart-save-button"
                    [disabled]="!editStart() || !editEnd()"
                    (click)="saveEdit(row.task)"
                  >{{ labels().saveLabel ?? "" }}</button>
                  <button
                    type="button"
                    class="gantt-chart-cancel-button"
                    (click)="closeEdit()"
                  >{{ labels().cancelLabel ?? "" }}</button>
                </td>
              </tr>
            }
          }
        </tbody>
      </lily-gantt-table>

      <p class="gantt-chart-status" aria-live="polite">{{ statusMessage() }}</p>
    </div>
  `,
})
export class GanttChart implements AfterViewInit, AfterViewChecked {
  /** Accessible name for the chart, passed through to GanttTable. */
  readonly label = input.required<string>();
  /** Optional visible caption. See the `<caption>`-projection note in the template. */
  readonly caption = input<string>("");
  /** The chart's own overall time range. */
  readonly range = input.required<{ start: string; end: string }>();
  /** Task data. */
  readonly tasks = input.required<GanttTask[]>();
  /** Column granularity. A static rendering choice, not an interactive zoom control. */
  /** Column granularity. Two-way bindable: the zoom buttons (shown when `labels.zoomIn` / `labels.zoomOut` name them) step it month ↔ week ↔ day. */
  readonly timeUnit = model<GanttTimeUnit>("day");
  /** The selected task's id. Two-way bindable. A click on a task's row or the `s` key on it selects (again deselects); `aria-selected`, `data-selected`. */
  readonly selectedTaskId = model<string | undefined>(undefined);
  /** Extra attributes on each task's row (for example `data-team`); merged after Lily's own. */
  readonly taskAttrs = input<((task: GanttTask) => Record<string, string>) | undefined>(undefined);
  /** ISO date marking "today"; never computed internally (stays SSR-safe). */
  readonly today = input<string>("");
  /** Dated markers; each marks the column that contains its date with `data-marker`. */
  readonly markers = input<GanttMarker[]>([]);
  /** Consumer's own working calendar; a column is `data-non-working` when every day in it is non-working. */
  readonly isNonWorking = input<((isoDate: string) => boolean) | undefined>(undefined);
  /** Suppress editing, drag and the edit region; navigation and collapse still work. */
  readonly readonly = input<boolean>(false);
  /** Resolves a task to its display label. Defaults to `task.label`. */
  readonly taskLabel = input<(task: GanttTask) => string>((task: GanttTask) => task.label);
  /** User-facing strings. See GanttLabels — presence gates each control. */
  readonly labels = input<GanttLabels>({});
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  /** Fires after a task's start/end changes, by pointer or by the edit region. */
  readonly taskChange = output<GanttTaskChangeEvent>();
  /** Fires when selection changes: the task id, or `undefined` when it clears. */
  readonly taskSelect = output<string | undefined>();

  private readonly baseId = nextGanttChartId();
  protected dependencyId(taskId: string): string {
    return `${this.baseId}-deps-${taskId}`;
  }

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  protected readonly collapsedIds = signal(new Set<string>());
  protected readonly focusedRow = signal(0);
  protected readonly focusedCol = signal(0);

  protected readonly editingTaskId = signal<string | null>(null);
  protected readonly editStart = signal("");
  protected readonly editEnd = signal("");
  protected readonly editPercent = signal("");

  private draggingTaskId: string | null = null;

  protected readonly columns = computed(() => generateColumns(this.range(), this.timeUnit()));
  protected readonly rows = computed(() => flattenTasks(this.tasks(), this.collapsedIds()));
  private readonly ranges = computed(() => effectiveRanges(this.tasks()));

  // The roving cursor, clamped to the cells that exist now: collapsing a parent
  // can remove the row it named, and the grid must never leave the tab order.
  protected readonly activeRow = computed(() => Math.min(this.focusedRow(), this.rows().length - 1));
  protected readonly activeCol = computed(() =>
    Math.min(this.focusedCol(), this.columns().length - 1),
  );

  /** Editing needs every label its controls show; an unnamed Save is worse than none. */
  protected readonly canEdit = computed(() => {
    const l = this.labels();
    return (
      !this.readonly() &&
      !!l.dateTimePickerLabels && !!l.startLabel && !!l.endLabel && !!l.saveLabel && !!l.cancelLabel
    );
  });

  /**
   * Angular's headless `GanttTable` (unlike the Svelte reference this
   * package ports) does not set `role="grid"` on its rendered
   * `<table>` — confirmed by reading GanttTable.ts; no `role`
   * attribute appears anywhere in it. `GanttTable` is on the
   * "do not modify" list for this port, so the WAI-ARIA APG Grid role
   * is applied here instead, once, right after the view renders — the
   * same plain-DOM-write approach `kanban-board` already uses for the
   * identical gap in `KanbanTable`. See spec/index.md §3 and
   * CHANGELOG.md.
   */
  /** `taskAttrs` has no template spread in Angular: the attributes are written onto each task's row after every check. */
  ngAfterViewChecked(): void {
    const attrs = this.taskAttrs();
    if (!attrs) return;
    const byId = new Map(this.tasks().map((t) => [t.id, t]));
    for (const el of this.rootRef().nativeElement.querySelectorAll<HTMLElement>("tr[data-task-id]")) {
      const task = byId.get(el.dataset["taskId"] ?? "");
      if (!task) continue;
      for (const [name, value] of Object.entries(attrs(task))) el.setAttribute(name, value);
    }
  }

  ngAfterViewInit(): void {
    this.rootRef()
      .nativeElement.querySelector("table.gantt-table")
      ?.setAttribute("role", "grid");
  }

  protected rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
    return hasChildren
      ? (this.ranges().get(task.id) ?? task)
      : { start: task.start, end: task.end };
  }

  /** Exposed as a bound method so the template (which can only call
   * members of the component instance, not free module functions) can
   * call it directly. */
  protected rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
    return overlaps(aStart, aEnd, bStart, bEnd);
  }

  protected markersIn(column: GanttColumn): GanttMarker[] {
    return this.markers().filter((m) => overlaps(column.start, column.end, m.date, m.date));
  }

  protected markerKinds(markers: GanttMarker[]): string | null {
    return markers.length ? markers.map((m) => m.kind ?? "marker").join(" ") : null;
  }

  protected isNonWorkingColumn(column: GanttColumn): boolean {
    const isNonWorking = this.isNonWorking();
    if (!isNonWorking) return false;
    for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
      if (!isNonWorking(d)) return false;
    }
    return true;
  }

  protected isTodayColumn(column: GanttColumn): boolean {
    const today = this.today();
    return !!today && overlaps(column.start, column.end, today, today);
  }

  protected isFocused(rowIndex: number, colIndex: number): boolean {
    return this.activeRow() === rowIndex && this.activeCol() === colIndex;
  }

  private announce(message: string | undefined): void {
    if (message) this.statusMessage.set(message);
  }

  // ---------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------

  protected toggleCollapse(taskId: string): void {
    const next = new Set(this.collapsedIds());
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    this.collapsedIds.set(next);
  }

  // ---------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------

  protected predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((dep) => {
      const id = typeof dep === "string" ? dep : dep.id;
      const predecessor = this.tasks().find((t) => t.id === id);
      const text = predecessor ? this.taskLabel()(predecessor) : id;
      const detail = this.labels().dependencyDetail;
      if (typeof dep === "string" || !detail) return text;
      return detail(text, dep.type ?? "e2s", dep.lag ?? 0);
    });
  }

  // ---------------------------------------------------------------
  // Baseline
  // ---------------------------------------------------------------

  protected baselineId(taskId: string): string {
    return `${this.baseId}-baseline-${taskId}`;
  }

  protected baselineText(task: GanttTask, currentEnd: string): string {
    const b = task.baseline!;
    const a = parseIsoDate(b.end);
    const c = parseIsoDate(currentEnd);
    const variance = a && c ? toEpochDay(c) - toEpochDay(a) : 0;
    return this.labels().baselineSummary?.(this.taskLabel()(task), b, variance) ?? "";
  }

  protected hasBaseline(task: GanttTask, column: GanttColumn): boolean {
    return !!task.baseline && overlaps(column.start, column.end, task.baseline.start, task.baseline.end);
  }

  /** The ids a cell is described by: the dependency summary, then the baseline summary. */
  protected describedBy(task: GanttTask, hasDeps: boolean): string | null {
    const ids: string[] = [];
    if (hasDeps && this.labels().dependencySummary) ids.push(this.dependencyId(task.id));
    if (task.baseline && this.labels().baselineSummary) ids.push(this.baselineId(task.id));
    return ids.length ? ids.join(" ") : null;
  }

  // ---------------------------------------------------------------
  // Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
  // ---------------------------------------------------------------

  private applyChange(task: GanttTask, start: string, end: string, percentComplete?: number): void {
    this.taskChange.emit(
      percentComplete === undefined
        ? { taskId: task.id, start, end }
        : { taskId: task.id, start, end, percentComplete },
    );
    this.announce(this.labels().dateAnnouncement?.(this.taskLabel()(task), start, end));
  }

  protected openEdit(task: GanttTask): void {
    if (!this.canEdit()) return;
    this.editingTaskId.set(task.id);
    this.editStart.set(task.start);
    this.editEnd.set(task.end);
    this.editPercent.set(task.percentComplete != null ? String(task.percentComplete) : "");
    // Focus moves into the region it opened, onto the start date's field.
    this.cdr.detectChanges();
    this.afterRender(() =>
      this.rootRef()
        .nativeElement.querySelector<HTMLElement>(".gantt-chart-edit-row .date-time-picker-input")
        ?.focus({ preventScroll: true }),
    );
  }

  /** A range entered end-first is saved start-first; Save is disabled while either date is empty. */
  protected saveEdit(task: GanttTask): void {
    const a = this.editStart();
    const b = this.editEnd();
    if (!a || !b) return;
    const [start, end] = compareISO(a, b) <= 0 ? [a, b] : [b, a];
    const raw = this.editPercent();
    const percent =
      this.labels().percentLabel && raw !== ""
        ? Math.min(100, Math.max(0, Math.round(Number(raw))))
        : undefined;
    this.applyChange(task, start, end, percent !== undefined && Number.isFinite(percent) ? percent : undefined);
    this.closeEdit();
  }

  /** Closing either way returns focus to the grid's tab stop, on the edited task's row. */
  protected closeEdit(): void {
    this.editingTaskId.set(null);
    this.focusActiveCell();
  }

  protected onEditKeydown(event: KeyboardEvent): void {
    // Escape cancels, unless a date picker's own dialog used it to close itself.
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      this.closeEdit();
    }
  }

  /** Run after the next render, when the DOM matches the state just set. */
  private afterRender(fn: () => void): void {
    afterNextRender(fn, { injector: this.injector });
  }

  protected onBarDragStart(task: GanttTask, event: DragEvent): void {
    this.draggingTaskId = task.id;
    this.resizingEdge = null;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  /** Which edge of the dragged task's bar is being resized, or null for a whole-bar move. */
  private resizingEdge: "start" | "end" | null = null;

  protected onHandleDragStart(task: GanttTask, edge: "start" | "end", event: DragEvent): void {
    event.stopPropagation();
    this.draggingTaskId = task.id;
    this.resizingEdge = edge;
    event.dataTransfer?.setData("text/plain", task.id);
  }

  // ---- Zoom ----
  protected readonly ZOOM_ORDER: GanttTimeUnit[] = ["month", "week", "day"];
  protected readonly zoomIndex = computed(() => this.ZOOM_ORDER.indexOf(this.timeUnit()));

  protected zoom(delta: 1 | -1): void {
    const next = this.ZOOM_ORDER[this.zoomIndex() + delta];
    if (!next) return;
    this.timeUnit.set(next);
    this.announce(this.labels().zoomAnnouncement?.(next));
  }

  // ---- Selection ----
  private selectTask(taskId: string): void {
    this.selectedTaskId.set(this.selectedTaskId() === taskId ? undefined : taskId);
    this.taskSelect.emit(this.selectedTaskId());
  }

  protected onGridClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, .gantt-chart-edit-row")) return;
    const taskId = target.closest<HTMLElement>("[data-task-id]")?.dataset["taskId"];
    if (taskId) this.selectTask(taskId);
  }

  // ---- Keyboard shift / resize (Alt+Arrow) ----
  private columnIndexOf(isoDate: string): number {
    return this.columns().findIndex((c) => this.rangesOverlap(c.start, c.end, isoDate, isoDate));
  }

  private shiftTask(task: GanttTask, delta: 1 | -1, endOnly: boolean): void {
    const columns = this.columns();
    if (endOnly) {
      const target = columns[this.columnIndexOf(task.end) + delta];
      if (target && compareISO(task.start, target.end) <= 0) this.applyChange(task, task.start, target.end);
      return;
    }
    const target = columns[this.columnIndexOf(task.start) + delta];
    if (!target) return;
    const a = parseIsoDate(task.start);
    const b = parseIsoDate(task.end);
    const duration = a && b ? toEpochDay(b) - toEpochDay(a) : 0;
    this.applyChange(task, target.start, addDays(target.start, duration));
  }

  protected onCellDragOver(event: DragEvent): void {
    if (this.draggingTaskId) event.preventDefault();
  }

  protected onCellDrop(column: GanttColumn, event: DragEvent): void {
    if (this.readonly()) return;
    event.preventDefault();
    const taskId = this.draggingTaskId ?? event.dataTransfer?.getData("text/plain");
    this.draggingTaskId = null;
    const task = this.tasks().find((t) => t.id === taskId);
    const edge = this.resizingEdge;
    this.resizingEdge = null;
    if (!task) return;
    if (edge) {
      // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
      const start = edge === "start" ? column.start : task.start;
      const end = edge === "end" ? column.end : task.end;
      if (compareISO(start, end) <= 0 && (start !== task.start || end !== task.end)) this.applyChange(task, start, end);
      return;
    }
    const startDate = parseIsoDate(task.start);
    const endDate = parseIsoDate(task.end);
    const duration = startDate && endDate ? toEpochDay(endDate) - toEpochDay(startDate) : 0;
    this.applyChange(task, column.start, addDays(column.start, duration));
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  private focusActiveCell(): void {
    this.afterRender(() =>
      this.rootRef()
        .nativeElement.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')
        ?.focus({ preventScroll: true }),
    );
  }

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  protected onGridFocusin(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    this.focusedRow.set(Number(cell.dataset["row"]));
    this.focusedCol.set(Number(cell.dataset["col"]));
  }

  private moveFocus(row: number, col: number): void {
    this.focusedRow.set(Math.min(Math.max(row, 0), this.rows().length - 1));
    this.focusedCol.set(Math.min(Math.max(col, 0), this.columns().length - 1));
    this.cdr.detectChanges();
    this.focusActiveCell();
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
      const row = this.rows()[this.activeRow()];
      if (row && !row.hasChildren && !this.readonly() && (event.target as HTMLElement).closest(".gantt-table-td")) {
        event.preventDefault();
        this.shiftTask(row.task, event.key === "ArrowLeft" ? -1 : 1, event.shiftKey);
        return;
      }
    }
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(this.activeRow() - 1, this.activeCol());
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(this.activeRow() + 1, this.activeCol());
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.moveFocus(this.activeRow(), this.activeCol() - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveFocus(this.activeRow(), this.activeCol() + 1);
        break;
      case "Home":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(0, 0);
        else this.moveFocus(this.activeRow(), 0);
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(this.rows().length - 1, this.columns().length - 1);
        else this.moveFocus(this.activeRow(), this.columns().length - 1);
        break;
      case "s":
      case "S": {
        if (event.ctrlKey || event.metaKey || event.altKey) break;
        const row = this.rows()[this.activeRow()];
        if (row && (event.target as HTMLElement).closest(".gantt-table-td")) {
          event.preventDefault();
          this.selectTask(row.task.id);
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const row = this.rows()[this.activeRow()];
        if (row && !row.hasChildren) this.openEdit(row.task);
        break;
      }
    }
  }
}
