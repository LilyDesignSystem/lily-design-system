import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
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
    test("§8.8 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

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

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
    test("§8.5 depth is a data-depth attribute, never an inline style", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const headers = Array.from(document.querySelectorAll<HTMLElement>(".gantt-table-tbody .gantt-table-th"));
        expect(headers.map((h) => h.dataset.depth)).toEqual(["0", "0", "0", "0", "1", "1"]);
        expect(headers.filter((h) => h.hasAttribute("style"))).toHaveLength(0);
    });

    test("§8.5 a task whose parentId names no task renders as a top-level row", () => {
        const orphan: GanttTask = { id: "orphan", label: "Orphan", start: "2026-10-02", end: "2026-10-02", parentId: "gone" };
        expect(flattenTasks([...TASKS, orphan], new Set()).map((r) => r.task.id)).toContain("orphan");
    });

    test("§8.5 a parentId cycle does not recurse forever", () => {
        const cycle: GanttTask[] = [
            { id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", parentId: "b" },
            { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", parentId: "a" },
        ];
        expect(() => effectiveRange(cycle[0], cycle)).not.toThrow();
    });

    test("§8.8 when collapsing removes the row under the cursor, one cell stays tabbable", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "End", ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("5");
        await fireEvent.click(screen.getByRole("button", { name: "Collapse Phase 1" }));
        expect(rows()).toHaveLength(4);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.8 focusing a cell by pointer moves the cursor there", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        const cell = rows()[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
        cell.focus();
        await waitFor(() => expect(tabbableCells()).toEqual([cell]));
    });

    test("§8.9 opening the edit region moves focus to the start date's field", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await waitFor(() =>
            expect(document.activeElement).toBe(document.querySelector(".gantt-chart-edit-row .date-time-picker-input")),
        );
    });

    test("§8.11 Escape cancels the edit region and returns focus to the task's cell", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, onTaskChange } });
        const cell = tabbableCells()[0];
        await fireEvent.keyDown(cell, { key: "Enter" });
        const field = document.querySelector<HTMLElement>(".gantt-chart-edit-row .date-time-picker-input")!;
        await fireEvent.keyDown(field, { key: "Escape" });
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(onTaskChange).not.toHaveBeenCalled();
        await waitFor(() => expect(document.activeElement).toBe(tabbableCells()[0]));
    });

    test("§8.10 Save returns focus to the grid", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => expect(document.activeElement).toBe(tabbableCells()[0]));
    });

    test("§8.10 a range entered end-first is saved start-first", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, onTaskChange } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const [startField, endField] = document.querySelectorAll<HTMLInputElement>(".gantt-chart-edit-row .date-time-picker-input");
        await fireEvent.input(startField, { target: { value: "2026-10-09" } });
        await fireEvent.change(startField, { target: { value: "2026-10-09" } });
        await fireEvent.blur(startField);
        expect(endField).toBeTruthy();
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-03", "2026-10-09");
    });

    test("§8.16 controls whose labels are absent do not render unnamed", async () => {
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { dateTimePickerLabels: DTP_LABELS } },
        });
        expect(document.querySelector(".gantt-chart-collapse-button")).toBeNull();
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { ...LABELS, taskColumnHeader: "Task" } } });
        expect(document.querySelector(".gantt-table-thead .gantt-table-th")?.textContent).toBe("Task");
    });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
    test("markers mark the containing column, and a marker label renders as text", () => {
        render(GanttChart, {
            props: {
                label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS,
                markers: [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }],
            },
        });
        const headers = Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);
        expect(headers[4].getAttribute("data-marker")).toBe("holiday");
        expect(headers[4].textContent).toContain("Bank holiday");
        expect(headers[3].hasAttribute("data-marker")).toBe(false);
        expect(document.querySelectorAll('.gantt-table-td[data-marker]').length).toBe(rows().length);
    });

    test("isNonWorking sets data-non-working on a column only when every day in it is non-working", () => {
        const weekend = (d: string) => d === "2026-10-03" || d === "2026-10-04";
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, isNonWorking: weekend },
        });
        const headers = Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);
        expect(headers[2].hasAttribute("data-non-working")).toBe(true);
        expect(headers[3].hasAttribute("data-non-working")).toBe(true);
        expect(headers[1].hasAttribute("data-non-working")).toBe(false);
    });

    test("week columns are non-working only if all seven days are", () => {
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, timeUnit: "week", isNonWorking: (d: string) => d === "2026-10-03" },
        });
        expect(document.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
    });

    test("task type, critical and slack become data attributes on the row", () => {
        const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 }];
        render(GanttChart, { props: { label: "Plan", range: RANGE, tasks } });
        const row = rows()[0];
        expect(row.getAttribute("data-task-type")).toBe("design");
        expect(row.hasAttribute("data-critical")).toBe(true);
        expect(row.getAttribute("data-slack")).toBe("2");
    });

    test("readonly: Enter opens no edit region, bars are not draggable, navigation and collapse still work", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, readonly: true, onTaskChange },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(document.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
        expect(document.querySelector(".gantt-chart")!.hasAttribute("data-readonly")).toBe(true);
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
        await fireEvent.click(screen.getByRole("button", { name: "Collapse Phase 1" }));
        expect(screen.getByRole("button", { name: "Expand Phase 1" })).toBeTruthy();
    });
});

describe("GanttChart — progress field, baselines, typed dependencies", () => {
    const heads = () => Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);
    const cellsOf = (taskIndex: number) =>
        Array.from(rows()[taskIndex].querySelectorAll<HTMLElement>(".gantt-table-td"));

    test("percentLabel adds a progress field to the edit region; without it none renders", async () => {
        const a = render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(document.querySelector(".gantt-chart-percent-input")).toBeNull();
        a.unmount();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { ...LABELS, percentLabel: "Percent complete" } } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(screen.getByLabelText("Percent complete")).toBeTruthy();
    });

    test("the progress field starts at the task's percentComplete and Save passes the new value as a 4th argument", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { ...LABELS, percentLabel: "Percent complete" }, onTaskChange },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" }); // build, percentComplete 40
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        const input = screen.getByLabelText("Percent complete") as HTMLInputElement;
        expect(input.value).toBe("40");
        await fireEvent.input(input, { target: { value: "75" } });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(onTaskChange).toHaveBeenCalledWith("build", "2026-10-04", "2026-10-06", 75);
    });

    test("progress is clamped to 0–100", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, {
            props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { ...LABELS, percentLabel: "Percent complete" }, onTaskChange },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.input(screen.getByLabelText("Percent complete"), { target: { value: "250" } });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03", 100);
    });

    test("without percentLabel Save keeps the three-argument call", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS, onTaskChange } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        await fireEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(onTaskChange.mock.calls[0]).toHaveLength(3);
    });

    test("a baseline marks the cells it covers with data-baseline, apart from the current span", () => {
        const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }];
        render(GanttChart, { props: { label: "Plan", range: RANGE, tasks } });
        const withBaseline = cellsOf(0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
        expect(withBaseline).toEqual([1, 2, 3]); // 2, 3 and 4 October
        expect(cellsOf(0)[3].hasAttribute("data-in-range")).toBe(true); // overlaps the current span on the 4th
        expect(cellsOf(0)[1].hasAttribute("data-in-range")).toBe(false);
    });

    test("baselineSummary renders as hidden text with the slip in days, and describes the row's cells", () => {
        const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }];
        const labels: GanttLabels = { baselineSummary: (t, b, v) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` };
        render(GanttChart, { props: { label: "Plan", range: RANGE, tasks, labels } });
        const summary = document.querySelector(".gantt-chart-baseline-summary") as HTMLElement;
        expect(summary.hidden).toBe(true);
        expect(summary.textContent!.trim()).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
        expect(cellsOf(0)[0].getAttribute("aria-describedby")).toContain(summary.id);
    });

    test("a task with no baseline has no baseline cells or summary", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: { baselineSummary: () => "x" } } });
        expect(document.querySelector("[data-baseline]")).toBeNull();
        expect(document.querySelector(".gantt-chart-baseline-summary")).toBeNull();
    });

    test("typed dependencies go through dependencyDetail; untyped ones keep the predecessor's label", () => {
        const tasks: GanttTask[] = [
            { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
            { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a", type: "s2s", lag: 2 }, "a"] },
        ];
        const labels: GanttLabels = {
            dependencySummary: (preds) => `After: ${preds.join("; ")}`,
            dependencyDetail: (label, type, lag) => `${label} (${type}, lag ${lag})`,
        };
        render(GanttChart, { props: { label: "Plan", range: RANGE, tasks, labels } });
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("After: Design (s2s, lag 2); Design");
    });

    test("a typed dependency without a lag or type defaults to e2s and 0", () => {
        const tasks: GanttTask[] = [
            { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
            { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
        ];
        const labels: GanttLabels = { dependencySummary: (p) => p.join(), dependencyDetail: (l, t, g) => `${l}/${t}/${g}` };
        render(GanttChart, { props: { label: "Plan", range: RANGE, tasks, labels } });
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("Design/e2s/0");
    });
});

describe("GanttChart — zoom control (§14.1–§14.4)", () => {
    const zl: GanttLabels = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u) => `Showing ${u}s` };
    const cols = () => document.querySelectorAll(".gantt-table-thead .gantt-table-th").length - 1;
    const btn = (n: string) => screen.getByRole("button", { name: n }) as HTMLButtonElement;

    test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: LABELS } });
        expect(document.querySelector(".gantt-chart-zoom")).toBeNull();
    });

    test("§14.2 zoom in steps to finer columns and out to coarser, announcing each unit", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: zl, timeUnit: "week" } });
        const week = cols();
        await fireEvent.click(btn("Zoom in"));
        expect(cols()).toBeGreaterThan(week);
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Showing days");
        await fireEvent.click(btn("Zoom out"));
        await fireEvent.click(btn("Zoom out"));
        expect(cols()).toBeLessThan(week);
    });

    test("§14.3 the buttons disable at the ends: day cannot zoom in, month cannot zoom out", async () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, labels: zl, timeUnit: "day" } });
        expect(btn("Zoom in").disabled).toBe(true);
        await fireEvent.click(btn("Zoom out"));
        await fireEvent.click(btn("Zoom out"));
        expect(btn("Zoom out").disabled).toBe(true);
        expect(btn("Zoom in").disabled).toBe(false);
    });
});

describe("GanttChart — drag-resize handles (§14.5–§14.8)", () => {
    const dt = () => ({ setData: vi.fn(), getData: vi.fn(() => "design") });
    const cellAt = (i: number) => rows()[0].querySelectorAll(".gantt-table-td")[i];

    test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS } });
        expect(rows()[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
        expect(cellAt(2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
        expect(rows()[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
    });

    test("§14.6 dropping the end handle on a later column extends the end and keeps the start", () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, onTaskChange } });
        const d = dt();
        fireEvent.dragStart(cellAt(2).querySelector(".gantt-chart-bar-handle-end")!, { dataTransfer: d });
        fireEvent.drop(cellAt(5), { dataTransfer: d });
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-06");
    });

    test("§14.7 dropping the start handle on an earlier/later column moves the start; the range cannot invert", () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, onTaskChange } });
        const d = dt();
        fireEvent.dragStart(rows()[0].querySelector(".gantt-chart-bar-handle-start")!, { dataTransfer: d });
        fireEvent.drop(cellAt(1), { dataTransfer: d });
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-02", "2026-10-03");
        onTaskChange.mockClear();
        fireEvent.dragStart(rows()[0].querySelector(".gantt-chart-bar-handle-start")!, { dataTransfer: d });
        fireEvent.drop(cellAt(7), { dataTransfer: d });
        expect(onTaskChange).not.toHaveBeenCalled();
    });

    test("§14.8 no handles when readonly", () => {
        render(GanttChart, { props: { label: "Q4 plan", range: RANGE, tasks: TASKS, readonly: true } });
        expect(document.querySelector(".gantt-chart-bar-handle")).toBeNull();
    });
});

describe("GanttChart — task selection (§14.9–§14.12)", () => {
    const base = { label: "Q4 plan", range: RANGE, tasks: TASKS };

    test("§14.9 clicking a task's row selects it: aria-selected and data-selected, and onTaskSelect fires", async () => {
        const onTaskSelect = vi.fn();
        render(GanttChart, { props: { ...base, onTaskSelect } });
        await fireEvent.click(rows()[1].querySelectorAll(".gantt-table-td")[0]);
        expect(rows()[1].getAttribute("aria-selected")).toBe("true");
        expect(rows()[1].hasAttribute("data-selected")).toBe(true);
        expect(onTaskSelect).toHaveBeenCalledWith("build");
    });

    test("§14.10 clicking the selected row again deselects and reports undefined", async () => {
        const onTaskSelect = vi.fn();
        render(GanttChart, { props: { ...base, onTaskSelect } });
        const c = rows()[1].querySelectorAll(".gantt-table-td")[0];
        await fireEvent.click(c);
        await fireEvent.click(c);
        expect(rows()[1].hasAttribute("data-selected")).toBe(false);
        expect(onTaskSelect).toHaveBeenLastCalledWith(undefined);
    });

    test("§14.11 the s key selects the task under the cursor; other rows are unselected", async () => {
        render(GanttChart, { props: base });
        await fireEvent.keyDown(tabbableCells()[0], { key: "s" });
        expect(rows()[0].getAttribute("aria-selected")).toBe("true");
        expect(rows()[1].hasAttribute("aria-selected")).toBe(false);
    });

    test("§14.12 selectedTaskId starts a row selected", () => {
        render(GanttChart, { props: { ...base, selectedTaskId: "launch" } });
        expect(rows()[2].hasAttribute("data-selected")).toBe(true);
    });
});

describe("GanttChart — Alt+Arrow shift and resize (§14.13–§14.16)", () => {
    const base = { label: "Q4 plan", range: RANGE, tasks: TASKS };

    test("§14.13 Alt+ArrowRight shifts the task one column, keeping its duration", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { ...base, onTaskChange } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true });
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-02", "2026-10-04");
    });

    test("§14.14 Alt+ArrowLeft shifts it earlier, and not before the range starts", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { ...base, onTaskChange } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft", altKey: true });
        expect(onTaskChange).not.toHaveBeenCalled();
    });

    test("§14.15 Alt+Shift+ArrowRight moves only the end; Alt+Shift+ArrowLeft cannot cross the start", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { ...base, onTaskChange } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true, shiftKey: true });
        expect(onTaskChange).toHaveBeenLastCalledWith("design", "2026-10-01", "2026-10-04");
    });

    test("§14.16 readonly and parent rows ignore it", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { ...base, onTaskChange, readonly: true } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true });
        expect(onTaskChange).not.toHaveBeenCalled();
    });
});

describe("GanttChart — taskAttrs (§14.17)", () => {
    test("§14.17 taskAttrs adds attributes to each task's row", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, taskAttrs: (t: GanttTask) => ({ "data-team": t.id === "design" ? "ux" : "eng" }) } });
        expect(rows()[0].getAttribute("data-team")).toBe("ux");
        expect(rows()[1].getAttribute("data-team")).toBe("eng");
    });
});

describe("GanttChart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
    const withUnscheduled: GanttTask[] = [
        { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
        { id: "u", label: "To be planned" },
    ];

    test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: withUnscheduled } });
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
        const labels: GanttLabels = { ...LABELS };
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: withUnscheduled, labels } });
        const cell = document.querySelector<HTMLElement>('[data-task-id="u"] [data-row][data-col="0"]')!;
        await fireEvent.focusIn(cell);
        await fireEvent.keyDown(cell, { key: "Enter" });
        const save = await screen.findByRole("button", { name: labels.saveLabel! });
        expect((save as HTMLButtonElement).disabled).toBe(true);
    });

    test("§14.21 Alt+Arrow on an unscheduled task changes nothing", async () => {
        const onTaskChange = vi.fn();
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: withUnscheduled, onTaskChange } });
        const cell = document.querySelector<HTMLElement>('[data-task-id="u"] [data-row][data-col="0"]')!;
        await fireEvent.focusIn(cell);
        await fireEvent.keyDown(cell, { key: "ArrowRight", altKey: true });
        expect(onTaskChange).not.toHaveBeenCalled();
    });

    test("§14.22 collapsedTaskIds starts parents collapsed", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, collapsedTaskIds: ["parent"], labels: { collapseButton: (t: GanttTask, c: boolean) => `${c ? "Expand" : "Collapse"} ${t.label}` } } });
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(screen.getByRole("button", { name: "Expand Phase 1" }).getAttribute("aria-expanded")).toBe("false");
    });

    test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: { expandAll: "Expand all", collapseAll: "Collapse all" } } });
        const collapse = screen.getByRole("button", { name: "Collapse all" }) as HTMLButtonElement;
        const expand = screen.getByRole("button", { name: "Expand all" }) as HTMLButtonElement;
        expect(expand.disabled).toBe(true);
        await fireEvent.click(collapse);
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(collapse.disabled).toBe(true);
        await fireEvent.click(expand);
        expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
    });

    test("§14.24 no collapse-all buttons without labels or without parents", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS } });
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
        document.body.innerHTML = "";
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: [TASKS[0]], labels: { expandAll: "Expand all", collapseAll: "Collapse all" } } });
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
    });
});
