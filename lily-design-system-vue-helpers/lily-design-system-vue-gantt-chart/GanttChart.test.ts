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
