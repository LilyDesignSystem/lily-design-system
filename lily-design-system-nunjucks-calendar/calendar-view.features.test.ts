// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { initCalendarView } from "./calendar-view.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure([__dirname, path.join(__dirname, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const EVENTS = [
  { id: "e1", date: "2026-01-06", title: "Design review", values: { cost: 5 } },
  { id: "e2", date: "2026-01-06", title: "Café standup" },
  { id: "e3", date: "2026-01-07", title: "Write docs" },
];
const FIELDS = [{ id: "cost", header: "Cost", type: "number" }];

function setup(macro: Record<string, unknown> = {}, init: Record<string, unknown> = {}, macroLabels: Record<string, unknown> = {}) {
  document.body.innerHTML = env.renderString(`{% from "./calendar-view.njk" import calendarView %}{{ calendarView(opts) }}`, {
    opts: { label: "Cal", view: "week", anchorDate: "2026-01-06", labels: { search: "Search", copy: "Copy", exportHeaders: { title: "Title", start: "Start", end: "End" }, ...macroLabels }, ...macro },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-calendar-view-root]")!;
  const controller = initCalendarView(root, { events: EVENTS, ...init });
  return { root, controller };
}
const titles = () => Array.from(document.querySelectorAll(".calendar-view-event")).map((b) => b.textContent);
const search = () => document.querySelector<HTMLInputElement>("[data-lily-calendar-view-search]")!;
const type = (v: string) => {
  search().value = v;
  search().dispatchEvent(new Event("input", { bubbles: true }));
};
const press = (el: Element, key: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
const status = () => document.querySelector("[data-lily-calendar-view-status]")?.textContent;
const flush = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("dir");
  vi.unstubAllGlobals();
});

describe("search", () => {
  test("shows only events containing every word, ignoring case and diacritics; marks the match", () => {
    setup();
    expect(titles()).toHaveLength(3);
    type("CAFE stand");
    expect(titles()).toEqual(["Café standup"]);
    expect(document.querySelector("mark.calendar-view-match")!.textContent?.toLowerCase()).toBe("café");
  });
  test("announces the count; Escape clears", () => {
    setup({}, { labels: { searchAnnouncement: (m: number, t: number) => `${m} of ${t}` } });
    type("docs");
    expect(status()).toBe("1 of 3");
    press(search(), "Escape");
    expect(search().value).toBe("");
    expect(titles()).toHaveLength(3);
    expect(document.querySelector("mark")).toBeNull();
  });
  test("field text is searched", () => {
    setup({}, { eventFields: FIELDS });
    type("5");
    expect(titles()).toContain("Design review");
  });
});

describe("eventCompare", () => {
  test("orders a day's events", () => {
    setup({}, { eventCompare: (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title) });
    const cell = document.querySelector('.calendar-table-td[data-date="2026-01-06"]')!;
    expect(Array.from(cell.querySelectorAll(".calendar-view-event")).map((b) => b.textContent)).toEqual(["Café standup", "Design review"]);
  });
});

describe("copy", () => {
  test("copies the period's events, header first; onCopy can take over", async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    setup({}, { labels: { copyAnnouncement: (n: number) => `${n} copied` } });
    document.querySelector<HTMLElement>('[data-calendar-export-format="copy"]')!.click();
    await flush();
    const text = (writeText.mock.calls[0] as unknown as [string])[0];
    expect(text.split("\r\n")[0]).toBe("Title\tStart\tEnd");
    expect(status()).toBe("3 copied");
    writeText.mockClear();
    const onCopy = vi.fn(() => false);
    setup({}, { onCopy });
    document.querySelector<HTMLElement>('[data-calendar-export-format="copy"]')!.click();
    await flush();
    expect(onCopy).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe("right-to-left", () => {
  test("ArrowLeft goes to the next day", () => {
    document.documentElement.setAttribute("dir", "rtl");
    setup();
    const cell = document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!;
    const start = cell.getAttribute("data-date")!;
    press(cell, "ArrowLeft");
    const next = document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!.getAttribute("data-date")!;
    expect(next > start).toBe(true);
  });
});

describe("edit validation, undo, redo (agenda)", () => {
  const events = [{ id: "e1", date: "2026-01-06", title: "Review", values: { cost: 5 } }];
  const base = { view: "agenda", anchorDate: "2026-01-15" };
  function edit(value: string) {
    document.querySelector<HTMLElement>(".calendar-view-field-button")!.click();
    const field = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    press(field, "Enter");
  }
  test("a refused value keeps the editor open, aria-invalid, announces the reason", () => {
    setup(base, {
      events,
      eventFields: [{ ...FIELDS[0], validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) }],
      onFieldEdit: () => {},
      labels: { editRefused: (t: string, f: string, m: string) => `${t} ${f}: ${m}` },
    });
    edit("-1");
    expect(document.querySelector(".calendar-view-field-editor")!.getAttribute("aria-invalid")).toBe("true");
    expect(status()).toBe("Review Cost: must not be negative");
  });
  test("Ctrl+Z reports the earlier value; Ctrl+Shift+Z redoes", () => {
    const onFieldEdit = vi.fn();
    setup(base, { events, eventFields: FIELDS, onFieldEdit, labels: { fieldUndoAnnouncement: (_t: string, f: string, v: string) => `Undid ${f}: ${v}` } });
    edit("9");
    const grid = document.querySelector(".calendar-table")!;
    press(grid, "z", { ctrlKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 5, previous: 9 });
    expect(status()).toBe("Undid Cost: 5");
    press(grid, "z", { ctrlKey: true, shiftKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 9, previous: 5 });
  });
});

describe("undo from the agenda list", () => {
  test("Ctrl+Z with focus on an agenda event undoes the last field edit", () => {
    const onFieldEdit = vi.fn();
    setup({ view: "agenda", anchorDate: "2026-01-15" }, { events: [{ id: "e1", date: "2026-01-06", title: "Review", values: { cost: 5 } }], eventFields: FIELDS, onFieldEdit });
    document.querySelector<HTMLElement>(".calendar-view-field-button")!.click();
    const field = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
    field.value = "9";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    press(field, "Enter");
    press(document.querySelector(".calendar-view-event")!, "z", { ctrlKey: true });
    expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 5, previous: 9 });
  });
});
