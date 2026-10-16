import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";

import CalendarView, {
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./CalendarView.vue";
import type { CalendarEvent, CalendarViewLabels } from "./CalendarView.vue";

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


async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];
afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
});

/** Mount with uncontrolled view/anchorDate via v-model defaults (given as initial props). */
function build(props: Record<string, unknown> = {}, withSlot = false) {
    const Host = defineComponent({
        setup() {
            return () =>
                h(
                    CalendarView as any,
                    { label: "Appointments", ...props },
                    withSlot
                        ? {
                              day: (a: any) => [
                                  h("span", { "data-testid": `events-${a.date}` }, a.events.map((e: any) => e.id).join(",")),
                                  h("span", { "data-testid": `cap-${a.date}` }, `${a.visibleEvents.length}/${a.hiddenCount}`),
                                  a.selected ? h("i", { "data-snippet-selected": "" }) : null,
                                  a.disabled ? h("i", { "data-snippet-disabled": "" }) : null,
                                  a.ranges.length ? h("i", { "data-snippet-ranges": a.ranges.map((r: any) => r.kind).join(",") }) : null,
                                  ...a.events.map((ev: any) =>
                                      h("button", { type: "button", "data-event-open": "", ...a.eventProps(ev), onClick: () => a.openEvent(ev) }, ev.id),
                                  ),
                              ],
                          }
                        : undefined,
                );
        },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    wrappers.push(wrapper);
    return wrapper;
}

const key = (el: Element, init: KeyboardEventInit) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
const click = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
const byName = (name: string) =>
    Array.from(document.querySelectorAll("button")).find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim() === name) as HTMLElement;
const base = { view: "week", anchorDate: "2026-01-06" };

describe("CalendarView — markup", () => {
    test("§8.1 renders a calendar-view root wrapping a role=grid table labelled by `label`", async () => {
        build(base);
        await flush();
        expect(document.querySelector(".calendar-view")).toBeTruthy();
        expect(document.querySelector('[role="grid"]')!.getAttribute("aria-label")).toBe("Appointments");
    });

    test("§8.2 view=week renders exactly 7 day cells, none outside-period", async () => {
        build(base);
        await flush();
        expect(bodyRows()).toHaveLength(1);
        expect(dayCells()).toHaveLength(7);
        expect(dayCells().some((c) => c.hasAttribute("data-outside-period"))).toBe(false);
    });

    test("§8.3 view=four-week renders exactly 28 day cells (4 rows)", async () => {
        build({ ...base, view: "four-week" });
        await flush();
        expect(bodyRows()).toHaveLength(4);
        expect(dayCells()).toHaveLength(28);
    });

    test("§8.4 view=month renders 42 day cells; padding days carry data-outside-period", async () => {
        build({ view: "month", anchorDate: "2026-01-15" });
        await flush();
        expect(bodyRows()).toHaveLength(6);
        expect(dayCells()).toHaveLength(42);
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-02-08")?.hasAttribute("data-outside-period")).toBe(true);
        expect(cellFor("2026-01-15")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.5 the day matching `today` carries aria-current=date; no other cell does", async () => {
        build({ ...base, today: "2026-01-08" });
        await flush();
        expect(cellFor("2026-01-08")?.getAttribute("aria-current")).toBe("date");
        expect(dayCells().filter((c) => c.getAttribute("aria-current") === "date")).toHaveLength(1);
    });

    test("§8.15 omitting `today` renders no aria-current=date and disables the Today button", async () => {
        build({ ...base, labels: LABELS });
        await flush();
        expect(dayCells().some((c) => c.getAttribute("aria-current") === "date")).toBe(false);
        expect((byName("Today") as HTMLButtonElement).disabled).toBe(true);
    });

    test("§8.16 extra attributes spread onto the root", async () => {
        build({ ...base, "data-testid": "cal-root" });
        await flush();
        expect(document.querySelector('[data-testid="cal-root"]')).toBeTruthy();
    });
});

describe("CalendarView — view switcher and navigation", () => {
    test("§8.8 the view switcher renders only buttons whose label is supplied, and marks the active one aria-pressed", async () => {
        build({ ...base, labels: { weekView: "Week", monthView: "Month" } });
        await flush();
        expect(byName("Week").getAttribute("aria-pressed")).toBe("true");
        expect(byName("Month").getAttribute("aria-pressed")).toBe("false");
        expect(byName("4 weeks")).toBeUndefined();
    });

    test("§8.6 Next/Previous step by the view's own length and emit navigate", async () => {
        const wrapper = build({ ...base, labels: LABELS });
        await flush();
        click(byName("Next week"));
        await flush();
        click(byName("Previous week"));
        await flush();
        click(byName("Previous week"));
        await flush();
        const nav = wrapper.findComponent(CalendarView as any).emitted("navigate")!;
        expect(nav[0]).toEqual(["week", "2026-01-12", "2026-01-18"]);
        expect(nav[nav.length - 1]).toEqual(["week", "2025-12-29", "2026-01-04"]);
    });

    test("§8.6 Next steps a four-week view by 28 days and a month view by one month", async () => {
        const w1 = build({ ...base, view: "four-week", labels: LABELS });
        await flush();
        click(byName("Next four-week"));
        await flush();
        expect(w1.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["four-week", "2026-02-02", "2026-03-01"]);
        w1.unmount();
        wrappers.pop();
        const w2 = build({ view: "month", anchorDate: "2026-01-15", labels: LABELS });
        await flush();
        click(byName("Next month"));
        await flush();
        expect(w2.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["month", "2026-02-01", "2026-02-28"]);
    });

    test("§8.7 Today sets anchorDate to the `today` prop without changing view", async () => {
        const wrapper = build({ ...base, anchorDate: "2026-02-20", today: "2026-01-08", labels: LABELS });
        await flush();
        click(byName("Today"));
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["week", "2026-01-05", "2026-01-11"]);
        expect(cellFor("2026-01-08")).toBeTruthy();
    });

    test("§8.13 every navigation announces the new period via the status region", async () => {
        build({ ...base, labels: LABELS });
        await flush();
        click(byName("Next week"));
        await flush();
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("week: 2026-01-12 to 2026-01-18");
    });

    test("§8.14 a Sunday-first locale shifts the computed week start", async () => {
        build({ ...base, locale: "en-US" });
        await flush();
        expect(cellFor("2026-01-04")).toBeTruthy();
        expect(dayCells()).toHaveLength(7);
    });
});

describe("CalendarView — keyboard", () => {
    test("§8.9 one tab stop; arrows move by day/week; Home/End clamp to the row", async () => {
        build({ ...base, view: "four-week" });
        await flush();
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-06");
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        key(tabbableCells()[0], { key: "ArrowDown" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-14");
        key(tabbableCells()[0], { key: "Home" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-12");
        key(tabbableCells()[0], { key: "End" });
        await flush();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-18");
    });

    test("§8.10 PageDown steps the cursor by the view's length and re-pages", async () => {
        const wrapper = build({ ...base, labels: LABELS });
        await flush();
        key(tabbableCells()[0], { key: "PageDown" });
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["week", "2026-01-12", "2026-01-18"]);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-13");
    });

    test("§8.10 in month view, moving onto a padding cell re-pages to that month", async () => {
        const wrapper = build({ view: "month", anchorDate: "2026-01-01", labels: LABELS });
        await flush();
        for (let i = 0; i < 3; i++) {
            key(tabbableCells()[0], { key: "ArrowLeft" });
            await flush();
        }
        expect(wrapper.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["month", "2025-12-01", "2025-12-31"]);
        expect(cellFor("2025-12-29")?.hasAttribute("data-outside-period")).toBe(false);
    });

    test("§8.11 Enter emits day-click with the focused cell's date", async () => {
        const wrapper = build(base);
        await flush();
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("day-click")).toEqual([["2026-01-07"]]);
    });

    test("clicking a day cell moves the cursor there and emits day-click", async () => {
        const wrapper = build(base);
        await flush();
        click(cellFor("2026-01-10")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("day-click")).toEqual([["2026-01-10"]]);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-10");
    });
});

describe("CalendarView — events", () => {
    test("§8.12 events render inside the day slot of every day they cover", async () => {
        build({ ...base, events: EVENTS }, true);
        await flush();
        const t = (d: string) => document.querySelector(`[data-testid="events-${d}"]`)!.textContent;
        expect(t("2026-01-06")).toBe("e1");
        expect(t("2026-01-09")).toBe("e2");
        expect(t("2026-01-10")).toBe("e2");
        expect(t("2026-01-11")).toBe("e2");
        expect(t("2026-01-07")).toBe("");
    });

    test("default rendering (no `day` slot) shows each cell's day-of-month number", async () => {
        build(base);
        await flush();
        expect(cellFor("2026-01-06")?.textContent?.trim()).toBe("6");
        expect(cellFor("2026-01-11")?.textContent?.trim()).toBe("11");
    });
});

describe("CalendarView — interaction", () => {
    const b = { ...base, today: "2026-01-08" };

    test("§8.17 picking a day marks it data-selected, distinct from the keyboard cursor", async () => {
        build(b);
        await flush();
        click(cellFor("2026-01-07")!);
        await flush();
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        expect(cellFor("2026-01-07")!.hasAttribute("data-selected")).toBe(true);
        expect(cellFor("2026-01-08")!.hasAttribute("data-selected")).toBe(false);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.18 minDate, maxDate and isDisabled mark days aria-disabled; focusable but not pickable", async () => {
        const wrapper = build({ ...b, minDate: "2026-01-06", maxDate: "2026-01-10", isDisabled: (d: string) => d === "2026-01-07" });
        await flush();
        expect(cellFor("2026-01-05")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-07")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-11")!.getAttribute("aria-disabled")).toBe("true");
        expect(cellFor("2026-01-06")!.hasAttribute("aria-disabled")).toBe(false);
        click(cellFor("2026-01-07")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("day-click")).toBeUndefined();
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-07");
        click(cellFor("2026-01-09")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("day-click")).toEqual([["2026-01-09"]]);
    });

    test("§8.19 pressing t moves the cursor to today and navigates", async () => {
        const wrapper = build({ ...b, anchorDate: "2026-03-02" });
        await flush();
        key(tabbableCells()[0], { key: "t" });
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("navigate")![0]).toEqual(["week", "2026-01-05", "2026-01-11"]);
        expect(tabbableCells()[0].getAttribute("data-date")).toBe("2026-01-08");
    });

    test("§8.20 t does nothing when today is not supplied", async () => {
        const wrapper = build(base);
        await flush();
        key(tabbableCells()[0], { key: "t" });
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("navigate")).toBeUndefined();
    });

    test("§8.21 the day slot receives selected, disabled and openEvent, which emits event-click", async () => {
        const wrapper = build({ ...base, events: EVENTS, selectedDate: "2026-01-06", minDate: "2026-01-06" }, true);
        await flush();
        click(document.querySelector("[data-event-open]")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("event-click")).toBeTruthy();
        expect(document.querySelector("[data-snippet-selected]")).toBeTruthy();
        expect(document.querySelector("[data-snippet-disabled]")).toBeTruthy();
    });
});

describe("CalendarView — week numbers, marked ranges and range selection", () => {
    const b = { view: "month", anchorDate: "2026-01-15", today: "2026-01-08" };
    const rangeLabels: CalendarViewLabels = {
        ...LABELS,
        weekNumberHeader: "Wk",
        weekNumber: (n) => `Week ${n}`,
        rangeAnnouncement: (st, e) => `Selected ${st} to ${e}`,
    };
    const shiftKey = (el: Element, k: string) => key(el, { key: k, shiftKey: true });
    const shiftClick = (el: Element) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true }));

    test("§8.22 showWeekNumbers adds a leading header and a row header per week with the ISO week number", async () => {
        build({ ...b, showWeekNumbers: true, labels: rangeLabels });
        await flush();
        expect(document.querySelector("[data-week-number-header]")!.textContent).toBe("Wk");
        const rowHeaders = Array.from(document.querySelectorAll("[data-week-number]"));
        expect(rowHeaders).toHaveLength(6);
        const week2 = rowHeaders.find((h) => h.getAttribute("data-week-number") === "2")!;
        expect(week2.textContent).toBe("2");
        expect(week2.getAttribute("aria-label")).toBe("Week 2");
        expect(week2.getAttribute("scope")).toBe("row");
    });

    test("§8.22 week numbers are off by default", async () => {
        build(b);
        await flush();
        expect(document.querySelector("[data-week-number]")).toBeNull();
        expect(document.querySelector("[data-week-number-header]")).toBeNull();
    });

    test("§8.23 ranges mark each day inside with data-range={kind}", async () => {
        build({ ...b, ranges: [{ start: "2026-01-05", end: "2026-01-07", kind: "holiday" }, { start: "2026-01-07", end: "2026-01-08" }] });
        await flush();
        expect(cellFor("2026-01-05")!.getAttribute("data-range")).toBe("holiday");
        expect(cellFor("2026-01-07")!.getAttribute("data-range")).toBe("holiday range");
        expect(cellFor("2026-01-08")!.getAttribute("data-range")).toBe("range");
        expect(cellFor("2026-01-09")!.hasAttribute("data-range")).toBe(false);
    });

    test("§8.24 Shift+ArrowRight extends a range from the cursor, marking data-in-range, start and end", async () => {
        build({ ...b, labels: rangeLabels });
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-16")!.hasAttribute("data-in-range")).toBe(true);
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(false);
        expect(document.querySelector(".calendar-view-status")!.textContent).toBe("Selected 2026-01-15 to 2026-01-17");
    });

    test("§8.24 extending backwards orders the range", async () => {
        build(b);
        await flush();
        shiftKey(tabbableCells()[0], "ArrowLeft");
        await flush();
        expect(cellFor("2026-01-14")!.hasAttribute("data-range-start")).toBe(true);
        expect(cellFor("2026-01-15")!.hasAttribute("data-range-end")).toBe(true);
    });

    test("§8.25 Enter on an extended range emits range-select once, and not day-click", async () => {
        const wrapper = build(b);
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        key(tabbableCells()[0], { key: "Enter" });
        await flush();
        const cv = wrapper.findComponent(CalendarView as any);
        expect(cv.emitted("range-select")).toEqual([["2026-01-15", "2026-01-16"]]);
        expect(cv.emitted("day-click")).toBeUndefined();
    });

    test("§8.26 a plain arrow after extending stops extending but keeps the range", async () => {
        build(b);
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        key(tabbableCells()[0], { key: "ArrowRight" });
        await flush();
        expect(cellFor("2026-01-16")!.hasAttribute("data-range-end")).toBe(true);
        expect(cellFor("2026-01-17")!.hasAttribute("data-in-range")).toBe(false);
    });

    test("§8.27 Escape clears the range", async () => {
        build(b);
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        key(tabbableCells()[0], { key: "Escape" });
        await flush();
        expect(document.querySelector("[data-in-range]")).toBeNull();
    });

    test("§8.28 Shift+click picks a range from the cursor to the clicked day and confirms it", async () => {
        const wrapper = build(b);
        await flush();
        shiftClick(cellFor("2026-01-20")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("range-select")).toEqual([["2026-01-15", "2026-01-20"]]);
        expect(cellFor("2026-01-18")!.hasAttribute("data-in-range")).toBe(true);
    });

    test("§8.29 a plain click after a range clears extension and picks that day", async () => {
        const wrapper = build(b);
        await flush();
        shiftKey(tabbableCells()[0], "ArrowRight");
        await flush();
        click(cellFor("2026-01-22")!);
        await flush();
        expect(wrapper.findComponent(CalendarView as any).emitted("day-click")).toEqual([["2026-01-22"]]);
    });

    test("§8.30 the day slot receives inRange and ranges", async () => {
        build({ ...b, events: EVENTS, ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }] }, true);
        await flush();
        expect(document.querySelector("[data-snippet-ranges='holiday']")).toBeTruthy();
    });
});

describe("CalendarView — day view, maxEvents, drag-and-drop, title, weekends, multiple selection", () => {
    const dayProps = { view: "day", anchorDate: "2026-01-06", today: "2026-01-08", labels: { ...LABELS, dayView: "Day" } };
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".calendar-table-td"));
    const cell = (iso: string) => document.querySelector<HTMLElement>(`.calendar-table-td[data-date="${iso}"]`)!;
    const evs: CalendarEvent[] = [{ id: "a", date: "2026-01-06", title: "A" }, { id: "b", date: "2026-01-06", title: "B" }, { id: "c", date: "2026-01-06", title: "C" }];
    const dt = () => ({ setData: () => {}, getData: () => "" });
    const dragEvent = (type: string, d: unknown) => {
        const e = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(e, "dataTransfer", { value: d });
        return e;
    };

    test("§8.33 the day view shows exactly one day under one weekday header", async () => {
        build(dayProps);
        await flush();
        expect(cells()).toHaveLength(1);
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-06");
        expect(document.querySelectorAll(".calendar-table-head .calendar-table-th")).toHaveLength(1);
    });

    test("§8.34 labels.dayView adds a pressed switcher button", async () => {
        build({ ...dayProps, view: "week" });
        await flush();
        const b = byName("Day");
        expect(b.getAttribute("aria-pressed")).toBe("false");
        click(b);
        await flush();
        expect(b.getAttribute("aria-pressed")).toBe("true");
        expect(cells()).toHaveLength(1);
    });

    test("§8.35 next steps one day and reports the one-day period", async () => {
        const w = build(dayProps);
        await flush();
        click(byName("Next day"));
        await flush();
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        const nav = w.findComponent(CalendarView as any).emitted("navigate")!;
        expect(nav[nav.length - 1]).toEqual(["day", "2026-01-07", "2026-01-07"]);
    });

    test("§8.36 arrows and Page keys move by a day", async () => {
        build(dayProps);
        await flush();
        key(cells()[0], { key: "ArrowRight" });
        await flush();
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
        key(cells()[0], { key: "ArrowDown" });
        await flush();
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-08");
        key(cells()[0], { key: "PageUp" });
        await flush();
        expect(cells()[0].getAttribute("data-date")).toBe("2026-01-07");
    });

    test("§8.31 maxEvents caps visibleEvents and reports hiddenCount; without it nothing is hidden", async () => {
        build({ ...base, events: evs, maxEvents: 2 }, true);
        await flush();
        expect(document.querySelector('[data-testid="cap-2026-01-06"]')!.textContent).toBe("2/1");
        document.body.innerHTML = "";
        build({ ...base, events: evs }, true);
        await flush();
        expect(document.querySelector('[data-testid="cap-2026-01-06"]')!.textContent).toBe("3/0");
    });

    test("§8.38 without an event-move listener the event is not draggable; with one a drop emits event-move", async () => {
        build({ ...base, events: evs }, true);
        await flush();
        expect(document.querySelector("[data-event-open]")!.hasAttribute("draggable")).toBe(false);
        document.body.innerHTML = "";
        const onEventMove = vi.fn();
        build({ ...base, events: evs, onEventMove }, true);
        await flush();
        const el = document.querySelector("[data-event-open]")!;
        expect(el.getAttribute("draggable")).toBe("true");
        const d = dt();
        el.dispatchEvent(dragEvent("dragstart", d));
        cell("2026-01-09").dispatchEvent(dragEvent("dragover", d));
        cell("2026-01-09").dispatchEvent(dragEvent("drop", d));
        expect(onEventMove).toHaveBeenCalledWith(evs[0], "2026-01-09");
    });

    test("§8.40 Alt+Arrow on a focused event moves it a day / a week; a disabled day refuses", async () => {
        const onEventMove = vi.fn();
        build({ ...base, events: evs, onEventMove }, true);
        await flush();
        const el = document.querySelector("[data-event-open]")!;
        key(el, { key: "ArrowRight", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-07");
        key(el, { key: "ArrowDown", altKey: true });
        expect(onEventMove).toHaveBeenLastCalledWith(evs[0], "2026-01-13");
        document.body.innerHTML = "";
        const refused = vi.fn();
        build({ ...base, events: evs, onEventMove: refused, minDate: "2026-01-07" }, true);
        await flush();
        key(document.querySelector("[data-event-open]")!, { key: "ArrowLeft", altKey: true });
        expect(refused).not.toHaveBeenCalled();
    });

    test("§8.42 labels.periodTitle renders the shown period's title and updates on navigation", async () => {
        build({ view: "month", anchorDate: "2026-01-15", labels: { ...LABELS, periodTitle: (v: string, s: string, e: string) => `${v}:${s}..${e}` } });
        await flush();
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-01-01..2026-01-31");
        click(byName("Next month"));
        await flush();
        expect(document.querySelector(".calendar-view-title")!.textContent).toBe("month:2026-02-01..2026-02-28");
    });

    test("§8.44 hideOutsideDays leaves outside cells empty but in the grid", async () => {
        build({ view: "month", anchorDate: "2026-01-15", hideOutsideDays: true });
        await flush();
        expect(document.querySelector<HTMLElement>(".calendar-table-td[data-outside-period]")!.textContent!.trim()).toBe("");
        expect(cell("2026-01-15").textContent!.trim()).toBe("15");
        expect(cells()).toHaveLength(42);
    });

    test("§8.46 weekendDays marks those weekdays with data-weekend", async () => {
        build({ view: "week", anchorDate: "2026-01-06", weekendDays: [0, 6] });
        await flush();
        expect(cell("2026-01-10").hasAttribute("data-weekend")).toBe(true);
        expect(cell("2026-01-11").hasAttribute("data-weekend")).toBe(true);
        expect(cell("2026-01-07").hasAttribute("data-weekend")).toBe(false);
    });

    test("§8.48 multiple selection toggles days and Enter toggles the cursor day", async () => {
        const onDayClick = vi.fn();
        build({ view: "week", anchorDate: "2026-01-06", selectionMode: "multiple", onDayClick });
        await flush();
        click(cell("2026-01-06"));
        click(cell("2026-01-08"));
        await flush();
        expect(cell("2026-01-06").hasAttribute("data-selected")).toBe(true);
        expect(cell("2026-01-08").hasAttribute("data-selected")).toBe(true);
        click(cell("2026-01-06"));
        await flush();
        expect(cell("2026-01-06").hasAttribute("data-selected")).toBe(false);
        key(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "Enter" });
        expect(onDayClick).toHaveBeenLastCalledWith("2026-01-06");
    });
});

describe("CalendarView — agenda view", () => {
    const AGENDA_EVENTS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Single-day" },
        { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Multi-day" },
    ];
    const agendaProps = { label: "Agenda", view: "agenda" as const, anchorDate: "2026-01-15", events: AGENDA_EVENTS, today: "2026-01-09" };
    const mounted: VueWrapper[] = [];
    const make = (props: Record<string, unknown> = {}) => {
        const w = mount(CalendarView, { props: { ...agendaProps, ...props }, attachTo: document.body });
        mounted.push(w);
        return w;
    };
    afterEach(() => {
        while (mounted.length) mounted.pop()!.unmount();
        document.body.innerHTML = "";
    });

    test("lists only the days with events, as an ordered list of <time> headings", () => {
        make({ labels: LABELS });
        const items = Array.from(document.querySelectorAll(".calendar-view-agenda-day"));
        expect(items.map((li) => li.getAttribute("data-date"))).toEqual(["2026-01-06", "2026-01-09", "2026-01-10", "2026-01-11"]);
        expect(document.querySelector("ol.calendar-view-agenda")!.getAttribute("aria-label")).toBe("Agenda");
        expect(items[0].querySelector("time")!.getAttribute("datetime")).toBe("2026-01-06");
        expect(document.querySelector(".calendar-view-table")).toBeNull();
    });

    test("agendaEmptyDays lists every day of the month", () => {
        make({ agendaEmptyDays: true });
        expect(document.querySelectorAll(".calendar-view-agenda-day")).toHaveLength(31);
    });

    test("each event is a button that fires onEventClick; today carries aria-current", () => {
        const onEventClick = vi.fn();
        make({ onEventClick });
        (Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Single-day") as HTMLButtonElement).click();
        expect(onEventClick).toHaveBeenCalledWith(AGENDA_EVENTS[0]);
        expect(document.querySelector('[data-date="2026-01-09"]')!.getAttribute("aria-current")).toBe("date");
    });

    test("agendaEmpty shows for an empty month; the switcher selects the view; next steps a month", async () => {
        const w = make({ events: [], labels: { ...LABELS, agendaView: "Agenda", agendaEmpty: "Nothing this month" } });
        expect(document.querySelector(".calendar-view-agenda-empty")!.textContent).toBe("Nothing this month");
        const agenda = Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Agenda") as HTMLButtonElement;
        expect(agenda.getAttribute("aria-pressed")).toBe("true");
        (document.querySelector(".calendar-view-next-button") as HTMLButtonElement).click();
        await nextTick();
        expect(w.emitted("navigate")!.at(-1)).toEqual(["agenda", "2026-02-01", "2026-02-28"]);
    });

    test("periodRange treats agenda as the month; periodDays is empty", () => {
        expect(periodRange("agenda", "2026-01-15", 0)).toEqual(["2026-01-01", "2026-01-31"]);
        expect(periodDays("agenda", "2026-01-15", 0)).toEqual([]);
    });
});
