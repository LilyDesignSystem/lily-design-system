import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyCalendarView, { addDays, addMonths, createCalendarView, dayOfWeek, daysInMonth, startOfWeek } from "./index.js";
import type { CalendarOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async () => { await tick(); await tick(); };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LABELS = {
    grid: "Appointments",
    monthView: "Month",
    weekView: "Week",
    today: "Today",
    previous: (v: string) => "Previous " + v,
    next: (v: string) => "Next " + v,
    weekdayAbbr: (d: number) => WEEKDAYS[d].slice(0, 3),
    weekdayName: (d: number) => WEEKDAYS[d],
    periodTitle: (s: string, e: string) => s + " to " + e,
    periodAnnouncement: (s: string, e: string, v: string) => v + " " + s + " to " + e,
    dayLabel: (d: string) => "Day " + d,
};

const options = (extra: Partial<CalendarOptions> = {}): CalendarOptions => ({
    today: "2026-10-21",
    events: [
        { id: "e1", date: "2026-10-06", title: "Check-up" },
        { id: "e2", date: "2026-10-06", title: "Review" },
    ],
    labels: LABELS,
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyCalendarView);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<CalendarOptions> = {}) {
    (window as unknown as { calendarOptions: CalendarOptions }).calendarOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await settle();
    return document.querySelector(".calendar-view") as HTMLElement;
}

const state = () => Alpine.$data(document.querySelector(".calendar-view") as HTMLElement) as ReturnType<typeof createCalendarView>;
const day = (iso: string) => document.querySelector(`[data-date="${iso}"]`) as HTMLElement;
const dates = () => [...document.querySelectorAll("td[data-date]")].map((td) => (td as HTMLElement).dataset.date);
const press = async (target: Element, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
    await settle();
};
const button = (cls: string) => document.querySelector(".calendar-view-" + cls) as HTMLElement;

describe("date maths", () => {
    test("days, weekdays and week starts", () => {
        expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
        expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
        expect(dayOfWeek("2026-10-21")).toBe(3);
        expect(startOfWeek("2026-10-21", 0)).toBe("2026-10-18");
        expect(startOfWeek("2026-10-21", 1)).toBe("2026-10-19");
        expect(startOfWeek("2026-10-18", 1)).toBe("2026-10-12");
        expect(daysInMonth("2028-02-10")).toBe(29);
        expect(daysInMonth("2026-02-10")).toBe(28);
    });

    test("months clamp the day and cross years", () => {
        expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
        expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
        expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
        expect(addMonths("2026-11-30", 3)).toBe("2027-02-28");
    });
});

describe("month view", () => {
    test("is a role=grid of whole weeks with weekday headers", async () => {
        await mount();
        expect(document.querySelector("table")?.getAttribute("role")).toBe("grid");
        expect(document.querySelector("table")?.getAttribute("aria-label")).toBe("Appointments");
        expect([...document.querySelectorAll("th")].map((h) => h.textContent)).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        expect(document.querySelector("th")?.getAttribute("aria-label")).toBe("Sunday");
        expect(dates()).toHaveLength(35);
        expect(dates()[0]).toBe("2026-09-27");
        expect(dates()[34]).toBe("2026-10-31");
        expect(document.querySelector(".calendar-view-title")?.textContent).toBe("2026-10-01 to 2026-10-31");
    });

    test("weekStart changes the first column", async () => {
        await mount({ weekStart: 1 });
        expect([...document.querySelectorAll("th")].map((h) => h.textContent)[0]).toBe("Mon");
        expect(dates()[0]).toBe("2026-09-28");
    });

    test("marks today, outside days and the picked day", async () => {
        await mount({ picked: "2026-10-14" });
        expect(day("2026-10-21").getAttribute("aria-current")).toBe("date");
        expect(day("2026-10-20").hasAttribute("aria-current")).toBe(false);
        expect(day("2026-09-27").hasAttribute("data-outside")).toBe(true);
        expect(day("2026-10-02").hasAttribute("data-outside")).toBe(false);
        expect(day("2026-10-14").getAttribute("aria-selected")).toBe("true");
        expect(day("2026-10-15").getAttribute("aria-selected")).toBe("false");
        expect(day("2026-10-21").getAttribute("aria-label")).toBe("Day 2026-10-21");
    });

    test("events are buttons in their day; clicking one opens it without picking the day", async () => {
        const calendar = await mount();
        const opened = vi.fn();
        const picked = vi.fn();
        calendar.addEventListener("lily:event", (e) => opened((e as CustomEvent).detail.id));
        calendar.addEventListener("lily:pick", picked);
        expect([...day("2026-10-06").querySelectorAll(".calendar-event")].map((b) => b.textContent)).toEqual(["Check-up", "Review"]);
        (day("2026-10-06").querySelector(".calendar-event") as HTMLElement).click(); await settle();
        expect(opened).toHaveBeenCalledWith("e1");
        expect(picked).not.toHaveBeenCalled();
    });
});

describe("week view", () => {
    test("shows the week holding the anchor", async () => {
        await mount({ view: "week" });
        expect(dates()).toEqual(["2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24"]);
        expect(button("week").getAttribute("aria-pressed")).toBe("true");
        expect(button("month").getAttribute("aria-pressed")).toBe("false");
    });

    test("the view buttons switch and announce the period", async () => {
        await mount();
        button("week").click(); await settle();
        expect(dates()).toHaveLength(7);
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("week 2026-10-18 to 2026-10-24");
        button("month").click(); await settle();
        expect(dates()).toHaveLength(35);
    });
});

describe("period navigation", () => {
    test("previous, next and today move the period, announce it, and carry the keyboard day", async () => {
        await mount();
        button("next").click(); await settle();
        expect(dates()[0]).toBe("2026-11-01");
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("month 2026-11-01 to 2026-11-30");
        expect(state().active).toBe("2026-11-21");
        button("previous").click(); button("previous").click(); await settle();
        expect(document.querySelector(".calendar-view-title")?.textContent).toBe("2026-09-01 to 2026-09-30");
        button("today").click(); await settle();
        expect(document.querySelector(".calendar-view-title")?.textContent).toBe("2026-10-01 to 2026-10-31");
        expect(state().active).toBe("2026-10-21");
    });

    test("the buttons are named for the view", async () => {
        await mount();
        expect(button("previous").getAttribute("aria-label")).toBe("Previous month");
        button("week").click(); await settle();
        expect(button("next").getAttribute("aria-label")).toBe("Next week");
    });

    test("minDate and maxDate stop navigation: the buttons go aria-disabled and do nothing", async () => {
        await mount({ minDate: "2026-10-05", maxDate: "2026-10-28" });
        expect(button("previous").getAttribute("aria-disabled")).toBe("true");
        expect(button("next").getAttribute("aria-disabled")).toBe("true");
        button("next").click(); await settle();
        expect(state().anchor).toBe("2026-10-21");
        await mount({ minDate: "2026-09-05" });
        expect(button("previous").hasAttribute("aria-disabled")).toBe(false);
    });

    test("headless: absent labels remove the controls", async () => {
        await mount({ labels: { grid: "Appointments" } });
        expect(document.querySelector(".calendar-view-toolbar button")).toBeNull();
        expect(document.querySelector("th")?.textContent).toBe("");
    });
});

describe("picking", () => {
    test("click and Enter or Space pick a day and announce it", async () => {
        const calendar = await mount();
        const picked = vi.fn();
        calendar.addEventListener("lily:pick", (e) => picked((e as CustomEvent).detail.date));
        day("2026-10-14").click(); await settle();
        expect(state().picked).toBe("2026-10-14");
        expect(day("2026-10-14").getAttribute("aria-selected")).toBe("true");
        day("2026-10-15").focus();
        await press(day("2026-10-15"), "Enter");
        await press(day("2026-10-15"), " ");
        expect(picked.mock.calls.map((c) => c[0])).toEqual(["2026-10-14", "2026-10-15", "2026-10-15"]);
    });

    test("a disabled day (bounds or isDisabled) is marked and cannot be picked, but can be focused", async () => {
        await mount({ minDate: "2026-10-10", isDisabled: (d) => d === "2026-10-20" });
        expect(day("2026-10-09").getAttribute("aria-disabled")).toBe("true");
        expect(day("2026-10-20").getAttribute("aria-disabled")).toBe("true");
        expect(day("2026-10-21").hasAttribute("aria-disabled")).toBe(false);
        day("2026-10-20").click(); await settle();
        expect(state().picked).toBe("");
        day("2026-10-20").focus();
        expect(document.activeElement).toBe(day("2026-10-20"));
    });
});

describe("keyboard", () => {
    test("exactly one day is in the tab order and follows focus", async () => {
        await mount();
        expect([...document.querySelectorAll("td[tabindex='0']")]).toEqual([day("2026-10-21")]);
        day("2026-10-23").focus();
        await settle();
        expect([...document.querySelectorAll("td[tabindex='0']")]).toEqual([day("2026-10-23")]);
    });

    test("arrows move a day or a week; Home and End go to the row's ends", async () => {
        await mount();
        day("2026-10-21").focus();
        await press(day("2026-10-21"), "ArrowRight");
        expect(document.activeElement).toBe(day("2026-10-22"));
        await press(day("2026-10-22"), "ArrowDown");
        expect(document.activeElement).toBe(day("2026-10-29"));
        await press(day("2026-10-29"), "ArrowLeft");
        await press(day("2026-10-28"), "ArrowUp");
        expect(document.activeElement).toBe(day("2026-10-21"));
        await press(day("2026-10-21"), "Home");
        expect(document.activeElement).toBe(day("2026-10-18"));
        await press(day("2026-10-18"), "End");
        expect(document.activeElement).toBe(day("2026-10-24"));
    });

    test("moving past the grid changes the month and keeps focus on the right day", async () => {
        await mount();
        day("2026-10-31").focus();
        await press(day("2026-10-31"), "ArrowRight");
        expect(document.querySelector(".calendar-view-title")?.textContent).toBe("2026-11-01 to 2026-11-30");
        expect(document.activeElement).toBe(day("2026-11-01"));
        await press(day("2026-11-01"), "ArrowLeft");
        expect(document.activeElement).toBe(day("2026-10-31"));
    });

    test("PageDown and PageUp step a month (clamped) or a week", async () => {
        await mount({ today: "2026-01-31", anchor: "2026-01-31" });
        day("2026-01-31").focus();
        await press(day("2026-01-31"), "PageDown");
        expect(state().active).toBe("2026-02-28");
        expect(document.activeElement).toBe(day("2026-02-28"));
        await press(day("2026-02-28"), "PageUp");
        expect(state().active).toBe("2026-01-28");
        await mount({ view: "week" });
        day("2026-10-21").focus();
        await press(day("2026-10-21"), "PageDown");
        expect(document.activeElement).toBe(day("2026-10-28"));
    });

    test("t goes to today", async () => {
        await mount({ anchor: "2027-03-10" });
        day("2027-03-10").focus();
        await press(day("2027-03-10"), "t");
        expect(document.activeElement).toBe(day("2026-10-21"));
    });

    test("right-to-left swaps the horizontal arrows", async () => {
        document.documentElement.setAttribute("dir", "rtl");
        try {
            await mount();
            day("2026-10-21").focus();
            await press(day("2026-10-21"), "ArrowLeft");
            expect(document.activeElement).toBe(day("2026-10-22"));
        } finally {
            document.documentElement.removeAttribute("dir");
        }
    });

    test("bounds clamp the cursor", async () => {
        await mount({ maxDate: "2026-10-22" });
        day("2026-10-22").focus();
        await press(day("2026-10-22"), "ArrowRight");
        expect(state().active).toBe("2026-10-22");
        await mount({ minDate: "2026-10-20" });
        day("2026-10-20").focus();
        await press(day("2026-10-20"), "ArrowLeft");
        expect(state().active).toBe("2026-10-20");
    });
});
