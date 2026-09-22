/**
 * `<gantt-chart>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A headless interactive Gantt chart: task bars as column-spanning grid
 * cells (never pixel-positioned floating divs), keyboard-accessible
 * date/duration editing composed from `<date-time-picker>` (never
 * arrow-key drag as the only path — WCAG 2.5.7), row hierarchy,
 * milestones, percent-complete, a today marker, and dependency data
 * exposed as text via `aria-describedby`.
 *
 * The table structure (`gantt-table`/`gantt-table-th`/`gantt-table-td`/…)
 * is this catalog's markup CONTRACT, documented in
 * `@lilydesignsystem/html-headless`'s `components/gantt-table*.html`
 * reference files — those are static templates, not JS classes, so this
 * element builds the class names/attributes they document by hand,
 * exclusively via `document.createElement`/`appendChild` (never
 * `innerHTML`/template strings: a `thead`/`tbody`/`tr`/`th`/`td` start
 * tag is silently dropped by the HTML parser whenever it isn't already
 * inside a real `<table>`'s own insertion mode, for `innerHTML` exactly
 * as for literal light-DOM children).
 *
 * Composes `@lilydesignsystem/html-date-time-picker` twice per edit
 * session (start date, end date) — the sibling-helper composition
 * pattern established by `@lilydesignsystem/html-picker-bar`.
 */
import "@lilydesignsystem/html-date-time-picker";
import type {
    DateTimePicker,
    DateTimePickerLabels,
} from "@lilydesignsystem/html-date-time-picker";
import {
    addDays as dtpAddDays,
    daysInMonth,
    formatIsoDate,
    parseIsoDate,
    toEpochDay,
} from "@lilydesignsystem/html-date-time-picker";

const SVG_NS = "http://www.w3.org/2000/svg";

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
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback, matching every other helper's
 * label-gating convention.
 */
export type GanttLabels = {
    columnLabel?: (start: string, end: string, timeUnit: GanttTimeUnit) => string;
    editButton?: (task: GanttTask) => string;
    startLabel?: string;
    endLabel?: string;
    /** Reused for both composed date-time-picker instances. Editing is gated on this. */
    dateTimePickerLabels?: DateTimePickerLabels;
    saveLabel?: string;
    cancelLabel?: string;
    dependencySummary?: (predecessorLabels: string[]) => string;
    dateAnnouncement?: (taskLabel: string, start: string, end: string) => string;
    collapseButton?: (task: GanttTask, collapsed: boolean) => string;
};

/** Detail of the `taskchange` event, paired with the `onTaskChange` property. */
export type GanttChartTaskChangeDetail = {
    taskId: string;
    start: string;
    end: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type GanttChartProps = {
    label: string;
    caption?: string;
    range: { start: string; end: string };
    tasks: GanttTask[];
    timeUnit?: GanttTimeUnit;
    today?: string;
    taskLabel?: (task: GanttTask) => string;
    onTaskChange?: (taskId: string, start: string, end: string) => void;
    labels?: GanttLabels;
    class?: string;
};

// ---------------------------------------------------------------------
// Civil-date arithmetic. `addDays`/`daysInMonth`/`formatIsoDate`/
// `parseIsoDate` are REUSED from `@lilydesignsystem/html-date-time-picker`
// (itself UTC/epoch-day only, never local-midnight `Date` construction)
// rather than re-implemented — the same functions a consumer wiring
// `min`/`max` on that picker already reaches for. Only `compareISO` and
// `endOfMonth` have no equivalent export there and are added locally.
// ---------------------------------------------------------------------

/** Re-exported for consumers doing their own date maths against `range`/`tasks`. */
export const addDays = dtpAddDays;

/** -1 / 0 / 1, ordinary string comparison works for zero-padded ISO dates. */
export function compareISO(a: string, b: string): number {
    return a < b ? -1 : a > b ? 1 : 0;
}

/** The last day of the calendar month `iso` falls in, UTC-safe. */
export function endOfMonth(iso: string): string {
    const date = parseIsoDate(iso);
    if (!date) return iso;
    return formatIsoDate({ year: date.year, month: date.month, day: daysInMonth(date.year, date.month) });
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

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
    return compareISO(aStart, bEnd) <= 0 && compareISO(bStart, aEnd) <= 0;
}

export type GanttFlatRow = { task: GanttTask; depth: number; hasChildren: boolean };

/** Depth-first flatten of the parentId tree, skipping collapsed subtrees. */
export function flattenTasks(tasks: GanttTask[], collapsed: ReadonlySet<string>): GanttFlatRow[] {
    const childrenOf = new Map<string | undefined, GanttTask[]>();
    for (const task of tasks) {
        const key = task.parentId;
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

const defaultTaskLabel = (task: GanttTask): string => task.label;

/** Custom-element class implementing `<gantt-chart>`. */
export class GanttChart extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "caption", "time-unit", "today", "class"];
    }

    // Backing storage for property-only members (arrays/objects/functions
    // can't be attributes — matches date-time-picker's §4.3 precedent).
    #range: { start: string; end: string } = { start: "", end: "" };
    #tasks: GanttTask[] = [];
    #taskLabel: (task: GanttTask) => string = defaultTaskLabel;
    #onTaskChange: ((taskId: string, start: string, end: string) => void) | undefined;
    #labels: GanttLabels = {};

    #rootEl: HTMLDivElement | null = null;
    #statusEl: HTMLParagraphElement | null = null;
    #statusMessage = "";

    #collapsed = new Set<string>();

    // Roving-tabindex cursor (WAI-ARIA APG Grid pattern).
    #focusedRow = 0;
    #focusedCol = 0;
    #cellEls = new Map<string, HTMLTableCellElement>();
    #rowEls = new Map<string, HTMLTableRowElement>(); // taskId -> <tr>

    // Editing (at most one task at a time). Targeted insert/remove of a
    // single <tr>, not a structural rebuild, so the grid's own DOM
    // (including the roving-tabindex cursor's cell) is untouched by
    // opening or closing the edit region.
    #editingTaskId: string | null = null;
    #editRowEl: HTMLTableRowElement | null = null;
    #editStartPickerEl: DateTimePicker | null = null;
    #editEndPickerEl: DateTimePicker | null = null;

    #draggingTaskId: string | null = null;

    readonly #baseId = nextGanttChartId();

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get caption(): string {
        return this.getAttribute("caption") ?? "";
    }
    set caption(v: string) {
        if (v) this.setAttribute("caption", v);
        else this.removeAttribute("caption");
    }

    get timeUnit(): GanttTimeUnit {
        const v = this.getAttribute("time-unit");
        return v === "week" || v === "month" ? v : "day";
    }
    set timeUnit(v: GanttTimeUnit) {
        this.setAttribute("time-unit", v);
    }

    get today(): string {
        return this.getAttribute("today") ?? "";
    }
    set today(v: string) {
        if (v) this.setAttribute("today", v);
        else this.removeAttribute("today");
    }

    get range(): { start: string; end: string } {
        return { ...this.#range };
    }
    set range(v: { start: string; end: string }) {
        this.#range = v ? { start: v.start, end: v.end } : { start: "", end: "" };
        this.#render();
    }

    get tasks(): GanttTask[] {
        return [...this.#tasks];
    }
    set tasks(v: GanttTask[]) {
        this.#tasks = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get taskLabel(): (task: GanttTask) => string {
        return this.#taskLabel;
    }
    set taskLabel(fn: ((task: GanttTask) => string) | undefined) {
        this.#taskLabel = fn ?? defaultTaskLabel;
        this.#render();
    }

    get onTaskChange(): ((taskId: string, start: string, end: string) => void) | undefined {
        return this.#onTaskChange;
    }
    set onTaskChange(fn: ((taskId: string, start: string, end: string) => void) | undefined) {
        this.#onTaskChange = fn;
    }

    get labels(): GanttLabels {
        return { ...this.#labels };
    }
    set labels(v: GanttLabels | undefined) {
        this.#labels = v && typeof v === "object" ? { ...v } : {};
        this.#render();
    }

    /** Is a task's edit region currently open? Read-only. */
    get editing(): boolean {
        return this.#editingTaskId !== null;
    }

    // ---- Public, overridable rendering hooks ----

    /** Default collapse-button glyph: a chevron, `aria-hidden`. */
    renderCollapseIcon(collapsed: boolean): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "gantt-chart-collapse-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "0.85rem");
        svg.setAttribute("height", "0.85rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", collapsed ? "M5 2l6 6-6 6" : "M2 5l6 6 6-6");
        svg.appendChild(path);
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
    }

    attributeChangedCallback(name: string): void {
        switch (name) {
            case "label":
            case "caption":
            case "time-unit":
            case "today":
            case "class":
                this.#render();
                break;
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        // Nothing owns process-level listeners here; the composed
        // date-time-picker elements clean up their own on disconnect.
    }

    // ---- Derived data ----

    #columns(): GanttColumn[] {
        return generateColumns(this.#range, this.timeUnit);
    }

    #rows(): GanttFlatRow[] {
        return flattenTasks(this.#tasks, this.#collapsed);
    }

    #rangeFor(task: GanttTask, hasChildren: boolean): { start: string; end: string } {
        return hasChildren ? effectiveRange(task, this.#tasks) : { start: task.start, end: task.end };
    }

    #predecessorLabels(task: GanttTask): string[] {
        if (!task.dependsOn?.length) return [];
        return task.dependsOn.map((id) => {
            const predecessor = this.#tasks.find((t) => t.id === id);
            return predecessor ? this.#taskLabel(predecessor) : id;
        });
    }

    #dependencyId(taskId: string): string {
        return `${this.#baseId}-deps-${taskId}`;
    }

    #announce(message: string | undefined): void {
        if (!message) return;
        this.#statusMessage = message;
        if (this.#statusEl) this.#statusEl.textContent = message;
    }

    // ---- Hierarchy ----

    #toggleCollapse(taskId: string): void {
        if (this.#collapsed.has(taskId)) this.#collapsed.delete(taskId);
        else this.#collapsed.add(taskId);
        // Collapsing/expanding changes which rows exist, which renumbers
        // every subsequent row's `data-row` index — a structural change,
        // handled the same way a structural attribute change closes
        // date-time-picker's own dialog.
        this.#render();
    }

    // ---- Edit — keyboard (composed date-time-picker) and pointer (native DnD) ----

    #applyChange(task: GanttTask, start: string, end: string): void {
        this.#onTaskChange?.(task.id, start, end);
        this.dispatchEvent(
            new CustomEvent<GanttChartTaskChangeDetail>("taskchange", {
                detail: { taskId: task.id, start, end },
                bubbles: true,
                composed: true,
            }),
        );
        this.#announce(this.#labels.dateAnnouncement?.(this.#taskLabel(task), start, end));
    }

    #openEdit(task: GanttTask): void {
        const dateTimePickerLabels = this.#labels.dateTimePickerLabels;
        if (!dateTimePickerLabels) return;
        if (this.#editingTaskId && this.#editingTaskId !== task.id) this.#closeEdit();

        this.#editingTaskId = task.id;
        const row = this.#rowEls.get(task.id);
        if (!row) return;

        const columns = this.#columns();
        const tr = document.createElement("tr");
        tr.className = "gantt-chart-edit-row";
        const td = document.createElement("td");
        td.colSpan = columns.length + 1;

        const startPicker = document.createElement("date-time-picker") as DateTimePicker;
        startPicker.className = "gantt-chart-start-picker";
        startPicker.label = this.#labels.startLabel ?? "";
        startPicker.mode = "date";
        startPicker.labels = dateTimePickerLabels;
        startPicker.value = task.start;
        td.appendChild(startPicker);

        const endPicker = document.createElement("date-time-picker") as DateTimePicker;
        endPicker.className = "gantt-chart-end-picker";
        endPicker.label = this.#labels.endLabel ?? "";
        endPicker.mode = "date";
        endPicker.labels = dateTimePickerLabels;
        endPicker.value = task.end;
        td.appendChild(endPicker);

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.className = "gantt-chart-save-button";
        saveButton.textContent = this.#labels.saveLabel ?? "";
        saveButton.addEventListener("click", () => this.#saveEdit(task));
        td.appendChild(saveButton);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "gantt-chart-cancel-button";
        cancelButton.textContent = this.#labels.cancelLabel ?? "";
        cancelButton.addEventListener("click", () => this.#cancelEdit());
        td.appendChild(cancelButton);

        tr.appendChild(td);
        row.insertAdjacentElement("afterend", tr);

        this.#editRowEl = tr;
        this.#editStartPickerEl = startPicker;
        this.#editEndPickerEl = endPicker;
    }

    #closeEdit(): void {
        this.#editRowEl?.remove();
        this.#editRowEl = null;
        this.#editStartPickerEl = null;
        this.#editEndPickerEl = null;
        this.#editingTaskId = null;
    }

    #saveEdit(task: GanttTask): void {
        const start = this.#editStartPickerEl?.value || task.start;
        const end = this.#editEndPickerEl?.value || task.end;
        this.#applyChange(task, start, end);
        this.#closeEdit();
    }

    #cancelEdit(): void {
        this.#closeEdit();
    }

    #onBarDragStart(task: GanttTask, event: DragEvent): void {
        this.#draggingTaskId = task.id;
        event.dataTransfer?.setData("text/plain", task.id);
    }

    #onCellDragOver(event: DragEvent): void {
        if (this.#draggingTaskId) event.preventDefault();
    }

    #onCellDrop(column: GanttColumn, event: DragEvent): void {
        event.preventDefault();
        const taskId = this.#draggingTaskId ?? event.dataTransfer?.getData("text/plain");
        this.#draggingTaskId = null;
        const task = this.#tasks.find((t) => t.id === taskId);
        if (!task) return;
        const startDate = parseIsoDate(task.start);
        const endDate = parseIsoDate(task.end);
        const duration = startDate && endDate ? toEpochDay(endDate) - toEpochDay(startDate) : 0;
        this.#applyChange(task, column.start, addDays(column.start, duration));
    }

    // ---- Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern) ----

    #setActiveCell(row: number, col: number): HTMLTableCellElement | undefined {
        const oldCell = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
        oldCell?.setAttribute("tabindex", "-1");
        oldCell?.setAttribute("aria-selected", "false");

        this.#focusedRow = row;
        this.#focusedCol = col;

        const newCell = this.#cellEls.get(`${row}-${col}`);
        newCell?.setAttribute("tabindex", "0");
        newCell?.setAttribute("aria-selected", "true");
        return newCell;
    }

    #moveFocus(row: number, col: number, rowCount: number, colCount: number): void {
        const clampedCol = Math.min(Math.max(col, 0), Math.max(colCount - 1, 0));
        const clampedRow = Math.min(Math.max(row, 0), Math.max(rowCount - 1, 0));
        const cell = this.#setActiveCell(clampedRow, clampedCol);
        cell?.focus({ preventScroll: true });
    }

    #onGridKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const rows = this.#rows();
        const colCount = this.#columns().length;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow - 1, this.#focusedCol, rows.length, colCount);
                break;
            case "ArrowDown":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow + 1, this.#focusedCol, rows.length, colCount);
                break;
            case "ArrowLeft":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow, this.#focusedCol - 1, rows.length, colCount);
                break;
            case "ArrowRight":
                event.preventDefault();
                this.#moveFocus(this.#focusedRow, this.#focusedCol + 1, rows.length, colCount);
                break;
            case "Home":
                event.preventDefault();
                if (ctrlOrMeta) this.#moveFocus(0, 0, rows.length, colCount);
                else this.#moveFocus(this.#focusedRow, 0, rows.length, colCount);
                break;
            case "End":
                event.preventDefault();
                if (ctrlOrMeta) this.#moveFocus(rows.length - 1, colCount - 1, rows.length, colCount);
                else this.#moveFocus(this.#focusedRow, colCount - 1, rows.length, colCount);
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const row = rows[this.#focusedRow];
                if (row && !row.hasChildren) this.#openEdit(row.task);
                break;
            }
            default:
                break;
        }
    }

    // ---- Rendering ----

    #render(): void {
        if (!this.isConnected) return;

        this.#closeEdit();
        this.#cellEls = new Map();
        this.#rowEls = new Map();

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `gantt-chart ${extraClass}`.trim();

        const table = document.createElement("table");
        table.className = "gantt-table";
        table.setAttribute("role", "grid");
        table.setAttribute("aria-label", this.label);
        table.addEventListener("keydown", (event) => this.#onGridKeydown(event as KeyboardEvent));

        if (this.caption) {
            const caption = document.createElement("caption");
            caption.textContent = this.caption;
            table.appendChild(caption);
        }

        const columns = this.#columns();
        const rows = this.#rows();
        const timeUnit = this.timeUnit;
        const todayIso = this.today || null;

        this.#focusedCol = Math.min(Math.max(this.#focusedCol, 0), Math.max(columns.length - 1, 0));
        this.#focusedRow = Math.min(Math.max(this.#focusedRow, 0), Math.max(rows.length - 1, 0));

        // ---- thead ----
        const thead = document.createElement("thead");
        thead.className = "gantt-table-thead";
        const headRow = document.createElement("tr");
        headRow.className = "gantt-table-tr";

        const leadingTh = document.createElement("th");
        leadingTh.className = "gantt-table-th";
        leadingTh.setAttribute("scope", "col");
        headRow.appendChild(leadingTh);

        for (const column of columns) {
            const isToday = todayIso != null && rangesOverlap(column.start, column.end, todayIso, todayIso);
            const th = document.createElement("th");
            th.className = "gantt-table-th";
            th.setAttribute("scope", "col");
            if (isToday) th.setAttribute("data-today", "");
            th.textContent = this.#labels.columnLabel?.(column.start, column.end, timeUnit) ?? column.start;
            headRow.appendChild(th);
        }
        thead.appendChild(headRow);
        table.appendChild(thead);

        // ---- tbody ----
        const tbody = document.createElement("tbody");
        tbody.className = "gantt-table-tbody";

        rows.forEach((row, rowIndex) => {
            const { task } = row;
            const { start, end } = this.#rangeFor(task, row.hasChildren);
            const deps = this.#predecessorLabels(task);
            const hasDependencySummary = deps.length > 0 && !!this.#labels.dependencySummary;

            const tr = document.createElement("tr");
            tr.className = "gantt-table-tr";

            const rowTh = document.createElement("th");
            rowTh.className = "gantt-table-th";
            rowTh.setAttribute("scope", "row");
            rowTh.style.paddingInlineStart = `${row.depth}em`;

            if (row.hasChildren) {
                const collapsed = this.#collapsed.has(task.id);
                const collapseButton = document.createElement("button");
                collapseButton.type = "button";
                collapseButton.className = "gantt-chart-collapse-button";
                collapseButton.setAttribute("aria-expanded", String(!collapsed));
                collapseButton.setAttribute("aria-label", this.#labels.collapseButton?.(task, collapsed) ?? "");
                collapseButton.appendChild(this.renderCollapseIcon(collapsed));
                collapseButton.addEventListener("click", () => this.#toggleCollapse(task.id));
                rowTh.appendChild(collapseButton);
            }

            rowTh.appendChild(document.createTextNode(this.#taskLabel(task)));

            if (hasDependencySummary) {
                const summary = document.createElement("span");
                summary.id = this.#dependencyId(task.id);
                summary.className = "gantt-chart-dependency-summary";
                summary.hidden = true;
                summary.textContent = this.#labels.dependencySummary!(deps);
                rowTh.appendChild(summary);
            }

            tr.appendChild(rowTh);

            columns.forEach((column, colIndex) => {
                const inRange = rangesOverlap(column.start, column.end, start, end);
                const isMilestone = inRange && start === end;
                const isToday = todayIso != null && rangesOverlap(column.start, column.end, todayIso, todayIso);
                const isLeadingCell = inRange && rangesOverlap(column.start, column.end, start, start);

                const td = document.createElement("td");
                td.className = "gantt-table-td";
                td.setAttribute("data-row", String(rowIndex));
                td.setAttribute("data-col", String(colIndex));
                const active = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
                td.setAttribute("tabindex", active ? "0" : "-1");
                td.setAttribute("aria-selected", String(active));
                td.setAttribute(
                    "aria-label",
                    this.#labels.columnLabel?.(column.start, column.end, timeUnit) ?? column.start,
                );
                if (inRange) td.setAttribute("data-in-range", "");
                if (isMilestone) td.setAttribute("data-milestone", "");
                if (isToday) td.setAttribute("data-today", "");
                if (hasDependencySummary) td.setAttribute("aria-describedby", this.#dependencyId(task.id));

                td.addEventListener("dragover", (event) => this.#onCellDragOver(event as DragEvent));
                td.addEventListener("drop", (event) => this.#onCellDrop(column, event as DragEvent));

                if (isLeadingCell) {
                    const bar = document.createElement("span");
                    bar.className = "gantt-chart-bar";
                    if (task.percentComplete != null) {
                        bar.setAttribute("data-percent-complete", String(task.percentComplete));
                    }
                    if (!row.hasChildren) {
                        bar.setAttribute("draggable", "true");
                        bar.addEventListener("dragstart", (event) => this.#onBarDragStart(task, event as DragEvent));
                    }
                    td.appendChild(bar);
                }

                tr.appendChild(td);
                this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
            });

            tbody.appendChild(tr);
            this.#rowEls.set(task.id, tr);
        });

        table.appendChild(tbody);
        root.appendChild(table);

        const status = document.createElement("p");
        status.className = "gantt-chart-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = this.#statusMessage;
        root.appendChild(status);

        this.replaceChildren(root);
        this.#rootEl = root;
        this.#statusEl = status;
    }
}
