import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  CALENDAR,
  DateTimePicker,
  DateTimePickerIcon,
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
  type DateTimePickerLabels,
  type DateTimeShortcut,
  type ShortcutEvent,
} from "./date-time-picker.component";

/**
 * The six required strings. Deliberately not English-looking placeholders:
 * every assertion that reads a label reads it from here, so a future
 * default sneaking back into the component would fail rather than blend in.
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

/** Resolve on the next macrotask; only `Date` is faked, so real timers run. */
function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

/** Fixtures created by a test, destroyed after it so listeners unwind. */
let fixtures: ComponentFixture<unknown>[] = [];

/** Create + render a DateTimePicker with the supplied inputs. */
function mount(
  inputs: Record<string, unknown> = {},
): ComponentFixture<DateTimePicker> {
  const fixture = TestBed.createComponent(DateTimePicker);
  fixture.componentRef.setInput("label", "Pick a date");
  fixture.componentRef.setInput("labels", LABELS);
  fixture.componentRef.setInput("locale", "en-GB");
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function q<T extends Element>(
  fixture: ComponentFixture<unknown>,
  sel: string,
): T {
  return fixture.nativeElement.querySelector(sel) as T;
}

function qa<T extends Element>(
  fixture: ComponentFixture<unknown>,
  sel: string,
): T[] {
  return Array.from(fixture.nativeElement.querySelectorAll(sel)) as T[];
}

const root = (fixture: ComponentFixture<unknown>) =>
  q<HTMLElement>(fixture, ".date-time-picker");
const trigger = (fixture: ComponentFixture<unknown>) =>
  q<HTMLButtonElement>(fixture, ".date-time-picker-button");
const dialog = (fixture: ComponentFixture<unknown>) =>
  q<HTMLElement>(fixture, ".date-time-picker-dialog");
const grid = (fixture: ComponentFixture<unknown>) =>
  q<HTMLElement>(fixture, ".date-time-picker-calendar");
const field = (fixture: ComponentFixture<unknown>) =>
  q<HTMLInputElement>(fixture, ".date-time-picker-input");
const hidden = (fixture: ComponentFixture<unknown>) =>
  q<HTMLInputElement>(fixture, 'input[type="hidden"]');
const days = (fixture: ComponentFixture<unknown>) =>
  qa<HTMLButtonElement>(fixture, ".date-time-picker-day");
const day = (fixture: ComponentFixture<unknown>, iso: string) =>
  q<HTMLButtonElement>(fixture, `[data-date="${iso}"]`);
const cursorDate = (fixture: ComponentFixture<unknown>) =>
  days(fixture).find((d) => d.getAttribute("tabindex") === "0")?.dataset
    .date ?? "";

/** Dispatch a bubbling click and re-render. */
function click(fixture: ComponentFixture<unknown>, target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

/** Click an element, let queued microtasks settle, and re-render. */
async function clickSettled(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
): Promise<void> {
  click(fixture, target);
  await flush();
  fixture.detectChanges();
}

/** Dispatch a keydown and re-render. */
function keydown(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
  key: string,
  opts: KeyboardEventInit = {},
): void {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }),
  );
  fixture.detectChanges();
}

/** Keydown, let queued microtasks settle, and re-render. */
async function keydownSettled(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
  key: string,
  opts: KeyboardEventInit = {},
): Promise<void> {
  keydown(fixture, target, key, opts);
  await flush();
  fixture.detectChanges();
}

/** Type into a field and fire its input event. */
function typeInto(
  fixture: ComponentFixture<unknown>,
  target: HTMLInputElement,
  value: string,
): void {
  target.value = value;
  target.dispatchEvent(new Event("input", { bubbles: true }));
  fixture.detectChanges();
}

async function blurSettled(
  fixture: ComponentFixture<unknown>,
  target: HTMLElement,
): Promise<void> {
  target.dispatchEvent(new FocusEvent("blur"));
  await flush();
  fixture.detectChanges();
}

/** Open the dialog and let its focus microtask settle. */
async function open(fixture: ComponentFixture<unknown>): Promise<void> {
  await clickSettled(fixture, trigger(fixture));
}

beforeEach(() => {
  // Only `Date` is faked, so `setTimeout`/`queueMicrotask` still run for
  // real — `flush()` above depends on that.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(TODAY);
});

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
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
    // The same digits mean different days in the two locales, and that is
    // the entire point of deriving the order from Intl.
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

@Component({
  standalone: true,
  imports: [DateTimePicker],
  template: `
    <lily-date-time-picker
      data-testid="dtp"
      label="Pick a date"
      [labels]="labels"
      mode="datetime"
    />
  `,
})
class HostAttrHost {
  readonly labels = TIME_LABELS;
}

describe("DateTimePicker — markup", () => {
  test("§7.10 trigger wires aria-haspopup, aria-expanded and aria-controls", () => {
    const fixture = mount();
    const button = trigger(fixture);
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    const controlled = fixture.nativeElement.querySelector(
      `#${button.getAttribute("aria-controls")}`,
    );
    expect(controlled?.getAttribute("role")).toBe("dialog");
    expect(controlled?.getAttribute("aria-modal")).toBe("true");
  });

  test("§7.10 the glyph is rendered and hidden from assistive technology", () => {
    const fixture = mount();
    const icon = q<HTMLElement>(fixture, ".date-time-picker-icon");
    expect(icon).toBeTruthy();
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    // U+1F4C5 CALENDAR, with the text-presentation selector.
    expect(icon.textContent).toBe("\u{1F4C5}\uFE0E");
    expect(CALENDAR).toBe("\u{1F4C5}\uFE0E");
  });

  test("§7.11 aria-label names both the trigger and the dialog", () => {
    const fixture = mount({ label: "Appointment date" });
    expect(trigger(fixture).getAttribute("aria-label")).toBe(
      "Appointment date",
    );
    expect(dialog(fixture).getAttribute("aria-label")).toBe(
      "Appointment date",
    );
  });

  test("§7.12 the hidden input carries the ISO value, the field the display", () => {
    const fixture = mount({ name: "appointment", value: "2026-03-15" });
    expect(hidden(fixture).getAttribute("name")).toBe("appointment");
    expect(hidden(fixture).value).toBe("2026-03-15");
    // The visible field is localised and, critically, has no `name`:
    // posting a display string next to the ISO value is how a backend
    // ends up guessing.
    expect(field(fixture).value).toContain("2026");
    expect(field(fixture).hasAttribute("name")).toBe(false);
  });

  test("§7.13 the dialog is hidden until the trigger is activated", async () => {
    const fixture = mount();
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
    await open(fixture);
    expect(dialog(fixture).hasAttribute("hidden")).toBe(false);
    expect(trigger(fixture).getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.14 the grid is 6 x 7 with data-outside on adjacent-month days", async () => {
    const fixture = mount({ value: "2026-03-15" });
    await open(fixture);
    expect(qa(fixture, "tbody tr")).toHaveLength(6);
    expect(days(fixture)).toHaveLength(42);
    // March 2026 starts on a Sunday; with a Monday-first grid the six
    // preceding days come from February.
    expect(day(fixture, "2026-02-23")?.hasAttribute("data-outside")).toBe(
      true,
    );
    expect(day(fixture, "2026-03-15")?.hasAttribute("data-outside")).toBe(
      false,
    );
  });

  test("§7.15 exactly one day is tabbable (roving tabindex)", async () => {
    const fixture = mount({ value: "2026-03-15" });
    await open(fixture);
    const tabbable = days(fixture).filter(
      (d) => d.getAttribute("tabindex") === "0",
    );
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0].dataset.date).toBe("2026-03-15");
  });

  test("§7.16 an attribute on the host tag lands on the host; data-mode reflects mode", () => {
    const fixture = TestBed.createComponent(HostAttrHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    const host = fixture.nativeElement.querySelector("lily-date-time-picker");
    expect(host.getAttribute("data-testid")).toBe("dtp");
    expect(root(fixture).getAttribute("data-mode")).toBe("datetime");
  });

  test("§7.17 today carries data-today and aria-current", async () => {
    const fixture = mount();
    await open(fixture);
    const todayCell = day(fixture, "2026-03-15");
    expect(todayCell.hasAttribute("data-today")).toBe(true);
    expect(todayCell.getAttribute("aria-current")).toBe("date");
  });
});

// =====================================================================
// §7.18–§7.23 — selection and commit
// =====================================================================

describe("DateTimePicker — commit and discard", () => {
  test("§7.18 clicking a day in date mode commits, notifies and closes", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-20"));
    expect(changed).toHaveBeenCalledWith("2026-03-20");
    expect(hidden(fixture).value).toBe("2026-03-20");
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 with confirmOnSelect false, only Confirm commits", async () => {
    const fixture = mount({ value: "2026-03-15", confirmOnSelect: false });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-20"));
    expect(changed).not.toHaveBeenCalled();
    expect(hidden(fixture).value).toBe("2026-03-15");

    await clickSettled(fixture, q(fixture, ".date-time-picker-confirm"));
    expect(changed).toHaveBeenCalledWith("2026-03-20");
    expect(hidden(fixture).value).toBe("2026-03-20");
  });

  test("§7.20 Cancel closes without changing the value", async () => {
    const fixture = mount({ value: "2026-03-15", confirmOnSelect: false });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-20"));
    await clickSettled(fixture, q(fixture, ".date-time-picker-cancel"));
    expect(changed).not.toHaveBeenCalled();
    expect(hidden(fixture).value).toBe("2026-03-15");
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.21 Escape closes without changing the value", async () => {
    const fixture = mount({ value: "2026-03-15", confirmOnSelect: false });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-20"));
    await keydownSettled(fixture, dialog(fixture), "Escape");
    expect(changed).not.toHaveBeenCalled();
    expect(hidden(fixture).value).toBe("2026-03-15");
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
  });

  test("§7.22 the clear button renders only when labelled, and commits empty", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    expect(q(fixture, ".date-time-picker-clear")).toBeNull();
    fixture.destroy();
    fixtures = fixtures.filter((f) => f !== fixture);

    const fixture2 = mount({
      value: "2026-03-15",
      labels: { ...LABELS, clear: "Wipe" },
    });
    const changed2 = vi.fn();
    fixture2.componentInstance.change.subscribe(changed2);
    await open(fixture2);
    await clickSettled(fixture2, q(fixture2, ".date-time-picker-clear"));
    expect(changed2).toHaveBeenCalledWith("");
    expect(hidden(fixture2).value).toBe("");
  });

  test("§7.23 change does not fire when the value is unchanged", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-15"));
    expect(changed).not.toHaveBeenCalled();
  });
});

// =====================================================================
// §7.24–§7.28 — keyboard
// =====================================================================

describe("DateTimePicker — keyboard", () => {
  async function openAt(
    iso = "2026-03-15",
    extra: Record<string, unknown> = {},
  ): Promise<ComponentFixture<DateTimePicker>> {
    const fixture = mount({ value: iso, ...extra });
    await open(fixture);
    return fixture;
  }

  test("§7.24 arrows move the cursor by a day and by a week", async () => {
    const fixture = await openAt();
    await keydownSettled(fixture, grid(fixture), "ArrowRight");
    expect(cursorDate(fixture)).toBe("2026-03-16");
    await keydownSettled(fixture, grid(fixture), "ArrowLeft");
    expect(cursorDate(fixture)).toBe("2026-03-15");
    await keydownSettled(fixture, grid(fixture), "ArrowDown");
    expect(cursorDate(fixture)).toBe("2026-03-22");
    await keydownSettled(fixture, grid(fixture), "ArrowUp");
    expect(cursorDate(fixture)).toBe("2026-03-15");
  });

  test("§7.25 Home and End reach the ends of the week, per firstDayOfWeek", async () => {
    // 2026-03-18 is a Wednesday. Monday-first: Home → 16th, End → 22nd.
    const fixture = await openAt("2026-03-18");
    await keydownSettled(fixture, grid(fixture), "Home");
    expect(cursorDate(fixture)).toBe("2026-03-16");
    await keydownSettled(fixture, grid(fixture), "End");
    expect(cursorDate(fixture)).toBe("2026-03-22");
  });

  test("§7.25 Home respects a Sunday-first week", async () => {
    const fixture = await openAt("2026-03-18", { locale: "en-US" });
    await keydownSettled(fixture, grid(fixture), "Home");
    expect(cursorDate(fixture)).toBe("2026-03-15");
  });

  test("§7.26 PageUp and PageDown page the month; Shift pages the year", async () => {
    const fixture = await openAt();
    await keydownSettled(fixture, grid(fixture), "PageDown");
    expect(cursorDate(fixture)).toBe("2026-04-15");
    await keydownSettled(fixture, grid(fixture), "PageUp");
    expect(cursorDate(fixture)).toBe("2026-03-15");
    await keydownSettled(fixture, grid(fixture), "PageDown", {
      shiftKey: true,
    });
    expect(cursorDate(fixture)).toBe("2027-03-15");
    await keydownSettled(fixture, grid(fixture), "PageUp", { shiftKey: true });
    expect(cursorDate(fixture)).toBe("2026-03-15");
  });

  test("§7.26 paging into a shorter month clamps the cursor day", async () => {
    const fixture = await openAt("2026-01-31");
    await keydownSettled(fixture, grid(fixture), "PageDown");
    expect(cursorDate(fixture)).toBe("2026-02-28");
  });

  test("§7.27 Enter on the grid selects the cursor's day", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await keydownSettled(fixture, grid(fixture), "ArrowRight");
    await keydownSettled(fixture, grid(fixture), "Enter");
    expect(changed).toHaveBeenCalledWith("2026-03-16");
  });

  test("§7.28 Alt+ArrowDown on the field opens the dialog", async () => {
    const fixture = mount();
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
    await keydownSettled(fixture, field(fixture), "ArrowDown", {
      altKey: true,
    });
    expect(dialog(fixture).hasAttribute("hidden")).toBe(false);
  });
});

// =====================================================================
// §7.29–§7.33 — range, vetoes, shortcuts
// =====================================================================

describe("DateTimePicker — constraints and shortcuts", () => {
  test("§7.29 days outside min/max are aria-disabled, not disabled", async () => {
    const fixture = mount({
      value: "2026-03-15",
      min: "2026-03-10",
      max: "2026-03-20",
    });
    await open(fixture);
    expect(day(fixture, "2026-03-09").getAttribute("aria-disabled")).toBe(
      "true",
    );
    expect(day(fixture, "2026-03-10").hasAttribute("aria-disabled")).toBe(
      false,
    );
    expect(day(fixture, "2026-03-20").hasAttribute("aria-disabled")).toBe(
      false,
    );
    expect(day(fixture, "2026-03-21").getAttribute("aria-disabled")).toBe(
      "true",
    );
    // aria-disabled, not the `disabled` attribute: a vetoed day must
    // stay focusable so the roving cursor can land on it and a screen
    // reader can announce it as unavailable.
    expect(day(fixture, "2026-03-09").hasAttribute("disabled")).toBe(false);
    // And the consumer's CSS hook rides along.
    expect(day(fixture, "2026-03-09").hasAttribute("data-disabled")).toBe(
      true,
    );
    expect(day(fixture, "2026-03-10").hasAttribute("data-disabled")).toBe(
      false,
    );
  });

  test("§7.30 isDateDisabled vetoes individual days", async () => {
    // A weekends-closed clinic.
    const isDateDisabled = (iso: string) =>
      weekdayOf(iso) === 0 || weekdayOf(iso) === 6;
    const fixture = mount({ value: "2026-03-16", isDateDisabled });
    await open(fixture);
    expect(day(fixture, "2026-03-21").getAttribute("aria-disabled")).toBe(
      "true",
    ); // Saturday
    expect(day(fixture, "2026-03-22").getAttribute("aria-disabled")).toBe(
      "true",
    ); // Sunday
    expect(day(fixture, "2026-03-23").hasAttribute("aria-disabled")).toBe(
      false,
    ); // Monday
  });

  test("§7.31 clicking a disabled day does not commit", async () => {
    const fixture = mount({ value: "2026-03-15", max: "2026-03-16" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, day(fixture, "2026-03-25"));
    expect(changed).not.toHaveBeenCalled();
  });

  test("§7.32 a shortcut moves the selection and reports its id", async () => {
    const shortcuts: DateTimeShortcut[] = [
      { id: "today", label: "Heddiw", days: 0 },
      { id: "two-weeks", label: "+2", days: 14 },
      { id: "next-month", label: "+1m", months: 1 },
    ];
    const fixture = mount({ value: "2026-03-15", shortcuts });
    const changed = vi.fn();
    const shortcutFired = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    fixture.componentInstance.shortcut.subscribe(shortcutFired);
    await open(fixture);
    const twoWeeks = qa<HTMLButtonElement>(
      fixture,
      ".date-time-picker-shortcut",
    ).find((b) => b.textContent?.trim() === "+2")!;
    await clickSettled(fixture, twoWeeks);
    expect(shortcutFired).toHaveBeenCalledWith({
      id: "two-weeks",
      isoDate: "2026-03-29",
    } satisfies ShortcutEvent);
    expect(changed).toHaveBeenCalledWith("2026-03-29");
  });

  test("§7.32 a month shortcut uses calendar months, not 30 days", async () => {
    const fixture = mount({
      value: "2026-03-15",
      shortcuts: [{ id: "m", label: "+1m", months: 1 }],
    });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await clickSettled(fixture, q(fixture, ".date-time-picker-shortcut"));
    expect(changed).toHaveBeenCalledWith("2026-04-15");
  });

  test("§7.33 a shortcut resolving to a blocked date does nothing", async () => {
    const fixture = mount({
      value: "2026-03-15",
      max: "2026-03-20",
      shortcuts: [{ id: "far", label: "+4w", days: 28 }],
    });
    const changed = vi.fn();
    const shortcutFired = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    fixture.componentInstance.shortcut.subscribe(shortcutFired);
    await open(fixture);
    await clickSettled(fixture, q(fixture, ".date-time-picker-shortcut"));
    expect(shortcutFired).not.toHaveBeenCalled();
    expect(changed).not.toHaveBeenCalled();
  });
});

// =====================================================================
// §7.34–§7.39 — typed input
// =====================================================================

describe("DateTimePicker — typed input", () => {
  test("§7.34 typing an ISO date and blurring commits it", async () => {
    const fixture = mount();
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    typeInto(fixture, field(fixture), "2026-03-15");
    await blurSettled(fixture, field(fixture));
    expect(changed).toHaveBeenCalledWith("2026-03-15");
    expect(hidden(fixture).value).toBe("2026-03-15");
  });

  test("§7.35 typing a locale-ordered numeric date commits the right day", async () => {
    const fixture = mount({ locale: "en-GB" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    typeInto(fixture, field(fixture), "03/04/2026");
    await keydownSettled(fixture, field(fixture), "Enter");
    expect(changed).toHaveBeenCalledWith("2026-04-03");
  });

  test("§7.36 unparseable text marks the field invalid and does not commit", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    const invalidInput = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    fixture.componentInstance.invalidInput.subscribe(invalidInput);
    typeInto(fixture, field(fixture), "sometime soon");
    await blurSettled(fixture, field(fixture));
    expect(invalidInput).toHaveBeenCalledWith("sometime soon");
    expect(changed).not.toHaveBeenCalled();
    expect(field(fixture).getAttribute("aria-invalid")).toBe("true");
    // The text the user typed stays put: silently reverting it is how
    // someone submits a form still believing they changed the date.
    expect(field(fixture).value).toBe("sometime soon");
    expect(hidden(fixture).value).toBe("2026-03-15");
  });

  test("§7.37 text parsing to an out-of-range date is rejected the same way", async () => {
    const fixture = mount({ value: "2026-03-15", max: "2026-03-20" });
    const changed = vi.fn();
    const invalidInput = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    fixture.componentInstance.invalidInput.subscribe(invalidInput);
    typeInto(fixture, field(fixture), "2026-12-25");
    await blurSettled(fixture, field(fixture));
    expect(invalidInput).toHaveBeenCalledWith("2026-12-25");
    expect(changed).not.toHaveBeenCalled();
    expect(field(fixture).getAttribute("aria-invalid")).toBe("true");
  });

  test("§7.38 clearing the field commits an empty value", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    typeInto(fixture, field(fixture), "");
    await blurSettled(fixture, field(fixture));
    expect(changed).toHaveBeenCalledWith("");
    expect(hidden(fixture).value).toBe("");
  });

  test("§7.39 a parseInput input overrides the built-in parser", async () => {
    const fixture = mount({
      parseInput: (text: string) => (text === "xmas" ? "2026-12-25" : null),
    });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    typeInto(fixture, field(fixture), "xmas");
    await blurSettled(fixture, field(fixture));
    expect(changed).toHaveBeenCalledWith("2026-12-25");
  });
});

// =====================================================================
// §7.40–§7.44 — time and datetime
// =====================================================================

describe("DateTimePicker — time and datetime", () => {
  test("§7.40 time mode renders hour and minute selects and no grid", async () => {
    const fixture = mount({
      mode: "time",
      labels: TIME_LABELS,
      value: "09:30",
    });
    await open(fixture);
    expect(q(fixture, ".date-time-picker-calendar")).toBeNull();
    const hour = q<HTMLSelectElement>(fixture, ".date-time-picker-hour");
    const minute = q<HTMLSelectElement>(fixture, ".date-time-picker-minute");
    expect(hour.value).toBe("9");
    expect(minute.value).toBe("30");
  });

  test("§7.41 minuteStep controls the minute options", async () => {
    const fixture = mount({
      mode: "time",
      labels: TIME_LABELS,
      value: "09:30",
      minuteStep: 15,
    });
    await open(fixture);
    const options = qa<HTMLOptionElement>(
      fixture,
      ".date-time-picker-minute option",
    ).map((o) => o.textContent);
    expect(options).toEqual(["00", "15", "30", "45"]);
  });

  test("§7.42 datetime mode renders both the grid and the time selects", async () => {
    const fixture = mount({
      mode: "datetime",
      labels: TIME_LABELS,
      value: "2026-03-15T09:30",
    });
    await open(fixture);
    expect(q(fixture, ".date-time-picker-calendar")).not.toBeNull();
    expect(q(fixture, ".date-time-picker-hour")).not.toBeNull();
  });

  test("§7.43 datetime commits date and time together", async () => {
    const fixture = mount({
      mode: "datetime",
      labels: TIME_LABELS,
      value: "2026-03-15T09:30",
    });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    // In datetime mode a day click is pending only — the user still has a
    // time to set.
    await clickSettled(fixture, day(fixture, "2026-03-20"));
    expect(changed).not.toHaveBeenCalled();
    await clickSettled(fixture, q(fixture, ".date-time-picker-confirm"));
    expect(changed).toHaveBeenCalledWith("2026-03-20T09:30");
  });

  test("§7.44 hour12 renders a meridiem select labelled by the locale", async () => {
    const fixture = mount({
      mode: "time",
      labels: TIME_LABELS,
      value: "13:30",
      hour12: true,
      locale: "en-US",
    });
    await open(fixture);
    const meridiem = q<HTMLSelectElement>(
      fixture,
      ".date-time-picker-meridiem",
    );
    expect(meridiem).not.toBeNull();
    expect(meridiem.value).toBe("pm");
    const labels = Array.from(meridiem.options).map((o) => o.textContent);
    // Whatever en-US calls them — the point is that neither string is
    // hardcoded in the component.
    expect(labels).toHaveLength(2);
    expect(labels[0]).not.toBe(labels[1]);
    // A 12-hour clock shows 1-12, not 13.
    const hourLabels = qa<HTMLOptionElement>(
      fixture,
      ".date-time-picker-hour option",
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
    const gbFixture = mount({ locale: "en-GB", value: "2026-03-15" });
    await open(gbFixture);
    const gb = qa<HTMLElement>(
      gbFixture,
      ".date-time-picker-weekday",
    ).map((th) => th.getAttribute("abbr"));
    expect(gb[0]).toBe("Monday");

    const usFixture = mount({ locale: "en-US", value: "2026-03-15" });
    await open(usFixture);
    const us = qa<HTMLElement>(
      usFixture,
      ".date-time-picker-weekday",
    ).map((th) => th.getAttribute("abbr"));
    expect(us[0]).toBe("Sunday");
  });

  test("§7.46 firstDayOfWeek overrides the locale", async () => {
    const fixture = mount({
      locale: "en-GB",
      firstDayOfWeek: 0,
      value: "2026-03-15",
    });
    await open(fixture);
    const first = q<HTMLElement>(
      fixture,
      ".date-time-picker-weekday",
    ).getAttribute("abbr");
    expect(first).toBe("Sunday");
  });

  test("§7.47 month names and day labels follow the locale", async () => {
    const fixture = mount({ locale: "cy-GB", value: "2026-03-15" });
    await open(fixture);
    const period = q<HTMLElement>(fixture, ".date-time-picker-period");
    // Welsh for March is "Mawrth"; the assertion is that the heading is NOT
    // the English month name, so the test does not depend on one ICU
    // version's exact spelling.
    expect(period.textContent?.trim()).not.toContain("March");
    expect(period.textContent?.trim()).toContain("2026");
    expect(day(fixture, "2026-03-15").getAttribute("aria-label")).not.toContain(
      "March",
    );
  });

  test("§7.48 showWeekNumbers renders ISO week numbers", async () => {
    const fixture = mount({
      value: "2026-03-15",
      showWeekNumbers: true,
      labels: { ...LABELS, week: "Wk" },
    });
    await open(fixture);
    expect(
      q(fixture, ".date-time-picker-week-heading")?.textContent?.trim(),
    ).toBe("Wk");
    const weeks = qa<HTMLElement>(fixture, ".date-time-picker-week").map(
      (th) => th.textContent?.trim(),
    );
    expect(weeks).toHaveLength(6);
    // The grid's first row starts 2026-02-23, which is ISO week 9.
    expect(weeks[0]).toBe("9");
  });
});

// =====================================================================
// §7.17 (markup, continued) — projected icon template
// =====================================================================

@Component({
  standalone: true,
  imports: [DateTimePicker, DateTimePickerIcon],
  template: `
    <lily-date-time-picker label="Pick a date" [labels]="labels">
      <ng-template lilyDateTimePickerIcon let-args>
        <span
          data-testid="custom"
          [attr.data-open]="args.open"
          [attr.data-display]="args.display"
          >custom glyph</span
        >
      </ng-template>
    </lily-date-time-picker>
  `,
})
class IconTemplateHost {
  readonly labels = LABELS;
}

describe("DateTimePicker — custom glyph template", () => {
  test("§7.17 a projected ng-template replaces the glyph and receives ChildArgs", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);

    const custom = q<HTMLElement>(fixture, '[data-testid="custom"]');
    expect(custom).toBeTruthy();
    expect(custom.closest("button")?.className).toContain(
      "date-time-picker-button",
    );
    expect(q(fixture, ".date-time-picker-icon")).toBeNull();
    expect(custom.getAttribute("data-open")).toBe("false");
  });

  test("§7.17 the ChildArgs open flag tracks the dialog state", async () => {
    const fixture = TestBed.createComponent(IconTemplateHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    await clickSettled(fixture, trigger(fixture));
    expect(
      q<HTMLElement>(fixture, '[data-testid="custom"]').getAttribute(
        "data-open",
      ),
    ).toBe("true");
  });
});

// =====================================================================
// §7.49–§7.55 — assistive technology
// =====================================================================

describe("DateTimePicker — assistive technology", () => {
  /** Discard a fixture mid-test so a second mount starts clean. */
  function discard(fixture: ComponentFixture<unknown>): void {
    fixture.destroy();
    fixtures = fixtures.filter((f) => f !== fixture);
  }

  test("§7.49 the cursor can land on a vetoed day, which stays focusable and announces", async () => {
    const isDateDisabled = (iso: string) => iso === "2026-03-16";
    const fixture = mount({ value: "2026-03-15", isDateDisabled });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    await open(fixture);
    await keydownSettled(fixture, grid(fixture), "ArrowRight");
    // The roving tabindex is on the blocked day, and — because it is
    // aria-disabled rather than `disabled` — real focus is too, so a
    // screen reader announces the day instead of going silent.
    expect(cursorDate(fixture)).toBe("2026-03-16");
    expect(document.activeElement).toBe(day(fixture, "2026-03-16"));
    // Enter refuses to select it.
    await keydownSettled(fixture, grid(fixture), "Enter");
    expect(changed).not.toHaveBeenCalled();
    // And the cursor can keep going, out the other side.
    await keydownSettled(fixture, grid(fixture), "ArrowRight");
    expect(cursorDate(fixture)).toBe("2026-03-17");
  });

  test("§7.50 Escape in the field discards the pending edit without committing", async () => {
    const fixture = mount({ value: "2026-03-15" });
    const changed = vi.fn();
    fixture.componentInstance.change.subscribe(changed);
    // Mark the field invalid first, so the revert has state to clean up.
    typeInto(fixture, field(fixture), "sometime soon");
    await keydownSettled(fixture, field(fixture), "Enter");
    expect(field(fixture).getAttribute("aria-invalid")).toBe("true");

    await keydownSettled(fixture, field(fixture), "Escape");
    // The committed value is back on display, the invalid state is
    // gone, and nothing was committed.
    expect(field(fixture).value).toContain("2026");
    expect(field(fixture).hasAttribute("aria-invalid")).toBe(false);
    expect(changed).not.toHaveBeenCalled();
    expect(hidden(fixture).value).toBe("2026-03-15");
  });

  test("§7.51 labels.invalid renders a status live region wired to the field", async () => {
    const bare = mount();
    // Without the label, no region renders — the component would rather
    // stay silent than announce in a language it invented.
    expect(q(bare, ".date-time-picker-status")).toBeNull();
    discard(bare);

    const fixture = mount({
      describedBy: "hint",
      labels: { ...LABELS, invalid: "DimDyddiad" },
    });
    const status = q<HTMLElement>(fixture, ".date-time-picker-status");
    // The region exists before it has content — a live region born with
    // its message is routinely not announced at all — and is empty
    // while the field is valid.
    expect(status.getAttribute("role")).toBe("status");
    expect(status.textContent?.trim()).toBe("");
    expect(field(fixture).getAttribute("aria-describedby")).toBe("hint");

    typeInto(fixture, field(fixture), "junk");
    await blurSettled(fixture, field(fixture));
    expect(status.textContent?.trim()).toBe("DimDyddiad");
    expect(field(fixture).getAttribute("aria-errormessage")).toBe(status.id);
    // Chained after the consumer's hint, for the assistive technologies
    // that read aria-describedby but not aria-errormessage.
    expect(field(fixture).getAttribute("aria-describedby")).toBe(
      `hint ${status.id}`,
    );
  });

  test("§7.52 focus returns to whichever element opened the dialog", async () => {
    const fromField = mount({ value: "2026-03-15" });
    // Opened from the field with Alt+ArrowDown: Escape must return
    // focus to the field, not strand the user on the button.
    field(fromField).focus();
    await keydownSettled(fromField, field(fromField), "ArrowDown", {
      altKey: true,
    });
    await keydownSettled(fromField, dialog(fromField), "Escape");
    expect(document.activeElement).toBe(field(fromField));
    discard(fromField);

    const fromButton = mount({ value: "2026-03-15" });
    // Opened from the button: focus returns to the button.
    trigger(fromButton).focus();
    await open(fromButton);
    await keydownSettled(fromButton, dialog(fromButton), "Escape");
    expect(document.activeElement).toBe(trigger(fromButton));
  });

  test("§7.53 header paging keeps focus on the header button; grid paging follows the cursor", async () => {
    const fixture = mount({ value: "2026-03-15" });
    await open(fixture);

    // Header route: the user activating "next month" stays on "next
    // month", so they can page again — the cursor carries silently.
    const nextMonth = q<HTMLButtonElement>(
      fixture,
      ".date-time-picker-next-month",
    );
    nextMonth.focus();
    await clickSettled(fixture, nextMonth);
    expect(document.activeElement).toBe(nextMonth);
    expect(cursorDate(fixture)).toBe("2026-04-15");

    // Grid route: focus is in the grid, and paging must carry it —
    // the cell it sat on no longer exists.
    day(fixture, "2026-04-15").focus();
    await keydownSettled(fixture, grid(fixture), "PageDown");
    expect(cursorDate(fixture)).toBe("2026-05-15");
    expect(document.activeElement).toBe(day(fixture, "2026-05-15"));
  });

  test("§7.54 labels.instructions renders keyboard help described by the dialog", async () => {
    const bare = mount();
    expect(q(bare, ".date-time-picker-instructions")).toBeNull();
    expect(dialog(bare).hasAttribute("aria-describedby")).toBe(false);
    discard(bare);

    const fixture = mount({
      labels: { ...LABELS, instructions: "SaethauSymud" },
    });
    const help = q<HTMLElement>(fixture, ".date-time-picker-instructions");
    expect(help.textContent?.trim()).toBe("SaethauSymud");
    expect(dialog(fixture).getAttribute("aria-describedby")).toBe(help.id);
  });

  test("§7.55 clicking the text field while the dialog is open closes it", async () => {
    const fixture = mount({ value: "2026-03-15" });
    await open(fixture);
    expect(dialog(fixture).hasAttribute("hidden")).toBe(false);
    // The dialog is aria-modal: interacting with anything behind it —
    // including the component's own field — dismisses it.
    click(fixture, field(fixture));
    expect(dialog(fixture).hasAttribute("hidden")).toBe(true);
    expect(hidden(fixture).value).toBe("2026-03-15");
  });
});
