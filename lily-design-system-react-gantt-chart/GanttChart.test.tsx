import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import GanttChart, {
  compareISO,
  effectiveRange,
  endOfMonth,
  flattenTasks,
  generateColumns,
} from "./GanttChart";
import type { GanttLabels, GanttTask } from "./GanttChart";

afterEach(() => {
  cleanup();
});

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

  test("generateColumns is UTC-safe across a month boundary ('day' unit)", () => {
    const columns = generateColumns({ start: "2026-10-30", end: "2026-11-02" }, "day");
    expect(columns.map((c) => c.start)).toEqual([
      "2026-10-30",
      "2026-10-31",
      "2026-11-01",
      "2026-11-02",
    ]);
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
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    expect(document.querySelector(".gantt-chart")).toBeTruthy();
    expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Q4 plan");
  });

  test("§8.2 renders one column header per day across the range", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
    expect(headers).toHaveLength(11); // 10 day columns + 1 leading blank column
  });

  test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const designRow = rows()[0];
    const cells = designRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
    expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
    expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
  });

  test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const launchRow = rows()[2];
    const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
    const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
    expect(milestoneCells).toHaveLength(1);
    expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
  });

  test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const buildRow = rows()[1];
    const bar = buildRow.querySelector(".gantt-chart-bar");
    expect(bar?.getAttribute("data-percent-complete")).toBe("40");
    expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
  });
});

describe("GanttChart — row hierarchy (§8.5, §8.6)", () => {
  test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const parentRow = rows()[3];
    const cells = parentRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
    expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
    expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
  });

  test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    expect(rows()).toHaveLength(6);
    const collapseButton = screen.getByRole("button", { name: "Collapse Phase 1" });
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(collapseButton);
    expect(rows()).toHaveLength(4);
    expect(screen.queryByText("Child A")).toBeNull();
    expect(screen.getByRole("button", { name: "Expand Phase 1" }).getAttribute("aria-expanded")).toBe("false");
  });
});

describe("GanttChart — dependencies (§8.7)", () => {
  test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    const buildRow = rows()[1];
    const describedCell = buildRow.querySelector(".gantt-table-td[aria-describedby]");
    expect(describedCell).toBeTruthy();
    const id = describedCell!.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)?.textContent).toBe("Blocked by: Design");
  });

  test("§8.7 a task with no dependencies carries no aria-describedby", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    const designRow = rows()[0];
    expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
  });
});

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
  test("§8.8 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    expect(tabbableCells()).toHaveLength(1);
    expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
  });

  test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
  });
});

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
  test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(screen.getByRole("button", { name: "Start date" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "End date" })).toBeTruthy();
  });

  test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.9 Enter on a parent row does not open an edit region", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    // Move focus down to the parent row (index 3).
    for (let i = 0; i < 3; i++) {
      fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
    }
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("3");
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.10 Save calls onTaskChange with the task's id and edited dates, then closes", () => {
    const onTaskChange = vi.fn();
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} onTaskChange={onTaskChange} />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.11 Cancel closes the edit region without calling onTaskChange", () => {
    const onTaskChange = vi.fn();
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} onTaskChange={onTaskChange} />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
  test("§8.12 dropping a task's bar on another column calls onTaskChange, preserving duration", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} onTaskChange={onTaskChange} />);
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
    const bar = rows()[0].querySelector(".gantt-chart-bar")!;
    fireEvent.dragStart(bar, { dataTransfer });

    const targetCell = rows()[0].querySelectorAll(".gantt-table-td")[5]; // Oct 6
    fireEvent.drop(targetCell, { dataTransfer });
    // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-06", "2026-10-08");
  });

  test("§8.13 a successful edit announces via labels.dateAnnouncement", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(
      "Design moved to 2026-10-01 - 2026-10-03",
    );
  });

  test("§8.14 `today` marks its column data-today; omitting it marks nothing", () => {
    const { unmount } = render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} today="2026-10-05" />,
    );
    const headers = document.querySelectorAll(".gantt-table-thead .gantt-table-th");
    expect(headers[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
    unmount();

    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    expect(document.querySelectorAll("[data-today]")).toHaveLength(0);
  });
});

describe("GanttChart — extra attributes (§8.15)", () => {
  test("§8.15 extra attributes spread onto the root", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} data-testid="chart-root" />);
    expect(document.querySelector('[data-testid="chart-root"]')).toBeTruthy();
  });
});

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
  test("mounting the chart does not take focus from the page", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    expect(document.activeElement).toBe(document.body);
  });

  test("§8.17 depth is a data-depth attribute, never an inline style", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const headers = Array.from(
      document.querySelectorAll<HTMLElement>(".gantt-table-tbody .gantt-table-th"),
    );
    expect(headers.map((h) => h.dataset.depth)).toEqual(["0", "0", "0", "0", "1", "1"]);
    expect(headers.filter((h) => h.hasAttribute("style"))).toHaveLength(0);
  });

  test("§8.17 a task whose parentId names no task renders as a top-level row", () => {
    const orphan: GanttTask = {
      id: "orphan",
      label: "Orphan",
      start: "2026-10-02",
      end: "2026-10-02",
      parentId: "gone",
    };
    expect(flattenTasks([...TASKS, orphan], new Set()).map((r) => r.task.id)).toContain("orphan");
  });

  test("§8.17 a parentId cycle does not recurse forever", () => {
    const cycle: GanttTask[] = [
      { id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", parentId: "b" },
      { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", parentId: "a" },
    ];
    expect(() => effectiveRange(cycle[0], cycle)).not.toThrow();
  });

  test("§8.8 when collapsing removes the row under the cursor, one cell stays tabbable", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "End", ctrlKey: true });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("5");
    fireEvent.click(screen.getByRole("button", { name: "Collapse Phase 1" }));
    expect(rows()).toHaveLength(4);
    expect(tabbableCells()).toHaveLength(1);
  });

  test("§8.8 focusing a cell by pointer moves the cursor there", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} />);
    const cell = rows()[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
    fireEvent.focus(cell);
    expect(tabbableCells()).toEqual([cell]);
  });

  test("§8.9 opening the edit region moves focus to the start date's field", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.activeElement).toBe(
      document.querySelector(".gantt-chart-edit-row .date-time-picker-input"),
    );
  });

  test("§8.11 Escape cancels the edit region and returns focus to the task's cell", () => {
    const onTaskChange = vi.fn();
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} onTaskChange={onTaskChange} />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const field = document.querySelector<HTMLElement>(".gantt-chart-edit-row .date-time-picker-input")!;
    fireEvent.keyDown(field, { key: "Escape" });
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(tabbableCells()[0]);
  });

  test("§8.10 Save returns focus to the grid", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(document.activeElement).toBe(tabbableCells()[0]);
  });

  test("§8.10 a range entered end-first is saved start-first", () => {
    const onTaskChange = vi.fn();
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} onTaskChange={onTaskChange} />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const [startField] = document.querySelectorAll<HTMLInputElement>(
      ".gantt-chart-edit-row .date-time-picker-input",
    );
    fireEvent.change(startField, { target: { value: "2026-10-09" } });
    fireEvent.blur(startField);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-03", "2026-10-09");
  });

  test("§8.16 controls whose labels are absent do not render unnamed", () => {
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={{ dateTimePickerLabels: DTP_LABELS }} />,
    );
    expect(document.querySelector(".gantt-chart-collapse-button")).toBeNull();
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={{ ...LABELS, taskColumnHeader: "Task" }} />,
    );
    expect(document.querySelector(".gantt-table-thead .gantt-table-th")?.textContent).toBe("Task");
  });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
  const heads = () =>
    Array.from(document.querySelectorAll(".gantt-table-thead .gantt-table-th")).slice(1);

  test("markers mark the containing column, and a marker label renders as text", () => {
    render(
      <GanttChart
        label="Q4 plan"
        range={RANGE}
        tasks={TASKS}
        labels={LABELS}
        markers={[{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }]}
      />,
    );
    expect(heads()[4].getAttribute("data-marker")).toBe("holiday");
    expect(heads()[4].textContent).toContain("Bank holiday");
    expect(heads()[3].hasAttribute("data-marker")).toBe(false);
    expect(document.querySelectorAll(".gantt-table-td[data-marker]").length).toBe(rows().length);
  });

  test("isNonWorking marks a column only when every day in it is non-working", () => {
    const weekend = (d: string) => d === "2026-10-03" || d === "2026-10-04";
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} isNonWorking={weekend} />);
    expect(heads()[2].hasAttribute("data-non-working")).toBe(true);
    expect(heads()[3].hasAttribute("data-non-working")).toBe(true);
    expect(heads()[1].hasAttribute("data-non-working")).toBe(false);
  });

  test("week columns are non-working only if all seven days are", () => {
    render(
      <GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} timeUnit="week" isNonWorking={(d) => d === "2026-10-03"} />,
    );
    expect(document.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
  });

  test("task type, critical and slack become data attributes on the row", () => {
    const tasks: GanttTask[] = [
      { id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 },
    ];
    render(<GanttChart label="Plan" range={RANGE} tasks={tasks} />);
    const row = rows()[0];
    expect(row.getAttribute("data-task-type")).toBe("design");
    expect(row.hasAttribute("data-critical")).toBe(true);
    expect(row.getAttribute("data-slack")).toBe("2");
  });

  test("readonly: no edit region, no drag, navigation and collapse still work", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} readonly />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    expect(document.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
    expect(document.querySelector(".gantt-chart")!.hasAttribute("data-readonly")).toBe(true);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Collapse Phase 1" }));
    expect(screen.getByRole("button", { name: "Expand Phase 1" })).toBeTruthy();
  });
});

describe("GanttChart — progress field, baselines, typed dependencies", () => {
  const cellsOf = (i: number) => Array.from(rows()[i].querySelectorAll<HTMLElement>(".gantt-table-td"));
  const percentLabels: GanttLabels = { ...LABELS, percentLabel: "Percent complete" };

  test("percentLabel adds a progress field to the edit region; without it none renders", () => {
    const a = render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(document.querySelector(".gantt-chart-percent-input")).toBeNull();
    a.unmount();
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={percentLabels} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(screen.getByLabelText("Percent complete")).toBeTruthy();
  });

  test("the progress field starts at the task's percentComplete and Save passes the new value as a 4th argument", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={percentLabels} onTaskChange={onTaskChange} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const input = screen.getByLabelText("Percent complete") as HTMLInputElement;
    expect(input.value).toBe("40");
    fireEvent.change(input, { target: { value: "75" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onTaskChange).toHaveBeenCalledWith("build", "2026-10-04", "2026-10-06", 75);
  });

  test("progress is clamped to 0–100", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={percentLabels} onTaskChange={onTaskChange} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.change(screen.getByLabelText("Percent complete"), { target: { value: "250" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03", 100);
  });

  test("without percentLabel Save keeps the three-argument call", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={LABELS} onTaskChange={onTaskChange} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onTaskChange.mock.calls[0]).toHaveLength(3);
  });

  test("a baseline marks the cells it covers with data-baseline, apart from the current span", () => {
    const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }];
    render(<GanttChart label="Plan" range={RANGE} tasks={tasks} />);
    const withBaseline = cellsOf(0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
    expect(withBaseline).toEqual([1, 2, 3]);
    expect(cellsOf(0)[3].hasAttribute("data-in-range")).toBe(true);
    expect(cellsOf(0)[1].hasAttribute("data-in-range")).toBe(false);
  });

  test("baselineSummary renders as hidden text with the slip in days, and describes the row's cells", () => {
    const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } }];
    const labels: GanttLabels = { baselineSummary: (t, b, v) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` };
    render(<GanttChart label="Plan" range={RANGE} tasks={tasks} labels={labels} />);
    const summary = document.querySelector(".gantt-chart-baseline-summary") as HTMLElement;
    expect(summary.hidden).toBe(true);
    expect(summary.textContent!.trim()).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
    expect(cellsOf(0)[0].getAttribute("aria-describedby")).toContain(summary.id);
  });

  test("a task with no baseline has no baseline cells or summary", () => {
    render(<GanttChart label="Q4 plan" range={RANGE} tasks={TASKS} labels={{ baselineSummary: () => "x" }} />);
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
    render(<GanttChart label="Plan" range={RANGE} tasks={tasks} labels={labels} />);
    expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("After: Design (s2s, lag 2); Design");
  });

  test("a typed dependency without a lag or type defaults to e2s and 0", () => {
    const tasks: GanttTask[] = [
      { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
      { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
    ];
    const labels: GanttLabels = { dependencySummary: (p) => p.join(), dependencyDetail: (l, t, g) => `${l}/${t}/${g}` };
    render(<GanttChart label="Plan" range={RANGE} tasks={tasks} labels={labels} />);
    expect(document.querySelector(".gantt-chart-dependency-summary")!.textContent!.trim()).toBe("Design/e2s/0");
  });
});

describe("GanttChart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
  const base = { label: "Q4 plan", range: RANGE, tasks: TASKS };
  const zl: GanttLabels = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u) => `Showing ${u}s` };
  const cols = () => document.querySelectorAll(".gantt-table-thead .gantt-table-th").length - 1;
  const btn = (n: string) => screen.getByRole("button", { name: n }) as HTMLButtonElement;
  const cellAt = (i: number) => rows()[0].querySelectorAll(".gantt-table-td")[i];
  const dt = () => ({ setData: vi.fn(), getData: vi.fn(() => "design") });

  test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", () => {
    render(<GanttChart {...base} labels={LABELS} />);
    expect(document.querySelector(".gantt-chart-zoom")).toBeNull();
  });

  test("§14.2 zoom in steps to finer columns and out to coarser, announcing each unit; §14.3 buttons disable at the ends", () => {
    render(<GanttChart {...base} labels={zl} timeUnit="week" />);
    // controlled prop stays "week": the buttons still report the step
    cleanup();
    const onTimeUnitChange = vi.fn();
    render(<GanttChart {...base} labels={zl} onTimeUnitChange={onTimeUnitChange} />);
    expect(btn("Zoom in").disabled).toBe(true);
    const day = cols();
    fireEvent.click(btn("Zoom out"));
    expect(cols()).toBeLessThan(day);
    expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Showing weeks");
    expect(onTimeUnitChange).toHaveBeenLastCalledWith("week");
    fireEvent.click(btn("Zoom out"));
    expect(btn("Zoom out").disabled).toBe(true);
    expect(btn("Zoom in").disabled).toBe(false);
  });

  test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", () => {
    render(<GanttChart {...base} />);
    expect(rows()[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
    expect(cellAt(2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
    expect(rows()[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
    cleanup();
    render(<GanttChart {...base} readonly />);
    expect(document.querySelector(".gantt-chart-bar-handle")).toBeNull();
  });

  test("§14.6 the end handle extends the end; §14.7 the start handle moves the start and the range cannot invert", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart {...base} onTaskChange={onTaskChange} />);
    const d = dt();
    fireEvent.dragStart(cellAt(2).querySelector(".gantt-chart-bar-handle-end")!, { dataTransfer: d });
    fireEvent.drop(cellAt(5), { dataTransfer: d });
    expect(onTaskChange).toHaveBeenLastCalledWith("design", "2026-10-01", "2026-10-06");
    onTaskChange.mockClear();
    fireEvent.dragStart(rows()[0].querySelector(".gantt-chart-bar-handle-start")!, { dataTransfer: d });
    fireEvent.drop(cellAt(1), { dataTransfer: d });
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-02", "2026-10-03");
    onTaskChange.mockClear();
    fireEvent.dragStart(rows()[0].querySelector(".gantt-chart-bar-handle-start")!, { dataTransfer: d });
    fireEvent.drop(cellAt(7), { dataTransfer: d });
    expect(onTaskChange).not.toHaveBeenCalled();
  });

  test("§14.9 clicking a row selects it (aria-selected, data-selected, onTaskSelect); §14.10 again deselects", () => {
    const onTaskSelect = vi.fn();
    render(<GanttChart {...base} onTaskSelect={onTaskSelect} />);
    const c = rows()[1].querySelectorAll(".gantt-table-td")[0];
    fireEvent.click(c);
    expect(rows()[1].getAttribute("aria-selected")).toBe("true");
    expect(rows()[1].hasAttribute("data-selected")).toBe(true);
    expect(onTaskSelect).toHaveBeenCalledWith("build");
    fireEvent.click(c);
    expect(rows()[1].hasAttribute("data-selected")).toBe(false);
    expect(onTaskSelect).toHaveBeenLastCalledWith(undefined);
  });

  test("§14.11 the s key selects the task under the cursor; §14.12 selectedTaskId starts a row selected", () => {
    render(<GanttChart {...base} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "s" });
    expect(rows()[0].getAttribute("aria-selected")).toBe("true");
    cleanup();
    render(<GanttChart {...base} selectedTaskId="launch" />);
    expect(rows()[2].hasAttribute("data-selected")).toBe(true);
  });

  test("§14.13 Alt+ArrowRight shifts the task one column keeping its duration; §14.14 not before the range starts", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart {...base} onTaskChange={onTaskChange} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft", altKey: true });
    expect(onTaskChange).not.toHaveBeenCalled();
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true });
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-02", "2026-10-04");
  });

  test("§14.15 Alt+Shift+ArrowRight moves only the end; §14.16 readonly ignores it", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart {...base} onTaskChange={onTaskChange} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true, shiftKey: true });
    expect(onTaskChange).toHaveBeenLastCalledWith("design", "2026-10-01", "2026-10-04");
    cleanup();
    const ro = vi.fn();
    render(<GanttChart {...base} onTaskChange={ro} readonly />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", altKey: true });
    expect(ro).not.toHaveBeenCalled();
  });

  test("§14.17 taskAttrs adds attributes to each task's row", () => {
    render(<GanttChart {...base} taskAttrs={(t) => ({ "data-team": t.id === "design" ? "ux" : "eng" })} />);
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

  test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={withUnscheduled} />);
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
    render(<GanttChart label="Q4" range={RANGE} tasks={withUnscheduled} labels={LABELS} />);
    fireEvent.focusIn(unscheduledCell());
    fireEvent.keyDown(unscheduledCell(), { key: "Enter" });
    expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(true);
  });

  test("§14.21 Alt+Arrow on an unscheduled task changes nothing", () => {
    const onTaskChange = vi.fn();
    render(<GanttChart label="Q4" range={RANGE} tasks={withUnscheduled} onTaskChange={onTaskChange} />);
    fireEvent.focusIn(unscheduledCell());
    fireEvent.keyDown(unscheduledCell(), { key: "ArrowRight", altKey: true });
    expect(onTaskChange).not.toHaveBeenCalled();
  });

  test("§14.22 collapsedTaskIds starts parents collapsed and reports changes", () => {
    const onChange = vi.fn();
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} defaultCollapsedTaskIds={["parent"]} onCollapsedTaskIdsChange={onChange} labels={LABELS} />);
    expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
    const button = screen.getByRole("button", { name: "Expand Phase 1" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
  });

  test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={{ expandAll: "Expand all", collapseAll: "Collapse all" }} />);
    const collapse = () => screen.getByRole("button", { name: "Collapse all" }) as HTMLButtonElement;
    const expand = () => screen.getByRole("button", { name: "Expand all" }) as HTMLButtonElement;
    expect(expand().disabled).toBe(true);
    fireEvent.click(collapse());
    expect(document.querySelector('[data-task-id="child1"]')).toBeNull();
    expect(collapse().disabled).toBe(true);
    fireEvent.click(expand());
    expect(document.querySelector('[data-task-id="child1"]')).not.toBeNull();
  });

  test("§14.24 no collapse-all buttons without labels or without parents", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} />);
    expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
    cleanup();
    render(<GanttChart label="Q4" range={RANGE} tasks={[TASKS[0]]} labels={{ expandAll: "Expand all", collapseAll: "Collapse all" }} />);
    expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
  });
});

describe("GanttChart — typed fields, editing, export, virtualization (§14.25–§14.40)", () => {
  const FIELDS = [
    { id: "owner", header: "Owner", type: "select" as const, options: [{ id: "a", label: "Ann" }, { id: "b", label: "Bo" }] },
    { id: "points", header: "Points", type: "number" as const },
  ];
  const FT: GanttTask[] = [
    { id: "t1", label: "Design", start: "2026-10-01", end: "2026-10-03", percentComplete: 50, values: { owner: "a", points: 3 }, baseline: { start: "2026-10-01", end: "2026-10-02" } },
    { id: "t2", label: "Build =x", start: "2026-10-04", end: "2026-10-06", dependsOn: ["t1"], values: { points: 5 } },
    { id: "p", label: "Phase" },
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
  const buttons = (id: string) => rowOf(id).querySelectorAll<HTMLElement>(".gantt-chart-field-button");
  const editor = () => document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;

  test("§14.25 each field is a column between the task name and the timeline, with a header and formatted cells", () => {
    render(<GanttChart {...base} />);
    const heads = Array.from(document.querySelectorAll(".gantt-table-thead th")).slice(0, 3).map((e) => e.textContent?.trim());
    expect(heads).toEqual(["", "Owner", "Points"]);
    expect(Array.from(rowOf("t1").querySelectorAll("[data-field]")).map((c) => c.textContent?.trim())).toEqual(["Ann", "3"]);
  });

  test("§14.26 fields are plain text without onFieldEdit and in a readonly chart", () => {
    const { unmount } = render(<GanttChart {...base} />);
    expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
    unmount();
    render(<GanttChart {...base} onFieldEdit={vi.fn()} readonly />);
    expect(document.querySelector(".gantt-chart-field-button")).toBeNull();
  });

  test("§14.27 clicking a value opens a typed editor; Enter commits the parsed value and announces", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} onFieldEdit={onFieldEdit} labels={EXPORT_LABELS} />);
    fireEvent.click(buttons("t1")[1]);
    expect(editor().type).toBe("number");
    expect(editor().getAttribute("aria-label")).toBe("Points");
    expect(document.activeElement).toBe(editor());
    fireEvent.change(editor(), { target: { value: "8" } });
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t1", fieldId: "points", value: 8, previous: 3 });
    expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Design Points is 8");
    expect(document.querySelector(".gantt-chart-field-editor")).toBeNull();
  });

  test("§14.28 a select field edits through its options", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} onFieldEdit={onFieldEdit} />);
    fireEvent.click(buttons("t2")[0]);
    fireEvent.change(document.querySelector("select.gantt-chart-field-editor")!, { target: { value: "b" } });
    expect(onFieldEdit).toHaveBeenCalledTimes(1);
    expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t2", fieldId: "owner", value: "b", previous: undefined });
  });

  test("§14.29 Escape cancels; an unchanged value reports nothing", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} onFieldEdit={onFieldEdit} />);
    fireEvent.click(buttons("t1")[1]);
    fireEvent.change(editor(), { target: { value: "9" } });
    fireEvent.keyDown(editor(), { key: "Escape" });
    fireEvent.click(buttons("t1")[1]);
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).not.toHaveBeenCalled();
  });

  test("§14.30 a value that does not fit the type is refused: the editor stays open and the refusal is announced", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} fields={[{ id: "p", header: "P", type: "number", parse: () => Number.NaN }]} tasks={[{ ...FT[0], values: { p: 1 } }]} onFieldEdit={onFieldEdit} labels={EXPORT_LABELS} />);
    fireEvent.click(document.querySelector(".gantt-chart-field-button")!);
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).not.toHaveBeenCalled();
    expect(document.querySelector(".gantt-chart-field-editor")).not.toBeNull();
    expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("Design: bad P");
  });

  test("§14.31 F2 on a timeline cell edits the row's first editable field; Tab commits and moves to the next", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} onFieldEdit={onFieldEdit} />);
    fireEvent.keyDown(rowOf("t1").querySelector<HTMLElement>("[data-row][data-col]")!, { key: "F2" });
    expect(document.querySelector("select.gantt-chart-field-editor")).not.toBeNull();
    fireEvent.change(document.querySelector("select.gantt-chart-field-editor")!, { target: { value: "b" } });
    expect(onFieldEdit).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons("t1")[0]);
    fireEvent.keyDown(editor(), { key: "Tab" });
    expect(document.querySelector<HTMLInputElement>("input.gantt-chart-field-editor")!.type).toBe("number");
  });

  test("§14.32 IME: Enter while composing does not commit", () => {
    const onFieldEdit = vi.fn();
    render(<GanttChart {...base} fields={[{ id: "n", header: "N" }]} tasks={[{ ...FT[0], values: { n: "a" } }]} onFieldEdit={onFieldEdit} />);
    fireEvent.click(document.querySelector(".gantt-chart-field-button")!);
    fireEvent.change(editor(), { target: { value: "かな" } });
    fireEvent.keyDown(editor(), { key: "Enter", isComposing: true });
    fireEvent.keyDown(editor(), { key: "Enter", keyCode: 229 });
    expect(onFieldEdit).not.toHaveBeenCalled();
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t1", fieldId: "n", value: "かな", previous: "a" });
  });

  async function exported(props: Record<string, unknown> = {}, format: "csv" | "tsv" | "xlsx" = "csv") {
    const onExport = vi.fn((_file: { format: string; filename: string; taskCount: number; blob: Blob }) => false as const);
    render(<GanttChart {...base} labels={EXPORT_LABELS} onExport={onExport} {...props} />);
    fireEvent.click(document.querySelector(`[data-gantt-export-format="${format}"]`)!);
    const file = onExport.mock.calls[0][0];
    const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
    cleanup();
    return { file, text };
  }

  test("§14.33 export buttons need a label and exportHeaders; each label gates its button", () => {
    const first = render(<GanttChart {...base} />);
    expect(document.querySelector(".gantt-chart-export")).toBeNull();
    first.unmount();
    const second = render(<GanttChart {...base} labels={{ exportCsv: "CSV" }} />);
    expect(document.querySelector(".gantt-chart-export")).toBeNull();
    second.unmount();
    render(<GanttChart {...base} labels={{ export: "Export", exportExcel: "Excel", exportHeaders: EXPORT_LABELS.exportHeaders }} />);
    expect(screen.getByRole("group", { name: "Export" })).toBeTruthy();
    expect(document.querySelectorAll(".gantt-chart-export-button")).toHaveLength(1);
  });

  test("§14.34 CSV holds task, effective start/end, percent, parent, predecessors and the fields; parents export their derived span", async () => {
    const { file, text } = await exported();
    expect(file.filename).toBe("gantt-chart.csv");
    expect(file.taskCount).toBe(4);
    const lines = text.replace("﻿", "").split("\r\n");
    expect(lines[0]).toBe("Task,Start,End,Done,Parent,After,Owner,Points");
    expect(lines[1]).toBe("Design,2026-10-01,2026-10-03,50,,,Ann,3");
    expect(lines[2]).toBe("Build =x,2026-10-04,2026-10-06,,,Design,,5");
    expect(lines[3]).toBe("Phase,2026-10-08,2026-10-09,,,,,");
    expect(lines[4]).toBe("Kid,2026-10-08,2026-10-09,,Phase,,,");
  });

  test("§14.35 exportScope visible leaves out tasks under a collapsed parent", async () => {
    expect((await exported({ collapsedTaskIds: ["p"], exportScope: "visible" })).file.taskCount).toBe(3);
  });

  test("§14.36 baseline columns and exportable false", async () => {
    const { text } = await exported({ fields: [{ ...FIELDS[0], exportable: false }, FIELDS[1]], labels: { ...EXPORT_LABELS, exportHeaders: { ...EXPORT_LABELS.exportHeaders!, baselineStart: "BS", baselineEnd: "BE" } } });
    const lines = text.replace("﻿", "").split("\r\n");
    expect(lines[0]).toBe("Task,Start,End,Done,Parent,After,BS,BE,Points");
    expect(lines[1]).toBe("Design,2026-10-01,2026-10-03,50,,,2026-10-01,2026-10-02,3");
  });

  test("§14.37 saving announces unless onExport returns false; no tasks disables the buttons", () => {
    const created: Blob[] = [];
    const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
    URL.revokeObjectURL = () => {};
    try {
      const { unmount } = render(<GanttChart {...base} labels={EXPORT_LABELS} />);
      fireEvent.click(document.querySelector('[data-gantt-export-format="tsv"]')!);
      expect(created).toHaveLength(1);
      expect(document.querySelector(".gantt-chart-status")!.textContent).toBe("4 tasks as tsv: gantt-chart.tsv");
      unmount();
      render(<GanttChart {...base} tasks={[]} labels={EXPORT_LABELS} />);
      expect((document.querySelector('[data-gantt-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
    } finally {
      URL.createObjectURL = original.create;
      URL.revokeObjectURL = original.revoke;
    }
  });

  const MANY: GanttTask[] = Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, label: `Task ${i}`, start: "2026-10-01", end: "2026-10-02" }));

  test("§14.38 virtualize renders only the rows in view plus spacers, with aria-rowcount and aria-rowindex", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={MANY} virtualize={{ rowHeight: 20, height: 100, overscan: 1 }} />);
    const rendered = document.querySelectorAll("[data-task-id]").length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(20);
    expect(document.querySelector(".gantt-table")!.getAttribute("aria-rowcount")).toBe("201");
    expect(document.querySelector('[data-task-id="r0"]')!.getAttribute("aria-rowindex")).toBe("2");
    expect(document.querySelector(".gantt-chart-spacer")).not.toBeNull();
    expect(document.querySelector<HTMLElement>(".gantt-chart-scroll")!.style.height).toBe("100px");
  });

  test("§14.39 scrolling brings later rows in; keyboard focus to the last row reveals it", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={MANY} virtualize={{ rowHeight: 20, height: 100 }} />);
    const scroll = document.querySelector<HTMLElement>(".gantt-chart-scroll")!;
    scroll.scrollTop = 2000;
    fireEvent.scroll(scroll);
    expect(document.querySelector('[data-task-id="r100"]')).not.toBeNull();
    expect(document.querySelector('[data-task-id="r1"]')).toBeNull(); // r0 stays: it holds the roving tab stop
    fireEvent.keyDown(document.querySelector<HTMLElement>("[data-row][data-col]")!, { key: "End", ctrlKey: true });
    expect(document.querySelector('[data-task-id="r199"]')).not.toBeNull();
  });

  test("§14.40 without virtualize every row renders, and the roving tab stop stays unique", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={MANY} />);
    expect(document.querySelectorAll("[data-task-id]")).toHaveLength(200);
    expect(document.querySelectorAll('.gantt-table-td[tabindex="0"]')).toHaveLength(1);
  });
});
