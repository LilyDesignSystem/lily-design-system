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
