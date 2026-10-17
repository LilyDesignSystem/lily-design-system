// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { initGanttChart } from "./gantt-chart.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root0 = path.join(__dirname, "..");
const env = nunjucks.configure([__dirname, root0], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const RANGE = { start: "2026-10-01", end: "2026-10-10" };
const TASKS = [
  { id: "a", label: "Design login", start: "2026-10-01", end: "2026-10-03", values: { cost: 5 } },
  { id: "b", label: "Café menu", start: "2026-10-04", end: "2026-10-06" },
  { id: "c", label: "Write docs", start: "2026-10-07", end: "2026-10-08" },
];
const LABELS = {
  search: "Search tasks",
  searchAnnouncement: "{matched} of {total} tasks",
  copy: "Copy",
  copyAnnouncement: "{count} rows copied",
  copyFailed: "Copy failed",
  exportHeaders: { task: "Task", start: "Start", end: "End" },
  editRefused: "{task} {field}: {message}",
  fieldUndoAnnouncement: "Undid {field}: {value}",
  fieldRedoAnnouncement: "Redid {field}: {value}",
};

function setup(opts: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  document.body.innerHTML = env.renderString(`{% from "./gantt-chart.njk" import ganttChart %}{{ ganttChart(opts) }}`, {
    opts: { label: "Plan", range: RANGE, tasks: TASKS, labels: LABELS, ...opts },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-gantt-chart-root]")!;
  return { root, controller: initGanttChart(root, initOpts) };
}
const taskIds = (root: HTMLElement) => Array.from(root.querySelectorAll("tr[data-lily-gantt-chart-task-id]")).map((r) => r.getAttribute("data-lily-gantt-chart-task-id"));
const search = (root: HTMLElement) => root.querySelector<HTMLInputElement>("[data-lily-gantt-chart-search]")!;
const type = (root: HTMLElement, v: string) => {
  search(root).value = v;
  search(root).dispatchEvent(new Event("input", { bubbles: true }));
};
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const status = (root: HTMLElement) => root.querySelector("[data-lily-gantt-chart-status]")?.textContent;
const active = (root: HTMLElement) => root.querySelector<HTMLElement>('.gantt-table-td[tabindex="0"]')!;
const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("dir");
  vi.unstubAllGlobals();
});

describe("search", () => {
  test("every word must appear, any order; diacritics and case ignored", () => {
    const { root } = setup();
    type(root, "LOGIN design");
    expect(taskIds(root)).toEqual(["a"]);
    type(root, "cafe");
    expect(taskIds(root)).toEqual(["b"]);
  });
  test("field text is searched too", () => {
    const { root } = setup({ fields: [{ id: "cost", header: "Cost", type: "number" }] });
    type(root, "5");
    expect(taskIds(root)).toContain("a");
  });
  test("the match is marked in the label, only while searching; count announced; Escape clears", () => {
    const { root } = setup();
    type(root, "docs");
    expect(root.querySelector("mark.gantt-chart-match")!.textContent).toBe("docs");
    expect(status(root)).toBe("1 of 3 tasks");
    key(search(root), "Escape");
    expect(search(root).value).toBe("");
    expect(root.querySelector("mark")).toBeNull();
    expect(taskIds(root)).toHaveLength(3);
  });
});

describe("copy", () => {
  test("puts the export on the clipboard header first, announces; onCopy can take over", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { root } = setup();
    root.querySelector<HTMLElement>('[data-gantt-export-format="copy"]')!.click();
    await flush();
    const text = (writeText.mock.calls[0] as unknown as [string])[0];
    expect(text.split("\r\n")[0]).toBe("Task\tStart\tEnd");
    expect(status(root)).toBe("3 rows copied");
    const onCopy = vi.fn(() => false);
    writeText.mockClear();
    const second = setup({}, { onCopy });
    second.root.querySelector<HTMLElement>('[data-gantt-export-format="copy"]')!.click();
    await flush();
    expect(onCopy).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe("keyboard", () => {
  test("PageDown clamps to the last row", () => {
    const { root } = setup();
    key(active(root), "PageDown");
    expect(active(root).getAttribute("data-row")).toBe("2");
  });
  test("typing a letter moves to the next row whose label starts with it", () => {
    const { root } = setup();
    key(active(root), "w");
    expect(active(root).getAttribute("data-row")).toBe("2");
  });
  test("right-to-left: ArrowLeft goes to the next column", () => {
    document.documentElement.setAttribute("dir", "rtl");
    const { root } = setup();
    key(active(root), "ArrowLeft");
    expect(active(root).getAttribute("data-col")).toBe("1");
  });
});

describe("field edit validation, undo, redo", () => {
  const fields = [{ id: "cost", header: "Cost", type: "number" }];
  const tasks = [{ id: "a", label: "Task", start: "2026-10-01", end: "2026-10-03", values: { cost: 5 } }];
  function edit(root: HTMLElement, value: string) {
    root.querySelector<HTMLElement>("[data-lily-gantt-chart-field-button]")!.click();
    const field = root.querySelector<HTMLInputElement>(".gantt-chart-field-editor")!;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    key(field, "Enter");
  }
  test("a refused value keeps the editor open, aria-invalid, announces the reason", () => {
    const hooks = { cost: { validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) } };
    const { root } = setup({ tasks, fields, editableFields: true }, { fieldHooks: hooks });
    edit(root, "-1");
    expect(root.querySelector(".gantt-chart-field-editor")!.getAttribute("aria-invalid")).toBe("true");
    expect(status(root)).toBe("Task Cost: must not be negative");
  });
  test("Ctrl+Z reports the earlier value; Ctrl+Shift+Z redoes", () => {
    const onFieldEdit = vi.fn();
    const { root } = setup({ tasks, fields, editableFields: true }, { onFieldEdit });
    edit(root, "9");
    key(active(root), "z", { ctrlKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "a", fieldId: "cost", value: 5, previous: 9 });
    expect(status(root)).toBe("Undid Cost: 5");
    key(active(root), "z", { ctrlKey: true, shiftKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ taskId: "a", fieldId: "cost", value: 9, previous: 5 });
  });
});
