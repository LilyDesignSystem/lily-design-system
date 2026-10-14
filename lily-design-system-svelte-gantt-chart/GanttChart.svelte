<script lang="ts" module>
    import {
        GanttTable,
        GanttTableTD,
        GanttTableTH,
        GanttTableTbody,
        GanttTableThead,
        GanttTableTr,
    } from "@lilydesignsystem/svelte-headless";
    import DateTimePicker from "@lilydesignsystem/svelte-date-time-picker";
    import type { DateTimePickerLabels } from "@lilydesignsystem/svelte-date-time-picker";

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
        /** Class hook only: becomes `data-task-type` on the row and its cells (e.g. "design", "review"). */
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
        baselineSummary?: (taskLabel: string, baseline: { start: string; end: string }, varianceDays: number) => string;
        collapseButton?: (task: GanttTask, collapsed: boolean) => string;
    };

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
        /** Called after a task's start/end changes, by pointer or by the edit region. */
        onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
        /** Dated markers; each marks the column that contains its date with `data-marker`. */
        markers?: GanttMarker[];
        /** Consumer's own working calendar; true marks the column `data-non-working` when every day in it is non-working. */
        isNonWorking?: (isoDate: string) => boolean;
        /** Suppress editing, drag and the edit region; navigation and collapse still work. */
        readonly?: boolean;
        /** User-facing strings. See GanttLabels — presence gates each control. */
        labels?: GanttLabels;
        /** Extra CSS class on the root. */
        class?: string;
        [key: string]: unknown;
    };

    // ---------------------------------------------------------------
    // Civil-date arithmetic: UTC/epoch-day only, never local-midnight
    // `Date` construction — the same rule date-time-picker follows, so
    // no column boundary can land on the wrong day across a DST
    // transition.
    // ---------------------------------------------------------------

    function parseISOToEpochDay(iso: string): number {
        const [y, m, d] = iso.split("-").map(Number);
        return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
    }

    function epochDayToISO(epochDay: number): string {
        const date = new Date(epochDay * 86400000);
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, "0");
        const d = String(date.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    /** Add whole days to an ISO date, UTC-safe. */
    export function addDays(iso: string, days: number): string {
        return epochDayToISO(parseISOToEpochDay(iso) + days);
    }

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
    export function generateColumns(range: { start: string; end: string }, timeUnit: GanttTimeUnit): GanttColumn[] {
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

    type FlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

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
        return effectiveRanges(allTasks).get(task.id) ?? { start: task.start, end: task.end };
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
            if (children.length === 0 || onWalk.has(task.id)) return { start: task.start, end: task.end };
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
</script>

<script lang="ts">
    import { tick } from "svelte";

    let {
        class: className = "",
        label,
        caption,
        range,
        tasks,
        timeUnit = "day",
        today,
        markers = [],
        isNonWorking = undefined,
        readonly = false,
        taskLabel = (task: GanttTask) => task.label,
        onTaskChange,
        labels = {},
        ...restProps
    }: Props = $props();

    const baseId = nextGanttChartId();
    const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    let collapsed = $state(new Set<string>());
    let focusedRow = $state(0);
    let focusedCol = $state(0);

    let editingTaskId = $state<string | null>(null);
    let editStart = $state("");
    let editEnd = $state("");
    let editPercent = $state("");

    let draggingTaskId: string | null = null;

    const columns = $derived(generateColumns(range, timeUnit));
    const rows = $derived(flattenTasks(tasks, collapsed));
    const ranges = $derived(effectiveRanges(tasks));

    // The roving cursor, clamped to the cells that exist now: collapsing a parent
    // can remove the row it named, and the grid must never leave the tab order.
    const activeRow = $derived(Math.min(focusedRow, rows.length - 1));
    const activeCol = $derived(Math.min(focusedCol, columns.length - 1));

    /** Editing needs every label its controls show; an unnamed Save is worse than none. */
    const canEdit = $derived(
        !readonly && !!labels.dateTimePickerLabels && !!labels.startLabel && !!labels.endLabel && !!labels.saveLabel && !!labels.cancelLabel,
    );

    function markersIn(column: GanttColumn): GanttMarker[] {
        return markers.filter((m) => rangesOverlap(column.start, column.end, m.date, m.date));
    }

    function columnNonWorking(column: GanttColumn): boolean {
        if (!isNonWorking) return false;
        for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
            if (!isNonWorking(d)) return false;
        }
        return true;
    }

    const nonWorking = $derived(columns.map(columnNonWorking));

    function rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
        return hasChildren ? (ranges.get(task.id) ?? task) : { start: task.start, end: task.end };
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Hierarchy
    // ---------------------------------------------------------------

    function toggleCollapse(taskId: string): void {
        const next = new Set(collapsed);
        if (next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        collapsed = next;
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

    function baselineVariance(task: GanttTask, currentEnd: string): number {
        return parseISOToEpochDay(currentEnd) - parseISOToEpochDay(task.baseline!.end);
    }

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

    async function openEdit(task: GanttTask): Promise<void> {
        if (!canEdit) return;
        editingTaskId = task.id;
        editStart = task.start;
        editEnd = task.end;
        editPercent = task.percentComplete != null ? String(task.percentComplete) : "";
        // Focus moves into the region it opened, onto the start date's field.
        await tick();
        rootEl?.querySelector<HTMLElement>(".gantt-chart-edit-row .date-time-picker-input")?.focus({ preventScroll: true });
    }

    /** A range entered end-first is saved start-first; Save is disabled while either date is empty. */
    function saveEdit(task: GanttTask): void {
        if (!editStart || !editEnd) return;
        const [start, end] = compareISO(editStart, editEnd) <= 0 ? [editStart, editEnd] : [editEnd, editStart];
        const percent = labels.percentLabel && editPercent !== "" ? Math.min(100, Math.max(0, Math.round(Number(editPercent)))) : undefined;
        applyChange(task, start, end, Number.isFinite(percent) ? percent : undefined);
        closeEdit();
    }

    /** Closing either way returns focus to the grid's tab stop, on the edited task's row. */
    function closeEdit(): void {
        editingTaskId = null;
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
        event.dataTransfer?.setData("text/plain", task.id);
    }

    function onCellDragOver(event: DragEvent): void {
        if (draggingTaskId) event.preventDefault();
    }

    function onCellDrop(column: GanttColumn, event: DragEvent): void {
        event.preventDefault();
        if (readonly) return;
        const taskId = draggingTaskId ?? event.dataTransfer?.getData("text/plain");
        draggingTaskId = null;
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        const duration = parseISOToEpochDay(task.end) - parseISOToEpochDay(task.start);
        applyChange(task, column.start, addDays(column.start, duration));
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    async function focusActiveCell(): Promise<void> {
        await tick();
        rootEl?.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')?.focus({ preventScroll: true });
    }

    /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
    function onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
    }

    function moveFocus(row: number, col: number): void {
        focusedRow = Math.min(Math.max(row, 0), rows.length - 1);
        focusedCol = Math.min(Math.max(col, 0), columns.length - 1);
        void focusActiveCell();
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
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
                if (row && !row.hasChildren) void openEdit(row.task);
                break;
            }
        }
    }
</script>

<div bind:this={rootEl} class={`gantt-chart ${className}`.trim()} data-readonly={readonly ? "" : undefined} {...restProps}>
    <GanttTable {label} {caption} onkeydown={onGridKeydown} onfocusin={onGridFocusin}>
        <GanttTableThead>
            <GanttTableTr>
                <GanttTableTH scope="col">{labels.taskColumnHeader ?? ""}</GanttTableTH>
                {#each columns as column (column.start)}
                    {@const isToday = today != null && rangesOverlap(column.start, column.end, today, today)}
                    {@const colMarkers = markersIn(column)}
                    <GanttTableTH
                        scope="col"
                        data-today={isToday ? "" : undefined}
                        data-non-working={nonWorking[columns.indexOf(column)] ? "" : undefined}
                        data-marker={colMarkers.length ? colMarkers.map((m) => m.kind ?? "marker").join(" ") : undefined}
                    >
                        {labels.columnLabel?.(column.start, column.end, timeUnit) ?? column.start}
                        {#each colMarkers as marker (marker.date + (marker.kind ?? ""))}
                            {#if marker.label}<span class="gantt-chart-marker-label">{marker.label}</span>{/if}
                        {/each}
                    </GanttTableTH>
                {/each}
            </GanttTableTr>
        </GanttTableThead>
        <GanttTableTbody>
            {#each rows as row, rowIndex (row.task.id)}
                {@const { start, end } = rangeFor(row.task, row.hasChildren)}
                {@const deps = predecessorLabels(row.task)}
                <GanttTableTr
                    data-task-type={row.task.type}
                    data-critical={row.task.critical ? "" : undefined}
                    data-slack={row.task.slack}
                >
                    <!-- Depth is data for the consumer's CSS (indentation), never an inline style. -->
                    <GanttTableTH scope="row" data-depth={row.depth}>
                        {#if row.hasChildren && labels.collapseButton}
                            <button
                                type="button"
                                class="gantt-chart-collapse-button"
                                aria-expanded={!collapsed.has(row.task.id)}
                                aria-label={labels.collapseButton(row.task, collapsed.has(row.task.id))}
                                onclick={() => toggleCollapse(row.task.id)}
                            >
                                {collapsed.has(row.task.id) ? "▸" : "▾"}
                            </button>
                        {/if}
                        {taskLabel(row.task)}
                        {#if deps.length > 0 && labels.dependencySummary}
                            <span id={dependencyId(row.task.id)} class="gantt-chart-dependency-summary" hidden>
                                {labels.dependencySummary(deps)}
                            </span>
                        {/if}
                        {#if row.task.baseline && labels.baselineSummary}
                            <span id={baselineId(row.task.id)} class="gantt-chart-baseline-summary" hidden>
                                {labels.baselineSummary(taskLabel(row.task), row.task.baseline, baselineVariance(row.task, end))}
                            </span>
                        {/if}
                    </GanttTableTH>
                    {#each columns as column, colIndex (column.start)}
                        {@const inRange = rangesOverlap(column.start, column.end, start, end)}
                        {@const isMilestone = inRange && start === end}
                        {@const isToday = today != null && rangesOverlap(column.start, column.end, today, today)}
                        {@const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start)}
                        <GanttTableTD
                            data-row={rowIndex}
                            data-col={colIndex}
                            active={activeRow === rowIndex && activeCol === colIndex}
                            data-in-range={inRange ? "" : undefined}
                            data-milestone={isMilestone ? "" : undefined}
                            data-today={isToday ? "" : undefined}
                            data-non-working={nonWorking[colIndex] ? "" : undefined}
                            data-marker={markersIn(column).length ? "" : undefined}
                            aria-describedby={describedBy(row.task, deps.length > 0)}
                            data-baseline={row.task.baseline && rangesOverlap(column.start, column.end, row.task.baseline.start, row.task.baseline.end) ? "" : undefined}
                            ondragover={onCellDragOver}
                            ondrop={(e: DragEvent) => onCellDrop(column, e)}
                        >
                            {#if isLeadingCell}
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <span
                                    class="gantt-chart-bar"
                                    data-percent-complete={row.task.percentComplete ?? undefined}
                                    draggable={!row.hasChildren && !readonly ? "true" : undefined}
                                    ondragstart={(e: DragEvent) => onBarDragStart(row.task, e)}
                                ></span>
                            {/if}
                        </GanttTableTD>
                    {/each}
                </GanttTableTr>
                {#if editingTaskId === row.task.id && canEdit && labels.dateTimePickerLabels}
                    <tr class="gantt-chart-edit-row">
                        <td colspan={columns.length + 1} onkeydown={onEditKeydown}>
                            <DateTimePicker
                                label={labels.startLabel ?? ""}
                                labels={labels.dateTimePickerLabels}
                                mode="date"
                                bind:value={editStart}
                            />
                            <DateTimePicker
                                label={labels.endLabel ?? ""}
                                labels={labels.dateTimePickerLabels}
                                mode="date"
                                bind:value={editEnd}
                            />
                            {#if labels.percentLabel}
                                <label class="gantt-chart-percent-label">
                                    {labels.percentLabel}
                                    <input
                                        class="gantt-chart-percent-input"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        bind:value={editPercent}
                                    />
                                </label>
                            {/if}
                            <button
                                type="button"
                                class="gantt-chart-save-button"
                                disabled={!editStart || !editEnd}
                                onclick={() => saveEdit(row.task)}
                            >
                                {labels.saveLabel ?? ""}
                            </button>
                            <button type="button" class="gantt-chart-cancel-button" onclick={closeEdit}>
                                {labels.cancelLabel ?? ""}
                            </button>
                        </td>
                    </tr>
                {/if}
            {/each}
        </GanttTableTbody>
    </GanttTable>

    <p class="gantt-chart-status" aria-live="polite">{statusMessage}</p>
</div>
