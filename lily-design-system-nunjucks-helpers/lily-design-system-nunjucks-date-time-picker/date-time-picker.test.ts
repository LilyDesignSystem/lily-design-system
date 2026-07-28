// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CALENDAR,
  addDays,
  addMonths,
  autoInit,
  dayLabel,
  daysInMonth,
  defaultFormatValue,
  firstDayOfWeekFor,
  formatIsoDate,
  formatIsoTime,
  fromEpochDay,
  initDateTimePicker,
  isoWeek,
  joinValue,
  localeUsesHour12,
  monthMatrix,
  monthNames,
  nextDateTimePickerId,
  numericFieldOrder,
  pad,
  parseDateInput,
  parseIsoDate,
  parseIsoTime,
  parseTimeInput,
  splitValue,
  toEpochDay,
  weekdayOf,
  withinRange,
} from "./date-time-picker.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./date-time-picker.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const LABELS = {
  previousYear: "Previous year",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  nextYear: "Next year",
  confirm: "Confirm",
  cancel: "Cancel",
  hour: "Hour",
  minute: "Minute",
  meridiem: "Time of day",
  week: "Wk",
  clear: "Clear",
};

function renderMacro(opts: Record<string, unknown>): string {
  const src =
    `{% from "./date-time-picker.njk" import dateTimePicker %}` +
    `{{ dateTimePicker(opts) }}`;
  return env.renderString(src, { opts });
}

function renderMacroWithCaller(
  opts: Record<string, unknown>,
  body: string,
): string {
  const src =
    `{% from "./date-time-picker.njk" import dateTimePicker %}` +
    `{% call dateTimePicker(opts) %}${body}{% endcall %}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(
    "[data-lily-date-time-picker-root]",
  ) as HTMLElement;
}

type Parts = {
  root: HTMLElement;
  input: HTMLInputElement;
  button: HTMLButtonElement;
  dialog: HTMLElement;
  hiddenInput: HTMLInputElement;
  api: ReturnType<typeof initDateTimePicker>;
};

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
  opts: Record<string, unknown> = {},
  initOpts: Record<string, unknown> = {},
): Parts {
  const root = mountIntoBody(
    renderMacro({ label: "Appointment date", labels: LABELS, ...opts }),
  );
  const api = initDateTimePicker(root, { locale: "en-GB", ...initOpts });
  return {
    root,
    input: root.querySelector(".date-time-picker-input") as HTMLInputElement,
    button: root.querySelector(
      ".date-time-picker-button",
    ) as HTMLButtonElement,
    dialog: root.querySelector(".date-time-picker-dialog") as HTMLElement,
    hiddenInput: root.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement,
    api,
  };
}

function click(el: Element): void {
  el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
}

function keydown(
  el: Element,
  key: string,
  extra: Record<string, unknown> = {},
): void {
  el.dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
      ...extra,
    }),
  );
}

function dayButtons(dialog: HTMLElement): HTMLButtonElement[] {
  return Array.from(dialog.querySelectorAll(".date-time-picker-day"));
}

function dayButton(dialog: HTMLElement, iso: string): HTMLButtonElement {
  return dialog.querySelector(
    `.date-time-picker-day[data-date="${iso}"]`,
  ) as HTMLButtonElement;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  document.body.innerHTML = "";
});

// =====================================================================
// Pure arithmetic (mirrors §3, §4.4) -- §7.1-§7.9
// =====================================================================

describe("DateTimePicker -- pure arithmetic (§7.1-§7.9)", () => {
  test("§7.1 parseIsoDate rejects impossible dates and accepts real ones", () => {
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("2026-03-01")).toEqual({ year: 2026, month: 3, day: 1 });
    expect(parseIsoDate("not-a-date")).toBeNull();
  });

  test("§7.1 daysInMonth handles leap years", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  test("§7.2 addDays crosses month and year boundaries, forwards and backwards", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  test("§7.2 addMonths clamps rather than rolling over", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
  });

  test("§7.2 addMonths with a negative delta crosses the year boundary correctly", () => {
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
    expect(addMonths("2026-01-15", -13)).toBe("2024-12-15");
  });

  test("§7.3 weekdayOf returns 0 for Sunday", () => {
    // 2026-03-01 is a Sunday.
    expect(weekdayOf("2026-03-01")).toBe(0);
  });

  test("§7.3 isoWeek matches the ISO-8601 definition on the known-hard cases", () => {
    expect(isoWeek("2026-01-01")).toBe(1);
    expect(isoWeek("2021-01-03")).toBe(53);
  });

  test("§7.4 toEpochDay / fromEpochDay round-trip", () => {
    const date = { year: 2026, month: 7, day: 28 };
    expect(fromEpochDay(toEpochDay(date))).toEqual(date);
  });

  test("§7.5 splitValue / joinValue round-trip per mode, and refuse a half datetime", () => {
    expect(splitValue("2026-03-01", "date")).toEqual({ date: "2026-03-01", time: "" });
    expect(splitValue("09:30", "time")).toEqual({ date: "", time: "09:30" });
    expect(splitValue("2026-03-01T09:30", "datetime")).toEqual({
      date: "2026-03-01",
      time: "09:30",
    });
    expect(joinValue("2026-03-01", "09:30", "datetime")).toBe("2026-03-01T09:30");
    expect(joinValue("2026-03-01", "", "datetime")).toBe("");
    expect(joinValue("", "09:30", "datetime")).toBe("");
  });

  test("§7.6 monthMatrix always returns 6 x 7 and starts on firstDayOfWeek", () => {
    const weeks = monthMatrix(2026, 3, 1);
    expect(weeks.length).toBe(6);
    for (const week of weeks) expect(week.length).toBe(7);
    // Monday first: 2026-03-01 is a Sunday, so the grid should start the
    // Monday before it.
    expect(weekdayOf(weeks[0][0])).toBe(1);
  });

  test("§7.7 firstDayOfWeekFor gives Monday for en-GB, Sunday for en-US, Monday for an unknown tag", () => {
    expect(firstDayOfWeekFor("en-GB")).toBe(1);
    expect(firstDayOfWeekFor("en-US")).toBe(0);
    expect(firstDayOfWeekFor("xx-ZZ")).toBe(1);
  });

  test("§7.8 parseDateInput reads ISO, locale-ordered numerics, and written months", () => {
    expect(parseDateInput("2026-03-04", "en-GB")).toBe("2026-03-04");
    expect(parseDateInput("03/04/2026", "en-GB")).toBe("2026-04-03");
    expect(parseDateInput("03/04/2026", "en-US")).toBe("2026-03-04");
    expect(parseDateInput("27-Jun-2025", "en-GB")).toBe("2025-06-27");
  });

  test("§7.8 parseDateInput returns null for junk and for impossible dates", () => {
    expect(parseDateInput("not a date", "en-GB")).toBeNull();
    expect(parseDateInput("31/02/2026", "en-GB")).toBeNull();
  });

  test("§7.9 parseTimeInput reads 9:30, 0930, 9.30, 1:30pm, and rejects 25:00", () => {
    expect(parseTimeInput("9:30")).toBe("09:30");
    expect(parseTimeInput("0930")).toBe("09:30");
    expect(parseTimeInput("9.30")).toBe("09:30");
    expect(parseTimeInput("1:30pm")).toBe("13:30");
    expect(parseTimeInput("25:00")).toBeNull();
  });
});

// =====================================================================
// Markup contract (mirrors §4.3) -- §7.10-§7.17
// =====================================================================

describe("DateTimePicker -- markup contract (§7.10-§7.17)", () => {
  test("§7.10 renders the trigger with aria-haspopup=dialog, aria-expanded=false, and aria-controls pointing at the dialog", () => {
    const { button, dialog } = setup();
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe(dialog.id);
    expect(dialog.getAttribute("role")).toBe("dialog");
  });

  test("§7.10 the glyph renders inside .date-time-picker-icon with aria-hidden=true", () => {
    const { root } = setup();
    const icon = root.querySelector(".date-time-picker-icon") as HTMLElement;
    expect(icon.textContent).toBe(CALENDAR);
    expect(CALENDAR.codePointAt(0)).toBe(0x1f4c5);
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  test("§7.11 aria-label names both the trigger and the dialog", () => {
    const { button, dialog } = setup({ label: "Appointment date" });
    expect(button.getAttribute("aria-label")).toBe("Appointment date");
    expect(dialog.getAttribute("aria-label")).toBe("Appointment date");
  });

  test("§7.12 the hidden input carries name and the ISO value; the visible field carries the raw value pre-hydration and the formatted value after", () => {
    const html = renderMacro({
      label: "Appointment date",
      labels: LABELS,
      value: "2026-03-01",
      name: "appointment",
    });
    const bare = mountIntoBody(html);
    const hidden = bare.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe("appointment");
    expect(hidden.value).toBe("2026-03-01");
    // Pre-hydration the visible field shows the raw ISO string -- the
    // macro cannot call Intl. See spec/index.md §5.7.
    const field = bare.querySelector(".date-time-picker-input") as HTMLInputElement;
    expect(field.value).toBe("2026-03-01");

    const { input } = setup({ value: "2026-03-01" });
    expect(input.value).not.toBe("2026-03-01");
    expect(input.value).toContain("2026");
  });

  test("§7.13 the dialog is hidden until the trigger is activated", () => {
    const { button, dialog } = setup();
    expect(dialog.hasAttribute("hidden")).toBe(true);
    click(button);
    expect(dialog.hasAttribute("hidden")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  test("§7.14 the grid renders 6 rows x 7 day cells, with data-outside on adjacent-month days", () => {
    const { button, dialog } = setup({ value: "2026-03-15" });
    click(button);
    const rows = dialog.querySelectorAll(".date-time-picker-calendar tbody tr");
    expect(rows.length).toBe(6);
    for (const row of Array.from(rows)) {
      expect(row.querySelectorAll(".date-time-picker-day").length).toBe(7);
    }
    const outside = dayButtons(dialog).filter((b) => b.hasAttribute("data-outside"));
    expect(outside.length).toBeGreaterThan(0);
  });

  test("§7.15 exactly one day carries tabindex=0", () => {
    const { button, dialog } = setup({ value: "2026-03-15" });
    click(button);
    const tabbable = dayButtons(dialog).filter((b) => b.getAttribute("tabindex") === "0");
    expect(tabbable.length).toBe(1);
    expect(tabbable[0].getAttribute("data-date")).toBe("2026-03-15");
  });

  test("§7.16 extra attributes spread onto the root; data-mode reflects mode", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Appointment date",
        labels: LABELS,
        mode: "datetime",
        attributes: { "data-analytics": "booking-widget" },
      }),
    );
    expect(root.getAttribute("data-mode")).toBe("datetime");
    expect(root.getAttribute("data-analytics")).toBe("booking-widget");
  });

  test("§7.17 a {% call %} body replaces the glyph", () => {
    const root = mountIntoBody(
      renderMacroWithCaller(
        { label: "Appointment date", labels: LABELS },
        '<svg data-testid="custom" aria-hidden="true"></svg>',
      ),
    );
    const custom = root.querySelector("[data-testid='custom']")!;
    expect(custom.closest("button")?.className).toBe("date-time-picker-button");
    expect(root.querySelector(".date-time-picker-icon")).toBeNull();
  });
});

// =====================================================================
// Selection and commit (mirrors §5.3) -- §7.18-§7.23
// =====================================================================

describe("DateTimePicker -- selection and commit (§7.18-§7.23)", () => {
  test("§7.18 clicking a day in date mode commits, fires onChange, and closes", () => {
    const onChange = vi.fn();
    const { button, dialog, hiddenInput } = setup({ value: "2026-03-01" }, { onChange });
    click(button);
    click(dayButton(dialog, "2026-03-15"));
    expect(hiddenInput.value).toBe("2026-03-15");
    expect(onChange).toHaveBeenCalledWith("2026-03-15");
    expect(dialog.hasAttribute("hidden")).toBe(true);
  });

  test("§7.19 with confirmOnSelect false, clicking a day does not commit; Confirm does", () => {
    const { button, dialog, hiddenInput } = setup({
      value: "2026-03-01",
      confirmOnSelect: false,
    });
    click(button);
    click(dayButton(dialog, "2026-03-15"));
    expect(hiddenInput.value).toBe("2026-03-01");
    expect(dialog.hasAttribute("hidden")).toBe(false);
    click(dialog.querySelector(".date-time-picker-confirm")!);
    expect(hiddenInput.value).toBe("2026-03-15");
    expect(dialog.hasAttribute("hidden")).toBe(true);
  });

  test("§7.20 Cancel closes without changing value", () => {
    const { button, dialog, hiddenInput } = setup({ value: "2026-03-01" });
    click(button);
    click(dayButton(dialog, "2026-03-15"));
    // Re-open and cancel; commit-on-select already closed the dialog, so
    // reopen for this case with confirmOnSelect off instead.
    const { button: b2, dialog: d2, hiddenInput: h2 } = setup(
      { value: "2026-03-01", confirmOnSelect: false, name: "cancel-case" },
    );
    click(b2);
    click(dayButton(d2, "2026-03-20"));
    click(d2.querySelector(".date-time-picker-cancel")!);
    expect(h2.value).toBe("2026-03-01");
    expect(d2.hasAttribute("hidden")).toBe(true);
  });

  test("§7.21 Escape closes without changing value", () => {
    const { button, dialog, hiddenInput } = setup({
      value: "2026-03-01",
      confirmOnSelect: false,
    });
    click(button);
    click(dayButton(dialog, "2026-03-20"));
    keydown(dialog, "Escape");
    expect(hiddenInput.value).toBe("2026-03-01");
    expect(dialog.hasAttribute("hidden")).toBe(true);
  });

  test("§7.22 the clear button renders only when labels.clear is set, and commits ''", () => {
    const withoutClear = setup({ labels: { ...LABELS, clear: undefined } });
    expect(withoutClear.dialog.querySelector(".date-time-picker-clear")).toBeNull();

    const { button, dialog, hiddenInput } = setup({
      value: "2026-03-01",
      name: "with-clear",
    });
    click(button);
    const clearButton = dialog.querySelector(".date-time-picker-clear")!;
    expect(clearButton).not.toBeNull();
    click(clearButton);
    expect(hiddenInput.value).toBe("");
  });

  test("§7.23 onChange does not fire when the committed value is unchanged", () => {
    const onChange = vi.fn();
    const { button, dialog } = setup({ value: "2026-03-01" }, { onChange });
    click(button);
    click(dayButton(dialog, "2026-03-01"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// =====================================================================
// Keyboard (mirrors §6.2) -- §7.24-§7.28
// =====================================================================

describe("DateTimePicker -- keyboard (§7.24-§7.28)", () => {
  test("§7.24 arrow keys move the cursor by a day and by a week", () => {
    const { button, dialog } = setup({ value: "2026-03-15", confirmOnSelect: false });
    click(button);
    const grid = dialog.querySelector(".date-time-picker-calendar")!;
    keydown(grid, "ArrowRight");
    expect(dayButton(dialog, "2026-03-16").getAttribute("tabindex")).toBe("0");
    keydown(grid, "ArrowDown");
    expect(dayButton(dialog, "2026-03-23").getAttribute("tabindex")).toBe("0");
    keydown(grid, "ArrowLeft");
    expect(dayButton(dialog, "2026-03-22").getAttribute("tabindex")).toBe("0");
    keydown(grid, "ArrowUp");
    expect(dayButton(dialog, "2026-03-15").getAttribute("tabindex")).toBe("0");
  });

  test("§7.25 Home / End reach the ends of the week, respecting firstDayOfWeek", () => {
    const { button, dialog } = setup({ value: "2026-03-18" }); // en-GB, Monday first
    click(button);
    const grid = dialog.querySelector(".date-time-picker-calendar")!;
    keydown(grid, "Home");
    expect(dayButton(dialog, "2026-03-16").getAttribute("tabindex")).toBe("0");
    keydown(grid, "End");
    expect(dayButton(dialog, "2026-03-22").getAttribute("tabindex")).toBe("0");
  });

  test("§7.26 PageUp / PageDown page the month; Shift pages the year", () => {
    const { button, dialog } = setup({ value: "2026-03-15" });
    click(button);
    const grid = dialog.querySelector(".date-time-picker-calendar")!;
    const period = dialog.querySelector(".date-time-picker-period")!;
    keydown(grid, "PageDown");
    expect(period.textContent).toContain("2026");
    expect(period.textContent?.toLowerCase()).toContain("april");
    keydown(grid, "PageUp", { shiftKey: true });
    // Shift pages the YEAR only -- April 2026 minus one year is April
    // 2025, not a reversion to March.
    expect(period.textContent?.toLowerCase()).toContain("april");
    expect(period.textContent).toContain("2025");
  });

  test("§7.27 Enter on the grid selects the cursor's day", () => {
    const { button, dialog, hiddenInput } = setup({ value: "2026-03-15" });
    click(button);
    const grid = dialog.querySelector(".date-time-picker-calendar")!;
    keydown(grid, "ArrowRight");
    keydown(grid, "Enter");
    expect(hiddenInput.value).toBe("2026-03-16");
    expect(dialog.hasAttribute("hidden")).toBe(true);
  });

  test("§7.28 Alt+ArrowDown on the field opens the dialog", () => {
    const { input, dialog } = setup();
    expect(dialog.hasAttribute("hidden")).toBe(true);
    keydown(input, "ArrowDown", { altKey: true });
    expect(dialog.hasAttribute("hidden")).toBe(false);
  });
});

// =====================================================================
// Range, vetoes, shortcuts (mirrors §5.5) -- §7.29-§7.33
// =====================================================================

describe("DateTimePicker -- range, vetoes, shortcuts (§7.29-§7.33)", () => {
  test("§7.29 days outside min / max render disabled", () => {
    const { button, dialog } = setup({
      value: "2026-03-15",
      min: "2026-03-10",
      max: "2026-03-20",
    });
    click(button);
    expect(dayButton(dialog, "2026-03-05").disabled).toBe(true);
    expect(dayButton(dialog, "2026-03-15").disabled).toBe(false);
    expect(dayButton(dialog, "2026-03-25").disabled).toBe(true);
  });

  test("§7.30 disabledDates (the isDateDisabled macro substitute) disables individual days", () => {
    const { button, dialog } = setup({
      value: "2026-03-15",
      disabledDates: ["2026-03-16", "2026-03-17"],
    });
    click(button);
    expect(dayButton(dialog, "2026-03-16").disabled).toBe(true);
    expect(dayButton(dialog, "2026-03-17").disabled).toBe(true);
    expect(dayButton(dialog, "2026-03-18").disabled).toBe(false);
  });

  test("§7.30 a real isDateDisabled function at init time overrides the disabledDates baseline", () => {
    const isDateDisabled = (iso: string) => iso.endsWith("-16");
    const root = mountIntoBody(
      renderMacro({
        label: "Appointment date",
        labels: LABELS,
        value: "2026-03-15",
        disabledDates: ["2026-03-20"],
      }),
    );
    const api = initDateTimePicker(root, { locale: "en-GB", isDateDisabled });
    api.open();
    const dialog = root.querySelector(".date-time-picker-dialog")!;
    expect(dayButton(dialog, "2026-03-16").disabled).toBe(true);
    // The function form REPLACES the list-based baseline rather than
    // union-ing with it.
    expect(dayButton(dialog, "2026-03-20").disabled).toBe(false);
  });

  test("§7.31 clicking a disabled day does not commit", () => {
    const { button, dialog, hiddenInput } = setup({
      value: "2026-03-15",
      disabledDates: ["2026-03-16"],
    });
    click(button);
    click(dayButton(dialog, "2026-03-16"));
    expect(hiddenInput.value).toBe("2026-03-15");
    expect(dialog.hasAttribute("hidden")).toBe(false);
  });

  test("§7.32 a shortcut moves the pending selection and fires onShortcut", () => {
    const onShortcut = vi.fn();
    const { button, dialog, hiddenInput } = setup(
      {
        value: "2026-03-01",
        confirmOnSelect: false,
        shortcuts: [{ id: "plus-week", label: "+1 week", days: 7 }],
      },
      { onShortcut },
    );
    click(button);
    click(dialog.querySelector('[data-shortcut-id="plus-week"]')!);
    expect(onShortcut).toHaveBeenCalled();
    // Pending only -- not committed yet.
    expect(hiddenInput.value).toBe("2026-03-01");
    click(dialog.querySelector(".date-time-picker-confirm")!);
    const [, isoDate] = onShortcut.mock.calls[0];
    expect(hiddenInput.value).toBe(isoDate);
  });

  test("§7.33 a shortcut resolving to a blocked date does nothing", () => {
    const onShortcut = vi.fn();
    const { button, dialog } = setup(
      {
        value: "2026-03-01",
        confirmOnSelect: false,
        disabledDates: [addDaysFromToday(4)],
        shortcuts: [{ id: "plus-4", label: "+4 days", days: 4 }],
      },
      { onShortcut },
    );
    click(button);
    click(dialog.querySelector('[data-shortcut-id="plus-4"]')!);
    expect(onShortcut).not.toHaveBeenCalled();
  });
});

function addDaysFromToday(days: number): string {
  const now = new Date();
  return addDays(
    formatIsoDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }),
    days,
  );
}

// =====================================================================
// Typed input (mirrors §5.4) -- §7.34-§7.39
// =====================================================================

describe("DateTimePicker -- typed input (§7.34-§7.39)", () => {
  test("§7.34 typing an ISO date and blurring commits it", () => {
    const { input, hiddenInput } = setup();
    input.value = "2026-03-15";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(hiddenInput.value).toBe("2026-03-15");
  });

  test("§7.35 typing a locale-ordered numeric date commits the right day", () => {
    const { input, hiddenInput } = setup(); // en-GB
    input.value = "03/04/2026";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(hiddenInput.value).toBe("2026-04-03");
  });

  test("§7.36 unparseable text sets aria-invalid and fires onInvalidInput without changing value", () => {
    const onInvalidInput = vi.fn();
    const { input, hiddenInput } = setup({ value: "2026-03-01" }, { onInvalidInput });
    input.value = "nonsense";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onInvalidInput).toHaveBeenCalledWith("nonsense");
    expect(hiddenInput.value).toBe("2026-03-01");
  });

  test("§7.37 text parsing to an out-of-range date is rejected the same way", () => {
    const onInvalidInput = vi.fn();
    const { input, hiddenInput } = setup(
      { value: "2026-03-15", min: "2026-03-10", max: "2026-03-20" },
      { onInvalidInput },
    );
    input.value = "2026-03-25";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onInvalidInput).toHaveBeenCalledWith("2026-03-25");
    expect(hiddenInput.value).toBe("2026-03-15");
  });

  test("§7.38 clearing the field commits ''", () => {
    const { input, hiddenInput } = setup({ value: "2026-03-01" });
    input.value = "";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(hiddenInput.value).toBe("");
  });

  test("§7.39 a parseInput opt overrides the built-in parser", () => {
    const parseInput = vi.fn(() => "2026-01-01");
    const { input, hiddenInput } = setup({}, { parseInput });
    input.value = "anything at all";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    input.dispatchEvent(new window.FocusEvent("blur"));
    expect(parseInput).toHaveBeenCalledWith("anything at all");
    expect(hiddenInput.value).toBe("2026-01-01");
  });
});

// =====================================================================
// Time and datetime (mirrors §5.1) -- §7.40-§7.44
// =====================================================================

describe("DateTimePicker -- time and datetime (§7.40-§7.44)", () => {
  test("§7.40 time mode renders hour and minute selects and no grid", () => {
    const { button, dialog } = setup({ mode: "time" });
    click(button);
    expect(dialog.querySelector(".date-time-picker-calendar")).toBeNull();
    expect(dialog.querySelector(".date-time-picker-hour")).not.toBeNull();
    expect(dialog.querySelector(".date-time-picker-minute")).not.toBeNull();
  });

  test("§7.41 minuteStep controls the minute options", () => {
    const { button, dialog } = setup({ mode: "time", minuteStep: 15 });
    click(button);
    const options = Array.from(
      dialog.querySelectorAll<HTMLOptionElement>(".date-time-picker-minute option"),
    ).map((o) => o.value);
    expect(options).toEqual(["0", "15", "30", "45"]);
  });

  test("§7.42 datetime mode renders both the grid and the time selects", () => {
    const { button, dialog } = setup({ mode: "datetime" });
    click(button);
    expect(dialog.querySelector(".date-time-picker-calendar")).not.toBeNull();
    expect(dialog.querySelector(".date-time-picker-hour")).not.toBeNull();
  });

  test("§7.43 datetime does not commit a date with no time set to empty", () => {
    // joinValue is the pure function this guarantee rests on: an
    // incomplete datetime is refused rather than half-committed.
    expect(joinValue("2026-03-01", "", "datetime")).toBe("");
    expect(joinValue("", "09:30", "datetime")).toBe("");
    expect(joinValue("2026-03-01", "09:30", "datetime")).toBe("2026-03-01T09:30");
  });

  test("§7.44 hour12 renders a meridiem select whose labels come from the locale", () => {
    const { button, dialog } = setup(
      { mode: "time", hour12: true },
      { locale: "en-US" },
    );
    click(button);
    const meridiem = dialog.querySelector(".date-time-picker-meridiem") as HTMLSelectElement;
    expect(meridiem).not.toBeNull();
    const options = Array.from(meridiem.options).map((o) => o.textContent);
    expect(options).toEqual(["AM", "PM"]);
    const label = dialog.querySelector(
      `label[for="${meridiem.id}"]`,
    ) as HTMLLabelElement;
    expect(label.textContent).toBe(LABELS.meridiem);
  });
});

// =====================================================================
// Locale (mirrors §5.6) -- §7.45-§7.48
// =====================================================================

describe("DateTimePicker -- locale (§7.45-§7.48)", () => {
  test("§7.45 weekday headings start on Monday for en-GB and Sunday for en-US", () => {
    const gb = setup({ value: "2026-03-15", name: "gb" }, { locale: "en-GB" });
    click(gb.button);
    const gbFirst = gb.dialog.querySelectorAll(".date-time-picker-weekday")[0];
    expect(gbFirst.getAttribute("abbr")).toBe("Monday");

    const us = setup({ value: "2026-03-15", name: "us" }, { locale: "en-US" });
    click(us.button);
    const usFirst = us.dialog.querySelectorAll(".date-time-picker-weekday")[0];
    expect(usFirst.getAttribute("abbr")).toBe("Sunday");
  });

  test("§7.46 firstDayOfWeek overrides the locale", () => {
    const { button, dialog } = setup(
      { value: "2026-03-15" },
      { locale: "en-US", firstDayOfWeek: 1 },
    );
    click(button);
    const first = dialog.querySelectorAll(".date-time-picker-weekday")[0];
    expect(first.getAttribute("abbr")).toBe("Monday");
  });

  test("§7.47 month names and day aria-labels follow locale", () => {
    const { button, dialog } = setup({ value: "2026-03-15" }, { locale: "fr-FR" });
    click(button);
    const period = dialog.querySelector(".date-time-picker-period")!;
    expect(period.textContent?.toLowerCase()).toContain("mars");
    const day = dayButton(dialog, "2026-03-15");
    expect(day.getAttribute("aria-label")).toBe(dayLabel("2026-03-15", "fr-FR"));
  });

  test("§7.48 showWeekNumbers renders a week column with ISO week numbers", () => {
    const { button, dialog } = setup({ value: "2026-03-15", showWeekNumbers: true });
    click(button);
    const weekHeading = dialog.querySelector(".date-time-picker-week-heading");
    expect(weekHeading?.textContent).toBe(LABELS.week);
    const weekCells = dialog.querySelectorAll(".date-time-picker-week");
    expect(weekCells.length).toBe(6);
    expect(Number(weekCells[0].textContent)).toBe(isoWeek(monthMatrix(2026, 3, 1)[0][0]));
  });
});

// =====================================================================
// Nunjucks-specific surface -- deviations, ids, macro purity
// =====================================================================

describe("DateTimePicker -- Nunjucks surface and deviations", () => {
  test("ids are deterministic, derived from name, and no-JS-safe", () => {
    const html1 = renderMacro({ label: "Appointment date", labels: LABELS, name: "arrival" });
    const html2 = renderMacro({ label: "Appointment date", labels: LABELS, name: "arrival" });
    expect(html1).toBe(html2);
    const root = mountIntoBody(html1);
    const dialog = root.querySelector(".date-time-picker-dialog")!;
    expect(dialog.id).toBe("date-time-picker-arrival-dialog");
    const button = root.querySelector(".date-time-picker-button")!;
    expect(button.getAttribute("aria-controls")).toBe(dialog.id);
  });

  test("an explicit id opt overrides the name-derived prefix", () => {
    const root = mountIntoBody(
      renderMacro({ label: "Appointment date", labels: LABELS, id: "custom-prefix" }),
    );
    expect(root.querySelector(".date-time-picker-dialog")!.id).toBe("custom-prefix-dialog");
  });

  test("classes and attributes land on the root", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Appointment date",
        labels: LABELS,
        classes: "my-picker",
        attributes: { "data-testid": "picker" },
      }),
    );
    expect(root.className).toBe("date-time-picker my-picker");
    expect(root.getAttribute("data-testid")).toBe("picker");
  });

  test("the macro is pure: no document, Intl-driven content, or storage access at render time", () => {
    const before = document.documentElement.outerHTML;
    const html = renderMacro({ label: "Appointment date", labels: LABELS, value: "2026-03-01" });
    expect(document.documentElement.outerHTML).toBe(before);
    // Nothing is persisted -- like share-picker, this helper owns a
    // form value, not a preference.
    expect(html).not.toMatch(/localStorage|data-theme|data-text-size/);
    // The grid/weekday/period content genuinely is not there yet --
    // it is Intl-dependent and only the client can produce it.
    expect(html).toContain('data-lily-date-time-picker-grid');
    const bare = mountIntoBody(html);
    expect(bare.querySelectorAll(".date-time-picker-day").length).toBe(0);
  });

  test("shortcuts are rendered as real buttons by the macro, with no function involved", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Appointment date",
        labels: LABELS,
        shortcuts: [
          { id: "today", label: "Today", days: 0 },
          { id: "plus-week", label: "+1 week", days: 7 },
        ],
      }),
    );
    const buttons = Array.from(root.querySelectorAll(".date-time-picker-shortcut"));
    expect(buttons.length).toBe(2);
    expect(buttons[0].getAttribute("data-shortcut-id")).toBe("today");
    expect(buttons[0].getAttribute("data-days")).toBe("0");
    expect(buttons[1].textContent).toBe("+1 week");
  });

  test("initDateTimePicker shortcuts opt rebuilds the container, taking over from the macro-rendered buttons", () => {
    const root = mountIntoBody(
      renderMacro({
        label: "Appointment date",
        labels: LABELS,
        shortcuts: [{ id: "stale", label: "Stale", days: 1 }],
      }),
    );
    initDateTimePicker(root, {
      locale: "en-GB",
      shortcuts: [{ id: "fresh", label: "Fresh", days: 2 }],
    });
    const buttons = Array.from(root.querySelectorAll(".date-time-picker-shortcut"));
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute("data-shortcut-id")).toBe("fresh");
  });

  test("nextDateTimePickerId mints stable, incrementing, SSR-safe ids", () => {
    const a = nextDateTimePickerId();
    const b = nextDateTimePickerId();
    expect(a).toMatch(/^date-time-picker-\d+$/);
    expect(b).not.toBe(a);
  });

  test("autoInit wires every root on the page", () => {
    document.body.innerHTML =
      renderMacro({ label: "A", labels: LABELS, name: "a" }) +
      renderMacro({ label: "B", labels: LABELS, name: "b" });
    const apis = autoInit({ locale: "en-GB" });
    expect(apis.length).toBe(2);
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".date-time-picker-button"),
    );
    click(buttons[1]);
    const dialogs = Array.from(
      document.querySelectorAll<HTMLElement>(".date-time-picker-dialog"),
    );
    expect(dialogs[0].hasAttribute("hidden")).toBe(true);
    expect(dialogs[1].hasAttribute("hidden")).toBe(false);
  });

  test("initDateTimePicker is inert on a missing or foreign root", () => {
    expect(() => initDateTimePicker(null as any)).not.toThrow();
    document.body.innerHTML = "<div></div>";
    const api = initDateTimePicker(document.body.firstElementChild as HTMLElement);
    expect(() => api.open()).not.toThrow();
    expect(() => api.destroy()).not.toThrow();
  });

  test("the focus trap cycles Tab within the dialog", () => {
    const { button, dialog } = setup({ value: "2026-03-15" });
    click(button);
    const focusables = Array.from(
      dialog.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), select:not([disabled])'),
    ) as HTMLElement[];
    const last = focusables[focusables.length - 1];
    last.focus();
    keydown(dialog, "Tab");
    expect(document.activeElement).toBe(focusables[0]);
    keydown(dialog, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  test("clicking outside the root closes the dialog without committing", () => {
    const { button, dialog, hiddenInput } = setup({
      value: "2026-03-01",
      confirmOnSelect: false,
    });
    click(button);
    click(dayButton(dialog, "2026-03-20"));
    click(document.body);
    expect(dialog.hasAttribute("hidden")).toBe(true);
    expect(hiddenInput.value).toBe("2026-03-01");
  });

  test("defaultFormatValue and dayLabel are exported for consumers composing their own formatValue", () => {
    expect(defaultFormatValue("2026-03-01", "date", "en-GB", false)).toContain("2026");
    expect(dayLabel("2026-03-01", "en-GB")).toContain("2026");
  });

  test("glyph escapes: CALENDAR is a unicode escape, never a bare character in source", () => {
    expect(CALENDAR).toBe("\u{1F4C5}\uFE0E");
    expect(CALENDAR.length).toBe(3); // surrogate pair + variation selector
  });
});
