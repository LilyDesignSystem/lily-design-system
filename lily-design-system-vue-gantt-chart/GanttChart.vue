<script lang="ts">
import type { DateTimePickerLabels } from "@lilydesignsystem/vue-date-time-picker";

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
};

/** A dated column marker (holiday, release, deadline). `label` is rendered as text so a marker is never colour-only. */
export type GanttMarker = { date: string; kind?: string; label?: string };

export type GanttTimeUnit = "day" | "week" | "month";

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other helper's
 * label-presence-gates-control convention. See spec/index.md §5.
 */
export type GanttLabels = {
    /** Header for the leading task-label column; an empty header cell otherwise. */
    taskColumnHeader?: string;
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
    /** Label of the progress field in the edit region (0–100). Gates the field. */
    percentLabel?: string;
    /** Accessible name for the zoom-in button (finer columns). Gates the button. */
    zoomIn?: string;
    /** Accessible name for the zoom-out button (coarser columns). Gates the button. */
    zoomOut?: string;
    /** Announced after a zoom step with the new unit. */
    zoomAnnouncement?: (timeUnit: GanttTimeUnit) => string;
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
};

/** Public props for GanttChart. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the chart, passed through to GanttTable. */
    label: string;
    /** Optional visible caption, passed through to GanttTable. */
    caption?: string;
    /** The chart's own overall time range. */
    range: { start: string; end: string };
    /** Task data. */
    tasks: GanttTask[];
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
    /** User-facing strings. See GanttLabels — presence gates each control. */
    labels?: GanttLabels;
    /** Extra CSS class on the root. */
    class?: string;
};

/** Default `taskLabel`: the task's own label. Mirrors `date-time-picker`'s `defaultFormat` fallback idiom. */
function defaultTaskLabel(task: GanttTask): string {
    return task.label;
}

// ---------------------------------------------------------------
// Civil-date arithmetic: UTC/epoch-day only, never local-midnight
// `Date` construction — the same rule date-time-picker follows, so no
// column boundary can land on the wrong day across a DST transition.
//
// `addDays` is reused directly from @lilydesignsystem/vue-date-time-picker
// rather than re-derived — it is already UTC-epoch-day-safe and
// exported for exactly this reason (see that package's own AGENTS.md
// "Public surface"). `compareISO`/`endOfMonth`/`generateColumns`/
// `flattenTasks`/`effectiveRange` are gantt-chart-specific and have no
// equivalent in date-time-picker, so they are ported here directly
// from the Svelte canonical, translated to plain TS.
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

export type GanttColumn = { start: string; end: string };

/** Generate the fixed set of columns a `range`/`timeUnit` pair produces. */
export function generateColumns(
    range: { start: string; end: string },
    timeUnit: GanttTimeUnit,
    addDaysFn: (iso: string, days: number) => string,
): GanttColumn[] {
    const columns: GanttColumn[] = [];
    let cursor = range.start;
    let guard = 0;
    while (compareISO(cursor, range.end) <= 0 && guard < 10000) {
        guard += 1;
        let periodEnd: string;
        if (timeUnit === "day") periodEnd = cursor;
        else if (timeUnit === "week") periodEnd = addDaysFn(cursor, 6);
        else periodEnd = endOfMonth(cursor);
        if (compareISO(periodEnd, range.end) > 0) periodEnd = range.end;
        columns.push({ start: cursor, end: periodEnd });
        cursor = addDaysFn(periodEnd, 1);
    }
    return columns;
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
    return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

export type FlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

/**
 * Depth-first flatten of the parentId tree, skipping collapsed subtrees.
 * A task whose `parentId` names no task is a top-level row, not dropped.
 */
export function flattenTasks(tasks: GanttTask[], collapsed: ReadonlySet<string>): FlatRow[] {
    const ids = new Set(tasks.map((t) => t.id));
    const childrenOf = new Map<string | undefined, GanttTask[]>();
    for (const task of tasks) {
        const key = task.parentId != null && ids.has(task.parentId) ? task.parentId : undefined;
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
export function effectiveRange(task: GanttTask, allTasks: GanttTask[]): { start: string; end: string } {
    return effectiveRanges(allTasks).get(task.id) ?? { start: task.start ?? "", end: task.end ?? "" };
}

/**
 * Every task's effective range in one pass over the tree — computed once per
 * `tasks` change rather than re-walking every parent's subtree on each render.
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
</script>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
    GanttTable,
    GanttTableTD,
    GanttTableTH,
    GanttTableTbody,
    GanttTableThead,
    GanttTableTr,
} from "@lilydesignsystem/vue-headless";
import DateTimePicker, { addDays, parseIsoDate, toEpochDay } from "@lilydesignsystem/vue-date-time-picker";

const props = withDefaults(defineProps<Props>(), {
    caption: undefined,
    taskAttrs: undefined,
    today: undefined,
    markers: () => [],
    isNonWorking: undefined,
    readonly: false,
    taskLabel: undefined,
    labels: () => ({}),
    class: "",
});

// The Svelte canonical takes an `onTaskChange` callback prop; the Vue
// idiom for the same contract is an emitted event, matching
// `kanban-board`'s own `move` and `picker-bar`'s `theme-change` et al.
/** Column granularity (`v-model:timeUnit`). The zoom buttons (shown when `labels.zoomIn` / `labels.zoomOut` name them) step it month ↔ week ↔ day. */
const timeUnit = defineModel<GanttTimeUnit>("timeUnit", { default: "day" });
/** Ids of collapsed parent tasks (`v-model:collapsedTaskIds`); the collapse buttons, `labels.expandAll` and `labels.collapseAll` change it. */
const collapsedTaskIds = defineModel<string[]>("collapsedTaskIds", { default: () => [] });
/** The selected task's id (`v-model:selectedTaskId`). A click on a task's row or the `s` key on it selects (again deselects); `aria-selected`, `data-selected`. */
const selectedTaskId = defineModel<string | undefined>("selectedTaskId", { default: undefined });

const emit = defineEmits<{
    /** Selection changed: the task id, or `undefined` when it clears. */
    (event: "task-select", taskId: string | undefined): void;
    (event: "task-change", taskId: string, start: string, end: string, percentComplete?: number): void;
}>();

const baseId = nextGanttChartId();
const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

const rootEl = ref<HTMLDivElement | null>(null);
const statusMessage = ref("");
const collapsed = computed(() => new Set(collapsedTaskIds.value));
const focusedRow = ref(0);
const focusedCol = ref(0);

const editingTaskId = ref<string | null>(null);
const editStart = ref("");
const editEnd = ref("");
const editPercent = ref("");

let draggingTaskId: string | null = null;

const columns = computed(() => generateColumns(props.range, timeUnit.value, addDays));
const rows = computed(() => flattenTasks(props.tasks, collapsed.value));
const ranges = computed(() => effectiveRanges(props.tasks));

// The roving cursor, clamped to the cells that exist now: collapsing a parent
// can remove the row it named, and the grid must never leave the tab order.
const activeRow = computed(() => Math.min(focusedRow.value, rows.value.length - 1));
const activeCol = computed(() => Math.min(focusedCol.value, columns.value.length - 1));

/** Editing needs every label its controls show; an unnamed Save is worse than none. */
const canEdit = computed(() => {
    const l = props.labels;
    return !props.readonly && !!l?.dateTimePickerLabels && !!l.startLabel && !!l.endLabel && !!l.saveLabel && !!l.cancelLabel;
});

function resolveTaskLabel(task: GanttTask): string {
    return (props.taskLabel ?? defaultTaskLabel)(task);
}

function rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
    return hasChildren ? (ranges.value.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
}

function announce(message: string | undefined): void {
    if (message) statusMessage.value = message;
}

// ---------------------------------------------------------------
// Hierarchy
// ---------------------------------------------------------------

function toggleCollapse(taskId: string): void {
    collapsedTaskIds.value = collapsed.value.has(taskId)
        ? collapsedTaskIds.value.filter((id) => id !== taskId)
        : [...collapsedTaskIds.value, taskId];
}

/** Every task that has children (the ones a collapse button applies to). */
const parentIds = computed(() =>
    Array.from(new Set(props.tasks.filter((t) => t.parentId != null).map((t) => t.parentId as string))).filter((id) =>
        props.tasks.some((t) => t.id === id),
    ),
);

function setAllCollapsed(value: boolean): void {
    collapsedTaskIds.value = value ? parentIds.value : [];
}

// ---------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------

function predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((dep) => {
        const id = typeof dep === "string" ? dep : dep.id;
        const predecessor = props.tasks.find((t) => t.id === id);
        const text = predecessor ? resolveTaskLabel(predecessor) : id;
        if (typeof dep === "string" || !props.labels?.dependencyDetail) return text;
        return props.labels.dependencyDetail(text, dep.type ?? "e2s", dep.lag ?? 0);
    });
}

// ---------------------------------------------------------------
// Baseline
// ---------------------------------------------------------------

const baselineId = (taskId: string) => `${baseId}-baseline-${taskId}`;

/** The ids a cell is described by: the dependency summary, then the baseline summary. */
function describedBy(task: GanttTask, hasDeps: boolean): string | undefined {
    const ids: string[] = [];
    if (hasDeps && props.labels?.dependencySummary) ids.push(dependencyId(task.id));
    if (task.baseline && props.labels?.baselineSummary) ids.push(baselineId(task.id));
    return ids.length ? ids.join(" ") : undefined;
}

function varianceDays(task: GanttTask, currentEnd: string): number {
    if (!currentEnd) return 0;
    const a = parseIsoDate(task.baseline!.end);
    const b = parseIsoDate(currentEnd);
    return a && b ? toEpochDay(b) - toEpochDay(a) : 0;
}

// ---------------------------------------------------------------
// Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
// ---------------------------------------------------------------

function applyChange(task: GanttTask, start: string, end: string, percentComplete?: number): void {
    if (percentComplete === undefined) emit("task-change", task.id, start, end);
    else emit("task-change", task.id, start, end, percentComplete);
    announce(props.labels?.dateAnnouncement?.(resolveTaskLabel(task), start, end));
}

async function openEdit(task: GanttTask): Promise<void> {
    if (!canEdit.value) return;
    editingTaskId.value = task.id;
    editStart.value = task.start ?? "";
    editEnd.value = task.end ?? "";
    editPercent.value = task.percentComplete != null ? String(task.percentComplete) : "";
    // Focus moves into the region it opened, onto the start date's field.
    await nextTick();
    rootEl.value
        ?.querySelector<HTMLElement>(".gantt-chart-edit-row .date-time-picker-input")
        ?.focus({ preventScroll: true });
}

/** A range entered end-first is saved start-first; Save is disabled while either date is empty. */
function saveEdit(task: GanttTask): void {
    if (!editStart.value || !editEnd.value) return;
    const [start, end] =
        compareISO(editStart.value, editEnd.value) <= 0
            ? [editStart.value, editEnd.value]
            : [editEnd.value, editStart.value];
    const percent =
        props.labels?.percentLabel && editPercent.value !== ""
            ? Math.min(100, Math.max(0, Math.round(Number(editPercent.value))))
            : undefined;
    applyChange(task, start, end, percent !== undefined && Number.isFinite(percent) ? percent : undefined);
    closeEdit();
}

/** Closing either way returns focus to the grid's tab stop, on the edited task's row. */
function closeEdit(): void {
    editingTaskId.value = null;
    void focusActiveCell();
}

function onEditKeydown(event: KeyboardEvent): void {
    // Escape cancels, unless a date picker's own dialog used it to close itself.
    if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        closeEdit();
    }
}

function onBarDragStart(task: GanttTask, event: DragEvent): void {
    draggingTaskId = task.id;
    resizingEdge = null;
    event.dataTransfer?.setData("text/plain", task.id);
}

/** Which edge of the dragged task's bar is being resized, or null for a whole-bar move. */
let resizingEdge: "start" | "end" | null = null;

function onHandleDragStart(task: GanttTask, edge: "start" | "end", event: DragEvent): void {
    event.stopPropagation();
    draggingTaskId = task.id;
    resizingEdge = edge;
    event.dataTransfer?.setData("text/plain", task.id);
}

// ---- Zoom ----
const ZOOM_ORDER: GanttTimeUnit[] = ["month", "week", "day"];
const zoomIndex = computed(() => ZOOM_ORDER.indexOf(timeUnit.value));

function zoom(delta: 1 | -1): void {
    const next = ZOOM_ORDER[zoomIndex.value + delta];
    if (!next) return;
    timeUnit.value = next;
    announce(props.labels?.zoomAnnouncement?.(next));
}

// ---- Selection ----
function selectTask(taskId: string): void {
    selectedTaskId.value = selectedTaskId.value === taskId ? undefined : taskId;
    emit("task-select", selectedTaskId.value);
}

function onGridClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, .gantt-chart-edit-row")) return;
    const taskId = target.closest<HTMLElement>("[data-task-id]")?.dataset.taskId;
    if (taskId) selectTask(taskId);
}

// ---- Keyboard shift / resize (Alt+Arrow) ----
function columnIndexOf(isoDate: string): number {
    return columns.value.findIndex((c) => rangesOverlap(c.start, c.end, isoDate, isoDate));
}

function shiftTask(task: GanttTask, delta: 1 | -1, endOnly: boolean): void {
    if (!task.start || !task.end) return; // an unscheduled task has nothing to shift
    if (endOnly) {
        const target = columns.value[columnIndexOf(task.end) + delta];
        if (target && compareISO(task.start, target.end) <= 0) applyChange(task, task.start, target.end);
        return;
    }
    const target = columns.value[columnIndexOf(task.start) + delta];
    if (!target) return;
    const a = parseIsoDate(task.start);
    const b = parseIsoDate(task.end);
    const duration = a && b ? toEpochDay(b) - toEpochDay(a) : 0;
    applyChange(task, target.start, addDays(target.start, duration));
}

function onCellDragOver(event: DragEvent): void {
    if (draggingTaskId) event.preventDefault();
}

function onCellDrop(column: GanttColumn, event: DragEvent): void {
    if (props.readonly) return;
    event.preventDefault();
    const taskId = draggingTaskId ?? event.dataTransfer?.getData("text/plain");
    draggingTaskId = null;
    const task = props.tasks.find((t) => t.id === taskId);
    const edge = resizingEdge;
    resizingEdge = null;
    if (!task || !task.start || !task.end) return;
    if (edge) {
        // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
        const start = edge === "start" ? column.start : task.start;
        const end = edge === "end" ? column.end : task.end;
        if (compareISO(start, end) <= 0 && (start !== task.start || end !== task.end)) applyChange(task, start, end);
        return;
    }
    // Whole-day duration, reusing date-time-picker's own UTC-safe
    // civil-date arithmetic (`parseIsoDate` + `toEpochDay`) rather than
    // re-deriving epoch-day math locally.
    const startDate = parseIsoDate(task.start);
    const endDate = parseIsoDate(task.end);
    const duration = startDate && endDate ? toEpochDay(endDate) - toEpochDay(startDate) : 0;
    applyChange(task, column.start, addDays(column.start, duration));
}

// ---------------------------------------------------------------
// Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
// ---------------------------------------------------------------

async function focusActiveCell(): Promise<void> {
    await nextTick();
    rootEl.value?.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')?.focus({ preventScroll: true });
}

function moveFocus(row: number, col: number): void {
    focusedRow.value = Math.min(Math.max(row, 0), rows.value.length - 1);
    focusedCol.value = Math.min(Math.max(col, 0), columns.value.length - 1);
    void focusActiveCell();
}

/** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
function onGridFocusin(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    focusedRow.value = Number(cell.dataset.row);
    focusedCol.value = Number(cell.dataset.col);
}

function onGridKeydown(event: KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
        const row = rows.value[activeRow.value];
        if (row && !row.hasChildren && !props.readonly && (event.target as HTMLElement).closest(".gantt-table-td")) {
            event.preventDefault();
            shiftTask(row.task, event.key === "ArrowLeft" ? -1 : 1, event.shiftKey);
            return;
        }
    }
    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            moveFocus(activeRow.value - 1, activeCol.value);
            break;
        case "ArrowDown":
            event.preventDefault();
            moveFocus(activeRow.value + 1, activeCol.value);
            break;
        case "ArrowLeft":
            event.preventDefault();
            moveFocus(activeRow.value, activeCol.value - 1);
            break;
        case "ArrowRight":
            event.preventDefault();
            moveFocus(activeRow.value, activeCol.value + 1);
            break;
        case "Home":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(0, 0);
            else moveFocus(activeRow.value, 0);
            break;
        case "End":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(rows.value.length - 1, columns.value.length - 1);
            else moveFocus(activeRow.value, columns.value.length - 1);
            break;
        case "s":
        case "S": {
            if (event.ctrlKey || event.metaKey || event.altKey) break;
            const row = rows.value[activeRow.value];
            if (row && (event.target as HTMLElement).closest(".gantt-table-td")) {
                event.preventDefault();
                selectTask(row.task.id);
            }
            break;
        }
        case "Enter":
        case " ": {
            event.preventDefault();
            const row = rows.value[activeRow.value];
            if (row && !row.hasChildren) void openEdit(row.task);
            break;
        }
    }
}

// ---------------------------------------------------------------
// Template helpers — precompute per-row/per-cell derived data so the
// template calls each pure function exactly once per cell, matching
// `kanban-board`'s own `cellsForRow` idiom.
// ---------------------------------------------------------------

function isTodayColumn(column: GanttColumn): boolean {
    return props.today != null && rangesOverlap(column.start, column.end, props.today, props.today);
}

function markersIn(column: GanttColumn): GanttMarker[] {
    return props.markers.filter((m) => rangesOverlap(column.start, column.end, m.date, m.date));
}

function columnNonWorking(column: GanttColumn): boolean {
    if (!props.isNonWorking) return false;
    for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
        if (!props.isNonWorking(d)) return false;
    }
    return true;
}

type ColumnView = { column: GanttColumn; markers: GanttMarker[]; nonWorking: boolean };
const columnViews = computed<ColumnView[]>(() =>
    columns.value.map((column) => ({ column, markers: markersIn(column), nonWorking: columnNonWorking(column) })),
);

type RowView = {
    row: FlatRow;
    rowIndex: number;
    start: string;
    end: string;
    deps: string[];
    cells: {
        column: GanttColumn;
        colIndex: number;
        inRange: boolean;
        isMilestone: boolean;
        isToday: boolean;
        isLeadingCell: boolean;
        nonWorking: boolean;
        hasMarker: boolean;
    }[];
};

function viewForRow(row: FlatRow, rowIndex: number): RowView {
    const { start, end } = rangeFor(row.task, row.hasChildren);
    const deps = predecessorLabels(row.task);
    const cells = columns.value.map((column, colIndex) => {
        const inRange = !!start && !!end && rangesOverlap(column.start, column.end, start, end);
        const isMilestone = inRange && start === end;
        const isToday = isTodayColumn(column);
        const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start);
        const cv = columnViews.value[colIndex];
        return {
            column,
            colIndex,
            inRange,
            isMilestone,
            isToday,
            isLeadingCell,
            nonWorking: cv.nonWorking,
            hasMarker: cv.markers.length > 0,
        };
    });
    return { row, rowIndex, start, end, deps, cells };
}

const rowViews = computed(() => rows.value.map((row, rowIndex) => viewForRow(row, rowIndex)));
</script>

<template>
    <div ref="rootEl" :class="`gantt-chart ${props.class ?? ''}`.trim()" :data-readonly="readonly ? '' : undefined">
        <div v-if="parentIds.length > 0 && (labels?.expandAll || labels?.collapseAll)" class="gantt-chart-collapse-all" role="group" :aria-label="label">
            <button
                v-if="labels?.expandAll"
                type="button"
                class="gantt-chart-expand-all-button"
                :disabled="collapsedTaskIds.length === 0"
                @click="setAllCollapsed(false)"
            >{{ labels.expandAll }}</button>
            <button
                v-if="labels?.collapseAll"
                type="button"
                class="gantt-chart-collapse-all-button"
                :disabled="parentIds.every((id) => collapsed.has(id))"
                @click="setAllCollapsed(true)"
            >{{ labels.collapseAll }}</button>
        </div>
        <div v-if="labels?.zoomIn || labels?.zoomOut" class="gantt-chart-zoom" role="group" :aria-label="label">
            <button
                v-if="labels?.zoomOut"
                type="button"
                class="gantt-chart-zoom-out-button"
                :aria-label="labels.zoomOut"
                :disabled="zoomIndex <= 0"
                @click="zoom(-1)"
            >−</button>
            <button
                v-if="labels?.zoomIn"
                type="button"
                class="gantt-chart-zoom-in-button"
                :aria-label="labels.zoomIn"
                :disabled="zoomIndex >= ZOOM_ORDER.length - 1"
                @click="zoom(1)"
            >+</button>
        </div>
        <GanttTable :label="label" :caption="caption" @keydown="onGridKeydown" @focusin="onGridFocusin" @click="onGridClick">
            <GanttTableThead>
                <GanttTableTr>
                    <GanttTableTH scope="col">{{ labels?.taskColumnHeader ?? "" }}</GanttTableTH>
                    <GanttTableTH
                        v-for="cv in columnViews"
                        :key="cv.column.start"
                        scope="col"
                        :data-today="isTodayColumn(cv.column) ? '' : undefined"
                        :data-non-working="cv.nonWorking ? '' : undefined"
                        :data-marker="cv.markers.length ? cv.markers.map((m) => m.kind ?? 'marker').join(' ') : undefined"
                    >
                        {{ labels?.columnLabel?.(cv.column.start, cv.column.end, timeUnit) ?? cv.column.start }}
                        <template v-for="marker in cv.markers" :key="marker.date + (marker.kind ?? '')">
                            <span v-if="marker.label" class="gantt-chart-marker-label">{{ marker.label }}</span>
                        </template>
                    </GanttTableTH>
                </GanttTableTr>
            </GanttTableThead>
            <GanttTableTbody>
                <template v-for="view in rowViews" :key="view.row.task.id">
                    <GanttTableTr
                        :data-task-type="view.row.task.type"
                        :data-critical="view.row.task.critical ? '' : undefined"
                        :data-slack="view.row.task.slack"
                        :data-task-id="view.row.task.id"
                        :data-unscheduled="!view.row.hasChildren && (!view.row.task.start || !view.row.task.end) ? '' : undefined"
                        :aria-selected="selectedTaskId === view.row.task.id ? 'true' : undefined"
                        :data-selected="selectedTaskId === view.row.task.id ? '' : undefined"
                        v-bind="taskAttrs?.(view.row.task) ?? {}"
                    >
                        <!-- Depth is data for the consumer's CSS (indentation), never an inline style. -->
                        <GanttTableTH scope="row" :data-depth="view.row.depth">
                            <button
                                v-if="view.row.hasChildren && labels?.collapseButton"
                                type="button"
                                class="gantt-chart-collapse-button"
                                :aria-expanded="!collapsed.has(view.row.task.id) ? 'true' : 'false'"
                                :aria-label="labels.collapseButton(view.row.task, collapsed.has(view.row.task.id))"
                                @click="toggleCollapse(view.row.task.id)"
                            >
                                {{ collapsed.has(view.row.task.id) ? "▸" : "▾" }}
                            </button>
                            {{ resolveTaskLabel(view.row.task) }}
                            <span
                                v-if="view.deps.length > 0 && labels?.dependencySummary"
                                :id="dependencyId(view.row.task.id)"
                                class="gantt-chart-dependency-summary"
                                hidden
                            >
                                {{ labels.dependencySummary(view.deps) }}
                            </span>
                            <span
                                v-if="view.row.task.baseline && labels?.baselineSummary"
                                :id="baselineId(view.row.task.id)"
                                class="gantt-chart-baseline-summary"
                                hidden
                            >
                                {{ labels.baselineSummary(resolveTaskLabel(view.row.task), view.row.task.baseline, varianceDays(view.row.task, view.end)) }}
                            </span>
                        </GanttTableTH>
                        <GanttTableTD
                            v-for="cell in view.cells"
                            :key="cell.column.start"
                            :data-row="view.rowIndex"
                            :data-col="cell.colIndex"
                            :active="activeRow === view.rowIndex && activeCol === cell.colIndex"
                            :data-in-range="cell.inRange ? '' : undefined"
                            :data-milestone="cell.isMilestone ? '' : undefined"
                            :data-today="cell.isToday ? '' : undefined"
                            :data-non-working="cell.nonWorking ? '' : undefined"
                            :data-marker="cell.hasMarker ? '' : undefined"
                            :aria-describedby="describedBy(view.row.task, view.deps.length > 0)"
                            :data-baseline="
                                view.row.task.baseline &&
                                rangesOverlap(cell.column.start, cell.column.end, view.row.task.baseline.start, view.row.task.baseline.end)
                                    ? ''
                                    : undefined
                            "
                            @dragover="onCellDragOver"
                            @drop="(e: DragEvent) => onCellDrop(cell.column, e)"
                        >
                            <span
                                v-if="cell.isLeadingCell"
                                class="gantt-chart-bar"
                                :data-percent-complete="view.row.task.percentComplete ?? undefined"
                                :draggable="!view.row.hasChildren && !readonly ? 'true' : undefined"
                                @dragstart="(e: DragEvent) => onBarDragStart(view.row.task, e)"
                            ><span
                                v-if="!view.row.hasChildren && !readonly"
                                class="gantt-chart-bar-handle gantt-chart-bar-handle-start"
                                draggable="true"
                                aria-hidden="true"
                                @dragstart="(e: DragEvent) => onHandleDragStart(view.row.task, 'start', e)"
                            ></span></span>
                            <span
                                v-if="!view.row.hasChildren && !readonly && cell.inRange && rangesOverlap(cell.column.start, cell.column.end, view.end, view.end)"
                                class="gantt-chart-bar-handle gantt-chart-bar-handle-end"
                                draggable="true"
                                aria-hidden="true"
                                @dragstart="(e: DragEvent) => onHandleDragStart(view.row.task, 'end', e)"
                            ></span>
                        </GanttTableTD>
                    </GanttTableTr>
                    <tr
                        v-if="editingTaskId === view.row.task.id && canEdit && labels?.dateTimePickerLabels"
                        class="gantt-chart-edit-row"
                    >
                        <td :colspan="columns.length + 1" @keydown="onEditKeydown">
                            <DateTimePicker
                                :label="labels?.startLabel ?? ''"
                                :labels="labels.dateTimePickerLabels"
                                mode="date"
                                v-model:value="editStart"
                            />
                            <DateTimePicker
                                :label="labels?.endLabel ?? ''"
                                :labels="labels.dateTimePickerLabels"
                                mode="date"
                                v-model:value="editEnd"
                            />
                            <label v-if="labels?.percentLabel" class="gantt-chart-percent-label">
                                {{ labels.percentLabel }}
                                <input
                                    v-model="editPercent"
                                    class="gantt-chart-percent-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                />
                            </label>
                            <button
                                type="button"
                                class="gantt-chart-save-button"
                                :disabled="!editStart || !editEnd"
                                @click="saveEdit(view.row.task)"
                            >
                                {{ labels?.saveLabel ?? "" }}
                            </button>
                            <button type="button" class="gantt-chart-cancel-button" @click="closeEdit">
                                {{ labels?.cancelLabel ?? "" }}
                            </button>
                        </td>
                    </tr>
                </template>
            </GanttTableTbody>
        </GanttTable>

        <p class="gantt-chart-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
