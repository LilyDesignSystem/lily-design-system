import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";

import GanttChart, { compareISO, effectiveRange, endOfMonth, flattenTasks, generateColumns } from "./GanttChart.vue";
import type { GanttLabels, GanttTask } from "./GanttChart.vue";
// `addDays` itself is not exported from GanttChart.vue (a plain
// `<script>`-block export there would duplicate `@lilydesignsystem/vue-
// date-time-picker`'s own implementation); the package's own `index.ts`
// re-exports it from that sibling package instead (see index.ts), so
// the test imports it from there too.
import { addDays } from "@lilydesignsystem/vue-date-time-picker";

const RANGE = { start: "2026-10-01", end: "2026-10-10" };

const TASKS: GanttTask[] = [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03" },
    { id: "build", label: "Build", start: "2026-10-04", end: "2026-10-06", dependsOn: ["design"], percentComplete: 40 },
    { id: "launch", label: "Launch", start: "2026-10-07", end: "2026-10-07" }, // milestone
    { id: "parent", label: "Phase 1", start: "2026-10-01", end: "2026-10-01" },
    { id: "child1", label: "Child A", start: "2026-10-08", end: "2026-10-08", parentId: "parent" },
    { id: "child2", label: "Child B", start: "2026-10-09", end: "2026-10-09", parentId: "parent" },
];

const DTP_LABELS = {
    previousYear: "Previous year",
    previousMonth: "Previous month",
    previousWeek: "Previous week",
    previousDay: "Previous day",
    nextDay: "Next day",
    nextWeek: "Next week",
    nextMonth: "Next month",
    nextYear: "Next year",
    confirm: "Confirm",
    cancel: "Cancel",
};

const LABELS: GanttLabels = {
    columnLabel: (start) => start,
    startLabel: "Start date",
    endLabel: "End date",
    dateTimePickerLabels: DTP_LABELS,
    saveLabel: "Save",
    cancelLabel: "Cancel",
    dependencySummary: (preds) => `Blocked by: ${preds.join(", ")}`,
    dateAnnouncement: (title, start, end) => `${title} moved to ${start} - ${end}`,
    collapseButton: (task, collapsed) => (collapsed ? `Expand ${task.label}` : `Collapse ${task.label}`),
};

/** Let Vue's scheduler and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}) {
    const wrapper = mount(GanttChart, {
        props: { label: "Q4 plan", range: RANGE, tasks: TASKS, ...props },
        attachTo: document.body,
    });
    wrappers.push(wrapper);
    return wrapper;
}

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
});

function tabbableCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.gantt-table-td[tabindex="0"]'));
}

function rows(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(".gantt-table-tbody > .gantt-table-tr"));
}

function buttonByName(name: string): HTMLElement | undefined {
    return Array.from(document.querySelectorAll<HTMLElement>("button")).find(
        (el) => el.textContent?.trim() === name || el.getAttribute("aria-label") === name,
    );
}

/** gantt-chart's own edit-region Save/Cancel button, never the composed DateTimePicker's own dialog footer buttons of the same text. */
function editRowButton(className: "gantt-chart-save-button" | "gantt-chart-cancel-button"): HTMLElement | undefined {
    return document.querySelector<HTMLElement>(`.gantt-chart-edit-row button.${className}`) ?? undefined;
}

// =====================================================================
// Pure helpers — civil-date arithmetic, column generation, hierarchy
// =====================================================================

describe("GanttChart — date arithmetic and column generation (§8.2)", () => {
    test("compareISO orders ISO date strings", () => {
        expect(compareISO("2026-10-01", "2026-10-02")).toBeLessThan(0);
        expect(compareISO("2026-10-02", "2026-10-01")).toBeGreaterThan(0);
        expect(compareISO("2026-10-01", "2026-10-01")).toBe(0);
    });

    test("addDays (reused from vue-date-time-picker) is UTC-safe across a month boundary", () => {
        expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
    });

    test("endOfMonth returns the last calendar day of the month", () => {
        expect(endOfMonth("2026-02-05")).toBe("2026-02-28"); // 2026 is not a leap year
        expect(endOfMonth("2026-10-15")).toBe("2026-10-31");
    });

    test("generateColumns produces one column per day across the range", () => {
        const columns = generateColumns(RANGE, "day", addDays);
        expect(columns).toHaveLength(10);
        expect(columns[0]).toEqual({ start: "2026-10-01", end: "2026-10-01" });
        expect(columns[9]).toEqual({ start: "2026-10-10", end: "2026-10-10" });
    });

    test("generateColumns produces 7-day columns for 'week', clamped to the range end", () => {
        const columns = generateColumns(RANGE, "week", addDays);
        expect(columns[0]).toEqual({ start: "2026-10-01", end: "2026-10-07" });
        expect(columns[1]).toEqual({ start: "2026-10-08", end: "2026-10-10" }); // clamped
    });

    test("generateColumns produces calendar-month columns for 'month'", () => {
        const columns = generateColumns({ start: "2026-10-15", end: "2026-11-15" }, "month", addDays);
        expect(columns[0]).toEqual({ start: "2026-10-15", end: "2026-10-31" });
        expect(columns[1]).toEqual({ start: "2026-11-01", end: "2026-11-15" });
    });
});

describe("GanttChart — hierarchy helpers (§8.5)", () => {
    test("flattenTasks orders rows depth-first and skips collapsed subtrees", () => {
        const flat = flattenTasks(TASKS, new Set());
        expect(flat.map((r) => r.task.id)).toEqual(["design", "build", "launch", "parent", "child1", "child2"]);
        expect(flat.find((r) => r.task.id === "parent")?.hasChildren).toBe(true);
        expect(flat.find((r) => r.task.id === "design")?.hasChildren).toBe(false);

        const collapsedFlat = flattenTasks(TASKS, new Set(["parent"]));
        expect(collapsedFlat.map((r) => r.task.id)).toEqual(["design", "build", "launch", "parent"]);
    });

    test("effectiveRange derives a parent's start/end from its descendants", () => {
        const range = effectiveRange(TASKS.find((t) => t.id === "parent")!, TASKS);
        expect(range).toEqual({ start: "2026-10-08", end: "2026-10-09" });
    });
});

// =====================================================================
// Component
// =====================================================================

describe("GanttChart — markup (§8.1, §8.2, §8.3, §8.4)", () => {
    test("§8.1 renders a gantt-chart root wrapping a role=grid labelled by `label`", () => {
        build();
        expect(document.querySelector(".gantt-chart")).toBeTruthy();
        expect(document.querySelector('[role="grid"]')?.getAttribute("aria-label")).toBe("Q4 plan");
    });

    test("§8.2 renders one column header per day across the range", () => {
        build({ labels: LABELS });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers).toHaveLength(11); // 10 day columns + 1 leading blank column
    });

    test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
        build();
        const designRow = rows()[0];
        const cells = designRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
        expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
        expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
    });

    test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
        build();
        const launchRow = rows()[2];
        const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
        const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
        expect(milestoneCells).toHaveLength(1);
        expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
    });

    test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
        build();
        const buildRow = rows()[1];
        const bar = buildRow.querySelector(".gantt-chart-bar");
        expect(bar?.getAttribute("data-percent-complete")).toBe("40");
        expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
    });
});

describe("GanttChart — row hierarchy (§8.5, §8.6)", () => {
    test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
        build();
        const parentRow = rows()[3];
        const cells = parentRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
        expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
        expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
    });

    test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", async () => {
        build({ labels: LABELS });
        expect(rows()).toHaveLength(6);
        const collapseButton = buttonByName("Collapse Phase 1")!;
        expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
        collapseButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(rows()).toHaveLength(4);
        expect(document.body.textContent).not.toContain("Child A");
        expect(buttonByName("Expand Phase 1")!.getAttribute("aria-expanded")).toBe("false");
    });
});

describe("GanttChart — dependencies (§8.7)", () => {
    test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
        build({ labels: LABELS });
        const buildRow = rows()[1];
        const describedCell = buildRow.querySelector(".gantt-table-td[aria-describedby]");
        expect(describedCell).toBeTruthy();
        const id = describedCell!.getAttribute("aria-describedby")!;
        expect(document.getElementById(id)?.textContent?.trim()).toBe("Blocked by: Design");
    });

    test("§8.7 a task with no dependencies carries no aria-describedby", () => {
        build({ labels: LABELS });
        const designRow = rows()[0];
        expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
    });
});

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
    test("§8.8 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        build();
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

    test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", async () => {
        build();
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        await flush();
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        await flush();
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        await flush();
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
    });
});

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
    test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(buttonByName("Start date")).toBeTruthy();
        expect(buttonByName("End date")).toBeTruthy();
    });

    test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", async () => {
        build();
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.9 Enter on a parent row does not open an edit region", async () => {
        build({ labels: LABELS });
        // Move focus down to the parent row (index 3).
        for (let i = 0; i < 3; i++) {
            tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
            await flush();
        }
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("3");
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.10 Save emits task-change with the task's id and edited dates, then closes", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        editRowButton("gantt-chart-save-button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("task-change")).toEqual([["design", "2026-10-01", "2026-10-03"]]);
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.11 Cancel closes the edit region without emitting task-change", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        editRowButton("gantt-chart-cancel-button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("task-change")).toBeUndefined();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
    test("§8.12 dropping a task's bar on another column emits task-change, preserving duration", async () => {
        build();
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
        const bar = rows()[0].querySelector(".gantt-chart-bar")!;
        bar.dispatchEvent(Object.assign(new Event("dragstart", { bubbles: true }), { dataTransfer }));

        const targetCell = rows()[0].querySelectorAll(".gantt-table-td")[5]; // Oct 6
        targetCell.dispatchEvent(Object.assign(new Event("drop", { bubbles: true }), { dataTransfer }));
        await flush();
        // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
        const wrapper = wrappers[wrappers.length - 1];
        expect(wrapper.emitted("task-change")).toEqual([["design", "2026-10-06", "2026-10-08"]]);
    });

    test("§8.13 a successful edit announces via labels.dateAnnouncement", async () => {
        build({ labels: LABELS });
        tabbableCells()[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        editRowButton("gantt-chart-save-button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(
            "Design moved to 2026-10-01 - 2026-10-03",
        );
    });

    test("§8.14 `today` marks its column data-today; omitting it marks nothing", async () => {
        const wrapper1 = build({ today: "2026-10-05" });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
        wrapper1.unmount();
        wrappers.pop();
        document.body.innerHTML = "";

        build();
        expect(document.querySelectorAll("[data-today]")).toHaveLength(0);
    });
});

describe("GanttChart — extra attributes (§8.15)", () => {
    test("§8.15 extra attributes spread onto the root", () => {
        build({ "data-testid": "chart-root" });
        expect(document.querySelector('[data-testid="chart-root"]')).toBeTruthy();
    });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
}

function startField(): HTMLInputElement | null {
    return document.querySelector<HTMLInputElement>(".gantt-chart-edit-row .date-time-picker-input");
}

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
    test("§8.17 depth is a data-depth attribute, never an inline style", () => {
        build();
        const headers = Array.from(document.querySelectorAll<HTMLElement>(".gantt-table-tbody .gantt-table-th"));
        expect(headers.map((h) => h.dataset.depth)).toEqual(["0", "0", "0", "0", "1", "1"]);
        expect(headers.filter((h) => h.hasAttribute("style"))).toHaveLength(0);
    });

    test("§8.17 a task whose parentId names no task renders as a top-level row", () => {
        const orphan: GanttTask = { id: "orphan", label: "Orphan", start: "2026-10-02", end: "2026-10-02", parentId: "gone" };
        expect(flattenTasks([...TASKS, orphan], new Set()).map((r) => r.task.id)).toContain("orphan");
    });

    test("§8.17 a parentId cycle does not recurse forever", () => {
        const cycle: GanttTask[] = [
            { id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", parentId: "b" },
            { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", parentId: "a" },
        ];
        expect(() => effectiveRange(cycle[0], cycle)).not.toThrow();
    });

    test("§8.8 when collapsing removes the row under the cursor, one cell stays tabbable", async () => {
        build({ labels: LABELS });
        key(tabbableCells()[0], "End", { ctrlKey: true });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("5");
        buttonByName("Collapse Phase 1")!.click();
        await flush();
        expect(rows()).toHaveLength(4);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.8 focusing a cell by pointer moves the cursor there", async () => {
        build();
        const cell = rows()[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
        cell.focus();
        await flush();
        expect(tabbableCells()).toEqual([cell]);
    });

    test("§8.9 opening the edit region moves focus to the start date's field", async () => {
        build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        expect(document.activeElement).toBe(startField());
    });

    test("§8.11 Escape cancels the edit region and returns focus to the task's cell", async () => {
        const wrapper = build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        key(startField()!, "Escape");
        await flush();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(wrapper.emitted("task-change")).toBeUndefined();
        expect(document.activeElement).toBe(tabbableCells()[0]);
    });

    test("§8.10 Save returns focus to the grid", async () => {
        build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        editRowButton("gantt-chart-save-button")!.click();
        await flush();
        expect(document.activeElement).toBe(tabbableCells()[0]);
    });

    test("§8.10 a range entered end-first is saved start-first", async () => {
        const wrapper = build({ labels: LABELS });
        key(tabbableCells()[0], "Enter");
        await flush();
        const field = startField()!;
        field.value = "2026-10-09";
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new FocusEvent("blur"));
        await flush();
        editRowButton("gantt-chart-save-button")!.click();
        await flush();
        expect(wrapper.emitted("task-change")).toEqual([["design", "2026-10-03", "2026-10-09"]]);
    });

    test("§8.16 controls whose labels are absent do not render unnamed", async () => {
        build({ labels: { dateTimePickerLabels: DTP_LABELS } });
        expect(document.querySelector(".gantt-chart-collapse-button")).toBeNull();
        key(tabbableCells()[0], "Enter");
        await flush();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
        build({ labels: { ...LABELS, taskColumnHeader: "Task" } });
        expect(document.querySelector(".gantt-table-thead .gantt-table-th")?.textContent?.trim()).toBe("Task");
    });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
    const heads = () => Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);
    const bodyRows = () => Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"));
    const key = (el: Element, init: KeyboardEventInit) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));

    test("markers mark the containing column, and a marker label renders as text", async () => {
        build({ labels: LABELS, markers: [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }] });
        await flush();
        expect(heads()[4].getAttribute("data-marker")).toBe("holiday");
        expect(heads()[4].textContent).toContain("Bank holiday");
        expect(heads()[3].hasAttribute("data-marker")).toBe(false);
        expect(document.querySelectorAll(".gantt-table-td[data-marker]").length).toBe(bodyRows().length);
    });

    test("isNonWorking marks a column only when every day in it is non-working", async () => {
        build({ isNonWorking: (d: string) => d === "2026-10-03" || d === "2026-10-04" });
        await flush();
        expect(heads()[2].hasAttribute("data-non-working")).toBe(true);
        expect(heads()[3].hasAttribute("data-non-working")).toBe(true);
        expect(heads()[1].hasAttribute("data-non-working")).toBe(false);
    });

    test("week columns are non-working only if all seven days are", async () => {
        build({ timeUnit: "week", isNonWorking: (d: string) => d === "2026-10-03" });
        await flush();
        expect(document.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
    });

    test("task type, critical and slack become data attributes on the row", async () => {
        build({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 }] });
        await flush();
        const row = bodyRows()[0];
        expect(row.getAttribute("data-task-type")).toBe("design");
        expect(row.hasAttribute("data-critical")).toBe(true);
        expect(row.getAttribute("data-slack")).toBe("2");
    });

    test("labels.criticalLabel is visible text on a critical task, beside its unchanged label", async () => {
        build({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", critical: true }, { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", dependsOn: ["a"] }], labels: { criticalLabel: "Critical path", dependencySummary: (l: string[]) => `Depends on ${l.join(", ")}` } });
        await flush();
        const found = document.querySelectorAll(".gantt-chart-critical-label");
        expect(found).toHaveLength(1);
        expect(found[0].textContent).toBe("Critical path");
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("Depends on A");
    });

    test("without labels.criticalLabel no critical text renders", async () => {
        build({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", critical: true }, { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", dependsOn: ["a"] }] });
        await flush();
        expect(document.querySelector(".gantt-chart-critical-label")).toBeNull();
    });

    test("readonly: no edit region, no drag, navigation and collapse still work", async () => {
        build({ labels: LABELS, readonly: true });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(document.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
        expect(document.querySelector(".gantt-chart")!.hasAttribute("data-readonly")).toBe(true);
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
        (document.querySelector('[aria-label="Collapse Phase 1"]') as HTMLElement).click();
        await flush();
        expect(document.querySelector('[aria-label="Expand Phase 1"]')).toBeTruthy();
    });
});

describe("GanttChart — progress field, baselines, typed dependencies", () => {
    const cellsOf = (i: number) => Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr")[i].querySelectorAll<HTMLElement>(".gantt-table-td"));
    const key = (el: Element, init: KeyboardEventInit) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
    const percentLabels: GanttLabels = { ...LABELS, percentLabel: "Percent complete" };
    const percentInput = () => document.querySelector(".gantt-chart-percent-input") as HTMLInputElement;
    const saveBtn = () => Array.from(document.querySelectorAll("button")).find((b) => b.textContent!.trim() === "Save") as HTMLElement;

    test("percentLabel adds a progress field to the edit region; without it none renders", async () => {
        const a = build({ labels: LABELS });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(percentInput()).toBeNull();
        a.unmount();
        wrappers.pop();
        build({ labels: percentLabels });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(percentInput()).toBeTruthy();
        expect(percentInput().closest("label")!.textContent).toContain("Percent complete");
    });

    test("the progress field starts at the task's percentComplete and Save emits the new value as a 4th argument", async () => {
        const wrapper = build({ labels: percentLabels });
        await flush();
        key(tabbableCells()[0], { key: "ArrowDown" });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(percentInput().value).toBe("40");
        percentInput().value = "75";
        percentInput().dispatchEvent(new Event("input", { bubbles: true }));
        await flush();
        saveBtn().click();
        await flush();
        expect(wrapper.emitted("task-change")).toEqual([["build", "2026-10-04", "2026-10-06", 75]]);
    });

    test("progress is clamped to 0–100", async () => {
        const wrapper = build({ labels: percentLabels });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        percentInput().value = "250";
        percentInput().dispatchEvent(new Event("input", { bubbles: true }));
        await flush();
        saveBtn().click();
        await flush();
        expect(wrapper.emitted("task-change")).toEqual([["design", "2026-10-01", "2026-10-03", 100]]);
    });

    test("without percentLabel Save keeps the three-argument emit", async () => {
        const wrapper = build({ labels: LABELS });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        saveBtn().click();
        await flush();
        expect(wrapper.emitted("task-change")![0]).toHaveLength(3);
    });

    test("a baseline marks the cells it covers with data-baseline, apart from the current span", async () => {
        build({ tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }] });
        await flush();
        const withBaseline = cellsOf(0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
        expect(withBaseline).toEqual([1, 2, 3]);
        expect(cellsOf(0)[3].hasAttribute("data-in-range")).toBe(true);
        expect(cellsOf(0)[1].hasAttribute("data-in-range")).toBe(false);
    });

    test("baselineSummary renders as hidden text with the slip in days, and describes the row's cells", async () => {
        build({
            tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }],
            labels: { baselineSummary: (t: string, b: { start: string; end: string }, v: number) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` },
        });
        await flush();
        const summary = document.querySelector(".gantt-chart-baseline-summary") as HTMLElement;
        expect(summary.hidden).toBe(true);
        expect(summary.textContent!.trim()).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
        expect(cellsOf(0)[0].getAttribute("aria-describedby")).toContain(summary.id);
    });

    test("a task with no baseline has no baseline cells or summary", async () => {
        build({ labels: { baselineSummary: () => "x" } });
        await flush();
        expect(document.querySelector("[data-baseline]")).toBeNull();
        expect(document.querySelector(".gantt-chart-baseline-summary")).toBeNull();
    });

    test("typed dependencies go through dependencyDetail; untyped ones keep the predecessor's label", async () => {
        build({
            tasks: [
                { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
                { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a", type: "s2s", lag: 2 }, "a"] },
            ],
            labels: {
                dependencySummary: (preds: string[]) => `After: ${preds.join("; ")}`,
                dependencyDetail: (label: string, type: string, lag: number) => `${label} (${type}, lag ${lag})`,
            },
        });
        await flush();
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("After: Design (s2s, lag 2); Design");
    });

    test("a typed dependency without a lag or type defaults to e2s and 0", async () => {
        build({
            tasks: [
                { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
                { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
            ],
            labels: { dependencySummary: (p: string[]) => p.join(), dependencyDetail: (l: string, t: string, g: number) => `${l}/${t}/${g}` },
        });
        await flush();
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("Design/e2s/0");
    });
});

describe("GanttChart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
    const zl: GanttLabels = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u) => `Showing ${u}s` };
    const cols = () => document.querySelectorAll(".gantt-table-thead .gantt-table-th").length - 1;
    const btn = (n: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === n) as HTMLButtonElement;
    const cellAt = (i: number) => rows()[0].querySelectorAll(".gantt-table-td")[i] as HTMLElement;
    const kd = (el: Element, init: KeyboardEventInit) => el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
    const clk = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const dragEvent = (type: string) => {
        const e = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(e, "dataTransfer", { value: { setData: () => {}, getData: () => "design" } });
        return e;
    };

    test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", async () => {
        build({ labels: LABELS });
        await flush();
        expect(document.querySelector(".gantt-chart-zoom")).toBeNull();
    });

    test("§14.2 zoom out steps to coarser columns, announcing each unit; §14.3 buttons disable at the ends", async () => {
        build({ labels: zl });
        await flush();
        expect(btn("Zoom in").disabled).toBe(true);
        const day = cols();
        clk(btn("Zoom out"));
        await flush();
        expect(cols()).toBeLessThan(day);
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Showing weeks");
        clk(btn("Zoom out"));
        await flush();
        expect(btn("Zoom out").disabled).toBe(true);
        expect(btn("Zoom in").disabled).toBe(false);
    });

    test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", async () => {
        build();
        await flush();
        expect(rows()[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
        expect(cellAt(2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
        expect(rows()[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
        document.body.innerHTML = "";
        build({ readonly: true });
        await flush();
        expect(document.querySelector(".gantt-chart-bar-handle")).toBeNull();
    });

    test("§14.6 the end handle extends the end; §14.7 the start handle moves the start and the range cannot invert", async () => {
        const w = build();
        await flush();
        cellAt(2).querySelector(".gantt-chart-bar-handle-end")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(5).dispatchEvent(dragEvent("drop"));
        rows()[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(1).dispatchEvent(dragEvent("drop"));
        rows()[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(7).dispatchEvent(dragEvent("drop"));
        expect(w.emitted("task-change")).toEqual([
            ["design", "2026-10-01", "2026-10-06"],
            ["design", "2026-10-02", "2026-10-03"],
        ]);
    });

    test("§14.9 clicking a row selects it; §14.10 again deselects; §14.11 the s key selects; §14.12 selectedTaskId starts selected", async () => {
        const w = build();
        await flush();
        const c = rows()[1].querySelectorAll(".gantt-table-td")[0];
        clk(c);
        await flush();
        expect(rows()[1].getAttribute("aria-selected")).toBe("true");
        expect(rows()[1].hasAttribute("data-selected")).toBe(true);
        clk(c);
        await flush();
        expect(rows()[1].hasAttribute("data-selected")).toBe(false);
        expect(w.emitted("task-select")).toEqual([["build"], [undefined]]);
        kd(tabbableCells()[0], { key: "s" });
        await flush();
        expect(rows()[0].getAttribute("aria-selected")).toBe("true");
        document.body.innerHTML = "";
        build({ selectedTaskId: "launch" });
        await flush();
        expect(rows()[2].hasAttribute("data-selected")).toBe(true);
    });

    test("§14.13–§14.16 Alt+Arrow shifts, Alt+Shift+Arrow moves the end, not before the range, readonly ignores", async () => {
        const w = build();
        await flush();
        kd(tabbableCells()[0], { key: "ArrowLeft", altKey: true });
        expect(w.emitted("task-change")).toBeUndefined();
        kd(tabbableCells()[0], { key: "ArrowRight", altKey: true });
        kd(tabbableCells()[0], { key: "ArrowRight", altKey: true, shiftKey: true });
        expect(w.emitted("task-change")).toEqual([
            ["design", "2026-10-02", "2026-10-04"],
            ["design", "2026-10-01", "2026-10-04"],
        ]);
        document.body.innerHTML = "";
        const ro = build({ readonly: true });
        await flush();
        kd(tabbableCells()[0], { key: "ArrowRight", altKey: true });
        expect(ro.emitted("task-change")).toBeUndefined();
    });

    test("§14.17 taskAttrs adds attributes to each task's row", async () => {
        build({ taskAttrs: (t: GanttTask) => ({ "data-team": t.id === "design" ? "ux" : "eng" }) });
        await flush();
        expect(rows()[0].getAttribute("data-team")).toBe("ux");
        expect(rows()[1].getAttribute("data-team")).toBe("eng");
    });
});

describe("GanttChart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
    const withUnscheduled: GanttTask[] = [
        { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
        { id: "u", label: "To be planned" },
    ];
    const unscheduledCell = () => document.querySelector<HTMLElement>('[data-task-id="u"] [data-row][data-col="0"]')!;
    const byLabel = (name: string) => Array.from(document.querySelectorAll("button")).find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name) as HTMLButtonElement;

    test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
        build({ tasks: withUnscheduled });
        const row = document.querySelector('[data-task-id="u"]')!;
        expect(row.hasAttribute("data-unscheduled")).toBe(true);
        expect(row.querySelector(".gantt-chart-bar")).toBeNull();
        expect(row.querySelector("[data-in-range]")).toBeNull();
        expect(document.querySelector('[data-task-id="a"]')!.hasAttribute("data-unscheduled")).toBe(false);
    });

    test("§14.19 an unscheduled child does not shape its parent's span", () => {
        const tasks: GanttTask[] = [
            { id: "p", label: "P" },
            { id: "c1", label: "C1", parentId: "p", start: "2026-10-03", end: "2026-10-04" },
            { id: "c2", label: "C2", parentId: "p" },
        ];
        expect(effectiveRange(tasks[0], tasks)).toEqual({ start: "2026-10-03", end: "2026-10-04" });
    });

    test("§14.20 Enter on an unscheduled task opens the edit region with empty dates; Save is disabled until both are set", async () => {
        build({ tasks: withUnscheduled, labels: LABELS });
        unscheduledCell().dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        unscheduledCell().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await nextTick();
        await nextTick();
        expect(byLabel("Save").disabled).toBe(true);
    });

    test("§14.21 Alt+Arrow on an unscheduled task changes nothing", async () => {
        const wrapper = build({ tasks: withUnscheduled });
        unscheduledCell().dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        unscheduledCell().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", altKey: true, bubbles: true }));
        await nextTick();
        expect(wrapper.emitted("task-change")).toBeUndefined();
    });

    test("§14.22 collapsedTaskIds starts parents collapsed and the model updates", async () => {
        const wrapper = build({ collapsedTaskIds: ["parent"], labels: LABELS });
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(byLabel("Expand Phase 1").getAttribute("aria-expanded")).toBe("false");
        byLabel("Expand Phase 1").click();
        await nextTick();
        expect(wrapper.emitted("update:collapsedTaskIds")!.at(-1)).toEqual([[]]);
    });

    test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", async () => {
        build({ labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
        expect(byLabel("Expand all").disabled).toBe(true);
        byLabel("Collapse all").click();
        await nextTick();
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(byLabel("Collapse all").disabled).toBe(true);
        byLabel("Expand all").click();
        await nextTick();
        expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
    });

    test("§14.24 no collapse-all buttons without labels or without parents", () => {
        build();
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
        wrappers.pop()!.unmount();
        build({ tasks: [TASKS[0]], labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
    });
});

/** Retry an assertion until it holds (testing-library's `waitFor`, minimal). */
async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
    const deadline = Date.now() + timeout;
    for (;;) {
        try {
            assertion();
            return;
        } catch (error) {
            if (Date.now() > deadline) throw error;
            await flush();
        }
    }
}

/** Minimal stand-in for testing-library's `fireEvent`, over real DOM events, then a Vue flush. */
const fireEvent = {
    async click(el: Element) { (el as HTMLElement).click(); await flush(); },
    async input(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("input", { bubbles: true })); await flush(); },
    async change(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("change", { bubbles: true })); await flush(); },
    async scroll(el: Element) { el.dispatchEvent(new Event("scroll")); await flush(); },
    async keyDown(el: Element, init: KeyboardEventInit & { keyCode?: number }) { el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })); await flush(); },
};

describe("GanttChart — typed fields, editing, export, virtualization (§14.25–§14.40)", () => {
    const FIELDS = [
        { id: "owner", header: "Owner", type: "select" as const, options: [{ id: "a", label: "Ann" }, { id: "b", label: "Bo" }] },
        { id: "points", header: "Points", type: "number" as const },
    ];
    const FT: GanttTask[] = [
        { id: "t1", label: "Design", start: "2026-10-01", end: "2026-10-03", percentComplete: 50, values: { owner: "a", points: 3 }, baseline: { start: "2026-10-01", end: "2026-10-02" } },
        { id: "t2", label: "Build =x", start: "2026-10-04", end: "2026-10-06", dependsOn: ["t1"], values: { points: 5 } },
        { id: "p", label: "Phase", parentId: undefined },
        { id: "k", label: "Kid", start: "2026-10-08", end: "2026-10-09", parentId: "p" },
    ];
    const EXPORT_LABELS: GanttLabels = {
        export: "Export",
        exportCsv: "CSV",
        exportTsv: "TSV",
        exportExcel: "Excel",
        exportHeaders: { task: "Task", start: "Start", end: "End", percentComplete: "Done", parent: "Parent", dependsOn: "After" },
        exportAnnouncement: (f, n, name) => `${n} tasks as ${f}: ${name}`,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
    };
    const base = { label: "Q4", range: RANGE, tasks: FT, fields: FIELDS };
    const rowOf = (id: string) => document.querySelector<HTMLElement>(`[data-task-id="${id}"]`)!;

    test("§14.25 each field is a column between the task name and the timeline, with a header and formatted cells", () => {
        build(base);
        const heads = Array.from(document.querySelectorAll(".gantt-table-thead th")).slice(0, 3).map((e) => e.textContent?.trim());
        expect(heads).toEqual(["", "Owner", "Points"]);
        const cells = rowOf("t1").querySelectorAll("[data-field]");
        expect(Array.from(cells).map((c) => c.textContent?.trim())).toEqual(["Ann", "3"]);
    });

    test("§14.26 fields are plain text without onFieldEdit and in a readonly chart", () => {
        build(base);
        expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
        document.body.innerHTML = "";
        build({ ...base, onFieldEdit: vi.fn(), readonly: true });
        expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
    });

    test("§14.27 clicking a value opens a typed editor; Enter commits the parsed value and announces", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(rowOf("t1").querySelectorAll<HTMLElement>(".gantt-chart-field-button")[1]);
        const input = document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        expect(input.type).toBe("number");
        expect(input.getAttribute("aria-label")).toBe("Points");
        await fireEvent.input(input, { target: { value: "8" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t1", fieldId: "points", value: 8, previous: 3 });
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Design Points is 8");
        expect(document.querySelector(".gantt-chart-field-editor")).toBeNull();
    });

    test("§14.28 a select field edits through its options", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, onFieldEdit });
        await fireEvent.click(rowOf("t2").querySelectorAll<HTMLElement>(".gantt-chart-field-button")[0]);
        await fireEvent.change(document.querySelector("select.gantt-chart-field-editor")!, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t2", fieldId: "owner", value: "b", previous: undefined });
    });

    test("§14.29 Escape cancels; an unchanged value reports nothing", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, onFieldEdit });
        const open = () => fireEvent.click(rowOf("t1").querySelectorAll<HTMLElement>(".gantt-chart-field-button")[1]);
        await open();
        await fireEvent.input(document.querySelector(".gantt-chart-field-editor")!, { target: { value: "9" } });
        await fireEvent.keyDown(document.querySelector(".gantt-chart-field-editor")!, { key: "Escape" });
        await open();
        await fireEvent.keyDown(document.querySelector(".gantt-chart-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§14.30 a value that does not fit the type is refused: the editor stays open and the refusal is announced", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, fields: [{ id: "p", header: "P", type: "number", parse: () => Number.NaN }], tasks: [{ ...FT[0], values: { p: 1 } }], onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(document.querySelector(".gantt-chart-field-button")!);
        await fireEvent.keyDown(document.querySelector(".gantt-chart-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".gantt-chart-field-editor")).not.toBeNull();
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Design: bad P");
    });

    test("§14.31 F2 on a timeline cell edits the row's first editable field; Tab commits and moves to the next", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, onFieldEdit });
        const cell = rowOf("t1").querySelector<HTMLElement>("[data-row][data-col]")!;
        await fireEvent.keyDown(cell, { key: "F2" });
        const first = document.querySelector<HTMLSelectElement>("select.gantt-chart-field-editor")!;
        expect(first).not.toBeNull();
        await fireEvent.change(first, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledTimes(1);
        await fireEvent.click(rowOf("t1").querySelectorAll<HTMLElement>(".gantt-chart-field-button")[0]);
        await fireEvent.keyDown(document.querySelector(".gantt-chart-field-editor")!, { key: "Tab" });
        expect(document.querySelector<HTMLInputElement>("input.gantt-chart-field-editor")!.type).toBe("number");
    });

    test("§14.32 IME: Enter while composing does not commit", async () => {
        const onFieldEdit = vi.fn();
        build({ ...base, fields: [{ id: "n", header: "N" }], tasks: [{ ...FT[0], values: { n: "a" } }], onFieldEdit });
        await fireEvent.click(document.querySelector(".gantt-chart-field-button")!);
        const input = document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        await fireEvent.input(input, { target: { value: "かな" } });
        await fireEvent.keyDown(input, { key: "Enter", isComposing: true });
        await fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t1", fieldId: "n", value: "かな", previous: "a" });
    });

    async function exported(props: Record<string, unknown> = {}, format: "csv" | "tsv" | "xlsx" = "csv") {
        const exportHandler = vi.fn((_file: { format: string; filename: string; taskCount: number; blob: Blob }) => false as const);
        build({ ...base, labels: EXPORT_LABELS, exportHandler, ...props });
        await fireEvent.click(document.querySelector(`[data-gantt-export-format="${format}"]`)!);
        const file = exportHandler.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text };
    }

    test("§14.33 export buttons need a label and exportHeaders; each label gates its button", () => {
        build(base);
        expect(document.querySelector(".gantt-chart-export")).toBeNull();
        document.body.innerHTML = "";
        build({ ...base, labels: { exportCsv: "CSV" } });
        expect(document.querySelector(".gantt-chart-export")).toBeNull();
        document.body.innerHTML = "";
        build({ ...base, labels: { export: "Export", exportExcel: "Excel", exportHeaders: EXPORT_LABELS.exportHeaders } });
        expect(document.querySelector("[role=group][aria-label=Export]")).toBeTruthy();
        expect(document.querySelectorAll(".gantt-chart-export-button")).toHaveLength(1);
    });

    test("§14.34 CSV holds task, effective start/end, percent, parent, predecessors and the fields; parents export their derived span", async () => {
        const { file, text } = await exported();
        expect(file.filename).toBe("gantt-chart.csv");
        expect(file.taskCount).toBe(4);
        const lines = text.replace("﻿", "").split("\r\n");
        expect(lines[0]).toBe("Task,Start,End,Done,Parent,After,Owner,Points");
        expect(lines[1]).toMatch(/^Design,2026-10-01,2026-10-03,50,,,Ann,3$/);
        expect(lines[2]).toMatch(/^'=x|^Build/);
        expect(lines[2]).toContain("Design");
        expect(lines[3]).toMatch(/^Phase,2026-10-08,2026-10-09,,,,/);
        expect(lines[4]).toMatch(/^Kid,2026-10-08,2026-10-09,,Phase,,/);
    });

    test("§14.35 exportScope visible leaves out tasks under a collapsed parent", async () => {
        const { file } = await exported({ collapsedTaskIds: ["p"], exportScope: "visible" });
        expect(file.taskCount).toBe(3);
    });

    test("§14.36 baseline columns and exportable false", async () => {
        const { text } = await exported({ fields: [{ ...FIELDS[0], exportable: false }, FIELDS[1]], labels: { ...EXPORT_LABELS, exportHeaders: { ...EXPORT_LABELS.exportHeaders!, baselineStart: "BS", baselineEnd: "BE" } } });
        const lines = text.replace("﻿", "").split("\r\n");
        expect(lines[0]).toBe("Task,Start,End,Done,Parent,After,BS,BE,Points");
        expect(lines[1]).toBe("Design,2026-10-01,2026-10-03,50,,,2026-10-01,2026-10-02,3");
    });

    test("§14.37 saving announces unless exportHandler returns false; no tasks disables the buttons", async () => {
        const created: Blob[] = [];
        const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
        URL.revokeObjectURL = () => {};
        try {
            build({ ...base, labels: EXPORT_LABELS });
            await fireEvent.click(document.querySelector('[data-gantt-export-format="tsv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("4 tasks as tsv: gantt-chart.tsv");
            document.body.innerHTML = "";
            build({ ...base, tasks: [], labels: EXPORT_LABELS });
            expect((document.querySelector('[data-gantt-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });

    const MANY: GanttTask[] = Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, label: `Task ${i}`, start: "2026-10-01", end: "2026-10-02" }));

    test("§14.38 virtualize renders only the rows in view plus spacers, with aria-rowcount and aria-rowindex", () => {
        build({ label: "Q4", range: RANGE, tasks: MANY, virtualize: { rowHeight: 20, height: 100, overscan: 1 } });
        const rendered = document.querySelectorAll("[data-task-id]").length;
        expect(rendered).toBeGreaterThan(0);
        expect(rendered).toBeLessThan(20);
        expect(document.querySelector(".gantt-table")!.getAttribute("aria-rowcount")).toBe("201");
        expect(document.querySelector('[data-task-id="r0"]')!.getAttribute("aria-rowindex")).toBe("2");
        expect(document.querySelector(".gantt-chart-spacer")).not.toBeNull();
        expect(document.querySelector(".gantt-chart-scroll")!.getAttribute("style")).toContain("height: 100px");
    });

    test("§14.39 scrolling brings later rows in; keyboard focus to the last row reveals it", async () => {
        build({ label: "Q4", range: RANGE, tasks: MANY, virtualize: { rowHeight: 20, height: 100 } });
        const scroll = document.querySelector<HTMLElement>(".gantt-chart-scroll")!;
        scroll.scrollTop = 2000;
        await fireEvent.scroll(scroll);
        expect(document.querySelector('[data-task-id="r100"]')).not.toBeNull();
        expect(document.querySelector('[data-task-id="r1"]')).toBeNull(); // r0 stays: it holds the roving tab stop
        const cell = document.querySelector<HTMLElement>("[data-row][data-col]")!;
        await fireEvent.keyDown(cell, { key: "End", ctrlKey: true });
        await waitFor(() => expect(document.querySelector('[data-task-id="r199"]')).not.toBeNull());
    });

    test("§14.40 without virtualize every row renders, and the roving tab stop stays unique", () => {
        build({ label: "Q4", range: RANGE, tasks: MANY });
        expect(document.querySelectorAll("[data-task-id]")).toHaveLength(200);
        expect(tabbableCells()).toHaveLength(1);
    });
});

// =====================================================================
// §17 weekend shading and dependency arrows (0.6.0)
// =====================================================================

describe("weekend shading and dependency arrows", () => {
    const headText = () => Array.from(document.querySelectorAll("thead th[data-weekend]")).map((h) => h.textContent?.trim());

    // 2026-10-03 is a Saturday, 2026-10-04 a Sunday.
    test("§17.1 weekends marks day columns on the header and every cell, and nothing without it", async () => {
        build({ labels: LABELS, weekends: [0, 6] });
        await flush();
        expect(headText()).toEqual(["2026-10-03", "2026-10-04", "2026-10-10"]);
        expect(document.querySelectorAll("tbody td[data-weekend]")).toHaveLength(3 * TASKS.length);
    });

    test("§17.2 with no weekends nothing is shaded, and the weekend is never defaulted", async () => {
        build({ labels: LABELS });
        await flush();
        expect(document.querySelector("[data-weekend]")).toBeNull();
    });

    test("§17.3 a Friday-Saturday weekend shades those days instead", async () => {
        build({ labels: LABELS, weekends: [5, 6] });
        await flush();
        expect(headText()).toEqual(["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10"]);
    });

    test("§17.4 week and month columns are not marked", async () => {
        build({ labels: LABELS, range: { start: "2026-10-01", end: "2026-12-31" }, weekends: [0, 6], timeUnit: "week" });
        await flush();
        expect(document.querySelector("[data-weekend]")).toBeNull();
    });

    test("§17.5 weekends can combine with isNonWorking", async () => {
        build({ labels: LABELS, weekends: [6], isNonWorking: (d: string) => d === "2026-10-03" });
        await flush();
        const th = Array.from(document.querySelectorAll("thead th")).find((h) => h.textContent?.trim() === "2026-10-03")!;
        expect(th.hasAttribute("data-weekend") && th.hasAttribute("data-non-working")).toBe(true);
    });

    function stubLayout(): () => void {
        const original = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function (this: Element) {
            const cell = this.closest("td[data-col]") as HTMLElement | null;
            if (!cell) return original.call(this);
            const col = Number(cell.dataset.col);
            const row = Number(cell.dataset.row);
            return { left: col * 20, right: col * 20 + 20, top: row * 20, bottom: row * 20 + 20, width: 20, height: 20, x: col * 20, y: row * 20, toJSON() {} } as DOMRect;
        };
        return () => {
            Element.prototype.getBoundingClientRect = original;
        };
    }

    test("§17.6 dependencyArrows draws one aria-hidden arrow per dependency, from the predecessor's end to the dependent's start", async () => {
        const restore = stubLayout();
        try {
            build({ labels: LABELS, dependencyArrows: true });
            await waitFor(() => expect(document.querySelectorAll(".gantt-chart-dependency-arrow")).toHaveLength(1));
            expect(document.querySelector(".gantt-chart-dependency-arrows")!.getAttribute("aria-hidden")).toBe("true");
            const arrow = document.querySelector(".gantt-chart-dependency-arrow")!;
            expect(arrow.getAttribute("data-from")).toBe("design");
            expect(arrow.getAttribute("data-to")).toBe("build");
            expect(arrow.getAttribute("data-dependency-type")).toBe("e2s");
            expect(arrow.getAttribute("d")).toBe("M60 10H68V19H52V30H60");
        } finally {
            restore();
        }
    });

    test("§17.7 the dependency stays available as text however the arrows are drawn", async () => {
        const restore = stubLayout();
        try {
            build({ labels: LABELS, dependencyArrows: true });
            await waitFor(() => expect(document.querySelector(".gantt-chart-dependency-arrow")).not.toBeNull());
            expect(document.querySelector(".gantt-chart-dependency-summary")?.textContent?.trim()).toBe("Blocked by: Design");
        } finally {
            restore();
        }
    });

    test("§17.8 typed dependencies use their own edges, and a missing predecessor draws nothing", async () => {
        const restore = stubLayout();
        try {
            const tasks: GanttTask[] = [
                { id: "a", label: "A", start: "2026-10-01", end: "2026-10-03" },
                { id: "b", label: "B", start: "2026-10-05", end: "2026-10-06", dependsOn: [{ id: "a", type: "s2s" }, { id: "ghost" }] },
            ];
            build({ labels: LABELS, tasks, dependencyArrows: true });
            await waitFor(() => expect(document.querySelectorAll(".gantt-chart-dependency-arrow")).toHaveLength(1));
            expect(document.querySelector(".gantt-chart-dependency-arrow")!.getAttribute("data-dependency-type")).toBe("s2s");
        } finally {
            restore();
        }
    });

    test("§17.9 without dependencyArrows there is no overlay", async () => {
        build({ labels: LABELS });
        await flush();
        expect(document.querySelector(".gantt-chart-dependency-arrows")).toBeNull();
    });

    test("§17.10 collapsing a parent removes the arrows that touched its children", async () => {
        const restore = stubLayout();
        try {
            const tasks: GanttTask[] = [
                { id: "p", label: "P", start: "2026-10-01", end: "2026-10-04" },
                { id: "c", label: "C", start: "2026-10-01", end: "2026-10-02", parentId: "p" },
                { id: "d", label: "D", start: "2026-10-05", end: "2026-10-06", dependsOn: ["c"] },
            ];
            build({ labels: LABELS, tasks, dependencyArrows: true, collapsedTaskIds: ["p"] });
            await flush();
            expect(document.querySelectorAll("[data-task-id]").length).toBe(2);
            expect(document.querySelector(".gantt-chart-dependency-arrow")).toBeNull();
        } finally {
            restore();
        }
    });
});

