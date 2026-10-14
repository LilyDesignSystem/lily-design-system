// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, eventsByDay, initCalendarView, isOutsidePeriod, periodDays, periodRange, weekStart } from "./calendar-view.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, ".."); // every sibling subproject sits here
const env = nunjucks.configure([__dirname, repoRoot], {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MACRO_LABELS = { weekView: "Week", fourWeekView: "4 weeks", monthView: "Month", today: "Today" };

const CLIENT_LABELS = {
  previous: (view: string) => `Previous ${view}`,
  next: (view: string) => `Next ${view}`,
  periodAnnouncement: (view: string, start: string, end: string) => `${view}: ${start} to ${end}`,
  weekday: (wd: number) => WEEKDAYS[wd],
  weekdayAbbr: (wd: number) => WEEKDAYS[wd].slice(0, 3),
  day: (iso: string, wd: number, outside: boolean) => `${Number(iso.slice(8))}, ${WEEKDAYS[wd]}${outside ? " (outside)" : ""}`,
};

const EVENTS = [
  { id: "e1", date: "2026-01-06", title: "Single-day" },
  { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Multi-day" },
];

function render(opts: Record<string, unknown> = {}): string {
  return env.renderString(`{% from "./calendar-view.njk" import calendarView %}{{ calendarView(opts) }}`, {
    opts: { label: "Appointments", view: "week", anchorDate: "2026-01-06", ...opts },
  });
}

function setup(macroOpts: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  document.body.innerHTML = render(macroOpts);
  const root = document.body.querySelector<HTMLElement>("[data-lily-calendar-view-root]")!;
  const controller = initCalendarView(root, { labels: CLIENT_LABELS, ...initOpts });
  return { root, controller };
}

const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));
const bodyRows = () => q(".calendar-table-body .calendar-table-row");
const dayCells = () => q(".calendar-table-td");
const tabbable = () => q('.calendar-table-td[tabindex="0"]');
const cellFor = (iso: string) => document.querySelector<HTMLElement>(`.calendar-table-td[data-date="${iso}"]`);
const button = (name: string) =>
  q("button").find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name)!;
const press = (el: Element, key: string, init: KeyboardEventInit = {}) =>
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
const click = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

beforeEach(() => (document.body.innerHTML = ""));
afterEach(() => (document.body.innerHTML = ""));

describe("calendar-view — pure period helpers", () => {
  test("weekStart finds the Monday on/before a Tuesday anchor", () => {
    expect(weekStart("2026-01-06", 1)).toBe("2026-01-05");
  });
  test("periodDays shapes: week 7, four-week 28, month 42", () => {
    expect(periodDays("week", "2026-01-06", 1).flat()).toHaveLength(7);
    const four = periodDays("four-week", "2026-01-06", 1);
    expect(four).toHaveLength(4);
    expect(four[3][6]).toBe("2026-02-01");
    const month = periodDays("month", "2026-01-15", 1);
    expect(month.flat()).toHaveLength(42);
    expect(month[0][0]).toBe("2025-12-29");
    expect(month[5][6]).toBe("2026-02-08");
  });
  test("isOutsidePeriod is true only for month-view padding days", () => {
    expect(isOutsidePeriod("month", "2025-12-29", "2026-01-15")).toBe(true);
    expect(isOutsidePeriod("month", "2026-01-15", "2026-01-15")).toBe(false);
    expect(isOutsidePeriod("week", "2025-12-29", "2026-01-06")).toBe(false);
  });
  test("periodRange returns the month's own first/last day for month view", () => {
    expect(periodRange("month", "2026-01-15", 1)).toEqual(["2026-01-01", "2026-01-31"]);
    expect(periodRange("week", "2026-01-06", 1)).toEqual(["2026-01-05", "2026-01-11"]);
    expect(periodRange("four-week", "2026-01-06", 1)).toEqual(["2026-01-05", "2026-02-01"]);
  });
  test("eventsByDay places a multi-day event on every date in its inclusive range", () => {
    const map = eventsByDay(EVENTS);
    expect(map.get("2026-01-06")?.map((e) => e.id)).toEqual(["e1"]);
    expect(map.get("2026-01-10")?.map((e) => e.id)).toEqual(["e2"]);
    expect(map.get("2026-01-12")).toBeUndefined();
  });
});

describe("calendar-view — macro markup (SSR)", () => {
  test("renders a root with state in data attributes, an empty grid and a status region", () => {
    const html = render({ today: "2026-01-08", labels: MACRO_LABELS });
    document.body.innerHTML = html;
    const root = document.querySelector("[data-lily-calendar-view-root]")!;
    expect(root.classList.contains("calendar-view")).toBe(true);
    expect(root.getAttribute("data-lily-calendar-view-view")).toBe("week");
    expect(root.getAttribute("data-lily-calendar-view-anchor-date")).toBe("2026-01-06");
    const grid = document.querySelector("table.calendar-table")!;
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Appointments");
    expect(document.querySelectorAll(".calendar-table-td")).toHaveLength(0);
    expect(document.querySelector("[data-lily-calendar-view-status]")!.getAttribute("aria-live")).toBe("polite");
  });
  test("the switcher renders only labelled buttons, and the active one is aria-pressed", () => {
    document.body.innerHTML = render({ labels: { weekView: "Week", monthView: "Month" } });
    expect(button("Week").getAttribute("aria-pressed")).toBe("true");
    expect(button("Month").getAttribute("aria-pressed")).toBe("false");
    expect(q("button").find((b) => b.textContent === "4 weeks")).toBeUndefined();
  });
  test("no today attribute renders a disabled Today button", () => {
    document.body.innerHTML = render({ labels: MACRO_LABELS });
    expect((button("Today") as HTMLButtonElement).disabled).toBe(true);
  });
  test("extra classes and attributes land on the root", () => {
    document.body.innerHTML = render({ classes: "my-cal", attributes: { "data-testid": "cal" } });
    expect(document.querySelector('.calendar-view.my-cal[data-testid="cal"]')).toBeTruthy();
  });
});

describe("calendar-view — hydrated grid", () => {
  test("§8.2 week: 7 cells, none outside-period", () => {
    setup();
    expect(bodyRows()).toHaveLength(1);
    expect(dayCells()).toHaveLength(7);
    expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
  });
  test("§8.3 four-week: 28 cells in 4 rows", () => {
    setup({ view: "four-week" });
    expect(bodyRows()).toHaveLength(4);
    expect(dayCells()).toHaveLength(28);
  });
  test("§8.4 month: 42 cells; padding days carry data-outside-period", () => {
    setup({ view: "month", anchorDate: "2026-01-15" });
    expect(bodyRows()).toHaveLength(6);
    expect(dayCells()).toHaveLength(42);
    expect(cellFor("2025-12-29")!.hasAttribute("data-outside-period")).toBe(true);
    expect(cellFor("2026-01-15")!.hasAttribute("data-outside-period")).toBe(false);
  });
  test("§8.5 the day matching `today` carries aria-current=date, and no other does", () => {
    setup({ today: "2026-01-08" });
    expect(cellFor("2026-01-08")!.getAttribute("aria-current")).toBe("date");
    expect(dayCells().filter((c) => c.getAttribute("aria-current") === "date")).toHaveLength(1);
  });
  test("§8.14 a Sunday-first locale shifts the computed week start", () => {
    setup({ locale: "en-US" });
    expect(cellFor("2026-01-04")).toBeTruthy();
  });
  test("weekday headers and cell names come from the client labels", () => {
    setup();
    expect(q(".calendar-table-th abbr")[0].textContent).toBe("Mon");
    expect(cellFor("2026-01-06")!.getAttribute("aria-label")).toBe("6, Tuesday");
  });
  test("default rendering shows each cell's day-of-month number", () => {
    setup();
    expect(cellFor("2026-01-06")!.textContent!.trim()).toBe("6");
  });
});

describe("calendar-view — navigation", () => {
  test("§8.6 Next/Previous step by the view's length and call onNavigate", () => {
    const onNavigate = vi.fn();
    setup({ labels: MACRO_LABELS }, { onNavigate });
    click(button("Next week"));
    expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
    click(button("Previous week"));
    click(button("Previous week"));
    expect(onNavigate).toHaveBeenLastCalledWith("week", "2025-12-29", "2026-01-04");
  });
  test("§8.6 four-week steps 28 days, month steps one month", () => {
    const a = vi.fn();
    setup({ view: "four-week", labels: MACRO_LABELS }, { onNavigate: a });
    click(button("Next four-week"));
    expect(a).toHaveBeenCalledWith("four-week", "2026-02-02", "2026-03-01");
    const b = vi.fn();
    setup({ view: "month", anchorDate: "2026-01-15", labels: MACRO_LABELS }, { onNavigate: b });
    click(button("Next month"));
    expect(b).toHaveBeenCalledWith("month", "2026-02-01", "2026-02-28");
  });
  test("§8.7 Today sets the anchor to `today` without changing view", () => {
    const onNavigate = vi.fn();
    setup({ anchorDate: "2026-02-20", today: "2026-01-08", labels: MACRO_LABELS }, { onNavigate });
    click(button("Today"));
    expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
    expect(cellFor("2026-01-08")).toBeTruthy();
  });
  test("§8.13 every navigation announces the new period", () => {
    setup({ labels: MACRO_LABELS });
    click(button("Next week"));
    expect(document.querySelector("[data-lily-calendar-view-status]")!.textContent).toBe("week: 2026-01-12 to 2026-01-18");
  });
  test("switching view updates aria-pressed, rebuilds the grid and fires onNavigate", () => {
    const onNavigate = vi.fn();
    setup({ labels: MACRO_LABELS }, { onNavigate });
    click(button("Month"));
    expect(button("Month").getAttribute("aria-pressed")).toBe("true");
    expect(button("Week").getAttribute("aria-pressed")).toBe("false");
    expect(dayCells()).toHaveLength(42);
    expect(onNavigate).toHaveBeenCalledWith("month", "2026-01-01", "2026-01-31");
  });
});

describe("calendar-view — keyboard", () => {
  test("§8.9 one tab stop; arrows move by day/week; Home/End clamp to the row", () => {
    setup({ view: "four-week" });
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0].dataset.date).toBe("2026-01-06");
    press(tabbable()[0], "ArrowRight");
    expect(tabbable()[0].dataset.date).toBe("2026-01-07");
    press(tabbable()[0], "ArrowDown");
    expect(tabbable()[0].dataset.date).toBe("2026-01-14");
    press(tabbable()[0], "Home");
    expect(tabbable()[0].dataset.date).toBe("2026-01-12");
    press(tabbable()[0], "End");
    expect(tabbable()[0].dataset.date).toBe("2026-01-18");
    expect(document.activeElement).toBe(cellFor("2026-01-18"));
  });
  test("§8.10 PageDown steps the cursor by the view's length and re-pages", () => {
    const onNavigate = vi.fn();
    setup({}, { onNavigate });
    press(tabbable()[0], "PageDown");
    expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
    expect(tabbable()[0].dataset.date).toBe("2026-01-13");
  });
  test("§8.10 in month view, moving onto a padding cell re-pages to that month", () => {
    const onNavigate = vi.fn();
    setup({ view: "month", anchorDate: "2026-01-01" }, { onNavigate });
    for (let i = 0; i < 3; i++) press(tabbable()[0], "ArrowLeft");
    expect(onNavigate).toHaveBeenCalledWith("month", "2025-12-01", "2025-12-31");
    expect(cellFor("2025-12-29")!.hasAttribute("data-outside-period")).toBe(false);
  });
  test("§8.11 Enter calls onDayClick with the focused cell's date", () => {
    const onDayClick = vi.fn();
    setup({}, { onDayClick });
    press(tabbable()[0], "ArrowRight");
    press(tabbable()[0], "Enter");
    expect(onDayClick).toHaveBeenCalledWith("2026-01-07");
  });
  test("clicking a day cell moves the cursor there and calls onDayClick", () => {
    const onDayClick = vi.fn();
    setup({}, { onDayClick });
    click(cellFor("2026-01-10")!);
    expect(onDayClick).toHaveBeenCalledWith("2026-01-10");
    expect(tabbable()[0].dataset.date).toBe("2026-01-10");
  });
});

describe("calendar-view — events", () => {
  test("§8.12 events render as buttons inside every day they cover", () => {
    setup({}, { events: EVENTS });
    const titles = (iso: string) =>
      Array.from(cellFor(iso)!.querySelectorAll(".calendar-view-event")).map((b) => b.textContent);
    expect(titles("2026-01-06")).toEqual(["Single-day"]);
    expect(titles("2026-01-09")).toEqual(["Multi-day"]);
    expect(titles("2026-01-11")).toEqual(["Multi-day"]);
    expect(titles("2026-01-07")).toEqual([]);
  });
  test("setEvents re-renders with new events", () => {
    const { controller } = setup();
    controller.setEvents(EVENTS);
    expect(cellFor("2026-01-06")!.querySelector(".calendar-view-event")).toBeTruthy();
  });
  test("renderDay can be supplied, and receives selected, disabled and openEvent", () => {
    const onEventClick = vi.fn();
    setup(
      { selectedDate: "2026-01-06", minDate: "2026-01-06" },
      {
        events: EVENTS,
        onEventClick,
        renderDay: (args: { selected: boolean; disabled: boolean; events: object[]; openEvent: (e: object) => void }) => {
          const b = document.createElement("button");
          b.setAttribute("data-custom", `${args.selected}-${args.disabled}`);
          b.addEventListener("click", () => args.events[0] && args.openEvent(args.events[0]));
          return b;
        },
      },
    );
    expect(cellFor("2026-01-06")!.querySelector("[data-custom]")!.getAttribute("data-custom")).toBe("true-false");
    expect(cellFor("2026-01-05")!.querySelector("[data-custom]")!.getAttribute("data-custom")).toBe("false-true");
    click(cellFor("2026-01-06")!.querySelector("[data-custom]")!);
    expect(onEventClick).toHaveBeenCalled();
  });
});

describe("calendar-view — interaction", () => {
  const base = { today: "2026-01-08" };

  test("§8.17 picking a day marks it data-selected, distinct from the keyboard cursor", () => {
    setup(base);
    click(cellFor("2026-01-07")!);
    press(tabbable()[0], "ArrowRight");
    expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
    expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(false);
    expect(tabbable()[0].dataset.date).toBe("2026-01-08");
  });
  test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; focusable but not pickable", () => {
    const onDayClick = vi.fn();
    setup({ ...base, minDate: "2026-01-06", maxDate: "2026-01-10" }, { isDisabled: (d: string) => d === "2026-01-07", onDayClick });
    expect(cellFor("2026-01-05")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor("2026-01-07")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor("2026-01-11")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor("2026-01-06")!.hasAttribute("aria-disabled")).toBe(false);
    click(cellFor("2026-01-07")!);
    expect(onDayClick).not.toHaveBeenCalled();
    expect(tabbable()[0].dataset.date).toBe("2026-01-07");
    click(cellFor("2026-01-09")!);
    expect(onDayClick).toHaveBeenCalledWith("2026-01-09");
  });
  test("§8.19 pressing t moves the cursor to today and navigates", () => {
    const onNavigate = vi.fn();
    setup({ ...base, anchorDate: "2026-03-02" }, { onNavigate });
    press(tabbable()[0], "t");
    expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
    expect(tabbable()[0].dataset.date).toBe("2026-01-08");
  });
  test("§8.20 t does nothing when today is not supplied", () => {
    const onNavigate = vi.fn();
    setup({}, { onNavigate });
    press(tabbable()[0], "t");
    expect(onNavigate).not.toHaveBeenCalled();
  });
  test("§8.21 an event button calls onEventClick without picking the day", () => {
    const onEventClick = vi.fn();
    const onDayClick = vi.fn();
    setup({}, { events: EVENTS, onEventClick, onDayClick });
    click(cellFor("2026-01-06")!.querySelector(".calendar-view-event")!);
    expect(onEventClick).toHaveBeenCalledWith(EVENTS[0]);
    expect(onDayClick).not.toHaveBeenCalled();
  });
  test("autoInit wires every rendered root", () => {
    document.body.innerHTML = render() + render({ name: "second" });
    const controllers = autoInit({ labels: CLIENT_LABELS });
    expect(controllers).toHaveLength(2);
    expect(dayCells()).toHaveLength(14);
  });
});

describe("calendar-view — week numbers, marked ranges and range selection", () => {
  const base = { view: "month", anchorDate: "2026-01-15", today: "2026-01-08" };
  const rangeLabels = {
    ...CLIENT_LABELS,
    weekNumber: (n: number) => `Week ${n}`,
    rangeAnnouncement: (s: string, e: string) => `Selected ${s} to ${e}`,
  };
  const shiftKey = (el: Element, k: string) => press(el, k, { shiftKey: true });
  const shiftClick = (el: Element) =>
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, shiftKey: true }));

  test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", () => {
    setup({ ...base, showWeekNumbers: true, labels: { weekNumberHeader: "Wk" } }, { labels: rangeLabels });
    expect(document.querySelector("[data-week-number-header]")!.textContent).toBe("Wk");
    const rowHeaders = q("[data-week-number]");
    expect(rowHeaders).toHaveLength(6);
    const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
    expect(week2.textContent).toBe("2");
    expect(week2.getAttribute("aria-label")).toBe("Week 2");
    expect(week2.getAttribute("scope")).toBe("row");
  });

  test("§8.22 week numbers are off by default", () => {
    setup(base);
    expect(document.querySelector("[data-week-number]")).toBeNull();
    expect(document.querySelector("[data-week-number-header]")).toBeNull();
  });

  test("§8.23 ranges mark each day inside with data-range={kind}", () => {
    setup(base, { ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] });
    expect(cellFor("2026-01-05")!.getAttribute("data-range")).toBe("holiday");
    expect(cellFor("2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
    expect(cellFor("2026-01-08")!.getAttribute("data-range")).toBe("range");
    expect(cellFor("2026-01-09")!.hasAttribute("data-range")).toBe(false);
  });

  test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", () => {
    setup(base, { labels: rangeLabels });
    shiftKey(tabbable()[0], "ArrowRight");
    shiftKey(tabbable()[0], "ArrowRight");
    expect(cellFor("2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
    expect(cellFor("2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
    expect(cellFor("2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
    expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
    expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Selected 2026-01-15 to 2026-01-17");
  });

  test("§8.24 extending backwards orders the range", () => {
    setup(base);
    shiftKey(tabbable()[0], "ArrowLeft");
    expect(cellFor("2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
    expect(cellFor("2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
  });

  test("§8.25 Enter on an extended range calls onRangeSelect once and not onDayClick", () => {
    const onRangeSelect = vi.fn();
    const onDayClick = vi.fn();
    setup(base, { onRangeSelect, onDayClick });
    shiftKey(tabbable()[0], "ArrowRight");
    press(tabbable()[0], "Enter");
    expect(onRangeSelect).toHaveBeenCalledTimes(1);
    expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-16");
    expect(onDayClick).not.toHaveBeenCalled();
  });

  test("§8.26 a plain arrow after extending stops extending but keeps the range", () => {
    setup(base);
    shiftKey(tabbable()[0], "ArrowRight");
    press(tabbable()[0], "ArrowRight");
    expect(cellFor("2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
    expect(cellFor("2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
  });

  test("§8.27 Escape clears the range", () => {
    setup(base);
    shiftKey(tabbable()[0], "ArrowRight");
    press(tabbable()[0], "Escape");
    expect(document.querySelector("[data-in-range]")).toBeNull();
  });

  test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", () => {
    const onRangeSelect = vi.fn();
    setup(base, { onRangeSelect });
    shiftClick(cellFor("2026-01-20")!);
    expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-20");
    expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
  });

  test("§8.29 a plain click after a range clears extension and picks that day", () => {
    const onDayClick = vi.fn();
    setup(base, { onDayClick });
    shiftKey(tabbable()[0], "ArrowRight");
    click(cellFor("2026-01-22")!);
    expect(onDayClick).toHaveBeenCalledWith("2026-01-22");
  });

  test("§8.30 setRanges and setSelectedRange update the grid; renderDay receives inRange and ranges", () => {
    const { controller } = setup(base, {
      renderDay: (a: { inRange: boolean; ranges: Array<{ kind?: string }> }) => {
        const i = document.createElement("i");
        i.setAttribute("data-ctx", `${a.inRange}-${a.ranges.map((r) => r.kind).join(",")}`);
        return i;
      },
    });
    controller.setRanges([{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }]);
    controller.setSelectedRange({ start: "2026-01-06", end: "2026-01-07" });
    expect(cellFor("2026-01-06")!.querySelector("[data-ctx]")!.getAttribute("data-ctx")).toBe("true-holiday");
    expect(cellFor("2026-01-07")!.hasAttribute("data-in-range")).toBe(true);
  });
});
