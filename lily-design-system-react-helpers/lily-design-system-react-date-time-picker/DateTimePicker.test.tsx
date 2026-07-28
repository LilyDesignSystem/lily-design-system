import * as React from "react";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

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
} from "./DateTimePicker";

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
 * A minimal controlled wrapper, for the handful of tests that need to
 * observe a committed value flowing back into the rendered DOM.
 *
 * `DateTimePicker` follows this catalog's controlled-or-uncontrolled
 * convention: supplying `value` makes it controlled, and the DOM will not
 * change on interaction unless the consumer's `onChange` feeds the new
 * value back in as `value` — exactly like a native `<input>`. Most tests
 * below exercise the uncontrolled path (omit `value`, let the component
 * manage its own copy) or a controlled-but-static path (pass `value` and
 * assert it does *not* change). The few that need to see a real commit
 * take that round trip explicitly, here, rather than the component
 * quietly self-updating a "controlled" prop out from under its owner.
 */
function ControlledDateTimePicker({
    initialValue = "",
    onChange,
    ...props
}: {
    initialValue?: string;
    onChange?: (value: string) => void;
} & Omit<React.ComponentProps<typeof DateTimePicker>, "value" | "onChange">) {
    const [value, setValue] = useState(initialValue);
    return (
        <DateTimePicker
            {...props}
            value={value}
            onChange={(next) => {
                setValue(next);
                onChange?.(next);
            }}
        />
    );
}

const root = () => document.querySelector(".date-time-picker") as HTMLElement;
const trigger = () =>
    document.querySelector(".date-time-picker-button") as HTMLButtonElement;
const dialog = () =>
    document.querySelector(".date-time-picker-dialog") as HTMLElement;
const grid = () =>
    document.querySelector(".date-time-picker-calendar") as HTMLElement;
const field = () =>
    document.querySelector(".date-time-picker-input") as HTMLInputElement;
const hidden = () =>
    document.querySelector('input[type="hidden"]') as HTMLInputElement;
const days = () =>
    Array.from(
        document.querySelectorAll<HTMLButtonElement>(".date-time-picker-day"),
    );
const day = (iso: string) =>
    document.querySelector(`[data-date="${iso}"]`) as HTMLButtonElement;
const cursorDate = () =>
    days().find((d) => d.getAttribute("tabindex") === "0")?.dataset.date ?? "";

function open(): void {
    fireEvent.click(trigger());
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
});

afterEach(() => {
    vi.useRealTimers();
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
        render(<DateTimePicker {...base()} />);
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
        render(<DateTimePicker {...base()} />);
        const icon = document.querySelector(".date-time-picker-icon");
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute("aria-hidden")).toBe("true");
        // U+1F4C5 CALENDAR, with the text-presentation selector.
        expect(icon?.textContent).toBe("\u{1F4C5}︎");
    });

    test("§7.11 aria-label names both the trigger and the dialog", () => {
        render(<DateTimePicker {...base({ label: "Appointment date" })} />);
        expect(trigger().getAttribute("aria-label")).toBe("Appointment date");
        expect(dialog().getAttribute("aria-label")).toBe("Appointment date");
    });

    test("§7.12 the hidden input carries the ISO value, the field the display", () => {
        render(
            <DateTimePicker
                {...base({ name: "appointment", value: "2026-03-15" })}
            />,
        );
        expect(hidden().getAttribute("name")).toBe("appointment");
        expect(hidden().value).toBe("2026-03-15");
        // The visible field is localised and, critically, has no `name`:
        // posting a display string next to the ISO value is how a backend
        // ends up guessing.
        expect(field().value).toContain("2026");
        expect(field().hasAttribute("name")).toBe(false);
    });

    test("§7.13 the dialog is hidden until the trigger is activated", () => {
        render(<DateTimePicker {...base()} />);
        expect(dialog().hasAttribute("hidden")).toBe(true);
        open();
        expect(dialog().hasAttribute("hidden")).toBe(false);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.14 the grid is 6 x 7 with data-outside on adjacent-month days", () => {
        render(<DateTimePicker {...base({ value: "2026-03-15" })} />);
        open();
        expect(grid().querySelectorAll("tbody tr")).toHaveLength(6);
        expect(days()).toHaveLength(42);
        // March 2026 starts on a Sunday; with a Monday-first grid the six
        // preceding days come from February.
        expect(day("2026-02-23")?.hasAttribute("data-outside")).toBe(true);
        expect(day("2026-03-15")?.hasAttribute("data-outside")).toBe(false);
    });

    test("§7.15 exactly one day is tabbable (roving tabindex)", () => {
        render(<DateTimePicker {...base({ value: "2026-03-15" })} />);
        open();
        const tabbable = days().filter((d) => d.getAttribute("tabindex") === "0");
        expect(tabbable).toHaveLength(1);
        expect(tabbable[0].dataset.date).toBe("2026-03-15");
    });

    test("§7.16 rest props spread onto the root and data-mode reflects mode", () => {
        render(
            <DateTimePicker
                {...base({ "data-testid": "dtp", mode: "datetime", labels: TIME_LABELS })}
            />,
        );
        expect(root().getAttribute("data-testid")).toBe("dtp");
        expect(root().getAttribute("data-mode")).toBe("datetime");
    });

    test("§7.17 today carries data-today and aria-current", () => {
        render(<DateTimePicker {...base()} />);
        open();
        const todayCell = day("2026-03-15");
        expect(todayCell.hasAttribute("data-today")).toBe(true);
        expect(todayCell.getAttribute("aria-current")).toBe("date");
    });
});

// =====================================================================
// §7.18–§7.23 — selection and commit
// =====================================================================

describe("DateTimePicker — commit and discard", () => {
    test("§7.18 clicking a day in date mode commits, notifies and closes", () => {
        const onChange = vi.fn();
        render(
            <ControlledDateTimePicker
                {...base({})}
                initialValue="2026-03-15"
                onChange={onChange}
            />,
        );
        open();
        fireEvent.click(day("2026-03-20"));
        expect(onChange).toHaveBeenCalledWith("2026-03-20");
        expect(hidden().value).toBe("2026-03-20");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.19 with confirmOnSelect false, only Confirm commits", () => {
        const onChange = vi.fn();
        render(
            <ControlledDateTimePicker
                {...base({ confirmOnSelect: false })}
                initialValue="2026-03-15"
                onChange={onChange}
            />,
        );
        open();
        fireEvent.click(day("2026-03-20"));
        expect(onChange).not.toHaveBeenCalled();
        expect(hidden().value).toBe("2026-03-15");

        fireEvent.click(screen.getByText(LABELS.confirm));
        expect(onChange).toHaveBeenCalledWith("2026-03-20");
        expect(hidden().value).toBe("2026-03-20");
    });

    test("§7.20 Cancel closes without changing the value", () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                {...base({ value: "2026-03-15", confirmOnSelect: false, onChange })}
            />,
        );
        open();
        fireEvent.click(day("2026-03-20"));
        fireEvent.click(screen.getByText(LABELS.cancel));
        expect(onChange).not.toHaveBeenCalled();
        expect(hidden().value).toBe("2026-03-15");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.21 Escape closes without changing the value", () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                {...base({ value: "2026-03-15", confirmOnSelect: false, onChange })}
            />,
        );
        open();
        fireEvent.click(day("2026-03-20"));
        fireEvent.keyDown(dialog(), { key: "Escape" });
        expect(onChange).not.toHaveBeenCalled();
        expect(hidden().value).toBe("2026-03-15");
        expect(dialog().hasAttribute("hidden")).toBe(true);
    });

    test("§7.22 the clear button renders only when labelled, and commits empty", () => {
        const onChange = vi.fn();
        const { unmount } = render(
            <ControlledDateTimePicker
                {...base({})}
                initialValue="2026-03-15"
                onChange={onChange}
            />,
        );
        open();
        expect(document.querySelector(".date-time-picker-clear")).toBeNull();
        unmount();

        render(
            <ControlledDateTimePicker
                {...base({ labels: { ...LABELS, clear: "Wipe" } })}
                initialValue="2026-03-15"
                onChange={onChange}
            />,
        );
        open();
        fireEvent.click(screen.getByText("Wipe"));
        expect(onChange).toHaveBeenCalledWith("");
        expect(hidden().value).toBe("");
    });

    test("§7.23 onChange does not fire when the value is unchanged", () => {
        const onChange = vi.fn();
        render(<DateTimePicker {...base({ value: "2026-03-15", onChange })} />);
        open();
        fireEvent.click(day("2026-03-15"));
        expect(onChange).not.toHaveBeenCalled();
    });
});

// =====================================================================
// §7.24–§7.28 — keyboard
// =====================================================================

describe("DateTimePicker — keyboard", () => {
    function openAt(iso = "2026-03-15", extra: Record<string, unknown> = {}) {
        render(<DateTimePicker {...base({ value: iso, ...extra })} />);
        open();
    }

    test("§7.24 arrows move the cursor by a day and by a week", () => {
        openAt();
        fireEvent.keyDown(grid(), { key: "ArrowRight" });
        expect(cursorDate()).toBe("2026-03-16");
        fireEvent.keyDown(grid(), { key: "ArrowLeft" });
        expect(cursorDate()).toBe("2026-03-15");
        fireEvent.keyDown(grid(), { key: "ArrowDown" });
        expect(cursorDate()).toBe("2026-03-22");
        fireEvent.keyDown(grid(), { key: "ArrowUp" });
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.25 Home and End reach the ends of the week, per firstDayOfWeek", () => {
        // 2026-03-18 is a Wednesday. Monday-first: Home → 16th, End → 22nd.
        openAt("2026-03-18");
        fireEvent.keyDown(grid(), { key: "Home" });
        expect(cursorDate()).toBe("2026-03-16");
        fireEvent.keyDown(grid(), { key: "End" });
        expect(cursorDate()).toBe("2026-03-22");
    });

    test("§7.25 Home respects a Sunday-first week", () => {
        openAt("2026-03-18", { locale: "en-US" });
        fireEvent.keyDown(grid(), { key: "Home" });
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.26 PageUp and PageDown page the month; Shift pages the year", () => {
        openAt();
        fireEvent.keyDown(grid(), { key: "PageDown" });
        expect(cursorDate()).toBe("2026-04-15");
        fireEvent.keyDown(grid(), { key: "PageUp" });
        expect(cursorDate()).toBe("2026-03-15");
        fireEvent.keyDown(grid(), { key: "PageDown", shiftKey: true });
        expect(cursorDate()).toBe("2027-03-15");
        fireEvent.keyDown(grid(), { key: "PageUp", shiftKey: true });
        expect(cursorDate()).toBe("2026-03-15");
    });

    test("§7.26 paging into a shorter month clamps the cursor day", () => {
        openAt("2026-01-31");
        fireEvent.keyDown(grid(), { key: "PageDown" });
        expect(cursorDate()).toBe("2026-02-28");
    });

    test("§7.27 Enter on the grid selects the cursor's day", () => {
        const onChange = vi.fn();
        render(<DateTimePicker {...base({ value: "2026-03-15", onChange })} />);
        open();
        fireEvent.keyDown(grid(), { key: "ArrowRight" });
        fireEvent.keyDown(grid(), { key: "Enter" });
        expect(onChange).toHaveBeenCalledWith("2026-03-16");
    });

    test("§7.28 Alt+ArrowDown on the field opens the dialog", () => {
        render(<DateTimePicker {...base()} />);
        expect(dialog().hasAttribute("hidden")).toBe(true);
        fireEvent.keyDown(field(), { key: "ArrowDown", altKey: true });
        expect(dialog().hasAttribute("hidden")).toBe(false);
    });
});

// =====================================================================
// §7.29–§7.33 — range, vetoes, shortcuts
// =====================================================================

describe("DateTimePicker — constraints and shortcuts", () => {
    test("§7.29 days outside min/max are disabled", () => {
        render(
            <DateTimePicker
                {...base({ value: "2026-03-15", min: "2026-03-10", max: "2026-03-20" })}
            />,
        );
        open();
        expect(day("2026-03-09").disabled).toBe(true);
        expect(day("2026-03-10").disabled).toBe(false);
        expect(day("2026-03-20").disabled).toBe(false);
        expect(day("2026-03-21").disabled).toBe(true);
    });

    test("§7.30 isDateDisabled vetoes individual days", () => {
        // A weekends-closed clinic.
        const isDateDisabled = (iso: string) =>
            weekdayOf(iso) === 0 || weekdayOf(iso) === 6;
        render(
            <DateTimePicker {...base({ value: "2026-03-16", isDateDisabled })} />,
        );
        open();
        expect(day("2026-03-21").disabled).toBe(true); // Saturday
        expect(day("2026-03-22").disabled).toBe(true); // Sunday
        expect(day("2026-03-23").disabled).toBe(false); // Monday
    });

    test("§7.31 clicking a disabled day does not commit", () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                {...base({ value: "2026-03-15", max: "2026-03-16", onChange })}
            />,
        );
        open();
        fireEvent.click(day("2026-03-25"));
        expect(onChange).not.toHaveBeenCalled();
    });

    test("§7.32 a shortcut moves the selection and reports its id", () => {
        const onChange = vi.fn();
        const onShortcut = vi.fn();
        render(
            <DateTimePicker
                {...base({
                    value: "2026-03-15",
                    shortcuts: [
                        { id: "today", label: "Heddiw", days: 0 },
                        { id: "two-weeks", label: "+2", days: 14 },
                        { id: "next-month", label: "+1m", months: 1 },
                    ],
                    onChange,
                    onShortcut,
                })}
            />,
        );
        open();
        fireEvent.click(screen.getByText("+2"));
        expect(onShortcut).toHaveBeenCalledWith("two-weeks", "2026-03-29");
        expect(onChange).toHaveBeenCalledWith("2026-03-29");
    });

    test("§7.32 a month shortcut uses calendar months, not 30 days", () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                {...base({
                    value: "2026-03-15",
                    shortcuts: [{ id: "m", label: "+1m", months: 1 }],
                    onChange,
                })}
            />,
        );
        open();
        fireEvent.click(screen.getByText("+1m"));
        expect(onChange).toHaveBeenCalledWith("2026-04-15");
    });

    test("§7.33 a shortcut resolving to a blocked date does nothing", () => {
        const onChange = vi.fn();
        const onShortcut = vi.fn();
        render(
            <DateTimePicker
                {...base({
                    value: "2026-03-15",
                    max: "2026-03-20",
                    shortcuts: [{ id: "far", label: "+4w", days: 28 }],
                    onChange,
                    onShortcut,
                })}
            />,
        );
        open();
        fireEvent.click(screen.getByText("+4w"));
        expect(onShortcut).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });
});

// =====================================================================
// §7.34–§7.39 — typed input
// =====================================================================

describe("DateTimePicker — typed input", () => {
    test("§7.34 typing an ISO date and blurring commits it", () => {
        const onChange = vi.fn();
        render(<DateTimePicker {...base({ onChange })} />);
        fireEvent.change(field(), { target: { value: "2026-03-15" } });
        fireEvent.blur(field());
        expect(onChange).toHaveBeenCalledWith("2026-03-15");
        expect(hidden().value).toBe("2026-03-15");
    });

    test("§7.35 typing a locale-ordered numeric date commits the right day", () => {
        const onChange = vi.fn();
        render(<DateTimePicker {...base({ locale: "en-GB", onChange })} />);
        fireEvent.change(field(), { target: { value: "03/04/2026" } });
        fireEvent.keyDown(field(), { key: "Enter" });
        expect(onChange).toHaveBeenCalledWith("2026-04-03");
    });

    test("§7.36 unparseable text marks the field invalid and does not commit", () => {
        const onChange = vi.fn();
        const onInvalidInput = vi.fn();
        render(
            <DateTimePicker
                {...base({ value: "2026-03-15", onChange, onInvalidInput })}
            />,
        );
        fireEvent.change(field(), { target: { value: "sometime soon" } });
        fireEvent.blur(field());
        expect(onInvalidInput).toHaveBeenCalledWith("sometime soon");
        expect(onChange).not.toHaveBeenCalled();
        expect(field().getAttribute("aria-invalid")).toBe("true");
        // The text the user typed stays put: silently reverting it is how
        // someone submits a form still believing they changed the date.
        expect(field().value).toBe("sometime soon");
        expect(hidden().value).toBe("2026-03-15");
    });

    test("§7.37 text parsing to an out-of-range date is rejected the same way", () => {
        const onChange = vi.fn();
        const onInvalidInput = vi.fn();
        render(
            <DateTimePicker
                {...base({
                    value: "2026-03-15",
                    max: "2026-03-20",
                    onChange,
                    onInvalidInput,
                })}
            />,
        );
        fireEvent.change(field(), { target: { value: "2026-12-25" } });
        fireEvent.blur(field());
        expect(onInvalidInput).toHaveBeenCalledWith("2026-12-25");
        expect(onChange).not.toHaveBeenCalled();
        expect(field().getAttribute("aria-invalid")).toBe("true");
    });

    test("§7.38 clearing the field commits an empty value", () => {
        const onChange = vi.fn();
        render(
            <ControlledDateTimePicker
                {...base({})}
                initialValue="2026-03-15"
                onChange={onChange}
            />,
        );
        fireEvent.change(field(), { target: { value: "" } });
        fireEvent.blur(field());
        expect(onChange).toHaveBeenCalledWith("");
        expect(hidden().value).toBe("");
    });

    test("§7.39 a parseInput prop overrides the built-in parser", () => {
        const onChange = vi.fn();
        const parseInput = (text: string) => (text === "xmas" ? "2026-12-25" : null);
        render(<DateTimePicker {...base({ parseInput, onChange })} />);
        fireEvent.change(field(), { target: { value: "xmas" } });
        fireEvent.blur(field());
        expect(onChange).toHaveBeenCalledWith("2026-12-25");
    });
});

// =====================================================================
// §7.40–§7.44 — time and datetime
// =====================================================================

describe("DateTimePicker — time and datetime", () => {
    test("§7.40 time mode renders hour and minute selects and no grid", () => {
        render(
            <DateTimePicker
                {...base({ mode: "time", labels: TIME_LABELS, value: "09:30" })}
            />,
        );
        open();
        expect(document.querySelector(".date-time-picker-calendar")).toBeNull();
        const hour = document.querySelector(
            ".date-time-picker-hour",
        ) as HTMLSelectElement;
        const minute = document.querySelector(
            ".date-time-picker-minute",
        ) as HTMLSelectElement;
        expect(hour.value).toBe("9");
        expect(minute.value).toBe("30");
    });

    test("§7.41 minuteStep controls the minute options", () => {
        render(
            <DateTimePicker
                {...base({
                    mode: "time",
                    labels: TIME_LABELS,
                    value: "09:30",
                    minuteStep: 15,
                })}
            />,
        );
        open();
        const options = Array.from(
            document.querySelectorAll(".date-time-picker-minute option"),
        ).map((o) => o.textContent);
        expect(options).toEqual(["00", "15", "30", "45"]);
    });

    test("§7.42 datetime mode renders both the grid and the time selects", () => {
        render(
            <DateTimePicker
                {...base({
                    mode: "datetime",
                    labels: TIME_LABELS,
                    value: "2026-03-15T09:30",
                })}
            />,
        );
        open();
        expect(document.querySelector(".date-time-picker-calendar")).not.toBeNull();
        expect(document.querySelector(".date-time-picker-hour")).not.toBeNull();
    });

    test("§7.43 datetime commits date and time together", () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                {...base({
                    mode: "datetime",
                    labels: TIME_LABELS,
                    value: "2026-03-15T09:30",
                    onChange,
                })}
            />,
        );
        open();
        // In datetime mode a day click is pending only — the user still has
        // a time to set.
        fireEvent.click(day("2026-03-20"));
        expect(onChange).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText(TIME_LABELS.confirm));
        expect(onChange).toHaveBeenCalledWith("2026-03-20T09:30");
    });

    test("§7.44 hour12 renders a meridiem select labelled by the locale", () => {
        render(
            <DateTimePicker
                {...base({
                    mode: "time",
                    labels: TIME_LABELS,
                    value: "13:30",
                    hour12: true,
                    locale: "en-US",
                })}
            />,
        );
        open();
        const meridiem = document.querySelector(
            ".date-time-picker-meridiem",
        ) as HTMLSelectElement;
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
    test("§7.45 weekday headings start on Monday for en-GB, Sunday for en-US", () => {
        const { unmount } = render(
            <DateTimePicker {...base({ locale: "en-GB", value: "2026-03-15" })} />,
        );
        open();
        const gb = Array.from(
            document.querySelectorAll(".date-time-picker-weekday"),
        ).map((th) => th.getAttribute("abbr"));
        expect(gb[0]).toBe("Monday");
        unmount();

        render(
            <DateTimePicker {...base({ locale: "en-US", value: "2026-03-15" })} />,
        );
        open();
        const us = Array.from(
            document.querySelectorAll(".date-time-picker-weekday"),
        ).map((th) => th.getAttribute("abbr"));
        expect(us[0]).toBe("Sunday");
    });

    test("§7.46 firstDayOfWeek overrides the locale", () => {
        render(
            <DateTimePicker
                {...base({ locale: "en-GB", firstDayOfWeek: 0, value: "2026-03-15" })}
            />,
        );
        open();
        const first = document
            .querySelector(".date-time-picker-weekday")
            ?.getAttribute("abbr");
        expect(first).toBe("Sunday");
    });

    test("§7.47 month names and day labels follow the locale", () => {
        render(<DateTimePicker {...base({ locale: "cy-GB", value: "2026-03-15" })} />);
        open();
        const period = document.querySelector(
            ".date-time-picker-period",
        ) as HTMLElement;
        // Welsh for March is "Mawrth"; the assertion is that the heading is
        // NOT the English month name, so the test does not depend on one
        // ICU version's exact spelling.
        expect(period.textContent?.trim()).not.toContain("March");
        expect(period.textContent?.trim()).toContain("2026");
        expect(day("2026-03-15").getAttribute("aria-label")).not.toContain("March");
    });

    test("§7.48 showWeekNumbers renders ISO week numbers", () => {
        render(
            <DateTimePicker
                {...base({
                    value: "2026-03-15",
                    showWeekNumbers: true,
                    labels: { ...LABELS, week: "Wk" },
                })}
            />,
        );
        open();
        expect(
            document
                .querySelector(".date-time-picker-week-heading")
                ?.textContent?.trim(),
        ).toBe("Wk");
        const weeks = Array.from(
            document.querySelectorAll(".date-time-picker-week"),
        ).map((th) => th.textContent?.trim());
        expect(weeks).toHaveLength(6);
        // The grid's first row starts 2026-02-23, which is ISO week 9.
        expect(weeks[0]).toBe("9");
    });
});
