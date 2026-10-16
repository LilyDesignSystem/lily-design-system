import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import CalendarView, {
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./CalendarView.svelte";
import type { CalendarEvent, CalendarViewLabels } from "./CalendarView.svelte";
import CalendarViewEventsTestHost from "./CalendarViewEventsTestHost.svelte";

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
        render(CalendarView, { props: { label: "Appointments", view: "week", anchorDate: "2026-01-06" } });
        expect(document.querySelector(".calendar-view")).toBeTruthy();
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Appointments");
    });

    test("§8.2 view=week renders exactly 7 day cells, none outside-period", () => {
        render(CalendarView, { props: { label: "Appointments", view: "week", anchorDate: "2026-01-06" } });
        expect(bodyRows()).toHaveLength(1);
        expect(dayCells()).toHaveLength(7);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });

    test("§8.3 view=four-week renders exactly 28 day cells (4 rows), none outside-period", () => {
        render(CalendarView, { props: { label: "Appointments", view: "four-week", anchorDate: "2026-01-06" } });
        expect(bodyRows()).toHaveLength(4);
        expect(dayCells()).toHaveLength(28);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });

    test("§8.4 view=month renders exactly 42 day cells (6 rows); leading/trailing days carry data-outside-period", () => {
        render(CalendarView, { props: { label: "Appointments", view: "month", anchorDate: "2026-01-15" } });
        expect(bodyRows()).toHaveLength(6);
        expect(dayCells()).toHaveLength(42);
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-02-08")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-01-15")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.5 the day matching `today` carries aria-current=date; no other cell does", () => {
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", today: "2026-01-08" },
        });
        expect(cellFor("2026-01-08")?.getAttribute("aria-current")).toBe("date");
        const current = dayCells().filter((c) => c.getAttribute("aria-current") === "date");
        expect(current).toHaveLength(1);
    });

    test("§8.15 omitting `today` renders no aria-current=date anywhere and disables the Today button", () => {
        render(CalendarView, { props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", labels: LABELS } });
        expect(dayCells().some((c) => c.getAttribute("aria-current") === "date")).toBe(false);
        expect((screen.getByRole("button", { name: "Today" }) as HTMLButtonElement).disabled).toBe(true);
    });

    test("§8.16 extra attributes spread onto the root", () => {
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", "data-testid": "cal-root" },
        });
        expect(document.querySelector('[data-testid="cal-root"]')).toBeTruthy();
    });
});

// =====================================================================
// View switcher and navigation (§8.6, §8.7, §8.8, §8.13, §8.14)
// =====================================================================

describe("CalendarView — view switcher and navigation", () => {
    test("§8.8 the view switcher renders only buttons whose label is supplied, and marks the active one aria-pressed", () => {
        render(CalendarView, {
            props: {
                label: "Appointments",
                view: "week",
                anchorDate: "2026-01-06",
                labels: { weekView: "Week", monthView: "Month" }, // fourWeekView omitted
            },
        });
        expect(screen.getByRole("button", { name: "Week" }).getAttribute("aria-pressed")).toBe("true");
        expect(screen.getByRole("button", { name: "Month" }).getAttribute("aria-pressed")).toBe("false");
        expect(screen.queryByText("4 weeks")).toBeNull();
    });

    test("§8.6 Next/Previous step by the view's own length and call onNavigate with the new period", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", labels: LABELS, onNavigate },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next week" }));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");

        onNavigate.mockClear();
        await fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
        await fireEvent.click(screen.getByRole("button", { name: "Previous week" }));
        expect(onNavigate).toHaveBeenLastCalledWith("week", "2025-12-29", "2026-01-04");
    });

    test("§8.6 Next steps a four-week view by 28 days and a month view by one calendar month", async () => {
        const onNavigate = vi.fn();
        const { unmount } = render(CalendarView, {
            props: { label: "Appointments", view: "four-week", anchorDate: "2026-01-06", labels: LABELS, onNavigate },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next four-week" }));
        expect(onNavigate).toHaveBeenCalledWith("four-week", "2026-02-02", "2026-03-01");
        unmount();

        onNavigate.mockClear();
        render(CalendarView, {
            props: { label: "Appointments", view: "month", anchorDate: "2026-01-15", labels: LABELS, onNavigate },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next month" }));
        expect(onNavigate).toHaveBeenCalledWith("month", "2026-02-01", "2026-02-28");
    });

    test("§8.7 Today sets anchorDate to the `today` prop without changing view", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-02-20", today: "2026-01-08", labels: LABELS, onNavigate },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Today" }));
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(cellFor("2026-01-08")).toBeTruthy();
    });

    test("§8.13 every navigation announces the new period via the status region", async () => {
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", labels: LABELS },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next week" }));
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("week: 2026-01-12 to 2026-01-18");
    });

    test("§8.14 a Sunday-first locale shifts the computed week start", () => {
        render(CalendarView, { props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", locale: "en-US" } });
        expect(cellFor("2026-01-04")).toBeTruthy(); // Sunday 4 Jan, not Monday 5 Jan
        expect(dayCells()).toHaveLength(7);
    });
});

// =====================================================================
// Keyboard — roving tabindex (§8.9, §8.10, §8.11)
// =====================================================================

describe("CalendarView — keyboard", () => {
    test("§8.9 exactly one day cell carries tabindex=0; arrow keys move it by day/week; Home/End clamp to the focused row", async () => {
        render(CalendarView, {
            props: { label: "Appointments", view: "four-week", anchorDate: "2026-01-06" },
        });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-06");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-14");

        await fireEvent.keyDown(tabbableCells()[0], { key: "Home" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-12"); // Monday of that row

        await fireEvent.keyDown(tabbableCells()[0], { key: "End" });
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-18"); // Sunday of that row
    });

    test("§8.10 PageDown steps the cursor by the view's own length and re-pages when it leaves the visible days", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", labels: LABELS, onNavigate },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "PageDown" });
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-12", "2026-01-18");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-13"); // cursor carried +7 days
    });

    test("§8.10 in month view, moving the cursor onto an already-rendered padding cell re-pages to that month", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "month", anchorDate: "2026-01-01", labels: LABELS, onNavigate },
        });
        // Cursor starts 2026-01-01; three ArrowLeft presses land on 2025-12-29, a rendered padding cell.
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft" });
        expect(onNavigate).toHaveBeenCalledWith("month", "2025-12-01", "2025-12-31");
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.11 Enter on the focused cell calls onDayClick with that cell's date", async () => {
        const onDayClick = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", onDayClick },
        });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(onDayClick).toHaveBeenCalledWith("2026-01-07");
    });

    test("clicking a day cell moves the cursor there and calls onDayClick", async () => {
        const onDayClick = vi.fn();
        render(CalendarView, {
            props: { label: "Appointments", view: "week", anchorDate: "2026-01-06", onDayClick },
        });
        await fireEvent.click(cellFor("2026-01-10")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-10");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-10");
    });
});

// =====================================================================
// Events (§8.12)
// =====================================================================

describe("CalendarView — events", () => {
    test("§8.12 a single-day event renders inside exactly one day's snippet slot; a multi-day event renders inside every day in its range", () => {
        render(CalendarViewEventsTestHost, {
            props: { view: "week", anchorDate: "2026-01-06", events: EVENTS },
        });
        expect(screen.getByTestId("events-2026-01-06").textContent).toBe("e1");
        expect(screen.getByTestId("events-2026-01-09").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-10").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-11").textContent).toBe("e2");
        expect(screen.getByTestId("events-2026-01-07").textContent).toBe("");
    });

    test("default rendering (no `day` snippet) shows each cell's own day-of-month number", () => {
        render(CalendarView, { props: { label: "Appointments", view: "week", anchorDate: "2026-01-06" } });
        expect(cellFor("2026-01-06")?.textContent?.trim()).toBe("6");
        expect(cellFor("2026-01-11")?.textContent?.trim()).toBe("11");
    });
});

// =====================================================================
// Picking, disabled days, today shortcut, event activation (§8.17–§8.21)
// =====================================================================

describe("CalendarView — interaction", () => {
    const base = { label: "Appointments", view: "week" as const, anchorDate: "2026-01-06", today: "2026-01-08" };

    test("§8.17 picking a day marks it data-selected (distinct from the keyboard cursor)", async () => {
        render(CalendarView, { props: { ...base } });
        await fireEvent.click(cellFor("2026-01-07")!);
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(false);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; they stay focusable but cannot be picked", async () => {
        const onDayClick = vi.fn();
        render(CalendarView, {
            props: { ...base, minDate: "2026-01-06", maxDate: "2026-01-10", isDisabled: (d: string) => d === "2026-01-07", onDayClick },
        });
        expect(cellFor("2026-01-05")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-07")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-11")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-06")!.hasAttribute("aria-disabled")).toBe(false);
        await fireEvent.click(cellFor("2026-01-07")!);
        expect(onDayClick).not.toHaveBeenCalled();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        await fireEvent.click(cellFor("2026-01-09")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-09");
    });

    test("§8.19 pressing t moves the cursor to today and navigates there", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, { props: { ...base, anchorDate: "2026-03-02", onNavigate } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "t" });
        expect(onNavigate).toHaveBeenCalledWith("week", "2026-01-05", "2026-01-11");
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.20 t does nothing when today is not supplied", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, { props: { label: "A", view: "week", anchorDate: "2026-01-06", onNavigate } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "t" });
        expect(onNavigate).not.toHaveBeenCalled();
    });

    test("§8.21 the day snippet receives selected, disabled and openEvent, which fires onEventClick", async () => {
        const onEventClick = vi.fn();
        render(CalendarViewEventsTestHost, {
            props: { events: EVENTS, onEventClick, selectedDate: "2026-01-06", minDate: "2026-01-06" },
        });
        const button = document.querySelector<HTMLButtonElement>("[data-event-open]")!;
        await fireEvent.click(button);
        expect(onEventClick).toHaveBeenCalled();
        expect(document.querySelector("[data-snippet-selected]")).toBeTruthy();
        expect(document.querySelector("[data-snippet-disabled]")).toBeTruthy();
    });
});

// =====================================================================
// Week numbers, ranges, range selection (§8.22–§8.30)
// =====================================================================

describe("CalendarView — week numbers, marked ranges and range selection", () => {
    const base = { label: "Appointments", view: "month" as const, anchorDate: "2026-01-15", today: "2026-01-08" };
    const rangeLabels: CalendarViewLabels = {
        ...LABELS,
        weekNumberHeader: "Wk",
        weekNumber: (n) => `Week ${n}`,
        rangeAnnouncement: (s, e) => `Selected ${s} to ${e}`,
    };

    test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", () => {
        render(CalendarView, { props: { ...base, showWeekNumbers: true, labels: rangeLabels } });
        expect(document.querySelector("[data-week-number-header]")!.textContent).toBe("Wk");
        const rowHeaders = Array.from(document.querySelectorAll("[data-week-number]"));
        expect(rowHeaders).toHaveLength(6);
        // Monday-first: the row of 5 Jan 2026 is ISO week 2.
        const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
        expect(week2.textContent).toBe("2");
        expect(week2.getAttribute("aria-label")).toBe("Week 2");
        expect(week2.getAttribute("scope")).toBe("row");
    });

    test("§8.22 week numbers are off by default", () => {
        render(CalendarView, { props: base });
        expect(document.querySelector("[data-week-number]")).toBeNull();
        expect(document.querySelector("[data-week-number-header]")).toBeNull();
    });

    test("§8.23 ranges mark each day inside with data-range={kind}", () => {
        render(CalendarView, {
            props: { ...base, ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] },
        });
        expect(cellFor("2026-01-05")!.getAttribute("data-range")).toBe("holiday");
        expect(cellFor("2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
        expect(cellFor("2026-01-08")!.getAttribute("data-range")).toBe("range");
        expect(cellFor("2026-01-09")!.hasAttribute("data-range")).toBe(false);
    });

    test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", async () => {
        render(CalendarView, { props: { ...base, labels: rangeLabels } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        // Cursor started on the anchor 2026-01-15.
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Selected 2026-01-15 to 2026-01-17");
    });

    test("§8.24 extending backwards orders the range", async () => {
        render(CalendarView, { props: { ...base } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowLeft", shiftKey: true });
        expect(cellFor("2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
    });

    test("§8.25 Enter on an extended range fires onRangeSelect once, and not onDayClick", async () => {
        const onRangeSelect = vi.fn();
        const onDayClick = vi.fn();
        render(CalendarView, { props: { ...base, onRangeSelect, onDayClick } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(onRangeSelect).toHaveBeenCalledTimes(1);
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-16");
        expect(onDayClick).not.toHaveBeenCalled();
    });

    test("§8.26 a plain arrow after extending stops extending but keeps the range", async () => {
        render(CalendarView, { props: { ...base } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        expect(cellFor("2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
    });

    test("§8.27 Escape clears the range", async () => {
        render(CalendarView, { props: { ...base } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Escape" });
        expect(document.querySelector("[data-in-range]")).toBeNull();
    });

    test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", async () => {
        const onRangeSelect = vi.fn();
        render(CalendarView, { props: { ...base, onRangeSelect } });
        await fireEvent.click(cellFor("2026-01-20")!, { shiftKey: true });
        expect(onRangeSelect).toHaveBeenCalledWith("2026-01-15", "2026-01-20");
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
    });

    test("§8.29 a plain click after a range clears extension and picks that day", async () => {
        const onDayClick = vi.fn();
        render(CalendarView, { props: { ...base, onDayClick } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight", shiftKey: true });
        await fireEvent.click(cellFor("2026-01-22")!);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-22");
    });

    test("§8.30 the day snippet receives inRange and ranges", async () => {
        render(CalendarViewEventsTestHost, {
            props: { events: EVENTS, ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }] },
        });
        expect(document.querySelector("[data-snippet-ranges='holiday']")).toBeTruthy();
    });
});

describe("CalendarView — maxEvents (§8.31–§8.32)", () => {
    const evs = [
        { id: "a", date: "2026-01-06", title: "A" },
        { id: "b", date: "2026-01-06", title: "B" },
        { id: "c", date: "2026-01-06", title: "C" },
    ];
    test("§8.31 maxEvents caps visibleEvents and reports hiddenCount", () => {
        render(CalendarViewEventsTestHost, { props: { events: evs, maxEvents: 2 } });
        expect(screen.getByTestId("cap-2026-01-06").textContent).toBe("2/1");
    });
    test("§8.32 without maxEvents every event is visible and hiddenCount is 0", () => {
        render(CalendarViewEventsTestHost, { props: { events: evs } });
        expect(screen.getByTestId("cap-2026-01-06").textContent).toBe("3/0");
    });
});

describe("CalendarView — day view (§8.33–§8.37)", () => {
    const dayProps = { label: "Appointments", view: "day" as const, anchorDate: "2026-01-06", today: "2026-01-08", labels: { ...LABELS, dayView: "Day" } };
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".calendar-table-td"));
    const headers = () => Array.from(document.querySelectorAll(".calendar-table-thead .calendar-table-th, .calendar-table-head .calendar-table-th"));

    test("§8.33 the day view shows exactly one day under one weekday header", () => {
        render(CalendarView, { props: dayProps });
        expect(cells()).toHaveLength(1);
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-06");
        expect(headers()).toHaveLength(1);
    });

    test("§8.34 labels.dayView adds a pressed switcher button that switches to the day view", async () => {
        render(CalendarView, { props: { ...dayProps, view: "week" } });
        const b = screen.getByRole("button", { name: "Day" });
        expect(b.getAttribute("aria-pressed")).toBe("false");
        await fireEvent.click(b);
        expect(b.getAttribute("aria-pressed")).toBe("true");
        expect(cells()).toHaveLength(1);
    });

    test("§8.35 previous and next step one day and report the one-day period", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, { props: { ...dayProps, onNavigate } });
        await fireEvent.click(screen.getByRole("button", { name: LABELS.next!("day") }));
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        expect(onNavigate).toHaveBeenLastCalledWith("day", "2026-01-07", "2026-01-07");
    });

    test("§8.36 arrows and Page keys move by a day", async () => {
        render(CalendarView, { props: dayProps });
        await fireEvent.keyDown(cells()[0], { key: "ArrowRight" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        await fireEvent.keyDown(cells()[0], { key: "ArrowDown" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-08");
        await fireEvent.keyDown(cells()[0], { key: "PageUp" });
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
    });

    test("§8.37 the day view still renders the day snippet with that day's events", () => {
        render(CalendarViewEventsTestHost, { props: { view: "day", anchorDate: "2026-01-06", events: EVENTS } });
        expect(screen.getByTestId("events-2026-01-06").textContent).toBe("e1");
    });
});

describe("CalendarView — event drag-and-drop (§8.38–§8.41)", () => {
    const evs = [{ id: "a", date: "2026-01-06", title: "A" }];
    const cell = (iso: string) => document.querySelector<HTMLElement>(`.calendar-table-td[data-date="${iso}"]`)!;
    const evEl = () => document.querySelector<HTMLElement>("[data-event-open]")!;

    test("§8.38 without onEventMove the event element is not draggable", () => {
        render(CalendarViewEventsTestHost, { props: { events: evs } });
        expect(evEl().hasAttribute("draggable")).toBe(false);
    });

    test("§8.39 with onEventMove the event is draggable and dropping it on a day calls onEventMove", async () => {
        const onEventMove = vi.fn();
        render(CalendarViewEventsTestHost, { props: { events: evs, onEventMove } });
        expect(evEl().getAttribute("draggable")).toBe("true");
        const dt = { setData: vi.fn(), getData: () => "" };
        await fireEvent.dragStart(evEl(), { dataTransfer: dt });
        await fireEvent.dragOver(cell("2026-01-09"), { dataTransfer: dt });
        await fireEvent.drop(cell("2026-01-09"), { dataTransfer: dt });
        expect(onEventMove).toHaveBeenCalledWith(evs[0], "2026-01-09");
    });

    test("§8.40 Alt+ArrowRight / Alt+ArrowDown on a focused event moves it a day / a week", async () => {
        const onEventMove = vi.fn();
        render(CalendarViewEventsTestHost, { props: { events: evs, onEventMove } });
        await fireEvent.keyDown(evEl(), { key: "ArrowRight", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-07");
        await fireEvent.keyDown(evEl(), { key: "ArrowDown", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-13");
    });

    test("§8.41 a disabled day refuses the drop", async () => {
        const onEventMove = vi.fn();
        render(CalendarViewEventsTestHost, { props: { events: evs, onEventMove, minDate: "2026-01-07" } });
        const dt = { setData: vi.fn(), getData: () => "" };
        await fireEvent.dragStart(evEl(), { dataTransfer: dt });
        await fireEvent.drop(cell("2026-01-06"), { dataTransfer: dt });
        expect(onEventMove).not.toHaveBeenCalled();
    });
});

describe("CalendarView — period title and hideOutsideDays (§8.42–§8.45)", () => {
    const month = { label: "Appointments", view: "month" as const, anchorDate: "2026-01-15" };
    const title = (v: string, s: string, e: string) => `${v}:${s}..${e}`;

    test("§8.42 labels.periodTitle renders the shown period's title, updating on navigation", async () => {
        render(CalendarView, { props: { ...month, labels: { ...LABELS, periodTitle: title } } });
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-01-01..2026-01-31");
        await fireEvent.click(screen.getByRole("button", { name: LABELS.next!("month") }));
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-02-01..2026-02-28");
    });

    test("§8.43 no title without labels.periodTitle", () => {
        render(CalendarView, { props: { ...month, labels: LABELS } });
        expect(document.querySelector(".calendar-view-title")).toBeNull();
    });

    test("§8.44 hideOutsideDays leaves outside cells empty but keeps them in the grid", () => {
        render(CalendarView, { props: { ...month, hideOutsideDays: true } });
        const outside = document.querySelector<HTMLElement>(".calendar-table-td[data-outside-period]")!;
        expect(outside.textContent?.trim()).toBe("");
        expect(cellFor("2026-01-15")!.textContent?.trim()).toBe("15");
        expect(dayCells()).toHaveLength(42);
    });

    test("§8.45 by default outside days show their number", () => {
        render(CalendarView, { props: month });
        expect(document.querySelector<HTMLElement>(".calendar-table-td[data-outside-period]")!.textContent?.trim()).not.toBe("");
    });
});

describe("CalendarView — weekendDays (§8.46–§8.47)", () => {
    test("§8.46 weekendDays marks those weekdays' cells with data-weekend", () => {
        render(CalendarView, { props: { label: "A", view: "week", anchorDate: "2026-01-06", weekendDays: [0, 6] } });
        expect(cellFor("2026-01-10")!.hasAttribute("data-weekend")).toBe(true); // Saturday
        expect(cellFor("2026-01-11")!.hasAttribute("data-weekend")).toBe(true); // Sunday
        expect(cellFor("2026-01-07")!.hasAttribute("data-weekend")).toBe(false);
    });
    test("§8.47 no cell is a weekend by default", () => {
        render(CalendarView, { props: { label: "A", view: "week", anchorDate: "2026-01-06" } });
        expect(document.querySelector("[data-weekend]")).toBeNull();
    });
});

describe("CalendarView — multiple selection (§8.48–§8.50)", () => {
    const props = { label: "A", view: "week" as const, anchorDate: "2026-01-06", selectionMode: "multiple" as const };

    test("§8.48 clicking days toggles them in selectedDates; each picked day carries data-selected", async () => {
        render(CalendarView, { props });
        await fireEvent.click(cellFor("2026-01-06")!);
        await fireEvent.click(cellFor("2026-01-08")!);
        expect(cellFor("2026-01-06")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(true);
        await fireEvent.click(cellFor("2026-01-06")!);
        expect(cellFor("2026-01-06")!.hasAttribute("data-selected")).toBe(false);
    });

    test("§8.49 Enter toggles the day under the cursor and onDayClick still fires", async () => {
        const onDayClick = vi.fn();
        render(CalendarView, { props: { ...props, onDayClick } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
        expect(cellFor("2026-01-06")!.hasAttribute("data-selected")).toBe(true);
        expect(onDayClick).toHaveBeenCalledWith("2026-01-06");
    });

    test("§8.50 selectedDates starts days picked; single mode ignores it", () => {
        render(CalendarView, { props: { ...props, selectedDates: ["2026-01-07"] } });
        expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
    });
});

describe("CalendarView — agenda view (§8.64–§8.68)", () => {
    const agendaProps = { label: "Agenda", view: "agenda" as const, anchorDate: "2026-01-15", events: EVENTS, today: "2026-01-09" };

    test("§8.64 lists only the days with events, as an ordered list of <time> headings", () => {
        render(CalendarView, { props: { ...agendaProps, labels: LABELS } });
        const items = Array.from(document.querySelectorAll(".calendar-view-agenda-day"));
        expect(items.map((li) => li.getAttribute("data-date"))).toEqual(["2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11"]);
        expect(document.querySelector("ol.calendar-view-agenda")!.getAttribute("aria-label")).toBe("Agenda");
        expect(items[0].querySelector("time")!.getAttribute("datetime")).toBe("2026-01-06");
        expect(document.querySelector(".calendar-view-table")).toBeNull();
    });

    test("§8.65 agendaEmptyDays lists every day of the month", () => {
        render(CalendarView, { props: { ...agendaProps, agendaEmptyDays: true } });
        expect(document.querySelectorAll(".calendar-view-agenda-day")).toHaveLength(31);
    });

    test("§8.66 each event is a button; clicking fires onEventClick; today carries aria-current", async () => {
        const onEventClick = vi.fn();
        render(CalendarView, { props: { ...agendaProps, onEventClick } });
        await fireEvent.click(screen.getByRole("button", { name: "Single-day" }));
        expect(onEventClick).toHaveBeenCalledWith(EVENTS[0]);
        expect(document.querySelector('[data-date="2026-01-09"]')!.getAttribute("aria-current")).toBe("date");
    });

    test("§8.67 labels.agendaEmpty shows when the month has no events; the switcher button selects the view; next steps a month", async () => {
        const onNavigate = vi.fn();
        render(CalendarView, { props: { ...agendaProps, events: [], labels: { ...LABELS, agendaView: "Agenda", agendaEmpty: "Nothing this month" }, onNavigate } });
        expect(document.querySelector(".calendar-view-agenda-empty")!.textContent).toBe("Nothing this month");
        expect(screen.getByRole("button", { name: "Agenda" }).getAttribute("aria-pressed")).toBe("true");
        await fireEvent.click(screen.getByRole("button", { name: "Next agenda" }));
        expect(onNavigate).toHaveBeenLastCalledWith("agenda", "2026-02-01", "2026-02-28");
    });

    test("§8.68 periodRange treats agenda as the month; periodDays is empty", () => {
        expect(periodRange("agenda", "2026-01-15", 0)).toEqual(["2026-01-01", "2026-01-31"]);
        expect(periodDays("agenda", "2026-01-15", 0)).toEqual([]);
    });
});

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
        render(CalendarView, { props: base });
        const fields = eventLi("e1").querySelectorAll(".calendar-view-event-field");
        expect(Array.from(fields).map((f) => f.textContent?.replace(/\s+/g, " ").trim())).toEqual(["Room Aspen", "Cost 3"]);
        expect(eventLi("e2").querySelectorAll(".calendar-view-event-field")).toHaveLength(1);
    });

    test("§8.70 fields are plain text without onFieldEdit", () => {
        render(CalendarView, { props: base });
        expect(document.querySelector(".calendar-view-field-button")).toBeNull();
    });

    test("§8.71 a `day` snippet reads a field's formatted text through fieldText", () => {
        render(CalendarViewEventsTestHost, { props: { view: "month", anchorDate: "2026-01-15", events: FEVENTS, eventFields: FIELDS } });
        expect(screen.getByTestId("field-e1-room").textContent).toBe("Aspen");
        // A multi-day event appears on each day it covers, and has no room.
        expect(screen.getAllByTestId("field-e2-room").map((e) => e.textContent)).toEqual(["", "", ""]);
    });

    test("§8.72 clicking a value opens a typed editor; Enter commits the parsed value and announces", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit, labels: XL } });
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
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await fireEvent.click(eventLi("e2").querySelectorAll<HTMLElement>(".calendar-view-field-button")[0]);
        await fireEvent.change(document.querySelector("select.calendar-view-field-editor")!, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledWith({ eventId: "e2", fieldId: "room", value: "b", previous: undefined });
    });

    test("§8.74 Escape cancels; an unchanged value reports nothing", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
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
        render(CalendarView, { props: { ...base, eventFields: [{ id: "c", header: "C", type: "number", parse: () => Number.NaN }], events: [{ id: "e1", date: "2026-01-06", title: "Standup", values: { c: 1 } }], onFieldEdit, labels: XL } });
        await fireEvent.click(document.querySelector(".calendar-view-field-button")!);
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".calendar-view-field-editor")).not.toBeNull();
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Standup: bad C");
    });

    test("§8.76 Tab commits and moves to the event's next editable field; Shift+Tab to the previous", async () => {
        render(CalendarView, { props: { ...base, onFieldEdit: vi.fn() } });
        await fireEvent.click(eventLi("e1").querySelectorAll<HTMLElement>(".calendar-view-field-button")[0]);
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Tab" });
        expect(document.querySelector<HTMLInputElement>("input.calendar-view-field-editor")!.type).toBe("number");
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "Tab", shiftKey: true });
        expect(document.querySelector("select.calendar-view-field-editor")).not.toBeNull();
    });

    test("§8.77 IME: Enter while composing does not commit", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, eventFields: [{ id: "n", header: "N" }], events: [{ id: "e1", date: "2026-01-06", title: "Standup", values: { n: "a" } }], onFieldEdit } });
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
        render(CalendarView, { props: { ...base, labels: XL, onExport, ...props } });
        await fireEvent.click(document.querySelector(`[data-calendar-export-format="${format}"]`)!);
        const file = onExport.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text };
    }

    test("§8.78 export buttons need a label and exportHeaders; each label gates its button", () => {
        render(CalendarView, { props: base });
        expect(document.querySelector(".calendar-view-export")).toBeNull();
        document.body.innerHTML = "";
        render(CalendarView, { props: { ...base, labels: { exportCsv: "CSV" } } });
        expect(document.querySelector(".calendar-view-export")).toBeNull();
        document.body.innerHTML = "";
        render(CalendarView, { props: { ...base, labels: { export: "Export", exportExcel: "Excel", exportHeaders: XL.exportHeaders } } });
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
            render(CalendarView, { props: { ...base, labels: XL } });
            await fireEvent.click(document.querySelector('[data-calendar-export-format="tsv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".calendar-view-status")!.textContent).toBe("2 events as tsv: calendar.tsv");
            document.body.innerHTML = "";
            render(CalendarView, { props: { ...base, events: [], labels: XL } });
            expect((document.querySelector('[data-calendar-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });
});
