import { afterEach, describe, expect, test, vi } from "vitest";

import {
  GanttChart,
  compareISO,
  effectiveRange,
  endOfMonth,
  flattenTasks,
  generateColumns,
} from "./gantt-chart.js";
import type { GanttLabels, GanttTask } from "./gantt-chart.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-gantt-chart")) {
  customElements.define("lily-gantt-chart", GanttChart);
}

afterEach(() => {
  document.body.innerHTML = "";
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

function mount(props: {
  label?: string;
  range?: { start: string; end: string };
  tasks?: GanttTask[];
  labels?: GanttLabels;
  today?: string;
  onTaskChange?: (taskId: string, start: string, end: string, percentComplete?: number) => void;
  attrs?: Record<string, string>;
}): GanttChart {
  const el = document.createElement("lily-gantt-chart") as GanttChart;
  el.label = props.label ?? "Q4 plan";
  if (props.today) el.today = props.today;
  for (const [k, v] of Object.entries(props.attrs ?? {})) el.setAttribute(k, v);
  document.body.appendChild(el);
  el.range = props.range ?? RANGE;
  el.tasks = props.tasks ?? TASKS;
  if (props.labels) el.labels = props.labels;
  if (props.onTaskChange) el.onTaskChange = props.onTaskChange;
  return el;
}

function tabbableCells(): HTMLElement[] {
  return Array.from(document.querySelectorAll('.gantt-chart-td[tabindex="0"]'));
}

function rows(): HTMLElement[] {
  return Array.from(document.querySelectorAll(".gantt-chart tbody tr"));
}

function press(el: Element, key: string, extra: KeyboardEventInit = {}): void {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extra }));
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

function buttonNamed(name: string): HTMLButtonElement {
  return Array.from(document.querySelectorAll("button")).find((b) => b.textContent === name) as HTMLButtonElement;
}

// The composed <lily-date-time-picker>'s own footer can ALSO carry a
// button whose text is "Cancel"/"Confirm" (from DTP_LABELS below), so
// gantt-chart's own Save/Cancel controls must be queried by class, not
// text content, to avoid clicking the wrong one.
function saveButton(): HTMLButtonElement {
  return document.querySelector(".gantt-chart-save-button")!;
}
function cancelButton(): HTMLButtonElement {
  return document.querySelector(".gantt-chart-cancel-button")!;
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
    const hs = document.querySelectorAll(".gantt-chart thead th");
    expect(hs).toHaveLength(11); // 10 day columns + 1 leading blank column
  });

  test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
    mount({});
    const designRow = rows()[0];
    const cells = designRow.querySelectorAll(".gantt-chart-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
    expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
    expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
  });

  test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
    mount({});
    const launchRow = rows()[2];
    const cells = Array.from(launchRow.querySelectorAll(".gantt-chart-td"));
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
    const cells = parentRow.querySelectorAll(".gantt-chart-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
    expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
    expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
  });

  test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", () => {
    mount({ labels: LABELS });
    expect(rows()).toHaveLength(6);
    const collapseButton = buttonNamed("▾");
    expect(collapseButton.getAttribute("aria-label")).toBe("Collapse Phase 1");
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    click(collapseButton);
    expect(rows()).toHaveLength(4);
    expect(document.body.textContent).not.toContain("Child A");
    const expandButton = buttonNamed("▸");
    expect(expandButton.getAttribute("aria-label")).toBe("Expand Phase 1");
    expect(expandButton.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("GanttChart — dependencies (§8.7)", () => {
  test("§8.7 a task with dependsOn carries aria-describedby to a generated summary", () => {
    mount({ labels: LABELS });
    const buildRow = rows()[1];
    const describedCell = buildRow.querySelector(".gantt-chart-td[aria-describedby]");
    expect(describedCell).toBeTruthy();
    const id = describedCell!.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)?.textContent).toBe("Blocked by: Design");
  });

  test("§8.7 a task with no dependencies carries no aria-describedby", () => {
    mount({ labels: LABELS });
    const designRow = rows()[0];
    expect(designRow.querySelector(".gantt-chart-td[aria-describedby]")).toBeNull();
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
    const pickers = document.querySelectorAll(".gantt-chart-edit-row lily-date-time-picker");
    expect(pickers).toHaveLength(2);
    expect(pickers[0].getAttribute("label")).toBe("Start date");
    expect(pickers[1].getAttribute("label")).toBe("End date");
  });

  test("§8.9 editing does not open when labels.dateTimePickerLabels is absent", () => {
    mount({});
    press(tabbableCells()[0], "Enter");
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.9 Enter on a parent row does not open an edit region", () => {
    mount({ labels: LABELS });
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
    click(saveButton());
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.11 Cancel closes the edit region without calling onTaskChange", () => {
    const onTaskChange = vi.fn();
    mount({ labels: LABELS, onTaskChange });
    press(tabbableCells()[0], "Enter");
    click(cancelButton());
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });
});

describe("GanttChart — pointer drag and announcements (§8.12, §8.13, §8.14)", () => {
  test("§8.12 dropping a task's bar on another column calls onTaskChange, preserving duration", () => {
    const onTaskChange = vi.fn();
    mount({ onTaskChange });
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
    const bar = rows()[0].querySelector(".gantt-chart-bar")!;
    const dragStart = new Event("dragstart", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dragStart, "dataTransfer", { value: dataTransfer });
    bar.dispatchEvent(dragStart);

    const targetCell = rows()[0].querySelectorAll(".gantt-chart-td")[5]; // Oct 6
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
    targetCell.dispatchEvent(drop);

    // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-06", "2026-10-08");
  });

  test("§8.13 a successful edit announces via labels.dateAnnouncement", () => {
    mount({ labels: LABELS });
    press(tabbableCells()[0], "Enter");
    click(saveButton());
    expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(
      "Design moved to 2026-10-01 - 2026-10-03",
    );
  });

  test("§8.14 `today` marks its column data-today; omitting it marks nothing", () => {
    mount({ today: "2026-10-05" });
    const hs = document.querySelectorAll(".gantt-chart thead th");
    expect(hs[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
    document.body.innerHTML = "";

    mount({});
    expect(document.querySelectorAll("[data-today]")).toHaveLength(0);
  });
});

describe("GanttChart — extra attributes (§8.15)", () => {
  test("§8.15 extra attributes spread onto the root", () => {
    mount({ attrs: { "data-testid": "chart-root" } });
    expect(document.querySelector('[data-testid="chart-root"]')).toBeTruthy();
  });
});

describe("GanttChart — no hardcoded strings (§8.16)", () => {
  test("§8.16 column headers fall back to the raw ISO date, never English text, when columnLabel is absent", () => {
    mount({});
    const hs = document.querySelectorAll(".gantt-chart thead th");
    expect(hs[1].textContent).toBe("2026-10-01");
  });
});

describe("GanttChart — focus, tab stop, hierarchy and edit edge cases", () => {
  function startField(): HTMLInputElement | null {
    return document.querySelector<HTMLInputElement>(".gantt-chart-edit-row .date-time-picker-input");
  }

  function taskRows(): HTMLElement[] {
    return rows().filter((r) => !r.classList.contains("gantt-chart-edit-row"));
  }

  test("§8.17 depth is a data-depth attribute, never an inline style", () => {
    mount({});
    const headers = Array.from(document.querySelectorAll<HTMLElement>(".gantt-chart-row-header"));
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
    const collapse = document.querySelector<HTMLButtonElement>('[aria-label="Collapse Phase 1"]')!;
    collapse.focus();
    click(collapse);
    expect(taskRows()).toHaveLength(4);
    expect(tabbableCells()).toHaveLength(1);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Expand Phase 1");
  });

  test("§8.8 focusing a cell by pointer moves the cursor there", () => {
    mount({});
    const cell = taskRows()[2].querySelectorAll<HTMLElement>("td")[4];
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
    click(saveButton());
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
    click(saveButton());
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-03", "2026-10-09");
  });

  test("§8.16 controls whose labels are absent do not render unnamed", () => {
    mount({ labels: { dateTimePickerLabels: DTP_LABELS } });
    expect(document.querySelector(".gantt-chart-collapse-button")).toBeNull();
    press(tabbableCells()[0], "Enter");
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
    mount({ labels: { ...LABELS, taskColumnHeader: "Task" } });
    expect(document.querySelector(".gantt-chart thead th")?.textContent).toBe("Task");
  });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
  const heads = () => Array.from(document.querySelectorAll(".gantt-chart thead th")).slice(1);

  test("markers mark the containing column, and a marker label renders as text", () => {
    const el = mount({ labels: LABELS });
    el.markers = [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }];
    expect(heads()[4].getAttribute("data-marker")).toBe("holiday");
    expect(heads()[4].textContent).toContain("Bank holiday");
    expect(heads()[3].hasAttribute("data-marker")).toBe(false);
    expect(document.querySelectorAll(".gantt-chart-td[data-marker]").length).toBe(rows().length);
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
    expect(document.querySelector(".gantt-chart thead [data-non-working]")).toBeNull();
  });

  test("task type, critical and slack become data attributes on the row", () => {
    mount({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 }] });
    const row = rows()[0];
    expect(row.getAttribute("data-task-type")).toBe("design");
    expect(row.hasAttribute("data-critical")).toBe(true);
    expect(row.getAttribute("data-slack")).toBe("2");
  });

  test("readonly: no edit region, no drag, navigation and collapse still work", () => {
    const el = mount({ labels: LABELS });
    el.readonly = true;
    press(tabbableCells()[0], "Enter");
    expect(document.querySelector(".gantt-chart-edit-row")).toBeNull();
    expect(document.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
    expect(document.querySelector(".gantt-chart")!.hasAttribute("data-readonly")).toBe(true);
    press(tabbableCells()[0], "ArrowRight");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
    (document.querySelector('[aria-label="Collapse Phase 1"]') as HTMLElement).click();
    expect(document.querySelector('[aria-label="Expand Phase 1"]')).toBeTruthy();
  });
});

describe("GanttChart — progress field, baselines, typed dependencies", () => {
  const cellsOf = (i: number) => Array.from(rows()[i].querySelectorAll<HTMLElement>(".gantt-chart-td"));
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

describe("GanttChart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
  const zl: GanttLabels = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out", zoomAnnouncement: (u) => `Showing ${u}s` };
  const cols = () => document.querySelectorAll(".gantt-chart thead th").length - 1;
  const btn = (n: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === n) as HTMLButtonElement;
  const cellAt = (i: number) => rows()[0].querySelectorAll(".gantt-chart-td")[i] as HTMLElement;
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
    const c = rows()[1].querySelectorAll(".gantt-chart-td")[0];
    click(c);
    expect(rows()[1].getAttribute("aria-selected")).toBe("true");
    expect(rows()[1].hasAttribute("data-selected")).toBe(true);
    click(rows()[1].querySelectorAll(".gantt-chart-td")[0]);
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

describe("lily-gantt-chart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
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
