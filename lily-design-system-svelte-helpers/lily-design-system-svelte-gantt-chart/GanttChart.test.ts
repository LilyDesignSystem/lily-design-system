import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import GanttChart, {
    addDays,
    compareISO,
    effectiveRange,
    endOfMonth,
    flattenTasks,
    generateColumns,
} from "./GanttChart.svelte";
import type { GanttLabels, GanttTask } from "./GanttChart.svelte";

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

function tabbableCells(): Element[] {
    return Array.from(document.querySelectorAll('.gantt-table-td[tabindex="0"]'));
}

function rows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"));
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

    test("addDays is UTC-safe across a month boundary", () => {
        expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
    });

    test("endOfMonth returns the last calendar day of the month", () => {
        expect(endOfMonth("2026-02-05")).toBe("2026-02-28"); // 2026 is not a leap year
        expect(endOfMonth("2026-10-15")).toBe("2026-10-31");
    });

    test("generateColumns produces one column per day across the range", () => {
        const columns = generateColumns(RANGE, "day");
        expect(columns).toHaveLength(10);
        expect(columns[0]).toEqual({ start: "2026-10-01", end: "2026-10-01" });
        expect(columns[9]).toEqual({ start: "2026-10-10", end: "2026-10-10" });
    });

    test("generateColumns produces 7-day columns for 'week', clamped to the range end", () => {
        const columns = generateColumns(RANGE, "week");
        expect(columns[0]).toEqual({ start: "2026-10-01", end: "2026-10-07" });
        expect(columns[1]).toEqual({ start: "2026-10-08", end: "2026-10-10" }); // clamped
    });

    test("generateColumns produces calendar-month columns for 'month'", () => {
        const columns = generateColumns({ start: "2026-10-15", end: "2026-11-15" }, "month");
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
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        expect(document.querySelector(".gantt-chart")).toBeTruthy();
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Q4 plan");
    });

    test("§8.2 renders one column header per day across the range", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers).toHaveLength(11); // 10 day columns + 1 leading blank column
    });

    test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const designRow = rows()[0];
        const cells = designRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
        expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
        expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
    });

    test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const launchRow = rows()[2];
        const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
        const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
        expect(milestoneCells).toHaveLength(1);
        expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
    });

    test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const buildRow = rows()[1];
        const bar = buildRow.querySelector(".gantt-chart-bar");
        expect(bar?.getAttribute("data-percent-complete")).toBe("40");
        expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
    });
});

describe("GanttChart — row hierarchy (§8.5, §8.6)", () => {
    test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const parentRow = rows()[3];
        const cells = parentRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
        expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
        expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
    });

    test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        expect(rows()).toHaveLength(6);
        const collapseButton = screen.getByRole("button", { name: "Collapse Phase 1" });
        expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
        await fireEvent.click(collapseButton);
        expect(rows()).toHaveLength(4);
        expect(screen.queryByText("Child A")).toBeNull();
        expect(screen.getByRole("button", { name: "Expand Phase 1" }).getAttribute("aria-expanded")).toBe("false");
    });
});

describe("GanttChart — dependencies (§8.7)", () => {
    test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        const buildRow = rows()[1];
        const describedCell = buildRow.querySelector(".gantt-table-td[aria-describedby]");
        expect(describedCell).toBeTruthy();
        const id = describedCell!.getAttribute("aria-describedby")!;
        expect(document.getElementById(id)?.textContent).toBe("Blocked by: Design");
    });

    test("§8.7 a task with no dependencies carries no aria-describedby", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        const designRow = rows()[0];
        expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
    });
});

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
    test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
    });
});

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
    test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(screen.getByRole("button", { name: "Start date" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "End date" })).toBeTruthy();
    });

    test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.9 Enter on a parent row does not open an edit region", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        // Move focus down to the parent row (index 3).
        for (let i = 0; i < 3; i++) {
            await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        }
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("3");
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.10 Save calls onTaskChange with the task's id and edited dates, then closes", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, onTaskChange },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.11 Cancel closes the edit region without calling onTaskChange", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, onTaskChange },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(onTaskChange).not.toHaveBeenCalled();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
    test("§8.12 dropping a task's bar on another column calls onTaskChange, preserving duration", () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, onTaskChange },
        });
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
        const bar = rows()[0].querySelector(".gantt-chart-bar")!;
        fireEvent.dragStart(bar, { dataTransfer });

        const targetCell = rows()[0].querySelectorAll(".gantt-table-td")[5]; // Oct 6
        fireEvent.drop(targetCell, { dataTransfer });
        // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-06", "2026-10-08");
    });

    test("§8.13 a successful edit announces via labels.dateAnnouncement", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(
            "Design moved to 2026-10-01 - 2026-10-03",
        );
    });

    test("§8.14 `today` marks its column data-today; omitting it marks nothing", () => {
        const { unmount } = render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, today: "2026-10-05" },
        });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
        unmount();

        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        expect(document.querySelectorAll("[data-today]")).toHaveLength(0);
    });
});

describe("GanttChart — extra attributes (§8.15)", () => {
    test("§8.15 extra attributes spread onto the root", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, "data-testid": "chart-root" } });
        expect(document.querySelector('[data-testid="chart-root"]')).toBeTruthy();
    });
});
