import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import "@lilydesignsystem/web-components-date-time-picker";
import { CalendarView, eventsByDay, isOutsidePeriod, periodDays, periodRange, weekStart } from "./calendar-view.js";
import type { CalendarEvent, CalendarViewLabels } from "./calendar-view.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-calendar-view")) {
    customElements.define("lily-calendar-view", CalendarView);
}

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

function mount(attrs: Record<string, string> = {}, props: Partial<CalendarView> = {}): CalendarView {
    const el = document.createElement("lily-calendar-view") as CalendarView;
    el.setAttribute("label", "Appointments");
    el.setAttribute("view", "week");
    el.setAttribute("anchor-date", "2026-01-06");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    Object.assign(el, props);
    return el;
}

const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));
const bodyRows = () => q(".calendar-table-body .calendar-table-row");
const dayCells = () => q(".calendar-table-td");
const tabbable = () => q('.calendar-table-td[tabindex="0"]');
const cellFor = (iso: string) => document.querySelector<HTMLElement>(`.calendar-table-td[data-date="${iso}"]`);
const button = (name: string) =>
    q("button").find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name)!;
const press = (el: Element, key: string, opts: KeyboardEventInit = {}) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
const click = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

beforeEach(() => document.body.replaceChildren());
afterEach(() => document.body.replaceChildren());

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

describe("calendar-view — markup", () => {
    test("§8.1 renders a calendar-view root wrapping a role=grid table labelled by `label`", () => {
        mount();
        expect(document.querySelector(".calendar-view")).toBeTruthy();
        const grid = document.querySelector("table.calendar-table")!;
        expect(grid.getAttribute("role")).toBe("grid");
        expect(grid.getAttribute("aria-label")).toBe("Appointments");
    });
    test("§8.2 week: 7 cells, none outside-period", () => {
        mount();
        expect(bodyRows()).toHaveLength(1);
        expect(dayCells()).toHaveLength(7);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });
    test("§8.3 four-week: 28 cells in 4 rows", () => {
        mount({ view: "four-week" });
        expect(bodyRows()).toHaveLength(4);
        expect(dayCells()).toHaveLength(28);
    });
    test("§8.4 month: 42 cells; padding days carry data-outside-period", () => {
        mount({ view: "month", "anchor-date": "2026-01-15" });
        expect(bodyRows()).toHaveLength(6);
        expect(dayCells()).toHaveLength(42);
        expect(cellFor("2025-12-29")!.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-01-15")!.hasAttribute("data-outside-period")).toBe(false);
    });
    test("§8.5 the day matching `today` carries aria-current=date, and no other does", () => {
        mount({ today: "2026-01-08" });
        expect(cellFor("2026-01-08")!.getAttribute("aria-current")).toBe("date");
        expect(dayCells().filter((c) => c.getAttribute("aria-current") === "date")).toHaveLength(1);
    });
    test("§8.15 omitting `today` renders no aria-current=date and disables Today", () => {
        mount({}, { labels: LABELS });
        expect(dayCells().some((c) => c.hasAttribute("aria-current"))).toBe(false);
        expect((button("Today") as HTMLButtonElement).disabled).toBe(true);
    });
    test("§8.16 extra attributes (class) land on the root", () => {
        mount({ class: "my-cal" });
        expect(document.querySelector(".calendar-view.my-cal")).toBeTruthy();
    });
    test("default rendering shows each cell's day-of-month number", () => {
        mount();
        expect(cellFor("2026-01-06")!.textContent!.trim()).toBe("6");
        expect(cellFor("2026-01-11")!.textContent!.trim()).toBe("11");
    });
});

describe("calendar-view — view switcher and navigation", () => {
    test("§8.8 the switcher renders only labelled buttons and marks the active one aria-pressed", () => {
        mount({}, { labels: { weekView: "Week", monthView: "Month" } });
        expect(button("Week").getAttribute("aria-pressed")).toBe("true");
        expect(button("Month").getAttribute("aria-pressed")).toBe("false");
        expect(q("button").find((b) => b.textContent === "4 weeks")).toBeUndefined();
    });
    test("§8.6 Next/Previous step by the view's length and call onNavigate", () => {
        const onNavigate = vi.fn();
        mount({}, { labels: LABELS, onNavigate });
        click(button("Next week"));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
        click(button("Previous week"));
        click(button("Previous week"));
        expect(onNavigate).toHaveBeenLastCalledWith("week", "2025-12-29", "2026-01-04");
    });
    test("§8.6 four-week steps 28 days, month steps one month", () => {
        const a = vi.fn();
        mount({ view: "four-week" }, { labels: LABELS, onNavigate: a });
        click(button("Next four-week"));
        expect(a).toHaveBeenCalledWith("four-week", "2026-02-02", "2026-03-01");
        document.body.replaceChildren();
        const b = vi.fn();
        mount({ view: "month", "anchor-date": "2026-01-15" }, { labels: LABELS, onNavigate: b });
        click(button("Next month"));
        expect(b).toHaveBeenCalledWith("month", "2026-02-01", "2026-02-28");
    });
    test("§8.7 Today sets anchorDate to `today` without changing view", () => {
        const onNavigate = vi.fn();
        mount({ "anchor-date": "2026-02-20", today: "2026-01-08" }, { labels: LABELS, onNavigate });
        click(button("Today"));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(cellFor("2026-01-08")).toBeTruthy();
    });
    test("§8.13 every navigation announces the new period", () => {
        mount({}, { labels: LABELS });
        click(button("Next week"));
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("week: 2026-01-12 to 2026-01-18");
    });
    test("§8.14 a Sunday-first locale shifts the computed week start", () => {
        mount({ locale: "en-US" });
        expect(cellFor("2026-01-04")).toBeTruthy();
        expect(dayCells()).toHaveLength(7);
    });
});

describe("calendar-view — keyboard", () => {
    test("§8.9 one tab stop; arrows move by day/week; Home/End clamp to the row", () => {
        mount({ view: "four-week" });
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
    });
    test("§8.9 focus follows the cursor", () => {
        mount();
        press(tabbable()[0], "ArrowRight");
        expect(document.activeElement).toBe(cellFor("2026-01-07"));
    });
    test("§8.10 PageDown steps the cursor by the view's length and re-pages", () => {
        const onNavigate = vi.fn();
        mount({}, { labels: LABELS, onNavigate });
        press(tabbable()[0], "PageDown");
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
        expect(tabbable()[0].dataset.date).toBe("2026-01-13");
    });
    test("§8.10 in month view, moving onto a padding cell re-pages to that month", () => {
        const onNavigate = vi.fn();
        mount({ view: "month", "anchor-date": "2026-01-01" }, { labels: LABELS, onNavigate });
        for (let i = 0; i < 3; i++) press(tabbable()[0], "ArrowLeft");
        expect(onNavigate).toHaveBeenCalledWith("month", "2025-12-01", "2025-12-31");
        expect(cellFor("2025-12-29")!.hasAttribute("data-outside-period")).toBe(false);
    });
    test("§8.11 Enter calls onDayClick with the focused cell's date", () => {
        const onDayClick = vi.fn();
        mount({}, { onDayClick });
        press(tabbable()[0], "ArrowRight");
        press(tabbable()[0], "Enter");
        expect(onDayClick).toHaveBeenCalledWith("2026-01-07");
    });
    test("clicking a day cell moves the cursor there and calls onDayClick", () => {
        const onDayClick = vi.fn();
        mount({}, { onDayClick });
        click(cellFor("2026-01-10")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-10");
        expect(tabbable()[0].dataset.date).toBe("2026-01-10");
    });
});

describe("calendar-view — events", () => {
    test("§8.12 events render as buttons inside every day they cover", () => {
        mount({}, { events: EVENTS });
        const titles = (iso: string) =>
            Array.from(cellFor(iso)!.querySelectorAll(".calendar-view-event")).map((b) => b.textContent);
        expect(titles("2026-01-06")).toEqual(["Single-day"]);
        expect(titles("2026-01-09")).toEqual(["Multi-day"]);
        expect(titles("2026-01-11")).toEqual(["Multi-day"]);
        expect(titles("2026-01-07")).toEqual([]);
    });
    test("renderDay can be overridden, and receives selected, disabled and openEvent", () => {
        const onEventClick = vi.fn();
        const el = mount({ "selected-date": "2026-01-06", "min-date": "2026-01-06" }, { events: EVENTS, onEventClick });
        el.renderDay = (args) => {
            const b = document.createElement("button");
            b.setAttribute("data-custom", `${args.selected}-${args.disabled}`);
            b.addEventListener("click", () => args.events[0] && args.openEvent(args.events[0]));
            return b;
        };
        el.events = EVENTS; // re-render with the override
        expect(cellFor("2026-01-06")!.querySelector("[data-custom]")!.getAttribute("data-custom")).toBe("true-false");
        expect(cellFor("2026-01-05")!.querySelector("[data-custom]")!.getAttribute("data-custom")).toBe("false-true");
        click(cellFor("2026-01-06")!.querySelector("[data-custom]")!);
        expect(onEventClick).toHaveBeenCalled();
    });
});

describe("calendar-view — interaction", () => {
    const base = { today: "2026-01-08" };

    test("§8.17 picking a day marks it data-selected, distinct from the keyboard cursor", () => {
        mount(base);
        click(cellFor("2026-01-07")!);
        press(tabbable()[0], "ArrowRight");
        expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(false);
        expect(tabbable()[0].dataset.date).toBe("2026-01-08");
    });
    test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; focusable but not pickable", () => {
        const onDayClick = vi.fn();
        mount({ ...base, "min-date": "2026-01-06", "max-date": "2026-01-10" }, {
            isDisabled: (d: string) => d === "2026-01-07",
            onDayClick,
        });
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
        mount({ ...base, "anchor-date": "2026-03-02" }, { onNavigate });
        press(tabbable()[0], "t");
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(tabbable()[0].dataset.date).toBe("2026-01-08");
    });
    test("§8.20 t does nothing when today is not supplied", () => {
        const onNavigate = vi.fn();
        mount({}, { onNavigate });
        press(tabbable()[0], "t");
        expect(onNavigate).not.toHaveBeenCalled();
    });
    test("§8.21 an event button fires eventclick without picking the day", () => {
        const events: unknown[] = [];
        const onDayClick = vi.fn();
        const el = mount({}, { events: EVENTS, onDayClick });
        el.addEventListener("eventclick", (e) => events.push((e as CustomEvent).detail.id));
        click(cellFor("2026-01-06")!.querySelector(".calendar-view-event")!);
        expect(events).toEqual(["e1"]);
        expect(onDayClick).not.toHaveBeenCalled();
    });
});

describe("calendar-view — week numbers, marked ranges and range selection", () => {
    const base = { view: "month", "anchor-date": "2026-01-15", today: "2026-01-08" };
    const rangeLabels: CalendarViewLabels = {
        ...LABELS,
        weekNumberHeader: "Wk",
        weekNumber: (n) => `Week ${n}`,
        rangeAnnouncement: (st, e) => `Selected ${st} to ${e}`,
    };
    const shiftKey = (el: Element, k: string) => press(el, k, { shiftKey: true });
    const shiftClick = (el: Element) =>
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, shiftKey: true }));

    test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", () => {
        mount({ ...base, "show-week-numbers": "" }, { labels: rangeLabels });
        expect(document.querySelector("[data-week-number-header]")!.textContent).toBe("Wk");
        const rowHeaders = q("[data-week-number]");
        expect(rowHeaders).toHaveLength(6);
        const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
        expect(week2.textContent).toBe("2");
        expect(week2.getAttribute("aria-label")).toBe("Week 2");
        expect(week2.getAttribute("scope")).toBe("row");
    });

    test("§8.22 week numbers are off by default", () => {
        mount(base);
        expect(document.querySelector("[data-week-number]")).toBeNull();
        expect(document.querySelector("[data-week-number-header]")).toBeNull();
    });

    test("§8.23 ranges mark each day inside with data-range={kind}", () => {
        mount(base, { ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] });
        expect(cellFor("2026-01-05")!.getAttribute("data-range")).toBe("holiday");
        expect(cellFor("2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
        expect(cellFor("2026-01-08")!.getAttribute("data-range")).toBe("range");
        expect(cellFor("2026-01-09")!.hasAttribute("data-range")).toBe(false);
    });

    test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", () => {
        mount(base, { labels: rangeLabels });
        shiftKey(tabbable()[0], "ArrowRight");
        shiftKey(tabbable()[0], "ArrowRight");
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Selected 2026-01-15 to 2026-01-17");
        expect(document.activeElement).toBe(cellFor("2026-01-17"));
    });

    test("§8.24 extending backwards orders the range", () => {
        mount(base);
        shiftKey(tabbable()[0], "ArrowLeft");
        expect(cellFor("2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
    });

    test("§8.25 Enter on an extended range calls onRangeSelect once and fires rangeselect, not onDayClick", () => {
        const onRangeSelect = vi.fn();
        const onDayClick = vi.fn();
        const el = mount(base, { onRangeSelect, onDayClick });
        const events: unknown[] = [];
        el.addEventListener("rangeselect", (e) => events.push((e as CustomEvent).detail));
        shiftKey(tabbable()[0], "ArrowRight");
        press(tabbable()[0], "Enter");
        expect(onRangeSelect).toHaveBeenCalledTimes(1);
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-16");
        expect(events).toEqual([{ start: "2026-01-15", end: "2026-01-16" }]);
        expect(onDayClick).not.toHaveBeenCalled();
    });

    test("§8.26 a plain arrow after extending stops extending but keeps the range", () => {
        mount(base);
        shiftKey(tabbable()[0], "ArrowRight");
        press(tabbable()[0], "ArrowRight");
        expect(cellFor("2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
    });

    test("§8.27 Escape clears the range", () => {
        mount(base);
        shiftKey(tabbable()[0], "ArrowRight");
        press(tabbable()[0], "Escape");
        expect(document.querySelector("[data-in-range]")).toBeNull();
    });

    test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", () => {
        const onRangeSelect = vi.fn();
        mount(base, { onRangeSelect });
        shiftClick(cellFor("2026-01-20")!);
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-20");
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
    });

    test("§8.29 a plain click after a range clears extension and picks that day", () => {
        const onDayClick = vi.fn();
        mount(base, { onDayClick });
        shiftKey(tabbable()[0], "ArrowRight");
        click(cellFor("2026-01-22")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-22");
    });

    test("§8.30 renderDay receives inRange and ranges", () => {
        const el = mount({ "selected-date": "2026-01-06" }, { ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }] });
        el.renderDay = (args) => {
            const i = document.createElement("i");
            i.setAttribute("data-ctx", `${args.inRange}-${args.ranges.map((r) => r.kind).join(",")}`);
            return i;
        };
        el.ranges = [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }];
        expect(cellFor("2026-01-06")!.querySelector("[data-ctx]")!.getAttribute("data-ctx")).toBe("false-holiday");
    });
});

describe("calendar-view — day view, maxEvents, drag-and-drop, title, weekends, multiple selection", () => {
    const dayAttrs = { view: "day", "anchor-date": "2026-01-06", today: "2026-01-08" };
    const dayLabels: CalendarViewLabels = { ...LABELS, dayView: "Day" };
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
        mount(dayAttrs, { labels: dayLabels });
        expect(dayCells()).toHaveLength(1);
        expect(dayCells()[0].getAttribute("data-date")).toBe("2026-01-06");
        expect(q(".calendar-table-head .calendar-table-th")).toHaveLength(1);
    });

    test("§8.34 labels.dayView adds a pressed switcher button", () => {
        mount({ ...dayAttrs, view: "week" }, { labels: dayLabels });
        expect(button("Day").getAttribute("aria-pressed")).toBe("false");
        click(button("Day"));
        expect(button("Day").getAttribute("aria-pressed")).toBe("true");
        expect(dayCells()).toHaveLength(1);
    });

    test("§8.35 next steps one day and reports the one-day period", () => {
        const onNavigate = vi.fn();
        mount(dayAttrs, { labels: dayLabels, onNavigate });
        click(button("Next day"));
        expect(dayCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        expect(onNavigate).toHaveBeenLastCalledWith("day", "2026-01-07", "2026-01-07");
    });

    test("§8.36 arrows and Page keys move by a day", () => {
        mount(dayAttrs, { labels: dayLabels });
        press(tabbable()[0], "ArrowRight");
        expect(dayCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        press(tabbable()[0], "ArrowDown");
        expect(dayCells()[0].getAttribute("data-date")).toBe("2026-01-08");
        press(tabbable()[0], "PageUp");
        expect(dayCells()[0].getAttribute("data-date")).toBe("2026-01-07");
    });

    test("§8.31 maxEvents caps the events shown and a +N more button fires moreclick; §8.32 without it nothing is hidden", () => {
        const el = mount({ "max-events": "2" }, { events: evs, labels: { ...LABELS, moreEvents: (n: number) => `+${n} more` } });
        const more: string[] = [];
        el.addEventListener("moreclick", (e) => more.push((e as CustomEvent<string>).detail));
        expect(q(".calendar-view-event")).toHaveLength(2);
        const btn = q(".calendar-view-more-button");
        expect(btn).toHaveLength(1);
        expect(btn[0].textContent).toBe("+1 more");
        click(btn[0]);
        expect(more).toEqual(["2026-01-06"]);
        document.body.replaceChildren();
        mount({}, { events: evs, labels: { ...LABELS, moreEvents: (n: number) => `+${n} more` } });
        expect(q(".calendar-view-event")).toHaveLength(3);
        expect(q(".calendar-view-more-button")).toHaveLength(0);
    });

    test("§8.38 event buttons are draggable only when moving is on; a drop on a day calls onEventMove and fires eventmove", () => {
        mount({}, { events: evs });
        expect(q(".calendar-view-event")[0].hasAttribute("draggable")).toBe(false);
        document.body.replaceChildren();
        const onEventMove = vi.fn();
        const el = mount({}, { events: evs, onEventMove });
        const fired: unknown[] = [];
        el.addEventListener("eventmove", (e) => fired.push((e as CustomEvent).detail));
        const btn = q(".calendar-view-event")[0];
        expect(btn.getAttribute("draggable")).toBe("true");
        const dt = { setData: () => {}, getData: () => "" };
        btn.dispatchEvent(dragEvent("dragstart", dt));
        cellFor("2026-01-09")!.dispatchEvent(dragEvent("dragover", dt));
        cellFor("2026-01-09")!.dispatchEvent(dragEvent("drop", dt));
        expect(onEventMove).toHaveBeenCalledWith(evs[0], "2026-01-09");
        expect(fired).toEqual([{ event: evs[0], toDate: "2026-01-09" }]);
    });

    test("§8.40 Alt+Arrow on a focused event moves it a day / a week; a disabled day refuses", () => {
        const onEventMove = vi.fn();
        mount({}, { events: evs, onEventMove });
        const btn = q(".calendar-view-event")[0];
        press(btn, "ArrowRight", { altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-07");
        press(q(".calendar-view-event")[0], "ArrowDown", { altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-13");
        document.body.replaceChildren();
        const refused = vi.fn();
        mount({ "min-date": "2026-01-07" }, { events: evs, onEventMove: refused });
        press(q(".calendar-view-event")[0], "ArrowLeft", { altKey: true });
        expect(refused).not.toHaveBeenCalled();
    });

    test("§8.42 labels.periodTitle renders the shown period's title and updates on navigation", () => {
        mount({ view: "month", "anchor-date": "2026-01-15" }, { labels: { ...LABELS, periodTitle: (v: string, s: string, e: string) => `${v}:${s}..${e}` } });
        expect(q(".calendar-view-title")[0].textContent).toBe("month:2026-01-01..2026-01-31");
        click(button("Next month"));
        expect(q(".calendar-view-title")[0].textContent).toBe("month:2026-02-01..2026-02-28");
    });

    test("§8.44 hideOutsideDays leaves outside cells empty but in the grid", () => {
        mount({ view: "month", "anchor-date": "2026-01-15", "hide-outside-days": "" });
        expect(q(".calendar-table-td[data-outside-period]")[0].textContent).toBe("");
        expect(cellFor("2026-01-15")!.textContent).toBe("15");
        expect(dayCells()).toHaveLength(42);
    });

    test("§8.46 weekendDays marks those weekdays with data-weekend", () => {
        mount({}, { weekendDays: [0, 6] });
        expect(cellFor("2026-01-10")!.hasAttribute("data-weekend")).toBe(true);
        expect(cellFor("2026-01-11")!.hasAttribute("data-weekend")).toBe(true);
        expect(cellFor("2026-01-07")!.hasAttribute("data-weekend")).toBe(false);
    });

    test("§8.48 multiple selection toggles days and Enter toggles the cursor day", () => {
        const onDayClick = vi.fn();
        mount({ "selection-mode": "multiple" }, { onDayClick });
        click(cellFor("2026-01-06")!);
        click(cellFor("2026-01-08")!);
        expect(cellFor("2026-01-06")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(true);
        click(cellFor("2026-01-06")!);
        expect(cellFor("2026-01-06")!.hasAttribute("data-selected")).toBe(false);
        press(tabbable()[0], "Enter");
        expect(onDayClick).toHaveBeenLastCalledWith("2026-01-06");
    });
});

describe("lily-calendar-view — agenda view", () => {
    const agenda = (attrs: Record<string, string> = {}, props: Partial<CalendarView> = {}) =>
        mount({ view: "agenda", "anchor-date": "2026-01-15", today: "2026-01-09", ...attrs }, { events: EVENTS, ...props });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("lists only the days with events, as an ordered list of <time> headings", () => {
        agenda({}, { labels: LABELS });
        const items = q(".calendar-view-agenda-day");
        expect(items.map((li) => li.getAttribute("data-date"))).toEqual(["2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11"]);
        expect(document.querySelector("ol.calendar-view-agenda")!.getAttribute("aria-label")).toBe("Appointments");
        expect(items[0].querySelector("time")!.getAttribute("datetime")).toBe("2026-01-06");
        expect(document.querySelector(".calendar-view-table")).toBeNull();
    });

    test("agenda-empty-days lists every day of the month", () => {
        agenda({ "agenda-empty-days": "" });
        expect(q(".calendar-view-agenda-day")).toHaveLength(31);
    });

    test("each event is a button that fires eventclick; today carries aria-current", () => {
        const el = agenda();
        const ids: string[] = [];
        el.addEventListener("eventclick", (e) => ids.push((e as CustomEvent).detail.id));
        click(q(".calendar-view-event").find((b) => b.textContent === "Single-day")!);
        expect(ids).toEqual(["e1"]);
        expect(document.querySelector('[data-date="2026-01-09"]')!.getAttribute("aria-current")).toBe("date");
    });

    test("agendaEmpty shows for an empty month; the switcher selects the view; next steps a month", () => {
        const el = agenda({}, { events: [], labels: { ...LABELS, agendaView: "Agenda", agendaEmpty: "Nothing this month" } });
        const details: unknown[] = [];
        el.addEventListener("calendarnavigate", (e) => details.push((e as CustomEvent).detail));
        expect(document.querySelector(".calendar-view-agenda-empty")!.textContent).toBe("Nothing this month");
        expect(button("Agenda").getAttribute("aria-pressed")).toBe("true");
        click(document.querySelector(".calendar-view-next-button")!);
        expect(details.at(-1)).toEqual({ view: "agenda", start: "2026-02-01", end: "2026-02-28" });
    });

    test("periodRange treats agenda as the month; periodDays is empty", () => {
        expect(periodRange("agenda", "2026-01-15", 0)).toEqual(["2026-01-01", "2026-01-31"]);
        expect(periodDays("agenda", "2026-01-15", 0)).toEqual([]);
    });
});
