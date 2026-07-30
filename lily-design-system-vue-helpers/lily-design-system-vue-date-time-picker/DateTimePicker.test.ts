import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { h, nextTick } from "vue";

import DateTimePicker, {
    addDays,
    addMonths,
    daysInMonth,
    firstDayOfWeekFor,
    formatIsoDate,
    fromEpochDay,
    isoWeek,
    joinValue,
    monthMatrix,
    parseDateInput,
    parseIsoDate,
    parseTimeInput,
    splitValue,
    toEpochDay,
    weekdayOf,
} from "./DateTimePicker.vue";

/**
 * The six required strings. Deliberately not English-looking placeholders:
 * every assertion that reads a label reads it from here, so a future
 * default sneaking back into the component would fail rather than blend in.
 */
const LABELS = {
    previousYear: "PrevYear",
    previousMonth: "PrevMonth",
    nextMonth: "NextMonth",
    nextYear: "NextYear",
    confirm: "Commit",
    cancel: "Dismiss",
};

const TIME_LABELS = { ...LABELS, hour: "Hr", minute: "Min", meridiem: "Half" };

/** A fixed "today" so grid contents are deterministic. 2026-03-15, a Sunday. */
const TODAY = new Date(2026, 2, 15, 10, 30);

function base(overrides: Record<string, unknown> = {}) {
    return { label: "Pick a date", labels: LABELS, locale: "en-GB", ...overrides };
}

/**
 * Let Vue's scheduler, nextTick chains, and pending microtasks settle.
 *
 * `vi.useFakeTimers()` is active for every test in this file (so "today"
 * is deterministic), which means a real `setTimeout` — the usual flush
 * trick in this catalog's other helpers — never fires: nothing ever
 * advances the fake clock. `vi.advanceTimersByTimeAsync(0)` is the
 * fake-timer-safe equivalent — it both advances the clock and drains the
 * microtask queue, so chained `await nextTick()` calls inside the
 * component's own async handlers resolve.
 */
async function flush(): Promise<void> {
    await nextTick();
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}) {
    const wrapper = mount(DateTimePicker, {
        props: base(props),
        attachTo: document.body,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function root() {
    return document.querySelector(".date-time-picker") as HTMLElement;
}
function trigger() {
    return document.querySelector(".date-time-picker-button") as HTMLButtonElement;
}
function dialog() {
    return document.querySelector(".date-time-picker-dialog") as HTMLElement;
}
function grid() {
    return document.querySelector(".date-time-picker-calendar") as HTMLElement;
}
function field() {
    return document.querySelector(".date-time-picker-input") as HTMLInputElement;
}
function hidden() {
    return document.querySelector('input[type="hidden"]') as HTMLInputElement;
}
function days(): HTMLButtonElement[] {
    return Array.from(
        document.querySelectorAll<HTMLButtonElement>(".date-time-picker-day"),
    );
}
function day(iso: string): HTMLButtonElement {
    return document.querySelector(`[data-date="${iso}"]`) as HTMLButtonElement;
}
function cursorDate(): string {
    return days().find((d) => d.getAttribute("tabindex") === "0")?.dataset.date ?? "";
}
function byText(text: string): HTMLElement {
    const all = Array.from(document.querySelectorAll<HTMLElement>("button, span"));
    const found = all.find((el) => el.textContent?.trim() === text);
    if (!found) throw new Error(`No element with text "${text}"`);
    return found;
}

async function open(): Promise<void> {
    trigger().click();
    await flush();
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
});

afterEach(() => {
    vi.useRealTimers();
    while (wrappers.length) wrappers.pop()?.unmount();
});

// =====================================================================
// §7.1–§7.9 — pure arithmetic
// =====================================================================

describe("DateTimePicker — civil-date arithmetic", () => {
    test("§7.1 parseIsoDate rejects impossible dates and accepts real ones", () => {
        expect(parseIsoDate("2026-02-31")).toBeNull();
        expect(parseIsoDate("2026-13-01")).toBeNull();
        expect(parseIsoDate("2026-00-10")).toBeNull();
        expect(parseIsoDate("nonsense")).toBeNull();
        expect(parseIsoDate("2026-02-28")).toEqual({
            year: 2026,
            month: 2,
            day: 28,
        });
    });

    test("§7.1 daysInMonth handles leap years", () => {
        expect(daysInMonth(2024, 2)).toBe(29);
        expect(daysInMonth(2026, 2)).toBe(28);
        // 2100 is divisible by 100 but not 400, so it is not a leap year.
        expect(daysInMonth(2100, 2)).toBe(28);
        expect(daysInMonth(2000, 2)).toBe(29);
    });

    test("§7.2 addDays crosses month and year boundaries both ways", () => {
        expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
        expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
        expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
        expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
        expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    });

    test("§7.2 addMonths clamps the day rather than rolling over", () => {
        expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
        expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
        expect(addMonths("2026-03-31", -1)).toBe("2026-02-28");
        expect(addMonths("2026-01-15", 1)).toBe("2026-02-15");
    });

    test("§7.2 addMonths with a negative delta crosses the year boundary", () => {
        expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
        expect(addMonths("2026-01-15", -13)).toBe("2024-12-15");
        expect(addMonths("2026-06-15", 12)).toBe("2027-06-15");
    });

    test("§7.3 weekdayOf returns 0 for Sunday", () => {
        expect(weekdayOf("2026-03-15")).toBe(0); // Sunday
        expect(weekdayOf("2026-03-16")).toBe(1); // Monday
        expect(weekdayOf("2026-03-21")).toBe(6); // Saturday
    });

    test("§7.3 isoWeek matches ISO-8601 on the hard cases", () => {
        // 2026-01-01 is a Thursday, so it is in week 1.
        expect(isoWeek("2026-01-01")).toBe(1);
        // 2021-01-03 is a Sunday belonging to week 53 of 2020.
        expect(isoWeek("2021-01-03")).toBe(53);
        // 2024-12-30 is a Monday belonging to week 1 of 2025.
        expect(isoWeek("2024-12-30")).toBe(1);
    });

    test("§7.4 toEpochDay and fromEpochDay round-trip", () => {
        const date = { year: 2026, month: 3, day: 15 };
        expect(fromEpochDay(toEpochDay(date))).toEqual(date);
        expect(toEpochDay({ year: 1970, month: 1, day: 1 })).toBe(0);
    });

    test("§7.5 splitValue and joinValue round-trip per mode", () => {
        expect(splitValue("2026-03-15", "date")).toEqual({
            date: "2026-03-15",
            time: "",
        });
        expect(splitValue("09:30", "time")).toEqual({ date: "", time: "09:30" });
        expect(splitValue("2026-03-15T09:30", "datetime")).toEqual({
            date: "2026-03-15",
            time: "09:30",
        });
        expect(joinValue("2026-03-15", "09:30", "datetime")).toBe(
            "2026-03-15T09:30",
        );
    });

    test("§7.5 joinValue refuses a half datetime", () => {
        expect(joinValue("2026-03-15", "", "datetime")).toBe("");
        expect(joinValue("", "09:30", "datetime")).toBe("");
    });

    test("§7.6 monthMatrix is always 6 x 7 and starts on firstDayOfWeek", () => {
        const mondayFirst = monthMatrix(2026, 3, 1);
        expect(mondayFirst).toHaveLength(6);
        expect(mondayFirst.every((week) => week.length === 7)).toBe(true);
        expect(weekdayOf(mondayFirst[0][0])).toBe(1);

        const sundayFirst = monthMatrix(2026, 3, 0);
        expect(weekdayOf(sundayFirst[0][0])).toBe(0);
        // February 2026 starts on a Sunday and has 28 days — the month that
        // most tempts a variable-height grid into 4 rows.
        expect(monthMatrix(2026, 2, 0)).toHaveLength(6);
    });

    test("§7.7 firstDayOfWeekFor follows the locale, defaulting to Monday", () => {
        expect(firstDayOfWeekFor("en-GB")).toBe(1);
        expect(firstDayOfWeekFor("en-US")).toBe(0);
        expect(firstDayOfWeekFor("cy-GB")).toBe(1);
        // An unknown region falls through the table to the Monday default.
        expect(firstDayOfWeekFor("xx-ZZ")).toBe(1);
        expect(firstDayOfWeekFor(undefined)).toBe(1);
    });

    test("§7.8 parseDateInput reads ISO, locale numerics, and written months", () => {
        expect(parseDateInput("2026-03-15", "en-GB")).toBe("2026-03-15");
        // The same digits mean different days in the two locales, and that
        // is the entire point of deriving the order from Intl.
        expect(parseDateInput("03/04/2026", "en-GB")).toBe("2026-04-03");
        expect(parseDateInput("03/04/2026", "en-US")).toBe("2026-03-04");
        // DHCW's own output format has to round-trip.
        expect(parseDateInput("27-Jun-2025", "en-GB")).toBe("2025-06-27");
        expect(parseDateInput("27 June 2025", "en-GB")).toBe("2025-06-27");
        expect(parseDateInput("Sept 5 2025", "en-US")).toBe("2025-09-05");
    });

    test("§7.8 parseDateInput returns null for junk and impossible dates", () => {
        expect(parseDateInput("", "en-GB")).toBeNull();
        expect(parseDateInput("not a date", "en-GB")).toBeNull();
        expect(parseDateInput("31/02/2026", "en-GB")).toBeNull();
        expect(parseDateInput("15/13/2026", "en-GB")).toBeNull();
        expect(parseDateInput("2026", "en-GB")).toBeNull();
    });

    test("§7.9 parseTimeInput reads the common forms and rejects bad ones", () => {
        expect(parseTimeInput("9:30")).toBe("09:30");
        expect(parseTimeInput("09:30")).toBe("09:30");
        expect(parseTimeInput("0930")).toBe("09:30");
        expect(parseTimeInput("9.30")).toBe("09:30");
        expect(parseTimeInput("1:30pm")).toBe("13:30");
        expect(parseTimeInput("12:15am")).toBe("00:15");
        expect(parseTimeInput("25:00")).toBeNull();
        expect(parseTimeInput("09:75")).toBeNull();
        expect(parseTimeInput("half nine")).toBeNull();
    });
});

// =====================================================================
// §7.10–§7.17 — markup contract
// =====================================================================

describe("DateTimePicker — markup", () => {
    test("§7.10 trigger wires aria-haspopup, aria-expanded and aria-controls", () => {
        build();
        const button = trigger();
        expect(button.getAttribute("aria-haspopup")).toBe("dialog");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const controlled = document.getElementById(
            button.getAttribute("aria-controls") ?? "",
        );
        expect(controlled?.getAttribute("role")).toBe("dialog");
        expect(controlled?.getAttribute("aria-modal")).toBe("true");
    });

    test("§7.10 the glyph is rendered and hidden from assistive technology", () => {
        build();
        const icon = document.querySelector(".date-time-picker-icon");
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute("aria-hidden")).toBe("true");
        // U+1F4C5 CALENDAR, with the text-presentation selector.
        expect(icon?.textContent).toBe("\u{1F4C5}︎");
    });

    test("§7.11 aria-label names both the trigger and the dialog", () => {
        build({ label: "Appointment date" });
        expect(trigger().getAttribute("aria-label")).toBe("Appointment date");
        expect(dialog().getAttribute("aria-label")).toBe("Appointment date");
    });

    test("§7.12 the hidden input carries the ISO value, the field the display", () => {
        build({ name: "appointment", value: "2026-03-15" });
        expect(hidden().getAttribute("name")).toBe("appointment");
        expect(hidden().value).toBe("2026-03-15");
        // The visible field is localised and, critically, has no `name`:
        // posting a display string next to the ISO value is how a backend
        // ends up guessing.
        expect(field().value).toContain("2026");
        expect(field().hasAttribute("name")).toBe(false);
    });

    test("§7.13 the dialog is hidden until the trigger is activated", async () => {
        build();
        expect(dialog().hasAttribute("hidden")).toBe(true);
        await open();
        expect(dialog().hasAttribute("hidden")).toBe(false);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.14 the grid is 6 x 7 with data-outside on adjacent-month days", async () => {
        build({ value: "2026-03-15" });
        await open();
        expect(grid().querySelectorAll("tbody tr")).toHaveLength(6);
        expect(days()).toHaveLength(42);
        // March 2026 starts on a Sunday; with a Monday-first grid the six
        // preceding days come from February.
        expect(day("2026-02-23")?.hasAttribute("data-outside")).toBe(true);
        expect(day("2026-03-15")?.hasAttribute("data-outside")).toBe(false);
    });

    test("§7.15 exactly one day is tabbable (roving tabindex)", async () => {
        build({ value: "2026-03-15" });
        await open();
        const tabbable = days().filter(
            (d) => d.getAttribute("tabindex") === "0",
        );
        expect(tabbable).toHaveLength(1);
        expect(tabbable[0].dataset.date).toBe("2026-03-15");
    });

    test("§7.16 $attrs spread onto the root and data-mode reflects mode", () => {
        const wrapper = mount(DateTimePicker, {
            props: base({ mode: "datetime", labels: TIME_LABELS }),
            attrs: { "data-testid": "dtp" },
            attachTo: document.body,
        });
        wrappers.push(wrapper);
        expect(root().getAttribute("data-testid")).toBe("dtp");
        expect(root().getAttribute("data-mode")).toBe("datetime");
    });

    test("§7.17 today carries data-today and aria-current", async () => {
        build();
        await open();
        const todayCell = day("2026-03-15");
        expect(todayCell.hasAttribute("data-today")).toBe(true);
        expect(todayCell.getAttribute("aria-current")).toBe("date");
    });
});

// =====================================================================
// §7.18–§7.23 — selection and commit
// =====================================================================

describe("DateTimePicker — commit and discard", () => {
    test("§7.18 clicking a day in date mode commits, emits and closes", async () => {
        const wrapper = build({ value: "2026-03-15" });
        await open();
        day("2026-03-20").click();
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-03-20"]]);
        expect(wrapper.emitted("update:value")).toEqual([["2026-03-20"]]);
        expect(hidden().value).toBe("2026-03-20");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 with confirmOnSelect false, only Confirm commits", async () => {
        const wrapper = build({ value: "2026-03-15", confirmOnSelect: false });
        await open();
        day("2026-03-20").click();
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(hidden().value).toBe("2026-03-15");

        byText(LABELS.confirm).click();
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-03-20"]]);
        expect(hidden().value).toBe("2026-03-20");
    });

    test("§7.20 Cancel closes without changing the value", async () => {
        const wrapper = build({ value: "2026-03-15", confirmOnSelect: false });
        await open();
        day("2026-03-20").click();
        await flush();
        byText(LABELS.cancel).click();
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(hidden().value).toBe("2026-03-15");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.21 Escape closes without changing the value", async () => {
        const wrapper = build({ value: "2026-03-15", confirmOnSelect: false });
        await open();
        day("2026-03-20").click();
        await flush();
        dialog().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(hidden().value).toBe("2026-03-15");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.22 the clear button renders only when labelled, and commits empty", async () => {
        const first = build({ value: "2026-03-15" });
        await open();
        expect(document.querySelector(".date-time-picker-clear")).toBeNull();
        first.unmount();
        wrappers.pop();

        const wrapper = build({
            value: "2026-03-15",
            labels: { ...LABELS, clear: "Wipe" },
        });
        await open();
        byText("Wipe").click();
        await flush();
        expect(wrapper.emitted("change")).toEqual([[""]]);
        expect(hidden().value).toBe("");
    });

    test("§7.23 change does not fire when the value is unchanged", async () => {
        const wrapper = build({ value: "2026-03-15" });
        await open();
        day("2026-03-15").click();
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
    });
});

// =====================================================================
// §7.24–§7.28 — keyboard
// =====================================================================

describe("DateTimePicker — keyboard", () => {
    async function openAt(iso = "2026-03-15", extra: Record<string, unknown> = {}) {
        build({ value: iso, ...extra });
        await open();
    }

    function press(key: string, extra: Record<string, unknown> = {}) {
        grid().dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true, ...extra }),
        );
    }

    test("§7.24 arrows move the cursor by a day and by a week", async () => {
        await openAt();
        press("ArrowRight");
        await flush();
        expect(cursorDate()).toBe("2026-03-16");
        press("ArrowLeft");
        await flush();
        expect(cursorDate()).toBe("2026-03-15");
        press("ArrowDown");
        await flush();
        expect(cursorDate()).toBe("2026-03-22");
        press("ArrowUp");
        await flush();
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.25 Home and End reach the ends of the week, per firstDayOfWeek", async () => {
        // 2026-03-18 is a Wednesday. Monday-first: Home → 16th, End → 22nd.
        await openAt("2026-03-18");
        press("Home");
        await flush();
        expect(cursorDate()).toBe("2026-03-16");
        press("End");
        await flush();
        expect(cursorDate()).toBe("2026-03-22");
    });

    test("§7.25 Home respects a Sunday-first week", async () => {
        await openAt("2026-03-18", { locale: "en-US" });
        press("Home");
        await flush();
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.26 PageUp and PageDown page the month; Shift pages the year", async () => {
        await openAt();
        press("PageDown");
        await flush();
        expect(cursorDate()).toBe("2026-04-15");
        press("PageUp");
        await flush();
        expect(cursorDate()).toBe("2026-03-15");
        press("PageDown", { shiftKey: true });
        await flush();
        expect(cursorDate()).toBe("2027-03-15");
        press("PageUp", { shiftKey: true });
        await flush();
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.26 paging into a shorter month clamps the cursor day", async () => {
        await openAt("2026-01-31");
        press("PageDown");
        await flush();
        expect(cursorDate()).toBe("2026-02-28");
    });

    test("§7.27 Enter on the grid selects the cursor's day", async () => {
        const wrapper = build({ value: "2026-03-15" });
        await open();
        press("ArrowRight");
        await flush();
        press("Enter");
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-03-16"]]);
    });

    test("§7.28 Alt+ArrowDown on the field opens the dialog", async () => {
        build();
        expect(dialog().hasAttribute("hidden")).toBe(true);
        field().dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowDown", altKey: true, bubbles: true }),
        );
        await flush();
        expect(dialog().hasAttribute("hidden")).toBe(false);
    });
});

// =====================================================================
// §7.29–§7.33 — range, vetoes, shortcuts
// =====================================================================

describe("DateTimePicker — constraints and shortcuts", () => {
    test("§7.29 days outside min/max are aria-disabled, not disabled", async () => {
        build({ value: "2026-03-15", min: "2026-03-10", max: "2026-03-20" });
        await open();
        expect(day("2026-03-09").getAttribute("aria-disabled")).toBe("true");
        expect(day("2026-03-10").hasAttribute("aria-disabled")).toBe(false);
        expect(day("2026-03-20").hasAttribute("aria-disabled")).toBe(false);
        expect(day("2026-03-21").getAttribute("aria-disabled")).toBe("true");
        // aria-disabled, not the `disabled` attribute: a vetoed day must
        // stay focusable so the roving cursor can land on it and a screen
        // reader can announce it as unavailable.
        expect(day("2026-03-09").hasAttribute("disabled")).toBe(false);
        // And the consumer's CSS hook rides along.
        expect(day("2026-03-09").hasAttribute("data-disabled")).toBe(true);
        expect(day("2026-03-10").hasAttribute("data-disabled")).toBe(false);
    });

    test("§7.30 isDateDisabled vetoes individual days", async () => {
        // A weekends-closed clinic.
        const isDateDisabled = (iso: string) =>
            weekdayOf(iso) === 0 || weekdayOf(iso) === 6;
        build({ value: "2026-03-16", isDateDisabled });
        await open();
        expect(day("2026-03-21").getAttribute("aria-disabled")).toBe("true"); // Saturday
        expect(day("2026-03-22").getAttribute("aria-disabled")).toBe("true"); // Sunday
        expect(day("2026-03-23").hasAttribute("aria-disabled")).toBe(false); // Monday
    });

    test("§7.31 clicking a disabled day does not commit", async () => {
        const wrapper = build({ value: "2026-03-15", max: "2026-03-16" });
        await open();
        day("2026-03-25").click();
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
    });

    test("§7.32 a shortcut moves the selection and reports its id", async () => {
        const wrapper = build({
            value: "2026-03-15",
            shortcuts: [
                { id: "today", label: "Heddiw", days: 0 },
                { id: "two-weeks", label: "+2", days: 14 },
                { id: "next-month", label: "+1m", months: 1 },
            ],
        });
        await open();
        byText("+2").click();
        await flush();
        expect(wrapper.emitted("shortcut")).toEqual([["two-weeks", "2026-03-29"]]);
        expect(wrapper.emitted("change")).toEqual([["2026-03-29"]]);
    });

    test("§7.32 a month shortcut uses calendar months, not 30 days", async () => {
        const wrapper = build({
            value: "2026-03-15",
            shortcuts: [{ id: "m", label: "+1m", months: 1 }],
        });
        await open();
        byText("+1m").click();
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-04-15"]]);
    });

    test("§7.33 a shortcut resolving to a blocked date does nothing", async () => {
        const wrapper = build({
            value: "2026-03-15",
            max: "2026-03-20",
            shortcuts: [{ id: "far", label: "+4w", days: 28 }],
        });
        await open();
        byText("+4w").click();
        await flush();
        expect(wrapper.emitted("shortcut")).toBeUndefined();
        expect(wrapper.emitted("change")).toBeUndefined();
    });
});

// =====================================================================
// §7.34–§7.39 — typed input
// =====================================================================

describe("DateTimePicker — typed input", () => {
    test("§7.34 typing an ISO date and blurring commits it", async () => {
        const wrapper = build();
        const input = field();
        input.value = "2026-03-15";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-03-15"]]);
        expect(hidden().value).toBe("2026-03-15");
    });

    test("§7.35 typing a locale-ordered numeric date commits the right day", async () => {
        const wrapper = build({ locale: "en-GB" });
        const input = field();
        input.value = "03/04/2026";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-04-03"]]);
    });

    test("§7.36 unparseable text marks the field invalid and does not commit", async () => {
        const wrapper = build({ value: "2026-03-15" });
        const input = field();
        input.value = "sometime soon";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(wrapper.emitted("invalidInput")).toEqual([["sometime soon"]]);
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(field().getAttribute("aria-invalid")).toBe("true");
        // The text the user typed stays put: silently reverting it is how
        // someone submits a form still believing they changed the date.
        expect(field().value).toBe("sometime soon");
        expect(hidden().value).toBe("2026-03-15");
    });

    test("§7.37 text parsing to an out-of-range date is rejected the same way", async () => {
        const wrapper = build({ value: "2026-03-15", max: "2026-03-20" });
        const input = field();
        input.value = "2026-12-25";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(wrapper.emitted("invalidInput")).toEqual([["2026-12-25"]]);
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(field().getAttribute("aria-invalid")).toBe("true");
    });

    test("§7.38 clearing the field commits an empty value", async () => {
        const wrapper = build({ value: "2026-03-15" });
        const input = field();
        input.value = "";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(wrapper.emitted("change")).toEqual([[""]]);
        expect(hidden().value).toBe("");
    });

    test("§7.39 a parseInput prop overrides the built-in parser", async () => {
        const parseInput = (text: string) =>
            text === "xmas" ? "2026-12-25" : null;
        const wrapper = build({ parseInput });
        const input = field();
        input.value = "xmas";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-12-25"]]);
    });
});

// =====================================================================
// §7.40–§7.44 — time and datetime
// =====================================================================

describe("DateTimePicker — time and datetime", () => {
    test("§7.40 time mode renders hour and minute selects and no grid", async () => {
        build({ mode: "time", labels: TIME_LABELS, value: "09:30" });
        await open();
        expect(document.querySelector(".date-time-picker-calendar")).toBeNull();
        const hour = document.querySelector(".date-time-picker-hour") as HTMLSelectElement;
        const minute = document.querySelector(".date-time-picker-minute") as HTMLSelectElement;
        expect(hour.value).toBe("9");
        expect(minute.value).toBe("30");
    });

    test("§7.41 minuteStep controls the minute options", async () => {
        build({
            mode: "time",
            labels: TIME_LABELS,
            value: "09:30",
            minuteStep: 15,
        });
        await open();
        const options = Array.from(
            document.querySelectorAll(".date-time-picker-minute option"),
        ).map((o) => o.textContent);
        expect(options).toEqual(["00", "15", "30", "45"]);
    });

    test("§7.42 datetime mode renders both the grid and the time selects", async () => {
        build({
            mode: "datetime",
            labels: TIME_LABELS,
            value: "2026-03-15T09:30",
        });
        await open();
        expect(document.querySelector(".date-time-picker-calendar")).not.toBeNull();
        expect(document.querySelector(".date-time-picker-hour")).not.toBeNull();
    });

    test("§7.43 datetime commits date and time together", async () => {
        const wrapper = build({
            mode: "datetime",
            labels: TIME_LABELS,
            value: "2026-03-15T09:30",
        });
        await open();
        // In datetime mode a day click is pending only — the user still
        // has a time to set.
        day("2026-03-20").click();
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
        byText(TIME_LABELS.confirm).click();
        await flush();
        expect(wrapper.emitted("change")).toEqual([["2026-03-20T09:30"]]);
    });

    test("§7.44 hour12 renders a meridiem select whose labels come from the locale", async () => {
        build({
            mode: "time",
            labels: TIME_LABELS,
            value: "13:30",
            hour12: true,
            locale: "en-US",
        });
        await open();
        const meridiem = document.querySelector(".date-time-picker-meridiem") as HTMLSelectElement;
        expect(meridiem).not.toBeNull();
        expect(meridiem.value).toBe("pm");
        const labels = Array.from(meridiem.options).map((o) => o.textContent);
        // Whatever en-US calls them — the point is that neither string is
        // hardcoded in the component.
        expect(labels).toHaveLength(2);
        expect(labels[0]).not.toBe(labels[1]);
        // A 12-hour clock shows 1-12, not 13.
        const hourLabels = Array.from(
            document.querySelectorAll(".date-time-picker-hour option"),
        ).map((o) => o.textContent);
        expect(hourLabels).toContain("1");
        expect(hourLabels).not.toContain("13");
    });
});

// =====================================================================
// §7.45–§7.48 — locale
// =====================================================================

describe("DateTimePicker — locale", () => {
    test("§7.45 weekday headings start on Monday for en-GB, Sunday for en-US", async () => {
        const gbWrapper = build({ locale: "en-GB", value: "2026-03-15" });
        await open();
        const gb = Array.from(
            document.querySelectorAll(".date-time-picker-weekday"),
        ).map((th) => th.getAttribute("abbr"));
        expect(gb[0]).toBe("Monday");
        gbWrapper.unmount();
        wrappers.pop();

        build({ locale: "en-US", value: "2026-03-15" });
        await open();
        const us = Array.from(
            document.querySelectorAll(".date-time-picker-weekday"),
        ).map((th) => th.getAttribute("abbr"));
        expect(us[0]).toBe("Sunday");
    });

    test("§7.46 firstDayOfWeek overrides the locale", async () => {
        build({ locale: "en-GB", firstDayOfWeek: 0, value: "2026-03-15" });
        await open();
        const first = document
            .querySelector(".date-time-picker-weekday")
            ?.getAttribute("abbr");
        expect(first).toBe("Sunday");
    });

    test("§7.47 month names and day labels follow the locale", async () => {
        build({ locale: "cy-GB", value: "2026-03-15" });
        await open();
        const period = document.querySelector(".date-time-picker-period") as HTMLElement;
        // Welsh for March is "Mawrth"; the assertion is that the heading is
        // NOT the English month name, so the test does not depend on one
        // ICU version's exact spelling.
        expect(period.textContent?.trim()).not.toContain("March");
        expect(period.textContent?.trim()).toContain("2026");
        expect(day("2026-03-15").getAttribute("aria-label")).not.toContain("March");
    });

    test("§7.48 showWeekNumbers renders ISO week numbers", async () => {
        build({
            value: "2026-03-15",
            showWeekNumbers: true,
            labels: { ...LABELS, week: "Wk" },
        });
        await open();
        expect(
            document.querySelector(".date-time-picker-week-heading")?.textContent?.trim(),
        ).toBe("Wk");
        const weeks = Array.from(
            document.querySelectorAll(".date-time-picker-week"),
        ).map((th) => th.textContent?.trim());
        expect(weeks).toHaveLength(6);
        // The grid's first row starts 2026-02-23, which is ISO week 9.
        expect(weeks[0]).toBe("9");
    });
});

// =====================================================================
// §7.49–§7.55 — assistive technology
// =====================================================================

describe("DateTimePicker — assistive technology", () => {
    function press(key: string, extra: Record<string, unknown> = {}) {
        grid().dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true, ...extra }),
        );
    }

    test("§7.49 the cursor can land on a vetoed day, which stays focusable and announces", async () => {
        const isDateDisabled = (iso: string) => iso === "2026-03-16";
        const wrapper = build({ value: "2026-03-15", isDateDisabled });
        await open();
        press("ArrowRight");
        await flush();
        // The roving tabindex is on the blocked day, and — because it is
        // aria-disabled rather than `disabled` — real focus is too, so a
        // screen reader announces the day instead of going silent.
        expect(cursorDate()).toBe("2026-03-16");
        expect(document.activeElement).toBe(day("2026-03-16"));
        // Enter refuses to select it.
        press("Enter");
        await flush();
        expect(wrapper.emitted("change")).toBeUndefined();
        // And the cursor can keep going, out the other side.
        press("ArrowRight");
        await flush();
        expect(cursorDate()).toBe("2026-03-17");
    });

    test("§7.50 Escape in the field discards the pending edit without committing", async () => {
        const wrapper = build({ value: "2026-03-15" });
        // Mark the field invalid first, so the revert has state to clean up.
        const input = field();
        input.value = "sometime soon";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        await flush();
        expect(field().getAttribute("aria-invalid")).toBe("true");

        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await flush();
        // The committed value is back on display, the invalid state is
        // gone, and nothing was committed.
        expect(field().value).toContain("2026");
        expect(field().hasAttribute("aria-invalid")).toBe(false);
        expect(wrapper.emitted("change")).toBeUndefined();
        expect(hidden().value).toBe("2026-03-15");
    });

    test("§7.51 labels.invalid renders a status live region wired to the field", async () => {
        const first = build();
        // Without the label, no region renders — the component would rather
        // stay silent than announce in a language it invented.
        expect(document.querySelector(".date-time-picker-status")).toBeNull();
        first.unmount();
        wrappers.pop();

        build({
            describedBy: "hint",
            labels: { ...LABELS, invalid: "DimDyddiad" },
        });
        const status = document.querySelector(
            ".date-time-picker-status",
        ) as HTMLElement;
        // The region exists before it has content — a live region born with
        // its message is routinely not announced at all — and is empty
        // while the field is valid.
        expect(status.getAttribute("role")).toBe("status");
        expect(status.textContent?.trim()).toBe("");
        expect(field().getAttribute("aria-describedby")).toBe("hint");

        const input = field();
        input.value = "junk";
        input.dispatchEvent(new Event("input"));
        input.dispatchEvent(new Event("blur"));
        await flush();
        expect(status.textContent?.trim()).toBe("DimDyddiad");
        expect(field().getAttribute("aria-errormessage")).toBe(status.id);
        // Chained after the consumer's hint, for the assistive technologies
        // that read aria-describedby but not aria-errormessage.
        expect(field().getAttribute("aria-describedby")).toBe(
            `hint ${status.id}`,
        );
    });

    test("§7.52 focus returns to whichever element opened the dialog", async () => {
        const first = build({ value: "2026-03-15" });
        // Opened from the field with Alt+ArrowDown: Escape must return
        // focus to the field, not strand the user on the button.
        field().focus();
        field().dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowDown", altKey: true, bubbles: true }),
        );
        await flush();
        dialog().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await flush();
        expect(document.activeElement).toBe(field());
        first.unmount();
        wrappers.pop();

        build({ value: "2026-03-15" });
        // Opened from the button: focus returns to the button.
        trigger().focus();
        await open();
        dialog().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await flush();
        expect(document.activeElement).toBe(trigger());
    });

    test("§7.53 header paging keeps focus on the header button; grid paging follows the cursor", async () => {
        build({ value: "2026-03-15" });
        await open();

        // Header route: the user activating "next month" stays on "next
        // month", so they can page again — the cursor carries silently.
        const nextMonth = document.querySelector(
            ".date-time-picker-next-month",
        ) as HTMLButtonElement;
        nextMonth.focus();
        nextMonth.click();
        await flush();
        expect(document.activeElement).toBe(nextMonth);
        expect(cursorDate()).toBe("2026-04-15");

        // Grid route: focus is in the grid, and paging must carry it —
        // the cell it sat on no longer exists.
        day("2026-04-15").focus();
        press("PageDown");
        await flush();
        expect(cursorDate()).toBe("2026-05-15");
        expect(document.activeElement).toBe(day("2026-05-15"));
    });

    test("§7.54 labels.instructions renders keyboard help described by the dialog", async () => {
        const first = build();
        expect(
            document.querySelector(".date-time-picker-instructions"),
        ).toBeNull();
        expect(dialog().hasAttribute("aria-describedby")).toBe(false);
        first.unmount();
        wrappers.pop();

        build({ labels: { ...LABELS, instructions: "SaethauSymud" } });
        const help = document.querySelector(
            ".date-time-picker-instructions",
        ) as HTMLElement;
        expect(help.textContent?.trim()).toBe("SaethauSymud");
        expect(dialog().getAttribute("aria-describedby")).toBe(help.id);
    });

    test("§7.55 clicking the text field while the dialog is open closes it", async () => {
        build({ value: "2026-03-15" });
        await open();
        expect(dialog().hasAttribute("hidden")).toBe(false);
        // The dialog is aria-modal: interacting with anything behind it —
        // including the component's own field — dismisses it.
        field().click();
        await flush();
        expect(dialog().hasAttribute("hidden")).toBe(true);
        expect(hidden().value).toBe("2026-03-15");
    });
});

// =====================================================================
// Vue-specific: v-model:value and the default scoped slot
// =====================================================================

describe("DateTimePicker — Vue idioms", () => {
    test("v-model:value round-trips: an external value prop is reflected, and commits emit update:value", async () => {
        const wrapper = build({ value: "2026-03-15" });
        await open();
        day("2026-03-20").click();
        await flush();
        expect(wrapper.emitted("update:value")).toEqual([["2026-03-20"]]);

        // Simulate the parent applying the emitted value back down, as
        // v-model does.
        await wrapper.setProps({ value: "2026-03-20" });
        expect(hidden().value).toBe("2026-03-20");
    });

    test("the default scoped slot replaces the glyph and receives SlotArgs", async () => {
        const wrapper = mount(DateTimePicker, {
            props: base({ value: "2026-03-15" }),
            attachTo: document.body,
            slots: {
                default: (args: { value: string; open: boolean; display: string }) =>
                    h(
                        "span",
                        {
                            "data-testid": "custom",
                            "data-open": String(args.open),
                            "data-value": args.value,
                        },
                        "custom glyph",
                    ),
            },
        });
        wrappers.push(wrapper);
        await flush();
        const custom = wrapper.find('[data-testid="custom"]');
        expect(custom.exists()).toBe(true);
        expect(wrapper.find(".date-time-picker-icon").exists()).toBe(false);
        expect(custom.attributes("data-open")).toBe("false");
        expect(custom.attributes("data-value")).toBe("2026-03-15");
    });
});
