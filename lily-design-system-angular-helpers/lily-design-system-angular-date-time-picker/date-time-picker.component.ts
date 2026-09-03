import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";

/**
 * Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
 * SELECTOR-15 to request text (monochrome) presentation.
 *
 * Same construction as locale-picker's globe. The variation selector is a
 * hint, not a guarantee — several platforms ignore it and render the emoji
 * anyway — but where it is honoured the glyph inherits the page's text
 * colour and stops looking like a sticker among the siblings' ◑, "A" and
 * ➤. Written as an escape, never as a bare character: a variation
 * selector has no visual form at all, so a bare one is invisible in an
 * editor and trivially lost to a careless edit.
 */
export const CALENDAR = "📅︎";

/** What the control collects. */
export type DateTimeMode = "date" | "time" | "datetime";

/**
 * A civil date: no time zone, no instant.
 *
 * The whole component works in these rather than in `Date`, because a
 * `Date` is an instant and a calendar day is not. `new Date(2026, 2, 1)`
 * is midnight *local*, and in a zone whose DST transition falls at
 * midnight that instant can land on the previous day — so a picker built
 * on local-midnight `Date` values shows the wrong day to some users a
 * couple of times a year. Arithmetic here goes through UTC epoch days,
 * which has no such edge.
 */
export type CivilDate = { year: number; month: number; day: number };

/** A wall-clock time, 24-hour, no seconds. */
export type CivilTime = { hour: number; minute: number };

/** One quick-pick button in the dialog. */
export type DateTimeShortcut = {
  /** Stable identifier, passed back on the `shortcut` output. */
  id: string;
  /** Visible button text. Consumer-supplied, so it localises. */
  label: string;
  /** Days from today. Mutually exclusive with `months` and `date`. */
  days?: number;
  /** Calendar months from today. */
  months?: number;
  /** An absolute ISO date, for shortcuts that are not relative. */
  date?: string;
};

/**
 * Every user-facing string the dialog needs.
 *
 * Grouped into one object rather than spread across a dozen flat inputs.
 * The sibling helpers use flat inputs because they need two or three
 * strings; this one needs ten, and ten flat inputs is a call site nobody
 * can read. One object also maps cleanly onto a translation bundle, which
 * is how these strings actually arrive.
 *
 * The four navigation labels and the two footer labels are required: they
 * name buttons that always render, and a button whose accessible name we
 * invented in English is precisely the defect this package exists to
 * avoid. The rest gate optional UI.
 */
export type DateTimePickerLabels = {
  /** Accessible name for the previous-year button. */
  previousYear: string;
  /** Accessible name for the previous-month button. */
  previousMonth: string;
  /** Accessible name for the next-month button. */
  nextMonth: string;
  /** Accessible name for the next-year button. */
  nextYear: string;
  /** Visible text of the commit button. */
  confirm: string;
  /** Visible text of the dismiss button. */
  cancel: string;
  /** Label for the hour select. Required when `mode` includes a time. */
  hour?: string;
  /** Label for the minute select. Required when `mode` includes a time. */
  minute?: string;
  /** Label for the AM/PM select, when `hour12` resolves true. */
  meridiem?: string;
  /** Column heading for week numbers. Required when `showWeekNumbers`. */
  week?: string;
  /** Visible text of the clear button. The button renders only when set. */
  clear?: string;
  /**
   * Message announced when typed text will not parse or is out of range.
   * When set, a `role="status"` live region renders after the field and
   * is wired to it via `aria-errormessage` — without it, `aria-invalid`
   * flips silently and a screen-reader user who has already left the
   * field never hears that their date was refused.
   */
  invalid?: string;
  /**
   * Keyboard help for the dialog, e.g. "Use the arrow keys to choose a
   * date". When set, it renders inside the dialog and becomes the
   * dialog's `aria-describedby`, so a screen reader speaks it once on
   * open — the APG date-picker dialog ships exactly this affordance.
   */
  instructions?: string;
};

/** Context passed to a projected icon `<ng-template>` (the button glyph). */
export type ChildArgs = {
  /** The committed value, in ISO form. */
  value: string;
  /** Is the dialog open? */
  open: boolean;
  /** The value as the user sees it in the field. */
  display: string;
};

/** Payload of the `shortcut` output. */
export type ShortcutEvent = {
  /** The chosen shortcut's `id`. */
  id: string;
  /** The ISO date the shortcut resolved to. */
  isoDate: string;
};

// -----------------------------------------------------------------
// Civil-date arithmetic
//
// Pure and total: no local-time `Date` values, no throwing, null for
// "not a date". Exported so the acceptance tests can exercise the
// arithmetic directly rather than only through the rendered grid.
// -----------------------------------------------------------------

/** Zero-pad to `width`. */
export function pad(n: number, width = 2): string {
  return String(Math.abs(n)).padStart(width, "0");
}

/** Days in a month. `month` is 1-12. */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this one.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `{2026, 3, 1}` → `"2026-03-01"`. */
export function formatIsoDate(date: CivilDate): string {
  return `${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}

/**
 * `"2026-03-01"` → `{2026, 3, 1}`, or null.
 *
 * Rejects impossible components rather than rolling them over, so
 * `"2026-02-31"` is null and not the 3rd of March. A field that silently
 * reinterprets an impossible date is worse than one that refuses it.
 */
export function parseIsoDate(text: string): CivilDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** Days since the Unix epoch. The unit all date arithmetic goes through. */
export function toEpochDay(date: CivilDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / 86400000;
}

/** Inverse of `toEpochDay`. */
export function fromEpochDay(epochDay: number): CivilDate {
  const d = new Date(epochDay * 86400000);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Shift an ISO date by whole days. */
export function addDays(isoDate: string, days: number): string {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  return formatIsoDate(fromEpochDay(toEpochDay(date) + days));
}

/**
 * Shift an ISO date by whole months, clamping the day.
 *
 * 31 January + 1 month is 28 February (29 in a leap year), not 3 March.
 * Rolling over is what `Date.prototype.setMonth` does and it is almost
 * never what someone paging a calendar means.
 */
export function addMonths(isoDate: string, months: number): string {
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

/** Day of week: 0 = Sunday … 6 = Saturday. */
export function weekdayOf(isoDate: string): number {
  const date = parseIsoDate(isoDate);
  if (!date) return 0;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/**
 * ISO-8601 week number.
 *
 * Weeks start Monday and week 1 is the one containing the first Thursday,
 * which is why this pivots on Thursday rather than counting from 1
 * January. Public-sector and clinical rotas quote ISO week numbers, so
 * the column is worth getting exactly right.
 */
export function isoWeek(isoDate: string): number {
  if (!parseIsoDate(isoDate)) return 0;
  const mondayIndex = (weekdayOf(isoDate) + 6) % 7;
  const thursday = addDays(isoDate, 3 - mondayIndex);
  const parsed = parseIsoDate(thursday);
  if (!parsed) return 0;
  const jan1 = parseIsoDate(
    formatIsoDate({ year: parsed.year, month: 1, day: 1 }),
  );
  if (!jan1) return 0;
  return Math.floor((toEpochDay(parsed) - toEpochDay(jan1)) / 7) + 1;
}

/** `"09:30"` → `{9, 30}`, or null. */
export function parseIsoTime(text: string): CivilTime | null {
  const m = /^(\d{2}):(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** `{9, 30}` → `"09:30"`. */
export function formatIsoTime(time: CivilTime): string {
  return `${pad(time.hour)}:${pad(time.minute)}`;
}

/** Pull the date and time halves out of a mode-appropriate ISO value. */
export function splitValue(
  value: string,
  mode: DateTimeMode,
): { date: string; time: string } {
  if (!value) return { date: "", time: "" };
  if (mode === "time") {
    return { date: "", time: parseIsoTime(value) ? value : "" };
  }
  const [datePart = "", timePart = ""] = value.split("T");
  return {
    date: parseIsoDate(datePart) ? datePart : "",
    time: mode === "datetime" && parseIsoTime(timePart) ? timePart : "",
  };
}

/** Recombine the halves. Returns "" when the value is incomplete. */
export function joinValue(
  date: string,
  time: string,
  mode: DateTimeMode,
): string {
  if (mode === "date") return date;
  if (mode === "time") return time;
  return date && time ? `${date}T${time}` : "";
}

/** Is `isoDate` inside the inclusive [min, max] window? Empty bounds pass. */
export function withinRange(
  isoDate: string,
  min?: string,
  max?: string,
): boolean {
  if (min && isoDate < min) return false;
  if (max && isoDate > max) return false;
  return true;
}

/** Uppercase region subtag of a BCP 47 tag, or "". */
function regionOf(locale?: string): string {
  if (!locale) return "";
  for (const part of locale.split(/[-_]/).slice(1)) {
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
 * First day of the week for a locale: 0 = Sunday … 6 = Saturday.
 *
 * `Intl.Locale.prototype.getWeekInfo` is the right answer, but it is
 * recent enough that a fallback still earns its place — and it is
 * missing from some SSR runtimes entirely. The fallback is a short
 * region table plus a Monday default, Monday being both the ISO-8601
 * rule and the majority convention worldwide.
 */
export function firstDayOfWeekFor(locale?: string): number {
  if (locale) {
    try {
      const loc = new Intl.Locale(locale) as Intl.Locale & {
        getWeekInfo?: () => { firstDay: number };
        weekInfo?: { firstDay: number };
      };
      const info = loc.getWeekInfo?.() ?? loc.weekInfo;
      // getWeekInfo reports 1 = Monday … 7 = Sunday, so Sunday (7) has to
      // fold to 0.
      if (info && typeof info.firstDay === "number") {
        return info.firstDay % 7;
      }
    } catch {
      // Malformed tag — fall through to the table.
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
 * Fixed height on purpose. A grid sized to its month runs four to six
 * rows, so the footer — and the confirm button in it — moves vertically
 * as you page months. That is a Fitts's-law tax on every subsequent click
 * and it makes the dialog jump under the pointer. A constant six rows
 * costs at most one extra trailing week.
 */
export function monthMatrix(
  year: number,
  month: number,
  firstDayOfWeek: number,
): string[][] {
  const first = formatIsoDate({ year, month, day: 1 });
  const lead = (weekdayOf(first) - firstDayOfWeek + 7) % 7;
  const start = addDays(first, -lead);
  const weeks: string[][] = [];
  for (let row = 0; row < 6; row++) {
    const week: string[] = [];
    for (let col = 0; col < 7; col++) {
      week.push(addDays(start, row * 7 + col));
    }
    weeks.push(week);
  }
  return weeks;
}

/** Long and short month names for a locale, index 0 = January. */
export function monthNames(locale?: string): {
  long: string[];
  short: string[];
} {
  const build = (month: "long" | "short") => {
    try {
      const fmt = new Intl.DateTimeFormat(locale, {
        month,
        timeZone: "UTC",
      });
      return Array.from({ length: 12 }, (_, i) =>
        fmt.format(new Date(Date.UTC(2021, i, 15))),
      );
    } catch {
      return [];
    }
  };
  return { long: build("long"), short: build("short") };
}

/** Match a token against a locale's month names. Returns 1-12, or 0. */
function matchMonthName(
  token: string,
  names: { long: string[]; short: string[] },
): number {
  const norm = (s: string) =>
    s.toLocaleLowerCase().replace(/\.$/, "").normalize("NFKD");
  const t = norm(token);
  if (!t || /^\d+$/.test(t)) return 0;
  for (let i = 0; i < 12; i++) {
    if (norm(names.long[i] ?? "") === t) return i + 1;
    if (norm(names.short[i] ?? "") === t) return i + 1;
  }
  // Prefix match, so "Sept" finds September. Three characters minimum:
  // "Ma" cannot choose between March and May, and guessing there would be
  // worse than refusing.
  if (t.length >= 3) {
    for (let i = 0; i < 12; i++) {
      const long = norm(names.long[i] ?? "");
      if (long && long.startsWith(t)) return i + 1;
    }
  }
  return 0;
}

/**
 * The order a locale writes a numeric date in — `["day","month","year"]`
 * for en-GB, `["month","day","year"]` for en-US.
 */
export function numericFieldOrder(
  locale?: string,
): ("day" | "month" | "year")[] {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2021, 4, 6)));
    const order = parts
      .map((p) => p.type)
      .filter(
        (t): t is "day" | "month" | "year" =>
          t === "day" || t === "month" || t === "year",
      );
    if (order.length === 3) return order;
  } catch {
    // Fall through.
  }
  return ["day", "month", "year"];
}

/**
 * Parse typed text into an ISO date.
 *
 * Accepts, in order: ISO `YYYY-MM-DD`; a numeric form whose field order
 * follows the locale, so `03/04/2026` is 3 April in en-GB and 4 March in
 * en-US — which is what each user means; and a form with a written month
 * matched against the locale's own long and short month names, which is
 * what lets DHCW's `27-Jun-2025` round-trip.
 *
 * Anything else is null. Guessing harder than this is how date fields
 * silently record the wrong day.
 */
export function parseDateInput(text: string, locale?: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const iso = parseIsoDate(trimmed);
  if (iso) return formatIsoDate(iso);

  const parts = trimmed.split(/[\s./-]+/).filter(Boolean);
  if (parts.length !== 3) return null;

  // Look for a written month first. Whichever field it is, the other two
  // are the day and the year, and their order is then decidable without
  // knowing the locale: the larger number is the year.
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
    const rest = parts
      .filter((_, i) => i !== monthIndex)
      .map((p) => Number(p));
    if (rest.some((n) => Number.isNaN(n))) return null;
    [day, year] = rest[0] > rest[1] ? [rest[1], rest[0]] : rest;
  } else {
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => Number.isNaN(n))) return null;
    const order = numericFieldOrder(locale);
    year = nums[order.indexOf("year")];
    day = nums[order.indexOf("day")];
    month = nums[order.indexOf("month")];
  }

  // Two-digit years: the usual 70 pivot. Documented rather than clever,
  // because any choice here is wrong for someone.
  if (year < 100) year += year < 70 ? 2000 : 1900;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return formatIsoDate({ year, month, day });
}

/** Accepts `9:30`, `09:30`, `0930`, `9.30`, and a trailing am/pm. */
export function parseTimeInput(text: string): string | null {
  const m =
    /^(\d{1,2})[:.]?(\d{2})\s*([ap])\.?m\.?$|^(\d{1,2})[:.]?(\d{2})$/.exec(
      text.trim().toLowerCase(),
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

/** Does this locale write times on a 12-hour clock? */
function localeUsesHour12(loc?: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat(loc, {
      hour: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2021, 0, 1, 13)));
    return parts.some((p) => p.type === "dayPeriod");
  } catch {
    return false;
  }
}

/** The host's current calendar day, read via the *local* getters. */
function todayIso(): string {
  const now = new Date();
  return formatIsoDate({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextDateTimePickerId(): string {
  uid += 1;
  return `date-time-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-date-time-picker label="Choose a date" [labels]="labels">
 *   <ng-template lilyDateTimePickerIcon let-args>{{ args.open ? "×" : "📅" }}</ng-template>
 * </lily-date-time-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyDateTimePickerIcon]",
  standalone: true,
})
export class DateTimePickerIcon {
  static ngTemplateContextGuard(
    _dir: DateTimePickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * DateTimePicker — a headless date / time / datetime control.
 *
 * A typeable text field plus an icon button that opens a WAI-ARIA APG
 * **Date Picker Dialog**: a month grid with a full keyboard contract.
 * Locale-correct by construction — month names, weekday names, first day
 * of week, numeric field order, 12- vs 24-hour clock and day-period names
 * all come from `Intl`. See `spec/index.md` for the full contract.
 *
 * Unlike the three preference helpers this is a **form control**, not a
 * page-header preference control, and it persists nothing.
 */
@Component({
  selector: "lily-date-time-picker",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="date-time-picker {{ className() }}"
      [attr.data-mode]="mode()"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <div class="date-time-picker-field">
        <input
          class="date-time-picker-input"
          [id]="fieldId()"
          type="text"
          autocomplete="off"
          [value]="display()"
          [attr.placeholder]="placeholder() || null"
          [disabled]="disabled()"
          [readOnly]="readOnly()"
          [required]="required()"
          [attr.aria-describedby]="fieldDescribedBy()"
          [attr.aria-invalid]="invalid() ? 'true' : null"
          [attr.aria-errormessage]="
            invalid() && labels().invalid ? statusId : null
          "
          (input)="typed.set($any($event.target).value)"
          (blur)="resolveTyped()"
          (keydown)="onFieldKeydown($event)"
        />

        <button
          #buttonEl
          type="button"
          class="date-time-picker-button"
          [attr.aria-label]="label()"
          aria-haspopup="dialog"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="dialogId"
          [disabled]="disabled() || readOnly()"
          (click)="open() ? closeDialog() : openDialog()"
        >
          @if (iconTemplate(); as tpl) {
            <ng-container
              [ngTemplateOutlet]="tpl"
              [ngTemplateOutletContext]="childContext()"
            />
          } @else {
            <span class="date-time-picker-icon" aria-hidden="true">{{
              glyph
            }}</span>
          }
        </button>
      </div>

      @if (labels().invalid) {
        <!-- Present in the DOM before it has content: a live region that
             appears at the same moment as its message is routinely not
             announced at all. Empty while the field is valid. -->
        <span class="date-time-picker-status" [id]="statusId" role="status">{{
          invalid() ? labels().invalid : ""
        }}</span>
      }

      <div
        #dialogEl
        class="date-time-picker-dialog"
        [id]="dialogId"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="label()"
        [attr.aria-describedby]="labels().instructions ? instructionsId : null"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onDialogKeydown($event)"
      >
        @if (labels().instructions) {
          <!-- Spoken once when the dialog takes focus, via the dialog's
               aria-describedby. Visible by default; a consumer who wants
               it screen-reader-only hides it with their own CSS. -->
          <p class="date-time-picker-instructions" [id]="instructionsId">
            {{ labels().instructions }}
          </p>
        }
        @if (usesDate()) {
          <div class="date-time-picker-header">
            <button
              type="button"
              class="date-time-picker-previous-year"
              [attr.aria-label]="labels().previousYear"
              (click)="shiftYear(-1)"
            >
              <span aria-hidden="true">&#171;</span>
            </button>
            <button
              type="button"
              class="date-time-picker-previous-month"
              [attr.aria-label]="labels().previousMonth"
              (click)="shiftMonth(-1)"
            >
              <span aria-hidden="true">&#8249;</span>
            </button>

            <!-- Polite, not assertive: paging months is the visible result
                 of the user's own keypress, so it should reach a screen
                 reader without interrupting anything. -->
            <span
              class="date-time-picker-period"
              [id]="periodId"
              aria-live="polite"
              >{{ periodText() }}</span
            >

            <button
              type="button"
              class="date-time-picker-next-month"
              [attr.aria-label]="labels().nextMonth"
              (click)="shiftMonth(1)"
            >
              <span aria-hidden="true">&#8250;</span>
            </button>
            <button
              type="button"
              class="date-time-picker-next-year"
              [attr.aria-label]="labels().nextYear"
              (click)="shiftYear(1)"
            >
              <span aria-hidden="true">&#187;</span>
            </button>
          </div>

          <!-- The grid owns its own keyboard contract, which is why the
               handler sits on the table rather than on each of 42 cells. -->
          <table
            #gridEl
            class="date-time-picker-calendar"
            role="grid"
            [attr.aria-labelledby]="periodId"
            (keydown)="onGridKeydown($event)"
          >
            <thead>
              <tr>
                @if (showWeekNumbers()) {
                  <th
                    class="date-time-picker-week-heading"
                    scope="col"
                    [attr.abbr]="labels().week"
                  >
                    {{ labels().week }}
                  </th>
                }
                @for (weekday of weekdays(); track $index) {
                  <!-- abbr carries the full weekday name, so a screen
                       reader announcing the column says "Monday" where the
                       eye reads "Mo". -->
                  <th
                    class="date-time-picker-weekday"
                    scope="col"
                    [attr.abbr]="weekday.long"
                  >
                    {{ weekday.short }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of weeks(); track week[0]) {
                <tr>
                  @if (showWeekNumbers()) {
                    <th class="date-time-picker-week" scope="row">
                      {{ isoWeekOf(week[0]) }}
                    </th>
                  }
                  @for (isoDate of week; track isoDate) {
                    @let cell = parseCell(isoDate);
                    @let isToday = isoDate === today();
                    @let isSelected = isoDate === pendingDate();
                    @let isDisabled = dayDisabled(isoDate);
                    <td role="gridcell" [attr.aria-selected]="isSelected">
                      <!-- aria-disabled, not the disabled attribute: a
                           vetoed day must stay focusable so the roving
                           cursor can land on it and a screen reader can
                           announce it as unavailable. A disabled button
                           refuses focus, and arrowing across a blocked
                           week goes silent while the visible focus stays
                           behind. Activation is refused in selectDay
                           instead. -->
                      <button
                        type="button"
                        class="date-time-picker-day"
                        [attr.data-date]="isoDate"
                        [attr.data-outside]="cell.outside ? '' : null"
                        [attr.data-today]="isToday ? '' : null"
                        [attr.data-selected]="isSelected ? '' : null"
                        [attr.data-disabled]="isDisabled ? '' : null"
                        [attr.tabindex]="isoDate === cursor() ? 0 : -1"
                        [attr.aria-label]="dayLabel(isoDate)"
                        [attr.aria-current]="isToday ? 'date' : null"
                        [attr.aria-disabled]="isDisabled ? 'true' : null"
                        (click)="selectDay(isoDate)"
                      >
                        {{ cell.day }}
                      </button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        }

        @if (usesTime()) {
          <div class="date-time-picker-time">
            <label class="date-time-picker-time-label" [for]="hourId">
              {{ labels().hour }}
            </label>
            <select
              class="date-time-picker-hour"
              [id]="hourId"
              [value]="pendingHour()"
              (change)="setHour(+$any($event.target).value)"
            >
              @for (option of hourOptions(); track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>

            <label class="date-time-picker-time-label" [for]="minuteId">
              {{ labels().minute }}
            </label>
            <select
              class="date-time-picker-minute"
              [id]="minuteId"
              [value]="pendingMinute()"
              (change)="setMinute(+$any($event.target).value)"
            >
              @for (minute of minuteOptions(); track minute) {
                <option [value]="minute">{{ pad2(minute) }}</option>
              }
            </select>

            @if (clock12()) {
              <label class="date-time-picker-time-label" [for]="meridiemId">
                {{ labels().meridiem }}
              </label>
              <select
                class="date-time-picker-meridiem"
                [id]="meridiemId"
                [value]="pendingHour() >= 12 ? 'pm' : 'am'"
                (change)="setMeridiem($any($event.target).value === 'pm')"
              >
                <!-- Stable values, localised labels: the visible text is
                     the locale's own day-period name. -->
                <option value="am">{{ dayPeriodName(false) }}</option>
                <option value="pm">{{ dayPeriodName(true) }}</option>
              </select>
            }
          </div>
        }

        @if (shortcuts().length > 0) {
          <div class="date-time-picker-shortcuts">
            @for (shortcut of shortcuts(); track shortcut.id) {
              <button
                type="button"
                class="date-time-picker-shortcut"
                [attr.data-shortcut-id]="shortcut.id"
                (click)="applyShortcut(shortcut)"
              >
                {{ shortcut.label }}
              </button>
            }
          </div>
        }

        <div class="date-time-picker-footer">
          @if (labels().clear) {
            <button
              type="button"
              class="date-time-picker-clear"
              (click)="clear()"
            >
              {{ labels().clear }}
            </button>
          }
          <button
            type="button"
            class="date-time-picker-cancel"
            (click)="closeDialog()"
          >
            {{ labels().cancel }}
          </button>
          <button
            type="button"
            class="date-time-picker-confirm"
            (click)="commit()"
          >
            {{ labels().confirm }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DateTimePicker {
  /** Accessible name for the trigger button and the dialog. */
  readonly label = input.required<string>();
  /** Every other user-facing string. See `spec/index.md` §4.2. */
  readonly labels = input.required<DateTimePickerLabels>();
  /** What to collect: a date, a time, or both. */
  readonly mode = input<DateTimeMode>("date");
  /** ISO value: `YYYY-MM-DD`, `HH:MM`, or `YYYY-MM-DDTHH:MM`. Two-way bindable. */
  readonly value = model<string>("");
  /** BCP 47 tag driving month names, weekday names and first weekday. */
  readonly locale = input<string>("");
  /** Earliest selectable date, ISO. */
  readonly min = input<string>("");
  /** Latest selectable date, ISO. */
  readonly max = input<string>("");
  /** Veto individual dates — true means "cannot be picked". */
  readonly isDateDisabled = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's convention. */
  readonly firstDayOfWeek = input<number | undefined>(undefined);
  /** Granularity of the minute select. */
  readonly minuteStep = input<number>(1);
  /** 12-hour clock. Defaults to the locale's convention. */
  readonly hour12 = input<boolean | undefined>(undefined);
  /** Render an ISO-8601 week-number column. */
  readonly showWeekNumbers = input<boolean>(false);
  /** Quick-pick buttons. */
  readonly shortcuts = input<DateTimeShortcut[]>([]);
  /** Commit and close as soon as a day is chosen. Defaults to date-only. */
  readonly confirmOnSelect = input<boolean | undefined>(undefined);
  /** `name` of the hidden input that carries the value in a form post. */
  readonly name = input<string>("date-time");
  /** `id` of the text field, so a consumer `<label for>` can name it. */
  readonly inputId = input<string>("");
  /** Forwarded to the text field as `aria-describedby`. */
  readonly describedBy = input<string>("");
  /** Placeholder for the text field. */
  readonly placeholder = input<string>("");
  /** Disable the whole control. */
  readonly disabled = input<boolean>(false);
  /**
   * Show the value but refuse edits.
   *
   * Named `readOnly` (not `readonly`) so the Angular input has an
   * unambiguous identifier distinct from the TypeScript `readonly`
   * modifier — the one Angular-forced rename beyond `class` → `className`.
   */
  readonly readOnly = input<boolean>(false);
  /** Mark the field required. */
  readonly required = input<boolean>(false);
  /** Override how a committed value is rendered into the text field. */
  readonly formatValue = input<((value: string) => string) | undefined>(
    undefined,
  );
  /** Override how typed text is turned back into an ISO value. */
  readonly parseInput = input<((text: string) => string | null) | undefined>(
    undefined,
  );
  /** Extra CSS class on the root `<div>`. */
  readonly className = input<string>("");

  /** Fires after a new value is committed. */
  readonly change = output<string>();
  /** Fires when a shortcut is used, before the value settles. */
  readonly shortcut = output<ShortcutEvent>();
  /** Fires when typed text cannot be parsed. */
  readonly invalidInput = output<string>();

  /** Projected icon template; replaces the default glyph when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("buttonEl");
  private readonly dialogRef =
    viewChild.required<ElementRef<HTMLDivElement>>("dialogEl");
  /** Optional: the grid renders only when `mode` includes a date. */
  private readonly gridRef =
    viewChild<ElementRef<HTMLTableElement>>("gridEl");

  protected readonly glyph = CALENDAR;

  /**
   * For rendering the view synchronously before a focus move.
   *
   * Svelte updates the DOM synchronously when state changes, so the
   * canonical helper can focus a freshly-paged month from a microtask.
   * Angular renders later — after the microtask queue drains, whether the
   * app is zone-based or zoneless — so a queued focus into a month that
   * has not rendered yet finds nothing (or, worse, finds and focuses a
   * cell that the next render destroys, dropping focus to `<body>`).
   * `cdr.detectChanges()` inside the event handler is the Angular
   * equivalent of Svelte's synchronous flush.
   */
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly baseId = nextDateTimePickerId();
  protected readonly dialogId = `${this.baseId}-dialog`;
  protected readonly periodId = `${this.baseId}-period`;
  protected readonly hourId = `${this.baseId}-hour`;
  protected readonly minuteId = `${this.baseId}-minute`;
  protected readonly meridiemId = `${this.baseId}-meridiem`;
  protected readonly statusId = `${this.baseId}-status`;
  protected readonly instructionsId = `${this.baseId}-instructions`;

  protected readonly open = signal(false);
  protected readonly invalid = signal(false);

  /**
   * The element that opened the dialog, so close can return focus to it.
   *
   * The APG rule is "focus returns to the element that invoked the
   * dialog" — which is the trigger button on a click, but the *text
   * field* when the user pressed Alt+ArrowDown. Always refocusing the
   * button strands a keyboard user one Tab stop past where they were.
   */
  private openerEl: HTMLElement | null = null;

  /**
   * Text the user has typed but not yet resolved.
   *
   * `null` means "no pending edit, show the formatted value". An empty
   * string is a real state (the user cleared the field) and must not
   * collapse into `null`.
   */
  protected readonly typed = signal<string | null>(null);

  /**
   * The pending selection, live only while the dialog is open.
   *
   * Kept separate from `value` so Cancel and Escape can genuinely revert.
   * A picker that writes through on every arrow key has no cancel — only
   * an undo the user has to perform by hand, from memory.
   */
  protected readonly pendingDate = signal("");
  protected readonly pendingTime = signal("");

  /** The month on screen. */
  protected readonly viewYear = signal(1970);
  protected readonly viewMonth = signal(1);

  /** The day the grid's roving tabindex sits on. */
  protected readonly cursor = signal("");

  /**
   * Today, sampled once at open and refreshed on the initial effect below.
   * Not re-read per cell: the grid asks "is this today?" 42 times a
   * render, and a clock read per cell buys nothing over a clock read per
   * open.
   */
  protected readonly today = signal("");

  protected readonly fieldId = computed(
    () => this.inputId() || `${this.baseId}-input`,
  );
  protected readonly committed = computed(() =>
    splitValue(this.value(), this.mode()),
  );
  protected readonly weekStart = computed(
    () => this.firstDayOfWeek() ?? firstDayOfWeekFor(this.locale() || undefined),
  );
  protected readonly commitOnDay = computed(
    () => this.confirmOnSelect() ?? this.mode() === "date",
  );
  protected readonly usesDate = computed(() => this.mode() !== "time");
  protected readonly usesTime = computed(() => this.mode() !== "date");
  protected readonly clock12 = computed(
    () => this.hour12() ?? localeUsesHour12(this.locale() || undefined),
  );

  /**
   * `aria-describedby` for the field: the consumer's hint, plus — while
   * invalid, with `labels().invalid` supplied — the status region, for
   * the assistive technologies that read `aria-describedby` but not the
   * newer `aria-errormessage`.
   */
  protected readonly fieldDescribedBy = computed(
    () =>
      [
        this.describedBy() || undefined,
        this.invalid() && this.labels().invalid ? this.statusId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || null,
  );

  /** The text shown in the field. A pending edit wins until resolved. */
  protected readonly display = computed(() => {
    const t = this.typed();
    if (t !== null) return t;
    const formatter = this.formatValue() ?? ((v: string) => this.defaultFormat(v));
    return formatter(this.value());
  });

  /** The "March 2026" heading. */
  protected readonly periodText = computed(() => {
    const viewYear = this.viewYear();
    const viewMonth = this.viewMonth();
    try {
      return new Intl.DateTimeFormat(this.locale() || undefined, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(viewYear, viewMonth - 1, 1)));
    } catch {
      return `${viewYear}-${pad(viewMonth)}`;
    }
  });

  /** Column headings, in this locale, starting on `weekStart`. */
  protected readonly weekdays = computed(() => {
    const weekStart = this.weekStart();
    const locale = this.locale() || undefined;
    const out: { short: string; long: string }[] = [];
    for (let i = 0; i < 7; i++) {
      // 2021-08-01 was a Sunday, so this walks the week from whichever
      // day the locale starts on.
      const d = new Date(Date.UTC(2021, 7, 1 + ((weekStart + i) % 7)));
      try {
        out.push({
          short: new Intl.DateTimeFormat(locale, {
            weekday: "short",
            timeZone: "UTC",
          }).format(d),
          long: new Intl.DateTimeFormat(locale, {
            weekday: "long",
            timeZone: "UTC",
          }).format(d),
        });
      } catch {
        out.push({ short: "", long: "" });
      }
    }
    return out;
  });

  protected readonly weeks = computed(() =>
    monthMatrix(this.viewYear(), this.viewMonth(), this.weekStart()),
  );

  protected readonly pendingHour = computed(
    () => parseIsoTime(this.pendingTime())?.hour ?? 0,
  );
  protected readonly pendingMinute = computed(
    () => parseIsoTime(this.pendingTime())?.minute ?? 0,
  );

  /**
   * The hours offered.
   *
   * On a 12-hour clock this lists only the half of the day the meridiem
   * select is currently on, so the two controls together name exactly one
   * hour. Listing 1-12 once and letting the meridiem reinterpret it is
   * the same thing, but it makes "12 AM" ambiguous at precisely the point
   * where users already get it wrong.
   */
  protected readonly hourOptions = computed(() => {
    const clock12 = this.clock12();
    const pendingHour = this.pendingHour();
    const out: { value: number; label: string }[] = [];
    for (let h = 0; h < 24; h++) {
      if (clock12 && h < 12 !== pendingHour < 12) continue;
      out.push({
        value: h,
        label: clock12 ? String(((h + 11) % 12) + 1) : pad(h),
      });
    }
    return out;
  });

  protected readonly minuteOptions = computed(() => {
    const step = Math.max(1, this.minuteStep());
    const out: number[] = [];
    for (let m = 0; m < 60; m += step) out.push(m);
    return out;
  });

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      display: this.display(),
    };
    return { $implicit: args, ...args };
  });

  private initialised = false;

  constructor() {
    // Seeds the view month and the grid cursor from the committed value
    // (or today) exactly once. Deferred to `effect()`, rather than read
    // synchronously in the constructor, because signal inputs are not
    // bound yet when the constructor runs — an Angular-forced difference
    // from the Svelte original, which reads `value` synchronously at
    // `$props()` time. `effect()` is this catalog's established seam for
    // side effects driven by input signals; see catalog `AGENTS.md`.
    effect(() => {
      const committed = this.committed();
      if (this.initialised) return;
      this.initialised = true;
      const today = todayIso();
      this.today.set(today);
      const anchor = parseIsoDate(committed.date) ?? parseIsoDate(today);
      if (anchor) {
        this.viewYear.set(anchor.year);
        this.viewMonth.set(anchor.month);
        this.cursor.set(formatIsoDate(anchor));
      }
    });
  }

  // ---------------------------------------------------------------
  // Template helpers
  // ---------------------------------------------------------------

  protected pad2(n: number): string {
    return pad(n);
  }

  protected isoWeekOf(isoDate: string): number {
    return isoWeek(isoDate);
  }

  /** Per-cell derived values for the grid template's `@let`. */
  protected parseCell(isoDate: string): { day: string; outside: boolean } {
    const parsed = parseIsoDate(isoDate);
    return {
      day: parsed ? String(parsed.day) : "",
      outside: parsed ? parsed.month !== this.viewMonth() : false,
    };
  }

  /** Accessible name for one day cell, e.g. "Sunday 1 March 2026". */
  protected dayLabel(isoDate: string): string {
    const parsed = parseIsoDate(isoDate);
    if (!parsed) return isoDate;
    try {
      return new Intl.DateTimeFormat(this.locale() || undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)));
    } catch {
      return isoDate;
    }
  }

  /** The locale's own AM / PM strings, so neither is hardcoded. */
  protected dayPeriodName(pm: boolean): string {
    try {
      const parts = new Intl.DateTimeFormat(this.locale() || undefined, {
        hour: "numeric",
        hour12: true,
        timeZone: "UTC",
      }).formatToParts(new Date(Date.UTC(2021, 0, 1, pm ? 13 : 1)));
      const found = parts.find((p) => p.type === "dayPeriod")?.value;
      if (found) return found;
    } catch {
      // Fall through.
    }
    return pm ? "PM" : "AM";
  }

  private formatTimeForDisplay(isoTime: string): string {
    const parsed = parseIsoTime(isoTime);
    if (!parsed) return isoTime;
    try {
      return new Intl.DateTimeFormat(this.locale() || undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: this.clock12(),
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2021, 0, 1, parsed.hour, parsed.minute)));
    } catch {
      return isoTime;
    }
  }

  /** Render an ISO value the way this locale writes it. */
  private defaultFormat(isoValue: string): string {
    if (!isoValue) return "";
    const { date, time } = splitValue(isoValue, this.mode());
    const chunks: string[] = [];
    const parsed = date ? parseIsoDate(date) : null;
    if (parsed) {
      try {
        chunks.push(
          new Intl.DateTimeFormat(this.locale() || undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).format(
            new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)),
          ),
        );
      } catch {
        chunks.push(date);
      }
    }
    if (time) chunks.push(this.formatTimeForDisplay(time));
    return chunks.join(" ");
  }

  // ---------------------------------------------------------------
  // Selectability
  // ---------------------------------------------------------------

  protected dayDisabled(isoDate: string): boolean {
    if (!withinRange(isoDate, this.min() || undefined, this.max() || undefined)) {
      return true;
    }
    return this.isDateDisabled()?.(isoDate) === true;
  }

  /** The nearest selectable day to `isoDate`, searching outwards. */
  private nearestSelectable(isoDate: string): string {
    if (!this.dayDisabled(isoDate)) return isoDate;
    // Bounded: a year either way is far beyond any real min/max window,
    // and an unbounded search would hang on a predicate that disables
    // everything.
    for (let delta = 1; delta <= 366; delta++) {
      const after = addDays(isoDate, delta);
      if (!this.dayDisabled(after)) return after;
      const before = addDays(isoDate, -delta);
      if (!this.dayDisabled(before)) return before;
    }
    return isoDate;
  }

  // ---------------------------------------------------------------
  // Open / close / commit
  // ---------------------------------------------------------------

  protected openDialog(): void {
    if (this.disabled() || this.readOnly()) return;
    // Remember what opened the dialog — the field on Alt+ArrowDown, the
    // trigger button on a click — so closeDialog can put focus back
    // there, per the APG dialog rule.
    const active = document.activeElement;
    this.openerEl =
      active instanceof HTMLElement &&
      this.rootRef().nativeElement.contains(active)
        ? active
        : (this.buttonRef().nativeElement ?? null);
    const today = todayIso();
    this.today.set(today);
    const pendingDate = this.committed().date || this.nearestSelectable(today);
    this.pendingDate.set(pendingDate);
    this.pendingTime.set(this.committed().time || this.defaultTime());
    this.cursor.set(pendingDate);
    const anchor = parseIsoDate(pendingDate) ?? parseIsoDate(today);
    if (anchor) {
      this.viewYear.set(anchor.year);
      this.viewMonth.set(anchor.month);
    }
    this.open.set(true);
    // Render first, focus second: until change detection runs, the
    // dialog still carries `hidden`, and focusing into a hidden subtree
    // is a no-op in a real browser.
    this.cdr.detectChanges();
    this.focusInitial();
  }

  /** Where an unset time starts: now, snapped down to the step. */
  private defaultTime(): string {
    if (!this.usesTime()) return "";
    const now = new Date();
    const step = Math.max(1, this.minuteStep());
    return formatIsoTime({
      hour: now.getHours(),
      minute: Math.floor(now.getMinutes() / step) * step,
    });
  }

  /** Focus the grid cursor, or the first control when there is no grid. */
  private focusInitial(): void {
    if (this.usesDate()) {
      this.focusCursor();
      return;
    }
    this.focusables()[0]?.focus?.();
  }

  protected closeDialog(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) {
      const target = this.openerEl ?? this.buttonRef().nativeElement;
      queueMicrotask(() => target?.focus?.());
    }
  }

  /** Commit the pending selection to `value` and notify. */
  protected commit(): void {
    const next = joinValue(this.pendingDate(), this.pendingTime(), this.mode());
    // An incomplete datetime is not committed. Half a timestamp is not a
    // smaller truth; it is a different one.
    if (!next) return;
    this.typed.set(null);
    this.invalid.set(false);
    if (next !== this.value()) {
      this.value.set(next);
      this.change.emit(next);
    }
    this.closeDialog();
  }

  protected clear(): void {
    this.typed.set(null);
    this.invalid.set(false);
    if (this.value() !== "") {
      this.value.set("");
      this.change.emit("");
    }
    this.closeDialog();
  }

  // ---------------------------------------------------------------
  // Grid navigation
  // ---------------------------------------------------------------

  /**
   * Move the cursor, paging the view when the target is off-screen.
   *
   * Disabled days are still reachable — the cursor lands on them and the
   * button is `aria-disabled` (so it takes real focus and announces), so
   * arrowing across a blocked range works. What is refused is leaving
   * the min/max window entirely, because there is nothing out there to
   * navigate to.
   */
  private moveCursor(nextIso: string): void {
    if (!withinRange(nextIso, this.min() || undefined, this.max() || undefined)) {
      return;
    }
    this.cursor.set(nextIso);
    const parsed = parseIsoDate(nextIso);
    if (
      parsed &&
      (parsed.year !== this.viewYear() || parsed.month !== this.viewMonth())
    ) {
      this.viewYear.set(parsed.year);
      this.viewMonth.set(parsed.month);
    }
    // Synchronous render-then-focus: when the cursor crossed into a new
    // month, the cell it needs does not exist until change detection has
    // run — see `cdr`.
    this.cdr.detectChanges();
    this.focusCursor();
  }

  private focusCursor(): void {
    const dialogEl = this.dialogRef()?.nativeElement;
    const cursor = this.cursor();
    if (!dialogEl || !cursor) return;
    // An attribute selector, not `#id`: the id is not on this element, and
    // a value we generated as `YYYY-MM-DD` needs no escaping.
    const el = dialogEl.querySelector<HTMLElement>(`[data-date="${cursor}"]`);
    // Guard the METHODS, not only the element. jsdom implements no
    // `scrollIntoView`, and an unguarded call throws from inside a
    // keydown handler — where it stays invisible to a green suite.
    el?.focus?.();
    el?.scrollIntoView?.({ block: "nearest" });
  }

  protected selectDay(isoDate: string): void {
    if (this.dayDisabled(isoDate)) return;
    this.pendingDate.set(isoDate);
    this.cursor.set(isoDate);
    if (this.commitOnDay()) this.commit();
  }

  protected shiftMonth(delta: number): void {
    const anchor = formatIsoDate({
      year: this.viewYear(),
      month: this.viewMonth(),
      day: 1,
    });
    const next = parseIsoDate(addMonths(anchor, delta));
    if (!next) return;
    // Refocus the cursor only when focus is already in the grid: grid
    // paging (PageUp/PageDown, or a browser that focused nothing on
    // click) must carry focus, or it dies with the unrendered cell —
    // but a header button must keep focus, or its user is yanked into
    // the grid after one activation and cannot page twice.
    const hadGridFocus =
      this.gridRef()?.nativeElement.contains(document.activeElement) === true;
    this.viewYear.set(next.year);
    this.viewMonth.set(next.month);
    // Carry the cursor into the new month rather than leaving the roving
    // tabindex on a cell that is no longer rendered.
    const c = parseIsoDate(this.cursor());
    if (c) {
      this.cursor.set(
        formatIsoDate({
          year: next.year,
          month: next.month,
          day: Math.min(c.day, daysInMonth(next.year, next.month)),
        }),
      );
      if (hadGridFocus) {
        // Render-then-focus, synchronously — the target cell does not
        // exist until change detection has run. See `cdr`.
        this.cdr.detectChanges();
        this.focusCursor();
      }
    }
  }

  protected shiftYear(delta: number): void {
    this.shiftMonth(delta * 12);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.moveCursor(addDays(this.cursor(), -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveCursor(addDays(this.cursor(), 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        this.moveCursor(addDays(this.cursor(), -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveCursor(addDays(this.cursor(), 7));
        break;
      case "Home": {
        event.preventDefault();
        const offset = (weekdayOf(this.cursor()) - this.weekStart() + 7) % 7;
        this.moveCursor(addDays(this.cursor(), -offset));
        break;
      }
      case "End": {
        event.preventDefault();
        const offset = (weekdayOf(this.cursor()) - this.weekStart() + 7) % 7;
        this.moveCursor(addDays(this.cursor(), 6 - offset));
        break;
      }
      case "PageUp":
        event.preventDefault();
        if (event.shiftKey) this.shiftYear(-1);
        else this.shiftMonth(-1);
        break;
      case "PageDown":
        event.preventDefault();
        if (event.shiftKey) this.shiftYear(1);
        else this.shiftMonth(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        this.selectDay(this.cursor());
        break;
      default:
        break;
    }
  }

  // ---------------------------------------------------------------
  // Dialog keys and the focus trap
  // ---------------------------------------------------------------

  /** Everything tabbable inside the dialog, in DOM order. */
  private focusables(): HTMLElement[] {
    const dialogEl = this.dialogRef()?.nativeElement;
    if (!dialogEl) return [];
    return Array.from(
      dialogEl.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), select:not([disabled])',
      ),
    );
  }

  protected onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      // Escape discards: `value` is untouched, so the field still shows
      // whatever was committed before the dialog opened.
      this.closeDialog();
      return;
    }
    if (event.key !== "Tab") return;

    // The trap. `aria-modal="true"` is a promise that focus cannot reach
    // the page behind the dialog, and it is a promise the browser does
    // not keep for us: an untrapped aria-modal dialog tells a screen
    // reader the rest of the page is inert while Tab quietly walks into
    // it.
    const all = this.focusables();
    if (all.length === 0) return;
    const first = all[0];
    const last = all[all.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const dialogEl = this.dialogRef()?.nativeElement;
    if (event.shiftKey && (active === first || !dialogEl?.contains(active))) {
      event.preventDefault();
      last.focus?.();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus?.();
    }
  }

  // ---------------------------------------------------------------
  // Text field
  // ---------------------------------------------------------------

  /** Default text parsing, per mode. */
  private parseTypedForMode(text: string): string | null {
    if (this.mode() === "time") return parseTimeInput(text);
    if (this.mode() === "date") return parseDateInput(text, this.locale() || undefined);
    // datetime: split on the last whitespace run or a literal T, and
    // require both halves — see `commit` on why half is refused.
    const m = /^(.*?)[T\s]+([^\sT]+)$/.exec(text.trim());
    if (!m) return null;
    const date = parseDateInput(m[1], this.locale() || undefined);
    const time = parseTimeInput(m[2]);
    return date && time ? `${date}T${time}` : null;
  }

  /** Resolve typed text on blur or Enter. */
  protected resolveTyped(): void {
    const text = this.typed();
    if (text === null) return;

    if (!text.trim()) {
      this.typed.set(null);
      this.invalid.set(false);
      if (this.value() !== "") {
        this.value.set("");
        this.change.emit("");
      }
      return;
    }

    const parser = this.parseInput();
    const parsed = parser ? parser(text) : this.parseTypedForMode(text);
    if (!parsed) {
      this.invalid.set(true);
      this.invalidInput.emit(text);
      return;
    }

    const { date } = splitValue(parsed, this.mode());
    if (this.usesDate() && date && this.dayDisabled(date)) {
      // Parseable but out of bounds. Same outcome as unparseable: the
      // text stays put and the field is marked invalid, rather than being
      // silently snapped to some nearby legal date the user never typed.
      this.invalid.set(true);
      this.invalidInput.emit(text);
      return;
    }

    this.typed.set(null);
    this.invalid.set(false);
    if (parsed !== this.value()) {
      this.value.set(parsed);
      this.change.emit(parsed);
    }
  }

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      this.resolveTyped();
    } else if (event.key === "ArrowDown" && event.altKey) {
      // The platform convention for "open the picker" from a field,
      // matching <input type="date"> in every major browser.
      event.preventDefault();
      this.openDialog();
    } else if (event.key === "Escape" && this.typed() !== null) {
      // Discard the pending edit and show the committed value again —
      // the same contract Escape has inside the dialog. Stops
      // propagating so a surrounding dialog does not also close on
      // what was, to the user, a text-editing keystroke. When no edit
      // is pending the key is left alone.
      event.preventDefault();
      event.stopPropagation();
      this.typed.set(null);
      this.invalid.set(false);
    }
  }

  // ---------------------------------------------------------------
  // Time selects
  // ---------------------------------------------------------------

  protected setHour(hour: number): void {
    this.pendingTime.set(formatIsoTime({ hour, minute: this.pendingMinute() }));
  }

  protected setMinute(minute: number): void {
    this.pendingTime.set(formatIsoTime({ hour: this.pendingHour(), minute }));
  }

  /** Cross between AM and PM without changing the minute of the hour. */
  protected setMeridiem(pm: boolean): void {
    this.setHour((this.pendingHour() % 12) + (pm ? 12 : 0));
  }

  // ---------------------------------------------------------------
  // Shortcuts
  // ---------------------------------------------------------------

  protected applyShortcut(shortcut: DateTimeShortcut): void {
    const base = todayIso();
    let target = shortcut.date ?? base;
    if (shortcut.days !== undefined) target = addDays(base, shortcut.days);
    else if (shortcut.months !== undefined) {
      target = addMonths(base, shortcut.months);
    }
    // A shortcut to a blocked date does nothing rather than landing
    // somewhere near it: "+4 weeks" that quietly means "+27 days" is a
    // booking error waiting to happen.
    if (this.dayDisabled(target)) return;

    this.pendingDate.set(target);
    this.cursor.set(target);
    const parsed = parseIsoDate(target);
    if (parsed) {
      this.viewYear.set(parsed.year);
      this.viewMonth.set(parsed.month);
    }
    this.shortcut.emit({ id: shortcut.id, isoDate: target });
    if (this.commitOnDay()) this.commit();
    else {
      // Render-then-focus: the shortcut may have paged to a month whose
      // cells do not exist until change detection has run. See `cdr`.
      this.cdr.detectChanges();
      this.focusCursor();
    }
  }

  // ---------------------------------------------------------------
  // Dismissal
  // ---------------------------------------------------------------

  protected onDocumentClick(event: Event): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (!target) return;
    // Anything outside the dialog closes it — including the component's
    // own text field. The dialog says aria-modal="true", and a modal
    // that stays open while the user edits the field behind it is
    // telling assistive technology one thing and doing another. The
    // trigger button is exempt because its own handler already toggles.
    if (
      this.dialogRef().nativeElement.contains(target) ||
      this.buttonRef().nativeElement.contains(target)
    ) {
      return;
    }
    this.closeDialog(false);
  }
}
