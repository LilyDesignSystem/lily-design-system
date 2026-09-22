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
        onTaskChange?: (taskId: string, start: string, end: string) => void;
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

<script lang="ts">
    let {
        class: className = "",
        label,
        caption,
        range,
        tasks,
        timeUnit = "day",
        today,
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

    let draggingTaskId: string | null = null;

    const columns = $derived(generateColumns(range, timeUnit));
    const rows = $derived(flattenTasks(tasks, collapsed));

    function rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
        return hasChildren ? effectiveRange(task, tasks) : { start: task.start, end: task.end };
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
        editingTaskId = task.id;
        editStart = task.start;
        editEnd = task.end;
    }

    function saveEdit(task: GanttTask): void {
        applyChange(task, editStart, editEnd);
        editingTaskId = null;
    }

    function cancelEdit(): void {
        editingTaskId = null;
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
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        const duration = parseISOToEpochDay(task.end) - parseISOToEpochDay(task.start);
        applyChange(task, column.start, addDays(column.start, duration));
    }

    // ---------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // ---------------------------------------------------------------

    function focusActiveCell(): void {
        queueMicrotask(() => {
            rootEl?.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')?.focus({ preventScroll: true });
        });
    }

    function moveFocus(row: number, col: number): void {
        focusedRow = Math.min(Math.max(row, 0), rows.length - 1);
        focusedCol = Math.min(Math.max(col, 0), columns.length - 1);
        focusActiveCell();
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
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
</script>

<div bind:this={rootEl} class={`gantt-chart ${className}`.trim()} {...restProps}>
    <GanttTable {label} {caption} onkeydown={onGridKeydown}>
        <GanttTableThead>
            <GanttTableTr>
                <GanttTableTH scope="col"></GanttTableTH>
                {#each columns as column (column.start)}
                    {@const isToday = today != null && rangesOverlap(column.start, column.end, today, today)}
                    <GanttTableTH scope="col" data-today={isToday ? "" : undefined}>
                        {labels.columnLabel?.(column.start, column.end, timeUnit) ?? column.start}
                    </GanttTableTH>
                {/each}
            </GanttTableTr>
        </GanttTableThead>
        <GanttTableTbody>
            {#each rows as row, rowIndex (row.task.id)}
                {@const { start, end } = rangeFor(row.task, row.hasChildren)}
                {@const deps = predecessorLabels(row.task)}
                <GanttTableTr>
                    <GanttTableTH scope="row" style={`padding-inline-start: ${row.depth}em`}>
                        {#if row.hasChildren}
                            <button
                                type="button"
                                class="gantt-chart-collapse-button"
                                aria-expanded={!collapsed.has(row.task.id)}
                                aria-label={labels.collapseButton?.(row.task, collapsed.has(row.task.id)) ?? ""}
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
                    </GanttTableTH>
                    {#each columns as column, colIndex (column.start)}
                        {@const inRange = rangesOverlap(column.start, column.end, start, end)}
                        {@const isMilestone = inRange && start === end}
                        {@const isToday = today != null && rangesOverlap(column.start, column.end, today, today)}
                        {@const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start)}
                        <GanttTableTD
                            data-row={rowIndex}
                            data-col={colIndex}
                            active={focusedRow === rowIndex && focusedCol === colIndex}
                            data-in-range={inRange ? "" : undefined}
                            data-milestone={isMilestone ? "" : undefined}
                            data-today={isToday ? "" : undefined}
                            aria-describedby={deps.length > 0 && labels.dependencySummary ? dependencyId(row.task.id) : undefined}
                            ondragover={onCellDragOver}
                            ondrop={(e: DragEvent) => onCellDrop(column, e)}
                        >
                            {#if isLeadingCell}
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <span
                                    class="gantt-chart-bar"
                                    data-percent-complete={row.task.percentComplete ?? undefined}
                                    draggable={!row.hasChildren ? "true" : undefined}
                                    ondragstart={(e: DragEvent) => onBarDragStart(row.task, e)}
                                ></span>
                            {/if}
                        </GanttTableTD>
                    {/each}
                </GanttTableTr>
                {#if editingTaskId === row.task.id && labels.dateTimePickerLabels}
                    <tr class="gantt-chart-edit-row">
                        <td colspan={columns.length + 1}>
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
                            <button type="button" class="gantt-chart-save-button" onclick={() => saveEdit(row.task)}>
                                {labels.saveLabel ?? ""}
                            </button>
                            <button type="button" class="gantt-chart-cancel-button" onclick={cancelEdit}>
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
