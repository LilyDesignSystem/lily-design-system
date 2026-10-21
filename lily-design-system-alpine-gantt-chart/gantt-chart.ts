/**
 * GanttChart for Alpine.js: the state and behaviour behind `snippet.html`. Headless: no CSS, no text, no icons; every string is
 * a `labels.*` value and a label's absence removes the control it names. Task bars are column-spanning grid cells carrying data
 * attributes (`data-in-range`, `data-bar-start`, `data-bar-end`, `data-milestone`, `data-percent-complete`), never
 * pixel-positioned boxes: the consumer's CSS draws the bar.
 *
 * What it does: one day column per day of `range`, a row per task with parent / child hierarchy and collapse, parents' dates
 * derived from their descendants, weekend and today marks, dependencies described in text (`aria-describedby`), the optional
 * critical path (shared `critical-path`), and the WAI-ARIA APG grid keys with a roving tabindex. What it does not do yet: week
 * and month scales, dragging or editing task dates, dependency arrows, `unavailable` days, export (see spec/index.md).
 */
import { gridMove } from "./grid-navigation.js";
import { isRtl } from "./direction.js";
import { applyCriticalPath } from "./critical-path.js";
import type { CriticalPathOptions } from "./critical-path.js";

export type GanttDependency = string | { id: string; type?: "e2s" | "s2s" | "s2e" | "e2e"; lag?: number };

export type GanttTask = {
    id: string;
    label: string;
    /** ISO `YYYY-MM-DD`, inclusive. `start === end` is a milestone. A parent's dates are derived from its children. */
    start?: string;
    end?: string;
    percentComplete?: number;
    parentId?: string;
    dependsOn?: GanttDependency[];
    critical?: boolean;
    slack?: number;
};

export type GanttLabels = {
    grid?: string;
    caption?: string;
    /** Text of a day column header. */
    columnLabel?: (date: string) => string;
    /** The label-column header. */
    taskColumn?: string;
    collapseButton?: (task: GanttTask, collapsed: boolean) => string;
    dependencySummary?: (predecessors: string[]) => string;
    criticalLabel?: string;
    milestoneLabel?: string;
};

export type GanttOptions = {
    range: { start: string; end: string };
    tasks: GanttTask[];
    /** The current date, marked `data-today`. Never read from the clock. */
    today?: string;
    /** Weekdays to mark `data-weekend` (0 Sunday … 6 Saturday); never defaulted. */
    weekends?: number[];
    /** Compute `critical` and `slack` with the shared critical-path helper. Pass options for working-day lag. */
    criticalPath?: boolean | CriticalPathOptions;
    collapsed?: string[];
    labels?: GanttLabels;
    taskLabel?: (task: GanttTask) => string;
};

export type GanttRow = {
    task: GanttTask;
    depth: number;
    isParent: boolean;
    collapsed: boolean;
    start: string;
    end: string;
    /** Labels of the tasks this one depends on. */
    predecessors: string[];
};

type Position = { row: number; col: number };

const MS = 86_400_000;
const parse = (iso: string): number => Date.parse(iso + "T00:00:00Z");
const format = (ms: number): string => new Date(ms).toISOString().slice(0, 10);
const addDays = (iso: string, n: number): string => format(parse(iso) + n * MS);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const define = <T extends object>(object: T & ThisType<any>): T => object;

export function createGanttChart(options: GanttOptions) {
    const scheduled = (): GanttTask[] =>
        options.criticalPath
            ? applyCriticalPath(options.tasks, options.criticalPath === true ? {} : options.criticalPath)
            : options.tasks;
    return define({
        tasks: scheduled(),
        labels: options.labels ?? ({} as GanttLabels),
        today: options.today ?? "",
        collapsed: [...(options.collapsed ?? [])] as string[],
        active: { row: -1, col: 0 } as Position,
        status: "",

        // ---- time -------------------------------------------------------------------------------------------------
        get days(): string[] {
            const out: string[] = [];
            for (let d = options.range.start; d <= options.range.end; d = addDays(d, 1)) out.push(d);
            return out;
        },
        isWeekend(iso: string): boolean {
            return !!options.weekends?.includes(new Date(parse(iso)).getUTCDay());
        },

        // ---- rows -------------------------------------------------------------------------------------------------
        childrenOf(id: string): GanttTask[] {
            return this.tasks.filter((t: GanttTask) => t.parentId === id);
        },
        /** A task's dates: its own, or for a parent the earliest start and latest end of its descendants. */
        span(task: GanttTask): { start: string; end: string } | null {
            const kids = this.childrenOf(task.id);
            if (!kids.length) return task.start && task.end ? { start: task.start, end: task.end } : null;
            const spans = kids.map((k: GanttTask) => this.span(k)).filter(Boolean) as { start: string; end: string }[];
            if (!spans.length) return null;
            return { start: spans.map((s) => s.start).sort()[0], end: spans.map((s) => s.end).sort().reverse()[0] };
        },
        get hasHierarchy(): boolean {
            return this.tasks.some((t: GanttTask) => t.parentId !== undefined && this.tasks.some((p: GanttTask) => p.id === t.parentId));
        },
        /** The visible rows, depth first, skipping everything under a collapsed parent. */
        get rows(): GanttRow[] {
            const known = new Set(this.tasks.map((t: GanttTask) => t.id));
            const out: GanttRow[] = [];
            const walk = (task: GanttTask, depth: number) => {
                const isParent = this.childrenOf(task.id).length > 0;
                const span = this.span(task);
                out.push({
                    task,
                    depth,
                    isParent,
                    collapsed: this.collapsed.includes(task.id),
                    start: span?.start ?? "",
                    end: span?.end ?? "",
                    predecessors: (task.dependsOn ?? []).map((d: GanttDependency) => {
                        const id = typeof d === "string" ? d : d.id;
                        const found = this.tasks.find((t: GanttTask) => t.id === id);
                        return found ? this.label(found) : id;
                    }),
                });
                if (isParent && !this.collapsed.includes(task.id)) this.childrenOf(task.id).forEach((c: GanttTask) => walk(c, depth + 1));
            };
            this.tasks.filter((t: GanttTask) => !t.parentId || !known.has(t.parentId)).forEach((t: GanttTask) => walk(t, 1));
            return out;
        },
        label(task: GanttTask): string {
            return options.taskLabel ? options.taskLabel(task) : (task?.label ?? "");
        },
        toggleCollapse(id: string): void {
            this.collapsed = this.collapsed.includes(id) ? this.collapsed.filter((c: string) => c !== id) : [...this.collapsed, id];
            this.active = { row: Math.min(this.active.row, this.rows.length - 1), col: this.active.col };
        },
        collapseLabel(row: GanttRow): string {
            return this.labels.collapseButton?.(row.task, row.collapsed) ?? "";
        },
        dependencyText(row: GanttRow): string {
            return row.predecessors.length ? (this.labels.dependencySummary?.(row.predecessors) ?? "") : "";
        },
        dependencyId(row: GanttRow): string {
            return `gantt-dependencies-${row.task.id}`;
        },

        // ---- cells ------------------------------------------------------------------------------------------------
        inRange(row: GanttRow, iso: string): boolean {
            return !!row.start && iso >= row.start && iso <= row.end;
        },
        isMilestone(row: GanttRow): boolean {
            return !row.isParent && !!row.start && row.start === row.end;
        },

        // ---- keyboard ---------------------------------------------------------------------------------------------
        tabindex(row: number, col: number): string {
            return this.active.row === row && this.active.col === col ? "0" : "-1";
        },
        onFocusCell(row: number, col: number): void {
            this.active = { row, col };
        },
        focusCell(): void {
            const cell = this.$root?.querySelector(`[data-row="${this.active.row}"][data-col="${this.active.col}"]`) as HTMLElement | null;
            cell?.focus();
        },
        onKeydown(event: KeyboardEvent): void {
            const at = this.active as Position;
            const move = gridMove(event, at, {
                firstRow: -1,
                lastRow: this.rows.length - 1,
                lastCol: this.days.length,
                pageStep: 10,
                rtl: isRtl(this.$root),
            });
            if (move) {
                event.preventDefault();
                this.active = move;
                this.focusCell();
                return;
            }
            if ((event.key !== "Enter" && event.key !== " ") || at.row < 0) return;
            const row = this.rows[at.row] as GanttRow | undefined;
            if (!row) return;
            event.preventDefault();
            if (at.col === 0 && row.isParent) this.toggleCollapse(row.task.id);
            else this.$dispatch?.("lily:activate", { taskId: row.task.id, date: at.col > 0 ? this.days[at.col - 1] : null });
        },
    });
}

/** The Alpine plugin: registers `Alpine.data("lilyGanttChart", options => …)`. */
export default function lilyGanttChart(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyGanttChart", ((options: GanttOptions) => createGanttChart(options)) as (...args: never[]) => object);
}
