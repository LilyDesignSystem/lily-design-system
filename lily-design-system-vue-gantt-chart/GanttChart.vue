<script lang="ts">
import type { DateTimePickerLabels } from "@lilydesignsystem/vue-date-time-picker";
import type { ExportFormat } from "./export-data";
import type { FieldDef } from "./typed-fields";

/**
 * A typed field a task carries (an owner, a status, an estimate), shown as a column between the task name and the timeline and
 * read from `task.values[id]`. A bundle of display, sort and export defaults from the data grid's cell types.
 */
export type GanttField = FieldDef;

/** What `exportHandler` and the `export-file` event receive. Return `false` from `exportHandler` to take over the download. */
export type GanttExport = { format: ExportFormat; filename: string; taskCount: number; blob: Blob };

/** What the `field-edit` event carries. */
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
 * names — no baked-in English fallback, matching every other helper's
 * label-presence-gates-control convention. See spec/index.md §5.
 */
export type GanttLabels = {
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
    /** Typed fields: a column per field between the task name and the timeline, read from `task.values`. Editable types edit in place (click the value, or F2 on the task's row for the first editable field; Tab moves to the next) when a `field-edit` listener is attached. */
    fields?: GanttField[];
    /** Locale for number and date fields. Never defaulted. */
    locale?: string;
    /** The file name without its extension. Default `"gantt-chart"`. */
    exportFilename?: string;
    /** What an export holds: `"all"` (default) is every task; `"visible"` leaves out the tasks under a collapsed parent. */
    exportScope?: "all" | "visible";
    /** Called before the download with the finished file. Return `false` to skip the built-in download. */
    exportHandler?: (file: GanttExport) => boolean | void;
    /** Renders only the task rows in view (windowing). The chart gets a scroll area of `height` px; every row is assumed `rowHeight` px tall. */
    virtualize?: { rowHeight: number; height: number; overscan?: number };
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
import { computed, getCurrentInstance, nextTick, ref } from "vue";
import {
    GanttTable,
    GanttTableTD,
    GanttTableTH,
    GanttTableTbody,
    GanttTableThead,
    GanttTableTr,
} from "@lilydesignsystem/vue-headless";
import DateTimePicker, { addDays, parseIsoDate, toEpochDay } from "@lilydesignsystem/vue-date-time-picker";
import { downloadBlob, exportBlob, exportFilename } from "./export-data";
import { civilDateToDate } from "./cell-types";
import {
    draftOf,
    editorKind,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText as fieldTextOf,
    isEditableField,
    neighbourField,
    resolveFields,
    type Draft,
    type ResolvedField,
} from "./typed-fields";

const props = withDefaults(defineProps<Props>(), {
    caption: undefined,
    taskAttrs: undefined,
    today: undefined,
    markers: () => [],
    isNonWorking: undefined,
    readonly: false,
    fields: undefined,
    locale: undefined,
    exportFilename: "gantt-chart",
    exportScope: "all",
    exportHandler: undefined,
    virtualize: undefined,
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
    /** An accepted field edit. The consumer updates `tasks`. A field is editable only when a listener is attached (and the chart is not `readonly`). */
    (event: "field-edit", edit: GanttFieldEdit): void;
    /** An export file, before it is saved. */
    (event: "export-file", file: GanttExport): void;
}>();

// The listener's presence decides whether fields are editable, so it is read from the vnode.
const hasFieldEdit = !!(getCurrentInstance()?.vnode.props as Record<string, unknown> | null)?.onFieldEdit;

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
const taskById = computed(() => new Map(props.tasks.map((t) => [t.id, t])));

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
// Typed fields, inline editing, export
// ---------------------------------------------------------------

// Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per task or keystroke.
const resolvedFields = computed(() => resolveFields(props.fields, props.locale));
const isFieldEditable = (f: GanttField) => hasFieldEdit && !props.readonly && isEditableField(f);
const fieldText = (f: ResolvedField, task: GanttTask): string => fieldTextOf(f, task.values);
const editorValue = (draft: Draft): string => String(draft ?? "");

/** The field being edited, if any: the draft is the editor's text. */
const editingField = ref<{ taskId: string; fieldId: string; draft: Draft } | null>(null);

async function startFieldEdit(task: GanttTask, f: ResolvedField): Promise<void> {
    if (!isFieldEditable(f)) return;
    editingTaskId.value = null;
    editingField.value = { taskId: task.id, fieldId: f.id, draft: draftOf(f, task.values) };
    await nextTick();
    const editor = rootEl.value?.querySelector<HTMLInputElement>(".gantt-chart-field-editor");
    editor?.focus({ preventScroll: true });
    if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
}

/** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
function commitFieldEdit(): boolean {
    const current = editingField.value;
    if (!current) return true;
    const { taskId, fieldId, draft } = current;
    const task = taskById.value.get(taskId);
    const f = resolvedFields.value.find((x) => x.id === fieldId);
    if (!task || !f) {
        editingField.value = null;
        return true;
    }
    const outcome = evaluateEdit(f, task.values, draft);
    if (outcome.invalid) {
        announce(props.labels?.editInvalid?.(resolveTaskLabel(task), f.header));
        return false;
    }
    editingField.value = null;
    if (outcome.changed) {
        emit("field-edit", { taskId, fieldId, value: outcome.value, previous: outcome.previous });
        announce(props.labels?.editAnnouncement?.(resolveTaskLabel(task), f.header, outcome.text));
    }
    return true;
}

function cancelFieldEdit(): void {
    editingField.value = null;
    void focusActiveCell();
}

function onFieldEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
        event.preventDefault();
        if (commitFieldEdit()) void focusActiveCell();
    } else if (event.key === "Escape") {
        event.preventDefault();
        cancelFieldEdit();
    } else if (event.key === "Tab" && editingField.value) {
        // Tab commits and moves to the task's next (Shift+Tab: previous) editable field; past the last, it moves on.
        const current = editingField.value;
        const task = taskById.value.get(current.taskId);
        const next = neighbourField(resolvedFields.value.filter(isFieldEditable), current.fieldId, event.shiftKey);
        if (task && next) {
            event.preventDefault();
            if (commitFieldEdit()) void startFieldEdit(task, next);
        } else {
            commitFieldEdit();
        }
    }
}

const exportRows = computed(() =>
    props.exportScope === "visible" ? rows.value.map((r) => r.task) : flattenTasks(props.tasks, new Set<string>()).map((r) => r.task),
);
const hasExportButtons = computed(() => !!props.labels?.exportHeaders && !!(props.labels.exportCsv || props.labels.exportTsv || props.labels.exportExcel));

/** A civil date as a real date for the spreadsheet; an unscheduled task's empty date as null. */
const exportDate = (iso: string | undefined): Date | null => (iso ? civilDateToDate(iso) : null);

function runExport(format: ExportFormat): void {
    const h = props.labels?.exportHeaders;
    if (!h) return;
    const exportFields = exportableFields(resolvedFields.value);
    const headers = [h.task, h.start, h.end];
    if (h.percentComplete) headers.push(h.percentComplete);
    if (h.parent) headers.push(h.parent);
    if (h.dependsOn) headers.push(h.dependsOn);
    if (h.baselineStart) headers.push(h.baselineStart);
    if (h.baselineEnd) headers.push(h.baselineEnd);
    for (const f of exportFields) headers.push(f.header);
    const hasChildren = new Set(props.tasks.filter((t) => t.parentId != null && taskById.value.has(t.parentId)).map((t) => t.parentId as string));
    const body = exportRows.value.map((task) => {
        const span = hasChildren.has(task.id) ? (ranges.value.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
        const cells: unknown[] = [resolveTaskLabel(task), exportDate(span.start), exportDate(span.end)];
        if (h.percentComplete) cells.push(task.percentComplete ?? null);
        if (h.parent) cells.push(task.parentId != null && taskById.value.has(task.parentId) ? resolveTaskLabel(taskById.value.get(task.parentId)!) : null);
        if (h.dependsOn) {
            cells.push(
                (task.dependsOn ?? [])
                    .map((dep) => {
                        const id = typeof dep === "string" ? dep : dep.id;
                        const predecessor = taskById.value.get(id);
                        return predecessor ? resolveTaskLabel(predecessor) : id;
                    })
                    .join("; "),
            );
        }
        if (h.baselineStart) cells.push(exportDate(task.baseline?.start));
        if (h.baselineEnd) cells.push(exportDate(task.baseline?.end));
        for (const f of exportFields) cells.push(exportFieldCell(f, task.values));
        return cells;
    });
    const filename = exportFilename(props.exportFilename, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: props.exportFilename });
    const file: GanttExport = { format, filename, taskCount: body.length, blob };
    emit("export-file", file);
    if (props.exportHandler?.(file) === false) return;
    downloadBlob(blob, filename);
    announce(props.labels?.exportAnnouncement?.(format, body.length, filename));
}

// ---------------------------------------------------------------
// Windowing (virtualize)
// ---------------------------------------------------------------

const scrollTop = ref(0);
const scrollEl = ref<HTMLDivElement | null>(null);

/** Bring a row into the scroll area (a virtualized chart renders only what is in view). */
function revealRow(rowIndex: number): void {
    const v = props.virtualize;
    if (!v) return;
    const top = rowIndex * v.rowHeight;
    let next = scrollTop.value;
    if (top < scrollTop.value) next = top;
    else if (top + v.rowHeight > scrollTop.value + v.height) next = top + v.rowHeight - v.height;
    if (next !== scrollTop.value) {
        scrollTop.value = next;
        if (scrollEl.value) scrollEl.value.scrollTop = next;
    }
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
        taskById.value.has(id),
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
        const predecessor = taskById.value.get(id);
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
    if (target.closest("button, input, select, .gantt-chart-edit-row, .gantt-chart-field-editor")) return;
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
    const task = taskId ? taskById.value.get(taskId) : undefined;
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
    const nextRow = Math.min(Math.max(row, 0), rows.value.length - 1);
    focusedRow.value = nextRow;
    focusedCol.value = Math.min(Math.max(col, 0), columns.value.length - 1);
    revealRow(nextRow);
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
    if (event.key === "F2" && hasFieldEdit) {
        // F2: edit the task's first editable field (the keyboard twin of clicking its value).
        const row = rows.value[activeRow.value];
        const first = resolvedFields.value.find(isFieldEditable);
        if (row && first) {
            event.preventDefault();
            void startFieldEdit(row.task, first);
        }
        return;
    }
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
// Today per column, found once per change rather than once per cell per render.
const todayColumns = computed(() => columns.value.map(isTodayColumn));

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
    kind: "row";
    key: string;
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
        const isToday = todayColumns.value[colIndex];
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
    return { kind: "row", key: row.task.id, row, rowIndex, start, end, deps, cells };
}

type SpacerView = { kind: "spacer"; key: string; height: number };
/** What renders: the rows in view plus the roving tab stop's row (so the grid never leaves the tab order), with spacers for the gaps. Only these rows build their cells. */
const rowViews = computed<(RowView | SpacerView)[]>(() => {
    const all = rows.value;
    const v = props.virtualize;
    if (!v) return all.map((row, rowIndex) => viewForRow(row, rowIndex));
    const overscan = v.overscan ?? 3;
    const start = Math.max(0, Math.floor(scrollTop.value / v.rowHeight) - overscan);
    const end = Math.min(all.length, Math.ceil((scrollTop.value + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    if (activeRow.value >= 0 && activeRow.value < all.length) indices.add(activeRow.value);
    const out: (RowView | SpacerView)[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
        if (index - previous > 1) out.push({ kind: "spacer", key: `spacer:${previous}`, height: (index - previous - 1) * v.rowHeight });
        out.push(viewForRow(all[index], index));
        previous = index;
    }
    if (all.length - 1 - previous > 0) out.push({ kind: "spacer", key: `spacer:${previous}`, height: (all.length - 1 - previous) * v.rowHeight });
    return out;
});
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
        <div v-if="hasExportButtons" class="gantt-chart-export" role="group" :aria-label="labels?.export">
            <button v-if="labels?.exportCsv" type="button" class="gantt-chart-export-button" data-gantt-export-format="csv" :disabled="exportRows.length === 0" @click="runExport('csv')">{{ labels.exportCsv }}</button>
            <button v-if="labels?.exportTsv" type="button" class="gantt-chart-export-button" data-gantt-export-format="tsv" :disabled="exportRows.length === 0" @click="runExport('tsv')">{{ labels.exportTsv }}</button>
            <button v-if="labels?.exportExcel" type="button" class="gantt-chart-export-button" data-gantt-export-format="xlsx" :disabled="exportRows.length === 0" @click="runExport('xlsx')">{{ labels.exportExcel }}</button>
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
        <!-- The scroll area is structural: a virtualized chart renders only the rows in view inside it. -->
        <div
            ref="scrollEl"
            :class="virtualize ? 'gantt-chart-scroll' : 'gantt-chart-body'"
            :style="virtualize ? { height: `${virtualize.height}px`, overflow: 'auto' } : undefined"
            @scroll="virtualize ? (scrollTop = ($event.currentTarget as HTMLElement).scrollTop) : undefined"
        >
        <GanttTable :label="label" :caption="caption" :aria-rowcount="virtualize ? rows.length + 1 : undefined" @keydown="onGridKeydown" @focusin="onGridFocusin" @click="onGridClick">
            <GanttTableThead>
                <GanttTableTr>
                    <GanttTableTH scope="col">{{ labels?.taskColumnHeader ?? "" }}</GanttTableTH>
                    <GanttTableTH v-for="f in resolvedFields" :key="f.id" scope="col" :data-field="f.id">{{ f.header }}</GanttTableTH>
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
                <template v-for="view in rowViews" :key="view.key">
                    <tr v-if="view.kind === 'spacer'" class="gantt-chart-spacer" aria-hidden="true" :style="{ height: `${view.height}px` }">
                        <td :colspan="columns.length + 1 + resolvedFields.length"></td>
                    </tr>
                    <template v-else>
                    <GanttTableTr
                        :data-task-type="view.row.task.type"
                        :data-critical="view.row.task.critical ? '' : undefined"
                        :data-slack="view.row.task.slack"
                        :data-task-id="view.row.task.id"
                        :aria-rowindex="virtualize ? view.rowIndex + 2 : undefined"
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
                        <GanttTableTD v-for="f in resolvedFields" :key="f.id" :data-field="f.id" :data-type="f.type ?? 'text'" :data-align="f.align">
                            <template v-if="editingField && editingField.taskId === view.row.task.id && editingField.fieldId === f.id">
                                <select
                                    v-if="editorKind(f) === 'select' || editorKind(f) === 'radio'"
                                    class="gantt-chart-field-editor"
                                    :aria-label="f.editLabel ?? f.header"
                                    :value="editorValue(editingField.draft)"
                                    @change="(e) => { editingField!.draft = (e.target as HTMLSelectElement).value; if (commitFieldEdit()) void focusActiveCell(); }"
                                    @keydown="onFieldEditorKeydown"
                                    @blur="commitFieldEdit()"
                                >
                                    <option value=""></option>
                                    <option v-for="option in f.options ?? []" :key="option.id" :value="option.id" :disabled="option.disabled">{{ option.label }}</option>
                                </select>
                                <input
                                    v-else
                                    class="gantt-chart-field-editor"
                                    :aria-label="f.editLabel ?? f.header"
                                    :type="editorKind(f) === 'number' ? 'number' : editorKind(f) === 'date' ? 'date' : editorKind(f) === 'time' ? 'time' : 'text'"
                                    :inputmode="editorKind(f) === 'number' ? 'decimal' : undefined"
                                    :value="editorValue(editingField.draft)"
                                    @input="(e) => { editingField!.draft = (e.target as HTMLInputElement).value; }"
                                    @keydown="onFieldEditorKeydown"
                                    @blur="commitFieldEdit()"
                                />
                            </template>
                            <template v-else-if="isFieldEditable(f)">
                                <span :id="`${baseId}-fn-${view.row.task.id}-${f.id}`" hidden>{{ f.header }}</span>
                                <button
                                    type="button"
                                    class="gantt-chart-field-button"
                                    :id="`${baseId}-fv-${view.row.task.id}-${f.id}`"
                                    tabindex="-1"
                                    :aria-labelledby="`${baseId}-fn-${view.row.task.id}-${f.id} ${baseId}-fv-${view.row.task.id}-${f.id}`"
                                    @click="startFieldEdit(view.row.task, f)"
                                >{{ fieldText(f, view.row.task) }}</button>
                            </template>
                            <template v-else>{{ fieldText(f, view.row.task) }}</template>
                        </GanttTableTD>
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
                        <td :colspan="columns.length + 1 + resolvedFields.length" @keydown="onEditKeydown">
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
                </template>
            </GanttTableTbody>
        </GanttTable>
        </div>

        <p class="gantt-chart-status" aria-live="polite">{{ statusMessage }}</p>
    </div>
</template>
