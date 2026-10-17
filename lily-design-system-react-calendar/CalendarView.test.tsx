import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

afterEach(cleanup);

import CalendarView, {
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./CalendarView";
import type { CalendarEvent, CalendarViewLabels, DayArgs } from "./CalendarView";

const LABELS: CalendarViewLabels = {
    weekView: "Week",
    fourWeekView: "4 weeks",
    monthView: "Month",
    previous: (view) => `Previous ${view}`,
    next: (view) => `Next ${view}`,
    today: "Today",
    periodAnnouncement: (view, start, end) => `${view}: ${start} to ${end}`,
    weekday: (wd) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd],
    weekdayAbbr: (wd) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][wd],
    day: (isoDate, wd, outside) =>
        `${Number(isoDate.slice(8))}, ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd]}${outside ? " (outside)" : ""}`,
};


// Test host: exercises the `day` render prop.
function HostCalendar(props: Record<string, unknown>) {
  return React.createElement(CalendarView, {
    label: "Appointments",
    defaultView: "week",
    defaultAnchorDate: "2026-01-06",
    ...props,
    day: (args: DayArgs) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement("span", { "data-testid": `events-${args.date}` }, args.events.map((e) => e.id).join(",")),
        args.selected ? React.createElement("i", { "data-snippet-selected": "" }) : null,
        args.disabled ? React.createElement("i", { "data-snippet-disabled": "" }) : null,
        args.ranges.length ? React.createElement("i", { "data-snippet-ranges": args.ranges.map((r) => r.kind).join(",") }) : null,
        React.createElement("span", { "data-testid": `cap-${args.date}` }, `${args.visibleEvents.length}/${args.hiddenCount}`),
        args.events.map((ev) =>
          React.createElement("button", { key: ev.id, type: "button", "data-event-open": "", ...args.eventProps(ev), onClick: () => args.openEvent(ev) }, ev.id),
        ),
      ),
  } as never);
}

const EVENTS: CalendarEvent[] = [
    { id: "e1", date: "2026-01-06", title: "Single-day" },
    { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Multi-day" },
];

function bodyRows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".calendar-table-body .calendar-table-row"));
}

function dayCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".calendar-table-td"));
}

function tabbableCells(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.calendar-table-td[tabindex="0"]'));
}

function cellFor(isoDate: string): HTMLElement | null {
    return document.querySelector(`.calendar-table-td[data-date="${isoDate}"]`);
}

// =====================================================================
// Pure helpers (§8.2, §8.3, §8.4, §8.12, §8.14)
// =====================================================================

describe("CalendarView — pure period helpers", () => {
    test("weekStart finds the Monday on/before a Tuesday anchor (default first-day-of-week)", () => {
        expect(weekStart("2026-01-06", 1)).toBe("2026-01-05");
    });

    test("periodDays('week') returns exactly 7 days, one row", () => {
        const days = periodDays("week", "2026-01-06", 1);
        expect(days).toHaveLength(1);
        expect(days[0]).toHaveLength(7);
        expect(days[0][0]).toBe("2026-01-05");
        expect(days[0][6]).toBe("2026-01-11");
    });

    test("periodDays('four-week') returns exactly 28 days, four rows", () => {
        const days = periodDays("four-week", "2026-01-06", 1);
        expect(days).toHaveLength(4);
        expect(days.flat()).toHaveLength(28);
        expect(days[0][0]).toBe("2026-01-05");
        expect(days[3][6]).toBe("2026-02-01");
    });

    test("periodDays('month') returns the fixed 6-row, 42-day monthMatrix shape", () => {
        const days = periodDays("month", "2026-01-15", 1);
        expect(days).toHaveLength(6);
        expect(days.flat()).toHaveLength(42);
        expect(days[0][0]).toBe("2025-12-29"); // leading padding from December
        expect(days[5][6]).toBe("2026-02-08"); // trailing padding from February
    });

    test("isOutsidePeriod is true only for month-view padding days", () => {
        expect(isOutsidePeriod("month", "2025-12-29", "2026-01-15")).toBe(true);
        expect(isOutsidePeriod("month", "2026-01-15", "2026-01-15")).toBe(false);
        expect(isOutsidePeriod("week", "2025-12-29", "2026-01-06")).toBe(false);
        expect(isOutsidePeriod("four-week", "2025-12-29", "2026-01-06")).toBe(false);
    });

    test("periodRange returns the calendar month's own first/last day for month view, regardless of the anchor's day-of-month", () => {
        expect(periodRange("month", "2026-01-15", 1)).toEqual(["2026-01-01", "2026-01-31"]);
        expect(periodRange("week", "2026-01-06", 1)).toEqual(["2026-01-05", "2026-01-11"]);
        expect(periodRange("four-week", "2026-01-06", 1)).toEqual(["2026-01-05", "2026-02-01"]);
    });

    test("eventsByDay places a single-day event on exactly one date and a multi-day event on every date in its inclusive range", () => {
        const map = eventsByDay(EVENTS);
        expect(map.get("2026-01-06")?.map((e) => e.id)).toEqual(["e1"]);
        expect(map.get("2026-01-09")?.map((e) => e.id)).toEqual(["e2"]);
        expect(map.get("2026-01-10")?.map((e) => e.id)).toEqual(["e2"]);
        expect(map.get("2026-01-11")?.map((e) => e.id)).toEqual(["e2"]);
        expect(map.get("2026-01-12")).toBeUndefined();
    });
});

// =====================================================================
// Component — markup (§8.1, §8.2, §8.3, §8.4, §8.5, §8.15, §8.16)
// =====================================================================

describe("CalendarView — markup", () => {
    test("§8.1 renders a calendar-view root wrapping a role=grid table labelled by `label`", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06" }));
        expect(document.querySelector(".calendar-view")).toBeTruthy();
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Appointments");
    });

    test("§8.2 view=week renders exactly 7 day cells, none outside-period", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06" }));
        expect(bodyRows()).toHaveLength(1);
        expect(dayCells()).toHaveLength(7);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });

    test("§8.3 view=four-week renders exactly 28 day cells (4 rows), none outside-period", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "four-week", defaultAnchorDate: "2026-01-06" }));
        expect(bodyRows()).toHaveLength(4);
        expect(dayCells()).toHaveLength(28);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });

    test("§8.4 view=month renders exactly 42 day cells (6 rows); leading/trailing days carry data-outside-period", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "month", defaultAnchorDate: "2026-01-15" }));
        expect(bodyRows()).toHaveLength(6);
        expect(dayCells()).toHaveLength(42);
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-02-08")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-01-15")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.5 the day matching `today` carries aria-current=date; no other cell does", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", today: "2026-01-08" }));
        expect(cellFor("2026-01-08")?.getAttribute("aria-current")).toBe("date");
        const current = dayCells().filter((c) => c.getAttribute("aria-current") === "date");
        expect(current).toHaveLength(1);
    });

    test("§8.15 omitting `today` renders no aria-current=date anywhere and disables the Today button", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", labels: LABELS }));
        expect(dayCells().some((c) => c.getAttribute("aria-current") === "date")).toBe(false);
        expect((screen.getByRole("button", { name: "Today" }) as HTMLButtonElement).disabled).toBe(true);
    });

    test("§8.16 extra attributes spread onto the root", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", "data-testid": "cal-root" } as never));
        expect(document.querySelector('[data-testid="cal-root"]')).toBeTruthy();
    });
});

// =====================================================================
// View switcher and navigation (§8.6, §8.7, §8.8, §8.13, §8.14)
// =====================================================================

describe("CalendarView — view switcher and navigation", () => {
    test("§8.8 the view switcher renders only buttons whose label is supplied, and marks the active one aria-pressed", () => {
        render(React.createElement(CalendarView, {
                label: "Appointments",
                defaultView: "week",
                defaultAnchorDate: "2026-01-06",
                labels: { weekView: "Week", monthView: "Month" }, // fourWeekView omitted
            }));
        expect(screen.getByRole("button", { name: "Week" }).getAttribute("aria-pressed")).toBe("true");
        expect(screen.getByRole("button", { name: "Month" }).getAttribute("aria-pressed")).toBe("false");
        expect(screen.queryByText("4 weeks")).toBeNull();
    });

    test("§8.6 Next/Previous step by the view's own length and call onNavigate with the new period", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", labels: LABELS, onNavigate }));
        fireEvent.click(screen.getByRole("button", { name: "Next week" }));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");

        onNavigate.mockClear();
        fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
        fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
        expect(onNavigate).toHaveBeenLastCalledWith("week", "2025-12-29", "2026-01-04");
    });

    test("§8.6 Next steps a four-week view by 28 days and a month view by one calendar month", () => {
        const onNavigate = vi.fn();
        const { unmount } = render(React.createElement(CalendarView, { label: "Appointments", defaultView: "four-week", defaultAnchorDate: "2026-01-06", labels: LABELS, onNavigate }));
        fireEvent.click(screen.getByRole("button", { name: "Next four-week" }));
        expect(onNavigate).toHaveBeenCalledWith("four-week", "2026-02-02", "2026-03-01");
        unmount();

        onNavigate.mockClear();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "month", defaultAnchorDate: "2026-01-15", labels: LABELS, onNavigate }));
        fireEvent.click(screen.getByRole("button", { name: "Next month" }));
        expect(onNavigate).toHaveBeenCalledWith("month", "2026-02-01", "2026-02-28");
    });

    test("§8.7 Today sets anchorDate to the `today` prop without changing view", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-02-20", today: "2026-01-08", labels: LABELS, onNavigate }));
        fireEvent.click(screen.getByRole("button", { name: "Today" }));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(cellFor("2026-01-08")).toBeTruthy();
    });

    test("§8.13 every navigation announces the new period via the status region", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", labels: LABELS }));
        fireEvent.click(screen.getByRole("button", { name: "Next week" }));
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("week: 2026-01-12 to 2026-01-18");
    });

    test("§8.14 a Sunday-first locale shifts the computed week start", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", locale: "en-US" }));
        expect(cellFor("2026-01-04")).toBeTruthy(); // Sunday 4 Jan, not Monday 5 Jan
        expect(dayCells()).toHaveLength(7);
    });
});

// =====================================================================
// Keyboard — roving tabindex (§8.9, §8.10, §8.11)
// =====================================================================

describe("CalendarView — keyboard", () => {
    test("§8.9 exactly one day cell carries tabindex=0; arrow keys move it by day/week; Home/End clamp to the focused row", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "four-week", defaultAnchorDate: "2026-01-06" }));
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-06");

        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");

        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-14");

        fireEvent.keyDown(tabbableCells()[0], { key: "Home" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-12"); // Monday of that row

        fireEvent.keyDown(tabbableCells()[0], { key: "End" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-18"); // Sunday of that row
    });

    test("§8.10 PageDown steps the cursor by the view's own length and re-pages when it leaves the visible days", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", labels: LABELS, onNavigate }));
        fireEvent.keyDown(tabbableCells()[0], { key: "PageDown" });
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-13"); // cursor carried +7 days
    });

    test("§8.10 in month view, moving the cursor onto an already-rendered padding cell re-pages to that month", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "month", defaultAnchorDate: "2026-01-01", labels: LABELS, onNavigate }));
        // Cursor starts 2026-01-01; three ArrowLeft presses land on 2025-12-29, a rendered padding cell.
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        expect(onNavigate).toHaveBeenCalledWith("month", "2025-12-01", "2025-12-31");
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.11 Enter on the focused cell calls onDayClick with that cell's date", () => {
        const onDayClick = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", onDayClick }));
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(onDayClick).toHaveBeenCalledWith("2026-01-07");
    });

    test("clicking a day cell moves the cursor there and calls onDayClick", () => {
        const onDayClick = vi.fn();
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06", onDayClick }));
        fireEvent.click(cellFor("2026-01-10")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-10");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-10");
    });
});

// =====================================================================
// Events (§8.12)
// =====================================================================

describe("CalendarView — events", () => {
    test("§8.12 a single-day event renders inside exactly one day's snippet slot; a multi-day event renders inside every day in its range", () => {
        render(React.createElement(HostCalendar, { defaultView: "week", defaultAnchorDate: "2026-01-06", events: EVENTS }));
        expect(screen.getByTestId("events-2026-01-06").textContent).toBe("e1");
        expect(screen.getByTestId("events-2026-01-09").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-10").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-11").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-07").textContent).toBe("");
    });

    test("default rendering (no `day` snippet) shows each cell's own day-of-month number", () => {
        render(React.createElement(CalendarView, { label: "Appointments", defaultView: "week", defaultAnchorDate: "2026-01-06" }));
        expect(cellFor("2026-01-06")?.textContent?.trim()).toBe("6");
        expect(cellFor("2026-01-11")?.textContent?.trim()).toBe("11");
    });
});

// =====================================================================
// Picking, disabled days, today shortcut, event activation (§8.17–§8.21)
// =====================================================================

describe("CalendarView — interaction", () => {
    const base = { label: "Appointments", defaultView: "week" as const, defaultAnchorDate: "2026-01-06", today: "2026-01-08" };

    test("§8.17 picking a day marks it data-selected (distinct from the keyboard cursor)", () => {
        render(React.createElement(CalendarView, { ...base }));
        fireEvent.click(cellFor("2026-01-07")!);
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(false);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; they stay focusable but cannot be picked", () => {
        const onDayClick = vi.fn();
        render(React.createElement(CalendarView, { ...base, minDate: "2026-01-06", maxDate: "2026-01-10", isDisabled: (d: string) => d === "2026-01-07", onDayClick }));
        expect(cellFor("2026-01-05")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-07")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-11")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-06")!.hasAttribute("aria-disabled")).toBe(false);
        fireEvent.click(cellFor("2026-01-07")!);
        expect(onDayClick).not.toHaveBeenCalled();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        fireEvent.click(cellFor("2026-01-09")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-09");
    });

    test("§8.19 pressing t moves the cursor to today and navigates there", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { ...base, defaultAnchorDate: "2026-03-02", onNavigate }));
        fireEvent.keyDown(tabbableCells()[0], { key: "t" });
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.20 t does nothing when today is not supplied", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { label: "A", defaultView: "week", defaultAnchorDate: "2026-01-06", onNavigate }));
        fireEvent.keyDown(tabbableCells()[0], { key: "t" });
        expect(onNavigate).not.toHaveBeenCalled();
    });

    test("§8.21 the day snippet receives selected, disabled and openEvent, which fires onEventClick", () => {
        const onEventClick = vi.fn();
        render(React.createElement(HostCalendar, { events: EVENTS, onEventClick, defaultSelectedDate: "2026-01-06", minDate: "2026-01-06" }));
        const button = document.querySelector<HTMLButtonElement>("[data-event-open]")!;
        fireEvent.click(button);
        expect(onEventClick).toHaveBeenCalled();
        expect(document.querySelector("[data-snippet-selected]")).toBeTruthy();
        expect(document.querySelector("[data-snippet-disabled]")).toBeTruthy();
    });
});

describe("CalendarView — week numbers, marked ranges and range selection", () => {
    const base = { label: "Appointments", defaultView: "month", defaultAnchorDate: "2026-01-15", today: "2026-01-08" };
    const rangeLabels: CalendarViewLabels = {
        ...LABELS,
        weekNumberHeader: "Wk",
        weekNumber: (n) => `Week ${n}`,
        rangeAnnouncement: (s, e) => `Selected ${s} to ${e}`,
    };
    const mount = (props: Record<string, unknown> = {}) => render(React.createElement(CalendarView, { ...base, ...props } as never));

    test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", () => {
        mount({ showWeekNumbers: true, labels: rangeLabels });
        expect(document.querySelector("[data-week-number-header]")!.textContent).toBe("Wk");
        const rowHeaders = Array.from(document.querySelectorAll("[data-week-number]"));
        expect(rowHeaders).toHaveLength(6);
        const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
        expect(week2.textContent).toBe("2");
        expect(week2.getAttribute("aria-label")).toBe("Week 2");
        expect(week2.getAttribute("scope")).toBe("row");
    });

    test("§8.22 week numbers are off by default", () => {
        mount();
        expect(document.querySelector("[data-week-number]")).toBeNull();
        expect(document.querySelector("[data-week-number-header]")).toBeNull();
    });

    test("§8.23 ranges mark each day inside with data-range={kind}", () => {
        mount({ ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] });
        expect(cellFor("2026-01-05")!.getAttribute("data-range")).toBe("holiday");
        expect(cellFor("2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
        expect(cellFor("2026-01-08")!.getAttribute("data-range")).toBe("range");
        expect(cellFor("2026-01-09")!.hasAttribute("data-range")).toBe(false);
    });

    test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", () => {
        mount({ labels: rangeLabels });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Selected 2026-01-15 to 2026-01-17");
    });

    test("§8.24 extending backwards orders the range", () => {
        mount();
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft", shiftKey: true });
        expect(cellFor("2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
    });

    test("§8.25 Enter on an extended range fires onRangeSelect once, and not onDayClick", () => {
        const onRangeSelect = vi.fn();
        const onDayClick = vi.fn();
        mount({ onRangeSelect, onDayClick });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(onRangeSelect).toHaveBeenCalledTimes(1);
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-16");
        expect(onDayClick).not.toHaveBeenCalled();
    });

    test("§8.26 a plain arrow after extending stops extending but keeps the range", () => {
        mount();
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(cellFor("2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
    });

    test("§8.27 Escape clears the range", () => {
        mount();
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        fireEvent.keyDown(tabbableCells()[0], { key: "Escape" });
        expect(document.querySelector("[data-in-range]")).toBeNull();
    });

    test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", () => {
        const onRangeSelect = vi.fn();
        mount({ onRangeSelect });
        fireEvent.click(cellFor("2026-01-20")!, { shiftKey: true });
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-20");
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
    });

    test("§8.29 a plain click after a range clears extension and picks that day", () => {
        const onDayClick = vi.fn();
        mount({ onDayClick });
        fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        fireEvent.click(cellFor("2026-01-22")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-22");
    });

    test("§8.30 the day render prop receives inRange and ranges", () => {
        render(React.createElement(HostCalendar, { events: EVENTS, ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }] }));
        expect(document.querySelector("[data-snippet-ranges='holiday']")).toBeTruthy();
    });
});

describe("CalendarView — day view, maxEvents, drag-and-drop, title, weekends, multiple selection", () => {
    const cellFor = (iso: string) => document.querySelector<HTMLElement>(`.calendar-table-td[data-date="${iso}"]`)!;
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".calendar-table-td"));
    const tab = () => cells().filter((c) => c.getAttribute("tabindex") === "0");
    const dayProps = { label: "Appointments", defaultView: "day" as const, defaultAnchorDate: "2026-01-06", today: "2026-01-08", labels: { ...LABELS, dayView: "Day" } };
    const evs: CalendarEvent[] = [{ id: "a", date: "2026-01-06", title: "A" }, { id: "b", date: "2026-01-06", title: "B" }, { id: "c", date: "2026-01-06", title: "C" }];

    test("§8.33 the day view shows exactly one day under one weekday header", () => {
        render(React.createElement(CalendarView, dayProps));
        expect(cells()).toHaveLength(1);
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-06");
        expect(document.querySelectorAll(".calendar-table-head .calendar-table-th")).toHaveLength(1);
    });

    test("§8.34 labels.dayView adds a pressed switcher button", () => {
        render(React.createElement(CalendarView, { ...dayProps, defaultView: "week" }));
        const b = screen.getByRole("button", { name: "Day" });
        expect(b.getAttribute("aria-pressed")).toBe("false");
        fireEvent.click(b);
        expect(b.getAttribute("aria-pressed")).toBe("true");
        expect(cells()).toHaveLength(1);
    });

    test("§8.35 next steps one day and reports the one-day period", () => {
        const onNavigate = vi.fn();
        render(React.createElement(CalendarView, { ...dayProps, onNavigate }));
        fireEvent.click(screen.getByRole("button", { name: "Next day" }));
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        expect(onNavigate).toHaveBeenLastCalledWith("day", "2026-01-07", "2026-01-07");
    });

    test("§8.36 arrows and Page keys move by a day", () => {
        render(React.createElement(CalendarView, dayProps));
        fireEvent.keyDown(cells()[0], { key: "ArrowRight" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        fireEvent.keyDown(cells()[0], { key: "ArrowDown" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-08");
        fireEvent.keyDown(cells()[0], { key: "PageUp" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
    });

    test("§8.31 maxEvents caps visibleEvents and reports hiddenCount; without it nothing is hidden", () => {
        render(React.createElement(HostCalendar, { events: evs, maxEvents: 2 }));
        expect(screen.getByTestId("cap-2026-01-06").textContent).toBe("2/1");
        cleanup();
        render(React.createElement(HostCalendar, { events: evs }));
        expect(screen.getByTestId("cap-2026-01-06").textContent).toBe("3/0");
    });

    test("§8.38 without onEventMove the event is not draggable; with it a drop calls onEventMove", () => {
        render(React.createElement(HostCalendar, { events: evs }));
        expect(document.querySelector("[data-event-open]")!.hasAttribute("draggable")).toBe(false);
        cleanup();
        const onEventMove = vi.fn();
        render(React.createElement(HostCalendar, { events: evs, onEventMove }));
        const el = document.querySelector("[data-event-open]")!;
        expect(el.getAttribute("draggable")).toBe("true");
        const dt = { setData: vi.fn(), getData: () => "" };
        fireEvent.dragStart(el, { dataTransfer: dt });
        fireEvent.dragOver(cellFor("2026-01-09"), { dataTransfer: dt });
        fireEvent.drop(cellFor("2026-01-09"), { dataTransfer: dt });
        expect(onEventMove).toHaveBeenCalledWith(evs[0], "2026-01-09");
    });

    test("§8.40 Alt+Arrow on a focused event moves it a day / a week; a disabled day refuses", () => {
        const onEventMove = vi.fn();
        render(React.createElement(HostCalendar, { events: evs, onEventMove }));
        const el = document.querySelector("[data-event-open]")!;
        fireEvent.keyDown(el, { key: "ArrowRight", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-07");
        fireEvent.keyDown(el, { key: "ArrowDown", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-13");
        cleanup();
        const refused = vi.fn();
        render(React.createElement(HostCalendar, { events: evs, onEventMove: refused, minDate: "2026-01-07" }));
        fireEvent.keyDown(document.querySelector("[data-event-open]")!, { key: "ArrowLeft", altKey: true });
        expect(refused).not.toHaveBeenCalled();
    });

    test("§8.42 labels.periodTitle renders the shown period's title and updates on navigation", () => {
        render(React.createElement(CalendarView, { label: "A", defaultView: "month", defaultAnchorDate: "2026-01-15", labels: { ...LABELS, periodTitle: (v: string, s: string, e: string) => `${v}:${s}..${e}` } }));
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-01-01..2026-01-31");
        fireEvent.click(screen.getByRole("button", { name: "Next month" }));
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-02-01..2026-02-28");
    });

    test("§8.44 hideOutsideDays leaves outside cells empty but in the grid", () => {
        render(React.createElement(CalendarView, { label: "A", defaultView: "month", defaultAnchorDate: "2026-01-15", hideOutsideDays: true }));
        expect(document.querySelector<HTMLElement>(".calendar-table-td[data-outside-period]")!.textContent!.trim()).toBe("");
        expect(cellFor("2026-01-15").textContent!.trim()).toBe("15");
        expect(cells()).toHaveLength(42);
    });

    test("§8.46 weekendDays marks those weekdays with data-weekend", () => {
        render(React.createElement(CalendarView, { label: "A", defaultView: "week", defaultAnchorDate: "2026-01-06", weekendDays: [0, 6] }));
        expect(cellFor("2026-01-10").hasAttribute("data-weekend")).toBe(true);
        expect(cellFor("2026-01-11").hasAttribute("data-weekend")).toBe(true);
        expect(cellFor("2026-01-07").hasAttribute("data-weekend")).toBe(false);
    });

    test("§8.48 multiple selection toggles days in selectedDates and Enter toggles the cursor day", () => {
        const onDayClick = vi.fn();
        render(React.createElement(CalendarView, { label: "A", defaultView: "week", defaultAnchorDate: "2026-01-06", selectionMode: "multiple", onDayClick }));
        fireEvent.click(cellFor("2026-01-06"));
        fireEvent.click(cellFor("2026-01-08"));
        expect(cellFor("2026-01-06").hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08").hasAttribute("data-selected")).toBe(true);
        fireEvent.click(cellFor("2026-01-06"));
        expect(cellFor("2026-01-06").hasAttribute("data-selected")).toBe(false);
        fireEvent.keyDown(tab()[0], { key: "Enter" });
        expect(onDayClick).toHaveBeenLastCalledWith("2026-01-06");
    });
});

describe("CalendarView — agenda view", () => {
    const AGENDA_EVENTS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Single-day" },
        { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Multi-day" },
    ];
    const agendaProps = { label: "Agenda", view: "agenda" as const, anchorDate: "2026-01-15", events: AGENDA_EVENTS, today: "2026-01-09" };

    afterEach(() => cleanup());

    test("lists only the days with events, as an ordered list of <time> headings", () => {
        render(<CalendarView {...agendaProps} labels={LABELS} />);
        const items = Array.from(document.querySelectorAll(".calendar-view-agenda-day"));
        expect(items.map((li) => li.getAttribute("data-date"))).toEqual(["2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11"]);
        expect(document.querySelector("ol.calendar-view-agenda")!.getAttribute("aria-label")).toBe("Agenda");
        expect(items[0].querySelector("time")!.getAttribute("datetime")).toBe("2026-01-06");
        expect(document.querySelector(".calendar-view-table")).toBeNull();
    });

    test("agendaEmptyDays lists every day of the month", () => {
        render(<CalendarView {...agendaProps} agendaEmptyDays />);
        expect(document.querySelectorAll(".calendar-view-agenda-day")).toHaveLength(31);
    });

    test("each event is a button that fires onEventClick; today carries aria-current", () => {
        const onEventClick = vi.fn();
        render(<CalendarView {...agendaProps} onEventClick={onEventClick} />);
        fireEvent.click(screen.getByRole("button", { name: "Single-day" }));
        expect(onEventClick).toHaveBeenCalledWith(AGENDA_EVENTS[0]);
        expect(document.querySelector('[data-date="2026-01-09"]')!.getAttribute("aria-current")).toBe("date");
    });

    test("agendaEmpty shows for an empty month; the switcher selects the view; next steps a month", () => {
        const onNavigate = vi.fn();
        render(<CalendarView {...agendaProps} events={[]} labels={{ ...LABELS, agendaView: "Agenda", agendaEmpty: "Nothing this month" }} onNavigate={onNavigate} />);
        expect(document.querySelector(".calendar-view-agenda-empty")!.textContent).toBe("Nothing this month");
        expect(screen.getByRole("button", { name: "Agenda" }).getAttribute("aria-pressed")).toBe("true");
        fireEvent.click(screen.getByRole("button", { name: "Next agenda" }));
        expect(onNavigate).toHaveBeenLastCalledWith("agenda", "2026-02-01", "2026-02-28");
    });

    test("periodRange treats agenda as the month; periodDays is empty", () => {
        expect(periodRange("agenda", "2026-01-15", 0)).toEqual(["2026-01-01", "2026-01-31"]);
        expect(periodDays("agenda", "2026-01-15", 0)).toEqual([]);
    });
});

const mount = (props: Record<string, unknown>) => render(React.createElement(CalendarView, props as never));

describe("CalendarView — typed event fields, editing, export (§8.69–§8.82)", () => {
    const FIELDS = [
        { id: "room", header: "Room", type: "select" as const, options: [{ id: "a", label: "Aspen" }, { id: "b", label: "Birch" }] },
        { id: "cost", header: "Cost", type: "number" as const },
    ];
    const FEVENTS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Standup", values: { room: "a", cost: 3 } },
        { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Offsite =x", values: { cost: 5 } },
        { id: "e3", date: "2026-03-01", title: "Later" },
    ];
    const XL: CalendarViewLabels = {
        ...LABELS,
        agendaView: "Agenda",
        export: "Export",
        exportCsv: "CSV",
        exportTsv: "TSV",
        exportExcel: "Excel",
        exportHeaders: { title: "Title", start: "From", end: "To" },
        exportAnnouncement: (f, n, name) => `${n} events as ${f}: ${name}`,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
    };
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: FEVENTS, eventFields: FIELDS };
    const eventLi = (id: string) => document.querySelector<HTMLElement>(`[data-event-key="${id}"]`)!;

    test("§8.69 the agenda shows each event's typed fields after its title, named by their header", () => {
        mount(base);
        const fields = eventLi("e1").querySelectorAll(".calendar-view-event-field");
        expect(Array.from(fields).map((f) => f.textContent?.replace(/\s+/g, " ").trim())).toEqual(["Room Aspen", "Cost 3"]);
        expect(eventLi("e2").querySelectorAll(".calendar-view-event-field")).toHaveLength(1);
    });

    test("§8.70 fields are plain text without onFieldEdit", () => {
        mount(base);
        expect(document.querySelector(".calendar-view-field-button")).toBeNull();
    });

    test("§8.71 a `day` snippet reads a field's formatted text through fieldText", () => {
                render(
            React.createElement(CalendarView, {
                label: "Cal",
                view: "month",
                anchorDate: "2026-01-15",
                events: FEVENTS,
                eventFields: FIELDS,
                day: (args: DayArgs) =>
                    React.createElement(
                        React.Fragment,
                        null,
                        args.events.map((ev) => React.createElement("span", { key: ev.id, "data-testid": `field-${ev.id}-room` }, args.fieldText(ev, "room"))),
                    ),
            } as never),
        );
        expect(screen.getByTestId("field-e1-room").textContent).toBe("Aspen");
        // A multi-day event appears on each day it covers, and has no room.
        expect(screen.getAllByTestId("field-e2-room").map((e) => e.textContent)).toEqual(["", "", ""]);
    });

    test("§8.72 clicking a value opens a typed editor; Enter commits the parsed value and announces", async () => {
        const onFieldEdit = vi.fn();
        mount({ ...base, onFieldEdit, labels: XL });
        await fireEvent.click(eventLi("e1").querySelectorAll<HTMLElement>(".calendar-view-field-button")[1]);
        const input = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
        expect(input.type).toBe("number");
        expect(input.getAttribute("aria-label")).toBe("Cost");
        await fireEvent.input(input, { target: { value: "8" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ eventId: "e1", fieldId: "cost", value: 8, previous: 3 });
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Standup Cost is 8");
        expect(document.querySelector(".calendar-view-field-editor")).toBeNull();
    });

    test("§8.73 a select field edits through its options", async () => {
        const onFieldEdit = vi.fn();
        mount({ ...base, onFieldEdit });
        await fireEvent.click(eventLi("e2").querySelectorAll<HTMLElement>(".calendar-view-field-button")[0]);
        await fireEvent.change(document.querySelector("select.calendar-view-field-editor")!, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledWith({ eventId: "e2", fieldId: "room", value: "b", previous: undefined });
    });

    test("§8.74 Escape cancels; an unchanged value reports nothing", async () => {
        const onFieldEdit = vi.fn();
        mount({ ...base, onFieldEdit });
        const open = () => fireEvent.click(eventLi("e1").querySelectorAll<HTMLElement>(".calendar-view-field-button")[1]);
        await open();
        await fireEvent.input(document.querySelector(".calendar-view-field-editor")!, { target: { value: "9" } });
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Escape" });
        await open();
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.75 a value that does not fit the type is refused: the editor stays open and the refusal is announced", async () => {
        const onFieldEdit = vi.fn();
        mount({ ...base, eventFields: [{ id: "c", header: "C", type: "number", parse: () => Number.NaN }], events: [{ id: "e1", date: "2026-01-06", title: "Standup", values: { c: 1 } }], onFieldEdit, labels: XL });
        await fireEvent.click(document.querySelector(".calendar-view-field-button")!);
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".calendar-view-field-editor")).not.toBeNull();
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Standup: bad C");
    });

    test("§8.76 Tab commits and moves to the event's next editable field; Shift+Tab to the previous", async () => {
        mount({ ...base, onFieldEdit: vi.fn() });
        await fireEvent.click(eventLi("e1").querySelectorAll<HTMLElement>(".calendar-view-field-button")[0]);
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Tab" });
        expect(document.querySelector<HTMLInputElement>("input.calendar-view-field-editor")!.type).toBe("number");
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Tab", shiftKey: true });
        expect(document.querySelector("select.calendar-view-field-editor")).not.toBeNull();
    });

    test("§8.77 IME: Enter while composing does not commit", async () => {
        const onFieldEdit = vi.fn();
        mount({ ...base, eventFields: [{ id: "n", header: "N" }], events: [{ id: "e1", date: "2026-01-06", title: "Standup", values: { n: "a" } }], onFieldEdit });
        await fireEvent.click(document.querySelector(".calendar-view-field-button")!);
        const input = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
        await fireEvent.input(input, { target: { value: "かな" } });
        await fireEvent.keyDown(input, { key: "Enter", isComposing: true });
        await fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ eventId: "e1", fieldId: "n", value: "かな", previous: "a" });
    });

    async function exported(props: Record<string, unknown> = {}, format: "csv" | "tsv" | "xlsx" = "csv") {
        const onExport = vi.fn((_file: { format: string; filename: string; eventCount: number; blob: Blob }) => false as const);
        mount({ ...base, labels: XL, onExport, ...props });
        await fireEvent.click(document.querySelector(`[data-calendar-export-format="${format}"]`)!);
        const file = onExport.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text };
    }

    test("§8.78 export buttons need a label and exportHeaders; each label gates its button", () => {
        mount(base);
        expect(document.querySelector(".calendar-view-export")).toBeNull();
        cleanup();
        mount({ ...base, labels: { exportCsv: "CSV" } });
        expect(document.querySelector(".calendar-view-export")).toBeNull();
        cleanup();
        mount({ ...base, labels: { export: "Export", exportExcel: "Excel", exportHeaders: XL.exportHeaders } });
        expect(screen.getByRole("group", { name: "Export" })).toBeTruthy();
        expect(document.querySelectorAll(".calendar-view-export-button")).toHaveLength(1);
    });

    test("§8.79 CSV holds the shown period's events by start date: title, from, to and the fields; formula text defused", async () => {
        const { file, text } = await exported();
        expect(file.filename).toBe("calendar.csv");
        expect(file.eventCount).toBe(2); // March's event is outside the shown January
        expect(text).toBe("﻿Title,From,To,Room,Cost\r\nStandup,2026-01-06,2026-01-06,Aspen,3\r\n'=x,2026-01-09,2026-01-11,,5\r\n".replace("'=x", "Offsite =x"));
    });

    test("§8.80 exportScope all exports every dated event; exportable false drops a field", async () => {
        const all = await exported({ exportScope: "all", eventFields: [{ ...FIELDS[0], exportable: false }, FIELDS[1]] });
        expect(all.file.eventCount).toBe(3);
        expect(all.text.split("\r\n")[0]).toBe("﻿Title,From,To,Cost");
    });

    test("§8.81 events with neither a date nor a range are left out", async () => {
        const { file } = await exported({ events: [{ id: "x", title: "Undated" }, FEVENTS[0]] });
        expect(file.eventCount).toBe(1);
    });

    test("§8.82 saving announces unless onExport returns false; no events disables the buttons", async () => {
        const created: Blob[] = [];
        const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
        URL.revokeObjectURL = () => {};
        try {
            mount({ ...base, labels: XL });
            await fireEvent.click(document.querySelector('[data-calendar-export-format="tsv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".calendar-view-status")!.textContent).toBe("2 events as tsv: calendar.tsv");
            cleanup();
            mount({ ...base, events: [], labels: XL });
            expect((document.querySelector('[data-calendar-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });
});
