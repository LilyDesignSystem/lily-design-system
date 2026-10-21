import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyGanttChart, { createGanttChart } from "./index.js";
import type { GanttOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async () => { await tick(); await tick(); };

const LABELS = {
    grid: "Plan",
    caption: "Q4 plan",
    taskColumn: "Task",
    columnLabel: (d: string) => d.slice(8),
    collapseButton: (task: { label: string }, collapsed: boolean) => (collapsed ? "Expand " : "Collapse ") + task.label,
    dependencySummary: (preds: string[]) => "Blocked by: " + preds.join(", "),
    criticalLabel: "Critical",
    milestoneLabel: "Milestone",
};

const options = (extra: Partial<GanttOptions> = {}): GanttOptions => ({
    range: { start: "2026-10-01", end: "2026-10-10" },
    tasks: [
        { id: "phase", label: "Phase" },
        { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-03", parentId: "phase", percentComplete: 100 },
        { id: "build", label: "Build", start: "2026-10-04", end: "2026-10-08", parentId: "phase", dependsOn: ["design"], percentComplete: 40 },
        { id: "release", label: "Release", start: "2026-10-09", end: "2026-10-09", dependsOn: ["build"] },
    ],
    today: "2026-10-05",
    weekends: [0, 6],
    labels: LABELS,
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyGanttChart);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<GanttOptions> = {}) {
    (window as unknown as { ganttOptions: GanttOptions }).ganttOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await settle();
    return document.querySelector(".gantt-chart") as HTMLElement;
}

const state = () => Alpine.$data(document.querySelector(".gantt-chart") as HTMLElement) as ReturnType<typeof createGanttChart>;
const cell = (row: number, col: number) => document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
const rowCells = (row: number) => [...document.querySelectorAll(`td[data-row="${row}"]`)] as HTMLElement[];
const taskLabels = () => [...document.querySelectorAll(".gantt-chart-task-label")].map((e) => e.textContent);
/** Elements really carrying `attr` (a plain `[attr]` selector also matches Alpine's `:attr` binding attributes under jsdom). */
const having = (attr: string) => [...document.querySelectorAll("*")].filter((e) => e.hasAttribute(attr));
const press = async (target: Element, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
    await settle();
};

describe("rendering", () => {
    test("a hierarchy is a treegrid with a header per day and a row per visible task", async () => {
        await mount();
        const table = document.querySelector("table") as HTMLElement;
        expect(table.getAttribute("role")).toBe("treegrid");
        expect(table.getAttribute("aria-label")).toBe("Plan");
        expect(table.getAttribute("aria-colcount")).toBe("11");
        expect(table.getAttribute("aria-rowcount")).toBe("5");
        expect([...document.querySelectorAll("thead th")].map((h) => h.textContent)).toEqual(["Task", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]);
        expect(taskLabels()).toEqual(["Phase", "Design", "Build", "Release"]);
        expect([...document.querySelectorAll("tbody tr")].map((r) => r.getAttribute("aria-level"))).toEqual(["1", "2", "2", "1"]);
        expect(document.querySelector("caption")?.textContent).toBe("Q4 plan");
    });

    test("without any parent it is a plain grid with no levels", async () => {
        await mount({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02" }] });
        expect(document.querySelector("table")?.getAttribute("role")).toBe("grid");
        expect(document.querySelector("tbody tr")?.hasAttribute("aria-level")).toBe(false);
        expect(document.querySelector("tbody tr")?.hasAttribute("aria-expanded")).toBe(false);
    });

    test("a task whose parent does not exist is a root", async () => {
        await mount({ tasks: [{ id: "a", label: "A", start: "2026-10-01", end: "2026-10-02", parentId: "ghost" }] });
        expect(taskLabels()).toEqual(["A"]);
    });

    test("headless: labels absent removes the text and controls", async () => {
        await mount({ labels: { grid: "Plan" } });
        expect(document.querySelector("caption")).toBeNull();
        expect(document.querySelector(".gantt-chart-collapse")).toBeNull();
        expect(document.querySelector(".gantt-chart-dependencies")).toBeNull();
        expect(document.querySelector("thead th")?.textContent).toBe("");
    });
});

describe("bars", () => {
    test("a task's cells carry the bar attributes; start and end mark the ends", async () => {
        await mount();
        const inRange = (row: number) => rowCells(row).map((c) => c.hasAttribute("data-in-range"));
        expect(inRange(1)).toEqual([true, true, true, false, false, false, false, false, false, false]);
        expect(rowCells(1)[0].hasAttribute("data-bar-start")).toBe(true);
        expect(rowCells(1)[2].hasAttribute("data-bar-end")).toBe(true);
        expect(rowCells(1)[1].hasAttribute("data-bar-start")).toBe(false);
        expect(rowCells(1)[0].getAttribute("data-percent-complete")).toBe("100");
        expect(rowCells(2)[3].getAttribute("data-percent-complete")).toBe("40");
        expect(rowCells(1)[5].hasAttribute("data-percent-complete")).toBe(false);
    });

    test("a parent spans its children", async () => {
        await mount();
        const span = rowCells(0).map((c) => c.hasAttribute("data-in-range"));
        expect(span).toEqual([true, true, true, true, true, true, true, true, false, false]);
    });

    test("a one-day task is a milestone with its label", async () => {
        await mount();
        const marks = rowCells(3).map((c) => c.hasAttribute("data-milestone"));
        expect(marks.indexOf(true)).toBe(8);
        expect(marks.filter(Boolean)).toHaveLength(1);
        expect(rowCells(3)[8].textContent?.trim()).toBe("Milestone");
        expect(rowCells(1).some((c) => c.hasAttribute("data-milestone"))).toBe(false);
        expect(rowCells(0).some((c) => c.hasAttribute("data-milestone"))).toBe(false);
    });

    test("today and weekends are marked on headers and cells, only where asked", async () => {
        await mount();
        const heads = [...document.querySelectorAll("thead th")];
        expect(heads.filter((h) => h.hasAttribute("data-today")).map((h) => h.textContent)).toEqual(["05"]);
        expect(heads.filter((h) => h.hasAttribute("data-weekend")).map((h) => h.textContent)).toEqual(["03", "04", "10"]);
        expect(rowCells(2).filter((c) => c.hasAttribute("data-weekend"))).toHaveLength(3);
        await mount({ weekends: undefined, today: undefined });
        expect(having("data-today")).toHaveLength(0);
        expect(having("data-weekend")).toHaveLength(0);
    });
});

describe("hierarchy", () => {
    test("a parent row has aria-expanded and a collapse button named for its state", async () => {
        await mount();
        const rows = [...document.querySelectorAll("tbody tr")];
        expect(rows[0].getAttribute("aria-expanded")).toBe("true");
        expect(rows[1].hasAttribute("aria-expanded")).toBe(false);
        const button = document.querySelector(".gantt-chart-collapse") as HTMLElement;
        expect(button.getAttribute("aria-label")).toBe("Collapse Phase");
        expect(document.querySelectorAll(".gantt-chart-collapse")).toHaveLength(1);
    });

    test("collapsing removes the descendants' rows and expanding brings them back", async () => {
        await mount();
        (document.querySelector(".gantt-chart-collapse") as HTMLElement).click(); await settle();
        expect(taskLabels()).toEqual(["Phase", "Release"]);
        expect(document.querySelector("tbody tr")?.getAttribute("aria-expanded")).toBe("false");
        expect(document.querySelector(".gantt-chart-collapse")?.getAttribute("aria-label")).toBe("Expand Phase");
        // The parent still spans its (hidden) children.
        expect(rowCells(0).filter((c) => c.hasAttribute("data-in-range"))).toHaveLength(8);
        (document.querySelector(".gantt-chart-collapse") as HTMLElement).click(); await settle();
        expect(taskLabels()).toEqual(["Phase", "Design", "Build", "Release"]);
    });

    test("`collapsed` starts parents closed", async () => {
        await mount({ collapsed: ["phase"] });
        expect(taskLabels()).toEqual(["Phase", "Release"]);
    });
});

describe("dependencies and critical path", () => {
    test("a task with predecessors is described by a text summary", async () => {
        await mount();
        const th = cell(2, 0);
        const summary = document.getElementById(th.getAttribute("aria-describedby") as string);
        expect(summary?.textContent).toBe("Blocked by: Design");
        expect(cell(1, 0).hasAttribute("aria-describedby")).toBe(false);
    });

    test("criticalPath marks critical tasks with data-critical, slack and a visible label", async () => {
        await mount({ criticalPath: true });
        const rows = [...document.querySelectorAll("tbody tr")];
        expect(rows.map((r) => r.hasAttribute("data-critical"))).toEqual([false, true, true, true]);
        expect(rows[1].getAttribute("data-slack")).toBe("0");
        expect(document.querySelectorAll(".gantt-chart-critical")).toHaveLength(3);
        expect(document.querySelector(".gantt-chart-critical")?.textContent).toBe("Critical");
    });

    test("a task with slack is not critical", async () => {
        await mount({ criticalPath: true, tasks: [
            { id: "a", label: "A", start: "2026-10-01", end: "2026-10-03" },
            { id: "b", label: "B", start: "2026-10-01", end: "2026-10-09" },
        ] });
        const rows = [...document.querySelectorAll("tbody tr")];
        expect(rows.map((r) => r.hasAttribute("data-critical"))).toEqual([false, true]);
        expect(rows[0].getAttribute("data-slack")).toBe("6");
    });

    test("nothing is computed unless asked", async () => {
        await mount();
        expect(having("data-critical")).toHaveLength(0);
    });
});

describe("keyboard", () => {
    test("one tab stop; arrows move through cells; Home and End go along the row", async () => {
        await mount();
        expect([...document.querySelectorAll("[tabindex='0']")]).toEqual([cell(-1, 0)]);
        cell(-1, 0).focus();
        await press(cell(-1, 0), "ArrowDown");
        expect(document.activeElement).toBe(cell(0, 0));
        await press(cell(0, 0), "ArrowRight");
        expect(document.activeElement).toBe(cell(0, 1));
        await press(cell(0, 1), "End");
        expect(document.activeElement).toBe(cell(0, 10));
        await press(cell(0, 10), "Home");
        expect(document.activeElement).toBe(cell(0, 0));
        await press(cell(0, 0), "End", { ctrlKey: true });
        expect(document.activeElement).toBe(cell(3, 10));
        await press(cell(3, 10), "ArrowDown");
        expect(document.activeElement).toBe(cell(3, 10));
    });

    test("right-to-left swaps the horizontal arrows", async () => {
        document.documentElement.setAttribute("dir", "rtl");
        try {
            await mount();
            cell(1, 3).focus();
            await press(cell(1, 3), "ArrowLeft");
            expect(document.activeElement).toBe(cell(1, 4));
        } finally {
            document.documentElement.removeAttribute("dir");
        }
    });

    test("Enter or Space on a parent's task cell toggles it; elsewhere it announces the task and date", async () => {
        const chart = await mount();
        const seen = vi.fn();
        chart.addEventListener("lily:activate", (e) => seen((e as CustomEvent).detail));
        cell(0, 0).focus();
        await press(cell(0, 0), "Enter");
        expect(taskLabels()).toEqual(["Phase", "Release"]);
        await press(cell(0, 0), " ");
        expect(taskLabels()).toHaveLength(4);
        cell(2, 5).focus();
        await press(cell(2, 5), "Enter");
        expect(seen).toHaveBeenCalledWith({ taskId: "build", date: "2026-10-05" });
        cell(2, 0).focus();
        await press(cell(2, 0), "Enter");
        expect(seen).toHaveBeenLastCalledWith({ taskId: "build", date: null });
    });

    test("collapsing keeps the cursor on a row that exists", async () => {
        await mount();
        cell(3, 0).focus();
        state().toggleCollapse("phase");
        await settle();
        expect(state().active.row).toBe(1);
    });
});
