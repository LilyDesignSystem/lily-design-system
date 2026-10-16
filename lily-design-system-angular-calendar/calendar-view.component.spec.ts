import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  CalendarView,
  eventsByDay,
  isOutsidePeriod,
  periodDays,
  periodRange,
  weekStart,
  type CalendarEvent,
  type CalendarNavigateEvent,
  type CalendarViewLabels,
  type CalendarRangeSelectEvent,
  type CalendarEventMoveEvent,
} from "./calendar-view.component";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const LABELS: CalendarViewLabels = {
  weekView: "Week",
  fourWeekView: "4 weeks",
  monthView: "Month",
  previous: (view) => `Previous ${view}`,
  next: (view) => `Next ${view}`,
  today: "Today",
  periodAnnouncement: (view, start, end) => `${view}: ${start} to ${end}`,
  weekday: (wd) => WEEKDAYS[wd],
  weekdayAbbr: (wd) => WEEKDAYS[wd].slice(0, 3),
  day: (iso, wd, outside) => `${Number(iso.slice(8))}, ${WEEKDAYS[wd]}${outside ? " (outside)" : ""}`,
};

const EVENTS: CalendarEvent[] = [
  { id: "e1", date: "2026-01-06", title: "Single-day" },
  { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Multi-day" },
];

let fixtures: ComponentFixture<unknown>[] = [];
afterEach(() => {
  for (const f of fixtures) f.destroy();
  fixtures = [];
});

function mount(inputs: Record<string, unknown> = {}): ComponentFixture<CalendarView> {
  const fixture = TestBed.createComponent(CalendarView);
  fixture.componentRef.setInput("label", "Appointments");
  fixture.componentRef.setInput("view", "week");
  fixture.componentRef.setInput("anchorDate", "2026-01-06");
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

const q = (f: ComponentFixture<unknown>, sel: string): Element[] =>
  Array.from(f.nativeElement.querySelectorAll(sel));
const bodyRows = (f: ComponentFixture<unknown>) => q(f, ".calendar-table-body .calendar-table-row");
const dayCells = (f: ComponentFixture<unknown>) => q(f, ".calendar-table-td");
const tabbable = (f: ComponentFixture<unknown>) => q(f, '.calendar-table-td[tabindex="0"]');
const cellFor = (f: ComponentFixture<unknown>, iso: string) =>
  f.nativeElement.querySelector(`.calendar-table-td[data-date="${iso}"]`) as HTMLElement | null;
const button = (f: ComponentFixture<unknown>, name: string) =>
  q(f, "button").find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name) as HTMLElement;

function press(f: ComponentFixture<unknown>, target: Element, key: string, extra: KeyboardEventInit = {}): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...extra }));
  f.detectChanges();
}
function click(f: ComponentFixture<unknown>, target: Element): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  f.detectChanges();
}
function collectNavigate(f: ComponentFixture<CalendarView>): CalendarNavigateEvent[] {
  const calls: CalendarNavigateEvent[] = [];
  f.componentInstance.navigate.subscribe((e) => calls.push(e));
  return calls;
}
function collectDayClicks(f: ComponentFixture<CalendarView>): string[] {
  const calls: string[] = [];
  f.componentInstance.dayClick.subscribe((e) => calls.push(e));
  return calls;
}

describe("CalendarView — pure period helpers", () => {
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

describe("CalendarView — markup", () => {
  test("§8.1 renders a calendar-view root wrapping a role=grid table labelled by `label`", () => {
    const f = mount();
    expect(f.nativeElement.querySelector(".calendar-view")).toBeTruthy();
    const grid = f.nativeElement.querySelector("table.calendar-table");
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Appointments");
  });
  test("§8.2 week: 7 cells, none outside-period", () => {
    const f = mount();
    expect(bodyRows(f)).toHaveLength(1);
    expect(dayCells(f)).toHaveLength(7);
    expect(dayCells(f).some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
  });
  test("§8.3 four-week: 28 cells in 4 rows", () => {
    const f = mount({ view: "four-week" });
    expect(bodyRows(f)).toHaveLength(4);
    expect(dayCells(f)).toHaveLength(28);
  });
  test("§8.4 month: 42 cells; padding days carry data-outside-period", () => {
    const f = mount({ view: "month", anchorDate: "2026-01-15" });
    expect(bodyRows(f)).toHaveLength(6);
    expect(dayCells(f)).toHaveLength(42);
    expect(cellFor(f, "2025-12-29")!.hasAttribute("data-outside-period")).toBe(true);
    expect(cellFor(f, "2026-01-15")!.hasAttribute("data-outside-period")).toBe(false);
  });
  test("§8.5 the day matching `today` carries aria-current=date, and no other does", () => {
    const f = mount({ today: "2026-01-08" });
    expect(cellFor(f, "2026-01-08")!.getAttribute("aria-current")).toBe("date");
    expect(dayCells(f).filter((c) => c.getAttribute("aria-current") === "date")).toHaveLength(1);
  });
  test("§8.15 omitting `today` renders no aria-current=date and disables Today", () => {
    const f = mount({ labels: LABELS });
    expect(dayCells(f).some((c) => c.hasAttribute("aria-current"))).toBe(false);
    expect((button(f, "Today") as HTMLButtonElement).disabled).toBe(true);
  });
  test("default rendering shows each cell's day-of-month number", () => {
    const f = mount();
    expect(cellFor(f, "2026-01-06")!.textContent!.trim()).toBe("6");
    expect(cellFor(f, "2026-01-11")!.textContent!.trim()).toBe("11");
  });
});

describe("CalendarView — view switcher and navigation", () => {
  test("§8.8 the switcher renders only labelled buttons and marks the active one aria-pressed", () => {
    const f = mount({ labels: { weekView: "Week", monthView: "Month" } });
    expect(button(f, "Week").getAttribute("aria-pressed")).toBe("true");
    expect(button(f, "Month").getAttribute("aria-pressed")).toBe("false");
    expect(button(f, "4 weeks")).toBeUndefined();
  });
  test("§8.6 Next/Previous step by the view's length and emit navigate", () => {
    const f = mount({ labels: LABELS });
    const calls = collectNavigate(f);
    click(f, button(f, "Next week"));
    expect(calls[0]).toEqual({ view: "week", start: "2026-01-12", end: "2026-01-18" });
    click(f, button(f, "Previous week"));
    click(f, button(f, "Previous week"));
    expect(calls[calls.length - 1]).toEqual({ view: "week", start: "2025-12-29", end: "2026-01-04" });
  });
  test("§8.6 four-week steps 28 days, month steps one month", () => {
    const f1 = mount({ view: "four-week", labels: LABELS });
    const c1 = collectNavigate(f1);
    click(f1, button(f1, "Next four-week"));
    expect(c1[0]).toEqual({ view: "four-week", start: "2026-02-02", end: "2026-03-01" });
    const f2 = mount({ view: "month", anchorDate: "2026-01-15", labels: LABELS });
    const c2 = collectNavigate(f2);
    click(f2, button(f2, "Next month"));
    expect(c2[0]).toEqual({ view: "month", start: "2026-02-01", end: "2026-02-28" });
  });
  test("§8.7 Today sets anchorDate to `today` without changing view", () => {
    const f = mount({ anchorDate: "2026-02-20", today: "2026-01-08", labels: LABELS });
    const calls = collectNavigate(f);
    click(f, button(f, "Today"));
    expect(calls[0]).toEqual({ view: "week", start: "2026-01-05", end: "2026-01-11" });
    expect(cellFor(f, "2026-01-08")).toBeTruthy();
  });
  test("§8.13 every navigation announces the new period", () => {
    const f = mount({ labels: LABELS });
    click(f, button(f, "Next week"));
    expect(f.nativeElement.querySelector(".calendar-view-status").textContent).toBe("week: 2026-01-12 to 2026-01-18");
  });
  test("§8.14 a Sunday-first locale shifts the computed week start", () => {
    const f = mount({ locale: "en-US" });
    expect(cellFor(f, "2026-01-04")).toBeTruthy();
    expect(dayCells(f)).toHaveLength(7);
  });
});

describe("CalendarView — keyboard", () => {
  test("§8.9 one tab stop; arrows move by day/week; Home/End clamp to the row", () => {
    const f = mount({ view: "four-week" });
    expect(tabbable(f)).toHaveLength(1);
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-06");
    press(f, tabbable(f)[0], "ArrowRight");
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-07");
    press(f, tabbable(f)[0], "ArrowDown");
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-14");
    press(f, tabbable(f)[0], "Home");
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-12");
    press(f, tabbable(f)[0], "End");
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-18");
  });
  test("§8.10 PageDown steps the cursor by the view's length and re-pages", () => {
    const f = mount({ labels: LABELS });
    const calls = collectNavigate(f);
    press(f, tabbable(f)[0], "PageDown");
    expect(calls[0]).toEqual({ view: "week", start: "2026-01-12", end: "2026-01-18" });
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-13");
  });
  test("§8.10 in month view, moving onto a padding cell re-pages to that month", () => {
    const f = mount({ view: "month", anchorDate: "2026-01-01", labels: LABELS });
    const calls = collectNavigate(f);
    for (let i = 0; i < 3; i++) press(f, tabbable(f)[0], "ArrowLeft");
    expect(calls[0]).toEqual({ view: "month", start: "2025-12-01", end: "2025-12-31" });
    expect(cellFor(f, "2025-12-29")!.hasAttribute("data-outside-period")).toBe(false);
  });
  test("§8.11 Enter emits dayClick with the focused cell's date", () => {
    const f = mount();
    const clicks = collectDayClicks(f);
    press(f, tabbable(f)[0], "ArrowRight");
    press(f, tabbable(f)[0], "Enter");
    expect(clicks).toEqual(["2026-01-07"]);
  });
  test("clicking a day cell moves the cursor there and emits dayClick", () => {
    const f = mount();
    const clicks = collectDayClicks(f);
    click(f, cellFor(f, "2026-01-10")!);
    expect(clicks).toEqual(["2026-01-10"]);
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-10");
  });
});

describe("CalendarView — events", () => {
  test("§8.12 events render as buttons inside every day they cover", () => {
    const f = mount({ events: EVENTS });
    const titles = (iso: string) => Array.from(cellFor(f, iso)!.querySelectorAll(".calendar-view-event")).map((b) => b.textContent!.trim());
    expect(titles("2026-01-06")).toEqual(["Single-day"]);
    expect(titles("2026-01-09")).toEqual(["Multi-day"]);
    expect(titles("2026-01-11")).toEqual(["Multi-day"]);
    expect(titles("2026-01-07")).toEqual([]);
  });
});

describe("CalendarView — interaction", () => {
  const base = { today: "2026-01-08" };

  test("§8.17 picking a day marks it data-selected, distinct from the keyboard cursor", () => {
    const f = mount(base);
    click(f, cellFor(f, "2026-01-07")!);
    press(f, tabbable(f)[0], "ArrowRight");
    expect(cellFor(f, "2026-01-07")!.hasAttribute("data-selected")).toBe(true);
    expect(cellFor(f, "2026-01-08")!.hasAttribute("data-selected")).toBe(false);
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-08");
  });
  test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; focusable but not pickable", () => {
    const f = mount({ ...base, minDate: "2026-01-06", maxDate: "2026-01-10", isDisabled: (d: string) => d === "2026-01-07" });
    const clicks = collectDayClicks(f);
    expect(cellFor(f, "2026-01-05")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor(f, "2026-01-07")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor(f, "2026-01-11")!.getAttribute("aria-disabled")).toBe("true");
    expect(cellFor(f, "2026-01-06")!.hasAttribute("aria-disabled")).toBe(false);
    click(f, cellFor(f, "2026-01-07")!);
    expect(clicks).toEqual([]);
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-07");
    click(f, cellFor(f, "2026-01-09")!);
    expect(clicks).toEqual(["2026-01-09"]);
  });
  test("§8.19 pressing t moves the cursor to today and navigates", () => {
    const f = mount({ ...base, anchorDate: "2026-03-02" });
    const calls = collectNavigate(f);
    press(f, tabbable(f)[0], "t");
    expect(calls[0]).toEqual({ view: "week", start: "2026-01-05", end: "2026-01-11" });
    expect(tabbable(f)[0].getAttribute("data-date")).toBe("2026-01-08");
  });
  test("§8.20 t does nothing when today is not supplied", () => {
    const f = mount();
    const calls = collectNavigate(f);
    press(f, tabbable(f)[0], "t");
    expect(calls).toEqual([]);
  });
  test("§8.21 an event button emits eventClick without picking the day", () => {
    const f = mount({ events: EVENTS });
    const events: CalendarEvent[] = [];
    f.componentInstance.eventClick.subscribe((e) => events.push(e));
    const clicks = collectDayClicks(f);
    click(f, cellFor(f, "2026-01-06")!.querySelector(".calendar-view-event")!);
    expect(events.map((e) => e.id)).toEqual(["e1"]);
    expect(clicks).toEqual([]);
  });
});

describe("CalendarView — week numbers, marked ranges and range selection", () => {
  const base = { view: "month", anchorDate: "2026-01-15", today: "2026-01-08" };
  const rangeLabels: CalendarViewLabels = {
    ...LABELS,
    weekNumberHeader: "Wk",
    weekNumber: (n) => `Week ${n}`,
    rangeAnnouncement: (s, e) => `Selected ${s} to ${e}`,
  };
  const shift = (f: ComponentFixture<unknown>, el: Element, key: string) => press(f, el, key, { shiftKey: true });
  const shiftClick = (f: ComponentFixture<unknown>, el: Element) => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));
    f.detectChanges();
  };
  function collectRanges(f: ComponentFixture<CalendarView>): CalendarRangeSelectEvent[] {
    const calls: CalendarRangeSelectEvent[] = [];
    f.componentInstance.rangeSelect.subscribe((e) => calls.push(e));
    return calls;
  }

  test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", () => {
    const f = mount({ ...base, showWeekNumbers: true, labels: rangeLabels });
    expect(f.nativeElement.querySelector("[data-week-number-header]").textContent.trim()).toBe("Wk");
    const rowHeaders = Array.from(f.nativeElement.querySelectorAll("[data-week-number]")) as HTMLElement[];
    expect(rowHeaders).toHaveLength(6);
    const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
    expect(week2.textContent!.trim()).toBe("2");
    expect(week2.getAttribute("aria-label")).toBe("Week 2");
    expect(week2.getAttribute("scope")).toBe("row");
  });

  test("§8.22 week numbers are off by default", () => {
    const f = mount(base);
    expect(f.nativeElement.querySelector("[data-week-number]")).toBeNull();
    expect(f.nativeElement.querySelector("[data-week-number-header]")).toBeNull();
  });

  test("§8.23 ranges mark each day inside with data-range={kind}", () => {
    const f = mount({ ...base, ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] });
    expect(cellFor(f, "2026-01-05")!.getAttribute("data-range")).toBe("holiday");
    expect(cellFor(f, "2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
    expect(cellFor(f, "2026-01-08")!.getAttribute("data-range")).toBe("range");
    expect(cellFor(f, "2026-01-09")!.hasAttribute("data-range")).toBe(false);
  });

  test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", () => {
    const f = mount({ ...base, labels: rangeLabels });
    shift(f, tabbable(f)[0], "ArrowRight");
    shift(f, tabbable(f)[0], "ArrowRight");
    expect(cellFor(f, "2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
    expect(cellFor(f, "2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
    expect(cellFor(f, "2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
    expect(cellFor(f, "2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
    expect(f.nativeElement.querySelector(".calendar-view-status").textContent).toBe("Selected 2026-01-15 to 2026-01-17");
  });

  test("§8.24 extending backwards orders the range", () => {
    const f = mount(base);
    shift(f, tabbable(f)[0], "ArrowLeft");
    expect(cellFor(f, "2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
    expect(cellFor(f, "2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
  });

  test("§8.25 Enter on an extended range emits rangeSelect once, and not dayClick", () => {
    const f = mount(base);
    const ranges = collectRanges(f);
    const clicks = collectDayClicks(f);
    shift(f, tabbable(f)[0], "ArrowRight");
    press(f, tabbable(f)[0], "Enter");
    expect(ranges).toEqual([{ start: "2026-01-15", end: "2026-01-16" }]);
    expect(clicks).toEqual([]);
  });

  test("§8.26 a plain arrow after extending stops extending but keeps the range", () => {
    const f = mount(base);
    shift(f, tabbable(f)[0], "ArrowRight");
    press(f, tabbable(f)[0], "ArrowRight");
    expect(cellFor(f, "2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
    expect(cellFor(f, "2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
  });

  test("§8.27 Escape clears the range", () => {
    const f = mount(base);
    shift(f, tabbable(f)[0], "ArrowRight");
    press(f, tabbable(f)[0], "Escape");
    expect(f.nativeElement.querySelector("[data-in-range]")).toBeNull();
  });

  test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", () => {
    const f = mount(base);
    const ranges = collectRanges(f);
    shiftClick(f, cellFor(f, "2026-01-20")!);
    expect(ranges).toEqual([{ start: "2026-01-15", end: "2026-01-20" }]);
    expect(cellFor(f, "2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
  });

  test("§8.29 a plain click after a range clears extension and picks that day", () => {
    const f = mount(base);
    const clicks = collectDayClicks(f);
    shift(f, tabbable(f)[0], "ArrowRight");
    click(f, cellFor(f, "2026-01-22")!);
    expect(clicks).toEqual(["2026-01-22"]);
  });
});

describe("CalendarView — day view, maxEvents, event drag-and-drop, title, weekends, multiple selection", () => {
  const dayProps = { view: "day", anchorDate: "2026-01-06", today: "2026-01-08", labels: { ...LABELS, dayView: "Day" } };
  const evs: CalendarEvent[] = [
    { id: "a", date: "2026-01-06", title: "A" },
    { id: "b", date: "2026-01-06", title: "B" },
    { id: "c", date: "2026-01-06", title: "C" },
  ];
  const dragEvent = (type: string, d: unknown) => {
    const e = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(e, "dataTransfer", { value: d });
    return e;
  };

  test("§8.33 the day view shows exactly one day under one weekday header", () => {
    const f = mount(dayProps);
    expect(dayCells(f)).toHaveLength(1);
    expect(dayCells(f)[0].getAttribute("data-date")).toBe("2026-01-06");
    expect(q(f, ".calendar-table-head .calendar-table-th")).toHaveLength(1);
  });

  test("§8.34 labels.dayView adds a pressed switcher button", () => {
    const f = mount({ ...dayProps, view: "week" });
    expect(button(f, "Day").getAttribute("aria-pressed")).toBe("false");
    click(f, button(f, "Day"));
    expect(button(f, "Day").getAttribute("aria-pressed")).toBe("true");
    expect(dayCells(f)).toHaveLength(1);
  });

  test("§8.35 next steps one day and reports the one-day period", () => {
    const f = mount(dayProps);
    const nav = collectNavigate(f);
    click(f, button(f, "Next day"));
    expect(dayCells(f)[0].getAttribute("data-date")).toBe("2026-01-07");
    expect(nav[nav.length - 1]).toEqual({ view: "day", start: "2026-01-07", end: "2026-01-07" });
  });

  test("§8.36 arrows and Page keys move by a day", () => {
    const f = mount(dayProps);
    press(f, tabbable(f)[0], "ArrowRight");
    expect(dayCells(f)[0].getAttribute("data-date")).toBe("2026-01-07");
    press(f, tabbable(f)[0], "ArrowDown");
    expect(dayCells(f)[0].getAttribute("data-date")).toBe("2026-01-08");
    press(f, tabbable(f)[0], "PageUp");
    expect(dayCells(f)[0].getAttribute("data-date")).toBe("2026-01-07");
  });

  test("§8.31 maxEvents caps the events shown and a +N more button (labels.moreEvents) fires moreClick", () => {
    const f = mount({ events: evs, maxEvents: 2, labels: { ...LABELS, moreEvents: (n: number) => `+${n} more` } });
    const more: string[] = [];
    f.componentInstance.moreClick.subscribe((d) => more.push(d));
    expect(q(f, ".calendar-view-event")).toHaveLength(2);
    const btn = q(f, ".calendar-view-more-button");
    expect(btn).toHaveLength(1);
    expect(btn[0].textContent!.trim()).toBe("+1 more");
    click(f, btn[0]);
    expect(more).toEqual(["2026-01-06"]);
  });

  test("§8.32 without maxEvents every event shows and no more button", () => {
    const f = mount({ events: evs, labels: { ...LABELS, moreEvents: (n: number) => `+${n} more` } });
    expect(q(f, ".calendar-view-event")).toHaveLength(3);
    expect(q(f, ".calendar-view-more-button")).toHaveLength(0);
  });

  test("§8.38 event buttons are draggable only with moveEvents; a drop on a day emits eventMove", () => {
    const f = mount({ events: evs });
    expect(q(f, ".calendar-view-event")[0].hasAttribute("draggable")).toBe(false);
    const g = mount({ events: evs, moveEvents: true });
    const moves: CalendarEventMoveEvent[] = [];
    g.componentInstance.eventMove.subscribe((m) => moves.push(m));
    const el = q(g, ".calendar-view-event")[0];
    expect(el.getAttribute("draggable")).toBe("true");
    const dt = { setData: () => {}, getData: () => "" };
    el.dispatchEvent(dragEvent("dragstart", dt));
    cellFor(g, "2026-01-09")!.dispatchEvent(dragEvent("dragover", dt));
    cellFor(g, "2026-01-09")!.dispatchEvent(dragEvent("drop", dt));
    expect(moves).toEqual([{ event: evs[0], toDate: "2026-01-09" }]);
  });

  test("§8.40 Alt+Arrow on a focused event moves it a day / a week; a disabled day refuses", () => {
    const f = mount({ events: evs, moveEvents: true });
    const moves: CalendarEventMoveEvent[] = [];
    f.componentInstance.eventMove.subscribe((m) => moves.push(m));
    const el = q(f, ".calendar-view-event")[0];
    press(f, el, "ArrowRight", { altKey: true });
    press(f, el, "ArrowDown", { altKey: true });
    expect(moves.map((m) => m.toDate)).toEqual(["2026-01-07", "2026-01-13"]);
    const g = mount({ events: evs, moveEvents: true, minDate: "2026-01-07" });
    const refused: CalendarEventMoveEvent[] = [];
    g.componentInstance.eventMove.subscribe((m) => refused.push(m));
    press(g, q(g, ".calendar-view-event")[0], "ArrowLeft", { altKey: true });
    expect(refused).toEqual([]);
  });

  test("§8.42 labels.periodTitle renders the shown period's title and updates on navigation", () => {
    const f = mount({ view: "month", anchorDate: "2026-01-15", labels: { ...LABELS, periodTitle: (v: string, s: string, e: string) => `${v}:${s}..${e}` } });
    expect(q(f, ".calendar-view-title")[0].textContent).toBe("month:2026-01-01..2026-01-31");
    click(f, button(f, "Next month"));
    expect(q(f, ".calendar-view-title")[0].textContent).toBe("month:2026-02-01..2026-02-28");
  });

  test("§8.44 hideOutsideDays leaves outside cells empty but in the grid", () => {
    const f = mount({ view: "month", anchorDate: "2026-01-15", hideOutsideDays: true });
    expect((q(f, ".calendar-table-td[data-outside-period]")[0] as HTMLElement).textContent!.trim()).toBe("");
    expect(cellFor(f, "2026-01-15")!.textContent!.trim()).toBe("15");
    expect(dayCells(f)).toHaveLength(42);
  });

  test("§8.46 weekendDays marks those weekdays with data-weekend", () => {
    const f = mount({ weekendDays: [0, 6] });
    expect(cellFor(f, "2026-01-10")!.hasAttribute("data-weekend")).toBe(true);
    expect(cellFor(f, "2026-01-11")!.hasAttribute("data-weekend")).toBe(true);
    expect(cellFor(f, "2026-01-07")!.hasAttribute("data-weekend")).toBe(false);
  });

  test("§8.48 multiple selection toggles days and Enter toggles the cursor day", () => {
    const f = mount({ selectionMode: "multiple" });
    const clicks: string[] = [];
    f.componentInstance.dayClick.subscribe((d) => clicks.push(d));
    click(f, cellFor(f, "2026-01-06")!);
    click(f, cellFor(f, "2026-01-08")!);
    expect(cellFor(f, "2026-01-06")!.hasAttribute("data-selected")).toBe(true);
    expect(cellFor(f, "2026-01-08")!.hasAttribute("data-selected")).toBe(true);
    click(f, cellFor(f, "2026-01-06")!);
    expect(cellFor(f, "2026-01-06")!.hasAttribute("data-selected")).toBe(false);
    press(f, tabbable(f)[0], "Enter");
    expect(clicks[clicks.length - 1]).toBe("2026-01-06");
  });
});

describe("CalendarView — agenda view", () => {
  const agenda = (inputs: Record<string, unknown> = {}) =>
    mount({ view: "agenda", anchorDate: "2026-01-15", events: EVENTS, today: "2026-01-09", ...inputs });

  test("lists only the days with events, as an ordered list of <time> headings", () => {
    const f = agenda({ labels: LABELS });
    const items = q(f, ".calendar-view-agenda-day");
    expect(items.map((li) => li.getAttribute("data-date"))).toEqual(["2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11"]);
    expect(f.nativeElement.querySelector("ol.calendar-view-agenda").getAttribute("aria-label")).toBe("Appointments");
    expect(items[0].querySelector("time")!.getAttribute("datetime")).toBe("2026-01-06");
    expect(f.nativeElement.querySelector(".calendar-view-table, lily-calendar-table")).toBeNull();
  });

  test("agendaEmptyDays lists every day of the month", () => {
    expect(q(agenda({ agendaEmptyDays: true }), ".calendar-view-agenda-day")).toHaveLength(31);
  });

  test("each event is a button that fires eventClick; today carries aria-current", () => {
    const f = agenda();
    const clicked: unknown[] = [];
    f.componentInstance.eventClick.subscribe((e) => clicked.push(e));
    (q(f, ".calendar-view-event").find((b) => b.textContent === "Single-day") as HTMLElement).click();
    expect(clicked).toEqual([EVENTS[0]]);
    expect(f.nativeElement.querySelector('[data-date="2026-01-09"]').getAttribute("aria-current")).toBe("date");
  });

  test("agendaEmpty shows for an empty month; the switcher selects the view; next steps a month", () => {
    const f = agenda({ events: [], labels: { ...LABELS, agendaView: "Agenda", agendaEmpty: "Nothing this month" } });
    const calls = collectNavigate(f);
    expect(f.nativeElement.querySelector(".calendar-view-agenda-empty").textContent).toBe("Nothing this month");
    const button = q(f, "button").find((b) => b.textContent === "Agenda") as HTMLElement;
    expect(button.getAttribute("aria-pressed")).toBe("true");
    (f.nativeElement.querySelector(".calendar-view-next-button") as HTMLElement).click();
    f.detectChanges();
    expect(calls.at(-1)).toEqual({ view: "agenda", start: "2026-02-01", end: "2026-02-28" });
  });

  test("periodRange treats agenda as the month; periodDays is empty", () => {
    expect(periodRange("agenda", "2026-01-15", 0)).toEqual(["2026-01-01", "2026-01-31"]);
    expect(periodDays("agenda", "2026-01-15", 0)).toEqual([]);
  });
});
