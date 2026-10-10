<script lang="ts">
import type { DateTimePickerLabels } from "@lilydesignsystem/vue-date-time-picker";

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
 * names — no baked-in English fallback, matching every other helper's
 * label-presence-gates-control convention. See spec/index.md §5.
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
    /** Column granularity. A static rendering choice, not an interactive zoom control. */
    timeUnit?: GanttTimeUnit;
    /** ISO date marking "today"; never computed internally (stays SSR-safe). */
    today?: string;
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

/** Depth-first flatten of the parentId tree, skipping collapsed subtrees. */
export function flattenTasks(tasks: GanttTask[], collapsed: ReadonlySet<string>): FlatRow[] {
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
    timeUnit: "day",
    today: undefined,
    taskLabel: undefined,
    labels: () => ({}),
    class: "",
});

// The Svelte canonical takes an `onTaskChange` callback prop; the Vue
// idiom for the same contract is an emitted event, matching
// `kanban-board`'s own `move` and `picker-bar`'s `theme-change` et al.
const emit = defineEmits<{
    (event: "task-change", taskId: string, start: string, end: string): void;
}>();

const baseId = nextGanttChartId();
const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

const rootEl = ref<HTMLDivElement | null>(null);
const statusMessage = ref("");
const collapsed = ref(new Set<string>());
const focusedRow = ref(0);
const focusedCol = ref(0);

const editingTaskId = ref<string | null>(null);
const editStart = ref("");
const editEnd = ref("");

let draggingTaskId: string | null = null;

const columns = computed(() => generateColumns(props.range, props.timeUnit ?? "day", addDays));
const rows = computed(() => flattenTasks(props.tasks, collapsed.value));

function resolveTaskLabel(task: GanttTask): string {
    return (props.taskLabel ?? defaultTaskLabel)(task);
}

function rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
    return hasChildren ? effectiveRange(task, props.tasks) : { start: task.start, end: task.end };
}

function announce(message: string | undefined): void {
    if (message) statusMessage.value = message;
}

// ---------------------------------------------------------------
// Hierarchy
// ---------------------------------------------------------------

function toggleCollapse(taskId: string): void {
    const next = new Set(collapsed.value);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    collapsed.value = next;
}

// ---------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------

function predecessorLabels(task: GanttTask): string[] {
    if (!task.dependsOn?.length) return [];
    return task.dependsOn.map((id) => {
        const predecessor = props.tasks.find((t) => t.id === id);
        return predecessor ? resolveTaskLabel(predecessor) : id;
    });
}

// ---------------------------------------------------------------
// Edit — keyboard (composed DateTimePicker) and pointer (native DnD)
// ---------------------------------------------------------------

function applyChange(task: GanttTask, start: string, end: string): void {
    emit("task-change", task.id, start, end);
    announce(props.labels?.dateAnnouncement?.(resolveTaskLabel(task), start, end));
}

function openEdit(task: GanttTask): void {
    if (!props.labels?.dateTimePickerLabels) return;
    editingTaskId.value = task.id;
    editStart.value = task.start;
    editEnd.value = task.end;
}

function saveEdit(task: GanttTask): void {
    applyChange(task, editStart.value, editEnd.value);
    editingTaskId.value = null;
}

function cancelEdit(): void {
    editingTaskId.value = null;
}

function onBarDragStart(task: GanttTask, event: DragEvent): void {
    draggingTaskId = task.id;
    event.dataTransfer?.setData("text/plain", task.id);
}

function onCellDragOver(event: DragEvent): void {
    if (draggingTaskId) event.preventDefault();
}

function onCellDrop(column: GanttColumn, event: DragEvent): void {
    event.preventDefault();
    const taskId = draggingTaskId ?? event.dataTransfer?.getData("text/plain");
    draggingTaskId = null;
    const task = props.tasks.find((t) => t.id === taskId);
    if (!task) return;
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

function onGridKeydown(event: KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            moveFocus(focusedRow.value - 1, focusedCol.value);
            break;
        case "ArrowDown":
            event.preventDefault();
            moveFocus(focusedRow.value + 1, focusedCol.value);
            break;
        case "ArrowLeft":
            event.preventDefault();
            moveFocus(focusedRow.value, focusedCol.value - 1);
            break;
        case "ArrowRight":
            event.preventDefault();
            moveFocus(focusedRow.value, focusedCol.value + 1);
            break;
        case "Home":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(0, 0);
            else moveFocus(focusedRow.value, 0);
            break;
        case "End":
            event.preventDefault();
            if (ctrlOrMeta) moveFocus(rows.value.length - 1, columns.value.length - 1);
            else moveFocus(focusedRow.value, columns.value.length - 1);
            break;
        case "Enter":
        case " ": {
            event.preventDefault();
            const row = rows.value[focusedRow.value];
            if (row && !row.hasChildren) openEdit(row.task);
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
    }[];
};

function viewForRow(row: FlatRow, rowIndex: number): RowView {
    const { start, end } = rangeFor(row.task, row.hasChildren);
    const deps = predecessorLabels(row.task);
    const cells = columns.value.map((column, colIndex) => {
        const inRange = rangesOverlap(column.start, column.end, start, end);
        const isMilestone = inRange && start === end;
        const isToday = isTodayColumn(column);
        const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start);
        return { column, colIndex, inRange, isMilestone, isToday, isLeadingCell };
    });
    return { row, rowIndex, start, end, deps, cells };
}

const rowViews = computed(() => rows.value.map((row, rowIndex) => viewForRow(row, rowIndex)));
</script>

<template>
    <div ref="rootEl" :class="`gantt-chart ${props.class ?? ''}`.trim()">
        <GanttTable :label="label" :caption="caption" @keydown="onGridKeydown">
            <GanttTableThead>
                <GanttTableTr>
                    <GanttTableTH scope="col"></GanttTableTH>
                    <GanttTableTH
                        v-for="column in columns"
                        :key="column.start"
                        scope="col"
                        :data-today="isTodayColumn(column) ? '' : undefined"
                    >
                        {{ labels?.columnLabel?.(column.start, column.end, timeUnit ?? "day") ?? column.start }}
                    </GanttTableTH>
                </GanttTableTr>
            </GanttTableThead>
            <GanttTableTbody>
                <template v-for="view in rowViews" :key="view.row.task.id">
                    <GanttTableTr>
                        <GanttTableTH scope="row" :style="`padding-inline-start: ${view.row.depth}em`">
                            <button
                                v-if="view.row.hasChildren"
                                type="button"
                                class="gantt-chart-collapse-button"
                                :aria-expanded="!collapsed.has(view.row.task.id) ? 'true' : 'false'"
                                :aria-label="labels?.collapseButton?.(view.row.task, collapsed.has(view.row.task.id)) ?? ''"
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
                        </GanttTableTH>
                        <GanttTableTD
                            v-for="cell in view.cells"
                            :key="cell.column.start"
                            :data-row="view.rowIndex"
                            :data-col="cell.colIndex"
                            :active="focusedRow === view.rowIndex && focusedCol === cell.colIndex"
                            :data-in-range="cell.inRange ? '' : undefined"
                            :data-milestone="cell.isMilestone ? '' : undefined"
                            :data-today="cell.isToday ? '' : undefined"
                            :aria-describedby="
                                view.deps.length > 0 && labels?.dependencySummary
                                    ? dependencyId(view.row.task.id)
                                    : undefined
                            "
                            @dragover="onCellDragOver"
                            @drop="(e: DragEvent) => onCellDrop(cell.column, e)"
                        >
                            <span
                                v-if="cell.isLeadingCell"
                                class="gantt-chart-bar"
                                :data-percent-complete="view.row.task.percentComplete ?? undefined"
                                :draggable="!view.row.hasChildren ? 'true' : undefined"
                                @dragstart="(e: DragEvent) => onBarDragStart(view.row.task, e)"
                            ></span>
                        </GanttTableTD>
                    </GanttTableTr>
                    <tr v-if="editingTaskId === view.row.task.id && labels?.dateTimePickerLabels" class="gantt-chart-edit-row">
                        <td :colspan="columns.length + 1">
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
                            <button type="button" class="gantt-chart-save-button" @click="saveEdit(view.row.task)">
                                {{ labels?.saveLabel ?? "" }}
                            </button>
                            <button type="button" class="gantt-chart-cancel-button" @click="cancelEdit">
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
