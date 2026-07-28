import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  DateTimePicker,
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
  CALENDAR,
  type DateTimePickerLabels,
  type DateTimeShortcut,
  type DateTimePickerChangeDetail,
  type DateTimePickerShortcutDetail,
  type DateTimePickerInvalidDetail,
} from "./date-time-picker.js";

// Ensure the custom element is registered exactly once for the suite.
if (
  typeof customElements !== "undefined" &&
  !customElements.get("date-time-picker")
) {
  customElements.define("date-time-picker", DateTimePicker);
}

/**
 * The six required strings. Deliberately not English-looking
 * placeholders: every assertion that reads a label reads it from here,
 * so a future default sneaking back into the component would fail
 * rather than blend in.
 */
const LABELS: DateTimePickerLabels = {
  previousYear: "PrevYear",
  previousMonth: "PrevMonth",
  nextMonth: "NextMonth",
  nextYear: "NextYear",
  confirm: "Commit",
  cancel: "Dismiss",
};

const TIME_LABELS: DateTimePickerLabels = {
  ...LABELS,
  hour: "Hr",
  minute: "Min",
  meridiem: "Half",
};

/** A fixed "today" so grid contents are deterministic. 2026-03-15, a Sunday. */
const TODAY = new Date(2026, 2, 15, 10, 30);

type MountOptions = {
  labels?: DateTimePickerLabels;
  shortcuts?: DateTimeShortcut[];
  onChange?: (value: string) => void;
  onShortcut?: (id: string, isoDate: string) => void;
  onInvalidInput?: (text: string) => void;
  isDateDisabled?: (isoDate: string) => boolean;
  formatValue?: (value: string) => string;
  parseInput?: (text: string) => string | null;
  tag?: string;
};

function mount(
  attrs: Record<string, string>,
  opts: MountOptions = {},
): DateTimePicker {
  const { tag = "date-time-picker", labels = LABELS } = opts;
  const el = document.createElement(tag) as DateTimePicker;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  // labels / shortcuts / callbacks are property-only — see spec §4.3.
  // Assigning before append means the first render already has them.
  el.labels = labels;
  if (opts.shortcuts) el.shortcuts = opts.shortcuts;
  if (opts.onChange) el.onChange = opts.onChange;
  if (opts.onShortcut) el.onShortcut = opts.onShortcut;
  if (opts.onInvalidInput) el.onInvalidInput = opts.onInvalidInput;
  if (opts.isDateDisabled) el.isDateDisabled = opts.isDateDisabled;
  if (opts.formatValue) el.formatValue = opts.formatValue;
  if (opts.parseInput) el.parseInput = opts.parseInput;
  document.body.appendChild(el);
  return el;
}

function base(attrs: Record<string, string> = {}): Record<string, string> {
  return { label: "Pick a date", locale: "en-GB", ...attrs };
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
const byText = (className: string, text: string): HTMLElement | null =>
  Array.from(document.querySelectorAll<HTMLElement>(className)).find(
    (el) => el.textContent?.trim() === text,
  ) ?? null;

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

function press(
  el: Element,
  key: string,
  extra: Partial<KeyboardEventInit> = {},
): void {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extra }),
  );
}

function type(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function blur(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent("blur"));
}

/** Flush the microtask queue: `queueMicrotask` schedules focus/close work. */
async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

async function open(): Promise<void> {
  click(trigger());
  await flush();
}

beforeEach(() => {
  document.body.replaceChildren();
  vi.useFakeTimers();
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

// =====================================================================
// §7.1–§7.9 — pure arithmetic
// =====================================================================

describe("<date-time-picker> — civil-date arithmetic", () => {
  test("§7.1 parseIsoDate rejects impossible dates and accepts real ones", () => {
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
    expect(parseIsoDate("2026-00-10")).toBeNull();
    expect(parseIsoDate("nonsense")).toBeNull();
    expect(parseIsoDate("2026-02-28")).toEqual({ year: 2026, month: 2, day: 28 });
  });

  test("§7.1 daysInMonth handles leap years", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
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
    expect(weekdayOf("2026-03-15")).toBe(0);
    expect(weekdayOf("2026-03-16")).toBe(1);
    expect(weekdayOf("2026-03-21")).toBe(6);
  });

  test("§7.3 isoWeek matches ISO-8601 on the hard cases", () => {
    expect(isoWeek("2026-01-01")).toBe(1);
    expect(isoWeek("2021-01-03")).toBe(53);
    expect(isoWeek("2024-12-30")).toBe(1);
  });

  test("§7.4 toEpochDay and fromEpochDay round-trip", () => {
    const date = { year: 2026, month: 3, day: 15 };
    expect(fromEpochDay(toEpochDay(date))).toEqual(date);
    expect(toEpochDay({ year: 1970, month: 1, day: 1 })).toBe(0);
  });

  test("§7.5 splitValue and joinValue round-trip per mode", () => {
    expect(splitValue("2026-03-15", "date")).toEqual({ date: "2026-03-15", time: "" });
    expect(splitValue("09:30", "time")).toEqual({ date: "", time: "09:30" });
    expect(splitValue("2026-03-15T09:30", "datetime")).toEqual({
      date: "2026-03-15",
      time: "09:30",
    });
    expect(joinValue("2026-03-15", "09:30", "datetime")).toBe("2026-03-15T09:30");
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
    expect(monthMatrix(2026, 2, 0)).toHaveLength(6);
  });

  test("§7.7 firstDayOfWeekFor follows the locale, defaulting to Monday", () => {
    expect(firstDayOfWeekFor("en-GB")).toBe(1);
    expect(firstDayOfWeekFor("en-US")).toBe(0);
    expect(firstDayOfWeekFor("cy-GB")).toBe(1);
    expect(firstDayOfWeekFor("xx-ZZ")).toBe(1);
    expect(firstDayOfWeekFor(undefined)).toBe(1);
  });

  test("§7.8 parseDateInput reads ISO, locale numerics, and written months", () => {
    expect(parseDateInput("2026-03-15", "en-GB")).toBe("2026-03-15");
    expect(parseDateInput("03/04/2026", "en-GB")).toBe("2026-04-03");
    expect(parseDateInput("03/04/2026", "en-US")).toBe("2026-03-04");
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

describe("<date-time-picker> — markup", () => {
  test("§7.10 trigger wires aria-haspopup, aria-expanded and aria-controls", () => {
    mount(base());
    const button = trigger();
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    const controlled = document.getElementById(button.getAttribute("aria-controls") ?? "");
    expect(controlled?.getAttribute("role")).toBe("dialog");
    expect(controlled?.getAttribute("aria-modal")).toBe("true");
  });

  test("§7.10 the glyph is rendered and hidden from assistive technology", () => {
    mount(base());
    const icon = document.querySelector(".date-time-picker-icon");
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    // U+1F4C5 CALENDAR, with the text-presentation selector.
    expect(icon?.textContent).toBe(CALENDAR);
  });

  test("§7.11 aria-label names both the trigger and the dialog", () => {
    mount(base({ label: "Appointment date" }));
    expect(trigger().getAttribute("aria-label")).toBe("Appointment date");
    expect(dialog().getAttribute("aria-label")).toBe("Appointment date");
  });

  test("§7.12 the hidden input carries the ISO value, the field the display", () => {
    mount(base({ name: "appointment", value: "2026-03-15" }));
    expect(hidden().getAttribute("name")).toBe("appointment");
    expect(hidden().value).toBe("2026-03-15");
    // The visible field is localised and, critically, has no `name`:
    // posting a display string next to the ISO value is how a backend
    // ends up guessing.
    expect(field().value).toContain("2026");
    expect(field().hasAttribute("name")).toBe(false);
  });

  test("§7.13 the dialog is hidden until the trigger is activated", async () => {
    mount(base());
    expect(dialog().hasAttribute("hidden")).toBe(true);
    await open();
    expect(dialog().hasAttribute("hidden")).toBe(false);
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.14 the grid is 6 x 7 with data-outside on adjacent-month days", async () => {
    mount(base({ value: "2026-03-15" }));
    await open();
    expect(grid().querySelectorAll("tbody tr")).toHaveLength(6);
    expect(days()).toHaveLength(42);
    // March 2026 starts on a Sunday; with a Monday-first grid the six
    // preceding days come from February.
    expect(day("2026-02-23")?.hasAttribute("data-outside")).toBe(true);
    expect(day("2026-03-15")?.hasAttribute("data-outside")).toBe(false);
  });

  test("§7.15 exactly one day is tabbable (roving tabindex)", async () => {
    mount(base({ value: "2026-03-15" }));
    await open();
    const tabbable = days().filter((d) => d.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0].dataset.date).toBe("2026-03-15");
  });

  test("§7.16 the class attribute lands on the rendered root and data-mode reflects mode", () => {
    mount(base({ class: "extra", mode: "datetime" }), { labels: TIME_LABELS });
    expect(root().className).toBe("date-time-picker extra");
    expect(root().getAttribute("data-mode")).toBe("datetime");
  });

  test("§7.17 today carries data-today and aria-current", async () => {
    mount(base());
    await open();
    const todayCell = day("2026-03-15");
    expect(todayCell.hasAttribute("data-today")).toBe(true);
    expect(todayCell.getAttribute("aria-current")).toBe("date");
  });
});

// =====================================================================
// §7.18–§7.23 — selection and commit
// =====================================================================

describe("<date-time-picker> — commit and discard", () => {
  test("§7.18 clicking a day in date mode commits, notifies and closes", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange });
    await open();
    click(day("2026-03-20"));
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-03-20");
    expect(hidden().value).toBe("2026-03-20");
    expect(dialog().hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 with confirm-on-select false, only Confirm commits", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15", "confirm-on-select": "false" }), { onChange });
    await open();
    click(day("2026-03-20"));
    await flush();
    expect(onChange).not.toHaveBeenCalled();
    expect(hidden().value).toBe("2026-03-15");

    click(byText(".date-time-picker-confirm", LABELS.confirm)!);
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-03-20");
    expect(hidden().value).toBe("2026-03-20");
  });

  test("§7.20 Cancel closes without changing the value", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15", "confirm-on-select": "false" }), { onChange });
    await open();
    click(day("2026-03-20"));
    click(byText(".date-time-picker-cancel", LABELS.cancel)!);
    await flush();
    expect(onChange).not.toHaveBeenCalled();
    expect(hidden().value).toBe("2026-03-15");
    expect(dialog().hasAttribute("hidden")).toBe(true);
  });

  test("§7.21 Escape closes without changing the value", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15", "confirm-on-select": "false" }), { onChange });
    await open();
    click(day("2026-03-20"));
    press(dialog(), "Escape");
    await flush();
    expect(onChange).not.toHaveBeenCalled();
    expect(hidden().value).toBe("2026-03-15");
    expect(dialog().hasAttribute("hidden")).toBe(true);
  });

  test("§7.22 the clear button renders only when labelled, and commits empty", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange });
    await open();
    expect(document.querySelector(".date-time-picker-clear")).toBeNull();
    document.body.replaceChildren();

    mount(base({ value: "2026-03-15" }), {
      labels: { ...LABELS, clear: "Wipe" },
      onChange,
    });
    await open();
    click(byText(".date-time-picker-clear", "Wipe")!);
    await flush();
    expect(onChange).toHaveBeenCalledWith("");
    expect(hidden().value).toBe("");
  });

  test("§7.23 onChange does not fire when the value is unchanged", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange });
    await open();
    click(day("2026-03-15"));
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });
});

// =====================================================================
// §7.24–§7.28 — keyboard
// =====================================================================

describe("<date-time-picker> — keyboard", () => {
  async function openAt(iso = "2026-03-15", extra: Record<string, string> = {}): Promise<void> {
    mount(base({ value: iso, ...extra }));
    await open();
  }

  test("§7.24 arrows move the cursor by a day and by a week", async () => {
    await openAt();
    press(grid(), "ArrowRight");
    await flush();
    expect(cursorDate()).toBe("2026-03-16");
    press(grid(), "ArrowLeft");
    await flush();
    expect(cursorDate()).toBe("2026-03-15");
    press(grid(), "ArrowDown");
    await flush();
    expect(cursorDate()).toBe("2026-03-22");
    press(grid(), "ArrowUp");
    await flush();
    expect(cursorDate()).toBe("2026-03-15");
  });

  test("§7.25 Home and End reach the ends of the week, per firstDayOfWeek", async () => {
    // 2026-03-18 is a Wednesday. Monday-first: Home → 16th, End → 22nd.
    await openAt("2026-03-18");
    press(grid(), "Home");
    await flush();
    expect(cursorDate()).toBe("2026-03-16");
    press(grid(), "End");
    await flush();
    expect(cursorDate()).toBe("2026-03-22");
  });

  test("§7.25 Home respects a Sunday-first week", async () => {
    await openAt("2026-03-18", { locale: "en-US" });
    press(grid(), "Home");
    await flush();
    expect(cursorDate()).toBe("2026-03-15");
  });

  test("§7.26 PageUp and PageDown page the month; Shift pages the year", async () => {
    await openAt();
    press(grid(), "PageDown");
    await flush();
    expect(cursorDate()).toBe("2026-04-15");
    press(grid(), "PageUp");
    await flush();
    expect(cursorDate()).toBe("2026-03-15");
    press(grid(), "PageDown", { shiftKey: true });
    await flush();
    expect(cursorDate()).toBe("2027-03-15");
    press(grid(), "PageUp", { shiftKey: true });
    await flush();
    expect(cursorDate()).toBe("2026-03-15");
  });

  test("§7.26 paging into a shorter month clamps the cursor day", async () => {
    await openAt("2026-01-31");
    press(grid(), "PageDown");
    await flush();
    expect(cursorDate()).toBe("2026-02-28");
  });

  test("§7.27 Enter on the grid selects the cursor's day", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange });
    await open();
    press(grid(), "ArrowRight");
    await flush();
    press(grid(), "Enter");
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-03-16");
  });

  test("§7.28 Alt+ArrowDown on the field opens the dialog", async () => {
    mount(base());
    expect(dialog().hasAttribute("hidden")).toBe(true);
    press(field(), "ArrowDown", { altKey: true });
    await flush();
    expect(dialog().hasAttribute("hidden")).toBe(false);
  });
});

// =====================================================================
// §7.29–§7.33 — range, vetoes, shortcuts
// =====================================================================

describe("<date-time-picker> — constraints and shortcuts", () => {
  test("§7.29 days outside min/max are disabled", async () => {
    mount(base({ value: "2026-03-15", min: "2026-03-10", max: "2026-03-20" }));
    await open();
    expect(day("2026-03-09").disabled).toBe(true);
    expect(day("2026-03-10").disabled).toBe(false);
    expect(day("2026-03-20").disabled).toBe(false);
    expect(day("2026-03-21").disabled).toBe(true);
  });

  test("§7.30 isDateDisabled vetoes individual days", async () => {
    // A weekends-closed clinic.
    const isDateDisabled = (iso: string) => weekdayOf(iso) === 0 || weekdayOf(iso) === 6;
    mount(base({ value: "2026-03-16" }), { isDateDisabled });
    await open();
    expect(day("2026-03-21").disabled).toBe(true); // Saturday
    expect(day("2026-03-22").disabled).toBe(true); // Sunday
    expect(day("2026-03-23").disabled).toBe(false); // Monday
  });

  test("§7.31 clicking a disabled day does not commit", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15", max: "2026-03-16" }), { onChange });
    await open();
    click(day("2026-03-25"));
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  test("§7.32 a shortcut moves the selection and reports its id", async () => {
    const onChange = vi.fn();
    const onShortcut = vi.fn();
    mount(base({ value: "2026-03-15" }), {
      shortcuts: [
        { id: "today", label: "Heddiw", days: 0 },
        { id: "two-weeks", label: "+2", days: 14 },
        { id: "next-month", label: "+1m", months: 1 },
      ],
      onChange,
      onShortcut,
    });
    await open();
    click(byText(".date-time-picker-shortcut", "+2")!);
    await flush();
    expect(onShortcut).toHaveBeenCalledWith("two-weeks", "2026-03-29");
    expect(onChange).toHaveBeenCalledWith("2026-03-29");
  });

  test("§7.32 a month shortcut uses calendar months, not 30 days", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), {
      shortcuts: [{ id: "m", label: "+1m", months: 1 }],
      onChange,
    });
    await open();
    click(byText(".date-time-picker-shortcut", "+1m")!);
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-04-15");
  });

  test("§7.33 a shortcut resolving to a blocked date does nothing", async () => {
    const onChange = vi.fn();
    const onShortcut = vi.fn();
    mount(base({ value: "2026-03-15", max: "2026-03-20" }), {
      shortcuts: [{ id: "far", label: "+4w", days: 28 }],
      onChange,
      onShortcut,
    });
    await open();
    click(byText(".date-time-picker-shortcut", "+4w")!);
    await flush();
    expect(onShortcut).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});

// =====================================================================
// §7.34–§7.39 — typed input
// =====================================================================

describe("<date-time-picker> — typed input", () => {
  test("§7.34 typing an ISO date and blurring commits it", async () => {
    const onChange = vi.fn();
    mount(base(), { onChange });
    type(field(), "2026-03-15");
    blur(field());
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-03-15");
    expect(hidden().value).toBe("2026-03-15");
  });

  test("§7.35 typing a locale-ordered numeric date commits the right day", async () => {
    const onChange = vi.fn();
    mount(base({ locale: "en-GB" }), { onChange });
    type(field(), "03/04/2026");
    press(field(), "Enter");
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-04-03");
  });

  test("§7.36 unparseable text marks the field invalid and does not commit", async () => {
    const onChange = vi.fn();
    const onInvalidInput = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange, onInvalidInput });
    type(field(), "sometime soon");
    blur(field());
    await flush();
    expect(onInvalidInput).toHaveBeenCalledWith("sometime soon");
    expect(onChange).not.toHaveBeenCalled();
    expect(field().getAttribute("aria-invalid")).toBe("true");
    // The text the user typed stays put: silently reverting it is how
    // someone submits a form still believing they changed the date.
    expect(field().value).toBe("sometime soon");
    expect(hidden().value).toBe("2026-03-15");
  });

  test("§7.37 text parsing to an out-of-range date is rejected the same way", async () => {
    const onChange = vi.fn();
    const onInvalidInput = vi.fn();
    mount(base({ value: "2026-03-15", max: "2026-03-20" }), { onChange, onInvalidInput });
    type(field(), "2026-12-25");
    blur(field());
    await flush();
    expect(onInvalidInput).toHaveBeenCalledWith("2026-12-25");
    expect(onChange).not.toHaveBeenCalled();
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  test("§7.38 clearing the field commits an empty value", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15" }), { onChange });
    type(field(), "");
    blur(field());
    await flush();
    expect(onChange).toHaveBeenCalledWith("");
    expect(hidden().value).toBe("");
  });

  test("§7.39 a parseInput prop overrides the built-in parser", async () => {
    const onChange = vi.fn();
    const parseInput = (text: string) => (text === "xmas" ? "2026-12-25" : null);
    mount(base(), { onChange, parseInput });
    type(field(), "xmas");
    blur(field());
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-12-25");
  });
});

// =====================================================================
// §7.40–§7.44 — time and datetime
// =====================================================================

describe("<date-time-picker> — time and datetime", () => {
  test("§7.40 time mode renders hour and minute selects and no grid", async () => {
    mount(base({ mode: "time", value: "09:30" }), { labels: TIME_LABELS });
    await open();
    expect(document.querySelector(".date-time-picker-calendar")).toBeNull();
    const hour = document.querySelector(".date-time-picker-hour") as HTMLSelectElement;
    const minute = document.querySelector(".date-time-picker-minute") as HTMLSelectElement;
    expect(hour.value).toBe("9");
    expect(minute.value).toBe("30");
  });

  test("§7.41 minuteStep controls the minute options", async () => {
    mount(base({ mode: "time", value: "09:30", "minute-step": "15" }), {
      labels: TIME_LABELS,
    });
    await open();
    const options = Array.from(
      document.querySelectorAll(".date-time-picker-minute option"),
    ).map((o) => o.textContent);
    expect(options).toEqual(["00", "15", "30", "45"]);
  });

  test("§7.42 datetime mode renders both the grid and the time selects", async () => {
    mount(base({ mode: "datetime", value: "2026-03-15T09:30" }), { labels: TIME_LABELS });
    await open();
    expect(document.querySelector(".date-time-picker-calendar")).not.toBeNull();
    expect(document.querySelector(".date-time-picker-hour")).not.toBeNull();
  });

  test("§7.43 datetime commits date and time together", async () => {
    const onChange = vi.fn();
    mount(base({ mode: "datetime", value: "2026-03-15T09:30" }), {
      labels: TIME_LABELS,
      onChange,
    });
    await open();
    // In datetime mode a day click is pending only — the user still has
    // a time to set.
    click(day("2026-03-20"));
    await flush();
    expect(onChange).not.toHaveBeenCalled();
    click(byText(".date-time-picker-confirm", TIME_LABELS.confirm)!);
    await flush();
    expect(onChange).toHaveBeenCalledWith("2026-03-20T09:30");
  });

  test("§7.44 hour12 renders a meridiem select labelled by the locale", async () => {
    mount(base({ mode: "time", value: "13:30", hour12: "true", locale: "en-US" }), {
      labels: TIME_LABELS,
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

describe("<date-time-picker> — locale", () => {
  test("§7.45 weekday headings start on Monday for en-GB, Sunday for en-US", async () => {
    mount(base({ locale: "en-GB", value: "2026-03-15" }));
    await open();
    const gb = Array.from(document.querySelectorAll(".date-time-picker-weekday")).map((th) =>
      th.getAttribute("abbr"),
    );
    expect(gb[0]).toBe("Monday");
    document.body.replaceChildren();

    mount(base({ locale: "en-US", value: "2026-03-15" }));
    await open();
    const us = Array.from(document.querySelectorAll(".date-time-picker-weekday")).map((th) =>
      th.getAttribute("abbr"),
    );
    expect(us[0]).toBe("Sunday");
  });

  test("§7.46 firstDayOfWeek overrides the locale", async () => {
    mount(base({ locale: "en-GB", "first-day-of-week": "0", value: "2026-03-15" }));
    await open();
    const first = document.querySelector(".date-time-picker-weekday")?.getAttribute("abbr");
    expect(first).toBe("Sunday");
  });

  test("§7.47 month names and day labels follow the locale", async () => {
    mount(base({ locale: "cy-GB", value: "2026-03-15" }));
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
    mount(base({ value: "2026-03-15", "show-week-numbers": "" }), {
      labels: { ...LABELS, week: "Wk" },
    });
    await open();
    expect(
      document.querySelector(".date-time-picker-week-heading")?.textContent?.trim(),
    ).toBe("Wk");
    const weeks = Array.from(document.querySelectorAll(".date-time-picker-week")).map((th) =>
      th.textContent?.trim(),
    );
    expect(weeks).toHaveLength(6);
    // The grid's first row starts 2026-02-23, which is ISO week 9.
    expect(weeks[0]).toBe("9");
  });
});

// =====================================================================
// HTML custom-element surface — beyond §7
// =====================================================================

describe("<date-time-picker> — HTML custom-element surface", () => {
  test("nextDateTimePickerId-derived instance ids are stable and prefixed", () => {
    const el = mount(base());
    expect(el.dialogId).toMatch(/^date-time-picker-\d+-dialog$/);
  });

  test("attributes and properties mirror each other", async () => {
    const el = mount(base());
    el.label = "Choose a date";
    expect(el.getAttribute("label")).toBe("Choose a date");
    expect(trigger().getAttribute("aria-label")).toBe("Choose a date");

    el.value = "2026-05-01";
    expect(el.getAttribute("value")).toBe("2026-05-01");
    expect(hidden().value).toBe("2026-05-01");

    el.mode = "time";
    expect(el.getAttribute("mode")).toBe("time");
    expect(el.mode).toBe("time");
  });

  test("mode falls back to date for a missing or bogus attribute value", () => {
    const el = mount(base());
    expect(el.mode).toBe("date");
    el.setAttribute("mode", "nonsense");
    expect(el.mode).toBe("date");
  });

  test("labels and shortcuts are property-only", () => {
    const el = mount(base());
    expect(el.hasAttribute("labels")).toBe(false);
    expect(el.hasAttribute("shortcuts")).toBe(false);
    el.shortcuts = [{ id: "a", label: "A", days: 1 }];
    expect(el.shortcuts).toEqual([{ id: "a", label: "A", days: 1 }]);
  });

  test("shortcuts getter returns a copy, so callers cannot mutate internals", () => {
    const el = mount(base(), { shortcuts: [{ id: "a", label: "A", days: 1 }] });
    el.shortcuts.pop();
    expect(el.shortcuts.length).toBe(1);
  });

  test("hour12 falls back to the locale's own convention when unset", () => {
    const el = mount(base({ locale: "en-US" }));
    expect(el.hour12).toBe(true);
    el.hour12 = false;
    expect(el.getAttribute("hour12")).toBe("false");
    expect(el.hour12).toBe(false);
  });

  test("firstDayOfWeek falls back to the locale when unset", () => {
    const el = mount(base({ locale: "en-US" }));
    expect(el.firstDayOfWeek).toBe(0);
    el.firstDayOfWeek = 3;
    expect(el.firstDayOfWeek).toBe(3);
  });

  test("confirmOnSelect defaults to mode === date", () => {
    const el = mount(base({ mode: "datetime" }));
    expect(el.confirmOnSelect).toBe(false);
    el.mode = "date";
    expect(el.confirmOnSelect).toBe(true);
    el.confirmOnSelect = false;
    expect(el.confirmOnSelect).toBe(false);
  });

  test("a structural change (mode) closes the dialog rather than orphaning focus", async () => {
    const el = mount(base({ value: "2026-03-15" }));
    await open();
    expect(dialog().hasAttribute("hidden")).toBe(false);
    el.mode = "time";
    expect(el.open).toBe(false);
    expect(document.querySelector(".date-time-picker-calendar")).toBeNull();
  });

  test("a non-structural change (value) syncs in place without closing the dialog", async () => {
    const el = mount(base({ value: "2026-03-15" }));
    await open();
    expect(dialog().hasAttribute("hidden")).toBe(false);
    el.value = "2026-04-01";
    expect(dialog().hasAttribute("hidden")).toBe(false);
    expect(hidden().value).toBe("2026-04-01");
  });

  test("renderButtonContent can be overridden by a subclass, and re-runs on state sync", async () => {
    class CustomDateTimePicker extends DateTimePicker {
      renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "custom");
        span.setAttribute("data-open", String(this.open));
        span.textContent = "custom glyph";
        return span;
      }
    }
    if (!customElements.get("custom-date-time-picker")) {
      customElements.define("custom-date-time-picker", CustomDateTimePicker);
    }
    mount(base(), { tag: "custom-date-time-picker" });
    const custom = document.body.querySelector<HTMLElement>('[data-testid="custom"]')!;
    expect(document.body.querySelector(".date-time-picker-icon")).toBeNull();
    expect(custom.closest("button")).toBe(trigger());
    expect(custom.getAttribute("data-open")).toBe("false");
    // ...and the base class's aria wiring survived.
    expect(trigger().getAttribute("aria-label")).toBe("Pick a date");

    click(trigger());
    await flush();
    expect(
      document.body.querySelector('[data-testid="custom"]')!.getAttribute("data-open"),
    ).toBe("true");
  });

  test("the shortcut and invalidinput CustomEvents bubble with the documented detail", async () => {
    const shortcutSeen: DateTimePickerShortcutDetail[] = [];
    const invalidSeen: DateTimePickerInvalidDetail[] = [];
    const changeSeen: DateTimePickerChangeDetail[] = [];
    document.body.addEventListener("shortcut", (e) => {
      shortcutSeen.push((e as CustomEvent<DateTimePickerShortcutDetail>).detail);
    });
    document.body.addEventListener("invalidinput", (e) => {
      invalidSeen.push((e as CustomEvent<DateTimePickerInvalidDetail>).detail);
    });
    document.body.addEventListener("datetimechange", (e) => {
      changeSeen.push((e as CustomEvent<DateTimePickerChangeDetail>).detail);
    });

    mount(base({ value: "2026-03-15" }), {
      shortcuts: [{ id: "tomorrow", label: "Tomorrow", days: 1 }],
    });
    await open();
    click(byText(".date-time-picker-shortcut", "Tomorrow")!);
    await flush();
    expect(shortcutSeen.at(-1)).toEqual({ id: "tomorrow", isoDate: "2026-03-16" });
    expect(changeSeen.at(-1)).toEqual({ value: "2026-03-16" });

    type(field(), "not a date");
    blur(field());
    await flush();
    expect(invalidSeen.at(-1)).toEqual({ text: "not a date" });
  });

  test("nothing is written to localStorage", async () => {
    mount(base({ value: "2026-03-15" }));
    await open();
    click(day("2026-03-20"));
    await flush();
    // Unlike the three preference helpers, a date is data, not a
    // preference: no persistence.
    expect(localStorage.length).toBe(0);
    expect(document.documentElement.hasAttribute("data-date-time")).toBe(false);
  });

  test("disconnecting removes the document click listener", async () => {
    const el = mount(base({ value: "2026-03-15" }));
    await open();
    expect(el.open).toBe(true);
    el.remove();
    click(document.body);
    expect(el.open).toBe(true);
  });

  test("clicking outside the control closes the dialog without committing", async () => {
    const onChange = vi.fn();
    mount(base({ value: "2026-03-15", "confirm-on-select": "false" }), { onChange });
    await open();
    click(day("2026-03-20"));
    click(document.body);
    await flush();
    expect(dialog().hasAttribute("hidden")).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  test("module is import-safe under SSR", async () => {
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
      const mod = await import("./index.js");
      expect(mod.DateTimePicker).toBeDefined();
      expect(mod.CALENDAR).toBe("\u{1F4C5}\uFE0E");
    } finally {
      (globalThis as any).customElements = original;
    }
  });
});
