import { ComponentFixture, TestBed } from "@angular/core/testing";
import { fireEvent as domFireEvent, screen, waitFor } from "@testing-library/dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { GanttChart, type GanttLabels, type GanttTask } from "./gantt-chart.component";

let fixtures: ComponentFixture<GanttChart>[] = [];

/** The Svelte suite's `render(GanttChart, { props })`: mounts the chart, wiring callback props to outputs. */
function render(
  _component: unknown,
  options: { props: Record<string, unknown> },
): { unmount: () => void; container: HTMLElement; rerender: (props: Record<string, unknown>) => Promise<void> } {
  const fixture = TestBed.createComponent(GanttChart);
  const instance = fixture.componentInstance;
  for (const [key, value] of Object.entries(options.props)) {
    if (key === "onFieldEdit") {
      fixture.componentRef.setInput("editableFields", true);
      instance.fieldEdit.subscribe(value as never);
    } else if (key === "onTaskChange") {
      instance.taskChange.subscribe((e) => (value as (...args: unknown[]) => void)(e.taskId, e.start, e.end, e.percentComplete));
    } else if (key === "onExport") {
      fixture.componentRef.setInput("exportHandler", value);
    } else if (key === "onTaskSelect") {
      instance.taskSelect.subscribe(value as never);
    } else fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return {
    unmount: () => fixture.destroy(),
    container: fixture.nativeElement as HTMLElement,
    rerender: async (props) => {
      for (const [key, value] of Object.entries(props)) {
        if (key.startsWith("on")) continue;
        fixture.componentRef.setInput(key, value);
      }
      fixture.detectChanges();
      await Promise.resolve();
    },
  };
}

function settle(): void {
  for (const f of fixtures) f.detectChanges();
}

/** `@testing-library/dom`'s fireEvent, followed by a change-detection pass (Angular does not re-render on its own in a test). */
const fireEvent = new Proxy({} as typeof domFireEvent, {
  get: (_target, name: string) => async (el: Element, init?: unknown) => {
    const fn = (domFireEvent as unknown as Record<string, (e: Element, i?: unknown) => boolean>)[name];
    const result = fn(el, init);
    settle();
    await Promise.resolve();
    settle();
    return result;
  },
});

const nextTick = async () => {
  await Promise.resolve();
  settle();
};

afterEach(() => {
  vi.restoreAllMocks();
  for (const f of fixtures) f.destroy();
  fixtures = [];
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


describe("search", () => {
    const SEARCH_LABELS: GanttLabels = { ...LABELS, search: "Search tasks", searchAnnouncement: (m, t) => `${m} of ${t} tasks` };
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.1 the field renders only when labels.search names it", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } });
        expect(document.querySelector(".gantt-chart-search")).toBeNull();
    });

    test("§18.2 typing shows only matching tasks (every word, any order, ignoring case)", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } });
        const input = screen.getByRole("searchbox", { name: "Search tasks" });
        await fireEvent.input(input, { target: { value: "LAUNCH" } });
        expect(ids()).toEqual(["launch"]);
        await fireEvent.input(input, { target: { value: "" } });
        expect(ids()).toHaveLength(TASKS.length);
    });

    test("§18.3 a match under a parent keeps its ancestors, and shows even when the parent is collapsed", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS, collapsedTaskIds: ["parent"] } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "child b" } });
        expect(ids()).toEqual(["parent", "child2"]);
    });

    test("§18.4 matches are wrapped in <mark class=gantt-chart-match>, and only while searching", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } });
        expect(document.querySelector("mark")).toBeNull();
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "des" } });
        expect(document.querySelector("mark.gantt-chart-match")?.textContent).toBe("Des");
    });

    test("§18.5 the default text includes typed field text", async () => {
        const tasks = TASKS.map((t) => (t.id === "build" ? { ...t, values: { owner: "Zoë" } } : t));
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks, labels: SEARCH_LABELS, fields: [{ id: "owner", header: "Owner" }] } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "zoe" } });
        expect(ids()).toEqual(["build"]);
    });

    test("§18.6 searchText replaces what is looked in", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS, searchText: (t: GanttTask) => t.id.toUpperCase() } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "design" } });
        expect(ids()).toEqual(["design"]);
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "Design" } });
        expect(ids()).toEqual(["design"]);
    });

    test("§18.7 the result count is announced, and clearing announces everything again", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } });
        const input = screen.getByRole("searchbox");
        await fireEvent.input(input, { target: { value: "child" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(`2 of ${TASKS.length} tasks`));
        await fireEvent.input(input, { target: { value: "" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe(`${TASKS.length} of ${TASKS.length} tasks`));
    });

    test("§18.8 Escape in the field clears the search", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: SEARCH_LABELS } });
        const input = screen.getByRole("searchbox") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "launch" } });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(input.value).toBe("");
        expect(ids()).toHaveLength(TASKS.length);
    });

    test("§18.9 an export of the visible tasks holds only the matches", async () => {
        const onExport = vi.fn(() => false);
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: { ...SEARCH_LABELS, export: "Export", exportCsv: "CSV", exportHeaders: { task: "Task", start: "Start", end: "End" } }, exportScope: "visible", onExport } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "launch" } });
        await fireEvent.click(screen.getByText("CSV"));
        expect((onExport.mock.calls[0] as unknown as [{ taskCount: number }])[0].taskCount).toBe(1);
    });

    test("§18.10 the search prop works without the field", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, search: "launch" } });
        expect(ids()).toEqual(["launch"]);
    });
});

describe("filter", () => {
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.11 filter hides the tasks it rejects, and a passing child keeps its parent", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, filter: (t: GanttTask) => t.id === "child2" } });
        expect(ids()).toEqual(["parent", "child2"]);
    });

    test("§18.12 filter combines with search (both must pass)", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, filter: (t: GanttTask) => t.id !== "design", search: "d" } });
        expect(ids()).not.toContain("design");
        expect(ids()).toContain("build");
    });

    test("§18.13 filter sees typed values, so a status filter works", () => {
        const tasks = TASKS.map((t) => ({ ...t, values: { status: t.id === "launch" ? "done" : "open" } }));
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks, labels: LABELS, filter: (t: GanttTask) => t.values?.status === "done" } });
        expect(ids()).toEqual(["launch"]);
    });

    test("§18.14 no filter and no search shows every task as before", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } });
        expect(ids()).toHaveLength(TASKS.length);
    });
});

describe("compare", () => {
    const ids = () => Array.from(document.querySelectorAll("tbody tr[data-task-id]")).map((r) => r.getAttribute("data-task-id"));

    test("§18.15 compare orders tasks among their siblings and keeps children under their parent", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, compare: (a: GanttTask, b: GanttTask) => b.label.localeCompare(a.label) } });
        expect(ids()).toEqual(["parent", "child2", "child1", "launch", "design", "build"]);
    });

    test("§18.16 the sort is stable: equal tasks keep their input order", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, compare: () => 0 } });
        expect(ids()).toEqual(["design", "build", "launch", "parent", "child1", "child2"]);
    });

    test("§18.17 compare can use typed values", () => {
        const tasks = TASKS.map((t, i) => ({ ...t, values: { rank: 10 - i } }));
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks, labels: LABELS, compare: (a: GanttTask, b: GanttTask) => Number(a.values?.rank) - Number(b.values?.rank) } });
        expect(ids()[0]).toBe("parent");
    });

    test("§18.18 the visible export follows the order", async () => {
        const onExport = vi.fn(() => false);
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: { ...LABELS, export: "Export", exportCsv: "CSV", exportHeaders: { task: "Task", start: "Start", end: "End" } }, exportScope: "visible", compare: (a: GanttTask, b: GanttTask) => b.label.localeCompare(a.label), onExport } });
        await fireEvent.click(screen.getByText("CSV"));
        expect(onExport).toHaveBeenCalled();
    });
});

describe("copy to clipboard", () => {
    const L: GanttLabels = { ...LABELS, export: "Export", copy: "Copy", exportHeaders: { task: "Task", start: "Start", end: "End" }, copyAnnouncement: (n) => `${n} tasks copied`, copyFailed: "Copy failed" };
    const wait = () => new Promise((r) => setTimeout(r, 0));

    test("§18.19 copy needs labels.copy and exportHeaders", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: { ...LABELS, copy: "Copy" } } });
        expect(document.querySelector('[data-gantt-export-format="copy"]')).toBeNull();
    });

    test("§18.20 copy puts the tasks on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: L, copyHandler: onCopy } });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        expect(writeText).not.toHaveBeenCalled();
        document.body.innerHTML = "";
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: L, exportScope: "visible", search: "launch" } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } });
        await fireEvent.keyDown(first(), { key: "PageDown" });
        expect(activeRowIndex()).toBe(10);
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "PageUp" });
        expect(activeRowIndex()).toBe(0);
        await fireEvent.keyDown(document.querySelector('.gantt-table-td[tabindex="0"]')!, { key: "PageUp" });
        expect(activeRowIndex()).toBe(0);
    });

    test("§18.23 with virtualize a page is the visible rows", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS, virtualize: { rowHeight: 20, height: 100 } } });
        await fireEvent.keyDown(first(), { key: "PageDown" });
        expect(activeRowIndex()).toBe(5);
    });

    test("§18.24 typing a letter moves to the next task whose label starts with it", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks, labels: LABELS } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks, labels: LABELS } });
        await fireEvent.keyDown(first(), { key: "s" });
        expect(activeRowIndex()).toBe(0);
        expect(document.querySelector('[data-task-id="a"]')?.getAttribute("aria-selected")).toBe("true");
    });

    test("§18.27 a key with Ctrl or Alt is never type-ahead, and an unmatched prefix does nothing", async () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: MANY_ROWS, labels: LABELS } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [{ ...FIELD, parse: () => Number.NaN }], onFieldEdit: vi.fn(), labels: L } });
        await edit("x");
        expect(status()).toBe("Design: bad Points");
    });

    test("§18.31 Ctrl+Z reports the earlier value through onFieldEdit and announces it", async () => {
        const onFieldEdit = vi.fn();
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 8 });
        expect(status()).toBe("Undid Design Points: 3");
    });

    test("§18.32 Ctrl+Shift+Z and Ctrl+Y redo", async () => {
        const onFieldEdit = vi.fn();
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
        await edit("5");
        await edit("9");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 9 });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "t1", fieldId: "points", value: 3, previous: 5 });
    });

    test("§18.34 with nothing to undo, Ctrl+Z does nothing, and a new edit ends the redo chain", async () => {
        const onFieldEdit = vi.fn();
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], onFieldEdit, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS2, fields: [FIELD], readonly: true, onFieldEdit, labels: L } });
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
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: UN } });
        expect(headOf("2026-10-03").getAttribute("data-unavailable")).toBe("holiday");
        expect(headOf("2026-10-06").getAttribute("data-unavailable")).toBe("leave");
        expect(headOf("2026-10-07").getAttribute("data-unavailable")).toBe("leave");
        expect(headOf("2026-10-04").hasAttribute("data-unavailable")).toBe(false);
        expect(document.querySelectorAll("tbody td[data-unavailable]")).toHaveLength(3 * TASKS.length);
    });

    test("§18.37 the label is real text in the header, so a day is never colour-only", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: UN } });
        expect(headOf("2026-10-03").querySelector(".gantt-chart-unavailable-label")?.textContent).toBe("Founders' Day");
        expect(headOf("2026-10-04").querySelector(".gantt-chart-unavailable-label")).toBeNull();
    });

    test("§18.38 an entry without a kind is data-unavailable=unavailable", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-10-05" }] } });
        expect(headOf("2026-10-05").getAttribute("data-unavailable")).toBe("unavailable");
    });

    test("§18.39 a week column only partly covered is data-partly-unavailable, so a holiday inside a week is still marked", () => {
        render(GanttChart, { props: { label: "Q4", range: { start: "2026-10-01", end: "2026-10-31" }, tasks: TASKS, labels: LABELS, timeUnit: "week", unavailable: [{ start: "2026-10-03", kind: "holiday", label: "Founders' Day" }] } });
        const marked = heads().filter((h) => h.hasAttribute("data-partly-unavailable"));
        expect(marked).toHaveLength(1);
        expect(marked[0].getAttribute("data-partly-unavailable")).toBe("holiday");
        expect(marked[0].hasAttribute("data-unavailable")).toBe(false);
        expect(marked[0].querySelector(".gantt-chart-unavailable-label")?.textContent).toBe("Founders' Day");
    });

    test("§18.40 several kinds on one column are all listed", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-10-06", kind: "holiday" }, { start: "2026-10-06", kind: "leave" }] } });
        expect(headOf("2026-10-06").getAttribute("data-unavailable")).toBe("holiday leave");
    });

    test("§18.41 it combines with weekends and isNonWorking, and nothing is marked without it", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, weekends: [6], unavailable: [{ start: "2026-10-03", kind: "holiday" }] } });
        const h = headOf("2026-10-03");
        expect(h.hasAttribute("data-weekend") && h.hasAttribute("data-unavailable")).toBe(true);
        document.body.innerHTML = "";
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS } });
        expect(document.querySelector("[data-unavailable], [data-partly-unavailable]")).toBeNull();
    });

    test("§18.42 an entry with a bad date marks nothing", () => {
        render(GanttChart, { props: { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS, unavailable: [{ start: "2026-13-40" }] } });
        expect(document.querySelector("[data-unavailable], [data-partly-unavailable]")).toBeNull();
    });
});

describe("right-to-left keys and no English left over", () => {
    const active = () => document.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')!;
    const colOf = (el: HTMLElement) => Number(el.dataset.col);
    const base = { label: "Q4", range: RANGE, tasks: TASKS, labels: LABELS };

    test("§18.43 left to right: ArrowRight goes to the next day, ArrowLeft back", async () => {
        render(GanttChart, { props: base });
        await fireEvent.keyDown(active(), { key: "ArrowRight" });
        expect(colOf(active())).toBe(1);
        await fireEvent.keyDown(active(), { key: "ArrowLeft" });
        expect(colOf(active())).toBe(0);
    });

    test("§18.44 right to left: ArrowLeft goes to the next day (the later date is on the left), ArrowRight back", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            render(GanttChart, { props: base });
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
            render(GanttChart, { props: { ...base, onTaskChange } });
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
            render(GanttChart, { props: base });
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
        const { container } = render(GanttChart, { props: { label: "项目计划", range: RANGE, tasks: zhTasks, labels: ZH, weekends: [0, 6], unavailable: [{ start: "2026-10-01", kind: "holiday", label: "国庆节" }], timeUnit: "day" } });
        expect(english(readable(container))).toEqual([]);
    });

    test("§18.48 the search announcement is the bundle's", async () => {
        render(GanttChart, { props: { label: "项目计划", range: RANGE, tasks: zhTasks, labels: ZH } });
        await fireEvent.input(screen.getByRole("searchbox", { name: "搜索任务" }), { target: { value: "设计" } });
        await waitFor(() => expect(document.querySelector(".gantt-chart-status")?.textContent).toBe("3 个任务中有 1 个匹配"));
    });
});


