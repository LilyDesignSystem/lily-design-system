// DateTimePicker client-side runtime.
//
// Pairs with date-time-picker.njk. The macro renders every piece of
// markup whose text is FIXED at render time — the trigger, the hidden
// input, the header nav buttons, the hour/minute <label>s, the footer,
// and any shortcut buttons — and leaves a deliberately empty interior
// for this module to fill in: the weekday <th> row, the <tbody> of day
// cells, the "March 2026" period heading, the hour/minute <option>
// lists, and (when the clock turns out to be 12-hour) the meridiem
// <label>+<select> themselves. None of that can be produced by a
// template at all: it needs Intl.DateTimeFormat and civil-date
// arithmetic, which Nunjucks has no access to. This is the one place in
// the catalog where the client does not just wire behaviour onto
// pre-rendered markup — it owns a slice of the markup outright. See
// spec/index.md §3.4 for the full account.
//
// This module also owns everything interactive, exactly like every
// other helper's client.js:
//
// A. Opening/closing the dialog, the focus trap, and the full grid
//    keyboard contract (arrows, Home/End, PageUp/Down, Shift+PageUp/Down,
//    Enter/Space).
// B. Typed-input parsing on blur/Enter, with the same parse cascade as
//    the canonical Svelte helper.
// C. Committing / cancelling / clearing — the pending-vs-committed
//    split from spec/index.md §3.
// D. Re-resolving `disabledDates` (the macro-side isDateDisabled
//    substitute — see the deviation note in date-time-picker.njk) with
//    an optional real `isDateDisabled` predicate supplied here.
//
// Unlike the *-select helpers, this module applies NOTHING to the
// document root and persists NOTHING to localStorage — a date in a
// form is data, not a preference. See spec/index.md §2.
//
// See spec/index.md §4.3 (client.js exports), §4.4 (deviations), §5
// (behaviour).

/**
 * Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
 * SELECTOR-15 to request text (monochrome) presentation.
 *
 * Same construction as the other helpers' glyphs. Written as an escape,
 * never as a bare character: a variation selector has no visual form at
 * all, so a bare one is invisible in an editor and trivially lost to a
 * careless edit.
 */
export const CALENDAR = "\u{1F4C5}\uFE0E";

// ---------------------------------------------------------------------
// Civil-date arithmetic — pure and total, ported from the canonical
// Svelte helper's <script module> block. No local-midnight `Date`
// construction anywhere: `new Date(2026, 2, 1)` is an instant at
// midnight *local time*, and in a zone whose DST transition falls at
// midnight that instant can resolve to the previous day. All arithmetic
// here goes through UTC epoch days instead. See spec/index.md §3.
// ---------------------------------------------------------------------

/** Zero-pad to `width`. */
export function pad(n, width = 2) {
  return String(Math.abs(n)).padStart(width, "0");
}

/** Days in a month. `month` is 1-12. */
export function daysInMonth(year, month) {
  // Day 0 of the next month is the last day of this one.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `{year, month, day}` -> `"YYYY-MM-DD"`. */
export function formatIsoDate(date) {
  return `${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}

/**
 * `"YYYY-MM-DD"` -> `{year, month, day}`, or null.
 *
 * Rejects impossible components rather than rolling them over, so
 * `"2026-02-31"` is null, not the 3rd of March.
 */
export function parseIsoDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text ?? "").trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** Days since the Unix epoch. The unit all date arithmetic goes through. */
export function toEpochDay(date) {
  return Date.UTC(date.year, date.month - 1, date.day) / 86400000;
}

/** Inverse of `toEpochDay`. */
export function fromEpochDay(epochDay) {
  const d = new Date(epochDay * 86400000);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Shift an ISO date by whole days. */
export function addDays(isoDate, days) {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  return formatIsoDate(fromEpochDay(toEpochDay(date) + days));
}

/**
 * Shift an ISO date by whole months, clamping the day.
 *
 * 31 January + 1 month is 28 February (29 in a leap year), not 3 March.
 */
export function addMonths(isoDate, months) {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  const total = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (((total % 12) + 12) % 12) + 1;
  return formatIsoDate({
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  });
}

/** Day of week: 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(isoDate) {
  const date = parseIsoDate(isoDate);
  if (!date) return 0;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/**
 * ISO-8601 week number.
 *
 * Weeks start Monday and week 1 is the one containing the first
 * Thursday, which is why this pivots on Thursday rather than counting
 * from 1 January.
 */
export function isoWeek(isoDate) {
  if (!parseIsoDate(isoDate)) return 0;
  const mondayIndex = (weekdayOf(isoDate) + 6) % 7;
  const thursday = addDays(isoDate, 3 - mondayIndex);
  const parsed = parseIsoDate(thursday);
  if (!parsed) return 0;
  const jan1 = parseIsoDate(formatIsoDate({ year: parsed.year, month: 1, day: 1 }));
  if (!jan1) return 0;
  return Math.floor((toEpochDay(parsed) - toEpochDay(jan1)) / 7) + 1;
}

/** `"09:30"` -> `{hour, minute}`, or null. */
export function parseIsoTime(text) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(text ?? "").trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** `{hour, minute}` -> `"09:30"`. */
export function formatIsoTime(time) {
  return `${pad(time.hour)}:${pad(time.minute)}`;
}

/** Pull the date and time halves out of a mode-appropriate ISO value. */
export function splitValue(value, mode) {
  if (!value) return { date: "", time: "" };
  if (mode === "time") {
    return { date: "", time: parseIsoTime(value) ? value : "" };
  }
  const parts = String(value).split("T");
  const datePart = parts[0] || "";
  const timePart = parts[1] || "";
  return {
    date: parseIsoDate(datePart) ? datePart : "",
    time: mode === "datetime" && parseIsoTime(timePart) ? timePart : "",
  };
}

/** Recombine the halves. Returns "" when the value is incomplete. */
export function joinValue(date, time, mode) {
  if (mode === "date") return date;
  if (mode === "time") return time;
  return date && time ? `${date}T${time}` : "";
}

/** Is `isoDate` inside the inclusive [min, max] window? Empty bounds pass. */
export function withinRange(isoDate, min, max) {
  if (min && isoDate < min) return false;
  if (max && isoDate > max) return false;
  return true;
}

/** Uppercase region subtag of a BCP 47 tag, or "". */
function regionOf(locale) {
  if (!locale) return "";
  for (const part of String(locale).split(/[-_]/).slice(1)) {
    if (/^[A-Za-z]{2}$/.test(part)) return part.toUpperCase();
  }
  return "";
}

const SUNDAY_FIRST_REGIONS = new Set([
  "AR", "BR", "CA", "CL", "CO", "DO", "GT", "HK", "IL", "IN", "JP",
  "KR", "MO", "MX", "PE", "PH", "PK", "TH", "TW", "US", "VE", "ZA",
]);

const SATURDAY_FIRST_REGIONS = new Set([
  "AE", "AF", "BH", "DJ", "DZ", "EG", "IQ", "IR", "JO", "KW", "LY",
  "OM", "QA", "SA", "SD", "SY", "YE",
]);

/**
 * First day of the week for a locale: 0 = Sunday ... 6 = Saturday.
 *
 * `Intl.Locale.prototype.getWeekInfo` is the right answer where it
 * exists; the fallback is a short region table plus a Monday default.
 */
export function firstDayOfWeekFor(locale) {
  if (locale) {
    try {
      const loc = new Intl.Locale(locale);
      const info = typeof loc.getWeekInfo === "function" ? loc.getWeekInfo() : loc.weekInfo;
      if (info && typeof info.firstDay === "number") {
        // getWeekInfo reports 1 = Monday ... 7 = Sunday, so Sunday (7)
        // has to fold to 0.
        return info.firstDay % 7;
      }
    } catch (_e) {
      // Malformed tag -- fall through to the table.
    }
  }
  const region = regionOf(locale);
  if (SUNDAY_FIRST_REGIONS.has(region)) return 0;
  if (SATURDAY_FIRST_REGIONS.has(region)) return 6;
  return 1;
}

/**
 * The dates of one month's grid, always six rows of seven.
 *
 * Fixed height on purpose: a grid sized to its month runs four to six
 * rows, which would move the footer vertically as the user pages.
 */
export function monthMatrix(year, month, firstDayOfWeek) {
  const first = formatIsoDate({ year, month, day: 1 });
  const lead = (weekdayOf(first) - firstDayOfWeek + 7) % 7;
  const start = addDays(first, -lead);
  const weeks = [];
  for (let row = 0; row < 6; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) {
      week.push(addDays(start, row * 7 + col));
    }
    weeks.push(week);
  }
  return weeks;
}

/** Long and short month names for a locale, index 0 = January. */
export function monthNames(locale) {
  const build = (month) => {
    try {
      const fmt = new Intl.DateTimeFormat(locale, { month, timeZone: "UTC" });
      return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(Date.UTC(2021, i, 15))));
    } catch (_e) {
      return [];
    }
  };
  return { long: build("long"), short: build("short") };
}

/** Match a token against a locale's month names. Returns 1-12, or 0. */
function matchMonthName(token, names) {
  const norm = (s) => s.toLocaleLowerCase().replace(/\.$/, "").normalize("NFKD");
  const t = norm(token);
  if (!t || /^\d+$/.test(t)) return 0;
  for (let i = 0; i < 12; i++) {
    if (norm(names.long[i] || "") === t) return i + 1;
    if (norm(names.short[i] || "") === t) return i + 1;
  }
  // Prefix match, so "Sept" finds September. Three characters minimum:
  // "Ma" cannot choose between March and May.
  if (t.length >= 3) {
    for (let i = 0; i < 12; i++) {
      const long = norm(names.long[i] || "");
      if (long && long.startsWith(t)) return i + 1;
    }
  }
  return 0;
}

/**
 * The order a locale writes a numeric date in -- `["day","month","year"]`
 * for en-GB, `["month","day","year"]` for en-US.
 */
export function numericFieldOrder(locale) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2021, 4, 6)));
    const order = parts.map((p) => p.type).filter((t) => t === "day" || t === "month" || t === "year");
    if (order.length === 3) return order;
  } catch (_e) {
    // Fall through.
  }
  return ["day", "month", "year"];
}

/**
 * Parse typed text into an ISO date.
 *
 * Accepts, in order: ISO `YYYY-MM-DD`; a numeric form whose field order
 * follows the locale; and a form with a written month matched against
 * the locale's own long and short month names.
 */
export function parseDateInput(text, locale) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return null;

  const iso = parseIsoDate(trimmed);
  if (iso) return formatIsoDate(iso);

  const parts = trimmed.split(/[\s./-]+/).filter(Boolean);
  if (parts.length !== 3) return null;

  const names = monthNames(locale);
  let month = 0;
  let monthIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    const found = matchMonthName(parts[i], names);
    if (found) {
      month = found;
      monthIndex = i;
      break;
    }
  }

  let day = 0;
  let year = 0;

  if (monthIndex >= 0) {
    const rest = parts.filter((_, i) => i !== monthIndex).map((p) => Number(p));
    if (rest.some((n) => Number.isNaN(n))) return null;
    if (rest[0] > rest[1]) {
      day = rest[1];
      year = rest[0];
    } else {
      day = rest[0];
      year = rest[1];
    }
  } else {
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => Number.isNaN(n))) return null;
    const order = numericFieldOrder(locale);
    year = nums[order.indexOf("year")];
    day = nums[order.indexOf("day")];
    month = nums[order.indexOf("month")];
  }

  // Two-digit years: the usual 70 pivot.
  if (year < 100) year += year < 70 ? 2000 : 1900;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return formatIsoDate({ year, month, day });
}

/** Accepts `9:30`, `09:30`, `0930`, `9.30`, and a trailing am/pm. */
export function parseTimeInput(text) {
  const m = /^(\d{1,2})[:.]?(\d{2})\s*([ap])\.?m\.?$|^(\d{1,2})[:.]?(\d{2})$/.exec(
    String(text ?? "").trim().toLowerCase(),
  );
  if (!m) return null;
  let hour = Number(m[1] ?? m[4]);
  const minute = Number(m[2] ?? m[5]);
  const meridiem = m[3];
  if (meridiem === "p" && hour < 12) hour += 12;
  if (meridiem === "a" && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;
  return formatIsoTime({ hour, minute });
}

// ---------------------------------------------------------------------
// Locale-driven formatting -- every visible string comes from Intl or
// from a caller-supplied override, never from a baked-in table. See
// spec/index.md §5.6.
// ---------------------------------------------------------------------

/** Does this locale write times on a 12-hour clock? */
export function localeUsesHour12(locale) {
  try {
    const parts = new Intl.DateTimeFormat(locale, { hour: "numeric", timeZone: "UTC" }).formatToParts(
      new Date(Date.UTC(2021, 0, 1, 13)),
    );
    return parts.some((p) => p.type === "dayPeriod");
  } catch (_e) {
    return false;
  }
}

/** The locale's own AM / PM strings, so neither is hardcoded. */
export function dayPeriodName(locale, pm) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2021, 0, 1, pm ? 13 : 1)));
    const found = parts.find((p) => p.type === "dayPeriod")?.value;
    if (found) return found;
  } catch (_e) {
    // Fall through.
  }
  return pm ? "PM" : "AM";
}

/** Accessible name for one day cell, e.g. "Sunday 1 March 2026". */
export function dayLabel(isoDate, locale) {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) return isoDate;
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)));
  } catch (_e) {
    return isoDate;
  }
}

function formatTimeForDisplay(isoTime, locale, hour12) {
  const parsed = parseIsoTime(isoTime);
  if (!parsed) return isoTime;
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12,
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2021, 0, 1, parsed.hour, parsed.minute)));
  } catch (_e) {
    return isoTime;
  }
}

/** Render an ISO value the way this locale writes it. The default `formatValue`. */
export function defaultFormatValue(isoValue, mode, locale, hour12) {
  if (!isoValue) return "";
  const { date, time } = splitValue(isoValue, mode);
  const chunks = [];
  const parsed = date ? parseIsoDate(date) : null;
  if (parsed) {
    try {
      chunks.push(
        new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day))),
      );
    } catch (_e) {
      chunks.push(date);
    }
  }
  if (time) chunks.push(formatTimeForDisplay(time, locale, hour12));
  return chunks.join(" ");
}

let uid = 0;
/** Stable, incrementing, SSR-safe id prefix for a JS-built root (no Math.random / Date.now). */
export function nextDateTimePickerId() {
  uid += 1;
  return `date-time-picker-${uid}`;
}

// ---------------------------------------------------------------------
// Hydration
// ---------------------------------------------------------------------

/**
 * Wire one rendered DateTimePicker root.
 *
 * @param {HTMLElement} root - The `[data-lily-date-time-picker-root]`.
 * @param {{
 *   label?: string,
 *   labels?: object,
 *   locale?: string,
 *   min?: string,
 *   max?: string,
 *   isDateDisabled?: (isoDate: string) => boolean,
 *   firstDayOfWeek?: number,
 *   minuteStep?: number,
 *   hour12?: boolean,
 *   showWeekNumbers?: boolean,
 *   shortcuts?: Array<{id: string, label: string, days?: number, months?: number, date?: string}>,
 *   confirmOnSelect?: boolean,
 *   formatValue?: (value: string) => string,
 *   parseInput?: (text: string) => string | null,
 *   onChange?: (value: string) => void,
 *   onShortcut?: (id: string, isoDate: string) => void,
 *   onInvalidInput?: (text: string) => void,
 * }=} opts
 * @returns {{open: () => void, close: () => void, commit: () => void, clear: () => void, getValue: () => string, destroy: () => void}}
 */
export function initDateTimePicker(root, opts = {}) {
  const noop = {
    open: () => {},
    close: () => {},
    commit: () => {},
    clear: () => {},
    getValue: () => "",
    destroy: () => {},
  };
  if (typeof document === "undefined" || !root) return noop;

  const input = root.querySelector("[data-lily-date-time-picker-input]");
  const button = root.querySelector("[data-lily-date-time-picker-button]");
  const dialog = root.querySelector("[data-lily-date-time-picker-dialog]");
  const hiddenInput = root.querySelector("[data-lily-date-time-picker-hidden-input]");
  if (!input || !button || !dialog || !hiddenInput) return noop;

  const dataAttr = (suffix) => root.getAttribute(`data-lily-date-time-picker-${suffix}`) || "";

  const mode = root.getAttribute("data-mode") || "date";
  const usesDate = mode !== "time";
  const usesTime = mode !== "date";

  const locale = opts.locale || dataAttr("locale") || undefined;
  const min = opts.min || dataAttr("min") || undefined;
  const max = opts.max || dataAttr("max") || undefined;

  const firstDayOfWeekAttr = dataAttr("first-day-of-week");
  const firstDayOfWeek =
    opts.firstDayOfWeek !== undefined
      ? opts.firstDayOfWeek
      : firstDayOfWeekAttr !== ""
        ? Number(firstDayOfWeekAttr)
        : firstDayOfWeekFor(locale);

  const minuteStepAttr = dataAttr("minute-step");
  const minuteStep =
    opts.minuteStep !== undefined ? opts.minuteStep : minuteStepAttr !== "" ? Number(minuteStepAttr) : 1;

  const hour12Attr = dataAttr("hour12");
  const hour12 =
    opts.hour12 !== undefined ? opts.hour12 : hour12Attr !== "" ? hour12Attr === "true" : localeUsesHour12(locale);

  const showWeekNumbers =
    opts.showWeekNumbers !== undefined ? opts.showWeekNumbers : dataAttr("show-week-numbers") === "true";

  const confirmOnSelectAttr = dataAttr("confirm-on-select");
  const confirmOnSelect =
    opts.confirmOnSelect !== undefined
      ? opts.confirmOnSelect
      : confirmOnSelectAttr !== ""
        ? confirmOnSelectAttr === "true"
        : mode === "date";

  // --- isDateDisabled (§3.4 deviation): a JSON list from the macro,
  // layered under an optional real predicate supplied here.
  let disabledDates = new Set();
  const disabledDatesAttr = dataAttr("disabled-dates");
  if (disabledDatesAttr) {
    try {
      const parsed = JSON.parse(disabledDatesAttr);
      if (Array.isArray(parsed)) disabledDates = new Set(parsed);
    } catch (_e) {
      disabledDates = new Set();
    }
  }
  const isDateDisabledFn = typeof opts.isDateDisabled === "function" ? opts.isDateDisabled : null;

  function dayDisabled(isoDate) {
    if (!withinRange(isoDate, min, max)) return true;
    if (isDateDisabledFn) return isDateDisabledFn(isoDate) === true;
    return disabledDates.has(isoDate);
  }

  // --- Elements the macro always renders.
  const previousYearButton = root.querySelector("[data-lily-date-time-picker-previous-year]");
  const previousMonthButton = root.querySelector("[data-lily-date-time-picker-previous-month]");
  const nextMonthButton = root.querySelector("[data-lily-date-time-picker-next-month]");
  const nextYearButton = root.querySelector("[data-lily-date-time-picker-next-year]");
  const periodEl = root.querySelector("[data-lily-date-time-picker-period]");
  const calendarTable = root.querySelector("[data-lily-date-time-picker-calendar]");
  const weekdaysRow = root.querySelector("[data-lily-date-time-picker-weekdays]");
  const gridBody = root.querySelector("[data-lily-date-time-picker-grid]");
  const timeContainer = root.querySelector("[data-lily-date-time-picker-time]");
  const hourSelect = root.querySelector("[data-lily-date-time-picker-hour]");
  const minuteSelect = root.querySelector("[data-lily-date-time-picker-minute]");
  const shortcutsContainer = root.querySelector("[data-lily-date-time-picker-shortcuts]");
  const clearButton = root.querySelector("[data-lily-date-time-picker-clear]");
  const cancelButton = root.querySelector("[data-lily-date-time-picker-cancel]");
  const confirmButton = root.querySelector("[data-lily-date-time-picker-confirm]");

  // --- The meridiem select (§3.4 deviation 3): the macro cannot decide
  // whether the clock is 12-hour, so it never renders this. Built here,
  // once, only when needed.
  let meridiemSelect = null;
  if (usesTime && hour12 && timeContainer) {
    const baseId = dialog.id ? dialog.id.replace(/-dialog$/, "") : nextDateTimePickerId();
    const meridiemLabelText =
      (opts.labels && opts.labels.meridiem) || dataAttr("meridiem-label") || "";
    const meridiemLabel = document.createElement("label");
    meridiemLabel.className = "date-time-picker-time-label";
    meridiemLabel.setAttribute("for", `${baseId}-meridiem`);
    meridiemLabel.textContent = meridiemLabelText;
    meridiemSelect = document.createElement("select");
    meridiemSelect.className = "date-time-picker-meridiem";
    meridiemSelect.id = `${baseId}-meridiem`;
    timeContainer.appendChild(meridiemLabel);
    timeContainer.appendChild(meridiemSelect);
  }

  // --- Init opts win over the rendered labels, matching the sibling
  // helpers' convention: a consumer already reaching for JavaScript can
  // override what the template baked in without re-rendering.
  if (opts.label) {
    button.setAttribute("aria-label", opts.label);
    dialog.setAttribute("aria-label", opts.label);
  }
  if (opts.labels) {
    const setLabel = (el, text) => {
      if (el && text) el.setAttribute("aria-label", text);
    };
    setLabel(previousYearButton, opts.labels.previousYear);
    setLabel(previousMonthButton, opts.labels.previousMonth);
    setLabel(nextMonthButton, opts.labels.nextMonth);
    setLabel(nextYearButton, opts.labels.nextYear);
    if (confirmButton && opts.labels.confirm) confirmButton.textContent = opts.labels.confirm;
    if (cancelButton && opts.labels.cancel) cancelButton.textContent = opts.labels.cancel;
    if (clearButton && opts.labels.clear) clearButton.textContent = opts.labels.clear;
  }

  /**
   * All mutable state for this instance, in one place. Kept as a plain
   * object (not framework reactivity) because there is no framework
   * here -- every state change is followed by an explicit render call.
   */
  const state = {
    open: false,
    invalid: false,
    /** Text typed but not yet resolved. null = "show the formatted value". */
    typed: null,
    pendingDate: "",
    pendingTime: "",
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth() + 1,
    cursor: "",
    today: "",
    value: hiddenInput.value || "",
  };

  function committed() {
    return splitValue(state.value, mode);
  }

  function todayIso() {
    const now = new Date();
    return formatIsoDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
  }

  /** The nearest selectable day to `isoDate`, searching outwards. */
  function nearestSelectable(isoDate) {
    if (!dayDisabled(isoDate)) return isoDate;
    for (let delta = 1; delta <= 366; delta++) {
      const after = addDays(isoDate, delta);
      if (!dayDisabled(after)) return after;
      const before = addDays(isoDate, -delta);
      if (!dayDisabled(before)) return before;
    }
    return isoDate;
  }

  /** Where an unset time starts: now, snapped down to the step. */
  function defaultTime() {
    if (!usesTime) return "";
    const now = new Date();
    const step = Math.max(1, minuteStep);
    return formatIsoTime({ hour: now.getHours(), minute: Math.floor(now.getMinutes() / step) * step });
  }

  function formatForDisplay(isoValue) {
    if (typeof opts.formatValue === "function") return opts.formatValue(isoValue);
    return defaultFormatValue(isoValue, mode, locale, hour12);
  }

  function refreshField() {
    input.value = state.typed !== null ? state.typed : formatForDisplay(state.value);
    if (state.invalid) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  // -------------------------------------------------------------
  // Weekday header -- built once; depends only on locale + firstDayOfWeek.
  // -------------------------------------------------------------

  function renderWeekdayHeader() {
    if (!weekdaysRow) return;
    Array.from(weekdaysRow.querySelectorAll(".date-time-picker-weekday")).forEach((el) => el.remove());
    for (let i = 0; i < 7; i++) {
      // 2021-08-01 was a Sunday, so this walks the week from whichever
      // day the locale starts on.
      const d = new Date(Date.UTC(2021, 7, 1 + ((firstDayOfWeek + i) % 7)));
      let short = "";
      let long = "";
      try {
        short = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(d);
        long = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(d);
      } catch (_e) {
        // Leave blank rather than throw.
      }
      const th = document.createElement("th");
      th.className = "date-time-picker-weekday";
      th.setAttribute("scope", "col");
      // `abbr` carries the full weekday name, so a screen reader
      // announcing the column says "Monday" where the eye reads "Mo".
      th.setAttribute("abbr", long);
      th.textContent = short;
      weekdaysRow.appendChild(th);
    }
  }

  function periodText(viewYear, viewMonth) {
    try {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(viewYear, viewMonth - 1, 1)),
      );
    } catch (_e) {
      return `${viewYear}-${pad(viewMonth)}`;
    }
  }

  // -------------------------------------------------------------
  // Grid
  // -------------------------------------------------------------

  function renderGrid() {
    if (!usesDate || !gridBody) return;
    gridBody.innerHTML = "";
    const weeks = monthMatrix(state.viewYear, state.viewMonth, firstDayOfWeek);
    for (const week of weeks) {
      const tr = document.createElement("tr");
      if (showWeekNumbers) {
        const th = document.createElement("th");
        th.className = "date-time-picker-week";
        th.setAttribute("scope", "row");
        th.textContent = String(isoWeek(week[0]));
        tr.appendChild(th);
      }
      for (const isoDate of week) {
        const parsed = parseIsoDate(isoDate);
        const isToday = isoDate === state.today;
        const isSelected = isoDate === state.pendingDate;
        const isOutside = !parsed || parsed.month !== state.viewMonth;
        const td = document.createElement("td");
        td.setAttribute("role", "gridcell");
        td.setAttribute("aria-selected", isSelected ? "true" : "false");
        const dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.className = "date-time-picker-day";
        dayButton.setAttribute("data-date", isoDate);
        if (isOutside) dayButton.setAttribute("data-outside", "");
        if (isToday) dayButton.setAttribute("data-today", "");
        if (isSelected) dayButton.setAttribute("data-selected", "");
        dayButton.setAttribute("tabindex", isoDate === state.cursor ? "0" : "-1");
        dayButton.setAttribute("aria-label", dayLabel(isoDate, locale));
        if (isToday) dayButton.setAttribute("aria-current", "date");
        if (dayDisabled(isoDate)) dayButton.disabled = true;
        dayButton.textContent = parsed ? String(parsed.day) : "";
        dayButton.addEventListener("click", () => selectDay(isoDate));
        td.appendChild(dayButton);
        tr.appendChild(td);
      }
      gridBody.appendChild(tr);
    }
    if (periodEl) periodEl.textContent = periodText(state.viewYear, state.viewMonth);
  }

  function focusCursor() {
    if (!dialog || !state.cursor) return;
    const el = dialog.querySelector(`[data-date="${state.cursor}"]`);
    // Guard the methods, not only the element: jsdom implements no
    // `scrollIntoView`, and an unguarded call throws from inside a
    // keydown handler.
    el?.focus?.();
    el?.scrollIntoView?.({ block: "nearest" });
  }

  function moveCursor(nextIso) {
    if (!withinRange(nextIso, min, max)) return;
    state.cursor = nextIso;
    const parsed = parseIsoDate(nextIso);
    if (parsed && (parsed.year !== state.viewYear || parsed.month !== state.viewMonth)) {
      state.viewYear = parsed.year;
      state.viewMonth = parsed.month;
    }
    renderGrid();
    focusCursor();
  }

  function selectDay(isoDate) {
    if (dayDisabled(isoDate)) return;
    state.pendingDate = isoDate;
    state.cursor = isoDate;
    if (confirmOnSelect) commit();
    else renderGrid();
  }

  function shiftMonth(delta) {
    const anchor = formatIsoDate({ year: state.viewYear, month: state.viewMonth, day: 1 });
    const next = parseIsoDate(addMonths(anchor, delta));
    if (!next) return;
    state.viewYear = next.year;
    state.viewMonth = next.month;
    const c = parseIsoDate(state.cursor);
    if (c) {
      state.cursor = formatIsoDate({
        year: next.year,
        month: next.month,
        day: Math.min(c.day, daysInMonth(next.year, next.month)),
      });
    }
    renderGrid();
    focusCursor();
  }

  function shiftYear(delta) {
    shiftMonth(delta * 12);
  }

  // -------------------------------------------------------------
  // Time selects
  // -------------------------------------------------------------

  function renderTimeOptions() {
    if (!usesTime) return;
    const parsedPending = parseIsoTime(state.pendingTime);
    const pendingHour = parsedPending ? parsedPending.hour : 0;
    const pendingMinute = parsedPending ? parsedPending.minute : 0;

    if (hourSelect) {
      hourSelect.innerHTML = "";
      for (let h = 0; h < 24; h++) {
        // On a 12-hour clock, list only the half of the day the
        // meridiem select is currently on.
        if (hour12 && h < 12 !== pendingHour < 12) continue;
        const option = document.createElement("option");
        option.value = String(h);
        option.textContent = hour12 ? String(((h + 11) % 12) + 1) : pad(h);
        if (h === pendingHour) option.selected = true;
        hourSelect.appendChild(option);
      }
    }

    if (minuteSelect) {
      minuteSelect.innerHTML = "";
      const step = Math.max(1, minuteStep);
      for (let m = 0; m < 60; m += step) {
        const option = document.createElement("option");
        option.value = String(m);
        option.textContent = pad(m);
        if (m === pendingMinute) option.selected = true;
        minuteSelect.appendChild(option);
      }
    }

    if (meridiemSelect) {
      meridiemSelect.innerHTML = "";
      const amOption = document.createElement("option");
      amOption.value = "am";
      amOption.textContent = dayPeriodName(locale, false);
      const pmOption = document.createElement("option");
      pmOption.value = "pm";
      pmOption.textContent = dayPeriodName(locale, true);
      meridiemSelect.appendChild(amOption);
      meridiemSelect.appendChild(pmOption);
      meridiemSelect.value = pendingHour >= 12 ? "pm" : "am";
    }
  }

  function setHour(hour) {
    const parsedPending = parseIsoTime(state.pendingTime);
    const minute = parsedPending ? parsedPending.minute : 0;
    state.pendingTime = formatIsoTime({ hour, minute });
    renderTimeOptions();
  }

  function setMinute(minute) {
    const parsedPending = parseIsoTime(state.pendingTime);
    const hour = parsedPending ? parsedPending.hour : 0;
    state.pendingTime = formatIsoTime({ hour, minute });
    renderTimeOptions();
  }

  /** Cross between AM and PM without changing the minute of the hour. */
  function setMeridiem(pm) {
    const parsedPending = parseIsoTime(state.pendingTime);
    const hour = parsedPending ? parsedPending.hour : 0;
    setHour((hour % 12) + (pm ? 12 : 0));
  }

  // -------------------------------------------------------------
  // Open / close / commit / clear
  // -------------------------------------------------------------

  /** Everything tabbable inside the dialog, in DOM order. */
  function focusablesInDialog() {
    return Array.from(
      dialog.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), select:not([disabled])'),
    );
  }

  function openDialog() {
    if (button.disabled) return;
    state.today = todayIso();
    const c = committed();
    state.pendingDate = c.date || nearestSelectable(state.today);
    state.pendingTime = c.time || defaultTime();
    state.cursor = state.pendingDate;
    const anchor = parseIsoDate(state.pendingDate) || parseIsoDate(state.today);
    if (anchor) {
      state.viewYear = anchor.year;
      state.viewMonth = anchor.month;
    }
    state.open = true;
    dialog.hidden = false;
    button.setAttribute("aria-expanded", "true");
    renderGrid();
    renderTimeOptions();
    if (usesDate) focusCursor();
    else {
      const first = focusablesInDialog()[0];
      first?.focus?.();
    }
  }

  function closeDialog(refocus = true) {
    if (!state.open) return;
    state.open = false;
    dialog.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (refocus) button.focus?.();
  }

  function commit() {
    const next = joinValue(state.pendingDate, state.pendingTime, mode);
    // An incomplete datetime is not committed -- half a timestamp is a
    // different truth, not a smaller one.
    if (!next) return;
    state.typed = null;
    state.invalid = false;
    if (next !== state.value) {
      state.value = next;
      hiddenInput.value = next;
      if (typeof opts.onChange === "function") opts.onChange(next);
    }
    refreshField();
    closeDialog();
  }

  function clearValue() {
    state.typed = null;
    state.invalid = false;
    if (state.value !== "") {
      state.value = "";
      hiddenInput.value = "";
      if (typeof opts.onChange === "function") opts.onChange("");
    }
    refreshField();
    closeDialog();
  }

  // -------------------------------------------------------------
  // Grid keyboard contract
  // -------------------------------------------------------------

  function onGridKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveCursor(addDays(state.cursor, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        moveCursor(addDays(state.cursor, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        moveCursor(addDays(state.cursor, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        moveCursor(addDays(state.cursor, 7));
        break;
      case "Home": {
        event.preventDefault();
        const offset = (weekdayOf(state.cursor) - firstDayOfWeek + 7) % 7;
        moveCursor(addDays(state.cursor, -offset));
        break;
      }
      case "End": {
        event.preventDefault();
        const offset = (weekdayOf(state.cursor) - firstDayOfWeek + 7) % 7;
        moveCursor(addDays(state.cursor, 6 - offset));
        break;
      }
      case "PageUp":
        event.preventDefault();
        if (event.shiftKey) shiftYear(-1);
        else shiftMonth(-1);
        break;
      case "PageDown":
        event.preventDefault();
        if (event.shiftKey) shiftYear(1);
        else shiftMonth(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDay(state.cursor);
        break;
      default:
        break;
    }
  }

  // -------------------------------------------------------------
  // Dialog keys and the focus trap
  //
  // `aria-modal="true"` is a promise the browser does not keep on its
  // own: an untrapped aria-modal dialog tells a screen reader the rest
  // of the page is inert while Tab quietly walks into it. This block
  // exists so that promise is kept for real.
  // -------------------------------------------------------------

  /**
   * Stop every click inside the dialog from reaching the document-level
   * "click outside" listener. See the wiring comment at the call site
   * for why this matters more here than it would in a static list.
   */
  function onDialogClick(event) {
    event.stopPropagation();
  }

  function onDialogKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      // Escape discards: `value` is untouched.
      closeDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const all = focusablesInDialog();
    if (all.length === 0) return;
    const first = all[0];
    const last = all[all.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // -------------------------------------------------------------
  // Text field
  // -------------------------------------------------------------

  function onInput(event) {
    state.typed = event.currentTarget.value;
  }

  function parseTypedForMode(text) {
    if (mode === "time") return parseTimeInput(text);
    if (mode === "date") return parseDateInput(text, locale);
    // datetime: split on the last whitespace run or a literal T, and
    // require both halves -- half a value is never committed.
    const m = /^(.*?)[T\s]+([^\sT]+)$/.exec(text.trim());
    if (!m) return null;
    const date = parseDateInput(m[1], locale);
    const time = parseTimeInput(m[2]);
    return date && time ? `${date}T${time}` : null;
  }

  function resolveTyped() {
    if (state.typed === null) return;
    const text = state.typed;

    if (!text.trim()) {
      state.typed = null;
      state.invalid = false;
      if (state.value !== "") {
        state.value = "";
        hiddenInput.value = "";
        if (typeof opts.onChange === "function") opts.onChange("");
      }
      refreshField();
      return;
    }

    const parsed = typeof opts.parseInput === "function" ? opts.parseInput(text) : parseTypedForMode(text);
    if (!parsed) {
      state.invalid = true;
      refreshField();
      if (typeof opts.onInvalidInput === "function") opts.onInvalidInput(text);
      return;
    }

    const { date } = splitValue(parsed, mode);
    if (usesDate && date && dayDisabled(date)) {
      // Parseable but out of bounds. The text stays put and the field
      // is marked invalid rather than silently snapped to a nearby
      // legal date the user never typed.
      state.invalid = true;
      refreshField();
      if (typeof opts.onInvalidInput === "function") opts.onInvalidInput(text);
      return;
    }

    state.typed = null;
    state.invalid = false;
    if (parsed !== state.value) {
      state.value = parsed;
      hiddenInput.value = parsed;
      if (typeof opts.onChange === "function") opts.onChange(parsed);
    }
    refreshField();
  }

  function onFieldKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      resolveTyped();
    } else if (event.key === "ArrowDown" && event.altKey) {
      // The platform convention for "open the picker" from a field,
      // matching <input type="date"> in every major browser.
      event.preventDefault();
      if (state.open) closeDialog();
      else openDialog();
    }
  }

  // -------------------------------------------------------------
  // Shortcuts
  //
  // Plain data (id/label/days/months/date, no functions), so there is
  // NO deviation here: the macro already rendered real buttons when
  // `shortcuts` was passed to it. A consumer supplying `shortcuts` here
  // instead takes over the container outright, matching share-picker's
  // function-href precedent (the client wins).
  // -------------------------------------------------------------

  function applyShortcut(shortcutId, days, months, date) {
    const base = todayIso();
    let target = date || base;
    if (days !== undefined && days !== null && days !== "") target = addDays(base, Number(days));
    else if (months !== undefined && months !== null && months !== "") target = addMonths(base, Number(months));
    // A shortcut to a blocked date does nothing rather than landing
    // somewhere near it.
    if (dayDisabled(target)) return;
    state.pendingDate = target;
    state.cursor = target;
    const parsed = parseIsoDate(target);
    if (parsed) {
      state.viewYear = parsed.year;
      state.viewMonth = parsed.month;
    }
    if (typeof opts.onShortcut === "function") opts.onShortcut(shortcutId, target);
    if (confirmOnSelect) commit();
    else {
      renderGrid();
      focusCursor();
    }
  }

  function wireShortcutButton(el) {
    el.addEventListener("click", () => {
      applyShortcut(
        el.getAttribute("data-shortcut-id") || "",
        el.hasAttribute("data-days") ? el.getAttribute("data-days") : undefined,
        el.hasAttribute("data-months") ? el.getAttribute("data-months") : undefined,
        el.getAttribute("data-date") || undefined,
      );
    });
  }

  if (shortcutsContainer) {
    if (Array.isArray(opts.shortcuts) && opts.shortcuts.length > 0) {
      shortcutsContainer.innerHTML = "";
      for (const shortcut of opts.shortcuts) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "date-time-picker-shortcut";
        btn.setAttribute("data-shortcut-id", shortcut.id);
        if (shortcut.days !== undefined) btn.setAttribute("data-days", String(shortcut.days));
        if (shortcut.months !== undefined) btn.setAttribute("data-months", String(shortcut.months));
        if (shortcut.date) btn.setAttribute("data-date", shortcut.date);
        btn.textContent = shortcut.label;
        shortcutsContainer.appendChild(btn);
        wireShortcutButton(btn);
      }
    } else {
      Array.from(shortcutsContainer.querySelectorAll(".date-time-picker-shortcut")).forEach(wireShortcutButton);
    }
  }

  // -------------------------------------------------------------
  // Wire everything else up
  // -------------------------------------------------------------

  if (calendarTable) calendarTable.addEventListener("keydown", onGridKeydown);
  dialog.addEventListener("keydown", onDialogKeydown);
  // A day click rebuilds the grid synchronously (renderGrid() replaces
  // every button, including the one just clicked) while the click event
  // is still bubbling. Once a node is removed from the document mid-
  // dispatch, `root.contains(event.target)` reads false for the rest of
  // that dispatch, which would make the document-level "click outside"
  // handler below misfire and close the dialog it was just told to keep
  // open. Stopping propagation here means no click that originates
  // inside the dialog ever reaches that handler at all.
  dialog.addEventListener("click", onDialogClick);
  input.addEventListener("input", onInput);
  input.addEventListener("blur", resolveTyped);
  input.addEventListener("keydown", onFieldKeydown);
  if (hourSelect) hourSelect.addEventListener("change", (e) => setHour(Number(e.target.value)));
  if (minuteSelect) minuteSelect.addEventListener("change", (e) => setMinute(Number(e.target.value)));
  if (meridiemSelect) meridiemSelect.addEventListener("change", (e) => setMeridiem(e.target.value === "pm"));
  if (previousYearButton) previousYearButton.addEventListener("click", () => shiftYear(-1));
  if (previousMonthButton) previousMonthButton.addEventListener("click", () => shiftMonth(-1));
  if (nextMonthButton) nextMonthButton.addEventListener("click", () => shiftMonth(1));
  if (nextYearButton) nextYearButton.addEventListener("click", () => shiftYear(1));
  if (clearButton) clearButton.addEventListener("click", clearValue);
  if (cancelButton) cancelButton.addEventListener("click", () => closeDialog());
  if (confirmButton) confirmButton.addEventListener("click", commit);

  function onTriggerClick() {
    if (state.open) closeDialog();
    else openDialog();
  }
  button.addEventListener("click", onTriggerClick);

  function onDocumentClick(event) {
    if (!state.open) return;
    const target = event.target;
    if (target && !root.contains(target)) closeDialog(false);
  }
  document.addEventListener("click", onDocumentClick);

  // -------------------------------------------------------------
  // First render
  //
  // Synchronous, not deferred: shows the month of the supplied value
  // (or today) with no flash once the dialog first opens.
  // -------------------------------------------------------------

  renderWeekdayHeader();
  state.today = todayIso();
  const initialAnchor = parseIsoDate(committed().date) || parseIsoDate(state.today);
  if (initialAnchor) {
    state.viewYear = initialAnchor.year;
    state.viewMonth = initialAnchor.month;
    state.cursor = formatIsoDate(initialAnchor);
  }
  renderGrid();
  renderTimeOptions();
  refreshField();

  return {
    open: openDialog,
    close: () => closeDialog(false),
    commit,
    clear: clearValue,
    getValue: () => state.value,
    destroy: () => {
      if (calendarTable) calendarTable.removeEventListener("keydown", onGridKeydown);
      dialog.removeEventListener("keydown", onDialogKeydown);
      dialog.removeEventListener("click", onDialogClick);
      input.removeEventListener("input", onInput);
      input.removeEventListener("blur", resolveTyped);
      input.removeEventListener("keydown", onFieldKeydown);
      button.removeEventListener("click", onTriggerClick);
      document.removeEventListener("click", onDocumentClick);
    },
  };
}

/**
 * Find every `[data-lily-date-time-picker-root]` and wire it.
 *
 * @param {Parameters<typeof initDateTimePicker>[1]=} opts
 * @returns {Array<ReturnType<typeof initDateTimePicker>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(document.querySelectorAll("[data-lily-date-time-picker-root]"));
  return roots.map((root) => initDateTimePicker(root, opts));
}
