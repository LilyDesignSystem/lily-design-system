import * as React from "react";
import { act, render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
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

// =====================================================================
// §17 weekend shading and dependency arrows (0.6.0)
// =====================================================================

describe("weekend shading and dependency arrows", () => {
  // 2026-10-03 is a Saturday, 2026-10-04 a Sunday.
  test("§17.1 weekends marks day columns on the header and every cell, and nothing without it", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} weekends={[0, 6]} />);
    expect(Array.from(document.querySelectorAll("thead th[data-weekend]")).map((h) => h.textContent?.trim())).toEqual(["2026-10-03", "2026-10-04", "2026-10-10"]);
    expect(document.querySelectorAll("tbody td[data-weekend]")).toHaveLength(3 * TASKS.length);
  });

  test("§17.2 with no weekends nothing is shaded, and the weekend is never defaulted", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} />);
    expect(document.querySelector("[data-weekend]")).toBeNull();
  });

  test("§17.3 a Friday-Saturday weekend shades those days instead", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} weekends={[5, 6]} />);
    expect(Array.from(document.querySelectorAll("thead th[data-weekend]")).map((h) => h.textContent?.trim())).toEqual(["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10"]);
  });

  test("§17.4 week and month columns are not marked", () => {
    render(<GanttChart label="Q4" range={{ start: "2026-10-01", end: "2026-12-31" }} tasks={TASKS} labels={LABELS} weekends={[0, 6]} timeUnit="week" />);
    expect(document.querySelector("[data-weekend]")).toBeNull();
  });

  test("§17.5 weekends can combine with isNonWorking", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} weekends={[6]} isNonWorking={(d) => d === "2026-10-03"} />);
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
      render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} dependencyArrows />);
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
      render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} dependencyArrows />);
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
      render(<GanttChart label="Q4" range={RANGE} tasks={tasks} labels={LABELS} dependencyArrows />);
      await waitFor(() => expect(document.querySelectorAll(".gantt-chart-dependency-arrow")).toHaveLength(1));
      expect(document.querySelector(".gantt-chart-dependency-arrow")!.getAttribute("data-dependency-type")).toBe("s2s");
    } finally {
      restore();
    }
  });

  test("§17.9 without dependencyArrows there is no overlay", () => {
    render(<GanttChart label="Q4" range={RANGE} tasks={TASKS} labels={LABELS} />);
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
      render(<GanttChart label="Q4" range={RANGE} tasks={tasks} labels={LABELS} dependencyArrows collapsedTaskIds={["p"]} />);
      await waitFor(() => expect(document.querySelectorAll("[data-task-id]").length).toBe(2));
      expect(document.querySelector(".gantt-chart-dependency-arrow")).toBeNull();
    } finally {
      restore();
    }
  });
});


// =====================================================================
// §18 search (0.7.0)
// =====================================================================

describe("search", () => {
    const SEARCH_LABELS: GanttLabels = { ...LABELS, search: "Search tasks", searchAnnouncement: (m, t) => `${m} of ${t} tasks` };
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.1 the field renders only when labels.search names it", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        expect(document.querySelector(".gantt-chart-search")).toBeNull();
    });

    test("§18.2 typing shows only matching tasks (every word, any order, ignoring case)", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        const input = screen.getByRole("searchbox", { name: "Search tasks" });
        await fireEvent.input(input, { target: { value: "LAUNCH" } });
        expect(ids()).toEqual(["launch"]);
        await fireEvent.input(input, { target: { value: "" } });
        expect(ids()).toHaveLength(TASKS.length);
    });

    test("§18.3 a match under a parent keeps its ancestors, and shows even when the parent is collapsed", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS, collapsedTaskIds: ["parent"] } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "child b" } });
        expect(ids()).toEqual(["parent", "child2"]);
    });

    test("§18.4 matches are wrapped in <mark class=gantt-chart-match>, and only while searching", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        expect(document.querySelector("mark")).toBeNull();
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "des" } });
        expect(document.querySelector("mark.gantt-chart-match")?.textContent).toBe("Des");
    });

    test("§18.5 the default text includes typed field text", async () => {
        const tasks = TASKS.map((t) => (t.id === "build" ? { ...t, values: { owner: "Zoë" } } : t));
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks, labels: SEARCH_LABELS, fields: [{ id: "owner", header: "Owner" }] } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "zoe" } });
        expect(ids()).toEqual(["build"]);
    });

    test("§18.6 searchText replaces what is looked in", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS, searchText: (t: GanttTask) => t.id.toUpperCase() } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "design" } });
        expect(ids()).toEqual(["design"]);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "Design" } });
        expect(ids()).toEqual(["design"]);
    });

    test("§18.7 the result count is announced, and clearing announces everything again", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        const input = screen.getByRole("searchbox");
        await fireEvent.input(input, { target: { value: "child" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(`2 of ${TASKS.length} tasks`));
        await fireEvent.input(input, { target: { value: "" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(`${TASKS.length} of ${TASKS.length} tasks`));
    });

    test("§18.8 Escape in the field clears the search", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        const input = screen.getByRole("searchbox") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "launch" } });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(input.value).toBe("");
        expect(ids()).toHaveLength(TASKS.length);
    });

    test("§18.9 an export of the visible tasks holds only the matches", async () => {
        const onExport = vi.fn(() => false);
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: { ...SEARCH_LABELS, export: "Export", exportCsv: "CSV", exportHeaders: { task: "Task", start: "Start", end: "End" } }, exportScope: "visible", onExport } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "launch" } });
        await fireEvent.click(screen.getByText("CSV"));
        expect((onExport.mock.calls[0] as unknown as [{ taskCount: number }])[0].taskCount).toBe(1);
    });

    test("§18.10 the search prop works without the field", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, search: "launch" } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toEqual(["launch"]);
    });
});

describe("filter", () => {
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.11 filter hides the tasks it rejects, and a passing child keeps its parent", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, filter: (t: GanttTask) => t.id === "child2" } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toEqual(["parent", "child2"]);
    });

    test("§18.12 filter combines with search (both must pass)", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, filter: (t: GanttTask) => t.id !== "design", search: "d" } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).not.toContain("design");
        expect(ids()).toContain("build");
    });

    test("§18.13 filter sees typed values, so a status filter works", () => {
        const tasks = TASKS.map((t) => ({ ...t, values: { status: t.id === "launch" ? "done" : "open" } }));
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks, labels: LABELS, filter: (t: GanttTask) => t.values?.status === "done" } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toEqual(["launch"]);
    });

    test("§18.14 no filter and no search shows every task as before", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toHaveLength(TASKS.length);
    });
});

describe("compare", () => {
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.15 compare orders tasks among their siblings and keeps children under their parent", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, compare: (a: GanttTask, b: GanttTask) => b.label.localeCompare(a.label) } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toEqual(["parent", "child2", "child1", "launch", "design", "build"]);
    });

    test("§18.16 the sort is stable: equal tasks keep their input order", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, compare: () => 0 } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()).toEqual(["design", "build", "launch", "parent", "child1", "child2"]);
    });

    test("§18.17 compare can use typed values", () => {
        const tasks = TASKS.map((t, i) => ({ ...t, values: { rank: 10 - i } }));
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks, labels: LABELS, compare: (a: GanttTask, b: GanttTask) => Number(a.values?.rank) - Number(b.values?.rank) } as React.ComponentProps<typeof GanttChart>)} />);
        expect(ids()[0]).toBe("parent");
    });

    test("§18.18 the visible export follows the order", async () => {
        const onExport = vi.fn(() => false);
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: { ...LABELS, export: "Export", exportCsv: "CSV", exportHeaders: { task: "Task", start: "Start", end: "End" } }, exportScope: "visible", compare: (a: GanttTask, b: GanttTask) => b.label.localeCompare(a.label), onExport } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(screen.getByText("CSV"));
        expect(onExport).toHaveBeenCalled();
    });
});

describe("copy to clipboard", () => {
    const L: GanttLabels = { ...LABELS, export: "Export", copy: "Copy", exportHeaders: { task: "Task", start: "Start", end: "End" }, copyAnnouncement: (n) => `${n} tasks copied`, copyFailed: "Copy failed" };
    const wait = () => new Promise((r) => setTimeout(r, 0));

    test("§18.19 copy needs labels.copy and exportHeaders", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: { ...LABELS, copy: "Copy" } } as React.ComponentProps<typeof GanttChart>)} />);
        expect(document.querySelector('[data-gantt-export-format="copy"]')).toBeNull();
    });

    test("§18.20 copy puts the tasks on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Task\tStart\tEnd");
        expect(text).toContain("Design");
        expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(`${TASKS.length} tasks copied`);
        vi.unstubAllGlobals();
    });

    test("§18.21 onCopy can take over, and the visible scope follows the search", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const onCopy = vi.fn(() => false);
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: L, onCopy } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        expect(writeText).not.toHaveBeenCalled();
        document.body.innerHTML = "";
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: L, exportScope: "visible", search: "launch" } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text).toContain("Launch");
        expect(text).not.toContain("Design");
        vi.unstubAllGlobals();
    });
});

describe("keyboard: PageUp / PageDown and type-ahead", () => {
    const MANY_ROWS: GanttTask[] = Array.from({ length: 40 }, (_, i) => ({ id: `t${i}`, label: i % 2 ? `Beta ${i}` : `Alpha ${i}`, start: "2026-10-01", end: "2026-10-02" }));
    const activeRowIndex = () => Number(document.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')?.dataset.row);
    const first = () => document.querySelector<HTMLElement>(".gantt-table-td[data-row][data-col]")!;

    test("§18.22 PageDown moves ten rows, PageUp moves back, both clamp", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "PageDown" });
        expect(activeRowIndex()).toBe(10);
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "PageUp" });
        expect(activeRowIndex()).toBe(0);
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "PageUp" });
        expect(activeRowIndex()).toBe(0);
    });

    test("§18.23 with virtualize a page is the visible rows", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS, virtualize: { rowHeight: 20, height: 100 } } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "PageDown" });
        expect(activeRowIndex()).toBe(5);
    });

    test("§18.24 typing a letter moves to the next task whose label starts with it", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "b" });
        expect(activeRowIndex()).toBe(1);
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "b", ctrlKey: false });
        expect(activeRowIndex()).toBe(3); // "bb" is one repeated letter: it steps to the next Beta
    });

    test("§18.25 letters typed in quick succession form one prefix", async () => {
        const tasks: GanttTask[] = [
            { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
            { id: "b", label: "Deploy", start: "2026-10-01", end: "2026-10-02" },
            { id: "c", label: "Docs", start: "2026-10-01", end: "2026-10-02" },
        ];
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "d" });
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "e" });
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "p" });
        expect(activeRowIndex()).toBe(1);
    });

    test("§18.26 a lone s is still the select shortcut, not type-ahead", async () => {
        const tasks: GanttTask[] = [
            { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
            { id: "b", label: "Sprint", start: "2026-10-01", end: "2026-10-02" },
        ];
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "s" });
        expect(activeRowIndex()).toBe(0);
        expect(document.querySelector('[data-task-id="a"]')?.getAttribute("aria-selected")).toBe("true");
    });

    test("§18.27 a key with Ctrl or Alt is never type-ahead, and an unmatched prefix does nothing", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(first(), { key: "b", ctrlKey: true });
        expect(activeRowIndex()).toBe(0);
        await fireEvent.keyDown(first(), { key: "z" });
        expect(activeRowIndex()).toBe(0);
    });
});

describe("in-place edit: validate, undo, redo", () => {
    const TASKS2: GanttTask[] = [{ id: "t1", label: "Design", start: "2026-10-01", end: "2026-10-03", values: { points: 3 } }];
    const L: GanttLabels = {
        ...LABELS,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
        editRefused: (t, h, m) => `${t} ${h}: ${m}`,
        undoAnnouncement: (t, h, text) => `Undid ${t} ${h}: ${text}`,
        redoAnnouncement: (t, h, text) => `Redid ${t} ${h}: ${text}`,
    };
    const FIELD = { id: "points", header: "Points", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "Must not be negative" : undefined) };
    const status = () => document.querySelector(".gantt-chart-status")?.textContent;
    const button = () => document.querySelector<HTMLElement>(".gantt-chart-field-button")!;
    const cell = () => document.querySelector<HTMLElement>(".gantt-table-td[data-row][data-col]")!;

    async function edit(value: string): Promise<HTMLInputElement> {
        await fireEvent.click(button());
        const input = document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        await fireEvent.input(input, { target: { value } });
        await fireEvent.keyDown(input, { key: "Enter" });
        return input;
    }

    test("§18.28 a value validate refuses keeps the editor open, marks it aria-invalid and announces the reason", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(button());
        const input = document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        await fireEvent.input(input, { target: { value: "-4" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".gantt-chart-field-editor")?.getAttribute("aria-invalid")).toBe("true");
        expect(status()).toBe("Design Points: Must not be negative");
    });

    test("§18.29 typing again clears aria-invalid, and an acceptable value then commits", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.click(button());
        const input = document.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        await fireEvent.input(input, { target: { value: "-4" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        await fireEvent.input(input, { target: { value: "5" } });
        expect(input.getAttribute("aria-invalid")).toBeNull();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ taskId: "t1", fieldId: "points", value: 5, previous: 3 });
    });

    test("§18.30 a wrong-type value without a validate message falls back to editInvalid", async () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [{ ...FIELD, parse: () => Number.NaN }], onFieldEdit: vi.fn(), labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await edit("x");
        expect(status()).toBe("Design: bad Points");
    });

    test("§18.31 Ctrl+Z reports the earlier value through onFieldEdit and announces it", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 8 });
        expect(status()).toBe("Undid Design Points: 3");
    });

    test("§18.32 Ctrl+Shift+Z and Ctrl+Y redo", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 8, previous: 3 });
        expect(status()).toBe("Redid Design Points: 8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 8, previous: 3 });
    });

    test("§18.33 undo walks back through several edits, newest first", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await edit("5");
        await edit("9");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 9 });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 5 });
    });

    test("§18.34 with nothing to undo, Ctrl+Z does nothing, and a new edit ends the redo chain", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await edit("5");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await edit("7");
        onFieldEdit.mockClear();
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§18.35 undo and redo do nothing in a readonly chart or without onFieldEdit", async () => {
        const onFieldEdit = vi.fn();
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], readonly: true, onFieldEdit, labels: L } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });
});

describe("unavailable days: holidays and time off", () => {
    const heads = () => Array.from(document.querySelectorAll<HTMLElement>("thead th")).slice(1);
    const headOf = (date: string) => heads().find((h) => h.textContent?.includes(date))!;
    const UN = [
        { start: "2026-10-03", kind: "holiday", label: "Founders' Day" },
        { start: "2026-10-06", end: "2026-10-07", kind: "leave", label: "Ann off" },
    ];

    test("§18.36 a day column fully covered is data-unavailable with its kind, on the header and every cell", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: UN } as React.ComponentProps<typeof GanttChart>)} />);
        expect(headOf("2026-10-03").getAttribute("data-unavailable")).toBe("holiday");
        expect(headOf("2026-10-06").getAttribute("data-unavailable")).toBe("leave");
        expect(headOf("2026-10-07").getAttribute("data-unavailable")).toBe("leave");
        expect(headOf("2026-10-04").hasAttribute("data-unavailable")).toBe(false);
        expect(document.querySelectorAll("tbody td[data-unavailable]")).toHaveLength(3 * TASKS.length);
    });

    test("§18.37 the label is real text in the header, so a day is never colour-only", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: UN } as React.ComponentProps<typeof GanttChart>)} />);
        expect(headOf("2026-10-03").querySelector(".gantt-chart-unavailable-label")?.textContent).toBe("Founders' Day");
        expect(headOf("2026-10-04").querySelector(".gantt-chart-unavailable-label")).toBeNull();
    });

    test("§18.38 an entry without a kind is data-unavailable=unavailable", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-10-05" }] } as React.ComponentProps<typeof GanttChart>)} />);
        expect(headOf("2026-10-05").getAttribute("data-unavailable")).toBe("unavailable");
    });

    test("§18.39 a week column only partly covered is data-partly-unavailable, so a holiday inside a week is still marked", () => {
        render(<GanttChart {...({ label: "Q4", range: { start: "2026-10-01", end: "2026-10-31" }, tasks: TASKS, labels: LABELS, timeUnit: "week", unavailable: [{ start: "2026-10-03", kind: "holiday", label: "Founders' Day" }] } as React.ComponentProps<typeof GanttChart>)} />);
        const marked = heads().filter((h) => h.hasAttribute("data-partly-unavailable"));
        expect(marked).toHaveLength(1);
        expect(marked[0].getAttribute("data-partly-unavailable")).toBe("holiday");
        expect(marked[0].hasAttribute("data-unavailable")).toBe(false);
        expect(marked[0].querySelector(".gantt-chart-unavailable-label")?.textContent).toBe("Founders' Day");
    });

    test("§18.40 several kinds on one column are all listed", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-10-06", kind: "holiday" }, { start: "2026-10-06", kind: "leave" }] } as React.ComponentProps<typeof GanttChart>)} />);
        expect(headOf("2026-10-06").getAttribute("data-unavailable")).toBe("holiday leave");
    });

    test("§18.41 it combines with weekends and isNonWorking, and nothing is marked without it", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, weekends: [6], unavailable: [{ start: "2026-10-03", kind: "holiday" }] } as React.ComponentProps<typeof GanttChart>)} />);
        const h = headOf("2026-10-03");
        expect(h.hasAttribute("data-weekend") && h.hasAttribute("data-unavailable")).toBe(true);
        document.body.innerHTML = "";
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } as React.ComponentProps<typeof GanttChart>)} />);
        expect(document.querySelector("[data-unavailable], [data-partly-unavailable]")).toBeNull();
    });

    test("§18.42 an entry with a bad date marks nothing", () => {
        render(<GanttChart {...({ label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-13-40" }] } as React.ComponentProps<typeof GanttChart>)} />);
        expect(document.querySelector("[data-unavailable], [data-partly-unavailable]")).toBeNull();
    });
});

describe("right-to-left keys and no English left over", () => {
    const active = () => document.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')!;
    const colOf = (el: HTMLElement) => Number(el.dataset.col);
    const base = { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS };

    test("§18.43 left to right: ArrowRight goes to the next day, ArrowLeft back", async () => {
        render(<GanttChart {...(base as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.keyDown(active(), { key: "ArrowRight" });
        expect(colOf(active())).toBe(1);
        await fireEvent.keyDown(active(), { key: "ArrowLeft" });
        expect(colOf(active())).toBe(0);
    });

    test("§18.44 right to left: ArrowLeft goes to the next day (the later date is on the left), ArrowRight back", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            render(<GanttChart {...(base as React.ComponentProps<typeof GanttChart>)} />);
            await fireEvent.keyDown(active(), { key: "ArrowLeft" });
            expect(colOf(active())).toBe(1);
            await fireEvent.keyDown(active(), { key: "ArrowRight" });
            expect(colOf(active())).toBe(0);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§18.45 right to left: Alt+ArrowLeft shifts a task later, the way the arrow points", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onTaskChange = vi.fn();
            render(<GanttChart {...({ ...base, onTaskChange } as React.ComponentProps<typeof GanttChart>)} />);
            await fireEvent.keyDown(document.querySelector<HTMLElement>('[data-task-id="design"] .gantt-table-td[data-col]')!, { key: "ArrowLeft", altKey: true });
            expect(onTaskChange.mock.calls[0].slice(0, 3)).toEqual(["design", "2026-10-02", "2026-10-04"]);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§18.46 Home, End, the vertical keys and the page keys are the same in both directions", async () => {
        for (const dir of ["ltr", "rtl"]) {
            document.body.innerHTML = "";
            document.body.setAttribute("dir", dir);
            render(<GanttChart {...(base as React.ComponentProps<typeof GanttChart>)} />);
            await fireEvent.keyDown(active(), { key: "ArrowDown" });
            expect(Number(active().dataset.row)).toBe(1);
            await fireEvent.keyDown(active(), { key: "End" });
            expect(colOf(active())).toBe(9);
            await fireEvent.keyDown(active(), { key: "Home" });
            expect(colOf(active())).toBe(0);
        }
        document.body.removeAttribute("dir");
    });

    // A complete Simplified Chinese bundle; the data is Chinese too, so any English in the DOM is Lily's.
    const ZH: GanttLabels = {
        columnLabel: (s) => s.slice(5), taskColumnHeader: "任务", startLabel: "开始日期", endLabel: "结束日期", dateTimePickerLabels: {
            previousYear: "上一年", previousMonth: "上个月", previousWeek: "上一周", previousDay: "前一天", nextDay: "后一天", nextWeek: "下一周", nextMonth: "下个月", nextYear: "下一年", confirm: "确定", cancel: "取消",
        },
        saveLabel: "保存", cancelLabel: "取消", dependencySummary: (p) => `依赖：${p.join("、")}`, collapseButton: (t, c) => `${c ? "展开" : "折叠"}${t.label}`,
        search: "搜索任务", searchAnnouncement: (m, t) => `${t} 个任务中有 ${m} 个匹配`, expandAll: "全部展开", collapseAll: "全部折叠", zoomIn: "放大", zoomOut: "缩小",
        export: "导出", exportCsv: "CSV", copy: "复制", exportHeaders: { task: "任务", start: "开始", end: "结束" }, copyAnnouncement: (n) => `已复制 ${n} 个任务`, copyFailed: "复制失败",
    };
    const zhTasks: GanttTask[] = [
        { id: "a", label: "设计", start: "2026-10-01", end: "2026-10-03" },
        { id: "b", label: "开发", start: "2026-10-04", end: "2026-10-06", dependsOn: ["a"], parentId: undefined },
        { id: "c", label: "子任务", start: "2026-10-05", end: "2026-10-05", parentId: "b" },
    ];

    function readable(root: Element): string[] {
        const out: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n.textContent ?? "");
        for (const el of root.querySelectorAll("*")) for (const a of ["aria-label", "title", "placeholder", "alt"]) if (el.hasAttribute(a)) out.push(el.getAttribute(a)!);
        return out.map((t) => t.trim()).filter(Boolean);
    }
    const english = (texts: string[]) => texts.filter((t) => !["CSV", "TSV", "Excel"].includes(t) && /[A-Za-z]{3,}/.test(t));

    test("§18.47 with a full Chinese bundle the chart, its toolbar and its headers read as Chinese only", () => {
        const { container } = render(<GanttChart {...({ label: "项目计划", range: RANGE, tasks: zhTasks, labels: ZH, weekends: [0, 6], unavailable: [{ start: "2026-10-01", kind: "holiday", label: "国庆节" }], timeUnit: "day" } as React.ComponentProps<typeof GanttChart>)} />);
        expect(english(readable(container))).toEqual([]);
    });

    test("§18.48 the search announcement is the bundle's", async () => {
        render(<GanttChart {...({ label: "项目计划", range: RANGE, tasks: zhTasks, labels: ZH } as React.ComponentProps<typeof GanttChart>)} />);
        await fireEvent.input(screen.getByRole("searchbox", { name: "搜索任务" }), { target: { value: "设计" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe("3 个任务中有 1 个匹配"));
    });
});

