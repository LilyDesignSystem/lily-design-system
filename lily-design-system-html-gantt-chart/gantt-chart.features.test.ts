import { afterEach, describe, expect, test, vi } from "vitest";

import "@lilydesignsystem/html-date-time-picker";
import { GanttChart } from "./gantt-chart.js";
import type { GanttLabels, GanttTask } from "./gantt-chart.js";

if (!customElements.get("gantt-chart")) customElements.define("gantt-chart", GanttChart);

const RANGE = { start: "2026-10-01", end: "2026-10-10" };
const TASKS: GanttTask[] = [
    { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03", values: { owner: "Zoë" } },
    { id: "build", label: "Build", start: "2026-10-04", end: "2026-10-06" },
    { id: "parent", label: "Phase 1", start: "2026-10-01", end: "2026-10-01" },
    { id: "child1", label: "Child A", start: "2026-10-08", end: "2026-10-08", parentId: "parent" },
    { id: "child2", label: "Child B", start: "2026-10-09", end: "2026-10-09", parentId: "parent" },
];
const LABELS: GanttLabels = {
    columnLabel: (start) => start,
    search: "Search tasks",
    searchAnnouncement: (m, t) => `${m} of ${t} tasks`,
    copy: "Copy",
    copyAnnouncement: (n) => `${n} rows copied`,
    copyFailed: "Copy failed",
    exportHeaders: { task: "Task", start: "Start", end: "End" },
    undoAnnouncement: (_t, f, text) => `Undid ${f}: ${text}`,
    redoAnnouncement: (_t, f, text) => `Redid ${f}: ${text}`,
    editRefused: (_t, f, m) => `${f}: ${m}`,
};

let chart: GanttChart;
function mount(props: Record<string, unknown> = {}): GanttChart {
    chart = document.createElement("gantt-chart") as GanttChart;
    chart.setAttribute("label", "Plan");
    document.body.appendChild(chart);
    chart.range = RANGE;
    chart.tasks = (props.tasks as GanttTask[]) ?? TASKS;
    chart.labels = (props.labels as GanttLabels) ?? LABELS;
    for (const [k, v] of Object.entries(props)) if (!["tasks", "labels"].includes(k)) (chart as never as Record<string, unknown>)[k] = v;
    return chart;
}
const rowLabels = () => Array.from(chart.querySelectorAll(".gantt-table-tbody > tr[data-task-id] > th")).map((th) => th.textContent?.trim());
const input = () => chart.querySelector<HTMLInputElement>(".gantt-chart-search")!;
const type = (value: string) => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
};
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const active = () => chart.querySelector<HTMLElement>("td[data-row][data-col][tabindex='0']")!;
const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("dir");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("search, filter and compare", () => {
    test("§18.1 the field renders only when labels.search names it, with the headless search-input class", () => {
        mount({ labels: { ...LABELS, search: undefined } });
        expect(chart.querySelector(".gantt-chart-search")).toBeNull();
        document.body.innerHTML = "";
        mount();
        expect(input().classList.contains("search-input")).toBe(true);
    });
    test("§18.2 every word must appear, in any order, ignoring diacritics; field text is searched", () => {
        mount({ fields: [{ id: "owner", header: "Owner" }] });
        type("zoe design");
        expect(rowLabels()).toEqual(["Design"]);
    });
    test("§18.3 a matching child keeps its ancestors, and a collapsed parent still shows the match", () => {
        mount({ collapsedTaskIds: ["parent"] });
        type("child b");
        expect(rowLabels()).toEqual(["Phase 1", "Child B"]);
    });
    test("§18.4 matches are wrapped in <mark class=gantt-chart-match>, only while searching", () => {
        mount();
        expect(chart.querySelector(".gantt-chart-match")).toBeNull();
        type("build");
        expect(chart.querySelector("mark.gantt-chart-match")!.textContent?.toLowerCase()).toBe("build");
    });
    test("§18.7 the result count is announced and Escape clears the search", () => {
        mount();
        type("build");
        expect(chart.textContent).toContain("1 of 5 tasks");
        key(input(), "Escape");
        expect(chart.search).toBe("");
        expect(rowLabels()).toHaveLength(5);
    });
    test("§18.12 filter hides the tasks it rejects (keeping ancestors) and combines with search", () => {
        mount({ filter: (t: GanttTask) => t.id !== "build" });
        expect(rowLabels()).not.toContain("Build");
        type("design");
        expect(rowLabels()).toEqual(["Design"]);
    });
    test("§18.16 compare orders tasks among their siblings", () => {
        mount({ compare: (a: GanttTask, b: GanttTask) => b.label.localeCompare(a.label) });
        expect(rowLabels()[0]).toBe("Phase 1");
    });
});

describe("copy to clipboard", () => {
    test("§18.20 copy puts the export on the clipboard (header first, tab-separated) and announces; onCopy can take over", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        mount();
        chart.querySelector<HTMLElement>('[data-gantt-export-format="copy"]')!.click();
        await flush();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Task\tStart\tEnd");
        expect(chart.textContent).toContain("5 rows copied");
        document.body.innerHTML = "";
        const onCopy = vi.fn(() => false);
        writeText.mockClear();
        mount({ onCopy });
        chart.querySelector<HTMLElement>('[data-gantt-export-format="copy"]')!.click();
        await flush();
        expect(onCopy).toHaveBeenCalled();
        expect(writeText).not.toHaveBeenCalled();
    });
});

describe("keyboard: page keys, type-ahead, right-to-left", () => {
    const many: GanttTask[] = Array.from({ length: 25 }, (_, i) => ({ id: `t${i}`, label: i === 3 ? "Beta" : i === 5 ? "Bravo" : `Task ${i}`, start: "2026-10-01", end: "2026-10-02" }));
    test("§18.30 PageDown moves ten rows and clamps", () => {
        mount({ tasks: many });
        key(active(), "PageDown");
        expect(active().getAttribute("data-row")).toBe("10");
        key(active(), "PageDown");
        key(active(), "PageDown");
        expect(active().getAttribute("data-row")).toBe("24");
    });
    test("§18.31 typing a letter moves to the next task whose label starts with it; a lone s is still select", () => {
        mount({ tasks: many });
        key(active(), "b");
        expect(active().getAttribute("data-row")).toBe("3");
        key(active(), "r");
        expect(active().getAttribute("data-row")).toBe("5");
    });
    test("§18.45 right-to-left: ArrowLeft goes to the later date", () => {
        document.documentElement.setAttribute("dir", "rtl");
        mount();
        key(active(), "ArrowLeft");
        expect(active().getAttribute("data-col")).toBe("1");
        key(active(), "ArrowRight");
        expect(active().getAttribute("data-col")).toBe("0");
    });
});

describe("in-place edit: validate, undo, redo", () => {
    const fields = [{ id: "cost", header: "Cost", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) }];
    const tasks: GanttTask[] = [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", values: { cost: 5 } }];
    function edit(value: string): void {
        chart.querySelector<HTMLElement>(".gantt-chart-field-button")!.click();
        const field = chart.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        key(field, "Enter");
    }
    test("§18.35 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", () => {
        mount({ tasks, fields, onFieldEdit: vi.fn() });
        edit("-1");
        expect(chart.querySelector(".gantt-chart-field-editor")!.getAttribute("aria-invalid")).toBe("true");
        expect(chart.textContent).toContain("must not be negative");
    });
    test("§18.37 Ctrl+Z reports the earlier value through onFieldEdit; Ctrl+Shift+Z redoes", () => {
        const onFieldEdit = vi.fn();
        mount({ tasks, fields, onFieldEdit });
        edit("9");
        key(active(), "z", { ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "a", fieldId: "cost", value: 5, previous: 9 });
        expect(chart.textContent).toContain("Undid Cost: 5");
        key(active(), "z", { ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "a", fieldId: "cost", value: 9, previous: 5 });
    });
});

describe("unavailable days: holidays and time off", () => {
    const heads = () => Array.from(chart.querySelectorAll<HTMLElement>("thead th")).slice(1);
    test("§18.40 a covered day column carries data-unavailable (kinds) on the header and every cell, with its label as text", () => {
        mount({ unavailable: [{ start: "2026-10-05", kind: "holiday", label: "Day off" }] });
        const th = heads().find((h) => h.getAttribute("data-unavailable"))!;
        expect(th.getAttribute("data-unavailable")).toBe("holiday");
        expect(th.querySelector(".gantt-chart-unavailable-label")!.textContent).toBe("Day off");
        const column = heads().indexOf(th);
        for (const row of chart.querySelectorAll(".gantt-table-tbody > tr[data-task-id]")) {
            expect(row.querySelectorAll("td[data-col]")[column]!.getAttribute("data-unavailable")).toBe("holiday");
        }
    });
    test("§18.41 a week column only partly covered gets data-partly-unavailable instead", () => {
        mount({ unavailable: [{ start: "2026-10-05" }], timeUnit: undefined });
        chart.setAttribute("time-unit", "week");
        const partly = heads().filter((h) => h.hasAttribute("data-partly-unavailable"));
        expect(partly.length).toBeGreaterThan(0);
        expect(heads().some((h) => h.hasAttribute("data-unavailable"))).toBe(false);
    });
});
