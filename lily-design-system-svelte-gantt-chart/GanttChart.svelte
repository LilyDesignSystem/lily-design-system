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
    import { downloadBlob, exportBlob, exportFilename, type ExportFormat } from "./export-data";
    import { civilDateToDate } from "./cell-types";
    import { highlightSegments, matchesSearch } from "./search-text";
    import { dependencyPath, weekdayOfEpochDay, type ArrowBox, type DependencyKind } from "./dependency-arrows";
    import {
        draftOf as fieldDraft,
        evaluateEdit,
        exportFieldCell,
        exportableFields,
        fieldText as fieldTextOf,
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
        /** Class hook only: becomes `data-task-type` on the row and its cells (e.g. "design", "review"). */
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
        /** Label of the progress field in the edit region (0–100). Gates the field. */
        percentLabel?: string;
        /** Text for one typed dependency: (predecessor label, type, lag in days). Untyped dependencies use the label. */
        dependencyDetail?: (predecessorLabel: string, type: string, lag: number) => string;
        /** Text for a task with a baseline: (task label, baseline, days the end has slipped; negative = early). */
        baselineSummary?: (taskLabel: string, baseline: { start: string; end: string }, varianceDays: number) => string;
        collapseButton?: (task: GanttTask, collapsed: boolean) => string;
        /** Accessible name for the button that expands every parent task. Gates the button. */
        expandAll?: string;
        /** Accessible name for the button that collapses every parent task. Gates the button. */
        collapseAll?: string;
        /** Accessible name for the zoom-in button (finer columns). Gates the button. */
        zoomIn?: string;
        /** Accessible name for the zoom-out button (coarser columns). Gates the button. */
        zoomOut?: string;
        /** Announced after a zoom step with the new unit. */
        zoomAnnouncement?: (timeUnit: GanttTimeUnit) => string;
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
        /** Accessible name of the search field. Gates the field. */
        search?: string;
        /** Announced after the search changes: (matching tasks, all tasks). */
        searchAnnouncement?: (matchCount: number, totalCount: number) => string;
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
        /** Column granularity. Bindable: the zoom buttons (shown when `labels.zoomIn` / `labels.zoomOut` name them) step it month ↔ week ↔ day. */
        timeUnit?: GanttTimeUnit;
        /** The selected task's id. Bindable. A click on a task's row or the `s` key on it selects (a second one deselects); the row gets `aria-selected` and `data-selected`. Parent rows can be selected too. */
        selectedTaskId?: string;
        /** Extra attributes on each task's row (for example `data-team`); merged after Lily's own. */
        taskAttrs?: (task: GanttTask) => Record<string, unknown>;
        /** Ids of collapsed parent tasks. Two-way bindable; the collapse buttons, `labels.expandAll` and `labels.collapseAll` change it. */
        collapsedTaskIds?: string[];
        /** Called with the task id when selection changes, or `undefined` when it clears. */
        onTaskSelect?: (taskId: string | undefined) => void;
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
        /** Weekdays to shade (0 = Sunday … 6 = Saturday), for example `[0, 6]` or `[5, 6]`. Never defaulted: the weekend is the consumer's locale. Marks day columns `data-weekend` on the header and every cell; week and month columns are not marked. Shading itself is CSS. */
        weekends?: number[];
        /** Draw an arrow from each predecessor's bar to its dependent task's, by the dependency's type (`e2s`, `s2s`, `s2e`, `e2e`). An `aria-hidden` SVG overlay: the dependencies stay available as text through `labels.dependencySummary`, so the arrows add to, never replace, the accessible description. Arrows are drawn only between rows that are rendered (a collapsed parent's children and a virtualized chart's off-screen rows have none). */
        dependencyArrows?: boolean;
        /** Search, bindable: shows only the tasks whose text contains every word of it (any order, ignoring case and diacritics), plus their ancestors so the hierarchy stays readable; matches are wrapped in `<mark class="gantt-chart-match">`. While searching, collapsed parents show the matches under them. Escape in the field clears it. Needs `labels.search` for the field; the prop works without. */
        search?: string;
        /** Hides tasks for which it returns false (a status, owner or date filter). Combines with `search`; like a search match, a passing task keeps its ancestors. */
        filter?: (task: GanttTask) => boolean;
        /** Orders tasks among their siblings (stable; the hierarchy itself is kept: a child stays under its parent). Without it tasks keep the order of `tasks`. Use it for "by start date", "by owner" and the like. */
        compare?: (a: GanttTask, b: GanttTask) => number;
        /** The text `search` looks in. Defaults to the task's label and every field's text. */
        searchText?: (task: GanttTask) => string;
        /** Suppress editing, drag and the edit region; navigation and collapse still work. */
        readonly?: boolean;
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

<script lang="ts">
    import { tick } from "svelte";

    let {
        class: className = "",
        label,
        caption,
        range,
        tasks,
        timeUnit = $bindable("day"),
        collapsedTaskIds = $bindable([]),
        today,
        markers = [],
        isNonWorking = undefined,
        weekends = undefined,
        search = $bindable(""),
        searchText = undefined,
        filter = undefined,
        compare = undefined,
        dependencyArrows = false,
        readonly = false,
        taskLabel = (task: GanttTask) => task.label,
        onTaskChange,
        selectedTaskId = $bindable(undefined),
        taskAttrs = undefined,
        onTaskSelect = undefined,
        labels = {},
        fields = undefined,
        locale = undefined,
        onFieldEdit = undefined,
        exportFilename: exportBase = "gantt-chart",
        exportScope = "all",
        onExport = undefined,
        virtualize = undefined,
        ...restProps
    }: Props = $props();

    const baseId = nextGanttChartId();
    const dependencyId = (taskId: string) => `${baseId}-deps-${taskId}`;

    let rootEl: HTMLDivElement | undefined = $state();
    let statusMessage = $state("");
    const collapsed = $derived(new Set(collapsedTaskIds));
    let focusedRow = $state(0);
    let focusedCol = $state(0);

    let editingTaskId = $state<string | null>(null);
    let editStart = $state("");
    let editEnd = $state("");
    let editPercent = $state("");

    let draggingTaskId: string | null = null;

    const columns = $derived(generateColumns(range, timeUnit));
    const searching = $derived(search.trim() !== "");
    const narrowing = $derived(searching || !!filter);
    const defaultSearchText = (task: GanttTask): string => [taskLabel(task), ...resolvedFields.map((f) => fieldText(f, task))].join(" ");
    /** The tasks the search matches, found once per query / task change. */
    const matchedIds = $derived(
        narrowing
            ? new Set(tasks.filter((t) => (!filter || filter(t)) && (!searching || matchesSearch((searchText ?? defaultSearchText)(t), search))).map((t) => t.id))
            : null,
    );
    /** Matches plus their ancestors, so a match is never shown without its context. */
    const shownIds = $derived.by(() => {
        if (!matchedIds) return null;
        const keep = new Set(matchedIds);
        for (const id of matchedIds) {
            const seen = new Set<string>([id]);
            for (let parent = taskById.get(id)?.parentId; parent != null && taskById.has(parent) && !seen.has(parent); parent = taskById.get(parent)?.parentId) {
                keep.add(parent);
                seen.add(parent);
            }
        }
        return keep;
    });
    // Searching ignores collapse (a match under a collapsed parent must be findable); clearing the search restores it.
    const orderedTasks = $derived(compare ? [...tasks].sort(compare) : tasks);
    const rows = $derived(shownIds ? flattenTasks(orderedTasks, new Set()).filter((r) => shownIds.has(r.task.id)) : flattenTasks(orderedTasks, collapsed));
    let searchAnnounced = $state(false);
    $effect(() => {
        const query = search;
        const matched = matchedIds;
        if (!searchAnnounced) {
            searchAnnounced = true;
            return;
        }
        if (matched) announce(labels.searchAnnouncement?.(matched.size, tasks.length));
        else if (query === "") announce(labels.searchAnnouncement?.(tasks.length, tasks.length));
    });
    const ranges = $derived(effectiveRanges(tasks));

    // The roving cursor, clamped to the cells that exist now: collapsing a parent
    // can remove the row it named, and the grid must never leave the tab order.
    const activeRow = $derived(Math.min(focusedRow, rows.length - 1));
    const activeCol = $derived(Math.min(focusedCol, columns.length - 1));

    /** Editing needs every label its controls show; an unnamed Save is worse than none. */
    const canEdit = $derived(
        !readonly && !!labels.dateTimePickerLabels && !!labels.startLabel && !!labels.endLabel && !!labels.saveLabel && !!labels.cancelLabel,
    );

    // Markers per column, found once per `markers` / `columns` change rather than once per cell per render.
    const markersByColumn = $derived(columns.map((column) => markers.filter((m) => rangesOverlap(column.start, column.end, m.date, m.date))));
    const markersAt = (colIndex: number): GanttMarker[] => markersByColumn[colIndex] ?? [];
    const todayColumns = $derived(columns.map((column) => today != null && rangesOverlap(column.start, column.end, today, today)));
    const taskById = $derived(new Map(tasks.map((t) => [t.id, t])));

    function columnNonWorking(column: GanttColumn): boolean {
        if (!isNonWorking) return false;
        for (let d = column.start; compareISO(d, column.end) <= 0; d = addDays(d, 1)) {
            if (!isNonWorking(d)) return false;
        }
        return true;
    }

    const nonWorking = $derived(columns.map(columnNonWorking));

    // Day columns that fall on a shaded weekday, found once per `weekends` / `columns` change.
    const weekendColumns = $derived(
        columns.map((column) => !!weekends?.length && column.start === column.end && weekends.includes(weekdayOfEpochDay(parseISOToEpochDay(column.start)))),
    );

    // ---------------------------------------------------------------
    // Dependency arrows (an aria-hidden overlay measured from the rendered cells)
    // ---------------------------------------------------------------

    type Arrow = { key: string; from: string; to: string; kind: string; d: string };
    let arrows = $state<Arrow[]>([]);
    let overlaySize = $state({ width: 0, height: 0 });
    const arrowHeadId = `${baseId}-arrowhead`;

    function measureArrows(): void {
        if (!dependencyArrows || !scrollEl) {
            if (arrows.length) arrows = [];
            return;
        }
        const host = scrollEl.getBoundingClientRect();
        const dx = scrollEl.scrollLeft - host.left;
        const dy = scrollEl.scrollTop - host.top;
        const boxes = new Map<string, ArrowBox>();
        for (const tr of scrollEl.querySelectorAll<HTMLElement>("tr[data-task-id]")) {
            const cells = tr.querySelectorAll<HTMLElement>("td[data-in-range]");
            if (!cells.length) continue;
            const first = cells[0].getBoundingClientRect();
            const last = cells[cells.length - 1].getBoundingClientRect();
            boxes.set(tr.dataset.taskId ?? "", { left: first.left + dx, right: last.right + dx, top: first.top + dy, bottom: first.bottom + dy });
        }
        const next: Arrow[] = [];
        for (const [id, to] of boxes) {
            for (const dep of taskById.get(id)?.dependsOn ?? []) {
                const predecessorId = typeof dep === "string" ? dep : dep.id;
                const from = boxes.get(predecessorId);
                if (!from) continue;
                const kind: DependencyKind = (typeof dep === "string" ? undefined : dep.type) ?? "e2s";
                next.push({ key: `${predecessorId}>${id}`, from: predecessorId, to: id, kind, d: dependencyPath(kind, from, to) });
            }
        }
        arrows = next;
        overlaySize = { width: scrollEl.scrollWidth, height: scrollEl.scrollHeight };
    }

    // Re-measure whenever what is drawn changes, and when the table's own size does (zoom, fonts, resize).
    $effect(() => {
        void [dependencyArrows, rows, columns, renderItems, resolvedFields, tasks];
        if (!dependencyArrows) {
            measureArrows();
            return;
        }
        void tick().then(measureArrows);
        const table = scrollEl?.querySelector("table");
        if (!table || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(() => measureArrows());
        observer.observe(table);
        return () => observer.disconnect();
    });

    function rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
        return hasChildren ? (ranges.get(task.id) ?? { start: "", end: "" }) : { start: task.start ?? "", end: task.end ?? "" };
    }

    const ZOOM_ORDER: GanttTimeUnit[] = ["month", "week", "day"];
    const zoomIndex = $derived(ZOOM_ORDER.indexOf(timeUnit));

    function zoom(delta: 1 | -1): void {
        const next = ZOOM_ORDER[zoomIndex + delta];
        if (!next) return;
        timeUnit = next;
        announce(labels.zoomAnnouncement?.(next));
    }

    function announce(message: string | undefined): void {
        if (message) statusMessage = message;
    }

    // ---------------------------------------------------------------
    // Typed fields, inline editing, export
    // ---------------------------------------------------------------

    // Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per task or keystroke.
    const resolvedFields = $derived(resolveFields(fields, locale));
    const isFieldEditable = (f: GanttField) => !!onFieldEdit && !readonly && isEditableField(f);
    const fieldText = (f: ResolvedField, task: GanttTask): string => fieldTextOf(f, task.values);

    /** The field being edited, if any: the draft is the editor's text. */
    let editingField = $state<{ taskId: string; fieldId: string; draft: Draft } | null>(null);
    let committing = false;

    async function startFieldEdit(task: GanttTask, f: ResolvedField): Promise<void> {
        if (!isFieldEditable(f)) return;
        editingTaskId = null;
        editingField = { taskId: task.id, fieldId: f.id, draft: fieldDraft(f, task.values) };
        await tick();
        const editor = rootEl?.querySelector<HTMLInputElement>(".gantt-chart-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
    function commitFieldEdit(): boolean {
        if (!editingField || committing) return true;
        const { taskId, fieldId, draft } = editingField;
        const task = taskById.get(taskId);
        const f = resolvedFields.find((x) => x.id === fieldId);
        if (!task || !f) {
            editingField = null;
            return true;
        }
        const outcome = evaluateEdit(f, task.values, draft);
        if (outcome.invalid) {
            announce(labels.editInvalid?.(taskLabel(task), f.header));
            return false;
        }
        committing = true;
        editingField = null;
        if (outcome.changed) {
            onFieldEdit?.({ taskId, fieldId, value: outcome.value, previous: outcome.previous });
            announce(labels.editAnnouncement?.(taskLabel(task), f.header, outcome.text));
        }
        committing = false;
        return true;
    }

    function cancelFieldEdit(): void {
        editingField = null;
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
        } else if (event.key === "Tab" && editingField) {
            // Tab commits and moves to the task's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const task = taskById.get(editingField.taskId);
            const next = neighbourField(resolvedFields.filter(isFieldEditable), editingField.fieldId, event.shiftKey);
            if (task && next) {
                event.preventDefault();
                if (commitFieldEdit()) void startFieldEdit(task, next);
            } else {
                commitFieldEdit();
            }
        }
    }

    const exportRows = $derived(exportScope === "visible" ? rows.map((r) => r.task) : flattenTasks(orderedTasks, new Set()).map((r) => r.task));
    const hasExportButtons = $derived(!!labels.exportHeaders && !!(labels.exportCsv || labels.exportTsv || labels.exportExcel));
    const exportFieldList = $derived(exportableFields(resolvedFields));

    /** A civil date as a real date for the spreadsheet; an unscheduled task's empty date as null. */
    const exportDate = (iso: string | undefined): Date | null => (iso ? civilDateToDate(iso) : null);

    function runExport(format: ExportFormat): void {
        const h = labels.exportHeaders;
        if (!h) return;
        const headers = [h.task, h.start, h.end];
        if (h.percentComplete) headers.push(h.percentComplete);
        if (h.parent) headers.push(h.parent);
        if (h.dependsOn) headers.push(h.dependsOn);
        if (h.baselineStart) headers.push(h.baselineStart);
        if (h.baselineEnd) headers.push(h.baselineEnd);
        for (const f of exportFieldList) headers.push(f.header);
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
            for (const f of exportFieldList) cells.push(exportFieldCell(f, task.values));
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

    let scrollTop = $state(0);
    let scrollEl: HTMLDivElement | undefined = $state();
    type RenderItem = { kind: "spacer"; height: number; key: string } | { kind: "row"; row: FlatRow; index: number; key: string };
    /** What renders: the rows in view plus the roving tab stop's row (so the grid never leaves the tab order), with spacers for the gaps. */
    const renderItems = $derived.by((): RenderItem[] => {
        if (!virtualize) return rows.map((row, index) => ({ kind: "row", row, index, key: row.task.id }));
        const overscan = virtualize.overscan ?? 3;
        const start = Math.max(0, Math.floor(scrollTop / virtualize.rowHeight) - overscan);
        const end = Math.min(rows.length, Math.ceil((scrollTop + virtualize.height) / virtualize.rowHeight) + overscan);
        const indices = new Set<number>();
        for (let i = start; i < end; i++) indices.add(i);
        if (activeRow >= 0 && activeRow < rows.length) indices.add(activeRow);
        const items: RenderItem[] = [];
        let previous = -1;
        for (const index of [...indices].sort((a, b) => a - b)) {
            if (index - previous > 1) items.push({ kind: "spacer", height: (index - previous - 1) * virtualize.rowHeight, key: `spacer:${previous}` });
            items.push({ kind: "row", row: rows[index], index, key: rows[index].task.id });
            previous = index;
        }
        if (rows.length - 1 - previous > 0) items.push({ kind: "spacer", height: (rows.length - 1 - previous) * virtualize.rowHeight, key: `spacer:${previous}` });
        return items;
    });

    /** Bring a row into the scroll area (a virtualized chart renders only what is in view). */
    function revealRow(rowIndex: number): void {
        if (!virtualize) return;
        const top = rowIndex * virtualize.rowHeight;
        if (top < scrollTop) scrollTop = top;
        else if (top + virtualize.rowHeight > scrollTop + virtualize.height) scrollTop = top + virtualize.rowHeight - virtualize.height;
        if (scrollEl) scrollEl.scrollTop = scrollTop;
    }

    // ---------------------------------------------------------------
    // Hierarchy
    // ---------------------------------------------------------------

    function toggleCollapse(taskId: string): void {
        collapsedTaskIds = collapsed.has(taskId) ? collapsedTaskIds.filter((id) => id !== taskId) : [...collapsedTaskIds, taskId];
    }

    /** Every task that has children (the ones a collapse button applies to). */
    const parentIds = $derived(Array.from(new Set(tasks.filter((t) => t.parentId != null).map((t) => t.parentId as string))).filter((id) => taskById.has(id)));

    function setAllCollapsed(value: boolean): void {
        collapsedTaskIds = value ? parentIds : [];
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

    function baselineVariance(task: GanttTask, currentEnd: string): number {
        if (!currentEnd) return 0;
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
        editStart = task.start ?? "";
        editEnd = task.end ?? "";
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
        const duration = parseISOToEpochDay(task.end) - parseISOToEpochDay(task.start);
        applyChange(task, target.start, addDays(target.start, duration));
    }

    function onCellDragOver(event: DragEvent): void {
        if (draggingTaskId) event.preventDefault();
    }

    function onCellDrop(column: GanttColumn, event: DragEvent): void {
        event.preventDefault();
        if (readonly) return;
        const taskId = draggingTaskId ?? event.dataTransfer?.getData("text/plain");
        draggingTaskId = null;
        const task = taskId ? taskById.get(taskId) : undefined;
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
    function selectTask(taskId: string): void {
        selectedTaskId = selectedTaskId === taskId ? undefined : taskId;
        onTaskSelect?.(selectedTaskId);
    }

    function onGridClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).closest("button, input, select, .gantt-chart-edit-row, .gantt-chart-field-editor")) return;
        const taskId = (event.target as HTMLElement).closest<HTMLElement>("[data-task-id]")?.dataset.taskId;
        if (taskId) selectTask(taskId);
    }

    function onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        focusedRow = Number(cell.dataset.row);
        focusedCol = Number(cell.dataset.col);
    }

    function moveFocus(row: number, col: number): void {
        focusedRow = Math.min(Math.max(row, 0), rows.length - 1);
        focusedCol = Math.min(Math.max(col, 0), columns.length - 1);
        revealRow(focusedRow);
        void focusActiveCell();
    }

    function onGridKeydown(event: KeyboardEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        if (event.key === "F2" && onFieldEdit) {
            // F2: edit the task's first editable field (the keyboard twin of clicking its value).
            const row = rows[activeRow];
            const first = resolvedFields.find(isFieldEditable);
            if (row && first) {
                event.preventDefault();
                void startFieldEdit(row.task, first);
            }
            return;
        }
        if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end (the keyboard twins of dragging the bar and its end handle).
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
                if (row && !row.hasChildren) void openEdit(row.task);
                break;
            }
        }
    }
</script>

<div bind:this={rootEl} class={`gantt-chart ${className}`.trim()} data-readonly={readonly ? "" : undefined} {...restProps}>
    {#if labels.search}
        <input
            type="search"
            class="gantt-chart-search"
            aria-label={labels.search}
            bind:value={search}
            onkeydown={(e) => {
                if (e.key === "Escape" && search !== "") {
                    e.preventDefault();
                    search = "";
                }
            }}
        />
    {/if}
    {#if parentIds.length > 0 && (labels.expandAll || labels.collapseAll)}
        <div class="gantt-chart-collapse-all" role="group" aria-label={label}>
            {#if labels.expandAll}
                <button type="button" class="gantt-chart-expand-all-button" disabled={collapsedTaskIds.length === 0} onclick={() => setAllCollapsed(false)}>{labels.expandAll}</button>
            {/if}
            {#if labels.collapseAll}
                <button type="button" class="gantt-chart-collapse-all-button" disabled={parentIds.every((id) => collapsed.has(id))} onclick={() => setAllCollapsed(true)}>{labels.collapseAll}</button>
            {/if}
        </div>
    {/if}
    {#if hasExportButtons}
        <div class="gantt-chart-export" role="group" aria-label={labels.export}>
            {#if labels.exportCsv}
                <button type="button" class="gantt-chart-export-button" data-gantt-export-format="csv" disabled={exportRows.length === 0} onclick={() => runExport("csv")}>{labels.exportCsv}</button>
            {/if}
            {#if labels.exportTsv}
                <button type="button" class="gantt-chart-export-button" data-gantt-export-format="tsv" disabled={exportRows.length === 0} onclick={() => runExport("tsv")}>{labels.exportTsv}</button>
            {/if}
            {#if labels.exportExcel}
                <button type="button" class="gantt-chart-export-button" data-gantt-export-format="xlsx" disabled={exportRows.length === 0} onclick={() => runExport("xlsx")}>{labels.exportExcel}</button>
            {/if}
        </div>
    {/if}
    {#if labels.zoomIn || labels.zoomOut}
        <div class="gantt-chart-zoom" role="group" aria-label={label}>
            {#if labels.zoomOut}
                <button type="button" class="gantt-chart-zoom-out-button" aria-label={labels.zoomOut} disabled={zoomIndex <= 0} onclick={() => zoom(-1)}>−</button>
            {/if}
            {#if labels.zoomIn}
                <button type="button" class="gantt-chart-zoom-in-button" aria-label={labels.zoomIn} disabled={zoomIndex >= ZOOM_ORDER.length - 1} onclick={() => zoom(1)}>+</button>
            {/if}
        </div>
    {/if}
    <!-- The scroll area is structural: a virtualized chart renders only the rows in view inside it. -->
    <div
        bind:this={scrollEl}
        class={virtualize ? "gantt-chart-scroll" : "gantt-chart-body"}
        style={[virtualize ? `height:${virtualize.height}px;overflow:auto` : "", dependencyArrows ? "position:relative" : ""].filter(Boolean).join(";") || undefined}
        onscroll={virtualize ? (e) => (scrollTop = (e.currentTarget as HTMLElement).scrollTop) : undefined}
    >
    <GanttTable {label} {caption} onkeydown={onGridKeydown} onfocusin={onGridFocusin} onclick={onGridClick} aria-rowcount={virtualize ? rows.length + 1 : undefined}>
        <GanttTableThead>
            <GanttTableTr>
                <GanttTableTH scope="col">{labels.taskColumnHeader ?? ""}</GanttTableTH>
                {#each resolvedFields as f (f.id)}
                    <GanttTableTH scope="col" data-field={f.id}>{f.header}</GanttTableTH>
                {/each}
                {#each columns as column, colIndex (column.start)}
                    {@const colMarkers = markersAt(colIndex)}
                    <GanttTableTH
                        scope="col"
                        data-today={todayColumns[colIndex] ? "" : undefined}
                        data-non-working={nonWorking[colIndex] ? "" : undefined}
                        data-weekend={weekendColumns[colIndex] ? "" : undefined}
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
            {#each renderItems as item (item.key)}
                {#if item.kind === "spacer"}
                    <tr class="gantt-chart-spacer" aria-hidden="true" style={`height:${item.height}px`}><td colspan={columns.length + 1 + resolvedFields.length}></td></tr>
                {:else}
                {@const row = item.row}
                {@const rowIndex = item.index}
                {@const { start, end } = rangeFor(row.task, row.hasChildren)}
                {@const deps = predecessorLabels(row.task)}
                <GanttTableTr
                    data-task-type={row.task.type}
                    data-critical={row.task.critical ? "" : undefined}
                    data-slack={row.task.slack}
                    aria-rowindex={virtualize ? rowIndex + 2 : undefined}
                    data-task-id={row.task.id}
                    data-unscheduled={!row.hasChildren && (!row.task.start || !row.task.end) ? "" : undefined}
                    aria-selected={selectedTaskId === row.task.id ? "true" : undefined}
                    data-selected={selectedTaskId === row.task.id ? "" : undefined}
                    {...(taskAttrs?.(row.task) ?? {})}
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
                        {#if searching}{#each highlightSegments(taskLabel(row.task), search) as part, i (i)}{#if part.match}<mark class="gantt-chart-match">{part.text}</mark>{:else}{part.text}{/if}{/each}{:else}{taskLabel(row.task)}{/if}
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
                    {#each resolvedFields as f (f.id)}
                        {@const text = fieldText(f, row.task)}
                        {@const editable = isFieldEditable(f)}
                        {@const nameId = `${baseId}-fn-${row.task.id}-${f.id}`}
                        {@const valueId = `${baseId}-fv-${row.task.id}-${f.id}`}
                        <GanttTableTD data-field={f.id} data-type={f.type ?? "text"} data-align={f.align}>
                            {#if editingField && editingField.taskId === row.task.id && editingField.fieldId === f.id}
                                {#if editorKind(f) === "select" || editorKind(f) === "radio"}
                                    <select class="gantt-chart-field-editor" aria-label={f.editLabel ?? f.header} bind:value={editingField.draft} onkeydown={onFieldEditorKeydown} onchange={() => { if (commitFieldEdit()) void focusActiveCell(); }} onblur={() => void commitFieldEdit()}>
                                        <option value=""></option>
                                        {#each (f.options ?? []) as option (option.id)}
                                            <option value={option.id} disabled={option.disabled}>{option.label}</option>
                                        {/each}
                                    </select>
                                {:else}
                                    <input
                                        class="gantt-chart-field-editor"
                                        aria-label={f.editLabel ?? f.header}
                                        type={editorKind(f) === "number" ? "number" : editorKind(f) === "date" ? "date" : editorKind(f) === "time" ? "time" : "text"}
                                        inputmode={editorKind(f) === "number" ? "decimal" : undefined}
                                        bind:value={editingField.draft}
                                        onkeydown={onFieldEditorKeydown}
                                        onblur={() => void commitFieldEdit()}
                                    />
                                {/if}
                            {:else if editable}
                                <span id={nameId} hidden>{f.header}</span>
                                <button type="button" class="gantt-chart-field-button" id={valueId} tabindex="-1" aria-labelledby={`${nameId} ${valueId}`} onclick={() => void startFieldEdit(row.task, f)}>{text}</button>
                            {:else}
                                {text}
                            {/if}
                        </GanttTableTD>
                    {/each}
                    {#each columns as column, colIndex (column.start)}
                        {@const inRange = !!start && !!end && rangesOverlap(column.start, column.end, start, end)}
                        {@const isMilestone = inRange && start === end}
                        {@const isToday = todayColumns[colIndex]}
                        {@const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start)}
                        <GanttTableTD
                            data-row={rowIndex}
                            data-col={colIndex}
                            active={activeRow === rowIndex && activeCol === colIndex}
                            data-in-range={inRange ? "" : undefined}
                            data-milestone={isMilestone ? "" : undefined}
                            data-today={isToday ? "" : undefined}
                            data-non-working={nonWorking[colIndex] ? "" : undefined}
                            data-weekend={weekendColumns[colIndex] ? "" : undefined}
                            data-marker={markersAt(colIndex).length ? "" : undefined}
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
                                >{#if !row.hasChildren && !readonly}<span
                                        class="gantt-chart-bar-handle gantt-chart-bar-handle-start"
                                        draggable="true"
                                        aria-hidden="true"
                                        ondragstart={(e: DragEvent) => onHandleDragStart(row.task, "start", e)}
                                    ></span>{/if}</span>
                            {/if}
                            {#if !row.hasChildren && !readonly && inRange && rangesOverlap(column.start, column.end, end, end)}
                                <span
                                    class="gantt-chart-bar-handle gantt-chart-bar-handle-end"
                                    draggable="true"
                                    aria-hidden="true"
                                    ondragstart={(e: DragEvent) => onHandleDragStart(row.task, "end", e)}
                                ></span>
                            {/if}
                        </GanttTableTD>
                    {/each}
                </GanttTableTr>
                {#if editingTaskId === row.task.id && canEdit && labels.dateTimePickerLabels}
                    <tr class="gantt-chart-edit-row">
                        <td colspan={columns.length + 1 + resolvedFields.length} onkeydown={onEditKeydown}>
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
                {/if}
            {/each}
        </GanttTableTbody>
    </GanttTable>
    {#if dependencyArrows && arrows.length}
        <svg
            class="gantt-chart-dependency-arrows"
            aria-hidden="true"
            focusable="false"
            width={overlaySize.width}
            height={overlaySize.height}
            style="position:absolute;left:0;top:0;pointer-events:none"
        >
            <defs>
                <marker id={arrowHeadId} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L6 3L0 6z" fill="currentColor" /></marker>
            </defs>
            {#each arrows as arrow (arrow.key)}
                <path class="gantt-chart-dependency-arrow" data-from={arrow.from} data-to={arrow.to} data-dependency-type={arrow.kind} d={arrow.d} fill="none" stroke="currentColor" stroke-width="1.5" marker-end={`url(#${arrowHeadId})`} />
            {/each}
        </svg>
    {/if}
    </div>

    <p class="gantt-chart-status" aria-live="polite">{statusMessage}</p>
</div>
