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
const catalogRoot = path.join(__dirname, ".."); // the repository root since 2026-10-10
const repoRoot = path.join(__dirname, ".."); // every sibling subproject sits here
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

  test("§8.16 without collapseLabel/expandLabel no unnamed collapse button renders", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(collapseButtonFor(root, "parent")).toBeNull();
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

describe("GanttChart — focus, hierarchy and edit edge cases", () => {
  function startInput(root: HTMLElement, taskId: string): HTMLInputElement {
    return editRowFor(root, taskId).querySelector("[data-lily-date-time-picker-input]") as HTMLInputElement;
  }

  test("§8.17 depth is a data-depth attribute, never an inline style", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const headers = rows(root).map((r) => r.querySelector<HTMLElement>(".gantt-table-th")!);
    expect(headers.map((h) => h.getAttribute("data-depth"))).toEqual(["0", "0", "0", "0", "1", "1"]);
    expect(headers.filter((h) => h.hasAttribute("style"))).toHaveLength(0);
  });

  test("§8.17 a task whose parentId names no task renders as a top-level row", () => {
    const orphan = { id: "orphan", label: "Orphan", start: "2026-10-02", end: "2026-10-02", parentId: "gone" };
    const root = mountIntoBody(renderMacro(defaultOpts({ tasks: [...TASKS, orphan] })));
    const orphanRow = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "orphan");
    expect(orphanRow).toBeTruthy();
    expect(orphanRow!.getAttribute("data-lily-gantt-chart-depth")).toBe("0");
  });

  test("§8.5 editing a child re-derives its parent's range", () => {
    const { root } = setup({ labels: LABELS });
    // Move focus to child A (row 4) and open its edit region.
    for (let i = 0; i < 4; i++) key(tabbableCells(root)[0], "ArrowDown");
    key(tabbableCells(root)[0], "Enter");
    typeIntoField(startInput(root, "child1"), "2026-10-02");
    click(saveButtonFor(root, "child1"));
    const parent = rows(root).find((r) => r.getAttribute("data-lily-gantt-chart-task-id") === "parent")!;
    expect(parent.getAttribute("data-lily-gantt-chart-start")).toBe("2026-10-02");
    expect(parent.getAttribute("data-lily-gantt-chart-end")).toBe("2026-10-09");
  });

  test("§8.8 focusing a cell by pointer moves the cursor there", () => {
    const { root } = setup();
    const cell = rows(root)[2].querySelectorAll<HTMLElement>(".gantt-table-td")[4];
    cell.focus();
    expect(tabbableCells(root)).toEqual([cell]);
    key(cell, "ArrowUp");
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("4");
  });

  test("§8.11 Escape cancels the edit region and returns focus to the task's cell", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    expect(editRowFor(root, "design").hidden).toBe(false);
    key(startInput(root, "design"), "Escape");
    expect(editRowFor(root, "design").hidden).toBe(true);
    expect(onTaskChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(tabbableCells(root)[0]);
  });

  test("§8.10 a range entered end-first is saved start-first", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    typeIntoField(startInput(root, "design"), "2026-10-09");
    click(saveButtonFor(root, "design"));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-03", "2026-10-09");
  });

  test("§8.16 the edit region is not rendered without its labels", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: { dateTimePickerLabels: DTP_LABELS } })));
    expect(root.querySelector(".gantt-chart-edit-row")).toBeNull();
  });

  test("§8.16 labels.taskColumnHeader names the leading header cell", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: { ...LABELS, taskColumnHeader: "Task" } })));
    expect(headerCells(root)[0].textContent?.trim()).toBe("Task");
  });
});

describe("GanttChart — markers, working calendar, task data, readonly", () => {
  const heads = (root: HTMLElement) => headerCells(root).slice(1);

  test("markers mark the containing column, and a marker label renders as text", () => {
    const { root } = setup({}, { markers: [{ date: "2026-10-05", kind: "holiday", label: "Bank holiday" }] });
    expect(heads(root)[4].getAttribute("data-marker")).toBe("holiday");
    expect(heads(root)[4].textContent).toContain("Bank holiday");
    expect(heads(root)[3].hasAttribute("data-marker")).toBe(false);
    expect(root.querySelectorAll(".gantt-table-td[data-marker]").length).toBe(rows(root).length);
  });

  test("isNonWorking marks a column only when every day in it is non-working", () => {
    const { root } = setup({}, { isNonWorking: (d: string) => d === "2026-10-03" || d === "2026-10-04" });
    expect(heads(root)[2].hasAttribute("data-non-working")).toBe(true);
    expect(heads(root)[3].hasAttribute("data-non-working")).toBe(true);
    expect(heads(root)[1].hasAttribute("data-non-working")).toBe(false);
  });

  test("week columns are non-working only if all seven days are", () => {
    const { root } = setup({ timeUnit: "week" }, { isNonWorking: (d: string) => d === "2026-10-03" });
    expect(root.querySelector(".gantt-table-thead [data-non-working]")).toBeNull();
  });

  test("task type, critical and slack become data attributes on the row", () => {
    const { root } = setup({
      tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", type: "design", critical: true, slack: 2 }],
    });
    const row = rows(root)[0];
    expect(row.getAttribute("data-task-type")).toBe("design");
    expect(row.hasAttribute("data-critical")).toBe(true);
    expect(row.getAttribute("data-slack")).toBe("2");
  });

  test("readonly: no edit rows, no drag, navigation and collapse still work", () => {
    const { root } = setup({ labels: LABELS, readonly: true });
    expect(root.querySelector(".gantt-chart-edit-row, [data-lily-gantt-chart-edit-row]")).toBeNull();
    key(tabbableCells(root)[0], "Enter");
    expect(root.querySelector(".gantt-chart-bar[draggable='true']")).toBeNull();
    expect(root.hasAttribute("data-readonly")).toBe(true);
    key(tabbableCells(root)[0], "ArrowRight");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("1");
    click(collapseButtonFor(root, "parent"));
    expect(collapseButtonFor(root, "parent").getAttribute("aria-expanded")).toBe("false");
  });
});

describe("gantt-chart — progress field, baselines, typed dependencies", () => {
  const cellsOf = (root: HTMLElement, i: number) =>
    Array.from(rows(root)[i].querySelectorAll<HTMLElement>(".gantt-table-td"));
  const percentLabels = { ...LABELS, percentLabel: "Percent complete" };
  const percentInput = (root: HTMLElement) =>
    root.querySelector<HTMLInputElement>("[data-lily-gantt-chart-percent-input]");
  const BASE_TASK = { id: "a", label: "A", start: "2026-10-04", end: "2026-10-06", baseline: { start: "2026-10-02", end: "2026-10-04" } };

  test("percentLabel adds a progress field to the edit row; without it none renders", () => {
    const a = setup({ labels: LABELS });
    expect(percentInput(a.root)).toBeNull();
    document.body.innerHTML = "";
    const b = setup({ labels: percentLabels });
    expect(percentInput(b.root)).toBeTruthy();
    expect(percentInput(b.root)!.closest("label")!.textContent).toContain("Percent complete");
  });

  test("the progress field starts at the task's percentComplete and Save passes the new value as a 4th argument", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: percentLabels }, { onTaskChange });
    key(tabbableCells(root)[0], "ArrowDown");
    key(tabbableCells(root)[0], "Enter");
    const input = root.querySelector<HTMLInputElement>('[data-lily-gantt-chart-edit-row][data-lily-gantt-chart-task-id="build"] [data-lily-gantt-chart-percent-input]')!;
    expect(input.value).toBe("40");
    input.value = "75";
    click(saveButtonFor(root, "build"));
    expect(onTaskChange).toHaveBeenCalledWith("build", "2026-10-04", "2026-10-06", 75);
  });

  test("progress is clamped to 0–100", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: percentLabels }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    root.querySelector<HTMLInputElement>('[data-lily-gantt-chart-edit-row][data-lily-gantt-chart-task-id="design"] [data-lily-gantt-chart-percent-input]')!.value = "250";
    click(saveButtonFor(root, "design"));
    expect(onTaskChange).toHaveBeenCalledWith("design", "2026-10-01", "2026-10-03", 100);
  });

  test("without percentLabel Save keeps the three-argument call", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ labels: LABELS }, { onTaskChange });
    key(tabbableCells(root)[0], "Enter");
    click(saveButtonFor(root, "design"));
    expect(onTaskChange.mock.calls[0]).toHaveLength(3);
  });

  test("a baseline marks the cells it covers with data-baseline, apart from the current span", () => {
    const { root } = setup({ tasks: [BASE_TASK] });
    const withBaseline = cellsOf(root, 0).map((c, i) => (c.hasAttribute("data-baseline") ? i : -1)).filter((i) => i >= 0);
    expect(withBaseline).toEqual([1, 2, 3]);
    expect(cellsOf(root, 0)[3].hasAttribute("data-in-range")).toBe(true);
    expect(cellsOf(root, 0)[1].hasAttribute("data-in-range")).toBe(false);
  });

  test("labels.baselineSummary renders hidden text with the slip in days, and describes the row's cells", () => {
    const { root } = setup(
      { tasks: [BASE_TASK] },
      { labels: { baselineSummary: (t: string, b: { start: string; end: string }, v: number) => `${t}: planned ${b.start} to ${b.end}, ${v} days late` } },
    );
    const summary = root.querySelector<HTMLElement>(".gantt-chart-baseline-summary")!;
    expect(summary.hidden).toBe(true);
    expect(summary.textContent).toBe("A: planned 2026-10-02 to 2026-10-04, 2 days late");
    expect(cellsOf(root, 0)[0].getAttribute("aria-describedby")).toContain(summary.id);
  });

  test("a task with no baseline has no baseline cells or summary", () => {
    const { root } = setup({}, { labels: { baselineSummary: () => "x" } });
    expect(root.querySelector("[data-baseline]")).toBeNull();
    expect(root.querySelector(".gantt-chart-baseline-summary")).toBeNull();
  });

  test("typed dependencies go through the dependencyDetail template; untyped ones keep the predecessor's label", () => {
    const { root } = setup({
      tasks: [
        { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
        { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a", type: "s2s", lag: 2 }, "a"] },
      ],
      labels: { dependencySummary: "After: {predecessors}", dependencyDetail: "{predecessor} ({type}, lag {lag})" },
    });
    expect(root.querySelector(".gantt-chart-dependency-summary")!.textContent).toBe("After: Design (s2s, lag 2), Design");
  });

  test("a typed dependency without a lag or type defaults to e2s and 0", () => {
    const { root } = setup({
      tasks: [
        { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-02" },
        { id: "b", label: "Build", start: "2026-10-03", end: "2026-10-04", dependsOn: [{ id: "a" }] },
      ],
      labels: { dependencySummary: "{predecessors}", dependencyDetail: "{predecessor}/{type}/{lag}" },
    });
    expect(root.querySelector(".gantt-chart-dependency-summary")!.textContent).toBe("Design/e2s/0");
  });
});

describe("gantt-chart — zoom, resize handles, selection, Alt+Arrow, taskAttrs (§14.1–§14.17)", () => {
  const zl = { ...LABELS, zoomIn: "Zoom in", zoomOut: "Zoom out" };
  const cols = (root: HTMLElement) => headerCells(root).length - 1;
  const btn = (n: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === n) as HTMLButtonElement;
  const cellAt = (root: HTMLElement, i: number) => rows(root)[0].querySelectorAll(".gantt-table-td")[i] as HTMLElement;
  const dt = () => ({ setData: () => {}, getData: () => "design" });
  const dropAt = (el: Element) => el.dispatchEvent(dragEvent("drop", dt()));

  test("§14.1 no zoom buttons without labels.zoomIn / zoomOut", () => {
    const { root } = setup({ labels: LABELS });
    expect(root.querySelector(".gantt-chart-zoom")).toBeNull();
  });

  test("§14.2 zoom out steps to coarser columns, announcing each unit; §14.3 buttons disable at the ends", () => {
    const { root } = setup({ labels: zl }, { labels: { zoomAnnouncement: (u: string) => `Showing ${u}s` } });
    expect(btn("Zoom in").disabled).toBe(true);
    const day = cols(root);
    click(btn("Zoom out"));
    expect(cols(root)).toBeLessThan(day);
    expect(root.querySelector(".gantt-chart-status")!.textContent).toBe("Showing weeks");
    click(btn("Zoom out"));
    expect(btn("Zoom out").disabled).toBe(true);
    expect(btn("Zoom in").disabled).toBe(false);
  });

  test("§14.5 a leaf task's bar has a start handle and the last in-range cell an end handle; none when readonly or for a parent", () => {
    const { root } = setup({});
    expect(rows(root)[0].querySelector(".gantt-chart-bar-handle-start")).toBeTruthy();
    expect(cellAt(root, 2).querySelector(".gantt-chart-bar-handle-end")).toBeTruthy();
    expect(rows(root)[3].querySelector(".gantt-chart-bar-handle")).toBeNull();
    document.body.innerHTML = "";
    const ro = setup({ readonly: true });
    expect(ro.root.querySelector(".gantt-chart-bar-handle")).toBeNull();
  });

  test("§14.6 the end handle extends the end; §14.7 the start handle moves the start and the range cannot invert", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({}, { onTaskChange });
    cellAt(root, 2).querySelector(".gantt-chart-bar-handle-end")!.dispatchEvent(dragEvent("dragstart", dt()));
    dropAt(cellAt(root, 5));
    rows(root)[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart", dt()));
    dropAt(cellAt(root, 1));
    rows(root)[0].querySelector(".gantt-chart-bar-handle-start")!.dispatchEvent(dragEvent("dragstart", dt()));
    dropAt(cellAt(root, 7));
    expect(onTaskChange.mock.calls).toEqual([
      ["design", "2026-10-01", "2026-10-06"],
      ["design", "2026-10-02", "2026-10-06"],
    ]);
  });

  test("§14.9 clicking a row selects it; §14.10 again deselects; §14.11 the s key selects; §14.12 selectedTaskId starts selected", () => {
    const onTaskSelect = vi.fn();
    const { root } = setup({}, { onTaskSelect });
    click(rows(root)[1].querySelectorAll(".gantt-table-td")[0]);
    expect(rows(root)[1].getAttribute("aria-selected")).toBe("true");
    expect(rows(root)[1].hasAttribute("data-selected")).toBe(true);
    click(rows(root)[1].querySelectorAll(".gantt-table-td")[0]);
    expect(rows(root)[1].hasAttribute("data-selected")).toBe(false);
    expect(onTaskSelect.mock.calls).toEqual([["build"], [undefined]]);
    key(tabbableCells(root)[0], "s");
    expect(rows(root)[0].getAttribute("aria-selected")).toBe("true");
    document.body.innerHTML = "";
    const g = setup({ selectedTaskId: "launch" });
    expect(rows(g.root)[2].hasAttribute("data-selected")).toBe(true);
  });

  test("§14.13–§14.16 Alt+Arrow shifts, Alt+Shift+Arrow moves the end, not before the range, readonly ignores", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({}, { onTaskChange });
    key(tabbableCells(root)[0], "ArrowLeft", { altKey: true });
    expect(onTaskChange).not.toHaveBeenCalled();
    key(tabbableCells(root)[0], "ArrowRight", { altKey: true });
    key(tabbableCells(root)[0], "ArrowRight", { altKey: true, shiftKey: true });
    expect(onTaskChange.mock.calls).toEqual([
      ["design", "2026-10-02", "2026-10-04"],
      ["design", "2026-10-02", "2026-10-05"],
    ]);
    document.body.innerHTML = "";
    const ro = vi.fn();
    const g = setup({ readonly: true }, { onTaskChange: ro });
    key(tabbableCells(g.root)[0], "ArrowRight", { altKey: true });
    expect(ro).not.toHaveBeenCalled();
  });

  test("§14.17 a task's attrs become attributes on its row", () => {
    const { root } = setup({ tasks: TASKS.map((t) => (t.id === "design" ? { ...t, attrs: { "data-team": "ux" } } : t)) });
    expect(rows(root)[0].getAttribute("data-team")).toBe("ux");
  });
});

describe("GanttChart — unscheduled tasks and collapse-all (§14.18–§14.24)", () => {
  const withUnscheduled = [
    { id: "a", label: "Alpha", start: "2026-10-01", end: "2026-10-02" },
    { id: "u", label: "To be planned" },
  ];
  const taskRow = (root: HTMLElement, id: string) => root.querySelector(`[data-lily-gantt-chart-task-id="${id}"].gantt-table-tr`) as HTMLElement;
  const named = (name: string) =>
    Array.from(document.querySelectorAll("button")).find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name) as HTMLButtonElement;

  test("§14.18 a task with no dates renders a row with no bar and data-unscheduled", () => {
    const { root } = setup({ tasks: withUnscheduled });
    const row = taskRow(root, "u");
    expect(row.hasAttribute("data-unscheduled")).toBe(true);
    expect(row.querySelector(".gantt-chart-bar")).toBeNull();
    expect(row.querySelector("[data-in-range]")).toBeNull();
    expect(taskRow(root, "a").hasAttribute("data-unscheduled")).toBe(false);
  });

  test("§14.19 an unscheduled child does not shape its parent's span", () => {
    const { root } = setup({
      tasks: [
        { id: "p", label: "P" },
        { id: "c1", label: "C1", parentId: "p", start: "2026-10-03", end: "2026-10-04" },
        { id: "c2", label: "C2", parentId: "p" },
      ],
    });
    const parent = taskRow(root, "p");
    expect(parent.getAttribute("data-lily-gantt-chart-start")).toBe("2026-10-03");
    expect(parent.getAttribute("data-lily-gantt-chart-end")).toBe("2026-10-04");
  });

  test("§14.20 Enter on an unscheduled task opens the edit region with empty dates; Save is disabled until both are set", () => {
    const { root } = setup({ tasks: withUnscheduled, labels: LABELS });
    const cell = taskRow(root, "u").querySelector<HTMLElement>('[data-row][data-col="0"]')!;
    cell.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    key(cell, "Enter");
    expect(saveButtonFor(root, "u").disabled).toBe(true);
  });

  test("§14.21 Alt+Arrow on an unscheduled task changes nothing", () => {
    const onTaskChange = vi.fn();
    const { root } = setup({ tasks: withUnscheduled }, { onTaskChange });
    const cell = taskRow(root, "u").querySelector<HTMLElement>('[data-row][data-col="0"]')!;
    cell.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    key(cell, "ArrowRight", { altKey: true });
    expect(onTaskChange).not.toHaveBeenCalled();
  });

  test("§14.22 collapsedTaskIds starts parents collapsed; the change is reported", () => {
    const onCollapsedTaskIdsChange = vi.fn();
    const { root, controller } = setup({ labels: LABELS, collapsedTaskIds: ["parent"] }, { onCollapsedTaskIdsChange });
    const events: string[][] = [];
    root.addEventListener("collapsechange", (e) => events.push((e as CustomEvent).detail));
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child1"]')).toBeNull();
    expect(collapseButtonFor(root, "parent").getAttribute("aria-expanded")).toBe("false");
    expect(controller.collapsedTaskIds()).toEqual(["parent"]);
    click(collapseButtonFor(root, "parent"));
    expect(onCollapsedTaskIdsChange).toHaveBeenCalledWith([]);
    expect(events).toEqual([[]]);
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child1"]')).not.toBeNull();
  });

  test("§14.23 labels.collapseAll and expandAll gate buttons that collapse and expand every parent", () => {
    const { root } = setup({ labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
    expect(named("Expand all").disabled).toBe(true);
    click(named("Collapse all"));
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child1"]')).toBeNull();
    expect(named("Collapse all").disabled).toBe(true);
    expect(named("Expand all").disabled).toBe(false);
    click(named("Expand all"));
    expect(root.querySelector('[data-lily-gantt-chart-task-id="child1"]')).not.toBeNull();
  });

  test("§14.24 no collapse-all buttons without labels or without parents", () => {
    setup();
    expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
    document.body.innerHTML = "";
    setup({ tasks: [TASKS[0]], labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
    expect(document.querySelector(".gantt-chart-collapse-all")).toBeNull();
  });

  test("§14.25 nested parents collapse deepest-first and expand again parents-first", () => {
    const nested = [
      { id: "g", label: "G", start: "2026-10-01", end: "2026-10-09" },
      { id: "p", label: "P", parentId: "g" },
      { id: "c", label: "C", parentId: "p", start: "2026-10-02", end: "2026-10-03" },
    ];
    const { root } = setup({ tasks: nested, labels: { expandAll: "Expand all", collapseAll: "Collapse all" } });
    click(named("Collapse all"));
    expect(rows(root)).toHaveLength(1);
    click(named("Expand all"));
    expect(rows(root)).toHaveLength(3);
  });
});

// ---- A small harness for the ported typed-fields suite: the macro renders, the client runs, real DOM events ----
function render(props: Record<string, unknown>): { root: HTMLElement; controller: ReturnType<typeof initGanttChart> } {
  const { onFieldEdit, onExport, fieldHooks, ...rest } = props as Record<string, unknown> & { labels?: Record<string, unknown> };
  const macro: Record<string, unknown> = { ...rest };
  if (onFieldEdit) macro["editableFields"] = true;
  // The search field renders only when `labels.search` names it.
  if (macro["search"] !== undefined) macro["labels"] = { search: "Search", ...((macro["labels"] as object) ?? {}) };
  const html = renderMacro(macro);
  const root = mountIntoBody(html);
  const controller = initGanttChart(root, { onFieldEdit, onExport, fieldHooks } as never);
  return { root, controller };
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
        exportAnnouncement: "{count} tasks as {format}: {filename}",
        editAnnouncement: "{task} {field} is {value}",
        editInvalid: "{task}: bad {field}",
    };
    const base = { label: "Q4", range: RANGE, tasks: FT, fields: FIELDS };
    const rowOf = (id: string) => document.querySelector<HTMLElement>(`[data-lily-gantt-chart-task-id="${id}"]`)!;

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
        render({ ...base, fields: [{ id: "p", header: "P", type: "number" }], fieldHooks: { p: { parse: () => Number.NaN } }, tasks: [{ ...FT[0], values: { p: 1 } }], onFieldEdit, labels: EXPORT_LABELS });
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
        const rendered = document.querySelectorAll("tr.gantt-table-tr[data-lily-gantt-chart-task-id]").length;
        expect(rendered).toBeGreaterThan(0);
        expect(rendered).toBeLessThan(20);
        expect(document.querySelector(".gantt-table")!.getAttribute("aria-rowcount")).toBe("201");
        expect(document.querySelector('[data-lily-gantt-chart-task-id="r0"]')!.getAttribute("aria-rowindex")).toBe("2");
        expect(document.querySelector(".gantt-chart-spacer")).not.toBeNull();
        expect(document.querySelector(".gantt-chart-scroll")!.getAttribute("style")).toContain("height: 100px");
    });

    test("§14.39 scrolling brings later rows in; keyboard focus to the last row reveals it", async () => {
        render({ label: "Q4", range: RANGE, tasks: MANY, virtualize: { rowHeight: 20, height: 100 } });
        const scroll = document.querySelector<HTMLElement>(".gantt-chart-scroll")!;
        scroll.scrollTop = 2000;
        await fireEvent.scroll(scroll);
        expect(document.querySelector('[data-lily-gantt-chart-task-id="r100"]')).not.toBeNull();
        expect(document.querySelector('[data-lily-gantt-chart-task-id="r1"]')).toBeNull(); // r0 stays: it holds the roving tab stop
        const cell = document.querySelector<HTMLElement>("[data-row][data-col]")!;
        await fireEvent.keyDown(cell, { key: "End", ctrlKey: true });
        await waitFor(() => expect(document.querySelector('[data-lily-gantt-chart-task-id="r199"]')).not.toBeNull());
    });

    test("§14.40 without virtualize every row renders, and the roving tab stop stays unique", () => {
        render({ label: "Q4", range: RANGE, tasks: MANY });
        expect(document.querySelectorAll("tr.gantt-table-tr[data-lily-gantt-chart-task-id]")).toHaveLength(200);
        expect(document.querySelectorAll('.gantt-table-td[tabindex="0"]')).toHaveLength(1);
    });
});
