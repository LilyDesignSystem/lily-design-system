// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  autoInit,
  initGanttChart,
  compareISO,
  endOfMonth,
  generateColumns,
  rangesOverlap,
} from "./gantt-chart.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve "./gantt-chart.njk" (this package),
// "lily-design-system-nunjucks-headless/components/…" (a real npm
// dependency living at the MONOREPO root — two levels up), and
// "lily-design-system-nunjucks-date-time-picker/dist/…" (a real npm
// dependency living inside THIS CATALOG — one level up, the same
// shape picker-bar.test.ts resolves its four sibling pickers through).
// See gantt-chart.njk's own header comment.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogRoot = path.join(__dirname, "..");
const repoRoot = path.join(__dirname, "..", "..");
const env = nunjucks.configure([__dirname, catalogRoot, repoRoot], {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const RANGE = { start: "2026-10-01", end: "2026-10-10" };

const TASKS = [
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

const LABELS = {
  startLabel: "Start date",
  endLabel: "End date",
  dateTimePickerLabels: DTP_LABELS,
  saveLabel: "Save",
  cancelLabel: "Cancel",
  dependencySummary: "Blocked by: {predecessors}",
  collapseLabel: "Collapse {task}",
  expandLabel: "Expand {task}",
};

function renderMacro(opts: Record<string, unknown>): string {
  const src = `{% from "./gantt-chart.njk" import ganttChart %}{{ ganttChart(opts) }}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector("[data-lily-gantt-chart-root]") as HTMLElement;
}

function defaultOpts(overrides: Record<string, unknown> = {}) {
  return {
    label: "Q4 plan",
    range: RANGE,
    tasks: TASKS,
    ...overrides,
  };
}

function rows(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll(".gantt-table-tbody > .gantt-table-tr[data-lily-gantt-chart-task-id]"));
}

function headerCells(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll(".gantt-table-thead .gantt-table-th"));
}

function tabbableCells(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('.gantt-table-td[tabindex="0"]'));
}

function setup(opts: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  const root = mountIntoBody(renderMacro(defaultOpts(opts)));
  const controller = initGanttChart(root, initOpts);
  return { root, controller };
}

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, ...init }));
}

function click(el: Element) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

// jsdom does not implement the DragEvent constructor, so a plain Event
// with a `dataTransfer` property attached stands in for one — the
// client only ever reads `event.dataTransfer`, never anything else
// DragEvent-specific. Mirrors kanban-board.test.ts's identical helper.
function dragEvent(type: string, dataTransfer: unknown): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  return event;
}

function typeIntoField(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("blur", { bubbles: true }));
}

function editRowFor(root: HTMLElement, taskId: string): HTMLElement {
  return root.querySelector(
    `.gantt-chart-edit-row[data-lily-gantt-chart-task-id="${taskId}"]`,
  ) as HTMLElement;
}

function saveButtonFor(root: HTMLElement, taskId: string): HTMLButtonElement {
  return root.querySelector(
    `[data-lily-gantt-chart-save-button][data-lily-gantt-chart-task-id="${taskId}"]`,
  ) as HTMLButtonElement;
}

function cancelButtonFor(root: HTMLElement, taskId: string): HTMLButtonElement {
  return root.querySelector(
    `[data-lily-gantt-chart-cancel-button][data-lily-gantt-chart-task-id="${taskId}"]`,
  ) as HTMLButtonElement;
}

function collapseButtonFor(root: HTMLElement, taskId: string): HTMLButtonElement {
  return root.querySelector(
    `[data-lily-gantt-chart-collapse-button][data-lily-gantt-chart-task-id="${taskId}"]`,
  ) as HTMLButtonElement;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  document.body.innerHTML = "";
});

// =====================================================================
// Pure helpers — civil-date arithmetic and column generation (§8.2)
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

  test("rangesOverlap tests inclusive range overlap", () => {
    expect(rangesOverlap("2026-10-01", "2026-10-03", "2026-10-03", "2026-10-05")).toBe(true);
    expect(rangesOverlap("2026-10-01", "2026-10-03", "2026-10-04", "2026-10-05")).toBe(false);
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

  test("generateColumns produces calendar-month columns for 'month', UTC-safe across a leap-year boundary", () => {
    const columns = generateColumns({ start: "2026-10-15", end: "2026-11-15" }, "month");
    expect(columns[0]).toEqual({ start: "2026-10-15", end: "2026-10-31" });
    expect(columns[1]).toEqual({ start: "2026-11-01", end: "2026-11-15" });
  });
});

// =====================================================================
// Macro markup — structural (no date math)
// =====================================================================

describe("GanttChart — macro markup (§8.1, §8.5)", () => {
  test("§8.1 renders a gantt-chart root wrapping a role=grid labelled by `label`", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.classList.contains("gantt-chart")).toBe(true);
    const grid = root.querySelector(".gantt-table") as HTMLElement;
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Q4 plan");
  });

  test("renders one row per task in hierarchy order with depth-based indentation", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const taskIds = rows(root).map((r) => r.getAttribute("data-lily-gantt-chart-task-id"));
    expect(taskIds).toEqual(["design", "build", "launch", "parent", "child1", "child2"]);
    const parentRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "parent")!;
    const childRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "child1")!;
    expect(parentRow.getAttribute("data-lily-gantt-chart-depth")).toBe("0");
    expect(childRow.getAttribute("data-lily-gantt-chart-depth")).toBe("1");
  });

  test("§8.5 a parent row's own data-start/data-end are the derived min/max of its descendants, not its own data", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const parentRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "parent")!;
    // parent's OWN start/end are both 2026-10-01; its children span 08-09.
    expect(parentRow.getAttribute("data-lily-gantt-chart-start")).toBe("2026-10-08");
    expect(parentRow.getAttribute("data-lily-gantt-chart-end")).toBe("2026-10-09");
  });

  test("a leaf row's data-start/data-end are its own task data", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    expect(designRow.getAttribute("data-lily-gantt-chart-start")).toBe("2026-10-01");
    expect(designRow.getAttribute("data-lily-gantt-chart-end")).toBe("2026-10-03");
  });

  test("no edit row renders for a parent task even when dateTimePickerLabels is supplied", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    expect(editRowFor(root, "parent")).toBeNull();
    expect(editRowFor(root, "design")).not.toBeNull();
  });

  test("no edit row renders anywhere when dateTimePickerLabels is absent", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.querySelector(".gantt-chart-edit-row")).toBeNull();
  });
});

// =====================================================================
// Hydrated grid body (§8.2, §8.3, §8.4)
// =====================================================================

describe("GanttChart — hydrated grid body (§8.2, §8.3, §8.4)", () => {
  test("§8.2 builds one date column header per day across the range, plus the leading blank column", () => {
    const { root } = setup();
    expect(headerCells(root)).toHaveLength(11); // 10 day columns + 1 leading blank column
  });

  test("§8.2 columnLabel, when supplied, formats each column header; default falls back to column.start", () => {
    const columnLabel = vi.fn((start: string) => `Col ${start}`);
    const { root } = setup({}, { labels: { columnLabel } });
    expect(headerCells(root)[1].textContent).toBe("Col 2026-10-01");
    expect(columnLabel).toHaveBeenCalledWith("2026-10-01", "2026-10-01", "day");

    const { root: root2 } = setup();
    expect(headerCells(root2)[1].textContent).toBe("2026-10-01");
  });

  test("§8.3 a task's range marks its overlapping cells data-in-range; other cells do not", () => {
    const { root } = setup();
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    const cells = designRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(true); // Oct 1
    expect(cells[2].hasAttribute("data-in-range")).toBe(true); // Oct 3
    expect(cells[3].hasAttribute("data-in-range")).toBe(false); // Oct 4
  });

  test("§8.3 a milestone (start === end) marks exactly one cell data-milestone", () => {
    const { root } = setup();
    const launchRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "launch")!;
    const cells = Array.from(launchRow.querySelectorAll(".gantt-table-td"));
    const milestoneCells = cells.filter((c) => c.hasAttribute("data-milestone"));
    expect(milestoneCells).toHaveLength(1);
    expect(milestoneCells[0].getAttribute("data-col")).toBe("6"); // Oct 7 = index 6
  });

  test("§8.5 a parent row's cells reflect its derived range, not its own start/end", () => {
    const { root } = setup();
    const parentRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "parent")!;
    const cells = parentRow.querySelectorAll(".gantt-table-td");
    expect(cells[0].hasAttribute("data-in-range")).toBe(false); // Oct 1 (parent's own start) not in derived range
    expect(cells[7].hasAttribute("data-in-range")).toBe(true); // Oct 8 (child1)
    expect(cells[8].hasAttribute("data-in-range")).toBe(true); // Oct 9 (child2)
  });

  test("§8.4 percentComplete renders as data-percent-complete only on the task's leading in-range cell", () => {
    const { root } = setup();
    const buildRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "build")!;
    const bar = buildRow.querySelector(".gantt-chart-bar");
    expect(bar?.getAttribute("data-percent-complete")).toBe("40");
    expect(buildRow.querySelectorAll(".gantt-chart-bar")).toHaveLength(1);
  });

  test("a task with no percentComplete renders a bar with no data-percent-complete", () => {
    const { root } = setup();
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    const bar = designRow.querySelector(".gantt-chart-bar");
    expect(bar?.hasAttribute("data-percent-complete")).toBe(false);
  });

  test("a parent task's bar is not draggable; a leaf task's is", () => {
    const { root } = setup();
    const parentRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "parent")!;
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    expect(parentRow.querySelector(".gantt-chart-bar")?.getAttribute("draggable")).toBeNull();
    expect(designRow.querySelector(".gantt-chart-bar")?.getAttribute("draggable")).toBe("true");
  });
});

// =====================================================================
// Row hierarchy (§8.5, §8.6)
// =====================================================================

describe("GanttChart — row hierarchy (§8.6)", () => {
  test("§8.6 collapsing a parent removes its descendant rows from the DOM outright", () => {
    const { root } = setup({ labels: LABELS });
    expect(rows(root)).toHaveLength(6);
    const collapseButton = collapseButtonFor(root, "parent");
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    expect(collapseButton.getAttribute("aria-label")).toBe("Collapse Phase 1");

    click(collapseButton);
    expect(rows(root)).toHaveLength(4);
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child1"]')).toBeNull();
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child2"]')).toBeNull();
    expect(collapseButton.getAttribute("aria-expanded")).toBe("false");
    expect(collapseButton.getAttribute("aria-label")).toBe("Expand Phase 1");
  });

  test("§8.6 expanding a collapsed parent restores its descendant rows, with grid cells intact", () => {
    const { root } = setup({ labels: LABELS });
    const collapseButton = collapseButtonFor(root, "parent");
    click(collapseButton);
    click(collapseButton);
    expect(rows(root)).toHaveLength(6);
    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");
    const childRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "child1")!;
    // Grid cells were rebuilt on expand — the row still has its full set of <td>s.
    expect(childRow.querySelectorAll(".gantt-table-td")).toHaveLength(10);
  });

  test("collapsing a parent also removes its childrens' own edit rows from the DOM", () => {
    // child1/child2 are leaf tasks, so — with dateTimePickerLabels supplied
    // — each gets its own edit row. Collapsing "parent" must remove those
    // too, not just the visible task rows.
    const { root } = setup({ labels: LABELS });
    expect(editRowFor(root, "child1")).not.toBeNull();
    click(collapseButtonFor(root, "parent"));
    expect(root.querySelector('.gantt-chart-edit-row[data-lily-gantt-chart-task-id="child1"]')).toBeNull();
    click(collapseButtonFor(root, "parent"));
    expect(editRowFor(root, "child1")).not.toBeNull();
  });
});

// =====================================================================
// Dependencies (§8.7)
// =====================================================================

describe("GanttChart — dependencies (§8.7)", () => {
  test("§8.7 a task with dependsOn carries aria-describedby on every cell, pointing at a generated summary", () => {
    const { root } = setup({ labels: LABELS });
    const buildRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "build")!;
    const describedCells = buildRow.querySelectorAll(".gantt-table-td[aria-describedby]");
    expect(describedCells.length).toBeGreaterThan(0);
    const id = describedCells[0].getAttribute("aria-describedby")!;
    expect(document.getElementById(id)?.textContent).toBe("Blocked by: Design");
  });

  test("§8.7 a task with no dependencies carries no aria-describedby", () => {
    const { root } = setup({ labels: LABELS });
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    expect(designRow.querySelector(".gantt-table-td[aria-describedby]")).toBeNull();
  });

  test("no dependency summary renders when labels.dependencySummary is absent", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.querySelector(".gantt-chart-dependency-summary")).toBeNull();
  });
});

// =====================================================================
// Roving-tabindex keyboard navigation (§8.8)
// =====================================================================

describe("GanttChart — roving-tabindex keyboard navigation (§8.8)", () => {
  test("§8.8 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    const { root } = setup();
    expect(tabbableCells(root)).toHaveLength(1);
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0");

    key(tabbableCells(root)[0], "ArrowRight");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("1");

    key(tabbableCells(root)[0], "ArrowLeft");
    key(tabbableCells(root)[0], "ArrowLeft");
    expect(tabbableCells(root)).toHaveLength(1);
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0"); // clamped, not wrapped
  });

  test("§8.8 Ctrl+End moves to the grid's last row/last column", () => {
    const { root } = setup();
    key(tabbableCells(root)[0], "End", { ctrlKey: true });
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("5");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("9");
  });

  test("roving-tabindex row bound follows the CURRENT visible row list after a collapse", () => {
    const { root } = setup({ labels: LABELS });
    click(collapseButtonFor(root, "parent")); // 6 rows -> 4 rows
    key(tabbableCells(root)[0], "End", { ctrlKey: true });
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("3"); // last of the now-4 rows, not 5
  });
});

// =====================================================================
// Edit region (§8.9, §8.10, §8.11)
// =====================================================================

describe("GanttChart — edit region (§8.9, §8.10, §8.11)", () => {
  test("§8.9 Enter on a focused non-parent row opens an edit region with two date pickers", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    expect(editRowFor(root, "design").hidden).toBe(false);
    const buttons = editRowFor(root, "design").querySelectorAll("[data-lily-date-time-picker-button]");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute("aria-label")).toBe("Start date");
    expect(buttons[1].getAttribute("aria-label")).toBe("End date");
  });

  test("§8.9 Space also opens the edit region", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], " ");
    expect(editRowFor(root, "design").hidden).toBe(false);
  });

  test("§8.9 editing does not open when labels.dateTimePickerLabels is absent (no edit row exists at all)", () => {
    const { root } = setup();
    key(tabbableCells(root)[0], "Enter");
    expect(root.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.9 Enter on a parent row does not open an edit region", () => {
    const { root } = setup({ labels: LABELS });
    // design(0), build(1), launch(2), parent(3): move down to the parent row.
    key(tabbableCells(root)[0], "ArrowDown");
    key(tabbableCells(root)[0], "ArrowDown");
    key(tabbableCells(root)[0], "ArrowDown");
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("3");
    key(tabbableCells(root)[0], "Enter");
    expect(root.querySelectorAll(".gantt-chart-edit-row:not([hidden])")).toHaveLength(0);
  });

  test("§8.10 Save calls onTaskChange with the task's id and edited dates, then closes", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    click(saveButtonFor(root, "design"));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
    expect(editRowFor(root, "design").hidden).toBe(true);
  });

  test("§8.10 Save reflects a typed date change in both the callback and the rebuilt grid", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    const startInput = editRowFor(root, "design").querySelectorAll(
      "[data-lily-date-time-picker-input]",
    )[0] as HTMLInputElement;
    typeIntoField(startInput, "2026-10-02");
    click(saveButtonFor(root, "design"));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-02", "2026-10-03");
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    expect(designRow.getAttribute("data-lily-gantt-chart-start")).toBe("2026-10-02");
    const firstCell = designRow.querySelectorAll(".gantt-table-td")[0];
    expect(firstCell.hasAttribute("data-in-range")).toBe(false); // Oct 1 no longer in range
  });

  test("§8.11 Cancel closes the edit region without calling onTaskChange", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    click(cancelButtonFor(root, "design"));
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(editRowFor(root, "design").hidden).toBe(true);
  });

  test("a cancelled (or reopened) edit resets both fields to the task's ORIGINAL dates, discarding a stale typed value", () => {
    // Regression test for the fresh-init/destroy-per-session design in
    // gantt-chart.client.js's openEdit(): date-time-picker.client.js
    // exposes no imperative reset, so this is the mechanism standing in
    // for one. Without it, a value typed then cancelled would leak into
    // the next edit session's Save.
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    const startInput = editRowFor(root, "design").querySelectorAll(
      "[data-lily-date-time-picker-input]",
    )[0] as HTMLInputElement;
    typeIntoField(startInput, "2026-11-15");
    click(cancelButtonFor(root, "design"));

    // Re-open the SAME task's edit region and save immediately, with no
    // further edits: if the reset failed, this would save the stale
    // "2026-11-15" instead of the task's real original start.
    key(tabbableCells(root)[0], "Enter");
    click(saveButtonFor(root, "design"));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03");
  });
});

// =====================================================================
// Pointer drag-and-drop and announcements (§8.12, §8.13, §8.14)
// =====================================================================

describe("GanttChart — pointer drag-and-drop and announcements (§8.12, §8.13, §8.14)", () => {
  test("§8.12 dropping a task's bar on another column calls onTaskChange, preserving duration", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({}, { onTaskChange });
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "design") };
    const designRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "design")!;
    const bar = designRow.querySelector(".gantt-chart-bar")!;
    bar.dispatchEvent(dragEvent("dragstart", dataTransfer));

    const targetCell = designRow.querySelectorAll(".gantt-table-td")[5]; // Oct 6
    targetCell.dispatchEvent(dragEvent("drop", dataTransfer));
    // design was Oct1-Oct3 (2-day duration); dropped on Oct6 keeps that duration.
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-06", "2026-10-08");
  });

  test("§8.13 a successful edit announces via labels.dateAnnouncement", () => {
    const dateAnnouncement = vi.fn(
      (taskLabel: string, start: string, end: string) => `${taskLabel} moved to ${start} - ${end}`,
    );
    const { root } = setup({ labels: LABELS }, { labels: { dateAnnouncement } });
    key(tabbableCells(root)[0], "Enter");
    click(saveButtonFor(root, "design"));
    expect(dateAnnouncement).toHaveBeenCalledWith("Design", "2026-10-01", "2026-10-03");
    expect(root.querySelector(".gantt-chart-status")?.textContent).toBe("Design moved to 2026-10-01 - 2026-10-03");
  });

  test("§8.13 no announcement fires when dateAnnouncement is absent", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    click(saveButtonFor(root, "design"));
    expect(root.querySelector(".gantt-chart-status")?.textContent).toBe("");
  });

  test("§8.14 `today` marks its column header and matching body cells data-today; omitting it marks nothing", () => {
    const { root } = setup({ today: "2026-10-05" });
    expect(headerCells(root)[5].hasAttribute("data-today")).toBe(true); // Oct 5 = index 4 + 1 leading column
    const buildRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "build")!;
    expect(buildRow.querySelectorAll(".gantt-table-td")[4].hasAttribute("data-today")).toBe(true); // Oct 5 = data-col 4

    const { root: root2 } = setup();
    expect(root2.querySelectorAll("[data-today]")).toHaveLength(0);
  });
});

// =====================================================================
// Extra attributes and i18n (§8.15, §8.16)
// =====================================================================

describe("GanttChart — extra attributes and i18n (§8.15, §8.16)", () => {
  test("§8.15 extra attributes spread onto the root", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ attributes: { "data-testid": "chart-root" } })));
    expect(root.getAttribute("data-testid")).toBe("chart-root");
  });

  test("§8.16 collapseLabel/expandLabel absent render an empty aria-label, not a baked-in string", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(collapseButtonFor(root, "parent").getAttribute("aria-label")).toBe("");
  });

  test("§8.16 saveLabel/cancelLabel render the caller's own text, not a baked-in string", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    expect(saveButtonFor(root, "design").textContent).toBe("Save");
    expect(cancelButtonFor(root, "design").textContent).toBe("Cancel");
  });
});

// =====================================================================
// autoInit / destroy
// =====================================================================

describe("GanttChart — autoInit and destroy", () => {
  test("autoInit wires every root on the page", () => {
    const html1 = renderMacro(defaultOpts({ name: "a" }));
    const html2 = renderMacro(
      defaultOpts({
        name: "b",
        tasks: [{ id: "solo", label: "Solo", start: "2026-10-02", end: "2026-10-02" }],
      }),
    );
    document.body.innerHTML = html1 + html2;
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
    const roots = Array.from(document.querySelectorAll("[data-lily-gantt-chart-root]")) as HTMLElement[];
    expect(tabbableCells(roots[0])).toHaveLength(1);
    expect(tabbableCells(roots[1])).toHaveLength(1);
  });

  test("destroy() detaches the listeners and closes any open edit region controllers", () => {
    const { root, controller } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    expect(editRowFor(root, "design").hidden).toBe(false);
    controller.destroy();
    key(tabbableCells(root)[0], "ArrowRight");
    // No listener remains: the roving-tabindex cursor does not move.
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0");
  });
});
