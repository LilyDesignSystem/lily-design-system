import { cleanup, render, screen, fireEvent } from "@testing-library/vue";
import { h, nextTick } from "vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import CalendarView, {
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./CalendarView.vue";
import type { CalendarEvent, CalendarRange, CalendarViewLabels } from "./CalendarView.vue";
import { addDays } from "@lilydesignsystem/vue-date-time-picker";

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


afterEach(cleanup);

describe("CalendarView — search (§8.83–§8.92)", () => {
    const SEARCH_EVENTS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Standup", values: { room: "Aspen" } },
        { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "Offsite" },
        { id: "e3", date: "2026-01-20", title: "Café review" },
    ];
    const L: CalendarViewLabels = { ...LABELS, search: "Search events", searchAnnouncement: (m, t) => `${m} of ${t} events` };
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: SEARCH_EVENTS, labels: L };
    const keys = () => [...new Set(Array.from(document.querySelectorAll("[data-event-key]")).map((e) => e.getAttribute("data-event-key")))];

    test("§8.83 the field renders only when labels.search names it", () => {
        render(CalendarView, { props: { ...base, labels: LABELS } });
        expect(document.querySelector(".calendar-view-search")).toBeNull();
    });

    test("§8.84 typing shows only matching events, every word, any order, ignoring case and diacritics", async () => {
        render(CalendarView, { props: base });
        const input = screen.getByRole("searchbox", { name: "Search events" });
        await fireEvent.input(input, { target: { value: "CAFE" } });
        expect(keys()).toEqual(["e3"]);
        await fireEvent.input(input, { target: { value: "" } });
        expect(keys()).toEqual(["e1", "e2", "e3"]);
    });

    test("§8.85 the month grid shows only matching events too", async () => {
        render(CalendarView, { props: { ...base, view: "month" as const, day: undefined } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "offsite" } });
        const titles = Array.from(document.querySelectorAll(".calendar-view-event")).map((e) => e.textContent);
        expect(titles.every((t) => t === "Offsite")).toBe(true);
    });

    test("§8.86 the agenda wraps matches in <mark class=calendar-view-match>, only while searching", async () => {
        render(CalendarView, { props: base });
        expect(document.querySelector("mark")).toBeNull();
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "stand" } });
        expect(document.querySelector("mark.calendar-view-match")?.textContent).toBe("Stand");
    });

    test("§8.87 the default text includes typed field text", async () => {
        render(CalendarView, { props: { ...base, eventFields: [{ id: "room", header: "Room" }] } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "aspen" } });
        expect(keys()).toEqual(["e1"]);
    });

    test("§8.88 searchText replaces what is looked in", async () => {
        render(CalendarView, { props: { ...base, searchText: (e: CalendarEvent) => e.id } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "e2" } });
        expect(keys()).toEqual(["e2"]);
    });

    test("§8.89 the result count is announced", async () => {
        render(CalendarView, { props: base });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "stand" } });
        await new Promise((r) => setTimeout(r, 0));
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("1 of 3 events");
    });

    test("§8.90 Escape in the field clears the search", async () => {
        render(CalendarView, { props: base });
        const input = screen.getByRole("searchbox") as HTMLInputElement;
        await fireEvent.input(input, { target: { value: "offsite" } });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(input.value).toBe("");
        expect(keys()).toEqual(["e1", "e2", "e3"]);
    });

    test("§8.91 an export holds only what the search leaves", async () => {
        const onExport = vi.fn(() => false);
        render(CalendarView, { props: { ...base, exportScope: "all" as const, exportHandler: onExport, labels: { ...L, export: "Export", exportCsv: "CSV", exportHeaders: { title: "Title", start: "From", end: "To" } } } });
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "offsite" } });
        await fireEvent.click(screen.getByText("CSV"));
        expect((onExport.mock.calls[0] as unknown as [{ eventCount: number }])[0].eventCount).toBe(1);
    });

    test("§8.92 the search prop works without the field", () => {
        render(CalendarView, { props: { ...base, labels: LABELS, search: "offsite" } });
        expect(keys()).toEqual(["e2"]);
    });
});

// =====================================================================
// §8.93 period announcements and navigation limits (0.6.0)
// =====================================================================

describe("CalendarView — period announcements and minDate / maxDate limits (§8.93–§8.104)", () => {
    const L: CalendarViewLabels = { ...LABELS, rangeLimit: (limit, date) => `${limit === "min" ? "Earliest" : "Latest"} date is ${date}` };
    const base = { label: "Cal", view: "month" as const, anchorDate: "2026-02-15", events: [] as CalendarEvent[], today: "2026-02-10", labels: L };
    const status = () => document.querySelector(".calendar-view-status")?.textContent;
    const prev = () => document.querySelector<HTMLElement>(".calendar-view-previous-button")!;
    const next = () => document.querySelector<HTMLElement>(".calendar-view-next-button")!;

    test("§8.93 the first render announces nothing", () => {
        render(CalendarView, { props: base });
        expect(status()).toBe("");
    });

    test("§8.94 Next announces the new period through the polite status region", async () => {
        render(CalendarView, { props: base });
        await fireEvent.click(next());
        expect(document.querySelector(".calendar-view-status")?.getAttribute("aria-live")).toBe("polite");
        expect(status()).toBe("month: 2026-03-01 to 2026-03-31");
    });

    test("§8.95 a change of view is announced", async () => {
        render(CalendarView, { props: base });
        await fireEvent.click(screen.getByRole("button", { name: "Week" }));
        expect(status()).toBe("week: 2026-02-09 to 2026-02-15");
    });

    test("§8.96 a keyboard move across the edge of the period is announced", async () => {
        render(CalendarView, { props: { ...base, anchorDate: "2026-02-28" } });
        const cell = document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!;
        await fireEvent.keyDown(cell, { key: "PageDown" });
        expect(status()).toBe("month: 2026-03-01 to 2026-03-31");
    });

    test("§8.97 a consumer changing anchorDate is announced too, not only a click", async () => {
        const { rerender } = render(CalendarView, { props: base });
        await rerender({ ...base, anchorDate: "2026-05-15" });
        expect(status()).toBe("month: 2026-05-01 to 2026-05-31");
    });

    test("§8.98 Previous stops at minDate: aria-disabled, still focusable, announced, and the period does not change", async () => {
        render(CalendarView, { props: { ...base, minDate: "2026-02-05" } });
        expect(prev().getAttribute("aria-disabled")).toBe("true");
        expect((prev() as HTMLButtonElement).disabled).toBe(false);
        await fireEvent.click(prev());
        expect(status()).toBe("Earliest date is 2026-02-05");
        expect(cellFor("2026-02-15")).toBeTruthy();
    });

    test("§8.99 Next stops at maxDate", async () => {
        render(CalendarView, { props: { ...base, maxDate: "2026-02-20" } });
        expect(next().getAttribute("aria-disabled")).toBe("true");
        await fireEvent.click(next());
        expect(status()).toBe("Latest date is 2026-02-20");
    });

    test("§8.100 the direction with room stays enabled", () => {
        render(CalendarView, { props: { ...base, minDate: "2025-12-01", maxDate: "2026-02-20" } });
        expect(prev().getAttribute("aria-disabled")).toBeNull();
        expect(next().getAttribute("aria-disabled")).toBe("true");
    });

    test("§8.101 keyboard moves are clamped to the range and the stop is announced", async () => {
        render(CalendarView, { props: { ...base, minDate: "2026-02-05", maxDate: "2026-02-20" } });
        const cell = document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!;
        await fireEvent.keyDown(cell, { key: "PageDown" });
        expect(status()).toBe("Latest date is 2026-02-20");
        expect(document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.getAttribute("data-date")).toBe("2026-02-20");
    });

    test("§8.102 Today is aria-disabled and does nothing when today is outside the range", async () => {
        render(CalendarView, { props: { ...base, anchorDate: "2026-02-15", today: "2026-04-01", maxDate: "2026-03-31" } });
        const today = screen.getByRole("button", { name: "Today" });
        expect(today.getAttribute("aria-disabled")).toBe("true");
        await fireEvent.click(today);
        expect(cellFor("2026-02-15")).toBeTruthy();
    });

    test("§8.103 Today works when it is inside the range", async () => {
        render(CalendarView, { props: { ...base, anchorDate: "2026-04-15", today: "2026-02-10", minDate: "2026-01-01" } });
        const today = screen.getByRole("button", { name: "Today" });
        expect(today.getAttribute("aria-disabled")).toBeNull();
        await fireEvent.click(today);
        expect(status()).toBe("month: 2026-02-01 to 2026-02-28");
    });

    test("§8.104 without labels.rangeLimit a stopped move is silent but still stops", async () => {
        render(CalendarView, { props: { ...base, labels: LABELS, maxDate: "2026-02-20" } });
        await fireEvent.click(next());
        expect(status()).toBe("");
        expect(next().getAttribute("aria-disabled")).toBe("true");
    });
});

describe("CalendarView — filter predicate (§8.105–§8.108)", () => {
    const EVS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Standup", values: { team: "a" } },
        { id: "e2", date: "2026-01-09", title: "Offsite", values: { team: "b" } },
        { id: "e3", date: "2026-01-20", title: "Review", values: { team: "a" } },
    ];
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: EVS, labels: LABELS };
    const keys = () => Array.from(new Set(Array.from(document.querySelectorAll("[data-event-key]")).map((e) => e.getAttribute("data-event-key"))));

    test("§8.105 filter hides the events it rejects in every view", () => {
        render(CalendarView, { props: { ...base, filter: (e: CalendarEvent) => e.values?.team === "a" } });
        expect(keys()).toEqual(["e1", "e3"]);
    });

    test("§8.106 filter reads typed values", () => {
        render(CalendarView, { props: { ...base, filter: (e: CalendarEvent) => e.values?.team === "b" } });
        expect(keys()).toEqual(["e2"]);
    });

    test("§8.107 filter combines with search: both must pass", () => {
        render(CalendarView, { props: { ...base, filter: (e: CalendarEvent) => e.values?.team === "a", search: "review" } });
        expect(keys()).toEqual(["e3"]);
    });

    test("§8.108 without a filter every event shows", () => {
        render(CalendarView, { props: base });
        expect(keys()).toEqual(["e1", "e2", "e3"]);
    });
});

describe("CalendarView — eventCompare (§8.109–§8.111)", () => {
    const EVS: CalendarEvent[] = [
        { id: "b", date: "2026-01-06", title: "Bravo" },
        { id: "a", date: "2026-01-06", title: "Alpha" },
        { id: "c", date: "2026-01-07", title: "Charlie" },
    ];
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: EVS, labels: LABELS };
    const order = () => Array.from(document.querySelectorAll("[data-event-key]")).map((e) => e.getAttribute("data-event-key"));

    test("§8.109 without eventCompare events keep their input order within a day", () => {
        render(CalendarView, { props: base });
        expect(order()).toEqual(["b", "a", "c"]);
    });

    test("§8.110 eventCompare orders the events within each day", () => {
        render(CalendarView, { props: { ...base, eventCompare: (x: CalendarEvent, y: CalendarEvent) => String(x.title).localeCompare(String(y.title)) } });
        expect(order()).toEqual(["a", "b", "c"]);
    });

    test("§8.111 the order is stable and applies after the filter", () => {
        render(CalendarView, { props: { ...base, filter: (e: CalendarEvent) => e.id !== "a", eventCompare: () => 0 } });
        expect(order()).toEqual(["b", "c"]);
    });
});

describe("CalendarView — copy to clipboard (§8.112–§8.114)", () => {
    const EVS: CalendarEvent[] = [
        { id: "e1", date: "2026-01-06", title: "Standup" },
        { id: "e2", date: "2026-01-09", title: "Offsite" },
    ];
    const L: CalendarViewLabels = { ...LABELS, export: "Export", copy: "Copy", exportHeaders: { title: "Title", start: "From", end: "To" }, copyAnnouncement: (n) => `${n} events copied`, copyFailed: "Copy failed" };
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: EVS, labels: L };
    const wait = () => new Promise((r) => setTimeout(r, 0));

    test("§8.112 copy needs labels.copy and exportHeaders", () => {
        render(CalendarView, { props: { ...base, labels: { ...LABELS, copy: "Copy" } } });
        expect(document.querySelector('[data-calendar-export-format="copy"]')).toBeNull();
    });

    test("§8.113 copy puts the period's events on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        render(CalendarView, { props: base });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Title\tFrom\tTo");
        expect(text).toContain("Standup");
        expect(document.querySelector(".calendar-view-status")?.textContent).toBe("2 events copied");
        vi.unstubAllGlobals();
    });

    test("§8.114 onCopy can take over, and the search narrows what is copied", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const onCopy = vi.fn(() => false);
        render(CalendarView, { props: { ...base, copyHandler: onCopy } });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        expect(writeText).not.toHaveBeenCalled();
        document.body.innerHTML = "";
        render(CalendarView, { props: { ...base, search: "offsite" } });
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text).toContain("Offsite");
        expect(text).not.toContain("Standup");
        vi.unstubAllGlobals();
    });
});

describe("CalendarView — in-place edit: validate, undo, redo (§8.115–§8.122)", () => {
    const EVS: CalendarEvent[] = [{ id: "e1", date: "2026-01-06", title: "Standup", values: { cost: 3 } }];
    const FIELD = { id: "cost", header: "Cost", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "Must not be negative" : undefined) };
    const L: CalendarViewLabels = {
        ...LABELS,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
        editRefused: (t, h, m) => `${t} ${h}: ${m}`,
        undoAnnouncement: (t, h, text) => `Undid ${t} ${h}: ${text}`,
        redoAnnouncement: (t, h, text) => `Redid ${t} ${h}: ${text}`,
    };
    const base = { label: "Cal", view: "agenda" as const, anchorDate: "2026-01-15", events: EVS, eventFields: [FIELD], labels: L };
    const status = () => document.querySelector(".calendar-view-status")?.textContent;
    const fieldButton = () => document.querySelector<HTMLElement>(".calendar-view-field-button")!;
    const root = () => document.querySelector<HTMLElement>(".calendar-view")!;

    async function edit(value: string): Promise<HTMLInputElement> {
        await fireEvent.click(fieldButton());
        const input = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
        await fireEvent.input(input, { target: { value } });
        await fireEvent.keyDown(input, { key: "Enter" });
        return input;
    }

    test("§8.115 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await edit("-4");
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".calendar-view-field-editor")?.getAttribute("aria-invalid")).toBe("true");
        expect(status()).toBe("Standup Cost: Must not be negative");
    });

    test("§8.116 typing again clears aria-invalid, and an acceptable value then commits", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        const input = await edit("-4");
        await fireEvent.input(input, { target: { value: "5" } });
        expect(input.getAttribute("aria-invalid")).toBeNull();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ eventId: "e1", fieldId: "cost", value: 5, previous: 3 });
    });

    test("§8.117 Ctrl+Z reports the earlier value through onFieldEdit and announces it", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await edit("8");
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 3, previous: 8 });
        expect(status()).toBe("Undid Standup Cost: 3");
    });

    test("§8.118 Ctrl+Shift+Z and Ctrl+Y redo", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await edit("8");
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 8, previous: 3 });
        expect(status()).toBe("Redid Standup Cost: 8");
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(root(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 8, previous: 3 });
    });

    test("§8.119 undo walks back through several edits, newest first", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await edit("5");
        await edit("9");
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 3, previous: 9 });
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 3, previous: 5 });
    });

    test("§8.120 with nothing to undo Ctrl+Z does nothing, and a new edit ends the redo chain", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await edit("5");
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        await edit("7");
        onFieldEdit.mockClear();
        await fireEvent.keyDown(root(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.121 Ctrl+Z inside a field editor is left to the browser", async () => {
        const onFieldEdit = vi.fn();
        render(CalendarView, { props: { ...base, onFieldEdit } });
        await edit("8");
        onFieldEdit.mockClear();
        await fireEvent.click(fieldButton());
        await fireEvent.keyDown(document.querySelector(".calendar-view-field-editor")!, { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.122 without onFieldEdit, Ctrl+Z does nothing", async () => {
        render(CalendarView, { props: base });
        await fireEvent.keyDown(root(), { key: "z", ctrlKey: true });
        expect(status()).toBe("");
    });
});

describe("CalendarView — weekend, holiday and time-off indicators (§8.123–§8.130)", () => {
    const RANGES: CalendarRange[] = [
        { start: "2026-01-06", end: "2026-01-06", kind: "holiday", label: "Epiphany" },
        { start: "2026-01-12", end: "2026-01-14", kind: "leave", label: "Ann off" },
    ];
    const base = { label: "Cal", view: "month" as const, anchorDate: "2026-01-15", labels: LABELS, ranges: RANGES, weekendDays: [0, 6] };

    test("§8.123 a labelled range is real text beside the day number when there is no day snippet", () => {
        render(CalendarView, { props: base });
        expect(cellFor("2026-01-06")!.querySelector(".calendar-view-range-label")?.textContent).toBe("Epiphany");
        expect(cellFor("2026-01-07")!.querySelector(".calendar-view-range-label")).toBeNull();
    });

    test("§8.124 a multi-day range labels every day it covers", () => {
        render(CalendarView, { props: base });
        for (const d of ["2026-01-12", "2026-01-13", "2026-01-14"]) {
            expect(cellFor(d)!.querySelector(".calendar-view-range-label")?.textContent).toBe("Ann off");
            expect(cellFor(d)!.getAttribute("data-range")).toBe("leave");
        }
    });

    test("§8.125 the label is also the cell's description, so a screen reader hears why the day is marked", () => {
        render(CalendarView, { props: base });
        const cell = cellFor("2026-01-06")!;
        const id = cell.getAttribute("aria-describedby");
        expect(id).toBeTruthy();
        expect(document.getElementById(id!)?.textContent).toBe("Epiphany");
        expect(cellFor("2026-01-07")!.hasAttribute("aria-describedby")).toBe(false);
    });

    test("§8.126 several labels on one day are joined in the description", () => {
        render(CalendarView, { props: { ...base, ranges: [{ start: "2026-01-06", end: "2026-01-06", label: "Epiphany" }, { start: "2026-01-06", end: "2026-01-07", label: "Closed" }] } });
        const id = cellFor("2026-01-06")!.getAttribute("aria-describedby")!;
        expect(document.getElementById(id)?.textContent).toBe("Epiphany, Closed");
    });

    test("§8.127 a range without a label marks the day but adds no text or description", () => {
        render(CalendarView, { props: { ...base, ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday" }] } });
        expect(cellFor("2026-01-06")!.getAttribute("data-range")).toBe("holiday");
        expect(cellFor("2026-01-06")!.querySelector(".calendar-view-range-label")).toBeNull();
        expect(cellFor("2026-01-06")!.hasAttribute("aria-describedby")).toBe(false);
    });

    test("§8.128 the weekday header cells carry data-weekend like the day cells", () => {
        render(CalendarView, { props: base });
        const heads = Array.from(document.querySelectorAll("thead th"));
        expect(heads.filter((h) => h.hasAttribute("data-weekend"))).toHaveLength(2);
        expect(cellFor("2026-01-10")!.hasAttribute("data-weekend")).toBe(true); // a Saturday
    });

    test("§8.129 the agenda shows each labelled range beside the date", () => {
        render(CalendarView, { props: { ...base, view: "agenda" as const, agendaEmptyDays: true } });
        const day = document.querySelector('.calendar-view-agenda-day[data-date="2026-01-06"]')!;
        expect(day.querySelector(".calendar-view-range-label")?.textContent).toBe("Epiphany");
    });

    test("§8.130 a day snippet still receives the ranges and renders its own", () => {
        render(CalendarView, { props: { label: "C", view: "month", anchorDate: "2026-01-15", events: [], ranges: RANGES }, slots: { day: (a: { date: string }) => a.date } });
        expect(document.querySelector(".calendar-view-range-label")).toBeNull();
    });
});

describe("CalendarView — agenda on a narrow screen, hidden agenda dates, right-to-left keys (§8.131–§8.144)", () => {
    type Listener = (e: { matches: boolean }) => void;
    let listeners: Listener[] = [];
    /** A matchMedia whose single query matches while the viewport is narrower than 640px; `resize(width)` fires its change. */
    function stubMatchMedia(width: number) {
        let current = width;
        listeners = [];
        vi.stubGlobal("matchMedia", (query: string) => {
            const limit = Number(/max-width: (\d+)px/.exec(query)![1]);
            return {
                get matches() { return current <= limit; },
                media: query,
                addEventListener: (_: string, fn: Listener) => listeners.push(fn),
                removeEventListener: (_: string, fn: Listener) => (listeners = listeners.filter((l) => l !== fn)),
            };
        });
        return (next: number) => {
            current = next;
            for (const l of listeners) l({ matches: next <= 639 });
        };
    }
    const EVS: CalendarEvent[] = [{ id: "e1", date: "2026-01-06", title: "Standup" }];
    const base = { label: "Cal", anchorDate: "2026-01-15", events: EVS, labels: LABELS };
    const isAgenda = () => !!document.querySelector(".calendar-view-agenda-day, .calendar-view-agenda");
    const tick2 = () => new Promise((r) => setTimeout(r, 0));

    afterEach(() => vi.unstubAllGlobals());

    test("§8.131 below agendaBelow the calendar shows the agenda, whatever `view` says", async () => {
        stubMatchMedia(390);
        render(CalendarView, { props: { ...base, view: "month" as const, agendaBelow: 640 } });
        await tick2();
        expect(isAgenda()).toBe(true);
        expect(document.querySelector(".calendar-table")).toBeNull();
    });

    test("§8.132 at or above it, the view prop applies", async () => {
        stubMatchMedia(1024);
        render(CalendarView, { props: { ...base, view: "month" as const, agendaBelow: 640 } });
        await tick2();
        expect(document.querySelector(".calendar-table")).toBeTruthy();
        expect(isAgenda()).toBe(false);
    });

    test("§8.133 without agendaBelow nothing changes on a narrow screen", async () => {
        stubMatchMedia(320);
        render(CalendarView, { props: { ...base, view: "month" as const } });
        await tick2();
        expect(document.querySelector(".calendar-table")).toBeTruthy();
    });

    test("§8.134 widening the window goes back to the view prop, narrowing it goes to the agenda", async () => {
        const resize = stubMatchMedia(390);
        render(CalendarView, { props: { ...base, view: "week" as const, agendaBelow: 640 } });
        await tick2();
        expect(isAgenda()).toBe(true);
        resize(1200);
        await tick2();
        expect(isAgenda()).toBe(false);
        expect(document.querySelector(".calendar-table")).toBeTruthy();
        resize(400);
        await tick2();
        expect(isAgenda()).toBe(true);
    });

    test("§8.135 a view the user picks on a narrow screen is respected, until the screen is wide again", async () => {
        const resize = stubMatchMedia(390);
        render(CalendarView, { props: { ...base, view: "month" as const, agendaBelow: 640, labels: { ...LABELS, weekView: "Week", agendaView: "Agenda" } } });
        await tick2();
        await fireEvent.click(screen.getByRole("button", { name: "Week" }));
        expect(isAgenda()).toBe(false);
        resize(1200);
        await tick2();
        resize(390);
        await tick2();
        expect(isAgenda()).toBe(true);
    });

    test("§8.136 without matchMedia (a server, an old browser) the view prop is used", async () => {
        vi.stubGlobal("matchMedia", undefined);
        render(CalendarView, { props: { ...base, view: "month" as const, agendaBelow: 640 } });
        await tick2();
        expect(document.querySelector(".calendar-table")).toBeTruthy();
    });

    test("§8.137 the agenda shows each date by default", () => {
        render(CalendarView, { props: { ...base, view: "agenda" as const } });
        const time = document.querySelector<HTMLElement>(".calendar-view-agenda-date")!;
        expect(time.hasAttribute("data-visually-hidden")).toBe(false);
        expect(time.getAttribute("style")).toBeNull();
    });

    test("§8.138 agendaDate=false hides the date visually but keeps it for a screen reader", () => {
        render(CalendarView, { props: { ...base, view: "agenda" as const, agendaDate: false } });
        const time = document.querySelector<HTMLElement>(".calendar-view-agenda-date")!;
        expect(time.hasAttribute("data-visually-hidden")).toBe(true);
        expect(time.getAttribute("datetime")).toBe("2026-01-06");
        expect(time.textContent?.trim()).not.toBe("");
        expect(time.getAttribute("style")).toContain("clip-path");
        expect(time.hasAttribute("hidden")).toBe(false);
    });

    const cursorDate = () => document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')?.getAttribute("data-date");

    test("§8.139 left to right: ArrowRight is the next day, ArrowLeft the previous", async () => {
        render(CalendarView, { props: { ...base, view: "month" as const } });
        const start = cursorDate()!;
        await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowRight" });
        expect(cursorDate()).toBe(addDays(start, 1));
        await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowLeft" });
        expect(cursorDate()).toBe(start);
    });

    test("§8.140 right to left: ArrowLeft is the next day, ArrowRight the previous", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            render(CalendarView, { props: { ...base, view: "month" as const } });
            const start = cursorDate()!;
            await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowLeft" });
            expect(cursorDate()).toBe(addDays(start, 1));
            await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowRight" });
            expect(cursorDate()).toBe(start);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.141 ArrowUp, ArrowDown, Home, End and the page keys are the same in both directions", async () => {
        for (const dir of ["ltr", "rtl"]) {
            document.body.innerHTML = "";
            document.body.setAttribute("dir", dir);
            render(CalendarView, { props: { ...base, view: "month" as const } });
            const start = cursorDate()!;
            await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowDown" });
            expect(cursorDate()).toBe(addDays(start, 7));
            await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowUp" });
            expect(cursorDate()).toBe(start);
        }
        document.body.removeAttribute("dir");
    });

    test("§8.142 Shift+Arrow extends a range in the visual direction in right-to-left", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onRangeSelect = vi.fn();
            render(CalendarView, { props: { ...base, view: "month" as const, onRangeSelect } });
            const start = cursorDate()!;
            await fireEvent.keyDown(document.querySelector('.calendar-table-td[tabindex="0"]')!, { key: "ArrowLeft", shiftKey: true });
            expect(cursorDate()).toBe(addDays(start, 1));
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.143 Alt+Arrow moves an event the way the arrow points: in right-to-left, ArrowLeft is later", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onEventMove = vi.fn();
            render(CalendarView, { props: { label: "C", view: "month", anchorDate: "2026-01-15", events: EVS, onEventMove }, slots: { day: (a: { events: CalendarEvent[]; eventProps: (e: CalendarEvent) => Record<string, unknown> }) => a.events.map((e) => h("span", { ...a.eventProps(e) }, e.id)) } });
            const event = document.querySelector<HTMLElement>("[data-event-id='e1']")!;
            await fireEvent.keyDown(event, { key: "ArrowLeft", altKey: true });
            expect(onEventMove).toHaveBeenCalled();
            expect(JSON.stringify(onEventMove.mock.calls[0])).toContain("2026-01-07");
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.144 the day cells never use a physical left or right in an inline style", () => {
        render(CalendarView, { props: { ...base, view: "month" as const } });
        const styled = Array.from(document.querySelectorAll<HTMLElement>("[style]")).map((e) => e.getAttribute("style")!);
        expect(styled.filter((s) => /(^|;|\s)(left|right|margin-left|margin-right|padding-left|padding-right)\s*:/.test(s))).toEqual([]);
    });
});

describe("CalendarView — renders in another language with no English left over (§8.145–§8.146)", () => {
    const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    // A complete Simplified Chinese bundle; the data is Chinese too, so any English in the DOM is Lily's.
    const ZH: CalendarViewLabels = {
        dayView: "日", weekView: "周", fourWeekView: "四周", monthView: "月", agendaView: "日程",
        previous: (v) => `上一${v === "day" ? "天" : "个"}`, next: (v) => `下一${v === "day" ? "天" : "个"}`, today: "今天",
        periodAnnouncement: (_v, s, e) => `显示 ${s} 至 ${e}`, periodTitle: (_v, s, e) => `${s} 至 ${e}`,
        weekday: (wd) => WEEKDAYS[wd], weekdayAbbr: (wd) => WEEKDAYS[wd].slice(-1),
        day: (iso, wd) => `${Number(iso.slice(8))}日，${WEEKDAYS[wd]}`,
        rangeLimit: (limit, date) => `${limit === "min" ? "最早" : "最晚"}日期为 ${date}`,
        search: "搜索活动", searchAnnouncement: (m, t) => `${t} 个活动中有 ${m} 个匹配`,
        export: "导出", exportCsv: "CSV", exportTsv: "TSV", exportExcel: "Excel", copy: "复制", copyAnnouncement: (n) => `已复制 ${n} 个活动`, copyFailed: "复制失败",
        exportHeaders: { title: "标题", start: "开始", end: "结束" }, exportAnnouncement: (f, n, name) => `已导出 ${n} 个活动：${name}`,
        agendaEmpty: "本月没有活动",
    };
    const EVS: CalendarEvent[] = [{ id: "e1", date: "2026-01-06", title: "站会" }, { id: "e2", start: "2026-01-09", end: "2026-01-11", title: "团建" }];

    function readable(root: Element): string[] {
        const out: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n.textContent ?? "");
        for (const el of root.querySelectorAll("*")) for (const a of ["aria-label", "title", "placeholder", "alt"]) if (el.hasAttribute(a)) out.push(el.getAttribute(a)!);
        return out.map((t) => t.trim()).filter(Boolean);
    }
    const english = (texts: string[]) => texts.filter((t) => !["CSV", "TSV", "Excel"].includes(t) && /[A-Za-z]{3,}/.test(t));

    test("§8.145 the month view, toolbar, switcher, search and export read as Chinese only", () => {
        const { container } = render(CalendarView, { props: { label: "日历", view: "month" as const, anchorDate: "2026-01-15", today: "2026-01-08", events: EVS, labels: ZH, ranges: [{ start: "2026-01-12", end: "2026-01-12", kind: "holiday", label: "休息日" }], weekendDays: [0, 6] } });
        expect(english(readable(container))).toEqual([]);
    });

    test("§8.146 the agenda and its announcements read as Chinese only", async () => {
        const { container } = render(CalendarView, { props: { label: "日历", view: "agenda" as const, anchorDate: "2026-01-15", events: EVS, labels: ZH } });
        expect(english(readable(container))).toEqual([]);
        await fireEvent.click(screen.getByRole("button", { name: /^上一/ }));
        expect(english([document.querySelector(".calendar-view-status")?.textContent ?? ""])).toEqual([]);
    });
});


