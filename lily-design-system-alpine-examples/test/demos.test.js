// @vitest-environment jsdom
// Mounts every component's demo under real Alpine, and each helper page's demo with its own options script.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lily from "../../lily-design-system-alpine-headless/lily-alpine.js";
import lilyDataGrid from "../../lily-design-system-alpine-data-grid/index.ts";
import lilyKanbanBoard from "../../lily-design-system-alpine-kanban-board/index.ts";
import lilyCalendarView from "../../lily-design-system-alpine-calendar/index.ts";
import lilyGanttChart from "../../lily-design-system-alpine-gantt-chart/index.ts";
import { catalog, demoOf, markupOf, snippet, top } from "../lib.mjs";
import { HELPERS } from "../src/helper-demos.mjs";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
let errors;

beforeAll(() => {
  window.Alpine = Alpine;
  for (const plugin of [lily, lilyDataGrid, lilyKanbanBoard, lilyCalendarView, lilyGanttChart]) Alpine.plugin(plugin);
  Alpine.start();
});

afterEach(async () => {
  document.body.innerHTML = "";
  await tick();
  vi.restoreAllMocks();
});

const watch = () => {
  errors = [];
  vi.spyOn(console, "error").mockImplementation((...a) => errors.push(a.map(String).join(" ")));
  vi.spyOn(console, "warn").mockImplementation((...a) => errors.push(a.map(String).join(" ")));
};

describe("component demos", () => {
  test("every one of the 571 mounts under Alpine without an error, keeps its base class, and has no empty aria-label", async () => {
    watch();
    const problems = [];
    for (const c of catalog()) {
      document.body.innerHTML = `<div id="demo">${demoOf(c.name, snippet(c.slug), c.slug)}</div>`;
      await tick();
      const demo = document.getElementById("demo");
      if (!demo.querySelector(`.${CSS.escape(c.slug)}`)) problems.push(`${c.slug}: base class missing`);
      if ([...demo.querySelectorAll("[aria-label]")].some((e) => e.getAttribute("aria-label") === "")) problems.push(`${c.slug}: empty aria-label`);
    }
    expect(problems).toEqual([]);
    expect(errors).toEqual([]);
  }, 120000);
});

describe("helper demos", () => {
  const mountHelper = async (slug) => {
    const html = readFileSync(join(top, HELPERS[slug].package, "snippet.html"), "utf8");
    new Function(HELPERS[slug].script)();
    document.body.innerHTML = `<div id="demo">${markupOf(html)}</div>`;
    await tick();
    await tick();
  };

  test("the data grid page: a paginated, selectable grid of people", async () => {
    watch();
    await mountHelper("data-grid");
    expect(document.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(document.querySelector("th[scope=col]").textContent.trim()).toBe("Name");
    expect(document.querySelector(".data-grid-pager-status").textContent).toBe("Page 1 of 2");
    expect(errors).toEqual([]);
  });

  test("the kanban page: three columns, five cards, the Doing column at its limit", async () => {
    watch();
    await mountHelper("kanban-board");
    expect([...document.querySelectorAll("th .kanban-board-column-title")].map((e) => e.textContent)).toEqual(["To do", "Doing", "Done"]);
    expect(document.querySelectorAll(".kanban-card")).toHaveLength(5);
    expect(errors).toEqual([]);
  });

  test("the calendar page: a grid of whole weeks with today marked and the events in place", async () => {
    watch();
    await mountHelper("calendar");
    expect(document.querySelectorAll("td[data-date]").length % 7).toBe(0);
    expect([...document.querySelectorAll("td[data-date]")].filter((td) => td.getAttribute("aria-current") === "date")).toHaveLength(1);
    expect(document.querySelectorAll(".calendar-event").length).toBeGreaterThanOrEqual(2);
    expect(errors).toEqual([]);
  });

  test("the Gantt page: a phase with two children, a milestone and the critical path", async () => {
    watch();
    await mountHelper("gantt-chart");
    expect([...document.querySelectorAll(".gantt-chart-task-label")].map((e) => e.textContent)).toEqual(["Phase one", "Design", "Build", "Write docs", "Launch"]);
    expect([...document.querySelectorAll("tbody tr")].some((r) => r.hasAttribute("data-critical"))).toBe(true);
    expect([...document.querySelectorAll("td")].some((td) => td.hasAttribute("data-milestone"))).toBe(true);
    expect(errors).toEqual([]);
  });
});
