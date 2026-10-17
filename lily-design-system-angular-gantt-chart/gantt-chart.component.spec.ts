import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  GanttChart,
  addDays,
  compareISO,
  effectiveRange,
  endOfMonth,
  flattenTasks,
  generateColumns,
  type GanttLabels,
  type GanttTask,
  type GanttTaskChangeEvent,
} from "./gantt-chart.component";

const RANGE = { start: "2026-10-01", end: "2026-10-10" };

const TASKS: GanttTask[] = [
  { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03" },
  {
    id: "build",
    label: "Build",
    start: "2026-10-04",
    end: "2026-10-06",
    dependsOn: ["design"],
    percentComplete: 40,
  },
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

let fixtures: ComponentFixture<unknown>[] = [];

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
});

function mount(inputs: Record<string, unknown> = {}): ComponentFixture<GanttChart> {
  const fixture = TestBed.createComponent(GanttChart);
  fixture.componentRef.setInput("label", "Q4 plan");
  fixture.componentRef.setInput("range", RANGE);
  fixture.componentRef.setInput("tasks", TASKS);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function tabbableCells(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.gantt-table-td[tabindex="0"]'),
  );
}

function rows(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".gantt-table-tbody > .gantt-table-tr"),
  );
}

function headers(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".gantt-table-thead .gantt-table-th"),
  );
}

function press(
  fixture: ComponentFixture<unknown>,
  target: Element,
  key: string,
  extra: KeyboardEventInit = {},
): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...extra }));
  fixture.detectChanges();
}

function click(fixture: ComponentFixture<unknown>, target: Element): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

function dragEvent(type: string, dataTransfer: unknown): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  return event;
}

function byText(fixture: ComponentFixture<unknown>, selector: string, text: string): HTMLElement {
  return Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>(selector)).find(
    (el) => el.textContent?.trim() === text,
  )!;
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

  test("addDays is UTC-safe across a month boundary (reused from date-time-picker)", () => {
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
    expect(flat.map((r) => r.task.id)).toEqual([
      "design",
      "build",
      "launch",
      "parent",
      "child1",
      "child2",
    ]);
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
  test("§8.1 renders a gantt-chart root wrapping a role=grid labelled by label", () => {
    const fixture = mount();
    expect(fixture.nativeElement.querySelector(".gantt-chart")).toBeTruthy();
    const grid = fixture.nativeElement.querySelector("table.gantt-table");
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Q4 plan");
  });

  test("§8.2 renders one column header per day across the range", () => {
    const fixture = mount({ labels: LABELS });
    expect(headers(fixture)).toHaveLength(11); // 10 day columns + 1 leading blank column
  });

  test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
    const fixture = mount();
    const designRow = rows(fixture)[0];
    const cells = designRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
    expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
    expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
  });

  test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
    const fixture = mount();
    const launchRow = rows(fixture)[2];
    const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
    const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
    expect(milestoneCells).toHaveLength(1);
    expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
  });

  test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
    const fixture = mount();
    const buildRow = rows(fixture)[1];
    const bar = buildRow.querySelector(".gantt-chart-bar");
    expect(bar?.getAttribute("data-percent-complete")).toBe("40");
    expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
  });
});

describe("GanttChart — row hierarchy (§8.5, §8.6)", () => {
  test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
    const fixture = mount();
    const parentRow = rows(fixture)[3];
    const cells = parentRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start)
    expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
    expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
  });

  test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", () => {
    const fixture = mount({ labels: LABELS });
    expect(rows(fixture)).toHaveLength(6);
    const collapseButton = byText(fixture, ".gantt-chart-collapse-button", "▾");
    expect(collapseButton.getAttribute("aria-label")).toBe("Collapse Phase 1");
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    click(fixture, collapseButton);
    expect(rows(fixture)).toHaveLength(4);
    expect(fixture.nativeElement.textContent).not.toContain("Child A");
    const expandButton = fixture.nativeElement.querySelector(".gantt-chart-collapse-button");
    expect(expandButton.getAttribute("aria-label")).toBe("Expand Phase 1");
    expect(expandButton.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("GanttChart — dependencies (§8.7)", () => {
  test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
    const fixture = mount({ labels: LABELS });
    const buildRow = rows(fixture)[1];
    const describedCell = buildRow.querySelector(".gantt-table-td[aria-describedby]");
    expect(describedCell).toBeTruthy();
    const id = describedCell!.getAttribute("aria-describedby")!;
    expect(fixture.nativeElement.querySelector(`#${id}`)?.textContent?.trim()).toBe(
      "Blocked by: Design",
    );
  });

  test("§8.7 a task with no dependencies carries no aria-describedby", () => {
    const fixture = mount({ labels: LABELS });
    const designRow = rows(fixture)[0];
    expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
  });
});

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
  test("§8.8 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
    const fixture = mount();
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll("td[aria-selected]")).toHaveLength(0);
  });

  test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    const fixture = mount();
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("0");

    press(fixture, tabbableCells(fixture)[0], "ArrowRight");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");

    press(fixture, tabbableCells(fixture)[0], "ArrowLeft");
    press(fixture, tabbableCells(fixture)[0], "ArrowLeft");
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
  });
});

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
  test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector('[aria-label="Start date"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label="End date"]')).toBeTruthy();
  });

  test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", () => {
    const fixture = mount();
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.9 Enter on a parent row does not open an edit region", () => {
    const fixture = mount({ labels: LABELS });
    for (let i = 0; i < 3; i++) {
      press(fixture, tabbableCells(fixture)[0], "ArrowDown");
    }
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("3");
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.10 Save emits taskChange with the task's id and edited dates, then closes", () => {
    const fixture = mount({ labels: LABELS });
    const onTaskChange = vi.fn();
    fixture.componentInstance.taskChange.subscribe(
      onTaskChange as (e: GanttTaskChangeEvent) => void,
    );
    press(fixture, tabbableCells(fixture)[0], "Enter");
    click(fixture, byText(fixture, ".gantt-chart-save-button", "Save"));
    expect(onTaskChange).toHaveBeenCalledWith({
      taskId: "design",
      start: "2026-10-01",
      end: "2026-10-03",
    });
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.11 Cancel closes the edit region without emitting taskChange", () => {
    const fixture = mount({ labels: LABELS });
    const onTaskChange = vi.fn();
    fixture.componentInstance.taskChange.subscribe(
      onTaskChange as (e: GanttTaskChangeEvent) => void,
    );
    press(fixture, tabbableCells(fixture)[0], "Enter");
    click(fixture, byText(fixture, ".gantt-chart-cancel-button", "Cancel"));
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
  });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
  test("§8.12 dropping a task's bar on another column emits taskChange, preserving duration", () => {
    const fixture = mount();
    const onTaskChange = vi.fn();
    fixture.componentInstance.taskChange.subscribe(
      onTaskChange as (e: GanttTaskChangeEvent) => void,
    );
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
    const bar = rows(fixture)[0].querySelector(".gantt-chart-bar")!;
    bar.dispatchEvent(dragEvent("dragstart", dataTransfer));

    const targetCell = rows(fixture)[0].querySelectorAll(".gantt-table-td")[5]; // Oct 6
    targetCell.dispatchEvent(dragEvent("drop", dataTransfer));
    // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
    expect(onTaskChange).toHaveBeenCalledWith({
      taskId: "design",
      start: "2026-10-06",
      end: "2026-10-08",
    });
  });

  test("§8.13 a successful edit announces via labels.dateAnnouncement", () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    click(fixture, byText(fixture, ".gantt-chart-save-button", "Save"));
    expect(fixture.nativeElement.querySelector(".gantt-chart-status")?.textContent).toBe(
      "Design moved to 2026-10-01 - 2026-10-03",
    );
  });

  test("§8.14 today marks its column data-today; omitting it marks nothing", () => {
    const fixture = mount({ today: "2026-10-05" });
    const cols = headers(fixture);
    expect(cols[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
    fixture.destroy();

    const fixture2 = mount();
    expect(fixture2.nativeElement.querySelectorAll("[data-today]")).toHaveLength(0);
  });
});

describe("GanttChart — extra attributes (§8.15)", () => {
  test("§8.15 extra attributes on the host tag (Angular always emits one; see AGENTS.md)", () => {
    const fixture = TestBed.createComponent(AttrHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    expect(fixture.nativeElement.querySelector('[data-testid="chart-root"]')).toBeTruthy();
  });
});

@Component({
  standalone: true,
  imports: [GanttChart],
  template: `
    <lily-gantt-chart
      data-testid="chart-root"
      label="Q4 plan"
      [range]="range"
      [tasks]="tasks"
    />
  `,
})
class AttrHost {
  readonly range = RANGE;
  readonly tasks = TASKS;
}

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
  function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
  }

  async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
  }

  function startField(fixture: ComponentFixture<unknown>): HTMLInputElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      ".gantt-chart-edit-row .date-time-picker-input",
    );
  }

  function editButton(fixture: ComponentFixture<unknown>, className: string): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      `.gantt-chart-edit-row button.${className}`,
    )!;
  }

  test("§8.17 depth is a data-depth attribute, never an inline style", () => {
    const fixture = mount();
    const rowHeaders = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(".gantt-table-tbody .gantt-table-th"),
    );
    expect(rowHeaders.map((h) => h.dataset["depth"])).toEqual(["0", "0", "0", "0", "1", "1"]);
    expect(rowHeaders.filter((h) => h.hasAttribute("style"))).toHaveLength(0);
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
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "End", { ctrlKey: true });
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("5");
    const collapse = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[aria-label="Collapse Phase 1"]',
    )!;
    click(fixture, collapse);
    expect(rows(fixture)).toHaveLength(4);
    expect(tabbableCells(fixture)).toHaveLength(1);
  });

  test("§8.8 focusing a cell by pointer moves the cursor there", () => {
    const fixture = mount();
    const cell = rows(fixture)[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
    cell.focus();
    fixture.detectChanges();
    expect(tabbableCells(fixture)).toEqual([cell]);
  });

  test("§8.9 opening the edit region moves focus to the start date's field", async () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    await settle(fixture);
    expect(document.activeElement).toBe(startField(fixture));
  });

  test("§8.11 Escape cancels the edit region and returns focus to the task's cell", async () => {
    const fixture = mount({ labels: LABELS });
    const onChange = vi.fn();
    fixture.componentInstance.taskChange.subscribe(onChange as (e: GanttTaskChangeEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    await settle(fixture);
    press(fixture, startField(fixture)!, "Escape");
    await settle(fixture);
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(tabbableCells(fixture)[0]);
  });

  test("§8.10 Save returns focus to the grid", async () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    await settle(fixture);
    click(fixture, editButton(fixture, "gantt-chart-save-button"));
    await settle(fixture);
    expect(document.activeElement).toBe(tabbableCells(fixture)[0]);
  });

  test("§8.10 a range entered end-first is saved start-first", async () => {
    const fixture = mount({ labels: LABELS });
    const onChange = vi.fn();
    fixture.componentInstance.taskChange.subscribe(onChange as (e: GanttTaskChangeEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    await settle(fixture);
    const field = startField(fixture)!;
    field.value = "2026-10-09";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
    field.dispatchEvent(new FocusEvent("blur"));
    await settle(fixture);
    click(fixture, editButton(fixture, "gantt-chart-save-button"));
    expect(onChange).toHaveBeenCalledWith({ taskId: "design", start: "2026-10-03", end: "2026-10-09" });
  });

  test("§8.16 controls whose labels are absent do not render unnamed", () => {
    const fixture = mount({ labels: { dateTimePickerLabels: DTP_LABELS } });
    expect(fixture.nativeElement.querySelector(".gantt-chart-collapse-button")).toBeNull();
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
    const fixture = mount({ labels: { ...LABELS, taskColumnHeader: "Task" } });
    expect(headers(fixture)[0].textContent?.trim()).toBe("Task");
  });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
  const heads = (f: ComponentFixture<unknown>) => headers(f).slice(1);

  test("markers mark the containing column, and a marker label renders as text", () => {
    const fixture = mount({
      markers: [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }],
    });
    expect(heads(fixture)[4].getAttribute("data-marker")).toBe("holiday");
    expect(heads(fixture)[4].textContent).toContain("Bank holiday");
    expect(heads(fixture)[3].hasAttribute("data-marker")).toBe(false);
    expect(fixture.nativeElement.querySelectorAll(".gantt-table-td[data-marker]").length).toBe(
      rows(fixture).length,
    );
  });

  test("isNonWorking marks a column only when every day in it is non-working", () => {
    const fixture = mount({ isNonWorking: (d: string) => d === "2026-10-03" || d === "2026-10-04" });
    expect(heads(fixture)[2].hasAttribute("data-non-working")).toBe(true);
    expect(heads(fixture)[3].hasAttribute("data-non-working")).toBe(true);
    expect(heads(fixture)[1].hasAttribute("data-non-working")).toBe(false);
  });

  test("week columns are non-working only if all seven days are", () => {
    const fixture = mount({ timeUnit: "week", isNonWorking: (d: string) => d === "2026-10-03" });
    expect(fixture.nativeElement.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
  });

  test("task type, critical and slack become data attributes on the row", () => {
    const fixture = mount({
      tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 } as GanttTask],
    });
    const row = rows(fixture)[0];
    expect(row.getAttribute("data-task-type")).toBe("design");
    expect(row.hasAttribute("data-critical")).toBe(true);
    expect(row.getAttribute("data-slack")).toBe("2");
  });

  test("labels.criticalLabel is visible text on a critical task, beside its unchanged label", () => {
    const fixture = mount({
      tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", critical: true }, { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", dependsOn: ["a"] }] as GanttTask[],
      labels: { criticalLabel: "Critical path", dependencySummary: (l: string[]) => `Depends on ${l.join(", ")}` },
    });
    const found = fixture.nativeElement.querySelectorAll(".gantt-chart-critical-label");
    expect(found.length).toBe(1);
    expect(found[0].textContent).toBe("Critical path");
    expect(fixture.nativeElement.querySelector(".gantt-chart-dependency-summary").textContent.trim()).toBe("Depends on A");
  });

  test("without labels.criticalLabel no critical text renders", () => {
    const fixture = mount({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", critical: true }, { id: "b", label: "B", start: "2026-10-03", end: "2026-10-04", dependsOn: ["a"] }] as GanttTask[] });
    expect(fixture.nativeElement.querySelector(".gantt-chart-critical-label")).toBeNull();
  });

  test("readonly: no edit region, no drag, navigation and collapse still work", () => {
    const fixture = mount({ labels: LABELS, readonly: true });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector(".gantt-chart-edit-row")).toBeNull();
    expect(fixture.nativeElement.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
    expect(fixture.nativeElement.querySelector(".gantt-chart").hasAttribute("data-readonly")).toBe(true);
    press(fixture, tabbableCells(fixture)[0], "ArrowRight");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");
    click(fixture, fixture.nativeElement.querySelector('[aria-label="Collapse Phase 1"]'));
    expect(fixture.nativeElement.querySelector('[aria-label="Expand Phase 1"]')).toBeTruthy();
  });
});

describe("GanttChart — progress field, baselines, typed dependencies", () => {
  const cellsOf = (f: ComponentFixture<unknown>, i: number) =>
    Array.from(rows(f)[i].querySelectorAll<HTMLElement>(".gantt-table-td"));
  const percentLabels: GanttLabels = { ...LABELS, percentLabel: "Percent complete" };
  const percentInput = (f: ComponentFixture<unknown>) =>
    f.nativeElement.querySelector(".gantt-chart-percent-input") as HTMLInputElement | null;
  const saveBtn = (f: ComponentFixture<unknown>) =>
    Array.from(f.nativeElement.querySelectorAll("button")).find(
      (b) => (b as HTMLElement).textContent!.trim() === "Save",
    ) as HTMLElement;
  const setPercent = (f: ComponentFixture<unknown>, value: string) => {
    const input = percentInput(f)!;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    f.detectChanges();
  };

  test("percentLabel adds a progress field to the edit region; without it none renders", () => {
    const a = mount({ labels: LABELS });
    press(a, tabbableCells(a)[0], "Enter");
    expect(percentInput(a)).toBeNull();
    const b = mount({ labels: percentLabels });
    press(b, tabbableCells(b)[0], "Enter");
    expect(percentInput(b)).toBeTruthy();
    expect(percentInput(b)!.closest("label")!.textContent).toContain("Percent complete");
  });

  test("the progress field starts at the task's percentComplete and Save emits the new value", () => {
    const f = mount({ labels: percentLabels });
    const events: GanttTaskChangeEvent[] = [];
    f.componentInstance.taskChange.subscribe((e) => events.push(e));
    press(f, tabbableCells(f)[0], "ArrowDown");
    press(f, tabbableCells(f)[0], "Enter");
    expect(percentInput(f)!.value).toBe("40");
    setPercent(f, "75");
    click(f, saveBtn(f));
    expect(events).toEqual([{ taskId: "build", start: "2026-10-04", end: "2026-10-06", percentComplete: 75 }]);
  });

  test("progress is clamped to 0–100", () => {
    const f = mount({ labels: percentLabels });
    const events: GanttTaskChangeEvent[] = [];
    f.componentInstance.taskChange.subscribe((e) => events.push(e));
    press(f, tabbableCells(f)[0], "Enter");
    setPercent(f, "250");
    click(f, saveBtn(f));
    expect(events[0].percentComplete).toBe(100);
  });

  test("without percentLabel Save emits no percentComplete", () => {
    const f = mount({ labels: LABELS });
    const events: GanttTaskChangeEvent[] = [];
    f.componentInstance.taskChange.subscribe((e) => events.push(e));
    press(f, tabbableCells(f)[0], "Enter");
    click(f, saveBtn(f));
    expect("percentComplete" in events[0]).toBe(false);
  });

  test("a baseline marks the cells it covers with data-baseline, apart from the current span", () => {
    const f = mount({
      tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } } as GanttTask],
    });
    const withBaseline = cellsOf(f, 0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
    expect(withBaseline).toEqual([1, 2, 3]);
    expect(cellsOf(f, 0)[3].hasAttribute("data-in-range")).toBe(true);
    expect(cellsOf(f, 0)[1].hasAttribute("data-in-range")).toBe(false);
  });

  test("baselineSummary renders as hidden text with the slip in days, and describes the row's cells", () => {
    const f = mount({
      tasks: [{ id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } } as GanttTask],
      labels: { baselineSummary: (t: string, b: { start: string; end: string }, v: number) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` },
    });
    const summary = f.nativeElement.querySelector(".gantt-chart-baseline-summary") as HTMLElement;
    expect(summary.hidden).toBe(true);
    expect(summary.textContent!.trim()).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
    expect(cellsOf(f, 0)[0].getAttribute("aria-describedby")).toContain(summary.id);
  });

  test("a task with no baseline has no baseline cells or summary", () => {
    const f = mount({ labels: { baselineSummary: () => "x" } });
    expect(f.nativeElement.querySelector("[data-baseline]")).toBeNull();
    expect(f.nativeElement.querySelector(".gantt-chart-baseline-summary")).toBeNull();
  });

  test("typed dependencies go through dependencyDetail; untyped ones keep the predecessor's label", () => {
    const f = mount({
      tasks: [
        { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
        { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a", type: "s2s", lag: 2 }, "a"] },
      ] as GanttTask[],
      labels: {
        dependencySummary: (preds: string[]) => `After: ${preds.join("; ")}`,
        dependencyDetail: (label: string, type: string, lag: number) => `${label} (${type}, lag ${lag})`,
      },
    });
    expect(f.nativeElement.querySelector(".gantt-chart-dependency-summary").textContent.trim()).toBe("After: Design (s2s, lag 2); Design");
  });

  test("a typed dependency without a lag or type defaults to e2s and 0", () => {
    const f = mount({
      tasks: [
        { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
        { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
      ] as GanttTask[],
      labels: { dependencySummary: (p: string[]) => p.join(), dependencyDetail: (l: string, t: string, g: number) => `${l}/${t}/${g}` },
    });
    expect(f.nativeElement.querySelector(".gantt-chart-dependency-summary").textContent.trim()).toBe("Design/e2s/0");
  });
});

describe("GanttChart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
  const zl = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u: string) => `Showing ${u}s` };
  const cols = (f: ComponentFixture<unknown>) => headers(f).length - 1;
  const btn = (f: ComponentFixture<unknown>, n: string) =>
    Array.from(f.nativeElement.querySelectorAll("button")).find((b) => (b as HTMLElement).getAttribute("aria-label") === n) as HTMLButtonElement;
  const cellAt = (f: ComponentFixture<unknown>, i: number) => rows(f)[0].querySelectorAll(".gantt-table-td")[i] as HTMLElement;
  const dt = () => ({ setData: () => {}, getData: () => "design" });
  const changes = (f: ComponentFixture<GanttChart>) => {
    const out: { taskId: string; start: string; end: string }[] = [];
    f.componentInstance.taskChange.subscribe((e) => out.push({ taskId: e.taskId, start: e.start, end: e.end }));
    return out;
  };

  test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", () => {
    const f = mount({ labels: LABELS });
    expect(f.nativeElement.querySelector(".gantt-chart-zoom")).toBeNull();
  });

  test("§14.2 zoom out steps to coarser columns, announcing each unit; §14.3 buttons disable at the ends", () => {
    const f = mount({ labels: zl });
    expect(btn(f, "Zoom in").disabled).toBe(true);
    const day = cols(f);
    click(f, btn(f, "Zoom out"));
    expect(cols(f)).toBeLessThan(day);
    expect(f.nativeElement.querySelector(".gantt-chart-status").textContent).toBe("Showing weeks");
    click(f, btn(f, "Zoom out"));
    expect(btn(f, "Zoom out").disabled).toBe(true);
    expect(btn(f, "Zoom in").disabled).toBe(false);
  });

  test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", () => {
    const f = mount();
    expect(rows(f)[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
    expect(cellAt(f, 2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
    expect(rows(f)[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
    const g = mount({ readonly: true });
    expect(g.nativeElement.querySelector(".gantt-chart-bar-handle")).toBeNull();
  });

  test("§14.6 the end handle extends the end; §14.7 the start handle moves the start and the range cannot invert", () => {
    const f = mount();
    const out = changes(f);
    cellAt(f, 2).querySelector(".gantt-chart-bar-handle-end")!.dispatchEvent(dragEvent("dragstart", dt()));
    cellAt(f, 5).dispatchEvent(dragEvent("drop", dt()));
    rows(f)[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart", dt()));
    cellAt(f, 1).dispatchEvent(dragEvent("drop", dt()));
    rows(f)[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart", dt()));
    cellAt(f, 7).dispatchEvent(dragEvent("drop", dt()));
    expect(out).toEqual([
      { taskId: "design", start: "2026-10-01", end: "2026-10-06" },
      { taskId: "design", start: "2026-10-02", end: "2026-10-03" },
    ]);
  });

  test("§14.9 clicking a row selects it; §14.10 again deselects; §14.11 the s key selects; §14.12 selectedTaskId starts selected", () => {
    const f = mount();
    const selects: (string | undefined)[] = [];
    f.componentInstance.taskSelect.subscribe((id) => selects.push(id));
    const c = rows(f)[1].querySelectorAll(".gantt-table-td")[0];
    click(f, c);
    expect(rows(f)[1].getAttribute("aria-selected")).toBe("true");
    expect(rows(f)[1].hasAttribute("data-selected")).toBe(true);
    click(f, c);
    expect(rows(f)[1].hasAttribute("data-selected")).toBe(false);
    expect(selects).toEqual(["build", undefined]);
    press(f, tabbableCells(f)[0], "s");
    expect(rows(f)[0].getAttribute("aria-selected")).toBe("true");
    const g = mount({ selectedTaskId: "launch" });
    expect(rows(g)[2].hasAttribute("data-selected")).toBe(true);
  });

  test("§14.13–§14.16 Alt+Arrow shifts, Alt+Shift+Arrow moves the end, not before the range, readonly ignores", () => {
    const f = mount();
    const out = changes(f);
    press(f, tabbableCells(f)[0], "ArrowLeft", { altKey: true });
    expect(out).toEqual([]);
    press(f, tabbableCells(f)[0], "ArrowRight", { altKey: true });
    press(f, tabbableCells(f)[0], "ArrowRight", { altKey: true, shiftKey: true });
    expect(out).toEqual([
      { taskId: "design", start: "2026-10-02", end: "2026-10-04" },
      { taskId: "design", start: "2026-10-01", end: "2026-10-04" },
    ]);
    const g = mount({ readonly: true });
    const ro = changes(g);
    press(g, tabbableCells(g)[0], "ArrowRight", { altKey: true });
    expect(ro).toEqual([]);
  });

  test("§14.17 taskAttrs adds attributes to each task's row", () => {
    const f = mount({ taskAttrs: (t: { id: string }) => ({ "data-team": t.id === "design" ? "ux" : "eng" }) });
    f.detectChanges();
    expect(rows(f)[0].getAttribute("data-team")).toBe("ux");
    expect(rows(f)[1].getAttribute("data-team")).toBe("eng");
  });
});

describe("GanttChart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
  const withUnscheduled: GanttTask[] = [
    { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
    { id: "u", label: "To be planned" },
  ];
  const unscheduledCell = (f: ComponentFixture<unknown>) =>
    f.nativeElement.querySelector('[data-task-id="u"] [data-row][data-col="0"]') as HTMLElement;
  const byLabel = (f: ComponentFixture<unknown>, name: string) =>
    Array.from(f.nativeElement.querySelectorAll("button")).find(
      (b) => ((b as HTMLElement).getAttribute("aria-label") ?? (b as HTMLElement).textContent)?.trim() === name,
    ) as HTMLButtonElement;

  test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
    const f = mount({ tasks: withUnscheduled });
    const row = f.nativeElement.querySelector('[data-task-id="u"]');
    expect(row.hasAttribute("data-unscheduled")).toBe(true);
    expect(row.querySelector(".gantt-chart-bar")).toBeNull();
    expect(row.querySelector("[data-in-range]")).toBeNull();
    expect(f.nativeElement.querySelector('[data-task-id="a"]').hasAttribute("data-unscheduled")).toBe(false);
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
    const f = mount({ tasks: withUnscheduled, labels: LABELS });
    unscheduledCell(f).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    press(f, unscheduledCell(f), "Enter");
    f.detectChanges();
    expect(byLabel(f, "Save").disabled).toBe(true);
  });

  test("§14.21 Alt+Arrow on an unscheduled task changes nothing", () => {
    const f = mount({ tasks: withUnscheduled });
    const changes: unknown[] = [];
    f.componentInstance.taskChange.subscribe((e) => changes.push(e));
    unscheduledCell(f).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    unscheduledCell(f).dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", altKey: true, bubbles: true }));
    f.detectChanges();
    expect(changes).toEqual([]);
  });

  test("§14.22 collapsedTaskIds starts parents collapsed and the model updates", () => {
    const f = mount({ collapsedTaskIds: ["parent"], labels: LABELS });
    expect(f.nativeElement.querySelector('[data-task-id="child1"]')).toBeNull();
    expect(byLabel(f, "Expand Phase 1").getAttribute("aria-expanded")).toBe("false");
    byLabel(f, "Expand Phase 1").click();
    f.detectChanges();
    expect(f.componentInstance.collapsedTaskIds()).toEqual([]);
    expect(f.nativeElement.querySelector('[data-task-id="child1"]')).not.toBeNull();
  });

  test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", () => {
    const f = mount({ labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
    expect(byLabel(f, "Expand all").disabled).toBe(true);
    byLabel(f, "Collapse all").click();
    f.detectChanges();
    expect(f.nativeElement.querySelector('[data-task-id="child1"]')).toBeNull();
    expect(byLabel(f, "Collapse all").disabled).toBe(true);
    byLabel(f, "Expand all").click();
    f.detectChanges();
    expect(f.nativeElement.querySelector('[data-task-id="child1"]')).not.toBeNull();
  });

  test("§14.24 no collapse-all buttons without labels or without parents", () => {
    expect(mount().nativeElement.querySelector(".gantt-chart-collapse-all")).toBeNull();
    const f = mount({ tasks: [TASKS[0]], labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
    expect(f.nativeElement.querySelector(".gantt-chart-collapse-all")).toBeNull();
  });
});

// ---- A small harness for the ported typed-fields suite: real DOM events, then a change-detection pass ----
let ported: ComponentFixture<GanttChart>[] = [];

/** Mounts the component, wiring the Svelte suite's callback props to outputs and inputs. */
function render(props: Record<string, unknown>): void {
  const fixture = TestBed.createComponent(GanttChart);
  const instance = fixture.componentInstance;
  fixture.componentRef.setInput("label", (props["label"] as string) ?? "Test");
  for (const [key, value] of Object.entries(props)) {
    if (key === "label") continue;
    if (key === "onFieldEdit") {
      fixture.componentRef.setInput("editableFields", true);
      instance.fieldEdit.subscribe(value as never);
    } else fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  ported.push(fixture);
}

function cleanup(): void {
  for (const f of ported) f.destroy();
  ported = [];
}

function settle(): void {
  for (const f of ported) f.detectChanges();
}

async function tick(): Promise<void> {
  settle();
  await new Promise((r) => setTimeout(r, 0));
  settle();
}

const fireEvent = {
  async click(el: Element) { (el as HTMLElement).click(); await tick(); },
  async input(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("input", { bubbles: true })); await tick(); },
  async change(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("change", { bubbles: true })); await tick(); },
  async keyDown(el: Element, init: KeyboardEventInit & { keyCode?: number }) { el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })); await tick(); },
  async scroll(el: Element) { el.dispatchEvent(new Event("scroll")); await tick(); },
};

async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
  const deadline = Date.now() + timeout;
  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await tick();
    }
  }
}

afterEach(cleanup);

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
        const exportHandler = vi.fn((_file: { format: string; filename: string; taskCount: number; blob: Blob }) => false as const);
        render({ ...base, labels: EXPORT_LABELS, exportHandler, ...props });
        await fireEvent.click(document.querySelector(`[data-gantt-export-format="${format}"]`)!);
        const file = exportHandler.mock.calls[0][0];
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

    test("§14.37 saving announces unless exportHandler returns false; no tasks disables the buttons", async () => {
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
        expect(Array.from(document.querySelectorAll('.gantt-table-td[tabindex="0"]'))).toHaveLength(1);
    });
});

// =====================================================================
// §17 weekend shading and dependency arrows (0.6.0)
// =====================================================================

describe("weekend shading and dependency arrows", () => {
  const headText = (f: ComponentFixture<unknown>) =>
    Array.from(f.nativeElement.querySelectorAll("thead th[data-weekend]")).map((h) => (h as HTMLElement).textContent?.trim());

  // 2026-10-03 is a Saturday, 2026-10-04 a Sunday.
  test("§17.1 weekends marks day columns on the header and every cell, and nothing without it", () => {
    const f = mount({ labels: LABELS, weekends: [0, 6] });
    expect(headText(f)).toEqual(["2026-10-03", "2026-10-04", "2026-10-10"]);
    expect(f.nativeElement.querySelectorAll("tbody td[data-weekend]")).toHaveLength(3 * TASKS.length);
  });

  test("§17.2 with no weekends nothing is shaded, and the weekend is never defaulted", () => {
    const f = mount({ labels: LABELS });
    expect(f.nativeElement.querySelector("[data-weekend]")).toBeNull();
  });

  test("§17.3 a Friday-Saturday weekend shades those days instead", () => {
    const f = mount({ labels: LABELS, weekends: [5, 6] });
    expect(headText(f)).toEqual(["2026-10-02", "2026-10-03", "2026-10-09", "2026-10-10"]);
  });

  test("§17.4 week and month columns are not marked", () => {
    const f = mount({ labels: LABELS, range: { start: "2026-10-01", end: "2026-12-31" }, weekends: [0, 6], timeUnit: "week" });
    expect(f.nativeElement.querySelector("[data-weekend]")).toBeNull();
  });

  test("§17.5 weekends can combine with isNonWorking", () => {
    const f = mount({ labels: LABELS, weekends: [6], isNonWorking: (d: string) => d === "2026-10-03" });
    const th = (Array.from(f.nativeElement.querySelectorAll("thead th")) as HTMLElement[]).find((h) => h.textContent?.trim() === "2026-10-03")!;
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

  /** Mount, then run change detection again: measuring happens after the first view check. */
  function mountMeasured(inputs: Record<string, unknown>): ComponentFixture<GanttChart> {
    const f = mount(inputs);
    f.detectChanges();
    f.detectChanges();
    return f;
  }

  test("§17.6 dependencyArrows draws one aria-hidden arrow per dependency, from the predecessor's end to the dependent's start", () => {
    const restore = stubLayout();
    try {
      const f = mountMeasured({ labels: LABELS, dependencyArrows: true });
      const arrows = f.nativeElement.querySelectorAll(".gantt-chart-dependency-arrow");
      expect(arrows).toHaveLength(1);
      expect(f.nativeElement.querySelector(".gantt-chart-dependency-arrows").getAttribute("aria-hidden")).toBe("true");
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
      const f = mountMeasured({ labels: LABELS, dependencyArrows: true });
      expect(f.nativeElement.querySelector(".gantt-chart-dependency-summary")?.textContent?.trim()).toBe("Blocked by: Design");
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
      const f = mountMeasured({ labels: LABELS, tasks, dependencyArrows: true });
      const arrows = f.nativeElement.querySelectorAll(".gantt-chart-dependency-arrow");
      expect(arrows).toHaveLength(1);
      expect(arrows[0].getAttribute("data-dependency-type")).toBe("s2s");
    } finally {
      restore();
    }
  });

  test("§17.9 without dependencyArrows there is no overlay", () => {
    const f = mountMeasured({ labels: LABELS });
    expect(f.nativeElement.querySelector(".gantt-chart-dependency-arrows")).toBeNull();
  });

  test("§17.10 collapsing a parent removes the arrows that touched its children", () => {
    const restore = stubLayout();
    try {
      const tasks: GanttTask[] = [
        { id: "p", label: "P", start: "2026-10-01", end: "2026-10-04" },
        { id: "c", label: "C", start: "2026-10-01", end: "2026-10-02", parentId: "p" },
        { id: "d", label: "D", start: "2026-10-05", end: "2026-10-06", dependsOn: ["c"] },
      ];
      const f = mountMeasured({ labels: LABELS, tasks, dependencyArrows: true, collapsedTaskIds: ["p"] });
      expect(f.nativeElement.querySelectorAll("[data-task-id]").length).toBe(2);
      expect(f.nativeElement.querySelector(".gantt-chart-dependency-arrow")).toBeNull();
    } finally {
      restore();
    }
  });
});

