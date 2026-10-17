import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import "@lilydesignsystem/html-date-time-picker";
import { CalendarView } from "./calendar-view.js";
import type { CalendarEvent, CalendarViewLabels } from "./calendar-view.js";

if (typeof customElements !== "undefined" && !customElements.get("calendar-view")) customElements.define("calendar-view", CalendarView);

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LABELS: CalendarViewLabels = {
    weekView: "Week",
    monthView: "Month",
    agendaView: "Agenda",
    previous: (view) => `Previous ${view}`,
    next: (view) => `Next ${view}`,
    today: "Today",
    periodAnnouncement: (view, start, end) => `${view}: ${start} to ${end}`,
    rangeLimit: (limit, date) => `Stopped at the ${limit} date ${date}`,
    weekday: (wd) => WEEKDAYS[wd],
    weekdayAbbr: (wd) => WEEKDAYS[wd].slice(0, 3),
    day: (iso, wd, outside) => `${Number(iso.slice(8))}, ${WEEKDAYS[wd]}${outside ? " (outside)" : ""}`,
    search: "Search events",
    searchAnnouncement: (m, t) => `${m} of ${t} events`,
    copy: "Copy",
    copyAnnouncement: (n) => `${n} rows copied`,
    copyFailed: "Copy failed",
    exportHeaders: { title: "Title", start: "From", end: "To" },
    undoAnnouncement: (_e, f, t) => `Undid ${f}: ${t}`,
    redoAnnouncement: (_e, f, t) => `Redid ${f}: ${t}`,
};
const EVENTS: CalendarEvent[] = [
    { id: "e1", date: "2026-01-06", title: "Design review", values: { room: "Aspen" } },
    { id: "e2", date: "2026-01-07", title: "Café meetup" },
    { id: "e3", date: "2026-01-08", title: "Write docs" },
];

function mount(attrs: Record<string, string> = {}, props: Record<string, unknown> = {}): CalendarView {
    const el = document.createElement("calendar-view") as CalendarView;
    el.setAttribute("label", "Cal");
    el.setAttribute("view", "agenda");
    el.setAttribute("anchor-date", "2026-01-06");
    el.setAttribute("today", "2026-01-08");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    el.labels = (props.labels as CalendarViewLabels) ?? LABELS;
    el.events = (props.events as CalendarEvent[]) ?? EVENTS;
    for (const [k, v] of Object.entries(props)) if (!["labels", "events"].includes(k)) (el as never as Record<string, unknown>)[k] = v;
    return el;
}
const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));
const keys = () => Array.from(new Set(q("[data-event-key]").map((e) => e.getAttribute("data-event-key"))));
const status = () => document.querySelector(".calendar-view-status")?.textContent;
const search = () => document.querySelector<HTMLInputElement>(".calendar-view-search")!;
const type = (value: string) => {
    search().value = value;
    search().dispatchEvent(new Event("input", { bubbles: true }));
};
const press = (el: Element, key: string, opts: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
const flush = () => new Promise((r) => setTimeout(r, 0));
const next = () => document.querySelector<HTMLElement>(".calendar-view-next-button")!;
const prev = () => document.querySelector<HTMLElement>(".calendar-view-previous-button")!;

beforeEach(() => document.body.replaceChildren());
afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute("dir");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("search", () => {
    test("§8.83 the field renders only when labels.search names it, with the headless search-input class", () => {
        mount({}, { labels: { ...LABELS, search: undefined } });
        expect(search()).toBeFalsy();
        document.body.replaceChildren();
        mount();
        expect(search().classList.contains("search-input")).toBe(true);
    });
    test("§8.84 every word must appear, in any order, ignoring case and diacritics; field text is searched", () => {
        mount({}, { eventFields: [{ id: "room", header: "Room" }] });
        type("REVIEW design");
        expect(keys()).toEqual(["e1"]);
        type("cafe");
        expect(keys()).toEqual(["e2"]);
        type("aspen");
        expect(keys()).toEqual(["e1"]);
    });
    test("§8.86 the agenda wraps matches in <mark class=calendar-view-match>, only while searching", () => {
        mount();
        expect(q(".calendar-view-match")).toHaveLength(0);
        type("docs");
        const mark = document.querySelector<HTMLElement>("mark.calendar-view-match")!;
        expect(mark.textContent?.toLowerCase()).toBe("docs");
        expect(mark.classList.contains("mark")).toBe(true);
    });
    test("§8.89 the result count is announced and Escape clears the search", () => {
        mount();
        type("docs");
        expect(status()).toBe("1 of 3 events");
        press(search(), "Escape");
        expect(document.querySelector<CalendarView>("calendar-view")!.search).toBe("");
        expect(keys()).toHaveLength(3);
    });
    test("filter and eventCompare narrow and order the events", () => {
        const sameDay: CalendarEvent[] = [
            { id: "a", date: "2026-01-06", title: "A" },
            { id: "b", date: "2026-01-06", title: "B" },
            { id: "c", date: "2026-01-06", title: "C" },
        ];
        mount({}, { events: sameDay, filter: (e: CalendarEvent) => e.id !== "b", eventCompare: (a: CalendarEvent, b: CalendarEvent) => b.id.localeCompare(a.id) });
        expect(keys()).toEqual(["c", "a"]);
    });
});

describe("period announcements and minDate / maxDate limits", () => {
    test("§8.93 the first render announces nothing; §8.94 Next announces the new period", () => {
        mount({ view: "month", "anchor-date": "2026-02-15" });
        expect(status()).toBe("");
        next().click();
        expect(status()).toBe("month: 2026-03-01 to 2026-03-31");
    });
    test("§8.97 a consumer changing anchor-date is announced too, not only a click", () => {
        const el = mount({ view: "month", "anchor-date": "2026-02-15" });
        el.setAttribute("anchor-date", "2026-05-15");
        expect(status()).toBe("month: 2026-05-01 to 2026-05-31");
    });
    test("§8.98 Previous stops at minDate: aria-disabled, still focusable, announced, and the period does not change", () => {
        mount({ view: "month", "anchor-date": "2026-02-15", "min-date": "2026-02-05" });
        expect(prev().getAttribute("aria-disabled")).toBe("true");
        expect((prev() as HTMLButtonElement).disabled).toBe(false);
        prev().click();
        expect(status()).toBe("Stopped at the min date 2026-02-05");
        expect(document.querySelector<CalendarView>("calendar-view")!.anchorDate).toBe("2026-02-15");
    });
    test("§8.100 Next stops at maxDate in the same way", () => {
        mount({ view: "month", "anchor-date": "2026-02-15", "max-date": "2026-02-20" });
        expect(next().getAttribute("aria-disabled")).toBe("true");
        next().click();
        expect(status()).toBe("Stopped at the max date 2026-02-20");
    });
    test("§8.102 a keyboard move past maxDate is clamped and announced", () => {
        mount({ view: "week", "anchor-date": "2026-01-06", "max-date": "2026-01-08", today: "2026-01-07" });
        for (let i = 0; i < 3; i++) press(document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!, "ArrowRight");
        expect(document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!.getAttribute("data-date")).toBe("2026-01-08");
        expect(status()).toBe("Stopped at the max date 2026-01-08");
    });
});

describe("copy to clipboard", () => {
    test("§8.113 copy puts the period's events on the clipboard (header first, tab-separated) and announces; onCopy can take over", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        mount();
        document.querySelector<HTMLElement>('[data-calendar-export-format="copy"]')!.click();
        await flush();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Title\tFrom\tTo");
        expect(status()).toBe("3 rows copied");
        document.body.replaceChildren();
        const onCopy = vi.fn(() => false);
        writeText.mockClear();
        mount({}, { onCopy });
        document.querySelector<HTMLElement>('[data-calendar-export-format="copy"]')!.click();
        await flush();
        expect(onCopy).toHaveBeenCalled();
        expect(writeText).not.toHaveBeenCalled();
    });
});

describe("in-place edit: validate, undo, redo", () => {
    const fields = [{ id: "cost", header: "Cost", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "must not be negative" : undefined) }];
    const events: CalendarEvent[] = [{ id: "e1", date: "2026-01-06", title: "Standup", values: { cost: 3 } }];
    function edit(value: string): void {
        document.querySelector<HTMLElement>(".calendar-view-field-button")!.click();
        const field = document.querySelector<HTMLInputElement>(".calendar-view-field-editor")!;
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        press(field, "Enter");
    }
    test("§8.115 a value validate refuses keeps the editor open, aria-invalid", () => {
        mount({}, { events, eventFields: fields, onFieldEdit: vi.fn() });
        edit("-1");
        expect(document.querySelector(".calendar-view-field-editor")!.getAttribute("aria-invalid")).toBe("true");
    });
    test("§8.117 Ctrl+Z reports the earlier value through onFieldEdit; Ctrl+Shift+Z redoes", () => {
        const onFieldEdit = vi.fn();
        mount({}, { events, eventFields: fields, onFieldEdit });
        edit("9");
        press(document.querySelector<HTMLElement>(".calendar-view-agenda")!, "z", { ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 3, previous: 9 });
        expect(status()).toBe("Undid Cost: 3");
        press(document.querySelector<HTMLElement>(".calendar-view-agenda")!, "z", { ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ eventId: "e1", fieldId: "cost", value: 9, previous: 3 });
    });
});

describe("weekend, holiday and time-off indicators; agenda on a narrow screen; right-to-left", () => {
    test("§8.123 a marked range's label is real text and the cell's description", () => {
        mount({ view: "month", "anchor-date": "2026-01-15" }, { ranges: [{ start: "2026-01-06", end: "2026-01-06", kind: "holiday", label: "Epiphany" }], events: [] });
        const cell = document.querySelector<HTMLElement>('.calendar-table-td[data-date="2026-01-06"]')!;
        expect(cell.querySelector(".calendar-view-range-label")!.textContent).toBe("Epiphany");
        const id = cell.getAttribute("aria-describedby")!;
        expect(document.getElementById(id)!.textContent).toBe("Epiphany");
    });
    test("§8.125 weekday headers carry data-weekend", () => {
        mount({ view: "week" }, { weekendDays: [0, 6] });
        expect(q(".calendar-table-head th[data-weekend]")).toHaveLength(2);
    });
    test("§8.134 agenda-below shows the agenda on a narrow screen and the view again when it is wider; a picked view is respected", () => {
        let listener: (() => void) | undefined;
        const query = { matches: true, addEventListener: (_n: string, l: () => void) => (listener = l), removeEventListener: () => {} };
        vi.stubGlobal("matchMedia", () => query);
        mount({ view: "month", "agenda-below": "640" });
        expect(document.querySelector(".calendar-view-agenda")).toBeTruthy();
        query.matches = false;
        listener?.();
        expect(document.querySelector(".calendar-view-agenda")).toBeNull();
        query.matches = true;
        listener?.();
        expect(document.querySelector(".calendar-view-agenda")).toBeTruthy();
        document.querySelector<HTMLElement>(".calendar-view-switcher-button-month")!.click();
        expect(document.querySelector(".calendar-view-agenda")).toBeNull();
    });
    test("§8.138 no-agenda-date hides the date visually but keeps it in the page", () => {
        mount({ "no-agenda-date": "" });
        const time = document.querySelector<HTMLElement>(".calendar-view-agenda-date")!;
        expect(time.hasAttribute("data-visually-hidden")).toBe(true);
        expect(time.getAttribute("datetime")).toBeTruthy();
    });
    test("§8.141 right-to-left: ArrowLeft goes to the next day", () => {
        document.documentElement.setAttribute("dir", "rtl");
        mount({ view: "week", "anchor-date": "2026-01-06", today: "2026-01-07" });
        const start = document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!;
        press(start, "ArrowLeft");
        expect(document.querySelector<HTMLElement>('.calendar-table-td[tabindex="0"]')!.getAttribute("data-date")).toBe("2026-01-07");
    });
});
