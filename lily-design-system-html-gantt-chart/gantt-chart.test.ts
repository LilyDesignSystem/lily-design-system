import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Registers <date-time-picker> as a side effect (gantt-chart.ts imports
// it too, but the test file exercises the pure helpers directly first).
import "@lilydesignsystem/html-date-time-picker";

import {
    GanttChart,
    addDays,
    compareISO,
    effectiveRange,
    endOfMonth,
    flattenTasks,
    generateColumns,
} from "./gantt-chart.js";
import type { GanttLabels, GanttTask } from "./gantt-chart.js";

// Ensure the custom element is registered exactly once for the suite.
if (
    typeof customElements !== "undefined" &&
    !customElements.get("gantt-chart")
) {
    customElements.define("gantt-chart", GanttChart);
}

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

function mount(opts: {
    tasks?: GanttTask[];
    labels?: GanttLabels;
    today?: string;
    onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
}): GanttChart {
    const el = document.createElement("gantt-chart") as GanttChart;
    el.setAttribute("label", "Q4 plan");
    document.body.appendChild(el);
    el.range = RANGE;
    el.tasks = opts.tasks ?? TASKS;
    if (opts.labels) el.labels = opts.labels;
    if (opts.today) el.today = opts.today;
    if (opts.onTaskChange) el.onTaskChange = opts.onTaskChange;
    return el;
}

function tabbableCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.gantt-table-td[tabindex="0"]'));
}

function rows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"));
}

function press(el: Element, key: string, opts: KeyboardEventInit = {}): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

beforeEach(() => {
    document.body.replaceChildren();
});

afterEach(() => {
    document.body.replaceChildren();
});

// =====================================================================
// Pure helpers — civil-date arithmetic, column generation, hierarchy
// =====================================================================

describe("GanttChart — date arithmetic and column generation (§8.2)", () => {
    test("compareISO orders ISO date strings", () => {
        expect(compareISO("2026-10-01", "2026-10-02")).toBeLessThan(0);
        expect(compareISO("2026-10-02", "2026-10-01")).toBeGreaterThan(0);
        expect(compareISO("2026-10-01", "2026-10-01")).toBe(0);
    });

    test("addDays (reused from html-date-time-picker) is UTC-safe across a month boundary", () => {
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
        mount({});
        expect(document.querySelector(".gantt-chart")).toBeTruthy();
        expect(document.querySelector('[role="grid"]')!.getAttribute("aria-label")).toBe("Q4 plan");
    });

    test("§8.2 renders one column header per day across the range", () => {
        mount({ labels: LABELS });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers).toHaveLength(11); // 10 day columns + 1 leading blank column
    });

    test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
        mount({});
        const designRow = rows()[0];
        const cells = designRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
        expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
        expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
    });

    test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
        mount({});
        const launchRow = rows()[2];
        const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
        const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
        expect(milestoneCells).toHaveLength(1);
        expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
    });

    test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
        mount({});
        const buildRow = rows()[1];
        const bar = buildRow.querySelector(".gantt-chart-bar");
        expect(bar?.getAttribute("data-percent-complete")).toBe("40");
        expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
    });
});

describe("GanttChart — row hierarchy (§8.5, §8.6)", () => {
    test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
        mount({});
        const parentRow = rows()[3];
        const cells = parentRow.querySelectorAll(".gantt-table-td");
        expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
        expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
        expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
    });

    test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", () => {
        mount({ labels: LABELS });
        expect(rows()).toHaveLength(6);
        const collapseButton = document.querySelector('[aria-label="Collapse Phase 1"]') as HTMLButtonElement;
        expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
        click(collapseButton);
        expect(rows()).toHaveLength(4);
        expect(document.body.textContent).not.toContain("Child A");
        const expanded = document.querySelector('[aria-label="Expand Phase 1"]')!;
        expect(expanded.getAttribute("aria-expanded")).toBe("false");
    });
});

describe("GanttChart — dependencies (§8.7)", () => {
    test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
        mount({ labels: LABELS });
        const buildRow = rows()[1];
        const describedCell = buildRow.querySelector(".gantt-table-td[aria-describedby]");
        expect(describedCell).toBeTruthy();
        const id = describedCell!.getAttribute("aria-describedby")!;
        expect(document.getElementById(id)?.textContent).toBe("Blocked by: Design");
    });

    test("§8.7 a task with no dependencies carries no aria-describedby", () => {
        mount({ labels: LABELS });
        const designRow = rows()[0];
        expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
    });
});

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
    test("§8.8 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
        mount({});
        expect(tabbableCells()).toHaveLength(1);
        expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
    });

    test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
        mount({});
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

        press(tabbableCells()[0], "ArrowRight");
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        press(tabbableCells()[0], "ArrowLeft");
        press(tabbableCells()[0], "ArrowLeft");
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
    });
});

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
    test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        expect(document.querySelector('.date-time-picker-button[aria-label="Start date"]')).toBeTruthy();
        expect(document.querySelector('.date-time-picker-button[aria-label="End date"]')).toBeTruthy();
    });

    test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", () => {
        mount({});
        press(tabbableCells()[0], "Enter");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.9 Enter on a parent row does not open an edit region", () => {
        mount({ labels: LABELS });
        // Move focus down to the parent row (index 3).
        for (let i = 0; i < 3; i++) {
            press(tabbableCells()[0], "ArrowDown");
        }
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("3");
        press(tabbableCells()[0], "Enter");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.10 Save calls onTaskChange with the task's id and edited dates, then closes", () => {
        const onTaskChange = vi.fn();
        mount({ labels: LABELS, onTaskChange });
        press(tabbableCells()[0], "Enter");
        click(document.querySelector(".gantt-chart-save-button")!);
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.11 Cancel closes the edit region without calling onTaskChange", () => {
        const onTaskChange = vi.fn();
        mount({ labels: LABELS, onTaskChange });
        press(tabbableCells()[0], "Enter");
        click(document.querySelector(".gantt-chart-cancel-button")!);
        expect(onTaskChange).not.toHaveBeenCalled();
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("opening a task's edit region preserves the roving-tabindex cursor's own DOM node (targeted insert, not a rebuild)", () => {
        mount({ labels: LABELS });
        const cell = tabbableCells()[0];
        press(cell, "Enter");
        // Same DOM node still carries tabindex=0 and is still in the document.
        expect(tabbableCells()[0]).toBe(cell);
        expect(cell.isConnected).toBe(true);
    });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
    test("§8.12 dropping a task's bar on another column calls onTaskChange, preserving duration", () => {
        const onTaskChange = vi.fn();
        mount({ onTaskChange });
        const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
        const bar = rows()[0].querySelector(".gantt-chart-bar")!;
        bar.dispatchEvent(Object.assign(new Event("dragstart", { bubbles: true, cancelable: true }), { dataTransfer }));

        const targetCell = rows()[0].querySelectorAll(".gantt-table-td")[5]; // Oct 6
        targetCell.dispatchEvent(Object.assign(new Event("drop", { bubbles: true, cancelable: true }), { dataTransfer }));
        // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-06", "2026-10-08");
    });

    test("§8.13 a successful edit announces via labels.dateAnnouncement", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        click(document.querySelector(".gantt-chart-save-button")!);
        expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(
            "Design moved to 2026-10-01 - 2026-10-03",
        );
    });

    test("§8.14 `today` marks its column data-today; omitting it marks nothing", () => {
        mount({ today: "2026-10-05" });
        const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
        expect(headers[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
        document.body.replaceChildren();

        mount({});
        expect(document.querySelectorAll("[data-today]")).toHaveLength(0);
    });
});

describe("GanttChart — extra attributes and labels (§8.15, §8.16)", () => {
    test("§8.15 the custom element itself already carries any extra HTML attribute a consumer sets (no forwarding needed)", () => {
        const el = document.createElement("gantt-chart") as GanttChart;
        el.setAttribute("label", "Q4 plan");
        el.setAttribute("data-testid", "chart-root");
        document.body.appendChild(el);
        el.range = RANGE;
        el.tasks = TASKS;
        expect(document.querySelector('[data-testid="chart-root"]')).toBe(el);
    });

    test("§8.16 no collapse-button accessible name or dependency summary renders without a label", () => {
        mount({});
        // No unnamed button: without labels.collapseButton there is none at all.
        expect(document.querySelector(".gantt-chart-collapse-button")).toBeNull();
        const buildRow = rows()[1];
        expect(buildRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
    });
});

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
    function startField(): HTMLInputElement | null {
        return document.querySelector<HTMLInputElement>(".gantt-chart-edit-row .date-time-picker-input");
    }

    function editButton(className: string): HTMLButtonElement {
        return document.querySelector<HTMLButtonElement>(`.gantt-chart-edit-row button.${className}`)!;
    }

    test("§8.17 depth is a data-depth attribute, never an inline style", () => {
        mount({});
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

    test("§8.6 collapsing keeps focus on the collapse button and one cell tabbable", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "End", { ctrlKey: true });
        expect(tabbableCells()[0].getAttribute("data-row")).toBe("5");
        const collapse = document.querySelector<HTMLElement>('[aria-label="Collapse Phase 1"]')!;
        collapse.focus();
        click(collapse);
        expect(rows()).toHaveLength(4);
        expect(tabbableCells()).toHaveLength(1);
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Expand Phase 1");
    });

    test("§8.8 focusing a cell by pointer moves the cursor there", () => {
        mount({});
        const cell = rows()[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
        cell.focus();
        expect(tabbableCells()).toEqual([cell]);
    });

    test("§8.9 opening the edit region moves focus to the start date's field", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        expect(document.activeElement).toBe(startField());
    });

    test("§8.11 Escape cancels the edit region and returns focus to the task's cell", () => {
        const onTaskChange = vi.fn();
        mount({ labels: LABELS, onTaskChange });
        press(tabbableCells()[0], "Enter");
        press(startField()!, "Escape");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(onTaskChange).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(tabbableCells()[0]);
    });

    test("§8.10 Save returns focus to the grid, even when the consumer's update rebuilds it", () => {
        const el = mount({ labels: LABELS });
        el.onTaskChange = (id, start, end) => {
            el.tasks = TASKS.map((t) => (t.id === id ? { ...t, start, end } : t));
        };
        press(tabbableCells()[0], "Enter");
        click(editButton("gantt-chart-save-button"));
        expect(document.activeElement).toBe(tabbableCells()[0]);
    });

    test("§8.10 a range entered end-first is saved start-first", () => {
        const onTaskChange = vi.fn();
        mount({ labels: LABELS, onTaskChange });
        press(tabbableCells()[0], "Enter");
        const field = startField()!;
        field.value = "2026-10-09";
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new FocusEvent("blur"));
        click(editButton("gantt-chart-save-button"));
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-03", "2026-10-09");
    });

    test("§8.16 the edit region does not open without its labels", () => {
        mount({ labels: { dateTimePickerLabels: DTP_LABELS } });
        press(tabbableCells()[0], "Enter");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    });

    test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
        mount({ labels: { ...LABELS, taskColumnHeader: "Task" } });
        expect(document.querySelector(".gantt-table-thead .gantt-table-th")?.textContent).toBe("Task");
    });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
    const heads = () => Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);
    const bodyRows = () => Array.from(document.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"));
    const key = (el: Element, k: string, opts: KeyboardEventInit = {}) =>
        el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...opts }));
    const tabbable = () => Array.from(document.querySelectorAll<HTMLElement>('.gantt-table-td[tabindex="0"]'));

    test("markers mark the containing column, and a marker label renders as text", () => {
        const el = mount({ labels: LABELS });
        el.markers = [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }];
        expect(heads()[4].getAttribute("data-marker")).toBe("holiday");
        expect(heads()[4].textContent).toContain("Bank holiday");
        expect(heads()[3].hasAttribute("data-marker")).toBe(false);
        expect(document.querySelectorAll(".gantt-table-td[data-marker]").length).toBe(bodyRows().length);
    });

    test("isNonWorking marks a column only when every day in it is non-working", () => {
        const el = mount({});
        el.isNonWorking = (d) => d === "2026-10-03" || d === "2026-10-04";
        expect(heads()[2].hasAttribute("data-non-working")).toBe(true);
        expect(heads()[3].hasAttribute("data-non-working")).toBe(true);
        expect(heads()[1].hasAttribute("data-non-working")).toBe(false);
    });

    test("week columns are non-working only if all seven days are", () => {
        const el = mount({});
        el.timeUnit = "week";
        el.isNonWorking = (d) => d === "2026-10-03";
        expect(document.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
    });

    test("task type, critical and slack become data attributes on the row", () => {
        mount({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 }] });
        const row = bodyRows()[0];
        expect(row.getAttribute("data-task-type")).toBe("design");
        expect(row.hasAttribute("data-critical")).toBe(true);
        expect(row.getAttribute("data-slack")).toBe("2");
    });

    test("readonly: no edit region, no drag, navigation and collapse still work", () => {
        const el = mount({ labels: LABELS });
        el.readonly = true;
        key(tabbable()[0], "Enter");
        expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
        expect(document.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
        expect(document.querySelector(".gantt-chart")!.hasAttribute("data-readonly")).toBe(true);
        key(tabbable()[0], "ArrowRight");
        expect(tabbable()[0].getAttribute("data-col")).toBe("1");
        (document.querySelector('[aria-label="Collapse Phase 1"]') as HTMLElement).click();
        expect(document.querySelector('[aria-label="Expand Phase 1"]')).toBeTruthy();
    });
});

describe("gantt-chart — progress field, baselines, typed dependencies", () => {
    const cellsOf = (i: number) => Array.from(rows()[i].querySelectorAll<HTMLElement>(".gantt-table-td"));
    const percentLabels: GanttLabels = { ...LABELS, percentLabel: "Percent complete" };
    const percentInput = () => document.querySelector(".gantt-chart-percent-input") as HTMLInputElement | null;
    const setPercent = (v: string) => {
        percentInput()!.value = v;
    };

    test("percentLabel adds a progress field to the edit region; without it none renders", () => {
        mount({ labels: LABELS });
        press(tabbableCells()[0], "Enter");
        expect(percentInput()).toBeNull();
        document.body.replaceChildren();
        mount({ labels: percentLabels });
        press(tabbableCells()[0], "Enter");
        expect(percentInput()).toBeTruthy();
        expect(percentInput()!.closest("label")!.textContent).toContain("Percent complete");
    });

    test("the progress field starts at the task's percentComplete and Save passes the new value as a 4th argument", () => {
        const onTaskChange = vi.fn();
        mount({ labels: percentLabels, onTaskChange });
        press(tabbableCells()[0], "ArrowDown");
        press(tabbableCells()[0], "Enter");
        expect(percentInput()!.value).toBe("40");
        setPercent("75");
        click(document.querySelector(".gantt-chart-save-button")!);
        expect(onTaskChange).toHaveBeenCalledWith("build", "2026-10-04", "2026-10-06", 75);
    });

    test("progress is clamped to 0–100", () => {
        const onTaskChange = vi.fn();
        mount({ labels: percentLabels, onTaskChange });
        press(tabbableCells()[0], "Enter");
        setPercent("250");
        click(document.querySelector(".gantt-chart-save-button")!);
        expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03", 100);
    });

    test("without percentLabel Save keeps the three-argument call", () => {
        const onTaskChange = vi.fn();
        mount({ labels: LABELS, onTaskChange });
        press(tabbableCells()[0], "Enter");
        click(document.querySelector(".gantt-chart-save-button")!);
        expect(onTaskChange.mock.calls[0]).toHaveLength(3);
    });

    test("a baseline marks the cells it covers with data-baseline, apart from the current span", () => {
        mount({ tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }] });
        const withBaseline = cellsOf(0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
        expect(withBaseline).toEqual([1, 2, 3]);
        expect(cellsOf(0)[3].hasAttribute("data-in-range")).toBe(true);
        expect(cellsOf(0)[1].hasAttribute("data-in-range")).toBe(false);
    });

    test("baselineSummary renders as hidden text with the slip in days, and describes the row's cells", () => {
        mount({
            tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }],
            labels: { baselineSummary: (t, b, v) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` },
        });
        const summary = document.querySelector(".gantt-chart-baseline-summary") as HTMLElement;
        expect(summary.hidden).toBe(true);
        expect(summary.textContent).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
        expect(cellsOf(0)[0].getAttribute("aria-describedby")).toContain(summary.id);
    });

    test("a task with no baseline has no baseline cells or summary", () => {
        mount({ labels: { baselineSummary: () => "x" } });
        expect(document.querySelector("[data-baseline]")).toBeNull();
        expect(document.querySelector(".gantt-chart-baseline-summary")).toBeNull();
    });

    test("typed dependencies go through dependencyDetail; untyped ones keep the predecessor's label", () => {
        mount({
            tasks: [
                { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
                { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a", type: "s2s", lag: 2 }, "a"] },
            ],
            labels: {
                dependencySummary: (p) => `After: ${p.join("; ")}`,
                dependencyDetail: (l, t, g) => `${l} (${t}, lag ${g})`,
            },
        });
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent).toBe("After: Design (s2s, lag 2); Design");
    });

    test("a typed dependency without a lag or type defaults to e2s and 0", () => {
        mount({
            tasks: [
                { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
                { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
            ],
            labels: { dependencySummary: (p) => p.join(), dependencyDetail: (l, t, g) => `${l}/${t}/${g}` },
        });
        expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent).toBe("Design/e2s/0");
    });
});

describe("gantt-chart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
    const zl: GanttLabels = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u) => `Showing ${u}s` };
    const cols = () => document.querySelectorAll(".gantt-table-thead .gantt-table-th").length - 1;
    const btn = (n: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === n) as HTMLButtonElement;
    const cellAt = (i: number) => rows()[0].querySelectorAll(".gantt-table-td")[i] as HTMLElement;
    const dragEvent = (type: string) => {
        const e = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(e, "dataTransfer", { value: { setData: () => {}, getData: () => "design" } });
        return e;
    };

    test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", () => {
        mount({ labels: LABELS });
        expect(document.querySelector(".gantt-chart-zoom")).toBeNull();
    });

    test("§14.2 zoom out steps to coarser columns, announcing each unit; §14.3 buttons disable at the ends", () => {
        mount({ labels: zl });
        expect(btn("Zoom in").disabled).toBe(true);
        const day = cols();
        click(btn("Zoom out"));
        expect(cols()).toBeLessThan(day);
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Showing weeks");
        click(btn("Zoom out"));
        expect(btn("Zoom out").disabled).toBe(true);
        expect(btn("Zoom in").disabled).toBe(false);
    });

    test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", () => {
        mount({});
        expect(rows()[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
        expect(cellAt(2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
        expect(rows()[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
        document.body.replaceChildren();
        const ro = mount({});
        ro.readonly = true;
        expect(document.querySelector(".gantt-chart-bar-handle")).toBeNull();
    });

    test("§14.6 the end handle extends the end; §14.7 the start handle moves the start and the range cannot invert", () => {
        const onTaskChange = vi.fn();
        mount({ onTaskChange });
        cellAt(2).querySelector(".gantt-chart-bar-handle-end")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(5).dispatchEvent(dragEvent("drop"));
        rows()[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(1).dispatchEvent(dragEvent("drop"));
        rows()[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart"));
        cellAt(7).dispatchEvent(dragEvent("drop"));
        expect(onTaskChange.mock.calls).toEqual([
            ["design", "2026-10-01", "2026-10-06"],
            ["design", "2026-10-02", "2026-10-03"],
        ]);
    });

    test("§14.9 clicking a row selects it; §14.10 again deselects; §14.11 the s key selects; §14.12 selectedTaskId starts selected", () => {
        const onTaskSelect = vi.fn();
        const el = mount({});
        el.onTaskSelect = onTaskSelect;
        const c = rows()[1].querySelectorAll(".gantt-table-td")[0];
        click(c);
        expect(rows()[1].getAttribute("aria-selected")).toBe("true");
        expect(rows()[1].hasAttribute("data-selected")).toBe(true);
        click(rows()[1].querySelectorAll(".gantt-table-td")[0]);
        expect(rows()[1].hasAttribute("data-selected")).toBe(false);
        expect(onTaskSelect.mock.calls).toEqual([["build"], [undefined]]);
        press(tabbableCells()[0], "s");
        expect(rows()[0].getAttribute("aria-selected")).toBe("true");
        document.body.replaceChildren();
        const g = mount({});
        g.selectedTaskId = "launch";
        expect(rows()[2].hasAttribute("data-selected")).toBe(true);
    });

    test("§14.13–§14.16 Alt+Arrow shifts, Alt+Shift+Arrow moves the end, not before the range, readonly ignores", () => {
        const onTaskChange = vi.fn();
        mount({ onTaskChange });
        press(tabbableCells()[0], "ArrowLeft", { altKey: true });
        expect(onTaskChange).not.toHaveBeenCalled();
        press(tabbableCells()[0], "ArrowRight", { altKey: true });
        press(tabbableCells()[0], "ArrowRight", { altKey: true, shiftKey: true });
        expect(onTaskChange.mock.calls).toEqual([
            ["design", "2026-10-02", "2026-10-04"],
            ["design", "2026-10-01", "2026-10-04"],
        ]);
        document.body.replaceChildren();
        const ro = vi.fn();
        const g = mount({ onTaskChange: ro });
        g.readonly = true;
        press(tabbableCells()[0], "ArrowRight", { altKey: true });
        expect(ro).not.toHaveBeenCalled();
    });

    test("§14.17 taskAttrs adds attributes to each task's row", () => {
        const el = mount({});
        el.taskAttrs = (t) => ({ "data-team": t.id === "design" ? "ux" : "eng" });
        expect(rows()[0].getAttribute("data-team")).toBe("ux");
        expect(rows()[1].getAttribute("data-team")).toBe("eng");
    });
});

describe("gantt-chart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
    const withUnscheduled: GanttTask[] = [
        { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
        { id: "u", label: "To be planned" },
    ];
    const unscheduledCell = () => document.querySelector<HTMLElement>('[data-task-id="u"] [data-row][data-col="0"]')!;
    const byLabel = (name: string) =>
        Array.from(document.querySelectorAll("button")).find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name) as HTMLButtonElement;

    test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
        mount({ tasks: withUnscheduled });
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

    test("§14.20 Enter on an unscheduled task opens the edit region with empty dates; Save is disabled until both are set", () => {
        mount({ tasks: withUnscheduled, labels: LABELS });
        unscheduledCell().dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        press(unscheduledCell(), "Enter");
        expect(byLabel("Save").disabled).toBe(true);
    });

    test("§14.21 Alt+Arrow on an unscheduled task changes nothing", () => {
        const onTaskChange = vi.fn();
        mount({ tasks: withUnscheduled, onTaskChange });
        unscheduledCell().dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        press(unscheduledCell(), "ArrowRight", { altKey: true });
        expect(onTaskChange).not.toHaveBeenCalled();
    });

    test("§14.22 collapsedTaskIds starts parents collapsed and the change is reported", () => {
        const el = mount({ labels: LABELS });
        el.collapsedTaskIds = ["parent"];
        const onChange = vi.fn();
        el.onCollapsedTaskIdsChange = onChange;
        const events: string[][] = [];
        el.addEventListener("collapsechange", (e) => events.push((e as CustomEvent).detail));
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(byLabel("Expand Phase 1").getAttribute("aria-expanded")).toBe("false");
        click(byLabel("Expand Phase 1"));
        expect(onChange).toHaveBeenCalledWith([]);
        expect(events).toEqual([[]]);
        expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
    });

    test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", () => {
        mount({ labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
        expect(byLabel("Expand all").disabled).toBe(true);
        click(byLabel("Collapse all"));
        expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
        expect(byLabel("Collapse all").disabled).toBe(true);
        click(byLabel("Expand all"));
        expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
    });

    test("§14.24 no collapse-all buttons without labels or without parents", () => {
        mount({});
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
        document.body.innerHTML = "";
        mount({ tasks: [TASKS[0]], labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
        expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
    });
});

// ---- A small harness for the ported typed-fields suite: real DOM events on a real element ----
function render(props: Record<string, unknown>): HTMLElement & Record<string, unknown> {
    const el = document.createElement("gantt-chart") as HTMLElement & Record<string, unknown>;
    el.setAttribute("label", (props["label"] as string) ?? "Test");
    document.body.appendChild(el);
    for (const [key, value] of Object.entries(props)) {
        if (key === "label") continue;
        el[key] = value;
    }
    return el;
}

function cleanup(): void {
    document.body.replaceChildren();
}

const fireEvent = {
    async click(el: Element) { (el as HTMLElement).click(); await Promise.resolve(); },
    async input(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("input", { bubbles: true })); await Promise.resolve(); },
    async change(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("change", { bubbles: true })); await Promise.resolve(); },
    async keyDown(el: Element, init: KeyboardEventInit & { keyCode?: number }) { el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })); await Promise.resolve(); },
    async scroll(el: Element) { el.dispatchEvent(new Event("scroll")); await Promise.resolve(); },
};

async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
    const deadline = Date.now() + timeout;
    for (;;) {
        try {
            assertion();
            return;
        } catch (error) {
            if (Date.now() > deadline) throw error;
            await new Promise((r) => setTimeout(r, 0));
        }
    }
}

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
        render(base);
        const heads = Array.from(document.querySelectorAll(".gantt-table-thead th")).slice(0, 3).map((e) => e.textContent?.trim());
        expect(heads).toEqual(["", "Owner", "Points"]);
        const cells = rowOf("t1").querySelectorAll("[data-field]");
        expect(Array.from(cells).map((c) => c.textContent?.trim())).toEqual(["Ann", "3"]);
    });

    test("§14.26 fields are plain text without onFieldEdit and in a readonly chart", () => {
        render(base);
        expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, onFieldEdit: vi.fn(), readonly: true });
        expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
    });

    test("§14.27 clicking a value opens a typed editor; Enter commits the parsed value and announces", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit, labels: EXPORT_LABELS });
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
        render({ ...base, onFieldEdit });
        await fireEvent.click(rowOf("t2").querySelectorAll<HTMLElement>(".gantt-chart-field-button")[0]);
        await fireEvent.change(document.querySelector("select.gantt-chart-field-editor")!, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t2", fieldId: "owner", value: "b", previous: undefined });
    });

    test("§14.29 Escape cancels; an unchanged value reports nothing", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit });
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
        render({ ...base, fields: [{ id: "p", header: "P", type: "number", parse: () => Number.NaN }], tasks: [{ ...FT[0], values: { p: 1 } }], onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(document.querySelector(".gantt-chart-field-button")!);
        await fireEvent.keyDown(document.querySelector(".gantt-chart-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".gantt-chart-field-editor")).not.toBeNull();
        expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Design: bad P");
    });

    test("§14.31 F2 on a timeline cell edits the row's first editable field; Tab commits and moves to the next", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit });
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
        render({ ...base, fields: [{ id: "n", header: "N" }], tasks: [{ ...FT[0], values: { n: "a" } }], onFieldEdit });
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
        const onExport = vi.fn((_file: { format: string; filename: string; taskCount: number; blob: Blob }) => false as const);
        render({ ...base, labels: EXPORT_LABELS, onExport, ...props });
        await fireEvent.click(document.querySelector(`[data-gantt-export-format="${format}"]`)!);
        const file = onExport.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text };
    }

    test("§14.33 export buttons need a label and exportHeaders; each label gates its button", () => {
        render(base);
        expect(document.querySelector(".gantt-chart-export")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, labels: { exportCsv: "CSV" } });
        expect(document.querySelector(".gantt-chart-export")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, labels: { export: "Export", exportExcel: "Excel", exportHeaders: EXPORT_LABELS.exportHeaders } });
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

    test("§14.37 saving announces unless onExport returns false; no tasks disables the buttons", async () => {
        const created: Blob[] = [];
        const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
        URL.revokeObjectURL = () => {};
        try {
            render({ ...base, labels: EXPORT_LABELS });
            await fireEvent.click(document.querySelector('[data-gantt-export-format="tsv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("4 tasks as tsv: gantt-chart.tsv");
            document.body.innerHTML = "";
            render({ ...base, tasks: [], labels: EXPORT_LABELS });
            expect((document.querySelector('[data-gantt-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });

    const MANY: GanttTask[] = Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, label: `Task ${i}`, start: "2026-10-01", end: "2026-10-02" }));

    test("§14.38 virtualize renders only the rows in view plus spacers, with aria-rowcount and aria-rowindex", () => {
        render({ label: "Q4", range: RANGE, tasks: MANY, virtualize: { rowHeight: 20, height: 100, overscan: 1 } });
        const rendered = document.querySelectorAll("[data-task-id]").length;
        expect(rendered).toBeGreaterThan(0);
        expect(rendered).toBeLessThan(20);
        expect(document.querySelector(".gantt-table")!.getAttribute("aria-rowcount")).toBe("201");
        expect(document.querySelector('[data-task-id="r0"]')!.getAttribute("aria-rowindex")).toBe("2");
        expect(document.querySelector(".gantt-chart-spacer")).not.toBeNull();
        expect(document.querySelector(".gantt-chart-scroll")!.getAttribute("style")).toContain("height: 100px");
    });

    test("§14.39 scrolling brings later rows in; keyboard focus to the last row reveals it", async () => {
        render({ label: "Q4", range: RANGE, tasks: MANY, virtualize: { rowHeight: 20, height: 100 } });
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
        render({ label: "Q4", range: RANGE, tasks: MANY });
        expect(document.querySelectorAll("[data-task-id]")).toHaveLength(200);
        expect(tabbableCells()).toHaveLength(1);
    });
});

// =====================================================================
// §17 weekend shading and dependency arrows (0.6.0)
// =====================================================================

describe("weekend shading and dependency arrows", () => {
    const headText = () => Array.from(document.querySelectorAll("thead th[data-weekend]")).map((h) => h.textContent?.trim());
    const base = { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS };

    // 2026-10-03 is a Saturday, 2026-10-04 a Sunday.
    test("§17.1 weekends marks day columns on the header and every cell, and nothing without it", () => {
        render({ ...base, weekends: [0, 6] });
        expect(headText()).toEqual(["2026-10-03", "2026-10-04", "2026-10-10"]);
        expect(document.querySelectorAll("tbody td[data-weekend]")).toHaveLength(3 * TASKS.length);
    });

    test("§17.2 with no weekends nothing is shaded, and the weekend is never defaulted", () => {
        render(base);
        expect(document.querySelector("[data-weekend]")).toBeNull();
    });

    test("§17.3 a Friday-Saturday weekend shades those days instead", () => {
        render({ ...base, weekends: [5, 6] });
        expect(headText()).toEqual(["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10"]);
    });

    test("§17.4 week and month columns are not marked", () => {
        render({ ...base, range: { start: "2026-10-01", end: "2026-12-31" }, weekends: [0, 6], timeUnit: "week" });
        expect(document.querySelector("[data-weekend]")).toBeNull();
    });

    test("§17.5 weekends can combine with isNonWorking", () => {
        render({ ...base, weekends: [6], isNonWorking: (d: string) => d === "2026-10-03" });
        const th = Array.from(document.querySelectorAll("thead th")).find((h) => h.textContent?.trim() === "2026-10-03")!;
        expect(th.hasAttribute("data-weekend") && th.hasAttribute("data-non-working")).toBe(true);
    });

    function stubLayout(): () => void {
        const original = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function (this: Element) {
            const cell = this.closest("td[data-col]") as HTMLElement | null;
            if (!cell) return original.call(this);
            const col = Number(cell.dataset["col"]);
            const row = Number(cell.dataset["row"]);
            return { left: col * 20, right: col * 20 + 20, top: row * 20, bottom: row * 20 + 20, width: 20, height: 20, x: col * 20, y: row * 20, toJSON() {} } as DOMRect;
        };
        return () => {
            Element.prototype.getBoundingClientRect = original;
        };
    }

    test("§17.6 dependencyArrows draws one aria-hidden arrow per dependency, from the predecessor's end to the dependent's start", () => {
        const restore = stubLayout();
        try {
            render({ ...base, dependencyArrows: true });
            const arrows = document.querySelectorAll(".gantt-chart-dependency-arrow");
            expect(arrows).toHaveLength(1);
            expect(document.querySelector(".gantt-chart-dependency-arrows")!.getAttribute("aria-hidden")).toBe("true");
            expect(arrows[0].getAttribute("data-from")).toBe("design");
            expect(arrows[0].getAttribute("data-to")).toBe("build");
            expect(arrows[0].getAttribute("data-dependency-type")).toBe("e2s");
            expect(arrows[0].getAttribute("d")).toBe("M60 10H68V19H52V30H60");
        } finally {
            restore();
        }
    });

    test("§17.7 the dependency stays available as text however the arrows are drawn", () => {
        const restore = stubLayout();
        try {
            render({ ...base, dependencyArrows: true });
            expect(document.querySelector(".gantt-chart-dependency-summary")?.textContent?.trim()).toBe("Blocked by: Design");
        } finally {
            restore();
        }
    });

    test("§17.8 typed dependencies use their own edges, and a missing predecessor draws nothing", () => {
        const restore = stubLayout();
        try {
            const tasks: GanttTask[] = [
                { id: "a", label: "A", start: "2026-10-01", end: "2026-10-03" },
                { id: "b", label: "B", start: "2026-10-05", end: "2026-10-06", dependsOn: [{ id: "a", type: "s2s" }, { id: "ghost" }] },
            ];
            render({ ...base, tasks, dependencyArrows: true });
            const arrows = document.querySelectorAll(".gantt-chart-dependency-arrow");
            expect(arrows).toHaveLength(1);
            expect(arrows[0].getAttribute("data-dependency-type")).toBe("s2s");
        } finally {
            restore();
        }
    });

    test("§17.9 without dependencyArrows there is no overlay", () => {
        render(base);
        expect(document.querySelector(".gantt-chart-dependency-arrows")).toBeNull();
    });

    test("§17.10 collapsing a parent removes the arrows that touched its children", () => {
        const restore = stubLayout();
        try {
            const tasks: GanttTask[] = [
                { id: "p", label: "P", start: "2026-10-01", end: "2026-10-04" },
                { id: "c", label: "C", start: "2026-10-01", end: "2026-10-02", parentId: "p" },
                { id: "d", label: "D", start: "2026-10-05", end: "2026-10-06", dependsOn: ["c"] },
            ];
            render({ ...base, tasks, dependencyArrows: true, collapsedTaskIds: ["p"] });
            expect(document.querySelectorAll("[data-task-id]").length).toBe(2);
            expect(document.querySelector(".gantt-chart-dependency-arrow")).toBeNull();
        } finally {
            restore();
        }
    });
});

